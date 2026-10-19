// nuvy-ui — preparo dos testes (Vitest + jsdom) para apps com spartan/ui.
// Copie para src/test-setup.ts e ligue em angular.json → test.options.setupFiles e no tsconfig.spec.json.
// O jsdom não tem matchMedia; o toaster (sonner) da spartan chama window.matchMedia depois de renderizar.
if (typeof window !== 'undefined' && !window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string): MediaQueryList => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => undefined,
      removeListener: () => undefined,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      dispatchEvent: () => false,
    }),
  });
}
