/* Villa Pelón V4 — REGLAS TERRITORIALES
   No renderiza: evita duplicaciones. El motor V4 es el único renderizador.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const R={h:{y1:700,y2:930},v:{x1:1180,x2:1400}},pad=18;
const intersectsRoad=o=>{if(!o||o.x==null||o.y==null)return false;return(o.y+(o.h||1)>R.h.y1-pad&&o.y<R.h.y2+pad)||(o.x+(o.w||1)>R.v.x1-pad&&o.x<R.v.x2+pad)};
function audit(){const bad=(V.buildings||[]).filter(intersectsRoad);V.v4WorldRule={version:4,rule:'CALZADA_LIBRE',roadBounds:R,valid:bad.length===0,buildingsOnRoad:bad.map(b=>b.label)};return V.v4WorldRule}
V.v4Structure={version:4,roadRule:'SOLO_CIRCULACION',intersectsRoad,audit};audit();setInterval(audit,1000);
})();