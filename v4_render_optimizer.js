/* Villa Pelón V4 — RENDER OPTIMIZER 417
   Reduce trabajo gráfico en Android sin crear otro motor ni otro RAF.
   El motor original conserva física, cámara y lógica.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const mobile=matchMedia('(max-width:800px), (pointer:coarse)').matches;
if(!mobile)return;
function settings(){try{return JSON.parse(localStorage.getItem('villa_pelon_v4_settings')||'{}')}catch(_){return {}}}
let lastPaint=0, frames=0, samples=0, acc=0, fps=60, hidden=document.hidden;
const originalRender=V.engine?.render;
if(!originalRender)return;
const originalLifeUpdate=V.life?.update;
if(originalLifeUpdate){V.life.update=function(dt,minutes){if(hidden)return;return originalLifeUpdate.call(this,dt,minutes)}}

document.addEventListener('visibilitychange',()=>{hidden=document.hidden;lastPaint=0},{passive:true});

V.engine.render=function(){
  if(hidden)return;
  const s=settings();
  const low=s.quality==='low';
  const target=low?30:45;
  const now=performance.now();
  if(lastPaint&&now-lastPaint<1000/target)return;
  lastPaint=now;
  frames++;
  originalRender();
  // Telemetría ligera: no se escribe en DOM.
  if(V.v4){samples++;acc+=V.v4.fps||0;if(samples>=30){fps=acc/samples;V.v4.renderFps=Math.round(fps);samples=0;acc=0}}
};

// Android: bajar resolución interna solo cuando la pantalla es grande/retina.
// game.js seguirá siendo dueño del resize; este perfil solo decide el límite.
function profile(){
  const c=V.engine?.canvas;if(!c)return;
  const s=settings(),low=s.quality==='low';
  const dpr=devicePixelRatio||1;
  const cap=low?1:1.25;
  V.mobileGraphics={dpr:Math.min(dpr,cap),quality:low?'battery':'high',targetFps:low?30:45};
  c.style.imageRendering='pixelated';
}
profile();
window.addEventListener('resize',profile,{passive:true});
V.renderOptimizer={version:1,mobile:true,targetHigh:45,targetLow:30,hiddenPause:true};
})();
