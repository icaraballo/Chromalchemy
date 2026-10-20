#!/bin/sh
# Cambia la versión del juego en index.html: la etiqueta de la barra y el ?v= de cada archivo.
# Uso: tools/version.sh 1.2
set -e
[ -n "$1" ] || { echo "Uso: tools/version.sh <versión>   (p. ej. 1.2)"; exit 1; }
cd "$(dirname "$0")/.."
# -i.bak vale igual en el Mac (BSD) y en Windows y Linux (GNU)
sed -i.bak -E "s/\?v=[0-9.]+/?v=$1/g; s|<span class=\"tag\">v[0-9.]+</span>|<span class=\"tag\">v$1</span>|" index.html && rm index.html.bak
echo "index.html → v$1: $(grep -c "?v=$1" index.html) archivos y la etiqueta"
