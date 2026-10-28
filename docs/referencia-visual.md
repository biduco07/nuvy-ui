# Referência visual NuvyTech

Ponto único para quem desenha ou revisa uma tela. Não repete os valores: aponta para a fonte de cada um e traz o que faltava reunir (escalas, estados, relação com os componentes).

**Ver tudo junto:** `npm run referencia` monta `previa/referencia.html`, gerada de `tokens.mjs` e `layout/layout.css`. Mostra os dois modos lado a lado, com as cores, os botões e campos em cada estado, o contraste medido, as escalas e a tabela de componentes. Captura: [img/referencia-completa.png](img/referencia-completa.png) (celular: [img/referencia-celular.png](img/referencia-celular.png)).

## Onde mora cada coisa

| Assunto | Fonte (edite aqui) | Gerado / usado |
|---|---|---|
| Cores, claro e escuro | `tokens.mjs` (`comum`, `marcas`, `graficos`) | `dist/nuvytech/tokens*.css`, `tema.css`, `dist/tokens.json` |
| Contraste | `scripts/verificar.mjs` (`npm test`) | tabela completa na referência |
| Raio, fontes | `tokens.mjs` (`forma`) | `--radius`, `--font-sans`, `--font-mono` |
| Espaçamento, raios nomeados, tamanhos, escala de texto | `tokens.mjs` (`escalas`) | referência e arquivo do Penpot |
| Layout padrão `nv-` | `layout/layout.css` | `dist/nuvytech/layout.css`, `modelos/layout-exemplo.html` |
| Decisões e motivos | [spec do tema](superpowers/specs/2026-10-18-tema-nuvytech-design.md) | |
| Como usar em cada tipo de projeto | [como-usar.md](como-usar.md) | |
| Desenhar e revisar no Penpot | [penpot.md](penpot.md) | `dist/penpot/tokens.json` |

## Cores

Valores principais em [como-usar.md](como-usar.md) (seção "Uma marca só"); lista completa de todos os tokens nos dois modos na referência e em `dist/tokens.json` (OKLCH e hex).

- Escuro é o padrão. Claro só quando o app tem o botão de tema.
- `--marca` (#007bff) e `--marca-2` (#00d2ff) são do logo: decoração e destaques grandes, nunca texto pequeno. O botão e os links usam `--primary`, que tem contraste AA.
- Regra do contraste: texto 4,5:1; borda de campo, foco e gráficos 3:1. Hoje são 73 combinações no escuro e 69 no claro, todas acima do mínimo (a mais justa: success sobre success/20 no cartão, 4,59).
- `--border` é decorativo e não tem exigência de 3:1.

## Tipografia

Inter (pacote `@fontsource-variable/inter`, sem Google Fonts). Escala do layout `nv-`:

| Nome | Tamanho | Peso | Entrelinha | Uso |
|---|---|---|---|---|
| título | 30 px (23 no celular) | 700 | 1,2 | `h1` |
| subtítulo | 20 px (18) | 700 | 1,3 | `h2` |
| seção | 16 px | 650 | 1,4 | `h3` |
| corpo | 16 px | 400 | 1,6 | texto |
| suave | 14,5 px | 400 | 1,55 | `nv-texto-suave` |
| rótulo | 14,5 px | 600 | 1,4 | `nv-rotulo` |
| ajuda | 13,5 px | 400 | 1,5 | `nv-ajuda`, `nv-erro-campo` |
| selo | 12,5 px | 600 | 1,6 | `nv-selo` |

Números em tabelas usam `nv-num` (algarismos tabulares). Código usa `font-mono`.

## Espaçamento, raios e tamanhos

- **Espaçamento:** 4, 8, 12, 16, 20, 24, 32 px (`escalas.espacamento`), expostos no layout como `--nv-esp-1` a `--nv-esp-8`. Padding de botão, campo, selo, célula e cartão usam só esses degraus; alturas por `--nv-controle` (44), `--nv-controle-pequeno` (36) e `--nv-controle-grande` (50). O teste `espacamento.test.mjs` impede px solto nesses paddings.
- **Raios:** controle 8 px (`--radius` × 0,8), cartão e janela 14 px (× 1,4), selo em pílula, foco 4 px.
- **Tamanhos:** controle 44 px (pequeno 36, grande 50), conteúdo até 1120 px. Abaixo de 720 px a navegação quebra e as tabelas rolam na horizontal.

## Componentes e estados

| Estado | Como aparece | Onde está no código |
|---|---|---|
| Padrão | primário cheio; secundário com contorno; campo com `--input` a 30% | `.nv-botao`, `.nv-entrada` |
| Hover | primário vai 15% na direção do texto da página (escurece no claro, clareia no escuro; o contraste só sobe); secundário ganha fundo `--accent`; campo troca a borda para `--muted-foreground` | `:hover` do `layout.css`; nos apps spartan, regra do `tema.css` |
| Foco | anel de 2 px do fundo + 2 px de `--ring` (3:1), nunca removido | `:focus-visible` (`--nv-foco`) |
| Desabilitado | opacidade 55%, cursor `not-allowed`; `aria-disabled` tem a mesma aparência e mantém o foco do teclado | `.nv-botao:disabled`, `[aria-disabled]` |
| Erro | borda `--destructive` + mensagem em `nv-erro-campo` com `role="alert"`; o campo leva `aria-invalid` | `.nv-entrada--invalida` |
| Carregando | **não existe no `layout.css`**. A referência mostra uma proposta (giro de 14 px, `aria-busy`, sem clique, respeita `prefers-reduced-motion`) | só em `scripts/referencia.mjs` |

**Lacunas encontradas (para decidir, não corrigidas aqui):**
1. Estado carregando no `layout.css` (proposta pronta na referência; pede mudança de `dist/` e de versão).
2. Campo desabilitado e somente leitura não têm estilo próprio no `layout.css`; usam o do navegador.
3. Diálogo, menu suspenso e abas só existem nos apps Angular (spartan) e não estão no `layout.css`. A coluna lateral de navegação já existe como variante do layout.

## Layout padrão `nv-`

Variante com coluna lateral (marca, grupos, sub-itens, recolhível, gaveta no celular): [layout-lateral.md](layout-lateral.md), prévia em `previa/layout-lateral.html`.

Tabela completa de classes em [como-usar.md](como-usar.md) (seção "Layout padrão"); exemplo com todas as peças em `modelos/layout-exemplo.html`. Nos apps Angular a spartan segue os mesmos tokens e o `layout.css` não entra: serve de referência visual.

## Item visual e componente real

| Item | Layout padrão (`nv-`) | spartan/ui (apps Angular) | Onde aparece |
|---|---|---|---|
| Botão principal | `nv-botao` | `hlmBtn` | todos os apps |
| Botão secundário | `nv-botao--secundario` | `hlmBtn variant="outline"` | Cancelar, Voltar, Sair |
| Botão perigoso | `nv-botao--perigo` | `hlmBtn variant="destructive"` | Excluir |
| Campo | `nv-entrada`, `nv-rotulo`, `nv-ajuda` | `hlmInput`, `hlmLabel` | formulários, login |
| Campo com erro | `nv-entrada--invalida`, `nv-erro-campo` | `hlmInput` + `aria-invalid` | validações |
| Selo | `nv-selo--*` | `hlmBadge` | status de nota e cobrança |
| Aviso | `nv-aviso--*` | `hlmAlert`, toast | resultado de ações |
| Cartão, indicador | `nv-cartao`, `nv-indicador` | `hlmCard` | painéis |
| Tabela | `nv-tabela` | `hlmTable` | listas |
| Cabeçalho | `nv-cabecalho`, `nv-marca`, `nv-nav` | navbar/sidebar | portal do site-factory, login |
| Coluna lateral (variante) | `nv-pagina--lateral`, `nv-lateral`, `nv-lateral__link` | sidebar | proposta para o portal do site-factory |

Quem usa o quê, segundo o [como-usar.md](como-usar.md) e a spec:
- **Angular + spartan** (copiam `tema.css`): CRMSystem, ProjetoDesaparecidos, iddle-app, GerenciamentoCliente, nuvydoc.
- **Sem JavaScript** (`tokens-escuro.css` + `layout.css`): portal do site-factory e login do Keycloak.
- **Site da NuvyTech:** seção própria no como-usar.

Os nomes `hlm*` são os da spartan 1.8; confira no `libs/ui` de cada projeto antes de citar uma propriedade. Em 22/10/2026 nenhum checkout local dos projetos irmãos tinha a cópia do tema na branch atual, então a lista acima é a documentada, não uma varredura do código.

## Como mudar

1. Cor, raio, fonte ou escala: edite `tokens.mjs`. Layout: `layout/layout.css`.
2. `npm run gerar` (atualiza `dist/`, inclusive `dist/penpot/tokens.json`) e `npm test`.
3. `npm run referencia` para ver o resultado; reimporte `dist/penpot/tokens.json` no Penpot ([penpot.md](penpot.md)).
