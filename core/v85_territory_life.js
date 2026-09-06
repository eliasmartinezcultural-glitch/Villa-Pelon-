/* Villa Pelón V85 — VIDA EN TERRITORIO
   Capa de simulación: horarios, vecinos, tránsito, animales, producción, clima,
   iluminación y detalles pixel-art sobre el mundo canónico de core/world.js.
   No crea una segunda autoridad de movimiento.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
function boot(){
 const W=V.worldAuthority?.geometry||V.world||{width:5200,height:3400};
 const life=V.life||(V.life={});
 const state=()=>V.gameState||{};
 life.version='V85'; life.worldSize={w:W.width||W.w,h:W.height||W.h};
 life.territory={population:0,trafficLevel:'bajo',season:'verano',weather:'despejado',timeOfDay:'mañana'};
 const people=[
  ['Marta',560,710,430,690,15,'#a9574d','comercio'],['Raúl',900,1840,2520,820,19,'#557ca8','chacra'],
  ['Lucía',1180,950,1280,1230,17,'#a55e8f','escuela'],['Pedro',1750,2040,3440,2010,18,'#b67b45','rural'],
  ['Nico',1900,1850,1970,1810,16,'#5d8d59','radio'],['Rosa',830,1100,850,1050,14,'#9b6b4e','plaza'],
  ['Tomás',1600,900,1740,1450,16,'#596f8f','servicios'],['Elena',2100,940,3000,1200,15,'#8c5f78','bodega'],
  ['Julio',700,1950,820,2350,13,'#78604d','barrio'],['Norma',1350,2010,1100,1770,14,'#9b6671','barrio'],
  ['Sergio',2350,780,2750,1030,18,'#63704f','chacra'],['Mabel',2900,2050,3150,1960,15,'#856a55','rural'],
  ['Lidia',450,2500,720,2400,12,'#8b6b5b','barrio'],['Héctor',1850,2480,1620,2390,13,'#68775c','taller'],
  ['Ana',2050,1250,1760,1230,12,'#8f5e70','escuela'],['Carlos',1500,1550,1980,1740,15,'#5f735e','comercio']
 ].map(p=>({name:p[0],x:p[1],y:p[2],home:[p[3],p[4]],work:[p[3],p[4]],speed:p[5],color:p[6],role:p[7],target:[p[1],p[2]],wait:Math.random()*5,moving:false,walk:Math.random()*4,direction:'down',sheltered:false}));
 const traffic=[
  [180,1555,72,0,'auto'],[900,1555,58,0,'camioneta'],[2100,1555,-76,0,'camion'],[3500,1555,82,0,'auto'],[4650,1555,-65,0,'camioneta'],
  [690,500,0,48,'colectivo'],[690,2500,0,-52,'auto'],[1030,600,0,62,'tractor'],[1030,2700,0,-42,'camion'],
  [2450,930,54,0,'camioneta'],[3200,1510,-46,0,'tractor']
 ].map(o=>({x:o[0],y:o[1],vx:o[2],vy:o[3],type:o[4]}));
 const animals=[
  [2460,740,'vaca',7,2],[2580,770,'vaca',-6,3],[2760,850,'caballo',5,-2],[3030,2010,'caballo',-6,3],
  [3260,2110,'vaca',5,-2],[3420,2200,'vaca',-4,2],[2380,2050,'oveja',3,2],[2500,2140,'oveja',-2,3],
  [620,2350,'perro',5,1],[760,2380,'perro',-4,1],[4550,1550,'caballo',3,2]
 ].map(o=>({x:o[0],y:o[1],type:o[2],vx:o[3],vy:o[4]}));
 const birds=Array.from({length:22},(_,i)=>({x:(i*241)%5200,y:470+(i*71)%1100,vx:18+(i%4)*7,phase:i*.73}));
 life.ambient=people;life.traffic=traffic;life.animals=animals;life.birds=birds;
 life.territory.population=people.length;
 const randTarget=(p,h)=>{
   const hour=h;
   if(hour<7||hour>=21)return p.home;
   if(life.weather==='lluvia'&&['plaza','chacra','rural','barrio'].includes(p.role))return p.role==='plaza'?[1280,1230]:[2400,740];
   if(p.role==='escuela'&&hour>=8&&hour<16)return p.work;
   if(p.role==='comercio'&&hour>=9&&hour<20)return p.work;
   if(p.role==='radio'&&hour>=10&&hour<19)return p.work;
   if(['chacra','rural','bodega'].includes(p.role)&&hour>=6&&hour<19)return p.work;
   if(p.role==='servicios'&&hour>=8&&hour<18)return p.work;
   if(p.role==='plaza'&&hour>=11&&hour<20)return [850+(Math.random()*220-110),1050+(Math.random()*180-90)];
   return [850+(Math.random()*1350),900+(Math.random()*1600)];
 };
 function hour(){return ((state().minutes||480)/60)%24}
 function move(p,dt){const dx=p.target[0]-p.x,dy=p.target[1]-p.y,d=Math.hypot(dx,dy);if(d<10){p.moving=false;return}p.moving=true;p.direction=Math.abs(dx)>Math.abs(dy)?(dx<0?'left':'right'):(dy<0?'up':'down');p.x+=dx/d*p.speed*dt;p.y+=dy/d*p.speed*dt;p.walk+=dt*7}
 function wrap(o){if(o.x>W.width+80)o.x=-80;if(o.x<-80)o.x=W.width+80;if(o.y>W.height+80)o.y=-80;if(o.y<-80)o.y=W.height+80}
 life.update=(dt,minutes)=>{
   const h=hour(); const clock=V.territoryClock;
   if(clock?.update)clock.update(state());
   life.territory.season=clock?.season||'verano';life.territory.timeOfDay=h<6?'noche':h<9?'amanecer':h<13?'mañana':h<18?'tarde':h<21?'atardecer':'noche';
   life.isNight=h<6||h>=21;
   life.period=life.territory.timeOfDay.toUpperCase();
   life.open={school:h>=8&&h<16,shops:h>=9&&h<20,chacras:h>=6&&h<19,radio:h>=10&&h<19};
   people.forEach(p=>{p.wait-=dt;if(p.wait<=0){p.wait=3+Math.random()*8;p.target=randTarget(p,h);p.sheltered=life.weather==='lluvia'&&['escuela','radio','bodega'].includes(p.role)}if(!life.isNight&&!p.sheltered)move(p,dt);else p.moving=false});
   traffic.forEach(o=>{const active=!life.isNight||o.type==='camion'||Math.random()>.97;o.x+=o.vx*dt*(active?1:.15);o.y+=o.vy*dt*(active?1:.15);wrap(o)});
   animals.forEach(o=>{o.x+=o.vx*dt*(life.isNight?.2:1);o.y+=o.vy*dt*(life.isNight?.2:1);if(Math.random()<dt*.025){o.vx+=(Math.random()-.5)*8;o.vy+=(Math.random()-.5)*8}if(o.x<300||o.x>4900)o.vx*=-1;if(o.y<600||o.y>2700)o.vy*=-1});
   birds.forEach(o=>{if(!life.isNight){o.x+=o.vx*dt;o.y+=Math.sin((minutes||480)/30+o.phase)*dt*5;if(o.x>W.width+30)o.x=-30}});
   life.temperature=clock?.getSeason?.().baseTemp||19;
   life.weather=life.weather||'despejado';
   life.weatherTimer=(life.weatherTimer||0)+dt;
   if(life.weatherTimer>42){life.weatherTimer=0;const choices=['despejado','nublado','viento','lluvia'];life.weather=choices[(choices.indexOf(life.weather)+1+Math.floor(Math.random()*2))%choices.length]}
 };
 function px(c,x,y,w,h,col){c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h))}
 function shadow(c,x,y,w){c.fillStyle='rgba(20,24,18,.22)';c.beginPath();c.ellipse(x,y,w,5,0,0,Math.PI*2);c.fill()}
 function tree(c,x,y,kind='tree'){shadow(c,x,y+17,13);px(c,x-3,y-2,6,22,'#68482e');px(c,x-12,y-13,24,18,kind==='orchard'?'#487341':'#3f683d');px(c,x-8,y-19,16,8,kind==='orchard'?'#5c8745':'#4d7545');if(kind==='orchard'){px(c,x-9,y-5,5,5,'#b6533f');px(c,x+3,y-10,5,5,'#c56a3e')}}
 function building(c,b){const colors={home:['#c5a77c','#8d6d4e'],civic:['#b9b09a','#665f52'],office:['#aaa99b','#64635a'],school:['#d1bd82','#765e3d'],culture:['#a99072','#604d3d'],health:['#c9c1a9','#6b6558'],service:['#a99d82','#5d574d'],shop:['#c39a68','#765238'],radio:['#817d6b','#4c493f'],religious:['#b9ae91','#655c4d'],transport:['#8d9b91','#4e5a53'],workshop:['#887d68','#4c4439'],winery:['#8e725c','#5b4436'],rural:['#8b795f','#5a4b3b']}[b.type]||['#aa9875','#5b4d3e'];
  shadow(c,b.x+b.w/2,b.y+b.h+5,Math.min(65,b.w*.32));px(c,b.x,b.y,b.w,b.h,colors[0]);px(c,b.x+8,b.y+8,b.w-16,8,colors[1]);px(c,b.x+12,b.y+22,b.w-24,b.h-32,'#b9a680');
  const cols=Math.max(1,Math.floor((b.w-30)/48));for(let i=0;i<cols;i++){const wx=b.x+18+i*48;px(c,wx,b.y+48,20,24,'#5e7780');px(c,wx+3,b.y+51,14,18,'#81969a')}
  px(c,b.x+b.w/2-16,b.y+b.h-38,32,38,colors[1]);px(c,b.x+b.w/2-10,b.y+b.h-23,4,5,'#c8a65e');
  c.font='700 12px monospace';c.fillStyle='#272b23';c.textAlign='center';c.fillText(b.label,b.x+b.w/2,b.y-7);c.textAlign='left';
 }
 function road(c,r){px(c,r.x,r.y,r.w,r.h,r.kind==='route'?'#5b5548':r.kind==='rural-road'?'#9a835f':'#756b5b');if(r.w>r.h){for(let x=r.x+18;x<r.x+r.w;x+=54)px(c,x,r.y+r.h/2-2,24,4,'#c7b98d')}else{for(let y=r.y+18;y<r.y+r.h;y+=54)px(c,r.x+r.w/2-2,y,4,24,'#c7b98d')}}
 function field(c,f){px(c,f.x,f.y,f.w,f.h,f.type==='apple-orchard'?'#6e8d4e':'#71864f');if(f.type==='apple-orchard'){for(let x=f.x+28;x<f.x+f.w-12;x+=42)for(let y=f.y+28;y<f.y+f.h-10;y+=42)tree(c,x,y,'orchard')}else{for(let x=f.x+8;x<f.x+f.w;x+=24){px(c,x,f.y+12,5,f.h-24,'#486d43')}}}
 function bridge(c,b){px(c,b.x,b.y,b.w,b.h,'#80694d');for(let x=b.x+8;x<b.x+b.w;x+=26)px(c,x,b.y+6,16,b.h-12,'#b19263');px(c,b.x,b.y,b.w,7,'#4e4639');px(c,b.x,b.y+b.h-7,b.w,7,'#4e4639')}
 function landscape(c){
   const g=V.worldAuthority?.geometry;if(!g)return;
   // River and bank are redrawn in a strict pixel palette.
   px(c,0,g.river.y,g.width,g.river.h,'#4d7890');for(let x=0;x<g.width;x+=46){px(c,x,g.river.y+34,24,4,'#79a1ad');px(c,x+18,g.river.y+112,31,4,'#3e687f')}
   px(c,0,g.river.walkableBank.y,g.width,g.river.walkableBank.h,'#a98f65');
   g.roads.forEach(r=>road(c,r));
   g.fields.forEach(f=>field(c,f));
   g.buildings.forEach(b=>building(c,b));
   g.bridges.forEach(b=>bridge(c,b));
   // Public green spaces and tree belts.
   for(let x=760;x<1000;x+=48)tree(c,x,940,'tree');
   for(let x=1180;x<1680;x+=58)tree(c,x,440,'tree');
   for(let x=3900;x<5100;x+=64)tree(c,x,650,'tree');
   // Barda / meseta: stepped pixel escarpment.
   for(let y=500;y<2750;y+=54){const width=90+((y/54)%4)*26;px(c,5100-width,y,width,46,'#8c7558');px(c,5100-width,y+8,width-24,7,'#a38a67')}
 }
 function person(c,p){shadow(c,p.x,p.y+24,12);px(c,p.x-8,p.y-2,16,20,p.color);px(c,p.x-7,p.y-20,14,15,'#d8a17c');px(c,p.x-8,p.y-22,16,5,'#382e28');if(p.moving){px(c,p.x-8,p.y+18,6,6,'#30352c');px(c,p.x+2,p.y+18,6,6,'#30352c')}if(p.name===state().nearName)px(c,p.x-2,p.y-35,4,4,'#e7d69e')}
 function vehicle(c,o){shadow(c,o.x,o.y+12,o.type==='camion'?24:17);const col=o.type==='tractor'?'#607844':o.type==='camion'?'#785d48':o.type==='colectivo'?'#66765f':'#4f6570';if(o.vy){px(c,o.x-8,o.y-22,16,44,col);px(c,o.x-5,o.y-17,10,9,'#9aaba5')}else{px(c,o.x-22,o.y-9,44,18,col);px(c,o.x-11,o.y-5,11,7,'#8fa4a0');px(c,o.x+10,o.y+6,8,5,'#282b28')}}
 function animal(c,o){shadow(c,o.x,o.y+12,o.type==='caballo'?18:13);const col=o.type==='caballo'?'#86583b':o.type==='vaca'?'#ded5bf':o.type==='oveja'?'#e4ded1':'#9a7656';px(c,o.x-15,o.y-8,30,15,col);px(c,o.x+9,o.y-14,10,12,col);px(c,o.x-10,o.y+6,5,12,'#40382e');px(c,o.x+7,o.y+6,5,12,'#40382e');if(o.type==='vaca'){px(c,o.x-7,o.y-7,7,6,'#695846');px(c,o.x+3,o.y,6,5,'#695846')}}
 life.drawWorld=c=>{landscape(c);if(!life.isNight){birds.forEach(o=>{const w=Math.sin((life.phase||0)*8+o.phase)*3;px(c,o.x,o.y,5,2,'#26342c');px(c,o.x-4,o.y+w,4,2,'#26342c');px(c,o.x+5,o.y-w,4,2,'#26342c')})}traffic.forEach(o=>vehicle(c,o));animals.forEach(o=>animal(c,o));people.forEach(o=>person(c,o));life.phase=(life.phase||0)+.016};
 life.drawOverlay=(c,vw,vh)=>{const h=hour();let darkness=0;if(h<6||h>=21)darkness=.34;else if(h<8)darkness=.12;else if(h>=18)darkness=.14;if(life.weather==='nublado')darkness+=.05;if(life.weather==='lluvia')darkness+=.07;if(darkness){c.fillStyle=`rgba(14,24,37,${Math.min(.46,darkness)})`;c.fillRect(0,0,vw,vh)}if(life.weather==='lluvia'){c.strokeStyle='rgba(200,220,230,.34)';for(let i=0;i<70;i++){const x=(i*53+(life.phase||0)*70)%vw,y=(i*31+(life.phase||0)*140)%vh;c.beginPath();c.moveTo(x,y);c.lineTo(x-3,y+10);c.stroke()}}};
 life.__v85=true;V.life=life;V.territoryLife=life.territory;console.info('[Villa Pelón] V85 — Vida en Territorio activa');
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
