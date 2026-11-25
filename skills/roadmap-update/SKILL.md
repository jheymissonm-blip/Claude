---
name: roadmap-update
description: "Atualiza, cria ou reprioriza o roadmap de produto. Use ao adicionar uma nova iniciativa e decidir o que muda para abrir espaço, ao mudar prioridades diante de novas informações, ao mover prazos por atraso de uma dependência, ou ao montar do zero uma visão Agora/Próximo/Depois."
argument-hint: "<update description>"
---

# Atualização do roadmap

> Se aparecerem placeholders desconhecidos ou você precisar conferir quais ferramentas estão conectadas, veja [CONNECTORS.md](../../CONNECTORS.md).

Atualize, crie ou repriorize um roadmap de produto.

## Uso

```
/roadmap-update $ARGUMENTS
```

## Fluxo de trabalho

### 1. Entenda o estado atual

Se o **~~project tracker** estiver conectado:
- Puxe os itens atuais do roadmap com seus status, responsáveis e datas
- Identifique itens atrasados, em risco ou concluídos recentemente
- Traga à tona itens sem responsáveis ou datas claras

Se nenhuma ferramenta de gestão de projetos estiver conectada:
- Peça ao usuário que descreva o roadmap atual ou que o cole/envie
- Aceite qualquer formato: lista, tabela, planilha, captura de tela ou descrição em prosa

### 2. Determine a operação

Pergunte o que o usuário quer fazer:

**Adicionar item**: nova funcionalidade, iniciativa ou item de trabalho no roadmap
- Reúna: nome, descrição, prioridade, esforço estimado, prazo-alvo, responsável, dependências
- Sugira onde se encaixa, com base nas prioridades e na capacidade atuais

**Atualizar status**: mudar o status de itens existentes
- Opções: não iniciado, em andamento, em risco, bloqueado, concluído, cortado
- Para "em risco" ou "bloqueado": pergunte o bloqueio e o plano de mitigação

**Repriorizar**: mudar a ordem ou a prioridade dos itens
- Pergunte o que mudou (informação nova, mudança de estratégia, mudança de recursos, feedback de clientes)
- Aplique um framework de priorização se ajudar: veja **Frameworks de priorização** abaixo para RICE, MoSCoW, ICE e valor versus esforço
- Mostre a comparação antes/depois

**Mover o cronograma**: deslocar datas dos itens
- Pergunte por quê (mudança de escopo, atraso de dependência, restrição de recursos)
- Identifique os impactos em cascata nos itens dependentes
- Sinalize itens que passam de prazos rígidos

**Criar um novo roadmap**: montar um roadmap do zero
- Pergunte o horizonte (trimestre, semestre, ano)
- Pergunte a preferência de formato (Agora/Próximo/Depois, colunas trimestrais, alinhado a OKRs): veja **Frameworks de roadmap** abaixo
- Reúna a lista de iniciativas a incluir

### 3. Gere o resumo do roadmap

Produza uma visão do roadmap com:

#### Visão geral de status
Resumo rápido: X itens em andamento, Y concluídos neste período, Z em risco.

#### Itens do roadmap
Para cada item, mostre:
- Nome e descrição em uma linha
- Indicador de status (no caminho / em risco / bloqueado / concluído / não iniciado)
- Prazo-alvo ou data
- Responsável
- Principais dependências

Agrupe os itens por:
- Horizonte (Agora / Próximo / Depois) ou trimestre, conforme o formato
- Ou por tema/objetivo, se o usuário preferir

#### Riscos e dependências
- Itens bloqueados ou em risco, com detalhes
- Dependências entre times e seu status
- Itens que se aproximam de prazos rígidos

#### Mudanças nesta atualização
Se for uma atualização de um roadmap existente, resuma o que mudou:
- Itens adicionados, removidos ou repriorizados
- Deslocamentos de cronograma
- Mudanças de status

### 4. Acompanhamento

Depois de gerar o roadmap:
- Ofereça formatá-lo para um público específico (resumo executivo, detalhe de engenharia, voltado a clientes)
- Ofereça redigir a comunicação sobre as mudanças do roadmap
- Se a ferramenta de gestão de projetos estiver conectada, ofereça atualizar os status dos tickets

## Frameworks de roadmap

### Agora / Próximo / Depois
O formato mais simples e, muitas vezes, mais eficaz:

- **Agora** (sprint/mês atual): trabalho comprometido. Alta confiança em escopo e prazo. São as coisas que o time está construindo ativamente.
- **Próximo** (próximos 1-3 meses): trabalho planejado. Boa confiança no quê, menos confiança em exatamente quando. Com escopo e prioridade, mas ainda não iniciado.
- **Depois** (3-6+ meses): direcional. São apostas estratégicas e oportunidades que pretendemos perseguir, mas escopo e prazo são flexíveis.

Quando usar: a maioria dos times, na maior parte do tempo. Especialmente bom para comunicar externamente ou à liderança, porque evita falsa precisão nas datas.

### Temas trimestrais
Organize o roadmap em torno de 2-3 temas por trimestre:

- Cada tema representa uma área estratégica de investimento (por exemplo, "Prontidão corporativa", "Melhorias de ativação", "Extensibilidade da plataforma")
- Sob cada tema, liste as iniciativas específicas planejadas
- Os temas devem se conectar aos OKRs da empresa ou do time
- Esse formato facilita explicar POR QUE você está construindo o que está construindo

Quando usar: quando precisar mostrar alinhamento estratégico. Bom para reuniões de planejamento e comunicação executiva.

### Roadmap alinhado a OKRs
Mapeie os itens do roadmap diretamente a Objetivos e Resultados-Chave:

- Comece pelos OKRs do time no período
- Sob cada Resultado-Chave, liste as iniciativas que vão mover essa métrica
- Inclua o impacto esperado de cada iniciativa no Resultado-Chave
- Isso cria responsabilização clara entre o que você constrói e o que mede

Quando usar: organizações que operam por OKRs. Bom para garantir que toda iniciativa tenha um "porquê" claro, ligado a resultados mensuráveis.

### Visão de linha do tempo / Gantt
Visão baseada em calendário, com os itens em uma linha do tempo:

- Mostra datas de início, de fim e durações
- Visualiza paralelismo e sequenciamento
- Bom para identificar conflitos de recursos
- Mostra dependências entre itens

Quando usar: planejamento de execução com engenharia. Identificar conflitos de agenda. NÃO é bom para comunicar externamente (cria expectativas de falsa precisão).

## Frameworks de priorização

### Pontuação RICE
Pontue cada iniciativa em quatro dimensões e depois calcule RICE = (Alcance x Impacto x Confiança) / Esforço

- **Alcance (Reach)**: quantos usuários/clientes isto vai afetar em um dado período? Use números concretos (por exemplo, "500 usuários por trimestre").
- **Impacto (Impact)**: quanto isto move o ponteiro para cada pessoa alcançada? Pontue numa escala: 3 = enorme, 2 = alto, 1 = médio, 0,5 = baixo, 0,25 = mínimo.
- **Confiança (Confidence)**: quão confiantes estamos nas estimativas de alcance e impacto? 100% = alta confiança (apoiada em dados), 80% = média (alguma evidência), 50% = baixa (intuição).
- **Esforço (Effort)**: quantos pessoas-mês de trabalho? Inclua engenharia, design e quaisquer outras funções.

Quando usar: quando precisar de uma priorização quantitativa e defensável. Bom para comparar um grande backlog de iniciativas. Menos bom para apostas estratégicas em que o impacto é difícil de estimar.

### MoSCoW
Categorize os itens em Must have, Should have, Could have, Won't have:

- **Must have**: o roadmap é um fracasso sem eles. Compromissos inegociáveis.
- **Should have**: importantes e esperados, mas a entrega é viável sem eles.
- **Could have**: desejáveis, mas claramente de menor prioridade. Inclua só se a capacidade permitir.
- **Won't have**: explicitamente fora do escopo neste período. Importante listar, por clareza.

Quando usar: delimitar uma versão ou trimestre. Negociar com stakeholders o que cabe. Bom para forçar conversas de priorização.

### Pontuação ICE
Mais simples que o RICE. Pontue cada item de 1 a 10 em três dimensões:

- **Impacto (Impact)**: quanto isto vai mover a métrica-alvo?
- **Confiança (Confidence)**: quão confiantes estamos na estimativa de impacto?
- **Facilidade (Ease)**: quão fácil é implementar? (Inverso do esforço: maior = mais fácil)

Pontuação ICE = Impacto x Confiança x Facilidade

Quando usar: priorização rápida de um backlog de funcionalidades. Bom para produtos em estágio inicial ou quando você não tem dados suficientes para o RICE.

### Matriz valor versus esforço
Posicione as iniciativas em uma matriz 2x2:

- **Alto valor, baixo esforço** (ganhos rápidos): faça estes primeiro.
- **Alto valor, alto esforço** (grandes apostas): planeje com cuidado. Vale o investimento, mas precisa de escopo adequado.
- **Baixo valor, baixo esforço** (preenchimentos): faça quando tiver capacidade sobrando.
- **Baixo valor, alto esforço** (poços de dinheiro): não faça. Retire do backlog.

Quando usar: priorização visual em sessões de planejamento do time. Bom para construir entendimento compartilhado dos trade-offs.

## Mapeamento de dependências

### Identificando dependências
Procure dependências nestas categorias:

- **Dependências técnicas**: a funcionalidade B exige trabalho de infraestrutura da funcionalidade A
- **Dependências de time**: a funcionalidade exige trabalho de outro time (design, plataforma, dados)
- **Dependências externas**: aguardando um fornecedor, parceiro ou integração de terceiros
- **Dependências de conhecimento**: é preciso o resultado de uma pesquisa ou investigação antes de começar
- **Dependências sequenciais**: é preciso lançar a funcionalidade A antes de começar a B (código compartilhado, fluxo do usuário)

### Gerenciando dependências
- Liste todas as dependências explicitamente no roadmap
- Atribua um responsável a cada dependência (quem é responsável por resolvê-la)
- Defina uma data "necessária até": quando o item dependente precisa disso resolvido
- Crie folga em torno das dependências: são os itens de maior risco de qualquer roadmap
- Sinalize cedo as dependências que cruzam fronteiras de times: exigem coordenação
- Tenha um plano de contingência: o que fazer se a dependência atrasar?

### Reduzindo dependências
- Dá para construir uma versão mais simples que evite a dependência?
- Dá para paralelizar usando um contrato de interface ou um mock?
- Dá para sequenciar de outra forma e antecipar a dependência?
- Dá para absorver o trabalho no seu time e eliminar a coordenação entre times?

## Planejamento de capacidade

### Estimando a capacidade
- Comece pelo número de engenheiros e pelo período
- Subtraia as sobrecargas conhecidas: reuniões, plantões, entrevistas, feriados, férias
- Uma regra prática comum: engenheiros gastam 60-70% do tempo em trabalho de funcionalidades planejadas
- Considere o tempo de adaptação de novos integrantes

### Alocando a capacidade
Uma alocação saudável para a maioria dos times de produto:

- **70% de funcionalidades planejadas**: itens do roadmap que avançam as metas estratégicas
- **20% de saúde técnica**: dívida técnica, confiabilidade, desempenho, experiência de desenvolvimento
- **10% não planejado**: folga para problemas urgentes, ganhos rápidos e pedidos de outros times

Ajuste as proporções conforme o contexto do time:
- Produto novo: mais trabalho de funcionalidades, menos dívida técnica
- Produto maduro: mais investimento em dívida técnica e confiabilidade
- Pós-incidente: mais confiabilidade, menos funcionalidades
- Crescimento rápido: mais escalabilidade e desempenho

### Capacidade versus ambição
- Se os compromissos do roadmap excedem a capacidade, algo precisa ceder
- Não resolva problemas de capacidade fingindo que as pessoas podem fazer mais: resolva cortando escopo
- Ao adicionar algo ao roadmap, sempre pergunte: "O que sai?"
- É melhor se comprometer com menos coisas e entregar de forma confiável do que se comprometer demais e decepcionar

## Comunicando mudanças no roadmap

### Quando o roadmap muda
Gatilhos comuns de mudanças no roadmap:
- Nova prioridade estratégica vinda da liderança
- Feedback de clientes ou pesquisa que muda as prioridades
- Descoberta técnica que muda as estimativas
- Atraso de dependência de outro time
- Mudança de recursos (o time cresce ou encolhe, uma pessoa-chave sai)
- Movimento competitivo que exige resposta

### Como comunicar as mudanças
1. **Reconheça a mudança**: seja direto sobre o que está mudando e por quê
2. **Explique o motivo**: que informação nova levou a essa decisão?
3. **Mostre o trade-off**: o que foi despriorizado para abrir espaço? Ou o que está atrasando?
4. **Mostre o novo plano**: roadmap atualizado com as mudanças refletidas
5. **Reconheça o impacto**: quem é afetado e como? Stakeholders que esperavam itens despriorizados precisam ouvir isso diretamente.

### Evitando o efeito chicote no roadmap
- Não mude o roadmap a cada informação nova. Tenha um limiar para mudar.
- Agrupe as atualizações do roadmap em cadências naturais (mensal, trimestral), a menos que algo seja realmente urgente.
- Distinga "mudança de roadmap" (repriorização estratégica) de "ajuste de escopo" (refinamento normal da execução).
- Acompanhe com que frequência o roadmap muda. Mudanças frequentes podem indicar estratégia pouco clara, não boa capacidade de resposta.

## Formato de saída

Use um formato claro e fácil de percorrer. Tabelas funcionam bem para itens do roadmap. Use rótulos de status em texto: **Done**, **On Track**, **At Risk**, **Blocked**, **Not Started**.

## Dicas

- Um roadmap é uma ferramenta de comunicação, não um plano de projeto. Mantenha-o na altitude certa: temas e resultados, não tarefas.
- Ao repriorizar, sempre pergunte o que mudou. As mudanças de prioridade devem vir de informação nova, não de capricho.
- Sinalize cedo problemas de capacidade. Se o roadmap tem mais trabalho do que o time dá conta, diga.
- Dependências são o maior risco dos roadmaps. Traga-as à tona explicitamente.
- Se o usuário pedir para adicionar algo, sempre pergunte o que sai ou se move. Roadmaps são de soma zero contra a capacidade.
