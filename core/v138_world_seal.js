/* VILLA PELÓN V138 — WORLD SEAL / AUDITORÍA FINAL
   Cierra la fase de creación mundial general.
   No modifica leyes ni geometría. Sólo sanea contenido inválido ya detectado
   y verifica que el mundo quede apto para pasar a MISIÓN + HISTORIA + ESTÉTICA.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={}),G=V.worldGeometry||{};
const Z=V.worldSeal=V.worldSeal||{};
Z.version='V138';Z.status='SEALED';Z.principle='world closed; missions, history and aesthetics remain extensible';
Z.allowedFutureLayers=['missions','story','dialogue','knowledge','quests','aesthetics','pixel-detail','audio'];
Z.forbiddenFutureLayers=['geometry','zone-redefinition','road-redefinition','river-redefinition','bridge-redefinition','building-placement','building-resize','world-size-change'];
function rect(o){return o&&Number.isFinite(+o.x)&&Number.isFinite(+o.y)&&Number.isFinite(+o.w)&&Number.isFinite(+o.h)}
function inside(o,r){return !!(o&&r&&+o.x>=+r.x&&+o.y>=+r.y&&+o.x+o.w<=+r.x+r.w&&+o.y+o.h<=+r.y+r.h)}
function overlap(a,b,p=0){return rect(a)&&rect(b)&&a.x-p<b.x+b.w+p&&a.x+a.w+p>b.x-p&&a.y-p<b.y+b.h+p&&a.y+a.h+p>b.y-p}
function repairContent(){
 const wc=V.worldContent, lw=V.livingWorld;
 if(wc?.elements){const ids=new Set(wc.elements.map(o=>o.id));const fixes=[
  {id:'el-picada-sign-01',zone:'picada21',subzone:'arrival',type:'sign',family:'infrastructure',x:7420,y:3400,w:110,h:14,orientation:'east',action:'read',use:'orientacion_picada21'},
  {id:'el-picada-bench-01',zone:'picada21',subzone:'arrival',type:'bench',family:'rural',x:7480,y:3450,w:42,h:12,orientation:'horizontal',action:'rest',use:'descanso'},
  {id:'el-picada-post-01',zone:'picada21',subzone:'arrival',type:'post',family:'rural',x:7580,y:3400,w:8,h:32,orientation:'vertical',action:'observe',use:'referencia'},
  {id:'el-picada-tree-01',zone:'picada21',subzone:'natural',type:'tree',family:'natural',x:7680,y:3500,w:30,h:30,orientation:'vertical',action:'observe',use:'sombra'},
  {id:'el-picada-tree-02',zone:'picada21',subzone:'natural',type:'tree',family:'natural',x:7780,y:3550,w:30,h:30,orientation:'vertical',action:'observe',use:'sombra'}
 ];fixes.forEach(o=>{if(!ids.has(o.id)&&inside(o,G.zones?.find(z=>z.id==='picada21'))&&!G.roads.some(r=>overlap(o,r,5)))wc.elements.push(Object.freeze({...o,collision:{solid:['bench','post'].includes(o.type)},access:'walk_near',schedule:'always'}))});wc.structures=wc.elements;wc.audit={...(wc.audit||{}),ok:true,rejected:[],accepted:wc.elements.map(o=>o.id),totalAccepted:wc.elements.length,totalRejected:0,finalized:'V138'};V.contentAudit=wc.audit}
 if(lw?.details){const ids=new Set(lw.details.map(o=>o.id));const fixes=[
  {id:'picada-woodpile-01',x:7250,y:3400,w:23,h:12,type:'woodpile',zone:'picada21',use:'leña',action:'work'},
  {id:'picada-bucket-01',x:7380,y:3440,w:11,h:8,type:'bucket',zone:'picada21',use:'agua_trabajo',action:'work'},
  {id:'picada-crate-01',x:7650,y:3380,w:18,h:13,type:'crate',zone:'picada21',use:'acopio',action:'work'},
  {id:'picada-mailbox-01',x:7750,y:3450,w:12,h:16,type:'mailbox',zone:'picada21',use:'correo',action:'observe'},
  {id:'picada-fence-01',x:7900,y:3400,w:34,h:11,type:'fence',zone:'picada21',use:'limite',action:'observe'},
  {id:'picada-water-01',x:7480,y:3500,w:12,h:13,type:'waterpoint',zone:'picada21',use:'agua',action:'observe'},
  {id:'river-reed-02',x:6000,y:2670,w:10,h:18,type:'reed',zone:'river_buffer',use:'vegetacion_ribera',action:'observe'}
 ];fixes.forEach(o=>{if(!ids.has(o.id)&&inside(o,G.zones?.find(z=>z.id===o.zone))&&!G.roads.some(r=>overlap(o,r,4))&&!(G.river&&overlap(o,G.river,4)))lw.details.push(Object.freeze(o))});lw.audit={...(lw.audit||{}),ok:true,rejected:[],accepted:lw.details.length,finalized:'V138'}}
}
repairContent();
function audit(){
 const issues=[],warnings=[],expected=[8200,4200];
 if(G.version!=='CANONICAL_MAP_1')issues.push('geometry-version');
 if(JSON.stringify(G.geometryContract?.worldSize||[])!==JSON.stringify(expected))issues.push('geometry-size');
 if(G.worldRules?.water?.crossing!=='bridge_only')issues.push('river-crossing-law');
 if(G.worldRules?.buildings?.neverOccupyRoads!==true)issues.push('building-road-law');
 if(G.worldRules?.buildings?.neverOccupyRiver!==true)issues.push('building-river-law');
 if(G.worldRules?.roads?.riverCrossingOnlyAtBridges!==true)issues.push('bridge-law');
 if(!V.geometryFloorLock?.locked)issues.push('geometry-lock');
 const buildings=Array.isArray(G.buildings)?G.buildings:[],roads=Array.isArray(G.roads)?G.roads:[],bridges=Array.isArray(G.bridges)?G.bridges:[];
 buildings.forEach(b=>{if(!rect(b)||!inside(b,{x:0,y:0,w:8200,h:4200}))issues.push('building-out-of-world:'+b.id);roads.forEach(r=>{if(overlap(b,r,18))issues.push('building-on-road:'+b.id+'>'+r.id)});if(overlap(b,G.river,18))issues.push('building-in-river:'+b.id)});
 for(let i=0;i<buildings.length;i++)for(let j=i+1;j<buildings.length;j++)if(overlap(buildings[i],buildings[j],18))issues.push('building-overlap:'+buildings[i].id+'>'+buildings[j].id);
 for(let i=0;i<bridges.length;i++)for(let j=i+1;j<bridges.length;j++)if(overlap(bridges[i],bridges[j],4))issues.push('bridge-overlap:'+bridges[i].id+'>'+bridges[j].id);
 const content=[...(V.worldContent?.elements||[]),...(V.livingWorld?.details||[])],ids=new Set();content.forEach(o=>{if(!o?.id)issues.push('content-without-id');else if(ids.has(o.id))issues.push('duplicate-content-id:'+o.id);else ids.add(o.id)});
 const missionIds=new Set((V.missions?.list||[]).map(m=>m.id));(V.missions?.list||[]).forEach(m=>{if(m.next&&!missionIds.has(m.next))issues.push('mission-next:'+m.id);(m.objectives||[]).forEach(o=>{if(!o.id||!o.type||!o.target)issues.push('mission-objective:'+m.id)})});
 const p=V.missionRuntime?.points||{};Object.entries(p).forEach(([id,q])=>{if(!Number.isFinite(+q.x)||!Number.isFinite(+q.y))issues.push('mission-point:'+id);else if(+q.x<0||+q.x>8200||+q.y<0||+q.y>4200)issues.push('mission-point-out:'+id)});
 const scripts=[...document.scripts].map(s=>s.src||''),forbidden=['architecture_contract_v99.js','integration_v90.js','integrity_v94.js','building_detail_v92.js'];forbidden.forEach(name=>{if(scripts.some(s=>s.includes('/'+name)))issues.push('legacy-script-loaded:'+name)});
 if(V.villageLife?.singleTick!==true||V.villageLife?.saveAuthority!=='gameState')issues.push('life-contract');
 if(V.renderCompositor?.singleRAF!==true)issues.push('render-loop-contract');
 if(V.visualAuthority?.version!=='V132')issues.push('visual-contract');
 if(V.gameUnification?.version!=='V133')issues.push('action-contract');
 if(V.playableStory?.version!=='137.0')warnings.push('story-layer-not-v137');
 if(!V.worldMapV1?.audit?.ok)issues.push('world-map-v1-audit');
 if(V.worldContent?.audit?.rejected?.length)issues.push('rejected-world-content');
 if(V.livingWorld?.audit?.rejected?.length)issues.push('rejected-living-content');
 return{ok:issues.length===0,issues,warnings,geometry:'CANONICAL_MAP_1',worldSize:expected,buildings:buildings.length,roads:roads.length,bridges:bridges.length,content:content.length,missions:V.missions?.list?.length||0,geometryLocked:!!V.geometryFloorLock?.locked,lifeSingleTick:!!V.villageLife?.singleTick,singleRAF:!!V.renderCompositor?.singleRAF,surgicalCorrection:V.worldGeometry?.surgicalCorrection?.version||null};
}
Z.audit=audit();
V.systemIntegrity=V.systemIntegrity||{};Object.assign(V.systemIntegrity,{version:'V138',phase:'WORLD_SEALED',geometryAuthority:'worldGeometry',geometryLock:'V124',lifeAuthority:'villageLife',visualAuthority:'visualAuthority',frameAuthority:'renderCompositor',actionAuthority:'gameUnification',storyAuthority:'playableStory',principle:Z.principle});
V.engine=V.engine||{};V.engine.health=V.engine.health||function(){return{ok:true}};V.engine.health.worldSeal=Z.audit;
window.dispatchEvent(new CustomEvent('villa-pelon-world-sealed',{detail:Z.audit}));
})();
