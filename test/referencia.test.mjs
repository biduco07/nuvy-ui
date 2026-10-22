import { test } from 'node:test';
import assert from 'node:assert/strict';
import { montarReferencia, RELACAO } from '../scripts/referencia.mjs';
import { jsonPenpot, jsonTokens } from '../scripts/gerar.mjs';
import { readFileSync } from 'node:fs';

test('a referência traz os dois modos, os cinco estados e a relação com os componentes', () => {
  const html = montarReferencia();
  const t = jsonTokens().marcas.nuvytech;
  assert.match(html, /<title>Referência visual NuvyTech<\/title>/);
  assert.ok(html.includes(t.escuro.primary.hex) && html.includes(t.claro.primary.hex));
  for (const estado of ['Hover', 'Foco', 'Desabilitado', 'Erro', 'Carregando']) assert.ok(html.includes(estado), `falta o estado ${estado}`);
  assert.doesNotMatch(html, /undefined|\[object/);
  // todo seletor nv- citado na relação existe no layout.css
  const layout = readFileSync(new URL('../layout/layout.css', import.meta.url), 'utf8');
  for (const [, nv] of RELACAO) {
    const base = nv.startsWith('nv-') ? nv.match(/nv-[a-z-]+/)[0] : null;
    if (base) assert.ok(layout.includes(`.${base}`), `.${base} não existe no layout.css`);
  }
});

test('o arquivo do Penpot tem conjuntos, temas e só cores que o Penpot lê (sem oklch)', () => {
  const p = jsonPenpot();
  const t = jsonTokens().marcas.nuvytech;
  assert.deepEqual(p.$metadata.tokenSetOrder, ['Global', 'Cor/Claro', 'Cor/Escuro']);
  assert.equal(p['Cor/Claro'].primary.$value, t.claro.primary.hex);
  assert.equal(p['Cor/Escuro'].primary.$value, t.escuro.primary.hex);
  assert.equal(p.$themes.length, 2);
  const folhas = [];
  (function andar(o) { for (const v of Object.values(o)) typeof v === 'object' && v && ('$value' in v ? folhas.push(v) : andar(v)); })({ ...p, $themes: 0, $metadata: 0 });
  assert.ok(folhas.length > 100);
  for (const f of folhas) {
    assert.ok(['$value', '$type', '$description'].every((k) => k in f), 'token sem $value/$type/$description');
    assert.equal(typeof f.$value, 'string');
    assert.doesNotMatch(f.$value, /oklch/);
  }
});
