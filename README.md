# VILLA PELÓN — V3

Videojuego 2D de exploración, vida cotidiana, aventura e identidad rural, inspirado en el paisaje y la cultura de San Patricio del Chañar, Neuquén.

## Motor V3

V3 utiliza un único motor central para:

- movimiento del jugador;
- cámara y escala del mundo;
- colisiones;
- reloj, días y energía;
- entrada de teclado y controles táctiles;
- render del escenario;
- guardado y carga;
- integración con narrativa y mundo vivo.

Los módulos especializados se conectan al motor mediante `window.VillaPelon` y no crean bucles de juego paralelos.

## Mundo vivo

El pueblo continúa funcionando mientras el jugador explora:

- ciudadanos con hogares, trabajos y horarios;
- tránsito por rutas y caminos;
- autos, camionetas, colectivo, tractor, camión y bicicletas;
- vacas, caballos y gallinas;
- actividad urbana y rural;
- cambios de hora, clima y ambiente;
- comercios, radio, escuela, chacras y bodegas;
- eventos y mensajes del mundo.

## Jugabilidad

El jugador puede caminar, correr, conversar, descubrir memorias, realizar changas, comprar objetos, administrar dinero y energía, avanzar misiones, explorar caminos rurales y guardar su progreso.

La narrativa y los sistemas educativos están separados de los datos históricos. Los hechos documentados incorporan fuentes verificables y la ficción permanece diferenciada.

## Arquitectura

- `game.js` — motor central.
- `life.js` — clima y capa ambiental.
- `v3_world.js` — ciudadanos, rutas, tránsito y animales.
- `story.js` — narrativa, misiones, diálogos y relaciones.
- `v3.js` — mochila, mapa y teléfono.
- `village_data.js` — datos de actividades y objetos.
- `history.js` — memorias y datos históricos documentados.
- `style.css` — interfaz y presentación.
- `index.html` — entrada del juego.

Se eliminó la antigua capa `data.js` porque no formaba parte del motor activo.

## Guardado

La partida V3 se guarda en `localStorage` con las claves `villa_pelon_v3_save` y `villa_pelon_v3_world`. El motor puede migrar una partida anterior de V2 al cargarla.

## Publicación

El proyecto está preparado para ejecutarse en navegador mediante GitHub Pages, sin instalación.

**PROYECTO: VILLA PELÓN — V3 — MOTOR CENTRAL + MUNDO VIVO**
