/* Villa Pelón V6.6 — AUTORIDAD TERRITORIAL
   Reglas finales del mundo: rutas, viviendas, noche, rural y río.
   No crea otro motor ni otro ciclo de render.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const R=V.v65Rules={version:3,enabled:true,ready:false};
const world=()=>V.world||{w:8400,h:5600};
const river=()=>V.v6Map?.river||{x:7000,y:0,w:1200,h:5600};
const minute=()=>Number(V.state?.minutes??480)%1440;
const hour=()=>minute()/60;
const night=()=>hour()<7||hour()>=21;
const rural=(x,y)=>x>=3000&&y>=2700&&x<7000&&y<5600;
const road=(x,y)=>V.streetSystem?.onRoad?!!V.streetSystem.onRoad(x,y):((y>=700&&y<=930)||(x>=1180&&x<=1400));
const riverInside=(x,y,p=0)=>{const r=river();return x>=r.x-p&&x<=r.x+r.w+p&&y>=r.y-p&&y<=r.y+r.h+p};
const bridge=(x,y)=>{const r=river();if(x<r.x-20||x>r.x+r.w+20)return false;return Math.abs(y-815)<70||Math.abs(y-1395)<70};
const rectsOverlap=(a,b,p=0)=>a.x-p<b.x+b.w&&a.x+a.w+p>b.x&&a.y-p<b.y+b.h&&a.y+a.h+p>b.y;
const inBuilding=(x,y,p=0)=> (V.buildings||[]).some(b=>b.collision!==false&&x>=b.x-p&&x<=b.x+b.w+p&&y>=b.y-p&&y<=b.y+b.h+p);
const clamp=(o)=>{const w=world();o.x=Math.max(70,Math.min(w.w-70,o.x));o.y=Math.max(190,Math.min(w.h-70,o.y));};
function pushFromBuilding(o){for(const b of(V.buildings||[])){if(b.collision===false)continue;if(o.x>b.x-12&&o.x<b.x+b.w+12&&o.y>b.y-12&&o.y<b.y+b.h+12){const dl=Math.abs(o.x-(b.x-18)),dr=Math.abs(o.x-(b.x+b.w+18)),dt=Math.abs(o.y-(b.y-18)),db=Math.abs(o.y-(b.y+b.h+18));const m=Math.min(dl,dr,dt,db);if(m===dl)o.x=b.x-18;else if(m===dr)o.x=b.x+b.w+18;else if(m===dt)o.y=b.y-18;else o.y=b.y+b.h+18;}}}
function safeBuildingPlacement(){for(const b of(V.buildings||[])){if(b._v66Checked)continue;b._v66Checked=true;const isHouse=b.type==='home';const hitsRoad=road(b.x+1,b.y+1)||road(b.x+b.w-1,b.y+1)||road(b.x+1,b.y+b.h-1)||road(b.x+b.w-1,b.y+b.h-1)||road(b.x+b.w/2,b.y+b.h/2);const hitsRiver=riverInside(b.x+b.w/2,b.y+b.h/2,10)||riverInside(b.x+1,b.y+1)||riverInside(b.x+b.w-1,b.y+b.h-1);if(hitsRiver||hitsRoad&&isHouse){const candidates=[{x:b.x,y:b.y-280},{x:b.x,y:b.y+280},{x:b.x-320,y:b.y},{x:b.x+320,y:b.y}];const q=candidates.find(p=>p.x>80&&p.y>190&&p.x+b.w<world().w-80&&p.y+b.h<world().h-80&&!road(p.x+b.w/2,p.y+b.h/2)&&!riverInside(p.x+b.w/2,p.y+b.h/2));if(q){b.x=q.x;b.y=q.y}}if(hitsRiver&&!qSafe(b)){b.x=Math.max(80,river().x-b.w-80)}}}
function qSafe(b){return !riverInside(b.x+b.w/2,b.y+b.h/2,10)&&!riverInside(b.x+1,b.y+1)&&!riverInside(b.x+b.w-1,b.y+b.h-1)}
function forceOutOfRiver(o){if(!riverInside(o.x,o.y,12)||bridge(o.x,o.y))return;const r=river();const candidates=[{x:r.x-50,y:o.y},{x:r.x+r.w+50,y:o.y},{x:o.x,y:Math.max(70,r.y-50)},{x:o.x,y:Math.min(world().h-70,r.y+r.h+50)}];const q=candidates.sort((a,b)=>Math.hypot(a.x-o.x,a.y-o.y)-Math.hypot(b.x-o.x,b.y-o.y)).find(p=>!riverInside(p.x,p.y,12));const safe=q||{x:r.x-50,y:o.y};o.x=safe.x;o.y=safe.y;o.vx=0;o.vy=0;o._navVX=0;o._navVY=0;}
function homePoint(p){if(p.home&&Number.isFinite(p.home.x)&&Number.isFinite(p.home.y))return{x:p.home.x,y:p.home.y};if(Number.isFinite(p.homeX)&&Number.isFinite(p.homeY))return{x:p.homeX,y:p.homeY};const shelters={ambient_0:{x:820,y:540},ambient_1:{x:1480,y:700},ambient_2:{x:900,y:940},ambient_3:{x:1650,y:1235},ambient_4:{x:720,y:680},ambient_5:{x:1760,y:1235},worker_0:{x:3750,y:2200},worker_1:{x:4120,y:2200},worker_2:{x:4860,y:2200}};return shelters[p.id]||{x:1200,y:620}}
function hideAtNight(p){p._v65Hidden=true;p.lifeMoving=false;p.lifeAt='casa';const h=homePoint(p);p.x+=(h.x-p.x)*0.18;p.y+=(h.y-p.y)*0.18;}
function citizens(){const all=[...(V.npcs||[]),...(V.worldLifeV56?.people||[]),...(V.life?.ambient||[]),...(V.life?.workers||[])];for(const p of all){if(!p||!Number.isFinite(p.x)||!Number.isFinite(p.y))continue;if(night())hideAtNight(p);else p._v65Hidden=false;forceOutOfRiver(p);clamp(p);if(!p._v65Hidden)pushFromBuilding(p);}}
function animalsAndMachines(){const l=V.life;if(!l)return;l.animals=l.animals||[];for(const a of l.animals){a._v65Hidden=night()||!rural(a.x,a.y);if(!rural(a.x,a.y)){a.x=3600;a.y=3150}forceOutOfRiver(a);clamp(a)}l.ruralMachines=l.ruralMachines||[];for(const m of l.ruralMachines){m._v65Hidden=night()||!rural(m.x,m.y);if(!rural(m.x,m.y)){m.x=3600;m.y=3200}forceOutOfRiver(m);clamp(m)}}
function traffic(){for(const t of(V.life?.traffic||[])){t._v65Hidden=false;if(!road(t.x,t.y)){const vertical=Math.abs(t.vy)>Math.abs(t.vx);if(vertical)t.x=1290;else t.y=815;}}}
function renderFilter(){if(R.renderPatched||!V.engine?.render)return;const old=V.engine.render;V.engine.render=function(){const refs={n:V.npcs,a:V.life?.animals,m:V.life?.ruralMachines,am:V.life?.ambient,w:V.life?.workers,p:V.worldLifeV56?.people};const filt=a=>Array.isArray(a)?a.filter(x=>!x._v65Hidden):a;if(Array.isArray(refs.n))V.npcs=filt(refs.n);if(V.life){V.life.animals=filt(refs.a);V.life.ruralMachines=filt(refs.m);V.life.ambient=filt(refs.am);V.life.workers=filt(refs.w)}if(V.worldLifeV56)V.worldLifeV56.people=filt(refs.p);try{return old.apply(this,arguments)}finally{if(Array.isArray(refs.n))V.npcs=refs.n;if(V.life){V.life.animals=refs.a;V.life.ruralMachines=refs.m;V.life.ambient=refs.am;V.life.workers=refs.w}if(V.worldLifeV56)V.worldLifeV56.people=refs.p}};R.renderPatched=true}
function patch(){if(R.patched||!V.engine?.update)return;safeBuildingPlacement();const old=V.engine.update;V.engine.update=function(dt){const result=old.apply(this,arguments);if(V.state?.started){citizens();animalsAndMachines();traffic()}return result};R.patched=true;R.ready=true;R.rules={day:7,night:21,noRoadBuildings:true,nightPopulationShelter:true,weatherChanges:true,ruralAnimals:true,ruralMachines:true,riverNoLife:true,bridgesOnly:true};renderFilter()}
patch();
R.isNight=night;R.isRural=rural;R.isRoad=road;R.isRiver=riverInside;R.isBridge=bridge;
})();
