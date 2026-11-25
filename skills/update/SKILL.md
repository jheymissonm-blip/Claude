---
name: update
description: "Sincroniza tarefas e atualiza a memória com base na sua atividade atual. Use para puxar novas atribuições do seu gerenciador de projetos para o TASKS.md, fazer a triagem de tarefas paradas ou atrasadas, preencher lacunas de memória sobre pessoas ou projetos desconhecidos, ou rodar uma varredura completa para pegar pendências escondidas em chats e e-mails."
argument-hint: "[--comprehensive]"
---

# Comando update

> Se aparecerem placeholders desconhecidos ou você precisar conferir quais ferramentas estão conectadas, veja [CONNECTORS.md](../../CONNECTORS.md).

Mantenha sua lista de tarefas e sua memória atualizadas. Dois modos:

- **Padrão:** sincroniza tarefas de ferramentas externas, faz a triagem de itens parados e procura lacunas na memória
- **`--comprehensive`:** varredura profunda de chat, e-mail, calendário e docs; sinaliza pendências perdidas e sugere novas memórias

## Uso

```bash
/productivity:update
/productivity:update --comprehensive
```

## Modo padrão

### 1. Carregue o estado atual

Leia o `TASKS.md` e o diretório `memory/`. Se não existirem, sugira rodar `/productivity:start` antes.

### 2. Sincronize tarefas de fontes externas

Veja quais fontes de tarefas estão disponíveis:
- **Gerenciador de projetos** (ex.: Asana, Linear, Jira) (se houver MCP)
- **GitHub Issues** (se estiver em um repositório): `gh issue list --assignee=@me`

Se não houver fontes disponíveis, pule para o passo 3.

**Busque as tarefas atribuídas ao usuário** (abertas/em andamento). Compare com o TASKS.md:

| Tarefa externa | Existe no TASKS.md? | Ação |
|----------------|---------------------|------|
| Encontrada, não está no TASKS.md | Sem correspondência | Oferecer adicionar |
| Encontrada, já está no TASKS.md | Correspondência pelo título (aproximada) | Ignorar |
| Está no TASKS.md, não na fonte externa | Sem correspondência | Sinalizar como possivelmente parada |
| Concluída externamente | Está na seção Active | Oferecer marcar como feita |

Apresente a diferença e deixe o usuário decidir o que adicionar ou concluir.

### 3. Faça a triagem de itens parados

Revise as tarefas Active no TASKS.md e sinalize:
- Tarefas com prazo no passado
- Tarefas em Active há 30 dias ou mais
- Tarefas sem contexto (sem pessoa, sem projeto)

Apresente cada uma para triagem: marcar como feita? Reagendar? Mover para Someday?

### 4. Decodifique as tarefas para achar lacunas na memória

Para cada tarefa, tente decodificar todas as entidades (pessoas, projetos, siglas, ferramentas, links):

```
Tarefa: "Send PSR to Todd re: Phoenix blockers"

Decodificação:
- PSR → ✓ Pipeline Status Report (no glossário)
- Todd → ✓ Todd Martinez (em people/)
- Phoenix → ? Não está na memória
```

Registre o que foi totalmente decodificado e o que tem lacunas.

### 5. Preencha as lacunas

Apresente os termos desconhecidos agrupados:
```
Encontrei nas suas tarefas termos dos quais não tenho contexto:

1. "Phoenix" (de: "Send PSR to Todd re: Phoenix blockers")
   → O que é Phoenix?

2. "Maya" (de: "sync with Maya on API design")
   → Quem é a Maya?
```

Adicione as respostas aos arquivos de memória apropriados (people/, projects/, glossary.md).

### 6. Capture o enriquecimento

As tarefas costumam ter mais contexto que a memória. Extraia e atualize:
- **Links** das tarefas → adicione aos arquivos de projeto/pessoa
- **Mudanças de status** ("lançamento concluído") → atualize o status do projeto e retire do CLAUDE.md
- **Relações** ("aprovação do Todd na proposta da Maya") → faça referência cruzada entre pessoas
- **Prazos** → adicione aos arquivos de projeto

### 7. Relatório

```
Atualização concluída:
- Tarefas: +3 do gerenciador de projetos (ex.: Asana), 1 concluída, 2 em triagem
- Memória: 2 lacunas preenchidas, 1 projeto enriquecido
- Todas as tarefas decodificadas ✓
```

## Modo completo (`--comprehensive`)

Tudo do modo padrão, mais uma varredura profunda da atividade recente.

### Passo extra: varra as fontes de atividade

Reúna dados das fontes MCP disponíveis:
- **Chat:** busque mensagens recentes, leia canais ativos
- **E-mail:** busque mensagens enviadas
- **Documentos:** liste docs mexidos recentemente
- **Calendário:** liste eventos recentes e próximos

### Passo extra: sinalize pendências perdidas

Compare a atividade com o TASKS.md. Mostre itens de ação que não estão registrados:

```
## Possíveis tarefas faltando

Pela sua atividade, estas parecem pendências que você não registrou:

1. Do chat (18/jan):
   "I'll send the updated mockups by Friday"
   → Adicionar ao TASKS.md?

2. Da reunião "Phoenix Standup" (17/jan):
   Você tem uma reunião recorrente, mas nenhuma tarefa ativa de Phoenix
   → Falta alguma coisa aqui?

3. Do e-mail (16/jan):
   "I'll review the API spec this week"
   → Adicionar ao TASKS.md?
```

Deixe o usuário escolher quais adicionar.

### Passo extra: sugira novas memórias

Mostre entidades novas que não estão na memória:

```
## Pessoas novas (fora da memória)
| Nome | Frequência | Contexto |
|------|------------|----------|
| Maya Rodriguez | 12 menções | design, revisões de UI |
| Alex K | 8 menções | DMs sobre API |

## Projetos/temas novos
| Nome | Frequência | Contexto |
|------|------------|----------|
| Starlight | 15 menções | docs de planejamento, produto |

## Limpeza sugerida
- **Projeto Horizon**: sem menções há 30 dias. Marcar como concluído?
```

Apresente agrupado por confiança. Itens de alta confiança são oferecidos para adicionar direto; os de baixa confiança viram pergunta.

## Observações

- Nunca adicione tarefas ou memórias automaticamente sem confirmação do usuário
- Os links das fontes externas são preservados quando disponíveis
- A correspondência aproximada de títulos lida com pequenas diferenças de redação
- É seguro rodar com frequência: só atualiza quando há informação nova
- `--comprehensive` sempre roda de forma interativa
