/* ---------- Datos: colores, recetas, historias verificadas ----------
   Se cargan de data/colores.json (módulo con await en la raíz: el resto de módulos
   no arranca hasta que los datos están). cert: doc = Documentado · disc = Discutido · ley = Leyenda */
const res = await fetch(new URL('../data/colores.json', import.meta.url));
if (!res.ok) throw new Error('No se pudo cargar data/colores.json (' + res.status + ')');
const raw = await res.json();

// El JSON guarda la receta en `parents` y las fuentes como [título, url]; el juego usa `p` y {t, u}.
export const DATA = raw.map(d => ({...d, p: d.parents, src: d.src.map(([t, u]) => ({t, u}))}));

export const FAMS=[['rojos','Rojos','#D7263D'],['rosas','Rosas','#F4A6B8'],['naranjas','Naranjas','#F07F1A'],['amarillos','Amarillos','#F5C518'],['verdes','Verdes','#2E9E4A'],['azules','Azules','#2262D6'],['violetas','Violetas','#9B4FB0'],['marrones','Marrones','#7A4A24'],['blancos','Blancos','#F2F0EA'],['grises','Grises','#8A8A92'],['negros','Negros','#3A3A44']];
export const CERT={doc:'Documentado',disc:'Discutido',ley:'Leyenda'};
export const BY={}, REC={};
export const key=(a,b)=>a<b?a+'|'+b:b+'|'+a;
DATA.forEach(d=>{BY[d.id]=d; if(d.p) REC[key(d.p[0],d.p[1])]=d.id;});
export const KIDS={};DATA.forEach(d=>KIDS[d.id]=DATA.filter(c=>c.p&&c.p.includes(d.id)).map(c=>c.id));
const genMemo={};
export function gen(id){ if(genMemo[id]!=null) return genMemo[id]; const d=BY[id]; return genMemo[id]= d.p? Math.max(gen(d.p[0]),gen(d.p[1]))+1 : 0; }
export const GEN_LABEL={0:'Color básico'};for(let i=1;i<=12;i++)GEN_LABEL[i]='Mezcla de nivel '+i;
export const BASICS=['rojo','amarillo','azul','blanco','negro'];
