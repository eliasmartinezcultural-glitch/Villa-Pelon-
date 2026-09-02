/* Villa Pelón V6.7 — RECONCILIACIÓN ESTRUCTURAL
   El motor principal ya trabaja directamente sobre 8400x5600.
   Esta capa valida el contrato y conserva compatibilidad para módulos antiguos;
   no duplica movimiento, colisiones, cámara ni render.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const R=V.worldReconciliation=V.worldReconciliation||{};R.version=7;R.ready=false;
const W=V.world||{};const M=V.v6Map||{};const S=V.state||{};
W.w=8400;W.h=5600;W.version=7;M.width=8400;M.height=5600;M.river={x:7000,y:0,w:1200,h:5600};M.bridges=[{y:815,h:90},{y:1395,h:90}];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function normalize(){if(!S)return;S.x=clamp(Number(S.x)||1280,60,8340);S.y=clamp(Number(S.y)||820,180,5540);S.version=7;S._v6World={w:8400,h:5600,river:M.river,bridges:M.bridges}}
normalize();
R.check=()=>({ok:!!V.engine&&V.engine.version>=7,version:R.version,world:[W.w,W.h],player:{x:Math.round(S.x),y:Math.round(S.y)},river:M.river,bridges:M.bridges,engine:!!V.engine,avatar:!!V.playerAvatar});
R.ready=true;V.v4?.register?.('worldReconciliation',R);
})();
