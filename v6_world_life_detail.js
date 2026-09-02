/* Villa Pelón V6.9.5 — DETALLE TERRITORIAL, RELIEVE Y VIDA COTIDIANA
   Extiende el renderer ambiental existente sin crear otro bucle, física ni sistema paralelo. */
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});const D=V.v6WorldDetail=V.v6WorldDetail||{version:3,enabled:true};
function rect(c,x,y,w,h,col){c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),Math.max(1,Math.round(w)),Math.max(1,Math.round(h)))}
function line(c,x1,y1,x2,y2,col,lw=2){c.strokeStyle=col;c.lineWidth=lw;c.beginPath();c.moveTo(Math.round(x1),Math.round(y1));c.lineTo(Math.round(x2),Math.round(y2));c.stroke()}
function outsideRoad(x,y){const r=V.streetSystem?.onRoad;return typeof r==='function'?!r(x,y):!(y>=700&&y<=930)&&!(x>=1180&&x<=1400)}
function terrain(c,t){
 /* Relieve suave en la transición urbano-rural: curvas de nivel, erosión y piedras. */
 for(let band=0;band<6;band++){const y=1160+band*78;let px=2280;for(let i=0;i<18;i++){const x=px+i*58;const yy=y+Math.sin(i*.9+band)*9;line(c,x,yy,x+38,yy+Math.sin(i+band)*3,'rgba(91,79,60,.16)',2)}}
 for(let i=0;i<26;i++){const x=2260+(i*137)%1750,y=1180+(i*211)%1080;if(outsideRoad(x,y)){rect(c,x,y,3+(i%3)*2,2,'rgba(103,83,61,.30)');if(i%4===0)rect(c,x+7,y-3,2,5,'rgba(84,103,62,.42)')}}
 /* Banquina/ripio irregular en el acceso productivo. */
 for(let i=0;i<18;i++){const x=3000+i*42,y=2700+(i%3)*7;rect(c,x,y,22,2,'rgba(108,91,70,.20)');if(i%3===0)rect(c,x+25,y+4,4,3,'rgba(88,76,61,.30)')}
 /* Acequias/canales: trazas estrechas que conectan visualmente el tejido productivo. */
 [[2480,1190,3150,1190],[3190,1290,3790,1290],[2520,1190,2520,1660]].forEach(([x1,y1,x2,y2])=>{line(c,x1,y1,x2,y2,'rgba(79,92,78,.34)',4);line(c,x1,y1-2,x2,y2-2,'rgba(161,151,112,.22)',2)});
 /* Bordes de chacra y caminos de servicio, sin atravesar calles principales. */
 for(let i=0;i<12;i++){const x=2350+i*105,y=1740+(i%3)*9;if(outsideRoad(x,y)){rect(c,x,y,62,3,'rgba(126,103,76,.24)');rect(c,x+12,y+5,30,2,'rgba(83,94,66,.22)')}}
 /* Huellas de uso en accesos rurales. */
 for(let i=0;i<10;i++){const x=2350+i*82,y=1810+(i%2)*12;rect(c,x,y,30,2,'rgba(72,62,51,.20)');rect(c,x+4,y+7,24,2,'rgba(72,62,51,.14)')}
}
function props(c,t){
 for(const b of(V.buildings||[])){if(!b||!Number.isFinite(b.x))continue;
  if(b.type==='home'){const x=b.x+b.w*.18,y=b.y+b.h+18;rect(c,x,y,24,8,'#5a4635');rect(c,x+3,y-5,4,5,'#786047');rect(c,x+29,y+2,8,7,'#5d6a50');line(c,x+8,y-1,x+20,y-1,'#927957',1)}
  if(b.type==='shop'||b.type==='bakery'){const x=b.x+b.w*.82,y=b.y+b.h+10;rect(c,x,y,15,12,'#48534a');rect(c,x+2,y-4,11,4,'#6b755d')}
  if(b.type==='rural'){const x=b.x+b.w*.1,y=b.y+b.h+14;for(let i=0;i<5;i++){rect(c,x+i*18,y,10,3,'#756044');rect(c,x+i*18,y+5,10,2,'#594936')}}
 }
 /* Alambrados como transición realista urbano-productiva. */
 [[2500,1230,3150,1230],[2500,1230,2500,1670],[3180,1260,3800,1260],[3180,1260,3180,1660]].forEach(([x1,y1,x2,y2])=>{line(c,x1,y1,x2,y2,'#675441',1);for(let d=0;d<=Math.hypot(x2-x1,y2-y1);d+=42){const f=d/Math.max(1,Math.hypot(x2-x1,y2-y1));rect(c,x1+(x2-x1)*f-1,y1+(y2-y1)*f-5,2,9,'#55463a')}});
 /* Hileras agrícolas con variación de crecimiento. */
 for(let r=0;r<7;r++){const y=1335+r*42;for(let i=0;i<24;i++){const x=2590+i*24+(r%2)*5;const sway=Math.sin(t*1.4+i+r)*1.5;rect(c,x,y+sway,9,2,'#61734d');rect(c,x+3,y-4+sway,3,4,'#71845a')}}
 /* Árboles de borde de chacra: masas pequeñas, irregulares y no bloqueantes. */
 [[2450,1280],[2468,1320],[3780,1320],[3810,1370],[2425,1680],[3860,1650]].forEach(([x,y],i)=>{rect(c,x-3,y-10,6,12,'#5b4935');rect(c,x-10,y-18,20,10,i%2?'#637651':'#71805b');rect(c,x-6,y-24,13,8,'#536a4b')});
 /* Infraestructura urbana: postes/cables. */
 [[520,520],[1220,520],[1760,520],[2260,760],[2260,1120],[1460,1500],[2020,1500]].forEach(([x,y],i)=>{rect(c,x,y-72,3,72,'#51463d');rect(c,x-8,y-72,19,3,'#51463d');if(i%2===0)line(c,x+2,y-69,x+55,y-57,'rgba(55,51,46,.65)',1)});
 /* Vehículos estacionados fuera del corredor principal. */
 [[650,1030],[980,1120],[1560,1040],[1960,680],[2100,1180]].forEach(([x,y],i)=>{rect(c,x,y,32,14,'#50473f');rect(c,x+5,y-4,19,5,'#665d53');rect(c,x+5,y+11,6,5,'#292621');rect(c,x+22,y+11,6,5,'#292621');if(i%2===0)rect(c,x+7,y+1,7,3,'#9a8b6d')});
 /* Mobiliario, macetas y señal. */
 [[930,760],[1510,760],[1110,1020]].forEach(p=>{rect(c,p[0]-18,p[1],36,5,'#5d4635');rect(c,p[0]-15,p[1]-6,4,7,'#49372b');rect(c,p[0]+11,p[1]-6,4,7,'#49372b')});
 [[720,635],[870,635],[1530,1190],[1690,1190]].forEach((p,i)=>{rect(c,p[0]-4,p[1],8,6,'#8a5a3d');rect(c,p[0]-7,p[1]-7,14,7,i%2?'#60744b':'#718054')});
 rect(c,1848,640,4,38,'#564438');rect(c,1840,646,22,2,'#564438');rect(c,1843,649,7,10,'#e4d4ae');rect(c,1852,649,8,10,'#c8a987');
 /* Uso cotidiano: polvo, huellas y desgaste. */
 for(let i=0;i<34;i++){const x=320+(i*173)%3650,y=470+(i*113)%1250;if(outsideRoad(x,y)){rect(c,x,y,3+(i%3),2,'rgba(104,86,65,.35)');if(i%5===0)rect(c,x+7,y+3,2,2,'rgba(82,69,55,.45)')}}
 /* Microarquitectura: retiros y bordes de lote visibles mediante pequeñas entradas, no muros artificiales. */
 [[690,680],[1510,1210],[2350,1170],[3220,690]].forEach(([x,y],i)=>{rect(c,x,y,18,3,'rgba(91,73,54,.28)');rect(c,x+22,y-2,7,7,'rgba(121,105,78,.30)');if(i%2===0)rect(c,x+34,y,3,10,'rgba(76,68,56,.30)')});
}
function ambience(c,t,life){
 for(const b of(V.buildings||[])){if(b.type==='home'||b.type==='bakery'){const x=b.x+b.w*.72,y=b.y-72;for(let i=0;i<3;i++){const ox=Math.sin(t*.7+i)*3;rect(c,x+ox,y-i*8,3,3,'rgba(90,82,67,.20)')}}}
 if(life.weather==='viento'||life.weather==='despejado')for(let i=0;i<12;i++){const x=(i*317+t*24)%4200,y=690+(i*97)%1000;rect(c,x,y,3,2,'rgba(210,190,145,.35)')}
 for(let i=0;i<10;i++){const x=2600+i*28,y=1320+Math.sin(t*2+i)*2;rect(c,x,y,8,2,'rgba(220,235,215,.32)')}
 for(const b of(life.birds||[])){const flap=Math.sin(t*8+b.x*.01)>0?0:2;rect(c,b.x+4,b.y-flap,4,2,'#2a302a')}
 /* Pequeños cambios de actividad: ropa tendida, hojas y polvo que responden al tiempo. */
 for(let i=0;i<6;i++){const x=760+i*31,y=660+Math.sin(t*1.2+i)*1.5;rect(c,x,y,10,2,'rgba(185,166,130,.30)')}
}
function wrap(){const life=V.life;if(!life||D.patched)return;if(typeof life.drawWorld!=='function')return;const original=life.drawWorld;life.drawWorld=function(c){original.call(life,c);const t=Number(life.phase||0);terrain(c,t);props(c,t);ambience(c,t,life)};D.patched=true;D.features=['terrain-contours','rural-transition','irrigation-ditches','farm-borders','service-tracks','patios','rural-fences','crop-rows','orchard-edges','utility-poles','parked-vehicles','surface-wear','street-furniture','ambient-motion']}
if(V.life)wrap();else setTimeout(wrap,250);setTimeout(wrap,900);V.v6WorldDetail=D;
})();