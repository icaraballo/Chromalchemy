/* ---------- Efectos: explosión, nubecilla y pulso ---------- */
import {st} from './state.js';
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
