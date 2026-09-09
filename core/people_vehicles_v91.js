/* VILLA PELÓN — PEOPLE & VEHICLES V91
   Capa visual/ambiental: personas con anatomía legible, vehículos y tránsito rural.
   No reemplaza el motor: lee gameState/worldGeometry y dibuja sobre el mismo canvas.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const canvas=document.getElementById('world'); if(!canvas)return; const ctx=canvas.getContext('2d'); if(!ctx)return;
const PEOPLE=[
 {id:'marta',x:650,y:570,skin:'#c98f6f',shirt:'#b95e4e',hair:'#3a2b25'}, {id:'raul',x:1730,y:600,skin:'#b8795b',shirt:'#557ca8',hair:'#2c2926'},
 {id:'lucia',x:520,y:1040,skin:'#d6a17d',shirt:'#a55e8f',hair:'#432d2c'}, {id:'pedro',x:1850,y:1040,skin:'#b97b5d',shirt:'#bd8249',hair:'#332a24'},
 {id:'nico',x:1190,y:390,skin:'#d29a76',shirt:'#5d8d59',hair:'#2c2521'}, {id:'elena',x:5200,y:760,skin:'#c48665',shirt:'#9b6b4e',hair:'#3b2923'},
 {id:'tomas',x:6200,y:920,skin:'#c98e6c',shirt:'#596f8f',hair:'#282522'}
];
const AMBIENT=[[1420,650],[2220,650],[3000,650],[3900,650],[4800,980],[5400,980],[6100,1500],[7000,1500],[5750,2450],[6800,3150],[7500,3350]];
const VEHICLES=[
 {x:430,y:695,type:'auto',dir:1,color:'#7b4438'},{x:1460,y:690,type:'auto',dir:-1,color:'#48627a'},{x:2850,y:695,type:'auto',dir:1,color:'#8b6d3d'},{x:3980,y:695,type:'auto',dir:-1,color:'#596b55'},
 {x:5000,y:2190,type:'pickup',dir:1,color:'#6a5846'},{x:5700,y:2188,type:'tractor',dir:1,color:'#6e7c45'},{x:6650,y:2188,type:'tractor',dir:-1,color:'#7d633e'},{x:7350,y:3300,type:'pickup',dir:-1,color:'#4e5963'},{x:6100,y:3300,type:'tractor',dir:1,color:'#697746'}
];
function player(){const s=V.gameState||{};return{x:+s.x||0,y:+s.y||0,walk:+s.walk||0}}
function screen(x,y){const s=player();return{x:x-s.x+innerWidth/2,y:y-s.y+innerHeight/2}}
function person(x,y,skin,shirt,hair,scale=1,walking=0){const p=screen(x,y),bob=Math.sin(walking)*1.5*scale,leg=Math.sin(walking)*2.2*scale;if(p.x<-50||p.x>innerWidth+50||p.y<-60||p.y>innerHeight+60)return;ctx.save();ctx.translate(p.x,p.y+bob);ctx.imageSmoothingEnabled=false;
 ctx.fillStyle='rgba(30,25,20,.25)';ctx.beginPath();ctx.ellipse(0,11*scale,9*scale,3*scale,0,0,Math.PI*2);ctx.fill();
 ctx.strokeStyle='#2b2927';ctx.lineWidth=Math.max(1,2*scale);ctx.lineCap='round';ctx.fillStyle='#27323b';ctx.fillRect(-5*scale,4*scale+leg,4*scale,10*scale);ctx.fillRect(1*scale,4*scale-leg,4*scale,10*scale);
 ctx.strokeStyle='#27323b';ctx.beginPath();ctx.moveTo(-6*scale,-1*scale);ctx.lineTo(-11*scale,7*scale);ctx.moveTo(6*scale,-1*scale);ctx.lineTo(11*scale,7*scale);ctx.stroke();
 ctx.fillStyle=shirt;ctx.fillRect(-7*scale,-10*scale,14*scale,15*scale);ctx.fillStyle=skin;ctx.beginPath();ctx.arc(0,-17*scale,6.5*scale,0,Math.PI*2);ctx.fill();
 ctx.fillStyle=hair;ctx.beginPath();ctx.arc(0,-20*scale,6.5*scale,Math.PI,Math.PI*2);ctx.fill();ctx.fillRect(-6.5*scale,-20*scale,13*scale,3*scale);
 ctx.fillStyle='#241f1d';ctx.fillRect(-3*scale,-17*scale,1.4*scale,1.4*scale);ctx.fillRect(1.6*scale,-17*scale,1.4*scale,1.4*scale);ctx.restore()}
function vehicle(v){const p=screen(v.x,v.y);if(p.x<-120||p.x>innerWidth+120||p.y<-80||p.y>innerHeight+80)return;const k=v.type==='tractor'?1.15:v.type==='pickup'?.95:1;ctx.save();ctx.translate(p.x,p.y);if(v.dir<0)ctx.scale(-1,1);ctx.fillStyle='rgba(25,25,20,.25)';ctx.beginPath();ctx.ellipse(0,18*k,42*k,5*k,0,0,Math.PI*2);ctx.fill();ctx.fillStyle=v.color;ctx.fillRect(-30*k,-10*k,58*k,22*k);ctx.fillStyle='#222c30';ctx.fillRect(-16*k,-20*k,25*k,12*k);ctx.fillStyle='#9fb0ad';ctx.fillRect(-12*k,-18*k,17*k,8*k);ctx.fillStyle='#202326';ctx.beginPath();ctx.arc(-20*k,13*k,7*k,0,Math.PI*2);ctx.arc(20*k,13*k,7*k,0,Math.PI*2);ctx.fill();if(v.type==='tractor'){ctx.beginPath();ctx.arc(-25*k,13*k,9*k,0,Math.PI*2);ctx.arc(25*k,13*k,12*k,0,Math.PI*2);ctx.fill();ctx.fillStyle=v.color;ctx.fillRect(24*k,-5*k,20*k,8*k)}ctx.restore()}
function draw(){if(!V.gameState?.started)return;const d=Math.min(devicePixelRatio||1,2);ctx.setTransform(d,0,0,d,0,0);const np=Array.isArray(V.npcs)?V.npcs:[];PEOPLE.forEach(q=>{const n=np.find(x=>x.id===q.id);person(n?.x??q.x,n?.y??q.y,q.skin,q.shirt,q.hair,1,n?.walk||0)});AMBIENT.forEach((a,i)=>person(a[0],a[1],i%3===0?'#c58c6b':i%3===1?'#d09a77':'#a97458',i%2?'#5b6e88':'#7c604c','#302824',.9,performance.now()/280+i));VEHICLES.forEach(vehicle);const s=player();person(s.x,s.y,'#d09a78','#315c76','#2b2521',1.08,s.walk||0);requestAnimationFrame(draw)}
requestAnimationFrame(draw);V.peopleVehicles={version:'91.0',people:PEOPLE.length+AMBIENT.length,vehicles:VEHICLES.length};
})();
