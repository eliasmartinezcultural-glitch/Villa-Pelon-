/* VILLA PELÓN — INTEGRITY GATE V95.3
   Autoridad final sobre referencias compartidas. No crea render ni loops.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const WORLD={w:8200,h:4200};
const PICADA={sign:{x:7500,y:2200},area:{x:7550,y:2250},stop:{x:7550,y:2350}};
function uniquePoints(G){
  if(!Array.isArray(G.points))G.points=[];
  const seen=new Set();
  G.points=G.points.filter(p=>p&&p.id&&Number.isFinite(+p.x)&&Number.isFinite(+p.y)&&!seen.has(p.id)&&(seen.add(p.id),true));
}
function ensurePoint(G,id,data){
  const i=G.points.findIndex(p=>p?.id===id);
  if(i<0)G.points.push({id,...data});
  else G.points[i]=Object.assign({},G.points[i],{id,...data});
}
function ensureRoute(G){
  if(!Array.isArray(G.routes))G.routes=[];
  const route={id:'picada21_route',label:'CAMINO RURAL A PICADA 21',points:[{x:4580,y:2120},{x:5400,y:2120},{x:6500,y:2120},{x:7550,y:2120},{x:7900,y:2120}],width:150,type:'rural_road'};
  const i=G.routes.findIndex(r=>r?.id==='picada21_route');
  if(i<0)G.routes.push(route);else G.routes[i]=route;
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
  ensurePoint(G,'picada21_sign',{x:PICADA.sign.x,y:PICADA.sign.y,label:'PICA. 21 →',type:'road_sign'});
  ensurePoint(G,'picada21_stop',{x:PICADA.stop.x,y:PICADA.stop.y,label:'PARADA PICADA 21',type:'bus_stop'});
  ensurePoint(G,'picada21_area',{x:PICADA.area.x,y:PICADA.area.y,label:'PICADA 21',type:'mission_area'});
  ensurePoint(G,'picada21_checkpoint',{x:6500,y:2185,label:'Cruce rural',type:'landmark'});
  ensureRoute(G);
  G.integrity=Object.assign(G.integrity||{},{version:'95.3',worldSize:WORLD,picada21:{sign:PICADA.sign,area:PICADA.area,stop:PICADA.stop,route:'picada21_route'},checkedAt:Date.now()});
  normalizeState();
  const dom={world:!!document.getElementById('world'),detail:!!document.getElementById('worldDetail'),toast:!!document.getElementById('missionToast'),interact:!!document.getElementById('interact'),quest:!!document.getElementById('questText'),legacyDetail:!!document.getElementById('detailLayer')};
  const checks=[
    ['world_size',V.world.w===WORLD.w&&V.world.h===WORLD.h],
    ['geometry',!!V.worldGeometry],
    ['canvas_world',dom.world],
    ['canvas_detail',dom.detail],
    ['no_legacy_detail_layer',!dom.legacyDetail],
    ['mission_ui',dom.quest],
    ['toast_ui',dom.toast],
    ['interact_ui',dom.interact],
    ['single_compositor',V.renderCompositor?.singleRAF===true],
    ['missions',!!V.missions?.status&&Array.isArray(V.missions.list)],
    ['vergel',!!V.vergel?.inspect&&!!V.vergel?.harvest],
    ['picada21',G.points.some(p=>p.id==='picada21_stop'&&+p.x===PICADA.stop.x&&+p.y===PICADA.stop.y)&&G.routes.some(r=>r.id==='picada21_route'&&Array.isArray(r.points)&&r.points.at(-1)?.x===7900)],
    ['state',!!V.gameState&&Number.isFinite(+V.gameState.x)&&Number.isFinite(+V.gameState.y)],
    ['stability',V.stability?.version==='95.1']
  ];
  const failed=checks.filter(c=>!c[1]).map(c=>c[0]);
  V.integrity={version:'95.3',ok:failed.length===0,failed,checks:Object.fromEntries(checks),dom,checkedAt:Date.now()};
  window.dispatchEvent(new CustomEvent('villa-pelon-integrity',{detail:V.integrity}));
  return V.integrity;
}
V.runIntegrity=validate;
window.addEventListener('villa-pelon-engine-ready',()=>setTimeout(validate,80),{once:true});
window.addEventListener('villa-pelon-world-ready',()=>setTimeout(validate,20),{once:true});
setTimeout(validate,1800);
})();
