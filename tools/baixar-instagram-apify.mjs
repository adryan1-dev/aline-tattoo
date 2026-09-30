/** Node.js 20+; sem dependencias. Execute fora do frontend.
 * APIFY_TOKEN deve existir no ambiente; nunca o coloque no codigo ou no Git.
 * Exemplo: node baixar-instagram-apify.mjs --budget=1 --limit=48
 * Repetir o comando reutiliza o cache/run; para nova coleta use outro --out.
 * Docs: https://apify.com/apify/instagram-scraper
 * https://docs.apify.com/api/v2/actors-runs-post
 */
import { mkdir, readFile, writeFile, rename, access } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const API = 'https://api.apify.com/v2';
const PROFILE = 'https://www.instagram.com/artequeolha/';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const hash = value => createHash('sha256').update(value).digest('hex');
async function exists(path) { try { await access(path); return true; } catch { return false; } }
async function save(path, value) {
  await writeFile(path + '.tmp', JSON.stringify(value, null, 2), 'utf8');
  await rename(path + '.tmp', path);
}
async function read(path) { return JSON.parse(await readFile(path, 'utf8')); }

async function api(path, body) {
  const token = process.env.APIFY_TOKEN;
  if (!token) throw new Error('Configure APIFY_TOKEN no ambiente, fora do frontend.');
  // POST nao e repetido: um timeout pode ter iniciado uma execucao cobrada.
  const attempts = body ? 1 : 3;
  for (let i = 0; i < attempts; i++) {
    try {
      const response = await fetch(API + path, {
        method: body ? 'POST' : 'GET', redirect: 'error',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined,
        signal: AbortSignal.timeout(60000),
      });
      if (!response.ok) {
        if (i + 1 < attempts && (response.status === 429 || response.status >= 500)) {
          await sleep(2000 * (i + 1)); continue;
        }
        throw new Error(`Apify HTTP ${response.status}; confira a execucao no console.`);
      }
      return await response.json();
    } catch (error) {
      if (i + 1 === attempts || error.message.startsWith('Apify HTTP')) throw error;
      await sleep(2000 * (i + 1));
    }
  }
}

export function photoCandidates(post) {
  if (!post || post.error || post.type === 'Video') return [];
  const children = Array.isArray(post.childPosts) ? post.childPosts : [];
  const nodes = children.length ? children : [post];
  return nodes.flatMap((node, index) => {
    if (node.type === 'Video') return [];
    const alternatives = Array.isArray(node.images) ? node.images.filter(u => typeof u === 'string') : [];
    const urls = !children.length && post.type === 'Sidecar' && alternatives.length ? alternatives :
      node.displayUrl ? [node.displayUrl] : alternatives;
    return urls.map((url, imageIndex) => ({
      url, slide: index + 1, imageIndex,
      postUrl: post.url || null, shortCode: post.shortCode || null,
      ownerUsername: post.ownerUsername || null, caption: post.caption || '',
      timestamp: post.timestamp || null, type: node.type || post.type || null,
      width: node.dimensionsWidth || null, height: node.dimensionsHeight || null,
    }));
  });
}

async function download(url) {
  const parsed = new URL(url);
  if (parsed.protocol !== 'https:') throw new Error('URL de imagem sem HTTPS.');
  const allowed = ['cdninstagram.com', 'fbcdn.net', 'instagram.com'];
  if (!allowed.some(h => parsed.hostname === h || parsed.hostname.endsWith('.' + h))) {
    throw new Error('Host de imagem inesperado; revisar manualmente.');
  }
  const types = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/avif': 'avif' };
  for (let i = 0; i < 3; i++) {
    try {
      // Nenhuma credencial Apify e enviada ao CDN do Instagram.
      const response = await fetch(url, { redirect: 'error', signal: AbortSignal.timeout(45000) });
      if (!response.ok) throw new Error(`Imagem HTTP ${response.status}`);
      const ext = types[(response.headers.get('content-type') || '').split(';')[0].trim()];
      if (!ext) throw new Error('Resposta nao e uma imagem suportada.');
      const chunks = []; let length = 0;
      for await (const chunk of response.body) {
        length += chunk.length;
        if (length > 25 * 1024 * 1024) throw new Error('Imagem excede 25 MB.');
        chunks.push(chunk);
      }
      if (!length) throw new Error('Imagem vazia.');
      return { bytes: Buffer.concat(chunks), ext };
    } catch (error) {
      if (i === 2) throw error;
      await sleep(1000 * (i + 1));
    }
  }
}

export async function main(argv = process.argv.slice(2)) {
  const args = Object.fromEntries(argv.map(arg => {
    const match = /^--(out|limit|budget|run|dataset)=(.+)$/.exec(arg);
    if (!match) throw new Error('Use --out=PASTA --limit=48 --budget=VALOR [--run=ID ou --dataset=ID].');
    return [match[1], match[2]];
  }));
  const out = resolve(args.out || 'work/artequeolha-instagram');
  const limit = Number(args.limit || 48);
  if (!Number.isInteger(limit) || limit < 1 || limit > 200) throw new Error('limit deve estar entre 1 e 200.');
  for (const key of ['run', 'dataset']) {
    if (args[key] && !/^[A-Za-z0-9]+$/.test(args[key])) throw new Error(`ID ${key} invalido.`);
  }
  if (args.run && args.dataset) throw new Error('Escolha --run ou --dataset.');
  await mkdir(join(out, 'images'), { recursive: true });
  const cache = join(out, 'posts.json');
  const stateFile = join(out, 'run.json');
  let posts;
  if (await exists(cache)) {
    if (args.run || args.dataset) throw new Error('Esta pasta ja tem cache; use outro --out para o ID indicado.');
    posts = await read(cache);
  } else {
    let datasetId = args.dataset;
    if (!datasetId) {
      let run;
      if (args.run) run = (await api(`/actor-runs/${args.run}`)).data;
      else if (await exists(stateFile)) {
        run = await read(stateFile);
        if (!run.id) throw new Error('Inicio anterior sem ID confirmado. Confira o console Apify e retome com --run=ID. Nao inicie outra coleta automaticamente.');
        run = (await api(`/actor-runs/${run.id}`)).data;
      } else {
        const budget = Number(args.budget);
        if (!Number.isFinite(budget) || budget <= 0) throw new Error('Para iniciar coleta, informe --budget=USD com o teto de custo escolhido.');
        await save(stateFile, { status: 'START_REQUESTED', profile: PROFILE });
        run = (await api(`/actors/apify~instagram-scraper/runs?timeout=600&maxTotalChargeUsd=${budget}`, {
          directUrls: [PROFILE], resultsType: 'posts', resultsLimit: limit,
        })).data;
      }
      await save(stateFile, run);
      console.log(`Execucao Apify: ${run.id}; retomada disponivel em ${stateFile}`);
      const deadline = Date.now() + 15 * 60 * 1000;
      const active = new Set(['READY', 'RUNNING', 'TIMING-OUT', 'ABORTING']);
      while (active.has(run.status) && Date.now() < deadline) {
        await sleep(5000);
        run = (await api(`/actor-runs/${run.id}`)).data;
        await save(stateFile, run);
      }
      if (run.status !== 'SUCCEEDED') throw new Error(`Execucao ${run.status}. Confira o console; nao crie outra automaticamente.`);
      datasetId = run.defaultDatasetId;
    }
    if (!datasetId) throw new Error('Apify nao retornou dataset.');
    posts = [];
    for (let offset = 0; ; offset += 100) {
      // Sem clean=true: itens omitidos poderiam quebrar a paginacao por tamanho.
      const batch = await api(`/datasets/${datasetId}/items?format=json&offset=${offset}&limit=100`);
      if (!Array.isArray(batch)) throw new Error('Formato inesperado de dataset.');
      posts.push(...batch);
      if (batch.length < 100) break;
    }
    await save(cache, posts);
  }
  if (!Array.isArray(posts) || !posts.length) throw new Error('Dataset vazio ou invalido.');
  const manifestFile = join(out, 'manifest.json');
  const previous = await exists(manifestFile) ? await read(manifestFile) : { images: [] };
  const prior = new Map(previous.images.map(p => [p.sourceKey, p]));
  const images = [], failures = [], seen = new Set();
  for (const post of posts) {
    if (post.error) failures.push({ postUrl: post.url || post.inputUrl || null, reason: 'Actor retornou erro para este item.' });
    for (const candidate of photoCandidates(post)) {
      // Query assinada pode mudar; identidade do arquivo no CDN permanece.
      let sourceKey;
      try { const u = new URL(candidate.url); sourceKey = hash(u.origin + u.pathname); }
      catch { failures.push({ postUrl: candidate.postUrl, reason: 'URL invalida.' }); continue; }
      if (seen.has(sourceKey)) continue;
      seen.add(sourceKey);
      try {
        const old = prior.get(sourceKey);
        if (old && /^images\/[a-f0-9]{64}\.(jpg|png|webp|avif)$/.test(old.file) && await exists(join(out, old.file))) {
          images.push(old); continue;
        }
        const { bytes, ext } = await download(candidate.url);
        const digest = hash(bytes);
        const file = `images/${digest}.${ext}`;
        if (!(await exists(join(out, file)))) await writeFile(join(out, file), bytes);
        const { url, ...metadata } = candidate;
        images.push({ ...metadata, sourceKey, sha256: digest, file, bytes: bytes.length, selected: false });
      } catch (error) {
        failures.push({ postUrl: candidate.postUrl, slide: candidate.slide, reason: error.message });
      }
      await save(manifestFile, { profile: PROFILE, images, failures });
    }
  }
  await save(manifestFile, { profile: PROFILE, images, failures });
  console.log(`${images.length} registros; ${new Set(images.map(p => p.file)).size} imagens unicas; ${failures.length} falhas. Saida: ${out}`);
  if (failures.length || !images.length) process.exitCode = 1;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(error => {
    // Nao imprimir headers, token, respostas brutas ou URLs assinadas.
    console.error(error.name === 'Error' ? error.message : 'Falha de rede ou arquivo; confira o cache e o console Apify.');
    process.exitCode = 1;
  });
}
