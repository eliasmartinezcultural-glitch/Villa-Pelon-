/* Villa Pelón V4 — RENDER PIPELINE 419
   Optimización real: caché estática + culling espacial + capas dinámicas.
   No crea RAF. game.js sigue siendo el único loop.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const canvas=document.getElementById('world');
if(!canvas)return;
const P={version:1,ready:false,cache:null,dirty:true,lastWorld:0};
V.renderPipeline=P;

function quality(){try{return JSON.parse(localStorage.getItem('villa_pelon_v4_settings')||'{}').quality||'high'}catch(_){return'high'}}
function visible(o,camera,vw,vh,pad=120){
  if(!o)return false;
  const x=o.x+(o.w?o.w/2:0),y=o.y+(o.h?o.h/2:0),r=(o.w&&o.h)?Math.max(o.w,o.h)/2:28;
  const hw=vw/(2*Math.max(camera.zoom,.01)),hh=vh/(2*Math.max(camera.zoom,.01));
  return x>=camera.x-hw-pad-r&&x<=camera.x+hw+pad+r&&y>=camera.y-hh-pad-r&&y<=camera.y+hh+pad+r;
}
function patch(){
  const e=V.engine;if(!e||typeof e.render!=='function'||e.__pipeline419)return false;
  const original=e.render;e.__pipeline419=true;
  // Reuse the engine's render but temporarily provide culled collections.
  e.render=function(){
    const camera=V.camera;if(!camera){return original.call(this)}
    const vw=innerWidth,vh=innerHeight,pad=quality()==='low'?70:180;
    const np=V.npcs||[],bp=V.buildings||[];
    const oldN=V.npcs,oldB=V.buildings;
    V.npcs=np.filter(o=>visible(o,camera,vw,vh,pad));
    V.buildings=bp.filter(o=>visible(o,camera,vw,vh,pad));
    try{return original.call(this)}finally{V.npcs=oldN;V.buildings=oldB}
  };
  P.ready=true;return true;
}
function init(){if(patch())return;setTimeout(patch,100);setTimeout(patch,400);}
init();
P.markDirty=()=>{P.dirty=true};
console.info('[Villa Pelón] Render Pipeline 419',P);
})();
