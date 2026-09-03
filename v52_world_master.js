/* VILLA PELÓN V52 — MASTER WORLD: topología, rutas, río y acabado pixel-art.
   No crea otro loop: se integra al renderer existente.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={}),life=V.life,geo=V.worldGeometry;
if(!life||!geo)return;
const W=3200,H=2000,RIVER=2920;
const roads=[
{x:0,y:226,w:2880,h:82,name:'AVENIDA PRINCIPAL',kind:'avenue'},
{x:0,y:608,w:2880,h:58,name:'CALLE DEL CENTRO',kind:'street'},
{x:0,y:986,w:2880,h:82,name:'AVENIDA DEL RÍO',kind:'avenue'},
{x:0,y:1450,w:2880,h:54,name:'CAMINO DE LAS CHACRAS',kind:'rural'},
{x:455,y:0,w:104,h:2000,name:'CALLE OESTE',kind:'street'},
{x:1118,y:0,w:86,h:1450,name:'CALLE DE LA PLAZA',kind:'street'},
{x:1822,y:0,w:108,h:2000,name:'CALLE DE LA ESTACIÓN',kind:'street'},
{x:2490,y:0,w:82,h:2000,name:'CALLE DE LOS CHACAREROS',kind:'street'},
{x:2670,y:0,w:108,h:2000,name:'CALLE DEL RÍO',kind:'street'},
{x:2838,y:0,w:72,h:2000,name:'COSTANERA',kind:'river'}
];
const overlap=(a,b,p=0)=>a.x<b.x+b.w+p&&a.x+a.w>b.x-p&&a.y<b.y+b.h+p&&a.y+a.h>b.y-p;
const homes=(geo.buildings||[]).filter(b=>b.type==='home');
const safeHomes=[{x:660,y:390,w:190,h:140,label:'VIVIENDA NORTE'},{x:690,y:800,w:205,h:150,label:'VIVIENDA SUR'},{x:1320,y:720,w:190,h:135,label:'VIVIENDA ESTE'}];
homes.forEach((h,i)=>{if(roads.some(r=>overlap(h,r,2))){Object.assign(h,safeHomes[Math.min(i,safeHomes.length-1)])}});
function rect(c,x,y,w,h,fill){c.fillStyle=fill;c.fillRect(x|0,y|0,w|0,h|0)}
function stroke(c,x1,y1,x2,y2,fill,w=1){c.strokeStyle=fill;c.lineWidth=w;c.beginPath();c.moveTo(x1,y1);c.lineTo(x2,y2);c.stroke()}
function road(c,r){rect(c,r.x,r.y,r.w,r.h,r.kind==='rural'?'#9c8968':'#50564f');
 if(r.kind!=='rural'){rect(c,r.x,r.y,r.w,4,'#bcb59e');rect(c,r.x,r.y+r.h-4,r.w,4,'#bcb59e')}
 if(r.kind==='avenue'){for(let x=r.x+18;x<r.x+r.w;x+=78)rect(c,x,r.y+r.h/2-2,38,4,'#d9d0ad')}
 if(r.kind==='street'){for(let y=r.y+18;y<r.y+r.h;y+=78)rect(c,r.x+r.w/2-2,y,4,38,'#d9d0ad')}
 if(r.kind==='rural'){stroke(c,r.x,r.y+2,r.x+r.w,r.y+2,'#b9a47d',2);stroke(c,r.x,r.y+r.h-2,r.x+r.w,r.y+r.h-2,'#806f55',2)}
}
function sidewalk(c,r){if(r.kind==='rural')return;if(r.w>r.h){rect(c,r.x,r.y-11,r.w,11,'#c7bea4');rect(c,r.x,r.y+r.h,r.w,11,'#c7bea4')}else{rect(c,r.x-11,r.y,11,r.h,'#c7bea4');rect(c,r.x+r.w,r.y,11,r.h,'#c7bea4')}}
function tree(c,x,y,s=1){rect(c,x-4*s,y+12*s,8*s,24*s,'#6b503a');rect(c,x-20*s,y-5*s,40*s,28*s,'#3f6747');rect(c,x-12*s,y-16*s,24*s,17*s,'#5c7f50');rect(c,x-5*s,y-23*s,13*s,9*s,'#75905b')}
function fence(c,x,y,w,h){for(let i=0;i<=w;i+=24)rect(c,x+i,y,5,24,'#73583e');for(let i=0;i<=w;i+=24)rect(c,x+i,y+h-24,5,24,'#73583e');stroke(c,x,y+6,x+w,y+6,'#806443',3);stroke(c,x,y+h-7,x+w,y+h-7,'#806443',3)}
function pole(c,x,y){rect(c,x,y,6,50,'#55564d');rect(c,x-7,y,20,5,'#4d514b');stroke(c,x+3,y+4,x+92,y-3,'#343b35',2)}
function lamp(c,x,y){rect(c,x,y,5,35,'#4d5148');rect(c,x-7,y,19,5,'#d9c888');rect(c,x-4,y+5,12,7,'#f1dfa0')}
function plaza(c){rect(c,1010,330,290,140,'#aeb991');rect(c,1030,350,250,100,'#bec6a0');for(let x=1050;x<1270;x+=48)tree(c,x,355,.62);rect(c,1128,390,74,14,'#80977a');rect(c,1159,375,12,35,'#63765e')}
function river(c){rect(c,RIVER,0,W-RIVER,H,'#70968e');for(let y=18;y<H;y+=44){stroke(c,RIVER+18,y,RIVER+190,y+8,'rgba(230,240,222,.38)',2);stroke(c,RIVER+95,y+23,RIVER+260,y+17,'rgba(44,79,78,.24)',2)}rect(c,RIVER-12,0,12,H,'#9aa980')}
function ground(c){rect(c,0,0,RIVER,H,'#9eaf7d');for(let y=32;y<1940;y+=88)for(let x=24;x<2820;x+=112){const n=(x*7+y*11)%19;if(n<8){rect(c,x,y,18+(n%3)*6,3,'rgba(56,78,53,.18)');if(n%4===0)rect(c,x+24,y+4,4,3,'rgba(70,92,60,.16)')}}}
function markings(c){[[455,226],[1118,226],[1822,226],[2490,226],[2670,226],[455,986],[1118,986],[1822,986],[2490,986],[2670,986]].forEach(([x,y])=>{rect(c,x-30,y-8,60,5,'#e0d5b1');rect(c,x-30,y+85,60,5,'#e0d5b1')})}
function draw(c){ground(c);roads.forEach(r=>road(c,r));roads.forEach(r=>sidewalk(c,r));markings(c);river(c);plaza(c);
 [[120,150],[900,150],[1460,150],[2200,150],[120,1180],[1460,1180],[2300,1180]].forEach(p=>pole(c,...p));
 [[970,550],[1320,550],[2020,550],[600,1160],[1510,1160],[2580,730]].forEach(p=>lamp(c,...p));
 [[130,350],[930,370],[1490,430],[2160,360],[300,900],[1020,900],[1510,900],[2200,840],[2580,1510]].forEach(p=>tree(c,...p));
 fence(c,1940,1180,430,250);fence(c,2410,1160,420,270);
}
if(!life.__v52Master){life.__v52Master=true;const old=life.drawWorld;life.drawWorld=function(c){draw(c);if(old)old(c)}}
V.worldMaster={version:'V52',roads,riverX:RIVER,homesOutsideRoads:homes.every(h=>!roads.some(r=>overlap(h,r,2))),worldBounds:{w:W,h:H}};
})();
