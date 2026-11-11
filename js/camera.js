/* ---------- Cámara: zoom y desplazamiento de la constelación (T-12) ----------
   La simulación vive en las coordenadas del lienzo (st.W × st.H) y no sabe nada del zoom: la
   cámara sólo cambia cómo se dibuja y cómo se leen los toques. pantalla = mundo·z + (x, y).
   Con z = 1 se ve la constelación entera. Acercar (z hasta 5) y alejar (z hasta ZMIN, v1.23) son un
   zoom de verdad: al alejar, el mapa se hace pequeño y se puede arrastrar por la pantalla (el
   margen deja siempre a la vista un buen trozo), para aprovechar el móvil. «Ver toda» vuelve a 1. */
import {st} from './state.js';
import {clamp,$} from './utils.js';

export const cam={z:1,x:0,y:0};
const ZMAX=5, ZMIN=.5;
const verTodo=$('zoomOut');

export function clampCam(){cam.z=clamp(cam.z,ZMIN,ZMAX);
 const w=st.W*cam.z,h=st.H*cam.z,f=clamp((1-cam.z)*4,0,1); // f: cuánto se puede sacar el mapa de la pantalla al alejar
 const mx=w*.6*f,my=h*.6*f;
 cam.x=clamp(cam.x,Math.min(0,st.W-w)-mx,Math.max(0,st.W-w)+mx);
 cam.y=clamp(cam.y,Math.min(0,st.H-h)-my,Math.max(0,st.H-h)+my);
 verTodo.hidden=Math.abs(cam.z-1)<.02&&Math.abs(cam.x)<1&&Math.abs(cam.y)<1;}
export const toWorld=(sx,sy)=>({x:(sx-cam.x)/cam.z,y:(sy-cam.y)/cam.z});
export const vista=()=>cam.z;
// Fija el zoom dejando el punto del mundo w bajo el punto de la pantalla (sx, sy): sirve para la
// rueda del ratón (w es lo que hay bajo el cursor) y para el pellizco (w es lo que había entre los dedos).
export function zoomTo(v,w,sx,sy){cam.z=clamp(v,ZMIN,ZMAX);cam.x=sx-w.x*cam.z;cam.y=sy-w.y*cam.z;clampCam();}
export function panBy(dx,dy){cam.x+=dx;cam.y+=dy;clampCam();}
export function resetCam(){cam.z=1;cam.x=cam.y=0;clampCam();}
verTodo.onclick=resetCam;
