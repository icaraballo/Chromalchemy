/* ---------- Constelación: simulación de fuerzas y dibujo en canvas ---------- */
import {BY,KIDS} from './data.js';
import {st,nodes,order,pending} from './state.js';
import {cam,clampCam} from './camera.js';
import {rgba,lighten,lum,TAU,clamp,elastic,reduce,$} from './utils.js';

const stage=$('stage');
export const cv=$('cv'), ctx=cv.getContext('2d');

export function resize(){const r=stage.getBoundingClientRect();st.W=r.width;st.H=r.height;st.DPR=Math.min(2,window.devicePixelRatio||1);
 cv.width=Math.round(st.W*st.DPR);cv.height=Math.round(st.H*st.DPR);cv.style.width=st.W+'px';cv.style.height=st.H+'px';
 st.S=clamp(Math.min(st.W,st.H)/680,.6,1.1);clampCam();}
export function makeStars(){st.stars=[];for(let i=0;i<160;i++)st.stars.push({x:Math.random(),y:Math.random(),r:Math.random()*1.1+.2,ph:Math.random()*TAU,sp:.5+Math.random()*1.5});}

/* ---------- Simulación ----------
   Fuerzas: repulsión entre vecinas, muelle hacia los padres y atracción hacia la zona de la
   familia. Desde la v1.5 (CB-03) la repulsión sólo alcanza a las bolas cercanas: si cada bola
   empuja a todas, con muchas en poco sitio la suma las saca contra los bordes. */
// Zona de cada familia: [ángulo en grados, distancia al centro en fracciones de R]. Los tonos
// en círculo, como en la gama; blancos arriba, negros abajo y grises en el centro.
const ZONA={rojos:[0,1],marrones:[25,.55],naranjas:[40,1],amarillos:[80,1],verdes:[140,1],azules:[215,1],violetas:[265,1],rosas:[320,1],blancos:[270,.35],grises:[0,0],negros:[90,.35]};
function degree(id){let c=BY[id].p?2:0;for(const o of order){const p=BY[o].p;if(p&&(p[0]===id||p[1]===id))c++;}return c;}
// Cuánto se encoge todo: por el número de bolas y por el sitio que hay (área por bola).
const crowd=()=>Math.min(clamp(1.15-order.length/260,.55,1),clamp(Math.sqrt(st.W*st.H/(Math.max(order.length,1)*2600)),.42,1));
const targetR=n=>(10+Math.min(degree(n.id),9)*1.8)*st.S*crowd();
// Con zoom las bolas crecen menos que las distancias (√z en vez de z): así se separan y caben los nombres.
const rz=()=>1/Math.sqrt(cam.z);
const birthScale=n=>{const t=st.now-n.born;if(t<0)return 0;return reduce?1:elastic(t/.7);};
export function hit(x,y,exclude){let best=null,bd=1e9;for(const n of nodes.values()){if(n.id===exclude||st.now<n.born)continue;const d=Math.hypot(n.x-x,n.y-y);const lim=Math.max(n.r*rz()*1.5,24*st.S/cam.z);if(d<lim&&d<bd){bd=d;best=n;}}return best;}
export function step(dt){const S=st.S,f=dt*60,cx=st.W/2,cy=st.H/2,arr=[...nodes.values()];
 for(const n of arr){n.pulse=Math.max(0,n.pulse-dt*1.5);n.shake=Math.max(0,n.shake-dt);const tr=targetR(n);n.r=n.r?n.r+(tr-n.r)*Math.min(1,dt*8):tr;}
 const corte=3.2*Math.sqrt(st.W*st.H/Math.max(arr.length,1)); // alcance de la repulsión: unas 3 distancias típicas
 for(let i=0;i<arr.length;i++)for(let j=i+1;j<arr.length;j++){const a=arr[i],b=arr[j];let dx=b.x-a.x,dy=b.y-a.y,d2=dx*dx+dy*dy;
  if(d2<1){dx=Math.random()-.5;dy=Math.random()-.5;d2=1;}const d=Math.sqrt(d2);if(d>corte)continue;let fr=1500*S*S*crowd()*crowd()/d2*(1-d/corte);const minD=a.r+b.r+10*S*crowd();if(d<minD)fr+=(minD-d)*.06;
  const ux=dx/d,uy=dy/d;a.vx-=ux*fr*f;a.vy-=uy*fr*f;b.vx+=ux*fr*f;b.vy+=uy*fr*f;}
 for(const n of arr){const p=BY[n.id].p;if(!p)continue;for(const pid of p){const q=nodes.get(pid);if(!q)continue;const dx=n.x-q.x,dy=n.y-q.y,d=Math.hypot(dx,dy)||1;
  const k=(d-88*S*crowd())*.0032*f,ux=dx/d,uy=dy/d;n.vx-=ux*k;n.vy-=uy*k;q.vx+=ux*k*.4;q.vy+=uy*k*.4;}}
 const damp=Math.pow(.86,f);
 const g=.00144/crowd(),R=Math.min(st.W,st.H)*.34,m=36*S;
 for(const n of arr){const[ang,rf]=ZONA[BY[n.id].fam],a=ang*Math.PI/180;
  n.vx+=(cx+Math.cos(a)*R*rf-n.x)*g*f;n.vy+=(cy+Math.sin(a)*R*rf-n.y)*g*f;
  // Bordes blandos: cerca del borde, un empujón hacia dentro (el clamp de abajo queda de tope).
  if(n.x<m)n.vx+=(m-n.x)*.03*f;if(n.x>st.W-m)n.vx-=(n.x-st.W+m)*.03*f;if(n.y<m)n.vy+=(m-n.y)*.03*f;if(n.y>st.H-m)n.vy-=(n.y-st.H+m)*.03*f;
  n.vx*=damp;n.vy*=damp;
  n.x+=n.vx*f;n.y+=n.vy*f;n.x=clamp(n.x,20,st.W-20);n.y=clamp(n.y,20,st.H-20);}}

/* ---------- Dibujo ---------- */
export function circle(x,y,r){ctx.beginPath();ctx.arc(x,y,Math.max(0,r),0,TAU);}
function drawBg(){const W=st.W,H=st.H;ctx.fillStyle='#06070d';ctx.fillRect(0,0,W,H);
 const recent=order.slice(-2);const spots=[[.28,.32],[.74,.7]];
 recent.forEach((id,i)=>{const[x,y]=spots[i];const g=ctx.createRadialGradient(W*x,H*y,0,W*x,H*y,Math.max(W,H)*.6);g.addColorStop(0,rgba(BY[id].hex,.09));g.addColorStop(1,rgba(BY[id].hex,0));ctx.fillStyle=g;ctx.fillRect(0,0,W,H);});
 for(const s of st.stars){const a=.2+.25*(reduce?1:Math.sin(st.now*s.sp+s.ph)*.5+.5);ctx.fillStyle=`rgba(220,225,255,${a})`;circle(s.x*W,s.y*H,s.r);ctx.fill();}}
function drawLinks(){const {selected,hover}=st;ctx.globalCompositeOperation='lighter';
 for(const n of nodes.values()){const p=BY[n.id].p;if(!p)continue;const sc=birthScale(n);if(sc<=0)continue;
  for(const pid of p){const q=nodes.get(pid);if(!q)continue;const hl=selected===n.id||selected===pid||(hover&&(hover.id===n.id||hover.id===pid));
   const g=ctx.createLinearGradient(q.x,q.y,n.x,n.y);const a=(hl?.75:.26)*Math.min(1,sc);g.addColorStop(0,rgba(BY[pid].hex,a));g.addColorStop(1,rgba(BY[n.id].hex,a));
   ctx.strokeStyle=g;ctx.lineWidth=(hl?1.8:1.1)*Math.max(st.S,.8)/Math.sqrt(cam.z);ctx.beginPath();ctx.moveTo(q.x,q.y);ctx.lineTo(n.x,n.y);ctx.stroke();}}
 ctx.globalCompositeOperation='source-over';}
const nodePos=n=>[n.x+(n.shake?Math.sin(st.now*55)*n.shake*7*st.S:0),n.y];
function drawNode(n){const sc=birthScale(n)*rz();if(sc<=0)return;const hex=BY[n.id].hex,[x,y]=nodePos(n);
 const r=n.r*sc*(reduce?1:1+.035*Math.sin(st.now*1.8+n.ph))*(1+n.pulse*.35);const dark=lum(hex)<.16;
 ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(x,y,r*.2,x,y,r*3.4);
 const hc=dark?'#8c8aa8':hex;g.addColorStop(0,rgba(hc,dark?.3:.55));g.addColorStop(.35,rgba(hc,dark?.1:.17));g.addColorStop(1,rgba(hc,0));ctx.fillStyle=g;circle(x,y,r*3.4);ctx.fill();
 ctx.globalCompositeOperation='source-over';
 const c=ctx.createRadialGradient(x-r*.25,y-r*.25,0,x,y,r);c.addColorStop(0,lighten(hex,dark?.25:.62));c.addColorStop(.55,hex);c.addColorStop(1,hex);ctx.fillStyle=c;circle(x,y,r);ctx.fill();
 if(dark){ctx.strokeStyle='rgba(220,218,240,.35)';ctx.lineWidth=1;circle(x,y,r);ctx.stroke();}
 if(!pending(n.id).length&&KIDS[n.id].length&&sc>=1){ctx.strokeStyle=rgba(hex,.35);ctx.lineWidth=1;ctx.setLineDash([2,4]);circle(x,y,r+4*st.S*rz());ctx.stroke();ctx.setLineDash([]);}}
function drawRings(){const {selected,hover,drag,S}=st;
 // La bola de la que sale la muestra que se arrastra (T-11): un anillo discontinuo, para saber de dónde viene.
 if(drag&&drag.started&&drag.from==='node'&&nodes.has(drag.id)){const n=nodes.get(drag.id);const[x,y]=nodePos(n);ctx.strokeStyle=rgba(BY[n.id].hex,.8);ctx.lineWidth=1.4;ctx.setLineDash([3,4]);circle(x,y,(n.r+6*S)*rz());ctx.stroke();ctx.setLineDash([]);}
 if(selected&&nodes.has(selected)){const n=nodes.get(selected);const[x,y]=nodePos(n);ctx.strokeStyle='rgba(236,232,255,.75)';ctx.lineWidth=1.4;circle(x,y,(n.r*birthScale(n)+7*S)*rz());ctx.stroke();}
 if(drag&&drag.started&&hover){const[x,y]=nodePos(hover);const r=(hover.r+10*S+Math.sin(st.now*8)*2)*rz();ctx.strokeStyle=rgba(BY[drag.id].hex,.95);ctx.lineWidth=2.2;circle(x,y,r);ctx.stroke();
  ctx.strokeStyle='rgba(255,255,255,.35)';ctx.lineWidth=1;circle(x,y,r+5*S*rz());ctx.stroke();}}
// Los nombres se dibujan a tamaño fijo en pantalla (por eso el /cam.z) y salen todos cuando hay
// sitio: pocas bolas, o con zoom suficiente para que entre una y otra quepa un nombre (T-12).
function drawLabels(){const S=st.S,k=1/cam.z,hueco=Math.sqrt(st.W*st.H/Math.max(order.length,1))*cam.z;
 const showAll=(S>=.8&&order.length<=60)||order.length<=14||hueco>=62;
 ctx.font=`500 ${Math.round(11.5*Math.max(S,.9))*k}px Karla, system-ui, sans-serif`;ctx.textAlign='center';ctx.textBaseline='top';
 for(const n of nodes.values()){const sc=birthScale(n);if(sc<.6)continue;const on=st.selected===n.id||st.hover===n;if(!showAll&&!on)continue;
  const[x,y]=nodePos(n);ctx.fillStyle=on?'rgba(244,242,250,.95)':'rgba(220,216,236,.58)';ctx.fillText(BY[n.id].name,x,y+n.r*sc*rz()+7*S*k);}}
export function draw(){ctx.setTransform(st.DPR,0,0,st.DPR,0,0);drawBg();
 // El fondo de estrellas no se mueve; lo demás, con la cámara.
 ctx.setTransform(st.DPR*cam.z,0,0,st.DPR*cam.z,st.DPR*cam.x,st.DPR*cam.y);drawLinks();
 for(const n of nodes.values())drawNode(n);
 st.effects=st.effects.filter(e=>{const el=st.now-e.t0;if(el>e.dur)return false;e.draw(el);return true;});
 drawRings();drawLabels();}
