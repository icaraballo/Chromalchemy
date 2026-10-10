// T-02 · El catálogo se puede completar: desde los 5 básicos, aplicando las recetas en el
// orden del JSON, se llega a los 246 colores. Y el catálogo cumple sus reglas (CH-DESIGN §2).
// Uso: npm test   (o node tests/recetas.test.mjs)
import {readFileSync} from 'node:fs';

const DATA = JSON.parse(readFileSync(new URL('../data/colores.json', import.meta.url), 'utf8'));
const BASICS = ['rojo', 'amarillo', 'azul', 'blanco', 'negro'];
const FAMS = ['rojos','rosas','naranjas','amarillos','verdes','azules','violetas','marrones','blancos','grises','negros'];
const CERTS = ['doc', 'disc', 'ley'];

let fallos = 0, pruebas = 0;
function ok(cond, msg) { pruebas++; if (!cond) { fallos++; console.log('  ✗ ' + msg); } }

// 1. Completable en orden
const tengo = new Set(BASICS);
for (const d of DATA) {
  if (!d.parents) continue;
  const [a, b] = d.parents;
  ok(tengo.has(a) && tengo.has(b), `${d.id}: sus padres (${a}, ${b}) no están disponibles antes que él`);
  tengo.add(d.id);
}
ok(tengo.size === DATA.length, `se alcanzan ${tengo.size} colores, no ${DATA.length}`);
ok(DATA.length === 246, `el catálogo tiene ${DATA.length} colores, no 246`);

// 2. Reglas de la mezcla
const ids = new Set(DATA.map(d => d.id));
ok(ids.size === DATA.length, 'hay ids repetidos');
const conReceta = DATA.filter(d => d.parents);
ok(DATA.filter(d => !d.parents).map(d => d.id).sort().join() === [...BASICS].sort().join(), 'sin receta sólo pueden estar los 5 básicos');
const parejas = new Map();
for (const d of conReceta) {
  const [a, b] = d.parents;
  ok(ids.has(a) && ids.has(b), `${d.id}: padre inexistente`);
  ok(a !== b, `${d.id}: mezcla un color consigo mismo`);
  const k = a < b ? a + '|' + b : b + '|' + a;
  ok(!parejas.has(k), `${d.id} y ${parejas.get(k)} salen de la misma pareja`);
  parejas.set(k, d.id);
}

// 3. Cada ficha completa y con su certeza
for (const d of DATA) {
  ok(FAMS.includes(d.fam), `${d.id}: familia desconocida «${d.fam}»`);
  ok(/^#[0-9A-Fa-f]{6}$/.test(d.hex), `${d.id}: hex inválido`);
  ok(CERTS.includes(d.cert), `${d.id}: certeza inválida`);
  ok(d.nombre && d.historia, `${d.id}: falta nombre o historia`);
  ok(Array.isArray(d.src) && d.src.length > 0 && d.src.every(s => s.length === 2 && /^https?:\/\//.test(s[1])), `${d.id}: fuentes vacías o mal formadas`);
  ok(!d.nota || (CERTS.includes(d.nota.cert) && d.nota.t), `${d.id}: nota sin certeza o sin texto`);
}

console.log(fallos ? `\n${fallos} de ${pruebas} comprobaciones fallan` : `${pruebas} comprobaciones, todas bien: se llega a los ${tengo.size} colores`);
process.exit(fallos ? 1 : 0);
