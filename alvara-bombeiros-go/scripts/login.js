const { abrir } = require('./comum');
(async () => {
  const ctx = await abrir();
  const page = ctx.pages()[0] || await ctx.newPage();
  await page.goto('https://siapi.bombeiros.go.gov.br/');
  console.log('Conclua o login gov.br (certificado) na janela. Feche a janela quando estiver logado.');
  await new Promise(r => ctx.on('close', r));
})();
