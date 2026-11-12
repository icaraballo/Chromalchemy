/* ---------- Ajustes y «Sobre este juego» (v1.26; Sobre dentro de Ajustes desde el 12-11) ----------
   El botón «Ajustes» de la barra, junto a «Opinar», abre una hoja con la vibración (vibra.js) y, debajo,
   «Sobre este juego», como en La Colmena y La Última Gota. Sube desde abajo como la de opinar y se
   cierra con la ×, tocando fuera, con Escape y con el «atrás» de Android (atras.js). Privacidad va
   junto a la versión y Opinar en la barra: no se repiten aquí. */
import {$} from './utils.js';

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

const ajustes=hoja('ajustes');
$('ajustesBtn').onclick=ajustes.abrir;
