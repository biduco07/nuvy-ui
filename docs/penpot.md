# Penpot para desenhar e revisar telas

Avaliação do Penpot gratuito (https://penpot.app) como apoio de design da NuvyTech. Nada foi criado ou hospedado: o arquivo de tokens está pronto e o passo a passo é para o Pedro.

## Recomendação

**Adotar em teste leve, na nuvem grátis, só como bancada de desenho e revisão.** A referência continua sendo o repositório (`tokens.mjs` e `layout.css`); o Penpot só consome os tokens. Não vale hospedar agora.

Critério para continuar: depois de uma tela real (por exemplo o painel do CRM), o import dos tokens funcionou e a revisão ficou mais rápida que a página `previa/referencia.html`. Se não, deixa de lado sem perda, porque nada depende dele.

## Plano, licença e limites (conferido em 22/10/2026)

| Ponto | O que vale | Fonte |
|---|---|---|
| Licença | código aberto, MPL 2.0 | [fórum do Penpot, preços](https://community.penpot.app/t/penpots-pricing-all-you-need-to-know/8131) |
| Nuvem grátis (Professional gratuito) | até 8 editores por equipe; visualizadores não contam | mesmo post |
| Acima de 8 editores | plano Unlimited, US$ 7 por editor por mês (teto de US$ 175) | mesmo post |
| Auto-hospedado | grátis, sem limite de usuários, equipes e arquivos; exige servidor Linux e Docker; suporte só da comunidade | [página de self-host](https://penpot.app/pricing/self-host) |
| Armazenamento e histórico da nuvem grátis | **não confirmado**: sites de terceiros citam 10 GB e 7 dias de versões; o oficial não diz | conferir ao criar a conta |

A NuvyTech tem poucos editores, então a nuvem grátis basta. Auto-hospedar só se o dado não puder sair do provedor ou se o limite de 8 editores apertar; custaria RAM no servidor, que hoje é escassa.

## Tokens: o Penpot lê?

Sim. O Penpot tem tokens de design nativos (aba **Tokens**) e importa JSON com `$value`, `$type` e `$description` ([guia do formato](https://penpot.app/blog/a-practical-guide-to-the-design-tokens-json-format/), [ajuda](https://help.penpot.app/user-guide/design-tokens/)). O que pesou:

- **Cores só em hex, rgb ou hsl; oklch não aparece na documentação.** O arquivo usa o hex já calculado em `dist/tokens.json`. A borda do escuro (branco a 10%) vai como `rgba(255, 255, 255, 0.1)`.
- A exportação do Penpot segue o formato do Tokens Studio, não o DTCG 2025.10 ([relato no fórum](https://community.penpot.app/t/token-export-is-tokens-studio-format-not-dtcg-2025-10/10544), análise de um usuário). Por isso os tipos usam os nomes do Tokens Studio (`color`, `spacing`, `borderRadius`, `sizing`, `fontFamilies`, `fontSizes`, `fontWeights`) e os valores vão como texto.
- Tamanho de fonte só em px por enquanto.
- A API de tokens para plugins ainda não existe; não há sincronização automática, só reimportar.

### O arquivo gerado

`dist/penpot/tokens.json`, gerado por `npm run gerar` a partir de `tokens.mjs` (o `npm test` falha se ele ficar desatualizado). Conteúdo:

- conjunto **Global**: marca (azul e ciano do logo), espaçamento, raio, tamanho, fontes e escala de texto (tamanho e peso);
- conjuntos **Cor/Claro** e **Cor/Escuro**: todos os tokens de cor de cada modo, com os nomes do CSS (`primary`, `muted-foreground`, `ring`, `chart-1`...);
- temas **Modo/Claro** e **Modo/Escuro**; o escuro vem ativo, como nos apps.

**Não foi testado dentro do Penpot** (criar conta está fora do que eu posso fazer). Risco principal: algum `$type` não ser aceito; veja "Se der erro".

## Passo a passo para o Pedro (uns 15 minutos)

1. Crie a conta grátis em https://penpot.app e uma equipe "NuvyTech". Não precisa de cartão.
2. Crie um arquivo "NuvyTech UI".
3. Aba **Tokens** (barra lateral esquerda) > **Tools** > **Import** e escolha `dist/penpot/tokens.json` deste repositório.
4. Confira: aparecem **Global**, **Cor/Claro** e **Cor/Escuro**; nos temas, **Escuro** e **Claro**. Troque entre eles e veja as cores mudarem.
5. Fonte: use **Inter** nos textos (está no catálogo do Penpot; se aparecer "Missing font", instale a Inter no computador).
6. Desenhe uma tela de teste (sugestão: o painel inicial do CRM) aplicando os tokens: `background` no quadro, `card` nos cartões, `primary` no botão, `raio/controle` nos cantos. Use `previa/referencia.html` (`npm run referencia`, abrir no navegador) como modelo de cada estado.
7. Compartilhe o link de visualização com quem revisa; os comentários ficam no próprio Penpot.
8. Anote: importou sem erro? As cores batem com a referência? Foi mais rápido?

### Se der erro

- Mensagem apontando um tipo: abra o JSON, apague `fonte` e `texto` do conjunto `Global` (os tipos de fonte são os menos documentados) e importe de novo. Cores, espaçamento e raio são o essencial.
- Mudou uma cor no repositório: `npm run gerar` e reimporte (o import **substitui** os tokens do arquivo).

## Revisão e handoff para o código

- **A fonte da verdade é o código.** Mudou um token? Edite `tokens.mjs`, gere e reimporte. Não exporte do Penpot para o repositório.
- **Nomes iguais:** o token do Penpot tem o mesmo nome da variável CSS (`primary` = `--primary`). O dev copia o nome, não o valor.
- **Componente:** cada peça desenhada aponta para a tabela "Item visual e componente real" de [referencia-visual.md](referencia-visual.md): botão = `hlmBtn` nos apps Angular ou `nv-botao` nas páginas sem spartan.
- **Estados:** desenhe os cinco (hover, foco, desabilitado, erro, carregando). O carregando ainda não existe no `layout.css`; a proposta está na referência.
- **Revisão:** antes do código, confira o desenho contra o contraste da referência; depois, compare a página real com o desenho.
