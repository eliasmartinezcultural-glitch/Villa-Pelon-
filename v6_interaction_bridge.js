/* Villa Pelón V6.39 — PUENTE DE INTERACCIÓN
   El motor V6.37 es la única autoridad. Este archivo expone una API
   compatible para módulos antiguos sin volver a tomar el control del input.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const B=V.v6Interaction=V.v6Interaction||{version:6,enabled:true,ready:false,inputAuthority:'v6_game_core'};
function nearest(){return typeof V.engine?.nearest==='function'?V.engine.nearest():null}
function invoke(){return typeof V.engine?.interact==='function'?(V.engine.interact(),true):false}
V.worldInteractionAPI={nearest,interact:invoke};
B.nearest=nearest;B.interact=invoke;B.ready=!!V.engine;
})();
