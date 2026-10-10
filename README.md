# Chromalchemy

Juego web de descubrir colores mezclándolos, en la línea de *Little Alchemy*, pero con
colores reales que tienen historia. Se empieza con rojo, amarillo, azul, blanco y negro, se
arrastra un color sobre otro y, si la pareja tiene receta, aparece uno nuevo con su ficha:
por qué se llama así, su historia y sus fuentes. El objetivo es completar la gama de 246
colores.

**Jugar**: https://icaraballo.github.io/Chromalchemy/

HTML, CSS y JavaScript sin frameworks ni compilación. Los datos van en `data/colores.json`.

## Estado

v1: el prototipo, portado a módulos sin cambiar cómo se juega. Todavía no guarda la partida.

| Ruta | Qué es |
|---|---|
| `index.html`, `css/`, `js/` | El juego. `js/main.js` arranca; cada módulo lleva su cabecera |
| `tests/recetas.test.mjs` | Comprueba que desde los 5 básicos se llega a los 246 (`npm test`) |
| `data/colores.json` | Los 246 colores: familia, color, receta, historia y fuentes |
| `reference/chromalchemy-prototipo-v3.html` | Prototipo jugable de referencia. Añade `#dev` a la URL para ver «Revelar todo» |
| `tools/calcular-recetas.js` | El script que generó las recetas (Node + `mixbox`) |
| `CHROMALCHEMY-HANDOFF.md` | Las decisiones de diseño y el plan de trabajo |

## Probar en local

Los módulos no cargan con doble clic (`file://`): hay que servir la carpeta.

```bash
npm run serve        # python3 -m http.server 8765 → http://127.0.0.1:8765
npm test             # las recetas
```

## Recalcular las recetas

El juego no necesita Mixbox para funcionar: las recetas ya están en el JSON. Solo hace falta
para recalcularlas:

```bash
npm install mixbox@2.0.0
node tools/calcular-recetas.js entrada.json salida.json
```

Mixbox tiene licencia CC BY-NC 4.0 (uso no comercial).
