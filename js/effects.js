/* ---------- Efectos: explosión, nubecilla y pulso ---------- */
import {BY} from './data.js';
import {st,nodes} from './state.js';
import {ctx,circle} from './constellation.js';
import {rgba,TAU,clamp,easeOut,reduce} from './utils.js';

// Explosión al descubrir un color: destello, dos ondas y partículas en los colores de padres y resultado.
export function burst(x,y,cols,col){const S=st.S,parts=[],N=reduce?18:72;
 for(let i=0;i<N;i++){const a=Math.random()*TAU,sp=(70+Math.random()*320)*S;parts.push({x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,c:cols[i%cols.length],life:.5+Math.random()*.75,s:(1+Math.random()*2.6)*S});}
 let last=st.now;st.effects.push({t0:st.now,dur:1.4,draw(el){const dt=st.now-last;last=st.now;ctx.globalCompositeOperation='lighter';
  if(el<.3){const a=(1-el/.3)*.55,g=ctx.createRadialGradient(x,y,0,x,y,95*S);g.addColorStop(0,`rgba(255,255,255,${a})`);g.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=g;circle(x,y,95*S);ctx.fill();}
  const p=Math.min(1,el/.85);ctx.strokeStyle=rgba(col,(1-p)*.9);ctx.lineWidth=3.5*S*(1-p)+.4;circle(x,y,easeOut(p)*150*S);ctx.stroke();
  const p2=clamp((el-.1)/.9,0,1);if(p2>0&&p2<1){ctx.strokeStyle=rgba(col,(1-p2)*.4);ctx.lineWidth=1;circle(x,y,easeOut(p2)*210*S);ctx.stroke();}
  const damp=Math.pow(.06,dt);for(const q of parts){if(el>q.life)continue;q.x+=q.vx*dt;q.y+=q.vy*dt;q.vx*=damp;q.vy*=damp;ctx.fillStyle=rgba(q.c,1-el/q.life);circle(q.x,q.y,q.s);ctx.fill();}
  ctx.globalCompositeOperation='source-over';}});}
// Nubecilla gris cuando la pareja no reacciona.
export function puff(x,y){const S=st.S,parts=[];for(let i=0;i<9;i++)parts.push({a:Math.random()*TAU,sp:(20+Math.random()*30)*S});
 st.effects.push({t0:st.now,dur:.6,draw(el){const p=el/.6;for(const q of parts){ctx.fillStyle=`rgba(160,156,180,${.5*(1-p)})`;circle(x+Math.cos(q.a)*q.sp*p*1.6,y+Math.sin(q.a)*q.sp*p*1.6,3*S*(1-p*.5));ctx.fill();}}});}
// Pulso sobre un color que ya tenías.
export function ping(x,y,col){const S=st.S;st.effects.push({t0:st.now,dur:.8,draw(el){const p=el/.8;ctx.strokeStyle=rgba(col,.8*(1-p));ctx.lineWidth=2;circle(x,y,(20+easeOut(p)*50)*S);ctx.stroke();}});}
/* El nacimiento del color (T-20, v1.19): justo después de la explosión, una chispa sale de cada
   padre y recorre su hilo hasta el color nuevo (a medio camino hacia los 0,4 s, llega al segundo).
   Al llegar se encienden los dos hilos y vuelven a su brillo en otro segundo (n.chispa, que lee la
   constelación). Si un padre está fuera de la pantalla por el zoom, sale de donde esté. Con
   «reducir movimiento», sin chispas: sólo los hilos encendidos un momento. */
const VIAJE=1;
export function chispa(id,a,b){const n=nodes.get(id),pa=[nodes.get(a),nodes.get(b)].filter(Boolean);if(!n)return;
 if(reduce){n.chispa=st.now;return;}
 n.chispa=st.now+VIAJE;const col=BY[id].hex;
 st.effects.push({t0:st.now,dur:VIAJE,draw(el){const S=st.S;
  ctx.globalCompositeOperation='lighter';
  for(const q of pa){
   // Va deprisa al salir y frena al llegar: a los 0,4 s, más o menos a medio camino.
   const pos=t=>1-Math.pow(1-clamp(t,0,1),1.6),p=pos(el/VIAJE),p0=pos((el-.14)/VIAJE);
   const x=q.x+(n.x-q.x)*p,y=q.y+(n.y-q.y)*p,x0=q.x+(n.x-q.x)*p0,y0=q.y+(n.y-q.y)*p0;
   const e=ctx.createLinearGradient(x0,y0,x,y);e.addColorStop(0,rgba(col,0));e.addColorStop(1,rgba(col,.75));
   ctx.strokeStyle=e;ctx.lineWidth=2.4*S;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x,y);ctx.stroke();
   const g=ctx.createRadialGradient(x,y,0,x,y,11*S);g.addColorStop(0,'rgba(255,255,255,.95)');g.addColorStop(.25,rgba(col,.7));g.addColorStop(1,rgba(col,0));
   ctx.fillStyle=g;circle(x,y,11*S);ctx.fill();}
  ctx.globalCompositeOperation='source-over';}});}
