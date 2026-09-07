/* Villa Pelón V66 — consolidación de ciudadanos.
   LIFE conserva la autoridad de rutina/movimiento autónomo.
   Los NPC interactivos de game.js comparten posición y estado con LIFE.
   Se evita dibujar dos veces al mismo habitante: game.js dibuja los ciudadanos
   interactivos y LIFE conserva solamente los ciudadanos ambientales restantes.
*/
(()=>{
  'use strict';
  const V=window.VillaPelon||(window.VillaPelon={});
  const life=V.life;
  if(!life)return;

  const originalUpdate=life.update;
  const originalDraw=life.drawWorld;
  let linked=false;

  function linkCitizens(){
    if(linked||!Array.isArray(V.npcs)||!Array.isArray(life.ambient))return;
    const byName=new Map(life.ambient.map(p=>[p.name,p]));
    V.npcs.forEach(n=>{
      const p=byName.get(n.name);
      if(!p)return;
      n.__lifeCitizen=p;
      n.home=p.home;
      n.work=p.work;
      n.role=p.role;
      n.color=p.color;
    });
    linked=true;
    life.citizens=life.ambient;
    life.interactiveCitizens=V.npcs.filter(n=>n.__lifeCitizen).map(n=>n.name);
  }

  function sync(){
    linkCitizens();
    if(!Array.isArray(V.npcs))return;
    V.npcs.forEach(n=>{
      const p=n.__lifeCitizen;
      if(!p)return;
      n.x=p.x;
      n.y=p.y;
      n.moving=!!p.moving;
      n.walk=p.walk||0;
      n.direction=p.direction||'down';
      n.sheltered=!!p.sheltered;
      n.destination=p.destination||null;
      n.activity=p.routineActivity||p.destination||p.role||'cotidiano';
      n.routineClock=life.routineClock;
    });
  }

  life.update=function(dt,minutes){
    const result=originalUpdate.call(life,dt,minutes);
    sync();
    return result;
  };

  life.drawWorld=function(c){
    if(!originalDraw)return;
    linkCitizens();
    if(!Array.isArray(life.ambient)||!Array.isArray(V.npcs)){
      originalDraw(c);
      return;
    }
    const interactive=new Set(V.npcs.filter(n=>n.__lifeCitizen).map(n=>n.name));
    const saved=life.ambient;
    life.ambient=saved.filter(p=>!interactive.has(p.name));
    originalDraw(c);
    life.ambient=saved;
  };

  life.__v66NpcConsolidated=true;
  life.__v66NpcConsolidation={version:'66.0.0',authority:'LIFE',interactiveSource:'shared-citizen-state'};
  linkCitizens();
  sync();
})();
