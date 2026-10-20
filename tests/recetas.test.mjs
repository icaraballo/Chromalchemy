// T-02 · El catálogo se puede completar: desde los 5 básicos, aplicando las recetas en el
// orden del JSON, se llega a los 246 colores. Y el catálogo cumple sus reglas (CH-DESIGN §2).
// Uso: npm test   (o node tests/recetas.test.mjs)
import {readFileSync} from 'node:fs';
import {crear} from '../js/posibles.js';

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
// El nivel escrito en el JSON cuadra con las recetas (protege los cambios de receta a mano, como CB-04 y CB-05)
const GEN = {};
for (const d of DATA) {
  GEN[d.id] = d.parents ? Math.max(GEN[d.parents[0]] ?? -99, GEN[d.parents[1]] ?? -99) + 1 : 0;
  ok(d.gen === GEN[d.id], `${d.id}: gen ${d.gen} en el JSON, pero por sus padres le toca ${GEN[d.id]}`);
}

// 3. Cada ficha completa y con su certeza
for (const d of DATA) {
  // El id va dentro de atributos (data-id, data-go) sin escapar: sólo letras, números y guiones.
  ok(/^[a-z0-9-]+$/.test(d.id), `${d.id}: id con caracteres no permitidos`);
  ok(FAMS.includes(d.fam), `${d.id}: familia desconocida «${d.fam}»`);
  ok(/^#[0-9A-Fa-f]{6}$/.test(d.hex), `${d.id}: hex inválido`);
  ok(CERTS.includes(d.cert), `${d.id}: certeza inválida`);
  ok(d.nombre && d.historia, `${d.id}: falta nombre o historia`);
  ok(Array.isArray(d.src) && d.src.length > 0 && d.src.every(s => s.length === 2 && /^https:\/\//.test(s[1]) && !/["<>\\\s]/.test(s[1])), `${d.id}: fuentes vacías o mal formadas`);
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

// 6. Qué se puede hacer ahora (T-16, js/posibles.js), en partidas a medias: se descubre, uno a
// uno, un color al azar (semilla fija) entre los que ya se pueden hacer, y se mira a los 30, 62,
// 100, 150 y 220 colores.
const motor = crear(DATA.map(d => ({id: d.id, p: d.parents, fam: d.fam})));
const BYID = Object.fromEntries(DATA.map(d => [d.id, d]));
let semilla = 7;
const azar = () => (semilla = (semilla * 16807) % 2147483647) / 2147483647;
function faltanAntes(id, tengo) {   // antepasados sin descubrir, contados aparte de posibles.js
  const vistos = new Set(), pila = [id];
  while (pila.length) for (const x of BYID[pila.pop()].parents || []) if (!tengo.has(x) && !vistos.has(x)) { vistos.add(x); pila.push(x); }
  return vistos.size;
}
const partida = new Set(BASICS);
for (const meta of [30, 62, 100, 150, 220]) {
  while (partida.size < meta) {
    const c = DATA.filter(d => motor.posible(d.id, partida));
    partida.add(c[Math.floor(azar() * c.length)].id);
  }
  const tag = `[${meta} colores]`;
  for (const d of DATA) {
    if (partida.has(d.id)) {
      const {ahora, luego} = motor.mezclas(d.id, partida);
      const hijos = DATA.filter(c => c.parents && c.parents.includes(d.id) && !partida.has(c.id)).map(c => c.id);
      ok([...ahora, ...luego].sort().join() === hijos.sort().join(), `${tag} ${d.id}: ahora + más adelante no son sus hijos sin descubrir`);
      ok(ahora.every(k => motor.posible(k, partida)) && luego.every(k => !motor.posible(k, partida)), `${tag} ${d.id}: «ahora» mal partido`);
      ok(motor.cadena(d.id, partida) === null, `${tag} ${d.id}: un color descubierto no tiene cadena`);
      continue;
    }
    const c = motor.cadena(d.id, partida), c2 = motor.cadena(d.id, partida);
    ok(c && motor.posible(c.t, partida), `${tag} ${d.id}: la cadena no acaba en un color posible`);
    if (!c) continue;
    ok(c.t === c2.t && c.n === c2.n, `${tag} ${d.id}: la cadena cambia al repetirla`);
    ok(c.n === faltanAntes(d.id, partida), `${tag} ${d.id}: N = ${c.n}, pero le faltan ${faltanAntes(d.id, partida)} antepasados`);
    if (motor.posible(d.id, partida)) ok(c.t === d.id && c.n === 0, `${tag} ${d.id}: posible, pero su cadena no es él mismo con N = 0`);
    else ok(c.n > 0, `${tag} ${d.id}: no es posible y N = 0`);
  }
  for (const f of FAMS) ok(motor.famPosible(f, partida) === DATA.some(d => d.fam === f && motor.posible(d.id, partida)), `${tag} ${f}: el punto de familia no cuadra`);
}

console.log(fallos ? `\n${fallos} de ${pruebas} comprobaciones fallan` : `${pruebas} comprobaciones, todas bien: se llega a los ${tengo.size} colores`);
process.exit(fallos ? 1 : 0);
