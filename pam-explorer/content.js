// Detecta caminhos do tipo "EMPRESA - 147/ARQUIVO DIGITAL/..." e adiciona botão para abrir no Explorer.
const MARCADOR = /ARQUIVO DIGITAL/i;
let base = "//SERVIDOR/Monetize/CLIENTES";

chrome.storage.sync.get({ base: "//SERVIDOR/Monetize/CLIENTES" }, (c) => { base = c.base; varrer(document.body); });
chrome.storage.onChanged.addListener((ch) => { if (ch.base) base = ch.base.newValue || ""; });

function limparCaminho(txt) {
  let t = txt.trim();
  // remove rótulo antes de ":" (ex.: "Pasta: ..."), se não houver "/" antes dele
  const m = t.match(/^([^\/\\]*?):\s+(.*)$/s);
  if (m) t = m[2];
  return t.split(/\r?\n/)[0].trim();
}

function montarUrl(caminho) {
  let p = caminho.replace(/\\/g, "/");
  if (base) p = base.replace(/[\\\/]+$/, "").replace(/\\/g, "/") + "/" + p;
  return "pamfolder://open?p=" + encodeURIComponent(p);
}

function criarBotao(caminho) {
  const b = document.createElement("a");
  b.textContent = "📂 Abrir pasta";
  b.href = montarUrl(caminho);
  b.dataset.pamExplorer = "1";
  b.title = caminho;
  b.style.cssText = "margin-left:8px;padding:2px 8px;border:1px solid #888;border-radius:4px;font-size:12px;cursor:pointer;text-decoration:none;background:#f3f3f3;color:#222;white-space:nowrap";
  b.addEventListener("click", (e) => { e.stopPropagation(); b.href = montarUrl(caminho); });
  return b;
}

function varrer(raiz) {
  if (!raiz) return;
  const w = document.createTreeWalker(raiz, NodeFilter.SHOW_TEXT);
  const achados = [];
  while (w.nextNode()) {
    const n = w.currentNode;
    if (!MARCADOR.test(n.nodeValue) || !n.nodeValue.includes("/")) continue;
    const pai = n.parentElement;
    if (!pai || pai.closest("script,style,textarea,input") || pai.dataset.pamExplorer) continue;
    if (pai.nextElementSibling && pai.nextElementSibling.dataset.pamExplorer) continue;
    achados.push(n);
  }
  achados.forEach((n) => {
    const caminho = limparCaminho(n.nodeValue);
    n.parentElement.insertAdjacentElement("afterend", criarBotao(caminho));
  });
}

let t;
new MutationObserver(() => { clearTimeout(t); t = setTimeout(() => varrer(document.body), 400); })
  .observe(document.body, { childList: true, subtree: true });
