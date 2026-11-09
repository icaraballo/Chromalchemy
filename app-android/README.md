# Chromalchemy · app de Android

El juego de la carpeta de arriba, empaquetado con [Capacitor](https://capacitorjs.com/) para Android.
La web es el original: aquí no se edita el juego, sólo se copia y se empaqueta.

```
npm install      # la primera vez
npm run apk      # APK firmado, para instalar en un móvil
npm run aab      # AAB firmado, para Google Play
```

Necesita Java 21 y el Android SDK (plataforma 36). La clave de firma vive fuera del repo
(`~/Claves_Android/chromalchemy.properties`); sin ella, `construir.mjs` se para.

- `copiar-web.mjs`: copia a `www/` lo que carga el juego (sin capturas, tarjeta, tests ni herramientas).
- `construir.mjs`: copia, sincroniza y fabrica.
- `iconos/dibujar.mjs`: dibuja los originales del icono en `assets/`; los tamaños los saca
  `npx capacitor-assets generate --android`.

Plugins de Capacitor que usa el juego (los llama `window.Capacitor.Plugins`, sin importarlos):
`App` para el botón «atrás» de Android (`js/atras.js`), y `Filesystem` + `Share` para que
«Compartir póster» abra el menú de compartir (`js/poster.js`). En la web no se usan.
