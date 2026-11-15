# GameMind Evolution

Plataformas de desplazamiento lateral e inteligencia artificial, en español, sin dependencias ni compilación. Abre `index.html` o sirve la carpeta con `python3 -m http.server 8000` y visita `http://localhost:8000/`. El uso de pantalla completa, audio y almacenamiento depende de los permisos y capacidades del navegador. En Android se recomienda jugar en horizontal.

## Cómo jugar

Avanza por cinco biomas y vence a los cinco guardianes con pisotones o dash. Recoge monedas y mejoras temporales. El paso a cada bioma y el acceso a cada guardián recuperan vidas hasta el mínimo de la dificultad; al morir se puede continuar desde el último checkpoint. Las monedas de cada intento se añaden al banco al terminar. La tienda vende mejoras para el inicio de partidas posteriores. Hay tres logros. En reto diario la semilla es la fecha UTC; en aventura se genera al azar.

- Teclado: A/D o flechas, espacio/W/arriba para saltar (doble salto), X/Shift para dash.
- Pantalla táctil: botones inferiores; acepta varios punteros simultáneos.
- Mando estándar: eje izquierdo/cruceta, botón A para saltar y X para dash.
- Ajustes: dificultad, paleta de contraste y tamaño del HUD. `?debug=1` muestra FPS.

## IA

«Ver al bot» usa una heurística. «Entrenar IA» evoluciona 100 redes lineales pequeñas; cada individuo usa la misma simulación de física, con un máximo de 1.800 pasos y ejecución por bloques de aproximadamente 7 ms por cuadro. El mejor cerebro se guarda localmente y se puede exportar/importar como JSON y visualizar. La métrica combina distancia, puntuación y victoria. La evolución no garantiza que el cerebro aprenda a terminar el nivel; usa una semilla fija para comparar generaciones. La fecha del reto diario se basa en UTC.

## Publicar en GitHub Pages

En GitHub, abre Settings → Pages y elige **Deploy from a branch**, la rama que se quiera publicar y `/ (root)`. Las rutas son relativas, por lo que funciona tanto en la raíz como bajo `/REPO/`. URL prevista para este repositorio: https://karmaoriginal.github.io/cautious-bassoon/ (cuando Pages esté activado y publicada la rama correcta). No se necesita build. El service worker almacena los archivos locales para uso offline tras la primera visita por HTTPS o localhost; al abrir directamente `file://` no se registra. El navegador puede limitar la instalación PWA o la orientación.

## Pruebas

Con Node.js: `node tests/engine.test.js && node tests/ui.test.js`. El primero comprueba 200 semillas, física y evolución determinista; el segundo usa un DOM/canvas simulado para recorrer los menús y una partida del bot, persistencia, entrenamiento y panel de errores. No sustituye una prueba en navegador real, en Android, de audio, mando, instalación PWA ni rendimiento. El guardado y el mejor modelo están en `localStorage`; si está bloqueado, el juego sigue sin persistencia.
