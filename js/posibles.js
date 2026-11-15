/* ---------- Qué se puede hacer ahora (T-16, v1.13) ----------
   Una sola fuente de verdad, sin DOM y sin cargar datos: recibe el catálogo ({id, p, fam}, en
   el orden del JSON) y, en cada consulta, lo descubierto (cualquier cosa con .has()). La usan
   la constelación, la paleta, la ficha y las pistas; npm test la prueba sobre colores.json.
   - posible(id): sin descubrir y con sus dos padres descubiertos.
   - mezclas(id): los hijos sin descubrir de un color, partidos en «ahora» (el otro padre ya
     está) y «luego» (aún falta).
   - famPosible(fam): si la familia tiene algún color posible.
   - cadena(id): para un color sin descubrir, el primero de su cadena que ya se puede hacer (t)
     y cuántos colores sin descubrir le faltan en total (n, sus antepasados que aún no tienes). */
export function crear(DATA){
 const BY={},IDX={},KIDS={},GEN={};
 DATA.forEach((d,i)=>{BY[d.id]=d;IDX[d.id]=i;KIDS[d.id]=[];});
 DATA.forEach(d=>{if(d.p)for(const x of d.p)KIDS[x].push(d.id);});
 const gen=id=>GEN[id]??(GEN[id]=BY[id].p?Math.max(gen(BY[id].p[0]),gen(BY[id].p[1]))+1:0);
 const posible=(id,tengo)=>!tengo.has(id)&&!!BY[id].p&&tengo.has(BY[id].p[0])&&tengo.has(BY[id].p[1]);
 function mezclas(id,tengo){const ahora=[],luego=[];
  for(const k of KIDS[id]){if(tengo.has(k))continue;const p=BY[k].p,otro=p[0]===id?p[1]:p[0];(tengo.has(otro)?ahora:luego).push(k);}
  return{ahora,luego};}
 const famPosible=(fam,tengo)=>DATA.some(d=>d.fam===fam&&posible(d.id,tengo));
 // Por qué padre seguir cuando faltan los dos: el de menor nivel y, a igual nivel, el que va
 // antes en el JSON (el «más fácil» del botón «Pista», sin azar: el mismo «?» lleva siempre al mismo sitio).
 const antes=(a,b)=>gen(a)-gen(b)||IDX[a]-IDX[b];
 function cadena(id,tengo){if(tengo.has(id))return null;
  const faltan=new Set(),pila=[id];
  while(pila.length){const p=BY[pila.pop()].p;if(!p)continue;for(const x of p)if(!tengo.has(x)&&!faltan.has(x)){faltan.add(x);pila.push(x);}}
  let t=id;
  for(let i=0;i<DATA.length&&!posible(t,tengo);i++){const f=BY[t].p.filter(x=>!tengo.has(x)).sort(antes);if(!f.length)break;t=f[0];}
  return posible(t,tengo)?{t,n:faltan.size}:null;} // null sólo si el JSON tuviera un ciclo
 /* Reconstruye y sanea una partida guardada sin depender del DOM (npm test la prueba):
    si cambió una receta en el JSON, conserva igualmente los colores ya descubiertos (H-01). */
 function reconstruir(g,BASICS){if(!g||typeof g!=='object'||!Array.isArray(g.order))return null;
  const orden=[...BASICS],vistos=new Set(BASICS),cola=[];
  for(const id of g.order)if(typeof id==='string'&&Object.hasOwn(BY,id)&&BY[id].p&&!vistos.has(id)&&!cola.includes(id))cola.push(id);
  let cambio=true;
  while(cambio){cambio=false;for(let i=0;i<cola.length;i++){const id=cola[i],[a,b]=BY[id].p;
   if(vistos.has(a)&&vistos.has(b)){vistos.add(id);orden.push(id);cola.splice(i--,1);cambio=true;}}}
  cambio=true;
  while(cambio){cambio=false;for(let i=0;i<cola.length;i++){const id=cola[i],[a,b]=BY[id].p;
   if(vistos.has(a)||vistos.has(b)){vistos.add(id);orden.push(id);cola.splice(i--,1);cambio=true;}}}
  for(const id of cola){vistos.add(id);orden.push(id);}
  const fijas={},gf=g.fijas&&typeof g.fijas==='object'?g.fijas:{};
  for(const id of orden)if(Object.hasOwn(gf,id)){const f=gf[id];
   if(Array.isArray(f)&&f.length===2&&f.every(v=>typeof v==='number'&&Number.isFinite(v)&&v>=0&&v<=1))fijas[id]=f;}
  const logros=Array.isArray(g.logros)?g.logros.filter(k=>typeof k==='string'):[];
  const pistas=Math.max(0,Number.isFinite(g.pistas)?g.pistas|0:0);
  const p=g.pista&&typeof g.pista==='object'?g.pista:null,paso=p?p.paso|0:0;
  const pista=p&&typeof p.id==='string'&&Object.hasOwn(BY,p.id)&&posible(p.id,vistos)&&paso>=1&&paso<=3
   ?{id:p.id,paso,...(typeof p.desde==='string'&&Object.hasOwn(BY,p.desde)&&BY[p.desde].p&&!vistos.has(p.desde)&&cadena(p.desde,vistos)?.t===p.id?{desde:p.desde}:{})}
   :null;
  const limpio=g.order.length===orden.length&&g.order.every((id,i)=>id===orden[i])&&(g.pistas===undefined||g.pistas===pistas);
  return{order:orden,fijas,logros,pistas,pista,limpio};}
 return{posible,mezclas,famPosible,cadena,gen,reconstruir};}
