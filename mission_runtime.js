/* VILLA PELÓN V65 — runtime único de misiones/evidencias.
   No crea loop ni reemplaza game.js: expone una API para que el motor pueda consultar y mutar progreso.
*/
(()=>{
'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const data=V.missionData||{chapters:[],chapterOrder:[]};
const runtime={version:'V65',active:null,completed:[],steps:{},evidence:[],initialized:false};
function allMissions(){return (data.chapters||[]).flatMap(c=>c.missions||[])}
function firstAvailable(){return allMissions().find(m=>!runtime.completed.includes(m.id))||null}
function init(saved){
 const s=saved||{};runtime.completed=Array.isArray(s.completed)?s.completed.slice():[];runtime.steps=s.steps&&typeof s.steps==='object'?{...s.steps}:{};runtime.evidence=Array.isArray(s.evidence)?s.evidence.slice():[];runtime.active=s.active||firstAvailable()?.id||null;runtime.initialized=true;return runtime}
function mission(id){return allMissions().find(m=>m.id===id)||null}
function current(){return mission(runtime.active)}
function complete(id,evidenceId){const m=mission(id);if(!m)return false;if(!runtime.completed.includes(id))runtime.completed.push(id);if(evidenceId&&!runtime.evidence.includes(evidenceId))runtime.evidence.push(evidenceId);const i=allMissions().findIndex(x=>x.id===id);runtime.active=allMissions()[i+1]?.id||null;return true}
function mark(step,id=runtime.active){if(!id)return false;(runtime.steps[id]||(runtime.steps[id]=[]));if(!runtime.steps[id].includes(step))runtime.steps[id].push(step);const m=mission(id);if(m&&m.steps&&m.steps.every(s=>runtime.steps[id].includes(s)))complete(id,m.evidence);return true}
function hasEvidence(id){return runtime.evidence.includes(id)}
function snapshot(){return {version:runtime.version,active:runtime.active,completed:runtime.completed.slice(),steps:JSON.parse(JSON.stringify(runtime.steps)),evidence:runtime.evidence.slice()}}
V.missions={...runtime,init,current,mission,mark,complete,hasEvidence,snapshot,all:allMissions};
V.missionRuntime=V.missions;
window.dispatchEvent(new CustomEvent('villa-pelon-missions-ready'));
})();
