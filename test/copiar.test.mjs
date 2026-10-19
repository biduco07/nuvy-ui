import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, readFileSync, existsSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { copiar } from '../scripts/copiar.mjs';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const tema = readFileSync(join(raiz, 'dist/nuvytech/tema.css'), 'utf8');
const projeto = () => {
  const pasta = mkdtempSync(join(tmpdir(), 'nuvy-ui-'));
  writeFileSync(join(pasta, 'package.json'), '{}');
  return pasta;
};

test('copia o tema para src/styles/nuvy-tema.css de um projeto novo', () => {
  const pasta = projeto();
  const r = copiar(pasta);
  assert.equal(r.destino, join(pasta, 'src', 'styles', 'nuvy-tema.css'));
  assert.equal(readFileSync(r.destino, 'utf8'), tema);
  assert.equal(r.versaoAntiga, null);
  assert.equal(r.versaoNova, '1.0.0');
});

test('ao copiar por cima, informa a versão que estava lá', () => {
  const pasta = projeto();
  mkdirSync(join(pasta, 'src', 'styles'), { recursive: true });
  writeFileSync(join(pasta, 'src', 'styles', 'nuvy-tema.css'), '/* nuvy-ui 0.9.0 — tema antigo */\n');
  const r = copiar(pasta);
  assert.equal(r.versaoAntiga, '0.9.0');
  assert.equal(readFileSync(r.destino, 'utf8'), tema);
});

test('aceita outro destino dentro do projeto', () => {
  const pasta = projeto();
  const r = copiar(pasta, { destino: 'src/app/tema.css' });
  assert.equal(r.destino, join(pasta, 'src', 'app', 'tema.css'));
  assert.ok(existsSync(r.destino));
});

test('recusa pasta que não é projeto e não cria nada nela', () => {
  const pasta = mkdtempSync(join(tmpdir(), 'nuvy-ui-'));
  assert.throws(() => copiar(pasta), /package\.json/);
  assert.equal(existsSync(join(pasta, 'src')), false);
});
