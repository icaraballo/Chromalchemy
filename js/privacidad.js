/* ---------- Privacidad (v1.16.1) ----------
   Una hoja con lo que se guarda y lo que se envía, como la de La Colmena (v11.20). Se abre con
   el enlace de la cabecera, junto a la versión, y con el de la línea de privacidad de opinar.
   Va encima de opinar: al cerrarla, opinar sigue abierta. El texto vive en index.html, igual que
   en el apartado «Privacidad» del README: si cambia uno, cambiar el otro. */
import {$} from './utils.js';

const hoja=$('privacidad'),velo=$('privacidadFondo');
let abierta=false,origen=null,cierre=0;

export function abrirPrivacidad(){clearTimeout(cierre);abierta=true;origen=document.activeElement;
 hoja.hidden=velo.hidden=false;hoja.getBoundingClientRect();   // para que haya transición
 hoja.classList.add('abierta');velo.classList.add('abierta');$('privacidadOk').focus({preventScroll:true});}

export function cerrarPrivacidad(){if(!abierta)return;abierta=false;
 hoja.classList.remove('abierta');velo.classList.remove('abierta');
 cierre=setTimeout(()=>{hoja.hidden=velo.hidden=true;},250);
 if(origen&&document.contains(origen)&&origen.offsetParent)origen.focus({preventScroll:true});origen=null;}
export const privacidadAbierta=()=>abierta;

for(const id of ['privacidadBtn','privacidadOpinion'])$(id).onclick=abrirPrivacidad;
for(const id of ['privacidadCerrar','privacidadOk','privacidadFondo'])$(id).onclick=cerrarPrivacidad;
// Escape cierra sólo esta hoja (si estaba encima de opinar, opinar sigue abierta). main.js
// importa este módulo antes que opinion.js para que este aviso vaya primero.
window.addEventListener('keydown',e=>{if(e.key==='Escape'&&abierta){e.stopImmediatePropagation();cerrarPrivacidad();}},true);
