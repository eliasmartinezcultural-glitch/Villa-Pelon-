/* Villa Pelón V72 — persistencia local del estado jugable. */
(()=>{'use strict';const V=window.VillaPelon||(window.VillaPelon={});const KEY='villa-pelon-save-v72';
function snapshot(){const g=V.gameState||{};const m=V.missions?.snapshot?V.missions.snapshot():null;const inv=Array.isArray(V.ui67?.inventory)?V.ui67.inventory.slice():[];return{version:'V72',savedAt:Date.now(),player:{x:g.x,y:g.y},world:{time:g.time,hour:g.hour,day:g.day,weather:g.weather},inventory:inv,missions:m,worldFlags:V.worldState?.flags||{}}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(snapshot()));if(V.worldEvent)V.worldEvent('save',{key:KEY});return true}catch(e){console.warn('V72 save failed',e);return false}}
function load(){try{const raw=localStorage.getItem(KEY);if(!raw)return false;const s=JSON.parse(raw),g=V.gameState;if(g&&s.player){if(Number.isFinite(s.player.x))g.x=s.player.x;if(Number.isFinite(s.player.y))g.y=s.player.y}if(g&&s.world){Object.keys(s.world).forEach(k=>{if(s.world[k]!==undefined)g[k]=s.world[k]})}if(V.ui67&&Array.isArray(s.inventory))V.ui67.inventory=s.inventory.slice();if(V.missions?.init&&s.missions)V.missions.init(s.missions);if(V.worldState?.flags&&s.worldFlags)V.worldState.flags={...s.worldFlags};if(V.worldEvent)V.worldEvent('load',{key:KEY});return true}catch(e){console.warn('V72 load failed',e);return false}}
function clear(){localStorage.removeItem(KEY)}
V.persistence72={version:'V72',save,load,clear,snapshot};
const wire=()=>{const b=document.getElementById('save');if(b&&!b.dataset.v72){b.dataset.v72='1';b.addEventListener('click',()=>{save();b.textContent='GUARDADO ✓';setTimeout(()=>b.textContent='GUARDAR',1200)})}load()};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wire);else wire();
})();