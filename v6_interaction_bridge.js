/* Villa Pelón V6.6 — PUENTE DE INTERACCIÓN COMPATIBLE
   La jugabilidad V4 sigue siendo la autoridad de misiones, inventario y diálogo.
   Este módulo sólo publica nearest() para los sistemas visuales que lo necesitan.
   No intercepta interact() y no crea ciclos.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});const B=V.v6Interaction=V.v6Interaction||{version:3,enabled:true,ready:false};
function nearest(){const s=V.state;if(!s)return null;let best=null,bd=150;const arr=[...(V.npcs||[]),...(V.buildings||[]),...(V.historySpots||[]),...(V.storyJob?[V.storyJob]:[])];for(const o of arr){if(o?._v65Hidden)continue;const x=o.x+(o.w?o.w/2:0),y=o.y+(o.h?o.h/2:0),d=Math.hypot(s.x-x,s.y-y);if(d<bd){bd=d;best=o}}return best}
if(V.engine){V.engine.nearest=nearest;B.ready=true}V.worldInteractionAPI={nearest};
})();
