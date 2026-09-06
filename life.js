/* Villa Pelón — V80 motor de vida territorial.
   Vida autónoma + ciclo anual + iluminación solar + rutinas + detalles estacionales.
   Este módulo NO mueve al jugador: gobierna exclusivamente la vida del territorio.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const clock=V.territoryClock||{};
const life=V.life={version:'V80',weather:'despejado',temperature:19,isNight:false,phase:0,weatherTimer:0,dayPulse:0,traffic:[],animals:[],ambient:[],workers:[],birds:[],particles:[],events:[],season:'verano',period:'MAÑANA',activity:'normal',open:{}};
const W=3200,H=2000,kinds=['despejado','nublado','viento','lluvia'];
const places={casa:[760,450],plaza:[1160,390],escuela:[530,565],almacen:[1750,610],radio:[1200,1190],chacra:[2160,1000],galpon:[2300,470],bodega:[2750,945]};
const people=[
{name:'Marta',x:820,y:690,home:places.casa,work:places.almacen,color:'#b95e4e',speed:24,role:'comercio'},
{name:'Raúl',x:1450,y:790,home:[1450,790],work:places.chacra,color:'#557ca8',speed:20,role:'chacra'},
{name:'Lucía',x:1020,y:520,home:places.casa,work:places.escuela,color:'#a55e8f',speed:22,role:'escuela'},
{name:'Pedro',x:2050,y:1130,home:[1450,790],work:[2050,1130],color:'#bd8249',speed:19,role:'rural'},
{name:'Nico',x:1200,y:1190,home:[1450,790],work:places.radio,color:'#5d8d59',speed:23,role:'radio'},
{name:'Rosa',x:1010,y:430,home:[900,500],work:places.plaza,color:'#9b6b4e',speed:18,role:'plaza'},
{name:'Tomás',x:1340,y:470,home:[1450,790],work:[1340,470],color:'#596f8f',speed:21,role:'servicios'},
{name:'Elena',x:1500,y:870,home:[1450,790],work:[1600,880],color:'#8c5f78',speed:20,role:'comercio'}];
function reset(){
 life.traffic=[{x:300,y:694,vx:78,vy:0,type:'auto'},{x:1950,y:735,vx:-62,vy:0,type:'camioneta'},{x:1165,y:250,vx:0,vy:55,type:'tractor'},{x:1200,y:1530,vx:0,vy:-44,type:'camion'},{x:800,y:650,vx:42,vy:0,type:'bicicleta'},{x:2700,y:694,vx:-48,vy:0,type:'auto'},{x:1165,y:1100,vx:0,vy:-36,type:'camioneta'}];
 life.animals=[{x:1500,y:840,vx:9,vy:3,type:'vaca'},{x:1570,y:875,vx:-7,vy:2,type:'vaca'},{x:2050,y:1080,vx:6,vy:-3,type:'caballo'},{x:2110,y:1140,vx:-5,vy:3,type:'caballo'},{x:940,y:560,vx:14,vy:7,type:'gallina'},{x:980,y:575,vx:-10,vy:5,type:'gallina'},{x:1350,y:550,vx:9,vy:-6,type:'gallina'},{x:2660,y:1280,vx:5,vy:2,type:'vaca'},{x:2740,y:1320,vx:-4,vy:3,type:'vaca'}];
 life.ambient=people.map(p=>({...p,target:[p.x,p.y],destination:'plaza',wait:Math.random()*3,active:true,moving:false,direction:'down',walk:Math.random()*4,sheltered:false}));
 life.workers=[{x:2470,y:1170,vx:10,vy:0,type:'worker',state:'trabajando'},{x:2580,y:1240,vx:-8,vy:0,type:'worker',state:'trabajando'},{x:2260,y:680,vx:0,vy:8,type:'worker',state:'trasladando'},{x:2350,y:680,vx:0,vy:-7,type:'worker',state:'trasladando'}];
 life.birds=Array.from({length:12},(_,i)=>({x:500+i*170,y:170+(i%4)*42,vx:18+(i%3)*7,phase:i*.8}));
 life.particles=[];life.events=[];
}
reset();
life.nextWeather=()=>{const i=(kinds.indexOf(life.weather)+1+Math.floor(Math.random()*2))%kinds.length;life.weather=kinds[i];life.temperature=(clock.getSeason?clock.getSeason().baseTemp:19)+(life.weather==='lluvia'?-5:life.weather==='nublado'?-2:life.weather==='viento'?-3:1);return life.weather};
function destinationFor(p,h){
 const night=h<6.5||h>=21;
 if(night)return ['casa',p.home];
 if(life.weather==='lluvia'&&['plaza','chacra','rural'].includes(p.role))return p.role==='plaza'?['escuela',places.escuela]:['galpon',places.galpon];
 if(p.role==='escuela'&&h>=8&&h<16)return ['escuela',p.work];
 if(p.role==='comercio'&&h>=9&&h<20)return ['almacen',p.work];
 if(p.role==='radio'&&h>=10&&h<18)return ['radio',p.work];
 if((p.role==='chacra'||p.role==='rural')&&h>=6.5&&h<18.5)return ['chacra',p.work];
 if(p.role==='plaza'&&h>=11&&h<19)return ['plaza',places.plaza];
 if(p.role==='servicios'&&h>=8&&h<17)return ['galpon',p.work];
 return ['plaza',[1160+(p.name.charCodeAt(0)%5)*45,390+(p.name.charCodeAt(0)%4)*55]];
}
function moveToward(o,t,dt){const dx=t[0]-o.x,dy=t[1]-o.y,d=Math.hypot(dx,dy);if(d<8){o.moving=false;return true}o.moving=true;if(Math.abs(dx)>Math.abs(dy))o.direction=dx<0?'left':'right';else o.direction=dy<0?'up':'down';o.x+=dx/d*(o.speed||18)*dt;o.y+=dy/d*(o.speed||18)*dt;o.walk=(o.walk||0)+dt*8;return false}
function wrap(o){if(o.x>W+90)o.x=-90;if(o.x<-90)o.x=W+90;if(o.y>H+90)o.y=-90;if(o.y<-90)o.y=H+90}
function solarFactor(h){const sr=clock.sunrise??6,ss=clock.sunset??20; if(h<sr-.75||h>ss+.75)return .08;if(h<sr)return .08+(h-(sr-.75))/.75*.22;if(h<sr+.75)return .30+(h-sr)/.75*.55;if(h<ss-.8)return .85;if(h<ss)return .85-(h-(ss-.8))/.8*.35;if(h<ss+.75)return .50-(h-ss)/.75*.42;return .08}
function schedule(h){
 const s=clock.schedule||{};return {school:h>=s.school?.[0]&&h<s.school?.[1],shops:h>=s.shops?.[0]&&h<s.shops?.[1],radio:h>=s.radio?.[0]&&h<s.radio?.[1],chacras:h>=s.chacras?.[0]&&h<s.chacras?.[1],plaza:h>=s.plaza?.[0]&&h<s.plaza?.[1],bodega:h>=s.bodega?.[0]&&h<s.bodega?.[1],services:h>=s.services?.[0]&&h<s.services?.[1]};
}
life.update=(dt,minutes)=>{
 const state=V.gameState||{};if(clock.update)clock.update(state);
 const h=clock.hour??((minutes||480)/60)%24;life.isNight=clock.isNight??(h<6.5||h>=21);life.period=clock.periodLabel?clock.periodLabel():'MAÑANA';life.season=clock.season||'verano';life.open=schedule(h);life.activity=life.isNight?'quiet':(h>=6.5&&h<9?'start':h>=12&&h<14?'pause':h>=18&&h<21?'social':'normal');
 life.phase+=dt;life.weatherTimer+=dt;life.dayPulse+=dt;if(life.weatherTimer>38){life.weatherTimer=0;life.nextWeather()}
 life.traffic.forEach(o=>{const active=!life.isNight||Math.random()>.992;o.x+=o.vx*dt*(active?1:.18);o.y+=o.vy*dt*(active?1:.18);wrap(o)});
 life.ambient.forEach(o=>{o.wait-=dt;if(o.wait<=0){o.wait=2.5+Math.random()*6;const d=destinationFor(o,h);o.destination=d[0];o.target=d[1];o.sheltered=life.weather==='lluvia'&&['escuela','galpon','radio','almacen'].includes(o.destination);o.active=Math.random()>.08}if(o.active&&!o.sheltered)moveToward(o,o.target,dt);else{o.moving=false;o.walk=0}});
 life.workers.forEach(o=>{const active=life.open.chacras&&!life.isNight;o.x+=o.vx*dt*(active?1:.15);o.y+=o.vy*dt*(active?1:.15);if(o.x<2200||o.x>2700)o.vx*=-1;if(o.y<650||o.y>1350)o.vy*=-1;o.walk=(o.walk||0)+dt*6});
 life.animals.forEach(o=>{o.x+=o.vx*dt*(life.isNight?.2:1);o.y+=o.vy*dt*(life.isNight?.2:1);const lo=o.type==='gallina'?880:1350,hi=o.type==='gallina'?1450:2900,ly=o.type==='gallina'?500:800,hy=o.type==='gallina'?650:1450;if(o.x<lo||o.x>hi)o.vx*=-1;if(o.y<ly||o.y>hy)o.vy*=-1});
 life.birds.forEach(o=>{o.x+=o.vx*dt*(life.isNight?0:.55);o.y+=Math.sin(life.phase+o.phase)*4*dt;if(o.x>W+30)o.x=-30});
};
function sh(c,x,y,w){c.fillStyle='rgba(25,20,15,.20)';c.beginPath();c.ellipse(x,y,w,5,0,0,Math.PI*2);c.fill()}
function vehicle(c,o){c.save();c.translate(Math.round(o.x),Math.round(o.y));if(o.vy)c.rotate(Math.PI/2);sh(c,0,13,o.type==='camion'?28:21);c.fillStyle=o.type==='tractor'?'#54733b':o.type==='camion'?'#80624b':o.type==='bicicleta'?'#344c59':o.type==='camioneta'?'#7c704f':'#4d6270';c.fillRect(-22,-10,44,20);if(o.type==='tractor'){c.fillRect(7,-18,16,15);c.fillStyle='#20231e';c.fillRect(-18,8,12,9);c.fillRect(9,8,14,10)}else if(o.type==='camion')c.fillRect(8,-16,24,28);else{c.fillStyle='#222';c.fillRect(-16,9,9,7);c.fillRect(8,9,9,7)}c.restore()}
function animal(c,o){c.save();c.translate(Math.round(o.x),Math.round(o.y));sh(c,0,13,o.type==='caballo'?25:17);if(o.type==='vaca'){c.fillStyle='#e8dfc9';c.fillRect(-20,-10,40,20);c.fillStyle='#5b4b3c';c.fillRect(-10,-9,8,7);c.fillRect(7,1,8,8);c.fillStyle='#3b332b';c.fillRect(-14,9,5,12);c.fillRect(10,9,5,12);c.fillRect(18,-7,8,9)}else if(o.type==='caballo'){c.fillStyle='#8b5c3c';c.fillRect(-23,-9,42,18);c.fillRect(14,-20,13,18);c.fillStyle='#493326';c.fillRect(-15,8,5,15);c.fillRect(9,8,5,15)}else{c.fillStyle='#e2d5b8';c.fillRect(-7,-5,14,11);c.fillStyle='#bd4d3e';c.fillRect(4,-10,7,7)}c.restore()}
function person(c,o){c.save();c.translate(Math.round(o.x),Math.round(o.y));sh(c,0,17,16);c.fillStyle=o.color;c.fillRect(-10,-2,20,25);c.fillStyle='#e0ad88';c.fillRect(-9,-23,18,18);c.fillStyle='#342c28';c.fillRect(-10,-24,20,6);if(o.moving){c.fillStyle='#253126';c.fillRect(-9,22,7,5);c.fillRect(3,22,7,5)}c.restore()}
function worker(c,o){c.save();c.translate(Math.round(o.x),Math.round(o.y));sh(c,0,16,15);c.fillStyle='#6f7650';c.fillRect(-9,-1,18,23);c.fillStyle='#d5a27d';c.fillRect(-8,-21,16,16);c.fillStyle='#b38a42';c.fillRect(-11,-23,22,5);c.strokeStyle='#65513a';c.lineWidth=3;c.beginPath();c.moveTo(10,3);c.lineTo(18,18);c.stroke();c.restore()}
function seasonalDetails(c){const season=life.season;if(season==='otoño'){c.fillStyle='rgba(173,120,55,.72)';for(let i=0;i<26;i++){const x=(i*137+life.phase*9)%W,y=300+(i*83)%1450;c.fillRect(x,y,3,3)}}else if(season==='primavera'){c.fillStyle='rgba(214,185,112,.72)';for(let i=0;i<18;i++){const x=(i*191+life.phase*5)%W,y=350+(i*97)%1200;c.fillRect(x,y,4,4)}}else if(season==='invierno'){c.fillStyle='rgba(220,224,210,.42)';for(let i=0;i<14;i++){const x=(i*211+life.phase*2)%W,y=400+(i*71)%1200;c.fillRect(x,y,5,2)}}}
life.drawWorld=c=>{life.traffic.forEach(o=>vehicle(c,o));life.ambient.forEach(o=>person(c,o));life.workers.forEach(o=>worker(c,o));life.animals.forEach(o=>animal(c,o));if(!life.isNight){c.fillStyle='#29342d';life.birds.forEach(o=>{const wing=Math.sin(life.phase*8+o.phase)*3;c.fillRect(Math.round(o.x),Math.round(o.y),5,2);c.fillRect(Math.round(o.x-4),Math.round(o.y+wing),4,2);c.fillRect(Math.round(o.x+5),Math.round(o.y-wing),4,2)})}seasonalDetails(c)};
life.drawOverlay=(c,vw,vh)=>{
 const h=clock.hour??8,f=solarFactor(h),season=life.season;
 if(f<.82){c.fillStyle=`rgba(10,20,38,${Math.max(.08,.42*(1-f))})`;c.fillRect(0,0,vw,vh)}
 if(clock.phase==='dawn'||clock.phase==='dusk'){c.fillStyle='rgba(214,151,78,.12)';c.fillRect(0,0,vw,vh)}
 if(season==='invierno'&&clock.phase==='morning'){c.fillStyle='rgba(190,205,220,.06)';c.fillRect(0,0,vw,vh)}
 if(life.weather==='nublado'){c.fillStyle='rgba(110,120,130,.15)';c.fillRect(0,0,vw,vh)}
 if(life.weather==='lluvia'){c.strokeStyle='rgba(210,230,240,.60)';c.lineWidth=2;for(let i=0;i<90;i++){const x=(i*79+life.phase*190)%vw,y=(i*47+life.phase*270)%vh;c.beginPath();c.moveTo(x,y);c.lineTo(x-7,y+18);c.stroke()}}
 if(life.weather==='viento'){c.strokeStyle='rgba(245,232,198,.28)';for(let i=0;i<14;i++){const y=90+i*48,x=(life.phase*110+i*91)%vw;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+35,y-10,x+75,y);c.stroke()}}
 if(life.isNight){c.fillStyle='rgba(8,15,30,.12)';c.fillRect(0,0,vw,vh);c.fillStyle='rgba(255,240,185,.82)';c.beginPath();c.arc(vw*.82,70,22,0,Math.PI*2);c.fill();c.fillStyle='rgba(255,228,154,.7)';for(let i=0;i<10;i++)c.fillRect((i*97)%vw,45+(i*61)%Math.max(80,vh-45),2,2)}
};
V.life=life;window.dispatchEvent(new CustomEvent('villa-pelon-life-ready',{detail:{version:life.version}}));
})();
