# Villa Pelón

RPG 2D web multiplataforma inspirado en la vida cotidiana y la identidad territorial de San Patricio del Chañar, Neuquén.

## Estado actual

- Mundo persistente de **8200 × 4200**.
- Exploración libre para PC y celulares.
- Movimiento, colisiones, NPC, diálogos, economía, energía, clima y ciclo temporal.
- Misiones progresivas y exploración libre.
- VERGEL con cosecha, inventario y persistencia.
- Ruta rural integrada hacia Picada 21.
- Puentes y reglas de cruce del río.
- Edificios diferenciados por tipo.
- Vehículos y población ambiental con compositor visual único.
- Mapa, mochila, menú, guardado local e intro narrativa.
- Healthcheck + Integrity Gate + Stability Gate.
- Smoke test automatizado con Playwright para escritorio y móvil.

## Arquitectura consolidada

La versión web activa usa `index.html` como único punto de entrada y estas capas principales:

1. `core/runtime.js` — ciclo de vida y servicios.
2. `core/world_manifest.js` — geometría base del territorio.
3. `core/world_expansion_v88.js` — expansión rural y ruta de Picada 21.
4. `core/world_vergel_v90.js` — agricultura/productividad persistente.
5. `core/mission_system.js` — catálogo y progresión de misiones.
6. `core/v90_engine.js` — movimiento, interacción, reglas, HUD y game loop principal.
7. `core/integration_v90.js` — puente único entre motor, territorio y VERGEL.
8. `core/people_vehicles_v91.js` — población ambiental y vehículos.
9. `core/render_compositor_v93.js` — única capa de composición visual secundaria.
10. `core/healthcheck_v91.js` — pruebas funcionales internas.
11. `core/integrity_v94.js` — autoridad final de referencias compartidas.
12. `core/stability_v95.js` — normalización y recuperación segura.
13. `core/interface_v88.js` — menú, mapa y mochila sin renderer duplicado.

Las capas antiguas que ya no participan del runtime fueron retiradas para evitar autoridades paralelas, referencias obsoletas y superposición de sistemas.

## Publicación

El proyecto está preparado para GitHub Pages y se abre desde un enlace sin instalación.

## Regla histórica

Los hechos históricos reales deben incorporar fuentes verificables. La ficción del juego debe mantenerse diferenciada de la historia documentada.
