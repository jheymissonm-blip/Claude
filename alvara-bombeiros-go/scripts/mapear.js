const { abrir, raiz } = require('./comum');
const fs = require('fs'); const path = require('path');
(async () => {
  const url = process.argv[2];
  if (!url) throw new Error('uso: node mapear.js <url>');
  const ctx = await abrir();
  const page = ctx.pages()[0] || await ctx.newPage();
  await page.goto(url);
  const dir = path.join(raiz, 'saida', 'mapa'); fs.mkdirSync(dir, { recursive: true });
  const n = Date.now();
  console.log('Navegue até a tela desejada e tecle ENTER aqui para salvar. Ctrl+C encerra.');
  process.stdin.on('data', async () => {
    fs.writeFileSync(path.join(dir, `${n}.html`), await page.content());
    await page.screenshot({ path: path.join(dir, `${n}.png`), fullPage: true });
    const campos = await page.$$eval('input,select,textarea,button,a.ui-commandlink', els =>
      els.map(e => ({ tag: e.tagName, id: e.id, name: e.name, tipo: e.type, texto: (e.innerText || e.value || '').slice(0, 40) })));
    fs.writeFileSync(path.join(dir, `${n}-campos.json`), JSON.stringify(campos, null, 2));
    console.log('salvo em', dir);
  });
})();
