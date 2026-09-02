/* Villa Pelón V6.5 — REGLAS DE VIDA DE PUEBLO
   Autoridad territorial: separa ciudad, caminos, rural y río.
   No crea RAF ni timers. Se ejecuta sobre el motor existente.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const R=V.v65Rules=V.v65Rules||{version:1,enabled:true};
const W=()=>V.world||{w:8400,h:5600};
const river=()=>V.v6Map?.river||{x:7000,y:0,w:1200,h:5600};
const night=()=>{const m=Number(V.state?.minutes??480),h=m/60;return h<7||h>=21};
const rural=(x,y)=>x>=3000&&y>=2700&&x<7000;
const onRoad=(x,y)=>{const s=V.streetSystem;if(s?.onRoad)return !!s.onRoad(x,y);return (y>=700&&y<=930)||(x>=1180&&x<=1400)||(y>=1330&&y<=1470)};
const inRiver=(x,y,p=0)=>{const r=river();return x>=r.x-p&&x<=r.x+r.w+p&&y>=r.y-p&&y<=r.y+r.h+p};
const bridge=(y)=>[790,1330].some(v=>Math.abs(y-(v+75))<95);
function safeSpot(b){const cx=b.x+b.w/2,cy=b.y+b.h/2;if(onRoad(cx,cy)){const q=[{x:cx,y:650},{x:cx,y:1010},{x:1080,y:cy},{x:1510,y:cy}].find(p=>p.x>80&&p.y>190&&p.x<W().w-80&&p.y<W().h-80&&!onRoad(p.x,p.y));if(q){b.x=Math.round(q.x-b.w/2);b.y=Math.round(q.y-b.h/2)}}if(inRiver(b.x+b.w/2,b.y+b.h/2,30))b.x=Math.max(80,river().x-b.w-60)}
function sanitizeBuildings(){(V.buildings||[]).forEach(b=>{if(!b._v65Sanitized){safeSpot(b);b._v65Sanitized=true}})}
function shelterPoint(p){if(p.home&&Number.isFinite(p.home.x)&&Number.isFinite(p.home.y))return{x:p.home.x,y:p.home.y};return rural(p.x,p.y)?{x:Math.max(3200,Math.min(6800,p.x)),y:Math.max(2850,Math.min(5000,p.y))}:{x:1200,y:620}}
function clampEntity(o){if(!o||!Number.isFinite(o.x)||!Number.isFinite(o.y))return;if(inRiver(o.x,o.y,18)&&!bridge(o.y)){const r=river();o.x=r.x-45;o.vx=0;o._navVX=0;o._navVY=0}o.x=Math.max(70,Math.min(W().w-70,o.x));o.y=Math.max(190,Math.min(W().h-70,o.y))}
function ensureRural(){const l=V.life;if(!l)return;l.ruralMachines=l.ruralMachines||[];if(!l.ruralMachines.length){l.ruralMachines=[{id:'tractor_rural_1',x:3650,y:3150,vx:16,vy:4,type:'tractor',activeDay:true},{id:'tractor_rural_2',x:4850,y:3650,vx:-13,vy:3,type:'tractor',activeDay:true},{id:'tractor_rural_3',x:6100,y:4150,vx:10,vy:-4,type:'tractor',activeDay:true},{id:'camion_rural_1',x:5400,y:3300,vx:8,vy:0,type:'camion',activeDay:true}]}l.ruralMachines.forEach(o=>{o._v65Hidden=night();if(night()){o._v65Hidden=true}else{o.x+=o.vx*.016;o.y+=o.vy*.016;if(!rural(o.x,o.y)){o.x=3600;o.y=3200}}clampEntity(o)})}
function ruralRender(){const l=V.life;if(!l||l.__v65RuralRender||typeof l.drawWorld!=='function')return;const old=l.drawWorld;l.drawWorld=function(c){old.apply(this,arguments);if(night())return;c.save();for(const o of(l.ruralMachines||[])){c.translate(Math.round(o.x),Math.round(o.y));c.fillStyle=o.type==='tractor'?'#526f3b':'#80624b';c.fillRect(-28,-11,56,22);c.fillStyle='#222';c.fillRect(-22,10,12,8);c.fillRect(12,10,12,8);if(o.type==='tractor'){c.fillStyle='#526f3b';c.fillRect(7,-20,19,15);c.fillStyle='#222';c.fillRect(-25,7,13,11);c.fillRect(10,8,17,12)}else{c.fillStyle='#6d5747';c.fillRect(8,-17,26,28)}c.translate(-Math.round(o.x),-Math.round(o.y))}c.restore()};l.__v65RuralRender=true}
function coreCitizens(dt){for(const n of(V.npcs||[])){if(night()){n._v65Hidden=true;const h=shelterPoint(n),d=Math.hypot(h.x-n.x,h.y-n.y);if(d>18){n.x+=(h.x-n.x)/d*34*dt;n.y+=(h.y-n.y)/d*34*dt}}else n._v65Hidden=false;clampEntity(n)}}
function lifeEntities(){const l=V.life;if(!l)return;for(const arr of[l.ambient||[],l.workers||[]])for(const p of arr){p._v65Hidden=night();if(night()){const h=shelterPoint(p);p.x=h.x;p.y=h.y}clampEntity(p)}for(const a of(l.animals||[])){a._v65Hidden=night()||!rural(a.x,a.y);if(night()){a.x=Math.max(3200,Math.min(6800,a.x));a.y=Math.max(2850,Math.min(5000,a.y))}if(!rural(a.x,a.y)){a.x=3600;a.y=3200}clampEntity(a)}for(const t of(l.traffic||[])){t._v65Hidden=false;if(!onRoad(t.x,t.y)){t.y=815;t.x=Math.max(100,Math.min(W().w-100,t.x))}}}
function deepPeople(){for(const p of(V.worldLifeV56?.people||[])){p._v65Hidden=night();if(night()){const h=shelterPoint(p);p.x=h.x;p.y=h.y;p.lifeMoving=false;p.lifeAt='casa'}clampEntity(p)}}
function renderFilter(){if(R.renderPatched||!V.engine?.render)return;const old=V.engine.render;V.engine.render=function(){const np=V.npcs,na=V.life?.animals,am=V.life?.ambient,wo=V.life?.workers,dp=V.worldLifeV56?.people,rm=V.life?.ruralMachines;const f=a=>Array.isArray(a)?a.filter(x=>!x._v65Hidden):a;if(Array.isArray(np))V.npcs=f(np);if(V.life){V.life.animals=f(na);V.life.ambient=f(am);V.life.workers=f(wo);V.life.ruralMachines=f(rm)}if(V.worldLifeV56)V.worldLifeV56.people=f(dp);try{return old.apply(this,arguments)}finally{if(Array.isArray(np))V.npcs=np;if(V.life){V.life.animals=na;V.life.ambient=am;V.life.workers=wo;V.life.ruralMachines=rm}if(V.worldLifeV56)V.worldLifeV56.people=dp}};R.renderPatched=true}
function patch(){if(R.patched||!V.engine?.update)return;sanitizeBuildings();ensureRural();ruralRender();const old=V.engine.update;V.engine.update=function(dt){const r=old.apply(this,arguments);if(V.state?.started){coreCitizens(dt);deepPeople();lifeEntities();ensureRural()}return r};R.patched=true;R.ready=true;R.rules={dayCycle:true,nightShelter:true,noHousesOnRoads:true,weather:true,ruralAnimals:true,ruralMachines:true,riverExclusion:true,bridgesOnly:true,urbanRuralSeparation:true};renderFilter()}
patch();setTimeout(patch,250);setTimeout(patch,800);setTimeout(renderFilter,1200);
R.isNight=night;R.isRural=rural;R.isRoad=onRoad;R.isRiver=inRiver;R.safeWater=(x,y)=>!inRiver(x,y,25)||bridge(y);
})();
