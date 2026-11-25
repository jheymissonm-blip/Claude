---
name: google-workspace
description: "Leia antes da primeira chamada aos conectores do Google Drive, Docs, Sheets ou Slides sempre que a tarefa criar ou alterar um arquivo Google. Use sempre que o usuário quiser criar ou alterar um Google Doc, Sheet ou Slides no Google Drive. Gatilhos: pedido que cite Google Docs, Sheets, Slides ou Drive e peça para criar, editar, formatar, copiar, renomear, mover ou apagar um arquivo; um link docs.google.com com pedido de alteração, mesmo uma correção de uma linha ou sugestão de edição; e qualquer alteração posterior em um arquivo Google da conversa, até um simples \"muda isso\" ou \"adiciona uma aba\". Inclui scripts auxiliares para posições de documento, intervalos de células e layout de slides. Porém, se o usuário pedir um documento, apresentação ou planilha sem citar o Google, ou der um arquivo Google apenas como fonte para algo novo, use o tipo de saída do próprio Claude. NÃO use para perguntas só de leitura sobre um arquivo Google, nem para arquivos Word, Excel, PowerPoint ou PDF."
---

# Google Docs, Sheets e Slides

Os conectores do Google são camadas finas sobre as APIs brutas do Google, com quase nenhuma orientação própria. Esta skill fornece essa orientação: qual conector faz o quê, as regras que mantêm as edições no arquivo do usuário e, em um arquivo de referência por app, como cada API realmente se comporta. A maioria das regras específicas de cada app nas referências foi testada nas APIs do Google Docs, Sheets e Slides; o resto foi observado pelos conectores, e algumas ainda não foram verificadas.

## Leia a referência antes de mexer no arquivo

| Trabalhando em | Leia primeiro | Por que importa |
|---|---|---|
| Um Google Doc | `references/docs.md` | As edições no Docs usam posições UTF-16 que mudam a cada inserção e ficam desatualizadas a cada gravação. Abas e sugestões pendentes também mudam as posições. |
| Uma planilha Google | `references/sheets.md` | As duas ferramentas de gravação interpretam a entrada como a interface do Sheets, então texto pode virar número ou data sem aviso. A formatação exige IDs numéricos de aba, intervalos base 0 e máscaras de campo sem parênteses. |
| Uma apresentação do Google Slides | `references/slides.md` | As posições são em EMU, o tamanho real de um elemento é o tamanho vezes a escala, e uma leitura sem máscara pode passar de 150 KB para três slides. O Slides nunca reduz o texto para caber. |

Leia a referência de cada app que a tarefa toca antes da primeira edição. Incorporar um gráfico do Sheets em uma apresentação significa ler as duas. As referências são curtas, e pular uma é como as edições vão parar no lugar errado.

## 1. Confira os conectores antes de começar

| Conector | O que pode fazer |
|---|---|
| Google Drive | Criar arquivos, subir e converter conteúdo, renomear, ler um arquivo como texto, exportar (PDF e outros formatos), buscar, mover para a lixeira |
| Google Docs | Ler toda a estrutura de um doc e editá-lo no próprio arquivo, diretamente ou como sugestões |
| Google Sheets | Ler valores e estrutura, gravar valores e fórmulas, formatar, adicionar abas e gráficos |
| Google Slides | Ler uma apresentação, adicionar e editar slides, formas, texto, tabelas e gráficos vinculados |

O Drive pode criar os três tipos de arquivo. Não consegue editar um arquivo depois disso. Sem o conector editor correspondente, toda alteração significa um arquivo novo e um link novo, e o usuário perde o link que já tem.

1. Confira quais ferramentas do Google estão disponíveis nesta conversa. Nas plataformas em que as ferramentas ficam adiadas, busque e carregue primeiro as que precisar, por exemplo "google sheets update". Os nomes das ferramentas variam conforme a plataforma, então use os nomes que a sua lista. Se uma busca não devolver nada, liste todas as ferramentas disponíveis antes de decidir que o conector não existe, porque a ferramenta pode existir com outro nome.
2. Se as ferramentas editoras estiverem faltando, avise o usuário. Quando puder listar os conectores da conversa, diga qual é o caso: um conector configurado mas desativado neste chat (peça que o ative nas configurações de conectores do chat e depois continue) ou um que não está conectado (diga qual conector adicionar e o que ele permite).
3. Com um conector editor faltando, um pedido para criar um arquivo novo continua pelo Drive. Uma alteração em um arquivo existente para e pergunta. Veja a regra do conector faltando na seção 2.
4. Se o usuário pedir só um arquivo novo, crie com o Drive. Se o conector editor estiver desativado, acrescente uma linha dizendo que as edições vão precisar dele.

Exemplo: "Posso criar a planilha agora. Se quiser fazer alterações depois, ative primeiro o conector do Google Sheets neste chat. Aí consigo editar este arquivo e o link continua o mesmo."

## 2. Regras para todo arquivo

- **Uma alteração vai no mesmo arquivo.** "Mudar", "atualizar", "corrigir", "adicionar" e "trocar para" significam que o usuário quer o mesmo arquivo e o mesmo link. Não recrie o arquivo para evitar uma edição.
- **Um conector editor faltando é uma escolha do usuário, não um contorno para você.** Quando o usuário pede uma alteração em um arquivo existente e o conector editor está faltando, sua resposta inteira é uma pergunta curta, não uma entrega. Construir a segunda melhor opção parece prestativo, mas o arquivo do usuário continua intocado e agora há dois artefatos, que é exatamente a falha que esta skill existe para evitar. Comece pela solução: nomeie o conector e diga que, com ele ativado, a edição cai no arquivo existente e o link continua o mesmo. Você pode oferecer uma alternativa, como um texto redigido para colar ou um arquivo para importar à mão, mas só como opção nomeada, e só a construa depois que o usuário a escolher. Exemplo de resposta, na íntegra: "Para adicionar o slide direto na sua apresentação, ative o conector do Google Slides neste chat e eu faço. Mesma apresentação, mesmo link. Ou posso redigir o slide como um arquivo para você importar à mão. Qual prefere?"
- **Nunca mova para a lixeira um arquivo que o usuário não pediu para apagar.** O Drive pode mandar um arquivo para a lixeira, mas não restaurá-lo. Os conectores de Docs, Sheets e Slides não abrem um arquivo na lixeira.
- **Leia antes de editar e proteja a gravação.** Envie todo lote do Docs e do Slides com `writeControl.requiredRevisionId` definido com o `revisionId` de uma leitura feita depois da sua última gravação, inclusive em lotes construídos com IDs ou posições das suas próprias gravações anteriores. A única exceção é um lote feito só de requisições `replaceAllText`, mesmo limitado a algumas abas ou slides. Se o arquivo mudou desde essa leitura, seja por gravação sua ou de outra pessoa, o Google rejeita o lote inteiro em vez de aplicá-lo em posições ou IDs desatualizados. Leia de novo antes de cada lote protegido e não reutilize um ID de revisão vindo da resposta de uma gravação. Em caso de rejeição, leia de novo e reconstrua; nunca descarte a proteção. `read_doc` e `read_presentation` (a máscara em `references/slides.md` o inclui) devolvem o ID. `read_slide_page` o devolve só se a máscara incluir `revisionId`; `read_slide_page_thumbnail` e o `read_file_content` do Drive nunca devolvem. Para uma leitura salva, a primeira linha de `docs_index.py outline` ou `slides_helper.py outline` o mostra; se essa linha disser `None`, leia de novo com `read_doc` ou `read_presentation`. `get_spreadsheet` não devolve `revisionId`, mesmo que `fields` o nomeie: envie as gravações do Sheets sem `writeControl` e leia de novo logo antes de uma gravação que dependa de posições.
- **Coloque tudo de um passo em um só lote.** As requisições de um lote rodam em ordem e de forma atômica: se uma for inválida, nenhuma é aplicada. Uma chamada por passo lógico é mais rápida e não deixa estado pela metade.
- **Máscaras de campo do Sheets.** Escreva cada caminho completo, sem parênteses: um caminho por item na lista `fields` do `get_spreadsheet` (`["spreadsheetId", "sheets.properties"]`) e separados por vírgula na string `fields` de uma requisição de atualização em lote (`"userEnteredFormat.numberFormat,userEnteredFormat.textFormat.bold"`).
- **Verifique o resultado.** Leia o arquivo de novo depois de cada edição e confira o resultado antes de relatá-lo. Uma ferramenta aceitar a chamada não significa que o conteúdo está correto. Cada referência tem uma seção Verify.
- **Renomeie com `update_file` do Drive.** Renomear mantém o mesmo link.
- **O Drive pode ler os arquivos do usuário, mas pode recusar mover ou apagar um arquivo que não foi criado pelo conector, mesmo que seja do usuário.** Se isso acontecer, não tente de novo, não peça acesso nem faça uma cópia. Diga ao usuário para fazer a alteração no Drive e dê o link do arquivo. Se você estava trabalhando com vários arquivos, pare e liste os que restaram.
- **Dê o link de todo arquivo que citar.** Quando nomear um arquivo Google que você criou, copiou, encontrou ou editou, faça do título um link, dentro da frase que diz o que você fez: "Adicionei a linha em [Team roster](seu link)." Não separe o arquivo depois de dois-pontos nem em uma linha própria ("Criei um arquivo para você: Team roster"). Se o resultado do Drive disser que o usuário já pode ver ou abrir um arquivo pelo chat, omita o link desse arquivo, a menos que ele peça. Sempre dê o link quando o usuário pedir, quiser enviá-lo a alguém ou disser que não consegue ver nem abrir o arquivo, mesmo que um resultado tenha dito que podia. Não diga ao usuário para usar um cartão ou prévia, a menos que um resultado diga que há um sendo exibido. Depois de uma edição, diga que o link continua o mesmo.

## 3. Drive, para os três apps

- **Encontrar um arquivo:** use a busca do Drive quando o usuário citar um arquivo sem link. Confirme a correspondência com o usuário se mais de um arquivo servir. Uma página pode ser curta mesmo que mais arquivos correspondam (5 arquivos com tamanho de página 20) e pode repetir o último arquivo da página anterior, então siga o token da próxima página até que nenhum volte e descarte ids repetidos.
- **Criar:** `create_file` com `contentMimeType` definido como `application/vnd.google-apps.document`, `.spreadsheet` ou `.presentation` cria um arquivo vazio. Subir conteúdo com um tipo de origem (HTML, CSV, .xlsx, .pptx) o converte para o tipo Google correspondente. Cada referência diz qual caminho serve para aquele app.
- **Ler como texto:** `read_file_content` devolve uma renderização compacta em texto: Markdown para um Doc. Tem alguns KB, onde a leitura completa do conector editor pode passar de 100 KB, então use para entender o conteúdo e depois use a leitura do editor quando precisar das posições. Para um Doc, passe `includeComments: true`; sem isso, os emojis saem truncados e o fim do texto é cortado. Para uma planilha, leia os dados com `get_values`: o Drive devolve só uma amostra (as primeiras linhas, valores longos cortados).
- **Exportar:** `download_file_content` com `exportMimeType: "application/pdf"` devolve o arquivo renderizado em base64. É grande (cerca de 65 KB de texto para uma apresentação de quatro slides), então exporte apenas para uma checagem visual e só onde puder rodar código.

## 4. Scripts auxiliares

A pasta `scripts/` ao lado deste arquivo contém auxiliares testados. Eles transformam o JSON bruto das APIs em resumos curtos e legíveis e transformam especificações simples em lotes de requisições corretos, de modo que a aritmética propensa a erro nunca é feita à mão. Use-os sempre que puder rodar Python. Execute-os pelo caminho completo dentro da pasta desta skill; as referências escrevem essa pasta como `<skill>`.

| Script | Comandos | Usado para |
|---|---|---|
| `docs_index.py` | `outline`, `find`, `new-table`, `fill-table` | Posições no Docs, busca de texto com estado de negrito e de sugestão, adicionar uma tabela preenchida em uma chamada, preencher uma tabela existente |
| `sheets_helper.py` | `range`, `format`, `cells` | Intervalos A1 para intervalos de grade, lotes de formatação a partir de uma especificação curta, ler fórmulas e células com erro |
| `slides_helper.py` | `outline`, `build` | Geometria real de slides com avisos de estouro e sobreposição, montar slides a partir de uma especificação em polegadas |
| `render_export.py` | um comando | Decodificar uma exportação em PDF em imagens de página para olhar |

**Levando o JSON a um script.** Resultados grandes de ferramentas costumam ser salvos em um arquivo pelo app, e o resultado informa o caminho. Aponte o script para esse caminho; os scripts leem o arquivo como o app o salvou. Quando um resultado volta no contexto e é pequeno (alguns KB, como uma leitura com máscara ou metadados de planilha), grave-o em um arquivo e rode o script nele. Não redigite um resultado grande em um arquivo: isso dobra o custo e convida a erros de cópia. Se um resultado grande foi cortado e não foi salvo, leia uma fatia menor (uma máscara de campo, um intervalo ou uma aba) em vez de adivinhar.

Todo script imprime `--help` com o uso completo. Cada referência mostra os comandos em contexto.

## 5. Falhas comuns entre os apps

| Sintoma | Causa | Correção |
|---|---|---|
| "No such tool available" | A ferramenta está adiada, ou o nome é diferente nesta plataforma | Busque e carregue a ferramenta. Use o nome exato que a plataforma lista. |
| Permissão negada em um arquivo que você criou | O arquivo está na lixeira | Peça ao usuário para restaurá-lo da lixeira do Drive. Você não consegue restaurar com os conectores. |
| 403 ou permissão negada no `update_file` ou `trash_file` do Drive em um arquivo que não está na lixeira | O Drive pode estar limitando movimentações e remoções a arquivos criados pelo conector, mesmo os do usuário | Não tente de novo, não peça acesso nem faça uma cópia. Peça ao usuário para fazer a alteração no Drive e dê o link do arquivo. |
| 400: required revision ID does not match | O arquivo mudou depois da sua leitura: sua própria gravação anterior ou outra pessoa editando | Leia de novo, reconstrua as requisições a partir da nova leitura e envie com a nova revisão. No Sheets, envie sem `writeControl`. |
| Um lote inteiro falhou por uma requisição ruim | Os lotes são atômicos | Corrija a requisição indicada e reenvie o lote completo. Nada da chamada que falhou foi aplicado. |
| Uma leitura é grande demais ou foi cortada | Leituras do editor sem máscara incluem tudo | Use o `read_file_content` do Drive (não para planilhas), uma máscara de campo, um intervalo ou uma única aba. Rode o auxiliar em um resultado salvo. |
| Dois arquivos onde o usuário esperava um | Uma edição foi feita criando um arquivo novo | Faça as alterações no próprio arquivo com o conector editor. Avise o usuário sobre o arquivo extra; não o apague sem perguntar. |

Cada referência termina com as falhas específicas daquele app.

## 6. O que os conectores não conseguem fazer

Quando um pedido esbarra em um destes limites, diga com clareza e faça a alternativa. *Reported*: visto pelos conectores ou nos esquemas das ferramentas deles. *Untested*: ainda não verificado.

- **O Claude não vê a tela do usuário.** Nenhum conector mostra o que o usuário selecionou, nem qual arquivo, aba ou slide ele tem aberto. Se "isto" ou "aqui" não estiver claro no chat, pergunte qual arquivo, título, número de slide ou intervalo de células ele quer dizer. *Reported.*
- **Comentários:** `read_doc` com `commentsIncluded: true` já devolveu cada comentário com seu lugar no texto. Se o resultado mostrar `COMMENTS_VIEW_MODE_OMITTED`, use o `read_file_content` do Drive com `includeComments: true` ou peça ao usuário que cole os comentários. O `update_doc` já aceitou `insertComment` em um relato, embora sua descrição seja cortada antes de listá-lo; se essa requisição falhar, diga que não consegue adicionar comentários e ofereça listar suas anotações na resposta. *Reported.*
- **O modo de sugestão pode ser recusado** com "Unsupported WriteControl mode". Nunca faça edições diretas no lugar dele: ofereça listar as alterações propostas ou editar diretamente (veja `references/docs.md`). *Reported.*
- **As listas de requisições são cortadas.** As descrições de `update_doc`, `update_spreadsheet` e `update_presentation` param no meio das listas de requisições. Requisições ausentes da descrição, como `addDocumentTab` e `addChart`, funcionaram mesmo assim, então tente uma antes de decidir que não é suportada. *Reported.*
- **Os uploads viajam dentro da chamada.** `create_file` recebe o arquivo inteiro como texto ou base64, então subir um .xlsx ou .pptx é lento e muitas vezes falha. Construa dentro do arquivo com os conectores editores sempre que puder e mantenha os uploads pequenos. *Reported.*
- **Imagens precisam de uma URL pública.** O `createImage` do Slides e o `insertInlineImage` do Docs buscam a imagem em uma URL que o Google alcance; um arquivo do chat não pode ser inserido assim. Para uma apresentação, ofereça o caminho do .pptx; caso contrário, peça ao usuário que insira a imagem. *Untested.*
- **Um gráfico do Slides precisa já existir em uma planilha.** Crie-o lá com `addChart` e depois incorpore com `createSheetsChart`. *Reported.*
- **A busca do Drive usa `title`, não `name`.** `name contains '…'` falha com "Unsupported query field: name"; escreva `title contains '…'` e coloque o tipo de arquivo em uma cláusula `mimeType`. *Reported.*
- **As edições do Slides podem não aparecer de imediato em uma apresentação aberta.** Se o usuário não vir uma alteração, peça que recarregue a apresentação antes de você mudar qualquer coisa de novo. *Reported; may be fixed.*
