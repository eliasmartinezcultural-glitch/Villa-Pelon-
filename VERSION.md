# Villa Pelón — control de versiones

## Versión activa
**V67**

## V67 — Movimiento consolidado
- Se retira `player_movement_v65.js`, que había sido creado como puente temporal de recuperación.
- `game.js` queda como autoridad directa del movimiento del jugador dentro del único game loop existente.
- Se conserva el movimiento PC/móvil, cámara, colisiones, interacción, energía y avance temporal del núcleo funcional.
- `index.html` elimina la carga del puente V65 y adopta cache bust V67.
- No se agrega un segundo loop ni otra autoridad de movimiento.

## V66 — NPC Consolidation
- Se consolida la identidad de los ciudadanos interactivos con las entidades autónomas de `life.js`.
- Los NPC compartidos mantienen una única posición dinámica para rutina, movimiento, destino y actividad.
- Se evita el doble dibujo de los cinco ciudadanos interactivos que ya existen en `game.js`.
- LIFE conserva la autoridad de rutina y simulación autónoma; `game.js` conserva la autoridad de interacción y movimiento del jugador.

## V65 — Player Repair
- Se reparó el movimiento del jugador sin crear un segundo game loop.
- Se incorporó temporalmente `player_movement_v65.js` como puente de recuperación.
- El movimiento quedó posteriormente consolidado en `game.js` en V67.

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
Con el movimiento ya consolidado, el siguiente ladrillo es convertir los ciudadanos compartidos en una primera rutina contextual verificable por franjas horarias y destinos: trabajo, escuela, comercio, plaza, radio y hogar. Después se podrá conectar cada rutina con interacciones concretas y comenzar una expansión territorial real sin duplicar autoridades.
