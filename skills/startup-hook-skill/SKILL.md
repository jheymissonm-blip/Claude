---
name: startup-hook-skill
description: "Criação e desenvolvimento de hooks de inicialização para sessões na nuvem do Claude Code. Use somente quando o usuário pedir um hook SessionStart commitado no repositório. Não serve para configurar um ambiente de nuvem ou preparar um repositório para sessões na nuvem; isso é feito com as ferramentas de ambiente."
---

# Skill de hook de inicialização para sessões na nuvem do Claude Code

Crie hooks SessionStart que instalam dependências para que testes e linters funcionem nas sessões na nuvem do Claude Code.

Se o usuário pediu para configurar um ambiente, e não um hook, pare aqui e não faça commit de nada.
Use `get_environment` e depois `create_environment` ou `update_environment`, conforme ele indicar, se você tiver essas ferramentas.
Caso contrário, diga ao usuário para configurar nas configurações do ambiente.

## Básico sobre hooks

### Entrada (via stdin)
```json
{
  "session_id": "abc123",
  "source": "startup|resume|clear|compact",
  "transcript_path": "/path/to/transcript.jsonl",
  "permission_mode": "default",
  "hook_event_name": "SessionStart",
  "cwd": "/workspace/repo"
}
```

### Modo assíncrono
```bash
#!/bin/bash
set -euo pipefail

echo '{"async": true, "asyncTimeout": 300000}'

npm install
```

O hook roda em segundo plano enquanto a sessão inicia. O modo assíncrono reduz a latência, mas cria uma condição de corrida: o loop do agente pode depender de algo que o hook de inicialização ainda não terminou de fazer.

### Variáveis de ambiente

Variáveis de ambiente disponíveis:
- `$CLAUDE_PROJECT_DIR`: caminho da raiz do repositório
- `$CLAUDE_ENV_FILE`: caminho para gravar variáveis de ambiente
- `$CLAUDE_CODE_REMOTE`: indica se está rodando em ambiente remoto (ou seja, uma sessão na nuvem do Claude Code)

Use `$CLAUDE_ENV_FILE` para persistir variáveis durante a sessão:
```bash
echo 'export PYTHONPATH="."' >> "$CLAUDE_ENV_FILE"
```

Use `$CLAUDE_CODE_REMOTE` para executar um script somente em ambiente remoto:
```bash
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi
```

## Fluxo de trabalho

Monte uma lista de tarefas com todas as etapas deste fluxo e trabalhe nelas uma após a outra

### 1. Analise as dependências

Encontre os manifestos de dependências e analise-os. Exemplos:
- `package.json` / `package-lock.json` → npm
- `pyproject.toml` / `requirements.txt` → pip/Poetry
- `Cargo.toml` → cargo
- `go.mod` → go
- `Gemfile` → bundler

Além disso, leia a documentação disponível (README.md ou similar) para ver se há mais contexto sobre como funciona a configuração do ambiente

### 2. Projete o hook

Crie um script que instale as dependências.

**Princípios principais:**
- Não use o modo assíncrono na primeira iteração. Só mude para ele se o usuário pedir
- Escreva o hook somente para a web, a menos que o usuário peça outra coisa (veja $CLAUDE_CODE_REMOTE)
- O estado do container é armazenado em cache depois que o hook termina, então prefira métodos de instalação que aproveitem isso (ou seja, prefira npm install a npm ci)
- Seja idempotente (seguro de rodar várias vezes)
- Pule instalações que já foram feitas. O hook roda a cada início de sessão, retomada, clear e compact, e um hook síncrono segura a mensagem do usuário até terminar. Rode uma instalação somente se um arquivo que determina o que é instalado tiver mudado desde a última instalação bem-sucedida (veja o modelo abaixo)
- Guarde o arquivo de hashes dentro do diretório que a instalação preenche. Assim o arquivo some junto com os pacotes. Se esse diretório estiver no repositório, o git deve ignorá-lo (por exemplo node_modules, ou um .venv onde o pip instala), para que o `git add` deixe o arquivo de fora
- O pip no Python do sistema preenche um diretório fora do repositório. Dê a essa instalação uma verificação própria, com seu próprio arquivo de hashes nesse diretório: `pyhashes="$(python3 -I -c 'import sysconfig; print(sysconfig.get_path("purelib"))')/.session-start.sha256"`. Instale com `python3 -m pip`, o pip desse mesmo Python. Um arquivo de hashes no repositório não serve: um ambiente pode manter o checkout mas iniciar um container novo sem os pacotes, e a verificação então pularia uma instalação necessária
- Em Python, calcule também o hash de cada arquivo que um arquivo de requirements inclui com `-r` ou `-c`. Instale o pacote do próprio repositório em modo editável (`pip install -e .`): um `pip install .` simples copia o código, que a verificação não calcula, e a cópia ficaria desatualizada. Se esse pacote tiver código a compilar, instale-o fora da verificação, porque uma instalação editável não recompila esse código quando ele muda
- Coloque pacotes apt e ferramentas globais fora das verificações e antes delas, e instale somente o que estiver faltando: `if ! command -v shellcheck >/dev/null; then apt-get update; apt-get install -y shellcheck; fi`. Para um pacote sem comando, teste `dpkg -s libpq-dev >/dev/null 2>&1`. Para uma ferramenta que o repositório fixa em uma versão, teste também a versão
- Não interativo (sem entrada do usuário)

### 3. Crie o arquivo do hook

```bash
mkdir -p .claude/hooks
cat > .claude/hooks/session-start.sh << 'EOF'
#!/bin/bash
set -euo pipefail

echo '{"async": true, "asyncTimeout": 300000}'

cd "${CLAUDE_PROJECT_DIR:-.}"

# Instale aqui os pacotes apt e as ferramentas globais, somente os que estiverem faltando

# Rode a instalação somente se um arquivo listado tiver mudado desde a última instalação bem-sucedida
hashes=node_modules/.session-start.sha256
if ! sha256sum --check --status "$hashes" 2>/dev/null; then
  # Apague os hashes antigos primeiro, para que uma instalação que falhou rode de novo na próxima vez
  rm -f "$hashes"

  # Instale as dependências aqui. Uma instalação que falhar deve encerrar o script (sem "|| true")

  # Liste este script e todo arquivo que determina o que é instalado
  # (em um workspace, inclua também o manifesto de cada pacote)
  sha256sum .claude/hooks/session-start.sh package.json package-lock.json 2>/dev/null > "$hashes" || rm -f "$hashes"
fi

# Se o repositório instala com pip no Python do sistema, verifique essa instalação
# da mesma forma, com o arquivo de hashes no diretório de pacotes desse Python

# Passos que toda sessão precisa, como gravar em $CLAUDE_ENV_FILE, ficam aqui
EOF

chmod +x .claude/hooks/session-start.sh
```

### 4. Registre nas configurações

Adicione em `.claude/settings.json` (crie se não existir):
```json
{
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "$CLAUDE_PROJECT_DIR/.claude/hooks/session-start.sh"
          }
        ]
      }
    ]
  }
}
```

Se `.claude/settings.json` já existir, mescle a configuração de hooks.

### 5. Valide o hook

Execute o script do hook diretamente:

```bash
CLAUDE_CODE_REMOTE=true ./.claude/hooks/session-start.sh
```

IMPORTANTE: verifique se as dependências foram instaladas e se o script termina com sucesso.

Rode uma segunda vez e verifique se ele pula todas as instalações. Depois, para cada verificação, altere o conteúdo de um dos arquivos com hash, confirme que a instalação roda de novo e restaure o arquivo.

### 6. Valide o linter

IMPORTANTE: descubra qual é o comando certo para rodar os linters e execute-o em um arquivo de exemplo. Não é preciso rodar o lint no projeto inteiro. Se houver problemas, atualize o script de inicialização e teste de novo.

### 7. Valide os testes

IMPORTANTE: descubra qual é o comando certo para rodar os testes e execute-o em um teste. Não é preciso rodar a suíte inteira. Se houver problemas, atualize o script de inicialização e teste de novo.

### 8. Commit e push

Faça um commit e envie para a branch remota

## Encerramento

Terminamos. Na sua última mensagem ao usuário, forneça um resumo detalhado no formato abaixo:

* Resumo das alterações feitas
* Resultados da validação
  1. ✅/‼️ Execução do hook de sessão (inclua detalhes se falhou)
  2. ✅/‼️ Execução do linter (inclua detalhes se falhou)
  3. ✅/‼️ Execução dos testes (inclua detalhes se falhou)
* Modo de execução do hook: síncrono
  * informe ao usuário que o hook roda de forma síncrona e quais são as compensações abaixo. Diga que podemos mudar para assíncrono se ele preferir uma inicialização de sessão mais rápida.
    * Vantagens: garante que as dependências estejam instaladas antes de a sessão começar, evitando condições de corrida em que o Claude tentaria rodar testes ou linters antes de estarem prontos
    * Desvantagens: sua sessão remota só começa depois que o hook de início de sessão terminar
* informe ao usuário que, depois de mesclar o hook de início de sessão na branch padrão do repositório, todas as sessões futuras vão usá-lo.
