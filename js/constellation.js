/* ---------- Constelación: simulación de fuerzas y dibujo en canvas ---------- */
import {DATA,BY,KIDS} from './data.js';
import {st,nodes,order,pending,ahora} from './state.js';
import {cam,clampCam} from './camera.js';
import {drawGesto} from './gesto.js';
import {rgb,rgba,lighten,lum,TAU,clamp,elastic,reduce,$} from './utils.js';

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
/* ---------- Bolas movidas a mano (T-17, v1.14) ----------
   La que se arrastra sigue al dedo (st.mueve); al soltarla se queda anclada en ese punto
   (n.fija = [x, y] en fracciones del lienzo, para que valga al girar el móvil o en otra ventana)
   y deja de ir a la zona de su familia. Ni una ni otra se mueven con las fuerzas: las demás sí,
   y sus unidas las siguen por los muelles. Mientras se arrastra, las unidas de su familia tiran
   más fuerte (la siguen de cerca) que las de otras familias. «Reordenar» las suelta todas. */
const reordenar=$('reordenar');
const quieta=n=>st.mueve&&st.mueve.id===n.id||!!n.fija;
const SIGUE_FAM=3.2, SIGUE_OTRA=1.3; // cuánto más tiran los muelles de la que se arrastra
export function hayFijas(){for(const n of nodes.values())if(n.fija)return true;return false;}
export function soltarTodas(){for(const n of nodes.values())delete n.fija;}
export function step(dt){const S=st.S,f=dt*60,cx=st.W/2,cy=st.H/2,arr=[...nodes.values()];
 const m0=st.mueve&&nodes.get(st.mueve.id);
 for(const n of arr)if(n.fija&&n!==m0){n.x=n.fija[0]*st.W;n.y=n.fija[1]*st.H;}
 if(m0){m0.x=st.mueve.x;m0.y=st.mueve.y;}
 const hay=arr.some(n=>n.fija);if(reordenar.hidden===hay)reordenar.hidden=!hay;
 for(const n of arr){n.pulse=Math.max(0,n.pulse-dt*1.5);n.shake=Math.max(0,n.shake-dt);const tr=targetR(n);n.r=n.r?n.r+(tr-n.r)*Math.min(1,dt*8):tr;}
 const corte=3.2*Math.sqrt(st.W*st.H/Math.max(arr.length,1)); // alcance de la repulsión: unas 3 distancias típicas
 for(let i=0;i<arr.length;i++)for(let j=i+1;j<arr.length;j++){const a=arr[i],b=arr[j];let dx=b.x-a.x,dy=b.y-a.y,d2=dx*dx+dy*dy;
  if(d2<1){dx=Math.random()-.5;dy=Math.random()-.5;d2=1;}const d=Math.sqrt(d2);if(d>corte)continue;let fr=1500*S*S*crowd()*crowd()/d2*(1-d/corte);const minD=a.r+b.r+10*S*crowd();if(d<minD)fr+=(minD-d)*.06;
  const ux=dx/d,uy=dy/d;a.vx-=ux*fr*f;a.vy-=uy*fr*f;b.vx+=ux*fr*f;b.vy+=uy*fr*f;}
 for(const n of arr){const p=BY[n.id].p;if(!p)continue;for(const pid of p){const q=nodes.get(pid);if(!q)continue;const dx=n.x-q.x,dy=n.y-q.y,d=Math.hypot(dx,dy)||1;
  let k=(d-88*S*crowd())*.0032*f;const ux=dx/d,uy=dy/d;
  if(m0&&(m0===n||m0===q))k*=BY[n.id].fam===BY[q.id].fam?SIGUE_FAM:SIGUE_OTRA;
  n.vx-=ux*k;n.vy-=uy*k;q.vx+=ux*k*(m0===n?1:.4);q.vy+=uy*k*(m0===n?1:.4);}}
 const damp=Math.pow(.86,f);
 const g=.00144/crowd(),R=Math.min(st.W,st.H)*.34,m=36*S;
 for(const n of arr){const[ang,rf]=ZONA[BY[n.id].fam],a=ang*Math.PI/180;
  n.vx+=(cx+Math.cos(a)*R*rf-n.x)*g*f;n.vy+=(cy+Math.sin(a)*R*rf-n.y)*g*f;
  // Bordes blandos: cerca del borde, un empujón hacia dentro (el clamp de abajo queda de tope).
  if(n.x<m)n.vx+=(m-n.x)*.03*f;if(n.x>st.W-m)n.vx-=(n.x-st.W+m)*.03*f;if(n.y<m)n.vy+=(m-n.y)*.03*f;if(n.y>st.H-m)n.vy-=(n.y-st.H+m)*.03*f;
  n.vx*=damp;n.vy*=damp;
  if(quieta(n)){n.vx=n.vy=0;continue;}
  n.x+=n.vx*f;n.y+=n.vy*f;n.x=clamp(n.x,20,st.W-20);n.y=clamp(n.y,20,st.H-20);}}

/* ---------- Dibujo ---------- */
export function circle(x,y,r){ctx.beginPath();ctx.arc(x,y,Math.max(0,r),0,TAU);}
// Las estrellas, fijas en la pantalla. El color de fondo va con las nebulosas (drawNebulas).
function drawStars(){const W=st.W,H=st.H;
 for(const s of st.stars){const a=.2+.25*(reduce?1:Math.sin(st.now*s.sp+s.ph)*.5+.5);ctx.fillStyle=`rgba(220,225,255,${a})`;circle(s.x*W,s.y*H,s.r);ctx.fill();}}
/* ---------- El cielo que se va pintando (T-20, v1.19) ----------
   Una nebulosa por familia, en su zona (ZONA), del color medio de lo que ya tienes de ella; crece
   y se aviva con la parte descubierta de la familia. Son del mundo (se mueven con la cámara) y van
   debajo de los hilos. Se pintan aparte, en un lienzo fuera de pantalla, y sólo se rehacen al
   descubrir un color, al reiniciar o al cambiar el tamaño: no en cada fotograma. Ese lienzo lleva
   también el color de fondo, así que pintarlo sustituye al relleno del fondo en vez de sumar otra
   pasada de pantalla entera (con 246 bolas y la CPU ×4 bajaba de 59 a 51 imágenes por segundo), y
   va a media resolución: son degradados, no se nota. Con zoom, el mundo sigue cubriendo la
   pantalla entera (clampCam), así que el fondo nunca queda al aire. */
const FAM_TOTAL={};for(const d of DATA)FAM_TOTAL[d.fam]=(FAM_TOTAL[d.fam]||0)+1;
const NEB_R=[.13,.46], NEB_A=[.07,.3];   // radio (× el lado corto) e intensidad en el centro, de poco a la familia entera
const aHex=c=>'#'+c.map(v=>Math.round(v).toString(16).padStart(2,'0')).join('');
const neb=document.createElement('canvas'),nctx=neb.getContext('2d');let nebClave='';
const NEB_RES=.5;
function pintarNebulosas(){const W=st.W,H=st.H,D=NEB_RES;neb.width=Math.max(1,Math.round(W*D));neb.height=Math.max(1,Math.round(H*D));
 nctx.setTransform(D,0,0,D,0,0);nctx.fillStyle='#06070d';nctx.fillRect(0,0,W,H);dibujarNebulosas(nctx);}
// Sólo las nebulosas, en coordenadas del mundo y sin el fondo (también para el póster).
export function dibujarNebulosas(c){const W=st.W,H=st.H;
 const suma={};for(const id of order){const d=BY[id],c=rgb(d.hex),s=suma[d.fam]||(suma[d.fam]={n:0,r:0,g:0,b:0});s.n++;s.r+=c[0];s.g+=c[1];s.b+=c[2];}
 const R=Math.min(W,H)*.34,lado=Math.min(W,H);
 for(const[fam,s]of Object.entries(suma)){const f=s.n/FAM_TOTAL[fam],[ang,rf]=ZONA[fam],a=ang*Math.PI/180;
  // El color medio de la familia; el de los negros, aclarado para que se vea sobre el fondo.
  let m=[s.r,s.g,s.b].map(v=>v/s.n);if(lum(aHex(m))<.16)m=m.map(v=>v+(255-v)*.35);
  const hex=aHex(m);
  const x=W/2+Math.cos(a)*R*rf,y=H/2+Math.sin(a)*R*rf,r=lado*(NEB_R[0]+(NEB_R[1]-NEB_R[0])*f),al=NEB_A[0]+(NEB_A[1]-NEB_A[0])*f;
  const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,rgba(hex,al));g.addColorStop(.45,rgba(hex,al*.45));g.addColorStop(1,rgba(hex,0));
  c.fillStyle=g;c.beginPath();c.arc(x,y,r,0,TAU);c.fill();}}
function drawNebulas(){const k=order.length+':'+order[order.length-1]+':'+st.W+'x'+st.H;
 if(k!==nebClave){nebClave=k;pintarNebulosas();}
 ctx.drawImage(neb,0,0,st.W,st.H);}
// El brillo de más de un hilo recién encendido por la chispa (n.chispa = instante en que llega).
function encendido(n){if(!n.chispa)return 0;const t=st.now-n.chispa;return t<0?0:t>1?(delete n.chispa,0):1-t;}
function drawLinks(){const {selected,hover}=st;ctx.globalCompositeOperation='lighter';
 for(const n of nodes.values()){const p=BY[n.id].p;if(!p)continue;const sc=birthScale(n);if(sc<=0)continue;
  const en=encendido(n);
  for(const pid of p){const q=nodes.get(pid);if(!q)continue;const sel=selected===n.id||selected===pid||(hover&&(hover.id===n.id||hover.id===pid)),hl=sel||en>0;
   const g=ctx.createLinearGradient(q.x,q.y,n.x,n.y);const a=(.26+.49*(sel?1:en))*Math.min(1,sc);g.addColorStop(0,rgba(BY[pid].hex,a));g.addColorStop(1,rgba(BY[n.id].hex,a));
   ctx.strokeStyle=g;ctx.lineWidth=(hl?1.8:1.1)*Math.max(st.S,.8)/Math.sqrt(cam.z);ctx.beginPath();ctx.moveTo(q.x,q.y);ctx.lineTo(n.x,n.y);ctx.stroke();}}
 ctx.globalCompositeOperation='source-over';}
const nodePos=n=>[n.x+(n.shake?Math.sin(st.now*55)*n.shake*7*st.S:0),n.y];
// Las bolas con alguna mezcla posible ahora (T-16) laten el doble de amplio y con el halo algo
// más vivo: sutil, para quien se fije. Con «reducir movimiento», sólo el halo.
function drawNode(n){const sc=birthScale(n)*rz();if(sc<=0)return;const hex=BY[n.id].hex,[x,y]=nodePos(n),vivo=ahora().colores.has(n.id);
 const r=n.r*sc*(reduce?1:1+(vivo?.07:.035)*Math.sin(st.now*1.8+n.ph))*(1+n.pulse*.35);const dark=lum(hex)<.16,h=vivo?1.4:1;
 ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(x,y,r*.2,x,y,r*3.4);
 const hc=dark?'#8c8aa8':hex;g.addColorStop(0,rgba(hc,(dark?.3:.55)*h));g.addColorStop(.35,rgba(hc,(dark?.1:.17)*h));g.addColorStop(1,rgba(hc,0));ctx.fillStyle=g;circle(x,y,r*3.4);ctx.fill();
 ctx.globalCompositeOperation='source-over';
 const c=ctx.createRadialGradient(x-r*.25,y-r*.25,0,x,y,r);c.addColorStop(0,lighten(hex,dark?.25:.62));c.addColorStop(.55,hex);c.addColorStop(1,hex);ctx.fillStyle=c;circle(x,y,r);ctx.fill();
 if(dark){ctx.strokeStyle='rgba(220,218,240,.35)';ctx.lineWidth=1;circle(x,y,r);ctx.stroke();}
 if(!pending(n.id).length&&KIDS[n.id].length&&sc>=1){ctx.strokeStyle=rgba(hex,.35);ctx.lineWidth=1;ctx.setLineDash([2,4]);circle(x,y,r+4*st.S*rz());ctx.stroke();ctx.setLineDash([]);}}
function drawRings(){const {selected,hover,drag,S}=st;
 // La bola cogida para mezclar (mantener pulsado 0,5 s, T-17): un anillo discontinuo que entra
 // creciendo, para que se note el instante en que «ya la tienes», y se queda mientras se arrastra la muestra.
 if(drag&&drag.cogida&&nodes.has(drag.id)){const n=nodes.get(drag.id);const[x,y]=nodePos(n),e=reduce?1:elastic(Math.min(1,(st.now-drag.cogida)/.35));
  ctx.strokeStyle=rgba(BY[n.id].hex,.8);ctx.lineWidth=1.4;ctx.setLineDash([3,4]);circle(x,y,(n.r*e+6*S)*rz());ctx.stroke();ctx.setLineDash([]);}
 if(selected&&nodes.has(selected)){const n=nodes.get(selected);const[x,y]=nodePos(n);ctx.strokeStyle='rgba(236,232,255,.75)';ctx.lineWidth=1.4;circle(x,y,(n.r*birthScale(n)+7*S)*rz());ctx.stroke();}
 // Los ingredientes de la pista (T-09): un aro que late, del color de acento.
 for(const id of st.pistaIngr){const n=nodes.get(id);if(!n)continue;const[x,y]=nodePos(n),k=Math.sin(st.now*3.2)*.5+.5,r=(n.r+9*S)*rz()+k*3*S/cam.z;
  ctx.strokeStyle='rgba(201,190,255,.95)';ctx.lineWidth=2.2/Math.sqrt(cam.z);circle(x,y,r);ctx.stroke();ctx.strokeStyle=`rgba(201,190,255,${.12+.18*k})`;ctx.lineWidth=7/Math.sqrt(cam.z);circle(x,y,r+4*S/cam.z);ctx.stroke();}
 if(drag&&drag.started&&hover){const[x,y]=nodePos(hover);const r=(hover.r+10*S+Math.sin(st.now*8)*2)*rz();ctx.strokeStyle=rgba(BY[drag.id].hex,.95);ctx.lineWidth=2.2;circle(x,y,r);ctx.stroke();
  ctx.strokeStyle='rgba(255,255,255,.35)';ctx.lineWidth=1;circle(x,y,r+5*S*rz());ctx.stroke();}}
// Los nombres se dibujan a tamaño fijo en pantalla (por eso el /cam.z) y salen todos cuando hay
// sitio: pocas bolas, o con zoom suficiente para que entre una y otra quepa un nombre (T-12).
function drawLabels(){const S=st.S,k=1/cam.z,hueco=Math.sqrt(st.W*st.H/Math.max(order.length,1))*cam.z;
 const showAll=(S>=.8&&order.length<=60)||order.length<=14||(cam.z>1.05&&hueco>=62);
 ctx.font=`500 ${Math.round(11.5*Math.max(S,.9))*k}px Karla, system-ui, sans-serif`;ctx.textAlign='center';ctx.textBaseline='top';
 for(const n of nodes.values()){const sc=birthScale(n);if(sc<.6)continue;const on=st.selected===n.id||st.hover===n||st.pistaIngr.includes(n.id);if(!showAll&&!on)continue;
  const[x,y]=nodePos(n);ctx.fillStyle=on?'rgba(244,242,250,.95)':'rgba(220,216,236,.58)';ctx.fillText(BY[n.id].name,x,y+n.r*sc*rz()+7*S*k+(st.pistaIngr.includes(n.id)?12*S*rz():0));}}
export function draw(){const mundo=()=>ctx.setTransform(st.DPR*cam.z,0,0,st.DPR*cam.z,st.DPR*cam.x,st.DPR*cam.y);
 // El fondo y las nebulosas, con la cámara; las estrellas no se mueven; lo demás, con la cámara.
 mundo();drawNebulas();ctx.setTransform(st.DPR,0,0,st.DPR,0,0);drawStars();
 mundo();drawLinks();
 for(const n of nodes.values())drawNode(n);
 st.effects=st.effects.filter(e=>{const el=st.now-e.t0;if(el>e.dur)return false;e.draw(el);return true;});
 drawRings();drawGesto(ctx);drawLabels();}
