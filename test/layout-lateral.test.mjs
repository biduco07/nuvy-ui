import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { resolver, pares } from '../scripts/verificar.mjs';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const lerArq = (p) => readFileSync(join(raiz, p), 'utf8');
const css = () => lerArq('dist/nuvytech/layout.css').replace(/\/\*[\s\S]*?\*\//g, '');
const existentes = () => new Set([...css().matchAll(/\.(nv-[\w-]+)/g)].map((m) => m[1]));

test('o cabeçalho no topo continua no layout (a coluna lateral é variante)', () => {
  for (const c of ['nv-cabecalho', 'nv-cabecalho__interno', 'nv-nav', 'nv-nav__link', 'nv-conta', 'nv-marca']) {
    assert.ok(existentes().has(c), `sumiu .${c}`);
  }
  assert.ok(existentes().has('nv-pagina--lateral'));
});

test('as regras da coluna lateral só agem com nv-pagina--lateral, nv-lateral* ou nv-app', () => {
  const trecho = css().slice(css().indexOf('.nv-pagina--lateral {'));
  const preludios = [...trecho.matchAll(/([^{};]+)\{/g)].map((m) => m[1].trim()).filter((p) => !p.startsWith('@'));
  const soltas = preludios.flatMap((p) => p.split(',')).map((s) => s.trim())
    .filter((s) => !/nv-pagina--lateral|nv-lateral|nv-app|nv-barra-topo/.test(s));
  assert.deepEqual(soltas, []);
});

test('a gaveta do celular só esconde a coluna quando o JavaScript marcou nv-js (sem JS ela fica visível)', () => {
  const c = css();
  const blocos = [...c.matchAll(/([^{};]+)\{[^}]*translateX\(-100%\)[^}]*\}/g)].map((m) => m[1]);
  assert.ok(blocos.length > 0);
  for (const b of blocos) assert.match(b, /\.nv-js\b/);
  assert.match(c, /\.nv-js \.nv-barra-topo/);
});

test('usa só tokens com contraste conferido: sidebar, accent, muted e primary', () => {
  for (const modo of ['claro', 'escuro']) {
    const lista = pares(resolver('nuvytech', modo), modo);
    for (const nome of [
      'sidebar-foreground / sidebar',
      'muted-foreground / sidebar',
      'accent-foreground / accent (menu lateral)',
    ]) {
      const p = lista.find((x) => x.nome === nome);
      assert.ok(p, `falta o par "${nome}" no verificar`);
      assert.ok(p.r >= p.min, `${nome} no ${modo}: ${p.r.toFixed(2)} < ${p.min}`);
    }
  }
});

test('previa/layout-lateral.html usa só classes que existem no layout e carrega os arquivos certos', () => {
  const html = lerArq('previa/layout-lateral.html');
  assert.match(html, /dist\/nuvytech\/tokens\.css/);
  assert.match(html, /dist\/nuvytech\/layout\.css/);
  assert.match(html, /modelos\/nuvy-lateral\.js/);
  const usadas = new Set([...html.matchAll(/(?<![\w-])nv-[a-z0-9_-]+/g)].map((m) => m[0]).filter((c) => !c.endsWith('.js')));
  const faltando = [...usadas].filter((c) => !existentes().has(c) && !lerArq('modelos/nuvy-lateral.js').includes(`data-${c}`) && !html.includes(`data-${c}`));
  assert.deepEqual(faltando, []);
  assert.match(html, /aria-current="page"/);
  assert.match(html, /aria-label="Recolher o menu"/);
});

// DOM mínimo para rodar o nuvy-lateral.js sem navegador.
function montar(guardado) {
  const noEl = (extra = {}) => {
    const el = { attrs: {}, ouvintes: {},
      setAttribute(k, v) { this.attrs[k] = String(v); }, getAttribute(k) { return this.attrs[k] ?? null; },
      removeAttribute(k) { delete this.attrs[k]; }, hasAttribute(k) { return k in this.attrs; },
      addEventListener(t, f) { (this.ouvintes[t] ||= []).push(f); }, focus() { this.focado = true; },
      querySelector() { return null; }, offsetParent: {}, ...extra };
    return el;
  };
  const pagina = noEl();
  const recolher = noEl(); const abrir = noEl(); const fechar = noEl();
  const texto = noEl({ textContent: ' Leads ' });
  const link = noEl({ querySelector: (s) => (s === '.nv-lateral__texto' ? texto : null) });
  const lateral = noEl({ querySelector: () => fechar });
  const classes = new Set();
  const doc = {
    documentElement: { classList: { add: (c) => classes.add(c) } },
    querySelector: (s) => (s === '.nv-pagina--lateral' ? pagina : s === '[data-nv-abrir]' ? abrir : null),
    querySelectorAll: (s) => ({ '[data-nv-recolher]': [recolher], '[data-nv-abrir]': [abrir], '[data-nv-fechar]': [fechar], '.nv-lateral__link': [link] }[s] || []),
    getElementById: () => lateral,
    ouvintes: {}, addEventListener(t, f) { this.ouvintes[t] = f; },
  };
  const store = { 'nuvy-lateral': guardado };
  const localStorage = { getItem: (k) => store[k] ?? null, setItem: (k, v) => { store[k] = v; } };
  const janela = { matchMedia: () => ({ matches: false, addEventListener() {} }) };
  vm.runInNewContext(lerArq('modelos/nuvy-lateral.js'), { document: doc, localStorage, window: janela });
  return { pagina, recolher, abrir, fechar, link, classes, store, doc };
}

test('nuvy-lateral.js: marca nv-js, lê a escolha guardada e guarda ao recolher', () => {
  const a = montar(null);
  assert.ok(a.classes.has('nv-js'));
  assert.equal(a.pagina.hasAttribute('data-lateral'), false);
  a.recolher.ouvintes.click[0]();
  assert.equal(a.pagina.getAttribute('data-lateral'), 'recolhida');
  assert.equal(a.store['nuvy-lateral'], 'recolhida');
  assert.equal(a.recolher.getAttribute('aria-expanded'), 'false');
  assert.equal(a.link.getAttribute('title'), 'Leads');
  a.recolher.ouvintes.click[0]();
  assert.equal(a.pagina.hasAttribute('data-lateral'), false);
  assert.equal(a.link.getAttribute('title'), null);

  const b = montar('recolhida');
  assert.equal(b.pagina.getAttribute('data-lateral'), 'recolhida');
});

test('nuvy-lateral.js: gaveta abre com foco no botão fechar e fecha com Esc devolvendo o foco', () => {
  const a = montar(null);
  a.abrir.ouvintes.click[0]();
  assert.ok(a.pagina.hasAttribute('data-lateral-aberta'));
  assert.equal(a.abrir.getAttribute('aria-expanded'), 'true');
  assert.equal(a.fechar.focado, true);
  a.abrir.focado = false;
  a.doc.ouvintes.keydown({ key: 'Escape' });
  assert.equal(a.pagina.hasAttribute('data-lateral-aberta'), false);
  assert.equal(a.abrir.focado, true);
});

test('nuvy-lateral.js: sem localStorage não quebra', () => {
  const codigo = lerArq('modelos/nuvy-lateral.js');
  const el = { setAttribute() {}, removeAttribute() {}, hasAttribute: () => false, addEventListener() {}, querySelector: () => null };
  const doc = { documentElement: { classList: { add() {} } }, querySelector: () => el, querySelectorAll: () => [], getElementById: () => el, addEventListener() {} };
  const bloqueado = { getItem() { throw new Error('bloqueado'); }, setItem() { throw new Error('bloqueado'); } };
  assert.doesNotThrow(() => vm.runInNewContext(codigo, { document: doc, localStorage: bloqueado, window: { matchMedia: () => ({ matches: false }) } }));
});
