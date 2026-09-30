// Formulário curto que monta uma mensagem e abre o WhatsApp. Não há backend:
// a página NUNCA diz que algo foi enviado, só que a conversa foi aberta.
const form = document.querySelector<HTMLFormElement>('#project-form');

if (form) {
  const wa = form.dataset.wa!;
  const igUser = form.dataset.ig!;
  const errText = JSON.parse(form.dataset.errors ?? '{}') as Record<string, string>;
  const statusText = JSON.parse(form.dataset.status ?? '{}') as Record<string, string>;
  const KEY = 'aqo-draft';

  const summary = form.querySelector<HTMLElement>('[data-summary]')!;
  const summaryList = form.querySelector<HTMLElement>('[data-summary-list]')!;
  const box = form.querySelector<HTMLElement>('[data-status-box]')!;
  const boxText = form.querySelector<HTMLElement>('[data-status-text]')!;
  const msgEl = form.querySelector<HTMLElement>('[data-msg]')!;
  const reopen = form.querySelector<HTMLAnchorElement>('[data-reopen]')!;
  const copyBtn = form.querySelector<HTMLButtonElement>('[data-copy]')!;
  const igLink = form.querySelector<HTMLAnchorElement>('[data-ig-link]')!;

  const val = (name: string) => {
    const el = form.elements.namedItem(name);
    if (el instanceof RadioNodeList) return (el.value ?? '').trim();
    return (el as HTMLInputElement | null)?.value.trim() ?? '';
  };

  // Rascunho em sessionStorage (pode falhar em janela privada: tudo com try/catch).
  const saveDraft = () => {
    try {
      const data: Record<string, string> = {};
      new FormData(form).forEach((v, k) => { data[k] = String(v); });
      sessionStorage.setItem(KEY, JSON.stringify(data));
    } catch { /* sem rascunho */ }
  };
  try {
    const raw = sessionStorage.getItem(KEY);
    if (raw) {
      const data = JSON.parse(raw) as Record<string, string>;
      for (const [k, v] of Object.entries(data)) {
        const els = form.querySelectorAll<HTMLInputElement>(`[name="${k}"]`);
        els.forEach((el) => {
          if (el.type === 'radio') el.checked = el.value === v;
          else el.value = v;
        });
      }
    }
  } catch { /* ignora */ }
  form.addEventListener('input', saveDraft);
  form.addEventListener('change', saveDraft);

  const rules: { name: string; field: string; err: string; ok: () => boolean }[] = [
    { name: 'idea', field: 'f-idea', err: errText.idea, ok: () => val('idea').length >= 3 },
    { name: 'body', field: 'f-body', err: errText.body, ok: () => val('body').length >= 2 },
    { name: 'size', field: 'f-size', err: errText.size, ok: () => val('size') !== '' },
    { name: 'name', field: 'f-name', err: errText.name, ok: () => val('name').length >= 2 },
  ];

  const setError = (r: (typeof rules)[number], invalid: boolean) => {
    const e = form.querySelector<HTMLElement>(`#${r.field}-e`)!;
    const input = form.querySelector<HTMLElement>(`#${r.field}`);
    e.hidden = !invalid;
    e.textContent = invalid ? r.err : '';
    if (input && r.name !== 'size') input.setAttribute('aria-invalid', String(invalid));
  };

  const buildMessage = () => {
    const lines = [
      'Olá, Aline! Vim pelo site Arte Que Olha e quero iniciar um projeto.',
      '',
      `Nome: ${val('name')}`,
      `Ideia: ${val('idea')}`,
      `Região do corpo: ${val('body')}`,
      `Tamanho aproximado: ${val('size')}`,
    ];
    const extra: [string, string][] = [
      ['Quando', val('timing')],
      ['Cidade', val('city')],
      ['Investimento', val('budget')],
      ['Inseguranças', val('concerns')],
      ['Instagram', val('instagram')],
    ];
    for (const [k, v] of extra) if (v) lines.push(`${k}: ${v}`);
    return lines.join('\n');
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const bad = rules.filter((r) => !r.ok());
    rules.forEach((r) => setError(r, bad.includes(r)));
    summary.hidden = bad.length === 0;
    if (bad.length) {
      summaryList.innerHTML = '';
      for (const r of bad) {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = `#${r.name === 'size' ? 'f-size-h' : r.field}`;
        a.textContent = r.err;
        a.addEventListener('click', (ev) => {
          ev.preventDefault();
          const target = r.name === 'size'
            ? form.querySelector<HTMLElement>('input[name="size"]')
            : form.querySelector<HTMLElement>(`#${r.field}`);
          target?.focus();
        });
        li.append(a);
        summaryList.append(li);
      }
      summary.focus();
      return;
    }

    const message = buildMessage();
    const url = `https://wa.me/${wa}?text=${encodeURIComponent(message)}`;
    reopen.href = url;
    igLink.href = `https://ig.me/m/${igUser}`;
    msgEl.textContent = message;
    boxText.textContent = statusText.opened;
    box.hidden = false;
    // Aberto dentro do clique do usuário para não ser bloqueado como pop-up.
    const win = window.open(url, '_blank', 'noopener,noreferrer');
    if (!win) boxText.textContent = `${statusText.blocked}`;
    box.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  });

  copyBtn.addEventListener('click', async () => {
    const text = msgEl.textContent ?? '';
    try {
      await navigator.clipboard.writeText(text);
      boxText.textContent = statusText.copied;
    } catch {
      boxText.textContent = statusText.copyFail;
      const range = document.createRange();
      range.selectNodeContents(msgEl);
      const sel = getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  });
}
