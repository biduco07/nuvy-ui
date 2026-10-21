/* nuvy-ui — modo escuro antes da primeira pintura.
   Copie para public/nuvy-tema.js e carregue no <head>, antes do CSS e sem defer:
   <script src="nuvy-tema.js"></script>
   Escuro por padrão; só fica claro quando a pessoa escolheu "claro" (chave nuvy-tema). */
(function () {
  var claro = false;
  try {
    claro = localStorage.getItem('nuvy-tema') === 'claro';
  } catch (e) {
    /* localStorage bloqueado: fica no escuro */
  }
  var html = document.documentElement;
  if (claro) html.classList.remove('dark');
  else html.classList.add('dark');
  html.style.colorScheme = claro ? 'light' : 'dark';
})();
