/* Villa Pelón V4 — WORLD VISUAL 421
   Capa visual posterior al render base. No reemplaza el motor ni crea RAF.
   Identidad: valle árido, riego, chacras, frutales, viñedos y pueblo patagónico.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const C=document.getElementById('world'); if(!C)return;
const S=V.worldVisual421={version:1,enabled:true,ready:false};
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function quality(){try{return JSON.parse(localStorage.getItem('villa_pelon_v4_settings')||'{}').quality||'high'}catch(_){return'high'}}
function phase(){const m=Number(V.state?.minutes||480)%1440,h=m/60;return h<6?'night':h<8?'dawn':h<17?'day':h<20?'golden':'night'}
function lighting(ctx,w,h){
 const p=phase(),q=quality();let a=0;
 if(p==='night')a=.36;else if(p==='dawn')a=.16;else if(p==='golden')a=.10;
 if(a){ctx.fillStyle=p==='night'?'rgba(22,29,48,'+a+')':p==='dawn'?'rgba(205,154,92,'+a+')':'rgba(224,151,73,'+a+')';ctx.fillRect(0,0,w,h)}
 if(p==='night'&&q!=='low'){
   ctx.save();ctx.globalAlpha=.75;ctx.fillStyle='#ead8a6';
   const seed=Number(V.state?.day||1)*17;
   for(let i=0;i<24;i++){const x=(i*97+seed*13)%w,y=(i*53+seed*7)%Math.max(1,h*.52);ctx.fillRect(x,y,1,1)}
   ctx.restore();
 }
}
function atmospheric(ctx,w,h){
 const q=quality();if(q==='low')return;
 const g=ctx.createLinearGradient(0,0,0,h);g.addColorStop(0,'rgba(246,220,166,.035)');g.addColorStop(.55,'rgba(246,220,166,0)');g.addColorStop(1,'rgba(35,27,20,.09)');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
 const v=ctx.createRadialGradient(w*.5,h*.5,Math.min(w,h)*.2,w*.5,h*.5,Math.max(w,h)*.78);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(24,18,14,.16)');ctx.fillStyle=v;ctx.fillRect(0,0,w,h);
}
function patch(){
 const e=V.engine;if(!e||typeof e.render!=='function'||e.__worldVisual421)return false;
 const original=e.render;e.__worldVisual421=true;
 e.render=function(){
   const r=original.apply(this,arguments);const ctx=C.getContext('2d');if(!ctx)return r;
   const w=innerWidth,h=innerHeight;lighting(ctx,w,h);atmospheric(ctx,w,h);S.phase=phase();S.quality=quality();S.ready=true;return r;
 };
 return true;
}
function init(){if(!patch()){setTimeout(patch,150);setTimeout(patch,500);setTimeout(patch,1200)}}
init();
})();
