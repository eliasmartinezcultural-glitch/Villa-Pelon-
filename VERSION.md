# Villa Pelón — control de versiones

## Versión activa
**100.3 — Auditoría de superposiciones y consolidación del núcleo jugable**

## Objetivo
Dejar de sumar capas por acumulación. Cada sistema debe tener una autoridad clara, una entrada y una salida. Si dos capas hacen lo mismo, se conserva una y se elimina la otra.

## V100.3
- El contrato de arquitectura valida la autoridad real del compositor y de la vida del pueblo sin depender de la presencia del DOM.
- `engine.health()` queda normalizado como una función estable para las comprobaciones de salud.
- La vida autónoma sigue sin segundo RAF y sin segundo guardado.
- Los NPC principales siguen bajo autoridad del motor; `village_life_v99.js` no los vuelve a dibujar ni toma su movimiento.
- Tránsito y fauna siguen siendo datos/simulación ambiental, no una segunda población de NPC.
- Las misiones mantienen una única autoridad (`mission_system.js`) y `mission_runtime.js` sólo resuelve objetivos especiales.
- La fachada de edificios sigue perteneciendo al compositor; `building_detail_v92.js` sólo declara identidad y propietario, no dibuja.
- Se conserva el mundo 8200×4200, río + puentes, camino a Picada 21, VERGEL, campaña histórica, intro interactiva y estética RPG 2D pixel art.

## Autoridades
- `core/v90_engine.js` — movimiento, interacción, colisión, tiempo, guardado y NPC principales.
- `core/world_manifest.js` — geometría y leyes territoriales.
- `core/mission_system.js` — catálogo, pasos, recompensas y progresión.
- `core/mission_runtime.js` — eventos/objetivos especiales de campaña.
- `core/world_vergel_v90.js` — agricultura.
- `core/village_life_v99.js` — horarios, tránsito, fauna, encuentros y memoria ambiental.
- `core/people_vehicles_v91.js` — datos ambientales.
- `core/render_compositor_v93.js` — único compositor de detalle/fachadas/ambientales.
- `core/soft_intro.js` — única intro interactiva.
- `core/architecture_contract_v99.js` — auditoría de autoridades.

## Regla visual
Pixel art no significa sólo bloques cuadrados: cada personaje debe tener silueta, cabeza, pelo, ojos, boca, ropa, piernas, pies, sombra, dirección y animación legible. Cada edificio debe tener identidad propia y elementos reconocibles. El detalle debe reforzar el lugar, no tapar el mundo base.

## Superposiciones prohibidas
- dos motores principales
- dos autoridades de NPC
- dos sistemas de misión
- dos guardados
- dos simuladores de vida
- dos fachadas de edificios
- overlays históricos que tapen la escena base
- geometrías nuevas que contradigan el manifest

## Eliminado / evitado
- Segundo motor.
- Segundo renderer de fachadas.
- RAF paralelo para vida.
- Guardado paralelo de vida.
- Antiguo `life.js`.
- Renderer V47.
- Geometría reducida 3200×2000.

## Dirección de gameplay
**mundo → leyes → personas → horarios → lugares → acciones → encuentros → pistas → misiones → consecuencias → historia**

La siguiente etapa no es inflar el número de versión: es trabajar zona por zona y personaje por personaje hasta que cada elemento tenga función, apariencia, relación con el territorio y motivo para existir.

## Backup
`backup/v62-selective-integration-20260911` conserva la integración selectiva anterior.
