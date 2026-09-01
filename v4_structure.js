/* Villa Pelón V4 — REGLAS TERRITORIALES
   No renderiza. Valida que construcciones y objetos estructurales no invadan
   la calzada. La geometría vial es compartida con el sistema de calles.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const R={h:{x1:0,x2:4200,y1:700,y2:930},v:{x1:1180,x2:1400,y1:0,y2:2700}},pad=8;
const overlap=(a1,a2,b1,b2)=>a1<b2&&a2>b1;
const intersectsRoad=o=>{
 if(!o||o.x==null||o.y==null)return false;
 const x1=o.x-pad,x2=o.x+(o.w||1)+pad,y1=o.y-pad,y2=o.y+(o.h||1)+pad;
 return overlap(x1,x2,R.h.x1,R.h.x2)&&overlap(y1,y2,R.h.y1,R.h.y2)||overlap(x1,x2,R.v.x1,R.v.x2)&&overlap(y1,y2,R.v.y1,R.v.y2);
};
function audit(){
 const buildings=V.buildings||[];
 const bad=buildings.filter(intersectsRoad);
 const streets=V.streetSystem?.roads||[];
 const geometryMismatch=streets.length!==2;
 V.v4WorldRule={version:4,rule:'CALZADA_LIBRE',valid:bad.length===0&&!geometryMismatch,roadBounds:R,buildingsOnRoad:bad.map(b=>b.label||b.id||'SIN_NOMBRE'),streetGeometryValid:!geometryMismatch};
 return V.v4WorldRule;
}
V.v4Structure={version:4,roadRule:'SOLO_CIRCULACION',intersectsRoad,audit};
audit();
V.v4?.register?.('structure',V.v4Structure);
})();
