/* Villa Pelón V6.7 — INTEGRACIÓN FINAL
   Contrato único del mundo. El motor principal ya es nativo 8400x5600;
   este módulo valida y publica referencias compartidas sin duplicar física,
   movimiento ni render.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const X=V.v6Integration=V.v6Integration||{};X.version=7;X.enabled=true;
const W=V.world;if(!W)return;
W.w=8400;W.h=5600;W.version=7;
V.v6Map={...(V.v6Map||{}),width:8400,height:5600,river:{x:7000,y:0,w:1200,h:5600},bridges:[{y:815,h:90},{y:1395,h:90}]};
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function normalize(){const s=V.state;if(!s)return;s.x=clamp(Number(s.x)||1280,60,8340);s.y=clamp(Number(s.y)||820,180,5540);s.version=7;s._v6World={w:8400,h:5600,river:V.v6Map.river,bridges:V.v6Map.bridges}}
normalize();
X.check=()=>({ok:!!V.engine&&V.engine.version>=7,version:X.version,world:[W.w,W.h],river:V.v6Map.river,bridges:V.v6Map.bridges,npcs:Array.isArray(V.npcs)?V.npcs.length:0,buildings:Array.isArray(V.buildings)?V.buildings.length:0,life:!!V.life,dialogue:!!V.v6Dialogue});
X.ready=true;V.v4?.register?.('v6Integration',X);
})();
