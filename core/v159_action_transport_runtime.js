/* VILLA PELÓN V159 — ACTION + TRANSPORT RUNTIME
   Extiende el motor existente sin crear un segundo loop ni una segunda autoridad.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={}),S=V.gameState||(V.gameState={}),M=V.missions||{};
const A=V.actionRuntime={version:'159.0',authority:'V159_BRIDGE',state:S.actionState=S.actionState||{name:'idle',startedAt:0,progress:0,vehicleId:null}};
const emit=(n,d)=>window.dispatchEvent(new CustomEvent(n,{detail:d||{}}));
const dist=(a,b)=>Math.hypot((+a.x||0)-(+b.x||0),(+a.y||0)-(+b.y||0));
function nearestVehicle(type){const list=V.peopleVehicles?.vehicleData||[];return list.filter(v=>!type||v.type===type).sort((a,b)=>dist(S,a)-dist(S,b))[0]||null}
function animate(name,duration=900,data={}){A.state.name=name;A.state.startedAt=performance.now();A.state.duration=duration;A.state.progress=0;Object.assign(A.state,data);emit('villa-pelon-action-start',{name,duration,data});return true}
function finish(){const name=A.state.name;if(name==='idle')return false;A.state.progress=1;emit('villa-pelon-action-finish',{name});A.state.name='idle';return true}
function board(type='bus',target='bus'){const v=nearestVehicle(type);if(!v||dist(S,v)>150)return false;S.transport=S.transport||{};S.transport.mode=type;S.transport.vehicleId=v.id||null;S.transport.active=true;S.transport.boarded=true;S.transport.startedAt=performance.now();animate('board-'+type,850,{vehicleId:v.id||null});const o=M.objective?.(S);if(o?.type==='transport'&&(o.target===target||o.target===type))M.completeStep?.(S,'transport:'+o.target);emit('villa-pelon-transport-board',{vehicle:v,target});return true}
function disembark(){if(!S.transport?.active)return false;const id=S.transport.vehicleId;animate('disembark',650,{vehicleId:id});S.transport.active=false;S.transport.boarded=false;S.transport.mode='walk';emit('villa-pelon-transport-disembark',{vehicleId:id});return true}
function doAction(id,payload={}){const o=M.objective?.(S);if(o?.type!=='action'||o.target!==id)return false;S.actionFlags=S.actionFlags||{};S.actionFlags[id]=true;animate(id,payload.duration||900,payload);M.completeStep?.(S,'action:'+id);emit('villa-pelon-mission-action',{id,payload});return true}
A.animate=animate;A.finish=finish;A.board=board;A.disembark=disembark;A.doAction=doAction;A.nearestVehicle=nearestVehicle;
V.transport=V.transport||{};Object.assign(V.transport,{board,disembark,nearest:nearestVehicle});V.missionActions=V.missionActions||{};V.missionActions.do=doAction;
window.addEventListener('keydown',e=>{if(S.dialogue||S.paused)return;const k=String(e.key).toLowerCase();if(k==='b')board('bus','bus');if(k==='x'&&S.transport?.active)disembark()},{capture:true});
setInterval(()=>{if(A.state.name==='idle')return;const elapsed=performance.now()-A.state.startedAt;A.state.progress=Math.min(1,elapsed/(A.state.duration||1));if(A.state.progress>=1)finish()},80);
})();
