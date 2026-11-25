---
name: xlsx
description: "Use esta skill sempre que um arquivo de planilha for a entrada ou a saída principal. Ou seja, qualquer tarefa em que o usuário queira: abrir, ler, editar ou corrigir um .xlsx, .xlsm, .xltx, .csv ou .tsv existente (por exemplo adicionar colunas, calcular fórmulas, formatar, criar gráficos, limpar dados bagunçados); criar uma planilha nova do zero ou a partir de outras fontes de dados; ou converter entre formatos tabulares. Acione principalmente quando o usuário citar um arquivo de planilha pelo nome ou caminho, até de forma casual (\"o xlsx na minha pasta de downloads\"), e quiser algo feito com ele ou produzido a partir dele. Também para limpar ou reestruturar dados tabulares bagunçados (linhas malformadas, cabeçalhos fora do lugar, lixo) em planilhas adequadas. A entrega deve ser um arquivo de planilha. NÃO use quando a entrega principal for documento Word, relatório HTML, script Python isolado, pipeline de banco de dados ou integração com a API do Google Sheets, mesmo que haja dados tabulares."
license: Complete terms in LICENSE.txt
---

# Criação, edição e análise de XLSX

| Tarefa | Abordagem |
|---|---|
| **Criar** ou **editar** com fórmulas/formatação | `openpyxl`; veja as armadilhas abaixo |
| **Dados em massa** de entrada ou saída | `pandas` (`read_excel`, `to_excel`) |
| **Olhada rápida** em uma planilha | `markitdown file.xlsx`: `## NomeDaAba` por aba; lê `.xlsm` também. Sem coordenadas de célula, então não planeje edições a partir dele |
| **Ler** um modelo (fórmulas *e* valores) | duas passagens de `load_workbook`; veja as armadilhas |

> `openpyxl`, `pandas` e `markitdown` já vêm instalados: não rode `pip install` antes; escreva o script e importe direto. Só se um import falhar (ou o comando `markitdown` não existir): faça `pip install` do pacote que falta.

> Os caminhos de scripts abaixo são relativos ao diretório desta skill.

## Requisitos para toda saída

- **Fonte profissional** (Arial, Times New Roman) em todo o arquivo, a menos que o usuário diga outra coisa.
- **Zero erros de fórmula.** Nunca entregue enquanto o `recalc.py` informar `errors_found`; a única exceção está em `not_computed`, abaixo. Se você acha que um erro é anterior ao seu trabalho, prove: carregue o *original* com `data_only=True` e olhe aquela célula. Um erro que você introduziu é idêntico a um herdado.
- **Use fórmulas, nunca resultados fixos.** Escreva `sheet['B10'] = '=SUM(B2:B9)'`, não o total calculado em Python. A planilha deve recalcular quando as entradas mudarem.
- **Siga a especificação do usuário ao pé da letra.** Nomes exatos das abas, cabeçalhos exatos das colunas e a fórmula que ele descreveu. Um redesenho que calcula outra coisa falha, por mais elegante que seja.
- **Documente toda premissa e todo número fixo** onde o leitor vá ver: um comentário de célula ou uma célula ao lado, no fim de uma tabela. Cite uma fonte real quando houver (`Source: Company 10-K, FY2024, Page 45, Revenue Note, [SEC EDGAR URL]`); quando o número veio do usuário, diga isso claramente.
- **Uma pasta de trabalho que *você cria* para alguém preencher** precisa de uma legenda curta dizendo quais células editar e de uma linha de exemplo com valores realistas mostrando o formato esperado. Nunca adicione essa linha a um arquivo que lhe pediram para editar.
- **Ao editar um arquivo existente, siga exatamente as convenções dele.** Elas prevalecem sobre todas as diretrizes daqui. Encontre primeiro as células de entrada designadas (uma cor de fonte, preenchimento ou sombreamento distinto as marca), escreva só nelas e deixe todas as fórmulas existentes intactas.

## Recalcular (obrigatório sempre que o arquivo tiver fórmulas)

O openpyxl grava as fórmulas como texto, **sem valores em cache**. Até você recalcular, toda
célula com fórmula é lida como `None` por qualquer coisa que leia valores em cache: `pandas`,
`load_workbook(data_only=True)` e a maioria dos visualizadores.

```bash
python scripts/recalc.py output.xlsx [timeout_seconds]   # padrão 30
```

O LibreOffice calcula as fórmulas **em uma cópia**, só os valores vão para o seu arquivo, e você recebe um JSON:
`status` (`success` | `errors_found`), `total_formulas`, `total_errors` e um
`error_summary` com até 100 células por tipo de erro (`locations_truncated` diz quantas
foram omitidas; confie em `total_errors`, não no tamanho da lista). Corrija o que ele indicar e rode
de novo. **Um JSON com a chave `error` em vez de `status` significa que nada foi recalculado**, e
só esse caso sai com código diferente de zero; `errors_found` sai com 0, então nunca trate uma saída limpa como uma pasta de trabalho limpa.

**Um recalc verde prova que suas fórmulas *calculam*, não que estão *certas*.** Um
intervalo deslocado em um ou uma referência à linha errada gera um arquivo limpo, sem erros, com números errados.
Escreva 2–3 fórmulas primeiro e confira se puxam os valores esperados, antes de montar uma grade inteira.

**`not_computed` lista fórmulas que o LibreOffice não consegue avaliar, mesmo com `success`**: uma função que ele não tem
(`_xlfn.XLOOKUP`, `_xlfn.LET`…) ou um vínculo com outra pasta de trabalho (`='[1]Returns Analysis'!$B$2`). Elas
mantêm o que continham: depois de salvar com o openpyxl, nada, até o Excel abrir o arquivo. Para obter os números delas antes,
leia o original com `data_only=True`; mantenha as fórmulas. Uma fórmula correta que dependa de uma listada,
direta ou indiretamente, também informa `#NAME?`: deixe como está e avise o usuário. Uma célula que testa uma delas
(`IFERROR(B1,0)`) recebe o valor de contingência do LibreOffice, e um valor mantido pode estar desatualizado: avise. Depois de editar
o XML de uma planilha, apague o `<v>` de cada fórmula alterada: um erro que mantém o valor é listado, não relatado.

## Escolhendo fórmulas que sobrevivem à verificação

O LibreOffice implementa menos funções que o Excel, e uma fórmula que ele não consegue avaliar não tem valor
até o Excel abrir o arquivo.

- **Prefira funções da era do Excel 2007**: `SUMIFS`, `INDEX`, `MATCH`, `IFERROR`, `SUMPRODUCT`, que não precisam de prefixo.
- **Seis funções pós-2007 funcionam, mas só com o prefixo `_xlfn.`**, porque o openpyxl grava sua fórmula no XML literalmente e o Excel armazena nomes pós-2007 com prefixo (a interface esconde o prefixo): `_xlfn.TEXTJOIN`, `_xlfn.CONCAT`, `_xlfn.IFS`, `_xlfn.SWITCH`, `_xlfn.MAXIFS`, `_xlfn.MINIFS`. Escritas sem o prefixo, cada uma gera `#NAME?`.
- **Nunca use `XLOOKUP`, `XMATCH`, `SORT`, `FILTER`, `UNIQUE` nem `SEQUENCE`.** O LibreOffice do ambiente não consegue avaliá-las, e um que consiga preenche só a célula superior esquerda do resultado, já que um arquivo gravado pelo openpyxl não tem metadados de derramamento. Use `INDEX`/`MATCH` para buscas e ordene, filtre e remova duplicatas em Python antes de gravar as células.
- Um `)` faltando é relatado como `unbalanced brackets`. Argumentos de menos (`=ROUND(A1)`) não: o LibreOffice devolve um valor, e o Excel pode oferecer reparar o arquivo.

## Armadilhas do openpyxl

- **Ler um modelo exige dois carregamentos.** `data_only=True` entrega valores em cache sem as fórmulas; o padrão entrega o texto das fórmulas sem valores. Uma passagem não dá os dois.
- **`data_only=True` é destrutivo se você salvar.** Essa pasta de trabalho não tem mais fórmulas, então salvar substitui todas por valores literais, de forma permanente.
- **`data_only=True` em um arquivo que o openpyxl acabou de gravar devolve `None` em tudo**: rode o `recalc.py` antes. (Uma fórmula cujo resultado é `""` também é lida como `None`.)
- **Células mescladas: escreva só na âncora superior esquerda.** Toda outra célula do intervalo é um `MergedCell` cujo `.value` é somente leitura.
- **`.xlsm` perde as macros, a menos que você passe `keep_vba=True`** ao `load_workbook`.
- **Um nome de aba com espaço precisa de aspas** em uma referência entre abas: `='Assumptions Inputs'!$B$5`. Sem aspas, resulta em `#VALUE!`.
- **Salvar um arquivo enviado descarta suas caixas de texto, formas e segmentações.** Primeiro procure em `xl/drawings/` por `<xdr:sp ` (com o espaço) e verifique se há uma parte `xl/slicers/`; se houver, avise o usuário ou edite o XML da planilha diretamente.
- **Nada conserta uma pasta de trabalho malformada**: uma aspa não fechada em um formato de número (`'0.00 "USD'`), um nome definido começando com `=`, ou cabeçalhos de tabela duplicados ou vazios são salvos como escritos, e o Excel pode oferecer reparar o arquivo.
- **Texto de célula parcialmente em negrito ou itálico é achatado**, a menos que `load_workbook(rich_text=True)`; nesse caso o `.value` é um `CellRichText`, não um `str`.
- **Toda fórmula nova precisa do próprio `number_format`** (data, %, moeda): nada o infere, então uma data aparece como `45337` e 30% como `0.3`.
- **Em todo gráfico novo defina `chart.roundedCorners = False`, `.overlay = False` na legenda e em cada título que você criou (`chart.legend`, `chart.title`, `chart.x_axis.title`…) e, se tiver eixos (não pizza nem rosca), `chart.x_axis.delete = False` e `chart.y_axis.delete = False`**, ou o Excel pode desenhar o título ou a legenda sobre o gráfico, arredondar a moldura ou não desenhar os eixos.
- **Com um `DateAxis`, defina `chart.y_axis.crossAx = 500`**, ou o Excel pode oferecer reparar o arquivo.

## Modelos financeiros

A menos que o usuário diga outra coisa, ou o arquivo existente já faça de outro jeito.

**Cor:** texto azul (`0,0,255`) para entradas fixas e alavancas de cenário · preto para fórmulas ·
verde (`0,128,0`) para vínculos com outra aba · vermelho (`255,0,0`) para vínculos com outro arquivo ·
preenchimento amarelo (`255,255,0`) para premissas-chave e células que o usuário deve preencher.

**Números:** moeda `$#,##0`, com a unidade no cabeçalho (`Revenue ($mm)`) · zeros
aparecem como `-`, inclusive em percentuais (`$#,##0;($#,##0);-`) · negativos entre parênteses ·
percentuais `0.0%`, **armazenados como frações** (`0.15` aparece como `15.0%`; armazenar `15` aparece como
`1500.0%`) · múltiplos de avaliação `0.0x` · anos como texto (`"2024"`, nunca `2,024`).

**Estrutura:** cada premissa em sua própria célula rotulada, referenciada pelas fórmulas que a usam
(`=B5*(1+$B$6)`, nunca `=B5*1.05`) · fórmulas consistentes em todos os períodos projetados, já que uma
única célula editada no meio da linha é o erro silencioso mais comum · proteja denominadores que podem ser zero.

## Dependências

`openpyxl`, `pandas`, `markitdown` (pip, já instalados; instale só se um import falhar ou o comando não existir) · LibreOffice (`soffice`, configurado automaticamente para ambientes isolados via `scripts/office/soffice.py`)
