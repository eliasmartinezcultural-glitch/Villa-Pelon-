# Villa Pelón — control de versiones

## Versión activa
**96.1 — Campaña educativa RPG**

## Objetivo

Villa Pelón es un RPG 2D pixel art educativo: el jugador aprende sobre territorio, memoria, comunidad, producción e investigación a través de misiones encadenadas.

## Campaña activa

1. Conocé Villa Pelón.
2. Una pista del pueblo.
3. Las voces del pueblo.
4. El agua hace al valle.
5. Del fruto a la identidad.
6. Una historia se escucha.
7. El DNI perdido.
8. Lo que queda en el camino.
9. El río y los puentes.
10. No alcanza con creer.
11. Exploración libre.

La misión central nueva es **El DNI perdido**: encontrar un DNI extraviado, viajar por el camino rural hasta Picada 21, devolverlo y descubrir una escena narrativa emotiva que introduce el concepto de memoria oral y territorio.

La escena de Picada 21 está marcada explícitamente como narrativa ficticia para no presentar personajes inventados como hechos históricos reales.

## Arquitectura activa

- `core/runtime.js` — ciclo de vida y servicios.
- `village_data.js` — datos base.
- `core/world_manifest.js` — geometría territorial base.
- `core/world_expansion_v88.js` — expansión rural y ruta lógica de Picada 21.
- `core/world_vergel_v90.js` — VERGEL, cosecha, inventario y estaciones.
- `core/mission_system.js` — catálogo y progresión educativa.
- `core/v90_engine.js` — motor principal, movimiento, interacción, HUD y loop.
- `core/integration_v90.js` — integración territorial y prioridad VERGEL.
- `core/people_vehicles_v91.js` — población ambiental y vehículos.
- `core/building_detail_v92.js` — identidad de edificios.
- `core/render_compositor_v93.js` — composición visual secundaria única.
- `core/healthcheck_v91.js` — comprobación funcional.
- `core/mission_runtime.js` — eventos especiales de campaña, sin motor ni ticker paralelo.
- `core/presentation_runtime.js` — panel de misión reactivo.
- `core/interface_v88.js` — menú, mapa y mochila.
- `core/soft_intro.js` — introducción narrativa.
- `core/integrity_v94.js` — autoridad final de integridad.
- `core/stability_v95.js` — normalización y recuperación segura.

## Correcciones de esta etapa

- Se amplió la campaña desde un recorrido corto hasta una progresión educativa de 10 misiones.
- Se incorporó una misión completa de objeto perdido + viaje + entrega + consecuencia narrativa.
- Se agregó interacción especial para el DNI sin crear un segundo motor de juego.
- Se agregó una escena de memoria en Picada 21 basada en narrativa ficticia explícita.
- Se incorporó una misión de investigación que enseña a diferenciar memoria oral, relato y fuente documental.
- Se agregó una misión sobre puentes y territorio.
- El runtime especial no utiliza `setInterval`, `requestAnimationFrame` ni renderer adicional.
- El cache-busting de producción quedó actualizado a `95.9`.
- El smoke test ahora verifica VERGEL y la cadena completa DNI → Picada 21 → memoria.

## Regla de mantenimiento

Toda nueva funcionalidad debe conectarse a una autoridad existente antes de crear otra. No se agregan motores paralelos, renderers adicionales, registros duplicados ni sistemas alternativos de guardado.
