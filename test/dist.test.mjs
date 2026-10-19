import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';
import { gerarArquivos } from '../scripts/gerar.mjs';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const ler = (p) => readFileSync(join(raiz, 'dist', p), 'utf8');

test('dist/ está em dia com tokens.mjs (rode "npm run gerar")', () => {
  for (const [caminho, conteudo] of gerarArquivos()) {
    assert.ok(existsSync(join(raiz, 'dist', caminho)), `falta dist/${caminho}`);
    assert.equal(ler(caminho), conteudo, `dist/${caminho} está desatualizado`);
  }
});

test('tema.css traz a regra do hover, o contorno cheio e a versão', () => {
  const css = ler('nuvytech/tema.css');
  assert.match(css, /color-mix\(in oklab, var\(--primary\) 85%, var\(--foreground\)\)/);
  assert.match(css, /:is\(\[data-slot='button'\], a\[data-slot='badge'\]\)\.bg-primary:hover/);
  assert.match(css, /@apply border-border outline-ring;/);
  assert.match(css, /nuvy-ui 1\.0\.0/);
});

test('tokens-escuro.css é só escuro, direto no :root', () => {
  const css = ler('nuvytech/tokens-escuro.css');
  assert.match(css, /^\s*color-scheme: dark;/m);
  assert.doesNotMatch(css, /\.dark \{/);
});

test('tokens.json tem a versão 1.0.0 e os dois modos', () => {
  const json = JSON.parse(ler('tokens.json'));
  assert.equal(json.versao, '1.0.0');
  assert.ok(json.marcas.nuvytech.escuro.primary.hex);
  assert.ok(json.marcas.nuvytech.claro.primary.hex);
});
