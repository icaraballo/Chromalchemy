/* ---------- Opinar (T-15, v1.11) ----------
   Una hoja dentro del juego con las preguntas del formulario de Google; al enviar, las
   respuestas van a su `formResponse` por detrás (no-cors: Google no contesta nada legible,
   sólo se sabe si no hubo red) y no se sale de la partida. Viene de La Colmena (CR-15, CR-16).
   Se abre con el botón «Opinar» de la barra o desde el logro del 25 % de la gama (ui.js).
   Las direcciones salen del enlace prerrellenado del formulario: si se cambia una pregunta en
   Google, hay que cambiarla aquí. Lo escrito se conserva al cerrar sin enviar. */
import {DATA} from './data.js';
import {st,order} from './state.js';
import {$} from './utils.js';

const FORM='https://docs.google.com/forms/d/e/1FAIpQLScHOYoZvEJPYK0olmKcdxqSPf4bNCYVPI7K5iZFXtGaOl2LlA/formResponse';
const PREGUNTAS=[
 {entry:'entry.932365581', texto:'¿Qué te ha gustado?', largo:true},
 {entry:'entry.1764929900',texto:'¿Qué te ha confundido o te ha sobrado?', largo:true},
 {entry:'entry.332127336', texto:'¿Has encontrado algo raro o «roto»?', largo:true},
 {entry:'entry.1198938977',texto:'Cuéntame lo que quieras', ayuda:'Ideas, quejas, lo que se te ocurra', largo:true},
 {entry:'entry.1083438825',texto:'Tu nombre', ayuda:'Opcional, si quieres que te responda'},
 {entry:'entry.1276655054',texto:'Correo u otro contacto', ayuda:'Opcional'},
];
// Los tres que rellena el juego y no se ven (la sección 2 del formulario).
const CAMPOS={version:'entry.1031068515',colores:'entry.1550420656',pistas:'entry.1150654629'};
const MAX={largo:2000,corto:100};

// Quien ya ha enviado una opinión: el logro del 25 % sale sin el botón. Es de la persona, no de
// la partida, así que no se borra al reiniciar.
const CLAVE='chromalchemy-opinado';
export function yaOpino(){try{return localStorage.getItem(CLAVE)==='1';}catch{return false;}}

const hoja=$('opinion'),velo=$('opinionFondo'),form=$('opinionForm'),caja=$('opinionPreguntas'),
 aviso=$('opinionAviso'),enviar=$('opinionEnviar'),gracias=$('opinionGracias');
let abierta=false,origen=null,cierre=0;

const datos=()=>({version:document.querySelector('.tag').textContent.trim(),
 colores:`${order.length}/${DATA.length}`,
 pistas:st.pistasUsadas?`sí (${st.pistasUsadas})`:'no'});

export function abrirOpinion(){clearTimeout(cierre);abierta=true;origen=document.activeElement;
 if(!caja.children.length)caja.innerHTML=PREGUNTAS.map((p,i)=>{const ph=p.ayuda?` placeholder="${p.ayuda}"`:'';
  const campo=p.largo?`<textarea name="${p.entry}" rows="2" maxlength="${MAX.largo}"${ph}></textarea>`
   :`<input name="${p.entry}" type="text" maxlength="${MAX.corto}" autocomplete="${i===PREGUNTAS.length-1?'email':'name'}"${ph}>`;
  return `<label>${p.texto}${campo}</label>`;}).join('');
 const d=datos();
 $('opinionDatos').textContent=`Va a un formulario de Google con la versión (${d.version}), cuántos colores llevas (${order.length} de ${DATA.length}) y si has usado pistas. Nombre y contacto, sólo si los pones.`;
 form.hidden=false;gracias.hidden=true;aviso.textContent='';enviar.disabled=false;enviar.textContent='Enviar';
 hoja.hidden=velo.hidden=false;hoja.getBoundingClientRect();   // para que haya transición
 hoja.classList.add('abierta');velo.classList.add('abierta');caja.scrollTop=0;ajustar();}

export function cerrarOpinion(){if(!abierta)return;abierta=false;
 if(document.activeElement&&hoja.contains(document.activeElement))document.activeElement.blur();
 ajustar();hoja.classList.remove('abierta');velo.classList.remove('abierta');
 cierre=setTimeout(()=>{hoja.hidden=velo.hidden=true;},250);
 if(origen&&document.contains(origen)&&origen.offsetParent)origen.focus({preventScroll:true});origen=null;}
export const opinionAbierta=()=>abierta;

// Con el teclado del móvil abierto, la hoja se ajusta a lo que se ve para poder bajar hasta
// «Enviar» (lo que fue CR-16 en La Colmena). Con la página ampliada no se toca.
function ajustar(){const vv=window.visualViewport;
 const suelta=()=>{hoja.style.top=hoja.style.bottom='';hoja.classList.remove('con-teclado');};
 if(!abierta||!vv||vv.scale>1.01){suelta();return;}
 const tapado=Math.round(innerHeight-vv.offsetTop-vv.height);if(tapado<1){suelta();return;}
 hoja.classList.add('con-teclado');hoja.style.bottom=tapado+'px';hoja.style.top=Math.round(vv.offsetTop+12)+'px';
 const f=document.activeElement;if(f&&hoja.contains(f)&&f.matches('textarea,input'))f.scrollIntoView({block:'nearest'});}
if(window.visualViewport){visualViewport.addEventListener('resize',ajustar);visualViewport.addEventListener('scroll',ajustar);}

// El cuerpo del envío: sólo las preguntas con algo escrito, y los datos del juego. null si no hay nada.
export function cuerpo(respuestas,d){const escritas=Object.keys(respuestas).filter(k=>String(respuestas[k]||'').trim());
 if(!escritas.length)return null;
 const par=(k,v)=>`${encodeURIComponent(k)}=${encodeURIComponent(v)}`;
 const pares=escritas.map(k=>par(k,String(respuestas[k]).trim()));
 for(const k of Object.keys(CAMPOS))if(d[k]!=null&&d[k]!=='')pares.push(par(CAMPOS[k],d[k]));
 pares.push(par('pageHistory','0,1'));   // dos secciones: sin esto Google no da la respuesta por terminada
 return pares.join('&');}

form.addEventListener('submit',async e=>{e.preventDefault();
 const r={};for(const p of PREGUNTAS)r[p.entry]=form.elements[p.entry].value;
 const c=cuerpo(r,datos());
 if(!c){aviso.textContent='Escribe algo en alguna pregunta antes de enviar.';return;}
 aviso.textContent='';enviar.disabled=true;enviar.textContent='Enviando…';
 try{await fetch(FORM,{method:'POST',mode:'no-cors',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:c});}
 catch{enviar.disabled=false;enviar.textContent='Enviar';
  aviso.textContent='No se ha podido enviar: parece que no hay conexión. Lo escrito sigue aquí; inténtalo en un rato.';return;}
 try{localStorage.setItem(CLAVE,'1');}catch{}
 form.reset();form.hidden=true;gracias.hidden=false;$('opinionVolver').focus({preventScroll:true});});

$('opinarBtn').onclick=()=>abrirOpinion();
$('opinionCerrar').onclick=cerrarOpinion;
$('opinionVolver').onclick=cerrarOpinion;
velo.onclick=cerrarOpinion;
window.addEventListener('keydown',e=>{if(e.key==='Escape'&&abierta){e.stopImmediatePropagation();cerrarOpinion();}},true);
