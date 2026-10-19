# Tema NuvyTech (nuvy-ui) — desenho

18/10/2026, versão 2. Prévia visual: https://claude.ai/artifact/6jYR1vCfYwXxnxwYw4L8t8 (proposta 2).

Mudanças da versão 1 para a 2, por escolha do Pedro depois de ver a prévia: **tema escuro, marca NuvyTech em todos os apps e cantos padrão**. A versão 1 tinha o estilo arredondado ("maia"), uma cor por app (verde no gercliente, índigo no nuvydoc) e seguia o modo do aparelho.

## Por quê

O Pedro decidiu padronizar a interface de todos os projetos com **spartan/ui** (o "shadcn/ui do Angular") e **Tailwind v4**, com um tema NuvyTech. Motivo: as próximas versões do PrimeNG passam a ser pagas (o PrimeNG 21 atual continua MIT). Hoje cada projeto tem um visual próprio:

- PrimeNG Aura: gercliente e nuvydoc.
- Angular Material: CRMSystem, ProjetoDesaparecidos e iddle-app.
- CSS próprio: portal do site-factory e site da NuvyTech, este no gerador Astro.

O login compartilhado (Keycloak, repositório nuvy-auth) vai se alinhar a este tema.

## Objetivos

- Um tema só, com uma fonte de verdade, usado por todos os projetos.
- Contraste **WCAG 2.x AA** medido, e não estimado:
  - texto com pelo menos 4,5:1;
  - borda de campo, contorno de foco, estado de checkbox e switch e cores de gráfico com pelo menos 3:1;
  - inclusive com o mouse em cima.
- Escuro por padrão, fonte **Inter** e cantos padrão da spartan.
- O build de cada projeto não depende de rede nem de chave para buscar o tema.

## Fora do escopo

- O gerador de design (canvas de Artifact) não precisa seguir o padrão.
- Os sites dos clientes do gerador Astro do site-factory (sorriso-vita, aura-estetica, prime-auto-care e os próximos) mantêm a identidade de cada cliente. Só o cliente `nuvytech`, que é o site da NuvyTech, usa este tema.
- A migração de cada projeto. Cada um terá desenho e plano próprios, com este tema como base.

## Anti-objetivos (seria um fracasso mesmo funcionando)

- Um pacote que exija token do GitHub no CI ou na VM para instalar. Todos os repositórios são privados.
- Cor de botão que falhe no AA, inclusive com o mouse em cima.
- Fonte ou CSS buscados de terceiros em tempo de execução, como o Google Fonts.

## Decisões

### 1. Base: spartan/ui 1.8, estilo "vega"

- **spartan/ui 1.8**: `@spartan-ng/brain` mais os componentes "helm", que o `@spartan-ng/cli` copia para o projeto. Exige:
  - Angular 21 ou 22;
  - Tailwind 4 ou mais novo;
  - `@angular/cdk`;
  - `tw-animate-css`, que o preset importa e precisa estar instalado.
- **Estilo vega.** A spartan 1.8 tem estilos prontos (nova, vega, lyra, maia, mira, luma). O estilo vai no `components.json` e é gravado no código dos componentes na hora da geração. A escolha é `"style": "vega"`, os cantos padrão: botões e campos `rounded-md` (8 px), cartões e janelas `rounded-xl` (14 px), etiquetas em pílula. Atenção: o padrão do CLI é `nova`, então o `vega` precisa ser escrito no `components.json` de cada projeto.
- `--radius: 0.625rem`, o padrão da spartan.
- **Neutros**: a base "slate" da spartan, com os ajustes de contraste da seção 2.
- **Preset**: o `@spartan-ng/brain/hlm-tailwind-preset.css` já liga as variáveis padrão ao Tailwind (`bg-primary` etc.) e define `@custom-variant dark (&:is(.dark *))`. O tema só acrescenta o que falta.

### 2. Tokens

Os nomes seguem o padrão shadcn/spartan, em OKLCH:

- `--background`, `--foreground`, `--card`, `--popover`, `--primary`, `--secondary`, `--muted`, `--accent`, `--destructive`, `--border`, `--input`, `--ring`;
- `--chart-1..5` e `--sidebar-*`;
- `--radius`, `--font-sans`, `--font-mono`.

O tema acrescenta:

- `--destructive-foreground`, `--success`, `--warning` e `--info`, cada um com o seu `-foreground`. Servem para os status de nota, cobrança etc. Ficam registrados no Tailwind (`bg-success`, `text-warning`...).
- `--marca`, `--marca-2` e `--gradiente-marca`: o gradiente do logo, de #007bff a #00d2ff. Servem para o logo, destaques grandes e decoração. Não servem para texto pequeno.

**Uma marca só, NuvyTech, em todos os apps.** Os logos do gercliente, do nuvydoc e do CRMSystem já usam esse azul. Valores principais (hex de referência; o arquivo usa OKLCH):

| Token | Escuro (padrão) | Claro |
|---|---|---|
| `--background` / `--foreground` | #020618 / #f8fafc | #ffffff / #020618 |
| `--card` | #0f172b | #ffffff |
| `--primary` / `--primary-foreground` (botão) | #51a2f8 / #061431 | #0062cc / #f9fafb |
| `--ring` (foco) | #3f93f7 | #007bff |
| `--muted` / `--muted-foreground` | #1d293d / #98a9c1 | #f1f5f9 / #4f5f76 |
| `--accent` / `--accent-foreground` (menu ativo) | #192e4b / #dbe9fc | #ebf3ff / #014491 |
| `--input` (borda de campo) | #66768c | #7f8da2 |
| `--destructive` | #fe9b98 | #b91c1c |
| `--success` / `--warning` / `--info` | #5dd786 / #fdbe45 / #59c5f5 | #197037 / #925002 / #076484 |

- No claro, o botão é #0062cc com texto branco. A cor do logo, #007bff, não chega a 4,5:1 com branco, e #0062cc já é o tom que o nuvy-auth usa no botão.
- No escuro, o botão usa o tom claro da marca com texto escuro, como a spartan faz.
- **Ajustes nos neutros** em relação ao "slate" padrão:
  - `--muted-foreground` mais escuro no claro, para passar 4,5:1 também sobre `muted`.
  - `--input` sólido e mais escuro, para a borda do campo passar 3:1. O padrão da spartan é quase da cor do fundo, com 1,3:1.
  - `--destructive` ajustado, porque a spartan usa o vermelho como texto sobre um fundo vermelho translúcido no botão "Excluir".
- `--border` é decorativo (divisórias) e não tem exigência de 3:1.

### 3. Botão com o mouse em cima

O estilo vega usa `hover:bg-primary/80` no botão principal e no badge que é link. Isso clareia o fundo e faz o texto branco cair abaixo de 4,5:1. O tema traz uma regra para `[data-slot=button]` e `a[data-slot=badge]` com `bg-primary`. Os dois atributos existem no código da spartan 1.8 (`hlm-button.ts`, `hlm-badge.ts`).

```css
@media (hover: hover) {
  :is([data-slot='button'], a[data-slot='badge']).bg-primary:hover {
    background-color: color-mix(in oklab, var(--primary) 85%, var(--foreground));
  }
}
```

- O fundo vai na direção da cor do texto da página: escurece no claro e clareia no escuro, então o contraste só aumenta.
- A regra fica fora de camada e tem especificidade maior que o utilitário.
- O código dos componentes da spartan não muda.

### 4. Contorno de foco

- A maioria dos componentes da spartan (botão, campo, select, checkbox, switch, radio, toggle, accordion) desenha o foco com uma **borda cheia** na cor `--ring`, mais um halo a 50%. A borda passa 3:1.
- Os links e os menus de navegação usam o `outline` base. O padrão da spartan é `outline-ring/50`, que fica em cerca de 2:1. O tema usa `outline-ring` com a cor cheia.
- Os itens de menu (dropdown, context menu) mostram o foco pela troca de fundo, como em toda a spartan. Não mudam.

### 5. Conferência de contraste

- Um script do nuvy-ui calcula 69 combinações por modo. Elas saem das classes do estilo vega em `style-vega.css` do `@spartan-ng/cli` 1.8.0, que foi lido.
- Entram texto sobre fundo, sobre cartão, sobre `muted` e sobre o fundo translúcido dos campos e badges de status; botão em repouso e com o mouse em cima; bordas de campo; foco; gráficos.
- O script compõe as transparências como o navegador.
- Na proposta, as 138 combinações (escuro e claro) passam.
- O script roda no CI do nuvy-ui e falha se alguma cair abaixo do mínimo.
- **A conferência final é no piloto**, sobre os componentes reais renderizados: axe e Lighthouse nas telas, mais um teste do botão com o mouse em cima, que lê a cor calculada. Se algum valor real divergir da lista, ajusta-se a lista e o token no nuvy-ui antes do segundo projeto.

### 6. Fonte

- Inter variável, pelo pacote npm `@fontsource-variable/inter` (5.3.0). Ela é importada no CSS de cada app e servida pelo próprio app; nada vem do Google Fonts.
- `--font-sans: 'Inter Variable', 'Inter', ui-sans-serif, system-ui, sans-serif`.
- A fonte mono é a do sistema.

### 7. Modo escuro

- **Escuro por padrão em tudo.**
- **Apps Angular**:
  - A classe `.dark` vai no `<html>`, que é o que a spartan espera.
  - Um botão no cabeçalho troca entre Escuro e Claro. A escolha fica no `localStorage` na chave `nuvy-tema` (`escuro` | `claro`). Sem escolha, fica escuro. Vários desses apps já têm um botão assim, que é substituído.
  - Um script pequeno em arquivo próprio (`nuvy-tema.js`, no `<head>`, sem `defer`) põe `.dark` antes da primeira pintura, para a tela não piscar. Fica em arquivo, e não inline, para não precisar de hash na CSP.
  - Um `TemaService` (signal) cuida do botão e só mexe no DOM no navegador (`isPlatformBrowser`), por causa do SSR do ProjetoDesaparecidos.
- **Páginas sem JavaScript**: o portal do site-factory (a CSP dele proíbe script) e o login do Keycloak. Ficam **sempre escuras**, com o `tokens-escuro.css`, que traz os valores do escuro direto no `:root`.
- A escolha é por app, porque o `localStorage` é separado por endereço. Quem escolher Claro num app continua vendo o login escuro. Isso é aceito.

### 8. Onde o tema mora: repositório `nuvy-ui`, copiado para cada projeto

Um repositório pequeno, **biduco07/nuvy-ui** (privado, como os outros), é a fonte de verdade. Cada projeto recebe uma **cópia** do arquivo gerado, com a versão no cabeçalho. Vantagens:

- o build de cada projeto não busca nada: sem token no CI nem na VM, e sem `git` dentro da imagem Docker;
- é o mesmo modelo da spartan, cujos componentes também são copiados;
- atualizar o tema é rodar o script de cópia e abrir um PR.

Estrutura:

```
tokens.mjs                    # fonte única: neutros, marca, gráficos, raio, fontes
scripts/gerar.mjs             # gera dist/ (npm run gerar)
scripts/verificar.mjs         # conferência de contraste (npm test; roda no CI)
scripts/copiar.mjs            # npm run copiar -- <pasta-do-projeto>: grava src/styles/nuvy-tema.css
dist/nuvytech/tema.css        # Tailwind v4 + spartan: variáveis, @theme dos extras, @layer base, regra do hover
dist/nuvytech/tokens.css      # só as variáveis (:root claro, .dark escuro)
dist/nuvytech/tokens-escuro.css  # só as variáveis do escuro, no :root (portal e Keycloak)
dist/tokens.json              # todos os valores (OKLCH e hex)
modelos/nuvy-tema.js          # script do modo escuro (sem dependências)
modelos/tema.service.ts       # serviço Angular do botão de tema
docs/como-usar.md             # passo a passo por tipo de projeto (abaixo)
previa/                       # a página de prévia
```

- `dist/` é versionado, para quem copia não precisar rodar nada.
- O protótipo de `tokens.mjs`, do gerador e da verificação já existe e gerou a prévia.
- A estrutura em `dist/nuvytech/` deixa espaço para outra marca no futuro, sem uso agora.
- Criar o repositório no GitHub depende do OK do Pedro. Até lá, o nuvy-ui fica só em `C:\Users\boduc\Desktop\projetos\claude\nuvy-ui`.

### 9. Como cada tipo de projeto usa o tema

**Angular com spartan** (CRMSystem, ProjetoDesaparecidos, iddle-app, gercliente, nuvydoc). O `src/styles.css`, nesta ordem:

```css
@layer theme, base, components, utilities;
@import 'tailwindcss/theme.css' layer(theme);
@import 'tailwindcss/preflight.css' layer(base);
@import 'tailwindcss/utilities.css' layer(utilities);
@import '@spartan-ng/brain/hlm-tailwind-preset.css';   /* já importa tw-animate-css e o overlay do CDK */
@import '@fontsource-variable/inter';
@import './styles/nuvy-tema.css';                       /* cópia de nuvy-ui/dist/nuvytech/tema.css */
```

- `components.json` com `"style": "vega"`.
- Ícones **Lucide** pelo `@ng-icons/lucide` (padrão da spartan), no lugar de PrimeIcons e Material Icons.
- Avisos rápidos pelo `sonner` da spartan.
- Animações: as do Angular ou a biblioteca Motion, com moderação. O Spell UI é só para React e não entra.
- Onde o projeto tiver lint de prefixo de seletor (`app-`) ou incluir só `src/**`, o desenho do projeto decide onde ficam os componentes helm e o ajuste do ESLint e do `@source` do Tailwind.

**Site da NuvyTech** (cliente `nuvytech` do gerador Astro do site-factory, que já usa Tailwind v4 e Inter). As cores do cliente passam a vir dos tokens do escuro, sem mudar os outros clientes. O jeito de encaixar isso no `ClientConfig` do gerador fica para o desenho do site-factory.

**Portal do site-factory** (Fastify, HTML gerado no servidor, sem JavaScript). A spartan não roda nele.

- Ele usa os valores do `tokens-escuro.css`, embutidos no CSS inline atual, e reestiliza os seletores de elemento com as medidas do estilo vega.
- A Inter no portal exige mudar a CSP e um teste que proíbe `@font-face`. Isso fica para o desenho do site-factory.

**Login (nuvy-auth/Keycloak).** Usa os valores finais gravados na pasta de notas compartilhada (`tema-nuvytech-tokens.md`, depois da aprovação) ou o `tokens-escuro.css`. Como a marca agora é única, os temas `gercliente` e `nuvydoc` do Keycloak passam a usar as cores NuvyTech.

### 10. Versão

- Semver no nuvy-ui.
- Mudança de cor ou de raio sobe a versão menor.
- A cópia em cada projeto mostra a versão no cabeçalho, e um projeto pode ficar numa versão antiga sem quebrar.

## Ordem das migrações (cada uma com desenho, plano, branch própria e PR em rascunho)

Os seis levantamentos estão em `side-session-notes/local_536462ad.../migracao-ui/inventario-*.md`. Quase todos os projetos têm PRs em rascunho, de 16 e 17/10, que mexem na mesma interface. A migração de cada um sai da ponta desses PRs, empilhada, ou da main depois do merge deles.

1. **Piloto: ProjetoDesaparecidos.** Já está em Angular 22 e Tailwind 4, é pequeno (porte M) e tem script de capturas com dados de mentira. O CRMSystem não serve de piloto, porque antes precisa subir do Angular 19 e sair do template Fuse e do Tailwind 3.
2. iddle-app, o site da NuvyTech e o portal do site-factory.
3. GerenciamentoCliente: combinar com o chat que trabalha na `fix/stripe-e-chave`.
4. CRMSystem, que tem pilha de PRs e precisa subir de versão.
5. nuvydoc, por último: em cima do PR #7, combinando antes.

**Regras:**
- nunca mexer em branch de outro chat;
- um comando pesado por vez no PC (npm install, ng build, ng test, Docker);
- nada de merge, push na main, deploy ou mudança em VM sem OK escrito do Pedro.

## O que fica para quem constrói

- Os nomes internos dos arquivos dentro de cada projeto, desde que a cópia do tema fique num lugar só (`src/styles/nuvy-tema.css`).
- O desenho do botão de tema. O esperado é um ícone de sol ou lua num `hlmBtn` ghost.
- Pequenos ajustes de tom que mantenham a matiz da marca e passem na conferência.

## Depende do Pedro

- Aprovar esta versão.
- Autorizar a criação do repositório privado `biduco07/nuvy-ui` no GitHub.
