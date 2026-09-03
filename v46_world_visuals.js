/* Villa Pelón V46 — integración visual del mundo vivo + dirección pixel-art. */
(()=>{
'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const life=V.life;
if(!life)return;
const W=3200,H=2000;
const palette={grass:'#6f8d55',grass2:'#789762',dirt:'#b59668',road:'#9b9b78',roadEdge:'#6d765d',wood:'#76563d',roof:'#57483d',cream:'#e4d8b9',green:'#365a42',green2:'#47704d',water:'#6f9f9d',shadow:'rgba(27,35,25,.20)'};
function px(c,x,y,w,h,color){c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h))}
function hash(n){let x=Math.sin(n*12.9898)*43758.5453;return x-Math.floor(x)}
function tuft(c,x,y,s=1){px(c,x,y,2*s,7*s,palette.green2);px(c,x+3*s,y-3*s,2*s,10*s,palette.green);px(c,x+6*s,y+1*s,2*s,6*s,palette.green2)}
function fence(c,x,y,len,vertical=false){c.strokeStyle='#75583e';c.lineWidth=4;c.beginPath();c.moveTo(x,y);c.lineTo(vertical?x:x+len,vertical?y+len:y);c.stroke();for(let i=0;i<=len;i+=22){px(c,vertical?x-3:x+i-3,vertical?y+i-3:y-3,6,12,'#5e4936')}}
function tree(c,x,y,s=1){c.fillStyle=palette.shadow;c.beginPath();c.ellipse(x,y+22*s,17*s,5*s,0,0,Math.PI*2);c.fill();px(c,x-4*s,y+6*s,8*s,20*s,'#674b35');px(c,x-18*s,y-10*s,36*s,27*s,'#426b47');px(c,x-12*s,y-20*s,25*s,18*s,'#527b50');px(c,x-5*s,y-26*s,12*s,13*s,'#63875a');px(c,x-14*s,y-5*s,7*s,8*s,'#6f9560');}
function lamp(c,x,y){px(c,x-2,y-26,4,26,'#4d5146');px(c,x-6,y-29,12,4,'#39443b');px(c,x-4,y-34,8,6,'#e3d58f')}
function bench(c,x,y){px(c,x-22,y,44,5,'#77583d');px(c,x-18,y+6,5,10,'#5c4937');px(c,x+13,y+6,5,10,'#5c4937');px(c,x-22,y-7,44,5,'#8a6848')}
function field(c,x,y,w,h){px(c,x,y,w,h,'#78945c');for(let i=0;i<Math.floor(w/34);i++){const xx=x+10+i*34;for(let j=0;j<Math.floor(h/30);j++){const yy=y+8+j*30;px(c,xx,yy,2,15,'#587a4d');px(c,xx+6,yy+4,2,11,'#65864f')}}}
function drawBack(c){
  /* Capas territoriales: caminos, chacras, acequias y vegetación. */
  c.save();
  c.fillStyle=palette.grass;c.fillRect(0,0,W,H);
  /* textura orgánica determinista */
  for(let i=0;i<520;i++){const x=hash(i*3.1)*W,y=hash(i*7.7)*H;if((x>250&&x<2500&&y>620&&y<780)||(x>1080&&x<1260&&y>120&&y<1900))continue;tuft(c,x,y,hash(i*2.4)>.84?2:1)}
  /* rutas principales con bordes pixelados */
  px(c,0,650,W,170,palette.roadEdge);px(c,0,662,W,146,palette.road);
  px(c,1090,0,150,H,palette.roadEdge);px(c,1102,0,126,H,palette.road);
  /* caminos rurales */
  c.fillStyle=palette.dirt;c.beginPath();c.moveTo(1900,800);c.lineTo(3200,1020);c.lineTo(3200,1130);c.lineTo(1900,900);c.closePath();c.fill();
  c.fillStyle=palette.water;c.fillRect(1260,790,12,1120);
  /* chacras */
  field(c,40,850,650,500);field(c,2700,1120,450,500);field(c,2050,1280,600,500);
  /* cercos */
  fence(c,70,840,620);fence(c,2050,1260,520);fence(c,2700,1100,430);
  /* plaza */
  c.fillStyle='#7f9c62';c.fillRect(960,260,430,360);c.fillStyle='#6d8758';c.fillRect(995,290,370,300);c.strokeStyle='#9eaa7b';c.lineWidth=6;c.strokeRect(995,290,370,300);bench(c,1080,520);bench(c,1260,520);tree(c,1040,340,1.1);tree(c,1320,350,1);tree(c,1100,420,.8);tree(c,1270,420,.9);lamp(c,1180,320);lamp(c,1180,550);
  /* arboleda periférica */
  [[180,300,1.2],[780,270,1],[2350,280,1.15],[3000,500,1.25],[3000,760,.9],[850,1500,1.2],[1550,1500,1],[1850,1680,1.3],[3000,1700,1.15]].forEach(a=>tree(c,a[0],a[1],a[2]));
  c.restore();
}
function drawForeground(c){
  /* Detalles pequeños que venden escala y vida. */
  c.save();
  [[280,610],[740,610],[1460,610],[1960,610],[2480,610],[1420,1010],[1880,1080],[2520,1040]].forEach(a=>{px(c,a[0],a[1],34,3,'#c5b990');px(c,a[0]+8,a[1]+5,18,3,'#84795e')});
  [[520,730],[860,730],[1510,730],[1990,730],[2460,730],[700,1030],[1500,1050],[1880,1160]].forEach(a=>tuft(c,a[0],a[1],1));
  c.restore();
}
function syncPeople(){
  const living=Array.isArray(life.ambient)?life.ambient:[];
  const visible=V.npcs||[];
  visible.forEach(n=>{const p=living.find(x=>x.name===n.name);if(!p)return;n.x=p.x;n.y=p.y;n.moving=!!p.active;n.direction=n.direction||'down';if(Math.abs(p.x-(p.lastX||p.x))>.15)n.direction=p.x>(p.lastX||p.x)?'right':'left';else if(Math.abs(p.y-(p.lastY||p.y))>.15)n.direction=p.y>(p.lastY||p.y)?'down':'up';n.walk=(n.walk||0)+(n.moving?.08:0);p.lastX=p.x;p.lastY=p.y;});
}
const oldDraw=life.drawWorld;
if(!life.__v46Wrapped){
 life.__v46Wrapped=true;
 life.drawWorld=function(c){drawBack(c);syncPeople();const saved=life.ambient;life.ambient=[];try{if(oldDraw)oldDraw(c)}finally{life.ambient=saved}drawForeground(c)};
}
setInterval(syncPeople,250);
V.worldVisuals={version:'V46',syncPeople,drawBack};
})();