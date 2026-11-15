# Decisiones

- Sin build ni CDN: Canvas, JS y WebAudio nativos, con coordenadas virtuales de 960×540 y rutas relativas.
- Cinco zonas de 3.600 px; suelo continuo para garantizar una ruta geométrica accesible. Semilla determina posiciones, fases y monedas; los guardianes bloquean el avance hasta ser derrotados.
- Las fases de los guardianes cambian el color y frecuencia de contacto peligroso. Hay cinco clases de enemigo, incluidas torretas con proyectiles reutilizados. Checkpoints recuperan vidas hasta el mínimo de la dificultad; se puede continuar desde ellos tras morir.
- Red pequeña lineal de 6 entradas × 3 salidas; selección elitista y mutación. La evaluación tiene límite de pasos y semilla fija, para comparar fitness. Bot heurístico independiente.
- Audio procedural y partículas limitadas; offline requiere primera visita por HTTPS o localhost. La fecha diaria usa UTC para compartir semilla global.
- El entorno exige trabajar exclusivamente en la rama de sesión; no se modifica ni se sube directamente `main`. Para publicar en main se deberá integrar esta rama mediante PR.
- No se encontró un navegador headless instalado; se usan pruebas de Node y un DOM/canvas simulado, sin afirmar pruebas reales de navegador o dispositivo.
