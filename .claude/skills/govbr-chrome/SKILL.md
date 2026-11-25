---
name: govbr-chrome
description: Automatiza tarefas em serviços do gov.br (consultas, downloads, preenchimento de formulários) usando o Chrome do próprio usuário, já logado, via Claude in Chrome. Quando aparecer CAPTCHA ("não sou robô"), login, código 2FA ou pedido de confirmação, para e pede ao usuário para resolver, depois continua. Use em "faz isso no gov.br", "consulta no portal", "baixa o documento do gov.br", "/govbr-chrome".
---

# gov.br via Chrome do usuário

Antes do primeiro passo, leia a skill `anthropic-skills:chrome-browser` e carregue as ferramentas `mcp__claude-in-chrome__*` em uma única chamada de ToolSearch.

## Princípios

- Trabalhe só com a conta e os dados do próprio usuário, na sessão que ele já tem aberta.
- Nunca tente resolver, contornar ou enganar CAPTCHA, 2FA, biometria ou qualquer verificação. Quando aparecer, pare.
- Nunca peça nem digite senha, CPF de terceiros, códigos 2FA ou tokens. O usuário digita.

## Fluxo

1. Confirme com o usuário, em uma frase: serviço/URL, o que precisa ser feito e o que deve ser devolvido (arquivo, tabela, status).
2. Liste as abas abertas e trabalhe em uma aba nova. Não mexa nas abas do usuário.
3. Abra o serviço. Se cair em tela de login do gov.br, avise: "Faça o login nessa aba e me diga quando terminar." Espere a resposta.
4. A cada página, leia o texto da página antes de clicar. Prefira ler a adivinhar por captura de tela.
5. Ao detectar CAPTCHA, desafio de imagem, "não sou robô", código por SMS/app ou aviso de segurança, pare e diga exatamente o que o usuário precisa fazer. Só continue depois que ele confirmar.
6. Execute os passos do pedido. Antes de qualquer ação que envie, assine, pague, protocole ou altere dados, mostre o que vai ser enviado e peça confirmação.
7. Se a sessão expirar no meio, volte ao passo 3 e retome do último passo concluído.
8. Termine com o resultado pedido e uma linha dizendo o que não foi possível fazer, se houver.

## Limites

- Ritmo humano: sem laços rápidos de requisições. Em lotes, processe um item por vez e avise o total antes de começar.
- Se o serviço bloquear a conta ou mostrar limite de tentativas, pare e informe.
- Downloads: salve num diretório próprio e informe o caminho completo.

## Serviços comuns e onde costuma travar

Os endereços e telas mudam. Confira na página antes de agir e não assuma o que não viu.

| Serviço | Tarefas típicas | Onde pode parar |
|---|---|---|
| Meu INSS | consultar benefício, extrato, agendamentos, baixar documentos | login gov.br, 2FA |
| e-CAC / Receita Federal | situação fiscal, comprovantes, declarações, certidões | login com certificado ou gov.br nível prata/ouro, CAPTCHA |
| Carteira de Trabalho Digital | consultar vínculos, baixar contratos | login, 2FA |
| Emissão de certidões (federais) | gerar e baixar PDF | CAPTCHA |
| Portais estaduais e municipais (SEFAZ, prefeitura, Detran) | consultas, guias, certidões | CAPTCHA, certificado digital |

## Tipos de ação

- **Consultar:** ler a página e devolver os dados em tabela curta. Não precisa de confirmação.
- **Baixar:** clicar no download, salvar em diretório próprio e informar o caminho completo.
- **Preencher e enviar:** preencher, mostrar o resumo do que será enviado e esperar o "pode enviar" do usuário antes do clique final.
- **Em lote:** confirmar o total e a lista antes de começar. Um item por vez.
