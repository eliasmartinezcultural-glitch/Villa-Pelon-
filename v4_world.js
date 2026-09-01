/* Villa Pelón V4 — REGISTRO UNIFICADO DEL MUNDO
   V4 es la única fuente activa. Los datos legacy solo se migran en compatibilidad,
   nunca se usan como dependencias permanentes del mundo.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const world=V.world||(V.world={w:4200,h:2700,version:4});
const road={horizontal:{y1:700,y2:930},vertical:{x1:1180,x2:1400}};
const onRoad=(x,y)=>((y>road.horizontal.y1&&y<road.horizontal.y2)||(x>road.vertical.x1&&x<road.vertical.x2));
const W=V.v4World=V.v4World||{};
W.version=4;W.world=world;W.places=W.places||[];W.citizens=W.citizens||[];W.traffic=W.traffic||[];W.animals=W.animals||[];
W.rules={road:'SOLO_CIRCULACION',buildings:'FUERA_DE_CALZADA',vegetation:'FUERA_DE_CALZADA',pedestrians:'PERMITIDOS_EN_VEREDA_Y_CRUCES',vehicles:'PERMITIDOS_EN_CALZADA',machinery:'PERMITIDA_EN_ZONAS_CORRESPONDIENTES'};
function sync(){
 W.places=V.buildings||[];W.citizens=Array.isArray(V.npcs)?V.npcs:W.citizens;W.traffic=Array.isArray(W.traffic)?W.traffic:[];W.animals=Array.isArray(W.animals)?W.animals:[];W.player=V.state?{x:V.state.x,y:V.state.y}:null;W.time=V.state?{day:V.state.day,minutes:V.state.minutes}:null;
 W.audit={version:4,buildingsOnRoad:W.places.filter(b=>b&&b.x!=null&&b.y!=null&&onRoad(b.x+(b.w||1)/2,b.y+(b.h||1)/2)).length,traffic:W.traffic.length,animals:W.animals.length};
}
W.onRoad=onRoad;W.sync=sync;sync();
let timer=setInterval(sync,1000);
W.stopSync=()=>{clearInterval(timer);timer=null};
V.v4?.register?.('world',W);
})();
