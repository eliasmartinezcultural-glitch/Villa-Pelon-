# Villa Pelón — Auditoría V83 Mobile First

## Regla de producto
Villa Pelón debe funcionar como un juego web compartible por WhatsApp: abrir enlace, jugar inmediatamente desde Android/iPhone/PC/tablet y no depender de una instalación.

## Hallazgos corregidos

- **Mundo duplicado:** `core/world.js` es la autoridad territorial; V81 sincroniza la geometría que conserva `game.js` para evitar que colisiones y representación diverjan.
- **Interacción duplicada en móvil:** `game.js` y `controls.js` tenían rutas de entrada que podían disparar dos veces la interacción. V83 incorpora una autoridad de captura para E/Espacio y el botón táctil.
- **Progresión desconectada:** V82 definía misiones, pero algunas acciones reales del motor no llamaban al sistema de misiones. V83 conecta pistas y sitios con `v83_gameplay_bridge.js`.
- **Compartibilidad:** V83 incorpora compartir mediante Web Share API y fallback de copia del enlace.
- **Experiencia móvil:** se mantiene `viewport-fit=cover`, controles táctiles, safe areas, layout responsive y bloqueo de gestos que interfieren con el juego.
- **Sin instalación obligatoria:** el producto sigue siendo una página web. El manifest es complementario y no convierte la instalación en requisito.
- **Guardado:** el progreso es local al navegador/dispositivo. V83 declara explícitamente que no existe sincronización entre dispositivos.
- **Caché:** los assets principales usan `?v=83` para reducir el riesgo de servir JavaScript/CSS viejo después de una actualización.

## Riesgos pendientes

1. La URL pública de GitHub Pages puede tardar en reflejar el último commit; la verificación pública realizada durante esta auditoría todavía mostró una versión anterior (V65).
2. No existe todavía un backend de cuentas/códigos de jugador; por eso el progreso no viaja con el enlace ni entre teléfonos.
3. El proyecto acumula módulos versionados de muchas generaciones. Antes de sumar decenas de nuevos parches conviene consolidar en una arquitectura estable por dominios: world, player, npc, time, weather, quests, inventory, dialogue, education, save, UI y platform.
4. La misión histórica todavía usa recompensas y elementos de prototipo. El contenido histórico definitivo debe entrar después de investigación documental y con fuentes verificables.

## Criterio de aceptación móvil

- Abrir enlace desde WhatsApp.
- Intro legible sin zoom.
- Entrar al juego con un toque.
- Mover personaje con controles táctiles.
- Interactuar una sola vez por toque.
- Ver misión, diálogo y HUD sin quedar tapados por la interfaz.
- Guardar y recargar en el mismo dispositivo.
- Compartir el juego desde el propio juego.
- Funcionar en orientación vertical y horizontal.
- No exigir descarga de una app.

## Próxima fase profesional

La siguiente fase no debería ser otro parche aislado. Debe ser una consolidación del núcleo y después un sistema de vida territorial: rutinas NPC, horarios, lugares abiertos/cerrados, clima con consecuencias, economía cotidiana, objetos interactivos y misiones encadenadas. Luego se incorpora historia documentada fuente por fuente.
