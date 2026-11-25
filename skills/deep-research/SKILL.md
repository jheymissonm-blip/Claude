---
name: deep-research
description: "Use esta skill quando o pedido exigir (1) pesquisar um tema em várias fontes, comparar opções ou alternativas, analisar tendências ou histórico, entender mercados ou setores, ou revisar literatura e estudos e (2) sintetizar essa pesquisa em um relatório narrativo abrangente. Se você pretende pesquisar na web ou em bases de conhecimento internas, considere esta skill. Ela coordena subagentes de pesquisa, então só use quando tiver uma ferramenta para criar subagentes (Agent ou Task); caso contrário, pesquise a pergunta diretamente."
---

# Coordenando uma pesquisa aprofundada

## Seu papel

Você atua como **coordenador**. Seu trabalho é analisar a pergunta do usuário, criar subagentes e gerenciar os arquivos de saída. Para manter seu contexto limpo, você nunca deve fazer a pesquisa nem escrever arquivos diretamente. Pelo mesmo motivo, você também não deve ler os arquivos researcher.md nem report-writer.md.

Enquanto trabalha, se tiver uma ferramenta de lista de tarefas (por exemplo TodoWrite, ou TaskCreate e TaskUpdate), use-a para manter o usuário informado do plano e do progresso. Para ficar claro, não mencione subagentes nesses itens. Por exemplo, escreva "Conduzir a pesquisa" em vez de "Criar subagentes de pesquisa".

## Processo

1. [Se necessário] Faça perguntas de esclarecimento ao usuário
2. Escolha um título para esta pesquisa e crie os diretórios dela
3. Decomponha a consulta do usuário para definir o número de subagentes
4. Crie os subagentes de pesquisa (em paralelo)
5. [Só se for absolutamente necessário] Faça uma rodada adicional de pesquisa
6. Crie o subagente redator do relatório
7. Entregue o relatório ao usuário

### 1. [Se necessário] Faça perguntas de esclarecimento ao usuário

Leia a pergunta do usuário e avalie se há detalhes ausentes ou ambíguos que precisem ser esclarecidos. Alguns exemplos:
- Terminologia ambígua: siglas, jargões ou termos com vários significados em áreas diferentes
- Contexto geográfico ou jurisdicional implícito: perguntas cuja resposta varia muito por região, sem região especificada
- Entidades ambíguas: nomes de empresas, produtos ou nomes próprios que se referem a várias entidades distintas

Para não criar atrito desnecessário com o usuário, só faça perguntas de esclarecimento quando elas afetarem de forma significativa a condução da pesquisa.

Se concluir que precisa fazer perguntas de esclarecimento, faça-as com a ferramenta AskUserQuestion.

### 2. Escolha um título para esta pesquisa e crie os diretórios dela

Primeiro escolha um título para esta pesquisa. Ele dá nome à pasta que guardará as anotações de pesquisa deste pedido e também é o nome do arquivo do relatório que o usuário recebe, onde aparece como título do relatório; portanto faça um título curto e específico para esta pesquisa, no idioma do usuário e em caixa de frase: de 3 a 6 palavras e menos de 50 caracteres (conte, e corte palavras em vez de passar de qualquer um dos limites), usando só letras, números e espaços simples. Mantenha letras acentuadas e não latinas exatamente como o idioma do usuário as escreve (por exemplo é, ñ, ü, 日本語), em vez de convertê-las para ASCII simples, e não use hífens, sublinhados, apóstrofos nem outra pontuação. Por exemplo, uma pergunta sobre como a Lei de IA da UE afeta startups poderia usar "EU AI Act startup obligations".

As pastas desta pesquisa ficam no mesmo diretório que você usou para pesquisas anteriores nesta conversa ou, se este for o primeiro pedido de pesquisa aqui, no seu diretório de trabalho atual (não em /tmp nem em uma pasta de uploads). Antes de decidir o título, lembre os títulos de qualquer relatório de pesquisa que você já entregou antes nesta conversa e, se já existir uma pasta research_notes/ nesse diretório, liste-a: cada pasta dentro dela guarda as anotações por trás de um relatório de mesmo nome em reports/, possivelmente de uma conversa anterior. Depois escolha o caso que se aplica:
- Tema novo: escolha um título novo.
- Retomar, ampliar ou atualizar um tema anterior: escolha um título que ainda nomeie o tema e diga o que este pedido acrescenta ou muda (por exemplo "EU AI Act startup penalties", e não só "Penalties") ou, se nada distinguir este pedido do anterior, o título anterior com o número seguinte acrescentado, tirando antes uma palavra se isso passar dos limites acima (por exemplo "EU AI Act startup obligations 2"). Anote o caminho do relatório anterior mais recente sobre esse tema e o da pasta de anotações dele: você vai passá-los ao redator do relatório no passo 6 como base para construir. Se esse relatório ou a pasta de anotações não estiver mais no disco, passe só o que restar e pesquise o que faltar.
- O usuário pede que a pesquisa anterior seja refeita de forma independente: escolha um título como no caso anterior, mas não repasse o material anterior.

Em todos os casos o título deve ser diferente de todo relatório entregue antes nesta conversa e de toda pasta que você vir, para que as anotações e o relatório deste pedido nunca se misturem com os de um anterior nem os substituam. Nunca renomeie, mova nem escreva na pasta de um pedido anterior.

Depois crie as pastas research_notes/{título da pesquisa}/ e reports/ nesse diretório. Coloque esses caminhos entre aspas nos comandos de shell, pois o título tem espaços, e anote o caminho absoluto do diretório: você dará aos subagentes caminhos absolutos para essas pastas, e eles guardarão seus arquivos lá.

### 3. Decomponha a consulta do usuário para definir o número de subagentes

Para criar e atribuir tarefas aos subagentes com eficácia, determine se e como a pergunta do usuário pode ser decomposta em subtemas independentes. Esses subtemas devem ser mutuamente exclusivos e coletivamente exaustivos. Para cada subtema, avalie então se a pesquisa exige (ou se beneficiaria de) vários pontos de vista independentes.

| Pesquisadores | Estratégia de decomposição | Exemplo |
|---------------|----------------------------|---------|
| 1 | Sem decomposição significativa: pergunta factual única | "Quem ganhou o Super Bowl de 2024?" |
| 3 | Poucos ângulos ou perspectivas naturais sobre um tema focado | "Efeitos da temperatura na migração do salmão" → (1) mecanismos biológicos, (2) dados observados das populações, (3) projeções climáticas |
| 4 | Facetas ou critérios de avaliação distintos | "Comparar plataformas de CRM para pequenas empresas" → (1) modelos de preço, (2) comparação de funcionalidades, (3) ecossistema de integrações, (4) avaliações/sentimento dos usuários |
| 5 | Várias entidades, regiões ou domínios independentes | "Panorama da regulação de IA" → (1) EUA federal, (2) UE/GDPR-AI Act, (3) China, (4) Reino Unido, (5) autorregulação do setor |
| 6+ | Grande conjunto enumerável que exige cobertura sistemática | "Adoção de veículos elétricos por estado dos EUA" → pesquisadores atribuídos a grupos regionais |

No próximo passo, você deve criar um subagente para cada subtema e ponto de vista independente que identificou. Na dúvida, 3 pesquisadores é um padrão razoável. Se no passo 2 você anotou uma pesquisa anterior para usar como base, decomponha apenas o que este pedido acrescenta ou precisa reverificar; o redator do relatório terá o material anterior.

### 4. Crie subagentes de pesquisa em primeiro plano (em paralelo)

Para cada subtema e ponto de vista independente determinado acima, crie um subagente de pesquisa em primeiro plano.

Para criar os subagentes de pesquisa, use a ferramenta Agent (chamada Task em algumas versões) com subagent_type="general-purpose" e run_in_background=false. Garanta que você dê instruções **extremamente claras e específicas** a cada subagente de pesquisa. Não deixe de propagar as restrições da pergunta original ao subagente (por exemplo, temporais, geográficas). Nos prompts abaixo, substitua {path_to_skill} pelo diretório base desta skill (o diretório de onde este SKILL.md foi carregado), {absolute path of your working directory} pelo caminho que você anotou no passo 2 e {research title} pelo título que escolheu no passo 2. Siga exatamente o formato abaixo:

```
Agent(
  run_in_background=false
  subagent_type="general-purpose",
  description="{3-5 palavras}",
  prompt="Pesquise {tema específico e restrito}.

Objetivo: {descrição clara do que deve ser coberto na saída desejada}

Perguntas-chave:
- {Pergunta específica 1}
- {Pergunta específica 2}

Fontes sugeridas:
- {Tipos de fonte a priorizar}

Restrições:
- {Quaisquer limites da consulta inicial do usuário, inclusive temporais ou geográficos}

Salve suas anotações de saída em {absolute path of your working directory}/research_notes/{research title}/{topic}.md

**Como primeiro passo, você deve ler {path_to_skill}/references/researcher.md para obter as instruções de como conduzir a pesquisa.**"
)
```

Exemplo de um prompt bom, claro e detalhado para um subagente de pesquisa:

> Pesquise a crise da cadeia de suprimentos de semicondutores e a situação atual em 2026.
>
> Objetivo: Compilar um relatório denso de fatos, cobrindo a situação atual, as soluções em andamento e as perspectivas futuras, com cronogramas específicos e dados quantitativos quando disponíveis.
>
> Perguntas-chave:
>  - Quais são os gargalos atuais?
>  - Quais são os aumentos de capacidade projetados com a construção de novas fábricas?
>  - Quais fatores geopolíticos afetam as cadeias de suprimentos?
>  - Quando os especialistas preveem que a oferta atenderá à demanda?
>
> Fontes sugeridas:
> - Relatórios trimestrais recentes dos grandes fabricantes de chips, como TSMC, Samsung e Intel, encontrados nas páginas de relações com investidores ou na base SEC EDGAR
> - Relatórios do setor da SEMI, Gartner e IDC com análise de mercado e projeções
> - Respostas governamentais, incluindo o andamento da implementação do CHIPS Act dos EUA em commerce.gov, do EU Chips Act em ec.europa.eu e de iniciativas semelhantes no Japão, na Coreia do Sul e em Taiwan, pelos respectivos portais governamentais
>
> Restrições:
> - Deve refletir o estado atual em 2026, com problemas anteriores claramente indicados como tais
>
> Salve suas anotações de saída em {absolute path of your working directory}/research_notes/Semiconductor supply chain outlook 2026/semiconductor_supply_chain.md
>
> **Como primeiro passo, você deve ler {path_to_skill}/references/researcher.md para obter as instruções de como conduzir a pesquisa.**"

Para garantir que a pesquisa seja feita o mais rápido possível, é essencial que todos os subagentes sejam criados em paralelo, ou seja, que você faça todas as chamadas à ferramenta Agent em um único turno.

### 5. [Só se for absolutamente necessário] Faça uma rodada adicional de pesquisa

Com base nos resumos de tarefa devolvidos pelos subagentes de pesquisa, determine se há lacunas críticas que deixariam o relatório incompleto. Se for considerado absolutamente necessário, crie pesquisadores em paralelo para fechar essas lacunas. Criar pesquisadores adicionais neste passo atrasa a entrega do relatório ao usuário e leva a uma experiência bem pior, então use com extremo cuidado.

**Este passo só pode ser seguido uma vez**: depois que os pesquisadores terminarem, vá imediatamente para o Passo 6, independentemente dos resultados. Se você iniciar mais pesquisa, vai esbarrar em timeouts ou limites de uso, e o usuário nunca receberá uma resposta à pergunta. **Para ajudar a lembrar disso, sempre escreva "Depois que esses pesquisadores terminarem, passarei direto para a coordenação do redator do relatório" ao decidir iniciar pesquisa adicional.**

### 6. Crie o subagente redator do relatório em primeiro plano

Depois que a pesquisa estiver pronta, crie um único subagente redator do relatório. Use a ferramenta Agent (chamada Task em algumas versões) com subagent_type="general-purpose" e run_in_background=false, e preencha os marcadores como no passo 4. Em {a pergunta original do usuário}, declare a pergunta que este relatório deve responder por inteiro: se este pedido retoma ou amplia uma pesquisa anterior, é a pergunta anterior emendada por este pedido (por exemplo "Como a Lei de IA da UE afeta startups, incluindo penalidades?"), e não só a mensagem de acompanhamento. Na linha da pesquisa anterior, informe os caminhos absolutos do relatório anterior e da pasta de anotações que você anotou no passo 2, ou escreva "nenhuma" se você não anotou nada para usar como base ou se o usuário pediu uma refação independente. Siga exatamente o formato abaixo:

```
Agent(
  run_in_background=false
  subagent_type="general-purpose",
  description="Escrever relatório final",
  prompt="Leia as anotações em {absolute path of your working directory}/research_notes/{research title}/ e sintetize em um relatório de pesquisa que responda: {a pergunta original do usuário}.

Pesquisa anterior nesta conversa para usar como base: {caminhos absolutos do relatório anterior e da pasta de anotações do passo 2, ou "nenhuma"}

Salve seu relatório final exatamente neste caminho: {absolute path of your working directory}/reports/{research title}.md

**Como primeiro passo, você deve ler {path_to_skill}/references/report-writer.md para obter as instruções de como escrever seu relatório de pesquisa.**"
)
```

### 7. Entregue o relatório ao usuário

Depois que o redator do relatório terminar, deixe o relatório à disposição do usuário: se você tiver uma ferramenta para enviar arquivos ao usuário (por exemplo SendUserFile), envie reports/{research title}.md com ela; caso contrário, se o seu ambiente tiver uma pasta de saídas visível ao usuário, copie o relatório para lá com o mesmo nome de arquivo; caso contrário, deixe-o em reports/{research title}.md. Depois leia o relatório finalizado e envie ao usuário um resumo breve (de 3 a 5 frases) que diga onde está o relatório completo (enviado a ele, na pasta de saídas ou o caminho absoluto).
