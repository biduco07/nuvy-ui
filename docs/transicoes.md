# Transições sutis (1.7.0)

CSS próprio do `layout.css`, só `opacity` e `transform`, 150-250 ms, sem biblioteca. Inspirado na ideia do transitions.dev, sem código copiado. Com `prefers-reduced-motion: reduce` o esqueleto fica parado e o resto vira um fade de 80 ms, sem deslocar nem escalar.

| Peça | Como usar |
|---|---|
| Esqueleto | `<div aria-busy="true">` com `<span class="nv-esqueleto nv-esqueleto--linha" aria-hidden="true">`. Variantes: `--titulo`, `--linha`, `--curto`, `--bloco`, `--circulo`. Ao carregar, troque pelo conteúdo e tire o `aria-busy`. |
| Modal | `<dialog class="nv-modal" aria-labelledby="...">` aberto com `showModal()`. Entra e sai com fade + leve subida. Navegador sem `@starting-style` só abre e fecha. |
| Aviso flutuante | `.nv-aviso` dentro de `<div class="nv-avisos" role="region" aria-label="Avisos">`. Para sair, ponha `data-saindo` e remova no `transitionend`. |
| Menu suspenso | `<details class="nv-menu-suspenso">` com `<summary>` e `<ul class="nv-menu-suspenso__lista">`. Abre com fade + leve descida. |

Ver funcionando: abra `modelos/layout-exemplo.html` (cartão "Transições"). Componentes spartan (diálogo, sonner, dropdown) seguem com a animação deles; estas classes são para as páginas sem spartan.
