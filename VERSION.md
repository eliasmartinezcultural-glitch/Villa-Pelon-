# Villa Pelón — control de versiones

## Versión activa
**V64**

## V64 — Historical Worldplay
- Se incorpora un arco narrativo de seis capítulos basado en agua, chacras, comunidad, frutales, vino y memoria viva.
- Las misiones pasan a estar definidas como datos con objetivos, pasos, evidencias y recompensas.
- Se incorpora `history_context.js` como contexto histórico narrativo y pipeline de investigación.
- Se incorpora `missions_data.js` como base de misiones y evidencias.
- La historia se descubre mediante personas, lugares, objetos, documentos y testimonios.
- Se mantiene la separación entre ficción de ambientación y hechos históricos documentados.
- La introducción presenta el origen narrativo de Villa Pelón desde el agua, el trabajo y la transformación del paisaje.
- Se prepara la arquitectura para un Archivo de Memoria y evidencias coleccionables.

## V63 — Territorial Identity
- Villa Pelón pasa a tener una identidad territorial coherente de valle rural irrigado norpatagónico.
- Se incorpora `regional_identity.js` como autoridad de identidad territorial y reglas de ficción.
- El nombre de la localidad real que inspira el territorio queda fuera de la experiencia del juego.
- Se incorporan geografía, producción, clima, vegetación, caminos, canales, ribera, viñedos y chacras como pilares del mundo.
- Se incorporan topónimos ficticios propios de Villa Pelón.
- La investigación histórica externa queda separada de la ficción: las evidencias reales deberán conservar fuentes verificables sin romper la identidad de Villa Pelón.

## V62 — Worldplay Core
- Nueva introducción narrativa: el objetivo es descubrir la historia mediante misiones y exploración.
- Mundo ampliado conceptualmente por zonas: centro, barrio, rural, ribera y servicios/comunidad.
- Nuevos puntos de interés y actividades cotidianas definidos como datos.
- Contenido histórico separado de ficción de ambientación: los hechos reales requieren fuente verificable.
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
8. `v57_integrity.js` — validaciones y correcciones de integridad.
9. `v55_runtime_integrator.js` — coordinación.
10. `ui_system.js` — interfaz, menú, persistencia de usuario, idioma y audio.
11. `controls.js` — entrada táctil complementaria.
12. `v50_version_badge.js` — versión visible.

## Regla territorial permanente
Villa Pelón debe sentirse como un pueblo real del valle norpatagónico, pero nunca debe revelar el nombre real que inspira su diseño. La referencia real sirve para investigación y coherencia; la experiencia del jugador pertenece exclusivamente a Villa Pelón.

## Próximo salto — V65
- Conectar el primer capítulo al gameplay real.
- NPC únicos con rutinas y vínculos con misiones.
- Evidencias coleccionables visibles en un Archivo de Memoria.
- Inventario con IDs y estados.
- Interiores y transiciones.
- Geometría territorial más precisa.
- Persistencia versionada con migraciones.
- Audio ambiental por zona, actividad y hora.
