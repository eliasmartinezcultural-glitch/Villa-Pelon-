/* VILLA PELÓN V65 — puente de integración.
   Sin segundo loop: usa el pulso existente de game.js para sincronizar progreso y guardar datos.
*/
(()=>{
'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const KEY='villa_pelon_save';
const BRIDGE={version:'V65',saveSchema:2};
function migrate(s){
 if(!s||typeof s!=='object')return s;
 s.saveSchema=Math.max(2,Number(s.saveSchema||1));
 s.inventory=Array.isArray(s.inventory)?s.inventory:[];
 s.evidence=Array.isArray(s.evidence)?s.evidence:[];
 s.relationships=s.relationships&&typeof s.relationships==='object'?s.relationships:{};
 return s;
}
function sync(){
 const s=V.gameState;if(!s)return;
 if(!Array.isArray(s.inventory))s.inventory=[];
 if(!Array.isArray(s.evidence))s.evidence=[];
 const m=V.missions;
 if(m&&m.initialized){s.missionRuntime=m.snapshot();s.evidence=m.evidence.slice()}
 s.saveSchema=2;
}
function install(){
 if(!V.gameState)return;
 const originalSave=V.saveGame;
 V.saveGame=function(){sync();try{localStorage.setItem(KEY,JSON.stringify({...V.gameState,dialogue:false,saved:false}));V.gameState.saved=true;return true}catch(e){console.warn('[Villa Pelón] save bridge',e);return false}};
 const raw=localStorage.getItem(KEY);if(raw){try{const s=migrate(JSON.parse(raw));if(s.missionRuntime&&V.missions)V.missions.init(s.missionRuntime);if(Array.isArray(s.evidence))V.gameState.evidence=s.evidence}catch(_){} }
 BRIDGE.ready=true;V.v65Bridge=BRIDGE;
}
if(V.missions&&!V.missions.initialized)V.missions.init();
if(V.gameState)install();else window.addEventListener('villa-pelon-runtime-ready',install,{once:true});
})();
