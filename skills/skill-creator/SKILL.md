---
name: skill-creator
description: "Cria novas skills, modifica e melhora skills existentes e mede o desempenho delas. Use quando o usuário quiser criar uma skill do zero, editar ou otimizar uma skill existente, rodar evals para testá-la, fazer benchmark com análise de variância ou otimizar a descrição de uma skill para acionar com mais precisão."
---

# Skill Creator

Uma skill para criar novas skills e melhorá-las de forma iterativa.

De forma geral, o processo de criar uma skill é assim:

- Decida o que você quer que a skill faça e, mais ou menos, como
- Escreva um rascunho da skill
- Crie alguns prompts de teste e rode o claude-com-acesso-à-skill neles
- Ajude o usuário a avaliar os resultados de forma qualitativa e quantitativa
  - Enquanto as execuções rodam em segundo plano, redija algumas avaliações quantitativas se não houver (se já existirem, você pode usá-las como estão ou modificá-las se achar que algo precisa mudar). Depois explique-as ao usuário (ou, se já existiam, explique as que já existem)
  - Use o script `eval-viewer/generate_review.py` para mostrar os resultados ao usuário, para que ele os veja, e deixe-o ver também as métricas quantitativas
- Reescreva a skill com base no feedback da avaliação do usuário sobre os resultados (e também se houver falhas gritantes que apareçam nos benchmarks quantitativos)
- Repita até ficar satisfeito
- Amplie o conjunto de testes e tente de novo em escala maior

Seu trabalho ao usar esta skill é descobrir em que ponto desse processo o usuário está e então entrar e ajudá-lo a avançar pelas etapas. Por exemplo, talvez ele diga "quero fazer uma skill para X". Você pode ajudar a delimitar o que ele quer dizer, escrever um rascunho, escrever os casos de teste, definir como ele quer avaliar, rodar todos os prompts e repetir.

Por outro lado, talvez ele já tenha um rascunho da skill. Nesse caso, você pode ir direto para a parte de avaliar/iterar do ciclo.

Claro, você deve sempre ser flexível, e se o usuário disser "não preciso rodar um monte de avaliações, só quero trocar ideia", você pode fazer isso.

Depois que a skill estiver pronta (mas, de novo, a ordem é flexível), você também pode rodar o otimizador de descrição de skill, para o qual temos um script à parte, para otimizar o acionamento da skill.

Legal? Legal.

## Comunicando-se com o usuário

O skill creator tende a ser usado por pessoas com níveis muito diferentes de familiaridade com o jargão de programação. Se você não ficou sabendo (e como ficaria, só começou muito recentemente), há uma tendência agora em que o poder do Claude está inspirando encanadores a abrir seus terminais e pais e avós a pesquisar "como instalar npm". Por outro lado, a maioria dos usuários provavelmente tem bastante familiaridade com computadores.

Então preste atenção aos sinais de contexto para entender como formular sua comunicação! No caso padrão, só para você ter uma ideia:

- "avaliação" e "benchmark" estão no limite, mas tudo bem
- para "JSON" e "assertion" (asserção), você precisa ver sinais claros do usuário de que ele sabe o que são antes de usá-los sem explicar

Tudo bem explicar termos brevemente se estiver em dúvida, e fique à vontade para esclarecer termos com uma definição curta se não tiver certeza de que o usuário vai entender.

---

## Criando uma skill

### Capture a intenção

Comece entendendo a intenção do usuário. A conversa atual pode já conter um fluxo de trabalho que o usuário quer capturar (por exemplo, ele diz "transforme isso em uma skill"). Se for o caso, extraia primeiro as respostas do histórico da conversa: as ferramentas usadas, a sequência de passos, as correções que o usuário fez, os formatos de entrada/saída observados. O usuário pode precisar preencher as lacunas e deve confirmar antes de você seguir para o próximo passo.

1. O que esta skill deve permitir que o Claude faça?
2. Quando esta skill deve ser acionada? (quais frases/contextos do usuário)
3. Qual é o formato de saída esperado?
4. Devemos montar casos de teste para verificar que a skill funciona? Skills com saídas objetivamente verificáveis (transformações de arquivos, extração de dados, geração de código, passos fixos de fluxo de trabalho) se beneficiam de casos de teste. Skills com saídas subjetivas (estilo de escrita, arte) muitas vezes não precisam. Sugira o padrão apropriado conforme o tipo de skill, mas deixe o usuário decidir.

### Entreviste e pesquise

Faça perguntas proativamente sobre casos de borda, formatos de entrada/saída, arquivos de exemplo, critérios de sucesso e dependências. Espere para escrever prompts de teste até ter acertado essa parte.

Confira os MCPs disponíveis: se forem úteis para pesquisa (buscar documentação, encontrar skills semelhantes, consultar boas práticas), pesquise em paralelo por subagentes, se disponíveis, ou direto, se não. Venha preparado com contexto para reduzir a carga sobre o usuário.

### Escreva o SKILL.md

Com base na entrevista com o usuário, preencha estes componentes:

- **name**: identificador da skill
- **description**: quando acionar e o que faz. É o principal mecanismo de acionamento: inclua tanto o que a skill faz QUANTO os contextos específicos em que usá-la. Toda a informação de "quando usar" vai aqui, não no corpo. Observação: atualmente o Claude tem tendência a "subacionar" skills, ou seja, a não usá-las quando seriam úteis. Para combater isso, deixe as descrições das skills um pouco "insistentes". Por exemplo, em vez de "Como montar um painel simples e rápido para exibir dados internos da Anthropic.", você poderia escrever "Como montar um painel simples e rápido para exibir dados internos da Anthropic. Use esta skill sempre que o usuário mencionar painéis, visualização de dados, métricas internas ou quiser exibir qualquer tipo de dado da empresa, mesmo que ele não peça explicitamente um 'painel'."
- **compatibility**: ferramentas e dependências necessárias (opcional, raramente necessário)
- **o resto da skill :)**

### Guia de escrita de skills

#### Anatomia de uma skill

```
skill-name/
├── SKILL.md (obrigatório)
│   ├── Frontmatter YAML (name e description obrigatórios)
│   └── Instruções em Markdown
└── Recursos incluídos (opcional)
    ├── scripts/    - Código executável para tarefas determinísticas/repetitivas
    ├── references/ - Documentos carregados no contexto conforme necessário
    └── assets/     - Arquivos usados na saída (modelos, ícones, fontes)
```

#### Divulgação progressiva

As skills usam um sistema de carregamento em três níveis:
1. **Metadados** (name + description): sempre no contexto (~100 palavras)
2. **Corpo do SKILL.md**: no contexto sempre que a skill é acionada (<500 linhas é o ideal)
3. **Recursos incluídos**: conforme necessário (ilimitados, scripts podem executar sem serem carregados)

Essas contagens de palavras são aproximadas e você pode ir além se precisar.

**Padrões principais:**
- Mantenha o SKILL.md abaixo de 500 linhas; se estiver se aproximando desse limite, adicione uma camada extra de hierarquia com indicações claras de para onde o modelo que usa a skill deve ir em seguida
- Referencie os arquivos claramente a partir do SKILL.md, com orientação sobre quando lê-los
- Para arquivos de referência grandes (>300 linhas), inclua um índice

**Organização por domínio**: quando uma skill suporta vários domínios/frameworks, organize por variante:
```
cloud-deploy/
├── SKILL.md (fluxo de trabalho + seleção)
└── references/
    ├── aws.md
    ├── gcp.md
    └── azure.md
```
O Claude lê só o arquivo de referência relevante.

#### Princípio da ausência de surpresa

Nem precisa dizer, mas skills não devem conter malware, código de exploração ou qualquer conteúdo que possa comprometer a segurança do sistema. O conteúdo de uma skill não deve surpreender o usuário quanto à sua intenção, se descrito. Não aceite pedidos para criar skills enganosas ou projetadas para facilitar acesso não autorizado, exfiltração de dados ou outras atividades maliciosas. Coisas como "faça o papel de um XYZ" são aceitáveis.

#### Padrões de escrita

Prefira o modo imperativo nas instruções.

**Definindo formatos de saída**: você pode fazer assim:
```markdown
## Report structure
ALWAYS use this exact template:
# [Title]
## Executive summary
## Key findings
## Recommendations
```

**Padrão de exemplos**: é útil incluir exemplos. Você pode formatá-los assim (mas se "Input" e "Output" estiverem nos exemplos, talvez valha desviar um pouco):
```markdown
## Commit message format
**Example 1:**
Input: Added user authentication with JWT tokens
Output: feat(auth): implement JWT-based authentication
```

### Estilo de escrita

Tente explicar ao modelo por que as coisas são importantes, em vez de usar DEVEs pesados e bolorentos. Use teoria da mente e tente deixar a skill geral, não restrita a exemplos específicos. Comece escrevendo um rascunho e depois olhe para ele com olhos novos e melhore.

### Casos de teste

Depois de escrever o rascunho da skill, pense em 2-3 prompts de teste realistas: o tipo de coisa que um usuário de verdade diria. Compartilhe-os com o usuário: [você não precisa usar exatamente estas palavras] "Aqui estão alguns casos de teste que gostaria de tentar. Parecem certos, ou você quer adicionar mais?" Depois execute-os.

Salve cada caso de teste em sua própria pasta dentro de `evals/` no diretório da skill. Não escreva asserções ainda: só os prompts. Você vai redigir as asserções no próximo passo, enquanto as execuções estão em andamento.

```
my-skill/
├── SKILL.md
└── evals/
    └── flags-negative-quantity/   # o nome do caso: minúsculas-com-hífens, diz o que está sendo testado
        ├── prompt.md              # configurações da execução e depois o prompt da tarefa do usuário
        ├── case.yaml              # o nome e como é um bom resultado
        ├── graders/               # um arquivo por asserção; um marcador até o Passo 2
        └── files/                 # arquivos de entrada, só se o teste precisar de algum
```

Antes de escrever o primeiro, leia a seção "Test cases" de `references/schemas.md` e copie os modelos dela, porque o formato é rígido. São arquivos simples que você mesmo escreve e lê, então isso funciona igual em qualquer lugar, sem ferramentas extras. O layout é o que o `claude plugin eval` lê, então um usuário que tenha o Claude Code pode depois rodar exatamente os mesmos testes em um terminal ou no CI.

**Se a skill já tiver um `evals/evals.json`** (o formato mais antigo), os testes dele continuam valendo: rode-os junto com as pastas de casos, como um único conjunto. O arquivo pertence ao usuário, então nunca o edite, converta ou apague, a menos que ele peça; qualquer coisa nova ou alterada vai em uma pasta de caso. A seção "evals.json" de `references/schemas.md` explica como os dois conjuntos se combinam.

## Executando e avaliando os casos de teste

Esta seção é uma sequência contínua: não pare no meio. NÃO use `/skill-test` nem qualquer outra skill de teste.

Coloque os resultados em `<skill-name>-workspace/`, ao lado do diretório da skill. Dentro do workspace, organize os resultados por iteração (`iteration-1/`, `iteration-2/` etc.) e, dentro dela, cada caso de teste tem um diretório com o nome do caso. Mantenha os mesmos nomes de diretório de uma iteração para a outra, porque o visualizador associa uma execução à saída e ao feedback anteriores por esse caminho. Não crie tudo isso de antemão: crie os diretórios conforme avança.

```
<skill-name>-workspace/
└── iteration-1/
    ├── flags-negative-quantity/  # um diretório por caso de teste
    │   ├── eval_metadata.json    # o visualizador pega o prompt daqui
    │   ├── with_skill/           # uma configuração; com uma só execução, também é o diretório da execução
    │   │   ├── outputs/          # os arquivos que a execução produziu
    │   │   ├── grading.json
    │   │   └── timing.json
    │   └── without_skill/        # a linha de base (ou old_skill/), com o mesmo conteúdo
    ├── handles-empty-file/
    ├── benchmark.json
    └── benchmark.md
```

Respeite esse layout, porque o visualizador e o script de agregação leem a partir dele. Um diretório de execução é aquele que contém `outputs/`, `grading.json` e `timing.json` de uma execução. Se você rodar uma configuração mais de uma vez, dê a cada execução o seu próprio diretório dentro dela (`with_skill/run-1/`, `with_skill/run-2/`, ...); o `eval_metadata.json` fica onde está.

### Passo 1: Dispare todas as execuções (com a skill E a linha de base) no mesmo turno

Para cada caso de teste, dispare dois subagentes no mesmo turno: um com a skill, um sem. Isso é importante: não dispare primeiro as execuções com a skill e depois volte para as linhas de base. Lance tudo de uma vez para que termine mais ou menos ao mesmo tempo.

**Execução com a skill:**

```
Execute this task:
- Skill path: <path-to-skill>
- Task: <eval prompt>
- Input files: <full paths of the test's input files, or "none">
- Save outputs to: <workspace>/iteration-<N>/<case-name>/with_skill/outputs/
- Outputs to save: <what the user cares about — e.g., "the .docx file", "the final CSV">
```

**Execução da linha de base** (mesmo prompt, mas a linha de base depende do contexto):
- **Criando uma skill nova**: nenhuma skill. Mesmo prompt, sem caminho de skill, salve em `without_skill/outputs/`.
- **Melhorando uma skill existente**: a versão antiga. Antes de editar, tire um instantâneo da skill (`cp -r <skill-path> <workspace>/skill-snapshot/`) e aponte o subagente da linha de base para o instantâneo. Salve em `old_skill/outputs/`.

Escreva um `eval_metadata.json` para cada caso de teste (as asserções podem ficar vazias por enquanto), diretamente no diretório do caso de teste, ao lado de `with_skill/`. O visualizador e o benchmark nunca olham dentro da pasta `evals/` da skill: este arquivo é de onde eles tiram o prompt, e sem ele o visualizador mostra "(No prompt found)". Escreva-o de novo para cada caso de teste em cada iteração: não presuma que ele se mantém das iterações anteriores.

```json
{
  "eval_name": "flags-negative-quantity",
  "prompt": "The user's task prompt",
  "assertions": []
}
```

`eval_name` é o nome do caso, `prompt` é o prompt do teste sem o bloco de configurações, e `assertions` lista as asserções dele (nunca o avaliador-marcador).

### Passo 2: Enquanto as execuções estão em andamento, redija as asserções

Não fique só esperando as execuções terminarem: você pode usar esse tempo de forma produtiva. Redija asserções quantitativas para cada caso de teste e explique-as ao usuário. Se um teste já tiver asserções (arquivos na pasta `graders/` além do marcador, ou `expectations` / `assertions` em um `evals/evals.json` antigo), revise-as e explique o que verificam.

Boas asserções são objetivamente verificáveis e têm nomes descritivos: devem ser lidas com clareza no visualizador de benchmark, para que quem der uma olhada nos resultados entenda de imediato o que cada uma verifica. Skills subjetivas (estilo de escrita, qualidade de design) são mais bem avaliadas de forma qualitativa: não force asserções em coisas que precisam de julgamento humano.

Depois de redigidas, salve cada asserção em seu próprio arquivo na pasta `graders/` do caso, apague o marcador e coloque as mesmas frases na lista `assertions` do `eval_metadata.json` desse teste. Escreva cada asserção sobre o próprio resultado ("summary.md states a total revenue of 693.5"), não sobre onde este fluxo de trabalho o salva ("…na pasta outputs"), para que ela também valha no `claude plugin eval`.

Para um teste que você deixa para o julgamento humano, mantenha o marcador. Ele só existe para que o `claude plugin eval` consiga carregar o caso, então não é avaliado aqui.

Explique também ao usuário o que ele verá no visualizador: tanto as saídas qualitativas quanto o benchmark quantitativo.

### Passo 3: Conforme as execuções terminam, capture os dados de tempo

Quando cada tarefa de subagente terminar, você recebe uma notificação com `total_tokens` e `duration_ms`. Salve esses dados imediatamente em `timing.json` no diretório da execução:

```json
{
  "total_tokens": 84852,
  "duration_ms": 23332,
  "total_duration_seconds": 23.3
}
```

Esta é a única oportunidade de capturar esses dados: eles chegam pela notificação da tarefa e não são guardados em outro lugar. Processe cada notificação à medida que chega, em vez de tentar agrupá-las.

### Passo 4: Avalie, agregue e abra o visualizador

Quando todas as execuções terminarem:

1. **Avalie cada execução**: dispare um subagente avaliador (ou avalie direto) que leia `agents/grader.md` e avalie cada asserção contra as saídas. Salve os resultados em `grading.json` em cada diretório de execução. O array expectations do grading.json deve usar os campos `text`, `passed` e `evidence` (não `name`/`met`/`details` nem outras variantes): o visualizador depende desses nomes de campo exatos. Para asserções que podem ser verificadas por programa, escreva e rode um script em vez de avaliar a olho: scripts são mais rápidos, mais confiáveis e podem ser reutilizados entre iterações.

2. **Agregue em um benchmark**: rode o script de agregação a partir do diretório do skill-creator:
   ```bash
   python -m scripts.aggregate_benchmark <workspace>/iteration-N --skill-name <name>
   ```
   Isso produz `benchmark.json` e `benchmark.md` com pass_rate, tempo e tokens de cada configuração, com média ± desvio-padrão e a diferença. Se gerar o benchmark.json manualmente, veja `references/schemas.md` para o esquema exato que o visualizador espera.
Coloque cada versão with_skill antes da sua contraparte de linha de base.

3. **Faça uma passada de analista**: leia os dados do benchmark e traga à tona padrões que as estatísticas agregadas podem esconder. Veja `agents/analyzer.md` (a seção "Analyzing Benchmark Results") para saber o que procurar: asserções que sempre passam independentemente da skill (não discriminantes), avaliações de alta variância (possivelmente instáveis) e trocas entre tempo e tokens. Adicione suas observações à lista `notes` do `benchmark.json`, depois de quaisquer observações que o script já escreveu ali; não as substitua.

4. **Abra o visualizador** com as saídas qualitativas e os dados quantitativos:
   ```bash
   nohup python <skill-creator-path>/eval-viewer/generate_review.py \
     <workspace>/iteration-N \
     --skill-name "my-skill" \
     --benchmark <workspace>/iteration-N/benchmark.json \
     > /dev/null 2>&1 &
   VIEWER_PID=$!
   ```
   Da iteração 2 em diante, passe também `--previous-workspace <workspace>/iteration-<N-1>`.

   **Ambientes Cowork / sem interface:** se `webbrowser.open()` não estiver disponível ou o ambiente não tiver tela, use `--static <output_path>` para gravar um arquivo HTML autônomo em vez de iniciar um servidor. O feedback será baixado como um arquivo `feedback.json` quando o usuário clicar em "Submit All Reviews". Depois do download, copie o `feedback.json` para o diretório do workspace para a próxima iteração pegar.

Observação: use o generate_review.py para criar o visualizador; não é preciso escrever HTML personalizado.

5. **Avise o usuário** com algo como: "Abri os resultados no seu navegador. Há duas abas: 'Outputs' permite navegar por cada caso de teste e deixar feedback, 'Benchmark' mostra a comparação quantitativa. Quando terminar, volte aqui e me avise."

### O que o usuário vê no visualizador

A aba "Outputs" mostra um caso de teste por vez:
- **Prompt**: a tarefa que foi dada
- **Output**: os arquivos que a skill produziu, renderizados inline quando possível
- **Previous Output** (iteração 2+): seção recolhida mostrando a saída da iteração anterior
- **Formal Grades** (se a avaliação foi executada): seção recolhida mostrando a aprovação/reprovação das asserções
- **Feedback**: uma caixa de texto que salva automaticamente enquanto ele digita
- **Previous Feedback** (iteração 2+): os comentários dele da vez anterior, mostrados abaixo da caixa de texto

A aba "Benchmark" mostra o resumo das estatísticas: taxas de aprovação, tempo e uso de tokens de cada configuração, com detalhamento por avaliação e observações do analista.

A navegação é pelos botões anterior/próximo ou pelas setas do teclado. Quando termina, ele clica em "Submit All Reviews", que salva todo o feedback em `feedback.json`.

### Passo 5: Leia o feedback

Quando o usuário disser que terminou, leia o `feedback.json`:

```json
{
  "reviews": [
    {"run_id": "flags-negative-quantity-with_skill", "feedback": "the chart is missing axis labels", "timestamp": "..."},
    {"run_id": "handles-empty-file-with_skill", "feedback": "", "timestamp": "..."},
    {"run_id": "csv-summary-2-with_skill", "feedback": "perfect, love this", "timestamp": "..."}
  ],
  "status": "complete"
}
```

Feedback vazio significa que o usuário achou que estava bom. Concentre suas melhorias nos casos de teste em que o usuário teve reclamações específicas.

Encerre o servidor do visualizador quando terminar de usá-lo:

```bash
kill $VIEWER_PID 2>/dev/null
```

---

## Melhorando a skill

Este é o coração do ciclo. Você rodou os casos de teste, o usuário revisou os resultados e agora você precisa melhorar a skill com base no feedback dele.

### Como pensar nas melhorias

1. **Generalize a partir do feedback.** A grande questão aqui é que estamos tentando criar skills que possam ser usadas um milhão de vezes (talvez literalmente, talvez mais, quem sabe) em muitos prompts diferentes. Aqui você e o usuário estão iterando sobre apenas alguns exemplos, repetidamente, porque isso ajuda a andar mais rápido. O usuário conhece esses exemplos de cabo a rabo e avalia rápido as novas saídas. Mas se a skill que vocês desenvolvem juntos só funciona para esses exemplos, ela é inútil. Em vez de fazer mudanças minuciosas e superajustadas, ou DEVEs opressivamente restritivos, se houver um problema teimoso, você pode tentar ramificar e usar metáforas diferentes, ou recomendar outros padrões de trabalho. É relativamente barato tentar e talvez você chegue a algo ótimo.

2. **Mantenha o prompt enxuto.** Remova o que não está pagando o seu custo. Leia as transcrições, não apenas as saídas finais: se parecer que a skill faz o modelo perder muito tempo com coisas improdutivas, você pode tentar eliminar as partes da skill que causam isso e ver o que acontece.

3. **Explique o porquê.** Esforce-se para explicar o **porquê** de tudo o que você pede ao modelo. Os LLMs de hoje são *inteligentes*. Eles têm boa teoria da mente e, com um bom arcabouço, podem ir além de instruções mecânicas e realmente fazer as coisas acontecerem. Mesmo que o feedback do usuário seja lacônico ou frustrado, tente realmente entender a tarefa e por que o usuário escreveu o que escreveu, e o que de fato escreveu, e transmita esse entendimento nas instruções. Se você se pegar escrevendo SEMPRE ou NUNCA em maiúsculas, ou usando estruturas super rígidas, é um sinal amarelo: se possível, reformule e explique o raciocínio para que o modelo entenda por que o que você pede é importante. Essa é uma abordagem mais humana, poderosa e eficaz.

4. **Procure trabalho repetido entre os casos de teste.** Leia as transcrições das execuções de teste e note se os subagentes escreveram, cada um por conta própria, scripts auxiliares parecidos ou adotaram a mesma abordagem de vários passos para algo. Se os 3 casos de teste levaram o subagente a escrever um `create_docx.py` ou um `build_chart.py`, é um forte sinal de que a skill deveria incluir esse script. Escreva-o uma vez, coloque-o em `scripts/` e diga à skill para usá-lo. Isso poupa cada invocação futura de reinventar a roda.

Esta tarefa é bem importante (estamos tentando criar bilhões por ano em valor econômico aqui!) e o seu tempo de raciocínio não é o gargalo; leve o tempo que precisar e pondere com calma. Sugiro escrever um rascunho de revisão e depois olhá-lo de novo e fazer melhorias. Esforce-se de verdade para se colocar na cabeça do usuário e entender o que ele quer e precisa.

### O ciclo de iteração

Depois de melhorar a skill:

1. Aplique suas melhorias à skill
2. Rode de novo todos os casos de teste em um novo diretório `iteration-<N+1>/`, incluindo as execuções de linha de base. Se estiver criando uma skill nova, a linha de base é sempre `without_skill` (nenhuma skill): isso se mantém igual entre as iterações. Se estiver melhorando uma skill existente, use seu julgamento sobre qual linha de base faz sentido: a versão original com que o usuário chegou ou a iteração anterior.
3. Abra o revisor com `--previous-workspace` apontando para a iteração anterior
4. Espere o usuário revisar e dizer que terminou
5. Leia o novo feedback, melhore de novo, repita

Continue até que:
- O usuário diga que está satisfeito
- O feedback esteja todo vazio (tudo parece bom)
- Você não esteja fazendo progresso significativo

---

## Avançado: comparação cega

Para situações em que você quer uma comparação mais rigorosa entre duas versões de uma skill (por exemplo, o usuário pergunta "a nova versão é realmente melhor?"), há um sistema de comparação cega. Leia `agents/comparator.md` e `agents/analyzer.md` para os detalhes. A ideia básica é: entregar duas saídas a um agente independente, sem dizer qual é qual, e deixá-lo julgar a qualidade. Depois analisar por que o vencedor venceu.

É opcional, exige subagentes e a maioria dos usuários não vai precisar. O ciclo de revisão humana geralmente basta.

---

## Otimização da descrição

O campo description no frontmatter do SKILL.md é o principal mecanismo que determina se o Claude invoca uma skill. Depois de criar ou melhorar uma skill, ofereça-se para otimizar a descrição para um acionamento mais preciso.

### Passo 1: Gere consultas de avaliação de acionamento

Crie 20 consultas de avaliação: uma mistura de as que devem acionar e as que não devem. Salve como JSON:

```json
[
  {"query": "the user prompt", "should_trigger": true},
  {"query": "another prompt", "should_trigger": false}
]
```

As consultas devem ser realistas e algo que um usuário do Claude Code ou do Claude.ai realmente digitaria. Não pedidos abstratos, mas pedidos concretos e específicos, com boa quantidade de detalhes. Por exemplo, caminhos de arquivo, contexto pessoal sobre o trabalho ou a situação do usuário, nomes de colunas e valores, nomes de empresas, URLs. Um pouco de história de fundo. Algumas podem estar em minúsculas ou conter abreviações, erros de digitação ou fala informal. Use uma mistura de tamanhos diferentes e foque em casos de borda em vez de casos óbvios (o usuário terá a chance de aprovar).

Ruim: `"Format this data"`, `"Extract text from PDF"`, `"Create a chart"`

Bom: `"ok so my boss just sent me this xlsx file (its in my downloads, called something like 'Q4 sales final FINAL v2.xlsx') and she wants me to add a column that shows the profit margin as a percentage. The revenue is in column C and costs are in column D i think"`

Para as consultas que **devem acionar** (8-10), pense em cobertura. Você quer formulações diferentes da mesma intenção: algumas formais, outras casuais. Inclua casos em que o usuário não cita explicitamente a skill nem o tipo de arquivo, mas claramente precisa dela. Coloque alguns usos incomuns e casos em que esta skill concorre com outra mas deveria vencer.

Para as consultas que **não devem acionar** (8-10), as mais valiosas são as quase-acertos: consultas que compartilham palavras-chave ou conceitos com a skill mas na verdade precisam de outra coisa. Pense em domínios adjacentes, formulações ambíguas em que uma correspondência ingênua de palavras-chave acionaria mas não deveria, e casos em que a consulta toca em algo que a skill faz mas em um contexto em que outra ferramenta é mais apropriada.

O ponto principal a evitar: não faça consultas que não devem acionar serem obviamente irrelevantes. "Escreva uma função de Fibonacci" como teste negativo para uma skill de PDF é fácil demais: não testa nada. Os casos negativos devem ser genuinamente difíceis.

### Passo 2: Revise com o usuário

Apresente o conjunto de avaliação ao usuário para revisão usando o modelo HTML:

1. Leia o modelo em `assets/eval_review.html`
2. Substitua os marcadores:
   - `__EVAL_DATA_PLACEHOLDER__` → o array JSON de itens de avaliação (sem aspas em volta: é uma atribuição de variável JS)
   - `__SKILL_NAME_PLACEHOLDER__` → o nome da skill
   - `__SKILL_DESCRIPTION_PLACEHOLDER__` → a descrição atual da skill
3. Grave em um arquivo temporário (por exemplo, `/tmp/eval_review_<skill-name>.html`) e abra: `open /tmp/eval_review_<skill-name>.html`
4. O usuário pode editar consultas, alternar should-trigger, adicionar/remover entradas e depois clicar em "Export Eval Set"
5. O arquivo é baixado em `~/Downloads/eval_set.json`: confira a pasta Downloads para ver a versão mais recente, caso haja várias (por exemplo, `eval_set (1).json`)

Este passo importa: consultas de avaliação ruins levam a descrições ruins.

### Passo 3: Rode o ciclo de otimização

Diga ao usuário: "Isso vai levar algum tempo: vou rodar o ciclo de otimização em segundo plano e conferir de vez em quando."

Salve o conjunto de avaliação no workspace e depois rode em segundo plano:

```bash
python -m scripts.run_loop \
  --eval-set <path-to-trigger-eval.json> \
  --skill-path <path-to-skill> \
  --model <model-id-powering-this-session> \
  --max-iterations 5 \
  --verbose
```

Use o ID de modelo do seu prompt de sistema (o que alimenta a sessão atual) para que o teste de acionamento corresponda ao que o usuário realmente vivencia.

Enquanto roda, acompanhe a saída de vez em quando para dar ao usuário atualizações sobre em qual iteração está e como estão as pontuações.

Isso cuida de todo o ciclo de otimização automaticamente. Ele divide o conjunto de avaliação em 60% de treino e 40% de teste reservado, avalia a descrição atual (rodando cada consulta 3 vezes para obter uma taxa de acionamento confiável) e depois chama o Claude para propor melhorias com base no que falhou. Reavalia cada nova descrição no treino e no teste, iterando até 5 vezes. Quando termina, abre um relatório HTML no navegador mostrando os resultados por iteração e devolve um JSON com `best_description`, escolhida pela pontuação de teste e não pela de treino, para evitar sobreajuste.

### Como funciona o acionamento de skills

Entender o mecanismo de acionamento ajuda a projetar consultas de avaliação melhores. As skills aparecem na lista `available_skills` do Claude com nome + descrição, e o Claude decide se consulta uma skill com base nessa descrição. O importante é saber que o Claude só consulta skills para tarefas que não consegue resolver facilmente sozinho: consultas simples, de um passo, como "leia este PDF" podem não acionar uma skill mesmo que a descrição corresponda perfeitamente, porque o Claude as resolve direto com ferramentas básicas. Consultas complexas, de vários passos ou especializadas acionam skills de forma confiável quando a descrição corresponde.

Isso significa que suas consultas de avaliação devem ser substanciais o bastante para que o Claude realmente se beneficie de consultar uma skill. Consultas simples como "leia o arquivo X" são casos de teste ruins: não acionam skills seja qual for a qualidade da descrição.

### Passo 4: Aplique o resultado

Pegue o `best_description` da saída JSON e atualize o frontmatter do SKILL.md da skill. Mostre ao usuário o antes e o depois e relate as pontuações.

---

### Empacote e apresente (somente se houver uma ferramenta de entrega de arquivos)

Verifique se você tem acesso a uma ferramenta que apresenta arquivos ao usuário: `present_files`, ou `SendUserFile` no Cowork remoto. Se não tiver nenhuma das duas, pule este passo. Se tiver, empacote a skill e envie ao usuário o arquivo `.skill` resultante com essa ferramenta:

```bash
python -m scripts.package_skill <path/to/skill-folder>
```

O cartão do arquivo `.skill` (ou do `SKILL.md` solto) apresentado mostra um botão **Save skill** quando a organização do usuário permite a criação de skills; clicar nele instala a skill no perfil dele.

---

## Instruções específicas do Claude.ai

No Claude.ai, o fluxo de trabalho central é o mesmo (rascunho → teste → revisão → melhoria → repetir), mas, como o Claude.ai não tem subagentes, algumas mecânicas mudam. Veja como se adaptar:

**Executando os casos de teste**: sem subagentes, não há execução em paralelo. Para cada caso de teste, leia o SKILL.md da skill e depois siga as instruções dela para cumprir o prompt de teste você mesmo. Faça um por vez. É menos rigoroso que subagentes independentes (você escreveu a skill e também a está executando, então tem o contexto completo), mas é uma checagem de sanidade útil, e a etapa de revisão humana compensa. Pule as execuções de linha de base: apenas use a skill para cumprir a tarefa como pedida.

**Revisando os resultados**: se não conseguir abrir um navegador (por exemplo, a VM do Claude.ai não tem tela, ou você está em um servidor remoto), pule totalmente o revisor de navegador. Em vez disso, apresente os resultados diretamente na conversa. Para cada caso de teste, mostre o prompt e a saída. Se a saída for um arquivo que o usuário precisa ver (como um .docx ou .xlsx), salve-o no sistema de arquivos e diga onde está para que ele baixe e inspecione. Peça feedback na própria conversa: "O que achou? Mudaria alguma coisa?"

**Benchmark**: pule o benchmark quantitativo: ele depende de comparações com linha de base, que não fazem sentido sem subagentes. Concentre-se no feedback qualitativo do usuário.

**O ciclo de iteração**: o mesmo de antes: melhore a skill, rode de novo os casos de teste, peça feedback, só que sem o revisor de navegador no meio. Você ainda pode organizar os resultados em diretórios de iteração no sistema de arquivos, se tiver um.

**Otimização da descrição**: esta seção exige a ferramenta de linha de comando `claude` (especificamente `claude -p`), disponível apenas no Claude Code. Pule se estiver no Claude.ai.

**Comparação cega**: exige subagentes. Pule.

**Empacotamento**: o script `package_skill.py` funciona em qualquer lugar com Python e um sistema de arquivos. No Claude.ai, você pode rodá-lo e o usuário pode baixar o arquivo `.skill` resultante.

**Atualizando uma skill existente**: o usuário pode estar pedindo para atualizar uma skill existente, não para criar uma nova. Nesse caso:
- **Preserve o nome original.** Anote o nome do diretório da skill e o campo `name` do frontmatter e use-os sem alteração. Por exemplo, se a skill instalada é `research-helper`, gere `research-helper.skill` (não `research-helper-v2`).
- **Copie para um local gravável antes de editar.** O caminho da skill instalada pode ser somente leitura. Copie para `/tmp/skill-name/`, edite lá e empacote a partir da cópia.
- **Se empacotar manualmente, monte primeiro em `/tmp/`** e depois copie para o diretório de saída: gravações diretas podem falhar por permissões.
- **A cópia não é a skill do usuário.** Salve-a do jeito que as instruções desta própria sessão dizem (uma ferramenta de salvar, um cartão de proposta ou um arquivo enviado) e, até o usuário salvar, diga que a alteração não está salva.

---

## Instruções específicas do Cowork

Se você está no Cowork, o principal a saber é:

- Você tem subagentes, então o fluxo principal (disparar casos de teste em paralelo, rodar linhas de base, avaliar etc.) funciona por completo. (Porém, se tiver problemas graves de timeout, tudo bem rodar os prompts de teste em série em vez de em paralelo.)
- Você não tem navegador nem tela, então ao gerar o visualizador de avaliações, use `--static <output_path>` para gravar um arquivo HTML autônomo em vez de iniciar um servidor. Depois ofereça um link em que o usuário possa clicar para abrir o HTML no navegador dele.
- Por algum motivo, a configuração do Cowork parece desestimular o Claude a gerar o visualizador de avaliações depois de rodar os testes, então só para reiterar: esteja você no Cowork ou no Claude Code, depois de rodar os testes você deve sempre gerar o visualizador de avaliações para o humano ver exemplos antes de revisar a skill por conta própria e tentar fazer correções, usando o `generate_review.py` (não escrevendo seu próprio código HTML artesanal). Desculpe de antemão, mas vou usar maiúsculas aqui: GERE O VISUALIZADOR DE AVALIAÇÕES *ANTES* DE AVALIAR AS ENTRADAS VOCÊ MESMO. Você quer colocá-los na frente do humano o quanto antes!
- O feedback funciona de forma diferente: como não há servidor em execução, o botão "Submit All Reviews" do visualizador vai baixar o `feedback.json` como um arquivo. Você pode então lê-lo de lá (talvez seja preciso pedir acesso primeiro).
- O empacotamento funciona: o `package_skill.py` só precisa de Python e de um sistema de arquivos.
- A otimização da descrição (`run_loop.py` / `run_eval.py`) deve funcionar no Cowork numa boa, pois usa `claude -p` via subprocesso, não um navegador, mas deixe-a para depois de terminar a skill por completo e de o usuário concordar que ela está em boa forma.
- **Atualizando uma skill existente**: o usuário pode estar pedindo para atualizar uma skill existente, não para criar uma nova. Siga a orientação de atualização na seção do Claude.ai acima.

---

## Arquivos de referência

O diretório agents/ contém instruções para subagentes especializados. Leia-as quando precisar disparar o subagente correspondente.

- `agents/grader.md`: como avaliar asserções contra as saídas
- `agents/comparator.md`: como fazer uma comparação cega A/B entre duas saídas
- `agents/analyzer.md`: como analisar por que uma versão venceu a outra

O diretório references/ tem documentação adicional:
- `references/schemas.md`: formatos de arquivo: pastas de casos de teste, o evals.json mais antigo, grading.json etc.

---

Repetindo mais uma vez o ciclo central, para dar ênfase:

- Descubra do que a skill trata
- Redija ou edite a skill
- Rode o claude-com-acesso-à-skill em prompts de teste
- Com o usuário, avalie as saídas:
  - Crie o benchmark.json e rode `eval-viewer/generate_review.py` para ajudar o usuário a revisá-las
  - Rode as avaliações quantitativas
- Repita até você e o usuário ficarem satisfeitos
- Empacote a skill final e devolva ao usuário.

Por favor, adicione passos à sua lista de tarefas, se tiver uma, para garantir que não se esqueça. Se estiver no Cowork, coloque especificamente "Create test cases and run `eval-viewer/generate_review.py` so human can review them" na sua lista de tarefas para garantir que isso aconteça.

Boa sorte!
