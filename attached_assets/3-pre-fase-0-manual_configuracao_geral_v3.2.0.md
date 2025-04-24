# MANUAIS_REPLIT/3-pre-fase-0-manual_configuracao_geral_replit_v1.0.md

> **Versão:** v1.0
> **Data:** 2025-04-22
> **Status:** Draft - Adaptado para Replit/Neon

# Manual Pré-Fase 0: Configuração Geral do Ambiente (Replit/Neon)

> **Compliance:** Alinhado às **1-TEKTRIO_PROJECT_RULES_Replit_v1.0.md** e ao **2-plano_implementacao_e2e_Replit_v1.0.md**

**Versão:** v1.0
**Data:** 2025-04-22
**Autor:** Equipe TEKTRIO (Adaptado por IA)
**Status:** Draft

## Sumário

- [Manual Pré-Fase 0: Configuração Geral do Ambiente (Replit/Neon)](#manual-pré-fase-0-configuração-geral-do-ambiente-replitneon)
  - [Sumário](#sumário)
  - [1. Visão Geral](#1-visão-geral)
  - [2. Objetivos da Etapa](#2-objetivos-da-etapa)
  - [3. Pré-requisitos](#3-pré-requisitos)
  - [4. Arquitetura de Referência (Replit/Neon Simplificada)](#4-arquitetura-de-referência-replitneon-simplificada)
  - [5. Estrutura do Monorepo (Nx + pnpm)](#5-estrutura-do-monorepo-nx--pnpm)
  - [6. Configuração do Ambiente Replit](#6-configuração-do-ambiente-replit)
    - [6.1. Arquivo `.replit`](#61-arquivo-replit)
    - [6.2. Arquivo `replit.nix` (Gerenciamento de Pacotes do Sistema)](#62-arquivo-replitnix-gerenciamento-de-pacotes-do-sistema)
    - [6.3. Replit Secrets (Variáveis de Ambiente)](#63-replit-secrets-variáveis-de-ambiente)
  - [7. Configuração do Banco de Dados Neon DB](#7-configuração-do-banco-de-dados-neon-db)
    - [7.1. Criação do Projeto e Banco de Dados Neon](#71-criação-do-projeto-e-banco-de-dados-neon)
    - [7.2. Obtendo a String de Conexão](#72-obtendo-a-string-de-conexão)
    - [7.3. Configurando a Conexão no Replit](#73-configurando-a-conexão-no-replit)
    - [7.4. Estratégia Multi-Tenant (Schema-per-System)](#74-estratégia-multi-tenant-schema-per-system)
    - [7.5. Migrações de Banco de Dados (Node.js/SQL)](#75-migrações-de-banco-de-dados-nodejssql)
  - [8. Configuração de Ferramentas de Desenvolvimento](#8-configuração-de-ferramentas-de-desenvolvimento)
    - [8.1. Linters e Formatters (ESLint, Prettier)](#81-linters-e-formatters-eslint-prettier)
    - [8.2. Git Hooks (Husky + lint-staged)](#82-git-hooks-husky--lint-staged)
  - [9. Conexão SSH (Opcional - Acesso ao Ambiente Replit)](#9-conexão-ssh-opcional---acesso-ao-ambiente-replit)
  - [10. Testes da Configuração](#10-testes-da-configuração)
  - [11. Troubleshooting Comum (Replit/Neon)](#11-troubleshooting-comum-replitneon)
  - [12. Próximos Passos](#12-próximos-passos)
  - [13. Referências](#13-referências)

## 1. Visão Geral

Este manual descreve os passos essenciais para configurar o ambiente de desenvolvimento do projeto TEKTRIO **dentro do Replit**, utilizando o **Neon DB** como banco de dados serverless PostgreSQL. A configuração abrange o ambiente Replit (`.replit`, `replit.nix`), gerenciamento de segredos (Replit Secrets), conexão com Neon DB e a configuração inicial das ferramentas de desenvolvimento (linters, formatters) dentro do monorepo Nx/pnpm.

Esta abordagem visa maximizar a agilidade e simplicidade oferecidas pelo Replit, eliminando a necessidade de gerenciar infraestrutura local como Docker Desktop ou instalações de banco de dados.

## 2. Objetivos da Etapa

1.  Configurar um Repl no Replit para hospedar o monorepo TEKTRIO.
2.  Estruturar os arquivos de configuração do Replit (`.replit`, `replit.nix`) para instalar as dependências necessárias (Node.js, pnpm, etc.).
3.  Configurar o gerenciamento seguro de variáveis de ambiente usando Replit Secrets.
4.  Criar e configurar um banco de dados no Neon DB.
5.  Estabelecer a conexão segura entre o Repl e o Neon DB.
6.  Implementar a base da estratégia multi-tenant (schema-per-system) no Neon DB.
7.  Configurar ferramentas de qualidade de código (ESLint, Prettier) e Git Hooks no ambiente Replit.

## 3. Pré-requisitos

1.  **Conta Replit:** Uma conta ativa no [replit.com](https://replit.com/). Planos pagos podem ser necessários dependendo dos recursos utilizados.
2.  **Conta Neon:** Uma conta ativa no [neon.tech](https://neon.tech/). O Neon oferece um generoso free tier.
3.  **Repositório Git:** Acesso ao repositório Git do projeto TEKTRIO (ex: GitHub).
4.  **Navegador Web:** Um navegador moderno para acessar Replit e Neon.
5.  **Compreensão Básica:** Familiaridade com Git, Node.js, pnpm, linha de comando e conceitos básicos de banco de dados PostgreSQL.
6.  **Leitura Prévia:** Ter lido `1-TEKTRIO_PROJECT_RULES_Replit_v1.0.md` e `2-plano_implementacao_e2e_Replit_v1.0.md`.

## 4. Arquitetura de Referência (Replit/Neon Simplificada)

Conforme definido em `1-TEKTRIO_PROJECT_RULES_Replit_v1.0.md`, a arquitetura no ambiente Replit/Neon é simplificada:

*   **Frontend/Backend:** Aplicações Node.js (Fastify/Express) e React/Vue/etc. rodando como processos dentro de um ou mais Repls.
*   **Banco de Dados:** Neon DB (Serverless PostgreSQL) como banco de dados principal.
*   **Cache/KV Store:** Replit Database (simples, integrado ao Repl).
*   **Armazenamento de Objetos:** Replit Object Storage (se necessário).
*   **Comunicação:** Interação entre serviços (se separados em Repls diferentes) via HTTP/APIs diretas.
*   **Orquestração/Deploy:** Replit Deployments (Git-backed).
*   **Monitoramento:** Replit Monitoring, Replit Logs, Neon Console/Monitoring.

**Remoção de Complexidade:** Kong, Linkerd, NATS, Clusters Redis/MinIO locais/complexos são substituídos por alternativas mais simples do Replit/Neon ou removidos se não essenciais para o MVP.

## 5. Estrutura do Monorepo (Nx + pnpm)

A estrutura do monorepo (gerenciada por Nx e pnpm) permanece a mesma descrita nos documentos originais, organizada em `apps/` e `packages/`. O foco aqui é como configurar o Replit para trabalhar com essa estrutura.

## 6. Configuração do Ambiente Replit

### 6.1. Arquivo `.replit`

Este arquivo controla o comportamento do Repl, incluindo o comando de execução, o entrypoint e a configuração do Language Server Protocol (LSP).

**Exemplo `.replit` (essencial):**

```toml
# Define o comando executado quando o botão "Run" é pressionado
run = "pnpm run dev"

# Define o arquivo principal que o Replit deve focar (ajuste conforme necessário)
entrypoint = "apps/backend-parent/src/main.ts"

# Habilita o uso do Nix para gerenciamento de pacotes (essencial)
[nix]
channel = "stable-23_11" # Ou a versão mais recente recomendada

# Configuração do Language Server (detecta automaticamente baseado nos arquivos)
[languages]
# Exemplo para Node.js/TypeScript
[languages.typescript]
pattern = "**/*.{ts,tsx}"

[languages.javascript]
pattern = "**/*.{js,jsx}"

# Configuração para o debugger (exemplo Node.js)
[debugger]
support = true

  [debugger.interactive]
  transport = "localhost:9229"
  startCommand = ["pnpm", "run", "dev:debug"] # Ajuste para seu script de debug

# Comandos que aparecem na aba "Shell"
[shell]
  [shell.command]
  name = "Dev All"
  command = "pnpm run dev"
  description = "Start all services (Parent, Child, Plugin)"

  [shell.command]
  name = "Lint"
  command = "pnpm run lint"
  description = "Run ESLint checks"

  [shell.command]
  name = "Test"
  command = "pnpm test"
  description = "Run unit and integration tests"

  [shell.command]
  name = "Install Deps"
  command = "pnpm install"
  description = "Install all dependencies"

# Habilitar Git para Deployments
[deployment]
source = "git"
# branch = "main" # Opcional: especifique a branch de deploy

# Mapeamento de portas (se necessário expor portas específicas além da detectada)
# [ports]
# backend = 3001
# frontend = 5173
```

*   **`run`**: Define o comando padrão. Pode ser um script do `package.json` que inicia todos os serviços necessários (usando `concurrently` ou `pnpm --parallel`).
*   **`entrypoint`**: Ajuda o Replit a entender qual o arquivo principal, mas não é crítico para a execução se o comando `run` estiver correto.
*   **`[nix]`**: Essencial para usar o `replit.nix`.
*   **`[languages]`**: Geralmente detectado automaticamente.
*   **`[debugger]`**: Configuração básica para permitir debugging.
*   **`[shell.command]`**: Atalhos úteis na aba Shell.
*   **`[deployment]`**: Habilita Deployments baseados em Git.

### 6.2. Arquivo `replit.nix` (Gerenciamento de Pacotes do Sistema)

Este arquivo usa o gerenciador de pacotes Nix para definir o ambiente do sistema operacional dentro do Repl, incluindo versões específicas de linguagens, bibliotecas e ferramentas. É a forma **recomendada** de garantir consistência.

**Exemplo `replit.nix` (essencial):**

```nix
# Arquivo: replit.nix
{ pkgs }: {
    deps = [
        # Versão exata do Node.js conforme TEKTRIO_PROJECT_RULES
        pkgs.nodejs-18_x

        # PNPM para gerenciamento de pacotes Node.js
        pkgs.nodePackages.pnpm

        # Git (geralmente já presente, mas bom garantir)
        pkgs.git

        # Ferramentas úteis (opcional)
        pkgs.wget
        pkgs.curl
        pkgs.unzip

        # Dependências para build (ex: node-gyp, se necessário para pacotes nativos)
        pkgs.python3
        pkgs.gnumake
        pkgs.gcc

        # Cliente PostgreSQL para interagir com Neon DB (opcional, mas útil)
        pkgs.postgresql

        # Turborepo (se não gerenciado via pnpm devDependencies)
        # pkgs.nodePackages.turbo
    ];

    # Configurações de ambiente (opcional)
    # env = {
    #   NODE_ENV = "development";
    # };
}
```

*   **`pkgs.nodejs-18_x`**: Especifica a versão 18 do Node.js. Use a versão exata requerida (verificar nomes de pacotes Nix disponíveis).
*   **`pkgs.nodePackages.pnpm`**: Instala o pnpm.
*   Adicione outras ferramentas CLI ou bibliotecas de sistema necessárias (ex: `python3` se alguma dependência Node a exigir).
*   `pkgs.postgresql`: Instala o cliente `psql` para que você possa conectar ao Neon DB a partir do Shell do Replit para debug.

Após modificar `replit.nix`, o Replit geralmente detecta a mudança e pede para recarregar o ambiente ou você pode precisar reiniciar o Repl. A aba "Shell" mostrará a instalação dos pacotes Nix.

### 6.3. Replit Secrets (Variáveis de Ambiente)

Nunca comite segredos (chaves de API, strings de conexão de banco de dados, etc.) diretamente no código ou em arquivos `.env` versionados. Use a ferramenta "Secrets" do Replit (ícone de cadeado na barra lateral esquerda).

1.  Abra a aba "Secrets".
2.  Adicione cada variável de ambiente necessária:
    *   **Key:** Nome da variável (ex: `DATABASE_URL`, `JWT_SECRET`).
    *   **Value:** O valor secreto.
3.  Essas variáveis estarão disponíveis em `process.env` no seu código Node.js **automaticamente** quando o Repl for executado.
4.  **Importante:** Crie um arquivo `.env.example` na raiz do projeto, listando todas as variáveis necessárias, mas com valores fictícios ou descrições. Isso serve como documentação para outros desenvolvedores e para o CI/CD.

**Exemplo `.env.example`:**

```dotenv
# Neon Database Connection String (Obtenha do Console Neon)
DATABASE_URL="postgresql://user:password@host:port/dbname?sslmode=require"

# JWT Secret Key (Gere uma string aleatória forte)
JWT_SECRET="your-super-secret-jwt-key-change-me"

# Outras Configurações
NODE_ENV=development
PORT_PARENT_BACKEND=3001
PORT_CHILD_BACKEND=3002
# ... outras portas e configurações
```

## 7. Configuração do Banco de Dados Neon DB

### 7.1. Criação do Projeto e Banco de Dados Neon

1.  Acesse o [Console Neon](https://console.neon.tech/).
2.  Crie um novo projeto (ex: `tektrio-replit-dev`).
3.  Dentro do projeto, um banco de dados padrão (`neondb`) e um branch (`main`) geralmente são criados automaticamente. Você pode usar este ou criar um banco de dados específico se preferir.
4.  Anote o nome do banco de dados, usuário e host. A senha será fornecida na string de conexão.

### 7.2. Obtendo a String de Conexão

1.  No Console Neon, navegue até o dashboard do seu projeto.
2.  Na seção "Connection Details" ou similar, você encontrará diferentes formatos de string de conexão.
3.  Copie a string de conexão **com pool de conexões habilitado** (geralmente marcada como "Pooled connection"). Isso é importante para ambientes serverless como Replit. Ela terá um formato similar a:
    `postgresql://<user>:<password>@<pooler-host>.neon.tech/<database>?sslmode=require`

### 7.3. Configurando a Conexão no Replit

1.  Volte ao seu Repl.
2.  Abra a aba "Secrets".
3.  Crie um novo segredo:
    *   **Key:** `DATABASE_URL`
    *   **Value:** Cole a string de conexão **com pool** copiada do Neon.
4.  Certifique-se que sua aplicação (ex: usando Prisma, TypeORM, node-postgres) está configurada para ler a string de conexão a partir de `process.env.DATABASE_URL`.

### 7.4. Estratégia Multi-Tenant (Schema-per-System)

Conforme as regras Replit, a estratégia inicial é "Schema-per-system" dentro da **mesma instância/banco de dados Neon**.

1.  **Schemas Base:**
    *   `core_parent`: Para dados globais do Sistema Pai.
    *   `child_matriz`: Para dados do Sistema Filho Matriz (ou tenant inicial).
    *   `plug_matriz`: Para dados do Plugin Matriz.
    *   Outros schemas conforme necessário (`child_<tenantId>`, `plug_<pluginKey>`).
2.  **Criação dos Schemas:** Use um script de migração ou conecte-se ao Neon DB via `psql` (instalado via `replit.nix`) ou um cliente GUI para criar os schemas iniciais:
    ```sql
    -- Conectado ao banco de dados principal (ex: 'neondb')
    CREATE SCHEMA IF NOT EXISTS core_parent;
    CREATE SCHEMA IF NOT EXISTS child_matriz;
    CREATE SCHEMA IF NOT EXISTS plug_matriz;
    -- Adicione outros schemas conforme necessário para testes iniciais
    ```
3.  **Isolamento na Aplicação:**
    *   A lógica da aplicação (backend) deve determinar o schema correto a ser usado com base no contexto (ex: tenant identificado via JWT, tipo de sistema).
    *   Ferramentas como Prisma ou TypeORM permitem especificar o schema dinamicamente ou configurar conexões/entidades para schemas específicos.

### 7.5. Migrações de Banco de Dados (Node.js/SQL)

Use uma ferramenta de migração como `node-pg-migrate`, Prisma Migrate, ou TypeORM migrations para gerenciar as alterações no schema do banco de dados Neon.

1.  **Instale a ferramenta** como dependência de desenvolvimento (`pnpm add -D node-pg-migrate`).
2.  **Configure a ferramenta** para ler a `DATABASE_URL` do ambiente.
3.  **Crie scripts de migração** para criar/alterar tabelas dentro dos schemas corretos (ex: `core_parent.users`, `child_matriz.notes`).
4.  **Adicione scripts ao `package.json`** para executar migrações (ex: `pnpm run migrate:up`, `pnpm run migrate:create`).
5.  Execute as migrações a partir do Shell do Replit.

**Exemplo (conceitual com `node-pg-migrate`):**

```javascript
// migrations/1678886400000_create-parent-users-table.js
exports.up = pgm => {
  pgm.createTable({ schema: 'core_parent', name: 'users' }, {
    id: 'id',
    email: { type: 'varchar(255)', notNull: true, unique: true },
    // ... outras colunas
    createdAt: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
};

exports.down = pgm => {
  pgm.dropTable({ schema: 'core_parent', name: 'users' });
};
```

## 8. Configuração de Ferramentas de Desenvolvimento

Consulte o `MANUAIS_REPLIT/4-pre-fase-0-manual_ferramentas_desenvolvimento_replit_v1.0.md` para detalhes completos. A configuração principal envolve garantir que ESLint, Prettier e Husky estejam instalados via `pnpm` e que seus arquivos de configuração (`.eslintrc.js`, `.prettierrc.js`, `.husky/`, `lint-staged` no `package.json`) estejam presentes no repositório.

### 8.1. Linters e Formatters (ESLint, Prettier)

*   As dependências (`eslint`, `prettier`, plugins, configs) devem estar nos `package.json`.
*   Arquivos de configuração (`.eslintrc.js`, `.prettierrc.js`, `.prettierignore`, `.eslintignore`) devem estar na raiz ou nos pacotes apropriados.
*   Adicione scripts `lint` e `format` no `package.json` raiz, utilizando `pnpm` e `turbo` se aplicável:
    ```json
    // package.json (raiz)
    {
      "scripts": {
        "lint": "turbo run lint",
        "lint:fix": "turbo run lint -- --fix",
        "format": "prettier --write "**/*.{ts,tsx,js,jsx,md,json}" --ignore-path .gitignore",
        "format:check": "prettier --check "**/*.{ts,tsx,js,jsx,md,json}" --ignore-path .gitignore"
        // ... outros scripts
      }
    }
    ```

### 8.2. Git Hooks (Husky + lint-staged)

*   Instale `husky` e `lint-staged` como dev dependencies (`pnpm add -D husky lint-staged`).
*   Configure o script `prepare` no `package.json` raiz: `"prepare": "husky install"`. Execute `pnpm run prepare` uma vez.
*   Crie o hook `pre-commit`: `npx husky add .husky/pre-commit "npx lint-staged"`.
*   Configure `lint-staged` no `package.json` raiz para rodar lint/format nos arquivos staged:
    ```json
    // package.json (raiz)
    {
      // ... outras configs
      "lint-staged": {
        "*.{ts,tsx,js,jsx}": [
          "eslint --fix",
          "prettier --write"
        ],
        "*.{md,json,yaml,yml}": [
          "prettier --write"
        ]
      }
    }
    ```

## 9. Conexão SSH (Opcional - Acesso ao Ambiente Replit)

*   **Neon DB:** A conexão padrão com o Neon DB **não** é via SSH. Usa-se a string de conexão `postgresql://...` segura (TLS/SSL).
*   **Acesso ao Repl via SSH:** O Replit oferece a funcionalidade de conectar ao shell do seu Repl via SSH. Isso pode ser útil para usar ferramentas locais (como o Cursor ou outro editor) para editar o código diretamente no ambiente Replit.
    1.  Consulte a documentação do Replit sobre como habilitar e configurar o acesso SSH ao seu Repl. Geralmente envolve gerar uma chave SSH e adicioná-la às configurações do Replit.
    2.  Você pode então configurar o Cursor (ou VS Code com Remote - SSH) para conectar ao host SSH fornecido pelo Replit.
*   **Relevância para o Projeto:** Isso é uma conveniência de desenvolvimento, **não** um requisito funcional da aplicação TEKTRIO em si ou da conexão com o Neon DB.

## 10. Testes da Configuração

1.  **Verificar Instalação Nix:** No Shell do Replit, verifique as versões: `node -v`, `pnpm -v`, `git --version`, `psql --version` (se instalado).
2.  **Verificar PNPM:** Execute `pnpm install` na raiz. Deve funcionar sem erros.
3.  **Verificar Secrets:** Crie um script Node.js simples que imprime `process.env.DATABASE_URL` e execute-o (`node test-secrets.js`). **Não comite este script.** Deve imprimir a string configurada (ou `undefined` se não estiver configurado).
4.  **Verificar Conexão DB:** Execute um script de teste de conexão simples (usando `pg` ou seu ORM) ou tente executar as migrações iniciais (`pnpm run migrate:up`).
5.  **Verificar Linters/Formatters:** Modifique um arquivo e tente commitar. O hook `pre-commit` do Husky/lint-staged deve rodar ESLint/Prettier. Execute `pnpm run lint` e `pnpm run format:check`.
6.  **Verificar Comando `run`:** Pressione o botão "Run" no Replit. O comando definido no `.replit` (`pnpm run dev`) deve ser executado.

## 11. Troubleshooting Comum (Replit/Neon)

*   **Erro de Pacote Nix:** Verifique o `replit.nix` por typos ou nomes de pacotes incorretos. Consulte a [busca de pacotes Nix](https://search.nixos.org/packages). Reinicie o Repl após alterações.
*   **`pnpm install` lento/falha:** Pode ser problema de rede do Replit ou falta de recursos. Tente novamente. Verifique se o `replit.nix` instalou todas as dependências de build necessárias.
*   **Secret não encontrado (`undefined`):** Verifique se o nome (Key) no Replit Secrets está **exatamente** igual ao esperado em `process.env.KEY`. Certifique-se que o Repl foi reiniciado após adicionar/modificar secrets.
*   **Erro Conexão Neon DB (`timeout`, `auth failed`, etc.):**
    *   Verifique se a `DATABASE_URL` no Replit Secrets está correta (copiada do Neon, **com pooler**).
    *   Confirme que o IP do seu Repl não está bloqueado nas configurações de firewall do Neon (geralmente não é um problema com IPs dinâmicos do Replit, mas verifique).
    *   Certifique-se de que o banco de dados/projeto Neon não está suspenso por inatividade (o free tier pode suspender após um período). Acesse o Console Neon para reativar.
    *   Verifique se `sslmode=require` está na string de conexão.
*   **Erro de Migração:** Verifique os logs da ferramenta de migração. Conecte-se via `psql` para inspecionar o estado do banco. Garanta que os schemas existem.
*   **Limites de Recursos Replit:** Repls gratuitos têm limites de CPU/RAM/Storage/Network. Monitore o uso na aba "Resources". Considere um plano pago se necessário.

## 12. Próximos Passos

Com o ambiente configurado, prossiga para os próximos manuais da Pré-Fase 0:

*   `MANUAIS_REPLIT/4-pre-fase-0-manual_ferramentas_desenvolvimento_replit_v1.0.md`
*   `MANUAIS_REPLIT/5-pre-fase-0-manual_neon_db_setup_conexao_v1.0.md` (Pode ser mesclado/refinado com base neste)
*   `MANUAIS_REPLIT/6-pre-fase-0-manual_replit_secrets_gerenciamento_v1.0.md` (Pode ser mesclado/refinado com base neste)
*   Etc. (conforme `Lista_Manuais_Replit_v1.0.md`)

## 13. Referências

*   [Documentação Replit](https://docs.replit.com/)
*   [Documentação Replit Nix](https://docs.replit.com/programming-ide/configuring-repl#nix)
*   [Documentação Replit Secrets](https://docs.replit.com/programming-ide/storing-secrets)
*   [Documentação Neon DB](https://neon.tech/docs)
*   [Documentação PNPM](https://pnpm.io/motivation)
*   [Documentação Nx](https://nx.dev/getting-started/intro)
*   `1-TEKTRIO_PROJECT_RULES_Replit_v1.0.md`
*   `2-plano_implementacao_e2e_Replit_v1.0.md`
