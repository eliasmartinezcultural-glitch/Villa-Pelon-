/* Villa Pelón V6.8.2 — PUENTE DE INTERACCIÓN COMPATIBLE
   La jugabilidad V4 sigue siendo la autoridad de misiones, inventario y diálogo.
   Este módulo conecta controles táctiles y API de mundo con esa autoridad.
   No crea un segundo sistema de interacción ni duplica la entrada de teclado.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const B=V.v6Interaction=V.v6Interaction||{version:5,enabled:true,ready:false,inputAuthority:'v4_playability'};
function nearest(){const s=V.state;if(!s)return null;let best=null,bd=150;const arr=[...(V.npcs||[]),...(V.buildings||[]),...(V.historySpots||[]),...(V.storyJob?[V.storyJob]:[])];for(const o of arr){if(o?._v65Hidden)continue;const x=o.x+(o.w?o.w/2:0),y=o.y+(o.h?o.h/2:0),d=Math.hypot(s.x-x,s.y-y);if(d<bd){bd=d;best=o}}return best}
function invoke(){const api=V.v4Playability;if(!api||typeof api.interact!=='function')return false;return api.interact()!==false}
function onInteractButton(e){if(!V.state?.started)return;e.preventDefault();e.stopImmediatePropagation();invoke()}
if(V.engine){V.engine.nearest=nearest;B.ready=true}
V.worldInteractionAPI={nearest,interact:invoke};
const button=document.getElementById('interact');
if(button)button.addEventListener('click',onInteractButton,true);
})();
