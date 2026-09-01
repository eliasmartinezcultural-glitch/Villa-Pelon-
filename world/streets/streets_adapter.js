/* Villa Pelón V4 — PUENTE DE CALLES
   Conecta la infraestructura de calles con el render existente sin modificar el motor principal.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
function install(){
 const e=V.engine;if(!e||typeof e.render!=='function')return false;
 if(e.__v4StreetsInstalled)return true;
 const base=e.render.bind(e);
 e.render=function(){
   base();
   const ctx=arguments[0]||e.ctx||document.getElementById('world')?.getContext('2d');
   if(!ctx)return;
   V.streetSystem?.render?.(ctx);
   V.streetDetails?.render?.(ctx);
   const p=V.trafficLights?.state?.();
   if(p){V.trafficLights.render(ctx,1120,650,false);V.trafficLights.render(ctx,1460,900,false);V.trafficLights.render(ctx,1210,620,true);V.trafficLights.render(ctx,1380,880,true)}
 };
 e.__v4StreetsInstalled=true;
 return true;
}
const wait=()=>install()||setTimeout(wait,80);wait();
const nativeSetInterval=window.setInterval;
nativeSetInterval(()=>V.trafficLights?.update?.(.25),250);
V.v4?.register?.('streetsAdapter',{version:4,install});
})();
