/* Villa Pelón V6.24 — RENDER TERRITORIAL
   Una sola capa visual territorial, determinista y extensible.
   No crea loop ni física: consume StreetSystem, BuildingSystem, Agriculture y Life.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const T=V.territorialVisuals=V.territorialVisuals||{};T.version=2;T.enabled=true;T.patched=false;
const R=(c,x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),Math.max(1,Math.round(w)),Math.max(1,Math.round(h)))};
const L=(c,x1,y1,x2,y2,col,lw=1)=>{c.strokeStyle=col;c.lineWidth=lw;c.beginPath();c.moveTo(Math.round(x1),Math.round(y1));c.lineTo(Math.round(x2),Math.round(y2));c.stroke()};
const roads=()=>Array.isArray(V.streetSystem?.roads)?V.streetSystem.roads:[];
const roadAt=(x,y)=>!!V.streetSystem?.onRoad?.(x,y);
const river={x:7000,y:0,w:1200,h:5600};
const bridge=(x,y)=>[{y:815,h:90},{y:1395,h:90}].some(b=>x>river.x-28&&x<river.x+river.w+28&&y>b.y-8&&y<b.y+b.h+8);
const hash=(n)=>{const x=Math.sin(n*12.9898)*43758.5453;return x-Math.floor(x)};
function baseGround(c){
 R(c,0,0,8400,5600,'#a8956b');
 R(c,0,0,3900,3000,'#b39e74');R(c,3500,400,2200,2800,'rgba(191,169,126,.34)');
 R(c,3000,2700,4000,2900,'#9e9163');R(c,7000,0,1200,5600,'#6d9298');
 for(let i=0;i<1700;i++){const x=hash(i*2.1)*8400,y=hash(i*4.7+9)*5600;if(x>river.x)continue;if(roadAt(x,y))continue;const s=1+(i%4);R(c,x,y,s,s,i%7?'rgba(74,65,47,.09)':'rgba(229,211,164,.12)')}
}
function riverDraw(c,t){
 R(c,river.x,0,river.w,5600,'#6d9198');
 for(let i=0;i<52;i++){const y=i*108+hash(i)*35,x=river.x+55+hash(i+33)*820;L(c,x,y,x+80+hash(i+2)*170,y+Math.sin(t*.5+i)*3,'rgba(222,236,225,.25)',2)}
 for(const b of[{y:815,h:90},{y:1395,h:90}]){R(c,river.x-70,b.y,river.w+140,b.h,'#795b42');R(c,river.x-70,b.y+10,river.w+140,b.h-20,'#c0a074');for(let x=river.x-45;x<river.x+river.w+60;x+=58)R(c,x,b.y+12,7,b.h-24,'#71513d')}
}
function zoneTexture(c){
 // Tejido urbano: lotes y veredas suaves, evitando invadir calles.
 const lots=[
  [120,280,820,390],[1080,280,950,430],[2200,300,900,520],[120,900,720,390],[920,930,980,390],
  [2100,960,860,410],[700,1450,760,480],[1550,1450,820,470],[2450,1450,430,470]
 ];
 lots.forEach((q,i)=>{R(c,q[0],q[1],q[2],q[3],i%2?'rgba(91,78,57,.035)':'rgba(233,215,173,.045)');L(c,q[0],q[1],q[0]+q[2],q[1],'rgba(83,70,53,.16)',2);L(c,q[0],q[1]+q[3],q[0]+q[2],q[1]+q[3],'rgba(83,70,53,.10)',2)})
}
function roadsVisual(c){
 for(const r of roads()){
  const urban=r.kind==='urban'||r.kind==='regional';
  R(c,r.x-8,r.y-8,r.w+16,r.h+16,urban?'rgba(70,58,45,.18)':'rgba(76,62,45,.15)');
  R(c,r.x,r.y,r.w,r.h,urban?'#c8b486':'#b7a06e');
  if(urban){R(c,r.x,r.y,r.w,r.h*.22,'rgba(232,218,180,.28)');R(c,r.x,r.y+r.h*.78,r.w,r.h*.22,'rgba(103,84,61,.16)')}
  else{R(c,r.x,r.y,r.w,r.h,'rgba(121,105,69,.16)')}
  const horizontal=r.w>=r.h;
  if(horizontal){L(c,r.x,r.y+r.h/2,r.x+r.w,r.y+r.h/2,'rgba(238,222,178,.58)',2);for(let x=r.x+18;x<r.x+r.w;x+=90)R(c,x,r.y-6,22,3,'rgba(84,70,53,.24)')}
  else{L(c,r.x+r.w/2,r.y,r.x+r.w/2,r.y+r.h,'rgba(238,222,178,.58)',2);for(let y=r.y+18;y<r.y+r.h;y+=90)R(c,r.x-6,y,3,22,'rgba(84,70,53,.24)')}
 }
}
function irrigation(c,t){
 const channels=[[[2440,1195],[3100,1195],[3600,1250]],[[2505,1200],[2505,1665]],[[3195,1295],[3770,1295]],[[2590,1930],[3730,1930]],[[4050,1060],[4050,2080]]];
 for(const pts of channels)for(let i=0;i<pts.length-1;i++){const a=pts[i],b=pts[i+1];L(c,a[0],a[1],b[0],b[1],'rgba(80,68,49,.36)',9);L(c,a[0],a[1]-2,b[0],b[1]-2,'rgba(132,145,111,.55)',4);L(c,a[0],a[1]-4,b[0],b[1]-4,'rgba(208,214,177,.38)',1)}
 for(let i=0;i<35;i++){const x=2440+(i*97)%1500,y=1195+Math.sin(i+t*.4)*2;R(c,x,y,8,2,'rgba(220,226,192,.38)')}
}
function parcels(c,t){
 const ps=V.agriculturalCycle?.parcels||[];
 ps.forEach((p,pi)=>{const g=Math.max(0,Math.min(1,Number(p.growth)||0));
  R(c,p.x-9,p.y-9,p.w+18,p.h+18,'rgba(63,53,39,.16)');R(c,p.x,p.y,p.w,p.h,'rgba(123,118,67,.20)');
  for(let row=0;row<Math.max(2,Math.floor(p.w/70));row++){const x=p.x+24+row*62;L(c,x,p.y+16,x,p.y+p.h-16,'rgba(68,85,48,'+(0.16+g*.14).toFixed(2)+')',3);for(let y=p.y+28;y<p.y+p.h-18;y+=42){R(c,x-4,y,8,5,'rgba(87,104,53,.45)')}}
  const gx=p.x+p.w*.12,gy=p.y+p.h*.5;R(c,gx-16,gy-5,32,10,'rgba(207,176,111,.72)');
  [[p.x,p.y],[p.x+p.w,p.y],[p.x,p.y+p.h],[p.x+p.w,p.y+p.h]].forEach(q=>{R(c,q[0]-3,q[1]-9,6,13,'rgba(71,57,43,.72)')});
  if(g>.65){R(c,p.x+p.w-50,p.y+14,24,6,'rgba(224,190,105,.48)')}
 })
}
function elevation(c,t){
 for(let band=0;band<11;band++){const y=1030+band*104;let px=2150,py=y;
  for(let i=1;i<=40;i++){const x=2150+i*100,yy=y+Math.sin(i*.58+band*.75)*19;if(!roadAt(px,py)&&!roadAt(x,yy))L(c,px,py,x,yy,'rgba(80,70,55,.13)',2);px=x;py=yy}
 }
 for(let i=0;i<55;i++){const x=2200+hash(i+100)*1900,y=1100+hash(i+200)*950;if(!roadAt(x,y))L(c,x,y,x+14+hash(i)*22,y+2,'rgba(91,77,57,.24)',1)}
}
function trees(c,t){
 const specs=[];
 for(let i=0;i<95;i++){const x=110+hash(i*3)*6650,y=250+hash(i*7+4)*5000;if(x>6900||roadAt(x,y))continue;if((V.buildings||[]).some(b=>x>b.x-45&&x<b.x+b.w+45&&y>b.y-45&&y<b.y+b.h+45))continue;specs.push([x,y,i])}
 for(const [x,y,i] of specs){const s=1+(i%3)*.16;R(c,x-5*s,y+8*s,10*s,26*s,'rgba(84,59,43,.76)');R(c,x-20*s,y-8*s,40*s,25*s,i%4?'rgba(65,91,56,.74)':'rgba(82,103,62,.70)');R(c,x-11*s,y-20*s,23*s,13*s,'rgba(91,111,66,.62)')}
 // Álamos como identidad lineal del paisaje productivo.
 for(let i=0;i<28;i++){const x=3050+i*122,y=2740+(i%3)*32;if(roadAt(x,y))continue;R(c,x-3,y,6,42,'rgba(84,63,46,.78)');R(c,x-11,y-12,22,20,'rgba(74,99,61,.70)')}
}
function utilities(c){
 const poles=[[420,820],[1040,820],[1660,820],[2280,820],[2780,815],[3400,815],[4040,815],[4700,815],[5400,815],[6100,815],[2360,1260],[2360,1650],[2360,2050]];
 for(const [x,y] of poles){R(c,x-3,y-32,6,46,'rgba(69,56,45,.72)');L(c,x-42,y-28,x+42,y-28,'rgba(60,55,48,.55)',2);L(c,x-35,y-20,x+35,y-20,'rgba(60,55,48,.30)',1)}
 for(let i=0;i<poles.length-1;i++){const a=poles[i],b=poles[i+1];L(c,a[0],a[1]-28,b[0],b[1]-28,'rgba(48,50,47,.24)',2)}
}
function fences(c){
 const fs=[[2220,1010,1900,0],[2220,2090,1900,0],[2220,1010,0,1080],[4120,1010,0,1080],[2580,2290,0,780],[2580,2290,1250,0]];
 for(const [x,y,w,h] of fs){const d=Math.hypot(w,h),n=Math.max(2,Math.floor(d/54));for(let i=0;i<=n;i++){const f=i/n;R(c,x+w*f-2,y+h*f-7,4,14,'rgba(73,60,47,.62)')}L(c,x,y,x+w,y+h,'rgba(91,72,51,.34)',2)}
}
function buildingDepth(c){for(const b of(V.buildings||[])){if(!b||!Number.isFinite(b.x))continue;R(c,b.x+12,b.y+b.h+7,Math.max(8,b.w-24),12,'rgba(39,32,26,.18)');R(c,b.x-5,b.y+b.h-10,5,10,'rgba(57,46,36,.18)');}}
function lotDetails(c){
 // Bancos, contenedores, estacionamiento y pequeñas imperfecciones; deterministas y fuera de accesos.
 const objects=[[520,760,'bench'],[900,760,'bin'],[1180,760,'bench'],[1880,760,'car'],[2140,760,'bin'],[740,1280,'bench'],[1710,1320,'car'],[1980,1320,'car'],[860,1880,'bin'],[1930,1880,'bench']];
 for(const [x,y,k] of objects){if(roadAt(x,y))continue;if(k==='bench'){R(c,x,y,38,7,'rgba(90,65,48,.68)');R(c,x+5,y+7,4,8,'rgba(74,55,43,.55)');R(c,x+29,y+7,4,8,'rgba(74,55,43,.55)')}else if(k==='bin'){R(c,x,y,18,20,'rgba(63,67,58,.55)');R(c,x-2,y-3,22,4,'rgba(48,50,45,.55)')}else{R(c,x,y,46,23,'rgba(70,64,56,.48)');R(c,x+6,y-6,30,7,'rgba(79,72,63,.48)');R(c,x+7,y+19,7,5,'rgba(42,39,35,.65)');R(c,x+32,y+19,7,5,'rgba(42,39,35,.65)')}}
}
function draw(c){if(!T.enabled)return;const t=performance.now()/1000;baseGround(c);zoneTexture(c);riverDraw(c,t);elevation(c,t);roadsVisual(c);irrigation(c,t);parcels(c,t);fences(c);trees(c,t);utilities(c);lotDetails(c);buildingDepth(c)}
function patch(){if(T.patched||!V.life?.drawWorld)return;const old=V.life.drawWorld;V.life.drawWorld=function(c){draw(c);old.call(this,c)};T.patched=true;T.features=['single-territorial-render-layer','urban-lot-texture','road-hierarchy-visuals','rural-road-surface','river-and-bridges','irrigation-network','field-row-crops','elevation-contours','erosion-scars','orchard-identity','poplar-lines','utility-infrastructure','fences','building-depth','human-scale-props','deterministic-world-detail','no-extra-loop'];}
patch();setTimeout(patch,250);setTimeout(patch,900);V.territorialVisuals=T;
})();