/* Villa Pelón V6.13 — AUTORIDAD TERRITORIAL
   Reglas del mundo conectadas al ciclo real de game.js.
   No crea un segundo loop ni mueve NPC principales: sólo valida y corrige estado territorial.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const R=V.v65Rules={version:9,enabled:true,ready:false};
const world=()=>V.world||{w:8400,h:5600};
const river=()=>({x:7000,y:0,w:1200,h:5600});
const minute=()=>Number(V.state?.minutes??480)%1440;const hour=()=>minute()/60;const night=()=>hour()<7||hour()>=21;
const rural=(x,y)=>x>=3000&&y>=2700&&x<7000&&y<5600;
const road=(x,y)=>V.territorialNavigation?.roadAt?V.territorialNavigation.roadAt(x,y):!!V.streetSystem?.onRoad?.(x,y);
const riverInside=(x,y,p=0)=>{const r=river();return x>=r.x-p&&x<=r.x+r.w+p&&y>=r.y-p&&y<=r.y+r.h+p};
const bridge=(x,y)=>{const r=river();return x>=r.x-24&&x<=r.x+r.w+24&&(Math.abs(y-815)<70||Math.abs(y-1395)<70)};
function clamp(o){const w=world();o.x=Math.max(70,Math.min(w.w-70,o.x));o.y=Math.max(190,Math.min(w.h-70,o.y))}
function pushFromBuilding(o){for(const b of(V.buildings||[])){if(b.collision===false)continue;if(o.x>b.x-12&&o.x<b.x+b.w+12&&o.y>b.y-12&&o.y<b.y+b.h+12){const ds=[['l',Math.abs(o.x-(b.x-18))],['r',Math.abs(o.x-(b.x+b.w+18))],['t',Math.abs(o.y-(b.y-18))],['b',Math.abs(o.y-(b.y+b.h+18))]].sort((a,b)=>a[1]-b[1])[0][0];if(ds==='l')o.x=b.x-18;else if(ds==='r')o.x=b.x+b.w+18;else if(ds==='t')o.y=b.y-18;else o.y=b.y+b.h+18}}}
function safeBuildingPlacement(){for(const b of(V.buildings||[])){if(b._v67Checked)continue;b._v67Checked=true;const hitsRoad=road(b.x+1,b.y+1)||road(b.x+b.w-1,b.y+1)||road(b.x+1,b.y+b.h-1)||road(b.x+b.w-1,b.y+b.h-1)||road(b.x+b.w/2,b.y+b.h/2);const hitsRiver=riverInside(b.x+b.w/2,b.y+b.h/2,10)||riverInside(b.x+1,b.y+1)||riverInside(b.x+b.w-1,b.y+b.h-1);if(hitsRiver||hitsRoad){const candidates=[{x:b.x,y:b.y-280},{x:b.x,y:b.y+280},{x:b.x-320,y:b.y},{x:b.x+320,y:b.y}];const q=candidates.find(p=>p.x>80&&p.y>190&&p.x+b.w<world().w-80&&p.y+b.h<world().h-80&&!road(p.x+b.w/2,p.y+b.h/2)&&!riverInside(p.x+b.w/2,p.y+b.h/2));if(q){b.x=q.x;b.y=q.y}if(hitsRiver&&!qSafe(b))b.x=Math.max(80,river().x-b.w-80)}}}
function qSafe(b){return !riverInside(b.x+b.w/2,b.y+b.h/2,10)&&!riverInside(b.x+1,b.y+1)&&!riverInside(b.x+b.w-1,b.y+b.h-1)}
function forceOutOfRiver(o){if(!riverInside(o.x,o.y,12)||bridge(o.x,o.y))return;const r=river(),c=[{x:r.x-50,y:o.y},{x:r.x+r.w+50,y:o.y},{x:o.x,y:70},{x:o.x,y:world().h-70}].sort((a,b)=>Math.hypot(a.x-o.x,a.y-o.y)-Math.hypot(b.x-o.x,b.y-o.y)).find(p=>!riverInside(p.x,p.y,12));const s=c||{x:r.x-50,y:o.y};o.x=s.x;o.y=s.y;o.vx=0;o.vy=0;o._navVX=0;o._navVY=0}
function homePoint(p){if(p.home&&Number.isFinite(p.home.x)&&Number.isFinite(p.home.y))return{x:p.home.x,y:p.home.y};if(Number.isFinite(p.homeX)&&Number.isFinite(p.homeY))return{x:p.homeX,y:p.homeY};return{x:1200,y:620}}
function shelterMover(p){if(!night()||p._v65Hidden)return;p._v65Hidden=true;p.lifeMoving=false;p.lifeAt='casa';const h=homePoint(p);p.x+=(h.x-p.x)*.18;p.y+=(h.y-p.y)*.18}
function citizens(){const all=V.population?.people?.()||[...(V.npcs||[]),...(V.life?.ambient||[]),...(V.life?.workers||[])];const movers=new Set(V.population?.movers?.()||[...(V.life?.ambient||[]),...(V.life?.workers||[])]);for(const p of all){if(!p||!Number.isFinite(p.x)||!Number.isFinite(p.y))continue;if(movers.has(p))shelterMover(p);else p._v65Hidden=false;forceOutOfRiver(p);clamp(p);if(!p._v65Hidden)pushFromBuilding(p)}}
function animalsAndMachines(){const l=V.life;if(!l)return;for(const a of(l.animals||[])){a._v65Hidden=night()||!rural(a.x,a.y);if(!rural(a.x,a.y)){a.x=3600;a.y=3150}forceOutOfRiver(a);clamp(a)}for(const m of(l.ruralMachines||[])){m._v65Hidden=night()||!rural(m.x,m.y);if(!rural(m.x,m.y)){m.x=3600;m.y=3200}forceOutOfRiver(m);clamp(m)}}
function traffic(){for(const t of(V.life?.traffic||[])){t._v65Hidden=false;if(!road(t.x,t.y)){const vertical=Math.abs(t.vy)>Math.abs(t.vx);if(vertical)t.x=1290;else t.y=815}}}
function patch(){if(R.patched||!V.life?.update)return;safeBuildingPlacement();const old=V.life.update;V.life.update=function(dt,minutes){const result=old.apply(this,arguments);if(V.state?.started){citizens();animalsAndMachines();traffic()}return result};R.patched=true;R.ready=true;R.rules={day:7,night:21,noRoadBuildings:true,nightPopulationShelter:true,weatherChanges:true,ruralAnimals:true,ruralMachines:true,riverNoLife:true,bridgesOnly:true,unifiedPopulation:true,liveUpdateHook:true};R._baseLifeUpdate=old}
patch();
R.isNight=night;R.isRural=rural;R.isRoad=road;R.isRiver=riverInside;R.isBridge=bridge;R.check=()=>({ok:true,version:9,dayStarts:7,nightStarts:21,buildings:Array.isArray(V.buildings)?V.buildings.length:0,animals:Array.isArray(V.life?.animals)?V.life.animals.length:0,population:V.population?.people?.().length||0,navigation:!!V.territorialNavigation?.ready});
})();
