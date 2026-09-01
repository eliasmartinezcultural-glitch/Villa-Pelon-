/* Villa Pelón V2 — sistema de mundo vivo.
   Hora, clima, tránsito, peatones, animales y actividad se actualizan de forma continua. */
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const life=V.life={weather:'despejado',temperature:19,isNight:false,phase:0,weatherTimer:0,traffic:[],animals:[],ambient:[]};
const W=3200,H=2000,kinds=['despejado','nublado','viento','lluvia'];
function reset(){
 life.traffic=[
  {x:500,y:685,vx:72,vy:0,type:'auto'}, {x:2050,y:735,vx:-58,vy:0,type:'camioneta'},
  {x:1158,y:260,vx:0,vy:52,type:'tractor'}, {x:1200,y:1480,vx:0,vy:-42,type:'camion'},
  {x:820,y:650,vx:38,vy:0,type:'bicicleta'}
 ];
 life.animals=[
  {x:1500,y:840,vx:9,vy:3,type:'vaca'},{x:1570,y:875,vx:-7,vy:2,type:'vaca'},
  {x:2050,y:1080,vx:6,vy:-3,type:'caballo'},{x:2110,y:1140,vx:-5,vy:3,type:'caballo'},
  {x:940,y:560,vx:14,vy:7,type:'gallina'},{x:980,y:575,vx:-10,vy:5,type:'gallina'},{x:1350,y:550,vx:9,vy:-6,type:'gallina'}
 ];
 life.ambient=[
  {x:880,y:700,vx:18,vy:0,color:'#a65d4b'}, {x:1420,y:700,vx:-14,vy:0,color:'#4e79a4'},
  {x:1160,y:520,vx:0,vy:16,color:'#8a5b92'}, {x:1160,y:860,vx:0,vy:-15,color:'#5d8a57'}
 ];
}
reset();
life.nextWeather=()=>{const i=(kinds.indexOf(life.weather)+1+Math.floor(Math.random()*2))%kinds.length;life.weather=kinds[i];life.temperature=life.weather==='lluvia'?12:life.weather==='nublado'?16:life.weather==='viento'?14:23;return life.weather};
function wrap(o){if(o.x>W+80)o.x=-80;if(o.x<-80)o.x=W+80;if(o.y>H+80)o.y=-80;if(o.y<-80)o.y=H+80}
life.update=(dt,minutes)=>{
 life.phase+=dt; life.weatherTimer+=dt;
 if(life.weatherTimer>18){life.weatherTimer=0;life.nextWeather()}
 const hour=(minutes||480)/60; life.isNight=hour<7||hour>=20;
 life.traffic.forEach(o=>{o.x+=o.vx*dt;o.y+=o.vy*dt;wrap(o)});
 life.ambient.forEach((o,i)=>{if(i<2){o.x+=o.vx*dt;if(o.x<820||o.x>1500)o.vx*=-1}else{o.y+=o.vy*dt;if(o.y<300||o.y>900)o.vy*=-1}});
 life.animals.forEach(o=>{o.x+=o.vx*dt;o.y+=o.vy*dt;if(o.type==='gallina'){if(o.x<880||o.x>1450)o.vx*=-1;if(o.y<500||o.y>650)o.vy*=-1}else{if(o.x<1350||o.x>2250)o.vx*=-1;if(o.y<800||o.y>1400)o.vy*=-1}});
};
function sh(c,x,y,w){c.fillStyle='rgba(25,20,15,.22)';c.beginPath();c.ellipse(x,y,w,5,0,0,Math.PI*2);c.fill()}
function vehicle(c,o){c.save();c.translate(o.x,o.y);if(o.vy)c.rotate(Math.PI/2);sh(c,0,13,o.type==='camion'?28:21);c.fillStyle=o.type==='tractor'?'#54733b':o.type==='camion'?'#80624b':o.type==='bicicleta'?'#344c59':o.type==='camioneta'?'#7c704f':'#4d6270';c.fillRect(-22,-10,44,20);if(o.type==='tractor'){c.fillRect(7,-18,16,15);c.fillStyle='#20231e';c.fillRect(-18,8,12,9);c.fillRect(9,8,14,10)}else if(o.type==='camion')c.fillRect(8,-16,24,28);else{c.fillStyle='#222';c.fillRect(-16,9,9,7);c.fillRect(8,9,9,7)}c.restore()}
function animal(c,o){c.save();c.translate(o.x,o.y);sh(c,0,13,o.type==='caballo'?25:17);if(o.type==='vaca'){c.fillStyle='#e8dfc9';c.fillRect(-20,-10,40,20);c.fillStyle='#5b4b3c';c.fillRect(-10,-9,8,7);c.fillRect(7,1,8,8);c.fillStyle='#3b332b';c.fillRect(-14,9,5,12);c.fillRect(10,9,5,12);c.fillRect(18,-7,8,9)}else if(o.type==='caballo'){c.fillStyle='#8b5c3c';c.fillRect(-23,-9,42,18);c.fillRect(14,-20,13,18);c.fillStyle='#493326';c.fillRect(-15,8,5,15);c.fillRect(9,8,5,15)}else{c.fillStyle='#e2d5b8';c.fillRect(-7,-5,14,11);c.fillStyle='#bd4d3e';c.fillRect(4,-10,7,7)}c.restore()}
function person(c,o){c.save();c.translate(o.x,o.y);sh(c,0,17,16);c.fillStyle=o.color;c.fillRect(-10,-2,20,25);c.fillStyle='#e0ad88';c.beginPath();c.arc(0,-13,11,0,Math.PI*2);c.fill();c.fillStyle='#342c28';c.fillRect(-10,-24,20,6);c.restore()}
life.drawWorld=c=>{life.traffic.forEach(o=>vehicle(c,o));life.ambient.forEach(o=>person(c,o));life.animals.forEach(o=>animal(c,o));c.fillStyle='#29342d';for(let i=0;i<7;i++){const x=700+i*55+Math.sin(life.phase*2+i)*18,y=250+Math.cos(life.phase*2+i)*10;c.beginPath();c.arc(x,y,3,0,Math.PI*2);c.fill()}};
life.drawOverlay=(c,vw,vh)=>{if(life.weather==='nublado'){c.fillStyle='rgba(110,120,130,.16)';c.fillRect(0,0,vw,vh)}if(life.weather==='lluvia'){c.strokeStyle='rgba(210,230,240,.62)';c.lineWidth=2;for(let i=0;i<120;i++){const x=(i*79+life.phase*180)%vw,y=(i*47+life.phase*260)%vh;c.beginPath();c.moveTo(x,y);c.lineTo(x-7,y+18);c.stroke()}}if(life.weather==='viento'){c.strokeStyle='rgba(245,232,198,.30)';for(let i=0;i<12;i++){const y=100+i*48,x=(life.phase*100+i*91)%vw;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+35,y-10,x+75,y);c.stroke()}}if(life.isNight){c.fillStyle='rgba(12,20,38,.50)';c.fillRect(0,0,vw,vh)}};
})();
