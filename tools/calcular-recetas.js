const fs=require('fs');const mixbox=require('mixbox');
const cat=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
// --- color math
function hex2rgb(h){const n=parseInt(h.slice(1),16);return[n>>16&255,n>>8&255,n&255];}
function rgb2lab([r,g,b]){[r,g,b]=[r,g,b].map(v=>{v/=255;return v<=0.04045?v/12.92:Math.pow((v+0.055)/1.055,2.4)});
 let x=(r*0.4124+g*0.3576+b*0.1805)/0.95047,y=(r*0.2126+g*0.7152+b*0.0722),z=(r*0.0193+g*0.1192+b*0.9505)/1.08883;
 const f=t=>t>0.008856?Math.cbrt(t):7.787*t+16/116;x=f(x);y=f(y);z=f(z);return[116*y-16,500*(x-y),200*(y-z)];}
function de2000(a,b){const[L1,a1,b1]=a,[L2,a2,b2]=b;const rad=Math.PI/180;
 const C1=Math.hypot(a1,b1),C2=Math.hypot(a2,b2),Cm=(C1+C2)/2,G=0.5*(1-Math.sqrt(Cm**7/(Cm**7+25**7)));
 const a1p=a1*(1+G),a2p=a2*(1+G),C1p=Math.hypot(a1p,b1),C2p=Math.hypot(a2p,b2);
 const h=(x,y)=>{if(x===0&&y===0)return 0;let t=Math.atan2(y,x)/rad;return t<0?t+360:t};
 const h1p=h(a1p,b1),h2p=h(a2p,b2);const dLp=L2-L1,dCp=C2p-C1p;
 let dhp=0;if(C1p*C2p!==0){dhp=h2p-h1p;if(dhp>180)dhp-=360;else if(dhp<-180)dhp+=360;}
 const dHp=2*Math.sqrt(C1p*C2p)*Math.sin(dhp*rad/2);const Lm=(L1+L2)/2,Cmp=(C1p+C2p)/2;
 let hm=h1p+h2p;if(C1p*C2p!==0){if(Math.abs(h1p-h2p)>180)hm+=hm<360?360:-360;hm/=2;}
 const T=1-0.17*Math.cos((hm-30)*rad)+0.24*Math.cos(2*hm*rad)+0.32*Math.cos((3*hm+6)*rad)-0.2*Math.cos((4*hm-63)*rad);
 const dth=30*Math.exp(-(((hm-275)/25)**2)),Rc=2*Math.sqrt(Cmp**7/(Cmp**7+25**7));
 const Sl=1+0.015*(Lm-50)**2/Math.sqrt(20+(Lm-50)**2),Sc=1+0.045*Cmp,Sh=1+0.015*Cmp*T,Rt=-Math.sin(2*dth*rad)*Rc;
 return Math.sqrt((dLp/Sl)**2+(dCp/Sc)**2+(dHp/Sh)**2+Rt*(dCp/Sc)*(dHp/Sh));}
const LAB={};cat.forEach(c=>LAB[c.id]=rgb2lab(hex2rgb(c.hex)));
const byId={};cat.forEach(c=>byId[c.id]=c);
const key=(a,b)=>a<b?a+'|'+b:b+'|'+a;
const mixCache={};function mixLab(a,b){const k=key(a,b);if(!mixCache[k])mixCache[k]=rgb2lab(mixbox.lerp(byId[a].hex,byId[b].hex,0.5));return mixCache[k];}
// --- seed: basics + story recipes already in the game
const BASICS=['rojo','amarillo','azul','blanco','negro'];
const placed=[],used=new Set(),uses={},gen={};
BASICS.forEach(id=>{placed.push(id);gen[id]=0;uses[id]=0;});
const fixed=cat.filter(c=>c.parents);
let guard=0;while(fixed.some(c=>!placed.includes(c.id))&&guard++<50){for(const c of fixed){if(placed.includes(c.id))continue;const[a,b]=c.parents;if(placed.includes(a)&&placed.includes(b)){placed.push(c.id);used.add(key(a,b));uses[c.id]=0;uses[a]++;uses[b]++;gen[c.id]=Math.max(gen[a],gen[b])+1;c.de=+de2000(mixLab(a,b),LAB[c.id]).toFixed(1);c.receta='historia';}}}
// --- greedy for the rest
const todo=new Set(cat.filter(c=>!placed.includes(c.id)).map(c=>c.id));
const W_USE=0.35, W_GEN=0.6;
const W_HUE=3;
function hueOf(l){return Math.atan2(l[2],l[1])*180/Math.PI;}
function chroma(l){return Math.hypot(l[1],l[2]);}
function hueDist(x,y){let d=Math.abs(hueOf(x)-hueOf(y))%360;return d>180?360-d:d;}
function huePen(t,p){const T=LAB[t],P=LAB[p];if(chroma(P)<12||chroma(T)<10)return 0;return Math.max(0,hueDist(T,P)-75)/25;}
function score(t,a,b){return de2000(mixLab(a,b),LAB[t])+W_USE*(uses[a]+uses[b])/4+W_GEN*Math.max(gen[a],gen[b])+W_HUE*(huePen(t,a)+huePen(t,b));}
while(todo.size){let best=null;
 for(const t of todo){for(let i=0;i<placed.length;i++)for(let j=i+1;j<placed.length;j++){const a=placed[i],b=placed[j];if(used.has(key(a,b)))continue;
   const s=score(t,a,b);if(!best||s<best.s)best={t,a,b,s};}}
 const {t,a,b}=best;const c=byId[t];c.parents=[a,b];c.de=+de2000(mixLab(a,b),LAB[t]).toFixed(1);c.receta='calculada';
 used.add(key(a,b));uses[a]++;uses[b]++;uses[t]=0;gen[t]=Math.max(gen[a],gen[b])+1;placed.push(t);todo.delete(t);}
cat.forEach(c=>{c.gen=gen[c.id];c.orden=placed.indexOf(c.id);});
fs.writeFileSync(process.argv[3],JSON.stringify(cat,null,1));
const des=cat.filter(c=>c.parents).map(c=>c.de).sort((x,y)=>x-y);
const q=p=>des[Math.floor(p*(des.length-1))];
console.log('recipes',des.length,'median dE',q(.5),'p90',q(.9),'max',des[des.length-1]);
const gc={};cat.forEach(c=>gc[c.gen]=(gc[c.gen]||0)+1);console.log('by generation',gc);
const top=Object.entries(uses).sort((x,y)=>y[1]-x[1]).slice(0,8).map(([k,v])=>byId[k].name+':'+v);console.log('most used parents',top.join(', '));
console.log('worst',cat.filter(c=>c.de>=15).sort((x,y)=>y.de-x.de).slice(0,15).map(c=>`${c.name}=${byId[c.parents[0]].name}+${byId[c.parents[1]].name} (${c.de})`).join('\n'));
