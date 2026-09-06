/* V87.9.2 — puente de integridad limpio: persistencia y arranque, sin UI duplicada. */
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});const S=()=>V.gameState;
function loadState(){const s=S();if(!s)return;try{const a=JSON.parse(localStorage.getItem('villa_pelon_save')||'null');if(a&&typeof a==='object'){Object.assign(s,a);if(!Array.isArray(s.inventory))s.inventory=[];s.dialogue=false;s.transport=null}}catch(_){} }
function persist(){const s=S();if(!s)return;try{s.sideMissions=Object.fromEntries(Object.entries(V.sideMissions||{}).map(([k,m])=>[k,{id:m.id,title:m.title,status:m.status,reward:m.reward}]));localStorage.setItem('villa_pelon_save',JSON.stringify(s))}catch(_){} }
function restore(){const s=S();if(!s||!V.sideMissions)return;Object.entries(s.sideMissions||{}).forEach(([k,v])=>{if(V.sideMissions[k])Object.assign(V.sideMissions[k],v)})}
const engineSave=V.saveGame;V.saveGame=()=>{persist();engineSave?.()};
function bindSave(){const b=document.getElementById('save');if(!b||b.dataset.vpSaveBound)return;b.dataset.vpSaveBound='1';b.addEventListener('click',()=>setTimeout(persist,30))}
function mount(){document.getElementById('vpActions')?.remove()}
const start=document.getElementById('startBtn');start?.addEventListener('click',()=>setTimeout(()=>{loadState();restore();mount();bindSave();V.engine?.update?.(0);},60));
if(document.getElementById('game')&&!document.getElementById('game').classList.contains('hidden')){loadState();restore();mount();bindSave()}
window.addEventListener('beforeunload',persist,{passive:true});
V.auditBridge={version:'V87.9.2',singleSave:true,duplicateActionUiRemoved:true,persistentSideMissions:true,startRestore:true};console.info('[Villa Pelón] V87.9.2 puente de integridad limpio');
})();
