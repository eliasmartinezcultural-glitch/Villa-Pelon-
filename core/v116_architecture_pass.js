/* VILLA PELÓN V116 — COMPATIBILIDAD LEGACY
   V117 moved architectural micro-rendering under the single compositor authority.
   This file intentionally does not start a second requestAnimationFrame loop.
*/
(()=>{'use strict';
 const V=window.VillaPelon||(window.VillaPelon={});
 V.architecturePass=Object.assign({},V.architecturePass||{},{version:'117.0',legacyV116Disabled:true,renderOwner:'render_compositor_v93',geometryMutation:false,visualAuthority:'single-compositor'});
})();
