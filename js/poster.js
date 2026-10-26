/* ---------- El póster: la constelación (T-20, v1.20) ----------
   Una imagen 4:5 de 1080×1350 con la constelación tal como la tiene el jugador, en cualquier
   momento de la partida: arriba «Mi constelación» y el título; en medio las bolas, los hilos y las
   nebulosas (sin nombres, aros ni ayudas); abajo «N / 246 colores» y la dirección del juego. Se
   dibuja y se descarga en el propio navegador: nada sale de él. En los navegadores de dentro de
   las apps (LinkedIn, Facebook, Instagram) no se puede descargar: se abre la imagen para
   guardarla con una pulsación larga, y se dice. El botón va en la ventana de la gama. */
import {DATA,BY} from './data.js';
import {st,nodes,order} from './state.js';
import {dibujarNebulosas} from './constellation.js';
import {rgba,lighten,lum,TAU,$} from './utils.js';

const PW=1080, PH=1350, MARGEN=70, ARRIBA=250, ABAJO=150;
const enApp=/LinkedInApp|FBAN|FBAV|Instagram/i.test(navigator.userAgent);

function circ(c,x,y,r){c.beginPath();c.arc(x,y,Math.max(0,r),0,TAU);}
// Estrellas fijas para el póster (no las de la pantalla, que dependen de su tamaño).
function estrellas(c){let s=7;const r=()=>(s=(s*16807)%2147483647)/2147483647;
 for(let i=0;i<220;i++){c.fillStyle=`rgba(220,225,255,${.12+.35*r()})`;circ(c,r()*PW,r()*PH,r()*1.6+.3);c.fill();}}

export async function dibujarPoster(){
 await Promise.all(['italic 400 96px "Instrument Serif"','400 26px "IBM Plex Mono"'].map(f=>document.fonts.load(f).catch(()=>{})));
 const cv=document.createElement('canvas');cv.width=PW;cv.height=PH;const c=cv.getContext('2d');
 c.fillStyle='#06070d';c.fillRect(0,0,PW,PH);estrellas(c);
 // La constelación, encajada en el hueco del medio sin deformarla.
 const ns=[...nodes.values()];
 let x0=Math.min(...ns.map(n=>n.x-n.r*3)),x1=Math.max(...ns.map(n=>n.x+n.r*3)),y0=Math.min(...ns.map(n=>n.y-n.r*3)),y1=Math.max(...ns.map(n=>n.y+n.r*3));
 const aw=PW-2*MARGEN,ah=PH-ARRIBA-ABAJO,k=Math.min(aw/(x1-x0),ah/(y1-y0),3.2);
 const ox=MARGEN+(aw-(x1-x0)*k)/2-x0*k,oy=ARRIBA+(ah-(y1-y0)*k)/2-y0*k;
 c.save();c.setTransform(k,0,0,k,ox,oy);
 dibujarNebulosas(c);
 c.globalCompositeOperation='lighter';
 for(const n of ns){const p=BY[n.id].p;if(!p)continue;for(const pid of p){const q=nodes.get(pid);if(!q)continue;
  const g=c.createLinearGradient(q.x,q.y,n.x,n.y);g.addColorStop(0,rgba(BY[pid].hex,.3));g.addColorStop(1,rgba(BY[n.id].hex,.3));
  c.strokeStyle=g;c.lineWidth=1.3/k*1.6;c.beginPath();c.moveTo(q.x,q.y);c.lineTo(n.x,n.y);c.stroke();}}
 for(const n of ns){const hex=BY[n.id].hex,dark=lum(hex)<.16,r=n.r,hc=dark?'#8c8aa8':hex;
  const g=c.createRadialGradient(n.x,n.y,r*.2,n.x,n.y,r*3.4);g.addColorStop(0,rgba(hc,dark?.3:.55));g.addColorStop(.35,rgba(hc,dark?.1:.17));g.addColorStop(1,rgba(hc,0));
  c.fillStyle=g;circ(c,n.x,n.y,r*3.4);c.fill();}
 c.globalCompositeOperation='source-over';
 for(const n of ns){const hex=BY[n.id].hex,dark=lum(hex)<.16,r=n.r;
  const g=c.createRadialGradient(n.x-r*.25,n.y-r*.25,0,n.x,n.y,r);g.addColorStop(0,lighten(hex,dark?.25:.62));g.addColorStop(.55,hex);g.addColorStop(1,hex);
  c.fillStyle=g;circ(c,n.x,n.y,r);c.fill();
  if(dark){c.strokeStyle='rgba(220,218,240,.35)';c.lineWidth=1/k*1.6;circ(c,n.x,n.y,r);c.stroke();}}
 c.restore();
 // Arriba: «Mi constelación» y el título, como en la barra.
 c.textBaseline='alphabetic';c.fillStyle='#8F8BA6';c.font='400 26px "IBM Plex Mono", monospace';
 c.letterSpacing='5px';c.fillText('MI CONSTELACIÓN',MARGEN,110);c.letterSpacing='0px';
 c.font='400 96px "Instrument Serif", Georgia, serif';c.fillStyle='#ECEAF2';c.fillText('Chrom',MARGEN,200);
 const wc=c.measureText('Chrom').width;c.font='italic 400 96px "Instrument Serif", Georgia, serif';
 const wa=c.measureText('alchemy').width,gr=c.createLinearGradient(MARGEN+wc,0,MARGEN+wc+wa,0);
 ['#ff6a7a','#ffc65a','#5fd3a8','#6aa0ff','#c58cff'].forEach((col,i)=>gr.addColorStop(i/4,col));
 c.fillStyle=gr;c.fillText('alchemy',MARGEN+wc,200);
 // Abajo: cuántos colores y la dirección.
 c.font='400 26px "IBM Plex Mono", monospace';c.fillStyle='#ECEAF2';c.fillText(`${order.length} / ${DATA.length} colores`,MARGEN,PH-70);
 c.fillStyle='#8F8BA6';c.textAlign='right';c.fillText('icaraballo.github.io/Chromalchemy',PW-MARGEN,PH-70);
 return cv;}

const vista=$('poster');
async function descargar(){const cv=await dibujarPoster();
 const blob=await new Promise(r=>cv.toBlob(r,'image/png'));const url=URL.createObjectURL(blob);
 if(enApp){$('posterImg').src=url;vista.hidden=false;return;}
 const a=document.createElement('a');a.href=url;a.download='chromalchemy-constelacion.png';document.body.appendChild(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(url),4000);}
$('posterBtn').onclick=()=>{descargar().catch(()=>{});};
$('posterCerrar').onclick=()=>{vista.hidden=true;URL.revokeObjectURL($('posterImg').src);};
