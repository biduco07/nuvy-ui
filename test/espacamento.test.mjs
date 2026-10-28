import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const css = readFileSync(join(raiz, 'layout/layout.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
const bloco = (seletor) => {
  const i = css.indexOf(`
${seletor} {`);
  return i < 0 ? '' : css.slice(i, css.indexOf('}', i));
};

test('botões, campos, selos e células usam degraus da escala (nada de px solto no padding)', () => {
  for (const sel of ['.nv-botao', '.nv-botao--pequeno', '.nv-botao--grande', '.nv-selo', '.nv-cartao']) {
    const b = bloco(sel);
    assert.match(b, /padding:/, `${sel} sem padding`);
    assert.doesNotMatch(b.match(/padding:[^;]*/)[0], /\d+px/, `${sel} tem padding em px solto`);
  }
});

test('botão e campo têm a mesma altura mínima e as variantes seguem os tamanhos do tema', () => {
  assert.match(bloco('.nv-botao'), /min-height:\s*var\(--nv-controle\)/);
  assert.match(bloco('.nv-botao--pequeno'), /min-height:\s*var\(--nv-controle-pequeno\)/);
  assert.match(bloco('.nv-botao--grande'), /min-height:\s*var\(--nv-controle-grande\)/);
});

test('o anel de foco vale nas variantes do botão (secundário zera box-shadow)', () => {
  assert.match(css, /\.nv-pagina \.nv-botao:focus-visible[\s\S]*?\{[^}]*box-shadow:\s*var\(--nv-foco\)/);
});
