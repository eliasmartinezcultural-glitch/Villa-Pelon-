# Villa Pelón — control de versiones

## Versión activa
**V71**

## V71 — Primer interior reutilizable
- Se incorpora `interior_system_v71.js` como módulo data-driven de INTERACTION/UI.
- El primer interior funcional es el `ALMACÉN`, reutilizando el edificio existente sin crear una entidad territorial paralela.
- La entrada se activa al acercarse a la puerta del almacén y pulsar `E` o el botón móvil de interacción.
- El interior se presenta como una escena pixel-art estilizada responsive, con mostrador, estanterías, cajas y mesa.
- `E`/SALIR permite regresar al exterior.
- No se crea game loop adicional ni una segunda autoridad de movimiento.
- La definición de interiores queda preparada para incorporar posteriormente viviendas, escuela, radio, talleres e instituciones mediante datos.
- Se agregan estilos responsive para que el interior sea utilizable en celular, tablet, notebook y PC.

## V70 — Primera expansión territorial
- Se incorpora `territory_expansion_v70.js` como módulo de expansión del territorio existente.
- Se agregan 9 estructuras nuevas entre viviendas, talleres y galpones en sectores periféricos y rurales.
- Las nuevas estructuras se insertan en el mismo arreglo `V.worldGeometry.buildings` utilizado por `game.js`, por lo que participan del mismo sistema de colisión sin crear una autoridad paralela.
- Se incorporan 6 trazados de calles/caminos, veredas, señalización y vegetación para ampliar visualmente la continuidad del pueblo.
- La expansión utiliza el mundo de 3200×2000 existente; no cambia la escala del canvas ni crea otro game loop.

## V69 — Interacciones contextuales
- Se incorpora `interaction_context_v69.js` como módulo de autoridad de INTERACTION para ciudadanos compartidos.
- Las conversaciones dependen de actividad/destino, hora y clima.
- Se conserva la interacción genérica existente para objetivos no ciudadanos.

## V68 — Rutinas contextuales
- Se incorpora `life_routines_v68.js` dentro de LIFE.
- Los ciudadanos reciben actividades y destinos según horario y rol.
- La lluvia modifica rutinas exteriores.
- No se crea game loop adicional.

## V67 — Movimiento consolidado
- `game.js` queda como autoridad directa del movimiento del jugador dentro del único game loop.
- Se conserva movimiento PC/móvil, cámara, colisiones, interacción, energía y avance temporal.

## V66 — NPC Consolidation
- Se consolida la identidad de ciudadanos interactivos y entidades autónomas de `life.js`.
- LIFE conserva rutina/simulación; `game.js` conserva interacción y movimiento del jugador.

## V65 — Player Repair
- Se reparó el movimiento del jugador sin crear un segundo game loop.
- El puente temporal fue retirado al consolidar el movimiento en V67.

## V63 — Input Consolidation
- La entrada móvil queda consolidada como bridge pointer/touch → teclado sintético → `game.js`.
- Liberación segura mediante pointerup, pointercancel, lostpointercapture, blur y visibilitychange.

## V62 — Worldplay Core
- Núcleo funcional de referencia.
- Introducción narrativa, mundo por zonas, puntos de interés, actividades cotidianas, menú, guardado y soporte PC/celular.

## Arquitectura de autoridad actual
1. `core/runtime.js` — ciclo de vida y salud.
2. `village_data.js` — datos base del mundo y contenido.
3. `life.js` + `life_routines_v68.js` — simulación temporal, rutinas y vida autónoma.
4. `game.js` — render, cámara, movimiento, interacción genérica y único loop.
5. `territory_expansion_v70.js` — expansión WORLD/COLLISION sobre geometría existente.
6. `v66_npc_consolidation.js` — enlace de ciudadanos compartidos.
7. `interaction_context_v69.js` — contexto de conversación.
8. `interior_system_v71.js` — primer interior reutilizable data-driven.
9. `v57_integrity.js` — validaciones de integridad.
10. `v55_runtime_integrator.js` — coordinación.
11. `ui_system.js` — interfaz, persistencia, idioma y audio.
12. `controls.js` — bridge de entrada táctil.
13. `v50_version_badge.js` — versión visible.

## Estado de verificación
- Repositorio inspeccionado en `main` antes de V71.
- Integración estática revisada: nuevo módulo cargado después de `interaction_context_v69.js` y antes de las capas de integridad/UI.
- No se dispone en esta sesión de un navegador conectado para realizar prueba física de V71 en Android/PC; por lo tanto, V71 queda **IMPLEMENTADO, pendiente de VERIFICADO en dispositivo**.

## Próximo ladrillo
Probar V71 en navegador y, si queda estable, consolidar entrada/salida del almacén y su interacción con guardado. Después reutilizar exactamente el mismo modelo de datos para un segundo interior importante, evitando multiplicar código específico.
