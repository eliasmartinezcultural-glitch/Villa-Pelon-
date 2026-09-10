/* VILLA PELÓN — FUNCTIONAL HEALTHCHECK V95.3 */
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
function overlap(a,b,pad=0){return a.x<b.x+b.w+pad&&a.x+a.w>b.x-pad&&a.y<b.y+b.h+pad&&a.y+a.h>b.y-pad}
function run(){const G=V.worldGeometry||{},S=V.gameState||{},M=V.missions||{},B=Array.isArray(G.buildings)?G.buildings:[],R=Array.isArray(G.roads)?G.roads:[];const checks=[];
checks.push(['canvas',!!document.getElementById('world')]);checks.push(['renderOverlay',!!document.getElementById('worldDetail')&&!!V.renderCompositor?.singleRAF]);checks.push(['gameState',!!V.gameState&&typeof S.x==='number'&&typeof S.y==='number']);checks.push(['engine',!!V.engine]);checks.push(['world',V.world?.w===8200&&V.world?.h===4200]);
checks.push(['npc',Array.isArray(V.npcs)&&V.npcs.length>=7]);checks.push(['vehicles',!!V.peopleVehicles&&V.peopleVehicles.vehicles>=9]);checks.push(['people',!!V.peopleVehicles&&V.peopleVehicles.people>=18]);checks.push(['no_npc_overlay',V.peopleVehicles?.npcOverlay===false]);
checks.push(['distinct_buildings',B.some(b=>b.type==='hospital')&&B.some(b=>b.type==='library')&&B.some(b=>b.type==='municipality')&&B.some(b=>b.type==='fire_station')]);
checks.push(['missions',Array.isArray(M.list)&&M.list.some(x=>x.id==='picada21_intro')&&M.list.some(x=>x.id==='free_explore')]);
checks.push(['vergel',!!V.vergel&&typeof V.vergel.harvest==='function'&&typeof V.vergel.inspect==='function']);checks.push(['picada21',!!G.points?.some?.(p=>p.id==='picada21_stop')]);
const badBuildings=B.filter(b=>R.some(r=>overlap(b,r,0))).map(b=>b.label);checks.push(['no_building_on_road',badBuildings.length===0,badBuildings]);
let saveOk=false;try{const key='villa_pelon_healthcheck';localStorage.setItem(key,JSON.stringify({ok:true,t:Date.now()}));saveOk=JSON.parse(localStorage.getItem(key)).ok===true;localStorage.removeItem(key)}catch(_){saveOk=false}checks.push(['localStorage',saveOk]);
checks.push(['stability',V.stability?.version==='95.1'&&typeof V.stability?.normalize==='function']);
checks.push(['integrity',V.integrity?.version==='95.2'&&Array.isArray(V.integrity?.failed)]);
const failed=checks.filter(c=>!c[1]);V.health={version:'95.3',ok:failed.length===0,failed:failed.map(c=>c[0]),checkedAt:Date.now(),details:checks};
if(failed.length)console.error('[Villa Pelón HEALTHCHECK]',V.health);else console.info('[Villa Pelón HEALTHCHECK] OK',V.health);window.dispatchEvent(new CustomEvent('villa-pelon-health',{detail:V.health}));return V.health}
window.addEventListener('villa-pelon-engine-ready',()=>setTimeout(run,120),{once:true});setTimeout(()=>{if(V.gameState?.started)run()},2200);V.runHealthcheck=run;
})();
