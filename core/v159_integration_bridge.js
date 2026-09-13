/* VILLA PELÓN V159 — INTEGRATION BRIDGE
   Una capa de conexión, no un segundo motor.
   Objetivo: que menú, mapa, intro, transporte, acciones y misiones hablen con las autoridades existentes.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={}),S=V.gameState||(V.gameState={}),M=V.missions||{};
const B=V.v159Bridge={version:'159.0',authority:'INTEGRATION_BRIDGE',sealedContract:true,issues:[],tests:[],transport:{},actions:{}};
const emit=(name,detail)=>window.dispatchEvent(new CustomEvent(name,{detail:detail||{}}));
const toast=t=>{const e=document.getElementById('missionToast');if(!e)return;e.textContent=t;e.classList.add('show');clearTimeout(B.toastTimer);B.toastTimer=setTimeout(()=>e.classList.remove('show'),2200)};
function pause(){S.paused=true;emit('villa-pelon-pause',{source:'menu'});return true}
function resume(){S.paused=false;emit('villa-pelon-resume',{source:'menu'});return true}
function togglePause(){return S.paused?resume():pause()}
function objective(){return M.objective?M.objective(S):null}
function complete(key){const r=M.completeStep?.(S,key);if(!r)return false;toast(r.complete?'MISIÓN COMPLETADA':'OBJETIVO COMPLETADO');emit('villa-pelon-mission',{detail:r,source:'v159-bridge'});return true}
function ride(vehicle){if(!vehicle)return false;const o=objective();if(!o||o.type!=='transport')return false;S.transport=S.transport||{};S.transport.mode=vehicle.type||'bus';S.transport.vehicleId=vehicle.id||null;S.transport.active=true;S.transport.startedAt=performance.now();if(o.target)complete('transport:'+o.target);emit('villa-pelon-transport-start',{vehicle,objective:o});return true}
function disembark(){if(!S.transport?.active)return false;const id=S.transport.vehicleId;S.transport.active=false;S.transport.mode='walk';emit('villa-pelon-transport-end',{vehicleId:id});return true}
function specialAction(id,payload={}){const o=objective();if(!o||o.type!=='action'||o.target!==id)return false;S.actionFlags=S.actionFlags||{};S.actionFlags[id]=true;complete('action:'+id);emit('villa-pelon-mission-action',{id,payload,objective:o});return true}
B.pause=pause;B.resume=resume;B.togglePause=togglePause;B.ride=ride;B.disembark=disembark;B.specialAction=specialAction;
V.engine=V.engine||{};if(typeof V.engine.pause!=='function')V.engine.pause=pause;if(typeof V.engine.resume!=='function')V.engine.resume=resume;
V.transport=V.transport||{};Object.assign(V.transport,{version:'159.0',authority:'V159_BRIDGE',ride,disembark,isRiding:()=>!!S.transport?.active});
V.missionActions=V.missionActions||{};V.missionActions.do=specialAction;
const tests=[
 ['state','gameState existe',()=>!!V.gameState],
 ['missions','misiones conectadas',()=>!!V.missions?.list?.length&&typeof V.missions.completeStep==='function'],
 ['geometry','geometría V138',()=>V.worldSeal?.version==='V138'],
 ['render','compositor único',()=>V.renderCompositor?.singleRAF===true&&V.renderCompositor?.ownsPlayer===true],
 ['runtime','runtime único',()=>V.engine?.singleVisualFrame===true],
 ['missionRuntime','runtime misión V159',()=>V.missionRuntime?.version==='159.0'],
 ['intro','intro registrada',()=>!!V.ui?.intro],
 ['pause','pausa del motor',()=>typeof V.engine?.pause==='function'&&typeof V.engine?.resume==='function'],
 ['transport','transporte conectado',()=>typeof V.transport?.ride==='function'],
 ['actions','acciones de misión',()=>typeof V.missionActions?.do==='function']
];
B.runSelfTest=()=>{B.tests=tests.map(t=>{let ok=false,error='';try{ok=!!t[2]()}catch(e){error=String(e)}return{id:t[0],label:t[1],ok,error}});B.issues=B.tests.filter(x=>!x.ok).map(x=>'TEST_FAIL:'+x.id);B.status=B.issues.length?'BLOCKED':'PASS';V.runtimeAudit=Object.assign(V.runtimeAudit||{},{v159Bridge:true,v159BridgeStatus:B.status,v159BridgeIssues:B.issues.length});emit('villa-pelon-v159-bridge-test',{status:B.status,tests:B.tests});return B};
window.addEventListener('load',()=>setTimeout(B.runSelfTest,300));window.addEventListener('villa-pelon-v159-audit-ready',()=>setTimeout(B.runSelfTest,50));
})();
