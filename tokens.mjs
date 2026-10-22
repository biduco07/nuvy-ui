// Fonte única do tema NuvyTech. Cores em OKLCH [L, C, H] (ou hex, convertido na geração).
// Neutros: base "slate" da spartan/shadcn, com ajustes para contraste AA.

export const comum = {
  claro: {
    background: [1, 0, 0],
    foreground: [0.129, 0.042, 264.695],
    card: [1, 0, 0],
    'card-foreground': [0.129, 0.042, 264.695],
    popover: [1, 0, 0],
    'popover-foreground': [0.129, 0.042, 264.695],
    secondary: [0.968, 0.007, 247.896],
    'secondary-foreground': [0.208, 0.042, 265.755],
    muted: [0.968, 0.007, 247.896],
    'muted-foreground': [0.48, 0.042, 257.417],
    destructive: [0.505, 0.19, 27.5],
    'destructive-foreground': [0.985, 0.002, 247.839],
    border: [0.929, 0.013, 255.508],
    input: [0.64, 0.035, 256.8],
    sidebar: [0.984, 0.003, 247.858],
    'sidebar-foreground': [0.129, 0.042, 264.695],
    'sidebar-border': [0.929, 0.013, 255.508],
    success: [0.48, 0.12, 150],
    'success-foreground': [0.985, 0.002, 247.839],
    warning: [0.5, 0.12, 60],
    'warning-foreground': [0.985, 0.002, 247.839],
    info: [0.47, 0.11, 230],
    'info-foreground': [0.985, 0.002, 247.839],
  },
  escuro: {
    background: [0.129, 0.042, 264.695],
    foreground: [0.984, 0.003, 247.858],
    card: [0.208, 0.042, 265.755],
    'card-foreground': [0.984, 0.003, 247.858],
    popover: [0.208, 0.042, 265.755],
    'popover-foreground': [0.984, 0.003, 247.858],
    secondary: [0.279, 0.041, 260.031],
    'secondary-foreground': [0.984, 0.003, 247.858],
    muted: [0.279, 0.041, 260.031],
    'muted-foreground': [0.8, 0.04, 256.788],
    destructive: [0.79, 0.13, 22],
    'destructive-foreground': [0.2, 0.06, 20],
    border: 'oklch(1 0 0 / 10%)',
    input: [0.6, 0.04, 257],
    sidebar: [0.208, 0.042, 265.755],
    'sidebar-foreground': [0.984, 0.003, 247.858],
    'sidebar-border': 'oklch(1 0 0 / 10%)',
    success: [0.79, 0.16, 152],
    'success-foreground': [0.2, 0.05, 155],
    warning: [0.84, 0.15, 80],
    'warning-foreground': [0.25, 0.06, 60],
    info: [0.78, 0.12, 230],
    'info-foreground': [0.22, 0.05, 235],
  },
};

// Marca única (decisão do Pedro em 18/10/2026: todos os apps com a marca NuvyTech).
// Cor de cada marca. "marca" é a cor exata do logo/app (decoração, gráficos, destaques grandes);
// "primary" é a do botão e dos links, com contraste AA para o texto.
export const marcas = {
  nuvytech: {
    nome: 'NuvyTech',
    marca: '#007bff',
    'marca-2': '#00d2ff',
    claro: {
      primary: '#0062cc',
      'primary-foreground': [0.985, 0.002, 247.839],
      accent: [0.962, 0.022, 257],
      'accent-foreground': [0.4, 0.15, 257],
      ring: '#007bff',
      'chart-1': '#007bff',
    },
    escuro: {
      primary: [0.7, 0.15, 252],
      'primary-foreground': [0.2, 0.06, 262],
      accent: [0.3, 0.06, 257],
      'accent-foreground': [0.93, 0.03, 257],
      ring: [0.66, 0.17, 255],
      'chart-1': [0.66, 0.17, 255],
    },
  },
};

// Demais cores de gráfico (iguais em todas as marcas), com 3:1 contra o fundo.
export const graficos = {
  claro: { 'chart-2': [0.56, 0.11, 195], 'chart-3': [0.62, 0.15, 60], 'chart-4': [0.55, 0.2, 300], 'chart-5': [0.58, 0.2, 15] },
  escuro: { 'chart-2': [0.75, 0.12, 195], 'chart-3': [0.8, 0.15, 75], 'chart-4': [0.72, 0.16, 300], 'chart-5': [0.72, 0.17, 15] },
};

export const forma = {
  radius: '0.625rem', // com o estilo "vega" (cantos padrão): botões e campos com 8px, cartões com 14px
  'font-sans': "'Inter Variable', 'Inter', ui-sans-serif, system-ui, sans-serif",
  'font-mono': "ui-monospace, 'SFMono-Regular', Menlo, Consolas, 'Liberation Mono', monospace",
};

// Escalas que o layout padrão (layout/layout.css) e a spartan já usam, para documentação e para o Penpot.
// Não geram CSS: o CSS continua sendo a fonte do que vale na tela.
export const escalas = {
  espacamento: { 1: '4px', 2: '8px', 3: '12px', 4: '16px', 5: '20px', 6: '24px', 8: '32px' },
  raios: { controle: '8px', cartao: '14px', pilula: '999px' }, // controle = radius × 0,8; cartão = radius × 1,4
  tamanhos: { controle: '44px', 'controle-pequeno': '36px', 'controle-grande': '50px', conteudo: '1120px' },
  texto: {
    titulo: { size: '30px', weight: '700', line: '1.2' },
    subtitulo: { size: '20px', weight: '700', line: '1.3' },
    secao: { size: '16px', weight: '650', line: '1.4' },
    corpo: { size: '16px', weight: '400', line: '1.6' },
    suave: { size: '14.5px', weight: '400', line: '1.55' },
    rotulo: { size: '14.5px', weight: '600', line: '1.4' },
    ajuda: { size: '13.5px', weight: '400', line: '1.5' },
    selo: { size: '12.5px', weight: '600', line: '1.6' },
  },
};
