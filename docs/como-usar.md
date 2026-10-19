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
2. **Dependências**, com as versões que funcionaram no piloto (ProjetoDesaparecidos, 19/10/2026):

   ```bash
   npm i @spartan-ng/brain@1.8.0 @angular/cdk @fontsource-variable/inter @ng-icons/core@^33.4.0 @ng-icons/lucide@^33.4.0 class-variance-authority clsx tailwind-merge tw-animate-css
   ```

   - O `@spartan-ng/brain` fica **exato** em `1.8.0`, porque os componentes helm copiados são dessa versão.
   - O `@ng-icons` fica na **33**. Sem versão, o npm instala a 36, fora da faixa `>=32 <34` que a spartan 1.8 declara.
   - O `tw-animate-css` é importado pelo preset da spartan e precisa estar instalado.
   - **O CLI não entra no `package.json`**, porque traz o Nx inteiro. Use `npm i --no-save @spartan-ng/cli@1.8.0` só na hora de gerar componentes.

3. **`components.json`** na raiz do projeto, escrito à mão:

   ```json
   {
     "style": "vega",
     "componentsPath": "libs/ui",
     "importAlias": "@spartan-ng/helm"
   }
   ```

   - O `vega` já é o padrão no CLI 1.8, mas fica escrito.
   - Com esse arquivo presente, `npx ng g @spartan-ng/cli:ui <nome> < /dev/null` (um componente por vez) não pergunta nada. As dependências entre componentes entram sozinhas.
   - O CLI grava `paths` no `tsconfig.json` e `libs/ui/**/src/**/*.ts` no `include` do `tsconfig.app.json`, e cria `.nx/`. Ponha `/.nx` no `.gitignore`.
   - O CLI reescreve os JSON e tira os comentários do topo dos tsconfig.

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
   @import 'tailwindcss/utilities.css' layer(utilities) source(none);
   @source './';
   @source '../libs/ui';
   @import '@spartan-ng/brain/hlm-tailwind-preset.css';
   @import '@fontsource-variable/inter';
   @import './styles/nuvy-tema.css';
   ```

   O `source(none)` com os dois `@source` faz o Tailwind ler só o código do app e os componentes helm. Sem isso, a varredura automática pega pastas de build versionadas (como o `docs/` do GitHub Pages) e qualquer outra coisa da raiz.

6. **Modo escuro**:

   - Copie `modelos/nuvy-tema.js` para `public/nuvy-tema.js`.
   - No `index.html`, coloque `<script src="nuvy-tema.js"></script>` dentro do `<head>`, antes do CSS e sem `defer`. Ele põe a classe `.dark` no `<html>` antes da primeira pintura.
   - Copie `modelos/tema.service.ts` e ligue o botão do cabeçalho a `tema.alternar()`. O ícone vem de `tema.modo()`: sol no escuro, lua no claro.
   - Remova qualquer classe de tema fixa no `index.html` (`class="dark"`, `.app-dark` e afins).
   - **CSP:** o script é um arquivo do próprio site, então basta `script-src 'self'`. Não precisa de hash.

7. **Ícones e avisos**:

   - Ícones Lucide pelo `@ng-icons/lucide`, no lugar de PrimeIcons e Material Icons. Na spartan 1.8 não existe mais o helm `icon`: use `NgIcon` com `provideIcons({ lucideX })` e `<ng-icon name="lucideX" />`. O tamanho vem das classes `[&_ng-icon]` do componente pai (botão, alerta etc.).
   - Avisos rápidos com o `sonner` da spartan: `<hlm-toaster />` no componente raiz e `toast(...)` nas chamadas.
     - Ponha o toaster dentro de `@defer (on idle) { <hlm-toaster /> }` e importe a classe `HlmToaster` **direto**, sem o array `HlmToasterImports`. O `@defer` só adia componentes importados direto na classe; com o array, o código continua no bundle inicial.
     - Nos testes, injete o `toast` por um `InjectionToken` com `factory: () => toast` e troque no TestBed. O `vi.mock` não funciona com o `@angular/build:unit-test`.
     - Os textos do sonner ("Notifications alt+T", "Close toast") vêm em inglês, e a 1.8 não deixa trocar.

   **Bundle inicial:** qualquer import de `@spartan-ng/helm/utils` puxa o `@angular/cdk/overlay` (≈46 kB), e o `hlm()` traz o `tailwind-merge` (≈36 kB). No piloto, o bundle inicial foi de 422 kB para 617 kB, acima do orçamento de 500 kB. Voltou para 435 kB com duas mudanças: o toaster no `@defer` e, no cabeçalho, o botão de tema com as classes do `hlmBtn` ghost/icon copiadas, sem a diretiva.

   **Testes com Vitest + jsdom:** o jsdom não tem `matchMedia`, que o sonner usa. Copie `modelos/preparo-testes.ts` para `src/test-setup.ts` e ligue no `angular.json` (`test.options.setupFiles`) e no `tsconfig.spec.json`.

   **Diálogo:**
   - Abra com `HlmDialogService.open(Comp, { context, contentClass: 'sm:max-w-xl max-h-[calc(100dvh-2rem)] overflow-y-auto', closeLabel: 'Fechar' })`. Sem o `overflow-y-auto`, o botão de enviar fica fora da tela no celular. O `closeLabel` padrão é "Close".
   - No componente aberto, use `injectBrnDialogContext<T>()` e `inject(BrnDialogRef)`, com `host: { class: 'flex flex-col gap-6' }`.

   **Formulário:** `hlm-field` + `hlmFieldLabel` + `hlmInput` já ligam `for`, `aria-invalid` e `aria-describedby`.

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
