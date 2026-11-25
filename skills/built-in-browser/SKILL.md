---
name: built-in-browser
description: "Leia esta skill antes do primeiro passo que usar o navegador embutido, o painel de navegador dentro do app Claude para desktop (também chamado de navegador do app, painel do navegador, navegador do Claude ou \"seu próprio navegador\"), cujas ferramentas se chamam mcp__Claude_Browser__* quando a sessão roda no app desktop e mcp__remote-devices__Claude_Browser__* quando uma sessão na nuvem está ligada ao computador da pessoa; antes de essas ferramentas serem ativadas, pode existir apenas uma ferramenta enable__mcp__remote-devices__Claude_Browser. Cobre logins persistentes, abas e preview_start, leitura de páginas como texto, aprovação de sites, o que o painel não consegue abrir e o que fazer quando não dá para acessá-lo. Não serve para o Claude in Chrome (ferramentas mcp__claude-in-chrome__*), que tem skill própria, e não decide qual navegador usar."
compatibility: "Cowork in the Claude desktop app, and Cowork Remote or upgraded claude.ai sessions linked to a computer running the desktop app"
license: Proprietary. LICENSE.txt has complete terms
---

# Navegador embutido

O navegador embutido é um painel de navegador de verdade dentro do app Claude para desktop, separado do Chrome da pessoa. As ferramentas dele se chamam `mcp__Claude_Browser__*` quando a própria sessão roda dentro do app desktop e `mcp__remote-devices__Claude_Browser__*` quando a sessão roda na nuvem (iniciada pela web, pelo celular ou pelo app desktop) e está ligada ao computador da pessoa. Os nomes depois do prefixo são os mesmos nos dois casos, o Claude usa o prefixo que de fato estiver presente, e esta skill se refere às ferramentas pela parte depois do prefixo.

Se a única ferramenta do navegador embutido presente for `enable__mcp__remote-devices__Claude_Browser`, o Claude a chama primeiro: ela ativa o navegador embutido nesta conversa, e as ferramentas `mcp__remote-devices__Claude_Browser__*` aparecem depois que ela rodar.

## O que a pessoa consegue ver

O painel do navegador divide o painel lateral do app desktop com artefatos, documentos e prévias de arquivos, e o painel mostra um deles por vez. Enquanto o painel do navegador está visível, a pessoa vê o que o Claude vê e pode navegar ou assumir o controle a qualquer momento. Enquanto outra coisa está aberta no painel, ou o painel está fechado, o navegador embutido continua funcionando. O Claude não diz à pessoa que ela perdeu algo ou não pôde ver, porque o Claude não sabe o que ela estava acompanhando.

Logo antes de pedir que a pessoa faça algo ela mesma no navegador embutido (clicar em um botão, entrar em uma conta, concluir uma verificação), o Claude chama `tabs_context`, cujo resultado termina dizendo se o painel Browser está exibido, oculto ou não aberto. Se o painel não estiver aberto, o Claude abre a página primeiro e confere de novo. Se o painel estiver oculto, o Claude primeiro pede que a pessoa traga o navegador de volta no app Claude para desktop: pressionar Cmd+Shift+B no Mac ou Ctrl+Shift+B no Windows, ou fechar o que mais estiver aberto no painel lateral e clicar no ícone de globo (o botão Browser). Quando as ferramentas têm o prefixo `mcp__remote-devices__Claude_Browser__`, o Claude normalmente não sabe se a pessoa está lendo esta conversa no app desktop, no site claude.ai ou no celular, e o atalho e o ícone de globo só funcionam no app desktop; então, antes desses passos, o Claude avisa que, se ela não estiver no app Claude para desktop do computador cujo navegador o Claude está usando, precisa abrir esta conversa lá primeiro. Em seguida o Claude diz o que fazer no navegador. O Claude pergunta porque usar o navegador não traz o painel de volta, e o que o painel mostra é escolha da pessoa. O Claude também diz na conversa o que encontrou ou fez no navegador, sem presumir o que a pessoa viu.

## Os logins persistem e pertencem à pessoa

O navegador embutido mantém um perfil persistente próprio, compartilhado entre as sessões do app desktop. A pessoa, ou uma sessão anterior, pode já estar logada em sites ali, e os logins que o Claude concluir persistem para depois. O Claude trata as sessões existentes como da pessoa: nunca sai de uma conta, nunca altera credenciais e nunca age em uma conta além do que a tarefa exige.

## Abas

O navegador embutido tem abas. `preview_start` com um `url` abre uma aba adicional naquele endereço em uma única chamada e devolve um `tabId`, sem mexer nas abas existentes; por isso o Claude o prefere a `tabs_create` seguido de `navigate` quando o destino já é conhecido. `navigate`, `read_page`, `get_page_text`, `find`, `computer`, `form_input` e os leitores de console e de rede agem na aba indicada por `tabId`; omitir `tabId` mira a aba ativa, e `tabs_context` lista as abas abertas.

## Carregando pelo ToolSearch

O Claude carrega as ferramentas do navegador embutido em bloco, não uma a uma: se elas estiverem na lista adiada, o Claude carrega todas em uma única chamada ao ToolSearch cuja consulta é o prefixo completo do nome, por exemplo `{ query: "mcp__remote-devices__Claude_Browser__", max_results: 64 }`.

## Lendo páginas

O Claude prefere `get_page_text` e `read_page` a capturas de tela para ler, porque elas devolvem o texto e a estrutura reais da página, e não pixels da área visível. `computer` com a ação "screenshot" serve para quando o layout visual é o ponto ou a pessoa pede para ver a página.

## Aprovações de sites, sites bloqueados e request_access

Dependendo das configurações de aprovação da pessoa, ela pode ser chamada a aprovar um site antes de o Claude agir nele, e alguns sites são bloqueados de saída. O Claude espera uma aprovação pendente em vez de contorná-la. Se uma página for recusada ou uma aprovação for negada, o Claude avisa a pessoa e segue em frente, sem tentar de novo.

Quando as ferramentas têm o prefixo `mcp__remote-devices__Claude_Browser__`, as aprovações podem ser respondidas de qualquer dispositivo da pessoa e podem levar um momento para chegar, e a sessão também pode ter uma ferramenta `request_access`. Se uma ferramenta do navegador responder que o site ainda não é permitido e `request_access` estiver presente, o Claude a chama com o URL desse site e o escopo "once" (ou "site", quando a tarefa continuar usando esse site), espera a resposta da pessoa e depois tenta de novo a ferramenta original. Sem `request_access`, um site recusado é tratado como acima: o Claude avisa a pessoa e segue em frente.

## O que o navegador embutido não consegue abrir

O navegador embutido não abre URLs `file://` nem servidores `localhost` que o próprio Claude inicia, porque eles rodam onde o shell do Claude roda, que não é onde o painel do navegador roda. Para mostrar à pessoa um HTML gerado pelo Claude, o Claude usa um artefato.

## Quando o navegador embutido não pode ser alcançado

Quando as ferramentas têm o prefixo `mcp__remote-devices__Claude_Browser__`, o painel roda no app Claude para desktop no computador da pessoa enquanto o Claude roda em outro lugar, então só é alcançável enquanto esse app estiver aberto e online. Se essas chamadas de ferramenta não alcançarem o app desktop (erros de conexão ou sem resposta), o Claude avisa a pessoa que o navegador embutido parece estar offline no computador dela, em vez de tentar de novo, e segue a orientação de navegador da sessão sobre continuar com o outro navegador ou perguntar antes.
