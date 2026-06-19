[86ag34uh1](https://app.clickup.com/t/86ag34uh1)

<!--
    [ID da task no Clickup](URL para a task no Clickup)
-->

## Descrição

<!--
    Descrição sobre o que foi feito nessa branch
-->

## Instruções para teste (se necessário)

<!--
    Caso necessário, instruções de como testar as mudanças realizadas. Ex: `npx expo start`, fluxo na tela X, plataforma iOS/Android.
-->

## Tipo de mudança

- [ ] 🐛 Bugfix (correção de uma falha existente)
- [ ] ✨ Nova feature (adição de nova funcionalidade)
- [ ] ♻️ Refatoração (mudança estrutural que não altera o comportamento final)
- [ ] 📚 Documentação (atualizações no README, comentários relevantes no código)
- [ ] ⚙️ Configuração / Core (dependências, CI/CD, Husky, config Expo/Metro/TypeScript)

## Checklist Expo / React Native

- [ ] Tipagem TypeScript adequada (evitar `any` sem necessidade).
- [ ] UI e estilos alinhados ao padrão do projeto (NativeWind / componentes existentes).
- [ ] Rotas, layouts ou deep links (Expo Router) conferidos, quando a mudança envolver navegação.

## Testes

- [ ] Testes co-localizados (`*.test.tsx`) foram criados/atualizados para componentes, hooks, telas e serviços alterados.
- [ ] O comando `npm run test:ci` passa com sucesso (inclui cobertura mínima de 80%).
- [ ] Fluxo verificado no Expo (simulador ou dispositivo), nas plataformas relevantes.
- [ ] Se algum arquivo ficou sem teste, há waiver aprovado em `.github/test-waivers.txt` ou `[test-waiver:path]` na descrição do PR.

## Checklist Geral

- [ ] O código passou pelo linter (`npm run lint`).
- [ ] O código foi formatado corretamente (`npm run format`).
- [ ] Realizei uma auto-revisão do meu próprio código.
