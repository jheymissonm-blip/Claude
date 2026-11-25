const fs = require('fs'); const path = require('path');
const { abrir, garantirSessao, ler, raiz } = require('./comum');

(async () => {
  const id = process.argv[2]; const enviar = process.argv.includes('--enviar');
  const cfg = ler(path.join(raiz, 'config', 'clientes.json'), null);
  const sel = ler(path.join(raiz, 'config', 'seletores.json'), null);
  const c = cfg && cfg.clientes.find(x => x.id === id);
  if (!c) throw new Error('Cliente não encontrado: ' + id);
  const p = sel.protocolar;
  if (/COLOCAR_/.test(JSON.stringify(p))) throw new Error('Preencha protocolar.* em seletores.json (use mapear.js).');

  const docs = fs.existsSync(c.pasta_docs) ? fs.readdirSync(c.pasta_docs).filter(f => /\.pdf$/i.test(f)) : [];
  if (!docs.length) throw new Error('Nenhum PDF em ' + c.pasta_docs);
  console.log('Checklist (conferir manualmente):', sel.checklist.join('; '));
  console.log('PDFs:', docs.join(', '));

  const ctx = await abrir();
  const page = ctx.pages()[0] || await ctx.newPage();
  await page.goto(p.url_novo, { waitUntil: 'networkidle' });
  await garantirSessao(page);
  for (const [seletor, chave] of Object.entries(p.campos)) await page.fill(seletor, String(c[chave] ?? ''));
  await page.setInputFiles(p.upload, docs.map(f => path.join(c.pasta_docs, f)));
  const out = path.join(raiz, 'saida', 'protocolos', id); fs.mkdirSync(out, { recursive: true });
  await page.screenshot({ path: path.join(out, 'pre-envio.png'), fullPage: true });
  if (!enviar) { console.log('Parado antes do envio. Confira', path.join(out, 'pre-envio.png'), 'e rode com --enviar.'); await new Promise(r => ctx.on('close', r)); return; }
  await page.click(p.botao_enviar);
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: path.join(out, 'comprovante.png'), fullPage: true });
  await page.pdf?.({ path: path.join(out, 'comprovante.pdf') }).catch(() => {});
  console.log('Enviado. Anote o número do protocolo em', out);
  await ctx.close();
})().catch(e => { console.error(e.message); process.exit(1); });
