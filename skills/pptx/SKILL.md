---
name: pptx
description: "Use esta skill sempre que um arquivo .pptx ou .potx estiver envolvido de qualquer forma, como entrada, saída ou ambos. Inclui: criar apresentações, decks ou pitch decks como arquivos PowerPoint (.pptx); ler, analisar ou extrair texto de qualquer .pptx ou .potx (mesmo que o conteúdo seja usado em outro lugar, como e-mail, resumo ou outro tipo de apresentação); editar, modificar ou atualizar apresentações existentes; combinar ou dividir arquivos de slides; trabalhar com modelos (.potx), layouts, notas do apresentador e comentários. Acione sempre que o usuário pedir um arquivo PowerPoint ou .pptx, ou citar um nome de arquivo .pptx ou .potx, independentemente do que fará com o conteúdo depois. Porém, quando o usuário pedir um deck, slides ou apresentação sem citar formato de arquivo, use por padrão um tipo de artefato de apresentação ou outra skill de slides, se a sessão oferecer; caso contrário, use esta skill."
license: Complete terms in LICENSE.txt
---

# Criação, edição e análise de PPTX

Se esta sessão oferece um tipo de artefato dedicado a apresentações ou uma skill de slides separada, e o usuário não pediu um arquivo PowerPoint/.pptx nem enviou um arquivo .pptx/.potx para editar, preencher ou converter, monte a apresentação com esse tipo ou skill. Um arquivo .pptx/.potx fornecido apenas como material de origem ou como exemplo para uma apresentação nova ("faça outra apresentação como esta") não conta como enviado: leia-o com esta skill e monte a apresentação nova com esse tipo ou skill. Esta skill continua sendo a ferramenta certa para produzir arquivos .pptx e para ler, editar, usar como modelo ou converter arquivos .pptx/.potx existentes.

Um `.pptx` é um arquivo ZIP com arquivos XML. Escolha a abordagem pela tarefa:

| Tarefa | Abordagem |
|---|---|
| **Criar** uma apresentação nova | Escreva um script `pptxgenjs` (veja as armadilhas abaixo) e monte-a como uma [apresentação estruturada](#apresentações-estruturadas), a menos que o usuário peça algo rápido e descartável |
| **Editar** uma apresentação existente, ou montar a partir de um modelo | descompactar → editar `ppt/slides/slideN.xml` → compactar |
| **Ler** o conteúdo | `python scripts/slide_text.py deck.pptx` (um bloco por slide sob marcadores `<!-- Slide number: N -->`); grade visual: `python scripts/thumbnail.py deck.pptx` |

## Scripts

Os caminhos são relativos ao diretório desta skill. O resto é Python simples, `node` ou shell.

| Script | O que faz |
|---|---|
| `scripts/slide_text.py deck.pptx` | Título, texto, tabelas, dados de gráficos (gráficos de dispersão e de bolhas: só os nomes das séries), texto alternativo de imagens e notas do apresentador de cada slide, em markdown. Lê `.potx` também |
| `scripts/thumbnail.py deck.pptx [prefix]` | Grade rotulada de todos os slides, para escolher layouts de modelos. Somente `.pptx`. Passe `prefix`: o padrão é `thumbnails`, que sobrescreve as grades de qualquer outra apresentação feita no mesmo diretório |
| `scripts/add_slide.py unpacked/ slide2.xml [--after slideN.xml]` | Duplica um slide (ou um `slideLayoutN.xml`) com toda a contabilidade do pacote. Também aceita um `.pptx` diretamente com `-o out.pptx` |
| `scripts/clean.py unpacked/` | Apaga slides, mídia e relações que não são mais referenciados. Rode **depois** que `<p:sldIdLst>` estiver final |
| `scripts/apply_theme.js` | Módulo Node: `const { applyTheme } = require("<diretório desta skill>/scripts/apply_theme.js")`. `await applyTheme("deck.pptx", THEME)` depois de `pres.writeFile()` grava as cores e o nome de `THEME` (com escape para XML) no tema da apresentação, para [apresentações estruturadas](#apresentações-estruturadas). Também é uma CLI: `node scripts/apply_theme.js deck.pptx theme.json` |
| `scripts/office/validate.py deck.pptx [--original src.pptx]` | Verificações de esquema, relações, tipos de conteúdo, gráficos e slides; cada falha nomeia a correção. Passe `--original` para qualquer apresentação derivada de modelo: ele usa o modelo como base das verificações de esquema, para que os próprios erros XSD do modelo não pareçam seus |
| `scripts/office/soffice.py --headless --convert-to pdf deck.pptx` | Wrapper do LibreOffice: o `soffice` puro trava neste sandbox |

## Criando com pptxgenjs: armadilhas

O `pptxgenjs` já vem instalado: não rode `npm install` antes; escreva o script e use `require('pptxgenjs')` direto. Só se esse require falhar: `npm install pptxgenjs`. O modelo conhece a API; estas são as armadilhas:

- **Defina `pres.layout` antes de adicionar slides.** A tela padrão é `LAYOUT_16x9` = **10" × 5,625"**, não 13,3" de largura. Coordenadas além da borda são gravadas, não limitadas: a forma simplesmente não está no slide. (`LAYOUT_WIDE` é 13,3" × 7,5".)
- **Cores hex: nunca `#`, nunca 8 dígitos.** `color: "FF0000"`. Tanto `"#FF0000"` quanto alfa embutido no hex (`"00000020"`) **corrompem o arquivo**. Para transparência: `transparency: 0-100` em preenchimentos e imagens, `opacity: 0.0-1.0` em sombras; cada um é ignorado em silêncio no outro.
- **O pptxgenjs altera objetos de opções no lugar** (converte valores para EMU no primeiro uso). Nunca compartilhe um mesmo objeto `shadow`/opções entre duas chamadas `add*`: crie um objeto novo a cada vez.
- **O `offset` da sombra deve ser ≥ 0**: um offset negativo corrompe o arquivo. Para lançar uma sombra para cima, use `angle: 270` com um offset positivo.
- **`letterSpacing` é ignorado em silêncio**: a opção real é `charSpacing`.
- **Listas:** `bullet: true` em cada item, nunca um `•` literal (renderiza marcadores duplos). Defina `breakLine: true` em todo item do array, exceto o último. Espace parágrafos com marcadores usando `paraSpaceAfter`, não `lineSpacing` (lacunas enormes).
- **Um `new pptxgen()` por arquivo de saída**: nunca reutilize uma instância.
- **`rectRadius` só funciona em `ROUNDED_RECTANGLE`**, não em `RECTANGLE`.
- **Preenchimentos em degradê não são suportados**: use uma imagem em degradê como fundo.
- **Toda chamada `addText` sem `placeholder` precisa de `isTextBox: true`**: sem isso a forma não tem `txBox="1"`, e os leitores de tela anunciam o texto como "gráfico" em vez de caixa de texto. Sem mudança visual.
- **Caixas de texto têm margem interna embutida**: defina `margin: 0` sempre que o texto precisar alinhar com uma forma, linha ou ícone no mesmo x.
- **As notas do apresentador vão em `slide.addNotes("...")`** (texto simples, uma vez por slide), nunca em uma caixa de texto no slide.
- **Mantenha os gráficos nativos.** Use `addChart()` para tudo o que o PowerPoint consegue graficar (passe um array de `{type, data, options}` para combinações). Para recursos nativos do PowerPoint que a biblioteca não expõe (linhas de tendência, barras de erro), calcule a série extra você mesmo ou pós-processe o OOXML gerado: não recorra a uma imagem renderizada. Somente tipos de gráfico sem forma nativa no PowerPoint (Sankey, rede, corda) entram como imagens.
- **Gráficos padrão saem sem acabamento**: sem título, sem rótulos de dados, paleta datada. Defina `showTitle` + `title`, `showValue: true` + `dataLabelPosition`, `chartColors: [...]` com a sua paleta e acalme a moldura (`catAxisLabelColor`/`valAxisLabelColor`, `valGridLine: { color, size }`, `catGridLine: { style: "none" }`, `showLegend: false` para uma única série).
- **Em um gráfico de barras ou colunas empilhadas, `dataLabelPosition` deve ser `ctr`, `inEnd` ou `inBase`.** `outEnd` **corrompe o arquivo**.
- **Uma série de combinação que use `secondaryValAxis`/`secondaryCatAxis` precisa de `valAxes` e `catAxes` nas opções do gráfico, duas entradas cada.** Sem eles o pptxgenjs grava *ids* de eixo que nunca declara, e o PowerPoint **descarta esse gráfico** e relata o arquivo como corrompido. Fornecer só `valAxes` não basta.
- **Depois de `writeFile()`, rode `python scripts/office/validate.py deck.pptx`.** Ele relata muitas das falhas de gráfico e de XML de slide que o PowerPoint recusa ou repara, as duas acima entre elas, e nomeia a correção de cada uma. Corrija-as no seu gerador, não editando à mão o XML compactado.
- **Nunca reordene os filhos de `<p:presentation>`.** O pptxgenjs grava `<p:notesMasterIdLst>` logo depois de `<p:sldIdLst>` e aponta os dois masters para uma única parte de tema. O PowerPoint lê isso numa boa: mova o elemento e a mesma apresentação deixa de abrir.
- **Ícones:** renderize `react-icons` em SVG (`ReactDOMServer.renderToStaticMarkup`), rasterize com `sharp` em ≥256px e insira via `addImage({ data: "image/png;base64," + buf.toString("base64") })`: o prefixo `image/png;base64,` é obrigatório (`react-icons`, `react`, `react-dom` e `sharp` já vêm instalados; `npm install react-icons react react-dom sharp` só se um require falhar).
- **`defineSlideMaster()` cria um *layout* de slide, não um master**: um `slideLayoutN.xml` por chamada, sob um único master que você não pode alterar. Chame-os de layouts ao falar com o usuário.
- **`pres.company` e o `title` de um `defineSlideMaster()` são gravados no XML sem escape**: um `&` em qualquer um deles (`"Harrow & Sons"`) deixa `docProps/app.xml` ou o layout impossível de interpretar, e o `validate.py` falha. Escreva `&amp;` ali, e no `masterName` correspondente. `title`, `subject`, `author`, títulos de seção, `objectName`, notas e texto dos slides recebem escape automaticamente.

### Apresentações estruturadas

Uma apresentação montada sobre um tema, layouts, placeholders e seções pode ser reestilizada em um só lugar e editada no PowerPoint sem briga. Monte toda apresentação nova assim, a menos que o usuário peça algo rápido e descartável.

1. **Tema primeiro:** `const THEME = { name, headFontFace, bodyFontFace, colors: { dk1, lt1, dk2, lt2, accent1 … accent6, hlink, folHlink } }`, cores em hex. `pres.theme` recebe as duas fontes e nada mais. Não nomeie nenhuma fonte depois disso: os títulos recebem a fonte de títulos, o resto do texto a fonte do corpo, exceto no texto de gráficos, que vem fixo em Arial: dê às opções `*FontFace` dele `"+mn-lt"` (fonte do corpo do tema; `"+mj-lt"` é a de títulos).
2. **`const C = pres.SchemeColor` para toda cor**: `C.text1`/`C.text2` são `dk1`/`dk2`, `C.background1`/`C.background2` são `lt1`/`lt2`. Estas aceitam só hex, lido de `THEME`: `valGridLine.color`, `catGridLine.color`, `shadow.color` e, em um gráfico de barras de uma série, `invertedColors` ou mais de um `chartColors`. Uma cor de esquema ali é gravada como `<a:srgbClr val="bg2"/>` sem reclamar e, sendo hex, não acompanhará uma mudança posterior de tema.
3. **Seções:** `pres.addSection({ title })` logo antes do primeiro slide da seção e depois `sectionTitle` em cada `addSlide`. Um slide sem isso (ou, quando todas as seções são declaradas de antemão, os slides de continuação automática de uma tabela) cai em uma seção "Default-N" perdida.
4. **Um layout por moldura de slide** (`defineSlideMaster()`): título, divisor de seção, só título, gráfico + comentário, tabela; variantes escuras e claras se o design alternar. As regiões de texto são placeholders nomeados com posição, tamanho, peso e `color`: placeholders de gráfico, imagem e tabela também precisam de `color`, ou o texto de sugestão e os arrays de trechos saem fixos em `000000`. Texto de rodapé, logo e `slideNumber` vão no layout, nunca em um slide.
5. **Preencha pelo nome:** `addSlide({ masterName, sectionTitle })` e depois `addText("…", { placeholder: "title" })` sem posição, tamanho nem cor: as opções do próprio placeholder prevalecem, e o que ele não define (itálico, `align`, `fontFace`) continua valendo; estilize um trecho com `[{ text, options }]`. Um `placeholder` ou `masterName` com erro de grafia falha em silêncio (uma caixa de texto solta em 0,0; o layout em branco). Somente os placeholders `title`, `body` e `chart` são preenchidos só pelo nome: `addImage({ placeholder })` assume o x e o y do placeholder mas não o tamanho (uma imagem de 1" × 1"): passe `w`/`h` também. `addTable({ placeholder })` assume apenas o x e o y: passe sempre `w`; quando ela pagina automaticamente, ignora o placeholder e sai do slide, então passe também `x`, `y` e `autoPageSlideStartY` (igual a `y`, ou as páginas de continuação são montadas a partir da margem superior), dê ao layout uma `margin` cuja parte de baixo livre o rodapé e preencha os títulos dos slides de continuação por `slide.newAutoPagedSlides`.
6. **Um layout é a moldura, não o "layout" a que se referem as Ideias de Design.** Cards, ícones, destaques de estatísticas e imagens continuam sendo compostos slide a slide por cima dele, em cores de esquema, cada um com um `objectName`: toda Ideia de Design se aplica, e a maioria dos slides de conteúdo fica sobre o layout só título.
7. **Grave e depois aplique o tema:** `await pres.writeFile({ fileName: "deck.pptx" })` e depois `await applyTheme("deck.pptx", THEME)`. O pptxgenjs não consegue gravar cores de tema: até isso rodar, as cores de esquema resolvem para a paleta padrão do Office. Ele lança um erro, sem alterar nada, diante de uma cor de esquema em uma opção só de hex: corrija o que ele nomear e reconstrua.

## Editando apresentações e modelos existentes

Escolha os layouts primeiro: `python scripts/thumbnail.py template.pptx template-thumbs` grava uma grade rotulada de todos os slides e imprime o(s) arquivo(s) que criou: `template-thumbs.jpg`, dividido em `template-thumbs-N.jpg` acima de 12 slides. **Sempre passe esse segundo argumento, com o nome da apresentação.** O padrão é `thumbnails`, então duas apresentações com miniaturas no mesmo diretório sobrescrevem as grades uma da outra em silêncio: as da primeira simplesmente somem (serve só para análise de modelo: a QA visual precisa das renderizações em resolução total de [Convertendo em imagens](#convertendo-em-imagens); ele só aceita `.pptx`, então copie um `.potx` para um nome `.pptx` primeiro). Use-o com `slide_text.py` para mapear cada seção de conteúdo a um slide do modelo e varie os layouts: não coloque toda seção no mesmo slide de título e tópicos.

```bash
python3 -c "import sys,zipfile; zipfile.ZipFile(sys.argv[1]).extractall('unpacked')" deck.pptx
python scripts/add_slide.py unpacked/ slide2.xml --after slide2.xml   # duplica um slide (ou slideLayoutN.xml); imprime o caminho do slide novo
# reordenar / apagar slides = editar <p:sldIdLst> em ppt/presentation.xml
python scripts/clean.py unpacked/                                     # depois de apagar: remove slides, mídia e relações órfãos
# edite o conteúdo dos slides em ppt/slides/slideN.xml
(cd unpacked && rm -f ../out.pptx && zip -XrDy ../out.pptx .)         # compacte de DENTRO do diretório; rm antes, ou partes apagadas sobrevivem
python scripts/office/validate.py out.pptx --original deck.pptx
```

- **Faça todo o trabalho estrutural (adicionar, apagar, reordenar) antes de editar o conteúdo de qualquer slide.** O `add_slide.py` copia um arquivo de slide literalmente, então duplicar depois de editar clona o conteúdo editado; e o `clean.py` apaga todo slide ausente de `<p:sldIdLst>`, inclusive um que você acabou de gravar.
- **Nunca copie um arquivo de slide à mão**: o `add_slide.py` faz todo registro de que um slide novo precisa e relata o que criou (`Created ppt/slides/slide17.xml from slide2.xml`). Ele também funciona direto em um arquivo: `add_slide.py deck.pptx slide2.xml -o out.pptx`: **passe `-o`, ou ele reescreve a apresentação de entrada no lugar.** Um slide duplicado ainda *referencia* as partes de gráfico/SmartArt/objeto incorporado do original em vez de cloná-las, então editar o gráfico de um slide muda o do outro.
- **Se usar o `python-pptx`**, há três coisas que ele não faz: duplicar um slide (a única entrada é `add_slide(layout)`), preservar a formatação com `text_frame.text = "..."` (isso reduz o parágrafo a um único trecho sem estilo: atribua `run.text`) ou ler o SVG/EMF que a maioria das artes de modelos usa (`add_picture` lança `UnidentifiedImageError`).
- Arquivos `.ppt` antigos precisam ser convertidos antes: `python scripts/office/soffice.py --headless --convert-to pptx file.ppt`. Modelos `.potx` são descompactados e compactados do mesmo jeito: mantenha a extensão `.potx` na saída.
- Para reaproveitar um ícone ou imagem de um modelo, duplique um slide ou layout que já o contenha.

Ao preencher um modelo:

- Se você escrever uma transformação de XML por script, interprete com `defusedxml.minidom`: passar OOXML por `xml.etree.ElementTree` reescreve os prefixos de namespace e corrompe a apresentação.
- **Espaços do modelo ≠ itens da origem.** Se o modelo mostra 4 membros da equipe e você tem 3, apague o grupo inteiro do 4º membro (imagem + caixas de texto), não só o texto dele, e depois procure elementos visuais órfãos na QA.
- Um `<a:p>` por item de lista: nunca concatene itens em um único parágrafo. Copie o `<a:pPr>` irmão para preservar o espaçamento e coloque `b="1"` no `<a:rPr>` de títulos, cabeçalhos de seção e rótulos em linha (`Status:`, `Owner:`).
- Deixe os marcadores herdarem do layout; só adicione `<a:buChar>`, `<a:buAutoNum>` (numerado) ou `<a:buNone>` para sobrescrever: nunca um `•` literal no texto.
- Texto com espaços no início ou no fim precisa de `xml:space="preserve"` no seu `<a:t>`.

## Conteúdo e fluxo da apresentação

- **Uma mensagem por slide.** Uma apresentação segue tema por tema, mensagem por mensagem.
- **Uma estrutura comum é a pirâmide:** a mensagem principal logo de início, um resumo executivo que antecipa as seções, as próprias seções e depois uma conclusão, em geral com próximos passos que agem sobre os achados.
- **Adapte a estrutura ao tamanho da apresentação.** Uma apresentação curta pode dispensar introdução e conclusão; uma longa pode precisar de divisores entre os tópicos.
- **Construa em direção ao objetivo da apresentação:** uma decisão, um consenso, uma celebração, a resolução de um desacordo ou a abertura de uma discussão.
- **Construa para o modo como será usada.** Uma apresentação ao vivo tem narração e possivelmente discussão; uma leitura prévia precisa carregar toda a narrativa sozinha. Um público executivo em uma reunião ao vivo precisa de poucas palavras e slides muito visuais. Slides detalhados e cheios de texto às vezes são certos para especialistas no assunto ou para uma apresentação lida offline. Relatórios analíticos se apoiam em gráficos e tabelas.
- **Dimensione uma apresentação ao vivo pela fala:** cerca de 1,5 a 2 minutos por slide, com tempo sobrando para perguntas, se houver.

## Ideias de design

**Não crie slides chatos.** Tópicos simples sobre fundo branco não impressionam ninguém. Considere ideias desta lista para cada slide.

### Antes de começar

- **Escolha uma paleta de cores ousada e informada pelo conteúdo**: a paleta deve parecer feita para ESTE tema. Se trocar suas cores por uma apresentação completamente diferente ainda "funcionaria", suas escolhas não foram específicas o bastante.
- **Dominância, não igualdade**: uma cor deve dominar (60-70% do peso visual), com 1-2 tons de apoio e um acento marcante. Nunca dê o mesmo peso a todas as cores.
- **Contraste escuro/claro**: fundos escuros para os slides de título e de conclusão, claros para o conteúdo (estrutura "sanduíche"). Ou assuma o escuro do começo ao fim para uma sensação premium.
- **Assuma um motivo visual**: escolha UM elemento distintivo e repita-o: molduras de imagem arredondadas, ícones em círculos coloridos. Leve-o a todos os slides. **Não use uma barra de cor nem uma faixa de acento como motivo** (veja a lista Evite).

### Paletas de cores

Escolha cores que combinem com o seu tema: não caia no azul genérico. Use estas paletas como inspiração:

| Tema | Primária | Secundária | Acento |
|------|----------|------------|--------|
| **Midnight Executive** | `1E2761` (azul-marinho) | `CADCFC` (azul-gelo) | `FFFFFF` (branco) |
| **Forest & Moss** | `2C5F2D` (floresta) | `97BC62` (musgo) | `F5F5F5` (creme) |
| **Coral Energy** | `F96167` (coral) | `F9E795` (dourado) | `2F3C7E` (azul-marinho) |
| **Warm Terracotta** | `B85042` (terracota) | `E7E8D1` (areia) | `A7BEAE` (sálvia) |
| **Ocean Gradient** | `065A82` (azul profundo) | `1C7293` (verde-azulado) | `21295C` (azul meia-noite) |
| **Charcoal Minimal** | `36454F` (carvão) | `F2F2F2` (quase branco) | `212121` (preto) |
| **Teal Trust** | `028090` (verde-azulado) | `00A896` (verde-mar) | `02C39A` (menta) |
| **Berry & Cream** | `6D2E46` (amora) | `A26769` (rosa-antigo) | `ECE2D0` (creme) |
| **Sage Calm** | `84B59F` (sálvia) | `69A297` (eucalipto) | `50808E` (ardósia) |
| **Cherry Bold** | `990011` (cereja) | `FCF6F5` (quase branco) | `2F3C7E` (azul-marinho) |

### Para cada slide

**Todo slide precisa de um elemento visual**: imagem, gráfico, ícone ou forma. Slides só de texto são esquecíveis.

**Opções de layout:**
- Duas colunas (texto à esquerda, ilustração à direita)
- Linhas de ícone + texto (ícone em círculo colorido, cabeçalho em negrito, descrição embaixo)
- Grade 2x2 ou 2x3 (imagem de um lado, grade de blocos de conteúdo do outro)
- Imagem sangrada em meia página (esquerda ou direita inteira) com o conteúdo sobreposto

**Exibição de dados:**
- Grandes destaques de estatísticas (números grandes de 60-72pt com pequenos rótulos embaixo)
- Colunas de comparação (antes/depois, prós/contras, opções lado a lado)
- Linha do tempo ou fluxo de processo (passos numerados, setas)

**Acabamento visual:**
- Ícones em pequenos círculos coloridos ao lado dos cabeçalhos de seção
- Texto de acento em itálico para estatísticas-chave ou slogans

### Tipografia

**Os nomes de fonte que você grava no .pptx são renderizados pelo PowerPoint do usuário, não por este ambiente.** Sua QA visual renderiza pelo LibreOffice, que substitui as fontes que não tem, e para algumas fontes o substituto tem larguras diferentes, então a sua prévia de QA pode mostrar um estouro (ou um encaixe) de texto que a apresentação real não terá. Para manter sua QA confiável:

- **Fontes seguras** (renderizam com a largura certa na QA *e* vêm com o Office): **Arial, Calibri, Cambria, Times New Roman, Courier New, Bookman Old Style, Century Schoolbook**. Use-as para o corpo do texto e para tudo em que o encaixe importa.
- **Títulos com personalidade e risco zero na QA**: combine um título com serifa da lista segura (Cambria, Bookman Old Style, Century Schoolbook) com um corpo sem serifa da lista segura (Calibri ou Arial). Você ganha contraste visual sem abrir mão de verificações confiáveis de estouro.
- **Se o usuário pedir uma fonte fora da lista segura** (por exemplo Georgia ou Trebuchet MS): use-a onde ele pediu, mas dimensione esses contêineres com folga extra (~10%) e não confie no encaixe de texto da QA nesses elementos: a prévia dessa fonte é aproximada. Se o usuário não especificou, prefira fontes da lista segura para o corpo do texto.
- **Fontes não confiáveis na QA** (o substituto tem larguras diferentes: as verificações de estouro podem estar erradas): Georgia, Trebuchet MS, Impact, Arial Black, Garamond, Consolas, Palatino Linotype. A substituição da Calibri Light varia por ambiente; trate-a como não confiável na QA. Servem para títulos/acentos com folga; não confie no encaixe de texto da QA nelas.
- **Nunca use Aptos como padrão**: a fonte padrão do Office pós-2023 não tem substituto de métrica compatível aqui *e* falta em instalações mais antigas do Office, então é pouco confiável nas duas pontas.

| Elemento | Tamanho |
|----------|---------|
| Título do slide | 36-44pt negrito |
| Cabeçalho de seção | 20-24pt negrito |
| Corpo do texto | 14-16pt |
| Legendas | 10-12pt apagado |

### Espaçamento

- Margens mínimas de 0,5"
- 0,3-0,5" entre blocos de conteúdo
- Deixe o conteúdo respirar: não preencha cada centímetro

### Evite (erros comuns)

- **Não repita o mesmo layout**: varie colunas, cards e destaques entre os slides
- **Não termine o título de um slide com ponto final**
- **Não deixe os títulos variarem entre slides do mesmo tipo**: slides de conteúdo com o título no topo o colocam na mesma posição, fonte, tamanho e alinhamento em todos os slides; um tipo diferente de slide (um divisor de seção com o título no meio do slide) pode posicioná-lo de outro jeito
- **Não mude a aparência dos rótulos de gráfico de um gráfico para outro**: rótulos de eixo e de dados usam a mesma cor, fonte e tamanho em todos os gráficos da apresentação; varie um só onde um gráfico precisar (um segundo eixo, uma série em destaque, um rótulo sobre uma barra escura)
- **Não centralize o corpo do texto**: alinhe parágrafos e listas à esquerda; centralize só os títulos
- **Não economize no contraste de tamanho**: os títulos precisam de 36pt+ para se destacar do corpo de 14-16pt
- **Não adote o azul como padrão**: escolha cores que reflitam o tema específico
- **Não misture espaçamentos aleatoriamente**: escolha lacunas de 0,3" ou 0,5" e use de forma consistente
- **Não estilize um slide e deixe o resto simples**: assuma por completo ou mantenha simples do começo ao fim
- **Não crie slides só de texto**: adicione imagens, ícones, gráficos ou elementos visuais; evite título + tópicos simples
- **Não esqueça a margem interna da caixa de texto**: ao alinhar linhas ou formas com as bordas do texto, defina `margin: 0` na caixa de texto ou desloque a forma para compensar a margem
- **Não use elementos de baixo contraste**: ícones E texto precisam de forte contraste com o fundo; evite texto claro sobre fundo claro ou texto escuro sobre fundo escuro
- **NUNCA use linhas de acento sob os títulos**: são marca registrada de slides gerados por IA; use espaço em branco ou cor de fundo
- **NUNCA adicione barras de cor ou faixas de acento decorativas**: isso inclui barras de cabeçalho/rodapé que atravessam o slide, faixas laterais verticais em uma borda do slide, faixas finas de acento na borda de um card ou bloco de conteúdo e "bordas de um só lado" em retângulos. Parecem enchimento gerado por IA. Se quiser destacar um card, use um tom de fundo sutil, uma sombra projetada ou um ícone, não uma faixa de borda.
- **Não adote fundos creme/bege como padrão**: quando nenhum fundo for especificado, use branco (`FFFFFF`) ou a paleta da marca do usuário; evite padrões neutros quentes como `F5F5DC`, `FAF0E6`, `FAEBD7`, `FFF8E1`
- **Não entregue texto que estoura a forma**: se o texto não couber, reduza a fonte, divida em vários slides ou aumente o contêiner; nunca deixe conteúdo cortado ou saindo dos limites. **Não reduza abaixo dos tamanhos da tabela de Tipografia** (corpo 14pt, legendas 10pt) em uma apresentação que você cria: ao chegar a esse piso, corte palavras, aumente o contêiner ou divida o slide; ao editar uma apresentação ou modelo existente, acompanhe os tamanhos dele

## QA (obrigatória)

Sua primeira renderização geralmente tem alguns problemas reais: sobreposições, estouros, desalinhamentos. Encontre e corrija esses problemas, renderize de novo só os slides que mudou e pare.

### QA de conteúdo (obrigatória)

```bash
python scripts/slide_text.py output.pptx
```

Procure conteúdo faltando, erros de digitação, ordem errada.

**Ao usar modelos, procure texto de placeholder esquecido:**

```bash
python scripts/slide_text.py output.pptx | grep -iE "\bx{3,}\b|lorem|ipsum|\bTODO|\[insert|this.*(page|slide).*layout"
```

Se o grep retornar resultados, corrija-os antes de declarar sucesso.

### QA do arquivo (obrigatória)

```bash
python scripts/office/validate.py output.pptx                      # montada do zero
python scripts/office/validate.py output.pptx --original src.pptx  # montada a partir de um modelo
```

**Se a apresentação veio de um modelo, sempre passe `--original`.** Um modelo pode conter partes que o XSD rejeita, então uma execução sem ele pode relatar falhas que você nunca causou, e uma regressão genuína pode se esconder entre elas. O `--original` usa o modelo como base das verificações de esquema e de slide, suprimindo erros que ele já tinha. As verificações estruturais (relações, tipos de conteúdo, gráficos) ignoram `--original` e relatam problemas herdados do modelo de qualquer jeito, então leia-as pelo próprio mérito.

O pptxgenjs emite XML de gráfico que o PowerPoint se recusa a abrir e que todas as outras ferramentas aceitam: o python-pptx abre essas apresentações, o LibreOffice as renderiza, o XSD as aprova. Toda falha nomeia a correção. Corrija no gerador e reconstrua.

**Passar não é prova de arquivo válido:** o `validate.py` não pega tudo o que o PowerPoint repara (um elemento de gráfico repetido além do limite passa); ao apagar uma forma animada de um slide de modelo, apague também o elemento `<p:timing>` do slide (as animações vão com ele), ou o PowerPoint oferece reparar a apresentação.

### QA visual (obrigatória)

Converta os slides em imagens (veja [Convertendo em imagens](#convertendo-em-imagens)) e inspecione todos. Depois de ficar olhando o código gerador, a tendência é ver o que você espera, não o que foi renderizado, então olhe as imagens com olhos novos (um subagente funciona bem para isso, se você tiver um). Defeitos visíveis ao usuário para procurar:

- **Texto estourando ou cortado no limite de uma caixa ou do slide: confira isto primeiro.** É o defeito mais comum e sempre visível ao usuário. (Para uma fonte que o visualizador renderiza de forma pouco confiável, conforme Tipografia, a prévia é aproximada: confie na folga de ~10% que você deixou, não no encaixe aparente.)
- Elementos sobrepostos (texto atravessando formas, linhas atravessando palavras, elementos empilhados)
- Citações de fonte ou rodapés colidindo com o conteúdo acima
- Elementos muito próximos (lacunas < 0,3") ou cards/seções quase se tocando
- Lacunas irregulares (grande área vazia em um lugar, apertado em outro)
- Margem insuficiente das bordas do slide (< 0,5")
- Colunas ou elementos semelhantes sem alinhamento consistente
- Texto de baixo contraste (por exemplo, texto cinza claro sobre fundo creme)
- Decoração do modelo mal posicionada depois da troca de texto: por exemplo, um sublinhado de título posicionado para uma linha, mas o título trocado quebrou em duas
- Ícones de baixo contraste (por exemplo, ícones escuros sobre fundos escuros sem um círculo contrastante)
- Caixas de texto estreitas demais causando quebra excessiva
- Títulos em alturas diferentes, ou rótulos de gráfico com aparência diferente de um gráfico para outro, entre slides do mesmo tipo: compare os slides entre si, não só cada slide consigo mesmo
- Uma palavra ou número quebrado em duas linhas: uma palavra partida no meio, ou um valor separado da unidade ("26" em uma linha, "M" na seguinte)
- Conteúdo de placeholder esquecido

## Convertendo em imagens

Converta as apresentações em imagens de slides individuais para inspeção visual:

```bash
python scripts/office/soffice.py --headless --convert-to pdf output.pptx
rm -f slide-*.jpg
pdftoppm -jpeg -r 150 output.pdf slide
ls -1 "$PWD"/slide-*.jpg
```

**Passe os caminhos absolutos impressos acima diretamente à ferramenta de visualização.** O `rm` limpa imagens antigas de execuções anteriores. O `pdftoppm` preenche com zeros conforme o número de páginas: `slide-1.jpg` para apresentações com menos de 10 páginas, `slide-01.jpg` de 10 a 99, `slide-001.jpg` a partir de 100.

**Depois das correções, rode de novo os quatro comandos acima**: o PDF precisa ser regenerado a partir do `.pptx` editado antes de o `pdftoppm` refletir suas mudanças.

## Dependências

`pptxgenjs` (npm, já instalado; instale só se `require('pptxgenjs')` falhar) · `python-pptx`, `Pillow`, `defusedxml`, `lxml` (pip: slide_text, thumbnail, clean, validate) · LibreOffice (`soffice`, configurado automaticamente para ambientes isolados via `scripts/office/soffice.py`) · `pdftoppm` (Poppler)
