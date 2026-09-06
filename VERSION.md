# Villa Pelón — control de versiones

## Versión activa
**V63**

## V63 — Territorial Identity
- Villa Pelón pasa a tener una identidad territorial coherente de valle rural irrigado norpatagónico.
- Se incorpora `regional_identity.js` como autoridad de identidad territorial y reglas de ficción.
- El nombre de la localidad real que inspira el territorio queda fuera de la experiencia del juego.
- Se incorporan geografía, producción, clima, vegetación, caminos, canales, ribera, viñedos y chacras como pilares del mundo.
- Se incorporan topónimos ficticios propios de Villa Pelón: Río Pelón, Canal Viejo, Los Viñedos, Las Chacras, La Meseta, Camino de los Álamos y Bodega La Ribera.
- La introducción pasa a explicar el origen territorial del pueblo desde el agua, el trabajo rural y la memoria comunitaria.
- La investigación histórica externa queda separada de la ficción: las evidencias reales deberán conservar fuentes verificables sin romper la identidad de Villa Pelón.
- Se mantiene la regla de un único motor, un único loop y autoridades estructurales claras.

## V62 — Worldplay Core
- Nueva introducción narrativa: el objetivo es descubrir la historia mediante misiones y exploración.
- Mundo ampliado conceptualmente por zonas: centro, barrio, rural, ribera y servicios/comunidad.
- Nuevos puntos de interés y actividades cotidianas definidos como datos.
- Contenido histórico separado de ficción de ambientación: los hechos reales requieren fuente verificable.
- Menú de partida, guardado por ranuras, carga, reinicio, idioma, música, pantalla completa y ayuda.
- Soporte PC y celular sobre una única autoridad de movimiento.
- V62 visible como `V62 · worldplay-core`.

## V61 — Player Systems
- Menú de pausa para PC y celular.
- Guardado manual en 3 ranuras locales.
- Carga por ranura y reinicio con confirmación.
- Idioma ES / EN / PT para la interfaz principal.
- Música ambiental procedural mediante Web Audio.
- Pantalla completa y ESC.
- Controles táctiles reforzados.
- HUD y menú responsive.

## Arquitectura de autoridad
1. `core/runtime.js` — ciclo de vida y salud.
2. `village_data.js` — datos del mundo y contenido.
3. `regional_identity.js` — identidad territorial, ficción y reglas de representación.
4. `life.js` — simulación temporal y vida autónoma.
5. `game.js` — render, cámara, movimiento, interacción y único loop.
6. `v57_integrity.js` — validaciones y correcciones de integridad.
7. `v55_runtime_integrator.js` — coordinación.
8. `ui_system.js` — interfaz, menú, persistencia de usuario, idioma y audio.
9. `controls.js` — entrada táctil complementaria.
10. `v50_version_badge.js` — versión visible.

## Regla territorial permanente
Villa Pelón debe sentirse como un pueblo real del valle norpatagónico, pero nunca debe revelar el nombre real que inspira su diseño. La referencia real sirve para investigación y coherencia; la experiencia del jugador pertenece exclusivamente a Villa Pelón.

## Próximo salto — V64
- Geometría territorial realista dentro del mapa ficticio.
- Entidades únicas de NPC y rutinas horarias.
- Misiones y evidencias históricas definidas por datos.
- Inventario y objetos con IDs.
- Interiores y transiciones.
- Persistencia versionada con migraciones.
- Archivo de memoria.
- Audio ambiental por zona y hora.
