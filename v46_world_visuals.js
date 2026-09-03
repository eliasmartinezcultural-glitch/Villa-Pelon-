/* Villa Pelón V46 — integración visual del mundo vivo + dirección pixel-art. */
(()=>{
'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const life=V.life;if(!life)return;
const W=3200,H=2000;
const P={green:'#426b47',green2:'#527b50',wood:'#76563d',lamp:'#e3d58f',shadow:'rgba(27,35,25,.20)'};
function px(c,x,y,w,h,color){c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h))}
function hash(n){const x=Math.sin(n*12.9898)*43758.5453;return x-Math.floor(x)}
function tuft(c,x,y,s=1){px(c,x,y,2*s,7*s,P.green2);px(c,x+3*s,y-3*s,2*s,10*s,P.green);px(c,x+6*s,y+1*s,2*s,6*s,P.green2)}
function tree(c,x,y,s=1){c.fillStyle=P.shadow;c.beginPath();c.ellipse(x,y+22*s,17*s,5*s,0,0,Math.PI*2);c.fill();px(c,x-4*s,y+6*s,8*s,20*s,'#674b35');px(c,x-18*s,y-10*s,36*s,27*s,'#426b47');px(c,x-12*s,y-20*s,25*s,18*s,'#527b50');px(c,x-5*s,y-26*s,12*s,13*s,'#63875a');px(c,x-14*s,y-5*s,7*s,8*s,'#6f9560')}
function lamp(c,x,y){px(c,x-2,y-26,4,26,'#4d5146');px(c,x-6,y-29,12,4,'#39443b');px(c,x-4,y-34,8,6,P.lamp)}
function bench(c,x,y){px(c,x-22,y,44,5,P.wood);px(c,x-18,y+6,5,10,'#5c4937');px(c,x+13,y+6,5,10,'#5c4937');px(c,x-22,y-7,44,5,'#8a6848')}
function fence(c,x,y,len){c.strokeStyle='#75583e';c.lineWidth=4;c.beginPath();c.moveTo(x,y);c.lineTo(x+len,y);c.stroke();for(let i=0;i<=len;i+=22)px(c,x+i-3,y-3,6,12,'#5e4936')}
function decorate(c){
 c.save();
 /* Nunca pinta una nueva base: trabaja encima del terreno existente. */
 for(let i=0;i<230;i++){const x=hash(i*3.1)*W,y=hash(i*7.7)*H;tuft(c,x,y,hash(i*2.4)>.9?2:1)}
 [[180,300,1.2],[780,270,1],[2350,280,1.15],[3000,500,1.25],[3000,760,.9],[850,1500,1.2],[1550,1500,1],[1850,1680,1.3],[3000,1700,1.15]].forEach(a=>tree(c,a[0],a[1],a[2]));
 [[1040,340,1.0],[1320,350,.95],[1100,420,.75],[1270,420,.85]].forEach(a=>tree(c,a[0],a[1],a[2]));
 bench(c,1080,520);bench(c,1260,520);lamp(c,1180,320);lamp(c,1180,550);
 fence(c,70,840,620);fence(c,2050,1260,520);fence(c,2700,1100,430);
 c.restore();
}
function syncPeople(){
 const living=Array.isArray(life.ambient)?life.ambient:[],visible=V.npcs||[];
 visible.forEach(n=>{const p=living.find(x=>x.name===n.name);if(!p)return;const lx=p.x,ly=p.y;n.x=p.x;n.y=p.y;n.moving=!!p.active;if(Math.abs(p.x-(p.lastX??p.x))>.08)n.direction=p.x>p.lastX?'right':'left';else if(Math.abs(p.y-(p.lastY??p.y))>.08)n.direction=p.y>p.lastY?'down':'up';n.walk=(n.walk||0)+(n.moving?.12:0);p.lastX=lx;p.lastY=ly;});
}
const oldDraw=life.drawWorld;
if(!life.__v46Wrapped){
 life.__v46Wrapped=true;
 life.drawWorld=function(c){syncPeople();const saved=life.ambient;life.ambient=[];try{if(oldDraw)oldDraw(c)}finally{life.ambient=saved}decorate(c)};
}
setInterval(syncPeople,250);
V.worldVisuals={version:'V46',syncPeople,decorate};
})();