/* ---------- Ajustes y «Sobre este juego» (v1.26) ----------
   El botón «Ajustes» de la barra, junto a «Opinar», abre una hoja con la vibración (vibra.js) y la
   entrada a «Sobre este juego». Las dos hojas son como la de opinar: suben desde abajo, se cierran con
   la ×, tocando fuera, con Escape y con el «atrás» de Android (atras.js). «Sobre» va encima de
   Ajustes y Privacidad encima de las dos; «Opinar» se abre desde «Sobre», cerrando antes las otras. */
import {$} from './utils.js';
import {abrirPrivacidad} from './privacidad.js';
import {abrirOpinion} from './opinion.js';

function hoja(id){const h=$(id),velo=$(id+'Fondo');let abierta=false,origen=null,cierre=0;
 const abrir=()=>{clearTimeout(cierre);abierta=true;origen=document.activeElement;
  h.hidden=velo.hidden=false;h.getBoundingClientRect();   // para que haya transición
  h.classList.add('abierta');velo.classList.add('abierta');$(id+'Cerrar').focus({preventScroll:true});};
 const cerrar=(sinFoco)=>{if(!abierta)return;abierta=false;
  h.classList.remove('abierta');velo.classList.remove('abierta');
  cierre=setTimeout(()=>{h.hidden=velo.hidden=true;},250);
  if(!sinFoco&&origen&&document.contains(origen)&&origen.offsetParent)origen.focus({preventScroll:true});origen=null;};
 $(id+'Cerrar').onclick=()=>cerrar();velo.onclick=()=>cerrar();
 // Escape cierra sólo ésta. main.js importa privacidad.js antes: la de encima va primero.
 window.addEventListener('keydown',e=>{if(e.key==='Escape'&&abierta){e.stopImmediatePropagation();cerrar();}},true);
 return {abrir,cerrar,abierta:()=>abierta};}

const sobre=hoja('sobre'),ajustes=hoja('ajustes');   // Sobre primero: su Escape va antes que el de Ajustes
$('ajustesBtn').onclick=ajustes.abrir;
$('ajSobre').onclick=()=>{$('sobreVersion').textContent=document.querySelector('.tag').textContent.trim();sobre.abrir();};
$('sobrePriv').onclick=abrirPrivacidad;
$('sobreOpinar').onclick=()=>{sobre.cerrar(true);ajustes.cerrar(true);abrirOpinion();};
