/* VILLA PELÓN V116 — PASADA ARQUITECTÓNICA
   Objetivo: dar jerarquía, profundidad y orientación a los edificios sin llenar el mundo de adornos.
   No cambia la geometría base: mejora exclusivamente la lectura de fachada, acceso y lote.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const canvas=document.getElementById('worldDetail'); if(!canvas)return;
const ctx=canvas.getContext('2d'); if(!ctx)return;
const Z=.82; let vw=innerWidth,vh=innerHeight;
function resize(){vw=innerWidth;vh=innerHeight;const d=Math.min(devicePixelRatio||1,2);canvas.width=Math.max(1,Math.floor(vw*d));canvas.height=Math.max(1,Math.floor(vh*d));canvas.style.width=vw+'px';canvas.style.height=vh+'px';ctx.imageSmoothingEnabled=false}
addEventListener('resize',resize,{passive:true}); resize();
function screen(x,y){const s=V.gameState||{};return{x:(x-(+s.x||0))*Z+vw/2,y:(y-(+s.y||0))*Z+vh/2}}
function visible(r){const q=screen(r.x,r.y);return !(q.x+r.w*Z<0||q.x>vw||q.y+r.h*Z<0||q.y>vh)}
function px(x,y,w,h,c){ctx.fillStyle=c;ctx.fillRect(Math.round(x),Math.round(y),Math.max(1,Math.round(w)),Math.max(1,Math.round(h)))}
function line(x1,y1,x2,y2,c,w=2){ctx.strokeStyle=c;ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke()}
function drawBuilding(b){
 const r=b; if(!visible(r))return;
 const q=screen(r.x,r.y),x=q.x,y=q.y,w=r.w*Z,h=r.h*Z;
 // Foundation: an understated base that separates wall from terrain.
 px(x+3,y+h-5,w-6,6,'rgba(49,43,37,.55)');
 // Roof ridge/highlight follows the existing facade silhouette.
 const roof='#382f2b';
 line(x+4,y+1,x+w-4,y+1,roof,2);
 line(x+10,y+5,x+w-10,y+5,'rgba(232,210,160,.28)',1);
 // Frontage path: only a short connector from door to public space.
 const doorW=Math.min(24,w*.16), doorX=x+w/2-doorW/2, doorY=y+h-48*Z;
 const pathW=Math.max(8,doorW*.72), pathX=x+w/2-pathW/2;
 if(pathX>0){
   px(pathX,doorY+48*Z,pathW,Math.min(28*Z,Math.max(10,vh-doorY)),'rgba(178,157,117,.48)');
 }
 // Institutional emphasis: restrained marker, never a giant floating icon.
 const institutional=['school','hospital','fire_station','municipality','library','community','chapel'].includes(b.type);
 if(institutional){
   px(x+7,y+10,w-14,3,'rgba(245,225,174,.42)');
 }
}
function frame(){
 const d=Math.min(devicePixelRatio||1,2);ctx.setTransform(d,0,0,d,0,0);
 if(!(V.gameState||{}).started){requestAnimationFrame(frame);return}
 const buildings=V.worldGeometry?.buildings||[];
 // This pass intentionally draws only micro-structure over the authoritative compositor.
 buildings.forEach(drawBuilding);
 requestAnimationFrame(frame);
}
V.architecturePass={version:'116.0',purpose:'frontage-depth-orientation',decorativeDensity:'low',geometryMutation:false,buildingAccess:'explicit',visualPriority:'structure-first'};
requestAnimationFrame(frame);
})();
