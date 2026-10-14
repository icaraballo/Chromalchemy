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

// 4. Cada color se ve distinto: no hay dos con el mismo hex (CB-04)
const hexes = new Map();
for (const d of DATA) {
  const h = String(d.hex).toUpperCase();
  ok(!hexes.has(h), `${d.id} y ${hexes.get(h)} tienen el mismo hex ${h}`);
  hexes.set(h, d.id);
}

// 5. Cada color con receta tiene su acertijo (T-14): no dice el nombre (la misma regla que
// tapar() de js/pistas.js) y cabe en la tarjeta (163 caracteres como mucho)
const norm = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const VACIAS = new Set(['de','del','la','el','los','las','y','en','con']);
for (const d of DATA) {
  if (!d.parents) { ok(!d.acertijo, `${d.id}: los básicos no llevan acertijo`); continue; }
  ok(typeof d.acertijo === 'string' && d.acertijo.trim(), `${d.id}: falta el acertijo`);
  if (!d.acertijo) continue;
  ok(d.acertijo.length <= 163, `${d.id}: el acertijo tiene ${d.acertijo.length} caracteres (máx. 163)`);
  const ws = d.name.split(/[\s-]+/).filter(w => w.length > 2 && !VACIAS.has(norm(w))).map(norm);
  const dice = (d.acertijo.match(/[\p{L}·]+/gu) || []).filter(m => { const a = norm(m); return ws.some(b => a === b || (b.length > 4 && a.startsWith(b.slice(0, -1)))); });
  ok(!dice.length, `${d.id}: el acertijo dice el nombre (${dice.join(', ')})`);
}

console.log(fallos ? `\n${fallos} de ${pruebas} comprobaciones fallan` : `${pruebas} comprobaciones, todas bien: se llega a los ${tengo.size} colores`);
process.exit(fallos ? 1 : 0);
