/* VILLA PELÓN V57 — integridad del mundo.
   Única capa de corrección: no dibuja, no crea RAF, no crea intervalos y no crea UI.
   Consume exclusivamente el estado del motor principal y del motor de vida. */
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={}),S=V.gameState,life=V.life,geo=V.worldGeometry;
if(!S||!life||!geo)return;
const W=3200,H=2000,RIVER=2920,RIVER_SAFE=2862;
const roads=[
{x:0,y:600,w:3200,h:190},{x:1070,y:0,w:190,h:2000},{x:300,y:880,w:760,h:42},{x:1380,y:880,w:850,h:42},{x:2320,y:545,w:45,h:510}
];
const overlap=(a,b,p=0)=>a.x<b.x+b.w+p&&a.x+a.w>b.x-p&&a.y<b.y+b.h+p&&a.y+a.h>b.y-p;
const houseSlots=[{x:760,y:370},{x:1450,y:1080}];
const homes=(geo.buildings||[]).filter(b=>b.type==='home');
homes.forEach((b,i)=>{if(roads.some(r=>overlap(b,r,2))){const slot=houseSlots[i]||houseSlots[houseSlots.length-1];Object.assign(b,slot)}});
function safeActor(o){if(!o)return;o.x=Math.max(45,Math.min(RIVER_SAFE,o.x));o.y=Math.max(120,Math.min(H-45,o.y));for(const b of geo.buildings||[]){if(o.x>b.x-12&&o.x<b.x+b.w+12&&o.y>b.y-12&&o.y<b.y+b.h+12){const candidates=[{x:b.x+b.w/2,y:b.y-30},{x:b.x-30,y:b.y+b.h/2},{x:b.x+b.w+30,y:b.y+b.h/2},{x:b.x+b.w/2,y:b.y+b.h+30}];const p=candidates.find(q=>q.x>45&&q.x<RIVER_SAFE&&q.y>120&&q.y<H-45&&!geo.buildings.some(x=>x!==b&&q.x>x.x-12&&q.x<x.x+x.w+12&&q.y>x.y-12&&q.y<x.y+x.h+12));if(p){o.x=p.x;o.y=p.y}break}}}
if(!life.__v57Integrity){life.__v57Integrity=true;const old=life.update;life.update=function(dt,minutes){if(old)old(dt,minutes);(life.ambient||[]).forEach(safeActor);(life.workers||[]).forEach(safeActor);(life.animals||[]).forEach(safeActor);safeActor(S)};life.rules={version:'V57',singleLifeMotor:true,singleVisualAuthority:'game.js',noHouseOnRoad:true,noActorInsideBuilding:true,riverBoundary:RIVER_SAFE,pcMobile:true}}
V.worldGeometry.roads=roads;
V.integrity={version:'V57',world:{w:W,h:H,riverX:RIVER},homesOutsideRoads:homes.every(h=>!roads.some(r=>overlap(h,r,2))),singleVisualAuthority:'game.js',singleLifeAuthority:'life.js',activeModules:['village_data','life','game','v57_integrity','v50_version_badge','v55_runtime_integrator']};
})();
