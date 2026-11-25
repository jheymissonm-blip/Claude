const path = require('path');
const { abrir, garantirSessao, ler, gravar, raiz } = require('./comum');
const crypto = require('crypto');

const confirmar = process.argv.includes('--confirmar');
const pendente = path.join(raiz, 'saida', 'estado-pendente.json');

(async () => {
  if (confirmar) { // grava o estado só depois do e-mail enviado
    const p = ler(pendente, {});
    for (const [proto, linhas] of Object.entries(p)) gravar(path.join(raiz, 'estado', `${proto}.json`), linhas);
    console.log('Estado gravado:', Object.keys(p).length, 'protocolos');
    return;
  }
  const cfg = ler(path.join(raiz, 'config', 'clientes.json'), null);
  const sel = ler(path.join(raiz, 'config', 'seletores.json'), null);
  if (!cfg || !sel) throw new Error('Falta config/clientes.json ou seletores.json');
  const s = sel.andamentos;
  const ctx = await abrir({ headless: process.argv.includes('--headless') });
  const page = ctx.pages()[0] || await ctx.newPage();
  const novidades = []; const pend = {};
  try {
    for (const c of cfg.clientes) for (const proto of c.protocolos || []) {
      await page.goto(sel.url_andamentos, { waitUntil: 'networkidle' });
      await garantirSessao(page);
      await page.fill(s.campo_protocolo, proto);
      await page.click(s.botao_pesquisar);
      await page.waitForLoadState('networkidle');
      const linhas = await page.$$eval(s.linhas, trs =>
        trs.map(tr => [...tr.querySelectorAll('td')].map(td => td.innerText.trim().replace(/\s+/g, ' ')).join(' | ')).filter(Boolean));
      const hash = l => crypto.createHash('sha1').update(l).digest('hex');
      const antes = new Set((ler(path.join(raiz, 'estado', `${proto}.json`), [])).map(hash));
      const novas = linhas.filter(l => !antes.has(hash(l)));
      pend[proto] = linhas;
      if (novas.length) novidades.push({ cliente: c.nome, id: c.id, protocolo: proto, novas });
      console.log(proto, c.nome, '->', linhas.length, 'andamentos,', novas.length, 'novos');
    }
  } finally { await ctx.close(); }
  gravar(path.join(raiz, 'saida', 'novidades.json'), novidades);
  gravar(pendente, pend);
  console.log(novidades.length ? `${novidades.length} protocolos com novidade (saida/novidades.json)` : 'Sem novidades');
})().catch(e => { console.error(e.message); process.exit(1); });
