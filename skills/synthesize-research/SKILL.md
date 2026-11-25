---
name: synthesize-research
description: "Sintetiza pesquisa com usuários (entrevistas, pesquisas, feedbacks) em insights estruturados. Use quando tiver uma pilha de notas de entrevistas, respostas de pesquisa ou tickets de suporte para organizar, precisar extrair temas e ranquear achados por frequência e impacto, ou quiser transformar feedback bruto em recomendações para o roadmap."
argument-hint: "<research topic or question>"
---

# Síntese de pesquisa

> Se aparecerem placeholders desconhecidos ou você precisar conferir quais ferramentas estão conectadas, veja [CONNECTORS.md](../../CONNECTORS.md).

Sintetize pesquisa com usuários, vinda de várias fontes, em insights e recomendações estruturados.

## Uso

```
/synthesize-research $ARGUMENTS
```

## Fluxo de trabalho

### 1. Reúna os insumos da pesquisa

Aceite pesquisa em qualquer combinação de:
- **Texto colado**: notas de entrevistas, transcrições, respostas de pesquisas, feedback
- **Arquivos enviados**: documentos de pesquisa, planilhas, resumos de gravações
- **~~knowledge base** (se conectada): busque documentos de pesquisa, notas de entrevistas, resultados de pesquisas
- **~~user feedback** (se conectado): puxe chamados de suporte recentes, pedidos de funcionalidades, relatos de bugs
- **~~product analytics** (se conectada): puxe dados de uso, métricas de funil, dados comportamentais
- **~~meeting transcription** (se conectada): puxe gravações de entrevistas, resumos de reuniões e notas de discussões

Pergunte ao usuário o que ele tem:
- Que tipo de pesquisa? (entrevistas, pesquisas quantitativas, testes de usabilidade, analytics, chamados de suporte, notas de ligações de vendas)
- Quantas fontes / participantes?
- Há uma pergunta ou hipótese específica que ele está investigando?
- Que decisões esta pesquisa vai embasar?

### 2. Processe a pesquisa

Para cada fonte, extraia:
- **Observações-chave**: o que os usuários disseram, fizeram ou vivenciaram?
- **Citações**: citações literais que ilustram pontos importantes
- **Comportamentos**: o que os usuários realmente fizeram (em vez do que disseram que fazem)
- **Pontos de dor**: frustrações, gambiarras e necessidades não atendidas
- **Sinais positivos**: o que funciona bem, momentos de encantamento
- **Contexto**: segmento de usuário, caso de uso, nível de experiência

### 3. Identifique temas e padrões

Aplique a análise temática: veja **Metodologia de síntese de pesquisa** abaixo para orientação detalhada sobre análise temática, mapeamento por afinidade e técnicas de triangulação.

Agrupe as observações em temas, conte a frequência entre os participantes e avalie a gravidade do impacto. Anote contradições e surpresas.

Crie uma matriz de prioridade:
- **Alta frequência + alto impacto**: achados de maior prioridade
- **Baixa frequência + alto impacto**: importantes para segmentos específicos
- **Alta frequência + baixo impacto**: melhorias de qualidade de vida
- **Baixa frequência + baixo impacto**: anote, mas despriorize

### 4. Gere a síntese

Produza uma síntese de pesquisa estruturada:

#### Visão geral da pesquisa
- Metodologia: que tipos de pesquisa, quantos participantes/fontes
- Pergunta(s) de pesquisa: o que nos propusemos a aprender
- Período: quando a pesquisa foi realizada

#### Principais achados
Para cada achado importante (busque 5-8):
- **Declaração do achado**: uma frase clara que descreve o insight
- **Evidência**: citações, dados ou observações de apoio (com atribuição da fonte)
- **Frequência**: quantos participantes/fontes sustentam o achado
- **Impacto**: o quanto isto afeta a experiência do usuário ou o negócio
- **Nível de confiança**: alto (evidência forte), médio (sugestivo), baixo (sinal inicial)

Ordene os achados por prioridade (frequência x impacto).

#### Segmentos de usuários / personas
Se a pesquisa revelar segmentos de usuários distintos:
- Nome e descrição do segmento
- Principais características e comportamentos
- Necessidades e pontos de dor próprios
- Estimativa de tamanho, se houver dados

#### Áreas de oportunidade
Com base nos achados, identifique áreas de oportunidade:
- Que necessidades dos usuários estão sem atendimento ou mal atendidas
- Onde as soluções atuais ficam devendo
- Que novas capacidades destravariam valor
- Priorizadas por impacto potencial

#### Recomendações
Recomendações específicas e acionáveis:
- O que construir, mudar ou investigar mais
- Amarradas a achados específicos
- Priorizadas por impacto e viabilidade

#### Perguntas em aberto
O que a pesquisa não respondeu:
- Lacunas de entendimento
- Áreas que precisam de mais investigação
- Métodos de pesquisa de acompanhamento sugeridos

### 5. Revise e amplie

Depois de gerar a síntese:
- Pergunte se algum achado precisa de mais detalhe ou de outro enquadramento
- Ofereça gerar artefatos específicos: documentos de personas, mapas de oportunidades, apresentações de pesquisa
- Ofereça criar planos de pesquisa de acompanhamento para as perguntas em aberto
- Ofereça redigir as implicações para o produto (como os achados devem influenciar o roadmap)

## Metodologia de síntese de pesquisa

### Análise temática
O método central para sintetizar pesquisa qualitativa:

1. **Familiarização**: leia todos os dados. Tenha uma noção do panorama geral antes de codificar qualquer coisa.
2. **Codificação inicial**: percorra os dados de forma sistemática. Marque cada observação, citação ou dado com códigos descritivos. Seja generoso com os códigos: é mais fácil juntar do que dividir depois.
3. **Desenvolvimento de temas**: agrupe códigos relacionados em temas candidatos. Um tema captura algo importante nos dados em relação à pergunta de pesquisa.
4. **Revisão de temas**: confira os temas contra os dados. Cada tema tem evidência suficiente? Os temas são distintos entre si? Contam uma história coerente?
5. **Refinamento de temas**: defina e nomeie cada tema com clareza. Escreva uma descrição de 1-2 frases do que cada tema captura.
6. **Relato**: escreva os temas como achados, com evidências de apoio.

### Mapeamento por afinidade
Um método colaborativo para agrupar observações:

1. **Capture as observações**: escreva cada observação, citação ou dado distinto como uma nota separada
2. **Agrupe**: junte notas relacionadas por semelhança. Não defina categorias de antemão: deixe-as emergir dos dados.
3. **Nomeie os grupos**: dê a cada grupo um nome descritivo que capture o fio comum
4. **Organize os grupos**: arrume os grupos em conjuntos de nível mais alto se surgirem padrões
5. **Identifique os temas**: os grupos e suas relações revelam os temas-chave

**Dicas para o mapeamento por afinidade**:
- Uma observação por nota. Não combine vários insights.
- Mova as notas livremente entre grupos. O primeiro agrupamento raramente é o melhor.
- Se um grupo ficar grande demais, provavelmente contém vários temas. Divida-o.
- Os casos isolados são interessantes. Não force toda observação em um grupo.
- O processo de agrupar vale tanto quanto o resultado. Ele constrói entendimento compartilhado.

### Triangulação
Fortaleça os achados combinando várias fontes de dados:

- **Triangulação metodológica**: mesma pergunta, métodos diferentes (entrevistas + pesquisa + analytics)
- **Triangulação de fontes**: mesmo método, participantes ou segmentos diferentes
- **Triangulação temporal**: mesma observação em momentos diferentes

Um achado sustentado por várias fontes e métodos é muito mais forte que um sustentado por uma única fonte. Quando as fontes discordam, isso é interessante: pode revelar segmentos ou contextos de usuários diferentes.

## Análise de notas de entrevistas

### Extraindo insights de notas de entrevistas
Para cada entrevista, identifique:

**Observações**: o que o participante descreveu fazer, vivenciar ou sentir?
- Distinga comportamentos (o que fazem) de atitudes (o que pensam/sentem)
- Anote o contexto: quando, onde, com quem, com que frequência
- Sinalize as gambiarras: são necessidades não atendidas disfarçadas

**Citações diretas**: declarações literais que ilustram um ponto com força
- Boas citações são específicas e vívidas, não genéricas
- Atribua ao tipo de participante, não ao nome: "Administrador corporativo, equipe de 200 pessoas", não "Sarah"
- Uma citação é evidência, não um achado. O achado é a sua interpretação do que a citação significa.

**Comportamentos versus preferências declaradas**: o que as pessoas FAZEM muitas vezes difere do que DIZEM querer
- Observações comportamentais são evidência mais forte que preferências declaradas
- Se um participante diz "quero a funcionalidade X" mas o fluxo dele mostra que nunca usa funcionalidades parecidas, anote a contradição
- Procure preferências reveladas pelo comportamento real

**Sinais de intensidade**: o quanto isto importa para o participante?
- Linguagem emocional: frustração, empolgação, resignação
- Frequência: com que frequência ele encontra esse problema
- Gambiarras: quanto esforço ele gasta contornando o problema
- Impacto: qual é a consequência quando as coisas dão errado

### Análise entre entrevistas
Depois de processar as entrevistas individuais:
- Procure padrões: quais observações aparecem em vários participantes?
- Anote a frequência: quantos participantes mencionaram cada tema?
- Identifique segmentos: tipos diferentes de usuários têm padrões diferentes?
- Traga à tona as contradições: onde os participantes discordam? Isso muitas vezes revela segmentos significativos.
- Encontre surpresas: o que desafiou as suas premissas anteriores?

## Interpretação de dados de pesquisas quantitativas

### Análise de pesquisas quantitativas
- **Taxa de resposta**: quão representativa é a amostra? Taxas de resposta baixas podem introduzir viés.
- **Distribuição**: olhe a forma das respostas, não só as médias. Uma distribuição bimodal (muitos 1 e 5) conta uma história diferente de uma distribuição normal (muitos 3).
- **Segmentação**: detalhe as respostas por segmento de usuário. Os agregados podem mascarar diferenças importantes.
- **Significância estatística**: em amostras pequenas, tenha cautela ao tirar conclusões de diferenças pequenas.
- **Comparação com referências**: como as pontuações se comparam a referências do setor ou a pesquisas anteriores?

### Análise de respostas abertas
- Trate respostas abertas como mini notas de entrevista
- Codifique cada resposta com temas
- Conte a frequência dos temas entre as respostas
- Puxe citações representativas de cada tema
- Procure temas que aparecem nas respostas abertas mas não nas perguntas estruturadas: são coisas que você não pensou em perguntar

### Erros comuns na análise de pesquisas
- Relatar médias sem distribuições. Uma média de 3,5 pode significar que todos estão mornos ou que metade ama e metade odeia.
- Ignorar o viés de não resposta. Quem não respondeu pode ser sistematicamente diferente.
- Superinterpretar diferenças pequenas. Uma mudança de 0,1 ponto no NPS é ruído, não sinal.
- Tratar escalas Likert como dados intervalares. A diferença entre "Concordo totalmente" e "Concordo" não é necessariamente a mesma que entre "Concordo" e "Neutro".
- Confundir correlação com causalidade em tabulações cruzadas.

## Combinando insights qualitativos e quantitativos

### O ciclo de retroalimentação qualitativo-quantitativo
- **Qualitativo primeiro**: entrevistas e observação revelam O QUE está acontecendo e POR QUÊ. Geram hipóteses.
- **Validação quantitativa**: pesquisas e analytics revelam QUANTO e QUANTOS. Testam hipóteses em escala.
- **Aprofundamento qualitativo**: volte aos métodos qualitativos para entender achados quantitativos inesperados.

### Estratégias de integração
- Use dados quantitativos para priorizar achados qualitativos. Um tema das entrevistas é mais importante se os dados de uso mostram que afeta muitos usuários.
- Use dados qualitativos para explicar anomalias quantitativas. Uma queda na retenção é um número; as entrevistas revelam que é por causa de uma mudança confusa no onboarding.
- Apresente a evidência combinada: "47% dos usuários pesquisados relatam dificuldade com X (pesquisa), e as entrevistas revelam que isso se deve a Y (achado qualitativo)."

### Quando as fontes discordam
- Fontes quantitativas e qualitativas podem contar histórias diferentes. Isso é sinal, não erro.
- Confira se a discordância se deve a populações diferentes sendo medidas
- Confira se as preferências declaradas (pesquisa) diferem do comportamento real (analytics)
- Confira se a pergunta quantitativa capturou o que você acha que capturou
- Relate a discordância com honestidade e investigue mais, em vez de escolher uma fonte

## Desenvolvimento de personas a partir da pesquisa

### Construindo personas baseadas em evidências
As personas devem emergir dos dados da pesquisa, não da imaginação:

1. **Identifique padrões comportamentais**: procure grupos de comportamentos, objetivos e contextos semelhantes entre os participantes
2. **Defina variáveis distintivas**: que dimensões diferenciam um grupo do outro? (por exemplo, porte da empresa, habilidade técnica, frequência de uso, caso de uso principal)
3. **Crie perfis de persona**: para cada grupo comportamental:
   - Nome e breve descrição
   - Principais comportamentos e objetivos
   - Pontos de dor e necessidades
   - Contexto (função, empresa, ferramentas usadas)
   - Citações representativas
4. **Valide com dados**: dá para dimensionar cada segmento de persona com dados quantitativos?

### Modelo de persona
```
[Nome da persona] — [Descrição em uma linha]

Quem são:
- Função, tipo/porte da empresa, nível de experiência
- Como descobriram/começaram a usar o produto

O que tentam realizar:
- Objetivos principais e jobs to be done
- Como medem o sucesso

Como usam o produto:
- Frequência e profundidade de uso
- Principais fluxos e funcionalidades usados
- Ferramentas que usam junto com este produto

Principais pontos de dor:
- As 3 principais frustrações ou necessidades não atendidas
- Gambiarras que desenvolveram

O que valorizam:
- O que mais importa em uma solução
- O que os faria trocar ou cancelar

Citações representativas:
- 2-3 citações literais que capturam a perspectiva desta persona
```

### Erros comuns com personas
- Personas demográficas: definir por idade/gênero/localização em vez de comportamento. O comportamento prevê as necessidades de produto melhor que a demografia.
- Personas demais: 3-5 é o ponto ideal. Mais que isso e não são acionáveis.
- Personas fictícias: inventadas com base em suposições, e não em dados de pesquisa.
- Personas estáticas: nunca atualizadas conforme o produto e o mercado evoluem.
- Personas sem implicações: uma persona que não muda nenhuma decisão de produto não é útil.

## Dimensionamento de oportunidades

### Estimando o tamanho da oportunidade
Para cada achado ou área de oportunidade da pesquisa, estime:

- **Usuários endereçáveis**: quantos usuários poderiam se beneficiar de tratar isso? Use analytics de produto, dados de pesquisas ou dados de mercado para estimar.
- **Frequência**: com que frequência os usuários afetados encontram este problema? (Diária, semanal, mensal, única)
- **Gravidade**: o quanto este problema impacta os usuários quando ocorre? (Bloqueador, atrito significativo, incômodo menor)
- **Disposição a pagar**: tratar isso levaria a upgrades, retenção ou aquisição de novos clientes?

### Pontuação de oportunidades
Pontue as oportunidades em uma matriz simples:

- **Impacto**: (Usuários afetados) x (Frequência) x (Gravidade) = pontuação de impacto
- **Força da evidência**: quão confiantes estamos no achado? (Várias fontes > fonte única, dados comportamentais > preferências declaradas)
- **Alinhamento estratégico**: esta oportunidade se alinha à estratégia da empresa e à visão do produto?
- **Viabilidade**: conseguimos tratá-la de forma realista? (Viabilidade técnica, disponibilidade de recursos, tempo até o impacto)

### Apresentando o dimensionamento de oportunidades
- Seja transparente sobre premissas e níveis de confiança
- Mostre a conta: "Com base no volume de chamados de suporte, cerca de 2.000 usuários por mês encontram este problema. Os dados das entrevistas sugerem que 60% deles o consideram um bloqueio significativo."
- Use faixas em vez de falsa precisão: "Isso afeta de 1.500 a 2.500 usuários por mês", não "Isso afeta 2.137 usuários por mês"
- Compare as oportunidades entre si para criar uma classificação relativa, não apenas pontuações absolutas

## Formato de saída

Use títulos claros e formatação estruturada. Cada achado deve se sustentar sozinho: o leitor deve conseguir ler qualquer achado isolado e entendê-lo sem ler o resto.

## Dicas

- Deixe os dados falarem. Não force achados em uma narrativa predeterminada.
- Distinga o que os usuários dizem do que fazem. Dados comportamentais são mais fortes que preferências declaradas.
- Citações são evidência poderosa. Inclua-as com generosidade, atribuídas ao tipo de participante (não ao nome).
- Seja explícito sobre os níveis de confiança. Um achado de 2 entrevistas é uma hipótese, não uma conclusão.
- Contradições nos dados são interessantes, não inconvenientes. Muitas vezes revelam segmentos de usuários distintos.
- As recomendações devem ser específicas o bastante para agir. "Melhorar o onboarding" não é acionável. "Adicionar um indicador de progresso ao fluxo de configuração" é.
- Resista à tentação de sintetizar temas demais. 5-8 achados fortes são melhores que 20 fracos.
