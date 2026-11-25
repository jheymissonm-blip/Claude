---
name: task-management
description: "Gestão simples de tarefas usando um arquivo TASKS.md compartilhado. Consulte quando o usuário perguntar sobre suas tarefas, quiser adicionar ou concluir tarefas ou precisar de ajuda para acompanhar compromissos."
user-invocable: false
---

# Gestão de tarefas

As tarefas ficam em um arquivo simples `TASKS.md`, que você e o usuário podem editar.

## Local do arquivo

**Sempre use o `TASKS.md` do diretório de trabalho atual.**

- Se existir, leia e escreva nele
- Se não existir, crie com o modelo abaixo

## Configuração do painel (primeira execução)

Há um painel visual para gerenciar tarefas e memória. **Na primeira interação com tarefas:**

1. Verifique se existe `dashboard.html` no diretório de trabalho atual
2. Se não existir, copie de `${CLAUDE_PLUGIN_ROOT}/skills/dashboard.html` para o diretório de trabalho atual
3. Avise o usuário: "Adicionei o painel. Rode `/productivity:start` para configurar o sistema completo."

O quadro de tarefas:
- Lê e escreve no mesmo arquivo `TASKS.md`
- Salva as alterações automaticamente
- Observa mudanças externas (sincroniza quando você edita pela linha de comando)
- Permite reordenar tarefas e seções arrastando e soltando

## Formato e modelo

Ao criar um novo TASKS.md, use exatamente este modelo (sem tarefas de exemplo):

```markdown
# Tasks

## Active

## Waiting On

## Someday

## Done
```

Formato da tarefa:
- `- [ ] **Título da tarefa** - contexto, para quem, prazo`
- Sub-itens para detalhes adicionais
- Concluída: `- [x] ~~Tarefa~~ (data)`

## Como interagir

**Quando o usuário perguntar "o que tenho pra fazer" / "minhas tarefas":**
- Leia o TASKS.md
- Resuma as seções Active e Waiting On
- Destaque o que estiver atrasado ou urgente

**Quando o usuário disser "adiciona uma tarefa" / "me lembra de":**
- Adicione na seção Active no formato `- [ ] **Tarefa**`
- Inclua o contexto, se informado (para quem é, prazo)

**Quando o usuário disser "terminei X" / "concluí X":**
- Encontre a tarefa
- Troque `[ ]` por `[x]`
- Adicione o tachado: `~~tarefa~~`
- Adicione a data de conclusão
- Mova para a seção Done

**Quando o usuário perguntar "o que estou esperando":**
- Leia a seção Waiting On
- Indique há quanto tempo cada item está esperando

## Convenções

- Deixe o título da tarefa em **negrito** para facilitar a leitura rápida
- Inclua "para [pessoa]" quando for um compromisso com alguém
- Inclua "prazo [data]" para datas limite
- Inclua "desde [data]" para itens em espera
- Use sub-itens para contexto adicional
- Mantenha a seção Done por cerca de 1 semana e depois limpe os itens antigos

## Extração de tarefas

Ao resumir reuniões ou conversas, ofereça adicionar as tarefas extraídas:
- Compromissos assumidos pelo usuário ("vou te enviar isso")
- Itens de ação atribuídos a ele
- Acompanhamentos mencionados

Pergunte antes de adicionar; não adicione automaticamente sem confirmação.
