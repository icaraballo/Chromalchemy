/* ---------- Ficha de historia ---------- */
import {FAMS,CERT,BY,KIDS,gen,GEN_LABEL} from './data.js';
import {st,nodes,pending,mezclas} from './state.js';
import {rgb,rgba,lighten,darken,lum,esc,$} from './utils.js';

export const lore=$('lore');

const chip=id=>{const d=BY[id];return`<button type="button" class="chip" data-go="${id}"><i style="--c:${d.hex}"></i>${esc(d.name)}</button>`;};
const badge=c=>`<span class="cert ${c}">${CERT[c]}</span>`;
export function openLore(id){const d=BY[id];st.selected=id;const dark=lum(d.hex)<.16;
 $('lOrb').style.background=`radial-gradient(circle at 34% 30%, ${lighten(d.hex,.55)}, ${d.hex} 52%, ${darken(d.hex,.45)})`;
 $('lOrb').style.boxShadow=`0 0 36px -4px ${dark?'rgba(150,148,180,.5)':rgba(d.hex,.75)}, inset 0 0 0 1px rgba(255,255,255,.12)`;
 $('lGen').textContent=GEN_LABEL[gen(id)]+' · '+FAMS.find(f=>f[0]===d.fam)[1];$('lName').textContent=d.name;
 const[r,g,b]=rgb(d.hex);$('lHex').textContent=`${d.hex.toUpperCase()} · rgb ${r} ${g} ${b}`;
 $('lRecipe').innerHTML=d.p?`${chip(d.p[0])}<span>+</span>${chip(d.p[1])}`:`<span>Uno de los cinco colores con los que empieza la partida.</span>`;
 $('lNombre').textContent=d.nombre;$('lHist').textContent=d.historia;
 const c=$('lCert');c.className='cert '+d.cert;c.textContent=CERT[d.cert];
 $('lNota').innerHTML=d.nota?`<div class="nota">${badge(d.nota.cert)}${esc(d.nota.t)}</div>`:'';
 const kids=KIDS[id],pen=pending(id),known=kids.filter(k=>nodes.has(k));
 let ph='';
 if(!kids.length)ph=`<div class="pend-t">De este color no sale ninguna mezcla nueva.</div>`;
 else if(pen.length){
  // Partidas en las que ya se pueden hacer y las que necesitan un color que aún no tienes (T-16).
  const {ahora,luego}=mezclas(id),q=`<b>${pen.length} ${pen.length===1?'mezcla':'mezclas'}</b>`,nm=esc(d.name);
  const t=!luego.length?`Te quedan ${q} con ${nm}, y ya ${pen.length===1?'puedes hacerla':'puedes hacerlas'}.`
   :!ahora.length?`Te quedan ${q} con ${nm}, pero antes necesitas otros colores.`
   :`Te quedan ${q} con ${nm}: <b>${ahora.length}</b> ya ${ahora.length===1?'se puede hacer':'se pueden hacer'} y ${luego.length} ${luego.length===1?'necesita':'necesitan'} un color que aún no tienes.`;
  ph=`<div class="pend-t">${t}</div><div class="qrow">${'<span class="ya">?</span>'.repeat(ahora.length)}${'<span>?</span>'.repeat(luego.length)}</div>`;}
 else ph=`<div class="pend-t"><b style="color:var(--doc)">✓</b> Has sacado todas las mezclas de ${esc(d.name)}.</div>`;
 if(known.length)ph+=`<div class="done-list"><span class="lbl">Ya sacadas:</span>${known.map(chip).join('')}</div>`;
 $('lPend').innerHTML=ph;
 $('lSrc').innerHTML=d.src.map(x=>`<li><a href="${x.u}" target="_blank" rel="noopener">${esc(x.t)}</a></li>`).join('');
 lore.hidden=false;}
export function closeLore(){lore.hidden=true;st.selected=null;}
$('loreClose').onclick=closeLore;
lore.addEventListener('click',e=>{const b=e.target.closest('[data-go]');if(b&&nodes.has(b.dataset.go)){openLore(b.dataset.go);lore.scrollTop=0;}});
