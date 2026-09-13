/* VILLA PELÓN V159 — REPAIR GUARD
   Reparaciones seguras de integración. Nunca modifica geometría ni crea autoridades paralelas.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={}),G=V.worldGeometry||{},S=V.gameState||(V.gameState={});
const R=V.v159Repair={version:'159.0',authority:'V159_SYSTEM_FLOOR',repairs:[],issues:[],status:'PENDING'};
function repair(id,fn){try{if(fn()){R.repairs.push(id)}}catch(e){R.issues.push(id+':'+e.message)}}
repair('game-state-action-transport',()=>{S.actionState=S.actionState&&typeof S.actionState==='object'?S.actionState:{name:'idle',startedAt:0,progress:0,duration:0,vehicleId:null};S.transport=S.transport&&typeof S.transport==='object'?S.transport:{mode:'walk',active:false,boarded:false,vehicleId:null,followVehicle:false};return true});
repair('vehicle-route-bindings',()=>{const roads=Array.isArray(G.roads)?G.roads:[];const ids=new Set(roads.map(r=>r.id));(V.peopleVehicles?.vehicleData||[]).forEach((v,i)=>{if(!v.id)v.id=(v.type||'vehicle')+'-'+String(i+1).padStart(2,'0');if(!v.route||!ids.has(v.route.routeId)){const fallback=roads.find(r=>r.id==='urban_north')||roads[0];if(fallback)v.route={routeId:fallback.id,axis:'x',dir:v.dir||1,laneY:fallback.y+fallback.h/2}}});return true});
repair('runtime-contract',()=>{return typeof V.runtimeRegister==='function'});
repair('pause-contract',()=>{if(V.v159Bridge){if(typeof V.engine?.pause!=='function')V.engine.pause=V.v159Bridge.pause;if(typeof V.engine?.resume!=='function')V.engine.resume=V.v159Bridge.resume;return typeof V.engine.pause==='function'&&typeof V.engine.resume==='function'}return false});
repair('mission-action-contract',()=>{if(!V.missionActions&&V.actionRuntime)V.missionActions={do:V.actionRuntime.doAction};return typeof V.missionActions?.do==='function'});
repair('transport-contract',()=>{if(V.actionRuntime){V.transport=V.transport||{};if(typeof V.transport.board!=='function')V.transport.board=V.actionRuntime.board;if(typeof V.transport.disembark!=='function')V.transport.disembark=V.actionRuntime.disembark}return typeof V.transport?.board==='function'&&typeof V.transport?.disembark==='function'});
R.status=R.issues.length?'BLOCKED':'PASS';V.runtimeAudit=Object.assign(V.runtimeAudit||{},{v159RepairGuard:true,v159RepairStatus:R.status,v159Repairs:R.repairs.length,v159RepairIssues:R.issues.length});window.dispatchEvent(new CustomEvent('villa-pelon-v159-repair-ready',{detail:R}));
})();
