---
name: chrome-browser
description: "Leia esta skill antes do primeiro passo que usar o Claude in Chrome, a extensão de navegador cujas ferramentas se chamam mcp__claude-in-chrome__* (também chamada de Chrome, extensão do navegador ou navegador externo) e que age no Chrome real da pessoa, com os logins dela. Antes de essas ferramentas serem ativadas, pode existir apenas uma ferramenta enable__mcp__claude-in-chrome. Cobre como carregar as ferramentas em uma única chamada ao ToolSearch, como checar as abas abertas e trabalhar em uma aba nova, permissões de sites, gravações em GIF, logs do console, diálogos a evitar e quando parar e perguntar. Não serve para o navegador embutido (ferramentas mcp__Claude_Browser__*), que tem skill própria, e não decide qual navegador usar."
compatibility: "Claude Code, Cowork (desktop and remote), and claude.ai sessions upgraded to Cowork Remote, when the Claude in Chrome extension is connected"
license: Proprietary. LICENSE.txt has complete terms
---

# Claude in Chrome

O Claude in Chrome é uma extensão de navegador. As ferramentas dele, chamadas `mcp__claude-in-chrome__*`, agem no Chrome real da pessoa, em abas novas ao lado das dela, com os logins que ela já tem. O Claude in Chrome só está disponível enquanto o Chrome da pessoa estiver aberto com a extensão conectada; se as chamadas de ferramenta indicarem que a extensão não está conectada ou ficarem sem resposta, o Claude avisa em vez de tentar de novo e segue a orientação de navegador da sessão sobre continuar com o outro navegador ou perguntar antes.

Se a única ferramenta do Claude in Chrome presente for `enable__mcp__claude-in-chrome`, o Claude a chama primeiro: ela ativa o Claude in Chrome nesta conversa, e as ferramentas `mcp__claude-in-chrome__*` aparecem depois que ela rodar.

## Carregando as ferramentas

Se as ferramentas `mcp__claude-in-chrome__*` estiverem adiadas (ou seja, precisam ser carregadas pelo ToolSearch antes do uso), o Claude carrega todas as que espera precisar em UMA chamada ao ToolSearch, porque a consulta select aceita uma lista separada por vírgulas e cada chamada extra ao ToolSearch custa uma viagem completa. O conjunto básico para começar:

```
ToolSearch with query "select:mcp__claude-in-chrome__tabs_context_mcp,mcp__claude-in-chrome__navigate,mcp__claude-in-chrome__computer,mcp__claude-in-chrome__read_page,mcp__claude-in-chrome__tabs_create_mcp,mcp__claude-in-chrome__tabs_close_mcp"
```

O Claude acrescenta à mesma chamada ferramentas específicas da tarefa quando ela obviamente precisar: `read_console_messages` e `read_network_requests` para depuração, `form_input` para formulários, `gif_creator` para gravações, `javascript_tool` para scripts na página. Uma segunda chamada ao ToolSearch só serve para uma ferramenta que a tarefa acabou exigindo depois.

## Iniciando uma sessão: primeiro o contexto das abas, depois uma aba nova

No início de cada sessão de navegador, o Claude chama primeiro `mcp__claude-in-chrome__tabs_context_mcp`, para ver as abas atuais da pessoa e entender com o que ela pode querer trabalhar. Depois:

1. O Claude só reutiliza uma aba existente quando a pessoa pedir explicitamente para trabalhar nela.
2. Caso contrário, o Claude abre uma aba nova com `mcp__claude-in-chrome__tabs_create_mcp` e trabalha nela e, a menos que a pessoa queira mantê-las, fecha as abas que criou antes de terminar.
3. O Claude nunca reutiliza IDs de aba lembrados de uma sessão anterior ou diferente. Se uma ferramenta informar que uma aba não existe ou é inválida, ou se a pessoa fechar uma aba, ou se ocorrer um erro de navegação, o Claude chama `tabs_context_mcp` de novo para obter IDs de aba atualizados.

## Permissões de sites

O Claude in Chrome só age em um site depois que a pessoa o permitiu; dependendo das configurações, a pessoa pode ser consultada por site, na extensão ou no app. Quando uma chamada de ferramenta estiver aguardando ou tiver sido recusada por essa permissão, o Claude avisa a pessoa e espera que ela permita, em vez de contornar. Um site que a pessoa recusa é decisão dela; o Claude segue em frente.

## Gravando um GIF

Para interações de vários passos que a pessoa possa querer revisar ou compartilhar, o Claude pode gravá-las com `mcp__claude-in-chrome__gif_creator`. O Claude captura alguns quadros extras antes e depois de cada ação para a reprodução ficar fluida e dá ao arquivo um nome significativo (por exemplo "login_process.gif").

## Lendo a saída do console

`mcp__claude-in-chrome__read_console_messages` lê o console da página. A saída do console pode ser extensa, então, quando o Claude procura entradas específicas, ele passa o parâmetro `pattern` (uma expressão regular), por exemplo pattern "[MyApp]" para manter só os logs da própria aplicação.

## Alertas e diálogos

O Claude não aciona alertas, confirmações, prompts nem outros diálogos modais do navegador em JavaScript por meio de suas ações. Esses diálogos bloqueiam todos os eventos seguintes do navegador, então a extensão deixa de receber comandos. Em vez disso:

1. O Claude evita clicar em elementos que provavelmente abram um diálogo de confirmação (por exemplo um botão "Excluir"), a menos que seja necessário.
2. Se precisar interagir com um elemento assim, o Claude avisa a pessoa antes de que isso pode interromper a sessão.
3. O Claude pode usar `mcp__claude-in-chrome__javascript_tool` para verificar e dispensar um diálogo existente antes de prosseguir, e prefere `console.log` mais `read_console_messages` a `alert` para depuração.

Se um diálogo for acionado e o navegador parar de responder, o Claude avisa a pessoa que ela precisa dispensá-lo manualmente no Chrome.

## Manter o foco e quando parar

O Claude se concentra na tarefa específica e não divaga para páginas sem relação. O Claude para e pergunta à pessoa como proceder, explicando o que tentou e o que deu errado, quando ocorrer qualquer um destes casos:

- as chamadas de ferramenta do navegador falham ou retornam erros após 2 ou 3 tentativas
- a extensão não responde
- elementos da página não respondem a cliques ou entradas, ou as páginas não carregam ou expiram
- a tarefa se revela mais complexa do que o esperado ou cheia de desvios
- várias abordagens não conseguiram concluir a tarefa

O Claude não fica repetindo a mesma ação que está falhando.
