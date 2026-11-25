---
name: stakeholder-update
description: "Gera uma atualização para stakeholders adaptada ao público e à periodicidade. Use para escrever status semanal ou mensal para a liderança, anunciar um lançamento, escalar um risco ou bloqueio, ou traduzir o mesmo progresso em versões para executivos, para engenharia ou para clientes."
argument-hint: "<update type and audience>"
---

# Atualização para stakeholders

> Se aparecerem placeholders desconhecidos ou você precisar conferir quais ferramentas estão conectadas, veja [CONNECTORS.md](../../CONNECTORS.md).

Gere uma atualização para stakeholders adaptada ao público e à periodicidade.

## Uso

```
/stakeholder-update $ARGUMENTS
```

## Fluxo de trabalho

### 1. Determine o tipo de atualização

Pergunte ao usuário que tipo de atualização:
- **Semanal**: atualização de cadência regular sobre progresso, bloqueios e próximos passos
- **Mensal**: resumo de nível mais alto, com tendências, marcos e alinhamento estratégico
- **Lançamento**: anúncio do lançamento de uma funcionalidade ou produto, com detalhes e impacto
- **Pontual (ad-hoc)**: atualização única para uma situação específica (escalonamento, mudança de rumo, grande decisão)

### 2. Determine o público

Pergunte para quem é a atualização:
- **Executivos / liderança**: alto nível, focada em resultados, com enquadramento estratégico, breve
- **Time de engenharia**: detalhe técnico, contexto de implementação, bloqueios, decisões necessárias
- **Parceiros multifuncionais**: detalhe adequado ao contexto, foco em objetivos compartilhados e dependências
- **Clientes / externo**: focada em benefícios, prazos claros, sem jargão interno
- **Conselho**: orientada por métricas, estratégica, focada em riscos, muito concisa

### 3. Puxe contexto das ferramentas conectadas

Se o **~~project tracker** estiver conectado:
- Puxe o status dos itens do roadmap e dos marcos
- Identifique os itens concluídos desde a última atualização
- Traga à tona itens em risco ou bloqueados
- Puxe o progresso da sprint ou iteração

Se o **~~chat** estiver conectado:
- Busque discussões e decisões relevantes do time
- Encontre bloqueios ou problemas levantados nos canais
- Identifique decisões-chave tomadas de forma assíncrona

Se a **~~meeting transcription** estiver conectada:
- Puxe notas recentes de reuniões e resumos de discussões
- Encontre decisões e itens de ação das reuniões relevantes

Se a **~~knowledge base** estiver conectada:
- Busque notas recentes de reuniões
- Encontre documentos de decisão ou revisões de design

Se nenhuma ferramenta estiver conectada, peça ao usuário que forneça:
- O que foi realizado desde a última atualização
- Bloqueios ou riscos atuais
- Decisões-chave tomadas ou necessárias
- O que vem a seguir

### 4. Gere a atualização

Estruture a atualização para o público-alvo usando os modelos e frameworks abaixo.

**Para executivos**: TL;DR, cor de status (G/Y/R), progresso-chave ligado às metas, decisões tomadas, riscos com mitigação, pedidos específicos e próximos marcos. Mantenha abaixo de 300 palavras.

**Para engenharia**: o que foi entregue (com links), o que está em andamento (com responsáveis), bloqueios, decisões necessárias (com opções e recomendação) e o que vem a seguir.

**Para parceiros multifuncionais**: o que está chegando e os afeta, o que você precisa deles (com prazos), decisões que impactam o time deles e áreas abertas a contribuições.

**Para clientes**: o que há de novo (enquadrado como benefícios), o que vem em breve, problemas conhecidos com soluções alternativas e como dar feedback. Sem jargão interno.

**Para anúncios de lançamento**: o que foi lançado, por que importa, detalhes-chave (escopo, disponibilidade, limitações), métricas de sucesso, plano de liberação e canais de feedback.

### 5. Revise e entregue

Depois de gerar a atualização:
- Pergunte se o usuário quer ajustar o tom, o nível de detalhe ou a ênfase
- Ofereça formatar para o canal de entrega (e-mail, post de chat, documento, slides)
- Se o **~~chat** estiver conectado, ofereça redigir a mensagem para envio

## Modelos de atualização por público

### Atualização para executivos / liderança
Executivos querem: contexto estratégico, progresso em relação às metas, riscos em que precisam de ajuda, decisões que precisam da opinião deles.

**Formato**:
```
Status: [Green / Yellow / Red]

TL;DR: [Uma frase: a coisa mais importante a saber]

Progresso:
- [Resultado alcançado, ligado à meta/OKR]
- [Marco atingido, com impacto]
- [Movimento de métrica-chave]

Riscos:
- [Risco]: [Plano de mitigação]. [Pedido, se necessário].

Decisões necessárias:
- [Decisão]: [Opções com recomendação]. Necessária até [data].

Próximos marcos:
- [Marco] — [Data]
```

**Dicas para atualizações a executivos**:
- Abra com a conclusão, não com a jornada. Executivos querem "lançamos X e isso moveu a métrica Y", não "tivemos 14 dailies e resolvemos 23 tickets".
- Mantenha abaixo de 200 palavras. Se quiserem mais, eles pedem.
- A cor de status deve refletir a SUA avaliação genuína, não o que você acha que eles querem ouvir. Amarelo não é fracasso: é boa gestão de risco.
- Inclua apenas riscos em que você quer ajuda. Não liste riscos que você já está tratando, a menos que eles precisem saber.
- Os pedidos devem ser específicos: "Decisão sobre X até sexta", não "preciso de apoio".

### Atualização para o time de engenharia
Engenheiros querem: prioridades claras, contexto técnico, bloqueios resolvidos, decisões que afetam o trabalho deles.

**Formato**:
```
Entregue:
- [Funcionalidade/correção] — [Link do PR/ticket]. [Impacto, se notável].

Em andamento:
- [Item] — [Responsável]. [Conclusão esperada]. [Bloqueios, se houver].

Decisões:
- [Decisão tomada]: [Justificativa]. [Link do ADR, se existir].
- [Decisão necessária]: [Contexto]. [Opções]. [Recomendação].

Mudanças de prioridade:
- [O que mudou e por quê]

Em breve:
- [Próximos itens] — [Contexto de por que são os próximos]
```

**Dicas para atualizações a engenharia**:
- Dê links para tickets, PRs e documentos específicos. Engenheiros querem clicar para ver os detalhes.
- Quando as prioridades mudarem, explique por quê. Engenheiros se engajam mais quando entendem o motivo.
- Seja explícito sobre o que os bloqueia e o que você está fazendo para desbloquear.
- Não desperdice o tempo deles com informação que não afeta o trabalho.

### Atualização para parceiros multifuncionais
Parceiros (design, marketing, vendas, suporte) querem: o que está chegando e os afeta, para o que precisam se preparar, como dar contribuições.

**Formato**:
```
O que está chegando:
- [Funcionalidade/lançamento] — [Data]. [O que isso significa para o seu time].

O que precisamos de vocês:
- [Pedido específico] — [Contexto]. Até [data].

Decisões tomadas:
- [Decisão] — [Como afeta o seu time].

Aberto a contribuições:
- [Tópico sobre o qual adoraríamos feedback] — [Como dar].
```

### Atualização para clientes / externa
Clientes querem: o que há de novo, o que vem aí, como os beneficia, como começar.

**Formato**:
```
O que há de novo:
- [Funcionalidade] — [Benefício em termos do cliente]. [Como usar / link].

Em breve:
- [Funcionalidade] — [Prazo esperado]. [Por que importa para você].

Problemas conhecidos:
- [Problema] — [Status]. [Solução alternativa, se houver].

Feedback:
- [Como compartilhar feedback ou pedir funcionalidades]
```

**Dicas para atualizações a clientes**:
- Sem jargão interno. Sem números de ticket. Sem detalhes técnicos de implementação.
- Enquadre tudo em termos do que o cliente agora consegue FAZER, não do que você construiu.
- Seja honesto sobre prazos, mas não prometa demais. "Ainda neste trimestre" é melhor que uma data que você pode perder.
- Só mencione problemas conhecidos se afetarem o cliente e você tiver um plano de resolução.

## Framework de relatório de status

### Status verde / amarelo / vermelho

**Verde** (no caminho):
- Progredindo como planejado
- Sem riscos ou bloqueios significativos
- No caminho para cumprir compromissos e prazos
- Use Verde quando as coisas estão genuinamente indo bem, não como padrão

**Amarelo** (em risco):
- O progresso está mais lento que o planejado, ou um risco se materializou
- A mitigação está em andamento, mas o resultado é incerto
- Pode perder compromissos sem intervenção ou ajuste de escopo
- Use Amarelo de forma proativa: quanto mais cedo você sinaliza o risco, mais opções tem

**Vermelho** (fora do caminho):
- Significativamente atrás do plano
- Grande bloqueio ou risco sem mitigação clara
- Vai perder compromissos sem intervenção significativa (corte de escopo, reforço de recursos, extensão de prazo)
- Use Vermelho quando você realmente precisa de ajuda. Não espere até ser tarde demais.

### Quando mudar o status
- Mude para Amarelo no PRIMEIRO sinal de risco, não quando tiver certeza de que as coisas estão ruins
- Mude para Vermelho quando esgotar as suas próprias opções e precisar de escalonamento
- Volte para Verde só quando o risco estiver genuinamente resolvido, não apenas pausado
- Documente o que mudou quando mudar o status: "Mudou para Amarelo porque [motivo]"

## Comunicação de riscos

### Framework ROAM para gestão de riscos
- **Resolved (resolvido)**: o risco não é mais uma preocupação. Documente como foi resolvido.
- **Owned (com dono)**: o risco é reconhecido e alguém o gerencia ativamente. Informe o responsável e o plano de mitigação.
- **Accepted (aceito)**: o risco é conhecido, mas escolhemos prosseguir sem mitigação. Documente a justificativa.
- **Mitigated (mitigado)**: ações reduziram o risco a um nível aceitável. Documente o que foi feito.

### Comunicando riscos com eficácia
1. **Declare o risco com clareza**: "Há um risco de que [coisa] aconteça porque [motivo]"
2. **Quantifique o impacto**: "Se isso acontecer, a consequência é [impacto]"
3. **Declare a probabilidade**: "Isso é [provável/possível/improvável] porque [evidência]"
4. **Apresente a mitigação**: "Estamos gerenciando isso por [ações]"
5. **Faça o pedido**: "Precisamos de [ajuda específica] para reduzir ainda mais esse risco"

### Erros comuns na comunicação de riscos
- Enterrar riscos em boas notícias. Abra com os riscos quando forem importantes.
- Ser vago: "Pode haver alguns atrasos": especifique o quê, quanto tempo e por quê.
- Apresentar riscos sem mitigações. Todo risco deve vir com um plano.
- Esperar demais. Um risco comunicado cedo é um insumo de planejamento. Um risco comunicado tarde é um alarme de incêndio.

## Documentação de decisões (ADRs)

### Formato do Architecture Decision Record
Documente decisões importantes para referência futura:

```
# [Título da decisão]

## Status
[Proposed / Accepted / Deprecated / Superseded by ADR-XXX]

## Context
Qual é a situação que exige uma decisão? Que forças estão em jogo?

## Decision
O que decidimos? Declare a decisão de forma clara e direta.

## Consequences
Quais são as implicações dessa decisão?
- Consequências positivas
- Consequências negativas ou trade-offs aceitos
- O que isso viabiliza ou impede no futuro

## Alternatives Considered
Que outras opções foram avaliadas?
Para cada uma: o que era, por que foi rejeitada?
```

### Quando escrever um ADR
- Decisões estratégicas de produto (qual segmento de mercado atingir, qual plataforma suportar)
- Decisões técnicas significativas (escolhas de arquitetura, seleção de fornecedor, construir ou comprar)
- Decisões polêmicas em que as pessoas discordaram (documente a justificativa para referência futura)
- Decisões que restringem opções futuras (escolher uma tecnologia, assinar uma parceria)
- Decisões que você espera que as pessoas questionem depois (registre o contexto enquanto está fresco)

### Dicas para documentação de decisões
- Escreva os ADRs perto do momento da decisão, não semanas depois
- Inclua quem esteve envolvido na decisão e quem deu a palavra final
- Documente o contexto com generosidade: os leitores futuros não terão o contexto de hoje
- Tudo bem documentar decisões que se mostraram erradas em retrospecto: adicione um link "superseded by"
- Mantenha-os curtos. Uma página é melhor que cinco.

## Facilitação de reuniões

### Stand-up / sincronização diária
**Objetivo**: trazer à tona bloqueios, coordenar o trabalho, manter o ritmo.
**Formato**: cada pessoa compartilha:
- O que realizou desde a última sincronização
- No que vai trabalhar a seguir
- O que a bloqueia

**Dicas de facilitação**:
- Limite a 15 minutos. Se surgirem discussões, leve para fora da reunião.
- Foque nos bloqueios: é a parte de maior valor do stand-up
- Acompanhe os bloqueios e faça o seguimento até a resolução
- Cancele o stand-up se não houver nada a sincronizar. Respeite o tempo das pessoas.

### Planejamento de sprint / iteração
**Objetivo**: comprometer-se com o trabalho da próxima sprint. Alinhar prioridades e escopo.
**Formato**:
1. Revisão: o que foi entregue na última sprint, o que sobrou, o que foi cortado
2. Prioridades: quais são as coisas mais importantes a realizar nesta sprint
3. Capacidade: quanto o time consegue assumir (considere férias, plantões, reuniões)
4. Compromisso: selecione itens do backlog que cabem na capacidade e nas prioridades
5. Dependências: sinalize quaisquer dependências entre times ou externas

**Dicas de facilitação**:
- Chegue com uma ordem de prioridade proposta. Não peça ao time para priorizar do zero.
- Resista ao excesso de compromisso. É melhor se comprometer com menos e entregar de forma confiável.
- Garanta que todo item tenha um responsável claro e critérios de aceite claros.
- Sinalize itens subdimensionados ou com complexidade escondida.

### Retrospectiva
**Objetivo**: refletir sobre o que foi bem, o que não foi e o que mudar.
**Formato**:
1. Prepare o terreno: lembre o time do objetivo e crie segurança psicológica
2. Reúna dados: o que foi bem, o que não foi bem, o que foi confuso
3. Gere insights: identifique padrões e causas-raiz
4. Decida ações: escolha 1-3 melhorias específicas para tentar na próxima sprint
5. Encerre: agradeça às pessoas pelo feedback honesto

**Dicas de facilitação**:
- Crie segurança psicológica. As pessoas precisam se sentir seguras para ser honestas.
- Foque em sistemas e processos, não em indivíduos.
- Limite a 1-3 itens de ação. Mais que isso e nada muda.
- Faça o seguimento dos itens de ação da retrospectiva anterior. Se você nunca faz, as pessoas deixam de se engajar.
- Varie o formato da retrospectiva de vez em quando para evitar a monotonia.

### Revisão com stakeholders / demonstração
**Objetivo**: mostrar progresso, coletar feedback, construir alinhamento.
**Formato**:
1. Contexto: lembre os stakeholders do objetivo e do que viram da última vez
2. Demonstração: mostre o que foi construído. Use o produto real, não slides.
3. Métricas: compartilhe quaisquer dados ou feedback iniciais
4. Feedback: tempo estruturado para perguntas e contribuições
5. Próximos passos: o que vem a seguir e quando será a próxima revisão

**Dicas de facilitação**:
- Demonstre o produto real sempre que possível. Slides não são demonstrações.
- Enquadre a coleta de feedback: "Que feedback você tem sobre X?" é melhor que "Alguma ideia?"
- Registre o feedback de forma visível e comprometa-se a tratá-lo (ou a explicar por que não)
- Alinhe expectativas sobre que tipo de feedback é acionável nesta etapa

## Formato de saída

Mantenha as atualizações fáceis de percorrer. Use negrito para pontos-chave e tópicos para listas. Atualizações a executivos devem ter menos de 300 palavras. Atualizações a engenharia podem ser mais longas, mas ainda estruturadas para leitura dinâmica.

## Dicas

- O erro mais comum em atualizações para stakeholders é enterrar a informação principal. Comece pela coisa mais importante.
- As cores de status (Green/Yellow/Red) devem refletir a realidade, não o otimismo. Amarelo não é fracasso: é boa comunicação de risco.
- Os pedidos devem ser específicos e acionáveis. "Precisamos de ajuda" não é um pedido. "Precisamos de uma decisão sobre X até sexta" é.
- Para executivos, enquadre tudo em termos de resultados e metas, não de atividades e tarefas.
- Se houver más notícias, abra com elas. Não as esconda depois das boas.
- Ajuste o tamanho à atenção do público. Executivos recebem alguns tópicos. Engenharia recebe os detalhes de que precisa.
