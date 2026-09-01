/* Villa Pelón V4 — REGISTRO UNIFICADO DEL MUNDO
   V4 es la única fuente activa. Los datos legacy solo se migran en compatibilidad.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const world=V.world||(V.world={w:4200,h:2700,version:4});
const road=V.streetSystem?.roads||[{x:0,y:700,w:4200,h:230},{x:1180,y:0,w:220,h:2700}];
const onRoad=(x,y,w=1,h=1)=>road.some(r=>x<r.x+r.w&&x+w>r.x&&y<r.y+r.h&&y+h>r.y);
const W=V.v4World=V.v4World||{};W.version=4;W.world=world;
W.rules={road:'SOLO_CIRCULACION',buildings:'FUERA_DE_CALZADA',vegetation:'FUERA_DE_CALZADA',pedestrians:'PERMITIDOS_EN_VEREDA_Y_CRUCES',vehicles:'PERMITIDOS_EN_CALZADA',machinery:'ZONAS_CORRESPONDIENTES'};
function sync(){
 W.places=V.buildings||[];W.citizens=Array.isArray(V.npcs)?V.npcs:[];W.traffic=Array.isArray(V.life?.traffic)?V.life.traffic:[];W.animals=Array.isArray(V.life?.animals)?V.life.animals:[];W.player=V.state?{x:V.state.x,y:V.state.y}:null;W.time=V.state?{day:V.state.day,minutes:V.state.minutes}:null;
 W.audit={version:4,buildingsOnRoad:W.places.filter(b=>b&&onRoad(b.x||0,b.y||0,b.w||1,b.h||1)).length,traffic:W.traffic.length,animals:W.animals.length};W.audit.valid=W.audit.buildingsOnRoad===0;return W.audit;
}
W.onRoad=onRoad;W.sync=sync;W.auditNow=sync;sync();
V.v4?.register?.('world',W);
})();
