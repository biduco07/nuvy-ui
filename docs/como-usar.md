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
   @layer theme, base, ng-icon, components, utilities;
   @import 'tailwindcss/theme.css' layer(theme);
   @import 'tailwindcss/preflight.css' layer(base);
   @import 'tailwindcss/utilities.css' layer(utilities) source(none);
   @source './';
   @source not './testing';
   @source not './**/*.spec.ts';
   @source '../libs/ui';
   @import '@spartan-ng/brain/hlm-tailwind-preset.css';
   @import '@fontsource-variable/inter';
   @import './styles/nuvy-tema.css';
   ```

   A camada `ng-icon` vem declarada abaixo dos utilitários porque o `@ng-icons` 33 põe a cor do ícone em `@layer ng-icon`. Sem ela na lista, essa camada nasce por último e vence o `text-primary` (ou qualquer cor) posto direto no `<ng-icon>`. Se o projeto não usa o Material, importe também `@angular/cdk/a11y-prebuilt.css`, senão o texto do `LiveAnnouncer` aparece visível no fim da página.

   O `source(none)` com os `@source` faz o Tailwind ler só o código do app e os componentes helm, sem os testes. Se os specs ou utilitários de teste entrassem na varredura, um comentário como `bg-green-700` iria parar no CSS de produção. Sem isso, a varredura automática pega pastas de build versionadas (como o `docs/` do GitHub Pages) e qualquer outra coisa da raiz.

6. **Modo escuro**:

   - Copie `modelos/nuvy-tema.js` para `public/nuvy-tema.js`.
   - No `index.html`, coloque `<script src="nuvy-tema.js"></script>` dentro do `<head>`, antes do CSS e sem `defer`. Ele põe a classe `.dark` no `<html>` antes da primeira pintura.
   - Copie `modelos/tema.service.ts` e ligue o botão do cabeçalho a `tema.alternar()`. O ícone vem de `tema.modo()`: sol no escuro, lua no claro.
   - Remova qualquer classe de tema fixa no `index.html` (`class="dark"`, `.app-dark` e afins).
   - **CSP:** o script é um arquivo do próprio site, então basta `script-src 'self'`. Não precisa de hash.
   - **Cache:** o `nuvy-tema.js` não tem hash no nome. Se o servidor usar cache longo para `.js` (por exemplo `max-age=31536000, immutable`), quem visitou uma vez fica com a versão velha por um ano, e não há como consertar depois. No nginx, dê a ele uma regra própria, **antes** da regra de `.js`:

     ```nginx
     location = /nuvy-tema.js {
       add_header Cache-Control "no-cache";
       # repita aqui os add_header de segurança do servidor: um add_header dentro do location apaga os de fora
       try_files $uri =404;
     }
     ```

7. **Ícones e avisos**:

   - Ícones Lucide pelo `@ng-icons/lucide`, no lugar de PrimeIcons e Material Icons. Na spartan 1.8 não existe mais o helm `icon`: use `NgIcon` com `provideIcons({ lucideX })` e `<ng-icon name="lucideX" />`. O tamanho vem das classes `[&_ng-icon]` do componente pai (botão, alerta etc.).
   - Avisos rápidos com o `sonner` da spartan: `<hlm-toaster />` no componente raiz e `toast(...)` nas chamadas.
     - Ponha o toaster dentro de `@defer (on idle) { <hlm-toaster /> }` e importe a classe `HlmToaster` **direto**, sem o array `HlmToasterImports`. O `@defer` só adia componentes importados direto na classe; com o array, o código continua no bundle inicial.
     - Nos testes, injete o `toast` por um `InjectionToken` com `factory: () => toast` e troque no TestBed. O `vi.mock` não funciona com o `@angular/build:unit-test`.
     - Os textos do sonner ("Notifications alt+T", "Close toast") vêm em inglês, e a 1.8 não deixa trocar.
     - **Leitor de tela:** o sonner cria a região do aviso já com o texto, no primeiro aviso (e dentro do `@defer`). Vários leitores não anunciam uma região que já nasce com conteúdo. Na fachada de avisos, anuncie também pelo `LiveAnnouncer` do `@angular/cdk/a11y` (`'polite'` para sucesso e informação, `'assertive'` para erro), só no navegador.

   **Bundle inicial:** qualquer import de `@spartan-ng/helm/utils` puxa o `@angular/cdk/overlay` (≈46 kB), e o `hlm()` traz o `tailwind-merge` (≈36 kB). No piloto, o bundle inicial foi de 422 kB para 617 kB, acima do orçamento de 500 kB. Voltou para 435 kB com duas mudanças: o toaster no `@defer` e, no cabeçalho, o botão de tema com as classes do `hlmBtn` ghost/icon copiadas, sem a diretiva.

   **Testes com Vitest + jsdom:** o jsdom não tem `matchMedia`, que o sonner usa. Copie `modelos/preparo-testes.ts` para `src/test-setup.ts` e ligue no `angular.json` (`test.options.setupFiles`) e no `tsconfig.spec.json`.

   **Diálogo:**
   - Abra com `HlmDialogService.open(Comp, { context, contentClass: 'sm:max-w-xl max-h-[calc(100dvh-2rem)] overflow-y-auto', closeLabel: 'Fechar' })`. Sem o `overflow-y-auto`, o botão de enviar fica fora da tela no celular. O `closeLabel` padrão é "Close".
   - No componente aberto, use `injectBrnDialogContext<T>()` e `inject(BrnDialogRef)`, com `host: { class: 'flex flex-col gap-6' }`.
   - **Aviso atrás do diálogo:** no CDK 21+, o diálogo abre na camada do topo do navegador (popover), e o toast do sonner fica atrás do fundo escuro. O piloto resolveu com um serviço de diálogo local configurado com `usePopover: false`. Prover o `provideSpartanHlm()` na raiz também resolve, mas custa ≈46 kB no bundle inicial. Use também `closeOnOutsidePointerEvents: false` se houver aviso com botão "Fechar" na tela: sem isso, fechar o aviso fecha o formulário.

   **Formulário:** `hlm-field` + `hlmFieldLabel` + `hlmInput` já ligam `for`, `aria-invalid` e `aria-describedby`. Quando não há `BrnFieldControl` (campo próprio, ngx-mask fora do padrão), o `hlm-field-error` precisa de `forceShow` para aparecer.

   **Classes do host x variantes no escuro:** as classes `dark:` das variantes da spartan vencem as classes que você põe no host. Exemplo: um `hlmBadge variant="destructive"` com cor própria volta para o vermelho translúcido no escuro. Para cor própria, use a variante padrão com as suas classes.

   **Calendário/date-picker:** `provideBrnCalendarI18n` na raiz soma ≈170 kB ao bundle inicial. Ponha nos `providers` da rota ou do layout que usa o calendário. O `hlm-field-error` tem `role="alert"`. Se o foco for para o campo com erro, o leitor de tela lê a mensagem duas vezes: pelo alerta e pelo `aria-describedby`. É aceitável, mas não acrescente mais um `aria-live` por cima.

   **Orçamento do bundle:** ponha o `maximumError` do bundle inicial perto do limite real (por exemplo 550 kB), e não em 1 MB. Assim, um import que puxe o overlay do CDK de volta quebra o build, em vez de passar em silêncio.

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
- Para a estrutura da página (cabeçalho, cartões, botões, formulários, tabelas) use o [Layout padrão](#layout-padrão) abaixo. Se precisar estilizar à mão, use as medidas do estilo vega:
  - botão e campo com `border-radius: calc(var(--radius) * 0.8)`;
  - cartão e janela com `calc(var(--radius) * 1.4)`;
  - borda de campo `var(--input)`;
  - fundo de campo `color-mix(in oklab, var(--input) 30%, transparent)`;
  - foco com a borda em `var(--ring)`.

## Layout padrão

Arquivo: `dist/nuvytech/layout.css` (fonte em `layout/layout.css`). Exemplo completo: `modelos/layout-exemplo.html`. Variante com coluna lateral no lugar do menu no topo: [layout-lateral.md](layout-lateral.md).

**Quando usar**
- Páginas sem spartan: portal do site-factory, login do Keycloak, páginas estáticas e relatórios HTML.
- Nos projetos Angular a spartan já segue os mesmos tokens e **não** usa este arquivo. Ele serve de referência visual: cabeçalho com marca, cartões, espaçamentos, selos e avisos.

**Como usar**
1. Carregue as variáveis (`tokens-escuro.css` para página sempre escura e sem JavaScript, ou `tokens.css`) e depois o layout:
   ```html
   <link rel="stylesheet" href="tokens-escuro.css">
   <link rel="stylesheet" href="layout.css">
   <body class="nv-pagina">
   ```
2. Monte a página com as classes abaixo. O layout só usa variáveis do tema (nenhuma cor fixa) e todas as classes começam com `nv-`.

| Peça | Classes |
|---|---|
| Página | `nv-pagina` (no `<body>`), `nv-pagina--estreita` (telas de acesso), `nv-pagina--leitura`, `nv-principal`, `nv-pular`, `nv-rodape` |
| Cabeçalho | `nv-cabecalho`, `nv-cabecalho__interno`, `nv-marca` (`__logo`, `__sub`), `nv-nav`, `nv-nav__link` (`aria-current="page"` marca a atual), `nv-conta` (`__nome`, `__papel`) |
| Coluna lateral | variante: `nv-pagina--lateral`, `nv-app`, `nv-lateral` (`__topo`, `__nav`, `__grupo`, `__lista`, `__sub`, `__link`, `__icone`, `__texto`, `__contagem`, `__conta`, `__botao`, `__fundo`), `nv-lateral-corpo`, `nv-barra-topo`. Detalhes em [layout-lateral.md](layout-lateral.md) |
| Texto | `nv-titulo-pagina`, `nv-acoes`, `nv-sobretitulo`, `nv-texto-suave`, `nv-num`, `nv-codigo` |
| Cartão e grade | `nv-cartao` (`--destaque`, `--atencao`), `nv-grade`, `nv-indicadores`, `nv-indicador` (`__valor`, `__nome`, `--atencao`) |
| Botão | `nv-botao`, `nv-botao--secundario`, `--perigo`, `--pequeno`, `--grande`, `--total` |
| Formulário | `nv-formulario` (`--duas-colunas`, `__acoes`), `nv-campo` (`--largo`), `nv-rotulo`, `nv-entrada` (`--invalida`, `--total`), `nv-selecao`, `nv-area-texto`, `nv-marcador`, `nv-ajuda`, `nv-erro-campo`, `nv-grupo`, `nv-filtros` |
| Tabela | `nv-tabela-caixa`, `nv-tabela`, `nv-tabela__detalhe` |
| Situação | `nv-selo` (`--sucesso`, `--atencao`, `--perigo`, `--info`, `--destaque`), `nv-aviso` (`--sucesso`, `--atencao`, `--erro`) |
| Outros | `nv-lista`, `nv-vazio`, `nv-barra`, `nv-dados` |

**Regras**
- O foco do teclado usa o contorno cheio com `--ring` (`:focus-visible`); não o remova.
- No celular (até 720 px) a navegação quebra de linha, as tabelas rolam na horizontal e os formulários de duas colunas viram uma.
- Para mudar o layout, edite `layout/layout.css`, rode `npm run gerar` e `npm test`.

## Mudar uma cor

1. Edite `tokens.mjs`.
2. Rode `npm run gerar`.
3. Rode `npm test`. O teste de contraste reprova se alguma combinação cair abaixo do AA.
4. Suba a versão em `package.json` e em `scripts/gerar.mjs` (`VERSAO`). Uma cor ou um raio novos sobem a versão menor.
5. Abra um PR. Depois, rode `npm run copiar` em cada projeto, que abre o próprio PR.

Para ver as cores, rode `npm run previa` e abra `previa/tema-nuvytech.html`.

## Dicas dos projetos já migrados

Vêm do ProjetoDesaparecidos e do iddle-app. Os detalhes estão em `side-session-notes/.../migracao-ui/aprendizados-piloto.md`.

- **Barras e gráficos com texto por cima:** varie só a matiz e deixe a luminosidade fixa por tema. O iddle-app usa `oklch(0.60 0.12 H)` no claro e `oklch(0.53 0.10 H)` no escuro. Se a luminosidade variar, o texto que fica metade sobre a barra e metade sobre o trilho deixa de passar 4,5:1.
- **Barras de dados neutras:** use `bg-input`, que tem 3:1 contra o fundo. `bg-muted` some no escuro.
- **Nome acessível:** o Angular tira o espaço entre elementos ("Alfa" + "×2" vira "Alfa×2"). Quando o texto visível precisa entrar no nome acessível (WCAG 2.5.3), use `&ngsp;`.
- **Botão que fica desabilitado durante a navegação por teclado:** use `aria-disabled="true"` e barre o clique no handler. Com `disabled`, o foco cai no `<body>`. A aparência de desabilitado vem do tema a partir da 1.1.0.
- **O que o axe acusa e é da biblioteca:** o `<ol>` do `brn-sonner-toaster` dá violação `list` enquanto um aviso está na tela, e o `hlmAlert` tem `role="alert"` fixo. Liste isso à parte, sem esconder.
