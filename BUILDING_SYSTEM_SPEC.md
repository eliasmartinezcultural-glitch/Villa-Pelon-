# VILLA PELÓN — SISTEMA MAESTRO DE EDIFICIOS V1

## Objetivo
Convertir cada edificio del mapa en una pieza territorial reconocible, habitable, funcional y visualmente rica. No se aceptan bloques genéricos repetidos.

## Regla de composición
Cada edificio debe tener:
1. huella y escala física;
2. fachada con identidad;
3. techo y estructura;
4. puertas y ventanas coherentes;
5. vereda/acceso;
6. terreno inmediato;
7. instalaciones visibles;
8. objetos exteriores;
9. señales de uso y desgaste;
10. iluminación según hora;
11. habitantes o actividad compatible;
12. interior si el edificio es importante;
13. interacción cuando tenga función jugable.

## Capas visuales
- Base de terreno.
- Fundación/zócalo.
- Muros.
- Aberturas.
- Techo.
- Sombras duras pixeladas.
- Materiales secundarios.
- Vegetación.
- Cercos y límites.
- Objetos de uso.
- Señalética.
- Iluminación.
- Desgaste.
- Animación mínima.

## Materialidad local
Priorizar ladrillo, revoque gastado, chapa, madera, hormigón, piedra, tierra, ripio y cercos rurales. La paleta debe pertenecer al paisaje patagónico y evitar colores fantasiosos.

## Escala
Usar `V.worldScale` como única referencia. Adultos 60, niños 47, puerta 78, auto 86, camión 112 como referencias actuales. Toda nueva geometría debe derivarse de ellas.

## Variación
Los edificios residenciales deben compartir una familia arquitectónica, pero variar en ancho, techo, color, patio, cercos, árboles, ampliaciones y estado de mantenimiento.

## Profundidad
Los edificios importantes deben poder contar una historia mediante objetos: fotografías, herramientas, calendarios, carteles, cajones, bicicletas, radios, macetas, leña, tanques, mangueras, bolsas, bancos y utensilios.

## Función
Un edificio no debe ser solamente decoración. Comercio vende; escuela educa; radio informa; club reúne; galpón permite trabajo; vivienda permite descanso; bodega produce; estación/servicio mueve personas; edificios públicos generan trámites o misiones.

## Arquitectura interactiva
Puerta = acceso. Ventana = señal de vida. Luz = ocupación. Humo/vapor = actividad. Vehículo estacionado = presencia. Persona en entrada = oportunidad de diálogo.

## Prohibido
- Casas idénticas copiadas en serie.
- Fachadas sin accesos.
- Objetos flotando.
- Escalas incompatibles.
- Gradientes que rompan el pixel art.
- Decoración sin relación con la función.
- Edificios importantes sin actividad.

## Rendimiento
La geometría debe ser determinista y reutilizable. Los detalles lejanos se simplifican; los edificios cercanos reciben el nivel máximo. El sistema debe respetar el único ciclo del motor.
