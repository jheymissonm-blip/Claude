---
name: start
description: "Inicializa o sistema de produtividade e abre o painel. Use ao configurar o plugin pela primeira vez, ao montar a memória de trabalho a partir da sua lista de tarefas existente ou ao decodificar os jargões (apelidos, siglas, codinomes de projetos) que você usa nas suas pendências."
---

# Comando start

> Se aparecerem placeholders desconhecidos ou você precisar conferir quais ferramentas estão conectadas, veja [CONNECTORS.md](../../CONNECTORS.md).

Inicialize os sistemas de tarefas e de memória e depois abra o painel unificado.

## Instruções

### 1. Verifique o que já existe

Procure no diretório de trabalho:
- `TASKS.md`: lista de tarefas
- `CLAUDE.md`: memória de trabalho
- `memory/`: diretório da memória profunda
- `dashboard.html`: a interface visual

### 2. Crie o que estiver faltando

**Se `TASKS.md` não existir:** crie com o modelo padrão (veja a skill task-management). Coloque no diretório de trabalho atual.

**Se `dashboard.html` não existir:** copie de `${CLAUDE_PLUGIN_ROOT}/skills/dashboard.html` para o diretório de trabalho atual.

**Se `CLAUDE.md` e `memory/` não existirem:** é uma configuração nova. Depois de abrir o painel, inicie o fluxo de montagem da memória (veja abaixo). Coloque-os no diretório de trabalho atual.

### 3. Abra o painel

NÃO use `open` nem `xdg-open`: no Cowork o agente roda em uma VM e comandos de shell para abrir arquivos não chegam ao navegador do usuário. Em vez disso, diga ao usuário: "O painel está pronto em `dashboard.html`. Abra pelo seu gerenciador de arquivos para começar."

### 4. Oriente o usuário

Se tudo já estava inicializado:
```
Painel aberto. Suas tarefas e sua memória foram carregadas.
- /productivity:update para sincronizar tarefas e checar a memória
- /productivity:update --comprehensive para uma varredura profunda de toda a atividade
```

Se a memória ainda não foi montada, siga para o passo 5.

### 5. Monte a memória (somente na primeira execução)

Só faça isto se `CLAUDE.md` e `memory/` ainda não existirem.

A melhor fonte da linguagem do ambiente de trabalho é a lista de tarefas real do usuário. Tarefas reais = jargão real.

**Pergunte ao usuário:**
```
Onde você guarda seus afazeres ou sua lista de tarefas? Pode ser:
- Um arquivo local (ex.: TASKS.md, todo.txt)
- Um app (ex.: Asana, Linear, Jira, Notion, Todoist)
- Um arquivo de anotações

Vou usar suas tarefas para aprender o jargão do seu trabalho.
```

**Quando tiver acesso à lista de tarefas:**

Para cada tarefa, procure possíveis jargões:
- Nomes que podem ser apelidos
- Siglas ou abreviações
- Referências a projetos ou codinomes
- Termos internos ou gírias

**Para cada item, decodifique de forma interativa:**

```
Tarefa: "Send PSR to Todd re: Phoenix blockers"

Vejo alguns termos que quero ter certeza de que entendi:

1. **PSR** - O que significa?
2. **Todd** - Quem é o Todd? (nome completo, cargo)
3. **Phoenix** - É o codinome de um projeto? Sobre o que é?
```

Siga por cada tarefa, perguntando só sobre termos que você ainda não decodificou.

### 6. Varredura completa opcional

Depois de decodificar a lista de tarefas, ofereça:
```
Quer que eu faça uma varredura completa das suas mensagens, e-mails e documentos?
Demora mais, mas cria um contexto muito mais rico sobre as pessoas, projetos e termos do seu trabalho.

Ou podemos seguir com o que temos e acrescentar contexto depois.
```

**Se escolherem a varredura completa:**

Reúna dados das fontes MCP disponíveis:
- **Chat:** mensagens recentes, canais, DMs
- **E-mail:** mensagens enviadas, destinatários
- **Documentos:** docs recentes, colaboradores
- **Calendário:** reuniões, participantes

Monte um levantamento livre de pessoas, projetos e termos encontrados. Apresente os achados agrupados por confiança:
- **Pronto para adicionar** (alta confiança): ofereça adicionar direto
- **Precisa de esclarecimento**: pergunte ao usuário
- **Pouco frequente / incerto**: anote para depois

### 7. Escreva os arquivos de memória

Com tudo o que foi reunido, crie:

**CLAUDE.md** (memória de trabalho, ~50-80 linhas):
```markdown
# Memory

## Me
[Nome], [Cargo] em [Time].

## People
| Who | Role |
|-----|------|
| **[Apelido]** | [Nome completo], [cargo] |

## Terms
| Term | Meaning |
|------|---------|
| [sigla] | [significado] |

## Projects
| Name | What |
|------|------|
| **[Codinome]** | [descrição] |

## Preferences
- [preferências descobertas]
```

Diretório **memory/**:
- `memory/glossary.md`: o glossário completo (siglas, termos, apelidos, codinomes)
- `memory/people/{nome}.md`: perfis individuais
- `memory/projects/{nome}.md`: detalhes dos projetos
- `memory/context/company.md`: times, ferramentas, processos

### 8. Informe os resultados

```
Sistema de produtividade pronto:
- Tarefas: TASKS.md (X itens)
- Memória: X pessoas, X termos, X projetos
- Painel: abra no navegador

Use /productivity:update para manter tudo atualizado (adicione --comprehensive para uma varredura profunda).
```

## Observações

- Se a memória já estiver inicializada, o comando só abre o painel
- Apelidos são essenciais: sempre registre como as pessoas são chamadas na prática
- Se uma fonte não estiver disponível, pule e anote a lacuna
- Depois da montagem, a memória cresce de forma orgânica nas conversas do dia a dia
