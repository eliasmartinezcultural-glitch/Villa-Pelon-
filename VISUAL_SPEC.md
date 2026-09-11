# Villa Pelón — Especificación visual V106.5

## Dirección final
Villa Pelón debe sentirse como un pueblo rural patagónico vivo, reconocible y hecho a mano **píxel por píxel**. La referencia no es un catálogo de íconos ni una decoración genérica: el territorio es el protagonista.

La estética final es **pixel art de detalle fino**, con bordes duros, siluetas claras, escala coherente, sombras pequeñas y materiales legibles.

## Regla central
**Ningún detalle existe solamente para llenar espacio.**

Cada elemento visual debe cumplir al menos una función:
- orientar;
- identificar un lugar;
- mostrar una actividad;
- reforzar una época o material;
- comunicar profundidad o escala;
- mostrar que el pueblo está vivo.

## Gramática de píxel
- Grilla visual de 1 px.
- Sin suavizado.
- Bordes duros y escalones de píxel deliberados.
- Silueta antes que textura.
- Sombra antes que brillo.
- Pocos colores por objeto y variaciones pequeñas de valor.
- Nada de degradados digitales que rompan la lectura pixel-art.
- Los textos de carteles también deben conservar lectura pixelada.
- Los objetos pequeños deben seguir siendo reconocibles a distancia.

## Capas del territorio
El compositor visual mantiene una única autoridad de detalle y respeta este orden:

1. suelo y terreno;
2. caminos y polvo;
3. agua y orillas;
4. acequias y puentes;
5. edificios y patios;
6. cercos, postes y vegetación;
7. objetos de trabajo;
8. personas, animales y vehículos;
9. sombras y efectos ambientales.

## Suelo
El suelo no debe ser un bloque plano de color.

Debe incorporar, con densidad controlada:
- pequeñas variaciones de tierra;
- marcas de tránsito;
- manchas de polvo;
- hierbas aisladas;
- cambios de textura entre urbano, chacra y camino rural.

La textura disminuye en rutas largas para conservar legibilidad.

## Caminos
Los caminos deben parecer caminos usados, no rectángulos perfectos.

Deben mostrar:
- bordes irregulares de polvo;
- huellas y pequeñas marcas;
- cambios sutiles de superficie;
- cruces reconocibles;
- continuidad visual hacia las zonas rurales.

Las viviendas nunca invaden la calzada.

## Agua, acequias y puentes
El río debe leerse como un elemento territorial real:
- orilla;
- profundidad;
- pequeños reflejos;
- vegetación cercana;
- transición con tierra.

El río solamente puede cruzarse mediante puentes.
Los puentes deben integrarse al terreno mediante tablones, bordes, sombra y acceso lógico desde los caminos.

Las acequias son parte de la identidad productiva y deben poder reconocerse como infraestructura de riego.

## Arquitectura
Cada edificio importante debe tener identidad visual propia.

Como mínimo:
- silueta;
- techo;
- alero;
- material de pared;
- ventanas;
- puerta;
- marco;
- cartel o señal cuando corresponda;
- sombra de contacto;
- pequeños objetos relacionados con su función.

### Instituciones
Escuela, hospital, biblioteca, municipio, bomberos, capilla y salón comunitario no pueden parecer copias cambiando solamente el color.

### Sector productivo
Bodegas, galpones y chacras deben mostrar:
- parrales;
- barriles;
- cajones;
- herramientas;
- cercos;
- vehículos de trabajo;
- depósitos;
- espacios abiertos.

## Personajes
Todo personaje importante debe tener:
- silueta corporal;
- cabeza;
- cabello;
- ojos;
- boca cuando corresponda;
- ropa diferenciada;
- brazos;
- piernas separadas;
- pies;
- sombra;
- orientación;
- animación de caminata.

La animación debe ser pequeña pero visible: el personaje tiene que parecer una persona caminando, no un rectángulo desplazándose.

## Vehículos y animales
Los vehículos deben tener carrocería, ruedas, ventanas, luces y variantes reconocibles.

Los animales deben distinguir especie, cuerpo, patas, cabeza, sombra y movimiento.

## Vegetación
No usar un único árbol repetido como sello.

Debe existir variedad de:
- tamaño;
- silueta;
- altura;
- densidad;
- ubicación;
- estado visual.

La vegetación debe responder a la zona: pueblo, chacra, borde del agua o camino rural.

## Profundidad
La profundidad se construye mediante:
- tamaño;
- sombra;
- superposición;
- contraste;
- distancia entre objetos.

No se debe solucionar la profundidad con filtros o efectos modernos que contradigan el pixel art.

## Vida del pueblo
La estética debe acompañar la simulación:
- personas desplazándose según horarios;
- vehículos ambientales;
- animales;
- lugares activos en distintos momentos del día;
- iluminación nocturna;
- cambios estacionales;
- pequeños rastros de actividad.

El detalle visual debe hacer visible la vida que ya existe en el motor, no inventar una segunda simulación.

## Prohibiciones
- No crear un segundo renderer.
- No crear una segunda autoridad de personajes.
- No cubrir el mundo base con una decoración paralela.
- No agregar objetos sin función territorial.
- No convertir Villa Pelón en fantasía genérica.
- No sacrificar funcionalidad por decoración.

## Prioridad de acabado
1. Terreno y caminos.
2. Río, acequias y puentes.
3. Fachadas e identidad arquitectónica.
4. Chacras y bodegas.
5. Cercos, postes y pequeños objetos.
6. Personajes y ciclos de caminata.
7. Vehículos y animales.
8. Sombras y profundidad.
9. Iluminación, clima y estaciones.
10. Pulido píxel por píxel.

**Objetivo final: que Villa Pelón pueda reconocerse incluso sin texto por la forma en que están dibujados su suelo, sus caminos, sus edificios, su agua, sus chacras y su gente.**
