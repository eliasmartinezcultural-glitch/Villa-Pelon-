/* VILLA PELÓN V87 — EXPANSIÓN FINAL
   V87 es la última expansión espacial. No se aumenta el tamaño después de aquí.
   Se reserva el máximo 8000x5200 para completar ciudad, periferia, chacras, río, bardas y campo.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
V.finalWorld={version:'V87.0.0',locked:true,width:8000,height:5200,
 expansionPlan:[
  {id:'V86',name:'Vida en Territorio',focus:'escala, densidad, rutinas, servicios, movilidad y conexiones urbanas-rurales'},
  {id:'V87',name:'Territorio Completo',focus:'última expansión: periferia urbana, nuevas chacras, corredores del río, bardas, campo y puntos narrativos finales'}
 ],
 rules:{noMoreWorldExpansion:true,maxWidth:8000,maxHeight:5200,allNewContentMustFitEnvelope:true,
 noHousesOnRoads:true,noHousesInRiver:true,noBuildingsInRiver:true,bridgesOnlyRiverCrossings:true,
 buildingsMustRespectHumanScale:true,pixelArtOnly:true}};
if(V.worldGeometry){V.worldGeometry.width=8000;V.worldGeometry.height=5200;V.worldGeometry.w=8000;V.worldGeometry.h=5200}
window.dispatchEvent(new CustomEvent('villa-pelon-final-world-ready',{detail:V.finalWorld}));
})();