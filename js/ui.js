/* ---------- Avisos, barra superior y modo desarrollador (#dev) ---------- */
import {DATA,BY,BASICS,gen} from './data.js';
import {st,nodes,order,openFams,addNode} from './state.js';
import {renderPalette,updateProgress} from './palette.js';
import {openLore,closeLore} from './lore.js';
import {wheel} from './wheel.js';
import {TAU,$} from './utils.js';

export const hint=$('hint');
const toastEl=$('toast');

/* ---------- Avisos ---------- */
let toastT;
export function toast(html,id,label){toastEl.innerHTML=`<span style="display:flex;gap:10px;align-items:center;min-width:0">${html}</span>`+(id?`<button type="button">${label}</button>`:'');
 toastEl.hidden=false;toastEl.classList.remove('show');void toastEl.offsetWidth;toastEl.classList.add('show');clearTimeout(toastT);
 toastT=setTimeout(()=>{toastEl.hidden=true;},id?5200:2800);
 if(id)toastEl.querySelector('button').onclick=()=>{openLore(id);toastEl.hidden=true;};}

/* ---------- Partida nueva: los cinco básicos en pentágono ---------- */
export function reset(){nodes.clear();order.length=0;st.effects=[];st.selected=null;st.hover=null;closeLore();toastEl.hidden=true;openFams.clear();
 BASICS.forEach((id,i)=>{const a=-Math.PI/2+i*TAU/5;addNode(id,st.W/2+Math.cos(a)*120*st.S,st.H/2+Math.sin(a)*120*st.S,i*.09);openFams.add(BY[id].fam);});
 renderPalette();updateProgress();hint.hidden=false;}
$('reset').onclick=reset;

window.addEventListener('keydown',e=>{if(e.key==='Escape'){if(!wheel.hidden)wheel.hidden=true;else closeLore();}});

/* ---------- Modo desarrollador: «Revelar todo» sólo con #dev en la URL ---------- */
function syncDev(){$('reveal').hidden=location.hash!=='#dev';}
window.addEventListener('hashchange',syncDev);syncDev();
$('reveal').onclick=()=>{let i=0;const todo=DATA.filter(d=>!nodes.has(d.id)).sort((a,b)=>gen(a.id)-gen(b.id));
 for(const d of todo){const a=nodes.get(d.p[0]),b=nodes.get(d.p[1]);const ang=Math.random()*TAU;
  addNode(d.id,(a.x+b.x)/2+Math.cos(ang)*30*st.S,(a.y+b.y)/2+Math.sin(ang)*30*st.S,i*.05);openFams.add(d.fam);i++;}
 renderPalette();updateProgress();hint.hidden=true;if(st.selected)openLore(st.selected);};
