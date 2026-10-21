import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const codigo = readFileSync(join(dirname(fileURLToPath(import.meta.url)), '..', 'modelos', 'nuvy-tema.js'), 'utf8');

function rodar(storage) {
  const classes = new Set();
  const html = { classList: { add: (c) => classes.add(c), remove: (c) => classes.delete(c) }, style: {} };
  vm.runInNewContext(codigo, { document: { documentElement: html }, localStorage: storage });
  return { escuro: classes.has('dark'), colorScheme: html.style.colorScheme };
}
const guardado = (valor) => ({ getItem: (k) => (k === 'nuvy-tema' ? valor : null) });

test('sem escolha guardada, abre no escuro', () => {
  assert.deepEqual(rodar(guardado(null)), { escuro: true, colorScheme: 'dark' });
});

test('com "claro" guardado, abre no claro', () => {
  assert.deepEqual(rodar(guardado('claro')), { escuro: false, colorScheme: 'light' });
});

test('valor desconhecido conta como escuro', () => {
  assert.equal(rodar(guardado('sistema')).escuro, true);
});

test('localStorage bloqueado não quebra e fica escuro', () => {
  const bloqueado = { getItem: () => { throw new Error('SecurityError'); } };
  assert.equal(rodar(bloqueado).escuro, true);
});
