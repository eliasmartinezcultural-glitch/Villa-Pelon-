/* VILLA PELÓN — RENDER COMPOSITOR V93
   Un solo RAF para overlays. Mantiene una única capa visual sincronizada con el motor.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const canvas=document.getElementById('worldDetail'); if(!canvas)return;
const ctx=canvas.getContext('2d'); if(!ctx)return;
ctx.imageSmoothingEnabled=false;
let vw=innerWidth,vh=innerHeight;
function resize(){vw=innerWidth;vh=innerHeight;const d=Math.min(devicePixelRatio||1,2);canvas.width=Math.max(1,Math.floor(vw*d));canvas.height=Math.max(1,Math.floor(vh*d));canvas.style.width=vw+'px';canvas.style.height=vh+'px';canvas.style.position='absolute';canvas.style.inset='0';canvas.style.pointerEvents='none';ctx.setTransform(d,0,0,d,0,0)}
addEventListener('resize',resize,{passive:true});resize();
function screen(x,y){const s=V.gameState||{};return{x:x-(+s.x||0)+vw/2,y:y-(+s.y||0)+vh/2}}
function visible(q,w,h){return !(q.x+w<0||q.x>vw||q.y+h<0||q.y>vh)}
function text(t,x,y,size=7){ctx.font='700 '+size+'px monospace';ctx.textAlign='center';ctx.lineWidth=3;ctx.strokeStyle='rgba(20,22,18,.9)';ctx.fillStyle='#efe0b4';ctx.strokeText(t,x,y);ctx.fillText(t,x,y)}
function facade(b){const q=screen(b.x,b.y);if(!visible(q,b.w,b.h+45))return;const x=Math.round(q.x),y=Math.round(q.y),w=b.w,h=b.h;ctx.save();
ctx.fillStyle='rgba(20,18,15,.25)';ctx.fillRect(x+7,y+h+5,w-14,8);
let roof='#5b4036',wall='#c8a879',accent='#8b684c';
if(b.type==='hospital'){ctx.fillStyle='#eee9da';ctx.fillRect(x-8,y-13,w+16,24);ctx.fillStyle='#d8d1bd';ctx.fillRect(x,y+2,w,h-2);ctx.fillStyle='#b13d3d';ctx.fillRect(x+w/2-8,y+43,16,42);ctx.fillRect(x+w/2-22,y+56,44,16);text('HOSPITAL',x+w/2,y+18)}
else if(b.type==='library'){ctx.fillStyle='#514c42';ctx.fillRect(x-12,y-18,w+24,28);ctx.fillStyle='#cdb98d';ctx.fillRect(x,y+2,w,h-2);for(let i=0;i<5;i++){ctx.fillStyle='#725a3e';ctx.fillRect(x+24+i*(w-48)/4,y+42,10,h-62)}ctx.fillStyle='#e7dcc0';ctx.fillRect(x+32,y+28,w-64,18);text('BIBLIOTECA',x+w/2,y+18)}
else if(b.type==='fire_station'){ctx.fillStyle='#6a3029';ctx.fillRect(x-10,y-15,w+20,25);ctx.fillStyle='#b35b4b';ctx.fillRect(x,y,w,h);ctx.fillStyle='#3b3030';ctx.fillRect(x+25,y+45,w-50,h-45);ctx.fillStyle='#d8c08b';ctx.fillRect(x+w/2-5,y+45,10,h-45);text('BOMBEROS',x+w/2,y+18)}
else if(b.type==='municipality'){ctx.fillStyle='#3e4b3d';ctx.fillRect(x-8,y-16,w+16,22);ctx.fillStyle='#c7b486';ctx.fillRect(x,y+4,w,h-4);ctx.fillStyle='#70583f';ctx.fillRect(x+24,y+38,w-48,9);for(let i=0;i<5;i++){ctx.fillStyle='#efe1b7';ctx.fillRect(x+28+i*(w-56)/4,y+60,14,h-78)}text('MUNICIPALIDAD',x+w/2,y+20)}
else if(b.type==='school'){ctx.fillStyle='#4c5c48';ctx.fillRect(x-10,y-14,w+20,22);ctx.fillStyle='#d0b27d';ctx.fillRect(x,y+2,w,h-2);ctx.fillStyle='#49644d';ctx.fillRect(x+20,y+40,w-40,12);for(let i=0;i<4;i++){ctx.fillStyle='#7c5e48';ctx.fillRect(x+28+i*(w-56)/3,y+64,15,h-84)}text(b.label.includes('JARD')?'JARDÍN':'ESCUELA',x+w/2,y+20)}
else if(b.type==='community'){ctx.fillStyle='#65504a';ctx.fillRect(x-10,y-15,w+20,24);ctx.fillStyle='#b99a70';ctx.fillRect(x,y+2,w,h-2);ctx.fillStyle='#654b3b';ctx.fillRect(x+w/2-26,y+52,52,h-52);text('SALÓN',x+w/2,y+20)}
else if(b.type==='chapel'){ctx.fillStyle='#6b4a45';ctx.fillRect(x-8,y-12,w+16,18);ctx.fillStyle='#d4bd91';ctx.fillRect(x,y+3,w,h-3);ctx.fillStyle='#eee3c8';ctx.fillRect(x+w/2-7,y+18,14,14);ctx.fillStyle='#765143';ctx.fillRect(x+w/2-20,y+48,40,h-48);ctx.fillStyle='#6b4a45';ctx.fillRect(x+w/2-2,y-32,4,25);ctx.fillRect(x+w/2-10,y-25,20,4);text('CAPILLA',x+w/2,y+20)}
else {ctx.fillStyle=roof;ctx.fillRect(x-7,y-11,w+14,19);ctx.fillStyle=wall;ctx.fillRect(x,y+4,w,h-4);ctx.fillStyle=accent;ctx.fillRect(x+20,y+35,w-40,9);ctx.fillStyle='#6e5542';ctx.fillRect(x+w/2-13,y+h-58,26,58);ctx.fillStyle='#83908a';ctx.fillRect(x+28,y+52,22,18);ctx.fillRect(x+w-50,y+52,22,18);text(b.label,x+w/2,y+20)}ctx.restore()}
function person(x,y,skin,shirt,hair,scale=.9,phase=0){const p=screen(x,y);if(p.x<-40||p.x>vw+40||p.y<-50||p.y>vh+50)return;const t=performance.now()/220+phase,bob=Math.sin(t)*1.2*scale,step=Math.sin(t)*1.8*scale;ctx.save();ctx.translate(Math.round(p.x),Math.round(p.y+bob));
ctx.fillStyle='rgba(25,25,20,.28)';ctx.beginPath();ctx.ellipse(0,11*scale,8*scale,2.5*scale,0,0,Math.PI*2);ctx.fill();
ctx.strokeStyle='#292725';ctx.lineWidth=Math.max(1,2*scale);ctx.lineCap='round';ctx.beginPath();ctx.moveTo(-3*scale,4*scale);ctx.lineTo(-5*scale,14*scale+step);ctx.moveTo(3*scale,4*scale);ctx.lineTo(5*scale,14*scale-step);ctx.stroke();
ctx.strokeStyle=skin;ctx.lineWidth=Math.max(1,1.7*scale);ctx.beginPath();ctx.moveTo(-6*scale,-5*scale);ctx.lineTo(-10*scale,5*scale);ctx.moveTo(6*scale,-5*scale);ctx.lineTo(10*scale,5*scale);ctx.stroke();
ctx.fillStyle=shirt;ctx.fillRect(-7*scale,-10*scale,14*scale,15*scale);ctx.fillStyle=skin;ctx.beginPath();ctx.arc(0,-17*scale,6.2*scale,0,Math.PI*2);ctx.fill();
ctx.fillStyle=hair;ctx.beginPath();ctx.arc(0,-19.5*scale,6.3*scale,Math.PI,Math.PI*2);ctx.fill();ctx.fillRect(-6*scale,-20*scale,12*scale,3*scale);ctx.fillStyle='#211d1b';ctx.fillRect(-3*scale,-17*scale,1.3*scale,1.3*scale);ctx.fillRect(1.7*scale,-17*scale,1.3*scale,1.3*scale);ctx.fillRect(-1.5*scale,-13.8*scale,3*scale,.8*scale);ctx.restore()}
function vehicle(v){const p=screen(v.x,v.y);if(p.x<-120||p.x>vw+120||p.y<-80||p.y>vh+80)return;const k=v.type==='tractor'?1.15:v.type==='pickup'?.95:1;ctx.save();ctx.translate(Math.round(p.x),Math.round(p.y));if(v.dir<0)ctx.scale(-1,1);ctx.fillStyle='rgba(25,25,20,.25)';ctx.beginPath();ctx.ellipse(0,18*k,42*k,5*k,0,0,Math.PI*2);ctx.fill();ctx.fillStyle=v.color;ctx.fillRect(-30*k,-10*k,58*k,22*k);ctx.fillStyle='#222c30';ctx.fillRect(-16*k,-20*k,25*k,12*k);ctx.fillStyle='#9fb0ad';ctx.fillRect(-12*k,-18*k,17*k,8*k);ctx.fillStyle='#202326';ctx.beginPath();ctx.arc(-20*k,13*k,7*k,0,Math.PI*2);ctx.arc(20*k,13*k,7*k,0,Math.PI*2);ctx.fill();if(v.type==='tractor'){ctx.beginPath();ctx.arc(-25*k,13*k,9*k,0,Math.PI*2);ctx.arc(25*k,13*k,12*k,0,Math.PI*2);ctx.fill();ctx.fillStyle=v.color;ctx.fillRect(24*k,-5*k,20*k,8*k)}ctx.restore()}
function frame(){ctx.setTransform(Math.min(devicePixelRatio||1,2),0,0,Math.min(devicePixelRatio||1,2),0,0);ctx.clearRect(0,0,vw,vh);if(!V.gameState?.started){requestAnimationFrame(frame);return}
const items=[];const B=(V.worldGeometry?.buildings||[]);B.forEach(b=>items.push({y:b.y+b.h,fn:()=>facade(b)}));
const P=V.peopleVehicles?.ambient||[];P.forEach((a,i)=>items.push({y:a[1]+14,fn:()=>person(a[0],a[1],a[2],a[3],a[4],.9,i)}));
(V.peopleVehicles?.vehicleData||[]).forEach(v=>items.push({y:v.y+18,fn:()=>vehicle(v)}));items.sort((a,b)=>a.y-b.y);items.forEach(i=>i.fn());requestAnimationFrame(frame)}
V.renderCompositor={version:'93.0',singleRAF:true};requestAnimationFrame(frame);
})();
