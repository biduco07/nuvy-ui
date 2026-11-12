// Gera os favicons em PNG e ICO a partir de logo/favicon.svg (o ícone oficial da NuvyTech).
// Só precisa rodar quando a arte mudar. Usa o sharp, que não é dependência do pacote: rode de dentro de
// um projeto que tenha o sharp (ex.: cd ../site-factory && node ../nuvy-ui/scripts/favicon.mjs).
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');

// ICO com as imagens em PNG dentro (aceito por todos os navegadores atuais e pelo Windows).
export function montarIco(pngs) {
  const cabecalho = Buffer.alloc(6);
  cabecalho.writeUInt16LE(0, 0);
  cabecalho.writeUInt16LE(1, 2);
  cabecalho.writeUInt16LE(pngs.length, 4);
  const entradas = [];
  let deslocamento = 6 + 16 * pngs.length;
  for (const { tamanho, dados } of pngs) {
    const e = Buffer.alloc(16);
    e.writeUInt8(tamanho >= 256 ? 0 : tamanho, 0);
    e.writeUInt8(tamanho >= 256 ? 0 : tamanho, 1);
    e.writeUInt8(0, 2);
    e.writeUInt8(0, 3);
    e.writeUInt16LE(1, 4);
    e.writeUInt16LE(32, 6);
    e.writeUInt32LE(dados.length, 8);
    e.writeUInt32LE(deslocamento, 12);
    deslocamento += dados.length;
    entradas.push(e);
  }
  return Buffer.concat([cabecalho, ...entradas, ...pngs.map((p) => p.dados)]);
}

async function gerar() {
  const sharp = createRequire(join(process.cwd(), 'x.js'))('sharp');
  const svg = readFileSync(join(RAIZ, 'logo', 'favicon.svg'));
  const png = (tamanho) => sharp(svg, { density: 384 }).resize(tamanho, tamanho).png().toBuffer();
  const [p16, p32, p48] = await Promise.all([png(16), png(32), png(48)]);
  writeFileSync(join(RAIZ, 'logo', 'favicon-16x16.png'), p16);
  writeFileSync(join(RAIZ, 'logo', 'favicon-32x32.png'), p32);
  writeFileSync(
    join(RAIZ, 'logo', 'favicon.ico'),
    montarIco([
      { tamanho: 16, dados: p16 },
      { tamanho: 32, dados: p32 },
      { tamanho: 48, dados: p48 },
    ]),
  );
  // O iPhone pinta de preto o que for transparente: o ícone de 180 px vai sobre fundo branco, com margem.
  const icone = await sharp(svg, { density: 384 }).resize(148, 148).png().toBuffer();
  const toque = await sharp({ create: { width: 180, height: 180, channels: 4, background: '#ffffff' } })
    .composite([{ input: icone, left: 16, top: 16 }])
    .png()
    .toBuffer();
  writeFileSync(join(RAIZ, 'logo', 'apple-touch-icon.png'), toque);
  console.log('logo/favicon.ico, favicon-16x16.png, favicon-32x32.png e apple-touch-icon.png gerados');
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  gerar().catch((erro) => {
    console.error(erro.message);
    process.exit(1);
  });
}
