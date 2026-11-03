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

test('botão e campo têm a mesma altura e nenhuma variante de botão muda essa altura', () => {
  assert.match(bloco('.nv-botao'), /min-height:\s*var\(--nv-controle\)/);
  assert.match(bloco('.nv-entrada,\n.nv-selecao,\n.nv-area-texto'), /min-height:\s*var\(--nv-controle\)/);
  for (const sel of ['.nv-botao--pequeno', '.nv-botao--grande']) assert.doesNotMatch(bloco(sel), /height/, `${sel} muda a altura`);
  assert.doesNotMatch(css, /--nv-controle-(pequeno|grande)/);
});

test('grupo de ações usa o degrau de vão, e dois botões dividem a linha no celular sem forçar quebra', () => {
  assert.match(bloco('.nv-acoes'), /gap:\s*var\(--nv-esp-3\)/);
  assert.match(css, /\.nv-acoes > :first-child:nth-last-child\(2\),[\s\S]*?flex: 1 1 auto/);
  assert.doesNotMatch(css, /flex: 1 1 100%/);
});

test('summary usado como botão não mostra o marcador', () => {
  assert.match(css, /summary\.nv-botao::-webkit-details-marker\s*\{\s*display: none/);
});

test('o anel de foco vale nas variantes do botão (secundário zera box-shadow)', () => {
  assert.match(css, /\.nv-pagina \.nv-botao:focus-visible[\s\S]*?\{[^}]*box-shadow:\s*var\(--nv-foco\)/);
});
