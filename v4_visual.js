/* Villa Pelón V4 — CAPA VISUAL Y AMBIENTAL
   Auditoría 411: esta capa solo se monta sobre el render existente.
   No crea RAF, no hace polling y no toca el tamaño interno del canvas.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const G=V.engine;
if(!G||!G.render)return;
if(G.__v4VisualInstalled)return;
const base=G.render;
const started=performance.now();
function draw(){
  const e=V.engine,s=V.state;
  if(!e||!e.ctx||!s)return;
  const ctx=e.ctx,t=(performance.now()-started)/1000;
  const w=innerWidth,h=innerHeight;
  const d=Math.min(devicePixelRatio||1,2);
  ctx.save();
  ctx.setTransform(d,0,0,d,0,0);
  const activity=(Math.sin(t*.7)+1)/2;
  ctx.fillStyle='rgba(28,23,18,.78)';ctx.fillRect(16,74,230,48);
  ctx.strokeStyle='rgba(232,198,119,.55)';ctx.strokeRect(16,74,230,48);
  ctx.fillStyle='#e6c87b';ctx.font='800 11px monospace';ctx.fillText('V4 · PUEBLO VIVO',28,92);
  ctx.fillStyle='#d9dfc5';ctx.font='11px monospace';ctx.fillText('ACTIVIDAD',28,109);
  ctx.fillStyle='#6d5a38';ctx.fillRect(94,103,135,5);ctx.fillStyle='#87a06a';ctx.fillRect(94,103,135*activity,5);
  ctx.fillStyle='rgba(23,28,21,.82)';ctx.fillRect(w-164,74,148,54);
  ctx.fillStyle='#f0d795';ctx.font='bold 11px monospace';ctx.textAlign='center';ctx.fillText('POSICIÓN',w-90,90);
  ctx.fillStyle='#d7dfc9';ctx.font='10px monospace';ctx.fillText('X '+Math.round(s.x)+' · Y '+Math.round(s.y),w-90,108);
  ctx.textAlign='left';
  const hour=s.minutes/60;const alpha=hour<6||hour>21?.18:hour<8?.07:hour>19?.08:0;
  if(alpha){ctx.fillStyle='rgba(20,31,48,'+alpha+')';ctx.fillRect(0,0,w,h)}
  ctx.globalAlpha=.2;
  for(let i=0;i<14;i++){const x=(i*137+t*(8+i%4)*3)%w,y=(i*83+Math.sin(t*.7+i)*22+t*4)%h;ctx.fillStyle='#f0dca8';ctx.fillRect(x,y,2,2)}
  ctx.globalAlpha=1;
  const n=e.nearest?.();
  if(n&&n.x!=null){ctx.fillStyle='rgba(25,31,23,.9)';ctx.fillRect(w/2-125,h-92,250,32);ctx.strokeStyle='rgba(230,194,110,.55)';ctx.strokeRect(w/2-125,h-92,250,32);ctx.fillStyle='#f2ddb0';ctx.font='bold 12px monospace';ctx.textAlign='center';ctx.fillText('E · '+String(n.name||n.label||'EXPLORAR').toUpperCase(),w/2,h-71);ctx.textAlign='left'}
  ctx.restore();
}
G.render=()=>{base();draw()};
G.__v4VisualInstalled=true;
V.v4Visual={version:4,install:()=>true,renderLayer:'post-render',singleMotor:true};
})();