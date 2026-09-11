# Villa Pelón — control de versiones

## Versión activa
**98.3 — Auditoría estructural y recuperación del gate de salud**

## Objetivo
Villa Pelón es un RPG 2D pixel art educativo donde el territorio se aprende mediante recorridos, personajes, objetos, fuentes, preguntas, acciones y misiones.

## Avance de esta etapa

- Se consolidó el compositor visual único en V98.
- Las fachadas, NPC, vehículos y objetos patrimoniales se dibujan en una sola capa visual secundaria y un único RAF de composición.
- Se incorporó `core/historical_world_v98.js` con objetos de patrimonio jugable: placas, archivos, acequias, herramientas, mapas, fotografías, cuadernos, hitos y señalética.
- Se incorporó `core/historical_campaign_v98.js` con acciones nuevas: fotografiar, comparar fuentes, examinar herramientas y observar el paisaje.
- La campaña avanza desde la investigación documental hacia la observación directa del territorio.
- La misión `history_01` desemboca en un bloque adicional de investigación antes de `free_explore`.
- Se mantiene la separación entre hechos respaldados por fuentes y personajes/escenas ficticias.
- Se mantiene la arquitectura de motor único, sin renderer paralelo de edificios ni sistema alternativo de guardado.
- Se corrigió el contrato entre `runtime.js` y los gates de integridad/salud: ahora el runtime expone explícitamente quién posee el renderer de edificios y el healthcheck puede verificarlo.
- Se actualizó el cache-busting global a V98.3 para evitar cargar JavaScript antiguo desde GitHub Pages.

## Campaña educativa

El ciclo pedagógico es:

**MISIÓN → RECORRIDO → PERSONA → OBJETO → LUGAR → PREGUNTA → FUENTE → CONTRASTE → APRENDIZAJE**

La campaña trabaja identidad, comunidad, escuela, riego, producción, pelón, trabajo rural, memoria oral, fundación, cartografía, fuentes, fotografía, observación del paisaje y Picada 21.

## Arquitectura activa

- `core/runtime.js` — ciclo de vida y contrato de salud.
- `village_data.js` — datos base.
- `core/world_manifest.js` — geometría territorial.
- `core/world_expansion_v88.js` — expansión rural y Picada 21.
- `core/world_vergel_v90.js` — VERGEL.
- `core/mission_system.js` — catálogo y progresión.
- `core/v90_engine.js` — motor único.
- `core/integration_v90.js` — integración territorial.
- `core/people_vehicles_v91.js` — población y vehículos.
- `core/building_detail_v92.js` — contrato de identidad de edificios.
- `core/historical_world_v98.js` — objetos patrimoniales y visuales históricos.
- `core/render_compositor_v93.js` — compositor único V98.
- `core/healthcheck_v91.js` — salud V98.3.
- `core/mission_runtime.js` — eventos especiales.
- `core/historical_campaign_v98.js` — acciones investigativas adicionales.
- `core/presentation_runtime.js` — misión/HUD.
- `core/interface_v88.js` — interfaz.
- `core/soft_intro.js` — introducción.
- `core/integrity_v94.js` — integridad.
- `core/stability_v95.js` — estabilidad.

## Regla estructural

Toda nueva función debe conectarse a una autoridad existente. No se agregan motores paralelos, RAF secundarios de la misma capa, renderers duplicados, registros duplicados ni sistemas alternativos de guardado.
