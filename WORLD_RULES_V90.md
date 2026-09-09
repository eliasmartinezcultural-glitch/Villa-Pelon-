# Villa Pelón — Reglas del mundo V90

## Principio central
Villa Pelón es un mundo de exploración territorial. El jugador no recibe todo servido: debe caminar, observar, hablar, volver a lugares y conectar pistas.

## Geografía
- Mundo: 8200 × 4200.
- Núcleo urbano: hasta x≈4900.
- Sector rural: desde x≈4900.
- Río: franja transversal con cruce únicamente por puentes.
- Picada 21: corredor rural de exploración progresiva.
- Bodegas, chacras, galpones y viviendas tienen funciones distintas.

## Reglas de movimiento
1. Las edificaciones son obstáculos físicos.
2. El río bloquea el paso salvo en puentes.
3. El jugador puede recorrer caminos y terreno abierto.
4. La energía modifica la velocidad.
5. Con energía agotada el desplazamiento se vuelve deliberadamente lento.

## Tiempo
- El mundo tiene reloj y días.
- Caminar consume más tiempo que quedarse quieto.
- Dormir/descansar recupera energía pero consume tiempo.
- El ciclo horario modifica las rutinas de NPC.
- Al comenzar un nuevo día la energía se restaura.

## Vida cotidiana
Los NPC tienen hogar, trabajo, rol y destino horario. No deben permanecer como decoración estática: se desplazan y cambian de lugar según la hora.

## Clima
Estados previstos: despejado, nublado, viento y lluvia.
El clima es ambiental y puede afectar la sensación del mundo; las reglas de producción y misiones pueden utilizarlo posteriormente.

## Economía
- El jugador comienza con capital limitado.
- Los comercios venden objetos simples.
- Las changas consumen energía y entregan dinero.
- El dinero y el inventario se guardan localmente.

## Memoria e historia
Las pistas históricas son objetos de investigación, no verdades automáticas. El juego no debe inventar hechos locales y presentarlos como históricos. Las futuras misiones históricas deberán incorporar fuente, contexto y nivel de certeza.

## Misiones
Las misiones se organizan por capítulos: pueblo, memoria, comunidad, territorio y producción. Una misión puede exigir conversación, recorrido, colección o inspección.

## Descubrimiento
El diseño favorece:
- puntos de interés sin exceso de carteles;
- caminos secundarios;
- objetos que recompensan la observación;
- lugares que adquieren sentido después de conocer a un personaje;
- secretos y contenido desbloqueable.

## Guardado
El progreso se conserva mediante `localStorage`. El sistema debe tolerar partidas antiguas y campos faltantes sin romper el arranque.

## Regla técnica principal
La geometría de `core/world_manifest.js` es la fuente territorial. Render, colisiones, interacción y futuras misiones deben derivar de la misma geometría para evitar mundos visualmente distintos del mundo jugable.

## Próxima expansión
- sistema de agricultura real por temporadas;
- inventario con cantidades y peso;
- interiores jugables;
- transporte con rutas y paradas;
- reputación comunitaria;
- colección de fotografías/documentos;
- secretos territoriales;
- misión histórica de Picada 21 con fuentes verificables;
- sistema de guardado versionado y migraciones.
