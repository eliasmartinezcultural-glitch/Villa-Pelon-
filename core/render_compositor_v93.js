/* VILLA PELÓN — RENDER COMPOSITOR V104
   Autoridad visual única de detalle.
   Pixel art fino, territorial y legible. No mueve NPC, no guarda, no crea misiones.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const canvas=document.getElementById('worldDetail');if(!canvas)return;const ctx=canvas.getContext('2d');if(!ctx)return;
ctx.imageSmoothingEnabled=false;let vw=innerWidth,vh=innerHeight;
function resize(){vw=innerWidth;vh=innerHeight;const d=Math.min(devicePixelRatio||1,2);canvas.width=Math.max(1,Math.floor(vw*d));canvas.height=Math.max(1,Math.floor(vh*d));canvas.style.width=vw+'px';canvas.style.height=vh+'px';canvas.style.position='absolute';canvas.style.inset='0';canvas.style.pointerEvents='none';ctx.setTransform(d,0,0,d,0,0)}
addEventListener('resize',resize,{passive:true});resize();
function screen(x,y){const s=V.gameState||{};return{x:x-(+s.x||0)+vw/2,y:y-(+s.y||0)+vh/2}}
function visible(q,w,h){return !(q.x+w<0||q.x>vw||q.y+h<0||q.y>vh)}
function px(x,y,w,h,c){ctx.fillStyle=c;ctx.fillRect(Math.round(x),Math.round(y),Math.max(1,Math.round(w)),Math.max(1,Math.round(h)))}
function text(t,x,y,size=7){ctx.font='700 '+size+'px monospace';ctx.textAlign='center';ctx.lineWidth=3;ctx.strokeStyle='rgba(18,19,16,.92)';ctx.fillStyle='#f1dfb0';ctx.strokeText(t,Math.round(x),Math.round(y));ctx.fillText(t,Math.round(x),Math.round(y))}
function shadow(x,y,w=20,h=5){ctx.fillStyle='rgba(25,24,20,.27)';ctx.beginPath();ctx.ellipse(Math.round(x),Math.round(y),w,h,0,0,Math.PI*2);ctx.fill()}
function roof(x,y,w,c){px(x-7,y-12,w+14,7,'#40332e');px(x-9,y-9,w+18,10,c);px(x-5,y-1,w+10,3,'#493b34');for(let i=0;i<w;i+=24)px(x+i,y-7,10,2,'rgba(235,205,150,.20)')}
function windowPixel(x,y,w=18,h=15,light=false){px(x,y,w,h,'#513f36');px(x+2,y+2,w-4,h-4,light?'#d7c77e':'#71858a');px(x+Math.floor(w/2)-1,y+2,2,h-4,'#3e4a49');px(x+2,y+Math.floor(h/2)-1,w-4,2,'#3e4a49')}
function door(x,y,w=22,h=42,c='#654b3b'){px(x,y,w,h,'#3c302a');px(x+2,y+2,w-4,h-2,c);px(x+w-6,y+h/2,3,3,'#d2b66d');px(x+4,y+5,2,h-12,'rgba(220,190,135,.18)')}
function sign(x,y,w,label){px(x-2,y-2,w+4,13,'#44362f');px(x,y,w,9,'#c6a96f');text(label,x+w/2,y+7,6)}
function fence(x,y,w,vertical=false){if(vertical){for(let i=0;i<w;i+=18)px(x,y+i,4,16,'#76583f');px(x-1,y+5,w+2,3,'#8d6949');px(x-1,y+12,w+2,3,'#8d6949')}else{for(let i=0;i<w;i+=18)px(x+i,y,4,16,'#76583f');px(x+5,y-1,w-8,3,'#8d6949');px(x+5,y+7,w-8,3,'#8d6949')}}
function shrub(x,y,s=1){px(x-9*s,y,18*s,8*s,'#3f5b3c');px(x-6*s,y-7*s,12*s,9*s,'#547045');px(x-2*s,y-11*s,7*s,6*s,'#708052');px(x-12*s,y+6*s,24*s,4*s,'#344a35')}
function tree(x,y,s=1){shadow(x,y+26*s,14*s,4*s);px(x-4*s,y+8*s,8*s,22*s,'#604833');px(x-7*s,y+15*s,14*s,5*s,'#76543b');px(x-17*s,y-8*s,34*s,24*s,'#415b3d');px(x-12*s,y-16*s,25*s,18*s,'#526e45');px(x-5*s,y-22*s,14*s,10*s,'#698053');px(x-20*s,y-2*s,8*s,10*s,'#344d37');px(x+12*s,y-2*s,8*s,10*s,'#344d37')}
function barrel(x,y){px(x-7,y-10,14,17,'#704a35');px(x-9,y-7,18,3,'#9a6846');px(x-9,y+2,18,3,'#9a6846');px(x-2,y-11,4,18,'#4c392e')}
function crate(x,y){px(x-8,y-7,16,13,'#8b623f');px(x-6,y-5,12,9,'#b07a4b');px(x-5,y-4,10,2,'#6b4934');px(x-1,y-5,2,10,'#6b4934')}
function planter(x,y){px(x-7,y-4,14,7,'#674638');px(x-5,y-9,10,6,'#557043');px(x-2,y-13,5,6,'#789050')}
function trellis(x,y,w){for(let i=0;i<w;i+=24){px(x+i,y-18,3,23,'#644833');px(x+i+10,y-16,3,21,'#644833')}px(x,y-16,w,3,'#74513a');for(let i=0;i<w;i+=18){px(x+i,y-13,10,3,'#4e713f');px(x+i+5,y-9,7,3,'#63844a')}}
function surfaceStitches(){
 const G=V.worldGeometry||{},S=V.gameState||{}; if(!G)return;
 /* Detalle de suelo: nunca rellena ni reemplaza el terreno base. Sólo cose píxeles. */
 (G.roads||[]).forEach((r,ri)=>{const horizontal=r.w>=r.h,q=screen(r.x,r.y);if(!visible(q,r.w,r.h))return;const step=48+(ri%3)*17;
   if(horizontal){for(let x=8;x<r.w-8;x+=step){px(q.x+x,q.y+r.h/2-1,18,2,'rgba(74,60,45,.30)');px(q.x+x+23,q.y+r.h/2+3,7,2,'rgba(235,211,161,.20)')}}
   else{for(let y=8;y<r.h-8;y+=step){px(q.x+r.w/2-1,q.y+y,2,18,'rgba(74,60,45,.30)');px(q.x+r.w/2+3,q.y+y+23,2,7,'rgba(235,211,161,.20)')}}
 });
 const river=G.worldRules?.boundaries?{x:0,y:G.worldRules.boundaries.waterY,w:8200,h:G.worldRules.boundaries.waterHeight}:V.worldManifest?.river;
 if(river){const q=screen(river.x,river.y);if(visible(q,river.w,river.h)){for(let x=Math.max(0,-q.x);x<Math.min(vw-q.x,river.w);x+=34){px(q.x+x,q.y+4,12,1,'rgba(205,224,205,.38)');px(q.x+x+15,q.y+11,7,1,'rgba(48,88,88,.30)')}}}
 (G.bridges||[]).forEach((b)=>{const q=screen(b.x,b.y);if(!visible(q,b.w,b.h))return;for(let x=4;x<b.w-4;x+=18){px(q.x+x,q.y+7,12,4,'#76583f');px(q.x+x+3,q.y+12,7,2,'#b28a59')}px(q.x,q.y+3,b.w,3,'#46382f');px(q.x,q.y+b.h-6,b.w,3,'#46382f')});
 (G.buildings||[]).forEach((b,i)=>{if(b.type!=='rural'||b.y<1000)return;const q=screen(b.x,b.y+b.h+32);if(!visible(q,b.w,34))return;for(let x=8;x<b.w-8;x+=42){px(q.x+x,q.y,2,24,'rgba(91,70,48,.55)');px(q.x+x+8,q.y+5,18,2,'rgba(86,111,57,.55)')}});
 const seed=[31,79,149,211,307,401,503,601,701,809,907];for(let i=0;i<seed.length;i++){const wx=4800+(seed[i]*37)%3200,wy=1020+(seed[i]*61)%1850,p=screen(wx,wy);if(p.x>-12&&p.x<vw+12&&p.y>-12&&p.y<vh+12){px(p.x,p.y,2,5,'#3f5b3c');px(p.x-2,p.y+3,6,2,'#547045')}}
}
function facade(b){const q=screen(b.x,b.y);if(!visible(q,b.w,b.h+75))return;const x=Math.round(q.x),y=Math.round(q.y),w=Math.round(b.w),h=Math.round(b.h);ctx.save();shadow(x+w/2,y+h+8,Math.max(18,w*.43),5);
let wall='#c6a477',trim='#876649',roofC='#5d4439';
if(b.type==='hospital'){roof(x,y,w,'#6d5a52');px(x-2,y,w+4,34,'#e8e1cf');px(x,y+34,w,h-34,'#d0c7b3');windowPixel(x+18,y+47,22,17,true);windowPixel(x+w-40,y+47,22,17,true);door(x+w/2-11,y+h-52,22,52,'#8d7770');px(x+w/2-4,y+10,8,24,'#b13d3d');px(x+w/2-12,y+18,24,8,'#b13d3d');sign(x+w/2-43,y-3,86,'SALUD');}
else if(b.type==='library'){roof(x,y,w,'#4d4840');px(x,y+1,w,h-1,'#cbb78e');px(x+10,y+23,w-20,7,'#806746');for(let i=0;i<5;i++)px(x+17+i*Math.max(18,(w-34)/4),y+39,10,h-51,'#76583f');door(x+w/2-12,y+h-48,24,48,'#5c4639');sign(x+w/2-50,y-3,100,'BIBLIOTECA');}
else if(b.type==='fire_station'){roof(x,y,w,'#6a3029');px(x,y+1,w,h-1,'#b25d4d');px(x+13,y+27,w-26,5,'#753a35');door(x+17,y+h-53,34,53,'#49383a');px(x+w-43,y+h-51,24,45,'#d2b56f');px(x+w-37,y+h-46,12,35,'#6f5541');sign(x+w/2-42,y-3,84,'BOMBEROS');}
else if(b.type==='municipality'){roof(x,y,w,'#46513f');px(x,y+1,w,h-1,'#c8b486');px(x+8,y+23,w-16,6,'#70583f');for(let i=0;i<5;i++)windowPixel(x+18+i*Math.max(19,(w-54)/4),y+40,13,20,true);door(x+w/2-12,y+h-47,24,47,'#70553f');sign(x+w/2-54,y-3,108,'MUNICIPIO');}
else if(b.type==='school'){roof(x,y,w,'#4d6048');px(x,y+1,w,h-1,'#d0b37d');px(x+8,y+23,w-16,7,'#526a50');for(let i=0;i<4;i++)windowPixel(x+18+i*Math.max(20,(w-54)/3),y+40,15,19,true);door(x+w/2-12,y+h-48,24,48,'#75563f');px(x+w-31,y-23,3,24,'#66513f');px(x+w-28,y-21,20,10,'#d7c27f');sign(x+w/2-36,y-3,72,b.label&&b.label.includes('JARD')?'JARDÍN':'ESCUELA');}
else if(b.type==='community'){roof(x,y,w,'#6b5149');px(x,y+1,w,h-1,'#b99b71');px(x+9,y+24,w-18,6,'#76563f');door(x+w/2-26,y+h-56,52,56,'#654839');px(x+w/2-18,y+h-48,36,4,'#a07b50');sign(x+w/2-30,y-3,60,'SALÓN');}
else if(b.type==='chapel'){roof(x,y,w,'#714d47');px(x,y+1,w,h-1,'#d6bf94');px(x+w/2-7,y+17,14,14,'#eee2c6');door(x+w/2-19,y+h-49,38,49,'#745040');px(x+w/2-2,y-28,4,25,'#6b4a45');px(x+w/2-10,y-21,20,4,'#6b4a45');sign(x+w/2-28,y-3,56,'CAPILLA');}
else {roof(x,y,w,roofC);px(x,y+1,w,h-1,wall);px(x+10,y+25,w-20,6,trim);door(x+w/2-12,y+h-49,24,49);windowPixel(x+17,y+43,20,16,false);windowPixel(x+w-37,y+43,20,16,false);const label=b.label||'CASA';sign(x+w/2-Math.min(55,w*.32),y-3,Math.min(110,w*.64),label.slice(0,15));
 if(b.type==='winery'){barrel(x+28,y+h-8);barrel(x+w-28,y+h-8);trellis(x+18,y+h+22,Math.max(50,w-36));}
 else if(b.type==='rural'){crate(x+26,y+h-7);crate(x+w-30,y+h-7);fence(x+w+12,y+h-20,65);}
 else if(b.type==='home'){planter(x+18,y+h-4);planter(x+w-18,y+h-4);}
 else if(b.type==='shop'){px(x+10,y+h-30,w-20,8,'#6b4b38');px(x+14,y+h-22,w-28,6,'#d0ae67');}
 else if(b.type==='radio'){px(x+w/2-3,y-36,6,36,'#4b4139');px(x+w/2-13,y-31,26,3,'#4b4139');px(x+w/2-19,y-25,38,3,'#4b4139');}
 else if(b.type==='service'){crate(x+25,y+h-7);px(x+w-35,y+h-8,26,5,'#4d5d58');}
 else if(b.type==='culture'){planter(x+18,y+h-4);planter(x+w-18,y+h-4);}
 }
if(b.type!=='hospital'&&b.type!=='municipality'&&b.type!=='school'&&b.type!=='library'&&b.type!=='fire_station'&&b.type!=='community'&&b.type!=='chapel')px(x+5,y+h-12,10,7,'#76543b');
ctx.restore()}
function person(a,i){const p=screen(a.x,a.y);if(p.x<-50||p.x>vw+50||p.y<-65||p.y>vh+65)return;const s=.92,t=performance.now()/190+(a.walk||i)*.7,moving=a.moving!==false,bob=moving?Math.sin(t)*1.1:0,step=moving?Math.sin(t)*2.5:0;ctx.save();ctx.translate(Math.round(p.x),Math.round(p.y+bob));shadow(0,27,9,3);px(-9*s,8*s+step,7*s,17*s,'#27343a');px(2*s,8*s-step,7*s,17*s,'#27343a');px(-10*s,24*s+step,9*s,5*s,'#202326');px(2*s,24*s-step,9*s,5*s,'#202326');px(-12*s,-8*s,24*s,19*s,a.shirt||'#65764a');px(-15*s,-5*s,4*s,13*s,a.skin||'#c58c6b');px(11*s,-5*s,4*s,13*s,a.skin||'#c58c6b');px(-10*s,-28*s,20*s,19*s,a.skin||'#c58c6b');px(-11*s,-30*s,22*s,7*s,a.hair||'#302824');px(-10*s,-27*s,4*s,8*s,a.hair||'#302824');px(6*s,-27*s,4*s,8*s,a.hair||'#302824');px(-6*s,-21*s,2*s,2*s,'#211d1b');px(4*s,-21*s,2*s,2*s,'#211d1b');px(-3*s,-15*s,6*s,2*s,'#4d3028');if(a.dir==='left')px(-15*s,-1,3,5,'#d8b46f');else if(a.dir==='right')px(12*s,-1,3,5,'#d8b46f');ctx.restore()}
function vehicle(v){const p=screen(v.x,v.y);if(p.x<-130||p.x>vw+130||p.y<-90||p.y>vh+90)return;const k=v.type==='tractor'?1.15:v.type==='pickup'?.95:1;ctx.save();ctx.translate(Math.round(p.x),Math.round(p.y));if(v.dir<0)ctx.scale(-1,1);shadow(0,21*k,43*k,5*k);px(-31*k,-10*k,60*k,22*k,v.color||'#6c6d61');px(-25*k,-13*k,52*k,4*k,'#4b5049');px(-15*k,-20*k,26*k,12*k,'#263238');px(-11*k,-18*k,18*k,8*k,'#9aa9a4');px(-27*k,11*k,14*k,9*k,'#222326');px(15*k,11*k,14*k,9*k,'#222326');px(-24*k,13*k,8*k,6*k,'#4d4b45');px(17*k,13*k,8*k,6*k,'#4d4b45');if(v.type==='tractor'){px(19*k,-6*k,23*k,8*k,v.color||'#657052');px(-30*k,8*k,5*k,7*k,'#b9a35d');}ctx.restore()}
function animal(a){const p=screen(a.x,a.y);if(p.x<-80||p.x>vw+80||p.y<-55||p.y>vh+55)return;ctx.save();ctx.translate(Math.round(p.x),Math.round(p.y));shadow(0,24,18,4);if(a.type==='cow'){px(-20,-10,40,19,'#e1d8c5');px(-12,-8,8,7,'#5b4b3c');px(7,0,9,7,'#5b4b3c');px(-14,8,5,14,'#3b332b');px(9,8,5,14,'#3b332b');px(17,-7,9,9,'#e1d8c5');px(23,-4,5,5,'#4d3b34');px(-24,-4,5,4,'#e1d8c5');}else if(a.type==='horse'){px(-22,-9,39,18,'#8b5c3c');px(13,-20,13,19,'#70472f');px(-14,8,5,15,'#493326');px(8,8,5,15,'#493326');px(22,-18,5,9,'#3b2c25');}else{px(-8,-5,15,11,'#e2d5b8');px(4,-10,7,7,'#bd4d3e');px(-6,6,3,8,'#554236');px(5,6,3,8,'#554236');}ctx.restore()}
function microLandscape(){const s=V.gameState||{};if(!V.worldGeometry)return;const seed=[(s.day||1)*17,83,149,211,307,401,503,601];for(let i=0;i<seed.length;i++){const wx=900+(seed[i]*37)%6800,wy=220+(seed[i]*61)%3500,p=screen(wx,wy);if(p.x>-40&&p.x<vw+40&&p.y>-40&&p.y<vh+40)shrub(p.x,p.y,((i%3)+1)/3)} }
function frame(){const d=Math.min(devicePixelRatio||1,2);ctx.setTransform(d,0,0,d,0,0);ctx.clearRect(0,0,vw,vh);if(!V.gameState?.started){requestAnimationFrame(frame);return}surfaceStitches();microLandscape();const items=[];const B=V.worldGeometry?.buildings||[];B.forEach(b=>items.push({y:b.y+b.h,fn:()=>facade(b)}));(V.peopleVehicles?.ambient||[]).forEach((a,i)=>items.push({y:a.y+28,fn:()=>person(a,i)}));(V.peopleVehicles?.vehicleData||[]).forEach(v=>items.push({y:v.y+18,fn:()=>vehicle(v)}));(V.peopleVehicles?.animals||[]).forEach(a=>items.push({y:a.y+18,fn:()=>animal(a)}));items.sort((a,b)=>a.y-b.y);items.forEach(i=>i.fn());if(V.historicalWorld?.draw)V.historicalWorld.draw(ctx,screen,visible,text);requestAnimationFrame(frame)}
V.renderCompositor={version:'104.0',singleRAF:true,historicalLayer:true,visualStyle:'fine-pixel-art',ownsBuildingFacades:true,detailLevel:'very-high',surfaceDetail:true};requestAnimationFrame(frame);
})();
