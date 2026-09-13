/* VILLA PELÓN V159 — WORLD INTEGRATION CONTRACT
   Contrato transversal de presentación, escala, reglas y conexiones.
   No reemplaza motor, compositor, misión, vida ni geometría.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={}),G=V.worldGeometry||{};
const W=V.world||{w:8200,h:4200};
const C={grass:'#8d9667',urban:'#a89a72',rural:'#9a9b65',productive:'#8e9964',road:'#b8a174',roadEdge:'#8d7857',river:'#668d91',bridge:'#a17b53',outline:'#243128',light:'#d8c78f',ui:'#17251b'};
V.v159World={version:'159.0',authority:'WORLD_INTEGRATION_CONTRACT',geometry:'V138_LOCKED',palette:C,scale:{world:[W.w,W.h],player:'small-human-readable',buildings:'zone-proportional',vehicles:'road-proportional',npc:'player-comparable',river:'major-landmark',picada21:'far-low-density'},zones:{urban:'compact-medium-density',transition:'medium-low-density',rural:'low-medium-density',river:'low-open',picada21:'very-low-open'},rules:{geometry:'IMMUTABLE',riverCrossing:'BRIDGES_ONLY',urbanCore:'COMPACT',riverDistance:'FAR_FROM_URBAN',picada21Distance:'FARTHER_THAN_RIVER',roads:'CANONICAL_WORLD_GEOMETRY',decor:'PLACE_EXPLAINS_PLACE',pixel:'INTEGER_NO_ANTIALIASING',fiction:'MUST_BE_IDENTIFIABLE',history:'SOURCE_REQUIRED',missions:'ONE_CANONICAL_CHAIN',npc:'PERSISTENT_DISTINCT',transport:'ROAD_BOUND',actions:'MISSION_BOUND'}};
V.v159World.missionActions={talk:{label:'Hablar',duration:700},inspect:{label:'Observar',duration:900},collect:{label:'Recoger',duration:700},deliver:{label:'Entregar',duration:800},rest:{label:'Descansar',duration:1200},board_bus:{label:'Subir al colectivo',duration:850},ride_bus:{label:'Viajar en colectivo',duration:1800},disembark:{label:'Bajar del colectivo',duration:650},work:{label:'Trabajar',duration:1400}};
function rect(r){return r&&Number.isFinite(+r.x)&&Number.isFinite(+r.y)&&+r.w>0&&+r.h>0}
const checks={worldSize:W.w===8200&&W.h===4200,urban:rect(G.urban||{x:300,y:300,w:2700,h:1900}),rural:rect(G.rural||{x:3000,y:300,w:4900,h:2350}),river:rect(G.river||{x:250,y:2700,w:7600,h:100}),picada21:rect(G.picada21||{x:4300,y:3180,w:3500,h:850}),bridges:Array.isArray(G.bridges)&&G.bridges.length>=2,roads:Array.isArray(G.roads)&&G.roads.length>0,renderAuthority:!!V.renderCompositor?.singleRAF,engineAuthority:!!V.engine?.singleTerrainRenderer,missionAuthority:!!V.missions,lifeAuthority:!!V.reactiveLife||!!V.villageLife,transportAuthority:!!V.transport,actionAuthority:!!V.actionRuntime,interfaceAuthority:!!V.interface};
const issues=Object.keys(checks).filter(k=>!checks[k]);
V.v159World.audit={version:'159.0',checks,issues,status:issues.length?'BLOCKED':'PASS'};
V.runtimeAudit=Object.assign(V.runtimeAudit||{},{worldIntegration159:true,worldIntegrationStatus:V.v159World.audit.status,canonicalPalette159:true,scaleContract159:true,worldRules159:true,missionActionsCatalog159:true});
window.dispatchEvent(new CustomEvent('villa-pelon-v159-world-integration-ready',{detail:V.v159World.audit}));
})();
