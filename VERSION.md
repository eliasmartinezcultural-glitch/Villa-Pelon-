# Villa Pelón — control de versiones

## Versión activa
**V70**

## V70 — Primera expansión territorial
- Se incorpora `territory_expansion_v70.js` como módulo de expansión del territorio existente.
- Se agregan 9 estructuras nuevas entre viviendas, talleres y galpones en sectores periféricos y rurales.
- Las nuevas estructuras se insertan en el mismo arreglo `V.worldGeometry.buildings` utilizado por `game.js`, por lo que participan del mismo sistema de colisión sin crear una autoridad paralela.
- Se incorporan 6 trazados de calles/caminos, veredas, señalización y vegetación para ampliar visualmente la continuidad del pueblo.
- La expansión utiliza el mundo de 3200×2000 existente; no cambia la escala del canvas ni crea otro game loop.
- `index.html` integra el módulo después de `game.js` para ampliar el arreglo territorial ya construido y adopta cache bust V70.
- Se corrigió la primera escritura del módulo antes de consolidarlo: la definición de una vivienda periférica quedó validada sintácticamente en la versión final del archivo.

## V69 — Interacciones contextuales
- Se incorpora `interaction_context_v69.js` como módulo de autoridad de INTERACTION para ciudadanos compartidos.
- Las conversaciones de Marta, Raúl, Lucía, Pedro y Nico dependen de su actividad/destino actual, además de hora y clima.
- Un mismo vecino puede ofrecer conversaciones diferentes en almacén, chacra, escuela, radio, plaza o casa.
- El contexto se alimenta del estado compartido consolidado por V66 y de las rutinas de LIFE de V68.
- Las interacciones contextuales son data-driven y no crean game loops ni duplican ciudadanos.
- La interacción genérica existente se conserva para pistas, trabajos, edificios y demás objetivos no ciudadanos.

## V68 — Rutinas contextuales
- Se incorpora `life_routines_v68.js` como módulo de autoridad de rutinas dentro de LIFE.
- Los ciudadanos reciben actividades y destinos según franja horaria y rol: hogar, escuela, comercio, radio, plaza, servicios y trabajo rural.
- La lluvia modifica la rutina y deriva actividades exteriores hacia un galpón/refugio.
- La actividad contextual queda expuesta como `routineActivity` y es compartida con los NPC interactivos de `game.js` mediante V66.
- No se crea ningún game loop adicional.

## V67 — Movimiento consolidado
- Se retira `player_movement_v65.js`.
- `game.js` queda como autoridad directa del movimiento del jugador dentro del único game loop.
- Se conserva movimiento PC/móvil, cámara, colisiones, interacción, energía y avance temporal.

## V66 — NPC Consolidation
- Se consolida la identidad de los ciudadanos interactivos con las entidades autónomas de `life.js`.
- LIFE conserva la autoridad de rutina y simulación autónoma; `game.js` conserva interacción y movimiento del jugador.

## V65 — Player Repair
- Se reparó el movimiento del jugador sin crear un segundo game loop.
- El puente temporal fue posteriormente retirado al consolidar el movimiento en V67.

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
5. `territory_expansion_v70.js` — expansión WORLD/COLLISION sobre la geometría existente.
6. `v66_npc_consolidation.js` — enlace de ciudadanos compartidos.
7. `interaction_context_v69.js` — contexto de conversación.
8. `v57_integrity.js` — validaciones de integridad.
9. `v55_runtime_integrator.js` — coordinación.
10. `ui_system.js` — interfaz, persistencia, idioma y audio.
11. `controls.js` — bridge de entrada táctil.
12. `v50_version_badge.js` — versión visible.

## Próximo ladrillo
Verificar y consolidar la expansión territorial como mundo navegable: revisar visualmente las nuevas calles/cuadras, comprobar que las estructuras nuevas bloquean correctamente al jugador y que no existen solapamientos problemáticos. Después, incorporar **edificios/interiores relevantes** empezando por un único interior reutilizable y data-driven, antes de multiplicar edificios.
