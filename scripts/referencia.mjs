// Monta a referência visual: npm run referencia → previa/referencia.html
// Tudo sai de tokens.mjs e do layout/layout.css reais; nada é copiado à mão.
import { readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { RAIZ, bloco, completo, jsonTokens, relatorio } from './gerar.mjs';
import { escalas, forma, marcas } from '../tokens.mjs';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const m = marcas.nuvytech;
const extra = { radius: forma.radius, 'font-sans': forma['font-sans'], 'font-mono': forma['font-mono'], marca: m.marca, 'marca-2': m['marca-2'] };

// Cada linha liga um item visual ao componente real. "spartan" é o componente helm dos apps Angular;
// "nv" é a classe do layout padrão (páginas sem spartan).
export const RELACAO = [
  ['Botão principal', 'nv-botao', 'hlmBtn (padrão)', 'Todos os apps; ação principal da tela'],
  ['Botão secundário', 'nv-botao--secundario', 'hlmBtn variant="outline"', 'Cancelar, Voltar, Sair'],
  ['Botão perigoso', 'nv-botao--perigo', 'hlmBtn variant="destructive"', 'Excluir, Cancelar assinatura'],
  ['Campo de texto', 'nv-entrada (+ nv-rotulo, nv-ajuda)', 'hlmInput + hlmLabel', 'Formulários do CRM, GerCliente, nuvydoc, login Keycloak'],
  ['Campo com erro', 'nv-entrada--invalida + nv-erro-campo', 'hlmInput com aria-invalid', 'Validação de CPF/CNPJ, e-mail, senha'],
  ['Selo de situação', 'nv-selo (--sucesso, --atencao, --perigo, --info)', 'hlmBadge', 'Nota emitida, cobrança paga/pendente, status do app'],
  ['Aviso', 'nv-aviso (--sucesso, --atencao, --erro)', 'hlmAlert (e toast da spartan)', 'Resultado de envio de nota, falhas de pagamento'],
  ['Cartão', 'nv-cartao (--destaque, --atencao)', 'hlmCard', 'Painéis, resumo de cliente'],
  ['Indicador', 'nv-indicador', 'hlmCard com número', 'Painel inicial (totais, pendências)'],
  ['Tabela', 'nv-tabela-caixa + nv-tabela', 'hlmTable', 'Listas de clientes, notas, cobranças'],
  ['Cabeçalho com marca', 'nv-cabecalho, nv-marca, nv-nav', 'sidebar/navbar da spartan', 'Portal do site-factory e telas de acesso'],
  ['Foco do teclado', ':focus-visible (--nv-foco)', 'outline-ring (tema.css)', 'Todos'],
];

const BOTOES = [
  ['Principal', 'nv-botao', 'Salvar'],
  ['Secundário', 'nv-botao nv-botao--secundario', 'Cancelar'],
  ['Perigoso', 'nv-botao nv-botao--perigo', 'Excluir'],
];
const ESTADOS_BOTAO = [
  ['Padrão', '', ''],
  ['Hover', 's-hover', ''],
  ['Foco', 's-foco', ''],
  ['Desabilitado', '', 'disabled'],
  ['Carregando', 's-carregando', 'aria-busy="true" aria-disabled="true"'],
];

function linhaBotoes() {
  return BOTOES.map(([nome, cls, rot]) => `<tr><th scope="row">${nome}</th>${ESTADOS_BOTAO.map(([, s, attr]) =>
    `<td><button type="button" class="${cls} ${s}" ${attr}>${rot}</button></td>`).join('')}</tr>`).join('');
}
const campo = (id, cls, extraHtml, attr = '') =>
  `<div class="nv-campo"><label class="nv-rotulo" for="${id}">E-mail</label><input id="${id}" class="nv-entrada ${cls}" value="maria@exemplo.com" ${attr}>${extraHtml}</div>`;
function linhaCampos(modo) {
  return [
    ['Padrão', campo(`c-p-${modo}`, '', '<p class="nv-ajuda">Usado só para avisos da conta.</p>')],
    ['Hover', campo(`c-h-${modo}`, 's-hover', '')],
    ['Foco', campo(`c-f-${modo}`, 's-foco', '')],
    ['Desabilitado', campo(`c-d-${modo}`, '', '', 'disabled')],
    ['Erro', campo(`c-e-${modo}`, 'nv-entrada--invalida', '<p class="nv-erro-campo" role="alert">Esse e-mail não parece certo.</p>', 'aria-invalid="true"')],
    ['Carregando', campo(`c-l-${modo}`, 's-carregando-campo', '<p class="nv-ajuda">Verificando…</p>', 'aria-busy="true" readonly')],
  ].map(([n, h]) => `<div class="estado"><span class="rot">${n}</span>${h}</div>`).join('');
}

function painel(modo, tokens) {
  const t = tokens[modo];
  const cores = Object.entries(t).map(([k, v]) =>
    `<div class="amostra"><span class="cor" style="background:var(--${k})"></span><code>${k}</code><small>${esc(v.hex)}</small></div>`).join('');
  return `
  <section class="nv-pagina tema-${modo} bloco-modo" aria-label="Modo ${modo}">
    <h2>${modo === 'escuro' ? 'Modo escuro (padrão)' : 'Modo claro'}</h2>
    <h3>Cores</h3>
    <div class="amostras">${cores}</div>
    <h3>Botões e estados</h3>
    <div class="nv-tabela-caixa"><table class="nv-tabela"><thead><tr><th></th>${ESTADOS_BOTAO.map(([n]) => `<th>${n}</th>`).join('')}</tr></thead><tbody>${linhaBotoes()}</tbody></table></div>
    <h3>Campo e estados</h3>
    <div class="estados">${linhaCampos(modo)}</div>
    <h3>Selos e avisos</h3>
    <p><span class="nv-selo">Rascunho</span> <span class="nv-selo nv-selo--sucesso">Paga</span> <span class="nv-selo nv-selo--atencao">Pendente</span> <span class="nv-selo nv-selo--perigo">Recusada</span> <span class="nv-selo nv-selo--info">Em análise</span> <span class="nv-selo nv-selo--destaque">Novo</span></p>
    <div class="nv-aviso">Aviso informativo: a prefeitura costuma responder em minutos.</div>
    <div class="nv-aviso nv-aviso--sucesso">Nota enviada com sucesso.</div>
    <div class="nv-aviso nv-aviso--atencao">Cobrança vence amanhã.</div>
    <div class="nv-aviso nv-aviso--erro">A prefeitura recusou a nota.</div>
    <h3>Cartão e indicadores</h3>
    <div class="nv-grade">
      <div class="nv-cartao"><h3>Cartão</h3><p class="nv-texto-suave">Fundo <code>--card</code>, borda <code>--border</code>, canto de 14&nbsp;px.</p></div>
      <div class="nv-cartao nv-cartao--destaque"><h3>Em destaque</h3><p class="nv-texto-suave">Linha na cor da marca.</p></div>
      <div class="nv-cartao nv-cartao--atencao"><h3>Atenção</h3><p class="nv-texto-suave">Precisa de ação.</p></div>
    </div>
    <div class="nv-indicadores"><div class="nv-indicador"><span class="nv-indicador__valor nv-num">128</span><span class="nv-indicador__nome">Clientes ativos</span></div><div class="nv-indicador nv-indicador--atencao"><span class="nv-indicador__valor nv-num">7</span><span class="nv-indicador__nome">Notas pendentes</span></div></div>
  </section>`;
}

function contraste(rel) {
  return ['escuro', 'claro'].map((modo) => {
    const ps = rel[`nuvytech-${modo}`];
    const ruins = ps.filter((p) => p.r < p.min).length;
    const linhas = [...ps].sort((a, b) => a.r / a.min - b.r / b.min).map((p) =>
      `<tr><td>${esc(p.nome)}</td><td><span class="chip" style="background:${p.fundo};color:${p.fg}">Aa</span> ${p.fg} em ${p.fundo}</td><td class="nv-num">${p.r.toFixed(2)}</td><td class="nv-num">${p.min}</td><td>${p.r >= p.min ? 'passa' : 'FALHA'}</td></tr>`).join('');
    return `<details><summary>Contraste no modo ${modo}: ${ps.length} combinações, ${ruins} abaixo do mínimo (mais justas primeiro)</summary>
    <div class="nv-tabela-caixa"><table class="nv-tabela"><thead><tr><th>Combinação</th><th>Cores</th><th>Razão</th><th>Mínimo</th><th></th></tr></thead><tbody>${linhas}</tbody></table></div></details>`;
  }).join('');
}

export function montarReferencia() {
  const layout = readFileSync(join(RAIZ, 'layout', 'layout.css'), 'utf8');
  const tokens = jsonTokens().marcas.nuvytech;
  const rel = relatorio();
  const vars = bloco('.tema-escuro', completo('nuvytech', 'escuro'), { ...extra, 'color-scheme': 'dark' }) +
    bloco('.tema-claro', completo('nuvytech', 'claro'), { ...extra, 'color-scheme': 'light' });
  const espaco = Object.entries(escalas.espacamento).map(([k, v]) => `<div class="amostra"><span class="barra-esp" style="width:${v}"></span><code>espaço-${k}</code><small>${v}</small></div>`).join('');
  const raios = Object.entries(escalas.raios).map(([k, v]) => `<div class="amostra"><span class="raio" style="border-radius:${v}"></span><code>raio-${k}</code><small>${v}</small></div>`).join('');
  const texto = Object.entries(escalas.texto).map(([k, t]) => `<div class="linha-texto"><code>${k}</code><span style="font-size:${t.size};font-weight:${t.weight};line-height:${t.line}">Emissão de nota fiscal 0123</span><small>${t.size} / peso ${t.weight} / entrelinha ${t.line}</small></div>`).join('');
  const relacao = RELACAO.map((r) => `<tr><td>${r[0]}</td><td><code>${esc(r[1])}</code></td><td><code>${esc(r[2])}</code></td><td>${esc(r[3])}</td></tr>`).join('');
  return `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Referência visual NuvyTech</title>
<style>
${vars}
${layout}
/* Só da página de referência */
body{margin:0;background:#020618;color:#f8fafc;font:16px/1.6 ${forma['font-sans']}}
.topo{max-width:1120px;margin:0 auto;padding:28px 20px 0}.topo h1{font-size:30px;margin:0 0 6px}.topo p{color:#aebfd8;margin:4px 0}
.corpo{max-width:1120px;margin:0 auto;padding:0 20px 48px}
.bloco-modo{padding:24px;border-radius:14px;margin:24px 0;border:1px solid var(--border)}
.tema-escuro.bloco-modo{background:var(--background)}.tema-claro.bloco-modo{background:var(--background)}
.fixo{color:#f8fafc}.fixo h2{margin-top:36px}.fixo code,.nv-pagina code{font-family:${forma['font-mono']};font-size:.9em}
.amostras{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px}
.amostra{display:grid;gap:2px;font-size:13px}.amostra small{color:var(--muted-foreground,#aebfd8)}
.cor{height:34px;border-radius:8px;border:1px solid var(--border)}
.barra-esp{display:block;height:14px;background:var(--marca,#007bff);border-radius:2px}.raio{display:block;width:48px;height:48px;background:#007bff}
.estados{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:14px}.estado .rot{display:block;font-size:12.5px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--muted-foreground);margin-bottom:6px}
.linha-texto{display:grid;grid-template-columns:110px 1fr;gap:4px 16px;align-items:baseline;padding:8px 0;border-bottom:1px solid #1d293d}.linha-texto small{grid-column:2;color:#aebfd8}
.chip{display:inline-block;padding:0 8px;border-radius:6px;font-weight:700}
details{margin:12px 0}summary{cursor:pointer;font-weight:600}
.fixo .nv-tabela-caixa{background:#0f172b;border-radius:10px}.fixo .nv-tabela td,.fixo .nv-tabela th{color:#f8fafc;border-color:#1d293d}
/* Estados forçados: repetem o que :hover e :focus-visible fazem no layout.css, para aparecerem lado a lado. */
.nv-pagina .nv-botao.s-hover{background:var(--nv-primario-hover);border-color:var(--nv-primario-hover)}
.nv-pagina .nv-botao--secundario.s-hover{background:var(--accent);border-color:var(--primary)}
.nv-pagina .nv-botao--perigo.s-hover{background:var(--destructive);border-color:var(--destructive);filter:brightness(1.08)}
.nv-pagina .nv-botao.s-foco{box-shadow:var(--nv-foco);border-radius:4px}
.nv-pagina .nv-entrada.s-hover{border-color:var(--muted-foreground)}
.nv-pagina .nv-entrada.s-foco{border-color:var(--ring);box-shadow:var(--nv-foco)}
/* PROPOSTA: o layout.css ainda não tem estado "carregando". Aqui: botão sem clique e com um giro. */
.nv-pagina .nv-botao.s-carregando{opacity:.7;cursor:progress}
.nv-pagina .nv-botao.s-carregando::before{content:"";width:14px;height:14px;border:2px solid currentColor;border-right-color:transparent;border-radius:50%;animation:giro .8s linear infinite}
.nv-pagina .nv-entrada.s-carregando-campo{opacity:.7;cursor:progress}
@keyframes giro{to{transform:rotate(360deg)}}
@media (prefers-reduced-motion:reduce){.nv-pagina .nv-botao.s-carregando::before{animation:none}}
</style></head><body>
<header class="topo"><h1>Referência visual NuvyTech</h1>
<p>Gerada de <code>tokens.mjs</code> e <code>layout/layout.css</code> (nuvy-ui 1.4.0). Tudo abaixo é o CSS real do repositório; só os estados hover e foco são forçados para aparecerem lado a lado.</p></header>
<main class="corpo">
${painel('escuro', tokens)}
${painel('claro', tokens)}
<div class="fixo">
<h2>Contraste (WCAG AA)</h2>
<p>Texto: 4,5:1 ou mais. Bordas de campo, foco e gráficos: 3:1 ou mais.</p>
${contraste(rel)}
<h2>Tipografia (Inter)</h2>${texto}
<h2>Espaçamento</h2><div class="amostras" style="grid-template-columns:repeat(auto-fill,minmax(200px,1fr))">${espaco}</div>
<h2>Raios</h2><div class="amostras">${raios}</div>
<h2>Item visual e componente real</h2>
<div class="nv-pagina tema-escuro" style="background:none"><div class="nv-tabela-caixa"><table class="nv-tabela"><thead><tr><th>Item</th><th>Layout padrão (nv-)</th><th>Componente spartan/ui</th><th>Onde aparece</th></tr></thead><tbody>${relacao}</tbody></table></div></div>
</div></main></body></html>`;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  const destino = join(RAIZ, 'previa', 'referencia.html');
  writeFileSync(destino, montarReferencia());
  console.log('referência em', destino);
}
