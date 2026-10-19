# Como usar o tema NuvyTech

O tema vale para todos os projetos da NuvyTech:

- marca única NuvyTech;
- escuro por padrão;
- cantos padrão da spartan (estilo `vega`);
- fonte Inter;
- contraste AA conferido.

Cada projeto recebe uma **cópia** do arquivo gerado. O build não busca nada daqui.

## Angular com spartan/ui

Vale para CRMSystem, ProjetoDesaparecidos, iddle-app, GerenciamentoCliente e nuvydoc.

1. **Requisitos:** Angular 21 ou 22, Tailwind 4 (com `@tailwindcss/postcss`) e `@angular/cdk`.
2. **Dependências:**

   ```bash
   npm i @spartan-ng/brain @angular/cdk @fontsource-variable/inter @ng-icons/core @ng-icons/lucide class-variance-authority clsx tailwind-merge tw-animate-css
   npm i -D @spartan-ng/cli
   ```

   O `tw-animate-css` é importado pelo preset da spartan e precisa estar instalado.

3. **`components.json`** na raiz do projeto: o estilo é `vega`. Ele já é o padrão do `components.json` no CLI 1.8, mas deixe escrito, porque o `init` interativo pergunta e oferece outros. Campos aceitos num projeto Angular CLI: `style`, `componentsPath` (padrão `libs/ui`) e `importAlias` (padrão `@spartan-ng/helm`). O CLI usa esse arquivo também para saber onde copiar os componentes e qual alias de import usar. Depois gere os componentes com `ng g @spartan-ng/cli:ui`.

   ```json
   {
     "style": "vega"
   }
   ```

   **Atenção:** se você rodar o `ng g @spartan-ng/cli:init` (ou o `ui-theme`), ele grava no fim do `styles.css` um bloco `:root { … }`, um `:root.dark { … }` e um `@layer base` com as cores e o foco padrão da spartan. Esse bloco vem depois do import do tema e **passa por cima dele sem dar erro**. Apague o bloco. O `npm run copiar` avisa quando encontra um.

4. **Copie o tema** a partir do nuvy-ui. O comando grava `src/styles/nuvy-tema.css`:

   ```bash
   npm run copiar -- ../caminho/do/projeto
   ```

5. **`src/styles.css`** (CSS puro, não SCSS), nesta ordem:

   ```css
   @layer theme, base, components, utilities;
   @import 'tailwindcss/theme.css' layer(theme);
   @import 'tailwindcss/preflight.css' layer(base);
   @import 'tailwindcss/utilities.css' layer(utilities);
   @import '@spartan-ng/brain/hlm-tailwind-preset.css';
   @import '@fontsource-variable/inter';
   @import './styles/nuvy-tema.css';
   ```

   Se os componentes helm ficarem fora de `src/`, acrescente `@source '../caminho/dos/helm';` para o Tailwind enxergar as classes deles.

6. **Modo escuro**:

   - Copie `modelos/nuvy-tema.js` para `public/nuvy-tema.js`.
   - No `index.html`, coloque `<script src="nuvy-tema.js"></script>` dentro do `<head>`, antes do CSS e sem `defer`. Ele põe a classe `.dark` no `<html>` antes da primeira pintura.
   - Copie `modelos/tema.service.ts` e ligue o botão do cabeçalho a `tema.alternar()`. O ícone vem de `tema.modo()`: sol no escuro, lua no claro.
   - Remova qualquer classe de tema fixa no `index.html` (`class="dark"`, `.app-dark` e afins).
   - **CSP:** o script é um arquivo do próprio site, então basta `script-src 'self'`. Não precisa de hash.

7. **Ícones e avisos**:

   - Ícones Lucide pelo `@ng-icons/lucide` (`<ng-icon hlm name="lucideX" />`), no lugar de PrimeIcons e Material Icons.
   - Avisos rápidos com o `sonner` da spartan: `<hlm-toaster />` no componente raiz e `toast(...)` nas chamadas.

8. **O que o tema já resolve**:

   - Botão principal com o mouse em cima: o fundo escurece no claro e clareia no escuro, para o texto continuar legível.
   - Contorno de foco com a cor cheia.
   - Cores extras: `bg-success`, `text-warning`, `bg-info` (e os `-foreground` de cada uma), `bg-marca` e `--gradiente-marca` para o logo.

9. **Não use cores fixas** (`bg-blue-600`, `#0062cc`, `text-gray-500`). Use os tokens: `bg-primary`, `text-muted-foreground`, `border-input`, `bg-destructive/10`, `text-success`. Assim o claro e o escuro funcionam sozinhos.

## Site da NuvyTech

É o cliente `nuvytech` do gerador Astro do site-factory, que já usa Tailwind v4 e Inter.

- As cores do cliente vêm do escuro de `dist/tokens.json` ou de `dist/nuvytech/tokens-escuro.css`.
- Os outros clientes do gerador **não** usam este tema.

## Páginas sem JavaScript (portal do site-factory, login do Keycloak)

- Use `dist/nuvytech/tokens-escuro.css`: são só as variáveis do escuro, direto no `:root`, então a página é sempre escura.
- Reestilize os elementos com as medidas do estilo vega:
  - botão e campo com `border-radius: calc(var(--radius) * 0.8)`;
  - cartão e janela com `calc(var(--radius) * 1.4)`;
  - borda de campo `var(--input)`;
  - fundo de campo `color-mix(in oklab, var(--input) 30%, transparent)`;
  - foco com a borda em `var(--ring)`.

## Mudar uma cor

1. Edite `tokens.mjs`.
2. Rode `npm run gerar`.
3. Rode `npm test`. O teste de contraste reprova se alguma combinação cair abaixo do AA.
4. Suba a versão em `package.json` e em `scripts/gerar.mjs` (`VERSAO`). Uma cor ou um raio novos sobem a versão menor.
5. Abra um PR. Depois, rode `npm run copiar` em cada projeto, que abre o próprio PR.

Para ver as cores, rode `npm run previa` e abra `previa/tema-nuvytech.html`.
