/* Villa Pelón V4 — PUENTE DE INFRAESTRUCTURA
   No repinta la calzada ni modifica el motor. Solo añade elementos que
   pertenecen por encima de la geometría vial: veredas, cordones, cruces,
   señalización y semáforos.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
function install(){
 const e=V.engine;if(!e||typeof e.render!=='function')return false;
 if(e.__v4StreetsInstalled)return true;
 const base=e.render.bind(e);
 e.render=function(){
   base();
   const ctx=e.ctx||document.getElementById('world')?.getContext('2d');
   if(!ctx)return;
   V.streetSystem?.renderInfrastructure?.(ctx);
   V.streetDetails?.render?.(ctx);
   const p=V.trafficLights?.state?.();
   if(p){
     V.trafficLights.render(ctx,1120,650,false);
     V.trafficLights.render(ctx,1460,900,false);
     V.trafficLights.render(ctx,1210,620,true);
     V.trafficLights.render(ctx,1380,880,true);
   }
 };
 e.__v4StreetsInstalled=true;
 V.v4?.register?.('streetsAdapter',{version:4,install,layer:'infrastructure-overlay'});
 return true;
}
const wait=()=>install()||setTimeout(wait,100);wait();
const update=()=>V.trafficLights?.update?.(.25);
setInterval(update,250);
})();
