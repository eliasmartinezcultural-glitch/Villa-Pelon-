/* VILLA PELÓN V138 — WORLD SEAL / AUDITORÍA FINAL
   Cierra la fase de creación mundial general.
   NO crea, mueve, corrige ni redimensiona geometría.
   Sólo verifica, congela contratos de lectura y deja preparada la base
   para que las próximas intervenciones sean MISIÓN + HISTORIA + ESTÉTICA.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={}),G=V.worldGeometry||{},S=V.gameState||(V.gameState={});
const Z=V.worldSeal=V.worldSeal||{};
Z.version='V138';
Z.status='SEALED';
Z.principle='world closed; missions, history and aesthetics remain extensible';
Z.allowedFutureLayers=['missions','story','dialogue','knowledge','quests','aesthetics','pixel-detail','audio'];
Z.forbiddenFutureLayers=['geometry','zone-redefinition','road-redefinition','river-redefinition','bridge-redefinition','building-placement','building-resize','world-size-change'];
function rect(o){return o&&Number.isFinite(+o.x)&&Number.isFinite(+o.y)&&Number.isFinite(+o.w)&&Number.isFinite(+o.h)}
function inside(p,r){return !!(p&&r&&+p.x>=+r.x&&+p.x<=+r.x+r.w&&+p.y>=+r.y&&+p.y<=+r.y+r.h)}
function overlap(a,b,p=0){return rect(a)&&rect(b)&&a.x-p<b.x+b.w+p&&a.x+a.w+p>b.x-p&&a.y-p<b.y+b.h+p&&a.y+a.h+p>b.y-p}
function audit(){
 const issues=[],warnings=[];
 const expected=[8200,4200];
 if(G.version!=='CANONICAL_MAP_1')issues.push('geometry-version');
 if(JSON.stringify(G.geometryContract?.worldSize||[])!==JSON.stringify(expected))issues.push('geometry-size');
 if(G.worldRules?.water?.crossing!=='bridge_only')issues.push('river-crossing-law');
 if(G.worldRules?.buildings?.neverOccupyRoads!==true)issues.push('building-road-law');
 if(G.worldRules?.buildings?.neverOccupyRiver!==true)issues.push('building-river-law');
 if(G.worldRules?.roads?.riverCrossingOnlyAtBridges!==true)issues.push('bridge-law');
 if(!V.geometryFloorLock?.locked)issues.push('geometry-lock');
 const geo=JSON.stringify({worldSize:[8200,4200],river:G.river,zones:G.zones,roads:G.roads,bridges:G.bridges,buildings:G.buildings,plaza:G.plaza,rules:G.worldRules});
 Z.geometryFingerprint=geo.length;
 const buildings=Array.isArray(G.buildings)?G.buildings:[],roads=Array.isArray(G.roads)?G.roads:[],bridges=Array.isArray(G.bridges)?G.bridges:[];
 buildings.forEach(b=>{if(!rect(b)||!inside({x:b.x,y:b.y}, {x:0,y:0,w:8200,h:4200})||!inside({x:b.x+b.w,y:b.y+b.h},{x:0,y:0,w:8200,h:4200}))issues.push('building-out-of-world:'+b.id);roads.forEach(r=>{if(overlap(b,r,18))issues.push('building-on-road:'+b.id+'>'+r.id)});if(overlap(b,G.river,18))issues.push('building-in-river:'+b.id)});
 for(let i=0;i<buildings.length;i++)for(let j=i+1;j<buildings.length;j++)if(overlap(buildings[i],buildings[j],18))issues.push('building-overlap:'+buildings[i].id+'>'+buildings[j].id);
 for(let i=0;i<bridges.length;i++)for(let j=i+1;j<bridges.length;j++)if(overlap(bridges[i],bridges[j],4))issues.push('bridge-overlap:'+bridges[i].id+'>'+bridges[j].id);
 const content=[...(V.worldContent?.elements||[]),...(V.livingWorld?.details||[])],ids=new Set();content.forEach(o=>{if(!o?.id)issues.push('content-without-id');else if(ids.has(o.id))issues.push('duplicate-content-id:'+o.id);else ids.add(o.id)});
 const missionIds=new Set((V.missions?.list||[]).map(m=>m.id));(V.missions?.list||[]).forEach(m=>{if(m.next&&!missionIds.has(m.next))issues.push('mission-next:'+m.id);(m.objectives||[]).forEach(o=>{if(!o.id||!o.type||!o.target)issues.push('mission-objective:'+m.id)})});
 const p=V.missionRuntime?.points||{};Object.entries(p).forEach(([id,q])=>{if(!Number.isFinite(+q.x)||!Number.isFinite(+q.y))issues.push('mission-point:'+id);else if(+q.x<0||+q.x>8200||+q.y<0||+q.y>4200)issues.push('mission-point-out:'+id)});
 const scripts=[...document.scripts].map(s=>s.src||'');const forbiddenLoaded=['architecture_contract_v99.js','integration_v90.js','integrity_v94.js','building_detail_v92.js'];forbiddenLoaded.forEach(name=>{if(scripts.some(s=>s.includes('/'+name)))issues.push('legacy-script-loaded:'+name)});
 if(V.villageLife?.singleTick!==true||V.villageLife?.saveAuthority!=='gameState')issues.push('life-contract');
 if(V.renderCompositor?.singleRAF!==true)issues.push('render-loop-contract');
 if(V.visualAuthority?.version!=='V132')issues.push('visual-contract');
 if(V.gameUnification?.version!=='V133')issues.push('action-contract');
 if(V.playableStory?.version!=='137.0')warnings.push('story-layer-not-v137');
 if((V.worldContent?.audit?.rejected||[]).length)issues.push('rejected-world-content');
 if((V.livingWorld?.audit?.rejected||[]).length)issues.push('rejected-living-content');
 return{ok:issues.length===0,issues,warnings,geometry:'CANONICAL_MAP_1',worldSize:[8200,4200],buildings:buildings.length,roads:roads.length,bridges:bridges.length,content:content.length,missions:V.missions?.list?.length||0,geometryLocked:!!V.geometryFloorLock?.locked,lifeSingleTick:!!V.villageLife?.singleTick,singleRAF:!!V.renderCompositor?.singleRAF};
}
Z.audit=audit();
V.systemIntegrity=V.systemIntegrity||{};
Object.assign(V.systemIntegrity,{version:'V138',phase:'WORLD_SEALED',geometryAuthority:'worldGeometry',geometryLock:'V124',lifeAuthority:'villageLife',visualAuthority:'visualAuthority',frameAuthority:'renderCompositor',actionAuthority:'gameUnification',storyAuthority:'playableStory',principle:Z.principle});
V.engine=V.engine||{};V.engine.health=V.engine.health||function(){return{ok:true}};V.engine.health.worldSeal=Z.audit;
window.dispatchEvent(new CustomEvent('villa-pelon-world-sealed',{detail:Z.audit}));
})();
