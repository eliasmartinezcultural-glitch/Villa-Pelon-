# Villa Pelón — control de versiones

## Versión activa
**V66**

## V66 — NPC Consolidation
- Se consolida la identidad de los ciudadanos interactivos con las entidades autónomas de `life.js`.
- Los NPC compartidos mantienen una única posición dinámica para rutina, movimiento, destino y actividad.
- Se evita el doble dibujo de los cinco ciudadanos interactivos que ya existen en `game.js`.
- LIFE conserva la autoridad de rutina y simulación autónoma; `game.js` conserva la autoridad de interacción y movimiento del jugador.
- Se mantienen teclado, controles móviles, cámara, colisiones, economía, diálogo y guardado del núcleo V65.
- `index.html` incorpora cache bust V66 y carga explícita de `v66_npc_consolidation.js`.

## V65 — Player Repair
- Se reparó el movimiento del jugador sin crear un segundo game loop.
- Se incorporó `player_movement_v65.js` como puente de recuperación mientras se prepara la consolidación arquitectónica definitiva del movimiento dentro de `game.js`.
- Se mantiene la compatibilidad PC/móvil y el único ciclo principal.

## V63 — Input Consolidation
- La entrada móvil queda consolidada como bridge `pointer/touch → teclado sintético → game.js`.
- `game.js` continúa siendo la autoridad de movimiento y conserva el único game loop.
- Liberación segura mediante `pointerup`, `pointercancel`, `lostpointercapture`, `blur` y `visibilitychange`.

## V62 — Worldplay Core
- Nueva introducción narrativa: el objetivo es descubrir la historia mediante misiones y exploración.
- Mundo ampliado conceptualmente por zonas: centro, barrio, rural, ribera y servicios/comunidad.
- Nuevos puntos de interés y actividades cotidianas definidos como datos.
- Menú de partida, guardado por ranuras, carga, reinicio, idioma, música, pantalla completa y ayuda.
- Soporte PC y celular sobre una única autoridad de movimiento.

## Arquitectura de autoridad
1. `core/runtime.js` — ciclo de vida y salud.
2. `village_data.js` — datos del mundo y contenido.
3. `life.js` — simulación temporal y vida autónoma.
4. `game.js` — render, cámara, movimiento, interacción y único loop.
5. `v66_npc_consolidation.js` — enlace de ciudadanos compartidos entre LIFE e interacción.
6. `v57_integrity.js` — validaciones y correcciones de integridad.
7. `v55_runtime_integrator.js` — coordinación.
8. `ui_system.js` — interfaz, menú, persistencia, idioma y audio.
9. `controls.js` — bridge de entrada táctil.
10. `v50_version_badge.js` — versión visible.

## Próximo ladrillo
Consolidar el movimiento del jugador dentro de `game.js` y retirar el puente V65. Después, conectar rutinas de ciudadanos a actividades/interacciones contextuales y comenzar la expansión territorial verificable sin duplicar autoridades.
