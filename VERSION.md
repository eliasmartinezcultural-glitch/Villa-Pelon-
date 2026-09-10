# Villa Pelón — control de versiones

## Versión activa
**97.1 — Campaña histórica + geometría consolidada**

## Objetivo

Villa Pelón es un RPG 2D pixel art educativo: el jugador aprende sobre territorio, memoria, comunidad, producción, cartografía e investigación a través de misiones encadenadas.

## Campaña activa

El primer ciclo ahora supera las 20 misiones y avanza desde la identidad del lugar hasta una metodología básica de investigación histórica:

1. Conocé Villa Pelón.
2. Una pista del pueblo.
3. ¿Por qué se llama así?
4. Las voces del pueblo.
5. La primera escuela.
6. El agua hace al valle.
7. Del fruto a la identidad.
8. La memoria del pelón.
9. Una historia se escucha.
10. El laboratorio de las fuentes.
11. El DNI perdido.
12. Lo que queda en el camino.
13. Un pueblo no aparece de la nada.
14. Dos bocatomas, una transformación.
15. La escuela como archivo.
16. El trabajo también cuenta.
17. Leer el territorio.
18. El río y los puentes.
19. Tres fuentes, una pregunta.
20. No alcanza con creer.
21. Villa Pelón abierta.

La misión central **El DNI perdido** conserva el viaje a Picada 21 y la escena narrativa emotiva. La escena está marcada como ficción para no presentar personajes inventados como hechos históricos reales.

## Capa histórica

Se incorporaron personajes ficticios con roles educativos —archivo, riego, docencia, memoria y trabajo rural— y acciones de inspección que enseñan hechos con referencia de fuente. Entre los temas aparecen el topónimo, las obras de riego de 1971–1972, la creación de la localidad en 1973, la Escuela 273, la Fiesta Provincial del Pelón de 1985, el trabajo rural y la lectura crítica de fuentes.

## Arquitectura activa

- `core/world_manifest.js` — geometría territorial base.
- `core/world_expansion_v88.js` — expansión rural y ruta lógica de Picada 21.
- `core/world_vergel_v90.js` — VERGEL, cosecha, inventario y estaciones.
- `core/mission_system.js` — catálogo y progresión educativa.
- `core/v90_engine.js` — motor principal, movimiento, interacción, HUD y loop único.
- `core/integration_v90.js` — integración territorial y prioridad VERGEL.
- `core/people_vehicles_v91.js` — población ambiental y vehículos.
- `core/building_detail_v92.js` — identidad de edificios.
- `core/render_compositor_v93.js` — único propietario de las fachadas secundarias.
- `core/healthcheck_v91.js` — comprobación funcional.
- `core/mission_runtime.js` — eventos especiales de campaña, sin motor ni ticker paralelo.
- `core/presentation_runtime.js` — panel de misión reactivo.
- `core/interface_v88.js` — menú, mapa y mochila.
- `core/soft_intro.js` — introducción narrativa.
- `core/integrity_v94.js` — autoridad final de integridad y detector de colisiones entre edificios.
- `core/stability_v95.js` — normalización y recuperación segura.

## Correcciones de esta etapa

- Se eliminó la segunda representación de edificios del motor principal: las fachadas ahora tienen un único propietario visual.
- Se agregó un gate de integridad que falla si dos edificios ocupan el mismo espacio con margen de seguridad.
- Se expandió la campaña a 20+ misiones históricas.
- Se incorporaron nuevos personajes, diálogos, fichas de fuente y acciones de inspección.
- Se incorporó la secuencia educativa AFIRMACIÓN → FUENTE → CONTRASTE → CONCLUSIÓN.
- La progresión de misiones forma parte del guardado principal y se verifica después de recargar.
- Se actualizó el cache-busting a `97.1`.
- El smoke test verifica geometría, ausencia de renderer duplicado, VERGEL, campaña histórica, DNI/Picada 21 y persistencia.

## Regla de mantenimiento

Toda nueva funcionalidad debe conectarse a una autoridad existente antes de crear otra. No se agregan motores paralelos, renderers adicionales, registros duplicados ni sistemas alternativos de guardado.
