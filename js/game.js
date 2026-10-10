/* ---------- Mezcla: qué pasa al soltar un color sobre otro ---------- */
import {DATA,BY,REC,key} from './data.js';
import {st,nodes,order,openFams,logros,addNode,guardar} from './state.js';
import {burst,puff,ping} from './effects.js';
import {renderPalette,updateProgress} from './palette.js';
import {openLore} from './lore.js';
import {toast,hint,logro} from './ui.js';
import {TAU,esc} from './utils.js';

export function mix(aId,bId){const tgt=nodes.get(bId);if(!tgt)return;
 if(aId===bId){tgt.shake=.4;puff(tgt.x,tgt.y);toast('Mezclar un color consigo mismo no da nada nuevo.');return;}
 const res=REC[key(aId,bId)];
 if(!res){tgt.shake=.45;puff(tgt.x,tgt.y);toast(`<b>${esc(BY[aId].name)}</b> y <b>${esc(BY[bId].name)}</b> no reaccionan. Prueba otra pareja.`);return;}
 if(nodes.has(res)){const n=nodes.get(res);n.pulse=1;ping(n.x,n.y,BY[res].hex);toast(`Ya tienes <b>${esc(BY[res].name)}</b>.`,res,'Ver ficha');return;}
 discover(res,tgt.x,tgt.y,aId,bId);}
function discover(id,x,y,a,b){const col=BY[id].hex;
 const ang=Math.random()*TAU;const n=addNode(id,x+Math.cos(ang)*8,y+Math.sin(ang)*8,.12);n.vx=Math.cos(ang)*4;n.vy=Math.sin(ang)*4;
 burst(x,y,[BY[a].hex,BY[b].hex,col,col],col);
 st.lastNew=id;openFams.add(BY[id].fam);renderPalette();updateProgress();if(st.selected)openLore(st.selected);
 hint.hidden=true;
 comprobarLogro(BY[id].fam);guardar();
 if(order.length===DATA.length)toast(`<span class="dot" style="background:conic-gradient(#D7263D,#F5C518,#2E9E4A,#2262D6,#9B4FB0,#D7263D)"></span><span><small>Gama completa</small><em>Has descubierto los ${DATA.length} colores</em></span>`);
 else toast(`<span class="dot" style="background:${col};box-shadow:0 0 14px ${col}"></span><span><small>Nuevo color</small><em>${esc(BY[id].name)}</em></span>`,id,'Leer su historia');}
// Al llegar a la mitad o al total de una familia, una sola vez por partida.
function comprobarLogro(fam){const all=DATA.filter(d=>d.fam===fam),got=all.filter(d=>nodes.has(d.id)).length;
 if(got===all.length&&!logros.has(fam+':100')){logros.add(fam+':100');logros.add(fam+':50');logro(fam,true);}
 else if(got*2>=all.length&&!logros.has(fam+':50')){logros.add(fam+':50');logro(fam,false);}}
