/* VILLA PELÓN V49 — MOTOR VISUAL TERRITORIAL
   Una sola capa visual coherente: suelo, calles, veredas, edificios, chacras,
   acequias, río, vegetación, mobiliario y profundidad pixel-art.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={}),life=V.life,geo=V.worldGeometry;
if(!life||!geo||!geo.buildings||life.__v49Visual)return;
life.__v49Visual=true;
const B=geo.buildings,W=3200,H=2000,RIVER=2920;
const roads=[
{x:0,y:230,w:2880,h:74,k:'main'},
{x:0,y:990,w:2880,h:74,k:'main'},
{x:455,y:0,w:102,h:2000,k:'street'},
{x:1825,y:0,w:102,h:2000,k:'street'},
{x:2675,y:0,w:102,h:2000,k:'street'},
{x:2840,y:0,w:66,h:2000,k:'river'}
];
const homes=B.filter(b=>b.type==='home');
function overlap(a,b){return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y}
/* Topología fija: ninguna vivienda puede ocupar una calzada. */
homes.forEach((h,i)=>{if(roads.some(r=>overlap(h,r))){h.x=i?720:690;h.y=i?850:430;}});
function px(c,x,y,w,h,col){c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h))}
function line(c,x1,y1,x2,y2,col,w=1){c.strokeStyle=col;c.lineWidth=w;c.beginPath();c.moveTo(x1,y1);c.lineTo(x2,y2);c.stroke()}
function text(c,s,x,y,size=11){c.font='bold '+size+'px monospace';c.textAlign='center';c.fillStyle='#eee3c5';c.fillText(s,x,y)}
function ground(c){
 px(c,0,0,RIVER,H,'#9cac7d');
 /* manchas de suelo y parcelas */
 for(let y=20;y<1940;y+=96)for(let x=35;x<2820;x+=128){const n=(x*13+y*7)%17;if(n<7)px(c,x,y,24+(n%3)*8,3,'rgba(67,89,62,.16)')}
 /* senderos rurales */
 line(c,1980,1165,2820,1165,'#c0aa7d',28);line(c,1980,1165,2820,1165,'#9d8a65',2);
 line(c,1960,1510,2800,1510,'#c0aa7d',24);line(c,1960,1510,2800,1510,'#9d8a65',2);
}
function street(c,r){
 px(c,r.x,r.y,r.w,r.h,'#535a51');
 if(r.k==='main'){px(c,r.x,r.y,r.w,4,'#b9b29d');px(c,r.x,r.y+r.h-4,r.w,4,'#b9b29d');for(let x=r.x+24;x<r.x+r.w;x+=72)px(c,x,r.y+r.h/2-2,38,4,'#d7cfad')}
 else if(r.k==='street'){px(c,r.x,r.y,4,r.h,'#b9b29d');px(c,r.x+r.w-4,r.y,4,r.h,'#b9b29d');for(let y=r.y+28;y<r.y+r.h;y+=72)px(c,r.x+r.w/2-2,y,4,36,'#d7cfad')}
 else {px(c,r.x,r.y,3,r.h,'#b9b29d');px(c,r.x+r.w-3,r.y,3,r.h,'#b9b29d')}
}
function sidewalks(c){
 [[0,216,2880,14],[0,304,2880,14],[0,976,2880,14],[0,1064,2880,14]].forEach(r=>px(c,...r,'#c3b99d'));
 [455,1825,2675].forEach(x=>{px(c,x-14,0,14,H,'#c3b99d');px(c,x+102,0,14,H,'#c3b99d')});
}
function river(c){
 px(c,RIVER,0,W-RIVER,H,'#71968f');
 for(let y=16;y<H;y+=42){line(c,RIVER+18,y,RIVER+190,y+7,'rgba(225,239,218,.42)',2);line(c,RIVER+105,y+18,RIVER+250,y+12,'rgba(55,91,88,.28)',2)}
 for(let y=20;y<H;y+=84){px(c,RIVER-12,y,12,4,'#b5c39a');px(c,RIVER+W-RIVER-4,y+31,4,4,'#b5c39a')}
}
function building(c,b){
 const roof=b.type==='school'?'#a85f49':b.type==='shop'?'#7c6047':b.type==='radio'?'#526d58':b.type==='rural'?'#78634d':'#8b684d';
 const wall=b.type==='school'?'#e0c99d':b.type==='shop'?'#d4b98c':b.type==='radio'?'#c6b98e':b.type==='rural'?'#b69b73':'#d7bd8e';
 /* sombra + zócalo */
 px(c,b.x+9,b.y+12,b.w,b.h,'rgba(39,42,32,.22)');
 px(c,b.x,b.y,b.w,b.h,wall);px(c,b.x,b.y,b.w,8,roof);px(c,b.x,b.y+8,b.w,5,'#59483b');
 /* techo escalonado pixel */
 px(c,b.x+12,b.y-7,b.w-24,7,roof);px(c,b.x+30,b.y-13,b.w-60,6,roof);
 /* ventanas */
 const cols=Math.max(1,Math.floor((b.w-50)/70));for(let i=0;i<cols;i++){const wx=b.x+25+i*70;px(c,wx,b.y+48,34,30,'#4d665f');px(c,wx+4,b.y+52,26,22,'#9eb8ad');px(c,wx+15,b.y+52,3,22,'#56635a');px(c,wx+4,b.y+62,26,3,'#56635a')}
 /* puerta */
 px(c,b.x+b.w/2-15,b.y+b.h-55,30,55,'#654b38');px(c,b.x+b.w/2-10,b.y+b.h-50,20,50,'#8a6446');px(c,b.x+b.w/2+5,b.y+b.h-28,3,3,'#e3c66f');
 /* cartel */
 const label=b.label||'';px(c,b.x+b.w/2-48,b.y+b.h-82,96,18,'#35453a');text(c,label,b.x+b.w/2,b.y+b.h-69,9);
}
function fence(c,x,y,w,h){for(let xx=x;xx<=x+w;xx+=24){px(c,xx,y,5,24,'#73583d');px(c,xx,y+h-24,5,24,'#73583d')}line(c,x,y+5,x+w,y+5,'#806443',3);line(c,x,y+h-6,x+w,y+h-6,'#806443',3)}
function tree(c,x,y,s=1){px(c,x-4*s,y+13*s,8*s,24*s,'#705238');px(c,x-22*s,y-3*s,44*s,28*s,'#3f6946');px(c,x-13*s,y-17*s,26*s,18*s,'#5e8050');px(c,x-5*s,y-23*s,14*s,10*s,'#6f8e58')}
function pole(c,x,y){px(c,x,y,6,52,'#55554b');px(c,x-7,y,20,5,'#4e514a');line(c,x+3,y+4,x+92,y-3,'#343c35',2)}
function lamps(c,x,y){px(c,x,y,5,34,'#4c5047');px(c,x-7,y,19,5,'#e0cc86');px(c,x-3,y+5,11,7,'#f0dfa0')}
function mark(c){
 /* plaza y centro cívico */
 px(c,1030,330,270,120,'#aab78b');px(c,1050,350,230,80,'#b9c19a');
 for(let x=1070;x<1270;x+=48)tree(c,x,350,.65);
 px(c,1135,382,60,16,'#7e9b7b');px(c,1158,374,14,34,'#65765d');
 text(c,'PLAZA CENTRAL',1165,458,10);
 /* chacras y límites */
 fence(c,1980,1180,760,250);fence(c,2520,790,310,180);
 for(let x=2020;x<2700;x+=46)for(let y=1210;y<1400;y+=38){px(c,x,y,28,3,'#788d58')}
 /* mobiliario */
 [[850,650],[1330,650],[2040,650],[650,1180],[1540,1180]].forEach(([x,y])=>{px(c,x,y,42,6,'#74583f');px(c,x+4,y+6,4,15,'#5d4938');px(c,x+34,y+6,4,15,'#5d4938')});
}
function labels(c){text(c,'AVENIDA PRINCIPAL',1440,208,10);text(c,'CALLE DEL RÍO',2708,965,10);text(c,'CAMINO A LAS CHACRAS',2350,1578,10);text(c,'RÍO',3060,80,11)}
function paint(c){
 ground(c);roads.forEach(r=>street(c,r));sidewalks(c);river(c);
 mark(c);
 /* edificios detrás de peatones pero con base visual consistente */
 B.forEach(b=>building(c,b));
 [[150,180],[900,180],[1400,180],[2300,180],[150,1210],[1350,1210],[2250,1210]].forEach(p=>pole(c,...p));
 [[980,600],[1330,600],[2020,600],[600,1170],[1500,1170],[2500,740]].forEach(p=>lamps(c,...p));
 [[120,340],[980,370],[1500,430],[2100,360],[320,900],[1050,920],[1500,900],[2250,850],[2750,1450]].forEach(p=>tree(c,...p));
 labels(c);
}
const old=life.drawWorld;
life.drawWorld=function(c){paint(c);if(old)old(c)};
V.worldVisual={version:'V49',roads,riverX:RIVER,homesOutsideRoads:homes.every(h=>!roads.some(r=>overlap(h,r)))};
})();
