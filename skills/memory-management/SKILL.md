---
name: memory-management
description: "Sistema de memória em dois níveis que faz do Claude um verdadeiro colaborador de trabalho. Decodifica jargões, siglas, apelidos e linguagem interna para que o Claude entenda pedidos como um colega de equipe. CLAUDE.md para a memória de trabalho e o diretório memory/ para a base de conhecimento completa."
user-invocable: false
---

# Gestão de memória

A memória faz do Claude um colaborador de trabalho, alguém que fala a linguagem interna da sua empresa.

## O objetivo

Transformar jargão em entendimento:

```
Usuário: "pede pro todd fazer o PSR da oracle"
              ↓ Claude decodifica
"Peça ao Todd Martinez (líder de Finanças) para preparar o Pipeline Status Report
 do negócio com a Oracle Systems (US$ 2,3 mi, fechamento no 2º tri)"
```

Sem memória, esse pedido não faz sentido. Com memória, o Claude sabe:
- **todd** → Todd Martinez, líder de Finanças, prefere Slack
- **PSR** → Pipeline Status Report (documento semanal de vendas)
- **oracle** → o negócio com a Oracle Systems, não a empresa

## Arquitetura

```
CLAUDE.md          ← Cache quente (~30 pessoas, termos comuns)
memory/
  glossary.md      ← Glossário completo (tudo)
  people/          ← Perfis completos
  projects/        ← Detalhes de projetos
  context/         ← Empresa, times, ferramentas
```

**CLAUDE.md (cache quente):**
- As ~30 pessoas com quem você mais interage
- Os ~30 acrônimos/termos mais comuns
- Projetos ativos (5-15)
- Suas preferências
- **Meta: cobrir 90% das necessidades diárias de decodificação**

**memory/glossary.md (glossário completo):**
- Glossário completo: todas as pessoas, todos os termos
- Consultado quando algo não está no CLAUDE.md
- Pode crescer indefinidamente

**memory/people/, projects/, context/:**
- Detalhe rico quando necessário para executar
- Perfis completos, histórico, contexto

## Fluxo de consulta

```
Usuário: "pergunta pro todd sobre o PSR do phoenix"

1. Consulte o CLAUDE.md (cache quente)
   → Todd? ✓ Todd Martinez, Finanças
   → PSR? ✓ Pipeline Status Report
   → Phoenix? ✓ Projeto de migração de banco de dados

2. Se não achar → busque em memory/glossary.md
   → O glossário completo tem todas as pessoas e termos

3. Se ainda não achar → pergunte ao usuário
   → "O que X significa? Vou lembrar."
```

Essa abordagem em camadas mantém o CLAUDE.md enxuto (~100 linhas) e permite escala ilimitada em memory/.

## Localização dos arquivos

- **Memória de trabalho:** `CLAUDE.md` no diretório de trabalho atual
- **Memória profunda:** subdiretório `memory/`

## Formato da memória de trabalho (CLAUDE.md)

Use tabelas para ficar compacto. Meta de ~50-80 linhas no total.

```markdown
# Memory

## Me
[Nome], [Cargo] em [Time]. [Uma frase sobre o que eu faço.]

## People
| Who | Role |
|-----|------|
| **Todd** | Todd Martinez, líder de Finanças |
| **Sarah** | Sarah Chen, Engenharia (Plataforma) |
| **Greg** | Greg Wilson, Vendas |
→ Lista completa: memory/glossary.md, perfis: memory/people/

## Terms
| Term | Meaning |
|------|---------|
| PSR | Pipeline Status Report |
| P0 | Prioridade máxima, largue tudo |
| standup | Sincronização diária às 9h |
→ Glossário completo: memory/glossary.md

## Projects
| Name | What |
|------|------|
| **Phoenix** | Migração de banco de dados, lançamento no 2º tri |
| **Horizon** | Redesenho do app mobile |
→ Detalhes: memory/projects/

## Preferences
- Reuniões de 25 min com intervalos
- Assíncrono primeiro, Slack em vez de e-mail
- Sem reuniões nas tardes de sexta
```

## Formato da memória profunda (memory/)

**memory/glossary.md**, o decodificador:
```markdown
# Glossary

Jargões, siglas e linguagem interna do ambiente de trabalho.

## Acronyms
| Term | Meaning | Context |
|------|---------|---------|
| PSR | Pipeline Status Report | Documento semanal de vendas |
| OKR | Objectives & Key Results | Planejamento trimestral |
| P0/P1/P2 | Níveis de prioridade | P0 = largue tudo |

## Internal Terms
| Term | Meaning |
|------|---------|
| standup | Sincronização diária às 9h no #engineering |
| a migração | Trabalho de banco de dados do Projeto Phoenix |
| ship it | Fazer deploy em produção |
| escalar | Envolver a liderança |

## Nicknames → Full Names
| Nickname | Person |
|----------|--------|
| Todd | Todd Martinez (Finanças) |
| T | Também Todd Martinez |

## Project Codenames
| Codename | Project |
|----------|---------|
| Phoenix | Migração de banco de dados |
| Horizon | Novo app mobile |
```

**memory/people/{nome}.md:**
```markdown
# Todd Martinez

**Também conhecido como:** Todd, T
**Cargo:** Líder de Finanças
**Time:** Finanças
**Reporta a:** CFO (Michael Chen)

## Comunicação
- Prefere DM no Slack
- Responde rápido, muito direto
- Melhor horário: manhãs

## Contexto
- Cuida de todos os PSRs e relatórios financeiros
- Contato principal para aprovações de negócios acima de US$ 500 mil
- Trabalha de perto com Vendas na projeção de receita

## Observações
- Torcedor do Cubs, gosta de falar de beisebol
```

**memory/projects/{nome}.md:**
```markdown
# Projeto Phoenix

**Codinome:** Phoenix
**Também chamado de:** "a migração"
**Status:** Ativo, lançamento no 2º tri

## O que é
Migração de banco de dados do Oracle legado para PostgreSQL.

## Pessoas-chave
- Sarah: líder técnica
- Todd: dono do orçamento
- Greg: stakeholder (impacto em vendas)

## Contexto
Orçamento de US$ 1,2 mi, prazo de 6 meses. Caminho crítico para o projeto Horizon.
```

**memory/context/company.md:**
```markdown
# Company Context

## Tools & Systems
| Tool | Used for | Internal name |
|------|----------|---------------|
| Slack | Comunicação | - |
| Asana | Tarefas de engenharia | - |
| Salesforce | CRM | "SF" ou "o CRM" |
| Notion | Docs/wiki | - |

## Teams
| Team | What they do | Key people |
|------|--------------|------------|
| Plataforma | Infraestrutura | Sarah (líder) |
| Finanças | Dinheiro | Todd (líder) |
| Vendas | Receita | Greg |

## Processes
| Process | What it means |
|---------|---------------|
| Sync semanal | Segunda, 10h, todos juntos |
| Ship review | Aprovação de deploy na quinta |
```

## Como interagir

### Decodificando o que o usuário escreve (consulta em camadas)

**Sempre** decodifique o jargão antes de agir sobre pedidos:

```
1. CLAUDE.md (cache quente)  → Consulte primeiro, cobre 90% dos casos
2. memory/glossary.md        → Glossário completo se não estiver no cache quente
3. memory/people/, projects/ → Detalhe rico quando necessário
4. Pergunte ao usuário       → Termo desconhecido? Aprenda.
```

Exemplo:
```
Usuário: "pede pro todd fazer o PSR da oracle"

Consulta ao CLAUDE.md:
  "todd" → Todd Martinez, Finanças ✓
  "PSR" → Pipeline Status Report ✓
  "oracle" → (não está no cache quente)

Consulta ao memory/glossary.md:
  "oracle" → negócio com a Oracle Systems (US$ 2,3 mi) ✓

Agora o Claude pode agir com o contexto completo.
```

### Adicionando à memória

Quando o usuário disser "lembra disso" ou "X significa Y":

1. **Itens de glossário** (siglas, termos, jargão):
   - Adicione em memory/glossary.md
   - Se for muito usado, adicione ao Quick Glossary do CLAUDE.md

2. **Pessoas:**
   - Crie ou atualize memory/people/{nome}.md
   - Adicione em Key People no CLAUDE.md se for importante
   - **Registre os apelidos**: essencial para decodificar

3. **Projetos:**
   - Crie ou atualize memory/projects/{nome}.md
   - Adicione em Active Projects no CLAUDE.md se for atual
   - **Registre os codinomes**: "Phoenix", "a migração" etc.

4. **Preferências:** adicione na seção Preferences do CLAUDE.md

### Relembrando a memória

Quando o usuário perguntar "quem é X" ou "o que X significa":

1. Consulte primeiro o CLAUDE.md
2. Consulte memory/ para o detalhe completo
3. Se não achar: "Ainda não sei o que X significa. Pode me dizer?"

### Divulgação progressiva

1. Carregue o CLAUDE.md para interpretar rápido qualquer pedido
2. Aprofunde em memory/ quando precisar de contexto completo para executar
3. Exemplo: redigir um e-mail para o todd sobre o PSR
   - O CLAUDE.md diz que Todd = Todd Martinez, PSR = Pipeline Status Report
   - memory/people/todd-martinez.md diz que ele prefere Slack e é direto

## Montagem inicial

Use `/productivity:start` para inicializar varrendo seu chat, calendário, e-mail e documentos. Extrai pessoas e projetos e começa a montar o glossário.

## Convenções

- Deixe termos em **negrito** no CLAUDE.md para leitura rápida
- Mantenha o CLAUDE.md abaixo de ~100 linhas (a regra dos "30 quentes")
- Nomes de arquivo: minúsculas, hífens (`todd-martinez.md`, `project-phoenix.md`)
- Sempre registre apelidos e nomes alternativos
- Use tabelas de glossário para consulta fácil
- Quando algo for muito usado, promova para o CLAUDE.md
- Quando algo ficar obsoleto, rebaixe para somente memory/

## O que vai onde

| Tipo | CLAUDE.md (cache quente) | memory/ (armazenamento completo) |
|------|--------------------------|----------------------------------|
| Pessoa | ~30 contatos mais frequentes | glossary.md + people/{nome}.md |
| Sigla/termo | ~30 mais comuns | glossary.md (lista completa) |
| Projeto | Somente projetos ativos | glossary.md + projects/{nome}.md |
| Apelido | Em Key People se estiver entre os 30 | glossary.md (todos os apelidos) |
| Contexto da empresa | Só referência rápida | context/company.md |
| Preferências | Todas as preferências | - |
| Histórico/obsoleto | ✗ Remover | ✓ Manter em memory/ |

## Promoção / rebaixamento

**Promova para o CLAUDE.md quando:**
- Você usa o termo/pessoa com frequência
- Faz parte do trabalho ativo

**Rebaixe para somente memory/ quando:**
- O projeto foi concluído
- A pessoa deixou de ser contato frequente
- O termo é raramente usado

Isso mantém o CLAUDE.md atual e relevante.
