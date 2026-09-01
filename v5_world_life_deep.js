/* Villa Pelón V5.7 — SIMULACIÓN PROFUNDA DE VIDA
   No agrega RAF. Extiende el mundo vivo existente con rutinas, relaciones,
   horarios, servicios, economía local, eventos, grupos, necesidades y memoria.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const D=V.worldLifeDeep={version:1,enabled:true,events:[],services:{},economy:{},groups:[],ticks:0};
const hour=()=>((V.state?.minutes??480)/60)%24;
const day=()=>V.state?.day||1;
const people=()=>V.worldLifeV56?.people||[];
const byId=id=>people().find(p=>p.id===id);
const destinations={
 casa:{clara:[820,540],sergio:[1480,650],rosa:[900,900],miguel:[1650,980],laura:[720,1080],jorge:[1760,1130],sofia:[820,540],mateo:[820,540]},
 escuela:{sofia:[430,520],mateo:[560,520]},
 almacen:{clara:[1910,650],sergio:[1910,650],laura:[1910,650],ines_r:[1910,650]},
 plaza:{clara:[1050,760],sergio:[1180,760],rosa:[1280,760],miguel:[1400,760],laura:[1000,820],jorge:[1500,820],sofia:[1100,760],mateo:[1200,760]},
 radio:{nico:[1360,1540],ines_r:[1360,1540]},
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
function minutes(hm){const a=hm.split(':').map(Number);return a[0]*60+a[1]}
function targetFor(p){const list=schedules[p.role]||schedules.vecino;const m=(V.state?.minutes??480)%1440;let selected=list[0][1];for(const row of list)if(m>=minutes(row[0]))selected=row[1];const pos=destinations[selected]?.[p.id];return pos?{x:pos[0],y:pos[1],place:selected}:null}
function routine(dt){const m=(V.state?.minutes??480)%1440;people().forEach((p,i)=>{const t=targetFor(p);if(!t)return;p.lifeTarget=t.place;p.lifeDestination={x:t.x,y:t.y};const d=Math.hypot(t.x-p.x,t.y-p.y);if(d>24&&p.state!=='en casa'){const pace=p.age<18?17:24;p.x+=(t.x-p.x)/d*pace*dt;p.y+=(t.y-p.y)/d*pace*dt;p.lifeMoving=true}else{p.lifeMoving=false;p.lifeAt=t.place}p.lifeNeed=p.lifeNeed||{social:35,rest:30,work:0};p.lifeNeed.social=Math.min(100,p.lifeNeed.social+dt*(p.lifeAt==='plaza'?-.9:.12));p.lifeNeed.rest=Math.min(100,p.lifeNeed.rest+dt*(p.lifeAt==='casa'?-.7:.08));if(p.lifeAt==='chacra')p.lifeNeed.work=Math.min(100,(p.lifeNeed.work||0)+dt*.8);else p.lifeNeed.work=Math.max(0,(p.lifeNeed.work||0)-dt*.2);p.lifeMood=p.lifeNeed.social<20?'extraña compañía':p.lifeNeed.rest>85?'cansado':p.lifeNeed.work>80?'agotado':'bien';});D.ticks++}
function social(dt){const ps=people();for(let i=0;i<ps.length;i++)for(let j=i+1;j<ps.length;j++){const a=ps[i],b=ps[j],d=Math.hypot(a.x-b.x,a.y-b.y);if(d<95){a.social=a.social||{};b.social=b.social||{};a.social[b.id]=(a.social[b.id]||0)+dt*.12;b.social[a.id]=(b.social[a.id]||0)+dt*.12;a.socialTarget=b.name;b.socialTarget=a.name;if(!a.conversationTimer&&Math.random()<dt*.08){a.conversationTimer=7;b.conversationTimer=7;D.events.push({x:(a.x+b.x)/2,y:(a.y+b.y)/2,text:a.name+' y '+b.name+' conversan',ttl:7,type:'social'});}}else{if(a.conversationTimer)a.conversationTimer=Math.max(0,a.conversationTimer-dt);if(b.conversationTimer)b.conversationTimer=Math.max(0,b.conversationTimer-dt)}}}
function services(){const h=hour();D.services={almacen:h>=8&&h<20,escuela:h>=7&&h<18,radio:h>=10&&h<22,galpon:h>=7&&h<19,plaza:true,transporte:h>=6&&h<23};}
function economy(){const h=hour();D.economy={clientes:h>=8&&h<20?Math.round(4+people().length*.32):0,trabajadores:h>=7&&h<18?people().filter(p=>p.lifeAt==='chacra').length:0,radioAudiencia:h>=10&&h<22?Math.round(people().length*.7):0,produccion:h>=7&&h<18?'actividad rural':'reposo',comercio:h>=8&&h<20?'abierto':'cerrado'};}
const eventPool=[
 {name:'feria_espontanea',text:'Hay movimiento de feria en la plaza',days:[5,6],start:16,end:20,x:1200,y:760},
 {name:'entrenamiento',text:'Hay entrenamiento en el club',days:[2,4],start:18,end:21,x:2860,y:1570},
 {name:'radio_movil',text:'La radio está recibiendo vecinos',days:[1,3,5],start:10,end:13,x:1360,y:1540},
 {name:'cosecha',text:'Hay actividad intensa de cosecha',days:[1,2,3,4,5,6],start:8,end:12,x:5000,y:3500},
 {name:'lluvia',text:'La lluvia cambia el ritmo del pueblo',days:[1,2,3,4,5,6,7],start:0,end:24,x:4300,y:2800}
];
function events(dt){const h=hour(),d=day();D.events=D.events.filter(e=>(e.ttl-=dt)>0);eventPool.forEach(e=>{if(e.days.includes(((d-1)%7)+1)&&h>=e.start&&h<e.end&&!D.events.some(x=>x.name===e.name))D.events.push({name:e.name,x:e.x,y:e.y,text:e.text,ttl:Math.min(20,(e.end-h)*60),type:'scheduled'})});if(Math.random()<dt*.004){const e=eventPool[Math.floor(Math.random()*eventPool.length)];D.events.push({name:'random_'+D.ticks,x:e.x,y:e.y,text:e.text,ttl:9,type:'random'})}}
function weatherEffects(){const w=V.life?.weather||'despejado';const h=hour();D.environment={weather:w,visibility:w==='lluvia'?0.82:w==='nublado'?.9:1,peopleActivity:w==='lluvia'?.72:w==='viento'?.88:1,night:h<7||h>=21,temperature:V.life?.temperature??19};if(w==='lluvia')people().forEach(p=>p.lifeMood='buscando refugio')}
function saveState(){try{localStorage.setItem('villa_pelon_life_deep',JSON.stringify({version:1,day:day(),people:people().map(p=>({id:p.id,social:p.social,lifeNeed:p.lifeNeed}))}))}catch(_){} }
function loadState(){try{const s=JSON.parse(localStorage.getItem('villa_pelon_life_deep')||'null');if(!s)return;people().forEach(p=>{const q=s.people?.find(x=>x.id===p.id);if(q){p.social=q.social||{};p.lifeNeed=q.lifeNeed||p.lifeNeed}})}catch(_){} }
function drawEvents(){const e=V.engine;if(!e||typeof e.render!=='function'||e.__worldLifeDeepRender)return;e.__worldLifeDeepRender=true;const old=e.render;e.render=function(){const r=old.apply(this,arguments),c=C?.getContext?.('2d');if(!c)return r;const cam=V.camera||{x:0,y:0,zoom:1},z=Number(cam.zoom||1);c.save();c.translate(innerWidth/2-cam.x*z,innerHeight/2-cam.y*z);c.scale(z,z);c.imageSmoothingEnabled=false;D.events.forEach(ev=>{c.fillStyle='#fffdf0';c.fillRect(Math.round(ev.x-72),Math.round(ev.y-70),144,20);c.fillStyle='#30251d';c.font='11px monospace';c.textAlign='center';c.fillText(ev.text,Math.round(ev.x),Math.round(ev.y-55));});c.textAlign='left';c.restore();return r}}
const C=document.getElementById('world');
function tick(dt){if(!V.state?.started)return;routine(dt);social(dt);services();economy();events(dt);weatherEffects();if(D.ticks%120===0)saveState()}
function hook(){if(!V.engine?.update||V.engine.__worldLifeDeep)return;if(V.engine.__worldLifeV56||V.engine.__worldLifeDeepHook)return;const old=V.engine.update;V.engine.update=function(dt){const r=old.apply(this,arguments);tick(dt);return r};V.engine.__worldLifeDeepHook=true;loadState();drawEvents()}
hook();setTimeout(hook,250);setTimeout(hook,900);V.worldLifeAPI={state:D,people,find:byId,target:targetFor,getServices:()=>D.services,getEconomy:()=>D.economy,getEvents:()=>D.events};
D.features=['individual-routines','school-schedule','work-schedule','commerce','radio-life','plaza-life','rural-work','social-proximity','relationships','needs','mood','scheduled-events','random-events','weather-effects','local-economy','persistent-memory','pixel-world-compatible'];
})();
