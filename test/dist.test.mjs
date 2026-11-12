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
    const atual = Buffer.isBuffer(conteudo) ? readFileSync(join(raiz, 'dist', caminho)) : ler(caminho);
    assert.ok(Buffer.isBuffer(conteudo) ? atual.equals(conteudo) : atual === conteudo, `dist/${caminho} está desatualizado`);
  }
});

test('tema.css traz a regra do hover, o contorno cheio e a versão', () => {
  const css = ler('nuvytech/tema.css');
  assert.match(css, /color-mix\(in oklab, var\(--primary\) 85%, var\(--foreground\)\)/);
  assert.match(css, /:is\(\[data-slot='button'\], a\[data-slot='badge'\]\)\.bg-primary:hover/);
  assert.match(css, /@apply border-border outline-ring;/);
  assert.match(css, /nuvy-ui 1.8.0/);
});

test('tokens-escuro.css é só escuro, direto no :root', () => {
  const css = ler('nuvytech/tokens-escuro.css');
  assert.match(css, /^\s*color-scheme: dark;/m);
  assert.doesNotMatch(css, /\.dark \{/);
});

test('tokens.json tem a versão 1.8.0 e os dois modos', () => {
  const json = JSON.parse(ler('tokens.json'));
  assert.equal(json.versao, '1.8.0');
  assert.ok(json.marcas.nuvytech.escuro.primary.hex);
  assert.ok(json.marcas.nuvytech.claro.primary.hex);
});

test('tema.css põe cursor de mão nos botões e estiliza o aria-disabled', () => {
  const css = ler('nuvytech/tema.css');
  assert.match(css, /button:not\(:disabled\)[\s\S]*cursor: pointer/);
  assert.match(css, /\[data-slot='button'\]\[aria-disabled='true'\][\s\S]*opacity: 0\.5/);
});

test('favicon padrão: ICO com 16, 32 e 48 px, PNGs no tamanho certo e o trecho do <head>', () => {
  const ico = readFileSync(join(raiz, 'dist/nuvytech/favicon.ico'));
  assert.equal(ico.readUInt16LE(2), 1, 'tipo ícone');
  assert.deepEqual([0, 1, 2].map((i) => ico.readUInt8(6 + 16 * i)), [16, 32, 48]);
  const largura = (nome) => readFileSync(join(raiz, 'dist/nuvytech', nome)).readUInt32BE(16);
  assert.equal(largura('favicon-16x16.png'), 16);
  assert.equal(largura('favicon-32x32.png'), 32);
  assert.equal(largura('apple-touch-icon.png'), 180);
  const html = ler('nuvytech/favicon.html');
  for (const href of ['/favicon.ico', '/favicon.svg', '/favicon-32x32.png', '/favicon-16x16.png', '/apple-touch-icon.png']) {
    assert.ok(html.includes(`href="${href}"`), href);
  }
});
