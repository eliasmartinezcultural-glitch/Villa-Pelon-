# Villa Pelón — control de versiones

## Versión activa
**V87.13 · V62 Reference Consolidation**

## V87.13 — V62 Reference Consolidation
- La arquitectura avanzada V87 se conserva como base funcional.
- V62 queda establecido como referencia de diseño y de autoridad: un solo mundo, un solo flujo de movimiento, persistencia local y experiencia PC/celular.
- Se elimina visualmente el lenguaje pastel: interfaz oscura, contraste alto, bordes compactos y tratamiento pixel-art más sobrio.
- Se incorpora una capa visual V62 sin modificar la autoridad del render ni crear un segundo motor.
- Se incorpora un guard funcional para entrada, pérdida de foco, diálogo y guardado de emergencia.
- Se sincroniza el número de build del despliegue a V87.13.

## V87.12 — auditoría final
- Consolidación de carga, UI, pixel art y auditoría.
- Correcciones de movimiento táctil, vida y colisiones.
- Eliminación de UI pastel duplicada.
- Integración de campaña al ciclo único del motor.

## V87 — Territorio Completo
- Última expansión espacial: periferia urbana, nuevas chacras, corredores del río, bardas, campo y Picada 21.
- El mundo queda limitado a 8000x5200 para evitar expansión descontrolada.
- Las nuevas viviendas respetan caminos, río y escala humana.

## V86 — Vida en Territorio
- Escala, densidad, rutinas, servicios, movilidad y conexiones urbanas-rurales.

## V85 — Integridad de misiones
- Validaciones de progreso, evidencias y estados de misión.

## V84 — Auditoría profunda
- Revisión estructural de jugabilidad y consistencia del mundo.

## V83 — Mobile First
- Soporte prioritario para celular, controles táctiles y calidad de arranque.

## V82 — Gameplay Integrity
- Refuerzo de movimiento, interacción y estados persistentes.

## V81 — Player Integrity
- Validaciones de estado del jugador y continuidad.

## V80 — Mission World
- Mundo de misiones y vida cotidiana conectado al territorio.

## V79 — Social World
- Relaciones y actividad social ambiental.

## V78 — Spatial Interiors
- Interiores y lógica espacial.

## V77 — NPC Daily Schedule
- Rutinas horarias de habitantes.

## V76 — Territorial Pathfinding
- Navegación territorial.

## V75 — Territorial Navigation
- Navegación y lectura del territorio.

## V74 — World Authority
- Autoridad territorial única.

## V73 — Interior Runtime
- Runtime de interiores.

## V72 — Persistence
- Persistencia versionada.

## V71 — Building System
- Sistema de edificios.

## V70 — NPC Systems
- Entidades, rutinas e interacción NPC.

## V69 — Interaction Engine
- Motor de interacción contextual.

## V68 — World Core / Audio
- Núcleo territorial y audio ambiental.

## V67 — Audio / UI Systems
- Sistemas de audio e interfaz.

## V66 — Territorial Map
- Mapa territorial.

## V65 — Living Rural World
- Caminos de tierra, canales/acequias, cultivos, huertas, frutales, viñedos, cercos y arboledas.
- Vida rural con maquinaria, tractores, carros, tránsito, trabajadores, animales y aves.
- Clima dinámico y cambios de actividad.
- Diálogos ambientales.

## V64 — Historical Worldplay
- Arco narrativo basado en agua, chacras, comunidad, frutales, vino y memoria viva.
- Misiones definidas como datos con objetivos, pasos, evidencias y recompensas.
- Separación entre ficción de ambientación y hechos históricos documentados.

## V63 — Territorial Identity
- Identidad territorial coherente de valle rural irrigado norpatagónico.

## V62 — Worldplay Core
- Nueva introducción narrativa: descubrir la historia mediante misiones y exploración.
- Mundo por zonas: centro, barrio, rural, ribera y servicios/comunidad.
- Actividades cotidianas y puntos de interés definidos como datos.
- Menú de partida, guardado, carga, reinicio, idioma, música, pantalla completa y ayuda.
- Soporte PC y celular sobre una única autoridad de movimiento.

## Regla profesional permanente
No crear segundos motores, loops, estados paralelos ni sistemas de misión aislados. Todo sistema nuevo debe conectarse a las autoridades existentes, conservar el mundo canónico y aumentar la versión.