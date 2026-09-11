# Villa Pelón — control de versiones

## Versión activa
**100.0 — Integración selectiva V62 + mundo vivo**

## Decisión de diseño
Se revisó la rama estable `stable/v62-worldplay-core` y se recuperó únicamente lo que fortalece la orientación actual. No se restauró el V62 completo ni sus sistemas antiguos cuando duplicaban, simplificaban o desviaban la arquitectura actual.

## Recuperado de V62
- Rutinas autónomas por horario para los personajes existentes.
- Destinos: casa, plaza, escuela, radio, trabajo rural y servicios.
- Movimiento autónomo con respeto básico por edificios y límites del mundo.
- Tránsito urbano/rural y vehículos con movimiento continuo.
- Fauna rural: vacas, caballos y gallinas.
- Lenguaje visual pixel-art más detallado para personajes: cuerpo, piernas, pies, pelo, ojos, boca, sombras y animación de caminata.
- Variedad de colores y apariencia sin sustituir los datos actuales del pueblo.

## No recuperado
No se reincorporaron como autoridades independientes el antiguo motor V62, `life.js`, el renderer V47 ni la geometría reducida de 3200×2000. El mundo actual mantiene 8200×4200, sus reglas territoriales, Picada 21, VERGEL, misiones, fuentes históricas, guardado e integración actual.

## Arquitectura
- `core/v90_engine.js` — motor único.
- `core/world_manifest.js` — geometría territorial actual.
- `core/mission_system.js` — misiones y progresión.
- `core/world_vergel_v90.js` — agricultura.
- `core/village_life_v99.js` — ahora V100: simulación autónoma de vida.
- `core/people_vehicles_v91.js` — ahora V100: población, tránsito y fauna.
- `core/render_compositor_v93.js` — ahora V100: único compositor visual.
- `core/architecture_contract_v99.js` — contrato de renderer único.

## Regla estructural
Toda mejora recuperada debe reforzar el juego actual y conectarse a una autoridad existente. No se agregan motores paralelos, RAF secundarios, renderers duplicados ni sistemas alternativos de guardado.

## Backup
`backup/v62-selective-integration-20260911` conserva esta integración selectiva antes de continuar con nuevas evoluciones del mundo vivo.
