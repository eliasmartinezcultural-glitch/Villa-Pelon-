# Villa Pelón — control de versiones

## Versión activa
**V65**

## V65 — Living Rural World
- Se activa la primera capa de expansión territorial sobre la arquitectura V64 sin crear un segundo motor ni un segundo game loop.
- Se incorporan caminos de tierra, canales/acequias, cultivos, huertas, hileras de frutales, viñedos, cercos y arboledas.
- Se amplía la vida rural con maquinaria, tractores, carros, tránsito, trabajadores, animales y aves.
- Se refuerza el clima dinámico: despejado, nublado, viento, lluvia, temperatura, refugio de habitantes y cambios de actividad.
- Se incorpora `mission_runtime.js` como autoridad de estado para misiones, pasos y evidencias.
- Se incorpora `v65_world_bridge.js` para preparar persistencia versionada y sincronización de evidencias.
- Se incorpora `v65_ambient_dialogue.js` con conversaciones ambientales breves ligadas al clima y la vida cotidiana.
- Se incorpora `world_expansion.js` para ampliar el lenguaje pixel-art sin introducir otra autoridad de render.
- El canvas conserva `imageSmoothingEnabled=false`: la representación sigue orientada a pixel art de bloques nítidos.
- Se mantiene la regla de ficción: el jugador vive exclusivamente en Villa Pelón y la investigación histórica real queda fuera de la identidad visible del mundo.

## V64 — Historical Worldplay
- Se incorpora un arco narrativo de seis capítulos basado en agua, chacras, comunidad, frutales, vino y memoria viva.
- Las misiones pasan a estar definidas como datos con objetivos, pasos, evidencias y recompensas.
- Se incorpora `history_context.js` como contexto histórico narrativo y pipeline de investigación.
- Se incorpora `missions_data.js` como base de misiones y evidencias.
- La historia se descubre mediante personas, lugares, objetos, documentos y testimonios.
- Se mantiene la separación entre ficción de ambientación y hechos históricos documentados.

## V63 — Territorial Identity
- Villa Pelón pasa a tener una identidad territorial coherente de valle rural irrigado norpatagónico.
- Se incorpora `regional_identity.js` como autoridad de identidad territorial y reglas de ficción.
- El nombre de la localidad real que inspira el territorio queda fuera de la experiencia del juego.

## V62 — Worldplay Core
- Nueva introducción narrativa: el objetivo es descubrir la historia mediante misiones y exploración.
- Mundo ampliado conceptualmente por zonas: centro, barrio, rural, ribera y servicios/comunidad.
- Nuevos puntos de interés y actividades cotidianas definidos como datos.
- Menú de partida, guardado por ranuras, carga, reinicio, idioma, música, pantalla completa y ayuda.
- Soporte PC y celular sobre una única autoridad de movimiento.

## Arquitectura de autoridad
1. `core/runtime.js` — ciclo de vida y salud.
2. `village_data.js` — datos del mundo y contenido.
3. `regional_identity.js` — identidad territorial, ficción y reglas de representación.
4. `history_context.js` — contexto histórico narrativo y pipeline de investigación.
5. `missions_data.js` — misiones, capítulos y evidencias.
6. `life.js` — simulación temporal y vida autónoma.
7. `game.js` — render, cámara, movimiento, interacción y único loop.
8. `mission_runtime.js` — autoridad de progreso de misiones y evidencias.
9. `world_expansion.js` — expansión visual/territorial sobre el render existente.
10. `v65_ambient_dialogue.js` — capa de conversaciones ambientales.
11. `v65_world_bridge.js` — migración y puente de persistencia.
12. `v57_integrity.js` — validaciones y correcciones de integridad.
13. `v55_runtime_integrator.js` — coordinación.
14. `ui_system.js` — interfaz, menú, persistencia de usuario, idioma y audio.
15. `controls.js` — entrada táctil complementaria.
16. `v50_version_badge.js` — versión visible.

## Regla territorial permanente
Villa Pelón debe sentirse como un pueblo real del valle norpatagónico, pero nunca debe revelar el nombre real que inspira su diseño. La referencia real sirve para investigación y coherencia; la experiencia del jugador pertenece exclusivamente a Villa Pelón.

## Próximo salto — V66
- Consolidar NPC únicos: una sola entidad por habitante para rutina + interacción + relaciones.
- Hacer que el primer capítulo de agua sea jugable paso a paso con `mission_runtime`.
- Incorporar objetos/evidencias visibles con IDs estables y Archivo de Memoria.
- Interiores y transiciones reales.
- Interacción contextual con animales, maquinaria y elementos rurales.
- Mejorar colisiones por terreno y zonas productivas.
- Audio ambiental por zona, hora y clima.
- Auditoría de controles para eliminar la duplicación táctil entre `game.js` y `controls.js`.
