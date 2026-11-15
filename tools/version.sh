#!/bin/sh
# Cambia la versión del juego en index.html, js/data.js y app-android/ (package.json y build.gradle).
# Uso: tools/version.sh 1.28
set -e
case "$1" in
  ''|*[!0-9.]*|.*|*.|*..*) echo "Uso: tools/version.sh <versión>   (p. ej. 1.28)"; exit 1 ;;
esac
cd "$(dirname "$0")/.."
# -i.bak vale igual en el Mac (BSD) y en Windows y Linux (GNU)
sed -i.bak -E "s/\?v=[0-9.]+/?v=$1/g; s|<span class=\"tag\">v[0-9.]+</span>|<span class=\"tag\">v$1</span>|" index.html && rm index.html.bak
sed -i.bak -E "s/colores\.json\?v=[0-9.]+/colores.json?v=$1/g" js/data.js && rm js/data.js.bak
sed -i.bak -E "s/\"version\": \"[0-9.]+\"/\"version\": \"$1\"/" app-android/package.json && rm app-android/package.json.bak
sed -i.bak -E "s/versionName \"[0-9.]+\"/versionName \"$1\"/" app-android/android/app/build.gradle && rm app-android/android/app/build.gradle.bak
echo "v$1 → index.html ($(grep -c "?v=$1" index.html) archivos), js/data.js, app-android/package.json y build.gradle"
