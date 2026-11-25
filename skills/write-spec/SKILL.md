---
name: write-spec
description: "Escreve uma especificação de funcionalidade ou PRD a partir de um problema ou ideia. Use para transformar uma ideia vaga ou pedido de usuário em um documento estruturado, delimitar uma funcionalidade com objetivos e não objetivos, definir métricas de sucesso e critérios de aceite, ou quebrar um pedido grande em fases."
argument-hint: "<feature or problem statement>"
---

# Escrever uma especificação

> Se aparecerem placeholders desconhecidos ou você precisar conferir quais ferramentas estão conectadas, veja [CONNECTORS.md](../../CONNECTORS.md).

Escreva uma especificação de funcionalidade ou um documento de requisitos de produto (PRD).

## Uso

```
/write-spec $ARGUMENTS
```

## Fluxo de trabalho

### 1. Entenda a funcionalidade

Pergunte ao usuário o que ele quer especificar. Aceite qualquer um destes:
- Um nome de funcionalidade ("suporte a SSO")
- Um problema ("Clientes corporativos continuam pedindo autenticação centralizada")
- Um pedido de usuário ("Usuários querem exportar seus dados em CSV")
- Uma ideia vaga ("Deveríamos fazer algo sobre a desistência no onboarding")

### 2. Reúna contexto

Pergunte ao usuário o seguinte. Seja conversacional: não despeje todas as perguntas de uma vez. Faça primeiro as mais importantes e preencha as lacunas ao longo da conversa:

- **Problema do usuário**: que problema isto resolve? Quem o vive?
- **Usuários-alvo**: que segmento(s) de usuários isto atende?
- **Métricas de sucesso**: como saberemos que funcionou?
- **Restrições**: restrições técnicas, prazo, exigências regulatórias, dependências
- **Referências anteriores**: isso já foi tentado antes? Há soluções existentes?

### 3. Puxe contexto das ferramentas conectadas

Se o **~~project tracker** estiver conectado:
- Busque tickets, épicos ou funcionalidades relacionados
- Traga requisitos ou critérios de aceite existentes
- Identifique dependências de outros itens de trabalho

Se a **~~knowledge base** estiver conectada:
- Busque documentos de pesquisa, especificações anteriores ou documentos de design relacionados
- Traga achados relevantes de pesquisa com usuários
- Encontre atas de reuniões ou registros de decisão relacionados

Se o **~~design** estiver conectado:
- Traga mockups, wireframes ou explorações de design relacionados
- Busque componentes do design system relevantes para a funcionalidade

Se essas ferramentas não estiverem conectadas, trabalhe inteiramente com o que o usuário fornecer. Não peça ao usuário para conectar ferramentas: apenas siga com as informações disponíveis.

### 4. Gere o PRD

Produza um PRD estruturado com estas seções. Veja **Estrutura do PRD** abaixo para orientação detalhada sobre o que cada seção deve conter.

- **Declaração do problema**: o problema do usuário, quem é afetado e o impacto de não resolvê-lo (2-3 frases)
- **Objetivos**: 3-5 resultados específicos e mensuráveis ligados a métricas de usuário ou de negócio
- **Não objetivos**: 3-5 coisas explicitamente fora do escopo, com uma breve justificativa para cada uma
- **Histórias de usuário**: formato padrão ("Como [tipo de usuário], quero [capacidade] para que [benefício]"), agrupadas por persona
- **Requisitos**: categorizados como Obrigatórios (P0), Desejáveis (P1) e Considerações futuras (P2), cada um com critérios de aceite
- **Métricas de sucesso**: indicadores antecedentes (mudam rápido) e indicadores de resultado (mudam com o tempo), com metas específicas
- **Perguntas em aberto**: perguntas não resolvidas, marcadas com quem precisa responder (engenharia, design, jurídico, dados)
- **Considerações de cronograma**: prazos rígidos, dependências e faseamento

### 5. Revise e itere

Depois de gerar o PRD:
- Pergunte ao usuário se alguma seção precisa de ajuste
- Ofereça detalhar seções específicas
- Ofereça criar artefatos de continuidade (briefing de design, quebra em tickets de engenharia, pitch para stakeholders)

## Estrutura do PRD

### Declaração do problema
- Descreva o problema do usuário em 2-3 frases
- Quem vive esse problema e com que frequência
- Qual é o custo de não resolvê-lo (dor do usuário, impacto no negócio, risco competitivo)
- Fundamente em evidências: pesquisa com usuários, dados de suporte, métricas ou feedback de clientes

### Objetivos
- 3-5 resultados específicos e mensuráveis que esta funcionalidade deve alcançar
- Cada objetivo deve responder: "Como saberemos que isto deu certo?"
- Distinga objetivos do usuário (o que os usuários ganham) de objetivos de negócio (o que a empresa ganha)
- Objetivos devem ser resultados, não entregas ("reduzir em 50% o tempo até o primeiro valor", não "construir um assistente de onboarding")

### Não objetivos
- 3-5 coisas que esta funcionalidade explicitamente NÃO fará
- Capacidades adjacentes que estão fora do escopo desta versão
- Para cada não objetivo, explique brevemente por que está fora do escopo (pouco impacto, complexo demais, iniciativa separada, prematuro)
- Os não objetivos evitam o aumento de escopo durante a implementação e alinham expectativas com os stakeholders

### Histórias de usuário
Escreva histórias de usuário no formato padrão: "Como [tipo de usuário], quero [capacidade] para que [benefício]"

Diretrizes:
- O tipo de usuário deve ser específico o bastante para ter significado ("administrador corporativo", não apenas "usuário")
- A capacidade deve descrever o que ele quer realizar, não como
- O benefício deve explicar o "porquê": que valor isto entrega
- Inclua casos de borda: estados de erro, estados vazios, condições-limite
- Inclua diferentes tipos de usuário se a funcionalidade atender a várias personas
- Ordene por prioridade: as histórias mais importantes primeiro

Exemplo:
- "Como administrador de equipe, quero configurar o SSO da minha organização para que os membros da equipe possam entrar com as credenciais corporativas"
- "Como membro da equipe, quero ser redirecionado automaticamente ao login SSO da minha empresa para não precisar lembrar de uma senha separada"
- "Como administrador de equipe, quero ver quais membros entraram via SSO para poder verificar se a implantação está funcionando"

### Requisitos

**Obrigatórios (P0)**: a funcionalidade não pode ser lançada sem eles. Representam a versão mínima viável. Pergunte: "Se cortarmos isto, a funcionalidade ainda resolve o problema central?" Se não, é P0.

**Desejáveis (P1)**: melhoram bastante a experiência, mas o caso de uso central funciona sem eles. Costumam virar entregas rápidas logo após o lançamento.

**Considerações futuras (P2)**: explicitamente fora do escopo da v1, mas queremos projetar de um jeito que os suporte depois. Documentá-los evita decisões arquiteturais acidentais que os tornem difíceis mais tarde.

Para cada requisito:
- Escreva uma descrição clara e inequívoca do comportamento esperado
- Inclua critérios de aceite (veja abaixo)
- Anote quaisquer considerações ou restrições técnicas
- Sinalize dependências de outros times ou sistemas

### Perguntas em aberto
- Perguntas que precisam de resposta antes ou durante a implementação
- Marque cada uma com quem deve responder (engenharia, design, jurídico, dados, stakeholder)
- Distinga perguntas bloqueantes (precisam de resposta antes de começar) de não bloqueantes (podem ser resolvidas durante a implementação)

### Considerações de cronograma
- Prazos rígidos (compromissos contratuais, eventos, datas de conformidade)
- Dependências do trabalho ou de lançamentos de outros times
- Faseamento sugerido se a funcionalidade for grande demais para uma única entrega

## Escrita de histórias de usuário

Boas histórias de usuário são:
- **Independentes**: podem ser desenvolvidas e entregues por conta própria
- **Negociáveis**: os detalhes podem ser discutidos, a história não é um contrato
- **Valiosas**: entregam valor ao usuário (não só ao time)
- **Estimáveis**: o time consegue estimar o esforço de modo aproximado
- **Pequenas**: podem ser concluídas em uma sprint/iteração
- **Testáveis**: há uma forma clara de verificar que funcionam

### Erros comuns em histórias de usuário
- Vagas demais: "Como usuário, quero que o produto seja mais rápido": o que exatamente deve ficar mais rápido?
- Prescritivas quanto à solução: "Como usuário, quero um menu suspenso": descreva a necessidade, não o componente de interface
- Sem benefício: "Como usuário, quero clicar em um botão": por quê? O que isso realiza?
- Grandes demais: "Como usuário, quero gerenciar minha equipe": quebre em capacidades específicas
- Foco interno: "Como time de engenharia, queremos refatorar o banco de dados": isso é uma tarefa, não uma história de usuário

## Categorização de requisitos

### Framework MoSCoW
- **Must have**: sem eles, a funcionalidade não é viável. Inegociáveis.
- **Should have**: importantes, mas não críticos para o lançamento. Entregas rápidas de alta prioridade.
- **Could have**: desejáveis se houver tempo. Não atrasam a entrega se cortados.
- **Won't have (desta vez)**: explicitamente fora do escopo. Podem ser revisitados em versões futuras.

### Dicas de categorização
- Seja implacável com os P0. Quanto mais enxuta a lista de obrigatórios, mais rápido você lança e aprende.
- Se tudo é P0, nada é P0. Questione cada obrigatório: "Realmente não lançaríamos sem isto?"
- Os P1 devem ser coisas que você tem confiança de que vai construir em breve, não uma lista de desejos.
- Os P2 são um seguro arquitetural: orientam decisões de design mesmo que você não os esteja construindo agora.

## Definição de métricas de sucesso

### Indicadores antecedentes
Métricas que mudam rápido depois do lançamento (dias a semanas):
- **Taxa de adoção**: % dos usuários elegíveis que experimentam a funcionalidade
- **Taxa de ativação**: % dos usuários que completam a ação central
- **Taxa de conclusão de tarefa**: % dos usuários que conseguem alcançar seu objetivo
- **Tempo para concluir**: quanto tempo leva o fluxo central
- **Taxa de erro**: com que frequência os usuários encontram erros ou becos sem saída
- **Frequência de uso da funcionalidade**: com que frequência os usuários voltam a usá-la

### Indicadores de resultado
Métricas que levam tempo para se desenvolver (semanas a meses):
- **Impacto na retenção**: esta funcionalidade melhora a retenção de usuários?
- **Impacto na receita**: isto gera upgrades, expansão ou receita nova?
- **Mudança no NPS / satisfação**: isto melhora o que os usuários sentem pelo produto?
- **Redução de chamados de suporte**: isto reduz a carga de suporte?
- **Taxa de vitória competitiva**: isto ajuda a ganhar mais negócios?

### Definindo metas
- As metas devem ser específicas: "50% de adoção em 30 dias", não "alta adoção"
- Baseie as metas em funcionalidades comparáveis, referências do setor ou hipóteses explícitas
- Defina um limiar de "sucesso" e uma meta "ambiciosa"
- Defina o método de medição: que ferramenta, que consulta, que janela de tempo
- Especifique quando avaliará: 1 semana, 1 mês, 1 trimestre após o lançamento

## Critérios de aceite

Escreva critérios de aceite no formato Dado/Quando/Então ou como lista de verificação:

**Dado/Quando/Então**:
- Dado [pré-condição ou contexto]
- Quando [ação que o usuário realiza]
- Então [resultado esperado]

Exemplo:
- Dado que o administrador configurou o SSO da organização
- Quando um membro da equipe acessa a página de login
- Então ele é redirecionado automaticamente ao provedor de SSO da organização

**Formato de lista de verificação**:
- [ ] O administrador consegue informar a URL do provedor de SSO nas configurações da organização
- [ ] Os membros da equipe veem o botão "Entrar com SSO" na página de login
- [ ] O login via SSO cria uma conta nova se não existir uma
- [ ] O login via SSO vincula a uma conta existente se o e-mail coincidir
- [ ] Tentativas de SSO que falham mostram uma mensagem de erro clara

### Dicas para critérios de aceite
- Cubra o caminho feliz, os casos de erro e os casos de borda
- Seja específico sobre o comportamento esperado, não sobre a implementação
- Inclua o que NÃO deve acontecer (casos de teste negativos)
- Cada critério deve ser testável de forma independente
- Evite palavras ambíguas: "rápido", "amigável", "intuitivo": defina concretamente o que significam

## Gestão de escopo

### Reconhecendo o aumento de escopo
O aumento de escopo acontece quando:
- Requisitos continuam sendo adicionados depois que a especificação foi aprovada
- Adições "pequenas" se acumulam em um projeto bem maior
- O time constrói funcionalidades que nenhum usuário pediu ("já que estamos aqui...")
- A data de lançamento continua se movendo sem um novo escopo explícito
- Stakeholders adicionam requisitos sem remover nada

### Prevenindo o aumento de escopo
- Escreva não objetivos explícitos em toda especificação
- Exija que toda adição de escopo venha com uma remoção de escopo ou extensão de prazo
- Separe claramente a "v1" da "v2" na especificação
- Revise a especificação contra a declaração original do problema: tudo a serve?
- Limite no tempo as investigações: "Se não descobrirmos X em 2 dias, cortamos"
- Crie um "estacionamento" para boas ideias que estão fora do escopo

## Formato de saída

Use markdown com títulos claros. Mantenha o documento fácil de percorrer: stakeholders ocupados devem conseguir ler só os títulos e o texto em negrito para captar a ideia geral.

## Dicas

- Seja opinativo quanto ao escopo. É melhor uma especificação enxuta e bem definida do que uma expansiva e vaga.
- Se a ideia do usuário é grande demais para uma única especificação, sugira dividir em fases e especifique a primeira.
- As métricas de sucesso devem ser específicas e mensuráveis, não vagas ("melhorar a experiência do usuário").
- Os não objetivos são tão importantes quanto os objetivos. Evitam o aumento de escopo durante a implementação.
- As perguntas em aberto devem ser genuinamente em aberto: não inclua perguntas que você pode responder pelo contexto.
