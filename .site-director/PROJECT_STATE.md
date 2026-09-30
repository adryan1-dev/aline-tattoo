# Arte Que Olha — estado do projeto

CURRENT_PHASE: 08 Implementação (etapas 1 e 4 do plano em ~/.claude/plans/atue-como-diretor-de-wobbly-bubble.md)

## APPROVED_DECISIONS
- Stack: Astro 7 estático + TS + CSS próprio. Só PT-BR. Sem prova social.
- Direção: "acervo vivo de arte na pele". Paleta neutra sem acento; Hanken Grotesk + Newsreader (só bio/citação).
- Lema oficial (cliente): "Orgânico · Onírico · Onipresente" + "Tatuagens para quem vê além."
- Gato de terceiro olho: id fixo `gato-terceiro-olho`, 7/12 col desktop, primeiro no mobile, sem corte, contain.
- Contato: wa.me/5531994664504, sem simular envio.
- Coleta Apify: teto proposto US$ 0,50, 1 execução; SÓ com APIFY_TOKEN no ambiente e OK do cliente.

## BLOQUEIOS / PENDÊNCIAS
- APIFY_TOKEN ausente no ambiente → coleta não executada; portfólio só tem o gato até a curadoria.
- ffmpeg ausente e sem filmagem original → abertura com foto estática por ora.
- Aline: aprovar publicação, uso das fotos, WhatsApp, "retorno em até três dias", @arreda.galeriaestudio.
- Instagram diz "Onisciente"; site/cliente dizem "Onipresente" (usar Onipresente).

## PROGRESSO (29/09/2026)
FEITO: scaffold Astro 7.3.5; tokens/base/layout; textos (site.pt.ts); portfolio.json + loader (falha o build sem o destaque);
Header, Hero, WorkGrid + lightbox (<dialog>), Artist, Process, ProjectForm (wa.me, sem "enviado"), Faq (7 + 13), Closing, JSON-LD.
VERIFICADO: gato 7/12 col, ratio renderizado = nativo (1,0279), contain, sem transform; 360 px sem overflow; lightbox e formulário testados;
build limpo; grep de apify/cdninstagram/fbcdn/artequelha/lovable no dist = vazio.
DESVIOS DO PLANO: retrato P&B é a mídia da abertura; "A artista" ficou só texto + citação (sem repetir o retrato); foto de sessão no Processo.
FALTA: coleta Apify (precisa APIFY_TOKEN), folha de contato, curadoria (6–8 obras), og.jpg 1200x630 de foto real,
vídeo da abertura (sem filmagem/ffmpeg), qualidade AVIF a revisar em pontilhismo, medição Lighthouse, domínio/canonical/sitemap, deploy (só com aprovação).

## COLETA + CURADORIA (30/09/2026)
- Apify run 7DTvmeNq9I8SzZHI7 (via MCP, 1 execução, teto US$ 0,50, ~US$ 0,15): 58 itens; 54 fotos baixadas (posts de outros perfis/vídeos ignorados), 0 falhas.
  Cache em work/artequeolha-instagram (fora do Git). Folhas de contato: work/contato-{1,2,3}.jpg + contato-indice.json.
- Gato = post DXfJCmxkVqr (1440x1440, mesma foto do anexo, sem recorte) → usado como destaque com postUrl real.
- Portfólio (8): gato, figura clássica, olho e raios, espada e serpente, polvo e fechadura, dragão, coruja, maçã e Júpiter. Todos tatuagens reais; desenhos/flash/cards/retratos descartados.
- Layout: slots 6/7/8 ajustados para fotos em retrato; og.jpg 1200x630 gerado do gato real.
- Verificado: gato 7 col, ratio 1,000, contain; celular: gato primeiro, sem overflow; build limpo; dist sem strings proibidas.
PENDENTE: autorização da Aline p/ fotos (incl. pele de clientes e foto da sessão); vídeo da abertura; Lighthouse; domínio/canonical/sitemap; deploy.

## MOTION PREMIUM (29/09/2026)
- Deps novas: gsap 3.15 (ScrollTrigger + SplitText) e lenis 1.3. Tudo em src/scripts/motion.ts (substitui reveal.ts).
- Só roda com html.js-motion (sem reduced-motion); rede de segurança de 3 s no <head> revela tudo se o script não subir.
- Efeitos: rolagem com inércia (âncoras via Lenis, respeita scroll-padding), abertura com máscara na foto + h1 por linhas,
  h2 por linhas, obras em cortina (gato SÓ máscara, sem transform — verificado ratio 1,0000), foco nas obras + cursor "Ampliar" (só mouse),
  citação acende por palavra, linhas das etapas desenhadas, faixa do lema reage à velocidade, botões magnéticos com preenchimento em cortina,
  cabeçalho some/volta + barra de progresso, grão de filme, perguntas com altura animada (::details-content), lightbox com fade.
- JS de produção: ~144 KB sem gzip (antes ~10 KB). Medir no Lighthouse antes do deploy.

## AUDITORIA DE LAYOUT (29/09/2026)
- Achados: padding de seção 173+173 px (≈345 px de vazio entre seções); galeria com 8 obras em 2230 px (vãos de 133 px na horizontal,
  até ~290 px na vertical); no celular, uma obra por tela (4314 px); artista/perguntas/formulário ocupando 1/3 da largura com o resto vazio.
- Correções: --section-t/--section-b (112/96 px no desktop); galeria em 3 blocos (destaque + 2 fileiras de mesma altura, largura ∝ proporção
  nativa, gap 16 px, sem corte; convite do Instagram fecha a fileira B); celular em 2 colunas CSS com o gato inteiro em cima;
  sistema título à esquerda (1–5) / conteúdo à direita (7–12) em Artista, Processo e Perguntas; formulário centralizado e maior (56 px, até 840 px).
- Resultado: desktop 9539 → 8026 px; celular 10631 → 7690 px (galeria 4314 → 1699 px). Sem overflow; build limpo.
- Detector do Impeccable: 1 aviso falso (<img data-lb-img> do lightbox, src definido por JS).

## CORREÇÃO: seções em branco + alinhamento (29/09/2026)
- Bug: entradas (títulos, obras, foto do processo, blocos data-reveal) começavam escondidas e só apareciam ao cruzar o gatilho de rolagem.
  Recarregar a página no meio (F5 ou reload do Vite) deixava tudo que estava acima em branco. Corrigido com whenSeen() em motion.ts
  (toca também quando o elemento já ficou para trás; re-quebra de linha do SplitText não reescondе o título).
- Peso: grão agora estático e do tamanho da tela; cabeçalho sem backdrop-filter. Fps real NÃO medido (painel do navegador oculto).
- Padrão visual: coluna esquerda 1–5 (título) / direita 7–12 em Trabalhos, Artista, Processo e Perguntas; formulário centralizado (840 px).
  Medido a 1440 px: borda esquerda 72 px, coluna direita 725 px, borda direita 1353 px em todas as seções.
- window.__gsap existe só no dev server (não vai no build).
