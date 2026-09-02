/* Villa Pelón V6.5 — REGLAS DE VIDA DE PUEBLO
   Autoridad territorial: separa ciudad, caminos, rural y río.
   No crea RAF ni timers. Se ejecuta sobre el motor existente.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const R=V.v65Rules=V.v65Rules||{version:1,enabled:true};
const W=()=>V.world||{w:8400,h:5600};
const river=()=>V.v6Map?.river||{x:7000,y:0,w:1200,h:5600};
const night=()=>{const m=Number(V.state?.minutes??480);const h=m/60;return h<7||h>=21};
const rural=(x,y)=>x>=3000&&y>=2700&&x<7000;
const inRect=(x,y,b,p=0)=>x>=b.x-p&&x<=b.x+b.w+p&&y>=b.y-p&&y<=b.y+b.h+p;
const onRoad=(x,y)=>{
  const s=V.streetSystem;
  if(s?.onRoad)return !!s.onRoad(x,y);
  return (y>=700&&y<=930)||(x>=1180&&x<=1400)||(y>=1330&&y<=1470);
};
const inRiver=(x,y,p=0)=>{const r=river();return x>=r.x-p&&x<=r.x+r.w+p&&y>=r.y-p&&y<=r.y+r.h+p};
const bridge=(y)=>[790,1330].some(v=>Math.abs(y-(v+75))<95);
const safeWater=(x,y)=>!inRiver(x,y,25)||bridge(y);
function safeSpot(b){
  let x=b.x+b.w/2,y=b.y+b.h/2;
  if(onRoad(x,y)){
    const candidates=[{x,y:650},{x,y:1010},{x:1080,y},{x:1510,y}];
    let best=candidates.find(q=>q.x>80&&q.y>180&&q.x<W().w-80&&q.y<W().h-80&&!onRoad(q.x,q.y));
    if(best){b.x=Math.round(best.x-b.w/2);b.y=Math.round(best.y-b.h/2);}
  }
  if(inRiver(b.x+b.w/2,b.y+b.h/2,30))b.x=Math.max(80,river().x-b.w-60);
}
function sanitizeBuildings(){(V.buildings||[]).forEach(b=>{if(!b._v65Sanitized){safeSpot(b);b._v65Sanitized=true;}});}
function shelterPoint(p){
  if(p.home&&Number.isFinite(p.home.x)&&Number.isFinite(p.home.y))return {x:p.home.x,y:p.home.y};
  return rural(p.x,p.y)?{x:Math.max(3200,Math.min(6800,p.x)),y:Math.max(2850,Math.min(5000,p.y))}:{x:1200,y:620};
}
function clampEntity(o){
  if(!o||!Number.isFinite(o.x)||!Number.isFinite(o.y))return;
  if(inRiver(o.x,o.y,18)&&!bridge(o.y)){
    const r=river();o.x=r.x-45;o.vx=0;o._navVX=0;o._navVY=0;
  }
  o.x=Math.max(70,Math.min(W().w-70,o.x));o.y=Math.max(190,Math.min(W().h-70,o.y));
}
function coreCitizens(dt){
  const ns=V.npcs||[];
  for(const n of ns){
    if(night()){
      n._v65Hidden=true;
      const h=shelterPoint(n);const d=Math.hypot(h.x-n.x,h.y-n.y);
      if(d>18){n.x+=(h.x-n.x)/d*34*dt;n.y+=(h.y-n.y)/d*34*dt;}
    }else n._v65Hidden=false;
    clampEntity(n);
  }
}
function lifeEntities(){
  const l=V.life;if(!l)return;
  const arrays=[l.ambient||[],l.workers||[]];
  for(const arr of arrays)for(const p of arr){p._v65Hidden=night();if(night()){const h=shelterPoint(p);p.x=h.x;p.y=h.y;}clampEntity(p);}
  for(const a of(l.animals||[])){
    a._v65Hidden=night()||!rural(a.x,a.y);
    if(night()){a.x=Math.max(3200,Math.min(6800,a.x));a.y=Math.max(2850,Math.min(5000,a.y));}
    if(!rural(a.x,a.y)){a.x=3600;a.y=3200;}
    clampEntity(a);
  }
  for(const t of(l.traffic||[])){
    t._v65Hidden=false;
    if(!onRoad(t.x,t.y)){t.y=815;t.x=Math.max(100,Math.min(W().w-100,t.x));}
  }
}
function deepPeople(){
  const ps=V.worldLifeV56?.people||[];
  for(const p of ps){
    p._v65Hidden=night();
    if(night()){const h=shelterPoint(p);p.x=h.x;p.y=h.y;p.lifeMoving=false;p.lifeAt='casa';}
    clampEntity(p);
  }
}
function renderFilter(){
  if(R.renderPatched||!V.engine?.render)return;
  const old=V.engine.render;V.engine.render=function(){
    const np=V.npcs,na=V.life?.animals,am=V.life?.ambient,wo=V.life?.workers,dp=V.worldLifeV56?.people;
    const filter=a=>Array.isArray(a)?a.filter(x=>!x._v65Hidden):a;
    if(Array.isArray(np))V.npcs=np.filter(x=>!x._v65Hidden);
    if(V.life){V.life.animals=filter(na);V.life.ambient=filter(am);V.life.workers=filter(wo);}
    if(V.worldLifeV56)V.worldLifeV56.people=filter(dp);
    try{return old.apply(this,arguments)}finally{if(Array.isArray(np))V.npcs=np;if(V.life){V.life.animals=na;V.life.ambient=am;V.life.workers=wo;}if(V.worldLifeV56)V.worldLifeV56.people=dp;}
  };R.renderPatched=true;
}
function patch(){
  if(R.patched||!V.engine?.update)return;
  sanitizeBuildings();
  const old=V.engine.update;V.engine.update=function(dt){
    const r=old.apply(this,arguments);
    if(V.state?.started){coreCitizens(dt);deepPeople();lifeEntities();}
    return r;
  };R.patched=true;R.ready=true;
  R.rules={dayCycle:true,nightShelter:true,noHousesOnRoads:true,weather:true,ruralAnimals:true,ruralMachines:true,riverExclusion:true,bridgesOnly:true,urbanRuralSeparation:true};
  renderFilter();
}
patch();
setTimeout(patch,250);setTimeout(patch,800);setTimeout(renderFilter,1200);
R.isNight=night;
R.isRural=rural;
R.isRoad=onRoad;
R.isRiver=inRiver;
R.safeWater=safeWater;
})();
