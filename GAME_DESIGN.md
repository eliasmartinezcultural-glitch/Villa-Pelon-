# VILLA PELÓN — DISEÑO MAESTRO V4

## Identidad
Videojuego histórico-educativo ambientado en San Patricio del Chañar, Neuquén. La experiencia combina exploración libre, vida cotidiana, trabajo rural, comunidad y descubrimiento de la historia local.

## Principios no negociables
- Funcionalidad y jugabilidad antes que decoración.
- PC y celular desde la misma base de código.
- Estética 16-bit/pixel art, sin apariencia fantástica.
- Un solo motor principal y un único ciclo de actualización/render.
- Las capas especializadas amplían el motor; no crean motores paralelos.
- La historia documentada debe distinguirse de los diálogos y situaciones ficticias.
- El rendimiento debe degradar de forma controlada en equipos móviles.
- Guardado y carga deben conservar progreso, inventario, dinero, energía e historia.

## Arquitectura V4
`game.js` es el propietario del estado, movimiento, cámara, interacción base y ciclo `update -> render -> requestAnimationFrame`.

Capas principales:
- `v4_engine.js`: kernel pasivo, migración y diagnóstico.
- `v4_playability.js`: autoridad de misiones, inventario, memoria, mapa y progreso.
- `v4_characters.js`: personajes y animación.
- `life.js`: vehículos, animales, ambiente, clima y actividad.
- `v4_world.js`: sincronización estructural del mundo.
- `world/streets/*`: calles, tráfico y detalles urbanos.
- `v4_platform_core.js` + `v4_mobile_pro.js`: entrada táctil, viewport, rendimiento y capacidades móviles.
- `v4_render_optimizer.js`: control adaptativo de render y pausa en segundo plano.
- `v4_render_pipeline.js`: recorte de entidades fuera de cámara.
- `v4_visual_power.js` + `v4_world_visual.js`: atmósfera, profundidad y ciclo visual de luz.
- `v4_audit.js`: diagnóstico automático de conexiones y duplicaciones.

## Código retirado del runtime
Las ramas V2/V3 y capas duplicadas de gameplay/móvil/narrativa no participan del arranque V4. Los runtimes V3 obsoletos fueron eliminados para evitar regresiones y ambigüedad.

## Objetivo territorial
El mundo debe reconocer visualmente el valle y el pueblo mediante caminos, riego, chacras, frutales, viñedos, arquitectura sencilla, espacios comunitarios y actividad rural. La identidad local es parte de la jugabilidad, no solo del fondo gráfico.

## Campaña inicial
1. Conocé a alguien.
2. El primer mandado.
3. Lleváselo a Raúl.
4. La vida de la plaza.
5. Una changa rural.
6. Una memoria del lugar.
7. La voz del pueblo.
8. Ahora elegís vos.

## Calidad técnica
Cada BUILD debe verificarse en cuatro dimensiones: arranque, jugabilidad, plataforma y rendimiento. No se considera terminada una mejora visual si no está cargada desde `index.html` y desplegada correctamente.
