---
name: metrics-review
description: "Revisa e analisa métricas de produto com análise de tendências e insights acionáveis. Use em revisões semanais, mensais ou trimestrais de métricas, ao investigar um pico ou queda repentina, ao comparar desempenho com metas ou ao transformar números brutos em um scorecard com ações recomendadas."
argument-hint: "<time period or metric focus>"
---

# Revisão de métricas

> Se aparecerem placeholders desconhecidos ou você precisar conferir quais ferramentas estão conectadas, veja [CONNECTORS.md](../../CONNECTORS.md).

Revise e analise métricas de produto, identifique tendências e traga à tona insights acionáveis.

## Uso

```
/metrics-review $ARGUMENTS
```

## Fluxo de trabalho

### 1. Reúna os dados das métricas

Se a **~~product analytics** estiver conectada:
- Puxe as principais métricas de produto do período relevante
- Obtenha dados de comparação (período anterior, mesmo período do ano passado, metas)
- Puxe os detalhamentos por segmento, se disponíveis

Se nenhuma ferramenta de analytics estiver conectada, peça ao usuário que forneça:
- As métricas e seus valores (cole uma tabela, uma captura de tela ou descreva)
- Dados de comparação (período anterior, metas)
- Qualquer contexto sobre mudanças recentes (lançamentos, incidentes, sazonalidade)

Pergunte ao usuário:
- Que período revisar? (última semana, último mês, último trimestre)
- Em quais métricas focar? Ou devemos revisar o conjunto completo de métricas do produto?
- Há metas ou objetivos específicos para comparar?
- Algum evento conhecido que possa explicar as mudanças (lançamentos, quedas de serviço, campanhas de marketing, sazonalidade)?

### 2. Organize as métricas

Estruture a revisão usando uma hierarquia de métricas: a métrica North Star no topo, indicadores de saúde L1 (aquisição, ativação, engajamento, retenção, receita, satisfação) e métricas de diagnóstico L2 para detalhamento. Veja **Hierarquia de métricas de produto** abaixo para as definições completas.

Se o usuário não definiu sua hierarquia de métricas, ajude-o a identificar a North Star e as principais métricas L1 antes de prosseguir.

### 3. Analise as tendências

Para cada métrica-chave:
- **Valor atual**: qual é a métrica hoje?
- **Tendência**: para cima, para baixo ou estável em relação ao período anterior? Em que intervalo?
- **vs meta**: como se compara ao objetivo ou à meta?
- **Taxa de mudança**: a tendência está acelerando ou desacelerando?
- **Anomalias**: alguma mudança súbita, pico ou queda?

Identifique correlações:
- Mudanças em uma métrica se correlacionam com mudanças em outra?
- Há indicadores antecedentes que preveem mudanças em métricas de resultado?
- Os detalhamentos por segmento revelam que uma tendência agregada é puxada por uma coorte específica?

### 4. Gere a revisão

#### Resumo
2-3 frases: saúde geral do produto, mudanças mais notáveis, destaque principal.

#### Scorecard de métricas
Formato de tabela para leitura rápida:

| Métrica | Atual | Anterior | Variação | Meta | Status |
|---------|-------|----------|----------|------|--------|
| [Métrica] | [Valor] | [Valor] | [+/- %] | [Meta] | [No caminho / Em risco / Fora da meta] |

#### Análise de tendências
Para cada métrica que valha discutir:
- O que aconteceu e quão significativa é a mudança
- Por que provavelmente aconteceu (atribuição com base em eventos conhecidos, métricas correlacionadas, análise de segmentos)
- Se é um evento pontual ou uma tendência sustentada

#### Pontos positivos
O que está indo bem:
- Métricas superando as metas
- Tendências positivas a sustentar
- Segmentos ou funcionalidades com forte desempenho

#### Áreas de preocupação
O que precisa de atenção:
- Métricas fora da meta ou com tendência negativa
- Sinais de alerta precoce antes de virarem problemas
- Métricas sobre as quais falta visibilidade ou entendimento

#### Ações recomendadas
Próximos passos específicos com base na análise:
- Investigações a conduzir (aprofundar uma tendência preocupante)
- Experimentos a lançar (testar hipóteses sobre o que poderia melhorar uma métrica)
- Investimentos a fazer (dobrar a aposta no que funciona)
- Alertas a configurar (monitorar uma métrica mais de perto)

#### Contexto e ressalvas
- Problemas conhecidos de qualidade de dados
- Eventos que afetam a comparabilidade (quedas de serviço, feriados, lançamentos)
- Métricas que deveríamos acompanhar mas ainda não acompanhamos

### 5. Acompanhamento

Depois de gerar a revisão:
- Pergunte se alguma métrica precisa de investigação mais profunda
- Ofereça criar uma especificação de painel para monitoramento contínuo
- Ofereça redigir propostas de experimento para as áreas de preocupação
- Ofereça montar um modelo de revisão de métricas para uso recorrente

## Hierarquia de métricas de produto

### Métrica North Star
A única métrica que melhor captura o valor central que o seu produto entrega aos usuários. Ela deve ser:

- **Alinhada ao valor**: se move quando os usuários obtêm mais valor do produto
- **Antecedente**: prevê o sucesso de negócio a longo prazo (receita, retenção)
- **Acionável**: o time de produto consegue influenciá-la com o seu trabalho
- **Compreensível**: todos na empresa entendem o que significa e por que importa

**Exemplos por tipo de produto**:
- Ferramenta de colaboração: equipes ativas por semana com 3+ membros contribuindo
- Marketplace: transações concluídas por semana
- Plataforma SaaS: usuários ativos por semana que concluem o fluxo central
- Plataforma de conteúdo: tempo semanal de leitura/visualização engajada
- Ferramenta para desenvolvedores: deploys semanais usando a ferramenta

### Métricas L1 (indicadores de saúde)
As 5-7 métricas que juntas pintam um quadro completo da saúde do produto. Correspondem às etapas-chave do ciclo de vida do usuário:

**Aquisição**: novos usuários estão encontrando o produto?
- Novos cadastros ou inícios de teste (volume e tendência)
- Taxa de conversão de cadastro (visitantes para cadastros)
- Mix de canais (de onde vêm os novos usuários)
- Custo por aquisição (para canais pagos)

**Ativação**: novos usuários estão chegando ao momento de valor?
- Taxa de ativação: % dos novos usuários que completam a ação-chave que prevê a retenção
- Tempo até a ativação: quanto tempo do cadastro à ativação
- Taxa de conclusão da configuração: % que completam os passos de onboarding
- Primeiro momento de valor: quando os usuários experimentam pela primeira vez o valor central do produto

**Engajamento**: usuários ativos estão obtendo valor?
- DAU / WAU / MAU: usuários ativos em diferentes intervalos
- Razão DAU/MAU (aderência): que fração dos usuários mensais volta diariamente
- Frequência da ação central: com que frequência os usuários fazem o que mais importa
- Profundidade da sessão: quanto os usuários fazem por sessão
- Adoção de funcionalidades: % de usuários usando as funcionalidades-chave

**Retenção**: os usuários estão voltando?
- Retenção D1, D7, D30: % de usuários que voltam após 1 dia, 7 dias, 30 dias
- Curvas de retenção por coorte: como a retenção evolui para cada coorte de cadastro
- Taxa de churn: % de usuários ou receita perdidos por período
- Taxa de ressurreição: % de usuários que cancelaram e voltam

**Monetização**: o valor está se traduzindo em receita?
- Taxa de conversão: gratuito para pago (em freemium)
- MRR / ARR: receita recorrente mensal ou anual
- ARPU / ARPA: receita média por usuário ou conta
- Receita de expansão: crescimento de receita a partir de clientes existentes
- Retenção líquida de receita: retenção de receita incluindo expansão e contração

**Satisfação**: o que os usuários sentem pelo produto?
- NPS: Net Promoter Score
- CSAT: Customer Satisfaction Score
- Volume de chamados de suporte e tempo de resolução
- Notas em lojas de apps e sentimento das avaliações

### Métricas L2 (diagnóstico)
Métricas detalhadas usadas para investigar mudanças nas métricas L1:

- Conversão do funil em cada etapa
- Uso e adoção por funcionalidade
- Detalhamentos por segmento (por plano, porte da empresa, geografia, função do usuário)
- Métricas de desempenho (tempo de carregamento de página, taxa de erro, latência de API)
- Engajamento específico de conteúdo (quais funcionalidades, páginas ou tipos de conteúdo impulsionam o engajamento)

## Métricas de produto comuns

### DAU / WAU / MAU
**O que medem**: usuários únicos que realizam uma ação qualificadora em um dia, semana ou mês.

**Decisões-chave**:
- O que conta como "ativo"? Um login? Uma visualização de página? Uma ação central? Defina com cuidado: definições diferentes contam histórias diferentes.
- Qual intervalo importa mais? DAU para produtos de uso diário (mensagens, e-mail). WAU para produtos de uso semanal (gestão de projetos). MAU para produtos menos frequentes (software de imposto, reserva de viagens).

**Como usá-las**:
- Razão DAU/MAU (aderência): valores acima de 0,5 indicam um hábito diário. Abaixo de 0,2 sugere uso pouco frequente.
- A tendência importa mais que o número absoluto. O uso ativo está crescendo, estável ou em queda?
- Segmente por tipo de usuário. Usuários avançados e casuais se comportam de forma muito diferente.

### Retenção
**O que mede**: dos usuários que começaram no período X, que % ainda está ativo no período Y?

**Intervalos comuns de retenção**:
- D1 (dia seguinte): a primeira experiência foi boa o bastante para voltar?
- D7 (uma semana): o usuário estabeleceu um hábito?
- D30 (um mês): o usuário está retido a longo prazo?
- D90 (três meses): este é um usuário duradouro?

**Como usar a retenção**:
- Trace curvas de retenção por coorte. Procure: queda inicial (problema de ativação), declínio constante (problema de engajamento) ou estabilização (bom: você tem uma base retida estável).
- Compare coortes ao longo do tempo. As coortes mais novas estão retendo melhor que as antigas? Isso significa que as melhorias de produto estão funcionando.
- Segmente a retenção pelo comportamento de ativação. Usuários que concluíram o onboarding versus os que não concluíram. Usuários que usaram a funcionalidade X versus os que não usaram.

### Conversão
**O que mede**: % de usuários que passam de uma etapa para a seguinte.

**Funis de conversão comuns**:
- Visitante para cadastro
- Cadastro para ativação (momento-chave de valor)
- Gratuito para pago (conversão de teste)
- Teste para assinatura paga
- Plano mensal para anual

**Como usar a conversão**:
- Mapeie o funil completo e meça a conversão em cada etapa
- Identifique os maiores pontos de queda: são as suas oportunidades de melhoria de maior alavancagem
- Segmente a conversão por origem, plano, tipo de usuário. Segmentos diferentes convertem de forma muito diferente.
- Acompanhe a conversão ao longo do tempo. Está melhorando conforme você itera na experiência?

### Ativação
**O que mede**: % dos novos usuários que chegam ao momento em que experimentam pela primeira vez o valor central do produto.

**Definindo a ativação**:
- Compare usuários retidos com usuários que cancelaram. Que ações os retidos fizeram e os que cancelaram não?
- O evento de ativação deve ser um forte preditor da retenção a longo prazo
- Deve ser alcançável na primeira sessão ou nos primeiros dias
- Exemplos: criou o primeiro projeto, convidou um colega, concluiu o primeiro fluxo, conectou uma integração

**Como usar a ativação**:
- Acompanhe a taxa de ativação de toda coorte de cadastro
- Meça o tempo até a ativação: mais rápido é quase sempre melhor
- Construa fluxos de onboarding que guiem os usuários até o momento de ativação
- Faça teste A/B dos fluxos de ativação e meça o impacto na retenção, não só na taxa de ativação

## Frameworks de definição de metas

### OKRs (Objetivos e Resultados-Chave)

**Objetivos**: metas qualitativas e aspiracionais que descrevem o que você quer alcançar.
- Inspiradores e memoráveis
- Com prazo (trimestral ou anual)
- Direcionais, não específicos de métrica

**Resultados-Chave**: medidas quantitativas que dizem se você alcançou o objetivo.
- Específicos e mensuráveis
- Com prazo e meta clara
- Baseados em resultado, não em entrega
- 2-4 Resultados-Chave por Objetivo

**Exemplo**:
```
Objetivo: Tornar nosso produto indispensável nos fluxos de trabalho diários

Resultados-Chave:
- Aumentar a razão DAU/MAU de 0,35 para 0,50
- Aumentar a retenção D30 de novos usuários de 40% para 55%
- 3 fluxos centrais com taxa de conclusão de tarefa >80%
```

### Boas práticas de OKR
- Defina OKRs ambiciosos, mas alcançáveis. 70% de conclusão é a meta para OKRs ambiciosos.
- Os Resultados-Chave devem medir resultados (comportamento do usuário, resultados de negócio), não entregas (funcionalidades lançadas, tarefas concluídas).
- Não tenha OKRs demais. 2-3 objetivos com 2-4 KRs cada já é bastante.
- OKRs devem ser desconfortáveis. Se você tem certeza de que vai atingir todos, não são ambiciosos o bastante.
- Revise os OKRs no meio do período. Ajuste a alocação de esforço se alguns KRs estiverem claramente fora do rumo.
- Avalie os OKRs com honestidade no fim do período. 0,0-0,3 = não atingido, 0,4-0,6 = progresso, 0,7-1,0 = atingido.

### Definindo metas de métricas
- **Linha de base**: qual é o valor atual? Você precisa de uma linha de base confiável antes de definir uma meta.
- **Referência**: o que produtos comparáveis alcançam? As referências do setor dão contexto.
- **Trajetória**: qual é a tendência atual? Se a métrica já melhora 5% ao mês, uma meta de 6% não é ambiciosa.
- **Esforço**: quanto investimento você está colocando nisso? Apostas maiores justificam metas mais ambiciosas.
- **Confiança**: quão confiante você está de atingir a meta? Defina um "compromisso" (alta confiança) e uma meta "ambiciosa".

## Cadências de revisão de métricas

### Checagem semanal de métricas
**Objetivo**: pegar problemas rápido, monitorar experimentos, manter contato com a saúde do produto.
**Duração**: 15-30 minutos.
**Participantes**: gerente de produto, talvez o líder de engenharia.

**O que revisar**:
- Métrica North Star: valor atual, variação semana a semana
- Principais métricas L1: qualquer movimento notável
- Experimentos ativos: resultados e significância estatística
- Anomalias: qualquer pico ou queda inesperado
- Alertas: qualquer coisa que tenha disparado um alerta de monitoramento

**Ação**: se algo parecer errado, investigue. Caso contrário, anote e siga em frente.

### Revisão mensal de métricas
**Objetivo**: análise mais profunda de tendências, progresso em relação às metas, implicações estratégicas.
**Duração**: 30-60 minutos.
**Participantes**: time de produto, stakeholders-chave.

**O que revisar**:
- Scorecard completo das métricas L1 com tendências mês a mês
- Progresso em relação às metas dos OKRs trimestrais
- Análise de coortes: as coortes mais novas estão se saindo melhor?
- Adoção de funcionalidades: como estão os lançamentos recentes?
- Análise de segmentos: alguma divergência entre segmentos de usuários?

**Ação**: identifique 1-3 áreas para investigar ou investir. Atualize as prioridades se as métricas revelarem informação nova.

### Revisão trimestral de negócios
**Objetivo**: avaliação estratégica do desempenho do produto, definição de metas para o próximo trimestre.
**Duração**: 60-90 minutos.
**Participantes**: produto, engenharia, design, liderança.

**O que revisar**:
- Pontuação dos OKRs do trimestre
- Análise de tendências de todas as métricas L1 ao longo do trimestre
- Comparações ano contra ano
- Contexto competitivo: mudanças de mercado e movimentos de concorrentes
- O que funcionou e o que não funcionou

**Ação**: defina os OKRs do próximo trimestre. Ajuste a estratégia de produto com base no que os dados mostram.

## Princípios de design de painéis

### Painéis de produto eficazes
Um bom painel responde à pergunta "Como o produto está indo?" num relance.

**Princípios**:

1. **Comece pela pergunta, não pelos dados**. Que decisões este painel apoia? Projete de trás para frente, a partir da decisão.

2. **Hierarquia de informação**. A métrica mais importante deve ser a mais visualmente proeminente. North Star no topo, métricas L1 em seguida, métricas L2 disponíveis no detalhamento.

3. **Contexto acima de números**. Um número sem contexto não significa nada. Mostre sempre: valor atual, comparação (período anterior, meta, referência), direção da tendência.

4. **Menos métricas, mais insight**. Um painel com 50 métricas não ajuda ninguém. Foque em 5-10 que importam. Coloque todo o resto em um relatório detalhado.

5. **Períodos de tempo consistentes**. Use o mesmo período para todas as métricas de um painel. Misturar métricas diárias e mensais causa confusão.

6. **Indicadores visuais de status**. Use cor para indicar a saúde num relance:
   - Verde: no caminho ou melhorando
   - Amarelo: precisa de atenção ou estável
   - Vermelho: fora do caminho ou em queda

7. **Acionabilidade**. Toda métrica do painel deve ser algo que o time consegue influenciar. Se você não pode agir sobre ela, ela não pertence ao painel de produto.

### Layout do painel

**Linha superior**: métrica North Star com linha de tendência e meta.

**Segunda linha**: scorecard das métricas L1: valor atual, variação, meta e status de cada métrica-chave.

**Terceira linha**: funis ou métricas de conversão principais: funil visual mostrando a queda em cada etapa.

**Quarta linha**: experimentos e lançamentos recentes: testes A/B ativos, lançamentos recentes de funcionalidades com métricas iniciais.

**Parte inferior / detalhamento**: métricas L2, detalhamentos por segmento e séries temporais detalhadas para investigação.

### Antipadrões de painéis
- **Métricas de vaidade**: métricas que sempre sobem mas não indicam saúde (total de cadastros de todos os tempos, total de visualizações de página)
- **Métricas demais**: painéis que exigem rolagem para ver. Se não cabe em uma tela, corte métricas.
- **Sem comparação**: números brutos sem contexto (valor atual sem período anterior nem meta)
- **Painéis obsoletos**: métricas que não são atualizadas nem revisadas há meses
- **Painéis de produção**: medem a atividade do time (tickets fechados, PRs mesclados) em vez de resultados de usuário e de negócio
- **Um painel para todos os públicos**: executivos, PMs e engenheiros precisam de visões diferentes. Um tamanho não serve para todos.

### Alertas
Configure alertas para métricas que exigem atenção imediata:

- **Alertas de limiar**: a métrica cai abaixo de, ou sobe acima de, um limiar crítico (taxa de erro > 1%, conversão < 5%)
- **Alertas de tendência**: a métrica mostra queda sustentada ao longo de vários dias/semanas
- **Alertas de anomalia**: a métrica se desvia de forma significativa da faixa esperada

**Higiene de alertas**:
- Todo alerta deve ser acionável. Se você não pode fazer nada a respeito, não alerte sobre isso.
- Revise e ajuste os alertas regularmente. Falsos positivos demais e as pessoas ignoram todos os alertas.
- Defina um responsável para cada alerta. Quem responde quando ele dispara?
- Defina níveis de severidade apropriados. Nem tudo é P0.

## Formato de saída

Use tabelas para o scorecard. Use indicadores de status claros. Mantenha o resumo enxuto: o leitor deve captar a história essencial em 30 segundos.

## Dicas

- Comece pelo "e daí?": qual é a coisa mais importante desta revisão de métricas? Abra com isso.
- Números absolutos sem contexto são inúteis. Sempre mostre comparações (vs período anterior, vs meta, vs referência).
- Cuidado com a atribuição. Correlação não é causalidade. Se uma métrica se moveu, reconheça a incerteza sobre o motivo.
- A análise de segmentos muitas vezes revela que uma métrica agregada mascara diferenças importantes. Um número geral estável pode esconder um segmento crescendo e outro encolhendo.
- Nem todo movimento de métrica importa. Pequenas flutuações são ruído. Concentre a atenção em mudanças significativas.
- Se uma métrica está fora da meta, não relate apenas o desvio: recomende o que fazer a respeito.
- As revisões de métricas devem gerar decisões. Se a revisão não levar a pelo menos uma ação, não foi útil.
