# Villa Pelón — control de versiones

## Versión activa
**V62**

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
3. `life.js` — simulación temporal y vida autónoma.
4. `game.js` — render, cámara, movimiento, interacción y único loop.
5. `v57_integrity.js` — validaciones y correcciones de integridad.
6. `v55_runtime_integrator.js` — coordinación.
7. `ui_system.js` — interfaz, menú, persistencia de usuario, idioma y audio.
8. `controls.js` — entrada táctil complementaria.
9. `v50_version_badge.js` — versión visible.

## Regla profesional
No crear segundos motores, loops, estados paralelos ni sistemas de misión aislados. Todo nuevo sistema debe conectarse a las autoridades existentes y aumentar la versión.

## Próximo salto — V63
- Entidades únicas de NPC.
- Rutinas horarias compartidas entre simulación e interacción.
- Misiones definidas por datos.
- Inventario y objetos con IDs.
- Interacción contextual.
- Interiores reales y transiciones.
- Persistencia versionada con migraciones.
- Evidencias históricas coleccionables y archivo de memoria.
- Sistema de audio ambiental por zona/hora.
