/* VILLA PELÓN — INTEGRITY GATE V95.2
   Valida y corrige referencias compartidas sin dibujar, mover personajes
   ni crear otro loop. Idempotente y compatible con el Stability Gate.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const WORLD={w:8200,h:4200};
function uniquePoints(G){
  if(!Array.isArray(G.points))G.points=[];
  const seen=new Set();
  G.points=G.points.filter(p=>p&&p.id&&Number.isFinite(+p.x)&&Number.isFinite(+p.y)&&!seen.has(p.id)&&(seen.add(p.id),true));
}
function normalizeState(){
  const S=V.gameState;if(!S)return;
  S.x=Math.max(45,Math.min(WORLD.w-45,Number.isFinite(+S.x)?+S.x:1180));
  S.y=Math.max(105,Math.min(WORLD.h-45,Number.isFinite(+S.y)?+S.y:650));
  S.money=Math.max(0,Number.isFinite(+S.money)?+S.money:10000);
  S.energy=Math.max(0,Math.min(100,Number.isFinite(+S.energy)?+S.energy:100));
  S.day=Math.max(1,Math.floor(Number.isFinite(+S.day)?+S.day:1));
  S.minutes=((Number.isFinite(+S.minutes)?+S.minutes:480)%1440+1440)%1440;
  if(!Array.isArray(S.inventory))S.inventory=[];
  if(!S.flags||typeof S.flags!=='object')S.flags={};
  if(!S.stats||typeof S.stats!=='object')S.stats={steps:0,interactions:0,harvests:0};
  if(V.missions?.ensure)V.missions.ensure(S);
  if(V.vergel?.sync)V.vergel.sync();
}
function validate(){
  const G=V.worldGeometry||{};
  V.world=Object.assign(V.world||{},WORLD);
  uniquePoints(G);
  const required=[['picada21_sign',7500,2200,'PICA. 21 →','road_sign'],['picada21_stop',7550,2350,'PARADA PICADA 21','bus_stop'],['picada21_area',7550,2250,'PICADA 21','mission_area']];
  required.forEach(([id,x,y,label,type])=>{if(!G.points.some(p=>p.id===id))G.points.push({id,x,y,label,type})});
  if(!Array.isArray(G.routes))G.routes=[];
  if(!G.routes.some(r=>r?.id==='picada21_route'))G.routes.push({id:'picada21_route',points:[{x:4700,y:2185},{x:5600,y:2185},{x:6500,y:2185},{x:7500,y:2250}]});
  G.integrity=Object.assign(G.integrity||{},{version:'95.2',worldSize:WORLD,picada21:{stop:{x:7550,y:2350},route:'picada21_route'},checkedAt:Date.now()});
  normalizeState();
  const dom={world:!!document.getElementById('world'),detail:!!document.getElementById('worldDetail'),toast:!!document.getElementById('missionToast'),interact:!!document.getElementById('interact'),quest:!!document.getElementById('questText')};
  const checks=[['world_size',V.world.w===WORLD.w&&V.world.h===WORLD.h],['geometry',!!V.worldGeometry],['canvas_world',dom.world],['canvas_detail',dom.detail],['mission_ui',dom.quest],['toast_ui',dom.toast],['interact_ui',dom.interact],['single_compositor',V.renderCompositor?.singleRAF===true],['missions',!!V.missions?.status&&Array.isArray(V.missions.list)],['vergel',!!V.vergel?.inspect&&!!V.vergel?.harvest],['picada21',G.points.some(p=>p.id==='picada21_stop')&&G.routes.some(r=>r.id==='picada21_route')],['state',!!V.gameState&&Number.isFinite(+V.gameState.x)&&Number.isFinite(+V.gameState.y)],['stability',V.stability?.version==='95.1']];
  const failed=checks.filter(c=>!c[1]).map(c=>c[0]);
  V.integrity={version:'95.2',ok:failed.length===0,failed,checks:Object.fromEntries(checks),dom,checkedAt:Date.now()};
  window.dispatchEvent(new CustomEvent('villa-pelon-integrity',{detail:V.integrity}));
  return V.integrity;
}
V.runIntegrity=validate;
window.addEventListener('villa-pelon-engine-ready',()=>setTimeout(validate,80),{once:true});
window.addEventListener('villa-pelon-world-ready',()=>setTimeout(validate,20),{once:true});
setTimeout(validate,1800);
})();
