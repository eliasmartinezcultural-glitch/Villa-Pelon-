# Villa Pelón — control de versiones

## Versión activa
**V60**

## Regla de versionado
Cada cambio estructural o funcional que altere el comportamiento del juego debe incrementar la versión principal de build. Los archivos pueden conservar nombres históricos por compatibilidad, pero la versión activa se controla desde `v50_version_badge.js` y este registro.

## V60 — Base estándar consolidada
- Intro narrativa con contexto, propuesta y objetivo del juego.
- Inicio explícito mediante `COMENZAR`.
- Controles PC y móvil bajo una única autoridad de entrada.
- Control táctil con pointer capture y liberación segura.
- Core de runtime separado del motor visual.
- Un único game loop (`game.js`).
- Simulación de vida separada (`life.js`).
- Datos del pueblo separados (`village_data.js`).
- Integrador estructural separado (`v55_runtime_integrator.js`).
- Capa de integridad separada (`v57_integrity.js`).
- Persistencia local mediante guardado del estado de partida.
- Versionado/cache-busting coherente en recursos principales.
- Indicador técnico visible `V60 · standard-core`.

## Arquitectura de autoridad
1. `core/runtime.js` — ciclo de vida, eventos, estado y salud.
2. `village_data.js` — datos/contenido del mundo.
3. `life.js` — simulación temporal y vida del pueblo.
4. `game.js` — render, cámara, movimiento, interacción y loop único.
5. `v57_integrity.js` — validaciones de integridad.
6. `v55_runtime_integrator.js` — coordinación entre capas.
7. `controls.js` — entrada táctil complementaria sin segundo motor.
8. `v50_version_badge.js` — versión/build visible y registro técnico.

## Próximo criterio de avance
No sumar sistemas duplicados. Antes de incorporar contenido masivo, consolidar entidades/NPC, rutinas, interacción, misiones y persistencia sobre estas autoridades únicas.
