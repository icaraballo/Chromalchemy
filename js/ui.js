/* ---------- Avisos, barra superior y modo desarrollador (#dev) ---------- */
import {DATA,FAMS,BY,BASICS,gen} from './data.js';
import {st,nodes,order,openFams,logros,addNode,guardar,leerGuardado} from './state.js';
import {renderPalette,updateProgress} from './palette.js';
import {openLore,closeLore} from './lore.js';
import {wheel} from './wheel.js';
import {resetCam} from './camera.js';
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

/* ---------- Logros ----------
   La mitad y el total de cada familia (v1.1); el 25, 50 y 75 % de la gama y todas las
   leyendas (v1.9). Arriba de la constelación, para no pisar el aviso de «Nuevo color», que va
   abajo. Si llegan dos a la vez, el segundo espera a que se vaya el primero. */
const logroEl=$('logro');
const GAMA='conic-gradient(#D7263D,#F5C518,#2E9E4A,#2262D6,#9B4FB0,#D7263D)';
const cola=[];let logroT=null;
function siguienteLogro(){const l=cola.shift();if(!l){logroT=null;logroEl.hidden=true;return;}
 logroEl.style.setProperty('--fam',l.color);
 logroEl.innerHTML=`<span class="logro-dot"${l.dot?` style="background:${l.dot}"`:''}></span><span><small>Logro · ${l.eb}</small><em>${l.titulo}</em><small>${l.sub}</small></span>`;
 logroEl.hidden=false;logroEl.classList.remove('show');void logroEl.offsetWidth;logroEl.classList.add('show');
 logroT=setTimeout(siguienteLogro,4500);}
function mostrarLogro(l){cola.push(l);if(!logroT)siguienteLogro();}
function quitarLogros(){cola.length=0;clearTimeout(logroT);logroT=null;logroEl.hidden=true;}
export function logro(fid,completa){const [,fname,fc]=FAMS.find(f=>f[0]===fid);const all=DATA.filter(d=>d.fam===fid),got=all.filter(d=>nodes.has(d.id)).length;
 const nombre=fname.toLowerCase();
 mostrarLogro({color:fc,eb:completa?'familia completa':'la mitad',titulo:completa?`Todos los ${nombre}`:`Ya tienes la mitad de los ${nombre}`,sub:`${got} de ${all.length} colores`});}
export function logroGama(pct){
 mostrarLogro({color:'#C9BEFF',dot:GAMA,eb:`${pct} % de la gama`,titulo:pct===25?'Un cuarto de la gama':pct===50?'Media gama descubierta':'Tres cuartos de la gama',sub:`${order.length} de ${DATA.length} colores`});}
export function logroLeyendas(n){mostrarLogro({color:'#C79BFF',eb:'leyendas',titulo:'Todos los colores con leyenda',sub:`Las ${n} historias que no se pueden probar`});}
logroEl.onclick=()=>{clearTimeout(logroT);siguienteLogro();};

/* ---------- Partida nueva: los cinco básicos en pentágono ---------- */
export function reset(){resetCam();st.pista=null;nodes.clear();order.length=0;logros.clear();st.effects=[];st.selected=null;st.hover=null;closeLore();toastEl.hidden=true;quitarLogros();openFams.clear();
 BASICS.forEach((id,i)=>{const a=-Math.PI/2+i*TAU/5;addNode(id,st.W/2+Math.cos(a)*120*st.S,st.H/2+Math.sin(a)*120*st.S,i*.09);openFams.add(BY[id].fam);});
 renderPalette();updateProgress();hint.hidden=false;guardar();dispatchEvent(new Event('pistas'));}
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
 // Partidas de antes de la v1.9: lo de la gama y las leyendas que ya estuviera conseguido se
 // da por visto, para que no salten todos de golpe en el siguiente color.
 for(const pct of [25,50,75])if(order.length>=Math.ceil(DATA.length*pct/100))logros.add('gama:'+pct);
 if(DATA.filter(d=>d.cert==='ley'||(d.nota&&d.nota.cert==='ley')).every(d=>nodes.has(d.id)))logros.add('leyendas');
 const p=g.pista;st.pista=p&&BY[p.id]&&BY[p.id].p&&!nodes.has(p.id)&&p.paso>=1&&p.paso<=3?{id:p.id,paso:p.paso|0}:null;
 dispatchEvent(new Event('pistas'));
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
 renderPalette();updateProgress();hint.hidden=true;if(st.selected)openLore(st.selected);dispatchEvent(new Event('pistas'));};
