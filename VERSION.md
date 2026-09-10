# Villa Pelón — control de versiones

## Versión activa
**98.2 — Historia Viva: patrimonio jugable + campaña investigativa**

## Objetivo
Villa Pelón es un RPG 2D pixel art educativo donde el territorio se aprende mediante recorridos, personajes, objetos, fuentes, preguntas, acciones y misiones.

## Avance de esta etapa

- Se consolidó el compositor visual único en V98.
- Las fachadas, NPC, vehículos y objetos patrimoniales se dibujan en una sola capa visual y un único RAF.
- Se incorporó `core/historical_world_v98.js` con objetos de patrimonio jugable: placas, archivos, acequias, herramientas, mapas, fotografías, cuadernos, hitos y señalética.
- Se incorporó `core/historical_campaign_v98.js` con acciones nuevas: fotografiar, comparar fuentes, examinar herramientas y observar el paisaje.
- La campaña ahora avanza desde la investigación documental hacia la observación directa del territorio.
- La misión `history_01` desemboca en un bloque adicional de investigación antes de `free_explore`.
- Se mantiene la separación entre hechos respaldados por fuentes y personajes/escenas ficticias.
- Se mantiene la arquitectura de motor único, sin segundo loop ni renderer paralelo.
- Se mantiene el guardado principal como autoridad de persistencia.

## Campaña educativa

El ciclo pedagógico es:

**MISIÓN → RECORRIDO → PERSONA → OBJETO → LUGAR → PREGUNTA → FUENTE → CONTRASTE → APRENDIZAJE**

La campaña trabaja identidad, comunidad, escuela, riego, producción, pelón, trabajo rural, memoria oral, fundación, cartografía, fuentes, fotografía, observación del paisaje y Picada 21.

## Arquitectura activa

- `core/runtime.js` — ciclo de vida.
- `village_data.js` — datos base.
- `core/world_manifest.js` — geometría territorial.
- `core/world_expansion_v88.js` — expansión rural y Picada 21.
- `core/world_vergel_v90.js` — VERGEL.
- `core/mission_system.js` — catálogo y progresión.
- `core/v90_engine.js` — motor único.
- `core/integration_v90.js` — integración territorial.
- `core/people_vehicles_v91.js` — población y vehículos.
- `core/building_detail_v92.js` — identidad de edificios.
- `core/historical_world_v98.js` — objetos patrimoniales y visuales históricos.
- `core/render_compositor_v93.js` — compositor único V98.
- `core/healthcheck_v91.js` — salud.
- `core/mission_runtime.js` — eventos especiales.
- `core/historical_campaign_v98.js` — acciones investigativas adicionales.
- `core/presentation_runtime.js` — misión/HUD.
- `core/interface_v88.js` — interfaz.
- `core/soft_intro.js` — introducción.
- `core/integrity_v94.js` — integridad.
- `core/stability_v95.js` — estabilidad.

## Regla estructural

Toda nueva función debe conectarse a una autoridad existente. No se agregan motores paralelos, RAF secundarios, renderers duplicados, registros duplicados ni sistemas alternativos de guardado.
