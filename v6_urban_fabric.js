/* Villa Pelón V6.26 — TEJIDO URBANO
   Construye la relación espacial entre calles, lotes, edificios y espacios públicos.
   No crea loop ni física. Se monta sobre Life.drawWorld y consume StreetSystem/BuildingSystem.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const U=V.urbanFabric=V.urbanFabric||{};U.version=1;U.enabled=true;U.patched=false;
const R=(c,x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),Math.max(1,Math.round(w)),Math.max(1,Math.round(h)))};
const L=(c,x1,y1,x2,y2,col,lw=1)=>{c.strokeStyle=col;c.lineWidth=lw;c.beginPath();c.moveTo(Math.round(x1),Math.round(y1));c.lineTo(Math.round(x2),Math.round(y2));c.stroke()};
const roads=()=>Array.isArray(V.streetSystem?.roads)?V.streetSystem.roads:[];
const buildings=()=>Array.isArray(V.buildingSystem?.buildings)?V.buildingSystem.buildings:[];
const urban=r=>r&&(r.kind==='urban'||r.kind==='urban-edge');
const overlap=(a,b,p=0)=>a.x<a.x+a.w&&b.x<b.x+b.w&&a.x<a.x+a.w&&a.x<b.x+b.w+p&&a.x+a.w>b.x-p&&a.y<b.y+b.h+p&&a.y+a.h>b.y-p;
function sidewalk(c,r){
 if(!urban(r))return;
 const sw=V.streetSystem?.sidewalkWidth||28;
 R(c,r.x-sw,r.y-sw,r.w+sw*2,sw,'rgba(213,199,165,.78)');
 R(c,r.x-sw,r.y+r.h,r.w+sw*2,sw,'rgba(213,199,165,.78)');
 R(c,r.x-sw,r.y,sw,r.h,'rgba(213,199,165,.78)');
 R(c,r.x+r.w,r.y,sw,r.h,'rgba(213,199,165,.78)');
 // cordón pixelado
 R(c,r.x-sw,r.y-2,r.w+sw*2,4,'rgba(92,76,59,.42)');
 R(c,r.x-sw,r.y+r.h-2,r.w+sw*2,4,'rgba(92,76,59,.42)');
 R(c,r.x-2,r.y-sw,4,r.h+sw*2,'rgba(92,76,59,.42)');
 R(c,r.x+r.w-2,r.y-sw,4,r.h+sw*2,'rgba(92,76,59,.42)');
}
function frontage(c,b){
 if(!b||!Number.isFinite(b.x))return;
 const r=V.streetSystem?.nearestRoad?.(b.x+b.w/2,b.y+b.h/2);if(!r||!urban(r))return;
 const d=b.door||{x:b.x+b.w/2,y:b.y+b.h+18};
 // sendero real entre la puerta y la vereda, sin atravesar el edificio.
 const sw=V.streetSystem?.sidewalkWidth||28;
 const target=r.orientation==='horizontal'?Math.max(r.y-sw,Math.min(d.y,r.y+r.h+sw)):Math.max(r.x-sw,Math.min(d.x,r.x+r.w+sw));
 if(r.orientation==='horizontal')R(c,d.x-5,Math.min(d.y,target)-2,10,Math.abs(d.y-target)+4,'rgba(177,157,119,.72)');
 else R(c,Math.min(d.x,target)-2,d.y-5,Math.abs(d.x-target)+4,10,'rgba(177,157,119,.72)');
}
function lots(c){
 const bs=buildings();
 for(const b of bs){
  if(!b||!Number.isFinite(b.x))continue;
  const pad=b.type==='home'?18:12;
  const col=b.type==='home'?'rgba(104,83,61,.12)':b.type==='shop'||b.type==='bakery'?'rgba(139,105,63,.13)':'rgba(83,76,64,.10)';
  R(c,b.x-pad,b.y-pad,b.w+pad*2,b.h+pad*2,col);
  if(b.type==='home'){
   R(c,b.x-4,b.y+b.h+10,b.w+8,5,'rgba(75,63,50,.20)');
   R(c,b.x-9,b.y+b.h+20,Math.min(42,b.w*.35),5,'rgba(75,63,50,.16)');
  }
 }
}
function plaza(c){
 // Nodo central de escala barrial: abierto, conectado a la red, sin bloquear edificios.
 const x=760,y=500,w=820,h=150;
 R(c,x,y,w,h,'rgba(219,203,166,.52)');
 R(c,x+18,y+18,w-36,h-36,'rgba(173,157,121,.25)');
 R(c,x+350,y+48,120,54,'rgba(94,79,60,.22)');
 for(let i=0;i<5;i++){
  const tx=x+70+i*165;R(c,tx,y+28,7,28,'rgba(78,61,47,.55)');R(c,tx-14,y+10,28,20,'rgba(71,96,58,.56)');
 }
 L(c,x+12,y+8,x+w-12,y+8,'rgba(99,80,59,.30)',2);L(c,x+12,y+h-8,x+w-12,y+h-8,'rgba(99,80,59,.30)',2);
 // Cruces peatonales de acceso al espacio público.
 for(let i=0;i<7;i++){R(c,x+300+i*34,y-16,18,7,'rgba(236,224,193,.80)');R(c,x+300+i*34,y+h+9,18,7,'rgba(236,224,193,.80)')}
}
function intersections(c){
 const xs=V.streetSystem?.intersections||[];
 for(const p of xs){
  const a=V.streetSystem?.roadById?.[p.a],b=V.streetSystem?.roadById?.[p.b];if(!urban(a)||!urban(b))continue;
  // Isla de esquina: suaviza el encuentro de calles y hace legible el cruce.
  R(c,p.x-34,p.y-34,68,68,'rgba(213,199,165,.48)');
  for(let i=-18;i<=18;i+=12){R(c,p.x-30+i,p.y-2,7,4,'rgba(239,226,192,.72)');R(c,p.x-2,p.y-30+i,4,7,'rgba(239,226,192,.72)')}
 }
}
function parking(c){
 const spots=[[520,610,3],[1600,610,4],[1900,970,3],[3350,610,3]];
 for(const [x,y,n] of spots){
  const r=V.streetSystem?.nearestRoad?.(x,y);if(!r||!urban(r))continue;
  R(c,x,y,n*62,34,'rgba(104,91,72,.10)');
  for(let i=1;i<n;i++)L(c,x+i*62,y+3,x+i*62,y+31,'rgba(87,74,59,.25)',2);
 }
}
function streetFurniture(c){
 const points=[[340,640],[1720,640],[2060,1010],[3010,640],[3780,1010],[800,1010],[1660,1010]];
 for(const [x,y] of points){if(V.streetSystem?.onRoad?.(x,y))continue;R(c,x,y,22,5,'rgba(81,63,48,.65)');R(c,x+3,y+5,3,9,'rgba(69,56,45,.55)');R(c,x+16,y+5,3,9,'rgba(69,56,45,.55)')}
}
function draw(c){if(!U.enabled)return;for(const r of roads())sidewalk(c,r);lots(c);for(const b of buildings())frontage(c,b);intersections(c);plaza(c);parking(c);streetFurniture(c)}
function patch(){if(U.patched||!V.life?.drawWorld)return;const old=V.life.drawWorld;V.life.drawWorld=function(c){old.call(this,c);draw(c)};U.patched=true;U.features=['sidewalk-network','curbs','building-frontage','lot-relationships','central-public-space','pedestrian-crossings','intersection-islands','parking-bays','street-furniture','no-extra-loop','single-street-authority'];}
patch();setTimeout(patch,300);setTimeout(patch,1000);V.urbanFabric=U;
})();