/* VILLA PELÓN V136 — AUDITORÍA PROFUNDA + HISTORIA VIVA
   Consolida lo construido sin tocar la geometría canónica.
   Principio: contenido y aprendizaje crecen; el mapa no cambia.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={}),G=V.worldGeometry||{},S=V.gameState||(V.gameState={}),M=V.missions||{};
const W=V.worldStory=V.worldStory||{};W.version='136.0';W.principle='una historia continua sobre una geografia inmutable';
W.chapters=[
{id:'PUEBLO',label:'Pueblo',learn:['identidad','territorio']},
{id:'MEMORIA',label:'Memoria',learn:['memoria','fuentes']},
{id:'IDENTIDAD',label:'Identidad',learn:['toponimia','identidad']},
{id:'COMUNIDAD',label:'Comunidad',learn:['comunidad','convivencia']},
{id:'EDUCACIÓN',label:'Educación',learn:['escuela','memoria']},
{id:'TERRITORIO',label:'Territorio',learn:['riego','rio','puentes']},
{id:'PRODUCCIÓN',label:'Producción',learn:['produccion','trabajo']},
{id:'INVESTIGACIÓN',label:'Investigación',learn:['fuentes','contraste','metodo']},
{id:'HISTORIA',label:'Historia',learn:['cronologia','fundacion']},
{id:'TRABAJO',label:'Trabajo',learn:['trabajo_rural']},
{id:'CARTOGRAFÍA',label:'Cartografía',learn:['cartografia','territorio']},
{id:'EXPLORACIÓN',label:'Exploración',learn:['territorio']}
];
function ensure(){S.storyState=S.storyState&&typeof S.storyState==='object'?S.storyState:{};S.storyState.completed=Array.isArray(S.storyState.completed)?S.storyState.completed:[];S.storyState.knowledge=S.storyState.knowledge&&typeof S.storyState.knowledge==='object'?S.storyState.knowledge:{};S.storyState.chapter=S.storyState.chapter||'PUEBLO';S.storyState.sequence=Number.isFinite(+S.storyState.sequence)?+S.storyState.sequence:0;return S.storyState}
function refresh(){const s=ensure(),m=M.current?M.current(S):null;if(m){s.chapter=m.chapter||s.chapter;s.currentMission=m.id;s.currentTitle=m.title;s.currentDescription=m.description;s.sequence=S.missionHistory?.length||0}Object.keys(S.knowledge||{}).forEach(k=>s.knowledge[k]=true);return s}
function recordMission(m){if(!m)return;const s=ensure();if(!s.completed.some(x=>x.id===m.id))s.completed.push({id:m.id,chapter:m.chapter,title:m.title,day:+S.day||1});refresh();window.dispatchEvent(new CustomEvent('villa-pelon-story-progress',{detail:{chapter:s.chapter,mission:m.id,knowledge:s.knowledge}}))}
const oldComplete=M.completeStep;if(typeof oldComplete==='function'&&!M.__v136StoryWrapped){M.completeStep=function(state,key){const before=M.current?M.current(state):null,r=oldComplete(state,key);if(r&&r.complete)recordMission(before);else refresh();return r};M.__v136StoryWrapped=true}
W.current=()=>refresh();W.progress=()=>{const s=refresh();return{chapter:s.chapter,currentMission:s.currentMission,currentTitle:s.currentTitle,completed:s.completed.length,knowledge:Object.keys(s.knowledge).length}}
W.actionFor=(o)=>{if(!o)return null;return{type:o.action||'observe',verb:(V.gameUnification?.actionDefs||{})[o.action||'observe']||'reconocer el territorio',target:o.id,label:o.use||o.type}}
function audit(){const zones=Array.isArray(G.zones)?G.zones:[],roads=Array.isArray(G.roads)?G.roads:[],buildings=Array.isArray(G.buildings)?G.buildings:[],content=V.worldContent?.elements||[],details=V.livingWorld?.details||[];const duplicateIds=[];const seen=new Set();[...content,...details].forEach(o=>{if(seen.has(o.id))duplicateIds.push(o.id);seen.add(o.id)});const badDetails=V.livingWorld?.audit?.rejected||[];const animals=V.peopleVehicles?.animals||[],vehicles=V.peopleVehicles?.vehicleData||[];const animalOut=animals.filter(a=>{const b=a.bounds||{};return b.minX<3000||b.maxX>8200||b.minY<0||b.maxY>4200});const vehicleOff=vehicles.filter(v=>!v.route||!v.routeId);const issues=[];if(!G.version)issues.push('geometry-missing');if(!V.worldLock?.version&& !V.geometryFloorLock)issues.push('geometry-lock-missing');if(V.visualAuthority?.version!=='V132')issues.push('visual-authority');if(V.villageLife?.singleTick!==true)issues.push('life-authority');if(badDetails.length)issues.push('invalid-living-details');if(duplicateIds.length)issues.push('duplicate-content-ids');if(animalOut.length)issues.push('animal-contract');if(vehicleOff.length)issues.push('vehicle-route-contract');return{ok:issues.length===0,issues,zones:zones.length,roads:roads.length,buildings:buildings.length,content:content.length,livingDetails:details.length,duplicates:duplicateIds,animalOut:animalOut.length,vehicleOff:vehicleOff.length,missionCount:M.list?.length||0,chapter:refresh().chapter,knowledge:Object.keys(S.knowledge||{}).length,principle:W.principle}}
W.audit=audit();V.systemIntegrity=V.systemIntegrity||{};V.systemIntegrity.version='V136';V.systemIntegrity.storyAuthority='worldStory';V.systemIntegrity.auditDeep=W.audit;V.engine=V.engine||{};V.engine.health=V.engine.health||function(){return{ok:true}};V.engine.health.worldStory=W.audit;
window.addEventListener('villa-pelon-mission',e=>{if(e.detail?.mission)refresh()});window.addEventListener('villa-pelon-action',e=>{const s=ensure();s.lastAction=e.detail||null;s.actionCount=(s.actionCount||0)+1});refresh();window.dispatchEvent(new CustomEvent('villa-pelon-story-ready',{detail:W.audit}));
})();