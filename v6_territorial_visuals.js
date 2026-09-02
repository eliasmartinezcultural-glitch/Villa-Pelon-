/* Villa Pelón V6.14 — CAPA VISUAL TERRITORIAL
   El territorio deja de ser una colección de manchas: esta capa construye
   continuidad visual entre ciudad, borde productivo y chacras.
   Se dibuja dentro del pipeline de vida, antes de personajes/actividad.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const T=V.territorialVisuals=V.territorialVisuals||{version:1,enabled:true,patched:false};
const rect=(c,x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),Math.max(1,Math.round(w)),Math.max(1,Math.round(h)))};
const line=(c,x1,y1,x2,y2,col,lw=1)=>{c.strokeStyle=col;c.lineWidth=lw;c.beginPath();c.moveTo(Math.round(x1),Math.round(y1));c.lineTo(Math.round(x2),Math.round(y2));c.stroke()};
const roads=()=>[...(V.streetSystem?.roads||[])];
const onRoad=(x,y)=>V.streetSystem?.onRoad?V.streetSystem.onRoad(x,y):false;
function zoneGround(c){
 const urban=[{x:80,y:260,w:2140,h:430},{x:80,y:930,w:2050,h:420},{x:700,y:1370,w:1800,h:700}];
 urban.forEach((r,i)=>rect(c,r.x,r.y,r.w,r.h,i%2?'rgba(154,132,98,.055)':'rgba(177,151,107,.045)'));
 rect(c,2200,1040,1900,1050,'rgba(125,108,73,.065)');
 rect(c,2350,1280,1600,720,'rgba(104,117,70,.075)');
 rect(c,3000,2700,4000,2800,'rgba(115,105,72,.055)');
}
function elevation(c,t){
 for(let band=0;band<9;band++){
  const y=1080+band*112;let prevX=2180;
  for(let i=0;i<20;i++){
   const x=2180+i*105,yy=y+Math.sin(i*.65+band*.8)*18+Math.sin(t*.08+i)*1.5;
   if(!onRoad(x,yy)&&!onRoad(prevX,yy))line(c,prevX,yy,x-12,yy+Math.sin(i+band)*4,'rgba(82,76,60,.14)',2);
   prevX=x;
  }
 }
 for(let i=0;i<34;i++){const x=2200+(i*149)%1900,y=1130+(i*97)%940;if(!onRoad(x,y)){line(c,x,y,x+12+(i%4)*5,y+2+(i%3),'rgba(91,77,57,.22)',1);if(i%5===0)rect(c,x+16,y+3,4,2,'rgba(113,94,65,.24)')}}
}
function roadEdges(c){
 for(const r of roads()){
  if(r.w>r.h){rect(c,r.x,r.y-7,r.w,5,'rgba(107,91,70,.13)');rect(c,r.x,r.y+r.h+2,r.w,5,'rgba(107,91,70,.13)');for(let x=r.x+18;x<r.x+r.w;x+=83){rect(c,x,r.y-10,20,2,'rgba(125,106,76,.20)');rect(c,x+37,r.y+r.h+5,16,2,'rgba(125,106,76,.18)')}}
  else{rect(c,r.x-7,r.y,5,r.h,'rgba(107,91,70,.13)');rect(c,r.x+r.w+2,r.y,5,r.h,'rgba(107,91,70,.13)');for(let y=r.y+18;y<r.y+r.h;y+=83){rect(c,r.x-10,y,2,20,'rgba(125,106,76,.20)');rect(c,r.x+r.w+5,y+35,2,16,'rgba(125,106,76,.18)')}}
 }
}
function irrigation(c,t){
 const channels=[[[2440,1195],[3100,1195],[3600,1250]],[[2505,1200],[2505,1665]],[[3195,1295],[3770,1295]],[[2590,1930],[3730,1930]]];
 for(const pts of channels)for(let i=0;i<pts.length-1;i++){const a=pts[i],b=pts[i+1];line(c,a[0],a[1],b[0],b[1],'rgba(105,87,62,.34)',7);line(c,a[0],a[1]-1,b[0],b[1]-1,'rgba(119,132,103,.42)',3);line(c,a[0],a[1]-3,b[0],b[1]-3,'rgba(181,183,139,.30)',1)}
 for(let i=0;i<18;i++){const x=2440+(i*71)%1300,y=1195+Math.sin(i*1.7+t*.3)*2;rect(c,x,y-1,7,1,'rgba(218,218,180,.34)')}
}
function parcels(c){
 const ps=V.agriculturalCycle?.parcels||[];
 ps.forEach(p=>{const g=Math.max(0,Math.min(1,Number(p.growth)||0));rect(c,p.x-5,p.y-5,p.w+10,p.h+10,'rgba(76,62,43,.13)');rect(c,p.x,p.y,p.w,p.h,'rgba(119,117,72,'+(0.055+g*.025).toFixed(3)+')');[[p.x,p.y],[p.x+p.w,p.y],[p.x,p.y+p.h],[p.x+p.w,p.y+p.h]].forEach(q=>rect(c,q[0]-2,q[1]-6,4,9,'rgba(73,60,46,.72)'));const gx=p.x+p.w*.12,gy=p.y+p.h*.5;rect(c,gx-8,gy-2,16,4,'rgba(196,170,113,.48)')});
}
function orchard(c,t){
 const rows=[[2350,1050,6,72],[3820,1070,7,70],[2360,2010,7,66],[3920,2040,5,72],[4060,1180,6,82]];
 rows.forEach((l,li)=>{for(let i=0;i<l[2];i++){const x=l[0]+i*l[3],y=l[1]+Math.sin(i*1.4+li)*13,scale=.8+(i%3)*.12;rect(c,x-3,y,6,16*scale,'rgba(84,67,49,.72)');rect(c,x-14,y-12,28,14,'rgba(72,95,58,.62)');rect(c,x-9,y-20,18,9,'rgba(92,111,66,.55)')}});
}
function ruralInfrastructure(c){
 [[4180,2150,80,28],[4380,2180,115,32],[4630,2160,92,30],[4860,2170,130,34]].forEach(b=>{rect(c,b[0],b[1],b[2],b[3],'rgba(92,72,52,.30)');rect(c,b[0]+8,b[1]-8,b[2]-16,8,'rgba(111,90,64,.28)');for(let x=b[0]+14;x<b[0]+b[2]-8;x+=24)rect(c,x,b[1]+7,4,9,'rgba(70,61,51,.30)')});
 [[2250,1030,4100,1030],[2250,2080,4100,2080],[2200,1030,2200,2080],[4100,1030,4100,2080]].forEach(([x1,y1,x2,y2])=>{line(c,x1,y1,x2,y2,'rgba(83,68,51,.30)',1);const d=Math.hypot(x2-x1,y2-y1);for(let s=0;s<=d;s+=48){const f=s/Math.max(1,d),x=x1+(x2-x1)*f,y=y1+(y2-y1)*f;rect(c,x-1,y-6,2,8,'rgba(73,62,50,.42)')}});
}
function depth(c){for(const b of(V.buildings||[])){if(!b||!Number.isFinite(b.x))continue;rect(c,b.x+10,b.y+b.h+5,b.w-20,10,'rgba(43,37,31,.12)')}}
function draw(c){if(!T.enabled)return;zoneGround(c);elevation(c,Number(V.life?.phase)||0);roadEdges(c);irrigation(c,Number(V.life?.phase)||0);parcels(c);orchard(c,Number(V.life?.phase)||0);ruralInfrastructure(c);depth(c)}
function patch(){if(T.patched||!V.life?.drawWorld)return;const old=V.life.drawWorld;V.life.drawWorld=function(c){draw(c);old.call(this,c)};T.patched=true;T.features=['territorial-ground','urban-rural-transition','elevation-bands','erosion-detail','road-shoulders','irrigation-banks','parcel-identity','orchard-rows','rural-infrastructure','building-depth'];}
patch();setTimeout(patch,250);setTimeout(patch,900);V.territorialVisuals=T;
})();