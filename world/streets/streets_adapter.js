/* Villa Pelón V4 — PUENTE DE INFRAESTRUCTURA
   Un único punto de integración. No repinta calles ni reemplaza el motor.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
function install(){
 const e=V.engine;if(!e||typeof e.render!=='function')return false;
 if(e.__v4StreetsInstalled)return true;
 const base=e.render.bind(e);
 e.render=function(...args){
   base(...args);
   const ctx=args[0]||e.ctx;if(!ctx)return;
   V.streetSystem?.renderOverlay?.(ctx);
   V.streetDetails?.render?.(ctx);
   const p=V.trafficLights?.state?.();
   if(p){
     V.trafficLights.render(ctx,1120,650,false);V.trafficLights.render(ctx,1460,900,false);
     V.trafficLights.render(ctx,1210,620,true);V.trafficLights.render(ctx,1380,880,true);
   }
 };
 e.__v4StreetsInstalled=true;
 V.v4?.register?.('streetsAdapter',{version:4,install});
 return true;
}
const wait=()=>{if(!install())setTimeout(wait,100)};wait();
let last=performance.now();
function tick(now){const dt=Math.min(.1,(now-last)/1000);last=now;V.trafficLights?.update?.(dt);requestAnimationFrame(tick)}
requestAnimationFrame(tick);
})();
