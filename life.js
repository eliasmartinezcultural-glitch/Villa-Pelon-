/* Villa Pelón — Living World systems
   Pure browser JS. No dependencies. */
(() => {
  'use strict';
  const V = window.VillaPelon || (window.VillaPelon = {});
  const world = V.world || {w:3200,h:2000};
  V.life = {weather:'despejado', temperature:18, traffic:[], animals:[], shops:[], tools:[], items:{mate:false,pan:0}};
  const roads=[{x:0,y:610,w:world.w,h:180,axis:'h'},{x:1070,y:0,w:180,h:world.h,axis:'v'}];
  const weather=['despejado','nublado','viento','lluvia'];
  function seed(){
    V.life.traffic=[
      {x:220,y:700,vx:48,vy:0,type:'auto'},{x:1450,y:700,vx:-55,vy:0,type:'camioneta'},
      {x:1160,y:160, vx:0,vy:42,type:'tractor'},{x:1160,y:1500,vx:0,vy:-38,type:'camion'}
    ];
    V.life.animals=[
      {x:2450,y:720,vx:8,vy:0,type:'vaca'},{x:2520,y:770,vx:-6,vy:2,type:'vaca'},
      {x:2710,y:1180,vx:4,vy:-3,type:'caballo'},{x:2780,y:1210,vx:-3,vy:2,type:'caballo'},
      {x:2050,y:1160,vx:5,vy:0,type:'gallina'},{x:2100,y:1190,vx:-4,vy:2,type:'gallina'}
    ];
    V.life.shops=[{x:1570,y:330,w:360,h:210,name:'Almacén'},{x:1010,y:1120,w:380,h:210,name:'Radio'}];
    V.life.tools=['pala','azada','tijera de podar','cajón de cosecha','llave inglesa'];
  }
  seed();
  function clamp(a,b,c){return Math.max(b,Math.min(c,a))}
  V.life.update=(dt,minutes)=>{
    V.life.traffic.forEach(t=>{t.x+=t.vx*dt;t.y+=t.vy*dt;if(t.x>world.w+80)t.x=-80;if(t.x<-80)t.x=world.w+80;if(t.y>world.h+80)t.y=-80;if(t.y<-80)t.y=world.h+80});
    V.life.animals.forEach(a=>{a.x+=a.vx*dt;a.y+=a.vy*dt;if(a.x<1800||a.x>3050)a.vx*=-1;if(a.y<680||a.y>1370)a.vy*=-1});
    const hour=minutes/60;
    V.life.isNight=hour<7||hour>=20;
  };
  V.life.nextWeather=()=>{V.life.weather=weather[Math.floor(Math.random()*weather.length)];V.life.temperature=Math.round(12+Math.random()*15);return V.life.weather};
  V.life.draw=(ctx)=>{
    V.life.traffic.forEach(t=>{ctx.save();ctx.translate(t.x,t.y);ctx.fillStyle=t.type==='tractor'?'#4f713c':t.type==='camion'?'#8a684c':'#5b6265';ctx.fillRect(-24,-11,48,22);ctx.fillStyle='#252525';ctx.fillRect(-17,9,10,7);ctx.fillRect(8,9,10,7);if(t.type==='tractor'){ctx.fillStyle='#2e3b27';ctx.fillRect(10,-15,13,12)}ctx.restore()});
    V.life.animals.forEach(a=>{ctx.save();ctx.translate(a.x,a.y);if(a.type==='vaca'){ctx.fillStyle='#eee8d8';ctx.fillRect(-22,-10,44,20);ctx.fillStyle='#54483c';ctx.fillRect(-10,-9,9,8);ctx.fillRect(8,1,8,8);ctx.fillStyle='#40372f';ctx.fillRect(-16,9,6,12);ctx.fillRect(10,9,6,12)}else if(a.type==='caballo'){ctx.fillStyle='#8b5e3d';ctx.fillRect(-24,-9,42,18);ctx.fillRect(14,-19,13,17);ctx.fillStyle='#493426';ctx.fillRect(-15,8,6,15);ctx.fillRect(9,8,6,15)}else{ctx.fillStyle='#d9d1bd';ctx.fillRect(-8,-6,16,12);ctx.fillStyle='#b64d3e';ctx.fillRect(5,-10,7,7)}ctx.restore()});
    if(V.life.weather==='lluvia'){ctx.save();ctx.strokeStyle='rgba(220,235,245,.45)';ctx.lineWidth=1;for(let i=0;i<140;i++){const x=(i*83+performance.now()/12)%world.w,y=(i*47+performance.now()/7)%world.h;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-5,y+14);ctx.stroke()}ctx.restore()}
    if(V.life.isNight){ctx.save();ctx.fillStyle='rgba(20,28,45,.36)';ctx.fillRect(0,0,world.w,world.h);ctx.restore()}
  };
})();
