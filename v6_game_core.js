/* Villa Pelón V6.37 — NÚCLEO MOTOR RECUPERADO
   Autoridad única para jugador, input, cámara, loop y render base.
   No depende de otro motor V4/V5 para mover al jugador.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const canvas=document.getElementById('world');
if(!canvas) throw new Error('V6.37: canvas #world no encontrado');
const ctx=canvas.getContext('2d',{alpha:false});
const world={w:8400,h:5600,version:37};
const old=V.state&&typeof V.state==='object'?V.state:{};
const state=Object.assign({started:false,x:1280,y:820,speed:235,money:10000,energy:100,minutes:480,day:1,mission:0,inventory:[],dialogue:false,saved:false,walk:0,history:[],relationships:{},version:37,facing:'down',moving:false},old);
V.world=world;V.state=state;
const input=V.input&&typeof V.input==='object'?V.input:{up:false,down:false,left:false,right:false};V.input=input;
const camera=V.camera&&typeof V.camera==='object'?V.camera:{x:state.x,y:state.y,zoom:.82};V.camera=camera;camera.zoom=Math.max(.55,Math.min(1.15,Number(camera.zoom)||.82));
const buildings=[
{x:360,y:360,w:430,h:250,label:'ESCUELA',type:'school'},
{x:1740,y:420,w:430,h:250,label:'ALMACÉN EL ENCUENTRO',type:'shop'},
{x:1050,y:1380,w:430,h:240,label:'RADIO',type:'radio'},
{x:680,y:470,w:250,h:180,label:'CASA',type:'home'},
{x:1480,y:1010,w:300,h:200,label:'CASA',type:'home'},
{x:2360,y:930,w:390,h:230,label:'GALPÓN RURAL',type:'rural'},
{x:3150,y:420,w:460,h:270,label:'BODEGA',type:'rural'},
{x:2860,y:1570,w:340,h:210,label:'VESTUARIOS',type:'sports'},
{x:350,y:1560,w:330,h:200,label:'PUESTO DEL PUEBLO',type:'rural'}];
V.buildings=Array.isArray(V.buildings)?V.buildings:[];
for(const b of buildings)if(!V.buildings.some(x=>x.x===b.x&&x.y===b.y))V.buildings.push(b);
V.historySpots=Array.isArray(V.historySpots)?V.historySpots:[];
if(!V.historySpots.length)V.historySpots=[{x:2220,y:500,id:'origen'},{x:2700,y:1320,id:'riego'},{x:3320,y:1130,id:'vinos'}];
V.storyJob=V.storyJob||{x:2530,y:820,id:'job',type:'job',label:'CHANGA RURAL'};
V.npcs=Array.isArray(V.npcs)?V.npcs:[];
if(!V.npcs.length)V.npcs=[
{id:'marta',x:780,y:690,name:'Marta',shirt:'#a95745',pants:'#4b3d38',hair:'#4a3028',role:'comercio',lines:['Buen día. Soy Marta.','En un pueblo chico siempre hay alguien para ayudar.']},
{id:'raul',x:2030,y:930,name:'Raúl',shirt:'#557ca8',pants:'#3e4649',hair:'#302a27',role:'rural',lines:['Trabajo en una chacra.','Si buscás una changa, preguntá en el galpón.']},
{id:'lucia',x:1230,y:530,name:'Lucía',shirt:'#a55e8f',pants:'#50465b',hair:'#5a342b',role:'escuela',lines:['La escuela guarda recuerdos de muchas familias.']},
{id:'pedro',x:2320,y:1330,name:'Pedro',shirt:'#bd8249',pants:'#554631',hair:'#463127',role:'rural',lines:['En la chacra siempre aparece algo para hacer.']},
{id:'nico',x:1330,y:1540,name:'Nico',shirt:'#5d8d59',pants:'#3f4740',hair:'#252321',role:'radio',lines:['La radio conecta a los vecinos.']},
{id:'ines',x:1540,y:650,name:'Inés',shirt:'#8c6aa0',pants:'#554758',hair:'#70432f',role:'comercio',lines:['Vengo a hacer las compras antes de que cierre el almacén.']},
{id:'tomas',x:1020,y:930,name:'Tomás',shirt:'#6d8d57',pants:'#4b463b',hair:'#463329',role:'plaza',lines:['La plaza cambia mucho según la hora del día.']}];
const river={x:7000,y:0,w:1200,h:5600},bridges=[{y:815,h:90},{y:1395,h:90}];
let vw=innerWidth,vh=innerHeight,last=performance.now(),near=null,raf=0;
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
function resize(){vw=Math.max(320,innerWidth);vh=Math.max(240,innerHeight);const d=Math.min(devicePixelRatio||1,2);canvas.width=Math.floor(vw*d);canvas.height=Math.floor(vh*d);canvas.style.width=vw+'px';canvas.style.height=vh+'px';ctx.setTransform(d,0,0,d,0,0);ctx.imageSmoothingEnabled=false}
addEventListener('resize',resize,{passive:true});resize();
function setKey(k,on){if(k==='up'||k==='w'||k==='arrowup')input.up=on;if(k==='down'||k==='s'||k==='arrowdown')input.down=on;if(k==='left'||k==='a'||k==='arrowleft')input.left=on;if(k==='right'||k==='d'||k==='arrowright')input.right=on}
addEventListener('keydown',e=>{const k=String(e.key||'').toLowerCase();if(['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright'].includes(k)){setKey(k,true);e.preventDefault();return}if(k==='e'||k===' '){e.preventDefault();interact()}});
addEventListener('keyup',e=>{setKey(String(e.key||'').toLowerCase(),false)});
addEventListener('blur',()=>{input.up=input.down=input.left=input.right=false});
function bindTouch(){document.querySelectorAll('#touch [data-key]').forEach(b=>{const k=b.dataset.key;const on=e=>{e.preventDefault();setKey(k,true)};const off=e=>{e.preventDefault();setKey(k,false)};b.addEventListener('pointerdown',on);['pointerup','pointercancel','pointerleave'].forEach(ev=>b.addEventListener(ev,off))});const b=document.getElementById('interact');if(b)b.addEventListener('pointerdown',e=>{e.preventDefault();interact()})}bindTouch();
function start(){state.started=true;document.getElementById('start')?.classList.add('hidden');document.getElementById('game')?.classList.remove('hidden');load();state.started=true;last=performance.now();startLoop();ui()}
const startBtn=document.getElementById('startBtn');if(startBtn)startBtn.onclick=start;
const saveBtn=document.getElementById('save');if(saveBtn)saveBtn.onclick=save;
const dialogueNext=document.getElementById('dialogueNext');if(dialogueNext)dialogueNext.onclick=nextDialogue;
function blocked(x,y,r=12){if(x<60||y<180||x>world.w-60||y>world.h-60)return true;if(x>=river.x&&x<=river.x+river.w&&y>=river.y&&y<=river.y+river.h&&!bridges.some(b=>x>=river.x-30&&x<=river.x+river.w+30&&Math.abs(y-(b.y+b.h/2))<b.h/2+20))return true;for(const b of V.buildings){if(b.collision===false)continue;if(x>b.x-r&&x<b.x+b.w+r&&y>b.y-r&&y<b.y+b.h+r)return true}return false}
function move(dx,dy,dt){const step=state.speed*dt;const nx=clamp(state.x+dx*step,60,world.w-60),ny=clamp(state.y+dy*step,180,world.h-60);if(!blocked(nx,state.y,12))state.x=nx;if(!blocked(state.x,ny,12))state.y=ny}
function nearest(){let best=null,bd=155;const arr=[...(V.npcs||[]),...(V.buildings||[]),...(V.historySpots||[]),V.storyJob].filter(Boolean);for(const o of arr){if(o.hidden)continue;const x=o.x+(o.w?o.w/2:0),y=o.y+(o.h?o.h/2:0),d=Math.hypot(state.x-x,state.y-y);if(d<bd){bd=d;best=o}}return best}
function update(dt){if(!state.started)return;let dx=(input.right?1:0)-(input.left?1:0),dy=(input.down?1:0)-(input.up?1:0);const moving=dx!==0||dy!==0;state.moving=moving;if(state.dialogue){moving=false}if(moving&&!state.dialogue){const l=Math.hypot(dx,dy);dx/=l;dy/=l;state.facing=Math.abs(dx)>Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'down':'up');move(dx,dy,dt);state.energy=Math.max(0,state.energy-dt*.42);state.walk+=dt*10;state.minutes+=dt*2.7}else{state.energy=Math.min(100,state.energy+dt*.018);state.minutes+=dt*.04}while(state.minutes>=1440){state.minutes-=1440;state.day++;state.energy=100}V.life?.update?.(dt,state.minutes);camera.x+=(state.x-camera.x)*Math.min(1,dt*10);camera.y+=(state.y-camera.y)*Math.min(1,dt*10);const hw=vw/(2*camera.zoom),hh=vh/(2*camera.zoom);camera.x=clamp(camera.x,hw,world.w-hw);camera.y=clamp(camera.y,hh,world.h-hh);near=nearest();ui();V.rpgProgression?.api&&V.rpgProgression.ready&&typeof V.rpgProgression.api.save==='function'&&false}
function drawGround(){ctx.fillStyle='#a89469';ctx.fillRect(0,0,world.w,world.h);for(let i=0;i<650;i++){const x=(i*193+41)%world.w,y=(i*127+83)%world.h;ctx.fillStyle=i%5===0?'#c7b27e':'#96865f';ctx.fillRect(x,y,2+(i%4),2+(i%3))}ctx.fillStyle='#74765e';ctx.fillRect(0,0,world.w,420);ctx.fillStyle='#c5af79';ctx.fillRect(0,700,5400,230);ctx.fillRect(1080,0,220,2700);ctx.fillStyle='#ddd0a3';ctx.fillRect(0,782,5400,66);ctx.fillRect(1157,0,66,2700);ctx.fillStyle='#6e8a91';ctx.fillRect(river.x,river.y,river.w,river.h);for(const b of bridges){ctx.fillStyle='#84725a';ctx.fillRect(river.x-25,b.y-5,river.w+50,b.h+10);ctx.fillStyle='#c6a46d';ctx.fillRect(river.x-30,b.y,river.w+60,b.h)} }
function drawBuilding(b){ctx.fillStyle='rgba(35,28,20,.18)';ctx.fillRect(b.x+14,b.y+b.h+14,b.w,b.h*.12);ctx.fillStyle=b.type==='shop'?'#9c704b':b.type==='school'?'#b7a77b':b.type==='radio'?'#9c665c':b.type==='rural'?'#8b6748':'#b99a78';ctx.fillRect(b.x,b.y,b.w,b.h);ctx.fillStyle='#6b5140';ctx.fillRect(b.x-8,b.y-22,b.w+16,25);ctx.fillStyle='#e0c994';ctx.fillRect(b.x+b.w*.42,b.y+b.h*.55,Math.max(28,b.w*.14),b.h*.3);for(let x=b.x+30;x<b.x+b.w-20;x+=70){ctx.fillStyle='#5b6c69';ctx.fillRect(x,b.y+45,30,38)}ctx.fillStyle='#352b24';ctx.font='bold 12px system-ui';ctx.fillText(b.label,b.x+10,b.y-28)}
function drawNPC(n){const x=n.x,y=n.y;ctx.fillStyle='rgba(20,15,12,.25)';ctx.fillRect(x-10,y+13,20,5);ctx.fillStyle=n.pants||'#4b433d';ctx.fillRect(x-7,y+3,14,15);ctx.fillStyle=n.shirt||'#a05f4e';ctx.fillRect(x-9,y-10,18,16);ctx.fillStyle=n.hair||'#3a2b26';ctx.fillRect(x-8,y-20,16,12);ctx.fillStyle='#e7c29e';ctx.fillRect(x-6,y-18,12,11);if(n===near){ctx.fillStyle='#f0d27d';ctx.font='bold 11px system-ui';ctx.fillText('E · '+n.name,x-22,y-32)}}
function drawPlayer(){const x=state.x,y=state.y;ctx.fillStyle='rgba(20,15,12,.3)';ctx.fillRect(x-11,y+14,22,6);ctx.fillStyle='#315d72';ctx.fillRect(x-10,y-8,20,25);ctx.fillStyle='#e2b995';ctx.fillRect(x-8,y-23,16,15);ctx.fillStyle='#493126';ctx.fillRect(x-9,y-27,18,8);ctx.fillStyle='#d4b05d';ctx.fillRect(x-8,y-4,16,4);if(state.moving){const p=Math.sin(state.walk)*3;ctx.fillRect(x-9,y+17,7+p,4);ctx.fillRect(x+2-p,y+17,7,4)}else{ctx.fillRect(x-8,y+17,6,4);ctx.fillRect(x+2,y+17,6,4)}}
function drawWorld(){ctx.save();ctx.clearRect(0,0,vw,vh);ctx.translate(vw/2-camera.x*camera.zoom,vh/2-camera.y*camera.zoom);ctx.scale(camera.zoom,camera.zoom);drawGround();for(const b of V.buildings)drawBuilding(b);for(const s of V.historySpots){ctx.fillStyle='#d8b54e';ctx.beginPath();ctx.arc(s.x,s.y,9,0,Math.PI*2);ctx.fill();ctx.fillStyle='#392d21';ctx.font='bold 9px system-ui';ctx.fillText('MEMORIA',s.x-24,s.y-14)}for(const n of V.npcs)drawNPC(n);drawPlayer();ctx.restore()}
function render(){drawWorld();if(typeof V.life?.drawWorld==='function'){try{V.life.drawWorld(ctx,camera,vw,vh)}catch(_){} }if(typeof V.activityWorld?.drawOverlay==='function'){try{V.activityWorld.drawOverlay(ctx,camera,vw,vh)}catch(_){} }}
function frame(now){const dt=Math.min(.05,Math.max(0,(now-last)/1000));last=now;update(dt);render();raf=requestAnimationFrame(frame)}
function startLoop(){if(raf)return;raf=requestAnimationFrame(frame)}
function openDialogue(name,lines,source){const b=document.getElementById('dialogue');if(!b)return;state.dialogue=true;b.classList.remove('hidden');b.dataset.lines=JSON.stringify(lines||['']);b.dataset.index='0';const sp=document.getElementById('speaker'),tx=document.getElementById('dialogueText'),a=document.getElementById('sourceLink');if(sp)sp.textContent=name||'VILLA PELÓN';if(tx)tx.textContent=lines?.[0]||'';if(a){if(source){a.href=source;a.classList.remove('hidden')}else a.classList.add('hidden')}}
function nextDialogue(){const b=document.getElementById('dialogue');if(!state.dialogue)return;let lines=[];try{lines=JSON.parse(b?.dataset.lines||'[]')}catch(_){}const i=Number(b?.dataset.index||0)+1;if(i<lines.length){b.dataset.index=i;const tx=document.getElementById('dialogueText');if(tx)tx.textContent=lines[i]}else{state.dialogue=false;b?.classList.add('hidden')}}
function interact(){if(!state.started)return;if(state.dialogue){nextDialogue();return}const n=near||nearest();if(!n)return;if(V.rpgProgression?.api?.complete&&n.id&&V.npcs?.some(x=>x===n)){state.relationships[n.id]=Number(state.relationships[n.id]||0)+1;state.flags=state.flags||{};state.flags.spoke_to_npc=true}if(n.id&&V.npcs?.some(x=>x===n)){if(V.dialogue?.start){try{V.dialogue.start(n);return}catch(_){}}openDialogue(n.name,n.lines);return}if(n.id&&V.history?.inspect){try{V.history.inspect(n.id);return}catch(_){} }if(n.type==='job'&&V.ruralEconomy?.startHarvest){try{V.ruralEconomy.startHarvest();return}catch(_){} }if(n.type&&V.buildingSystem?.enter){try{if(V.buildingSystem.enter(n))return}catch(_){} }if(n.type==='home'){state.energy=clamp(state.energy+35,0,100);state.minutes+=30;openDialogue(n.label,['Descansaste un rato. El pueblo siguió con su actividad.']);return}openDialogue(n.label||'VILLA PELÓN',['Un lugar más del pueblo.'])}
function save(){const payload={...state,dialogue:false,saved:false,version:37};try{localStorage.setItem('villa_pelon_v6_state',JSON.stringify(payload));localStorage.setItem('villa_pelon_v4_save',JSON.stringify(payload));state.saved=true;ui();setTimeout(()=>{state.saved=false;ui()},1200)}catch(_){}if(typeof V.story?.save==='function'){try{V.story.save()}catch(_){} }if(typeof V.rpgProgression?.api?.save==='function'){try{V.rpgProgression.api.save()}catch(_){}}}
function load(){try{const raw=localStorage.getItem('villa_pelon_v6_state')||localStorage.getItem('villa_pelon_v4_save');if(raw){const s=JSON.parse(raw);if(s&&typeof s==='object'){for(const k of ['x','y','money','energy','minutes','day','mission','inventory','history','relationships','rpg','flags'])if(s[k]!==undefined)state[k]=s[k]}}}catch(_){}state.x=clamp(Number(state.x)||1280,60,world.w-60);state.y=clamp(Number(state.y)||820,180,world.h-60);state.dialogue=false;camera.x=state.x;camera.y=state.y}
function ui(){const h=Math.floor(state.minutes/60)%24,m=Math.floor(state.minutes%60),set=(id,val)=>{const e=document.getElementById(id);if(e)e.textContent=val};set('clock',String(h).padStart(2,'0')+':'+String(m).padStart(2,'0'));set('day',state.day);set('money',Math.round(state.money));set('energy',Math.round(state.energy));set('weather',V.life?.weather||'Despejado');const q=document.getElementById('questText');if(q&&!V.rpgProgression?.ready)q.textContent=state.mission?'Continuá tu historia.':'Explorá Villa Pelón'}
V.engine=V.engine||{};Object.assign(V.engine,{version:37,canvas,ctx,state,world,input,camera,update,render,nearest,interact,save,load,start:startLoop,isWalkable:(x,y)=>!blocked(x,y,12),segmentClear:(a,b)=>{const d=Math.hypot(b.x-a.x,b.y-a.y),steps=Math.max(2,Math.ceil(d/20));for(let i=0;i<=steps;i++){const t=i/steps;if(blocked(a.x+(b.x-a.x)*t,a.y+(b.y-a.y)*t,12))return false}return true}});
V.engineReady=true;
if(state.started){document.getElementById('start')?.classList.add('hidden');document.getElementById('game')?.classList.remove('hidden');load();startLoop()}else render();
})();