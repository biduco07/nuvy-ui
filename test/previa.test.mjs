import { test } from 'node:test';
import assert from 'node:assert/strict';
import { montarPrevia } from '../scripts/previa.mjs';
import { jsonTokens } from '../scripts/gerar.mjs';

test('a prévia leva o título e as cores do botão dos dois modos', () => {
  const html = montarPrevia();
  const t = jsonTokens().marcas.nuvytech;
  assert.match(html, /<title>Tema NuvyTech<\/title>/);
  assert.ok(html.includes(t.escuro.primary.hex), 'falta o primary do escuro');
  assert.ok(html.includes(t.claro.primary.hex), 'falta o primary do claro');
  assert.doesNotMatch(html, /\/\*VARS\*\/|\/\*DADOS\*\//, 'sobrou marcador sem substituir');
});
