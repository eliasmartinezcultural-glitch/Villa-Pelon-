/* Villa Pelón V4 — RENDER OPTIMIZER 418
   PC + MOBILE. No second RAF. The main engine remains authoritative.
   Optimizes render cadence, visibility and adaptive quality.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
function settings(){try{return JSON.parse(localStorage.getItem('villa_pelon_v4_settings')||'{}')}catch(_){return {}}}
const coarse=matchMedia('(pointer:coarse)').matches||innerWidth<=900;
let hidden=document.hidden,lastPaint=0,samples=0,acc=0;
const originalRender=V.engine?.render;
if(!originalRender)return;
const originalLifeUpdate=V.life?.update;
if(originalLifeUpdate&&!V.renderOptimizerLifeBound){V.renderOptimizerLifeBound=true;V.life.update=function(dt,minutes){if(hidden)return;return originalLifeUpdate.call(this,dt,minutes)}}
document.addEventListener('visibilitychange',()=>{hidden=document.hidden;lastPaint=0},{passive:true});

// Cadencia adaptativa: PC conserva la máxima fluidez; móviles moderan el render cuando corresponde.
V.engine.render=function(){
  if(hidden)return;
  const s=settings(), low=s.quality==='low'||s.quality==='battery';
  const target=coarse?(low?30:45):60;
  const now=performance.now();
  if(lastPaint&&now-lastPaint<1000/target)return;
  lastPaint=now;
  originalRender();
  if(V.v4){samples++;acc+=V.v4.fps||0;if(samples>=30){V.v4.renderFps=Math.round(acc/samples);samples=0;acc=0}}
};

function quality(){
  const c=V.engine?.canvas||document.getElementById('world');
  if(!c)return;
  const s=settings(),low=s.quality==='low'||s.quality==='battery';
  const cap=coarse?(low?1:1.25):2;
  V.mobileGraphics={dpr:Math.min(devicePixelRatio||1,cap),quality:low?'battery':'high',targetFps:coarse?(low?30:45):60};
  c.style.imageRendering='pixelated';
}
quality();addEventListener('resize',quality,{passive:true});
V.renderOptimizer={version:2,pc:true,mobile:coarse,targetDesktop:60,targetHigh:45,targetLow:30,hiddenPause:true,adaptiveDpr:true};
})();