/* ---------- Arrastrar, desplazarse y hacer zoom ----------
   Arrastrar un color, desde la paleta o desde la constelación, lleva una muestra (la bola
   fantasma) y la suelta encima de otro: la constelación se queda quieta (T-11, v1.6). Un toque
   sin mover (< 6 px) abre la ficha. En táctil, desde la paleta sólo arrastra la bolita del
   color: el resto de la fila deja hacer scroll.
   En la constelación (T-12): un dedo en el fondo la desplaza, dos dedos hacen zoom; con ratón,
   la rueda hace zoom y arrastrar el fondo la desplaza. */
import {BY} from './data.js';
import {st} from './state.js';
import {cv,hit} from './constellation.js';
import {cam,toWorld,zoomTo,panBy} from './camera.js';
import {palList,strip} from './palette.js';
import {plegar} from './sheet.js';
import {openLore,closeLore} from './lore.js';
import {hint} from './ui.js';
import {mix} from './game.js';
import {rgba,lighten,darken,$} from './utils.js';

const ghost=$('ghost');

const scr=e=>{const r=cv.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top};};
// Punto del mundo (de la simulación) bajo el dedo, y si está dentro del lienzo.
function local(e){const r=cv.getBoundingClientRect(),s=scr(e);return{...toWorld(s.x,s.y),inside:e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom};}

/* ---------- Desde la paleta (la columna o la hoja, y la tira de la hoja plegada) ---------- */
function palDown(e){const it=e.target.closest('.pi');if(!it)return;
 if(e.pointerType==='mouse'){if(e.button!==0)return;e.preventDefault();}
 else if(!e.target.closest('.sw')){st.drag={id:it.dataset.id,from:'pal',pid:e.pointerId,sx:e.clientX,sy:e.clientY,type:e.pointerType,started:false,tapOnly:true};return;}
 st.drag={id:it.dataset.id,from:'pal',pid:e.pointerId,sx:e.clientX,sy:e.clientY,type:e.pointerType,started:false};}
function palKey(e){const it=e.target.closest('.pi');if(it&&(e.key==='Enter'||e.key===' ')){e.preventDefault();openLore(it.dataset.id);}}
for(const el of [palList,strip]){el.addEventListener('pointerdown',palDown);el.addEventListener('keydown',palKey);}

/* ---------- En la constelación ---------- */
const dedos=new Map(); // punteros apoyados en el lienzo: id → punto de la pantalla
let pellizco=null, fondo=null;
cv.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&e.button!==0)return;e.preventDefault();
 dedos.set(e.pointerId,scr(e));
 if(dedos.size===2){cancelar();fondo=null;const[a,b]=[...dedos.values()];   // segundo dedo: zoom, y se olvida lo demás
  pellizco={d:Math.hypot(a.x-b.x,a.y-b.y)||1,z:cam.z,w:toWorld((a.x+b.x)/2,(a.y+b.y)/2)};return;}
 if(dedos.size>2)return;
 const p=local(e),n=hit(p.x,p.y);
 if(n)st.drag={id:n.id,from:'node',pid:e.pointerId,sx:e.clientX,sy:e.clientY,type:e.pointerType,started:false};
 else fondo={pid:e.pointerId,sx:e.clientX,sy:e.clientY,lx:e.clientX,ly:e.clientY,movido:false};});
cv.addEventListener('wheel',e=>{e.preventDefault();const s=scr(e);zoomTo(cam.z*Math.exp(-e.deltaY*.0015),toWorld(s.x,s.y),s.x,s.y);},{passive:false});

function startDrag(){const drag=st.drag;drag.started=true;document.body.classList.add('dragging');hint.hidden=true;
 const hex=BY[drag.id].hex;ghost.style.background=`radial-gradient(circle at 34% 30%, ${lighten(hex,.55)}, ${hex} 55%, ${darken(hex,.4)})`;ghost.style.boxShadow=`0 0 26px ${rgba(hex,.8)}`;ghost.hidden=false;
 if(drag.from==='pal')plegar();} // en el móvil la hoja se baja, para ver dónde se suelta
window.addEventListener('pointermove',e=>{
 if(dedos.has(e.pointerId)){dedos.set(e.pointerId,scr(e));
  if(pellizco&&dedos.size>=2){const[a,b]=[...dedos.values()];zoomTo(pellizco.z*Math.hypot(a.x-b.x,a.y-b.y)/pellizco.d,pellizco.w,(a.x+b.x)/2,(a.y+b.y)/2);return;}}
 if(fondo&&e.pointerId===fondo.pid){if(!fondo.movido&&Math.hypot(e.clientX-fondo.sx,e.clientY-fondo.sy)<6)return;
  if(!fondo.movido){fondo.movido=true;document.body.classList.add('panning');getSelection().removeAllRanges();}panBy(e.clientX-fondo.lx,e.clientY-fondo.ly);fondo.lx=e.clientX;fondo.ly=e.clientY;return;}
 const drag=st.drag;
 if(!drag){if(e.target===cv){const p=local(e);st.hover=hit(p.x,p.y);cv.style.cursor=st.hover?'grab':cam.z>1?'move':'default';}return;}
 if(e.pointerId!==drag.pid)return;
 if(!drag.started){if(Math.hypot(e.clientX-drag.sx,e.clientY-drag.sy)<6)return;if(drag.tapOnly){st.drag=null;return;}startDrag();}
 const p=local(e);
 ghost.style.left=e.clientX+'px';ghost.style.top=e.clientY+'px';
 st.hover=p.inside?hit(p.x,p.y,drag.id):null;});
function cancelar(){if(!st.drag)return;st.drag=null;st.hover=null;ghost.hidden=true;document.body.classList.remove('dragging');}
function soltar(e,cancel){dedos.delete(e.pointerId);if(dedos.size<2)pellizco=null;
 if(fondo&&e.pointerId===fondo.pid){if(!fondo.movido&&!cancel)closeLore();fondo=null;document.body.classList.remove('panning');return;} // un toque en el fondo cierra la ficha
 const d=st.drag;if(!d||e.pointerId!==d.pid)return;st.drag=null;ghost.hidden=true;document.body.classList.remove('dragging');
 if(d.started){if(st.hover&&!cancel)mix(d.id,st.hover.id);st.hover=null;}
 else if(!cancel)openLore(d.id);}
window.addEventListener('pointerup',e=>soltar(e,false));
window.addEventListener('pointercancel',e=>soltar(e,true));
