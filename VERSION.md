# Villa Pelón — control de versiones

## Versión activa
**99.0 — Vida del pueblo y eventos contextuales**

## Objetivo
Villa Pelón es un RPG 2D pixel art educativo donde el territorio se aprende mediante recorridos, personajes, objetos, fuentes, preguntas, acciones y misiones.

## Avance de esta etapa

- Se incorporó `core/village_life_v99.js` como capa de gameplay contextual sobre el motor existente.
- El pueblo ahora genera situaciones según hora, día y ubicación del jugador.
- La plaza, escuela, radio, riego, bodegas y Picada 21 tienen ventanas de actividad diferenciadas.
- Se incorporó un evento de llegada del colectivo rural a la parada de Picada 21.
- Los eventos diarios quedan registrados y persisten localmente sin crear un segundo sistema de guardado del juego.
- Las situaciones utilizan el sistema de diálogo existente y no crean un renderer ni un loop visual paralelo.
- Se actualizó el cache-busting global a V99.0.

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
- `core/village_life_v99.js` — eventos vivos contextuales y memoria diaria.

## Regla estructural

Toda nueva función debe conectarse a una autoridad existente. No se agregan motores paralelos, RAF secundarios de la misma capa, renderers duplicados, registros duplicados ni sistemas alternativos de guardado.
