/* Villa Pelón V6.7 — INTEGRIDAD DEL MUNDO
   Fuente única de dimensiones y contrato territorial.
   La representación visual del río pertenece a la capa de mundo/escala.
   No dibuja encima de otras capas y no crea RAF ni intervalos.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const I=V.v6Integrity=V.v6Integrity||{version:5,enabled:true,ready:false};
const world=V.world;if(!world)return;
world.w=Math.max(Number(world.w)||0,8400);world.h=Math.max(Number(world.h)||0,5600);world.version=7;
V.worldScale=V.worldScale||{};V.worldScale.version=Math.max(Number(V.worldScale.version)||0,3);V.worldScale.world=[world.w,world.h];
V.v6Map={version:4,width:world.w,height:world.h,river:{x:7000,y:0,w:1200,h:5600},regions:{city:{x:0,y:0,w:3900,h:3000},suburbs:{x:3500,y:400,w:2200,h:2800},rural:{x:3000,y:2700,w:4000,h:2900},river:{x:7000,y:0,w:1200,h:5600}},bridges:[{y:815,h:90},{y:1395,h:90}]};
I.check=()=>({ok:true,version:I.version,world:[world.w,world.h],river:[V.v6Map.river.x,V.v6Map.river.y,V.v6Map.river.w,V.v6Map.river.h],bridges:V.v6Map.bridges,buildings:Array.isArray(V.buildings)?V.buildings.length:0,npcs:Array.isArray(V.npcs)?V.npcs.length:0,life:!!V.life,lifeDeep:!!V.worldLifeDeep});
I.contract={world:'8400x5600',city:'0..3900 / 0..3000',suburbs:'3500..5700 / 400..3200',rural:'3000..7000 / 2700..5600',river:'7000..8200',bridges:[815,1395],night:[21,7]};
I.ready=true;
})();