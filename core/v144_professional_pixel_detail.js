/* VILLA PELÓN V144 — MICRODETALLE PROFESIONAL
   Segunda capa estética: detalles pequeños, repetibles y coherentes sin tocar geometría.
   Todo se integra al RAF/compositor existente.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const S=V.gameState||(V.gameState={});
if(Array.isArray(V.npcs)){
 const seen=new Set();V.npcs=V.npcs.filter(n=>{if(!n||!n.id||seen.has(n.id))return false;seen.add(n.id);return true});
}
function screen(x,y){const c=.82;return{x:(x-(+S.x||0))*c+innerWidth/2,y:(y-(+S.y||0))*c+innerHeight/2}}
function visible(x,y,p=120){const q=screen(x,y);return q.x>-p&&q.x<innerWidth+p&&q.y>-p&&q.y<innerHeight+p}
function draw(ctx){
 const g=V.worldGeometry;if(!g)return;const d=Math.min(devicePixelRatio||1,2);ctx.save();ctx.setTransform(d,0,0,d,0,0);
 // Street lamps and utility poles: quiet infrastructure that makes the village feel inhabited.
 const poles=[[680,520],[1180,520],[1710,520],[2250,520],[2860,720],[3480,900],[4100,900],[4680,1040],[5350,1250],[6120,1280],[6940,1750],[7480,2050]];
 poles.forEach(([x,y],i)=>{if(!visible(x,y))return;const p=screen(x,y);ctx.fillStyle='#55483d';ctx.fillRect(p.x-2,p.y-22,4,30);ctx.fillRect(p.x-10,p.y-22,20,2);ctx.fillStyle='#d0b878';ctx.fillRect(p.x-4,p.y-27,8,4);if(i%2===0){ctx.fillStyle='rgba(224,196,111,.14)';ctx.fillRect(p.x-14,p.y-24,28,3)}});
 // Tiny roadside vegetation clusters.
 for(let i=0;i<75;i++){const x=420+(i*317)%7350,y=430+(i*173)%2050;if(!visible(x,y,40))continue;const p=screen(x,y);ctx.fillStyle=i%3?'#5c704b':'#748056';ctx.fillRect(p.x,p.y-5,2,7);ctx.fillRect(p.x-3,p.y-3,2,5);ctx.fillRect(p.x+3,p.y-4,2,6);}
 // Crop-row rhythm in the productive rural sector, not over buildings.
 for(let row=0;row<8;row++){const y=1280+row*46;if(!visible(5600,y,50))continue;for(let x=5300;x<7100;x+=64){const p=screen(x,y);ctx.fillStyle='#718153';ctx.fillRect(p.x,p.y,18,2);ctx.fillStyle='#8b915f';ctx.fillRect(p.x+5,p.y-2,3,2);}}
 // Water shimmer and reeds around the river buffer, keeping the sealed river geometry untouched.
 if(visible(4500,2750,100)){for(let x=3500;x<7200;x+=85){const p=screen(x,2750+(x%5)*3);ctx.fillStyle='rgba(173,193,165,.45)';ctx.fillRect(p.x,p.y,18,1);ctx.fillRect(p.x+7,p.y+3,11,1)}}
 // Building micro-accents: awnings, flower pots, vents, chimney caps and small signs.
 (g.buildings||[]).forEach((b,i)=>{if(!visible(b.x+b.w/2,b.y+b.h/2,160))return;const q=screen(b.x+b.w/2,b.y+b.h);ctx.save();
  if(i%4===0){ctx.fillStyle='#6c4f3b';ctx.fillRect(q.x-14,q.y-10,28,3);ctx.fillStyle='#9a7a55';ctx.fillRect(q.x-12,q.y-7,24,2)}
  if(i%5===0){ctx.fillStyle='#51433a';ctx.fillRect(q.x+b.w*.25*.82,q.y-28,5,18);ctx.fillStyle='#75624d';ctx.fillRect(q.x+b.w*.25*.82-2,q.y-30,9,3)}
  if(i%3===0){ctx.fillStyle='#8b5d43';ctx.fillRect(q.x-30,q.y-4,7,5);ctx.fillStyle='#708052';ctx.fillRect(q.x-29,q.y-7,5,4)}
  ctx.restore();});
 // Soft pixel dust / birds: minimal motion cues, not visual noise.
 const t=performance.now()/1000;for(let i=0;i<9;i++){const wx=900+i*780+Math.sin(t*.3+i)*90,wy=520+(i%4)*180+Math.cos(t*.2+i)*20;if(!visible(wx,wy))continue;const p=screen(wx,wy);ctx.fillStyle='rgba(45,44,37,.55)';ctx.fillRect(p.x,p.y,4,1);ctx.fillRect(p.x+5,p.y+2,3,1)}
 ctx.restore();
}
const C=V.visualAuthority;if(C&&typeof C.drawContent==='function'&&!C.__v144Wrapped){C.__v144Wrapped=true;const old=C.drawContent;C.drawContent=function(ctx,meta){old.call(this,ctx,meta);draw(ctx)}}
V.professionalDetail={version:'144.0',geometryLocked:true,singleRAF:true};
window.dispatchEvent(new CustomEvent('villa-pelon-professional-detail-ready',{detail:{version:'144.0',ok:true}}));
})();
