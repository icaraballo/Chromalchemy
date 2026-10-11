/* ---------- La paleta como hoja deslizable, en el móvil (T-10) ----------
   En pantallas estrechas la paleta sale de abajo, como la hoja de Google Maps, en dos
   posiciones: plegada (la cabecera y una tira con tus colores; la constelación se ve entera) o
   a media altura (la paleta por familias). Se arrastra sólo desde la cabecera, para no chocar
   con los gestos de la constelación; un toque la abre o la cierra; al soltar se queda en la
   posición más cercana. Recuerda dónde la dejaste; la primera vez, plegada.
   En el ordenador no hace nada: la paleta sigue en su columna. Las medidas están en el CSS. */
import {clamp,$} from './utils.js';

const pal=document.querySelector('.palette'), head=$('palHead'), stage=$('stage');
const movil=matchMedia('(max-width:760px)');
const CLAVE='chromalchemy-hoja';
let abierta=false;
try{abierta=localStorage.getItem(CLAVE)==='media';}catch{}

function poner(a,guardar){abierta=a;pal.classList.toggle('half',a);head.setAttribute('aria-expanded',a);
 if(guardar)try{localStorage.setItem(CLAVE,a?'media':'plegada');}catch{}}
// Al arrastrar un color desde la paleta: se baja sola, y se queda así para ver el resultado.
export function plegar(){if(movil.matches&&abierta)poner(false,false);}

// Cuánto baja la hoja plegada: su alto menos lo que asoma (el hueco que la constelación deja abajo).
const bajada=()=>pal.offsetHeight-parseFloat(getComputedStyle(stage).marginBottom);
let g=null;
head.addEventListener('pointerdown',e=>{if(!movil.matches||(e.pointerType==='mouse'&&e.button!==0))return;
 g={pid:e.pointerId,y0:e.clientY,base:abierta?0:bajada(),max:bajada(),movido:false,v:0,ly:e.clientY,lt:e.timeStamp};head.setPointerCapture(e.pointerId);});
head.addEventListener('pointermove',e=>{if(!g||e.pointerId!==g.pid)return;const dy=e.clientY-g.y0;
 if(!g.movido&&Math.abs(dy)<6)return;g.movido=true;pal.classList.add('moving');
 pal.style.transform=`translateY(${clamp(g.base+dy,0,g.max)}px)`;
 const dt=e.timeStamp-g.lt;if(dt>0)g.v=(e.clientY-g.ly)/dt;g.ly=e.clientY;g.lt=e.timeStamp;});
function suelta(e){if(!g||e.pointerId!==g.pid)return;const r=g;g=null;
 if(!r.movido){if(e.type==='pointerup')poner(!abierta,true);return;}
 const y=clamp(r.base+e.clientY-r.y0,0,r.max);
 pal.classList.remove('moving');pal.style.transform='';
 // Un golpe rápido manda; si no, la posición más cercana.
 poner(r.v<-.4?true:r.v>.4?false:y<r.max/2,true);}
head.addEventListener('pointerup',suelta);head.addEventListener('pointercancel',suelta);
head.addEventListener('keydown',e=>{if(movil.matches&&(e.key==='Enter'||e.key===' ')){e.preventDefault();poner(!abierta,true);}});

// Al cargar, sin animación: la hoja aparece ya donde se dejó.
pal.classList.add('moving');poner(abierta,false);requestAnimationFrame(()=>requestAnimationFrame(()=>pal.classList.remove('moving')));
