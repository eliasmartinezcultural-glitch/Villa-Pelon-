/* Villa Pelón V4 — CAPA VISUAL Y AMBIENTAL
   Refuerza el mundo existente sin duplicar el motor: paisaje, profundidad,
   señales, agua, actividad, partículas y lectura espacial.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const K=V.v4||(V.v4={version:4});
const start=performance.now();
function clamp(v,a,b){return Math.max(a,Math.min(b,v))}
function draw(){
  const e=V.engine;if(!e||!e.canvas||!e.ctx||!V.state)return;
  if(!e.__v4OriginalRender)e.__v4OriginalRender=e.render;
  e.__v4OriginalRender();
  const ctx=e.ctx,c=e.canvas,now=performance.now(),t=(now-start)/1000,s=e.state||V.state;
  const d=Math.min(devicePixelRatio||1,2),w=innerWidth,h=innerHeight;
  ctx.save();ctx.setTransform(d,0,0,d,0,0);
  // V4: indicador vivo del pueblo.
  const activity=(Math.sin(t*.7)+1)/2;
  ctx.fillStyle='rgba(19,25,18,.72)';ctx.fillRect(16,74,230,48);
  ctx.strokeStyle='rgba(232,198,119,.55)';ctx.strokeRect(16,74,230,48);
  ctx.fillStyle='#e6c87b';ctx.font='800 11px system-ui';ctx.fillText('V4 · PUEBLO VIVO',28,92);
  ctx.fillStyle='#d9dfc5';ctx.font='11px system-ui';ctx.fillText('Actividad ambiental',28,109);
  ctx.fillStyle='#c7a85d';ctx.fillRect(133,103,96,5);ctx.fillStyle='#87a06a';ctx.fillRect(133,103,96*activity,5);
  // Brújula y coordenadas discretas.
  ctx.fillStyle='rgba(23,28,21,.72)';ctx.fillRect(w-150,74,134,54);
  ctx.fillStyle='#f0d795';ctx.font='bold 11px monospace';ctx.textAlign='center';ctx.fillText('N',w-83,90);
  ctx.fillStyle='#d7dfc9';ctx.font='10px monospace';ctx.fillText('X '+Math.round(s.x)+' · Y '+Math.round(s.y),w-83,108);ctx.textAlign='left';
  // Clima visual por hora.
  const hour=s.minutes/60;
  let alpha=0;if(hour<6||hour>21)alpha=.18;else if(hour<8)alpha=.07;else if(hour>19)alpha=.08;
  if(alpha){ctx.fillStyle=`rgba(20,31,48,${alpha})`;ctx.fillRect(0,0,w,h)}
  // Vignette cinematográfica.
  const g=ctx.createRadialGradient(w/2,h/2,Math.min(w,h)*.28,w/2,h/2,Math.max(w,h)*.72);
  g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(12,15,11,.24)');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
  // Partículas de polvo/polen: cambian continuamente, no son estáticas.
  ctx.globalAlpha=.25;for(let i=0;i<18;i++){let x=(i*137+t*(8+i%4)*3)%w,y=(i*83+Math.sin(t*.7+i)*22+t*4)%h;ctx.fillStyle='#f0dca8';ctx.fillRect(x,y,1.5,1.5)}ctx.globalAlpha=1;
  // Señal de cercanía más clara.
  if(e.nearest){const n=e.nearest();if(n&&n.x!=null){ctx.fillStyle='rgba(25,31,23,.86)';ctx.fillRect(w/2-115,h-92,230,32);ctx.strokeStyle='rgba(230,194,110,.55)';ctx.strokeRect(w/2-115,h-92,230,32);ctx.fillStyle='#f2ddb0';ctx.font='bold 12px system-ui';ctx.textAlign='center';ctx.fillText('E  ·  '+(n.name||n.label||'EXPLORAR').toUpperCase(),w/2,h-71);ctx.textAlign='left'}}
  ctx.restore();
}
const originalLoop=e=>e;
function install(){if(!V.engine||V.engine.__v4VisualInstalled)return false;V.engine.__v4VisualInstalled=true;const base=V.engine.render;V.engine.render=()=>{base();draw()};return true}
const wait=()=>install()||requestAnimationFrame(wait);wait();
V.v4Visual={version:4,install};
})();