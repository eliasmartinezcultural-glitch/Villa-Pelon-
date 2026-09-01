/* Villa Pelón — mundo vivo: clima, tráfico, animales, rutinas y ambientación. */
(() => {
  'use strict';
  const V = window.VillaPelon || (window.VillaPelon = {});
  const world = {w:3200,h:2000};
  V.world = V.world || world;
  V.life = V.life || {};
  Object.assign(V.life,{weather:'despejado',temperature:18,traffic:[],animals:[],isNight:false,shops:[],tools:[],items:{mate:false,pan:0}});

  const roadH={x:0,y:610,w:3200,h:180}, roadV={x:1070,y:0,w:180,h:2000};
  const weather=['despejado','nublado','viento','lluvia'];
  let weatherTimer=0, weatherPhase=0;

  function seed(){
    V.life.traffic=[
      {x:180,y:685,vx:58,vy:0,type:'auto',lane:0},
      {x:1540,y:735,vx:-46,vy:0,type:'camioneta',lane:1},
      {x:1158,y:150,vx:0,vy:44,type:'tractor',lane:0},
      {x:1200,y:1680,vx:0,vy:-34,type:'camion',lane:1},
      {x:720,y:650,vx:36,vy:0,type:'bicicleta',lane:0}
    ];
    V.life.animals=[
      {x:2450,y:720,vx:10,vy:0,type:'vaca'},{x:2520,y:770,vx:-7,vy:2,type:'vaca'},
      {x:2700,y:1170,vx:5,vy:-2,type:'caballo'},{x:2780,y:1210,vx:-4,vy:2,type:'caballo'},
      {x:2050,y:1160,vx:7,vy:0,type:'gallina'},{x:2110,y:1190,vx:-5,vy:2,type:'gallina'}
    ];
    V.life.shops=[
      {x:1570,y:330,w:360,h:210,name:'Almacén El Encuentro',kind:'shop'},
      {x:1010,y:1120,w:380,h:210,name:'Radio Oasis',kind:'radio'},
      {x:2150,y:370,w:300,h:180,name:'Galpón rural',kind:'job'}
    ];
    V.life.tools=['pala','azada','tijera de podar','cajón de cosecha','llave inglesa'];
  }
  seed();

  function wrap(t){ if(t.x>world.w+90)t.x=-90; if(t.x<-90)t.x=world.w+90; if(t.y>world.h+90)t.y=-90; if(t.y<-90)t.y=world.h+90; }
  function moveNpc(n,minutes,dt){
    if(!n.home)return;
    const hour=minutes/60;
    let tx=n.home.x,ty=n.home.y;
    if(n.role==='trabajo' && hour>=8 && hour<17){tx=n.work.x;ty=n.work.y;}
    else if(n.role==='plaza' && hour>=10 && hour<18){tx=1160;ty=390;}
    else if(n.role==='comercio' && hour>=9 && hour<19){tx=1750;ty=610;}
    else if(n.role==='radio' && hour>=10 && hour<15){tx=1200;ty=1190;}
    const dx=tx-n.x,dy=ty-n.y,d=Math.hypot(dx,dy);
    if(d>8){const s=Math.min(55,d*1.4);n.x+=dx/d*s*dt;n.y+=dy/d*s*dt;n.moving=true;}else n.moving=false;
  }

  V.life.update=(dt,minutes)=>{
    V.life.traffic.forEach(t=>{t.x+=t.vx*dt;t.y+=t.vy*dt;wrap(t)});
    V.life.animals.forEach(a=>{a.x+=a.vx*dt;a.y+=a.vy*dt;if(a.x<1880||a.x>3020)a.vx*=-1;if(a.y<690||a.y>1360)a.vy*=-1});
    const npcs=V.npcs||[]; npcs.forEach(n=>moveNpc(n,minutes,dt));
    const hour=minutes/60; V.life.isNight=hour<7||hour>=20;
    weatherTimer+=dt;
    if(weatherTimer>42){weatherTimer=0;V.life.nextWeather();}
    weatherPhase+=dt;
  };
  V.life.nextWeather=()=>{V.life.weather=weather[Math.floor(Math.random()*weather.length)];V.life.temperature=Math.round(10+Math.random()*18);return V.life.weather};

  function shadow(ctx,x,y,w,h){ctx.fillStyle='rgba(42,31,20,.18)';ctx.beginPath();ctx.ellipse(x,y,w,h,0,0,Math.PI*2);ctx.fill()}
  function vehicle(ctx,t){ctx.save();ctx.translate(t.x,t.y);if(Math.abs(t.vy)>0)ctx.rotate(Math.PI/2);const scale=t.type==='tractor'?1.15:t.type==='camion'?1.35:t.type==='bicicleta'?.65:1;ctx.scale(scale,scale);shadow(ctx,0,13,25,6);ctx.fillStyle=t.type==='tractor'?'#55713b':t.type==='camion'?'#80664d':t.type==='bicicleta'?'#3d5361':'#596167';ctx.fillRect(-23,-10,46,20);if(t.type==='camion')ctx.fillRect(10,-15,18,25);if(t.type==='tractor'){ctx.fillRect(8,-16,15,12);ctx.fillStyle='#26251f';ctx.fillRect(-18,8,12,9);ctx.fillRect(10,8,12,9)}else{ctx.fillStyle='#24231f';ctx.fillRect(-17,9,10,7);ctx.fillRect(9,9,10,7)}ctx.fillStyle='#8ea4a9';ctx.fillRect(-13,-7,14,8);ctx.restore()}
  function animal(ctx,a){ctx.save();ctx.translate(a.x,a.y);shadow(ctx,0,13,a.type==='caballo'?25:18,5);if(a.type==='vaca'){ctx.fillStyle='#e7dfcd';ctx.fillRect(-23,-10,46,20);ctx.fillStyle='#51483d';ctx.fillRect(-11,-9,9,8);ctx.fillRect(9,0,8,8);ctx.fillStyle='#3e352d';ctx.fillRect(-16,9,6,13);ctx.fillRect(10,9,6,13);ctx.fillRect(21,-7,8,9)}else if(a.type==='caballo'){ctx.fillStyle='#8a5d3d';ctx.fillRect(-24,-9,43,18);ctx.fillRect(14,-20,13,18);ctx.fillStyle='#493528';ctx.fillRect(-16,8,6,15);ctx.fillRect(9,8,6,15)}else{ctx.fillStyle='#ddd2b7';ctx.fillRect(-8,-6,16,12);ctx.fillStyle='#bd4e40';ctx.fillRect(5,-10,7,7)}ctx.restore()}

  V.life.drawWorld=(ctx)=>{
    V.life.traffic.forEach(t=>vehicle(ctx,t));
    V.life.animals.forEach(a=>animal(ctx,a));
  };
  V.life.drawOverlay=(ctx,vw,vh)=>{
    if(V.life.weather==='lluvia'){
      ctx.save();ctx.strokeStyle='rgba(214,231,240,.52)';ctx.lineWidth=1;
      for(let i=0;i<180;i++){const x=(i*83+weatherPhase*220)%vw,y=(i*47+weatherPhase*390)%vh;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-5,y+13);ctx.stroke()}ctx.restore();
    }
    if(V.life.weather==='viento'){
      ctx.save();ctx.strokeStyle='rgba(245,232,198,.18)';for(let i=0;i<18;i++){const y=70+i*42,x=(i*97+weatherPhase*120)%vw;ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo(x+35,y-8,x+70,y);ctx.stroke()}ctx.restore();
    }
    if(V.life.isNight){ctx.save();ctx.fillStyle='rgba(15,23,40,.48)';ctx.fillRect(0,0,vw,vh);ctx.restore();}
  };
})();
