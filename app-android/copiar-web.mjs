// Copia el juego (la web de la carpeta de arriba) a www/, que es lo que Capacitor mete en la app.
// La web es el original: aquí no se edita nada, sólo se copia lo que el juego carga.
import { cpSync, rmSync, mkdirSync, readFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const aqui = dirname(fileURLToPath(import.meta.url));
const web = join(aqui, '..');
const destino = join(aqui, 'www');

rmSync(destino, { recursive: true, force: true });
mkdirSync(destino);

cpSync(join(web, 'index.html'), join(destino, 'index.html'));
// fonts/ entera: las OFL-*.txt van con las letras porque la licencia lo exige.
for (const d of ['css', 'js', 'data', 'fonts']) {
  cpSync(join(web, d), join(destino, d), { recursive: true });
}
// De img/ sólo los iconos: las capturas y la tarjeta son para el README y los enlaces compartidos.
cpSync(join(web, 'img'), join(destino, 'img'), {
  recursive: true,
  filter: s => !/^(captura.*|tarjeta)\.jpg$/.test(basename(s)),
});

const html = readFileSync(join(destino, 'index.html'), 'utf8');
const version = (html.match(/\?v=([\d.]+)/) || [])[1] || '?';
console.log(`Copiada la web v${version} a www/`);
