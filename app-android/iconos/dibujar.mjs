// Dibuja los originales del icono y la pantalla de arranque (la constelación de img/icono.svg)
// y los guarda en ../assets/, de donde `npx @capacitor/assets generate --android` saca todos los tamaños.
// Uso: node iconos/dibujar.mjs  (necesita Chrome; ruta en CHROME o la de Windows por defecto)
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync, rmSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const aqui = dirname(fileURLToPath(import.meta.url));
const salida = join(aqui, '..', 'assets');
const chrome = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const FONDO = '#0a0a10';
mkdirSync(salida, { recursive: true });

// La constelación de img/icono.svg (caja de 64×64) sin su cuadrado de fondo: el fondo lo pone cada imagen.
const svg = readFileSync(join(aqui, '..', '..', 'img', 'icono.svg'), 'utf8');
const dibujo = svg.replace(/^[\s\S]*?<svg[^>]*>|<\/svg>\s*$/g, '').replace(/<rect[^>]*\/>/, '');

// lado: tamaño de la imagen; escala: qué parte ocupa la constelación; fondo: color o null (transparente).
function dibujar(nombre, lado, escala, fondo) {
  const h = lado * escala, x = (lado - h) / 2;
  const html = `<!doctype html><style>html,body{margin:0;background:${fondo || 'transparent'};overflow:hidden}</style>
<svg width="${lado}" height="${lado}"><svg x="${x}" y="${x}" width="${h}" height="${h}" viewBox="0 0 64 64">${dibujo}</svg></svg>`;
  const f = join(tmpdir(), `ch-${nombre}.html`);
  writeFileSync(f, html);
  execFileSync(chrome, ['--headless', '--disable-gpu', '--hide-scrollbars', '--default-background-color=00000000',
    `--window-size=${lado},${lado}`, `--screenshot=${join(salida, nombre)}`, `file:///${f.replace(/\\/g, '/')}`], { stdio: 'ignore' });
  rmSync(f);
  console.log(`assets/${nombre}`);
}

dibujar('icon-only.png', 1024, 0.86, FONDO);         // icono clásico (móviles antiguos) y el de Play
dibujar('icon-foreground.png', 1024, 0.85, null);    // capa delantera del icono adaptable: cabe en la zona segura
dibujar('icon-background.png', 1024, 0, FONDO);      // capa trasera: sólo el fondo
dibujar('splash.png', 2732, 0.15, FONDO);            // pantalla de arranque
dibujar('splash-dark.png', 2732, 0.15, FONDO);
