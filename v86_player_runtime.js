/* Villa Pelón V89 — adaptador de compatibilidad.
   El movimiento ya no pertenece a este archivo: CORE Player es la única autoridad.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={}),S=V.gameState;if(!S)return;
function audit(){if(V.player?.repair)V.player.repair()}
function move(dt){return V.player?.move?V.player.move(dt):false}
function clear(){if(V.player?.clear)V.player.clear()}
function canonicalBlocked(x,y){return V.player?.blocked?V.player.blocked(x,y):false}
function repairPosition(){return V.player?.repair?V.player.repair():false}
function findSafeSpawn(){return V.player?.safeSpawn?V.player.safeSpawn():[120,200]}
function boot(){audit();clear();V.playerRuntime86={version:'89.1.0',keys:V.player?.keys||{},S,clear,move,audit,canonicalBlocked,repairPosition,findSafeSpawn,authority:'core/player.js'}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
