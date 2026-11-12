// Copia o favicon padrão da NuvyTech para a pasta pública de um projeto (a que vira a raiz do site):
// npm run copiar-favicon -- <pasta-publica>   (ex.: ../nuvy-obras/web/public)
// Depois, cole no <head> o conteúdo de dist/nuvytech/favicon.html.
import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
export const ARQUIVOS_FAVICON = ['favicon.ico', 'favicon.svg', 'favicon-16x16.png', 'favicon-32x32.png', 'apple-touch-icon.png'];

export function copiarFavicon(pastaPublica) {
  const destino = resolve(pastaPublica);
  if (!existsSync(dirname(destino))) throw new Error(`${dirname(destino)} não existe.`);
  mkdirSync(destino, { recursive: true });
  for (const nome of ARQUIVOS_FAVICON) copyFileSync(join(RAIZ, 'dist', 'nuvytech', nome), join(destino, nome));
  return ARQUIVOS_FAVICON.map((nome) => join(destino, nome));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  const [pasta] = process.argv.slice(2);
  if (!pasta) {
    console.error('Uso: npm run copiar-favicon -- <pasta-publica-do-projeto>');
    process.exit(1);
  }
  try {
    for (const arquivo of copiarFavicon(pasta)) console.log(`copiado: ${arquivo}`);
    console.log('Cole no <head> o conteúdo de dist/nuvytech/favicon.html.');
  } catch (erro) {
    console.error(erro.message);
    process.exit(1);
  }
}
