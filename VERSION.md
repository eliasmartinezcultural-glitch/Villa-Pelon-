# Villa Pelón — control de versiones

## Versión activa
**100.1 — Consolidación estructural del mundo vivo**

## Decisión de diseño
Se mantiene la integración selectiva de `stable/v62-worldplay-core`: se recuperan únicamente rutinas, movimiento, tránsito, fauna y riqueza visual que fortalecen el juego actual. No se restaura V62 como arquitectura paralela.

## Consolidación V100.1
- La simulación de vida del pueblo queda en una única función `V.villageLife.tick` periódica.
- Se elimina el `requestAnimationFrame` independiente de la simulación de vida: el compositor visual conserva su único RAF.
- Personas, vehículos y fauna siguen siendo datos de las autoridades actuales y no crean un renderer propio.
- El contrato arquitectónico valida la autoridad visual existente (`render_compositor_v93`) sin depender de condiciones circunstanciales del DOM.
- Se mantiene un único motor, un único renderer visual, un único sistema de misiones y un único guardado de partida.
- El mundo continúa en 8200×4200 con sus reglas territoriales, río, puentes, caminos, Picada 21, VERGEL y campaña histórica.

## Recuperado de V62 que permanece
- Rutinas autónomas por horario.
- Destinos: casa, plaza, escuela, radio, trabajo rural y servicios.
- Movimiento autónomo.
- Tránsito urbano/rural.
- Fauna rural.
- Personajes con variedad visual, movimiento y detalles pixel-art.

## No recuperado
No se reincorporan el antiguo motor V62, `life.js`, el renderer V47 ni la geometría reducida de 3200×2000. Tampoco se crean sistemas alternativos de guardado o simulación.

## Arquitectura vigente
- `core/v90_engine.js` — motor único de exploración y reglas.
- `core/world_manifest.js` — geometría territorial.
- `core/mission_system.js` — misiones y progresión.
- `core/world_vergel_v90.js` — agricultura.
- `core/village_life_v99.js` — simulación autónoma consolidada.
- `core/people_vehicles_v91.js` — población, tránsito y fauna.
- `core/render_compositor_v93.js` — único compositor visual.
- `core/architecture_contract_v99.js` — contrato estructural.

## Próxima dirección
El siguiente salto no será sumar sistemas aislados. Será conectar la vida autónoma con acciones observables, encuentros entre personajes, conversaciones contextuales, pistas y consecuencias de misión: **mundo → leyes → personas → horarios → lugares → acciones → encuentros → pistas → misiones → consecuencias → historia**.

## Backup
`backup/v62-selective-integration-20260911` conserva la integración selectiva antes de las nuevas evoluciones.
