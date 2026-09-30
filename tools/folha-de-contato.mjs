// Gera work/contato-N.jpg: grade numerada de miniaturas para curadoria visual.
import { readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';
const dir = 'work/artequeolha-instagram';
const { images } = JSON.parse(await readFile(`${dir}/manifest.json`, 'utf8'));
const T = 300, COLS = 6, PER = 24;
const idx = [];
for (let p = 0; p * PER < images.length; p++) {
  const chunk = images.slice(p * PER, (p + 1) * PER);
  const rows = Math.ceil(chunk.length / COLS);
  const comps = await Promise.all(chunk.map(async (im, i) => {
    const n = p * PER + i + 1;
    const buf = await sharp(`${dir}/${im.file}`).resize(T, T, { fit: 'contain', background: '#111' }).jpeg({ quality: 80 }).toBuffer();
    const label = Buffer.from(`<svg width="64" height="34"><rect width="64" height="34" fill="#000" opacity=".8"/><text x="8" y="25" font-size="24" fill="#fff" font-family="Arial">${n}</text></svg>`);
    const tile = await sharp(buf).composite([{ input: label, top: 0, left: 0 }]).toBuffer();
    return { input: tile, left: (i % COLS) * T, top: Math.floor(i / COLS) * T };
  }));
  await sharp({ create: { width: COLS * T, height: rows * T, channels: 3, background: '#111' } }).composite(comps).jpeg({ quality: 82 }).toFile(`work/contato-${p + 1}.jpg`);
  chunk.forEach((im, i) => idx.push({ n: p * PER + i + 1, shortCode: im.shortCode, file: im.file, w: im.width, h: im.height }));
}
await writeFile('work/contato-indice.json', JSON.stringify(idx, null, 1));
console.log(idx.length, 'miniaturas em', Math.ceil(idx.length / PER), 'folhas');
