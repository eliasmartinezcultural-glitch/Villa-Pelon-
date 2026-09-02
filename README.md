# VILLA PELÓN — V6.7 · HISTORIA VIVA

Videojuego 2D top-down 16-bit de exploración, vida cotidiana, aventura e identidad rural, inspirado en San Patricio del Chañar, Neuquén.

## Motor V6.7

V6.7 usa un único motor central (`game.js`) para movimiento, cámara, colisiones, reloj, energía, entrada de teclado/táctil, render, guardado y carga.

El mundo es nativo de **8400×5600** y está dividido funcionalmente en ciudad, barrios, zona rural y río. Las capas V4/V5/V6 actúan como sistemas especializados sobre `window.VillaPelon`, sin crear un segundo ciclo de juego.

## Reglas territoriales

- Día desde las 07:00.
- Noche desde las 21:00.
- De noche la población vuelve a sus hogares y no permanece en espacios públicos.
- Las rutas y calles permanecen libres de viviendas.
- Los animales se mantienen en la zona rural.
- Tractores y maquinaria pertenecen al sector rural.
- El río no puede contener población, animales, maquinaria ni edificios.
- Los cruces del río se realizan únicamente por los dos puentes definidos.
- El clima cambia durante la partida.

## Mundo vivo

El pueblo continúa funcionando mientras el jugador explora:

- ciudadanos con hogares, trabajos y horarios;
- tránsito y semáforos;
- autos, camionetas, colectivo, tractor, camión y bicicletas;
- vacas, caballos y gallinas;
- actividad urbana y rural;
- cambios de hora, clima y ambiente;
- comercios, radio, escuela, chacras y bodegas;
- eventos, necesidades y relaciones;
- memoria histórica y puntos de descubrimiento.

## Jugabilidad

El jugador puede caminar, correr, conversar, descubrir memorias, realizar changas, comprar objetos, administrar dinero y energía, avanzar misiones, recorrer el pueblo y la zona rural y guardar su progreso.

La campaña inicial incluye llegada, mandados, entrega, plaza, changa rural, memoria, radio y exploración libre. Los sistemas históricos y educativos permanecen separados de la ficción para poder incorporar fuentes verificables.

## Arquitectura activa

- `game.js` — motor V6.7 central.
- `life.js` — clima, tránsito, animales y ambiente.
- `history.js` — memoria e información histórica.
- `story.js` — narrativa.
- `v4_playability.js` — campaña y misiones.
- `v5_character_world.js` — escala y personajes.
- `v5_world_scale.js` — contrato físico del mundo.
- `v5_world_life_deep.js` — rutinas y vida social.
- `v6_buildings.js` — arquitectura funcional.
- `v6_motion_world.js` — aceleración y animación de movimiento.
- `v6_dialogue_stable.js` — diálogo estable.
- `v6_5_world_rules.js` — reglas territoriales.
- `v6_core_integrity.js` — contrato de integridad.
- `v6_integration.js` — integración V6.7.
- `v6_player_avatar.js` — avatar principal 16-bit.
- `v6_world_reconciliation.js` — compatibilidad estructural sin duplicar el motor.

## Guardado

V6.7 conserva compatibilidad con partidas anteriores y guarda el estado principal en `localStorage`. La versión actual se identifica como `7` internamente y como **V6.7** en la interfaz.

## Publicación

El proyecto está preparado para ejecutarse directamente en navegador mediante GitHub Pages, sin instalación.

**PROYECTO: VILLA PELÓN — V6.7 — HISTORIA VIVA — MOTOR CENTRAL + MUNDO EXPANDIDO**
