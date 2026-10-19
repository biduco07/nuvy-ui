// Copia o tema gerado para um projeto: npm run copiar -- <pasta-do-projeto> [destino]
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const DESTINO_PADRAO = 'src/styles/nuvy-tema.css';

const versaoDe = (texto) => /nuvy-ui (\d+\.\d+\.\d+)/.exec(texto)?.[1] ?? null;

export function copiar(pastaProjeto, opcoes = {}) {
  const projeto = resolve(pastaProjeto);
  if (!existsSync(join(projeto, 'package.json'))) {
    throw new Error(`${projeto} não parece um projeto: não tem package.json.`);
  }
  const tema = readFileSync(join(RAIZ, 'dist', 'nuvytech', 'tema.css'), 'utf8');
  const destino = join(projeto, opcoes.destino ?? DESTINO_PADRAO);
  const versaoAntiga = existsSync(destino) ? versaoDe(readFileSync(destino, 'utf8')) : null;
  mkdirSync(dirname(destino), { recursive: true });
  writeFileSync(destino, tema);
  return { destino, versaoAntiga, versaoNova: versaoDe(tema), avisos: avisosDoProjeto(projeto) };
}

// O setup padrão da spartan (ng g @spartan-ng/cli:init / ui-theme) grava no styles.css um :root e um
// :root.dark com as cores dela, que vêm depois do import do tema e passam por cima dele sem erro.
function avisosDoProjeto(projeto) {
  const estilos = join(projeto, 'src', 'styles.css');
  if (!existsSync(estilos)) return [];
  const texto = readFileSync(estilos, 'utf8');
  if (/--(background|primary|radius)\s*:/.test(texto)) {
    return [`${estilos} define cores ou raio próprios (ex.: o bloco que o "spartan-ng/cli:init" grava). Apague esse bloco: as cores vêm de nuvy-tema.css.`];
  }
  return [];
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  const [pasta, destino] = process.argv.slice(2);
  if (!pasta) {
    console.error('Uso: npm run copiar -- <pasta-do-projeto> [destino, padrão src/styles/nuvy-tema.css]');
    process.exit(1);
  }
  try {
    const r = copiar(pasta, { destino });
    const antes = r.versaoAntiga ? `estava na ${r.versaoAntiga}` : 'primeira cópia';
    console.log(`Tema ${r.versaoNova} copiado para ${r.destino} (${antes}).`);
    for (const aviso of r.avisos) console.warn(`Atenção: ${aviso}`);
  } catch (erro) {
    console.error(erro.message);
    process.exit(1);
  }
}
