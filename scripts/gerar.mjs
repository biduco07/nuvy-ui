// Gera os arquivos do tema a partir de tokens.mjs.
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { rgbParaHex, rgbParaOklch } from './cor.mjs';
import { comum, marcas, graficos, forma } from '../tokens.mjs';
import { rgb, resolver, pares, HOVER } from './verificar.mjs';

const VERSAO = '1.1.0';
export const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const r3 = (n) => Number(n.toFixed(3));
export function css(v) {
  if (typeof v === 'string' && !v.startsWith('#')) return v; // já é CSS (ex.: com alfa)
  const [L, C, H] = rgbParaOklch(rgb(v));
  return C < 0.0005 ? `oklch(${r3(L)} 0 0)` : `oklch(${r3(L)} ${r3(C)} ${Number(H.toFixed(2))})`;
}
const hex = (v) => (rgb(v) ? rgbParaHex(rgb(v)) : v);
const ORDEM = [
  'background', 'foreground', 'card', 'card-foreground', 'popover', 'popover-foreground',
  'primary', 'primary-foreground', 'secondary', 'secondary-foreground', 'muted', 'muted-foreground',
  'accent', 'accent-foreground', 'destructive', 'destructive-foreground', 'border', 'input', 'ring',
  'chart-1', 'chart-2', 'chart-3', 'chart-4', 'chart-5',
  'sidebar', 'sidebar-foreground', 'sidebar-primary', 'sidebar-primary-foreground', 'sidebar-accent',
  'sidebar-accent-foreground', 'sidebar-border', 'sidebar-ring',
  'success', 'success-foreground', 'warning', 'warning-foreground', 'info', 'info-foreground',
];
export function completo(marca, modo) {
  const t = resolver(marca, modo);
  return {
    ...t,
    'sidebar-primary': t.primary,
    'sidebar-primary-foreground': t['primary-foreground'],
    'sidebar-accent': t.accent,
    'sidebar-accent-foreground': t['accent-foreground'],
    'sidebar-ring': t.ring,
  };
}
function bloco(seletor, t, extra = {}) {
  // color-scheme é propriedade de verdade (liga o escuro dos controles nativos); o resto vira variável.
  const linhas = Object.entries(extra).map(([k, v]) => (k === 'color-scheme' ? `  color-scheme: ${v};` : `  --${k}: ${v};`));
  for (const k of ORDEM) {
    const v = t[k];
    const h = hex(v);
    linhas.push(`  --${k}: ${css(v)};${typeof v === 'string' && !v.startsWith('#') ? '' : ` /* ${h} */`}`);
  }
  return `${seletor} {\n${linhas.join('\n')}\n}\n`;
}
const cabecalho = (marca) =>
  `/* nuvy-ui ${VERSAO} — tema NuvyTech, marca "${marca}". Arquivo gerado: não edite aqui.\n` +
  `   Para mudar, edite tokens.mjs no nuvy-ui, rode "npm run gerar" e copie de novo. */\n\n`;

const HOVER_CSS = `/* Botão primário (e badge que é link) com o mouse em cima: a spartan clareia o fundo
   (hover:bg-primary/80), o que derruba o contraste do texto. Aqui ele vai na direção da cor do
   texto da página: escurece no claro, clareia no escuro, e o contraste só aumenta. */
@media (hover: hover) {
  :is([data-slot='button'], a[data-slot='badge']).bg-primary:hover {
    background-color: color-mix(in oklab, var(--primary) ${HOVER * 100}%, var(--foreground));
  }
}
`;
const TAILWIND = `@theme inline {
  --color-destructive-foreground: var(--destructive-foreground);
  --color-success: var(--success);
  --color-success-foreground: var(--success-foreground);
  --color-warning: var(--warning);
  --color-warning-foreground: var(--warning-foreground);
  --color-info: var(--info);
  --color-info-foreground: var(--info-foreground);
  --color-marca: var(--marca);
  --color-marca-2: var(--marca-2);
}

@layer base {
  * {
    @apply border-border outline-ring; /* contorno de foco com a cor cheia (3:1); a spartan usa /50 */
  }
  html {
    color-scheme: light;
  }
  html.dark {
    color-scheme: dark;
  }
  body {
    @apply bg-background text-foreground font-sans antialiased;
  }
  /* O preflight do Tailwind v4 deixa a seta nos botões; volta a mão. */
  button:not(:disabled),
  [role='button']:not([aria-disabled='true']) {
    cursor: pointer;
  }
  /* A spartan só estiliza o botão desabilitado por data-disabled. Botões que usam aria-disabled
     (para não perder o foco do teclado) ficam com a mesma aparência; o clique é barrado no handler. */
  [data-slot='button'][aria-disabled='true'] {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
`;

function forMarca(marca) {
  const m = marcas[marca];
  const extra = {
    radius: forma.radius,
    'font-sans': forma['font-sans'],
    'font-mono': forma['font-mono'],
    marca: m.marca,
    'marca-2': m['marca-2'],
    'gradiente-marca': `linear-gradient(90deg, ${m.marca}, ${m['marca-2']})`,
  };
  const tokens = bloco(':root', completo(marca, 'claro'), extra) + '\n' + bloco('.dark', completo(marca, 'escuro'));
  // Para páginas sem JavaScript (portal do site-factory, login do Keycloak): sempre escuro.
  const escuro = bloco(':root', completo(marca, 'escuro'), { ...extra, 'color-scheme': 'dark' });
  return { tokens, escuro, tema: tokens + '\n' + TAILWIND + '\n' + HOVER_CSS };
}

export function jsonTokens() {
  const out = { versao: VERSAO, forma, marcas: {} };
  for (const marca of Object.keys(marcas)) {
    out.marcas[marca] = { nome: marcas[marca].nome, marca: marcas[marca].marca, 'marca-2': marcas[marca]['marca-2'] };
    for (const modo of ['claro', 'escuro']) {
      const t = completo(marca, modo);
      out.marcas[marca][modo] = Object.fromEntries(ORDEM.map((k) => [k, { css: css(t[k]), hex: hex(t[k]) }]));
    }
  }
  return out;
}

export function relatorio() {
  const out = {};
  for (const marca of Object.keys(marcas)) for (const modo of ['claro', 'escuro']) {
    const ps = pares(resolver(marca, modo), modo);
    out[`${marca}-${modo}`] = ps.map((p) => ({ nome: p.nome, r: Number(p.r.toFixed(2)), min: p.min, fg: rgbParaHex(p.fg), fundo: rgbParaHex(p.fundo) }));
  }
  return out;
}

// CSS da prévia: escuro por padrão; claro só quando [data-theme="light"] estiver no <html>.
export function cssPrevia() {
  const m = marcas.nuvytech;
  const extra = { marca: m.marca, 'marca-2': m['marca-2'], 'gradiente-marca': `linear-gradient(90deg, ${m.marca}, ${m['marca-2']})`, radius: forma.radius };
  return bloco(':root', completo('nuvytech', 'escuro'), { ...extra, 'color-scheme': 'dark' }) +
    bloco(':root[data-theme="light"]', completo('nuvytech', 'claro'), { 'color-scheme': 'light' });
}

// Todos os arquivos de dist/: caminho relativo -> conteúdo.
export function gerarArquivos() {
  const arquivos = new Map();
  for (const marca of Object.keys(marcas)) {
    const { tokens, escuro, tema } = forMarca(marca);
    arquivos.set(`${marca}/tokens.css`, cabecalho(marca) + tokens);
    arquivos.set(`${marca}/tokens-escuro.css`, cabecalho(marca) + escuro);
    arquivos.set(`${marca}/tema.css`, cabecalho(marca) + tema);
  }
  arquivos.set('tokens.json', JSON.stringify(jsonTokens(), null, 2) + '\n');
  return arquivos;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  for (const [caminho, conteudo] of gerarArquivos()) {
    const destino = join(RAIZ, 'dist', caminho);
    mkdirSync(dirname(destino), { recursive: true });
    writeFileSync(destino, conteudo);
  }
  console.log('dist/ gerado');
}
