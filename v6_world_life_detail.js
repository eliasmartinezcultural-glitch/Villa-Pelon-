/* Villa Pelón V6.9.3 — DETALLE TERRITORIAL Y VIDA COTIDIANA
   Extiende el render ambiental existente sin crear otro bucle, física ni sistema de mundo.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});const D=V.v6WorldDetail=V.v6WorldDetail||{version:3,enabled:true};
function rect(c,x,y,w,h,col){c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),Math.max(1,Math.round(w)),Math.max(1,Math.round(h)))}
function line(c,x1,y1,x2,y2,col,lw=2){c.strokeStyle=col;c.lineWidth=lw;c.beginPath();c.moveTo(Math.round(x1),Math.round(y1));c.lineTo(Math.round(x2),Math.round(y2));c.stroke()}
function wrap(){const life=V.life;if(!life||D.patched)return;if(typeof life.drawWorld!=='function')return;const original=life.drawWorld;life.drawWorld=function(c){original.call(life,c);const t=life.phase||0;
/* Patio y equipamiento cotidiano: se ubican junto a construcciones, no sobre calles. */
for(const b of(V.buildings||[])){if(b.type==='home'){const x=b.x+b.w*.18,y=b.y+b.h+18;rect(c,x,y,24,8,'#5a4635');rect(c,x+3,y-5,4,5,'#786047');rect(c,x+29,y+2,8,7,'#5d6a50');line(c,x+8,y-1,x+20,y-1,'#927957',1)}
if(b.type==='shop'||b.type==='bakery'){const x=b.x+b.w*.82,y=b.y+b.h+10;rect(c,x,y,15,12,'#48534a');rect(c,x+2,y-4,11,4,'#6b755d')}
if(b.type==='rural'){const x=b.x+b.w*.1,y=b.y+b.h+14;for(let i=0;i<5;i++){rect(c,x+i*18,y,10,3,'#756044');rect(c,x+i*18,y+5,10,2,'#594936')}}}
/* Alambrados: límites de chacras y bordes rurales, siempre fuera de edificios. */
[[2500,1230,3150,1230],[2500,1230,2500,1670],[3180,1260,3800,1260],[3180,1260,3180,1660]].forEach(([x1,y1,x2,y2])=>{line(c,x1,y1,x2,y2,'#675441',1);for(let d=0;d<=Math.hypot(x2-x1,y2-y1);d+=42){const f=d/Math.max(1,Math.hypot(x2-x1,y2-y1));rect(c,x1+(x2-x1)*f-1,y1+(y2-y1)*f-5,2,9,'#55463a')}});
/* Hileras de cultivo: ritmo visual agrícola, sin convertirlas en colisión. */
for(let r=0;r<7;r++){const y=1335+r*42;for(let i=0;i<24;i++){const x=2590+i*24+(r%2)*5;const sway=Math.sin(t*1.4+i+r)*1.5;rect(c,x,y+sway,9,2,'#61734d');rect(c,x+3,y-4+sway,3,4,'#71845a')}}
/* Infraestructura de calle: postes, cableado y pequeños indicios de mantenimiento. */
[[520,520],[1220,520],[1760,520],[2260,760],[2260,1120],[1460,1500],[2020,1500]].forEach(([x,y],i)=>{rect(c,x,y-72,3,72,'#51463d');rect(c,x-8,y-72,19,3,'#51463d');if(i%2===0)line(c,x+2,y-69,x+55,y-57,'rgba(55,51,46,.65)',1)});
/* Vehículos estacionados: siluetas fuera del corredor principal para reforzar escala urbana. */
[[650,1030],[980,1120],[1560,1040],[1960,680],[2100,1180]].forEach(([x,y],i)=>{rect(c,x,y,32,14,'#50473f');rect(c,x+5,y-4,19,5,'#665d53');rect(c,x+5,y+11,6,5,'#292621');rect(c,x+22,y+11,6,5,'#292621');if(i%2===0)rect(c,x+7,y+1,7,3,'#9a8b6d')});
/* Rastros de uso: piedras, polvo y pequeñas manchas; patrón determinista, no ruido por frame. */
for(let i=0;i<34;i++){const x=320+(i*173)%3650,y=470+(i*113)%1250;if((x>1120&&x<1430)||(y>780&&y<850))continue;rect(c,x,y,3+(i%3),2,'rgba(104,86,65,.35)');if(i%5===0)rect(c,x+7,y+3,2,2,'rgba(82,69,55,.45)')}
/* Bancos, macetas y señales ya existentes. */
[[930,760],[1510,760],[1110,1020]].forEach(p=>{rect(c,p[0]-18,p[1],36,5,'#5d4635');rect(c,p[0]-15,p[1]-6,4,7,'#49372b');rect(c,p[0]+11,p[1]-6,4,7,'#49372b')});
[[720,635],[870,635],[1530,1190],[1690,1190]].forEach((p,i)=>{rect(c,p[0]-4,p[1],8,6,'#8a5a3d');rect(c,p[0]-7,p[1]-7,14,7,i%2?'#60744b':'#718054')});
/* Cartelería y equipamiento de un pueblo. */
rect(c,1848,640,4,38,'#564438');rect(c,1840,646,22,2,'#564438');rect(c,1843,649,7,10,'#e4d4ae');rect(c,1852,649,8,10,'#c8a987');
/* Actividad ambiental: humo, polvo, agua y aves. */
for(const b of(V.buildings||[])){if(b.type==='home'||b.type==='bakery'){const x=b.x+b.w*.72,y=b.y-72;for(let i=0;i<3;i++){const ox=Math.sin(t*.7+i)*3;rect(c,x+ox,y-i*8,3,3,'rgba(90,82,67,.20)')}}}
if(life.weather==='viento'||life.weather==='despejado'){for(let i=0;i<12;i++){const x=(i*317+t*24)%4200,y=690+(i*97)%1000;rect(c,x,y,3,2,'rgba(210,190,145,.35)')}}
for(let i=0;i<10;i++){const x=2600+i*28,y=1320+Math.sin(t*2+i)*2;rect(c,x,y,8,2,'rgba(220,235,215,.32)')}
for(const b of(life.birds||[])){const flap=Math.sin(t*8+b.x*.01)>0?0:2;rect(c,b.x+4,b.y-flap,4,2,'#2a302a')}
};D.patched=true;D.features=['patios','rural-fences','crop-rows','utility-poles','parked-vehicles','surface-wear','street-furniture','ambient-motion'];V.v6WorldDetail=D}
if(V.life)wrap();
})();
