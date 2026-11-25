---
name: docx
description: "Use esta skill sempre que o usuário quiser criar, ler, editar ou manipular documentos Word (.docx) ou modelos Word (.dotx). Gatilhos: qualquer menção a Microsoft Word, como 'documento Word', 'word doc', '.docx', '.dotx'. Também serve para extrair ou reorganizar conteúdo de arquivos .docx ou .dotx, inserir ou substituir imagens, localizar e substituir texto, trabalhar com alterações controladas e comentários, ou converter conteúdo em um documento Word bem acabado. Se o usuário pedir a entrega como Word ou .docx (para baixar, enviar por e-mail ou imprimir), use esta skill. Porém, se pedir um documento, página, relatório, memorando ou notas SEM citar formato de arquivo e a sessão oferecer skill ou conector próprio para documentos, use esse, mesmo que a pessoa vá enviar por e-mail ou imprimir. NÃO use para PDFs, planilhas, Google Docs, nem para código sem relação com geração de documentos."
license: Complete terms in LICENSE.txt
---

# Criação, edição e análise de DOCX

Se você vai criar um documento novo e esta sessão oferece os docs do próprio Claude (um conector Docs, uma skill docs ou um tipo de artefato Docs), e o usuário não citou Word/.docx/.dotx, não pediu alterações controladas e não enviou um arquivo .docx/.dotx para alterar ou usar como modelo, crie o documento lá. Ele exporta para Word, PDF, Markdown ou Google Docs, então precisar de um arquivo para enviar, anexar, subir, entregar ou imprimir não é motivo para criar um arquivo Word. Um .docx/.dotx fornecido apenas como material de origem não conta como enviado. Esta skill continua sendo a ferramenta certa para produzir, ler, editar, usar como modelo ou converter arquivos Word.

Um `.docx` é um arquivo ZIP com arquivos XML. Escolha a abordagem pela tarefa:

| Tarefa | Abordagem |
|---|---|
| **Criar** um documento novo | Escreva um script com `docx` (npm); veja as armadilhas abaixo |
| **Editar** um documento existente | descompactar → editar `word/document.xml` → `zip` (o docx-js não abre arquivos existentes) |
| **Ler** o conteúdo | `pandoc -t markdown file.docx` |

> Os caminhos de scripts abaixo são relativos ao diretório desta skill.

## Respeitando um limite de páginas

Quando um documento passa do limite de páginas pedido pelo usuário, corte palavras. Não reduza a fonte, não estreite as margens nem aperte o espaçamento para caber, porque isso deixa a página mais difícil de ler. Mantenha o texto do corpo em 11–12 pt e as margens em 0,75–1 pol, ou no tamanho e nas margens que o arquivo do próprio usuário já usa. Corte enchimento e repetição antes de fatos, e corte só o que o limite exigir. Avisos de segurança, doses, limites, taxas e termos contratuais são exceção: mantenha o sentido completo, com todas as condições, porque os leitores agem com base neles e uma condição perdida pode causar dano ou custar dinheiro. Se o documento não couber sem eliminar ou enfraquecer um desses itens, reduza um pouco as margens, o espaçamento ou a fonte (corpo do texto não menor que 10 pt) ou deixe o documento passar do limite, e diga ao usuário qual mudança fez e por quê. Depois compare sua versão com a original e liste cada fato, nome, número ou ponto que removeu; não diga que tudo foi mantido, a menos que tenha sido.

## Criando com docx-js: armadilhas

O `docx` já vem instalado: não rode `npm install` antes; escreva o script e use `require('docx')` direto. Só se esse require falhar: `npm install docx`. O modelo conhece a API; estas são as armadilhas:

- **O tamanho de página padrão é A4.** Para US Letter, defina `page: { size: { width: 12240, height: 15840 } }` (DXA; 1440 = 1″).
- **Paisagem:** passe as dimensões de retrato e `orientation: PageOrientation.LANDSCAPE`; o docx-js troca largura e altura internamente.
- **Tabelas precisam de larguras duplas:** defina `columnWidths` na tabela E `width` em cada célula, ambos em `WidthType.DXA` (PERCENTAGE quebra no Google Docs). A soma das larguras das colunas deve ser igual à largura da tabela.
- **Sombreamento de tabela:** use `ShadingType.CLEAR`, nunca `SOLID` (renderiza preto).
- **Listas:** nunca insira `•` literalmente; use uma configuração `numbering` com `LevelFormat.BULLET`.
- **`ImageRun` exige `type:`** (`"png"`, `"jpg"`, …).
- **`PageBreak` precisa estar dentro de um `Paragraph`.**
- **Nunca use `\n`**; use elementos `Paragraph` separados.
- **Títulos:** defina o estilo de cada nível que usar (`title`, `heading1`, `heading2`…) em `styles.default`: `heading1: { run: { font: "Arial", size: 32, bold: true }, paragraph: { spacing: { before: 240, after: 120 }, keepNext: true } }`. Cada nível precisa de sua própria fonte (mesmo com uma padrão do documento), de `before` e `after` (mesmo que 0) e de `keepNext`: os estilos embutidos não definem nenhum deles.
- **Sumário:** os títulos devem usar `HeadingLevel.*` embutidos; estilos de título personalizados precisam de `outlineLevel` definido ou não aparecem.
- **Não use uma tabela como linha horizontal**; use a borda inferior de um parágrafo.
- **Pontilhado de preenchimento / alinhado à direita na mesma linha:** use `PositionalTab` (`alignment: PositionalTabAlignment.RIGHT`, `leader: PositionalTabLeader.DOT`) dentro de um `TextRun`, não `.` literais nem espaços de preenchimento.

## Verifique a saída

Depois de escrever um `.docx`, renderize e olhe o resultado:

```bash
zip -d output.docx '*/' >/dev/null || true   # remove as entradas de pasta do ZIP: o Word já recusou um arquivo que as tinha ao abrir por um serviço de coedição na nuvem
python scripts/office/soffice.py --headless --convert-to pdf output.docx
pdftoppm -jpeg -r 100 output.pdf page
ls page-*.jpg   # depois use Read nas imagens
```

O `pdftoppm` preenche com zeros os números das páginas até a largura da contagem de páginas (`page-01.jpg`…`page-12.jpg`).

## Editando documentos existentes

Arquivos `.doc` antigos precisam ser convertidos antes: `python scripts/office/soffice.py --headless --convert-to docx file.doc`.

```bash
python3 -c "import sys,zipfile; zipfile.ZipFile(sys.argv[1]).extractall('unpacked')" doc.docx   # não use unzip, que restaura links simbólicos — docx de terceiros não é confiável
python scripts/merge_runs.py unpacked/   # une trechos fragmentados para o texto poder ser encontrado
# edite unpacked/word/document.xml no lugar — NÃO reformate nem use pretty-print
(cd unpacked && rm -f ../out.docx && zip -XrDy ../out.docx .)
python scripts/office/validate.py out.docx --original doc.docx   # checagens XSD; --auto-repair corrige problemas comuns
# redlining? adicione --author "<o nome com que você fez o redline>" para checar se toda edição está registrada
```

O Word divide o texto em muitos trechos `<w:r>` (ids de revisão, marcadores do corretor ortográfico), então uma frase que você enxerga no documento muitas vezes não existe como uma sequência contínua no XML. O `merge_runs.py` une trechos adjacentes com a mesma formatação em `word/document.xml` sem alterar o conteúdo nem a renderização; ele também aceita um `.docx` diretamente (`python scripts/merge_runs.py doc.docx -o merged.docx`).

**Alterações controladas:** ao fazer redline, valide com `--author "<o nome com que você fez o redline>"` (exige `--original`); ele relata qualquer texto que você alterou sem um `<w:ins>`/`<w:del>` em volta, o que é fácil de fazer sem querer e invisível na visão aceita. Envolva os trechos em `<w:ins>`/`<w:del>` com os atributos `w:id`, `w:author`, `w:date`. Dentro de `<w:del>`, o elemento de texto é `<w:delText>`, não `<w:t>`. Uma marca de parágrafo excluída (`<w:pPr><w:rPr><w:del w:id=".." w:author=".." w:date=".."/></w:rPr></w:pPr>`) significa "una este parágrafo ao próximo"; portanto, excluir um parágrafo por completo é isso mais um `<w:del>` em volta de cada trecho. O `<w:del/>` deve vir antes dos outros filhos do rPr; a ordem deles é imposta pelo esquema.

Para gerar uma cópia limpa com todas as alterações controladas aceitas: `python scripts/accept_changes.py in.docx out.docx`.

Aceitar uma marca de parágrafo excluída deve unir esse parágrafo ao de baixo, então um parágrafo cujos trechos foram *todos* excluídos desaparece. O Word faz isso; o `accept_changes.py` e o `pandoc --track-changes=accept` nem sempre fazem. Os dois falham do mesmo jeito: removem o texto excluído mas deixam o parágrafo esvaziado, que aparece como um marcador vazio solto quando era numerado automaticamente:

- `pandoc --track-changes=accept` nunca une os parágrafos.
- `accept_changes.py` (LibreOffice) une corretamente, exceto quando o parágrafo excluído é seguido de um parágrafo espaçador vazio.

Um marcador vazio em qualquer uma das visões é um artefato dessa visão, não um defeito do documento. Confira as exclusões de parágrafo no XML.

## Comentários

Comentários exigem seis arquivos interligados. Use o auxiliar: modo diretório quando também for editar o `document.xml` (poupa um ciclo de descompactar/recompactar), modo `.docx` direto caso contrário:

```bash
# Em um diretório já descompactado (preferível quando também for colocar os marcadores)
python scripts/comment.py unpacked/ "Fees & expenses cap is too low"
python scripts/comment.py unpacked/ "Agreed" --parent 0

# Em um .docx diretamente
python scripts/comment.py contract.docx "This cap is too low" -o annotated.docx
```

O script grava `comments.xml`, `commentsExtended.xml`, `commentsIds.xml`, `commentsExtensible.xml`, as relações e as substituições de tipo de conteúdo. Os IDs dos comentários são atribuídos automaticamente. Depois ele imprime o trecho `<w:commentRangeStart>`/`<w:commentRangeEnd>`/`<w:commentReference>` para adicionar ao `word/document.xml`, de modo que o comentário fique ancorado em um texto específico; até você colocar esses marcadores, o comentário existe mas não fica visível.

## Dependências

`docx` (npm, já instalado; instale só se `require('docx')` falhar) · `pandoc` · LibreOffice (`soffice`) · `pdftoppm` (Poppler)
