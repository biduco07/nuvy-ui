import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';
import { gerarArquivos } from '../scripts/gerar.mjs';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const lerArq = (p) => readFileSync(join(raiz, p), 'utf8');
const css = () => lerArq('dist/nuvytech/layout.css');
// Sem comentários e sem textos entre aspas (ex.: content: '\2713').
const limpo = () => css().replace(/\/\*[\s\S]*?\*\//g, '').replace(/'[^']*'|"[^"]*"/g, "''");

test('dist/nuvytech/layout.css está em dia com layout/layout.css (rode "npm run gerar")', () => {
  assert.ok(existsSync(join(raiz, 'dist/nuvytech/layout.css')), 'falta dist/nuvytech/layout.css');
  assert.equal(css(), gerarArquivos().get('nuvytech/layout.css'));
});

test('layout.css tem o cabeçalho de versão igual ao dos outros arquivos', () => {
  const versao = /nuvy-ui (\d+\.\d+\.\d+)/.exec(lerArq('dist/nuvytech/tokens.css'))[1];
  assert.ok(css().startsWith(`/* nuvy-ui ${versao} — `));
  assert.match(css(), /Arquivo gerado: não edite aqui/);
});

test('layout.css não tem cor literal (#hex, rgb(, hsl(, oklch()); só var() e color-mix', () => {
  const c = limpo();
  assert.doesNotMatch(c, /#[0-9a-fA-F]{3,8}\b/);
  assert.doesNotMatch(c, /\b(rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\(/);
  assert.doesNotMatch(c, /:\s*(white|black|red|green|blue|gray|grey)\b/i);
});

test('todas as classes do layout usam o prefixo nv-', () => {
  const preludios = [...limpo().matchAll(/([^{};]+)\{/g)].map((m) => m[1]).filter((p) => !p.trim().startsWith('@'));
  const classes = preludios.flatMap((p) => [...p.matchAll(/\.([A-Za-z_][\w-]*)/g)].map((m) => m[1]));
  assert.ok(classes.length > 40, 'esperava dezenas de classes');
  const erradas = [...new Set(classes.filter((c) => !c.startsWith('nv-')))];
  assert.deepEqual(erradas, []);
});

test('tem estilo de :focus-visible e só usa variáveis que o tema define', () => {
  assert.match(css(), /:focus-visible\s*\{[^}]*box-shadow/);
  const tokens = lerArq('dist/nuvytech/tokens-escuro.css');
  const definidas = new Set([...tokens.matchAll(/--([\w-]+):/g)].map((m) => m[1]));
  const proprias = new Set([...limpo().matchAll(/--([\w-]+)\s*:/g)].map((m) => m[1]));
  const usadas = [...new Set([...limpo().matchAll(/var\(--([\w-]+)/g)].map((m) => m[1]))];
  const faltando = usadas.filter((v) => !definidas.has(v) && !proprias.has(v));
  assert.deepEqual(faltando, []);
});

for (const modelo of ['layout-exemplo.html', 'layout-lateral-exemplo.html']) test(`o modelo ${modelo} usa só classes que existem no layout`, () => {
  const html = lerArq(`modelos/${modelo}`);
  assert.match(html, /dist\/nuvytech\/tokens-escuro\.css/);
  assert.match(html, /dist\/nuvytech\/layout\.css/);
  const existentes = new Set([...limpo().matchAll(/\.(nv-[\w-]+)/g)].map((m) => m[1]));
  const usadas = new Set([...html.matchAll(/class="([^"]+)"/g)].flatMap((m) => m[1].split(/\s+/)));
  assert.deepEqual([...usadas].filter((c) => !existentes.has(c)), []);
});
