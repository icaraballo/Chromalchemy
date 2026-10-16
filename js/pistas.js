/* ---------- Pistas (T-09, v1.8) ----------
   Una escalera de tres escalones sobre un color que ya se puede hacer (sus dos ingredientes
   están descubiertos): 1, un acertijo; 2, un ingrediente; 3, los dos. Se pide desde el botón
   «Pista» (elige el más fácil) o tocando un «?» de la paleta. Cada «?» es un color (T-16,
   v1.13): da la pista de ese color o, si aún no se puede hacer, la del primero de su cadena que
   sí (posibles.js), con «Aún no se puede. Antes te faltan N colores». Tocar un «?» cambia de
   color y empieza en el escalón 1; «Otra pista» sube un escalón sobre el mismo color. Mientras
   dura la pista, su «?» se ilumina.
   Son libres; tras FALLOS mezclas seguidas que no dan nada, el botón brilla.
   El acertijo: el campo `acertijo` del JSON (lo tienen los 241, v1.12); si faltara, el «Por qué
   se llama así» con el nombre tapado. */
import {DATA,BY,gen} from './data.js';
import {st,nodes,openFams,guardar,posible,cadena} from './state.js';
import {renderPalette} from './palette.js';
import {toast,hint} from './ui.js';
import {esc,$} from './utils.js';

const FALLOS=8;
const UNO={rojos:'un rojo',rosas:'un rosa',naranjas:'un naranja',amarillos:'un amarillo',verdes:'un verde',azules:'un azul',violetas:'un violeta',marrones:'un marrón',blancos:'un blanco',grises:'un gris',negros:'un negro'};
const btn=$('pistaBtn'), card=$('pCard'), pill=$('pPill');
let fallos=0, abierta=false; // abierta: la tarjeta del acertijo a la vista (si no, la pastilla)

// El de menor nivel; entre iguales, al azar.
function elegir(){const c=DATA.filter(d=>posible(d.id));if(!c.length)return null;const g=Math.min(...c.map(d=>gen(d.id)));const f=c.filter(d=>gen(d.id)===g);return f[Math.floor(Math.random()*f.length)].id;}

const norm=s=>s.normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase();
const VACIAS=new Set(['de','del','la','el','los','las','y','en','con']);
// Tapa en el texto las palabras del nombre (y sus formas: «Burdeos», «marron» de «Marrón»).
function tapar(t,name){const ws=name.split(/[\s-]+/).filter(w=>w.length>2&&!VACIAS.has(norm(w))).map(norm);
 return esc(t).replace(/[\p{L}·]+/gu,m=>{const a=norm(m);return ws.some(b=>a===b||(b.length>4&&a.startsWith(b.slice(0,-1))))?'<span class="tapado">___</span>':m;});}
const acertijo=d=>d.acertijo?esc(d.acertijo):tapar(d.nombre,d.name);

// Si la pista vino de un «?» que aún no se podía hacer: cuántos colores le faltan a aquél.
function aun(){const p=st.pista,c=p&&p.desde&&cadena(p.desde);if(!c||c.t!==p.id)return'';
 return c.n===1?'<b>Aún no se puede.</b> Antes te falta <b>un color</b>. Empieza por él:':`<b>Aún no se puede.</b> Antes te faltan <b>${c.n} colores</b>. Empieza por este:`;}
// El «?» del color de la pista, iluminado en la paleta.
function iluminar(){const id=st.pista&&st.pista.id;for(const s of document.querySelectorAll('.slot'))s.classList.toggle('ilum',s.dataset.id===id);}

const puntos=n=>`<span class="dots" aria-label="Pista ${n} de 3">${[1,2,3].map(i=>`<i${i<=n?' class="on"':''}></i>`).join('')}</span>`;
export function pintar(){const p=st.pista;btn.classList.toggle('brilla',fallos>=FALLOS&&!p);st.pistaIngr=ingredientes();iluminar();
 if(!p){card.hidden=pill.hidden=true;return;}
 const d=BY[p.id],[a,b]=d.p.map(x=>`<b>${esc(BY[x].name)}</b>`);
 if(p.paso===1&&abierta){pill.hidden=true;card.hidden=false;
  card.innerHTML=`<button type="button" class="x" data-p="cerrar" aria-label="Quitar la pista">×</button><div class="eb"><span>Pista · ${UNO[d.fam]}</span>${puntos(1)}</div>${aun()?`<p class="aun">${aun()}</p>`:''}<p>${acertijo(d)}</p><div class="row"><button type="button" class="luego" data-p="luego">Lo intento</button><button type="button" class="mas" data-p="mas">Otra pista</button></div>`;return;}
 card.hidden=true;pill.hidden=false;
 const txt=p.paso===1?`<button type="button" class="ver" data-p="ver">Pista · ${UNO[d.fam]}</button>`:p.paso===2?`<span>Un ingrediente es ${a}</span>`:`<span>${a} + ${b}</span>`;
 pill.innerHTML=`<span class="q">?</span>${txt}${puntos(p.paso)}${p.paso<3?'<button type="button" class="mas" data-p="mas">Otra</button>':''}<button type="button" class="x" data-p="cerrar" aria-label="Quitar la pista">×</button>`;}

// Los ingredientes que la pista deja ver: la constelación los ilumina y les pone el nombre.
export const ingredientes=()=>{const p=st.pista;return !p||p.paso<2?[]:p.paso===2?[BY[p.id].p[0]]:BY[p.id].p;};

/* El botón «Pista»: la que haya o, si no, la más fácil. */
export function pedir(){fallos=0;
 if(st.pista){abierta=st.pista.paso===1;pintar();return;}   // ya hay una: se enseña
 const id=elegir();
 if(!id){toast('Ya no queda nada por descubrir.');return;}
 empezar(id);}
function empezar(id,desde){st.pista={id,paso:1,...(desde?{desde}:{})};st.pistasUsadas++;abierta=true;hint.hidden=true;guardar();pintar();}

/* Un «?» de la paleta: la pista de ese color, o la del primero de su cadena que ya se puede hacer.
   Si lleva al color de la pista en curso, se enseña como esté, sin bajar de escalón. */
function pedirColor(x){const c=cadena(x);if(!c)return;fallos=0;
 const desde=x!==c.t?x:undefined,p=st.pista;
 if(p&&p.id===c.t){if(desde)p.desde=desde;else delete p.desde;abierta=p.paso===1;guardar();pintar();
  if(desde&&p.paso>1)toast(`Aún no se puede: antes te ${c.n===1?'falta un color':`faltan ${c.n} colores`}. Sigue con la pista que tienes.`);
  return;}
 const fam=BY[c.t].fam;if(!openFams.has(fam)){openFams.add(fam);renderPalette();}   // si está en otra familia, se despliega
 empezar(c.t,desde);
 const s=document.querySelector(`.slot[data-id="${c.t}"]`);if(s)s.scrollIntoView({block:'nearest',behavior:'smooth'});}
function mas(){const p=st.pista;if(!p)return;p.paso=Math.min(3,p.paso+1);abierta=false;guardar();pintar();}
function quitar(){st.pista=null;abierta=false;guardar();pintar();}

// Lo llama la mezcla: un fallo suma; un color nuevo pone a cero y, si era el de la pista, la cierra.
export function alMezclar(nuevo){if(!nuevo){fallos++;pintar();return;}
 fallos=0;if(st.pista&&nodes.has(st.pista.id)){st.pista=null;abierta=false;}pintar();}

btn.onclick=()=>pedir();
// Un «?» de la paleta pide la pista de su color.
$('palList').addEventListener('click',e=>{const s=e.target.closest('.slot');if(s)pedirColor(s.dataset.id);});
$('palList').addEventListener('keydown',e=>{const s=e.target.closest('.slot');if(s&&(e.key==='Enter'||e.key===' ')){e.preventDefault();pedirColor(s.dataset.id);}});
for(const el of [card,pill])el.addEventListener('click',e=>{const a=e.target.closest('[data-p]');if(!a)return;
 ({luego:()=>{abierta=false;pintar();},ver:()=>{abierta=true;pintar();},mas,cerrar:quitar})[a.dataset.p]();});
// Reiniciar, cargar partida y «Revelar todo» cambian st.pista desde ui.js: avisan con este evento.
window.addEventListener('pistas',()=>{if(st.pista&&nodes.has(st.pista.id))st.pista=null;abierta=false;fallos=0;pintar();});
