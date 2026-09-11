/* VILLA PELÓN V111 — COMPOSICIÓN FINAL DE CAPAS
   Una única composición visual encima de la geometría final.
   No mueve edificios ni crea geometría territorial nueva.
*/
(()=>{'use strict';
 const V=window.VillaPelon||(window.VillaPelon={});
 const G=V.worldGeometry||(V.worldGeometry={});
 const C=()=>document.getElementById('worldDetail');
 const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
 const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
 function install(){
  const c=C(); if(!c||!G.buildings)return;
  const ctx=c.getContext('2d'); if(!ctx)return;
  const canvas=document.getElementById('world');
  function frame(){
   const W=V.world?.w||8200,H=V.world?.h||4200;
   c.width=canvas?.width||innerWidth*devicePixelRatio; c.height=canvas?.height||innerHeight*devicePixelRatio;
   const sx=c.width/W, sy=c.height/H, scale=Math.min(sx,sy), ox=(c.width-W*scale)/2, oy=(c.height-H*scale)/2;
   ctx.setTransform(scale,0,0,scale,ox,oy);ctx.imageSmoothingEnabled=false;ctx.clearRect(0,0,W,H);
   const z=G.zones||[];
   z.forEach(a=>{ctx.fillStyle=a.kind==='urban'?'#7d875f':a.kind==='transition'?'#9b936c':a.kind==='rural'||a.kind==='productive'?'#879363':a.kind==='river'?'#a79b70':'#a49a72';ctx.fillRect(a.x,a.y,a.w,a.h)});
   const r=G.river;if(r){ctx.fillStyle='#527f86';ctx.fillRect(r.x,r.y,r.w,r.h);ctx.fillStyle='#6d989b';for(let x=r.x;x<r.x+r.w;x+=28)ctx.fillRect(x,r.y+24,14,3)}
   (G.roads||[]).forEach(a=>{ctx.fillStyle=a.kind==='rural_road'?'#b49b70':a.kind==='route'?'#a58b62':'#b8a477';ctx.fillRect(a.x,a.y,a.w,a.h);ctx.fillStyle='#cdb98b';if(a.w>a.h)ctx.fillRect(a.x,a.y+a.h*.46,a.w,2);else ctx.fillRect(a.x+a.w*.46,a.y,2,a.h)});
   (G.bridges||[]).forEach(b=>{ctx.fillStyle='#765b46';ctx.fillRect(b.x,b.y,b.w,b.h);ctx.fillStyle='#b99462';for(let x=b.x+12;x<b.x+b.w;x+=28)ctx.fillRect(x,b.y+10,8,b.h-20)});
   (G.buildings||[]).forEach(b=>drawBuilding(ctx,b));
  }
  function drawBuilding(ctx,b){
   const palettes={home:['#b99d75','#654a3c'],school:['#d1b77f','#5d4a3c'],community:['#c9ae78','#654b3d'],municipality:['#c8ad78','#57463b'],library:['#c7b17e','#665044'],hospital:['#d5c69d','#64736b'],fire_station:['#b56e55','#5b4038'],radio:['#a9936e','#51473e'],culture:['#9f8a6b','#59483e'],shop:['#c0a171','#5a493d'],service:['#a88967','#51463d'],chapel:['#d0c39b','#655a4c'],rural:['#a58b61','#59473b'],winery:['#9c7658','#4f4038']}[b.type]||['#b69b70','#59483d'];
   ctx.fillStyle='rgba(35,31,25,.35)';ctx.fillRect(b.x+14,b.y+16,b.w,b.h);
   ctx.fillStyle=palettes[0];ctx.fillRect(b.x,b.y,b.w,b.h);
   ctx.fillStyle=palettes[1];ctx.fillRect(b.x,b.y,b.w,12);ctx.fillRect(b.x,b.y+b.h-10,b.w,10);
   const door=Math.max(18,Math.min(34,b.w*.12));ctx.fillStyle='#4b3b33';ctx.fillRect(b.x+b.w*.5-door/2,b.y+b.h-door,door,door);
   const win=Math.max(12,Math.min(24,b.w*.08));ctx.fillStyle='#77949a';for(let x=b.x+24;x<b.x+b.w-24;x+=Math.max(50,win*3))ctx.fillRect(x,b.y+b.h*.42,win,win*.8);
   if(b.landmark||['school','municipality','library','hospital','fire_station','winery'].includes(b.type)){ctx.fillStyle='#f0dfb0';ctx.font='bold 28px monospace';ctx.textAlign='center';ctx.fillText(esc(b.label).slice(0,20),b.x+b.w/2,b.y-10)}
  }
  frame(); window.addEventListener('resize',frame); window.addEventListener('villa-pelon-world-final',frame); V.finalVisual={version:'111.0',frame};
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();
