/* ---------- Estado compartido ----------
   Lo que cambia durante la partida vive en `st`, un único objeto que todos los módulos
   importan y modifican (un `let` exportado no se puede reasignar desde otro módulo). */
import {KIDS} from './data.js';
import {TAU} from './utils.js';

export const st={
 W:0,H:0,DPR:1,S:1,          // tamaño del lienzo, densidad de píxeles y escala
 now:performance.now()/1000, // reloj de la animación, en segundos
 effects:[],                 // explosiones, pulsos y nubecillas en curso
 selected:null,              // id del color con la ficha abierta
 hover:null,                 // nodo bajo el puntero (o bajo lo que se arrastra)
 drag:null,                  // arrastre en curso
 lastNew:null,               // último color descubierto (anima su entrada en la paleta)
 stars:[],
};
export const nodes=new Map();   // id → nodo de la constelación
export const order=[];          // ids descubiertos, en orden de descubrimiento
export const openFams=new Set();// familias desplegadas en la paleta

export const logros=new Set();  // logros ya mostrados: 'rojos:50', 'rojos:100'…

export const pending=id=>KIDS[id].filter(k=>!nodes.has(k));

/* ---------- Guardado en el navegador ----------
   Se guarda qué se ha descubierto (en orden) y qué logros ya salieron; las posiciones no, se
   recolocan al cargar. localStorage puede fallar (navegación privada, almacenamiento lleno):
   entonces se juega igual, sólo que sin guardar. */
const CLAVE='chromalchemy';
export function guardar(){try{localStorage.setItem(CLAVE,JSON.stringify({v:1,order,logros:[...logros]}));}catch{}}
export function leerGuardado(){try{const g=JSON.parse(localStorage.getItem(CLAVE));if(g&&Array.isArray(g.order))return g;}catch{}return null;}
export function addNode(id,x,y,delay){const n={id,x,y,vx:0,vy:0,r:0,born:st.now+(delay||0),pulse:0,shake:0,fixed:false,ph:Math.random()*TAU};nodes.set(id,n);order.push(id);return n;}
