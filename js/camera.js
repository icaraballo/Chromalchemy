/* ---------- Cámara: zoom y desplazamiento de la constelación (T-12) ----------
   La simulación vive en las coordenadas del lienzo (st.W × st.H) y no sabe nada del zoom: la
   cámara sólo cambia cómo se dibuja y cómo se leen los toques. pantalla = mundo·z + (x, y).
   Con z = 1 se ve la constelación entera, como antes; no se puede alejar más ni salirse de ella. */
import {st} from './state.js';
import {clamp,$} from './utils.js';

export const cam={z:1,x:0,y:0};
const ZMAX=5;
const verTodo=$('zoomOut');

export function clampCam(){cam.z=clamp(cam.z,1,ZMAX);cam.x=clamp(cam.x,st.W-st.W*cam.z,0);cam.y=clamp(cam.y,st.H-st.H*cam.z,0);verTodo.hidden=cam.z<1.02;}
export const toWorld=(sx,sy)=>({x:(sx-cam.x)/cam.z,y:(sy-cam.y)/cam.z});
// Fija el zoom dejando el punto del mundo w bajo el punto de la pantalla (sx, sy): sirve para la
// rueda del ratón (w es lo que hay bajo el cursor) y para el pellizco (w es lo que había entre los dedos).
export function zoomTo(z,w,sx,sy){cam.z=clamp(z,1,ZMAX);cam.x=sx-w.x*cam.z;cam.y=sy-w.y*cam.z;clampCam();}
export function panBy(dx,dy){cam.x+=dx;cam.y+=dy;clampCam();}
export function resetCam(){cam.z=1;cam.x=cam.y=0;clampCam();}
verTodo.onclick=resetCam;
