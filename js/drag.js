/* ---------- Arrastrar: desde la paleta y desde la propia constelación ----------
   Un toque sin mover (< 6 px) abre la ficha. En táctil, desde la paleta sólo arrastra la
   bolita del color: el resto de la fila deja hacer scroll. */
import {BY} from './data.js';
import {st,nodes} from './state.js';
import {cv,hit} from './constellation.js';
import {palList} from './palette.js';
import {openLore,closeLore} from './lore.js';
import {hint} from './ui.js';
import {mix} from './game.js';
import {rgba,lighten,darken,$} from './utils.js';

const ghost=$('ghost');

function local(e){const r=cv.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top,inside:e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom};}
palList.addEventListener('pointerdown',e=>{const it=e.target.closest('.pi');if(!it)return;
 if(e.pointerType==='mouse'){if(e.button!==0)return;e.preventDefault();}
 else if(!e.target.closest('.sw')){st.drag={id:it.dataset.id,from:'pal',pid:e.pointerId,sx:e.clientX,sy:e.clientY,type:e.pointerType,started:false,tapOnly:true};return;}
 st.drag={id:it.dataset.id,from:'pal',pid:e.pointerId,sx:e.clientX,sy:e.clientY,type:e.pointerType,started:false};});
palList.addEventListener('keydown',e=>{const it=e.target.closest('.pi');if(it&&(e.key==='Enter'||e.key===' ')){e.preventDefault();openLore(it.dataset.id);}});
cv.addEventListener('pointerdown',e=>{const p=local(e);const n=hit(p.x,p.y);if(!n){closeLore();return;}e.preventDefault();
 st.drag={id:n.id,from:'node',pid:e.pointerId,sx:e.clientX,sy:e.clientY,type:e.pointerType,started:false};});
function startDrag(){const drag=st.drag;drag.started=true;document.body.classList.add('dragging');hint.hidden=true;
 if(drag.from==='pal'){const hex=BY[drag.id].hex;ghost.style.background=`radial-gradient(circle at 34% 30%, ${lighten(hex,.55)}, ${hex} 55%, ${darken(hex,.4)})`;ghost.style.boxShadow=`0 0 26px ${rgba(hex,.8)}`;ghost.hidden=false;}
 else nodes.get(drag.id).fixed=true;} // fija: deja de repeler a las demás mientras se arrastra
window.addEventListener('pointermove',e=>{const drag=st.drag;
 if(!drag){if(e.target===cv){const p=local(e);st.hover=hit(p.x,p.y);cv.style.cursor=st.hover?'grab':'default';}return;}
 if(e.pointerId!==drag.pid)return;
 if(!drag.started){if(Math.hypot(e.clientX-drag.sx,e.clientY-drag.sy)<6)return;if(drag.tapOnly){st.drag=null;return;}startDrag();}
 const p=local(e);
 if(drag.from==='pal'){ghost.style.left=e.clientX+'px';ghost.style.top=e.clientY+'px';st.hover=p.inside?hit(p.x,p.y):null;}
 else{const n=nodes.get(drag.id);if(n){n.x=p.x;n.y=p.y;}st.hover=hit(p.x,p.y,drag.id);}});
function endDrag(e,cancel){const d=st.drag;if(!d||e.pointerId!==d.pid)return;st.drag=null;ghost.hidden=true;document.body.classList.remove('dragging');
 if(d.started){if(st.hover&&!cancel)mix(d.id,st.hover.id);const n=nodes.get(d.id);if(d.from==='node'&&n){n.fixed=false;n.vx=n.vy=0;}st.hover=null;}
 else if(!cancel)openLore(d.id);}
window.addEventListener('pointerup',e=>endDrag(e,false));
window.addEventListener('pointercancel',e=>endDrag(e,true));
