/* ---------- Arranque y bucle de animación ----------
   Importar drag.js (y con él el resto) engancha todos los eventos; data.js espera a que
   llegue colores.json antes de que se ejecute nada de esto. */
import {st} from './state.js';
import {resize,makeStars,step,draw} from './constellation.js';
import {reset} from './ui.js';
import './drag.js';
import {$} from './utils.js';

resize();makeStars();new ResizeObserver(()=>resize()).observe($('stage'));
reset();
let last=performance.now()/1000;
function frame(){const t=performance.now()/1000;const dt=Math.min(.05,t-last);last=t;st.now=t;step(dt);draw();requestAnimationFrame(frame);}
requestAnimationFrame(frame);
