/* VILLA PELÓN — RENDER COMPOSITOR V112
   AUTORIDAD VISUAL ESTRUCTURAL ÚNICA DE FACHADAS Y ACTORES AMBIENTALES.
   Regla: terreno, rutas, río y puentes los dibuja exclusivamente v90_engine.
   Este compositor usa EXACTAMENTE la misma cámara del motor (Z=.82).
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const canvas=document.getElementById('worldDetail');if(!canvas)return;const ctx=canvas.getContext('2d');if(!ctx)return;
const CAMERA=.82;let vw=innerWidth,vh=innerHeight;
function resize(){vw=innerWidth;vh=innerHeight;const d=Math.min(devicePixelRatio||1,2);canvas.width=Math.max(1,Math.floor(vw*d));canvas.height=Math.max(1,Math.floor(vh*d));canvas.style.width=vw+'px';canvas.style.height=vh+'px';canvas.style.position='absolute';canvas.style.inset='0';canvas.style.pointerEvents='none';ctx.imageSmoothingEnabled=false}
addEventListener('resize',resize,{passive:true});resize();
function screen(x,y){const s=V.gameState||{};return{x:(x-(+s.x||0))*CAMERA+vw/2,y:(y-(+s.y||0))*CAMERA+vh/2}}
function visible(b){const q=screen(b.x,b.y);return !(q.x+b.w*CAMERA<0||q.x>vw||q.y+b.h*CAMERA<0||q.y>vh)}
function px(x,y,w,h,c){ctx.fillStyle=c;ctx.fillRect(Math.round(x),Math.round(y),Math.max(1,Math.round(w)),Math.max(1,Math.round(h)))}
function shadow(x,y,w,h){ctx.fillStyle='rgba(25,24,20,.28)';ctx.beginPath();ctx.ellipse(x,y,w,h,0,0,Math.PI*2);ctx.fill()}
function roof(x,y,w,c){px(x-8,y-13,w+16,7,'#40332e');px(x-10,y-10,w+20,10,c);px(x-6,y, w+12,3,'#493b34')}
function win(x,y,w=20,h=16,light=false){px(x,y,w,h,'#513f36');px(x+2,y+2,w-4,h-4,light?'#d7c77e':'#71858a');px(x+w/2-1,y+2,2,h-4,'#3e4a49');px(x+2,y+h/2-1,w-4,2,'#3e4a49')}
function door(x,y,w=22,h=45,c='#654b3b'){px(x,y,w,h,'#3c302a');px(x+2,y+2,w-4,h-2,c);px(x+w-6,y+h/2,3,3,'#d2b66d')}
function label(t,x,y,w){px(x-2,y-2,w+4,13,'#44362f');px(x,y,w,9,'#c6a96f');ctx.fillStyle='#f1dfb0';ctx.font='700 6px monospace';ctx.textAlign='center';ctx.fillText(t.slice(0,15),x+w/2,y+7)}
function facade(b){if(!visible(b))return;const x=b.x,y=b.y,w=b.w,h=b.h;ctx.save();shadow(x+w/2,y+h+10,Math.max(18,w*.43),5);
let wall='#c6a477',trim='#876649',roofC='#5d4439';
if(b.type==='hospital'){roof(x,y,w,'#6d5a52');px(x-2,y,w+4,34,'#e8e1cf');px(x,y+34,w,h-34,'#d0c7b3');win(x+18,y+47,22,17,true);win(x+w-40,y+47,22,17,true);door(x+w/2-11,y+h-52,22,52,'#8d7770');px(x+w/2-4,y+10,8,24,'#b13d3d');px(x+w/2-12,y+18,24,8,'#b13d3d');label('SALUD',x+w/2-43,y-3,86)}
else if(b.type==='library'){roof(x,y,w,'#4d4840');px(x,y+1,w,h-1,'#cbb78e');px(x+10,y+23,w-20,7,'#806746');for(let i=0;i<5;i++)px(x+17+i*Math.max(18,(w-34)/4),y+39,10,h-51,'#76583f');door(x+w/2-12,y+h-48,24,48,'#5c4639');label('BIBLIOTECA',x+w/2-50,y-3,100)}
else if(b.type==='fire_station'){roof(x,y,w,'#6a3029');px(x,y+1,w,h-1,'#b25d4d');px(x+13,y+27,w-26,5,'#753a35');door(x+17,y+h-53,34,53,'#49383a');px(x+w-43,y+h-51,24,45,'#d2b56f');label('BOMBEROS',x+w/2-42,y-3,84)}
else if(b.type==='municipality'){roof(x,y,w,'#46513f');px(x,y+1,w,h-1,'#c8b486');px(x+8,y+23,w-16,6,'#70583f');for(let i=0;i<5;i++)win(x+18+i*Math.max(19,(w-54)/4),y+40,13,20,true);door(x+w/2-12,y+h-47,24,47,'#70553f');label('MUNICIPIO',x+w/2-54,y-3,108)}
else if(b.type==='school'){roof(x,y,w,'#4d6048');px(x,y+1,w,h-1,'#d0b37d');px(x+8,y+23,w-16,7,'#526a50');for(let i=0;i<4;i++)win(x+18+i*Math.max(20,(w-54)/3),y+40,15,19,true);door(x+w/2-12,y+h-48,24,48,'#75563f');label(b.label&&b.label.includes('JARD')?'JARDÍN':'ESCUELA',x+w/2-36,y-3,72)}
else if(b.type==='community'){roof(x,y,w,'#6b5149');px(x,y+1,w,h-1,'#b99b71');px(x+9,y+24,w-18,6,'#76563f');door(x+w/2-26,y+h-56,52,56,'#654839');label('SALÓN',x+w/2-30,y-3,60)}
else if(b.type==='chapel'){roof(x,y,w,'#714d47');px(x,y+1,w,h-1,'#d6bf94');door(x+w/2-19,y+h-49,38,49,'#745040');px(x+w/2-2,y-28,4,25,'#6b4a45');px(x+w/2-10,y-21,20,4,'#6b4a45');label('CAPILLA',x+w/2-28,y-3,56)}
else {roof(x,y,w,b.type==='winery'?'#58413a':roofC);px(x,y+1,w,h-1,wall);px(x+10,y+25,w-20,6,trim);door(x+w/2-12,y+h-49,24,49);win(x+17,y+43,20,16,false);if(w>120)win(x+w-37,y+43,20,16,false);label(b.label||'CASA',x+w/2-Math.min(55,w*.32),y-3,Math.min(110,w*.64));
if(b.type==='winery'){px(x+25,y+h-14,16,13,'#704a35');px(x+w-41,y+h-14,16,13,'#704a35');px(x+18,y+h+18,w-36,4,'#74513a')}
if(b.type==='rural'){px(x+18,y+h-12,16,12,'#8b623f');px(x+w-34,y+h-12,16,12,'#8b623f');}
}
if(b.type!=='hospital'&&b.type!=='municipality'&&b.type!=='school'&&b.type!=='library'&&b.type!=='fire_station'&&b.type!=='community'&&b.type!=='chapel')px(x+5,y+h-12,10,7,'#76543b');ctx.restore()}
function person(a,i){if(!visible({x:a.x-20,y:a.y-35,w:40,h:65}))return;const x=a.x,y=a.y,t=performance.now()/190+(a.walk||i)*.7,moving=a.moving!==false,step=moving?Math.sin(t)*2.5:0;ctx.save();ctx.translate(x,y);shadow(0,27,9,3);px(-9,8+step,7,17,'#27343a');px(2,8-step,7,17,'#27343a');px(-10,24+step,9,5,'#202326');px(2,24-step,9,5,'#202326');px(-12,-8,24,19,a.shirt||'#65764a');px(-15,-5,4,13,a.skin||'#c58c6b');px(11,-5,4,13,a.skin||'#c58c6b');px(-10,-28,20,19,a.skin||'#c58c6b');px(-11,-30,22,7,a.hair||'#302824');px(-6,-21,2,2,'#211d1b');px(4,-21,2,2,'#211d1b');ctx.restore()}
function vehicle(v){if(!visible({x:v.x-45,y:v.y-25,w:90,h:55}))return;ctx.save();ctx.translate(v.x,v.y);const k=v.type==='tractor'?1.15:v.type==='pickup'?.95:1;if(v.dir<0)ctx.scale(-1,1);shadow(0,21*k,43*k,5*k);px(-31*k,-10*k,60*k,22*k,v.color||'#6c6d61');px(-15*k,-20*k,26*k,12*k,'#263238');px(-11*k,-18*k,18*k,8*k,'#9aa9a4');px(-27*k,11*k,14*k,9*k,'#222326');px(15*k,11*k,14*k,9*k,'#222326');ctx.restore()}
function animal(a){if(!visible({x:a.x-30,y:a.y-25,w:60,h:55}))return;ctx.save();ctx.translate(a.x,a.y);shadow(0,24,18,4);if(a.type==='cow'){px(-20,-10,40,19,'#e1d8c5');px(-12,-8,8,7,'#5b4b3c');px(7,0,9,7,'#5b4b3c');px(-14,8,5,14,'#3b332b');px(9,8,5,14,'#3b332b');px(17,-7,9,9,'#e1d8c5')}else if(a.type==='horse'){px(-22,-9,39,18,'#8b5c3c');px(13,-20,13,19,'#70472f');px(-14,8,5,15,'#493326');px(8,8,5,15,'#493326')}else{px(-8,-5,15,11,'#e2d5b8');px(4,-10,7,7,'#bd4d3e');px(-6,6,3,8,'#554236');px(5,6,3,8,'#554236')}ctx.restore()}
function frame(){const d=Math.min(devicePixelRatio||1,2);ctx.setTransform(d,0,0,d,0,0);ctx.clearRect(0,0,vw,vh);const S=V.gameState||{};if(!S.started){requestAnimationFrame(frame);return}ctx.save();ctx.translate(vw/2,vh/2);ctx.scale(CAMERA,CAMERA);ctx.translate(-(Number(S.x)||0),-(Number(S.y)||0));const items=[];(V.worldGeometry?.buildings||[]).forEach(b=>items.push({y:b.y+b.h,fn:()=>facade(b)}));(V.peopleVehicles?.ambient||[]).forEach((a,i)=>items.push({y:a.y+28,fn:()=>person(a,i)}));(V.peopleVehicles?.vehicleData||[]).forEach(v=>items.push({y:v.y+18,fn:()=>vehicle(v)}));(V.peopleVehicles?.animals||[]).forEach(a=>items.push({y:a.y+18,fn:()=>animal(a)}));items.sort((a,b)=>a.y-b.y);items.forEach(i=>i.fn());ctx.restore();if(V.historicalWorld?.draw){const screenFn=(x,y)=>screen(x,y);V.historicalWorld.draw(ctx,screenFn,()=>true,(t,x,y)=>{ctx.fillStyle='#eadbb4';ctx.font='700 7px monospace';ctx.textAlign='center';ctx.fillText(t,x,y)});}requestAnimationFrame(frame)}
V.renderCompositor={version:'112.0',singleRAF:true,ownsBuildingFacades:true,ownsTerrain:false,ownsRoads:false,ownsRiver:false,ownsBridges:false,camera:CAMERA,visualStyle:'unified-final-world'};requestAnimationFrame(frame);
})();
