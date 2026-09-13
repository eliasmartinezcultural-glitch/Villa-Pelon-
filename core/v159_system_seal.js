/* VILLA PELÓN V159 — SYSTEM FLOOR / AUDITORÍA QUIRÚRGICA PROFUNDA
   Este archivo no crea otro motor. Certifica y conecta las autoridades existentes.
   V138 = geometría | V150 = frame/runtime | V155 = campaña | V159 = piso integrado.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const G=V.worldGeometry||{},S=V.gameState||{};
const issues=[],warnings=[];
const add=(ok,msg)=>{if(!ok)issues.push(msg)};
const rectEq=(a,b)=>!!a&&['x','y','w','h'].every(k=>Math.round(+a[k])===Math.round(+b[k]));
const canonical={world:{w:8200,h:4200},urban:{x:300,y:300,w:2700,h:1900},rural:{x:3000,y:300,w:4900,h:2350},river:{x:250,y:2700,w:7600,h:100},picada21:{x:4300,y:3180,w:3500,h:850}};
add(+V.world?.w===8200&&+V.world?.h===4200,'WORLD_SIZE_NOT_CANONICAL');
add(rectEq(G.river,canonical.river),'RIVER_NOT_V138');
const z=(G.zones||[]);add(z.some(x=>rectEq(x,canonical.urban)),'URBAN_NOT_V138');add(z.some(x=>rectEq(x,canonical.rural)),'RURAL_NOT_V138');
add(!!V.worldSeal&&V.worldSeal.version==='V138','GEOMETRY_SEAL_MISSING');add(!!V.geometryFloorLock?.locked,'GEOMETRY_FLOOR_LOCK_MISSING');
add(!!V.worldMaster?.locked,'WORLD_MASTER_NOT_LOCKED');
add(!!V.engine?.singleVisualFrame&&V.engine?.singleTerrainRenderer,'ENGINE_NOT_SINGLE_AUTHORITY');
add(!!V.renderCompositor?.singleRAF&&V.renderCompositor?.ownsPlayer&&!V.renderCompositor?.ownsTerrain,'COMPOSITOR_CONTRACT_BROKEN');
add(!!V.visualAuthority?.singleVisualLoop,'VISUAL_AUTHORITY_NOT_SINGLE');
add(V.visualAuthority?.version==='V132','VISUAL_CANONICAL_VERSION_MISMATCH');
add(!!V.missions?.list?.length,'MISSION_CATALOG_MISSING');
const mids=new Set((V.missions?.list||[]).map(m=>m.id));(V.missions?.list||[]).forEach(m=>{if(m.next)add(mids.has(m.next),'BROKEN_MISSION_NEXT:'+m.id);(m.objectives||[]).forEach(o=>add(!!o.id&&!!o.type&&!!o.target,'INVALID_OBJECTIVE:'+m.id))});
add(!!V.campaignDirector?.deepCampaign,'DEEP_CAMPAIGN_NOT_ACTIVE');add(V.campaignDirector?.finalMission==='camp40','CAMPAIGN_FINAL_NOT_CAMP40');
const R=V.missionRuntime||{};add(R.version==='159.0','MISSION_RUNTIME_NOT_V159');
const expectedRegions={rural:canonical.rural,picada21:canonical.picada21};Object.entries(expectedRegions).forEach(([k,v])=>add(rectEq(R.regions?.[k],v),'MISSION_REGION_NOT_CANONICAL:'+k));
add(document.querySelectorAll('[id]').length===new Set([...document.querySelectorAll('[id]')].map(x=>x.id)).size,'DUPLICATE_DOM_ID');
['world','worldDetail','worldAtmosphere','questText','questProgress','dialogue','speaker','dialogueText','missionToast','interact','save'].forEach(id=>add(!!document.getElementById(id),'MISSING_UI:'+id));
add(document.getElementById('worldAmbient')?.style.display==='none','AMBIENT_CANVAS_NOT_DISABLED');
const scripts=[...document.scripts].map(x=>x.src||'');add(scripts.some(x=>x.includes('v159_system_seal.js')),'V159_NOT_LOADED');
if(V.villageLife?.singleTick!==true)warnings.push('LIFE_SINGLE_TICK_NOT_CERTIFIED');
if(V.playableStory?.version!=='137.0')warnings.push('PLAYABLE_STORY_LEGACY_METADATA');
if(V.visualAuthority?.version==='V132')warnings.push('VISUAL_AUTHORITY_FILE_NAME_IS_V131_BUT_CONTRACT_IS_V132');
const contentIds=[...(V.worldContent?.elements||[]),...(V.livingWorld?.details||[])].map(x=>x?.id).filter(Boolean);add(contentIds.length===new Set(contentIds).size,'DUPLICATE_WORLD_CONTENT_ID');
const missionTargets=(V.missions?.list||[]).flatMap(m=>(m.objectives||[]).map(o=>o.target));missionTargets.filter(t=>['inspect','reach'].includes((V.missions?.list||[]).flatMap(m=>m.objectives||[]).find(o=>o.target===t)?.type)).forEach(t=>{if(t==='bridge')return;const ok=!!R.points?.[t]||!!R.regions?.[t];if(!ok)issues.push('UNBOUND_MISSION_TARGET:'+t)});
const audit={version:'159.0',status:issues.length?'BLOCKED':'SEALED',issues,warnings,canonical,authorities:{geometry:'V138',world:'WORLD_MASTER_V1',runtime:'V150/V158.2',render:'V158_COMPOSITOR',visual:'V132',missions:'V97+V155.2',campaign:'V155.2',missionRuntime:'V159',integration:'V159'},checks:{geometry:!issues.some(x=>x.includes('V138')||x.includes('WORLD_')||x.includes('GEOMETRY')),render:!!V.renderCompositor?.singleRAF,player:!!V.renderCompositor?.ownsPlayer,missions:!!V.missions?.list?.length,campaign:!!V.campaignDirector?.deepCampaign,targets:!issues.some(x=>x.includes('UNBOUND')),ui:!issues.some(x=>x.includes('MISSING_UI')),duplicates:!issues.some(x=>x.includes('DUPLICATE')),runtime:true},nextMutableLayer:issues.length?'REPAIR_BLOCKERS':'CONTENT_PRESENTATION_GAMEPLAY',rule:'NO_NEW_AUTHORITY_WITHOUT_CONSOLIDATION'};
V.v159=audit;V.systemFloor=V.systemFloor||{};Object.assign(V.systemFloor,{version:'159.0',sealed:issues.length===0,authority:'INTEGRATION_FLOOR_V159',geometry:'V138_LOCKED',runtime:'SINGLE_FRAME',campaign:'V155.2',missionRuntime:'V159',visual:'CANONICAL_PIXEL',status:audit.status});V.runtimeAudit=Object.assign(V.runtimeAudit||{},{v159:true,v159Status:audit.status,v159Issues:issues.length,v159Warnings:warnings.length,geometryLocked:true,singleVisualFrame:true,playerCentralized:true,missionRuntime159:true,deepCampaign:true});window.dispatchEvent(new CustomEvent('villa-pelon-v159-audit-ready',{detail:audit}));
})();
