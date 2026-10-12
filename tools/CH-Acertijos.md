---
titulo: "Acertijos de las pistas (T-14)"
tags: [tareas/pendientes, diseño/contenido, versión/v1]
aliases: ["Acertijos", "Tarea acertijos"]
related:
  - "[[CH-Instrucciones]]"
  - "[[CH-DESIGN]]"
  - "[[CH-Catálogo-y-Recetas]]"
  - "[[CH-Arquitectura]]"
version: "v1.11"
última_actualización: "2026-10-12"
---

# Acertijos de las pistas (T-14)

#tareas/pendientes

> **Para Claude Code.** Aquí están los 241 acertijos del primer escalón de las pistas
> ([[CH-DESIGN]] §3.12), uno por cada color que sale de una mezcla. Los escribió Claude.ai el
> 12-10-2026 con Iñigo. **Estado: borrador, en revisión** por Iñigo, otras IA y testers. Lo que
> cambie se corrige en la tabla de abajo, y la tabla es la fuente de verdad.

---

## 1. Qué hay que hacer

1. **Esperar el visto bueno de Iñigo** a la revisión (§4). No se publica antes.
2. Añadir a cada color de `data/colores.json` el campo **`acertijo`** (texto plano) con el de
   la tabla, por su `id`. Los 5 básicos no llevan. `js/pistas.js` ya lo usa si existe; si no,
   sigue saliendo el «Por qué se llama así» con el nombre tapado.
3. El mismo texto está en `tools/acertijos-borrador.json` del repo del código (id → acertijo).
   Si la tabla y el JSON no coinciden, **manda la tabla**: regenerar el JSON desde ella.
4. Pasar `python3 tools/check-acertijos.py` (lo comprueba sobre el borrador): ningún
   acertijo dice el nombre (misma regla que `tapar()` de `pistas.js`) y ninguno pasa de 170
   caracteres. Añadir al `npm test` que los 241 tengan `acertijo` y pasen esa regla.
5. Probar en el móvil que la tarjeta se lee bien con el más largo (163 caracteres).
6. Subir versión (v1.12), documentar en [[CH-2026-10-v1]], marcar T-14 en
   [[CH-Instrucciones]] y borrar el borrador del repo cuando ya esté en el JSON.

## 2. Cómo están escritos (decidido con Iñigo)

- **Tono B: habla el color**, en primera persona («Me llamaron…», «Soy…»). Elegido el 12-10
  frente a A (dato) y C (pregunta), con dos tandas de prueba.
- **Sin pista visual** de cómo se ve el color (se valoró como B+ y se descartó).
- **Una o dos frases**, 163 caracteres como mucho.
- **Nunca dicen el nombre** ni una forma suya.
- **Solo lo que ya cuentan la ficha**: «Por qué se llama así», «Su historia» y la nota. Nada
  añadido de memoria.
- **Lo dudoso, marcado.** Si un acertijo usa algo discutido o de leyenda, lo dice («es
  leyenda», «se discute», «no está claro»). Si no hace falta, se deja fuera.
- Cuando el nombre solo tiene etimología (gemas, frutas…), el acertijo tira de la historia.
- En parejas parecidas (bermellón y cinabrio, sinopia y rojo veneciano, burdeos y borgoña…)
  cada acertijo usa un dato que solo tiene uno de los dos.

## 3. Los acertijos

La columna «Ficha» marca los colores con algo discutido o de leyenda: ahí conviene revisar con
más cuidado.


### Rojos (34)

| id | Color | Ficha | Acertijo |
|---|---|---|---|
| `granate` | Granate |  | Mi nombre viene del latín «grano», quizá por los granos rojos de cierta fruta. Me engastaban en celdillas de oro, como en el tesoro de Sutton Hoo. |
| `bermellon` | Bermellón |  | Mi nombre significa «gusanito», aunque me hacían moliendo un mineral de mercurio. Los romanos me sacaban de Almadén. |
| `carmin` | Carmín |  | Salgo de un insecto de los cactus que ya usaban aztecas e incas. La Corona española tuvo mi monopolio, y hoy sigo en los alimentos con el código E120. |
| `palo-de-brasil` | Palo de Brasil |  | Soy una madera roja como una brasa. Cuando llegaron los portugueses en 1500, le di mi nombre a un país entero. |
| `alizarina` | Alizarina |  | Soy el rojo de la raíz de la granza. En 1868 dos químicos me fabricaron con alquitrán de hulla: fui el primer tinte natural copiado por síntesis. |
| `carmesi` | Carmesí |  | Mi nombre quiere decir «del color del quermes», el insecto del que me sacaban. En 1868 un tinte sintético me desplazó. |
| `rojo-tiziano` | Rojo Tiziano |  | Llevo el nombre de un pintor veneciano al que le gustaba pintar mujeres pelirrojas. Ana, la de las Tejas Verdes, lo explica. |
| `sanguina` | Sanguina |  | Mi nombre viene de la sangre seca, a la que me parezco. Soy una tiza de ocre rojo, y Leonardo da Vinci dibujó conmigo. |
| `sinopia` | Sinopia |  | Me exportaban desde un puerto turco del mar Negro. En el Renacimiento, los pintores me usaban para el boceto de los frescos, directamente sobre el revoque. |
| `rojo-garibaldi` | Rojo Garibaldi | leyenda | Vestí las camisas de los Mil, que en 1860 ayudaron a unificar Italia. Que esas camisas se hicieran para mataderos argentinos es solo leyenda. |
| `rojo-indio` | Rojo indio |  | Probablemente me llamaron así por el país del que llegaba, de suelos rojos de laterita. Soy un ocre de óxido férrico. |
| `quermes` | Quermes |  | Mi nombre viene del sánscrito: «hecho por un gusano». Vivo en la coscoja y fui el rojo de lujo medieval, hasta que llegó la cochinilla de México. |
| `rojo-turco` | Rojo turco |  | Me teñían con raíz de granza, lejía, aceite y excrementos de oveja. En 1746, dos tintoreros de Esmirna llevaron mi receta a Francia. |
| `amaranto` | Amaranto |  | Mi nombre griego significa «que no se marchita», como la flor. El colorante E123 se llama como yo, aunque no sale de la planta. |
| `rojo-pompeyano` | Rojo pompeyano | discutido | Cubro las paredes de la ciudad que sepultó el Vesubio en el año 79. Se discute cuánto de mí era ocre amarillo que enrojeció con el calor. |
| `cinabrio` | Cinabrio |  | Soy un mineral de mercurio, y de mí sale el bermellón. Almadén fue durante siglos mi yacimiento más importante. |
| `minio` | Minio |  | Me sacan calentando blanco de plomo. Los copistas me usaban para las iniciales, y de mí, no de lo pequeño, viene el nombre de las ilustraciones de los manuscritos. |
| `espinela` | Espinela | leyenda | Durante siglos me confundieron con el rubí, y la gran piedra roja de la corona imperial británica soy yo. |
| `rojo-cardenal` | Rojo cardenal |  | Probablemente me llamaron por las sotanas de unos altos cargos de la Iglesia, aunque visten de escarlata. Un pájaro norteamericano debe su nombre a esa ropa. |
| `burdeos` | Burdeos |  | Me llamo como una ciudad francesa y el vino de su región. Me parezco mucho a otro rojo con nombre de vino. |
| `escarlata` | Escarlata |  | En la Edad Media también fui un paño de lujo, casi siempre rojo. Mi nombre viene del latín «paño sellado». |
| `laca-roja` | Laca roja |  | Soy la resina que segregan unos insectos sobre los árboles. Se cree que mi nombre en la India, lakh, «cien mil», alude a cuántos cubren cada árbol. |
| `sangre-de-dragon` | Sangre de dragón | leyenda | Soy la resina roja de unos árboles de Socotra y de Canarias. Algunas enciclopedias medievales decían que salía de fieras muertas en combate: es leyenda. |
| `lacre` | Lacre |  | Sirvo para cerrar documentos y demostrar que nadie los ha abierto. Fui cera y resina; desde el siglo XVI, goma laca. |
| `rojo-veneciano` | Rojo veneciano |  | Me llaman como a una ciudad italiana, aunque el mejor venía de Sinope. Cennino Cennini recomendaba mezclarme con blanco de cal para pintar la piel. |
| `cereza` | Cereza |  | Me llamo como una fruta; en francés, cerise. El Times de Londres me nombró en 1858. |
| `rojo-falun` | Rojo Falun |  | Vengo de los residuos de una mina de cobre sueca. Desde el siglo XVII me pintan en las casas de madera del campo sueco. |
| `rubi` | Rubí |  | Soy corindón, el mismo mineral que el zafiro, y el cromo me da el color. Por eso a veces me llaman «zafiro rojo». |
| `sangre-de-toro` | Sangre de toro |  | Soy un vidriado de óxido de cobre que se cuece sin oxígeno. Nací en Jingdezhen en tiempos del emperador Kangxi, y nunca salgo dos veces igual. |
| `coral` | Coral | leyenda | Los romanos me colgaban al cuello de los niños para protegerlos. Dicen que nací de la sangre de Medusa, pero es mito. |
| `cornalina` | Cornalina |  | Me parezco al fruto rojo del cornejo. Los romanos tallaban sellos conmigo porque la cera caliente no se me pega. |
| `borgona` | Borgoña |  | Me llamo como un vino francés. Como nombre de color en inglés aparezco por primera vez en 1881. |
| `rojo-cadmio` | Rojo cadmio |  | Me da el color un metal descubierto en 1817. Van Gogh y Monet pintaron con pigmentos de ese metal. |
| `caput-mortuum` | Caput mortuum |  | Los alquimistas me dibujaban con una calavera: yo era el residuo inútil que quedaba al final. |

### Rosas (16)

| id | Color | Ficha | Acertijo |
|---|---|---|---|
| `rosa` | Rosa |  | Me llamo como una flor. En inglés me nombran unos claveles de pétalos rizados, como el corte de unas tijeras dentadas. |
| `magenta` | Magenta |  | Me rebautizaron para celebrar una victoria de 1859 sobre Austria. Ninguna luz del arcoíris tiene mi tono. |
| `cuarzo-rosa` | Cuarzo rosa |  | Aluminio, fósforo y la radiación natural me dan el color. Con la luz, algunas de mis variedades se apagan. |
| `turmalina` | Turmalina |  | Al calentarme me cargo de electricidad. Me llamaban el «imán de Ceilán» porque atraía y luego repelía la ceniza caliente. |
| `peonia` | Peonía |  | Mi nombre viene del griego paiōnía. Dioscórides ya relacionaba una hierba llamada aglaofotis con la familia de mi flor. |
| `rosa-pompadour` | Rosa Pompadour |  | Llevo el nombre de la favorita de Luis XV, que mandó crear un tono propio para la porcelana de Sèvres y acabó comprando la fábrica en 1759. |
| `frambuesa` | Frambuesa |  | Me llamo como una fruta; en francés, framboise. Como nombre de color en inglés aparezco en 1892. |
| `laca-de-granza` | Laca de granza |  | Me hacen con la raíz de una planta que en Egipto ya se cultivaba hacia el 1500 a. C. Me desvanecía enseguida hasta que George Field me mejoró en 1804. |
| `rodocrosita` | Rodocrosita |  | Mi nombre griego significa «de color rosa». Me llaman rosa del Inca y soy la piedra nacional de Argentina. |
| `clavel` | Clavel |  | Mi nombre viene del catalán. En 1974 la gente me lució en Portugal, y la caída de la dictadura se llamó como yo. |
| `flamenco` | Flamenco |  | Mi nombre quiere decir «color de llama». Un ave me lleva gracias a la artemia y las algas que come. |
| `rosa-te` | Rosa té |  | Me llamo como unas flores cuyo aroma recuerda al té negro chino. Llegaron desde Cantón a principios del siglo XIX. |
| `fucsia` | Fucsia |  | Me llamo como una flor dedicada a un botánico alemán del siglo XVI. En 1859 un tinte tomó su nombre, y ese mismo año lo rebautizaron. |
| `rosa-mexicano` | Rosa mexicano |  | Me dio a conocer Ramón Valdiosera, que en los años cuarenta recorrió su país recogiendo ropa tradicional. |
| `rosa-bebe` | Rosa bebé | discutido | Me llaman por la ropa de los recién nacidos. Se repite que antes me vestían los niños y no las niñas, pero no hay pruebas. |
| `rosa-schiaparelli` | Rosa Schiaparelli |  | Una diseñadora surrealista me puso en la caja de su perfume Shocking, en 1937. Se inspiró en un diamante de Cartier. |

### Naranjas (19)

| id | Color | Ficha | Acertijo |
|---|---|---|---|
| `naranja` | Naranja |  | Viajé del sánscrito al persa y al árabe antes de llegar al frutero. Antes de mí, los ingleses me llamaban «amarillo-rojo». |
| `herrumbre` | Herrumbre |  | Mi nombre viene del latín «hierro», y soy lo que le sale con el tiempo. Ocupo más que él y puedo reventar estructuras. |
| `zanahoria` | Zanahoria | leyenda | Me llamo como una raíz que antes era morada o amarilla. Que los holandeses la cambiaran en honor a Guillermo de Orange es leyenda. |
| `naranja-internacional` | Naranja internacional |  | Soy el color de seguridad de la ingeniería. Me llevan los trajes de escape de la NASA, y el Golden Gate viste un tono algo más claro. |
| `tangerina` | Tangerina |  | Mi nombre en inglés quiere decir «de Tánger», el puerto marroquí del Estrecho. Addison ya me usó en 1710. |
| `amapola` | Amapola |  | Mi nombre antiguo era ababol. Monet pintó un campo de mis flores en 1875, y desde la Primera Guerra Mundial recuerdo a los soldados caídos. |
| `salmon` | Salmón |  | Me llamo como la carne de un pez que me debe al krill y las gambas que come. La industria mide mi tono con un abanico de muestras. |
| `naranja-cadmio` | Naranja cadmio |  | Un metal con selenio me da el color. Desplacé al bermellón, que era de mercurio, porque aguanto mucho mejor la luz. |
| `azafran` | Azafrán | leyenda | Hacen falta unas 150 flores de crocus para un gramo de mí. Que los monjes budistas tiñan sus túnicas conmigo es leyenda: soy demasiado caro. |
| `cobre` | Cobre |  | Mi nombre viene de «metal de Chipre», una gran fuente del mundo romano. Por eso mi símbolo químico es Cu. |
| `henna` | Henna |  | Soy el polvo de las hojas de Lawsonia inermis. En el antiguo Egipto probablemente teñí de rojo el pelo de una momia. |
| `mandarina` | Mandarina | discutido | Me llamo como una fruta que se relaciona con unos altos funcionarios chinos. Que fuera por el color de sus túnicas no está claro. |
| `achiote` | Achiote |  | Salgo de las semillas de Bixa orellana. Pueblos de Brasil se pintaban el cuerpo conmigo, y hoy coloreo muchos quesos como E160b. |
| `pimenton` | Pimentón |  | Soy pimiento rojo, seco y molido. El de la Vera se seca con humo, y por eso sabe ahumado. |
| `realgar` | Realgar |  | Mi nombre viene del árabe «polvo de la cueva». Soy sulfuro de arsénico, muy venenoso, y con la luz me deshago en un polvo amarillo. |
| `ambar` | Ámbar |  | En griego me llamaba ēlektron, y por mí se llamó «eléctricos» a los cuerpos que atraen cosas al frotarlos. |
| `calabaza` | Calabaza |  | En Irlanda tallaban nabos; en América me eligieron a mí, más grande y fácil de tallar. |
| `melocoton` | Melocotón |  | Mi nombre latino significa «membrillo», porque mi árbol se injerta en él para sacar las mejores variedades. |
| `albaricoque` | Albaricoque |  | Mi nombre viene del latín «precoz», porque maduro pronto. El inglés lo tomó a través del francés y del español. |

### Amarillos (25)

| id | Color | Ficha | Acertijo |
|---|---|---|---|
| `indio` | Amarillo indio | discutido | Según una carta, me hacían con orina de vacas alimentadas solo con hojas de mango. Durante años se dudó, pero análisis de 2017 y 2018 le dan la razón. |
| `ocre` | Ocre |  | Mi nombre griego significa «pálido». En la cueva de Blombos aparecieron trozos de mí grabados hace unos 75.000 años. |
| `albero` | Albero |  | Soy una piedra amarilla molida de las canteras de Los Alcores. Cubro el ruedo de las plazas de toros y las calles de la Feria de Sevilla. |
| `oro` | Oro |  | Mi nombre latino viene de una raíz que significa «brillar», la misma de aurora. No me oxido a ninguna temperatura. |
| `gutagamba` | Gutagamba |  | Mi nombre inglés viene del antiguo nombre de Camboya. Soy la resina de unos árboles, he teñido túnicas de monjes y soy tóxica. |
| `miel` | Miel | leyenda | En una tumba de Georgia quedaban restos de mí en unas vasijas de hace milenios. Que en Egipto se hallara aún comestible es un mito. |
| `curcuma` | Cúrcuma |  | Mi nombre árabe viene de una palabra persa para «azafrán». Tiño saris aunque no aguanto la luz, y en la comida soy el E100. |
| `mostaza` | Mostaza |  | Mi nombre viene del latín «mosto»: los romanos me hacían con semillas molidas y mosto de uva. |
| `oropimente` | Oropimente |  | Mi nombre latino es «pigmento de oro», porque se creía que lo contenía. Soy sulfuro de arsénico, y Rafael me usó en la Madonna Sixtina. |
| `gualda` | Gualda |  | Soy la «reseda de tintoreros». Mezclada con el azul del glasto, daba verdes como el de Lincoln. |
| `amarillo-plomo-estano` | Amarillo plomo-estaño |  | Me llaman «el de los viejos maestros». Hacia 1750 caí en el olvido sin que se sepa por qué, y Richard Jacobi me redescubrió en 1941. |
| `amarillo-taxi` | Amarillo taxi |  | El 2 de agosto de 1915 salieron en Chicago 45 coches de John Hertz pintados de mi color, para que se vieran al máximo. |
| `amarillo-de-napoles` | Amarillo de Nápoles | leyenda | Soy uno de los pigmentos sintéticos más antiguos, de hace unos 3.500 años. Llevo el nombre de una ciudad italiana, pero mi origen es incierto. |
| `topacio` | Topacio |  | Quizá me llamo como una isla del mar Rojo que Plinio creía legendaria. El de la Antigüedad era otra piedra; el nombre me tocó a mí en 1737. |
| `amarillo-cromo` | Amarillo cromo |  | Vauquelin identificó el metal que me da el color. En los Girasoles de Van Gogh me estoy oscureciendo y volviendo marrón. |
| `champan` | Champán |  | Me llamo como un vino espumoso francés. En inglés soy nombre de color desde 1915. |
| `paja` | Paja |  | Me llamo como los tallos secos del cereal. En latín ya me decían stramineus, y en inglés soy color desde 1589. |
| `amarillo-uranio` | Amarillo uranio |  | Soy un vidrio que brilla en verde con luz ultravioleta. En los años treinta me llamaron «vidrio vaselina», y algunas piezas dan lectura en un contador Geiger. |
| `citrino` | Citrino |  | Mi nombre viene de «limón». Natural soy raro: casi todo lo que se vende es amatista calentada. |
| `limon` | Limón |  | Mi nombre árabe valía para cualquier cítrico. Llegué a Europa por el sur de Italia, en tiempos de Roma. |
| `amarillo-imperial` | Amarillo imperial |  | Me vestían los emperadores chinos: era el color de la majestad y del estandarte de la dinastía Qing. |
| `aureolina` | Aureolina |  | Me obtuvo Nikolaus Fischer en Breslavia en 1831, y Saint-Evre me llevó a la paleta de los artistas. Me da el color el cobalto. |
| `canario` | Canario |  | Me llamo como un pájaro que lleva el nombre de unas islas, «islas de los perros». En estado salvaje es verdoso. |
| `amarillo-cadmio` | Amarillo cadmio |  | Fui el tono luminoso de los impresionistas. El metal que me da el color se descubrió en 1817. |
| `azufre` | Azufre |  | Me quemaban para purificar las casas. Sodoma y Gomorra cayeron bajo fuego y yo, y por eso huelo a infierno. |

### Verdes (30)

| id | Color | Ficha | Acertijo |
|---|---|---|---|
| `verde` | Verde |  | Mi nombre viene del latín viridis. Durante siglos me sacaron atacando cobre con vinagre, y con el tiempo podía volverme marrón. |
| `oliva` | Oliva |  | Me llamo como la aceituna sin madurar. En versión apagada vestí al ejército estadounidense hasta que llegó el camuflaje en 1981. |
| `scheele` | Verde Scheele | leyenda | Me inventó un químico sueco en 1775. Era bonito y venenoso: teñí papeles pintados, vestidos y hasta dulces. |
| `celadon` | Celadón | discutido | Me llamo como un pastor de una novela francesa que vestía cintas verde pálido. Otra teoría, discutida, me relaciona con Saladino. |
| `aventurina` | Aventurina |  | Mi nombre italiano quiere decir «por casualidad»: en Murano salió por accidente un vidrio con destellos. Luego el nombre pasó a un mineral. |
| `glauco` | Glauco |  | Mi nombre griego significó «brillante» y luego «verde azulado». Homero llamaba a Atenea con un epíteto de mi misma raíz. |
| `cardenillo` | Cardenillo |  | Soy un diminutivo de «cárdeno». En la Edad Media me hacían con tiras de cobre y vinagre enterradas en estiércol. |
| `absenta` | Absenta |  | Me llamaban «el hada verde». Fui la bebida de los artistas de París, y Francia me tuvo prohibida hasta 2011. |
| `crisoprasa` | Crisoprasa |  | Mi nombre griego une «oro» y «verde». Soy una calcedonia, y el níquel me da el color. |
| `verde-nilo` | Verde Nilo |  | En francés soy el «agua» de un río de Egipto. Hitchcock vistió conmigo a Grace Kelly en La ventana indiscreta. |
| `verde-quirofano` | Verde quirófano |  | Un cirujano me eligió en lugar del blanco, que cansaba la vista bajo la luz intensa. Reduzco las imágenes residuales tras mirar sangre. |
| `verde-hooker` | Verde Hooker |  | Un ilustrador de la Royal Horticultural Society me inventó mezclando azul de Prusia y gutagamba, para pintar las hojas de sus láminas. |
| `pistacho` | Pistacho |  | Mi nombre viene del persa medio pistakē. Ya me comían hacia el 6750 a. C. |
| `peridoto` | Peridoto | leyenda | En la Antigüedad me sacaban de la isla de Zabargad y me llamaban «topacio». Que Cleopatra me hiciera pasar por esmeralda es leyenda. |
| `jade` | Jade |  | Los conquistadores me llamaban «piedra de la ijada» y me usaban como remedio para el costado. |
| `alejandrita` | Alejandrita |  | Aparecí en los Urales hacia 1830 y me dedicaron a un futuro zar. Soy verdosa de día y rojiza con luz incandescente. |
| `viridiana` | Viridiana |  | Soy óxido de cromo hidratado. Me prepararon en París en 1838 con un método caro y secreto. |
| `verde-cobalto` | Verde cobalto |  | Me descubrió el químico sueco Sven Rinman en 1780. Apenas se me usa: coloreo poco y soy caro. |
| `moldavita` | Moldavita |  | Soy un vidrio que nació cuando cayó un meteorito en Alemania, hace unos 15 millones de años. Me llaman como un río de Bohemia. |
| `verde-botella` | Verde botella |  | Me llamo como el vidrio de unos recipientes. En inglés soy nombre de color desde 1816. |
| `salvia` | Salvia |  | Los romanos a veces me llamaban «la salvadora». En la Edad Media tuve gran fama medicinal y muchos refranes. |
| `malaquita` | Malaquita |  | Mi nombre griego quiere decir «piedra verde malva». En el antiguo Egipto me molían para pintarse los ojos. |
| `esmeralda` | Esmeralda |  | Mi nombre griego quiere decir «gema verde». Colombia, con minas como Muzo, ha sido mi mayor productor. |
| `verde-paris` | Verde París |  | Me usaban como veneno para ratas en las alcantarillas de una capital. Monet y Gauguin apreciaban mi tono intenso. |
| `tierra-verde` | Tierra verde |  | Soy de celadonita y glauconita. En la Edad Media me ponían debajo de la piel pintada, y Cennini decía que los antiguos solo doraban conmigo. |
| `verde-billar` | Verde billar |  | Visto el paño de unas mesas en homenaje a la hierba de los juegos al aire libre de los que nacieron. |
| `menta` | Menta | leyenda | Soy una de las plantas aromáticas más antiguas. Según el mito griego, fui una ninfa amada por Hades a la que una diosa convirtió en planta. |
| `lima` | Lima |  | Los marineros británicos me tomaban contra el escorbuto, y por eso les llaman limeys. |
| `chartreuse` | Chartreuse |  | Me llamo como un licor de monjes cartujos con 130 plantas, cuya fórmula solo conocen unos pocos. |
| `verde-lincoln` | Verde Lincoln | leyenda | Una gran ciudad pañera inglesa me teñía con glasto y gualda. Que Robin Hood me vistiera es cosa de baladas, no de historia. |

### Azules (35)

| id | Color | Ficha | Acertijo |
|---|---|---|---|
| `celeste` | Celeste |  | Mi nombre latino quiere decir «del cielo». Lord Rayleigh explicó en 1899 por qué el aire dispersa más la luz azul que la roja. |
| `marino` | Azul marino |  | Me fijó en 1748 el primer reglamento de uniformes de los oficiales de la Armada británica. Disimulaba la suciedad en los viajes largos. |
| `turquesa` | Turquesa |  | Me llamaron como al pueblo que solo me transportaba. Yo venía de Persia y del Sinaí. |
| `prusia` | Azul de Prusia | discutido | Nací de un error en Berlín: querían un rojo. Más de un siglo después pinté una ola en Japón. |
| `indigo` | Índigo |  | Mi nombre griego significa «tinte de la India». Newton me contó en el arcoíris, y hoy tiño los vaqueros. |
| `ultramar` | Ultramar |  | Mi nombre quiere decir «de más allá del mar». En el Renacimiento valía tanto como el oro y se reservaba para el manto de la Virgen. |
| `tekhelet` | Tekhelet | discutido | Soy el azul que la Biblia manda usar en los flecos rituales. Mi receta se perdió hacia el siglo VI, y aún se discute de qué caracol salía. |
| `azul-talavera` | Azul Talavera |  | Salgo de la cerámica de una ciudad española que llegó a la vajilla de El Escorial. La UNESCO me hizo patrimonio en 2019, junto a Puebla y Tlaxcala. |
| `azulete` | Azulete |  | Soy el diminutivo de un color. Me echaban al lavado para que la ropa blanca pareciera más blanca. |
| `azul-han` | Azul Han |  | Llevo el nombre de una dinastía china. Soy casi gemelo de un pigmento egipcio, pero con bario en lugar de calcio. |
| `lapislazuli` | Lapislázuli |  | Mi nombre une «piedra» y «cielo». En Afganistán me sacan desde hace más de 6.000 años, y estoy en la máscara de Tutankamón. |
| `azul-delft` | Azul Delft |  | Cuando en 1620 se cortó la porcelana china, los alfareros de una ciudad holandesa me usaron para imitarla en loza de dos colores. |
| `glasto` | Glasto | discutido | Fui el gran tinte azul de la Europa medieval, y Toulouse se enriqueció comerciando conmigo. También me llaman hierba pastel. |
| `azul-francia` | Azul Francia |  | Desde el siglo XII soy el fondo de las flores de lis de oro de unos reyes. Hoy visto a sus equipos nacionales. |
| `azul-chefchaouen` | Azul Chefchaouen | discutido | Me llaman la perla de Marruecos, pero nadie sabe por qué me pintaron así. |
| `tanzanita` | Tanzanita |  | Me descubrieron en 1967 y solo existo en una pequeña zona de un país africano. Tiffany me cambió el nombre porque el de antes no vendía. |
| `azul-ming` | Azul Ming |  | Pinto una porcelana china gracias al cobalto traído de Persia. Llevo el nombre de una de sus dinastías. |
| `azul-wedgwood` | Azul Wedgwood |  | Un ceramista inglés me puso en su jasperware, un gres mate con relieves blancos, en la década de 1770. |
| `zafiro` | Zafiro |  | Soy corindón, como el rubí, y el hierro y el titanio me dan el color. |
| `azul-cobalto` | Azul cobalto |  | Thénard me descubrió en 1802 con alúmina y el metal que me da el nombre. Varley me propuso para sustituir al ultramar. |
| `ceruleo` | Cerúleo |  | Mi nombre latino quería decir «azul oscuro o verdoso». Monet me usó en las sombras de La estación de Saint-Lazare. |
| `azul-yinmn` | Azul YInMn |  | Me llamo por tres elementos químicos. Me encontraron por casualidad en Oregón en 2009, y Crayola sacó una cera inspirada en mí que no me lleva. |
| `azul-egipcio` | Azul egipcio |  | Me consideran el primer pigmento sintético. Mi ejemplo más antiguo, de hacia el 3250 a. C., está en un cuenco de Hieracómpolis. |
| `azul-persa` | Azul persa |  | Evoco la cerámica y los azulejos de las mezquitas de Irán. En inglés soy color desde 1669. |
| `esmalte` | Esmalte |  | Soy vidrio de cobalto molido. En Inglaterra me añadían al almidón de la ropa, y en los cuadros me he decolorado. |
| `azul-klein` | Azul Klein |  | Un artista me puso su apellido y registró mi fórmula en 1960, en un sobre con fecha que no es una patente. |
| `azurita` | Azurita |  | Fui el azul barato de los pintores medievales, mucho más que el ultramar. Con el tiempo puedo verdear y convertirme en malaquita. |
| `azul-cambridge` | Azul Cambridge |  | Soy el tono claro de una universidad, rival de Oxford en la regata. Dicen que vengo del colegio de Eton. |
| `azul-maya` | Azul maya |  | Soy índigo fijado en una arcilla, y en los murales de Chichén Itzá aguanto más de mil años. Me usaban en las ofrendas al dios Chaac. |
| `azul-majorelle` | Azul Majorelle |  | Un pintor francés me usó en su jardín de Marrakech, que luego compraron y restauraron Yves Saint Laurent y Pierre Bergé. |
| `pavo-real` | Pavo real |  | Mi pigmento es marrón: el color sale de la estructura de unas plumas. Hooke las miró al microscopio en 1665. |
| `azul-oxford` | Azul Oxford |  | Me eligieron dos remeros para la primera regata contra Cambridge, en 1829. De ahí el apodo de los «azules oscuros». |
| `cian` | Cian |  | Soy una de las cuatro tintas de la imprenta. Mi nombre griego, kyanos, era el lapislázuli. |
| `azul-alicia` | Azul Alicia |  | Fui el favorito de la hija de Theodore Roosevelt. En 1919 un musical me dedicó una canción. |
| `aguamarina` | Aguamarina |  | Mi nombre latino quiere decir «agua de mar». Soy un berilo, como la esmeralda. |

### Violetas (18)

| id | Color | Ficha | Acertijo |
|---|---|---|---|
| `purpura` | Púrpura de Tiro | discutido | Salgo de caracoles marinos: 12.000 dan apenas 1,4 gramos. En el siglo IV solo el emperador romano podía vestirme. |
| `malva` | Malva |  | Me encontró un químico de 18 años que buscaba quinina. La revista Punch llegó a hablar de mi «sarampión». |
| `violeta-de-genciana` | Violeta de genciana |  | Me sintetizaron en 1883, y en 1884 Gram me usó para clasificar bacterias. No me hacen con ninguna de las flores de mi nombre. |
| `nazareno` | Nazareno |  | Mi nombre es un gentilicio, y visto la túnica de los penitentes de Semana Santa. |
| `tornasol` | Tornasol |  | Soy rojo en ácido y azul en base, y por eso me usan para medir la acidez. Salgo de unos líquenes. |
| `murexida` | Murexida |  | Mi nombre recuerda a un caracol de la púrpura. Hacia 1853 me fabricaban con guano sudamericano. |
| `purpura-han` | Púrpura Han |  | Coloreo los pantalones de los guerreros de terracota. Soy hermano de un azul de la misma dinastía china. |
| `lila` | Lila |  | Mi nombre viajó desde el sánscrito «azul oscuro» por el persa, el árabe y el francés. En inglés soy color desde 1775. |
| `purpura-de-casio` | Púrpura de Casio |  | Un médico de Hamburgo estudió en 1665 cómo el oro sobre óxido de estaño daba color. Doy el rojo al vidrio rubí. |
| `morado` | Morado |  | Me llamo por una fruta. Soy el color de la Iglesia para el Adviento y la Cuaresma. |
| `orchilla` | Orchilla |  | Soy el nombre canario de un liquen. Los tintoreros europeos me buscaban por mi tinte rojo violáceo. |
| `ciruela` | Ciruela |  | Mi nombre latino quiere decir «de color de cera». En inglés me nombran en 1789, por la fruta pasa cocida. |
| `glicinia` | Glicinia |  | Mi nombre latino honra al anatomista Caspar Wistar, aunque Nuttall lo escribió con otra vocal «por eufonía». |
| `amatista` | Amatista | leyenda | Mi nombre griego significa «no ebrio»: se creía que protegía de la borrachera a quien me llevaba. |
| `lavanda` | Lavanda |  | Mis flores secas van en saquitos entre la ropa para perfumarla y espantar a las polillas. Quizá mi nombre venga de «lavar», pero no es seguro. |
| `berenjena` | Berenjena |  | Mi nombre viajó del persa al árabe y llegó a la península con los árabes, igual que yo. |
| `violeta` | Violeta |  | Estoy en el extremo del espectro visible. Justo detrás empieza una luz que ya no vemos y que lleva mi nombre. |
| `heliotropo` | Heliotropo |  | Mi nombre griego quiere decir «que gira hacia el sol», como se creía de mis flores. |

### Marrones (24)

| id | Color | Ficha | Acertijo |
|---|---|---|---|
| `marron` | Marrón |  | Mi nombre francés es una castaña comestible. Hubo una versión de mí hecha con momias molidas, y Burne-Jones enterró su tubo en el jardín. |
| `siena` | Siena tostada |  | Vengo de una ciudad toscana, y el fuego me volvió rojiza. |
| `topo` | Topo |  | En francés me llamo como el pelaje de un animal que vive bajo tierra. Soy de los nombres más imprecisos: ni los diseñadores se ponen de acuerdo. |
| `cachu` | Cachú |  | Soy un extracto vegetal rico en taninos. Tiño lana y curto pieles, y en el sur de Asia formo parte del paan. |
| `terracota` | Terracota |  | Mi nombre latino quiere decir «tierra cocida». Un emperador chino se hizo enterrar con un ejército hecho de mí. |
| `bronce` | Bronce |  | Soy cobre con estaño, y di nombre a una edad que empezó hacia el 3000 a. C. |
| `gamuza` | Gamuza |  | Me llamo como la piel curtida del rebeco: suave, aterciopelada y amarillo pálido. Hoy también soy una bayeta. |
| `capuchino` | Capuchino |  | Me llamo como el hábito de unos frailes, y un café vienés tomó mi nombre a finales del siglo XVIII. |
| `canela` | Canela | leyenda | Soy una corteza seca en forma de canuto. Heródoto contaba que unas aves gigantes me usaban para sus nidos; ya Plinio lo llamó cuento. |
| `chocolate` | Chocolate | discutido | Mi palabra llegó a Europa desde el náhuatl a través del español. Quizá venga de «agua amarga», pero se discute. |
| `castano` | Castaño |  | Mi nombre griego eran unas nueces de árbol. Comparto fruto con otro color que llegó del francés. |
| `caoba` | Caoba |  | Mi nombre es de origen caribe. Los ebanistas británicos del siglo XVIII me preferían para sus mejores muebles. |
| `tabaco` | Tabaco |  | Mi nombre árabe era el de unas hierbas medicinales que mareaban. Los españoles se lo pusieron a una planta americana. |
| `avellana` | Avellana |  | Mi nombre latino es la «nuez de Avella», una ciudad de Campania famosa por estos frutos. |
| `pulga` | Pulga | leyenda | Me dio nombre un bicho que salta, y fui moda en la corte de Luis XVI. Que fuera el favorito de María Antonieta es solo leyenda. |
| `sombra` | Sombra | discutido | Quizá me llamo por una región italiana. Tengo mucho manganeso, seco rápido y los pintores me usan para la primera capa. |
| `cafe` | Café |  | Mi nombre viajó con la bebida: de Arabia a Turquía, de Turquía a Italia y de ahí al resto de Europa. |
| `caqui` | Caqui |  | Mi nombre viene del hindi y del pelvi «polvo». Me estrenó en 1846 el Cuerpo de Guías del ejército británico de la India. |
| `camello` | Camello |  | Me llamo por el pelo de un animal, una fibra para abrigos. Los pinceles que dicen llevarlo suelen ser de buey. |
| `pardo-van-dyck` | Pardo Van Dyck |  | Llevo el apellido de un pintor, pero soy siglos más antiguo que él. Antes me llamaban tierra de Cassel o de Colonia. |
| `nogal` | Nogal |  | Mi nombre viene de «relativo a la nuez», y la cáscara verde del fruto da un tinte marrón. |
| `leonado` | Leonado |  | Soy el color del pelo de un gran felino, y la RAE me da por sinónimos rojizo y rubio. |
| `bistre` | Bistre |  | Soy hollín de madera de haya hervido con agua. Muchos viejos maestros me usaron como tinta para sus dibujos a la aguada. |
| `sepia` | Sepia |  | Me sacaban de la bolsa de tinta de un animal marino, y por mí las fotos antiguas se ven marrones. |

### Blancos (13)

| id | Color | Ficha | Acertijo |
|---|---|---|---|
| `marfil` | Marfil |  | Mi nombre en árabe hispánico quería decir «hueso de elefante». Carbonizado y molido, daba uno de los negros de los pintores. |
| `alabastro` | Alabastro |  | Los frascos de ungüentos de la Antigüedad se hacían conmigo y me dieron nombre. Quizá venga de la diosa Bastet. |
| `blanco-de-espana` | Blanco de España |  | Soy creta molida, hecha de conchas diminutas de algas del plancton. Sirvo para limpiar metales, baldosas y zapatos. |
| `armino` | Armiño |  | Me llamo como la piel de invierno de un animal, con la punta de la cola negra. Forraba los mantos de coronación. |
| `blanco-de-titanio` | Blanco de titanio |  | Soy el pigmento claro más usado del mundo, fabricado en masa desde 1916. Como aditivo, el E171, la UE me prohibió en 2022. |
| `blanco-de-zinc` | Blanco de zinc |  | En acuarela me vendieron como «chino». Era menos tóxico que el de plomo, pero al óleo me vuelvo quebradizo. |
| `hueso` | Hueso |  | Me llamo como lo que sostiene el cuerpo por dentro. En inglés soy color desde principios del siglo XIX. |
| `perla` | Perla |  | Nazco dentro de un molusco vivo, capa a capa de nácar. A Felipe II le ofrecieron una llamada Peregrina. |
| `nacar` | Nácar |  | Soy la capa interior de algunas conchas, y brillo de colores por mis láminas de aragonito. Mi nombre árabe quería decir «tamboril». |
| `beige` | Beige |  | En francés, mi nombre era la lana natural, sin blanquear ni teñir. En inglés soy color desde 1887. |
| `isabelino` | Isabelino | leyenda | Una reina de Inglaterra tenía un vestido de satén de mi color. Lo de la camisa sucia de otra reina es solo leyenda. |
| `crema` | Crema |  | Me llamo como la nata de la leche: un blanco con un toque amarillo. |
| `opalo` | Ópalo |  | Mis destellos de colores salen de esferas de sílice ordenadas. Se suele decir que Australia produce casi todo el precioso del mundo. |

### Grises (14)

| id | Color | Ficha | Acertijo |
|---|---|---|---|
| `gris` | Gris |  | Pintar solo conmigo tiene nombre propio. Van Eyck me usó por fuera del retablo de Gante para imitar estatuas. |
| `payne` | Gris de Payne |  | Un acuarelista inglés me mezcló con azul de Prusia, ocre y laca carmesí, para tener algo menos duro que el negro. |
| `ceniza` | Ceniza |  | Un miércoles al año me ponen en la frente, hecha con las palmas del Domingo de Ramos anterior. |
| `plata` | Plata |  | Mi símbolo es Ag, del latín argentum, y un país sudamericano tomó su nombre de mí. |
| `gris-davy` | Gris Davy |  | Me trajo a Inglaterra Henry Davey. Soy arcilla y pizarra muy molidas. |
| `plomo` | Plomo |  | Mi símbolo es Pb, y de mí viene la palabra inglesa para la fontanería. Griegos y romanos ya sabían que era tóxico. |
| `peltre` | Peltre |  | Soy una aleación de estaño que antes podía llevar mucho plomo. Fui platos y jarras hasta que llegaron la loza y el vidrio. |
| `gris-marengo` | Gris marengo | discutido | Me llamo como una ciudad italiana. Suele relacionarse con una batalla de Napoleón en 1800, pero la RAE solo menciona la ciudad. |
| `pizarra` | Pizarra |  | Quizá vengo del vasco lapitzarri. Me parto en láminas finas, mis tejados duran siglos y en las escuelas se escribía sobre mí. |
| `gris-acero` | Gris acero |  | Soy hierro con un poco de carbono. Los famosos de Damasco vienen de la India, y Bessemer me fabricó en masa en 1855. |
| `hematites` | Hematites |  | Me veo negra o gris acero, pero al rayarme dejo un trazo rojo. Mi nombre griego viene de «sangre», y Opportunity me encontró en Marte. |
| `feldgrau` | Feldgrau |  | En alemán soy el «gris de campaña». Vestí al ejército alemán de 1910 a 1945. |
| `gris-confederado` | Gris confederado |  | Vestí a un ejército de la guerra de Secesión porque era barato de teñir, y con el tiempo me desteñía a pardo amarillento. |
| `gris-acorazado` | Gris acorazado |  | Soy la pintura antióxido de los cascos de hierro y acero de los buques de guerra. |

### Negros (13)

| id | Color | Ficha | Acertijo |
|---|---|---|---|
| `antracita` | Antracita |  | Mi nombre griego quiere decir «parecido al carbón», y soy el de mayor calidad: casi todo carbono. |
| `tinta-ferrogalica` | Tinta ferrogálica |  | Me hacen con hierro y agallas de roble. Conmigo se escribió el Códice Sinaítico, y con el tiempo puedo comerme el papel. |
| `onice` | Ónice |  | Mi nombre griego quiere decir «garra» o «uña», y la palabra inglesa nail es pariente. |
| `negro-de-hueso` | Negro de hueso |  | Salgo del esqueleto calcinado. Rembrandt, Velázquez y Picasso me usaron, y durante mucho tiempo sirvió para refinar el azúcar. |
| `negro-marte` | Negro Marte |  | Llevo el nombre del dios romano de la guerra, patrón del hierro. Soy un óxido de hierro del siglo XX. |
| `azabache` | Azabache |  | Fui amuleto de peregrinos en Santiago y joya de luto en la Inglaterra victoriana. Vengo de Asturias. |
| `palo-de-campeche` | Palo de Campeche |  | Soy una madera de tinte de México. Belice nació de campamentos ingleses que me cortaban, con leñadores que a menudo habían sido piratas. |
| `negro-de-vid` | Negro de vid |  | Soy carbón de sarmientos quemados. Más débil que el de humo, pero aguanto muy bien la luz. |
| `ebano` | Ébano |  | Soy una madera tan densa que a veces se hunde en el agua. Con ella se hacen las teclas negras del piano. |
| `obsidiana` | Obsidiana |  | Soy vidrio volcánico y me rompo en filos cortantes. Los aztecas me ponían en sus espadas y en espejos para Tezcatlipoca. |
| `negro-de-humo` | Negro de humo |  | Soy hollín de lámparas de aceite. Rembrandt y Vermeer pintaron con pigmentos de carbón como yo. |
| `luto` | Luto |  | Mi nombre latino quiere decir «dolor». La reina Victoria me llevó durante años por el príncipe Alberto. |
| `vantablack` | Vantablack |  | Absorbo hasta el 99,965 % de la luz. Anish Kapoor se quedó con mi uso artístico, y otro artista respondió con el rosa más rosa. |

## 4. Revisión

Para quien revise (Iñigo, otras IA, testers). Por cada acertijo:

- **¿Es verdad?** Compararlo con la ficha del color en `data/colores.json` (`nombre`,
  `historia`, `nota`). Si dice algo que la ficha no dice, se quita.
- **¿Lo dudoso está marcado?** Sobre todo en los que tienen algo en la columna «Ficha».
- **¿Se adivina?** Ni regalado ni imposible. Recordar que la pista ya dice la familia («Pista ·
  un rojo»).
- **¿Suena bien en primera persona** y se entiende a la primera?

Anotar aquí lo que se cambie (id, antes, después y por qué):

*(Nada todavía.)*
