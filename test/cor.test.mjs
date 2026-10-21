import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hexParaRgb, rgbParaHex, rgbParaOklch, oklchParaRgb, contraste, sobre } from '../scripts/cor.mjs';

test('branco contra preto tem contraste 21:1', () => {
  assert.equal(Number(contraste(hexParaRgb('#ffffff'), hexParaRgb('#000000')).toFixed(2)), 21);
});

test('o botão claro #0062cc tem 5,80:1 com branco', () => {
  assert.equal(Number(contraste(hexParaRgb('#0062cc'), hexParaRgb('#ffffff')).toFixed(2)), 5.8);
});

test('#007bff em OKLCH é aproximadamente (0,605 0,217 257,2)', () => {
  const [L, C, H] = rgbParaOklch(hexParaRgb('#007bff'));
  assert.equal(L.toFixed(3), '0.605');
  assert.equal(C.toFixed(3), '0.217');
  assert.equal(H.toFixed(1), '257.2');
});

test('OKLCH volta para o mesmo hex', () => {
  for (const hex of ['#0062cc', '#020618', '#f8fafc', '#b91c1c']) {
    assert.equal(rgbParaHex(oklchParaRgb(rgbParaOklch(hexParaRgb(hex)))), hex);
  }
});

test('cor fora do sRGB é trazida para dentro sem passar de 0 a 1', () => {
  const rgb = oklchParaRgb([0.7, 0.4, 150]);
  assert.ok(rgb.every((c) => c >= 0 && c <= 1));
});

test('sobre() mistura a cor com o fundo pela opacidade', () => {
  assert.equal(rgbParaHex(sobre(hexParaRgb('#000000'), 0.5, hexParaRgb('#ffffff'))), '#808080');
});
