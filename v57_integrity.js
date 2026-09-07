/* VILLA PELÓN V80 — INTEGRIDAD TERRITORIAL DINÁMICA
   La capa de integridad consume el mundo real ya expandido. No vuelve a imponer
   los límites históricos de 3200x2000 sobre el jugador ni sobre los actores. */
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={}),S=V.gameState,life=V.life,geo=V.worldGeometry;
if(!S||!life||!geo)return;
const world=V.world||{};
const W=Math.max(8200,Number(world.w)||8200),H=Math.max(4200,Number(world.h)||4200);
const river=geo.river||{x:7000,w:360,y:80,h:H-160};
const roads=Array.isArray(geo.roads)?geo.roads:[];
const overlap=(a,b,p=0)=>a.x<b.x+b.w+p&&a.x+a.w>b.x-p&&a.y<b.y+b.h+p&&a.y+a.h>b.y-p;
const houseSlots=[{x:760,y:370},{x:1450,y:1080}];
const homes=(geo.buildings||[]).filter(b=>b.type==='home');
homes.forEach((b,i)=>{if(roads.some(r=>overlap(b,r,2))){const slot=houseSlots[i]||houseSlots[houseSlots.length-1];Object.assign(b,slot)}});
function safeActor(o){if(!o)return;o.x=Math.max(45,Math.min(W-45,Number(o.x)||45));o.y=Math.max(120,Math.min(H-45,Number(o.y)||120));for(const b of geo.buildings||[]){if(o.x>b.x-12&&o.x<b.x+b.w+12&&o.y>b.y-12&&o.y<b.y+b.h+12){const candidates=[{x:b.x+b.w/2,y:b.y-30},{x:b.x-30,y:b.y+b.h/2},{x:b.x+b.w+30,y:b.y+b.h/2},{x:b.x+b.w/2,y:b.y+b.h+30}];const p=candidates.find(q=>q.x>45&&q.x<W-45&&q.y>120&&q.y<H-45&&!geo.buildings.some(x=>x!==b&&q.x>x.x-12&&q.x<x.x+x.w+12&&q.y>x.y-12&&q.y<x.y+x.h+12));if(p){o.x=p.x;o.y=p.y}break}}}
if(!life.__v80Integrity){life.__v80Integrity=true;const old=life.update;life.update=function(dt,minutes){if(old)old(dt,minutes);(life.ambient||[]).forEach(safeActor);(life.workers||[]).forEach(safeActor);(life.animals||[]).forEach(safeActor);safeActor(S)};life.rules={version:'V80',singleLifeMotor:true,singleVisualAuthority:'game.js',noHouseOnRoad:true,noActorInsideBuilding:true,worldBoundary:{w:W,h:H},pcMobile:true}}
V.worldGeometry.roads=roads;
V.integrity={version:'V80',world:{w:W,h:H},homesOutsideRoads:homes.every(h=>!roads.some(r=>overlap(h,r,2))),singleVisualAuthority:'game.js',singleLifeAuthority:'life.js',legacyPlayerClampRemoved:true};
})();
