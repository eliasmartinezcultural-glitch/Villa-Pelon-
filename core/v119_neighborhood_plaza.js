/* VILLA PELÓN V119 — RELACIÓN EDIFICIO · CALLE · BARRIO · PLAZA
   Define el espacio cívico y dibuja únicamente esta capa relacional.
   El compositor principal sigue siendo la autoridad de fachadas; v119 no limpia el canvas.
*/
(()=>{'use strict';
 const V=window.VillaPelon||(window.VillaPelon={});
 const G=V.worldGeometry||(V.worldGeometry={});
 const river=G.river||(G.river={x:0,y:820,w:8200,h:22});
 const plaza=G.plaza||(G.plaza={id:'plaza_central',x:1320,y:1008,w:1760,h:176,kind:'civic',walkable:true,frontRoad:'main_mid',frontY:990});
 G.river=river;G.plaza=plaza;
 const roads=G.roads||[],buildings=G.buildings||[];
 const intersects=(a,b,p=0)=>a.x-p<b.x+b.w&&a.x+a.w+p>b.x&&a.y-p<b.y+b.h&&a.y+a.h+p>b.y;
 const center=b=>({x:b.x+b.w/2,y:b.y+b.h/2});
 const nearestRoad=b=>{let best=null,bd=Infinity;roads.forEach(r=>{const cx=Math.max(r.x,Math.min(b.x+b.w/2,r.x+r.w)),cy=Math.max(r.y,Math.min(b.y+b.h/2,r.y+r.h));const d=Math.hypot(cx-(b.x+b.w/2),cy-(b.y+b.h/2));if(d<bd){bd=d;best={road:r,distance:d,point:{x:cx,y:cy}}}});return best};
 const frontages=buildings.map((b,i)=>{const n=nearestRoad(b);return{id:i,label:b.label,type:b.type,building:b,road:n?.road?.id||null,distance:n?.distance??Infinity,point:n?.point||center(b)}});
 const audit={version:'119.0',plaza,river,frontages,buildings:buildings.length,roads:roads.length,plazaIntersections:buildings.filter(b=>intersects(b,plaza,18)).map(b=>b.label)};
 V.neighborhoodContract={version:'119.0',centralPlaza:plaza.id,frontageRule:'nearest-road-with-buffer',streetRelation:true,neighborhoodRelation:true};
 V.spatialAuthority={version:'119.0',river,plaza,frontages,intersects,nearestRoad};
 V.neighborhoodAudit=audit;
 window.dispatchEvent(new CustomEvent('villa-pelon-neighborhood-ready',{detail:audit}));
 // Solo la segunda carga, después del compositor, activa la capa visual.
 if(V.renderCompositor){
  const c=document.getElementById('worldDetail');const ctx=c?.getContext('2d');if(ctx){const Z=V.renderCompositor.camera||.82;let vw=innerWidth,vh=innerHeight;
   const resize=()=>{vw=innerWidth;vh=innerHeight};addEventListener('resize',resize,{passive:true});
   const screen=(x,y)=>{const s=V.gameState||{};return{x:(x-(+s.x||0))*Z+vw/2,y:(y-(+s.y||0))*Z+vh/2}};
   const vis=r=>{const q=screen(r.x,r.y);return!(q.x+r.w*Z<0||q.x>vw||q.y+r.h*Z<0||q.y>vh)};
   const rect=(x,y,w,h,col)=>{ctx.fillStyle=col;ctx.fillRect(Math.round(x),Math.round(y),Math.max(1,Math.round(w)),Math.max(1,Math.round(h)))};
   function drawPlaza(){const q=screen(plaza.x,plaza.y);if(!vis(plaza))return;const x=q.x,y=q.y,w=plaza.w*Z,h=plaza.h*Z;
    rect(x-6,y-6,w+12,h+12,'rgba(48,43,35,.30)');rect(x,y,w,h,'#a99a72');
    rect(x+5,y+5,w-10,4,'#7d7056');rect(x+5,y+h-9,w-10,4,'#7d7056');
    const cell=Math.max(24,36*Z);for(let xx=x+22;xx<x+w-12;xx+=cell)rect(xx,y+16,2,h-32,'rgba(222,202,157,.35)');
    for(let i=0;i<4;i++){const tx=x+42+i*(w-84)/3,ty=y+43;ctx.fillStyle='rgba(45,58,39,.82)';ctx.beginPath();ctx.arc(tx,ty,9,0,Math.PI*2);ctx.fill();rect(tx-2.5,ty+6,5,15,'#6a503b')}
    for(let i=0;i<3;i++){const bx=x+74+i*(w-148)/2,by=y+h-40;rect(bx,by,48,5,'#5b4b3b');rect(bx+3,by-7,42,4,'#7a6347')}
    rect(x+w/2-3,y+h/2-3,6,6,'#d0b36c');
   }
   function drawFrontages(){frontages.forEach(f=>{const b=f.building;if(f.distance>430||!vis(b))return;const q=screen(b.x,b.y),x=q.x,y=q.y,w=b.w*Z,h=b.h*Z;rect(x+5,y+h-4,Math.max(2,w-10),3,'rgba(38,34,29,.30)');const p=screen(f.point.x,f.point.y),sx=x+w/2,sy=y+h,dx=p.x-sx,dy=p.y-sy,d=Math.hypot(dx,dy);if(d<8)return;const len=Math.min(28*Z,d*.35),nx=dx/d,ny=dy/d;rect(sx+nx*4,sy+ny*4,Math.max(2,Math.abs(nx*len)),Math.max(2,Math.abs(ny*len)),'rgba(178,157,117,.38)')})}
   function frame(){const S=V.gameState||{};if(!S.started){requestAnimationFrame(frame);return}drawPlaza();drawFrontages();requestAnimationFrame(frame)}
   V.neighborhoodRenderer={version:'119.0',singlePurpose:true,clearsCanvas:false,draws:['plaza','building_frontage','lot_contact']};requestAnimationFrame(frame);
  }
 }
})();
