/* VILLA PELÓN — BUILDING DETAIL V92
   Capa de identidad visual. No modifica colisiones ni geometría.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});const canvas=document.getElementById('world');if(!canvas)return;const ctx=canvas.getContext('2d');
const G=V.worldGeometry||{};const B=G.buildings||[];
function p(x,y){const s=V.gameState||{};return{x:x-(+s.x||0)+innerWidth/2,y:y-(+s.y||0)+innerHeight/2}}
function txt(t,x,y,size=9){ctx.font='700 '+size+'px monospace';ctx.textAlign='center';ctx.fillStyle='#efe0b4';ctx.strokeStyle='rgba(20,22,18,.8)';ctx.lineWidth=3;ctx.strokeText(t,x,y);ctx.fillText(t,x,y)}
function sign(x,y,label,kind){const w=Math.max(64,label.length*5.2+18);ctx.fillStyle='#302a21';ctx.fillRect(x-w/2,y-11,w,18);ctx.strokeStyle='#c9ad70';ctx.strokeRect(x-w/2,y-11,w,18);txt(label,x,y+1,7)}
function facade(b){const q=p(b.x,b.y);if(q.x+b.w<0||q.x>innerWidth||q.y+b.h<0||q.y>innerHeight)return;const x=q.x,y=q.y,w=b.w,h=b.h;ctx.save();ctx.imageSmoothingEnabled=false;
ctx.fillStyle='rgba(20,18,15,.24)';ctx.fillRect(x+7,y+h+5,w-14,8);
let roof='#5b4036',wall='#c8a879',accent='#8b684c';
if(b.type==='hospital'){roof='#e9e2d0';wall='#d8d1bd';accent='#b13d3d';ctx.fillStyle=roof;ctx.fillRect(x-8,y-13,w+16,24);ctx.fillStyle='#fff8e7';ctx.fillRect(x+18,y+28,w-36,h-28);ctx.fillStyle=accent;ctx.fillRect(x+w/2-8,y+44,16,42);ctx.fillRect(x+w/2-22,y+57,44,16);sign(x+w/2,y+18,'HOSPITAL','hospital');}
else if(b.type==='library'){roof='#514c42';wall='#cdb98d';accent='#725a3e';ctx.fillStyle=roof;ctx.fillRect(x-12,y-18,w+24,28);ctx.fillStyle=wall;ctx.fillRect(x,y+2,w,h-2);for(let i=0;i<5;i++){ctx.fillStyle=accent;ctx.fillRect(x+24+i*(w-48)/4,y+42,10,h-62)}ctx.fillStyle='#e7dcc0';ctx.fillRect(x+32,y+28,w-64,18);sign(x+w/2,y+18,'BIBLIOTECA','library');}
else if(b.type==='fire_station'){roof='#6a3029';wall='#b35b4b';ctx.fillStyle=roof;ctx.fillRect(x-10,y-15,w+20,25);ctx.fillStyle=wall;ctx.fillRect(x,y,w,h);ctx.fillStyle='#3b3030';ctx.fillRect(x+25,y+45,w-50,h-45);ctx.fillStyle='#d8c08b';ctx.fillRect(x+w/2-5,y+45,10,h-45);sign(x+w/2,y+18,'BOMBEROS','service');}
else if(b.type==='municipality'){roof='#3e4b3d';wall='#c7b486';ctx.fillStyle=roof;ctx.fillRect(x-8,y-16,w+16,22);ctx.fillStyle=wall;ctx.fillRect(x,y+4,w,h-4);ctx.fillStyle='#70583f';ctx.fillRect(x+24,y+38,w-48,9);for(let i=0;i<5;i++){ctx.fillStyle='#efe1b7';ctx.fillRect(x+28+i*(w-56)/4,y+60,14,h-78)}sign(x+w/2,y+20,'MUNICIPALIDAD','civic');}
else if(b.type==='school'){roof='#4c5c48';wall='#d0b27d';ctx.fillStyle=roof;ctx.fillRect(x-10,y-14,w+20,22);ctx.fillStyle=wall;ctx.fillRect(x,y+2,w,h-2);ctx.fillStyle='#49644d';ctx.fillRect(x+20,y+40,w-40,12);for(let i=0;i<4;i++){ctx.fillStyle='#7c5e48';ctx.fillRect(x+28+i*(w-56)/3,y+64,15,h-84)}sign(x+w/2,y+20,b.label.includes('JARD')?'JARDÍN':'ESCUELA','school');}
else if(b.type==='community'){roof='#65504a';wall='#b99a70';ctx.fillStyle=roof;ctx.fillRect(x-10,y-15,w+20,24);ctx.fillStyle=wall;ctx.fillRect(x,y+2,w,h-2);ctx.fillStyle='#654b3b';ctx.fillRect(x+w/2-26,y+52,52,h-52);sign(x+w/2,y+20,'SALÓN','community');}
else if(b.type==='chapel'){roof='#6b4a45';wall='#d4bd91';ctx.fillStyle=roof;ctx.fillRect(x-8,y-12,w+16,18);ctx.fillStyle=wall;ctx.fillRect(x,y+3,w,h-3);ctx.fillStyle='#eee3c8';ctx.fillRect(x+w/2-7,y+18,14,14);ctx.fillStyle='#765143';ctx.fillRect(x+w/2-20,y+48,40,h-48);ctx.fillStyle='#6b4a45';ctx.fillRect(x+w/2-2,y-32,4,25);ctx.fillRect(x+w/2-10,y-25,20,4);sign(x+w/2,y+20,'CAPILLA','culture');}
else {ctx.fillStyle=roof;ctx.fillRect(x-7,y-11,w+14,19);ctx.fillStyle=wall;ctx.fillRect(x,y+4,w,h-4);ctx.fillStyle=accent;ctx.fillRect(x+20,y+35,w-40,9);ctx.fillStyle='#6e5542';ctx.fillRect(x+w/2-13,y+h-58,26,58);ctx.fillStyle='#83908a';ctx.fillRect(x+28,y+52,22,18);ctx.fillRect(x+w-50,y+52,22,18);sign(x+w/2,y+20,b.label,'generic');}
ctx.restore()}
function draw(){if(!V.gameState?.started){requestAnimationFrame(draw);return}const d=Math.min(devicePixelRatio||1,2);ctx.setTransform(d,0,0,d,0,0);B.forEach(facade);requestAnimationFrame(draw)}
requestAnimationFrame(draw);V.buildingDetail={version:'92.0',distinctive:true};
})();
