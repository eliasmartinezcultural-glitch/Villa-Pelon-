/* Villa Pelón V6.5 — AUTORIDAD TERRITORIAL Y REGLAS DE VIDA
   Este archivo corrige incoherencias del mundo sin crear otro motor.
   Orden territorial: ciudad > calles/caminos > rural > río.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const R=V.v65Rules={version:2,enabled:true,ready:false};
const world=()=>V.world||{w:8400,h:5600};
const river=()=>V.v6Map?.river||{x:7000,y:0,w:1200,h:5600};
const minute=()=>Number(V.state?.minutes??480)%1440;
const hour=()=>minute()/60;
const night=()=>hour()<7||hour()>=21;
const rural=(x,y)=>x>=3000&&y>=2700&&x<7000&&y<5600;
const road=(x,y)=>V.streetSystem?.onRoad?!!V.streetSystem.onRoad(x,y):((y>=700&&y<=930)||(x>=1180&&x<=1400)||(y>=1330&&y<=1470));
const riverInside=(x,y,p=0)=>{const r=river();return x>=r.x-p&&x<=r.x+r.w+p&&y>=r.y-p&&y<=r.y+r.h+p};
const bridge=(x,y)=>{const r=river();if(x<r.x-20||x>r.x+r.w+20)return true;return Math.abs(y-815)<55||Math.abs(y-1395)<55};
const inBuilding=(x,y,p=0)=> (V.buildings||[]).some(b=>b.collision!==false&&x>=b.x-p&&x<=b.x+b.w+p&&y>=b.y-p&&y<=b.y+b.h+p);
const clamp=(o)=>{const w=world();o.x=Math.max(70,Math.min(w.w-70,o.x));o.y=Math.max(190,Math.min(w.h-70,o.y));};
function pushFromBuilding(o){for(const b of(V.buildings||[])){if(b.collision===false)continue;if(o.x>b.x-12&&o.x<b.x+b.w+12&&o.y>b.y-12&&o.y<b.y+b.h+12){
  const dl=Math.abs(o.x-(b.x-16)),dr=Math.abs(o.x-(b.x+b.w+16)),dt=Math.abs(o.y-(b.y-16)),db=Math.abs(o.y-(b.y+b.h+16));const m=Math.min(dl,dr,dt,db);
  if(m===dl)o.x=b.x-16;else if(m===dr)o.x=b.x+b.w+16;else if(m===dt)o.y=b.y-16;else o.y=b.y+b.h+16;
}}}
function safeBuildingPlacement(){
 for(const b of(V.buildings||[])){if(b._v65Checked)continue;b._v65Checked=true;
  const overlaps=road(b.x,b.y)||road(b.x+b.w,b.y)||road(b.x,b.y+b.h)||road(b.x+b.w,b.y+b.h)||road(b.x+b.w/2,b.y+b.h/2);
  if(overlaps){const candidates=[{x:b.x,y:b.y-270},{x:b.x,y:b.y+270},{x:b.x-300,y:b.y},{x:b.x+300,y:b.y}];const q=candidates.find(p=>p.x>80&&p.y>190&&p.x+b.w<world().w-80&&p.y+b.h<world().h-80&&!road(p.x+b.w/2,p.y+b.h/2));if(q){b.x=q.x;b.y=q.y;}}
  if(riverInside(b.x+b.w/2,b.y+b.h/2,10))b.x=Math.max(80,river().x-b.w-80);
 }
}
function forceOutOfRiver(o){if(riverInside(o.x,o.y,12)&&!bridge(o.x,o.y)){const r=river();o.x=r.x-45;o.vx=0;o.vy=0;o._navVX=0;o._navVY=0;}}
function homePoint(p){if(p.home&&Number.isFinite(p.home.x)&&Number.isFinite(p.home.y))return{x:p.home.x,y:p.home.y};if(p.homeX!=null)return{x:p.homeX,y:p.homeY};return{x:1200,y:620};}
function hideAtNight(p){p._v65Hidden=true;p.lifeMoving=false;p.lifeAt='casa';const h=homePoint(p);p.x+=(h.x-p.x)*0.12;p.y+=(h.y-p.y)*0.12;}
function citizens(){
 const all=[...(V.npcs||[]),...(V.worldLifeV56?.people||[]),...(V.life?.ambient||[]),...(V.life?.workers||[])];
 for(const p of all){if(!p||!Number.isFinite(p.x)||!Number.isFinite(p.y))continue;if(night())hideAtNight(p);else p._v65Hidden=false;forceOutOfRiver(p);clamp(p);if(!p._v65Hidden)pushFromBuilding(p);}
}
function animalsAndMachines(){const l=V.life;if(!l)return;
 l.animals=l.animals||[];for(const a of l.animals){a._v65Hidden=night()||!rural(a.x,a.y);if(!rural(a.x,a.y)){a.x=3600;a.y=3150;}forceOutOfRiver(a);clamp(a);}
 l.ruralMachines=l.ruralMachines||[];if(!l.ruralMachines.length)l.ruralMachines=[
  {id:'tractor_rural_1',x:3650,y:3150,vx:16,vy:4,type:'tractor'},
  {id:'tractor_rural_2',x:4850,y:3650,vx:-13,vy:3,type:'tractor'},
  {id:'tractor_rural_3',x:6100,y:4150,vx:10,vy:-4,type:'tractor'},
  {id:'camion_rural_1',x:5400,y:3300,vx:8,vy:0,type:'camion'}];
 for(const m of l.ruralMachines){m._v65Hidden=night();if(!m._v65Hidden){m.x+=m.vx*(1/60);m.y+=m.vy*(1/60);}if(!rural(m.x,m.y)){m.x=3600;m.y=3200;}forceOutOfRiver(m);clamp(m);}
}
function traffic(){for(const t of(V.life?.traffic||[])){t._v65Hidden=false;if(!road(t.x,t.y)){t.y=815;t.x=Math.max(100,Math.min(world().w-100,t.x));}}}
function renderFilter(){if(R.renderPatched||!V.engine?.render)return;const old=V.engine.render;V.engine.render=function(){const refs={n:V.npcs,a:V.life?.animals,m:V.life?.ruralMachines,am:V.life?.ambient,w:V.life?.workers,p:V.worldLifeV56?.people};const filt=a=>Array.isArray(a)?a.filter(x=>!x._v65Hidden):a;if(Array.isArray(refs.n))V.npcs=filt(refs.n);if(V.life){V.life.animals=filt(refs.a);V.life.ruralMachines=filt(refs.m);V.life.ambient=filt(refs.am);V.life.workers=filt(refs.w);}if(V.worldLifeV56)V.worldLifeV56.people=filt(refs.p);try{return old.apply(this,arguments)}finally{if(Array.isArray(refs.n))V.npcs=refs.n;if(V.life){V.life.animals=refs.a;V.life.ruralMachines=refs.m;V.life.ambient=refs.am;V.life.workers=refs.w;}if(V.worldLifeV56)V.worldLifeV56.people=refs.p;}};R.renderPatched=true;}
function patch(){if(R.patched||!V.engine?.update)return;safeBuildingPlacement();const old=V.engine.update;V.engine.update=function(dt){const result=old.apply(this,arguments);if(V.state?.started){citizens();animalsAndMachines();traffic();}return result};R.patched=true;R.ready=true;R.rules={day:7,night:21,noRoadBuildings:true,nightPopulationShelter:true,weatherChanges:true,ruralAnimals:true,ruralMachines:true,riverNoLife:true,bridgesOnly:true};renderFilter();}
patch();setTimeout(patch,300);setTimeout(patch,900);setTimeout(renderFilter,1500);
R.isNight=night;R.isRural=rural;R.isRoad=road;R.isRiver=riverInside;R.isBridge=bridge;
})();
