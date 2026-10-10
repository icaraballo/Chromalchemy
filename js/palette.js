/* ---------- Paleta por familias y barra de progreso ---------- */
import {DATA,FAMS,BY,KIDS} from './data.js';
import {st,nodes,order,openFams,pending} from './state.js';
import {esc,$} from './utils.js';

export const palList=$('palList');

export function renderPalette(){
 palList.innerHTML=FAMS.map(([fid,fname,fc])=>{
  const all=DATA.filter(d=>d.fam===fid), got=all.filter(d=>nodes.has(d.id)), left=all.length-got.length;
  const open=openFams.has(fid);
  const items=got.map(d=>{const pen=pending(d.id).length;const bd=KIDS[d.id].length?(pen?`<span class="bd" title="Mezclas por descubrir">${pen}</span>`:`<span class="bd done" title="Ya has sacado todas sus mezclas">✓</span>`):'';
   return`<div class="pi${d.id===st.lastNew?' new':''}" data-id="${d.id}" tabindex="0" role="button" aria-label="${esc(d.name)}. Arrastra para mezclar, pulsa para ver su historia"><span class="sw" style="--c:${d.hex}"></span><span class="nm">${esc(d.name)}</span>${bd}</div>`;}).join('');
  const slots=left?`<div class="slots">${'<span class="slot">?</span>'.repeat(left)}<small>${left} por descubrir</small></div>`:'';
  return`<div class="fam${open?' open':''}" data-fam="${fid}" style="--fam:${fc}"><button type="button" class="fam-h" aria-expanded="${open}"><span class="chev"></span><span class="fn">${fname}</span><span class="mini"><b style="width:${got.length/all.length*100}%"></b></span><span class="fc">${got.length}/${all.length}</span></button><div class="fam-b">${items}${slots}</div></div>`;
 }).join('');
 st.lastNew=null;
}
palList.addEventListener('click',e=>{const h=e.target.closest('.fam-h');if(!h)return;const f=h.parentElement.dataset.fam;openFams.has(f)?openFams.delete(f):openFams.add(f);renderPalette();});

$('tot').textContent=DATA.length;
export function updateProgress(){$('cnt').textContent=order.length;$('bar').innerHTML=order.map(id=>`<span style="flex:0 0 ${100/DATA.length}%;background:${BY[id].hex}"></span>`).join('');}
