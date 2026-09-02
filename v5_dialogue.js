/* Villa Pelón V6.3 — compatibilidad de diálogo.
   Este módulo NO ejecuta timers ni mueve el DOM por su cuenta.
   v6_dialogue_stable.js es el único controlador visual.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const D=V.v5Dialogue=V.v5Dialogue||{};D.version=2;D.enabled=true;D.controller='v6_dialogue_stable';D.timers=0;
const game=()=>document.getElementById('game');
function init(){let p=document.getElementById('v5-interact-prompt');if(!p){p=document.createElement('div');p.id='v5-interact-prompt';p.style.display='none';(game()||document.body).appendChild(p)}D.ready=true}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
