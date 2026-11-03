import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ICONES, spriteIcones } from '../layout/icones.mjs';
import { montarReferencia } from '../scripts/referencia.mjs';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const lerArq = (p) => readFileSync(join(raiz, p), 'utf8');
const css = lerArq('layout/layout.css').replace(/\/\*[\s\S]*?\*\//g, '');
const bloco = (seletor) => {
  const i = css.indexOf(`\n${seletor} {`);
  return i < 0 ? '' : css.slice(i, css.indexOf('}', i));
};

test('o conjunto de ícones cobre as ações pedidas, inline e sem fonte externa', () => {
  for (const n of ['abrir', 'editar', 'excluir', 'cancelar', 'baixar', 'enviar', 'reenviar', 'copiar', 'estornar', 'aprovar', 'recusar', 'mais']) {
    assert.ok(ICONES[n], `falta o ícone ${n}`);
  }
  const sprite = spriteIcones();
  assert.equal(sprite, lerArq('dist/nuvytech/icones.svg'), 'rode "npm run gerar"');
  assert.doesNotMatch(sprite, /https?:\/\/(?!www\.w3\.org)|<image|@font-face|<style/);
  assert.doesNotMatch(sprite, /#[0-9a-fA-F]{3,8}\b|rgb\(|hsl\(|oklch\(/, 'ícone com cor fixa não troca com o tema');
  for (const n of Object.keys(ICONES)) assert.ok(sprite.includes(`id="nv-i-${n}"`));
});

for (const [nome, html] of [['modelos/layout-exemplo.html', lerArq('modelos/layout-exemplo.html')], ['a referência visual', montarReferencia()]]) {
  test(`${nome}: todo botão de ícone tem nome acessível, ícone escondido do leitor e símbolo existente`, () => {
    const botoes = [...html.matchAll(/<(a|button|summary)\b([^>]*\bnv-botao--icone\b[^>]*)>([\s\S]*?)<\/\1>/g)];
    assert.ok(botoes.length >= 5, 'esperava botões de ícone no exemplo');
    const simbolos = new Set([...html.matchAll(/<symbol id="([^"]+)"/g)].map((m) => m[1]));
    for (const [, tag, attrs, miolo] of botoes) {
      assert.match(attrs, /aria-label="[^"]{3,}"/, `${tag} sem aria-label`);
      assert.doesNotMatch(attrs, /tabindex="-1"/, 'botão de ícone tem de ser alcançável pelo teclado');
      if (tag === 'button') assert.match(attrs, /type="(button|submit)"/);
      if (tag === 'a') assert.match(attrs, /href=/);
      assert.match(miolo, /<svg class="nv-icone" aria-hidden="true" focusable="false">/);
      assert.doesNotMatch(miolo.replace(/<svg[\s\S]*<\/svg>/, ''), /\S/, 'sem texto visível dentro do botão');
      const ref = /<use href="#([^"]+)"/.exec(miolo)?.[1];
      assert.ok(simbolos.has(ref), `símbolo ${ref} não está no sprite`);
    }
  });
}

test('a tabela de exemplo termina com a coluna "Ações" alinhada à direita', () => {
  const html = lerArq('modelos/layout-exemplo.html');
  assert.match(html, /<th class="nv-acoes-col">Ações<\/th><\/tr>/);
  assert.match(bloco('.nv-tabela .nv-acoes-col'), /text-align:\s*right/);
  assert.match(bloco('.nv-tabela .nv-acoes-col'), /white-space:\s*nowrap/);
  assert.match(bloco('.nv-acoes-tabela'), /display:\s*inline-flex/);
});

test('botão de ícone tem 44 px, sem mudar a altura única', () => {
  assert.match(bloco('.nv-botao--icone'), /width:\s*var\(--nv-controle\)/);
  assert.doesNotMatch(bloco('.nv-botao--icone'), /(^|[^-])height:|min-height/);
  assert.doesNotMatch(bloco('.nv-botao--icone::after'), /(^|[^-])height:|min-height/);
  assert.match(bloco('.nv-botao'), /min-height:\s*var\(--nv-controle\)/);
});

test('a dica usa o mesmo texto do aria-label, abre com mouse e com foco e não depende de JavaScript', () => {
  assert.match(bloco('.nv-botao--icone::after'), /content:\s*attr\(aria-label\)/);
  assert.match(css, /\.nv-botao--icone:hover::after,\s*\.nv-botao--icone:focus-visible::after\s*\{[^}]*visibility:\s*visible/);
});

test('a dica abre à esquerda do ícone (a coluna é a última) para não ser cortada pela caixa com rolagem', () => {
  const b = bloco('.nv-botao--icone::after');
  assert.match(b, /position:\s*absolute/);
  assert.match(b, /right:\s*calc\(100%/);
  assert.doesNotMatch(b, /(^|\s)left:/);
  assert.match(b, /max-width:\s*\d+px/);
});

test('sem mouse ou abaixo de 768 px a descrição fica visível ao lado do ícone', () => {
  const i = css.indexOf('@media (max-width: 767px), (hover: none) {');
  assert.ok(i >= 0, 'falta a media query de celular/toque');
  const trecho = css.slice(i, css.indexOf('\n}\n', css.indexOf('::after', i)) + 3);
  assert.match(trecho, /\.nv-botao--icone::after\s*\{[^}]*position:\s*static[^}]*opacity:\s*1[^}]*visibility:\s*visible/);
  assert.match(trecho, /\.nv-botao--icone\s*\{[^}]*width:\s*auto/);
});

test('variante de perigo e estado desabilitado do botão de ícone existem', () => {
  assert.match(css, /\.nv-botao\.nv-botao--icone\.nv-botao--perigo\s*\{[^}]*color:\s*var\(--destructive\)/);
  assert.match(css, /\.nv-botao--icone:disabled:hover/);
});

test('o foco do teclado continua com o anel cheio no botão de ícone', () => {
  assert.match(css, /\.nv-pagina \.nv-botao:focus-visible[^{]*\{[^}]*box-shadow:\s*var\(--nv-foco\)/);
  assert.doesNotMatch(bloco('.nv-pagina .nv-botao.nv-botao--icone'), /outline/);
});
