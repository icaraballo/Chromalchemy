# Chromalchemy — documento de traspaso para Claude Code

> En el repo de código estos archivos ya están en su sitio. En el vault, este documento y el prototipo están en `Juego-Original/`.
>
> Este documento recoge todo lo decidido en la fase de diseño (octubre de 2026). Es la fuente de verdad para construir el juego. Acompañan a este archivo:
>
> - `data/colores.json` — catálogo completo: 246 colores con familia, color, receta, historia verificada y fuentes.
> - `reference/chromalchemy-prototipo-v3.html` — prototipo jugable de referencia (un solo archivo). Ábrelo en el navegador; añade `#dev` a la URL para ver el botón «Revelar todo».
> - `tools/calcular-recetas.js` — script que generó las recetas (Node + `mixbox`).

---

## 1. Qué es el juego

Juego web de descubrir colores mezclándolos, en la línea de *Little Alchemy* / *Infinite Craft*, pero con colores reales que tienen historia.

- Se empieza con **5 colores básicos**: rojo, amarillo, azul, blanco y negro.
- El jugador **arrastra un color sobre otro** y, si la pareja tiene receta, descubre un color nuevo.
- Cada color descubierto tiene una **ficha**: por qué se llama así, su historia, nivel de certeza y fuentes. Es la capa de curiosidad: el juego no es solo juntar colores.
- El objetivo es **completar la gama**: 246 colores.
- Es un proyecto personal de portfolio (se presentará en LinkedIn). Corto, cuidado y sin servidor.

## 2. Decisiones cerradas

| Tema | Decisión |
|---|---|
| Estilo visual | **Constelación**: bolas de luz sobre fondo espacial oscuro, unidas a sus dos «padres» como un grafo tipo Obsidian. El tamaño de cada bola crece con sus conexiones. |
| Efecto al mezclar | Explosión de partículas con onda expansiva y destello, en los colores de los padres y del resultado. |
| Básicos | Rojo, amarillo, azul, blanco y negro (mezcla tipo pintura, no luz). |
| Catálogo | Cerrado: 246 colores, todos con historia documentada. Nada de nombres inventados de internet ni marcas registradas. |
| Familias | 11, por cómo se ve el color (no por receta): Rojos 35, Rosas 16, Naranjas 19, Amarillos 26, Verdes 30, Azules 36, Violetas 18, Marrones 24, Blancos 14, Grises 14, Negros 14. |
| Rigor | Cada ficha lleva certeza: **documentado**, **discutido** o **leyenda**. Lo dudoso va en una nota aparte, marcada. Nunca se presenta una leyenda como hecho. |
| Mezcla | Siempre 1:1 entre dos colores ya descubiertos. Una pareja da como mucho un color. Mezclar un color consigo mismo no da nada. |
| Modo desarrollador | «Revelar todo» solo aparece con `#dev` en la URL. El jugador normal no lo ve. |
| Tecnología | HTML, CSS y JavaScript sin frameworks ni compilación. Datos en JSON aparte. Debe funcionar en GitHub Pages tal cual. |
| Nombre | Chromalchemy. Repo: `chromalchemy` (público, ya creado en GitHub por Iñigo). |

## 3. Pantalla y funciones (todas presentes en el prototipo v3)

1. **Constelación (lienzo principal).** Simulación de fuerzas: las bolas se repelen, cada color está unido por un muelle a sus dos padres, hay una gravedad suave al centro. Etiquetas con el nombre bajo cada bola (se ocultan si hay demasiadas).
2. **Arrastrar para mezclar, de dos formas:**
   - desde la **paleta lateral** (aparece un «fantasma» del color bajo el cursor);
   - desde la **propia constelación**: se coge una bola y se suelta sobre otra. *Requisito explícito del jugador.*
   - ⚠️ Bug ya resuelto en el prototipo: mientras se arrastra una bola, **no debe repeler a las demás**, o el objetivo «huye» y nunca se puede soltar encima.
3. **Resultado de una mezcla:**
   - receta nueva → explosión + aviso «Nuevo color · X» con botón «Leer su historia»;
   - color ya conocido → pulso sobre ese color + aviso «Ya tienes X»;
   - pareja sin receta → la bola tiembla + aviso «X y Y no reaccionan».
4. **Paleta por familias.** Desplegables con contador (p. ej. «Azules 4/36»), barrita de progreso, los colores descubiertos y huecos «?» para los que faltan. Cada color muestra un número con las mezclas que le quedan por descubrir, o ✓ cuando está agotado.
5. **Ficha de historia** (al pulsar un color): bola grande, nombre, nivel de mezcla y familia, hex/rgb, receta (chips clicables a los padres), «Por qué se llama así», «Su historia» con su etiqueta de certeza, nota de leyenda/discusión si existe, **mezclas pendientes** («Te quedan N mezclas con X» con N bolas «?» que se van rellenando; ✓ cuando se agotan), chips de las ya sacadas y lista de fuentes enlazadas.
6. **Gama cromática («quesito»).** Botón «Gama» → rueda de tonos donde cada color ocupa su sitio (ángulo = tono, distancia = luminosidad; los neutros en el centro). Los pendientes salen como huecos oscuros con borde discontinuo: dan pista de dónde buscar sin decir qué son. Se rellenan al descubrirlos. Al lado, contador por familia.
7. **Barra superior:** nombre, progreso total con una barra de colores descubiertos, botón Gama, Reiniciar y (solo `#dev`) Revelar todo.
8. **Móvil:** la paleta pasa abajo; en táctil se arrastra cogiendo la bolita del color (el resto de la fila hace scroll). La ficha se abre como hoja inferior.

## 4. Datos: `data/colores.json`

Array de 246 objetos, ordenados por `orden` de descubrimiento natural (de más fácil a más difícil). Campos:

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | string | identificador único (slug) |
| `name` | string | nombre visible en español |
| `fam` | string | familia: `rojos`, `rosas`, `naranjas`, `amarillos`, `verdes`, `azules`, `violetas`, `marrones`, `blancos`, `grises`, `negros` |
| `hex` | string | color `#RRGGBB` |
| `tipo` | string | pigmento, tinte, gema/mineral, natural, lugar, persona, cultura |
| `gen` | número | nivel de mezcla: 0 = básico; máximo 10 |
| `parents` | [id, id] o null | receta (null en los 5 básicos) |
| `receta` | string | `historia` (receta elegida a mano por su relato) o `calculada` |
| `de` | número | diferencia perceptual (CIEDE2000) entre la mezcla 1:1 de los padres y el color real. < 3 es casi idéntico |
| `cert` | string | `doc`, `disc` o `ley` (certeza de la historia principal) |
| `nombre` | string | por qué se llama así |
| `historia` | string | historia/curiosidad verificada |
| `nota` | {cert, t} o null | leyenda o versión discutida, siempre marcada |
| `src` | [[título, url], …] | fuentes (344 en total: RAE, Wikipedia, CAMEO del MFA de Boston y otras) |
| `reemplaza` | string (opcional) | candidato original al que sustituyó por falta de fuentes |

**Cifras:** 239 colores documentados, 13 con algo discutido, 16 con nota de leyenda.

## 5. Recetas: cómo se generaron

- Mezcla tipo pintura con **Mixbox** (`mixbox.lerp(a, b, 0.5)`), que imita pigmentos reales (azul + amarillo = verde de verdad).
- 26 recetas se fijaron a mano por su historia o por ser intuitivas (naranja = rojo + amarillo, azul de Prusia = rojo + azul marino porque Diesbach buscaba un rojo…).
- El resto se asignó con un algoritmo voraz: en cada paso se coloca el color que mejor se puede alcanzar con una pareja de colores ya disponibles, minimizando la diferencia de color y penalizando: padres muy usados, cadenas muy largas y padres de tono opuesto (para que la receta sea **creíble**, no solo exacta).
- Resultado: diferencia mediana 2,0; el 90 % por debajo de 6. Las mayores son recetas «de historia» elegidas a propósito.
- **Todo el catálogo se puede completar**: cada receta solo usa colores que aparecen antes. Reparto por nivel: 5 / 10 / 23 / 41 / 51 / 49 / 34 / 19 / 7 / 4 / 3 (niveles 0 a 10).
- Licencia: Mixbox es CC BY-NC 4.0 (uso no comercial). El juego **no necesita Mixbox en tiempo de ejecución**: las recetas ya están en el JSON. Solo hace falta si se recalculan con `tools/calcular-recetas.js`:
  ```bash
  npm install mixbox@2.0.0
  node calcular-recetas.js entrada.json salida.json
  ```

## 6. Estructura propuesta

### Repo de código (`chromalchemy`, en la carpeta de proyectos y en GitHub)

```
chromalchemy/
├── index.html            ← entrada; funciona abriéndolo o en GitHub Pages
├── css/
│   └── styles.css
├── js/
│   ├── main.js           ← arranque y bucle de animación
│   ├── data.js           ← carga de colores.json, índices, recetas
│   ├── state.js          ← descubiertos, guardado/carga (localStorage)
│   ├── constellation.js  ← simulación de fuerzas y dibujo en canvas
│   ├── effects.js        ← explosión, pulsos, temblor
│   ├── drag.js           ← arrastre desde paleta y desde la constelación
│   ├── palette.js        ← paleta por familias
│   ├── lore.js           ← ficha de historia
│   ├── wheel.js          ← gama cromática
│   └── ui.js             ← avisos, barra superior, modo dev
├── data/
│   └── colores.json
├── tools/
│   └── calcular-recetas.js
├── reference/
│   └── chromalchemy-prototipo-v3.html
├── README.md
└── LICENSE
```

Usar módulos ES (`<script type="module">`). Ojo: `fetch('data/colores.json')` no funciona abriendo el archivo con doble clic (file://). Para probar en local, servirlo (`npx serve` o `python3 -m http.server`), o generar también un `data/colores.js` que asigne el array a una variable global.

### Documentación (carpeta `Chromalchemy` del vault)

Rutas en el ordenador de Iñigo:

- Código: `~/Desktop/Proyectos/Chromalchemy`
- Documentación: `~/Desktop/Proyectos/Vault Proyectos/Chromalchemy` (el vault es un repo git propio)

Seguir la misma estructura que `Vault Proyectos/La Colmena`, que es la referencia:

```
Vault Proyectos/Chromalchemy/
├── Chromalchemy.md      ← nota principal (visión, estado, enlaces)
├── Diseño/              ← mecánicas, estilo visual, interfaz, catálogo y criterios de rigor, recetas
├── Código/              ← arquitectura, módulos, datos, cómo regenerar recetas
├── Juego-Original/      ← este documento de traspaso y el prototipo v3 como origen
├── QA/                  ← bugs activos y resueltos, pruebas
├── Tareas/              ← pendientes e ideas (sección 8)
└── Versiones/           ← registro de cambios por versión
```

Antes de crearla, revisar cómo están escritas las notas de La Colmena y seguir su estilo. Este documento ya está copiado en `Juego-Original/`.

## 7. Publicación

- Repo público → activar **GitHub Pages** (Settings → Pages → rama `main`, carpeta raíz). Quedará en `https://<usuario>.github.io/chromalchemy/`.
- Añadir el enlace al README.

## 8. Pendiente / ideas para después (no hacer todavía salvo que Iñigo lo pida)

- **Pistas** para desbloquear colores atascados, y una nota/mensaje al crear cada color. Iñigo aún no ha decidido cómo funcionarán.
- **Guardar el progreso** en el navegador (localStorage), con try/catch.
- Rendimiento y legibilidad con 200+ bolas: quizá zoom/desplazamiento en la constelación, o agrupar por familias.
- Capturas o modo «póster» de la constelación completa para LinkedIn.
- Mejora académica opcional: revisar con fuentes primarias/estudios abiertos los ~29 colores marcados como discutido o leyenda.

## 9. Orden de trabajo sugerido para Claude Code

1. Leer este documento y abrir el prototipo v3 para ver el comportamiento esperado.
2. Crear la estructura del repo y portar el prototipo a módulos, sin cambiar el comportamiento.
3. Cargar `data/colores.json` y comprobar que las 246 recetas funcionan (test: desde los 5 básicos, aplicando todas las recetas en `orden`, se llega a 246).
4. Añadir guardado de progreso.
5. Crear la documentación en el vault (sección 6).
6. Commit y push a GitHub; activar GitHub Pages.
