/* Villa Pelón V6.6 — DETALLE AMBIENTAL
   Pequeños indicios de vida: ropa, bancos, macetas, humo, polvo, riego y actividad.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});const D=V.v6WorldDetail=V.v6WorldDetail||{version:2,enabled:true};
function rect(c,x,y,w,h,col){c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),Math.max(1,Math.round(w)),Math.max(1,Math.round(h)))}
function wrap(){const life=V.life;if(!life||D.patched)return;if(typeof life.drawWorld!=='function')return;const original=life.drawWorld;life.drawWorld=function(c){original.call(life,c);const t=life.phase||0;[[930,760],[1510,760],[1110,1020]].forEach(p=>{rect(c,p[0]-18,p[1],36,5,'#5d4635');rect(c,p[0]-15,p[1]-6,4,7,'#49372b');rect(c,p[0]+11,p[1]-6,4,7,'#49372b')});[[720,635],[870,635],[1530,1190],[1690,1190]].forEach((p,i)=>{rect(c,p[0]-4,p[1],8,6,'#8a5a3d');rect(c,p[0]-7,p[1]-7,14,7,i%2?'#60744b':'#718054')});rect(c,1860,640,2,36,'#564438');rect(c,1850,646,22,2,'#564438');rect(c,1853,649,7,10,'#e4d4ae');rect(c,1862,649,8,10,'#c8a987');for(const b of(V.buildings||[])){if(b.type==='home'||b.type==='bakery'){const x=b.x+b.w*.72,y=b.y-72;for(let i=0;i<3;i++){const ox=Math.sin(t*.7+i)*3;rect(c,x+ox,y-i*8,3,3,'rgba(90,82,67,.20)')}}}if(life.weather==='viento'||life.weather==='despejado'){for(let i=0;i<12;i++){const x=(i*317+t*24)%4200,y=690+(i*97)%1000;rect(c,x,y,3,2,'rgba(210,190,145,.35)')}}for(let i=0;i<10;i++){const x=2600+i*28,y=1320+Math.sin(t*2+i)*2;rect(c,x,y,8,2,'rgba(220,235,215,.32)')}for(const b of(life.birds||[])){const flap=Math.sin(t*8+b.x*.01)>0?0:2;rect(c,b.x+4,b.y-flap,4,2,'#2a302a')}};D.patched=true;V.v6WorldDetail=D}
if(V.life)wrap();
})();
