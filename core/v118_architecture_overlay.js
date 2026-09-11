/* VILLA PELÓN V118 — CAPA ARQUITECTÓNICA POST-COMPOSITOR
   Se ejecuta después del compositor oficial. No limpia el canvas: el compositor lo hace antes.
   Aporta profundidad mínima: zócalo, acceso, sombra de lote y jerarquía institucional.
*/
(()=>{'use strict';
 const V=window.VillaPelon||(window.VillaPelon={});
 const c=document.getElementById('worldDetail');if(!c)return;const ctx=c.getContext('2d');
 const Z=.82;let vw=innerWidth,vh=innerHeight;
 function resize(){vw=innerWidth;vh=innerHeight;const d=Math.min(devicePixelRatio||1,2);c.width=Math.max(1,vw*d);c.height=Math.max(1,vh*d);c.style.width=vw+'px';c.style.height=vh+'px';ctx.imageSmoothingEnabled=false}
 addEventListener('resize',resize,{passive:true});resize();
 const screen=(x,y)=>{const s=V.gameState||{};return{x:(x-(+s.x||0))*Z+vw/2,y:(y-(+s.y||0))*Z+vh/2}};
 const visible=(r)=>{const q=screen(r.x,r.y);return !(q.x+r.w*Z<0||q.x>vw||q.y+r.h*Z<0||q.y>vh)};
 function draw(){const d=Math.min(devicePixelRatio||1,2);ctx.setTransform(d,0,0,d,0,0);const S=V.gameState||{};if(!S.started){requestAnimationFrame(draw);return}
  const bs=V.worldGeometry?.buildings||[];
  bs.forEach(b=>{if(!visible(b))return;const q=screen(b.x,b.y),x=q.x,y=q.y,w=b.w*Z,h=b.h*Z;
   // Base line gives the structure a physical contact with the terrain.
   ctx.fillStyle='rgba(38,34,29,.30)';ctx.fillRect(Math.round(x+4),Math.round(y+h-4),Math.max(2,Math.round(w-8)),4);
   // Short access path. It stops before the road, so it never visually becomes a new road.
   const pw=Math.max(7,Math.min(18,w*.08)),px=x+w/2-pw/2,py=y+h;
   ctx.fillStyle='rgba(178,157,117,.34)';ctx.fillRect(Math.round(px),Math.round(py),Math.round(pw),Math.min(18,Math.max(5,vh-py)));
   // Institutional buildings receive a restrained civic lintel rather than extra decoration.
   if(['school','hospital','fire_station','municipality','library','community','chapel'].includes(b.type)){
    ctx.fillStyle='rgba(239,218,170,.34)';ctx.fillRect(Math.round(x+8),Math.round(y+10),Math.max(2,Math.round(w-16)),3);
   }
  });
  requestAnimationFrame(draw)
 }
 V.architectureOverlay={version:'118.0',owner:'post-compositor',singleRAF:true,clearsCanvas:false,purpose:'depth-access-hierarchy'};
 requestAnimationFrame(draw);
})();
