/* VILLA PELÓN — PEOPLE & VEHICLES V92
   Capa ambiental. Los NPC principales los renderiza el motor; esta capa NO vuelve a dibujar
   jugador/NPC para evitar dobles brazos/piernas. Solo aporta peatones ambientales y vehículos.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const canvas=document.getElementById('world'); if(!canvas)return; const ctx=canvas.getContext('2d'); if(!ctx)return;
const AMBIENT=[
 [1420,650,'#c58c6b','#6f8058','#302824'],[2220,650,'#d09a77','#5b6e88','#302824'],[3000,650,'#a97458','#7c604c','#302824'],
 [3900,650,'#c58c6b','#80604e','#2c2926'],[4800,980,'#d09a77','#536d80','#302824'],[5400,980,'#a97458','#7b604d','#302824'],
 [6100,1500,'#c58c6b','#65764a','#302824'],[7000,1500,'#d09a77','#826347','#302824'],[5750,2450,'#a97458','#536b82','#302824'],
 [6800,3150,'#c58c6b','#775b46','#302824'],[7500,3350,'#d09a77','#5d7350','#302824']
];
const VEHICLES=[
 {x:430,y:695,type:'auto',dir:1,color:'#7b4438'},{x:1460,y:690,type:'auto',dir:-1,color:'#48627a'},{x:2850,y:695,type:'auto',dir:1,color:'#8b6d3d'},{x:3980,y:695,type:'auto',dir:-1,color:'#596b55'},
 {x:5000,y:2190,type:'pickup',dir:1,color:'#6a5846'},{x:5700,y:2188,type:'tractor',dir:1,color:'#6e7c45'},{x:6650,y:2188,type:'tractor',dir:-1,color:'#7d633e'},{x:7350,y:3300,type:'pickup',dir:-1,color:'#4e5963'},{x:6100,y:3300,type:'tractor',dir:1,color:'#697746'}
];
function player(){const s=V.gameState||{};return{x:+s.x||0,y:+s.y||0}}
function screen(x,y){const s=player();return{x:x-s.x+innerWidth/2,y:y-s.y+innerHeight/2}}
function person(x,y,skin,shirt,hair,scale=.9,phase=0){const p=screen(x,y);if(p.x<-40||p.x>innerWidth+40||p.y<-50||p.y>innerHeight+50)return;const t=performance.now()/220+phase,bob=Math.sin(t)*1.2*scale,step=Math.sin(t)*1.8*scale;ctx.save();ctx.translate(Math.round(p.x),Math.round(p.y+bob));ctx.imageSmoothingEnabled=false;
ctx.fillStyle='rgba(25,25,20,.28)';ctx.beginPath();ctx.ellipse(0,11*scale,8*scale,2.5*scale,0,0,Math.PI*2);ctx.fill();
ctx.strokeStyle='#292725';ctx.lineWidth=Math.max(1,2*scale);ctx.lineCap='round';ctx.beginPath();ctx.moveTo(-3*scale,4*scale);ctx.lineTo(-5*scale,14*scale+step);ctx.moveTo(3*scale,4*scale);ctx.lineTo(5*scale,14*scale-step);ctx.stroke();
ctx.strokeStyle=skin;ctx.lineWidth=Math.max(1,1.7*scale);ctx.beginPath();ctx.moveTo(-6*scale,-5*scale);ctx.lineTo(-10*scale,5*scale);ctx.moveTo(6*scale,-5*scale);ctx.lineTo(10*scale,5*scale);ctx.stroke();
ctx.fillStyle=shirt;ctx.fillRect(-7*scale,-10*scale,14*scale,15*scale);
ctx.fillStyle=skin;ctx.beginPath();ctx.arc(0,-17*scale,6.2*scale,0,Math.PI*2);ctx.fill();
ctx.fillStyle=hair;ctx.beginPath();ctx.arc(0,-19.5*scale,6.3*scale,Math.PI,Math.PI*2);ctx.fill();ctx.fillRect(-6*scale,-20*scale,12*scale,3*scale);
ctx.fillStyle='#211d1b';ctx.fillRect(-3*scale,-17*scale,1.3*scale,1.3*scale);ctx.fillRect(1.7*scale,-17*scale,1.3*scale,1.3*scale);ctx.fillRect(-1.5*scale,-13.8*scale,3*scale,.8*scale);ctx.restore()}
function vehicle(v){const p=screen(v.x,v.y);if(p.x<-120||p.x>innerWidth+120||p.y<-80||p.y>innerHeight+80)return;const k=v.type==='tractor'?1.15:v.type==='pickup'?.95:1;ctx.save();ctx.translate(Math.round(p.x),Math.round(p.y));if(v.dir<0)ctx.scale(-1,1);ctx.fillStyle='rgba(25,25,20,.25)';ctx.beginPath();ctx.ellipse(0,18*k,42*k,5*k,0,0,Math.PI*2);ctx.fill();ctx.fillStyle=v.color;ctx.fillRect(-30*k,-10*k,58*k,22*k);ctx.fillStyle='#222c30';ctx.fillRect(-16*k,-20*k,25*k,12*k);ctx.fillStyle='#9fb0ad';ctx.fillRect(-12*k,-18*k,17*k,8*k);ctx.fillStyle='#202326';ctx.beginPath();ctx.arc(-20*k,13*k,7*k,0,Math.PI*2);ctx.arc(20*k,13*k,7*k,0,Math.PI*2);ctx.fill();if(v.type==='tractor'){ctx.beginPath();ctx.arc(-25*k,13*k,9*k,0,Math.PI*2);ctx.arc(25*k,13*k,12*k,0,Math.PI*2);ctx.fill();ctx.fillStyle=v.color;ctx.fillRect(24*k,-5*k,20*k,8*k)}ctx.restore()}
function draw(){if(!V.gameState?.started){requestAnimationFrame(draw);return}const d=Math.min(devicePixelRatio||1,2);ctx.setTransform(d,0,0,d,0,0);AMBIENT.forEach((a,i)=>person(a[0],a[1],a[2],a[3],a[4],.9,i));VEHICLES.forEach(vehicle);requestAnimationFrame(draw)}
requestAnimationFrame(draw);V.peopleVehicles={version:'92.0',people:18,vehicles:VEHICLES.length,npcOverlay:false};
})();
