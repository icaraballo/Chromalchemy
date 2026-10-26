/* ---------- El gesto guiado de la partida nueva (T-20, v1.17) ----------
   Sustituye a la ayuda de arriba de la v1.15. Un dedo fantasma se posa sobre el rojo, sale el
   anillo de «cogida» a los 0,5 s, lleva la muestra hasta el amarillo, lo marca con un aro y
   suelta. No mezcla: no se ve qué sale. Da vueltas (unos 8 s cada una) hasta que el jugador coge
   una bola de verdad para mezclar (mantener 0,5 s, o arrastrar desde la paleta o la tira): ahí se
   van el dedo y el texto, y ya no vuelven en esa partida. Mover una bola o abrir una ficha no lo
   para. Usa dónde están el rojo y el amarillo en cada momento. Con «reducir movimiento», sin dedo:
   sólo el texto. constellation.js lo dibuja, en el mundo (con la cámara), encima de las bolas. */
import {BY} from './data.js';
import {st,nodes} from './state.js';
import {cam} from './camera.js';
import {rgba,TAU,clamp,elastic,reduce,$} from './utils.js';

const texto=$('gesto');
const VUELTA=8, DE='rojo', A='amarillo';
let t0=null;

export const gestoActivo=()=>t0!==null;
export function empezarGesto(){t0=st.now;texto.hidden=false;}
export function quitarGesto(){t0=null;texto.hidden=true;}
// drag.js avisa cuando el jugador coge una bola para mezclar: el gesto ya está aprendido.
export function alCoger(){if(t0!==null)quitarGesto();}

const suave=p=>p<.5?2*p*p:1-Math.pow(-2*p+2,2)/2;
function circ(ctx,x,y,r){ctx.beginPath();ctx.arc(x,y,Math.max(0,r),0,TAU);}

// Tiempos de una vuelta, en segundos: se posa, coge, arrastra, marca, suelta y espera.
const POSA=.5, COGE=POSA+.5, SALE=COGE+.35, LLEGA=SALE+1.5, SUELTA=LLEGA+.7, FUERA=SUELTA+.45;
export function drawGesto(ctx){if(t0===null||reduce)return;
 const a=nodes.get(DE),b=nodes.get(A);if(!a||!b||st.now<a.born||st.now<b.born)return;
 const t=(st.now-t0)%VUELTA;if(t>FUERA)return;
 const S=st.S,k=1/cam.z,rz=1/Math.sqrt(cam.z),hex=BY[DE].hex;
 const p=clamp((t-SALE)/(LLEGA-SALE),0,1),q=suave(p);
 const x=a.x+(b.x-a.x)*q,y=a.y+(b.y-a.y)*q;
 const alfa=t<POSA?t/POSA:t>SUELTA?1-(t-SUELTA)/(FUERA-SUELTA):1;
 // El anillo discontinuo de «cogida», sobre el rojo, como cuando se mantiene de verdad.
 if(t>=COGE&&t<SUELTA){const e=elastic(Math.min(1,(t-COGE)/.35));
  ctx.strokeStyle=rgba(hex,.8*alfa);ctx.lineWidth=1.4;ctx.setLineDash([3,4]);circ(ctx,a.x,a.y,(a.r*e+6*S)*rz);ctx.stroke();ctx.setLineDash([]);}
 // Al llegar, el amarillo marcado con el aro de «aquí se suelta».
 if(t>=LLEGA-.15&&t<FUERA){const r=(b.r+10*S+Math.sin(st.now*8)*2)*rz;
  ctx.strokeStyle=rgba(hex,.95*alfa);ctx.lineWidth=2.2;circ(ctx,b.x,b.y,r);ctx.stroke();
  ctx.strokeStyle=`rgba(255,255,255,${.35*alfa})`;ctx.lineWidth=1;circ(ctx,b.x,b.y,r+5*S*rz);ctx.stroke();}
 // La muestra que se arrastra (como la bola fantasma), desde que se coge hasta que se suelta.
 if(t>=SALE&&t<SUELTA){const r=21*k;const g=ctx.createRadialGradient(x-r*.3,y-r*.35,0,x,y,r);
  g.addColorStop(0,rgba('#ffffff',.7*alfa));g.addColorStop(.55,rgba(hex,.85*alfa));g.addColorStop(1,rgba(hex,.75*alfa));
  ctx.fillStyle=g;circ(ctx,x,y,r);ctx.fill();}
 // El dedo: un círculo blanco translúcido, un poco más grande que la muestra.
 const dx=t<SALE?a.x:x,dy=t<SALE?a.y:y,rd=(t<POSA?30-6*alfa:24)*k;
 ctx.fillStyle=`rgba(255,255,255,${.22*alfa})`;circ(ctx,dx,dy,rd);ctx.fill();
 ctx.strokeStyle=`rgba(255,255,255,${.55*alfa})`;ctx.lineWidth=1.5*k;circ(ctx,dx,dy,rd);ctx.stroke();}
