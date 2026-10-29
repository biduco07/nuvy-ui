# nuvy-ui

O tema NuvyTech dos projetos com **spartan/ui + Tailwind v4**. É a fonte única das cores, do raio e das fontes, mais um gerador e uma conferência de contraste (WCAG AA). As decisões estão em [docs/superpowers/specs/2026-10-18-tema-nuvytech-design.md](docs/superpowers/specs/2026-10-18-tema-nuvytech-design.md):

- marca única NuvyTech;
- escuro por padrão;
- cantos padrão (estilo `vega`);
- fonte Inter.

Não há dependências npm. Precisa de Node 22 ou mais novo.

| Comando | O que faz |
|---|---|
| `npm run gerar` | gera `dist/` a partir de `tokens.mjs` |
| `npm test` | confere o contraste, se `dist/` está em dia, a cópia, o layout e o script do modo escuro |
| `npm run copiar -- <pasta-do-projeto>` | grava `src/styles/nuvy-tema.css` no projeto |
| `npm run previa` | monta `previa/tema-nuvytech.html` para ver as cores |
| `npm run referencia` | monta `previa/referencia.html`: cores, componentes, estados, contraste e escalas nos dois modos |

## O que tem aqui

- `tokens.mjs`: neutros, marca, gráficos, raio e fontes.
- `dist/nuvytech/tema.css`: o arquivo que os projetos Angular copiam. Traz as variáveis, os extras para o Tailwind, a base e a regra do botão com o mouse em cima.
- `dist/nuvytech/tokens.css`: só as variáveis, com o claro no `:root` e o escuro em `.dark`.
- `dist/nuvytech/tokens-escuro.css`: só o escuro, para páginas sem JavaScript (portal, Keycloak).
- `dist/nuvytech/layout.css`: o layout padrão (classes `nv-`) para páginas sem spartan. Fonte em `layout/layout.css`; use junto com `tokens-escuro.css` ou `tokens.css`.
- `dist/nuvytech/logo.svg`, `logo-escuro.svg` e `favicon.svg`: a logo oficial (ver a seção Logo). Fonte em `logo/`.
- `dist/tokens.json`: todos os valores em OKLCH e hex.
- `modelos/layout-exemplo.html`: página de exemplo com todas as peças do layout, com dados fictícios.
- `modelos/layout-lateral-exemplo.html` e `modelos/nuvy-lateral.js`: variante com coluna lateral (recolhível, gaveta no celular); ver [docs/layout-lateral.md](docs/layout-lateral.md). Prévia: `previa/layout-lateral.html`.
- `modelos/`: o script do modo escuro (`nuvy-tema.js`), o serviço Angular do botão de tema e o preparo dos testes Vitest (`preparo-testes.ts`, copiado como `src/test-setup.ts`).

- `dist/penpot/tokens.json`: os mesmos tokens no formato do Penpot (ver [docs/penpot.md](docs/penpot.md)).

A referência visual (cores, tipografia, escalas, estados e componentes) está em [docs/referencia-visual.md](docs/referencia-visual.md). O passo a passo para cada tipo de projeto está em [docs/como-usar.md](docs/como-usar.md).

## Logo

A logo oficial da NuvyTech (a mesma do site nuvytech.com.br) fica em `logo/` e é publicada em `dist/nuvytech/`:

| Arquivo | Uso |
|---|---|
| `logo.svg` | fundo claro (texto escuro) |
| `logo-escuro.svg` | fundo escuro (texto claro); **os apps são tema escuro, use este** |
| `favicon.svg` | ícone da aba do navegador |

Num app, o caminho no pacote é `nuvy-ui/dist/nuvytech/logo-escuro.svg`. Copie o arquivo para os assets do app (ou aponte o build para essa pasta) e use:

```html
<img src="assets/nuvytech/logo-escuro.svg" alt="NuvyTech" width="184" height="48" />
<link rel="icon" type="image/svg+xml" href="assets/nuvytech/favicon.svg" />
```

Para trocar a logo, edite os arquivos de `logo/` e rode `npm run gerar`; `npm test` falha se o `dist/` ficar desatualizado.
