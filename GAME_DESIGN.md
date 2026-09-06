# VILLA PELÓN — Documento maestro V81

## 1. Producto

Villa Pelón es una experiencia educativa 2D de exploración libre, narrativa y misiones. Se distribuye como una página web: el jugador recibe un enlace por WhatsApp y juega directamente desde el navegador, sin instalar una aplicación.

**Plataformas objetivo:**
- Celular Android/iPhone: prioridad.
- PC/notebook: teclado + mouse.
- Pantallas táctiles y distintos tamaños de ventana.

El objetivo no es hacer un mapa decorativo: es construir un pequeño mundo vivo que enseñe territorio, memoria e historia mediante juego.

## 2. Identidad y alcance

Villa Pelón es un universo ficticio inspirado en el territorio y la cultura de San Patricio del Chañar. Los hechos históricos reales se incorporarán únicamente cuando estén documentados. La ficción, las reconstrucciones y los datos históricos deben quedar claramente diferenciados.

La experiencia lleva la firma de **Ocarina Producciones** de forma orgánica, sin convertir el juego en una publicidad invasiva.

## 3. Bucle principal

**EXPLORAR → HABLAR → RECIBIR PISTA → INVESTIGAR → CUMPLIR MISIÓN → DESCUBRIR → REGISTRAR → DESBLOQUEAR**

La recompensa principal es el conocimiento. Dinero, objetos, acceso a lugares y mejoras funcionan como sistemas secundarios que sostienen la exploración.

## 4. Pilares de jugabilidad

### Exploración
- Caminar libremente por centro, barrio, servicios, chacras, viñedos, ribera y meseta.
- Rutas como corredores de circulación.
- Río como barrera física con ribera recorrible.
- Lugares de interés que funcionan como nodos de futuras misiones.

### Mundo vivo
- NPC con rutinas.
- Clima y ciclo horario.
- Cambios de actividad según momento del día.
- Trabajos, compras, conversaciones y pequeñas situaciones cotidianas.
- Expansión gradual del territorio sin rehacer el motor.

### Investigación
Cada descubrimiento debe poder convertirse en una ficha del Archivo:
- título;
- fecha/período;
- lugar;
- tipo de fuente;
- explicación sencilla;
- fuente verificable;
- estado: descubierto/no descubierto.

### Misiones
Las misiones deben tener propósito, no ser simples recados. Tipos previstos:
- investigación histórica;
- memoria oral;
- fotografía/documento;
- territorio y paisaje;
- producción rural;
- servicios comunitarios;
- personajes y oficios;
- exploración;
- desafíos educativos.

## 5. Progresión del jugador

### Capítulo 0 — Llegada
Aprender movimiento, interacción, mapa y Archivo.

### Capítulo 1 — El pueblo cotidiano
Vecinos, almacén, escuela, plaza, radio, trabajos y primeras pistas.

### Capítulo 2 — Agua y territorio
Río, canales, riego, caminos y transformación del paisaje.

### Capítulo 3 — Producción
Chacras, cosecha, bodegas, trabajadores, transporte y economía local.

### Capítulo 4 — Memoria
Fotografías, documentos, testimonios y reconstrucción de historias familiares/comunitarias.

### Capítulo 5 — Historia documentada
Incorporación progresiva de períodos históricos reales con fuentes.

## 6. Economía y recursos

El dinero existe como recurso de simulación, pero no debe convertirse en el objetivo central. El jugador podrá:
- comprar alimentos/objetos cotidianos;
- realizar trabajos simples;
- desbloquear herramientas o accesos;
- recibir recompensas por misiones.

Más adelante se podrá introducir una economía territorial más profunda si mejora la jugabilidad.

## 7. Arquitectura técnica

La regla central es **una sola autoridad por sistema**:

- `core/world.js` → autoridad del territorio, geometría y colisiones.
- `game.js` → motor de movimiento, cámara, render e interacción base.
- `core/world_life_expansion.js` → vida ambiental y conversaciones extendidas.
- `core/education_journal.js` → archivo educativo.
- `ui_system.js` → menú, guardado, idioma, audio y pantalla completa.
- `core/v81_stability.js` → integración, normalización y compatibilidad multiplataforma.

No se deben crear nuevos motores paralelos para resolver un problema que ya pertenece a uno de estos sistemas.

## 8. Guardado

El guardado actual es **local al navegador/dispositivo** mediante Web Storage. Compartir el enlace permite jugar desde otros dispositivos, pero el progreso no se sincroniza automáticamente entre ellos.

La futura sincronización multiplataforma requiere backend/cuenta o un código de transferencia. No se debe prometer sincronización en la versión estática actual.

## 9. Reglas de contenido histórico

- Ningún dato histórico específico se presenta como hecho si no está documentado.
- Toda misión histórica tendrá fuente asociada.
- Los testimonios orales se etiquetarán como memoria/testimonio, no como prueba única.
- Las reconstrucciones ficticias estarán marcadas.
- Las fuentes se podrán consultar desde el Archivo.

## 10. Expansión del mundo

El mapa se diseña modularmente. Nuevas zonas previstas:
- nuevos barrios;
- caminos rurales;
- bodegas y establecimientos productivos;
- zonas de chacras;
- costa/ribera;
- puntos de memoria;
- edificios comunitarios;
- lugares históricos documentados;
- futuras extensiones fuera de Villa Pelón.

Cada expansión debe agregar al menos uno de estos valores: nueva historia, nueva mecánica, nuevo personaje, nuevo recurso o nueva forma de explorar.

## 11. Criterio profesional de expansión

No agregar contenido solo porque “se puede”. Cada sistema nuevo debe responder:

1. ¿Qué aporta a la experiencia?
2. ¿Qué aprende o descubre el jugador?
3. ¿Qué duración adicional aporta?
4. ¿Qué costo técnico tiene?
5. ¿Puede mantenerse y ampliarse después?

## 12. Estado V81

La versión V81 consolida:
- acceso web directo;
- cache-busting de assets;
- identificación de versión;
- coherencia entre el mapa canónico y el motor existente;
- validación de posición del jugador;
- interacción con puntos territoriales;
- protección básica de interacción táctil y overscroll;
- normalización del estado de partida;
- migración del guardado base;
- firma orgánica de Ocarina Producciones en la introducción.

## 13. Próxima fase — V82

Prioridad técnica y jugable:

1. Mapa interactivo real con zonas descubiertas.
2. Archivo Histórico visible desde el juego.
3. Sistema formal de misiones con estados y recompensas.
4. NPC con rutinas por horario y clima.
5. Entradas/salidas de edificios sin teletransportes confusos.
6. Inventario con objetos funcionales.
7. Audio ambiental contextual.
8. Primera misión histórica documentada.
9. Pruebas sistemáticas en móvil y PC.
10. Optimización antes de seguir agrandando el mapa.
