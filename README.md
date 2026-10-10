# Chromalchemy

Juego web de descubrir colores mezclándolos, en la línea de *Little Alchemy*, pero con
colores reales que tienen historia. Se empieza con rojo, amarillo, azul, blanco y negro, se
arrastra un color sobre otro y, si la pareja tiene receta, aparece uno nuevo con su ficha:
por qué se llama así, su historia y sus fuentes. El objetivo es completar la gama de 246
colores.

HTML, CSS y JavaScript sin frameworks ni compilación. Los datos van en `data/colores.json`.

## Estado

En construcción. De momento el repo tiene el catálogo, la herramienta de recetas y el
prototipo de referencia; el juego se está portando a módulos.

| Ruta | Qué es |
|---|---|
| `data/colores.json` | Los 246 colores: familia, color, receta, historia y fuentes |
| `reference/chromalchemy-prototipo-v3.html` | Prototipo jugable de referencia. Añade `#dev` a la URL para ver «Revelar todo» |
| `tools/calcular-recetas.js` | El script que generó las recetas (Node + `mixbox`) |
| `CHROMALCHEMY-HANDOFF.md` | Las decisiones de diseño y el plan de trabajo |

## Recalcular las recetas

El juego no necesita Mixbox para funcionar: las recetas ya están en el JSON. Solo hace falta
para recalcularlas:

```bash
npm install mixbox@2.0.0
node tools/calcular-recetas.js entrada.json salida.json
```

Mixbox tiene licencia CC BY-NC 4.0 (uso no comercial).
