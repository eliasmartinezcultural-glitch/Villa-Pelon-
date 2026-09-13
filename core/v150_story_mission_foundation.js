/* VILLA PELÓN V150 — FUNDACIÓN DE ESTÉTICA, HISTORIA Y MISIONES
   Solo registra contratos y contenido inicial. No toca geometría ni render estructural.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const M=V.matrix=V.matrix||{};
V.contentFoundation={version:'150.0',geometry:'SEALED_V138',aesthetic:{style:'pixel-art rural patagónico',palette:['tierra','verde apagado','ocre','azul río','luz cálida'],rules:['siluetas legibles','sombras simples','detalle localizado','sin ruido aleatorio','sin superposición de edificios']},story:{title:'Villa Pelón: donde lo cotidiano es mágico',premise:'El jugador recorre un pueblo vivo y descubre que la memoria de sus habitantes, sus caminos y sus pequeños trabajos forman una historia común.',acts:[{id:'llegada',title:'La llegada',focus:'conocer el núcleo urbano y sus habitantes'},{id:'huellas',title:'Las huellas del pueblo',focus:'reconstruir relatos, oficios y lugares'},{id:'camino',title:'Más allá del pueblo',focus:'explorar la transición rural, el río y Picada 21'},{id:'memoria',title:'Lo que permanece',focus:'unir testimonios y devolver sentido a la memoria colectiva'}]},missions:[{id:'primer-recorrido',type:'exploracion',act:'llegada',title:'Conocer Villa Pelón',objective:'Recorrer los puntos principales del núcleo urbano y hablar con tres habitantes.',status:'available'},{id:'voces-del-pueblo',type:'dialogo',act:'huellas',title:'Voces del pueblo',objective:'Reunir tres recuerdos diferentes sobre la vida cotidiana.',status:'planned'},{id:'camino-rural',type:'exploracion',act:'camino',title:'El camino hacia Picada 21',objective:'Seguir el recorrido rural sin alterar la geografía sellada.',status:'planned'}]};
M.content=M.content||{};M.content.foundation='V150';M.content.registries=['aesthetic','story','missions'];
V.runtimeAudit=Object.assign(V.runtimeAudit||{},{contentFoundation:true,contentVersion:'150.0',geometryLocked:true,matrix:'V150'});
document.documentElement.dataset.contentFoundation='150';
window.dispatchEvent(new CustomEvent('villa-pelon-content-foundation-ready',{detail:{version:'150.0',geometryLocked:true}}));
})();
