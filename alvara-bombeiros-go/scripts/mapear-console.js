/*
 * mapear.js - mapeia a tela listarAndamentosWeb.jsf do SIAPI (CBMGO)
 * Uso: cole no console (F12) da página logada, ou use como bookmarklet / Tampermonkey.
 * Saída: objeto em window.__mapaSiapi, JSON copiado para a área de transferência
 * e arquivo siapi_mapa_<data>.json baixado.
 */
(async () => {
  const q = (s, r = document) => [...r.querySelectorAll(s)];
  const txt = (e) => (e?.innerText || e?.value || '').replace(/\s+/g, ' ').trim();
  const vis = (e) => !!(e.offsetWidth || e.offsetHeight || e.getClientRects().length);
  const rotulo = (e) =>
    txt(document.querySelector(`label[for="${e.id}"]`)) ||
    e.placeholder || e.title || e.getAttribute('aria-label') || '';
  const sel = (e) => (e.id ? `[id="${e.id}"]` : e.name ? `[name="${e.name}"]` : e.tagName.toLowerCase());

  const mapa = {
    geradoEm: new Date().toISOString(),
    url: location.href,
    titulo: document.title,
  };

  // Formulários e estado JSF
  mapa.formularios = q('form').map((f) => ({
    id: f.id, action: f.getAttribute('action'), method: f.method,
  }));
  mapa.jsf = {
    viewState: q('input[name="javax.faces.ViewState"]').length,
    camposOcultos: q('input[type=hidden]').map((e) => e.id || e.name).filter(Boolean),
  };

  // Campos de entrada (inclui widgets PrimeFaces)
  mapa.campos = q('input:not([type=hidden]),select,textarea').map((e) => ({
    seletor: sel(e), tag: e.tagName, tipo: e.type, id: e.id, name: e.name,
    rotulo: rotulo(e), valor: e.type === 'password' ? '' : e.value, visivel: vis(e),
    obrigatorio: e.required || e.getAttribute('aria-required') === 'true',
  }));
  mapa.widgetsPrimeFaces = q('[class*="ui-selectonemenu"],[class*="ui-calendar"],[class*="ui-autocomplete"],[class*="ui-selectcheckboxmenu"],[class*="ui-fileupload"]')
    .filter((e) => e.id)
    .map((e) => ({ id: e.id, classe: e.className.split(' ').find((c) => /^ui-(selectonemenu|calendar|autocomplete|selectcheckboxmenu|fileupload)/.test(c)), rotulo: txt(e).slice(0, 60) }));

  // Selects: opções
  mapa.selects = q('select').map((s) => ({
    id: s.id, opcoes: [...s.options].map((o) => ({ valor: o.value, texto: o.text.trim() })),
  }));

  // Botões e links de ação
  mapa.botoes = q('button,input[type=submit],input[type=button],a.ui-commandlink,a[onclick],a[href]').map((e) => ({
    seletor: sel(e), id: e.id, texto: txt(e).slice(0, 60), titulo: e.title || '',
    href: e.getAttribute('href') || '', visivel: vis(e),
    onclick: (e.getAttribute('onclick') || '').slice(0, 120),
  }));

  // Diálogos (PrimeFaces)
  mapa.dialogos = q('.ui-dialog').map((d) => ({
    id: d.id, titulo: txt(d.querySelector('.ui-dialog-title')), aberto: vis(d),
    campos: q('input:not([type=hidden]),select,textarea', d).map((e) => e.id),
    botoes: q('button,a.ui-commandlink', d).map((e) => ({ id: e.id, texto: txt(e) })),
  }));

  // Tabelas: cabeçalho + todas as linhas
  mapa.tabelas = q('table').filter((t) => q('th', t).length || t.rows.length > 1).map((t, i) => {
    const cab = q('th', t).map(txt);
    const linhas = q('tbody tr', t).map((tr) => ({
      celulas: [...tr.cells].map(txt),
      links: q('a[href],a[onclick],button', tr).map((a) => ({ id: a.id, texto: txt(a).slice(0, 40), href: a.getAttribute('href') || '' })),
    }));
    return { indice: i, id: t.id, classe: t.className, cabecalho: cab, totalLinhas: linhas.length, linhas };
  }).filter((t) => t.cabecalho.some(Boolean) || t.totalLinhas);

  // Datatables PrimeFaces e paginação
  mapa.datatables = q('.ui-datatable').map((d) => ({
    id: d.id,
    colunas: q('th', d).map(txt),
    paginador: txt(d.querySelector('.ui-paginator-current')),
    vazio: txt(d.querySelector('.ui-datatable-empty-message')),
  }));

  // Painéis/abas
  mapa.abas = q('.ui-tabs-nav li').map((l) => ({ texto: txt(l), id: l.id, ativa: l.classList.contains('ui-tabs-selected') || l.classList.contains('ui-state-active') }));
  mapa.paineis = q('.ui-panel,.ui-fieldset').map((p) => ({ id: p.id, titulo: txt(p.querySelector('.ui-panel-title,.ui-fieldset-legend')) }));

  // Pares rótulo/valor das áreas de dados (panelGrid)
  mapa.dadosProtocolo = q('.ui-panelgrid tr').map((tr) => [...tr.cells].map(txt)).filter((c) => c.some(Boolean));

  // Mensagens
  mapa.mensagens = q('.ui-messages,.ui-growl-item,.ui-message').map(txt).filter(Boolean);

  // Saída
  window.__mapaSiapi = mapa;
  const json = JSON.stringify(mapa, null, 2);
  try { await navigator.clipboard.writeText(json); } catch (_) {}
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([json], { type: 'application/json' }));
  a.download = `siapi_mapa_${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a); a.click(); a.remove();
  console.log('[mapear.js] concluído', mapa);
  return mapa;
})();
