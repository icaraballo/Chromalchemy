/* ---------- La portada y «Empezar de cero» (T-20, v1.17) ----------
   La portada sale siempre al abrir el juego (decidido por Iñigo), con partida y sin ella; el
   juego carga detrás mientras tanto. Ya viene pintada en index.html y un script en línea elige
   los botones antes de que lleguen los módulos, así no retrasa el primer pintado.
   - Sin partida: «Empezar a mezclar», y sale el gesto guiado (gesto.js).
   - Con partida: el botón grande es «Seguir mi partida» (lo que se toca sin pensar nunca borra
     nada) y, debajo, el enlace «Empezar de cero», que pide confirmación con una hoja (no el
     confirm() del navegador). «Reiniciar» de la barra usa la misma hoja. */
import {order} from './state.js';
import {DATA,BASICS} from './data.js';
import {reset} from './ui.js';
import {empezarGesto} from './gesto.js';
import {$} from './utils.js';

const portada=$('portada'),hoja=$('cero'),velo=$('ceroFondo');
const descubiertos=()=>order.length-BASICS.length;
let abierta=false,origen=null,cierre=0;

function cerrarPortada(){portada.classList.add('fuera');setTimeout(()=>{portada.hidden=true;},300);}
function nueva(){reset();empezarGesto();}

/* ---------- La hoja de «¿Empezar de cero?» ---------- */
function abrirCero(){const n=descubiertos();clearTimeout(cierre);abierta=true;origen=document.activeElement;
 $('ceroTexto').textContent=(n===1?'Se borrará el color que has descubierto.':`Se borrarán los ${n} colores que has descubierto.`)+' No se puede deshacer.';
 hoja.hidden=velo.hidden=false;hoja.getBoundingClientRect();   // para que haya transición
 hoja.classList.add('abierta');velo.classList.add('abierta');$('ceroNo').focus({preventScroll:true});}
function cerrarCero(){if(!abierta)return;abierta=false;
 hoja.classList.remove('abierta');velo.classList.remove('abierta');
 cierre=setTimeout(()=>{hoja.hidden=velo.hidden=true;},250);
 if(origen&&document.contains(origen)&&origen.offsetParent)origen.focus({preventScroll:true});origen=null;}

$('porEmpezar').onclick=()=>{cerrarPortada();nueva();};
$('porSeguir').onclick=cerrarPortada;
$('porCero').onclick=abrirCero;
// «No, seguir mi partida»: si se abrió desde la portada, también la cierra (la partida sigue).
$('ceroNo').onclick=()=>{cerrarCero();if(!portada.hidden)cerrarPortada();};
$('ceroSi').onclick=()=>{cerrarCero();if(!portada.hidden)cerrarPortada();nueva();};
velo.onclick=cerrarCero;
// Escape y tocar fuera cierran sin borrar. Va antes que el Escape de la ficha y la gama.
window.addEventListener('keydown',e=>{if(e.key==='Escape'&&abierta){e.stopImmediatePropagation();cerrarCero();}},true);
// «Reiniciar» de la barra: con algo que perder, la misma hoja; si no, partida nueva sin preguntar.
$('reset').onclick=()=>{if(descubiertos()>0)abrirCero();else nueva();};

// El script en línea ya ha elegido los botones con lo guardado; si al cargar no cuadra (guardado
// raro que restaurar() ha descartado), manda lo que hay de verdad.
export function iniciarPortada(){const n=descubiertos(),hay=n>0;
 $('porEmpezar').hidden=hay;$('porSeguir').hidden=!hay;$('porCero').hidden=!hay;
 if(hay)$('porN').textContent=`${order.length} de ${DATA.length} colores`;}
