# VILLA PELÓN — PLAN DE IMPLEMENTACIÓN DE EDIFICIOS V1

## Orden obligatorio
1. Crear registro canónico de edificios.
2. Asignar tipo, dimensiones, puerta, orientación y estado.
3. Construir renderer pixelado por módulos.
4. Añadir terreno inmediato y props.
5. Añadir iluminación/clima.
6. Añadir actividad y NPC asociados.
7. Añadir colisiones reales.
8. Añadir interacción.
9. Añadir interiores a edificios prioritarios.
10. Añadir guardado de cambios.
11. Optimizar por distancia/cámara.
12. Auditar duplicados y escalas.

## Registro recomendado
Cada edificio debe contener al menos:
`id, type, x, y, w, h, rotation, material, roof, condition, door, windows, occupants, business, openingHours, props, interior, collision, interactable, landmark, historical, source`

## Prioridad P0
Viviendas iniciales, almacén, escuela, radio, plaza/club, galpón y edificios ya usados por misiones.

## Prioridad P1
Panadería, ferretería, talleres, nuevas viviendas, bodegas, depósitos y servicios.

## Prioridad P2
Construcciones secundarias, obras, abandonadas, anexos, cobertizos y pequeños comercios.

## Integración
El sistema debe consumir `V.worldScale`, `V.world.regions`, datos de `village_data.js`, historia y mundo vivo. No crear otro motor ni otro RAF.

## Rendimiento
LOD arquitectónico:
- cercano: detalle máximo;
- medio: fachada simplificada;
- lejano: silueta/volumen;
- fuera de cámara: no dibujar.

Los interiores solo se renderizan cuando el jugador entra.

## Criterio de terminado
Un edificio se considera terminado únicamente cuando tiene identidad visual, escala, función, actividad, colisión y comportamiento horario compatibles con el resto del mundo.
