---
name: sprint-planning
description: "Planeja uma sprint: define escopo, estima capacidade, estabelece metas e redige o plano. Use ao iniciar uma sprint, dimensionar o backlog contra a disponibilidade do time (considerando férias e reuniões), decidir o que é P0 e o que é extra, ou tratar o que sobrou da sprint anterior."
argument-hint: "[sprint name or date range]"
---

# /sprint-planning

> Se aparecerem placeholders desconhecidos ou você precisar conferir quais ferramentas estão conectadas, veja [CONNECTORS.md](../../CONNECTORS.md).

Planeje uma sprint definindo o escopo, estimando a capacidade e fixando metas claras.

## Uso

```
/sprint-planning $ARGUMENTS
```

## Como funciona

```
┌─────────────────────────────────────────────────────────────────┐
│                    PLANEJAMENTO DE SPRINT                          │
├─────────────────────────────────────────────────────────────────┤
│  INDEPENDENTE (sempre funciona)                                  │
│  ✓ Define metas e critérios de sucesso da sprint                │
│  ✓ Estima a capacidade do time (considerando férias e reuniões) │
│  ✓ Delimita e prioriza os itens do backlog                      │
│  ✓ Identifica dependências e riscos                             │
│  ✓ Gera o documento do plano da sprint                          │
├─────────────────────────────────────────────────────────────────┤
│  POTENCIALIZADO (quando você conecta suas ferramentas)           │
│  + Gerenciador de projetos: puxa o backlog, cria a sprint,      │
│    atribui itens                                                │
│  + Calendário: considera férias e reuniões na capacidade        │
│  + Chat: compartilha o plano da sprint com o time               │
└─────────────────────────────────────────────────────────────────┘
```

## O que preciso de você

- **Time**: quem está no time e qual a disponibilidade de cada um nesta sprint?
- **Duração da sprint**: quantos dias ou semanas?
- **Backlog**: o que está priorizado? (puxe do gerenciador, cole ou descreva)
- **Resíduo**: sobrou algo da sprint anterior?
- **Dependências**: algo bloqueado por outros times?

## Saída

```markdown
## Plano da sprint: [Nome da sprint]
**Datas:** [Início] — [Fim] | **Time:** [X] engenheiros
**Meta da sprint:** [Uma frase clara sobre como é o sucesso]

### Capacidade
| Pessoa | Dias disponíveis | Alocação | Observações |
|--------|------------------|----------|-------------|
| [Nome] | [X] de [Y] | [X] pontos/horas | [férias, plantão etc.] |
| **Total** | **[X]** | **[X] pontos** | |

### Backlog da sprint
| Prioridade | Item | Estimativa | Responsável | Dependências |
|------------|------|------------|-------------|--------------|
| P0 | [Precisa entregar] | [X] pts | [Pessoa] | [Nenhuma / Bloqueado por X] |
| P1 | [Deveria entregar] | [X] pts | [Pessoa] | [Nenhuma] |
| P2 | [Extra] | [X] pts | [Pessoa] | [Nenhuma] |

### Capacidade planejada: [X] pontos | Carga da sprint: [X] pontos ([X]% da capacidade)

### Riscos
| Risco | Impacto | Mitigação |
|-------|---------|-----------|
| [Risco] | [O que acontece] | [O que fazer] |

### Definição de pronto
- [ ] Código revisado e mergeado
- [ ] Testes passando
- [ ] Documentação atualizada (se aplicável)
- [ ] Aprovação do produto

### Datas-chave
| Data | Evento |
|------|--------|
| [Data] | Início da sprint |
| [Data] | Checagem no meio da sprint |
| [Data] | Fim da sprint / Demo |
| [Data] | Retrospectiva |
```

## Dicas

1. **Deixe folga**: planeje para 70-80% da capacidade. Haverá interrupções.
2. **Uma meta clara por sprint**: se não dá para dizer em uma frase, a sprint está sem foco.
3. **Identifique itens extras**: saiba o que cortar se as coisas demorarem mais que o esperado.
4. **Repasse com honestidade**: se algo não foi entregue, entenda o motivo antes de assumir o compromisso de novo.
