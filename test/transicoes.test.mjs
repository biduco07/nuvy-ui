import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const lerArq = (p) => readFileSync(join(raiz, p), 'utf8');
const css = lerArq('layout/layout.css').replace(/\/\*[\s\S]*?\*\//g, '');
const bloco = (seletor) => {
  const i = css.indexOf(`\n${seletor} {`);
  return i < 0 ? '' : css.slice(i, css.indexOf('}', i));
};
const ini = css.indexOf('@media (prefers-reduced-motion: reduce)');
const reduzido = css.slice(ini, css.indexOf('.nv-pagina--lateral {'));

test('o esqueleto anima só transform e o movimento reduzido o deixa parado', () => {
  assert.match(bloco('.nv-esqueleto::after'), /animation:\s*nv-brilho/);
  assert.match(css, /@keyframes nv-brilho\s*\{\s*to\s*\{\s*transform:/);
  assert.match(reduzido, /\.nv-esqueleto::after\s*\{[^}]*animation:\s*none/);
});

test('modal, aviso e menu suspenso usam só opacity e transform, entre 150 e 250 ms', () => {
  const trechos = [
    bloco('.nv-modal'),
    bloco('.nv-avisos .nv-aviso'),
    bloco('.nv-menu-suspenso[open] > .nv-menu-suspenso__lista'),
    css.slice(css.indexOf('@keyframes nv-aviso-entra'), css.indexOf('/* Menu suspenso')),
    css.slice(css.indexOf('@keyframes nv-menu-abre'), css.indexOf('@keyframes nv-fade')),
  ].join('\n');
  assert.doesNotMatch(trechos, /transition(-property)?:[^;]*\b(width|height|top|left|right|bottom|margin|padding|background|box-shadow)\b/);
  assert.doesNotMatch(trechos, /@keyframes[^}]*\b(width|height|top|left|margin|padding)\s*:/);
  const rootCss = css.slice(0, css.indexOf('.nv-pagina *'));
  const ms = Object.fromEntries([...rootCss.matchAll(/--nv-mov(-rapido)?:\s*(\d+)ms/g)].map((m) => [m[1] ? 'rapido' : 'normal', Number(m[2])]));
  for (const v of Object.values(ms)) assert.ok(v >= 150 && v <= 250, `duração ${v}ms fora de 150-250`);
});

test('movimento reduzido: sem deslocar nem escalar, só fade curto', () => {
  assert.match(reduzido, /\.nv-modal\[open\]\s*\{[^}]*transform:\s*none/);
  assert.match(reduzido, /animation-name:\s*nv-fade/);
  assert.doesNotMatch(reduzido, /translate|scale/);
});

test('o exemplo traz o esqueleto com aria-busy e aria-hidden, e o modal rotulado', () => {
  const html = lerArq('modelos/layout-exemplo.html');
  assert.match(html, /<div aria-busy="true"[^>]*>/);
  const pecas = [...html.matchAll(/<span class="nv-esqueleto[^"]*"([^>]*)>/g)];
  assert.ok(pecas.length >= 2);
  for (const [, attrs] of pecas) assert.match(attrs, /aria-hidden="true"/);
  assert.match(html, /<dialog class="nv-modal"[^>]*aria-labelledby="m-titulo"/);
  assert.match(html, /<details class="nv-menu-suspenso">/);
});
