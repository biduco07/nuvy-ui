// Monta a página de prévia do tema: npm run previa → previa/tema-nuvytech.html
import { readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { RAIZ, cssPrevia, jsonTokens, relatorio } from './gerar.mjs';

export function montarPrevia() {
  const modelo = readFileSync(join(RAIZ, 'previa', 'modelo.html'), 'utf8');
  const dados = { tokens: jsonTokens(), contraste: relatorio() };
  return modelo.replace('/*VARS*/', cssPrevia()).replace('/*DADOS*/', JSON.stringify(dados));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  const destino = join(RAIZ, 'previa', 'tema-nuvytech.html');
  writeFileSync(destino, montarPrevia());
  console.log('prévia em', destino);
}
