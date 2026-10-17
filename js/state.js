/* ---------- Estado compartido ----------
   Lo que cambia durante la partida vive en `st`, un único objeto que todos los módulos
   importan y modifican (un `let` exportado no se puede reasignar desde otro módulo). */
import {DATA,KIDS} from './data.js';
import {crear} from './posibles.js';
import {TAU} from './utils.js';

export const st={
 W:0,H:0,DPR:1,S:1,          // tamaño del lienzo, densidad de píxeles y escala
 now:performance.now()/1000, // reloj de la animación, en segundos
 effects:[],                 // explosiones, pulsos y nubecillas en curso
 selected:null,              // id del color con la ficha abierta
 hover:null,                 // nodo bajo el puntero (o bajo lo que se arrastra)
 drag:null,                  // arrastre en curso (una muestra para mezclar)
 mueve:null,                 // bola que se está moviendo a mano: {id, pid, x, y} (T-17)
 lastNew:null,               // último color descubierto (anima su entrada en la paleta)
 pista:null,                 // la pista en curso: {id, paso 1-3} (pistas.js)
 pistasUsadas:0,             // cuántas pistas se han pedido en la partida (se envía al opinar)
 pistaIngr:[],               // los ingredientes que la pista deja ver (los ilumina la constelación)
 revelado:false,             // «Revelar todo» (?dev=1) pulsado: desde ahí no se guarda nada
 stars:[],
};
export const nodes=new Map();   // id → nodo de la constelación
export const order=[];          // ids descubiertos, en orden de descubrimiento
export const openFams=new Set();// familias desplegadas en la paleta

export const logros=new Set();  // logros ya mostrados: 'rojos:50', 'rojos:100'…

export const pending=id=>KIDS[id].filter(k=>!nodes.has(k));

/* ---------- Qué se puede hacer ahora (T-16), sobre lo descubierto ----------
   La constelación lo consulta en cada fotograma: lo que vale para toda la partida (qué colores
   tienen alguna mezcla posible, qué colores que faltan ya se pueden hacer y qué familias tienen
   alguno) se recalcula sólo cuando cambia lo descubierto. */
const motor=crear(DATA);
export const posible=id=>motor.posible(id,nodes), mezclas=id=>motor.mezclas(id,nodes), cadena=id=>motor.cadena(id,nodes);
let clave='',cache=null;
export function ahora(){const k=order.length+':'+order[order.length-1];
 if(k!==clave){clave=k;cache={colores:new Set(order.filter(id=>motor.mezclas(id,nodes).ahora.length)),huecos:new Set(DATA.filter(d=>motor.posible(d.id,nodes)).map(d=>d.id))};
  cache.fams=new Set(DATA.filter(d=>cache.huecos.has(d.id)).map(d=>d.fam));}
 return cache;}

/* ---------- Guardado en el navegador ----------
   Se guarda qué se ha descubierto (en orden) y qué logros ya salieron. De las posiciones, sólo
   las de las bolas movidas a mano (v1.14, `fijas`: id → [x, y] en fracciones del lienzo); las
   demás se recolocan al cargar. localStorage puede fallar (navegación privada, almacenamiento lleno):
   entonces se juega igual, sólo que sin guardar. Tras «Revelar todo» (?dev=1) tampoco se guarda:
   mover, reordenar o pedir una pista no machaca la partida de verdad. */
const CLAVE='chromalchemy';
export function guardar(){if(st.revelado)return;try{localStorage.setItem(CLAVE,JSON.stringify({v:1,order,logros:[...logros],pista:st.pista,pistas:st.pistasUsadas,fijas:Object.fromEntries([...nodes.values()].filter(n=>n.fija).map(n=>[n.id,n.fija.map(v=>+v.toFixed(4))]))}));}catch{}}
export function leerGuardado(){try{const g=JSON.parse(localStorage.getItem(CLAVE));if(g&&Array.isArray(g.order))return g;}catch{}return null;}
export function addNode(id,x,y,delay){const n={id,x,y,vx:0,vy:0,r:0,born:st.now+(delay||0),pulse:0,shake:0,ph:Math.random()*TAU};nodes.set(id,n);order.push(id);return n;}
