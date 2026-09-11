/* VILLA PELÓN V120 — AUTORIDAD ABSOLUTA DEL RÍO
   Se ejecuta antes del motor. Corrige cualquier ausencia o desplazamiento accidental.
   Coordenada canónica: Y=820, ancho 8200, alto 22.
*/
(()=>{'use strict';
 const V=window.VillaPelon||(window.VillaPelon={});
 const G=V.worldGeometry||(V.worldGeometry={});
 const canonical={x:0,y:820,w:8200,h:22};
 const previous=G.river||V.worldManifest?.river;
 const mismatch=!!previous && (previous.y!==canonical.y||previous.x!==canonical.x||previous.w!==canonical.w||previous.h!==canonical.h);
 G.river={...canonical};
 V.worldManifest=V.worldManifest||{};
 V.worldManifest.river={...canonical};
 V.worldManifest.riverAuthority='v120-canonical-y820';
 V.riverAuthority={version:'120.0',canonical:{...canonical},previous,corrected:mismatch,source:'core/v120_river_authority.js'};
 V.worldGeometry.worldRules=V.worldGeometry.worldRules||{};
 V.worldGeometry.worldRules.boundaries={...(V.worldGeometry.worldRules.boundaries||{}),waterY:820,waterHeight:22};
 V.worldGeometry.worldRules.water={...(V.worldGeometry.worldRules.water||{}),riverCrossing:'bridge_only',canonicalY:820};
 window.dispatchEvent(new CustomEvent('villa-pelon-river-authority-ready',{detail:V.riverAuthority}));
})();
