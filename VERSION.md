# Villa Pelón — control de versiones

## Versión activa
**100.2 — Limpieza de autoridades y mundo vivo funcional**

## Objetivo de esta versión
Prioridad: que Villa Pelón sea jugable rápidamente sin seguir acumulando capas que se pisan entre sí.

## Cambios V100.2
- `village_life_v99.js` deja de mover NPC principales: el motor único conserva esa autoridad.
- La vida autónoma conserva tránsito, fauna, horarios, eventos contextuales y encuentros observables.
- Los encuentros entre NPC se registran como memoria del mundo y pueden producir conversaciones cuando el jugador está cerca.
- La vida ya no mantiene un `localStorage` separado: su estado viaja dentro de `gameState` y se guarda con la partida.
- Se conserva un solo ticker de simulación de vida y ningún RAF adicional.
- El contrato arquitectónico ahora comprueba renderer único, vida única y autoridad única de guardado.
- Se mantiene el mundo 8200×4200, Picada 21, VERGEL, campaña histórica, intro interactiva y estética RPG 2D pixel art.

## Arquitectura vigente
- `core/v90_engine.js` — motor único de exploración, movimiento, interacción, tiempo, colisiones y guardado.
- `core/world_manifest.js` — geometría territorial.
- `core/mission_system.js` — catálogo y progresión de misiones.
- `core/mission_runtime.js` — objetivos especiales y campaña histórica.
- `core/world_vergel_v90.js` — agricultura.
- `core/village_life_v99.js` — vida autónoma contextual, tránsito, fauna y encuentros.
- `core/people_vehicles_v91.js` — datos de población, tránsito y fauna.
- `core/render_compositor_v93.js` — único compositor visual.
- `core/soft_intro.js` — intro interactiva de cuatro escenas.
- `core/architecture_contract_v99.js` — contrato estructural.

## ADN recuperado de V62
Se conservan únicamente rutinas, destinos, movimiento autónomo del motor, tránsito, fauna y riqueza visual que mejoran el mundo actual. No se restaura V62 como arquitectura paralela.

## Eliminado / evitado
- Segundo motor.
- Segundo renderer.
- RAF paralelo para vida.
- Guardado paralelo de vida.
- Antiguo `life.js`.
- Renderer V47.
- Geometría reducida 3200×2000.

## Dirección de gameplay
**mundo → leyes → personas → horarios → lugares → acciones → encuentros → pistas → misiones → consecuencias → historia**

La siguiente prioridad es convertir cada zona en un lugar con algo que hacer, ver o descubrir, sin romper el motor central.

## Backup
`backup/v62-selective-integration-20260911` conserva la integración selectiva anterior.
