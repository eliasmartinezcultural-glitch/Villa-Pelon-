# VILLA PELÓN — DISEÑO MAESTRO

## Identidad definitiva
Villa Pelón es un videojuego RPG 2D top-down de vida, exploración, comunidad y descubrimiento histórico.

El jugador vive en Villa Pelón: camina por sus calles y zonas rurales, conoce habitantes, realiza actividades, cumple misiones y descubre progresivamente la historia del lugar.

La referencia territorial real utilizada para ambientación, investigación y diseño es San Patricio del Chañar y su entorno regional. Esa referencia no sustituye el nombre ni la identidad del universo jugable: dentro del juego, el pueblo es Villa Pelón.

## Principios no negociables
- Funcionalidad y jugabilidad antes que decoración.
- PC y celular desde la misma base de código.
- Estética 16-bit/pixel art cálida, rural y coherente.
- Un solo motor principal y un único ciclo de actualización/render.
- Las capas especializadas amplían el motor; no crean motores paralelos.
- La historia documentada debe distinguirse de los diálogos y situaciones ficticias.
- Las misiones son el principal vehículo para aprender la historia mientras se juega.
- El mundo debe sentirse como un pueblo real: calles conectadas, edificios con accesos, zonas rurales coherentes y espacios con función.
- El rendimiento debe degradar de forma controlada en equipos móviles.
- Guardado y carga deben conservar progreso, inventario, dinero, energía e historia.

## Bucle de juego
**VIVIR → EXPLORAR → CONOCER → RECIBIR MISIÓN → REALIZAR ACTIVIDAD → DESCUBRIR HISTORIA → PROGRESAR → SEGUIR VIVIENDO**

## Arquitectura
`v6_game_core.js` es el propietario del estado, movimiento, cámara, interacción base y ciclo principal.

Capas especializadas:
- `v4_engine.js`: compatibilidad, migración y diagnóstico.
- `v4_playability.js`: campaña, misiones e inventario.
- `v4_characters.js`: personajes.
- `life.js`: vehículos, animales, ambiente y clima.
- `world/streets/*`: calles, tráfico y detalles urbanos.
- `v4_platform_core.js` + `v4_mobile_pro.js`: adaptación PC/celular.
- `v4_render_optimizer.js`: optimización.
- `v4_ui_audio.js`: menú, configuración y música ambiental procedural.
- `v6_intro_polish.js`: introducción narrativa y flujo de guardado.
- `v6_5_world_rules.js`: reglas territoriales.
- `v6_buildings.js` + `v6_building_system.js`: edificios e interacción.
- `v6_rpg_progression.js`: progresión RPG.
- `v6_core_integrity.js` + `v6_repo_surgical_audit.js`: integridad y reparación.

## Mundo
El territorio debe reconocer visualmente una localidad del Alto Valle mediante calles, riego, chacras, frutales, viñedos, arquitectura sencilla, espacios comunitarios, comercio y actividad rural.

Reglas territoriales:
- las rutas y calles permanecen libres de viviendas arbitrarias;
- las viviendas se relacionan con calles y accesos;
- los comercios ocupan ubicaciones lógicas;
- los animales permanecen en áreas rurales apropiadas;
- la maquinaria agrícola pertenece al entorno rural;
- el río no contiene población, edificios ni maquinaria salvo infraestructura de cruce definida;
- los puentes conectan sectores coherentemente.

## Historia
La historia real debe aparecer mediante misiones, conversaciones, lugares, objetos, memorias y fuentes verificables. La ficción del juego debe estar claramente diferenciada de los hechos documentados.

## Audio
La música debe ser relajante, rural, cálida y ambiental. Debe acompañar la exploración sin convertir cada momento en una escena épica.

## Calidad técnica
Cada versión debe verificarse en cuatro dimensiones: arranque, jugabilidad, plataforma y rendimiento. No se considera terminada una mejora si no está conectada al flujo real del juego.
