/* ---------- El botón «atrás» de Android (v1.21) ----------
   Sólo dentro de la app (Capacitor; el plugin App avisa de cada pulsación). Primero cierra lo que
   esté abierto, igual que Escape; luego pliega la paleta (la hoja del móvil, si está abierta);
   luego vuelve a la portada; y desde la portada pregunta «¿Salir de Chromalchemy?» (Sí / No, como La
   Colmena); «atrás» con la pregunta abierta es «No». Sin esto, «atrás» cerraba la app aunque hubiera una ventana abierta. En la web no hace
   nada: allí window.Capacitor no existe. */
import {abrirPortada} from './portada.js';
import {plegarAtras} from './sheet.js';
import {$} from './utils.js';

const cap=window.Capacitor, App=cap&&cap.isNativePlatform&&cap.isNativePlatform()&&cap.Plugins.App;
// Lo que cierra Escape, en el orden en que lo cierra (lo de encima, primero).
const VENTANAS=['privacidad','ajustes','cero','opinion','pCard','wheel','lore'];

// «¿Salir de Chromalchemy?» Sí / No, como en La Colmena (v1.25). Va encima de la portada.
function salir(){return $('salir')||crearSalir();}
function crearSalir(){const v=document.createElement('div');v.id='salir';v.className='salir-velo';v.hidden=true;
 v.innerHTML='<div class="salir-caja" role="dialog" aria-modal="true" aria-labelledby="salirTitulo"><div class="salir-t" id="salirTitulo">¿Salir de Chromalchemy?</div><p>Tu partida queda guardada.</p><div class="salir-bot"><button type="button" id="salirNo">No</button><button type="button" id="salirSi" class="si">Sí, salir</button></div></div>';
 document.body.appendChild(v);
 const cerrar=()=>{v.hidden=true;};
 $('salirNo').onclick=cerrar;$('salirSi').onclick=()=>App.exitApp();
 v.addEventListener('click',e=>{if(e.target===v)cerrar();});return v;}
if(App)App.addListener('backButton',()=>{
 if(!$('poster').hidden){$('posterCerrar').click();return;}   // la vista del póster no atiende a Escape
 if(VENTANAS.some(id=>!$(id).hidden)){window.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape'}));return;}
 if(!salir().hidden){salir().hidden=true;return;}   // atrás con «¿Salir?» abierto = «No»
 if(plegarAtras())return;
 if(!$('portada').hidden){salir().hidden=false;$('salirNo').focus({preventScroll:true});return;}
 abrirPortada();
});
