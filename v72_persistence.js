/* Villa Pelón V72.1 — persistencia canónica del estado jugable. */
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});const KEY='villa-pelon-save-v74';
function snapshot(){const g=V.gameState||{},inv=Array.isArray(g.inventory)?g.inventory.slice():Array.isArray(V.ui67?.inventory)?V.ui67.inventory.slice():[];return{version:'V72.1',savedAt:Date.now(),player:{x:g.x,y:g.y},world:{minutes:g.minutes,day:g.day},economy:{money:g.money,energy:g.energy},progress:{quest:g.quest},inventory:inv,worldFlags:V.worldState?.flags||{}}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(snapshot()));if(V.worldEvent)V.worldEvent('save',{key:KEY});return true}catch(e){console.warn('V72 save failed',e);return false}}
function load(){try{const raw=localStorage.getItem(KEY);if(!raw)return false;const s=JSON.parse(raw),g=V.gameState;if(!g)return false;if(s.player){if(Number.isFinite(s.player.x))g.x=s.player.x;if(Number.isFinite(s.player.y))g.y=s.player.y}if(s.world){if(Number.isFinite(s.world.minutes))g.minutes=s.world.minutes;if(Number.isFinite(s.world.day))g.day=s.world.day}if(s.economy){if(Number.isFinite(s.economy.money))g.money=s.economy.money;if(Number.isFinite(s.economy.energy))g.energy=s.economy.energy}if(s.progress&&Number.isFinite(s.progress.quest))g.quest=s.progress.quest;if(Array.isArray(s.inventory)){g.inventory=s.inventory.slice();if(V.ui67)V.ui67.inventory=s.inventory.slice()}if(V.worldState?.flags&&s.worldFlags)V.worldState.flags={...s.worldFlags};if(V.worldEvent)V.worldEvent('load',{key:KEY});return true}catch(e){console.warn('V72 load failed',e);return false}}
function clear(){localStorage.removeItem(KEY)}
V.persistence72={version:'V72.1',save,load,clear,snapshot};
const wire=()=>{const b=document.getElementById('save');if(b&&!b.dataset.v72){b.dataset.v72='1';b.addEventListener('click',()=>{save();b.textContent='GUARDADO ✓';setTimeout(()=>b.textContent='GUARDAR',1200)})}load()};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wire);else wire();
})();
