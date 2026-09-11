/* VILLA PELÓN V118 — RETIRADO
   La arquitectura vuelve a tener un único compositor. V119 integra edificio-calle-barrio-plaza
   mediante hooks del render_compositor_v93, evitando un segundo RAF visual.
*/
(()=>{'use strict';
 const V=window.VillaPelon||(window.VillaPelon={});
 V.architectureOverlay={version:'119.0',disabledLegacyV118:true,owner:'render_compositor_v93',singleRAF:true,clearsCanvas:false,purpose:'delegated-to-single-compositor'};
})();
