---
name: alvara-bombeiros-go
description: Protocola e acompanha processos de alvará/certificado do Corpo de Bombeiros de Goiás no SIAPI (siapi.bombeiros.go.gov.br) para a carteira de clientes, com login gov.br por certificado A1. Use em "protocolar alvará dos bombeiros", "acompanhar processo no SIAPI", "andamento do CBMGO", "avisar mudança de andamento".
---

# Alvará Bombeiros GO (SIAPI)

Roda **na máquina do usuário** (navegador com interface). Não roda no container da nuvem: o certificado A1 e a sessão gov.br ficam locais.

## Regras fixas
- Nunca gravar senha do certificado em arquivo, commit ou chat. Ela vem de `CERT_PFX_PASSPHRASE` (variável de ambiente).
- Nunca clicar no envio final do protocolo sem o usuário confirmar naquele cliente.
- O usuário confirma o login gov.br a cada execução: os scripts abrem a janela, avisam no terminal e esperam (até 10 min) ele concluir login/captcha antes de continuar. Nunca automatizar o login.
- Aviso por e-mail vai para o endereço do próprio usuário (campo `aviso_email` em `config/clientes.json`). Mandar a cliente só se o usuário pedir.

## Contexto de uso
- Usuário é contador, ~100 clientes, um único certificado A1 do contador com procuração dos clientes.
- Tipo de processo tratado: Certificação da Edificação.
- Antes de protocolar, `protocolar.js` confere `procuracao_valida_ate` e recusa cliente com procuração vencida. O processo é aberto em nome do cliente (CNPJ) pela tela de representado, que precisa ser mapeada.
- A lista de documentos exigidos da Certificação da Edificação não está preenchida: pedir ao usuário (ou ler a página de orientações do SIAPI) antes de montar a checklist. Não inventar.

## Preparo (uma vez)
1. `cd alvara-bombeiros-go && npm i playwright` (o navegador do Playwright já deve estar instalado).
2. `export CERT_PFX_PATH=/caminho/certificado.pfx CERT_PFX_PASSPHRASE='...'`
3. Copiar `config/clientes.exemplo.json` para `config/clientes.json` e preencher.
4. Opcional: `node scripts/login.js` para testar o login. Nas rotinas, o login é pedido na própria execução.
5. Mais simples: abra a tela no Chrome já logado, F12, Console, cole `scripts/mapear-console.js`. Ele só lê a página (nada é enviado ou clicado), copia o JSON e baixa `siapi_mapa_<data>.json`. Repetir em cada tela (andamentos, representado, novo processo) e entregar os JSONs ao Claude para preencher `seletores.json`. Alternativa: `node scripts/mapear.js <url>` salva HTML + screenshot das telas do SIAPI em `saida/mapa/` para preencher `config/seletores.json`. Isso precisa ser feito acompanhando o fluxo real uma vez; os seletores do exemplo são palpites.

## Acompanhar (rotina)
1. `node scripts/acompanhar.js` percorre todos os protocolos de `clientes.json`, lê `listarAndamentosWeb.jsf`, compara com `estado/<protocolo>.json` e grava `saida/novidades.json`.
2. Se `novidades.json` tiver itens, montar UM e-mail consolidado (cliente, protocolo, andamento novo, data, prazo de exigência se houver) e enviar pelo conector Gmail ao `aviso_email`. Exigências com prazo vão no topo do e-mail.
3. Só depois de enviar, rodar `node scripts/acompanhar.js --confirmar` para gravar o novo estado (evita perder aviso se o e-mail falhar).

## Protocolar
1. Conferir na pasta do cliente: documentos da checklist (`config/seletores.json > checklist`), PDFs legíveis e com tamanho aceito, taxa/DAE paga.
2. `node scripts/protocolar.js <id_cliente>` preenche o formulário, anexa os arquivos e **para antes do envio**, deixando a janela aberta e um screenshot em `saida/`.
3. Mostrar o screenshot ao usuário; com o "ok" dele, rodar com `--enviar`. O número do protocolo e o comprovante vão para `saida/protocolos/<id>/` e o protocolo entra em `clientes.json`.

## Limites conhecidos
- Execução sempre com janela visível e usuário presente no login.
- O SIAPI é JSF (ViewState, ids dinâmicos): seletores quebram quando o site muda. Reexecutar `mapear.js` e ajustar `seletores.json`.
- Não foi testado contra o site real; a primeira rodada de cada script deve ser acompanhada.
