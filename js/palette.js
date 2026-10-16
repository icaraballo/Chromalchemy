/* ---------- Paleta por familias, tira de colores y barra de progreso ---------- */
import {DATA,FAMS,BY,KIDS,gen} from './data.js';
import {st,nodes,order,openFams,pending,ahora} from './state.js';
import {esc,$} from './utils.js';

export const palList=$('palList'), strip=$('strip');

/* El puntito (T-16): «aquí hay algo que puedes descubrir ya». El mismo en tus colores (con
   alguna mezcla posible ahora, en el ordenador y en el móvil; ya no se dice cuántas: eso va en la
   ficha) y en la cabecera de las familias con algún color posible. Los «?» no lo llevan. */
const PUNTO_COLOR='<span class="bd pt" title="Con este color puedes descubrir algo ahora" aria-label="Con este color puedes descubrir algo ahora"></span>';
const PUNTO_FAM='<i class="pt" title="Aquí puedes descubrir algo ahora" aria-label="Aquí puedes descubrir algo ahora"></i>';
const pi=(d,bd)=>`<div class="pi${d.id===st.lastNew?' new':''}" data-id="${d.id}" tabindex="0" role="button" aria-label="${esc(d.name)}. Arrastra para mezclar, pulsa para ver su historia"><span class="sw" style="--c:${d.hex}"></span><span class="nm">${esc(d.name)}</span>${bd}</div>`;

export function renderPalette(){const ya=ahora();
 palList.innerHTML=FAMS.map(([fid,fname,fc])=>{
  const all=DATA.filter(d=>d.fam===fid), got=all.filter(d=>nodes.has(d.id)), left=all.length-got.length;
  const open=openFams.has(fid);
  const items=got.map(d=>pi(d,KIDS[d.id].length?(ya.colores.has(d.id)?PUNTO_COLOR:pending(d.id).length?'':`<span class="bd done" title="Ya has sacado todas sus mezclas">✓</span>`):'')).join('');
  // Un «?» por color que falta, en su hueco fijo: por nivel y, a igual nivel, en el orden del JSON (T-16).
  const faltan=all.filter(d=>!nodes.has(d.id)).sort((a,b)=>gen(a.id)-gen(b.id));
  const slots=left?`<div class="slots">${faltan.map(d=>`<span class="slot${st.pista&&st.pista.id===d.id?' ilum':''}" data-id="${d.id}" tabindex="0" role="button" title="Pedir una pista de este color">?</span>`).join('')}<small>${left} por descubrir</small></div>`:'';
  // Familia completa: el nombre, el contador y la barrita en dorado, con un ✦.
  return`<div class="fam${open?' open':''}${left?'':' completa'}" data-fam="${fid}" style="--fam:${fc}"><button type="button" class="fam-h" aria-expanded="${open}"><span class="chev"></span><span class="fn">${fname}${left?'':'<i class="estrella" aria-label="familia completa"> ✦</i>'}${left&&ya.fams.has(fid)?PUNTO_FAM:''}</span><span class="mini"><b style="width:${got.length/all.length*100}%"></b></span><span class="fc">${got.length}/${all.length}</span></button><div class="fam-b">${items}${slots}</div></div>`;
 }).join('');
 // La tira de la hoja plegada, en el móvil (T-10): todos tus colores en una fila, el último primero.
 strip.innerHTML=[...order].reverse().map(id=>pi(BY[id],ya.colores.has(id)?PUNTO_COLOR:'')).join('');
 strip.scrollLeft=0;
 st.lastNew=null;
}
palList.addEventListener('click',e=>{const h=e.target.closest('.fam-h');if(!h)return;const f=h.parentElement.dataset.fam;openFams.has(f)?openFams.delete(f):openFams.add(f);renderPalette();});

$('tot').textContent=DATA.length;
export function updateProgress(){$('cnt').textContent=order.length;$('palGot').textContent=`${order.length} ${order.length===1?'descubierto':'descubiertos'}`;const q=DATA.length-order.length;$('palLeft').textContent=q?`${q} por descubrir`:'Gama completa';$('bar').innerHTML=order.map(id=>`<span style="flex:0 0 ${100/DATA.length}%;background:${BY[id].hex}"></span>`).join('');}
