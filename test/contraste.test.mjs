import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pares, resolver } from '../scripts/verificar.mjs';

for (const modo of ['escuro', 'claro']) {
  test(`todas as combinações do modo ${modo} passam no AA`, () => {
    const lista = pares(resolver('nuvytech', modo), modo);
    assert.ok(lista.length >= 69, `esperava pelo menos 69 combinações, veio ${lista.length}`);
    const falhas = lista.filter((p) => p.r < p.min).map((p) => `${p.nome}: ${p.r.toFixed(2)} < ${p.min}`);
    assert.deepEqual(falhas, []);
  });
}
