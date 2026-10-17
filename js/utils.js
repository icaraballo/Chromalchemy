/* ---------- Utilidades: color, curvas y DOM ---------- */
export function rgb(hex){const n=parseInt(hex.slice(1),16);return[n>>16&255,n>>8&255,n&255];}
export function rgba(hex,a){const[r,g,b]=rgb(hex);return`rgba(${r},${g},${b},${a})`;}
function mixc(hex,t,to){const c=rgb(hex);return`rgb(${c.map((v,i)=>Math.round(v+(to[i]-v)*t)).join(',')})`;}
export const lighten=(h,t)=>mixc(h,t,[255,255,255]), darken=(h,t)=>mixc(h,t,[0,0,0]);
export function lum(hex){const[r,g,b]=rgb(hex);return(.2126*r+.7152*g+.0722*b)/255;}
export function hsl(hex){let[r,g,b]=rgb(hex).map(v=>v/255);const mx=Math.max(r,g,b),mn=Math.min(r,g,b);let h=0,s=0;const l=(mx+mn)/2;
 if(mx!==mn){const d=mx-mn;s=l>.5?d/(2-mx-mn):d/(mx+mn);h=mx===r?(g-b)/d+(g<b?6:0):mx===g?(b-r)/d+2:(r-g)/d+4;h*=60;}return[h,s,l];}
export const TAU=Math.PI*2, clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export const easeOut=p=>1-Math.pow(1-p,3);
export const elastic=p=>p<=0?0:p>=1?1:Math.pow(2,-10*p)*Math.sin((p*10-.75)*TAU/3)+1;
export const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
export const esc=t=>String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const $=id=>document.getElementById(id);
