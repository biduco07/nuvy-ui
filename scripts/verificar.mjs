import { hexParaRgb, rgbParaHex, rgbParaOklch, oklchParaRgb, contraste, sobre } from './cor.mjs';
import { comum, marcas, graficos } from '../tokens.mjs';

// Resolve um valor de token em RGB (sem alfa) — tokens com alfa ficam de fora das contas.
export function rgb(v) {
  if (typeof v === 'string' && v.startsWith('#')) return hexParaRgb(v);
  if (Array.isArray(v)) return oklchParaRgb(v);
  return null;
}
// color-mix(in oklab, a p%, b)
export function misturaOklab(a, b, p) {
  const [L1, C1, H1] = rgbParaOklch(a), [L2, C2, H2] = rgbParaOklch(b);
  const ab = (L, C, H) => [L, C * Math.cos(H * Math.PI / 180), C * Math.sin(H * Math.PI / 180)];
  const [x1, y1, z1] = ab(L1, C1, H1), [x2, y2, z2] = ab(L2, C2, H2);
  const L = x1 * p + x2 * (1 - p), A = y1 * p + y2 * (1 - p), B = z1 * p + z2 * (1 - p);
  return oklchParaRgb([L, Math.hypot(A, B), (Math.atan2(B, A) * 180 / Math.PI + 360) % 360]);
}
export function resolver(marca, modo) {
  return { ...comum[modo], ...graficos[modo], ...marcas[marca][modo] };
}
export const HOVER = 0.85; // botão primário com o mouse: 85% da cor + 15% da cor do texto da página

export function pares(t, modo) {
  const c = (k) => rgb(t[k]);
  const bg = c('background'), card = c('card');
  const lista = [];
  const txt = (nome, fg, fundo) => lista.push({ nome, fg, fundo, min: 4.5 });
  const ui = (nome, fg, fundo) => lista.push({ nome, fg, fundo, min: 3 });
  for (const [n, f] of [['background', bg], ['card', card]]) {
    txt(`foreground / ${n}`, c('foreground'), f);
    txt(`muted-foreground / ${n}`, c('muted-foreground'), f);
    txt(`primary (link) / ${n}`, c('primary'), f);
    txt(`destructive (texto) / ${n}`, c('destructive'), f);
    for (const s of ['success', 'warning', 'info']) txt(`${s} (texto) / ${n}`, c(s), f);
    txt(`muted-foreground / input/30 sobre ${n} (placeholder)`, c('muted-foreground'), sobre(c('input'), 0.3, f));
    txt(`foreground / input/30 sobre ${n} (campo, outline)`, c('foreground'), sobre(c('input'), 0.3, f));
    txt(`foreground / input/50 sobre ${n} (outline com o mouse)`, c('foreground'), sobre(c('input'), 0.5, f));
    const tons = modo === 'claro' ? [0.1, 0.2] : [0.2, 0.3];
    for (const a of tons) {
      txt(`destructive / destructive/${a * 100} sobre ${n}`, c('destructive'), sobre(c('destructive'), a, f));
      for (const s of ['success', 'warning', 'info']) txt(`${s} / ${s}/${a * 100} sobre ${n}`, c(s), sobre(c(s), a, f));
    }
    ui(`input (borda) / ${n}`, c('input'), f);
    ui(`ring (foco) / ${n}`, c('ring'), f);
    ui(`primary (checkbox/switch) / ${n}`, c('primary'), f);
    for (let i = 1; i <= 5; i++) ui(`chart-${i} / ${n}`, c(`chart-${i}`), f);
  }
  txt('card-foreground / card', c('card-foreground'), card);
  txt('popover-foreground / popover', c('popover-foreground'), c('popover'));
  txt('primary-foreground / primary', c('primary-foreground'), c('primary'));
  txt('primary-foreground / primary hover (ajuste nuvy)', c('primary-foreground'), misturaOklab(c('primary'), c('foreground'), HOVER));
  txt('secondary-foreground / secondary', c('secondary-foreground'), c('secondary'));
  txt('secondary-foreground / secondary/80 sobre background', c('secondary-foreground'), sobre(c('secondary'), 0.8, bg));
  txt('accent-foreground / accent', c('accent-foreground'), c('accent'));
  txt('muted-foreground / muted (ghost hover)', c('muted-foreground'), c('muted'));
  // Só no escuro o vega usa dark:hover:bg-input/50 no select e dark:data-unchecked:bg-input/80 no switch;
  // no claro o switch desligado é o --input cheio (já conferido em "input (borda)").
  if (modo === 'escuro') for (const [n, f] of [['background', bg], ['card', card]]) {
    txt(`muted-foreground / input/50 sobre ${n} (placeholder do select com o mouse)`, c('muted-foreground'), sobre(c('input'), 0.5, f));
    ui(`input/80 (switch desligado) / ${n}`, sobre(c('input'), 0.8, f), f);
  }
  txt('muted-foreground / muted/50 sobre background', c('muted-foreground'), sobre(c('muted'), 0.5, bg));
  txt('foreground / muted (linha selecionada)', c('foreground'), c('muted'));
  txt('destructive-foreground / destructive', c('destructive-foreground'), c('destructive'));
  for (const s of ['success', 'warning', 'info']) txt(`${s}-foreground / ${s}`, c(`${s}-foreground`), c(s));
  txt('sidebar-foreground / sidebar', c('sidebar-foreground'), c('sidebar'));
  txt('accent-foreground / accent (menu lateral)', c('accent-foreground'), c('accent'));
  txt('muted-foreground / sidebar', c('muted-foreground'), c('sidebar'));
  return lista.map((p) => ({ ...p, r: contraste(p.fg, p.fundo) }));
}

if (process.argv[1] && process.argv[1].endsWith('verificar.mjs')) {
  let falhas = 0;
  for (const marca of Object.keys(marcas)) for (const modo of ['escuro', 'claro']) {
    const ps = pares(resolver(marca, modo), modo);
    const ruins = ps.filter((p) => p.r < p.min);
    const piores = [...ps].sort((a, b) => a.r / a.min - b.r / b.min).slice(0, 4);
    console.log(`\n${marca} ${modo}: ${ps.length} pares, ${ruins.length} abaixo do mínimo`);
    for (const p of ruins) console.log('  FALHA', p.r.toFixed(2), '<', p.min, p.nome, rgbParaHex(p.fg), 'em', rgbParaHex(p.fundo));
    for (const p of piores) console.log('  justo', p.r.toFixed(2), '/', p.min, p.nome);
    falhas += ruins.length;
  }
  console.log('\nfalhas:', falhas);
  process.exitCode = falhas ? 1 : 0;
}
