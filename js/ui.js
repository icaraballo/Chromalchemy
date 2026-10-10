/* ---------- Avisos, barra superior y modo desarrollador (#dev) ---------- */
import {DATA,FAMS,BY,BASICS,gen} from './data.js';
import {st,nodes,order,openFams,logros,addNode,guardar,leerGuardado} from './state.js';
import {renderPalette,updateProgress} from './palette.js';
import {openLore,closeLore} from './lore.js';
import {wheel} from './wheel.js';
import {TAU,$} from './utils.js';

export const hint=$('hint');
const toastEl=$('toast');

/* ---------- Avisos ---------- */
let toastT;
// Un mensaje de texto suelto va en un solo <span>: si no, cada trozo («Ya tienes», la negrita, el punto) sería una columna del flex (CB-02).
export function toast(html,id,label){const body=html.startsWith('<span')?html:`<span>${html}</span>`;
 toastEl.innerHTML=`<span style="display:flex;gap:10px;align-items:center;min-width:0">${body}</span>`+(id?`<button type="button">${label}</button>`:'');
 toastEl.hidden=false;toastEl.classList.remove('show');void toastEl.offsetWidth;toastEl.classList.add('show');clearTimeout(toastT);
 toastT=setTimeout(()=>{toastEl.hidden=true;},id?5200:2800);
 if(id)toastEl.querySelector('button').onclick=()=>{openLore(id);toastEl.hidden=true;};}

/* ---------- Logros: la mitad y el total de cada familia ----------
   Arriba de la constelación, para no pisar el aviso de «Nuevo color», que va abajo. */
const logroEl=$('logro');
let logroT;
export function logro(fid,completa){const [,fname,fc]=FAMS.find(f=>f[0]===fid);const all=DATA.filter(d=>d.fam===fid),got=all.filter(d=>nodes.has(d.id)).length;
 const nombre=fname.toLowerCase();
 logroEl.style.setProperty('--fam',fc);
 logroEl.innerHTML=`<span class="logro-dot"></span><span><small>Logro · ${completa?'familia completa':'la mitad'}</small><em>${completa?`Todos los ${nombre}`:`Ya tienes la mitad de los ${nombre}`}</em><small>${got} de ${all.length} colores</small></span>`;
 logroEl.hidden=false;logroEl.classList.remove('show');void logroEl.offsetWidth;logroEl.classList.add('show');clearTimeout(logroT);
 logroT=setTimeout(()=>{logroEl.hidden=true;},4500);}
logroEl.onclick=()=>{logroEl.hidden=true;};

/* ---------- Partida nueva: los cinco básicos en pentágono ---------- */
export function reset(){nodes.clear();order.length=0;logros.clear();st.effects=[];st.selected=null;st.hover=null;closeLore();toastEl.hidden=true;logroEl.hidden=true;openFams.clear();
 BASICS.forEach((id,i)=>{const a=-Math.PI/2+i*TAU/5;addNode(id,st.W/2+Math.cos(a)*120*st.S,st.H/2+Math.sin(a)*120*st.S,i*.09);openFams.add(BY[id].fam);});
 renderPalette();updateProgress();hint.hidden=false;guardar();}
// Con la partida guardada, reiniciar borra de verdad: se pregunta antes si hay algo que perder.
$('reset').onclick=()=>{const n=order.length-BASICS.length;
 if(n>0&&!confirm(`¿Empezar de cero? Se borrarán los ${n} ${n===1?'color descubierto':'colores descubiertos'}.`))return;
 reset();};

/* ---------- Seguir la partida guardada ----------
   Los básicos en su pentágono y cada color junto a sus padres, en el orden en que se
   descubrieron; la simulación los asienta. Devuelve false si no hay nada que cargar. */
export function restaurar(){const g=leerGuardado();if(!g)return false;
 nodes.clear();order.length=0;logros.clear();openFams.clear();
 BASICS.forEach((id,i)=>{const a=-Math.PI/2+i*TAU/5;addNode(id,st.W/2+Math.cos(a)*120*st.S,st.H/2+Math.sin(a)*120*st.S,i*.09);openFams.add(BY[id].fam);});
 let i=0;
 for(const id of g.order){const d=BY[id];if(!d||nodes.has(id)||!d.p)continue;
  const a=nodes.get(d.p[0]),b=nodes.get(d.p[1]);if(!a||!b)continue; // guardado raro: se salta lo que no encaja
  const ang=Math.random()*TAU;addNode(id,(a.x+b.x)/2+Math.cos(ang)*30*st.S,(a.y+b.y)/2+Math.sin(ang)*30*st.S,.45+i*.01);i++;}
 (g.logros||[]).forEach(k=>{if(typeof k==='string')logros.add(k);});
 renderPalette();updateProgress();hint.hidden=order.length>BASICS.length;
 return true;}

window.addEventListener('keydown',e=>{if(e.key==='Escape'){if(!wheel.hidden)wheel.hidden=true;else closeLore();}});

/* ---------- Modo desarrollador: «Revelar todo» sólo con #dev en la URL ----------
   No guarda ni da logros: probar con #dev no estropea la partida de verdad, que vuelve al recargar. */
function syncDev(){$('reveal').hidden=location.hash!=='#dev';}
window.addEventListener('hashchange',syncDev);syncDev();
$('reveal').onclick=()=>{let i=0;const todo=DATA.filter(d=>!nodes.has(d.id)).sort((a,b)=>gen(a.id)-gen(b.id));
 for(const d of todo){const a=nodes.get(d.p[0]),b=nodes.get(d.p[1]);const ang=Math.random()*TAU;
  addNode(d.id,(a.x+b.x)/2+Math.cos(ang)*30*st.S,(a.y+b.y)/2+Math.sin(ang)*30*st.S,i*.05);openFams.add(d.fam);i++;}
 renderPalette();updateProgress();hint.hidden=true;if(st.selected)openLore(st.selected);};
