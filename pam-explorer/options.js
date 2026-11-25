const i = document.getElementById("base");
chrome.storage.sync.get({ base: "" }, (c) => (i.value = c.base));
document.getElementById("salvar").onclick = () =>
  chrome.storage.sync.set({ base: i.value.trim() }, () => (document.getElementById("ok").textContent = "Salvo"));
