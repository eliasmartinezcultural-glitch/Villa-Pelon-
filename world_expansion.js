/* VILLA PELÓN V65 — expansión visual y ambiental.
   Añade elementos territoriales sin crear un segundo motor ni otro game loop.
   Todo se dibuja sobre la autoridad existente de life.js/game.js. */
(()=>{
'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const W=3200,H=2000;
const props={
  trees:[...Array(28)].map((_,i)=>({x:120+(i*271)%2980,y:180+(i*149)%1600,r:12+(i%4)*3})),
  poplars:[{x:820,y:180},{x:860,y:190},{x:900,y:175},{x:940,y:195},{x:2850,y:420},{x:2890,y:440},{x:2930,y:425}],
  fences:[
    [1420,680,360,0],[1420,680,0,260],[1780,680,0,260],[1420,940,360,0],
    [1900,1200,700,0],[1900,1200,0,180],[2600,1200,0,180],[1900,1380,700,0],
    [2050,620,480,0],[2050,620,0,220],[2530,620,0,220]
  ],
  cropRows:[
    {x:1840,y:760,w:560,h:180,kind:'frutal'},
    {x:1940,y:1010,w:520,h:150,kind:'frutal'},
    {x:2480,y:1040,w:500,h:240,kind:'vid'},
    {x:820,y:1380,w:620,h:240,kind:'huerta'}
  ],
  canal:[{x:500,y:760,w:1050,h:16},{x:1550,y:760,w:18,h:650},{x:1550,y:1410,w:720,h:16}],
  dirtRoads:[{x:80,y:700,w:850,h:30},{x:1840,y:650,w:1050,h:34},{x:1800,y:1480,w:1100,h:30},{x:1120,y:1350,w:34,h:500}],
  machines:[
    {x:2380,y:720,type:'tractor',phase:0},{x:2690,y:1310,type:'tractor',phase:1},
    {x:2270,y:1280,type:'trailer',phase:2}
  ]
};
V.worldElements={version:'V65',props};
function px(c,x,y,w,h,col){c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h))}
function tree(c,o){
  c.fillStyle='rgba(30,25,18,.18)';c.beginPath();c.ellipse(o.x,o.y+20,18,5,0,0,Math.PI*2);c.fill();
  px(c,o.x-4,o.y+4,8,20,'#60452e');
  px(c,o.x-14,o.y-10,28,18,'#3d6845');px(c,o.x-9,o.y-17,18,10,'#4c7950');px(c,o.x-18,o.y-3,10,10,'#345d3d');
}
function poplar(c,o){px(c,o.x-3,o.y,6,48,'#6a4d32');px(c,o.x-9,o.y-8,18,32,'#416b47');px(c,o.x-6,o.y-18,12,18,'#4d7a50')}
function fence(c,x,y,dx,dy){
 const len=Math.max(Math.abs(dx),Math.abs(dy)),steps=Math.floor(len/34);
 for(let i=0;i<=steps;i++){const t=steps?i/steps:0;const px0=x+dx*t,py0=y+dy*t;px(c,px0-2,py0-4,5,22,'#70583e')}
 c.strokeStyle='#806447';c.lineWidth=3;c.beginPath();c.moveTo(x,y+2);c.lineTo(x+dx,y+dy+2);c.moveTo(x,y+10);c.lineTo(x+dx,y+dy+10);c.stroke()
}
function crop(c,o){
 const cols=o.kind==='vid'?'#416a43':o.kind==='frutal'?'#53784b':'#6f7c45';
 for(let x=o.x;x<o.x+o.w;x+=32){for(let y=o.y;y<o.y+o.h;y+=28){px(c,x,y,4,14,cols);px(c,x+5,y-3,7,6,cols)}}
}
function canal(c,o){px(c,o.x,o.y,o.w,o.h,'#8a7650');px(c,o.x,o.y+4,o.w,o.h-8,'#537d79')}
function road(c,o){px(c,o.x,o.y,o.w,o.h,'#aa8b61');for(let x=o.x+20;x<o.x+o.w;x+=80)px(c,x,o.y+o.h/2-2,34,4,'#c2a678')}
function machine(c,o){
 c.save();c.translate(o.x,o.y);const pulse=Math.sin((V.life?.phase||0)*1.5+o.phase)*1;
 if(o.type==='tractor'){
  px(c,-26,-12,46,24,'#567440');px(c,5,-23,19,18,'#4f693d');px(c,8,-20,13,11,'#91a38a');
  px(c,-23,11,13,11,'#252b25');px(c,12,9,17,14,'#252b25');px(c,-22,-9,4,5,'#d8bd67');
 }else{px(c,-28,-10,50,20,'#795f45');px(c,21,-8,14,17,'#604a37');px(c,-25,9,10,9,'#292823');px(c,15,9,10,9,'#292823')}
 c.restore()
}
function water(c){
 const t=V.life?.phase||0;c.strokeStyle='rgba(220,236,225,.35)';c.lineWidth=2;c.beginPath();c.moveTo(520,768);c.quadraticCurveTo(760,762+Math.sin(t)*2,980,768);c.quadraticCurveTo(1240,774,1545,768);c.stroke()
}
const oldDraw=()=>V.life&&V.life.drawWorld;
function install(){
 if(!V.life||V.life.__v65expanded)return;
 const original=V.life.drawWorld;
 V.life.drawWorld=function(c){
   props.dirtRoads.forEach(o=>road(c,o));
   props.canal.forEach(o=>canal(c,o));
   props.cropRows.forEach(o=>crop(c,o));
   props.fences.forEach(o=>fence(c,...o));
   props.trees.forEach(o=>tree(c,o));props.poplars.forEach(o=>poplar(c,o));
   props.machines.forEach(o=>machine(c,o));water(c);
   original(c);
 };
 V.life.__v65expanded=true;
 const overlay=V.life.drawOverlay;
 V.life.drawOverlay=function(c,vw,vh){overlay(c,vw,vh);const l=V.life;if(!l)return;
   if(l.weather==='lluvia'){c.fillStyle='rgba(80,105,115,.08)';c.fillRect(0,0,vw,vh)}
   if(l.weather==='viento'){c.fillStyle='rgba(205,181,135,.10)';c.fillRect(0,0,vw,vh)}
 };
}
if(V.life)install();else window.addEventListener('villa-pelon-runtime-ready',install,{once:true});
})();
