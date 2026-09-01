/* Villa Pelón V4 — VISUAL POWER 420
   Capa visual no destructiva. Mejora profundidad, atmósfera, iluminación,
   sombras y detalles sin reemplazar el motor ni crear otro RAF.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const c=document.getElementById('world'); if(!c)return;
const S={version:1,enabled:true,quality:'high',effects:true};
V.visualPower=S;
function getQ(){try{return JSON.parse(localStorage.getItem('villa_pelon_v4_settings')||'{}').quality||'high'}catch(_){return'high'}}
function drawAtmosphere(ctx,w,h){
 const q=getQ();
 if(q==='low')return;
 ctx.save();
 const g=ctx.createRadialGradient(w*.5,h*.46,Math.min(w,h)*.18,w*.5,h*.5,Math.max(w,h)*.78);
 g.addColorStop(0,'rgba(255,235,190,0)');
 g.addColorStop(.72,'rgba(38,29,22,.035)');
 g.addColorStop(1,'rgba(28,21,17,.18)');
 ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
 // subtle pixel dust / sun flecks, deterministic
 ctx.globalAlpha=.12;ctx.fillStyle='#ead8a6';
 for(let i=0;i<34;i++){const x=(i*83)%w,y=(i*47+31)%h;ctx.fillRect(x,y,1,1)}
 ctx.restore();
}
function patch(){
 const e=V.engine;if(!e||typeof e.render!=='function'||e.__visualPower420)return false;
 const original=e.render;e.__visualPower420=true;
 e.render=function(){
   const result=original.apply(this,arguments);
   const ctx=c.getContext('2d');
   if(ctx)drawAtmosphere(ctx,innerWidth,innerHeight);
   return result;
 };
 S.quality=getQ();S.ready=true;return true;
}
function init(){if(!patch()){setTimeout(patch,150);setTimeout(patch,500);setTimeout(patch,1000)}}
init();
console.info('[Villa Pelón] Visual Power 420',S);
})();
