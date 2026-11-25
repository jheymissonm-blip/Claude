const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const raiz = path.join(__dirname, '..');
const ORIGEM = 'https://siapi.bombeiros.go.gov.br';

function ler(p, padrao) {
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return padrao; }
}
function gravar(p, obj) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(obj, null, 2));
}

async function abrir({ headless = false } = {}) {
  const pfx = process.env.CERT_PFX_PATH;
  const passphrase = process.env.CERT_PFX_PASSPHRASE;
  if (!pfx || !passphrase) throw new Error('Defina CERT_PFX_PATH e CERT_PFX_PASSPHRASE no ambiente.');
  const origins = [ORIGEM, 'https://sso.acesso.gov.br', 'https://certificado.sso.acesso.gov.br'];
  return chromium.launchPersistentContext(path.join(raiz, '.perfil'), {
    headless,
    clientCertificates: origins.map(o => ({ origin: o, pfxPath: pfx, passphrase })),
    viewport: { width: 1400, height: 900 },
  });
}

// Login é sempre confirmado pelo usuário: se cair na tela de login/captcha,
// avisa e espera (até 10 min) ele concluir na janela aberta.
async function garantirSessao(page) {
  const precisaLogin = async () => {
    const url = page.url();
    const txt = (await page.content()).toLowerCase();
    return /acesso\.gov\.br|\/login/.test(url) || txt.includes('captcha');
  };
  if (!(await precisaLogin())) return;
  console.log('>>> Faça o login gov.br / resolva o captcha na janela. Aguardando...');
  const limite = Date.now() + 10 * 60 * 1000;
  while (await precisaLogin()) {
    if (Date.now() > limite) throw new Error('Login não concluído em 10 minutos.');
    await page.waitForTimeout(2000);
  }
  await page.waitForLoadState('networkidle');
}
module.exports = { abrir, garantirSessao, ler, gravar, raiz };
