// Lightbox sobre <dialog> modal: o resto da página fica inerte, Escape fecha
// e o foco volta para a obra de origem. Sem JS, cada obra é um link para a imagem.
const dialog = document.querySelector<HTMLDialogElement>('[data-lightbox]');
const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-work]'));

if (dialog && links.length && typeof dialog.showModal === 'function') {
  const img = dialog.querySelector<HTMLImageElement>('[data-lb-img]')!;
  const cap = dialog.querySelector<HTMLElement>('[data-lb-cap]')!;
  const count = dialog.querySelector<HTMLElement>('[data-lb-count]')!;
  const prev = dialog.querySelector<HTMLButtonElement>('[data-lb-prev]')!;
  const next = dialog.querySelector<HTMLButtonElement>('[data-lb-next]')!;
  const close = dialog.querySelector<HTMLButtonElement>('[data-lb-close]')!;
  const total = links.length;
  let current = 0;
  let origin: HTMLElement | null = null;

  const preload = (i: number) => {
    const l = links[(i + total) % total];
    if (l?.dataset.full) new Image().src = l.dataset.full;
  };

  const show = (i: number) => {
    current = (i + total) % total;
    const l = links[current];
    img.classList.add('is-loading');
    img.onload = () => img.classList.remove('is-loading');
    img.alt = l.dataset.alt ?? '';
    img.src = l.dataset.full ?? l.href;
    cap.textContent = l.dataset.caption ?? '';
    count.textContent = `${current + 1} / ${total}`;
    prev.hidden = next.hidden = total < 2;
    preload(current + 1);
    preload(current - 1);
  };

  links.forEach((l, i) => {
    l.addEventListener('click', (e) => {
      e.preventDefault();
      origin = l;
      show(i);
      dialog.showModal();
      close.focus();
    });
  });

  const closeDialog = () => dialog.close();
  dialog.addEventListener('close', () => origin?.focus());
  close.addEventListener('click', closeDialog);
  prev.addEventListener('click', () => show(current - 1));
  next.addEventListener('click', () => show(current + 1));

  dialog.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); show(current - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); show(current + 1); }
  });

  // Clique fora da imagem fecha; deslizar navega.
  dialog.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    if (t === dialog || t.classList.contains('lb__view') || t.classList.contains('lb__stage')) closeDialog();
  });
  let x0: number | null = null;
  dialog.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  dialog.addEventListener('touchend', (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    x0 = null;
    if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
  });
}
