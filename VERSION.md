# Villa Pelón — control de versiones

## Versión activa
**95.7 — Matriz consolidada**

## Objetivo de esta versión

Consolidar el runtime web alrededor de una única matriz territorial, una única autoridad de interacción VERGEL, una única capa secundaria de composición visual y un único contrato de guardado.

## Capas activas

1. `core/runtime.js` — ciclo de vida y servicios.
2. `village_data.js` — datos base.
3. `core/world_manifest.js` — geometría territorial base.
4. `core/world_expansion_v88.js` — expansión rural y ruta lógica de Picada 21.
5. `core/world_vergel_v90.js` — VERGEL, cosecha, inventario y estaciones.
6. `core/mission_system.js` — catálogo/progresión.
7. `core/v90_engine.js` — motor principal, movimiento, interacción, HUD y loop.
8. `core/integration_v90.js` — integración territorial y prioridad VERGEL.
9. `core/people_vehicles_v91.js` — población ambiental y vehículos.
10. `core/building_detail_v92.js` — contrato de identidad de edificios.
11. `core/render_compositor_v93.js` — composición visual secundaria única.
12. `core/healthcheck_v91.js` — comprobación funcional.
13. `core/mission_runtime.js` — runtime de misiones.
14. `core/presentation_runtime.js` — actualización reactiva del panel de misión.
15. `core/interface_v88.js` — menú, mapa y mochila; sin renderer duplicado.
16. `core/soft_intro.js` — introducción narrativa.
17. `core/integrity_v94.js` — autoridad final de integridad compartida.
18. `core/stability_v95.js` — normalización y recuperación segura.

## Correcciones estructurales 95.x

- Se eliminó el renderer `detailLayer` duplicado que generaba una segunda capa de personajes/piernas y un RAF adicional.
- La ruta `picada21_route` dejó de tener definiciones incompatibles y comparte una matriz territorial única.
- La parada, área y señal de Picada 21 quedaron normalizadas en las mismas coordenadas.
- El registro rural duplicado de vehículos fue eliminado; la autoridad de vehículos queda en `people_vehicles_v91.js`.
- El guardado dejó de tener implementaciones paralelas: los servicios llaman al handler del motor.
- Se eliminó el `beforeunload` duplicado del runtime.
- El panel de misión dejó de utilizar un `setInterval` propio; responde a eventos del motor.
- VERGEL pasó a un ciclo anual simple de 120 días, con 30 días por estación.
- El healthcheck detecta la existencia de capas de detalle antiguas y deriva territorial.
- El Integrity Gate verifica la ruta y puntos canónicos de Picada 21.
- Se retiraron módulos históricos que ya no participan del runtime activo.
- El cache-busting de producción quedó unificado en `95.7`.

## Verificación automática

El workflow de smoke test ejecuta navegador Chromium, comprueba integridad, salud, movimiento, guardado/recarga, VERGEL, ausencia del renderer legado y funcionamiento móvil.

## Regla de mantenimiento

Toda nueva funcionalidad debe conectarse a una autoridad existente antes de crear una nueva capa. No se agregan motores paralelos, registros duplicados, renderers adicionales ni sistemas alternativos de guardado sin una justificación arquitectónica explícita.
