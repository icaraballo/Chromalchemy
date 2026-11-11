/* ---------- El botón «atrás» de Android (v1.21) ----------
   Sólo dentro de la app (Capacitor; el plugin App avisa de cada pulsación). Primero cierra lo que
   esté abierto, igual que Escape; luego pliega la paleta (la hoja del móvil, si está abierta);
   luego vuelve a la portada; y desde la portada avisa («Pulsa otra vez para salir», como La
   Colmena) y, si se pulsa de nuevo en 2 s, sale de la app. Sin esto, «atrás» cerraba la app aunque hubiera una ventana abierta. En la web no hace
   nada: allí window.Capacitor no existe. */
import {abrirPortada} from './portada.js';
import {plegarAtras} from './sheet.js';
import {$} from './utils.js';

const cap=window.Capacitor, App=cap&&cap.isNativePlatform&&cap.isNativePlatform()&&cap.Plugins.App;
// Lo que cierra Escape, en el orden en que lo cierra (lo de encima, primero).
const VENTANAS=['privacidad','cero','opinion','pCard','wheel','lore'];

let hasta=0,avisoT=null;
// El aviso de salir va encima de la portada (el toast normal queda debajo de ella).
function avisarSalida(){let a=$('avisoSalir');
 if(!a){a=document.createElement('div');a.id='avisoSalir';a.setAttribute('role','status');a.className='aviso-salir';document.body.appendChild(a);}
 a.textContent='Pulsa otra vez para salir';a.hidden=false;clearTimeout(avisoT);avisoT=setTimeout(()=>{a.hidden=true;},2200);}
if(App)App.addListener('backButton',()=>{
 if(!$('poster').hidden){$('posterCerrar').click();return;}   // la vista del póster no atiende a Escape
 if(VENTANAS.some(id=>!$(id).hidden)){window.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape'}));return;}
 if(plegarAtras())return;
 if(!$('portada').hidden){if(Date.now()<hasta)App.exitApp();else{hasta=Date.now()+2200;avisarSalida();}return;}
 abrirPortada();
});
