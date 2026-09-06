/* VILLA PELÓN V87 — EXPANSIÓN FINAL
   V87 es la última expansión espacial. No se aumenta el tamaño después de aquí.
   Se reserva el máximo 8000x5200 para completar ciudad, periferia, chacras, río, bardas y campo.
   V87.1: corredor territorial remoto — Picada 21.
   No amplía el mundo: ocupa territorio ya reservado dentro del límite final.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const FINAL_W=8000,FINAL_H=5200;
V.finalWorld={version:'V87.1.0',locked:true,width:FINAL_W,height:FINAL_H,
 expansionPlan:[
  {id:'V86',name:'Vida en Territorio',focus:'escala, densidad, rutinas, servicios, movilidad y conexiones urbanas-rurales'},
  {id:'V87',name:'Territorio Completo',focus:'última expansión: periferia urbana, nuevas chacras, corredores del río, bardas, campo y puntos narrativos finales'}
 ],
 rules:{noMoreWorldExpansion:true,maxWidth:FINAL_W,maxHeight:FINAL_H,allNewContentMustFitEnvelope:true,
 noHousesOnRoads:true,noHousesInRiver:true,noBuildingsInRiver:true,bridgesOnlyRiverCrossings:true,
 buildingsMustRespectHumanScale:true,pixelArtOnly:true},
 remoteSector:{id:'picada-21',name:'Picada 21',locked:true,corner:'sudeste',role:'asentamiento rural remoto'}
};

const world=V.worldAuthority?.geometry||V.worldGeometry;
if(!world)return;
world.width=FINAL_W;world.height=FINAL_H;world.w=FINAL_W;world.h=FINAL_H;
world.roads=Array.isArray(world.roads)?world.roads:[];
world.buildings=Array.isArray(world.buildings)?world.buildings:[];
world.sites=Array.isArray(world.sites)?world.sites:[];

// El extremo sudeste es el sector más alejado del núcleo urbano. Picada 21
// llega hasta allí mediante un corredor rural en dos tramos, sin salir del mundo.
const hasRoad=id=>world.roads.some(r=>r.id===id);
if(!hasRoad('picada-21-tramo-sur')) world.roads.push({
  id:'picada-21-tramo-sur',name:'Picada 21',x:7350,y:2450,w:82,h:2550,kind:'rural-road',remote:true
});
if(!hasRoad('picada-21-tramo-este')) world.roads.push({
  id:'picada-21-tramo-este',name:'Picada 21 — acceso final',x:7350,y:4920,w:600,h:82,kind:'rural-road',remote:true
});

const addBuilding=(b)=>{if(!world.buildings.some(x=>x.id===b.id))world.buildings.push(b)};
// Cuatro viviendas pequeñas, agrupadas junto al final del camino pero fuera de su calzada.
[
 {id:'picada21-casa-01',label:'CASA 21-01',type:'home',x:7470,y:4560,w:190,h:125,zone:'campo',sector:'picada-21'},
 {id:'picada21-casa-02',label:'CASA 21-02',type:'home',x:7720,y:4560,w:190,h:125,zone:'campo',sector:'picada-21'},
 {id:'picada21-casa-03',label:'CASA 21-03',type:'home',x:7470,y:4725,w:190,h:125,zone:'campo',sector:'picada-21'},
 {id:'picada21-casa-04',label:'CASA 21-04',type:'home',x:7720,y:4725,w:190,h:125,zone:'campo',sector:'picada-21'}
].forEach(addBuilding);

if(!world.sites.some(s=>s.id==='parada-picada-21')) world.sites.push({
 id:'parada-picada-21',name:'PARADA DE COLECTIVO · PICADA 21',kind:'bus-stop',x:7240,y:4810,zone:'campo',sector:'picada-21',
 description:'Parada rural que conecta Picada 21 con el resto del territorio.'
});

// Mantener ambas referencias coherentes: canonical world y copia de game.js.
const local=V.worldGeometry;
if(local&&local!==world){
  local.w=FINAL_W;local.h=FINAL_H;local.width=FINAL_W;local.height=FINAL_H;
  local.roads=world.roads;
  local.buildings=world.buildings;
  local.sites=world.sites;
}

// Recalcular la autoridad de colisión para que las viviendas remotas sean sólidas
// y Picada 21 siga siendo circulación, nunca superficie edificable.
const overlaps=(a,b,pad=0)=>a.x-pad<b.x+b.w&&a.x+a.w+pad>b.x&&a.y-pad<b.y+b.h&&a.y+a.h+pad>b.y;
const validBuilding=(b)=>!world.roads.some(r=>overlaps(b,r,10));
world.rules=Object.assign({},world.rules,{noHousesOnRoads:true,noBuildingsOnRoads:true,bridgesOnlyRiverCrossings:true});
world.buildings=world.buildings.filter(validBuilding);
if(local&&local!==world)local.buildings=world.buildings;

if(world.collision){
  const previousZoneAt=world.collision.zoneAt;
  world.collision.roadAt=(x,y)=>world.roads.find(r=>x>=r.x&&x<=r.x+r.w&&y>=r.y&&y<=r.y+r.h)||null;
  world.collision.zoneAt=previousZoneAt||((x,y)=>world.zones?.find(z=>x>=z.x&&x<=z.x+z.w&&y>=z.y&&y<=z.y+z.h)||null);
}

window.dispatchEvent(new CustomEvent('villa-pelon-final-world-ready',{detail:V.finalWorld}));
window.dispatchEvent(new CustomEvent('villa-pelon-picada21-ready',{detail:{id:'picada-21',houses:4,busStop:true}}));
})();