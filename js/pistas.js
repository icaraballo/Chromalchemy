/* ---------- Pistas (T-09, v1.8) ----------
   Una escalera de tres escalones sobre un color que ya se puede hacer (sus dos ingredientes
   están descubiertos): 1, un acertijo; 2, un ingrediente; 3, los dos. Se pide desde el botón
   «Pista» (elige el más fácil) o tocando un «?» de la paleta (uno de esa familia). La pista se
   queda fija hasta descubrir ese color: pedir otra sube un escalón, no cambia de color.
   Son libres; tras FALLOS mezclas seguidas que no dan nada, el botón brilla.
   El acertijo: el campo `acertijo` del JSON cuando exista; mientras, el «Por qué se llama así»
   con el nombre tapado. */
import {DATA,FAMS,BY,gen} from './data.js';
import {st,nodes,guardar} from './state.js';
import {toast,hint} from './ui.js';
import {esc,$} from './utils.js';

const FALLOS=8;
const UNO={rojos:'un rojo',rosas:'un rosa',naranjas:'un naranja',amarillos:'un amarillo',verdes:'un verde',azules:'un azul',violetas:'un violeta',marrones:'un marrón',blancos:'un blanco',grises:'un gris',negros:'un negro'};
const btn=$('pistaBtn'), card=$('pCard'), pill=$('pPill');
let fallos=0, abierta=false; // abierta: la tarjeta del acertijo a la vista (si no, la pastilla)

const alcanzables=fam=>DATA.filter(d=>d.p&&!nodes.has(d.id)&&(!fam||d.fam===fam)&&nodes.has(d.p[0])&&nodes.has(d.p[1]));
// El de menor nivel; entre iguales, al azar.
function elegir(fam){const c=alcanzables(fam);if(!c.length)return null;const g=Math.min(...c.map(d=>gen(d.id)));const f=c.filter(d=>gen(d.id)===g);return f[Math.floor(Math.random()*f.length)].id;}

const norm=s=>s.normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase();
const VACIAS=new Set(['de','del','la','el','los','las','y','en','con']);
// Tapa en el texto las palabras del nombre (y sus formas: «Burdeos», «marron» de «Marrón»).
function tapar(t,name){const ws=name.split(/[\s-]+/).filter(w=>w.length>2&&!VACIAS.has(norm(w))).map(norm);
 return esc(t).replace(/[\p{L}·]+/gu,m=>{const a=norm(m);return ws.some(b=>a===b||(b.length>4&&a.startsWith(b.slice(0,-1))))?'<span class="tapado">___</span>':m;});}
const acertijo=d=>d.acertijo?esc(d.acertijo):tapar(d.nombre,d.name);

const puntos=n=>`<span class="dots" aria-label="Pista ${n} de 3">${[1,2,3].map(i=>`<i${i<=n?' class="on"':''}></i>`).join('')}</span>`;
export function pintar(){const p=st.pista;btn.classList.toggle('brilla',fallos>=FALLOS&&!p);st.pistaIngr=ingredientes();
 if(!p){card.hidden=pill.hidden=true;return;}
 const d=BY[p.id],[a,b]=d.p.map(x=>`<b>${esc(BY[x].name)}</b>`);
 if(p.paso===1&&abierta){pill.hidden=true;card.hidden=false;
  card.innerHTML=`<button type="button" class="x" data-p="cerrar" aria-label="Quitar la pista">×</button><div class="eb"><span>Pista · ${UNO[d.fam]}</span>${puntos(1)}</div><p>${acertijo(d)}</p><div class="row"><button type="button" class="luego" data-p="luego">Lo intento</button><button type="button" class="mas" data-p="mas">Otra pista</button></div>`;return;}
 card.hidden=true;pill.hidden=false;
 const txt=p.paso===1?`<button type="button" class="ver" data-p="ver">Pista · ${UNO[d.fam]}</button>`:p.paso===2?`<span>Un ingrediente es ${a}</span>`:`<span>${a} + ${b}</span>`;
 pill.innerHTML=`<span class="q">?</span>${txt}${puntos(p.paso)}${p.paso<3?'<button type="button" class="mas" data-p="mas">Otra</button>':''}<button type="button" class="x" data-p="cerrar" aria-label="Quitar la pista">×</button>`;}

// Los ingredientes que la pista deja ver: la constelación los ilumina y les pone el nombre.
export const ingredientes=()=>{const p=st.pista;return !p||p.paso<2?[]:p.paso===2?[BY[p.id].p[0]]:BY[p.id].p;};

/* Pedir una pista: sin familia, la que haya o la más fácil; con familia (un «?»), una de esa familia. */
export function pedir(fam){fallos=0;
 const p=st.pista;
 if(p&&(!fam||BY[p.id].fam===fam)){abierta=p.paso===1;pintar();return;}   // ya hay una: se enseña
 const id=elegir(fam);
 if(!id){if(!fam){toast('Ya no queda nada por descubrir.');return;}
  const [,fname]=FAMS.find(f=>f[0]===fam);
  const otra=FAMS.map(f=>[f,alcanzables(f[0]).length]).filter(x=>x[1]).sort((x,y)=>y[1]-x[1])[0];
  toast(`En los <b>${fname.toLowerCase()}</b> aún no puedes hacer nada nuevo: te falta algún ingrediente.`+(otra?` Prueba en los <b>${otra[0][1].toLowerCase()}</b>.`:''));return;}
 st.pista={id,paso:1};abierta=true;hint.hidden=true;guardar();pintar();}
function mas(){const p=st.pista;if(!p)return;p.paso=Math.min(3,p.paso+1);abierta=false;guardar();pintar();}
function quitar(){st.pista=null;abierta=false;guardar();pintar();}

// Lo llama la mezcla: un fallo suma; un color nuevo pone a cero y, si era el de la pista, la cierra.
export function alMezclar(nuevo){if(!nuevo){fallos++;pintar();return;}
 fallos=0;if(st.pista&&nodes.has(st.pista.id)){st.pista=null;abierta=false;}pintar();}

btn.onclick=()=>pedir();
// Un «?» de la paleta pide una pista de su familia.
$('palList').addEventListener('click',e=>{const s=e.target.closest('.slot');if(s)pedir(s.closest('.fam').dataset.fam);});
for(const el of [card,pill])el.addEventListener('click',e=>{const a=e.target.closest('[data-p]');if(!a)return;
 ({luego:()=>{abierta=false;pintar();},ver:()=>{abierta=true;pintar();},mas,cerrar:quitar})[a.dataset.p]();});
// Reiniciar, cargar partida y «Revelar todo» cambian st.pista desde ui.js: avisan con este evento.
window.addEventListener('pistas',()=>{if(st.pista&&nodes.has(st.pista.id))st.pista=null;abierta=false;fallos=0;pintar();});
