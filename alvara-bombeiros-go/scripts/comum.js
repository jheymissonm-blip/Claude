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

// Detecta tela de login/captcha para parar em vez de insistir.
async function garantirSessao(page) {
  const url = page.url();
  const txt = (await page.content()).toLowerCase();
  if (/acesso\.gov\.br|login/.test(url) || txt.includes('captcha')) {
    throw new Error('Sessão expirada ou captcha. Rode login.js ou resolva na janela e tente de novo.');
  }
}
module.exports = { abrir, garantirSessao, ler, gravar, raiz };
