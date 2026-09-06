/* Villa Pelón V87.12 — auditoría quirúrgica final.
   No crea un segundo motor ni un segundo loop.
   Corrige bordes de movimiento, entrada táctil, escala de vida y acabado pixel.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const S=V.gameState;
if(!S||!V.engine)return;
const world=()=>V.worldAuthority?.geometry||V.worldGeometry||{width:8000,height:5200,roads:[],buildings:[],bridges:[],river:{x:0,y:120,w:8000,h:190}};
const rectHit=(a,b,p=0)=>a.x-p < b.x+b.w && a.x+a.w+p > b.x && a.y-p < b.y+b.h && a.y+a.h+p > b.y;
const riverHit=(x,y)=>{const g=world(),r=g.river;if(!r)return false;const body={x:x-13,y:y-25,w:26,h:50};return rectHit(body,r,0)&&!(g.bridges||[]).some(b=>rectHit(body,b,0));};
const buildingHit=(x,y)=>{const g=world(),body={x:x-13,y:y-25,w:26,h:50};return (g.buildings||[]).some(b=>rectHit(body,b,8));};
const valid=(x,y)=>{const g=world();return x>=26&&y>=30&&x<=g.width-26&&y<=g.height-30&&!riverHit(x,y)&&!buildingHit(x,y)};
const oldUpdate=V.engine.update;
if(typeof oldUpdate==='function'&&!V.__v8712){
  V.__v8712=true;
  V.engine.update=(dt)=>{
    const before={x:S.x,y:S.y};
    oldUpdate(dt);
    if(S.started&&!S.transport){
      const xOK=valid(S.x,before.y), yOK=valid(before.x,S.y), bothOK=valid(S.x,S.y);
      if(!bothOK){
        if(!xOK)S.x=before.x;
        if(!yOK)S.y=before.y;
        if(!valid(S.x,S.y)){S.x=before.x;S.y=before.y;}
      }
      S.x=Math.max(26,Math.min(world().width-26,S.x));
      S.y=Math.max(30,Math.min(world().height-30,S.y));
    }
    V.campaignRuntime?.check?.();
    V.missionUI?.refresh?.();
  };
}
const touchButtons=[...document.querySelectorAll('[data-key]')];
touchButtons.forEach(b=>{
  if(b.dataset.vp12Touch)return;
  b.dataset.vp12Touch='1';
  b.addEventListener('pointerdown',e=>{b.classList.add('pressed');try{b.setPointerCapture(e.pointerId)}catch(_){}},{passive:false});
  const clear=()=>b.classList.remove('pressed');
  b.addEventListener('pointerup',clear,{passive:true});
  b.addEventListener('pointercancel',clear,{passive:true});
  b.addEventListener('lostpointercapture',clear,{passive:true});
});
const releaseTouch=()=>touchButtons.forEach(b=>b.dispatchEvent(new Event('pointerup')));
addEventListener('pointerup',releaseTouch,{passive:true});
addEventListener('pointercancel',releaseTouch,{passive:true});
addEventListener('blur',releaseTouch,{passive:true});
document.addEventListener('visibilitychange',()=>{if(document.hidden)releaseTouch()},{passive:true});
if(V.life?.drawWorld&&!V.life.__v8712Scale){
  const drawLife=V.life.drawWorld;
  const scale=Math.min(8000/3200,5200/2000);
  V.life.drawWorld=(ctx)=>{ctx.save();ctx.scale(scale,scale);drawLife(ctx);ctx.restore()};
  V.life.__v8712Scale=scale;
}
const canvas=V.engine.canvas||document.getElementById('world');
if(canvas){canvas.style.imageRendering='pixelated';canvas.style.msInterpolationMode='nearest-neighbor';canvas.setAttribute('aria-label','Villa Pelón — mundo territorial pixel art interactivo');}
V.audit={version:'V87.12.0',singleLoop:true,bodyCollision:true,axisSlide:true,touchCapture:true,touchRelease:true,lifeScale:V.life?.__v8712Scale||null,pixelArt:true,canonicalWorld:true};
console.info('[Villa Pelón] V87.12 auditoría quirúrgica aplicada');
})();
