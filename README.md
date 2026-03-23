# Frontend Mobile — Estudify

App **Estudify** em React Native com **Expo** (SDK 54), **Expo Router**, **NativeWind** (Tailwind) e TypeScript.

## Tecnologias

| Tecnologia                                        | Uso                                                |
| ------------------------------------------------- | -------------------------------------------------- |
| **Expo ~54**                                      | Toolchain, build e serviços nativos                |
| **React 19** / **React Native 0.81**              | UI e runtime mobile                                |
| **Expo Router ~6**                                | Rotas baseadas em arquivos (`app/`)                |
| **NativeWind v4**                                 | Estilos com utilitários Tailwind em componentes RN |
| **TypeScript**                                    | Tipagem estática (modo strict)                     |
| **ESLint 9** (flat config + `eslint-config-expo`) | Lint                                               |
| **Prettier**                                      | Formatação                                         |
| **Husky** + **lint-staged**                       | Hooks de Git (pre-commit / pre-push / commit-msg)  |

## Pré-requisitos

- **Node.js** 20+ (recomendado LTS)
- **npm** (ou yarn/pnpm)
- Para testar no dispositivo: **Expo Go** ([iOS](https://apps.apple.com/app/expo-go/id982107779) / [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)) ou emulador/simulador (**Android Studio** / **Xcode**)

## Como rodar a aplicação

### 1. Instalar dependências

```bash
npm install
```

(O script `prepare` configura o Husky após a instalação.)

### 2. Servidor de desenvolvimento (Expo)

```bash
npm run start
```

- Escaneie o QR code com o Expo Go (Android) ou a câmera (iOS).
- Ou pressione `a` / `i` / `w` no terminal para abrir Android, iOS ou web.

### 3. Atalhos por plataforma

| Comando           | Descrição                                                     |
| ----------------- | ------------------------------------------------------------- |
| `npm run android` | Inicia o bundler e tenta abrir no Android                     |
| `npm run ios`     | Inicia o bundler e tenta abrir no simulador iOS (macOS)       |
| `npm run web`     | Abre no navegador (output estático configurado em `app.json`) |

## Setup e troubleshooting (Expo)

Problemas comuns ao subir o projeto:

| Situação                                                                        | O que fazer                                                                           |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Metro “travado”, mudanças em `app.json`, Babel ou NativeWind sem efeito         | Limpar cache do bundler: `npx expo start -c` (equivalente a `--clear`).               |
| Celular não encontra o bundler na mesma rede (Wi‑Fi corporativo, VPN, firewall) | Usar túnel: `npx expo start --tunnel` (pode ser mais lento, mas contorna rede local). |
| Erros estranhos após trocar branches ou dependências                            | `rm -rf node_modules && npm install` e, se precisar, `npx expo start -c`.             |
| macOS e watcher de arquivos                                                     | Em alguns casos ajuda: `watchman watch-del-all` (se o Watchman estiver instalado).    |

> A tela de “loading” do Metro/Expo em desenvolvimento não é configurável pelo projeto; em **produção** o usuário vê o splash nativo (`expo-splash-screen` em `app.json`).

## Comandos úteis

| Comando           | Descrição                                                          |
| ----------------- | ------------------------------------------------------------------ |
| `npm run start`   | Inicia o Expo (Metro + dev tools).                                 |
| `npm run lint`    | Roda o ESLint (`expo lint`).                                       |
| `npm run format`  | Formata o projeto com Prettier (`prettier --write .`).             |
| `npm run prepare` | Reinstala/configura hooks do Husky (também roda no `npm install`). |

## Estrutura do projeto

```
frontend-mobile/
├── .github/
│   └── pull_request_template.md
├── .husky/                    # pre-commit (lint-staged), pre-push (branch), commit-msg
├── app/                       # Rotas e layouts (Expo Router) — permanece na raiz
│   ├── _layout.tsx
│   └── index.tsx
├── src/                       # Código compartilhado (importar com @/…)
│   ├── components/            # Componentes reutilizáveis
│   ├── hooks/                 # Hooks customizados
│   ├── constants/             # Constantes como cores, tamanhos, etc.
│   └── services/              # Serviços para chamada de APIs

├── assets/
│   └── images/
├── global.css                 # Entrada Tailwind / NativeWind
├── app.json                   # Config Expo (nome, splash, plugins)
├── babel.config.js            # Presets Expo + NativeWind + alias @ → src
├── metro.config.js            # Metro + NativeWind
├── tailwind.config.js         # content: app/ + src/
├── tsconfig.json              # paths: @/* → src/*
├── eslint.config.js
├── .prettierrc
└── package.json
```

### Pastas principais

| Pasta             | Descrição                                                       |
| ----------------- | --------------------------------------------------------------- |
| `app/`            | Apenas rotas, layouts e telas do Expo Router (arquivos = URLs). |
| `src/components/` | UI reutilizável fora das rotas.                                 |
| `src/hooks/`      | Lógica compartilhada em hooks.                                  |
| `src/lib/`        | Funções puras, API clients, constantes de domínio, etc.         |

**Alias `@/`:** aponta para `src/`. Exemplo: `import { cn } from "@/lib/cn"` (crie o arquivo quando precisar).

## Padrões estabelecidos

### Código e estilo

- **ESLint**: o projeto deve passar em `npm run lint`.
- **Prettier**: use `npm run format` ou deixe o editor formatar; o pre-commit roda Prettier via lint-staged nos arquivos alterados.
- **TypeScript**: `strict` ativo; prefira tipar props e retornos de funções públicas.
- **NativeWind**: classes Tailwind em `className` nos componentes compatíveis; manter `global.css` e `tailwind.config.js` alinhados ao que for usado em `app/` e `src/`.

### Git (Husky)

**Branch** (pre-push): `tipo(id_clickup)/nome-da-branch` — tipos: `feature`, `fix`, `hotfix`, `chore`, `refactor`, `arch`, `docs`, `test`. Exceções: `main`, `develop`.

**Commit** (commit-msg): `tipo(id_clickup): descrição com pelo menos 5 caracteres` — exemplo: `feature(86ag34u4q): add tela de login`.

**Pre-commit**: **lint-staged** (ESLint com `--fix` e Prettier nos arquivos staged).

### Organização

- **Telas e navegação** ficam em `app/`; **lógica e UI compartilhada** em `src/`.
- Um componente por arquivo quando fizer sentido; nomes claros e exports explícitos.

## Como criar rotas (Expo Router)

O roteamento é **por arquivo** dentro de `app/`:

| Arquivo                           | Rota (exemplo)                                                          |
| --------------------------------- | ----------------------------------------------------------------------- |
| `app/index.tsx`                   | `/`                                                                     |
| `app/about.tsx`                   | `/about`                                                                |
| `app/settings/index.tsx`          | `/settings`                                                             |
| `app/user/[id].tsx`               | `/user/123` (parâmetro dinâmico)                                        |
| `app/(tabs)/_layout.tsx` + filhos | Grupo com layout de abas (URL sem o nome do grupo se configurado assim) |

- Layout compartilhado: `app/_layout.tsx` (já existe na raiz de `app/`).
- Opções de tela (título, header): `Stack.Screen` / `Tabs.Screen` ou `export const options` conforme a [documentação do Expo Router](https://docs.expo.dev/router/introduction/).

Após adicionar arquivos em `app/`, o TypeScript pode regenerar tipos de rotas ao rodar o projeto (experimentos `typedRoutes` no `app.json`).

## Licença

Projeto privado.
