/* ---------- Vibración (v1.22.2) ----------
   Vibra al coger una bola (drag.js). En la app, con el plugin Haptics de Capacitor (el vibrador de
   Android): navigator.vibrate en el WebView no vibraba (v1.22.1). En la web, navigator.vibrate,
   sólo en pantallas táctiles (en el iPhone no existe y en el ordenador no hay con qué vibrar).
   Se puede apagar desde la portada («Vibración: sí / no»); el botón sólo sale donde se puede vibrar.
   Viene encendida y se recuerda aparte de la partida (Reiniciar no la cambia). */
import {$} from './utils.js';

const CLAVE='chromalchemy-vibracion';
const cap=window.Capacitor, Haptics=cap&&cap.isNativePlatform&&cap.isNativePlatform()&&cap.Plugins.Haptics;
export const puede=!!Haptics||(typeof navigator.vibrate==='function'&&matchMedia('(pointer:coarse)').matches);
let activa=true;
try{activa=localStorage.getItem(CLAVE)!=='no';}catch{}

export function vibrar(ms){if(!puede||!activa)return;
 try{if(Haptics)Haptics.vibrate({duration:ms}).catch(()=>{});else navigator.vibrate(ms);}catch{}}

const btn=$('porVibra'),txt=$('porVibraTxt');
function pintar(){txt.textContent=activa?'sí':'no';btn.setAttribute('aria-pressed',String(activa));btn.classList.toggle('apagada',!activa);}
if(btn&&puede){btn.hidden=false;pintar();
 btn.onclick=()=>{activa=!activa;try{localStorage.setItem(CLAVE,activa?'si':'no');}catch{}pintar();if(activa)vibrar(35);};}  // al encenderla, una vibración para notarla
