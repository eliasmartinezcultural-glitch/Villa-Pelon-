# VILLA PELÓN — DISEÑO V3

## 1. Visión

Villa Pelón es un videojuego 2D de exploración, vida cotidiana, aventura e identidad rural. El jugador vive un día a día común dentro de un pueblo ficticio inspirado en el paisaje, cultura y memoria de San Patricio del Chañar.

El objetivo es vivir el pueblo: caminar, trabajar, comprar, conversar, descubrir lugares, conocer historias y decidir qué hacer con el día.

## 2. Motor

V3 utiliza un único motor central. `game.js` controla el ciclo principal, entrada, movimiento, cámara, colisiones, tiempo, render y persistencia.

Los módulos especializados se integran mediante `VillaPelon` y no crean bucles de juego paralelos.

## 3. Mundo vivo

`v3_world.js` administra ciudadanos, rutas, vehículos, animales, horarios y eventos ambientales.

Los ciudadanos tienen identidad, hogar, trabajo, horario, destino, velocidad, actividad y posición dinámica. El tránsito utiliza rutas con puntos de recorrido. Los animales se desplazan dentro de zonas rurales delimitadas.

## 4. Jugador

El jugador puede caminar, correr según energía disponible, interactuar, descansar, comprar, trabajar, conversar, descubrir historia, administrar dinero e inventario, utilizar mochila/mapa/teléfono y guardar la partida.

## 5. Bucle de juego

EXPLORAR → CONOCER → HABLAR → TRABAJAR → COMPRAR → DESCUBRIR → DECIDIR → VOLVER A EXPLORAR

## 6. Espacios

El mundo combina viviendas, escuela, plaza, almacén, radio, galpón rural, bodega, caminos, canales, chacras, viñedos, zonas naturales y espacios deportivos.

## 7. Narrativa

`story.js` administra la campaña principal, misiones secundarias, diálogos, relaciones y recompensas. La campaña conduce progresivamente desde la llegada al pueblo hacia el mundo abierto.

## 8. Historia y educación

`history.js` contiene memorias documentadas. La ficción jugable se mantiene separada de los hechos históricos y cada dato histórico debe conservar su fuente.

## 9. Persistencia

V3 guarda el estado del jugador y el estado dinámico del mundo en almacenamiento local. Las partidas anteriores pueden migrarse progresivamente.

## 10. Plataforma

El juego está diseñado para navegador y GitHub Pages, con soporte de PC y controles táctiles.

## 11. Identificación

**VILLA PELÓN — V3 — MOTOR CENTRAL + MUNDO VIVO**
