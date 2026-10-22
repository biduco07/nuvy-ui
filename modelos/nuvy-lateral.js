/* nuvy-ui — coluna lateral do layout padrão (nv-pagina--lateral). Sem dependências.
   Carregue no fim do <body>: <script src="nuvy-lateral.js"></script>
   Põe a classe nv-js no <html>, recolhe/expande no desktop (escolha guardada na chave nuvy-lateral)
   e abre/fecha a gaveta no celular. Botões: [data-nv-recolher], [data-nv-abrir], [data-nv-fechar]. */
(function () {
  var html = document.documentElement;
  var pagina = document.querySelector('.nv-pagina--lateral');
  html.classList.add('nv-js');
  if (!pagina) return;
  var celular = window.matchMedia('(max-width: 720px)');
  var todos = function (sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); };
  var lateral = document.getElementById('nv-lateral');

  function lerGuardado() {
    try { return localStorage.getItem('nuvy-lateral') === 'recolhida'; } catch (e) { return false; }
  }
  function guardar(recolhida) {
    try { localStorage.setItem('nuvy-lateral', recolhida ? 'recolhida' : 'aberta'); } catch (e) { /* sem localStorage */ }
  }
  function recolher(recolhida) {
    if (recolhida) pagina.setAttribute('data-lateral', 'recolhida');
    else pagina.removeAttribute('data-lateral');
    todos('[data-nv-recolher]').forEach(function (b) {
      b.setAttribute('aria-expanded', recolhida ? 'false' : 'true');
      b.setAttribute('aria-label', recolhida ? 'Expandir o menu' : 'Recolher o menu');
    });
    // Recolhida, o texto some da tela: o nome vira dica ao passar o mouse.
    todos('.nv-lateral__link').forEach(function (a) {
      var t = a.querySelector('.nv-lateral__texto');
      if (recolhida && t) a.setAttribute('title', t.textContent.trim());
      else a.removeAttribute('title');
    });
  }
  function voltarAoBotao() {
    var abrir = document.querySelector('[data-nv-abrir]');
    if (abrir && abrir.offsetParent !== null) abrir.focus();
  }
  function gaveta(aberta) {
    if (aberta) pagina.setAttribute('data-lateral-aberta', '');
    else pagina.removeAttribute('data-lateral-aberta');
    todos('[data-nv-abrir]').forEach(function (b) { b.setAttribute('aria-expanded', aberta ? 'true' : 'false'); });
    if (aberta) {
      var alvo = lateral && lateral.querySelector('[data-nv-fechar]');
      if (alvo) alvo.focus();
    }
  }

  recolher(lerGuardado());
  todos('[data-nv-recolher]').forEach(function (b) {
    b.addEventListener('click', function () {
      var r = !pagina.hasAttribute('data-lateral');
      recolher(r);
      guardar(r);
    });
  });
  todos('[data-nv-abrir]').forEach(function (b) {
    b.addEventListener('click', function () { gaveta(true); });
  });
  todos('[data-nv-fechar]').forEach(function (b) {
    b.addEventListener('click', function () { gaveta(false); voltarAoBotao(); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && pagina.hasAttribute('data-lateral-aberta')) {
      gaveta(false);
      voltarAoBotao();
    }
  });
  // Ao passar para desktop, a gaveta não fica "aberta" por engano.
  var mudou = function () { if (!celular.matches) gaveta(false); };
  if (celular.addEventListener) celular.addEventListener('change', mudou);
})();
