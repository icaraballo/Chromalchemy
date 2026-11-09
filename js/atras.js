/* ---------- El botón «atrás» de Android (v1.21) ----------
   Sólo dentro de la app (Capacitor; el plugin App avisa de cada pulsación). Primero cierra lo que
   esté abierto, igual que Escape; sin nada abierto, vuelve a la portada; desde la portada, sale de
   la app. Sin esto, «atrás» cerraba la app aunque hubiera una ventana abierta. En la web no hace
   nada: allí window.Capacitor no existe. */
import {abrirPortada} from './portada.js';
import {$} from './utils.js';

const cap=window.Capacitor, App=cap&&cap.isNativePlatform&&cap.isNativePlatform()&&cap.Plugins.App;
// Lo que cierra Escape, en el orden en que lo cierra (lo de encima, primero).
const VENTANAS=['privacidad','cero','opinion','pCard','wheel','lore'];

if(App)App.addListener('backButton',()=>{
 if(!$('poster').hidden){$('posterCerrar').click();return;}   // la vista del póster no atiende a Escape
 if(VENTANAS.some(id=>!$(id).hidden)){window.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape'}));return;}
 if($('portada').hidden)abrirPortada();else App.exitApp();
});
