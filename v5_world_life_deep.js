/* Villa Pelón V5.7 — SIMULACIÓN PROFUNDA DE VIDA */
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const D=V.worldLifeDeep={version:2,enabled:true,events:[],services:{},economy:{},ticks:0};
const C=document.getElementById('world');
const people=()=>V.worldLifeV56?.people||[];
const hour=()=>((V.state?.minutes??480)/60)%24;
const day=()=>V.state?.day||1;
const mins=s=>{const a=s.split(':').map(Number);return a[0]*60+a[1]};
const destinations={
 casa:{clara:[820,540],sergio:[1480,650],rosa:[900,900],miguel:[1650,980],laura:[720,1080],jorge:[1760,1130],sofia:[820,540],mateo:[820,540]},
 escuela:{sofia:[430,520],mateo:[560,520]},
 almacen:{clara:[1910,650],sergio:[1910,650],laura:[1910,650],ines_r:[1910,650]},
 plaza:{clara:[1050,760],sergio:[1180,760],rosa:[1280,760],miguel:[1400,760],laura:[1000,820],jorge:[1500,820],sofia:[1100,760],mateo:[1200,760]},
 radio:{ines_r:[1360,1540]},
 chacra:{carlos:[3300,3300],daniel:[3900,3550],ruben:[4750,3900],elena:[5450,3400],marcos:[6100,4100]},
 galpon:{raul:[2540,1420],pedro:[2480,1510]}
};
const schedules={
 estudiante:[['06:30','casa'],['07:30','escuela'],['13:30','plaza'],['17:30','casa'],['19:00','plaza'],['21:30','casa']],
 vecina:[['07:00','casa'],['08:00','almacen'],['10:00','plaza'],['12:00','casa'],['16:00','almacen'],['18:00','plaza'],['21:00','casa']],
 vecino:[['07:00','casa'],['09:00','almacen'],['12:00','casa'],['16:00','plaza'],['18:00','plaza'],['21:00','casa']],
 trabajadora:[['06:30','casa'],['07:00','chacra'],['12:30','casa'],['15:00','chacra'],['19:00','plaza'],['21:30','casa']],
 trabajador:[['06:00','casa'],['07:00','chacra'],['12:30','casa'],['15:00','chacra'],['19:00','plaza'],['22:00','casa']],
 tractorista:[['05:30','casa'],['06:30','chacra'],['13:00','casa'],['15:00','chacra'],['20:00','casa']],
 repartidora:[['07:00','casa'],['08:00','almacen'],['10:00','radio'],['12:00','plaza'],['14:00','almacen'],['18:00','radio'],['21:00','casa']]
};
function target(p){const list=schedules[p.role]||schedules.vecino;const m=(V.state?.minutes??480)%1440;let place=list[0][1];for(const r of list)if(m>=mins(r[0]))place=r[1];const q=destinations[place]?.[p.id];return q?{x:q[0],y:q[1],place}:null}
function routines(dt){people().forEach(p=>{const t=target(p);if(!t)return;p.lifeTarget=t.place;p.lifeDestination=t;const d=Math.hypot(t.x-p.x,t.y-p.y);if(d>26){const speed=p.age<18?17:24;p.x+=(t.x-p.x)/d*speed*dt;p.y+=(t.y-p.y)/d*speed*dt;p.lifeMoving=true}else{p.lifeMoving=false;p.lifeAt=t.place}p.needs=p.needs||{social:45,rest:25,work:0,food:25};p.needs.social=Math.min(100,p.needs.social+dt*(p.lifeAt==='plaza'?-.8:.11));p.needs.rest=Math.min(100,p.needs.rest+dt*(p.lifeAt==='casa'?-0.7:0.09));p.needs.food=Math.min(100,p.needs.food+dt*0.035);p.needs.work=p.lifeAt==='chacra'?Math.min(100,(p.needs.work||0)+dt*.65):Math.max(0,(p.needs.work||0)-dt*.18);p.lifeMood=p.needs.social<20?'necesita compañía':p.needs.food>75?'tiene hambre':p.needs.rest>82?'cansado':p.needs.work>80?'agotado':'bien';});}
function social(dt){const ps=people();for(let i=0;i<ps.length;i++)for(let j=i+1;j<ps.length;j++){const a=ps[i],b=ps[j],d=Math.hypot(a.x-b.x,a.y-b.y);if(d<90){a.social=a.social||{};b.social=b.social||{};a.social[b.id]=(a.social[b.id]||0)+dt*.1;b.social[a.id]=(b.social[a.id]||0)+dt*.1;a.socialTarget=b.name;b.socialTarget=a.name;if(!a.talking&&Math.random()<dt*.055){a.talking=b.talking=true;D.events.push({x:(a.x+b.x)/2,y:(a.y+b.y)/2,text:a.name+' conversa con '+b.name,ttl:6,type:'social',name:'talk_'+a.id+'_'+b.id})}}else{a.talking=false;b.talking=false}}}
function services(){const h=hour();D.services={almacen:h>=8&&h<20,escuela:h>=7&&h<18,radio:h>=10&&h<22,galpon:h>=7&&h<19,plaza:true,transporte:h>=6&&h<23};}
function economy(){const h=hour(),workers=people().filter(p=>p.lifeAt==='chacra').length;D.economy={clientes:h>=8&&h<20?Math.round(5+people().length*.3):0,trabajadores:workers,produccion:workers?Math.round(workers*12):0,radioAudiencia:h>=10&&h<22?Math.round(people().length*.7):0,comercio:D.services.almacen?'activo':'cerrado'};}
const pool=[
{name:'feria',text:'Feria y movimiento en la plaza',days:[5,6],a:16,b:20,x:1200,y:760},
{name:'club',text:'Entrenamiento en el club',days:[2,4],a:18,b:21,x:2860,y:1570},
{name:'radio',text:'Vecinos visitan la radio',days:[1,3,5],a:10,b:13,x:1360,y:1540},
{name:'cosecha',text:'Jornada de cosecha en las chacras',days:[1,2,3,4,5,6],a:8,b:12,x:5000,y:3500}];
function events(dt){const h=hour(),d=((day()-1)%7)+1;D.events=D.events.filter(e=>(e.ttl-=dt)>0);pool.forEach(e=>{if(e.days.includes(d)&&h>=e.a&&h<e.b&&!D.events.some(x=>x.name===e.name))D.events.push({...e,ttl:Math.min(18,(e.b-h)*60),type:'scheduled'})});if(Math.random()<dt*.003){const e=pool[Math.floor(Math.random()*pool.length)];D.events.push({...e,name:'random_'+D.ticks,ttl:8,type:'random'})}}
function weather(){const w=V.life?.weather||'despejado',h=hour();D.environment={weather:w,temperature:V.life?.temperature??19,night:h<7||h>=21,activity:w==='lluvia'?.7:w==='viento'?.85:1};if(w==='lluvia')people().forEach(p=>p.lifeMood='buscando refugio')}
function save(){try{localStorage.setItem('villa_pelon_life_deep',JSON.stringify({version:2,people:people().map(p=>({id:p.id,social:p.social,needs:p.needs}))}))}catch(_){} }
function load(){try{const s=JSON.parse(localStorage.getItem('villa_pelon_life_deep')||'null');people().forEach(p=>{const q=s?.people?.find(x=>x.id===p.id);if(q){p.social=q.social||{};p.needs=q.needs||p.needs}})}catch(_){} }
function draw(){const e=V.engine;if(!e||!C||typeof e.render!=='function'||e.__lifeDeepRender)return;e.__lifeDeepRender=true;const old=e.render;e.render=function(){const r=old.apply(this,arguments),c=C.getContext('2d');if(!c)return r;const cam=V.camera||{x:0,y:0,zoom:1},z=Number(cam.zoom||1);c.save();c.translate(innerWidth/2-cam.x*z,innerHeight/2-cam.y*z);c.scale(z,z);c.imageSmoothingEnabled=false;D.events.forEach(ev=>{c.fillStyle='#fffdf0';c.fillRect(Math.round(ev.x-74),Math.round(ev.y-69),148,20);c.fillStyle='#30251d';c.font='11px monospace';c.textAlign='center';c.fillText(ev.text,Math.round(ev.x),Math.round(ev.y-54));});c.textAlign='left';c.restore();return r}}
function hook(){if(!V.engine?.update||V.engine.__lifeDeepHook)return;const old=V.engine.update;V.engine.update=function(dt){const r=old.apply(this,arguments);if(V.state?.started){routines(dt);social(dt);services();economy();events(dt);weather();D.ticks++;if(D.ticks%120===0)save()}return r};V.engine.__lifeDeepHook=true;load();draw()}
hook();setTimeout(hook,300);setTimeout(hook,900);
V.worldLifeAPI={state:D,people,find:id=>people().find(p=>p.id===id),target,getServices:()=>D.services,getEconomy:()=>D.economy,getEvents:()=>D.events};
D.features=['individual-routines','school-schedule','work-schedule','commerce','radio-life','plaza-life','rural-work','social-proximity','relationships','needs-food-rest-social','mood','scheduled-events','random-events','weather-effects','local-economy','persistent-memory','pixel-art-compatible'];
})();
