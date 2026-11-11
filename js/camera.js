/* ---------- Cámara: zoom y desplazamiento de la constelación (T-12) ----------
   La simulación vive en las coordenadas del lienzo (st.W × st.H) y no sabe nada del zoom: la
   cámara sólo cambia cómo se dibuja y cómo se leen los toques. pantalla = mundo·z + (x, y).
   Con z = 1 se ve la constelación entera; no se puede salir de ella.
   Alejar más allá de «toda» (v1.22): el mapa se queda igual y lo que encoge son las bolas
   (cam.b, de 1 a BMIN), para que en el móvil se vean más sueltas. Pellizco y rueda mueven un
   solo dial (vista): por debajo de 1 es el tamaño de las bolas; por encima, el zoom. El tamaño
   elegido se recuerda (también entre partidas) y «Ver toda» vuelve a él. */
import {st} from './state.js';
import {clamp,$} from './utils.js';

export const cam={z:1,x:0,y:0,b:1};
const ZMAX=5, BMIN=.5, CLAVE='chromalchemy-bolas';
const verTodo=$('zoomOut');
let pref=1;
try{const v=parseFloat(localStorage.getItem(CLAVE));if(v>=BMIN&&v<=1)pref=cam.b=v;}catch{}

export function clampCam(){cam.z=clamp(cam.z,1,ZMAX);cam.x=clamp(cam.x,st.W-st.W*cam.z,0);cam.y=clamp(cam.y,st.H-st.H*cam.z,0);verTodo.hidden=cam.z<1.02;}
export const toWorld=(sx,sy)=>({x:(sx-cam.x)/cam.z,y:(sy-cam.y)/cam.z});
export const vista=()=>cam.z>1?cam.z:cam.b;
// Fija la vista dejando el punto del mundo w bajo el punto de la pantalla (sx, sy): sirve para la
// rueda del ratón (w es lo que hay bajo el cursor) y para el pellizco (w es lo que había entre los dedos).
export function zoomTo(v,w,sx,sy){v=clamp(v,BMIN,ZMAX);
 if(v<=1){cam.b=v;cam.z=1;}else{cam.b=1;cam.z=v;}
 cam.x=sx-w.x*cam.z;cam.y=sy-w.y*cam.z;clampCam();}
// Al acabar el gesto: si se ha quedado viendo el mapa entero, ese tamaño de bola es el preferido.
export function asentar(){if(cam.z>1)return;pref=cam.b;try{localStorage.setItem(CLAVE,String(Math.round(pref*100)/100));}catch{}}
export function panBy(dx,dy){cam.x+=dx;cam.y+=dy;clampCam();}
export function resetCam(){cam.z=1;cam.b=pref;cam.x=cam.y=0;clampCam();}
verTodo.onclick=resetCam;
