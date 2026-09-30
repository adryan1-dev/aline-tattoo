// Camada de movimento: rolagem com inércia, entrada da abertura, títulos por linha,
// obras reveladas por máscara, citação lida na rolagem, faixa do lema e cursor nas obras.
// Só roda com .js-motion (há JS e o usuário não pediu movimento reduzido). Sem ela,
// o conteúdo já nasce visível e a página funciona igual, só que parada.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

const root = document.documentElement;

if (root.classList.contains('js-motion')) {
  root.classList.add('motion-ready');
  gsap.registerPlugin(ScrollTrigger, SplitText);
  if (import.meta.env.DEV) (window as unknown as { __gsap: typeof gsap }).__gsap = gsap; // só para testes no dev server

  const EASE = 'expo.out';
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

  // ---------- Rolagem com inércia ----------
  const lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9, autoRaf: false });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);

  // Âncoras internas passam pelo Lenis. O que outro script já tratou (resumo de erros) fica de fora.
  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey) return;
    const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
    if (!a || a.classList.contains('skip')) return;
    const id = a.getAttribute('href')!.slice(1);
    const target = id ? document.getElementById(id) : null;
    if (!target) return;
    e.preventDefault();
    a.closest('details.menu')?.removeAttribute('open');
    // O Lenis já desconta o scroll-padding-top do html (cabeçalho + 16px).
    lenis.scrollTo(id === 'topo' ? 0 : target, { duration: 1.4 });
    history.pushState(null, '', `#${id}`);
  });

  // Lightbox aberto: a página de trás não rola.
  const dialog = document.querySelector<HTMLDialogElement>('[data-lightbox]');
  if (dialog) {
    new MutationObserver(() => (dialog.open ? lenis.stop() : lenis.start())).observe(dialog, {
      attributes: true,
      attributeFilter: ['open'],
    });
  }

  // Perguntas abrem com transição de altura: recalcula os gatilhos quando assentam.
  let refreshT = 0;
  document.addEventListener(
    'toggle',
    () => {
      clearTimeout(refreshT);
      refreshT = window.setTimeout(() => ScrollTrigger.refresh(), 600);
    },
    true,
  );

  // ---------- Cabeçalho: some ao descer, volta ao subir; barra de progresso ----------
  const header = document.querySelector<HTMLElement>('.header');
  const menu = document.querySelector<HTMLDetailsElement>('details.menu');
  if (header) {
    let hidden = false;
    lenis.on('scroll', ({ scroll, direction }: Lenis) => {
      const hide = scroll > window.innerHeight * 0.6 && direction === 1 && !menu?.open;
      if (hide !== hidden) {
        hidden = hide;
        header.classList.toggle('is-hidden', hide);
      }
      header.classList.toggle('is-scrolled', scroll > 8);
    });
    const bar = header.querySelector('.header__progress');
    if (bar) {
      gsap.to(bar, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { start: 0, end: 'max', scrub: 0.3 },
      });
    }
  }

  // ---------- Abertura ----------
  const intro = () => {
    const hero = document.querySelector<HTMLElement>('.hero');
    if (!hero) return;
    const h1 = hero.querySelector('h1');
    const mask = hero.querySelector<HTMLElement>('.hero__media picture');
    const img = mask?.querySelector('img');
    const tl = gsap.timeline({ defaults: { ease: EASE } });

    if (mask && img) {
      tl.fromTo(
        mask,
        { clipPath: 'inset(100% 0% 0% 0%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.6, ease: 'expo.inOut' },
        0,
      ).fromTo(img, { scale: 1.35 }, { scale: 1.12, duration: 2.2, ease: 'expo.out' }, 0.1);
    }
    if (h1) {
      const split = SplitText.create(h1, { type: 'lines', mask: 'lines', linesClass: 'line' });
      tl.from(split.lines, { yPercent: 110, duration: 1.3, stagger: 0.09 }, 0.35);
    }
    tl.from(
      hero.querySelectorAll('.hero__by, .hero__lema span, .hero__sub, .hero__actions > *'),
      { y: 18, autoAlpha: 0, duration: 1.1, stagger: 0.07 },
      0.6,
    );
    // clearProps: o GSAP deixa translate:none inline, o que anularia o .is-hidden do cabeçalho.
    if (header) tl.from(header, { yPercent: -100, autoAlpha: 0, duration: 1, clearProps: 'all' }, 0.2);
    document.querySelectorAll('[data-intro]').forEach((el) => el.removeAttribute('data-intro'));

    // Saída: o texto sobe um pouco mais rápido que a foto (profundidade discreta).
    const text = hero.querySelector('.hero__text');
    const scrollOut = { trigger: hero, start: 'top top', end: 'bottom top', scrub: true };
    if (text) gsap.to(text, { yPercent: -18, autoAlpha: 0.15, ease: 'none', scrollTrigger: scrollOut });
    if (img) gsap.to(img, { yPercent: 7, ease: 'none', scrollTrigger: scrollOut });
  };

  // Espera as fontes (a quebra de linha depende delas), mas sem travar a página.
  Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1200))]).then(() => {
    intro();
    headings();
    ScrollTrigger.refresh();
  });

  // Toca a entrada uma vez quando o elemento chega à tela, e também se ele já ficou para trás
  // (recarga no meio da página, âncora que pulou a seção, imagem que empurrou o layout).
  // Sem isso, o estado inicial escondido nunca é desfeito e a seção fica em branco.
  function whenSeen(el: Element, start: string, run: () => void) {
    let done = false;
    const go = () => {
      if (done) return;
      done = true;
      run();
    };
    return ScrollTrigger.create({
      trigger: el,
      start,
      once: true,
      onEnter: go,
      onRefresh: (self) => {
        if (self.scroll() > self.start) go();
      },
    });
  }

  // ---------- Títulos: linhas sobem por trás de uma máscara ----------
  function headings() {
    document.querySelectorAll<HTMLElement>('main h2').forEach((h) => {
      let played = false;
      let trigger: ScrollTrigger | undefined;
      SplitText.create(h, {
        type: 'lines',
        mask: 'lines',
        linesClass: 'line',
        autoSplit: true,
        onSplit: (self) => {
          trigger?.kill();
          // Nova quebra de linha depois de o título já ter aparecido: fica visível, sem repetir.
          if (played) return;
          const tl = gsap.from(self.lines, { yPercent: 110, duration: 1.2, stagger: 0.08, ease: EASE, paused: true });
          trigger = whenSeen(h, 'top 88%', () => {
            played = true;
            tl.play();
          });
          return tl;
        },
      });
    });
  }

  // ---------- Entradas genéricas ----------
  const reveals = gsap.utils.toArray<HTMLElement>('[data-reveal]');
  gsap.set(reveals, { autoAlpha: 0, y: 36 });
  let queue: HTMLElement[] = [];
  let flushT = 0;
  reveals.forEach((el) =>
    whenSeen(el, 'top 90%', () => {
      queue.push(el);
      clearTimeout(flushT);
      flushT = window.setTimeout(() => {
        const batch = queue;
        queue = [];
        gsap.to(batch, { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.1, ease: EASE });
      }, 30);
    }),
  );

  // ---------- Obras: cortina de baixo para cima ----------
  // A peça principal (gato) nunca recebe transform: só a máscara, para manter proporção e enquadramento.
  document.querySelectorAll<HTMLElement>('.work-item').forEach((item) => {
    const media = item.querySelector('.work-item__media');
    const pic = item.querySelector('picture');
    const cap = item.querySelector('figcaption');
    const tl = gsap.timeline({ paused: true, defaults: { ease: 'expo.inOut' } });
    tl.fromTo(media, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4 });
    if (pic && item.dataset.slot !== '1') {
      tl.fromTo(pic, { scale: 1.18 }, { scale: 1, duration: 1.8, ease: EASE, clearProps: 'transform' }, 0);
    }
    if (cap) tl.from(cap, { y: 12, autoAlpha: 0, duration: 0.9, ease: EASE }, 0.7);
    whenSeen(item, 'top 88%', () => tl.play());
  });

  // ---------- Processo: foto por máscara e linhas das etapas desenhadas ----------
  const photo = document.querySelector('.process__photo');
  if (photo) {
    const t = gsap.fromTo(
      photo,
      { clipPath: 'inset(0% 0% 100% 0%)' },
      { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'expo.inOut', paused: true },
    );
    whenSeen(photo, 'top 85%', () => t.play());
  }
  gsap.utils.toArray<HTMLElement>('.step, .faq__list > .qa').forEach((row) => {
    const t = gsap.fromTo(row, { '--line': 0 }, { '--line': 1, duration: 1.4, ease: 'expo.inOut', paused: true });
    whenSeen(row, 'top 92%', () => t.play());
  });

  // ---------- Citação: palavras acendem conforme a leitura ----------
  const quote = document.querySelector<HTMLElement>('.artist__quote');
  if (quote) {
    SplitText.create(quote, {
      type: 'words',
      autoSplit: true,
      onSplit: (self) =>
        gsap.fromTo(
          self.words,
          { opacity: 0.14 },
          {
            opacity: 1,
            stagger: 0.08,
            ease: 'none',
            scrollTrigger: { trigger: quote, start: 'top 82%', end: 'bottom 50%', scrub: 0.6 },
          },
        ),
    });
  }

  // ---------- Faixa do lema: velocidade responde à rolagem ----------
  document.querySelectorAll<HTMLElement>('[data-marquee]').forEach((band) => {
    const track = band.querySelector<HTMLElement>('.marquee__track');
    if (!track) return;
    const loop = gsap.to(track, { xPercent: -50, duration: 38, ease: 'none', repeat: -1 });
    let boost = 1;
    lenis.on('scroll', ({ velocity }: Lenis) => {
      boost = 1 + Math.min(Math.abs(velocity) * 0.35, 6);
      loop.timeScale(velocity < 0 ? -boost : boost);
    });
    gsap.ticker.add(() => {
      // Volta suave à velocidade base quando a rolagem para.
      const ts = loop.timeScale();
      const base = ts < 0 ? -1 : 1;
      loop.timeScale(ts + (base - ts) * 0.06);
    });
    ScrollTrigger.create({
      trigger: band,
      start: 'top bottom',
      end: 'bottom top',
      onToggle: (self) => (self.isActive ? loop.play() : loop.pause()),
    });
  });

  // ---------- Só em mouse: botões magnéticos e cursor nas obras ----------
  if (fine) {
    document.querySelectorAll<HTMLElement>('.btn').forEach((btn) => {
      const x = gsap.quickTo(btn, 'x', { duration: 0.5, ease: 'power3.out' });
      const y = gsap.quickTo(btn, 'y', { duration: 0.5, ease: 'power3.out' });
      btn.addEventListener('pointermove', (e) => {
        const r = btn.getBoundingClientRect();
        x((e.clientX - r.left - r.width / 2) * 0.22);
        y((e.clientY - r.top - r.height / 2) * 0.35);
      });
      btn.addEventListener('pointerleave', () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.45)' });
      });
    });

    const grid = document.querySelector<HTMLElement>('[data-lightbox-root]');
    if (grid) {
      const cursor = document.createElement('div');
      cursor.className = 'cursor';
      cursor.setAttribute('aria-hidden', 'true');
      cursor.innerHTML = '<span>Ampliar</span>';
      document.body.append(cursor);
      gsap.set(cursor, { xPercent: -50, yPercent: -50, scale: 0 });
      const cx = gsap.quickTo(cursor, 'x', { duration: 0.45, ease: 'power3.out' });
      const cy = gsap.quickTo(cursor, 'y', { duration: 0.45, ease: 'power3.out' });
      window.addEventListener('pointermove', (e) => {
        cx(e.clientX);
        cy(e.clientY);
      });
      grid.querySelectorAll('.work-item__media').forEach((m) => {
        m.addEventListener('pointerenter', () => gsap.to(cursor, { scale: 1, duration: 0.5, ease: 'expo.out' }));
        m.addEventListener('pointerleave', () => gsap.to(cursor, { scale: 0, duration: 0.4, ease: 'expo.out' }));
      });
      dialog?.addEventListener('close', () => gsap.set(cursor, { scale: 0 }));
      grid.addEventListener('click', () => gsap.set(cursor, { scale: 0 }));
    }
  }
}
