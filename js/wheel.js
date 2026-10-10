/* ---------- Gama cromática («quesito») ----------
   Ángulo = tono, distancia = luminosidad, neutros en el centro. Los pendientes son huecos. */
import {DATA,FAMS,BY} from './data.js';
import {nodes,order} from './state.js';
import {openLore} from './lore.js';
import {hsl,clamp,esc,$} from './utils.js';

export const wheel=$('wheel');

function wheelPos(id){const[h,s,l]=hsl(BY[id].hex);
 if(s<.16||l<.12||l>.92){return{x:((h*7.3)%50)-25,y:(.5-l)*70,neutral:true};}
 const a=(h-90)*Math.PI/180;const rr=52+clamp((.9-l)/.75,0,1)*100;return{x:Math.cos(a)*rr,y:Math.sin(a)*rr};}
let WPOS=null;
// Separa los puntos que se solapan; se calcula una sola vez.
function layoutWheel(){const pts=DATA.map(d=>({id:d.id,...wheelPos(d.id)}));
 for(let it=0;it<60;it++)for(let i=0;i<pts.length;i++)for(let j=i+1;j<pts.length;j++){const a=pts[i],b=pts[j];let dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy)||.01;if(d<11.5){const m=(11.5-d)/2;dx/=d;dy/=d;a.x-=dx*m;a.y-=dy*m;b.x+=dx*m;b.y+=dy*m;}}
 WPOS={};pts.forEach(p=>WPOS[p.id]=p);}
function renderWheel(){if(!WPOS)layoutWheel();const svg=$('wheelSvg');let h='';
 for(let i=0;i<72;i++){const a0=(i*5-90-2.5)*Math.PI/180,a1=((i+1)*5-90-2.5)*Math.PI/180,R1=158,R2=166;
  h+=`<path d="M${(Math.cos(a0)*R1).toFixed(1)} ${(Math.sin(a0)*R1).toFixed(1)}L${(Math.cos(a0)*R2).toFixed(1)} ${(Math.sin(a0)*R2).toFixed(1)}A${R2} ${R2} 0 0 1 ${(Math.cos(a1)*R2).toFixed(1)} ${(Math.sin(a1)*R2).toFixed(1)}L${(Math.cos(a1)*R1).toFixed(1)} ${(Math.sin(a1)*R1).toFixed(1)}A${R1} ${R1} 0 0 0 ${(Math.cos(a0)*R1).toFixed(1)} ${(Math.sin(a0)*R1).toFixed(1)}Z" fill="hsl(${i*5},70%,55%)" fill-opacity=".55"/>`;}
 [50,100,150].forEach(r=>h+=`<circle cx="0" cy="0" r="${r}" fill="none" stroke="rgba(236,232,255,.06)"/>`);
 for(let i=0;i<12;i++){const a=(i*30-90)*Math.PI/180;h+=`<line x1="${(Math.cos(a)*30).toFixed(1)}" y1="${(Math.sin(a)*30).toFixed(1)}" x2="${(Math.cos(a)*156).toFixed(1)}" y2="${(Math.sin(a)*156).toFixed(1)}" stroke="rgba(236,232,255,.05)"/>`;}
 h+=`<circle cx="0" cy="0" r="40" fill="rgba(255,255,255,.025)" stroke="rgba(236,232,255,.08)"/>`;
 for(const d of DATA){const p=WPOS[d.id];
  if(nodes.has(d.id))h+=`<circle class="d" data-id="${d.id}" cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="5.2" fill="${d.hex}" stroke="rgba(255,255,255,.35)" stroke-width="1"><title>${esc(d.name)}</title></circle>`;
  else h+=`<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="4.8" fill="#0c0c13" stroke="rgba(236,232,255,.3)" stroke-dasharray="2 2.5"><title>Por descubrir</title></circle>`;}
 svg.innerHTML=h;
 $('famList').innerHTML=FAMS.map(([fid,fn,fc])=>{const all=DATA.filter(d=>d.fam===fid);const got=all.filter(d=>nodes.has(d.id)).length;return`<div class="famrow" style="--fam:${fc}"><i></i><span>${fn}</span><span>${got}/${all.length}</span></div>`;}).join('')+
  `<div class="famrow" style="margin-top:6px;padding-top:8px;border-top:1px solid var(--line)"><span></span><span><b>Total</b></span><span>${order.length}/${DATA.length}</span></div>`;}
$('openWheel').onclick=()=>{renderWheel();wheel.hidden=false;};
$('wheelClose').onclick=()=>{wheel.hidden=true;};
wheel.addEventListener('click',e=>{if(e.target===wheel){wheel.hidden=true;return;}const c=e.target.closest('circle.d');if(c){wheel.hidden=true;openLore(c.dataset.id);}});
