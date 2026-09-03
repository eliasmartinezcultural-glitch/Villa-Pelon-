/* Villa Pelón — motor principal. Canvas 2D, responsive, PC + móvil. */
(() => {
  'use strict';
  const canvas=document.getElementById('world'),ctx=canvas.getContext('2d',{alpha:false});
  const V=window.VillaPelon||(window.VillaPelon={});
  const world=V.world||{w:3200,h:2000}; V.world=world;
  const data=V.villageData||{};
  const state={started:false,x:960,y:650,speed:205,money:10000,energy:100,minutes:480,day:1,quest:0,dialogue:false,saved:false,inventory:[],walk:0,facing:'down'};
  /* V42: puente único entre el motor y los sistemas de juego. */
  V.gameState=state;
  window.__villaPelonState=state;
  const input={up:false,down:false,left:false,right:false};
  let vw=innerWidth,vh=innerHeight,camX=0,camY=0,last=performance.now(),near=null;
  const ZOOM=.78;
  const C={skin:'#d9a27c',skin2:'#b97858',hair:'#332923',shirt:'#2f5d46',shirt2:'#244735',pants:'#304b67',pants2:'#22364d',boot:'#352c29',eye:'#171b19',outline:'#20251f'};

  const npcs=[
    {x:650,y:570,name:'Marta',color:'#b95e4e',role:'comercio',home:{x:760,y:450},work:{x:1750,y:610},lines:['Buen día. Soy Marta. En un pueblo chico siempre hay alguien para ayudar.','El almacén es un buen lugar para enterarse de lo que pasa.']},
    {x:1720,y:590,name:'Raúl',color:'#557ca8',role:'trabajo',home:{x:1450,y:790},work:{x:2140,y:1000},lines:['Trabajo en una chacra. Las temporadas marcan el ritmo de muchas familias.','Si querés, podés buscar una changa rural en el galpón.']},
    {x:530,y:1010,name:'Lucía',color:'#a55e8f',role:'plaza',home:{x:760,y:450},work:{x:1160,y:390},lines:['La escuela guarda recuerdos que pueden ayudarnos a reconstruir la historia local.','Una fotografía también puede ser una pista.']},
    {x:1810,y:1010,name:'Pedro',color:'#bd8249',role:'trabajo',home:{x:1450,y:790},work:{x:2050,y:1130},lines:['En la chacra siempre aparece algo para hacer.','El trabajo rural también es parte de la vida cotidiana del pueblo.']},
    {x:1190,y:390,name:'Nico',color:'#5d8d59',role:'radio',home:{x:1450,y:790},work:{x:1200,y:1190},lines:['La plaza es el corazón del pueblo. Desde acá podés empezar a recorrerlo.','A veces una charla en la radio termina conectando a todo el pueblo.']}
  ];
  V.npcs=npcs;
  const buildings=[
    {x:350,y:330,w:360,h:210,label:'ESCUELA',type:'school'},
    {x:1570,y:330,w:360,h:210,label:'ALMACÉN',type:'shop'},
    {x:1010,y:1120,w:380,h:210,label:'RADIO OASIS',type:'radio'},
    {x:760,y:370,w:210,h:155,label:'VIVIENDA',type:'home'},
    {x:1450,y:720,w:250,h:170,label:'VIVIENDA',type:'home'},
    {x:2150,y:370,w:300,h:180,label:'GALPÓN',type:'rural'},
    {x:2600,y:850,w:300,h:190,label:'BODEGA',type:'rural'}
  ];
  const clue={x:2040,y:430};
  const jobSpot={x:2200,y:700};
  V.worldGeometry={buildings,clue,jobSpot};

  function resize(){vw=innerWidth;vh=innerHeight;const d=Math.min(devicePixelRatio||1,2);canvas.width=Math.max(1,Math.floor(vw*d));canvas.height=Math.max(1,Math.floor(vh*d));canvas.style.width=vw+'px';canvas.style.height=vh+'px';ctx.setTransform(d,0,0,d,0,0);ctx.imageSmoothingEnabled=false}
  addEventListener('resize',resize,{passive:true});resize();

  function setDirection(key){
    if(['arrowup','w'].includes(key))state.facing='up';
    else if(['arrowdown','s'].includes(key))state.facing='down';
    else if(['arrowleft','a'].includes(key))state.facing='left';
    else if(['arrowright','d'].includes(key))state.facing='right';
  }
  function bind(){
    addEventListener('keydown',e=>{const k=e.key.toLowerCase();setDirection(k);if(['arrowup','w'].includes(k))input.up=true;if(['arrowdown','s'].includes(k))input.down=true;if(['arrowleft','a'].includes(k))input.left=true;if(['arrowright','d'].includes(k))input.right=true;if(k==='e'||k===' '){e.preventDefault();interact()}});
    addEventListener('keyup',e=>{const k=e.key.toLowerCase();if(['arrowup','w'].includes(k))input.up=false;if(['arrowdown','s'].includes(k))input.down=false;if(['arrowleft','a'].includes(k))input.left=false;if(['arrowright','d'].includes(k))input.right=false});
    document.querySelectorAll('[data-key]').forEach(b=>{const k=b.dataset.key;const on=e=>{e.preventDefault();input[k]=true};const off=()=>input[k]=false;b.addEventListener('pointerdown',on);['pointerup','pointercancel','pointerleave'].forEach(ev=>b.addEventListener(ev,off))});
    document.getElementById('interact').addEventListener('pointerdown',e=>{e.preventDefault();interact()});
  } bind();
  document.getElementById('startBtn').onclick=()=>{state.started=true;document.getElementById('start').classList.add('hidden');document.getElementById('game').classList.remove('hidden');load();last=performance.now();ui()};
  document.getElementById('save').onclick=save; document.getElementById('dialogueNext').onclick=closeDialogue;

  function blocked(x,y){if(x<55||y<135||x>world.w-55||y>world.h-55)return true;return buildings.some(b=>x>b.x-18&&x<b.x+b.w+18&&y>b.y-18&&y<b.y+b.h+18)}
  function advanceTime(dt,moving){state.minutes+=dt*(moving?3.5:0.05);if(state.minutes>=1440){state.minutes-=1440;state.day++;state.energy=100;if(V.life)V.life.nextWeather()}if(state.energy<=0)state.speed=105;else state.speed=205}
  function update(dt){
    if(!state.started||state.dialogue)return;
    let dx=(input.right?1:0)-(input.left?1:0),dy=(input.down?1:0)-(input.up?1:0),moving=!!(dx||dy);
    if(moving){const l=Math.hypot(dx,dy);dx/=l;dy/=l;if(Math.abs(dx)>Math.abs(dy))state.facing=dx<0?'left':'right';else state.facing=dy<0?'up':'down';const nx=state.x+dx*state.speed*dt,ny=state.y+dy*state.speed*dt;if(!blocked(nx,state.y))state.x=nx;if(!blocked(state.x,ny))state.y=ny;state.energy=Math.max(0,state.energy-dt*.62);state.walk+=dt*11;}else{state.walk=0}
    advanceTime(dt,moving);
    near=getNearby();
    const targetX=state.x-vw/(2*ZOOM),targetY=state.y-vh/(2*ZOOM);camX=Math.max(0,Math.min(world.w-vw/ZOOM,targetX));camY=Math.max(55,Math.min(world.h-vh/ZOOM,targetY));
    if(V.life)V.life.update(dt,state.minutes); ui();
  }

  function distance(o){return Math.hypot(state.x-o.x,state.y-o.y)}
  function getNearby(){
    let best=null,bd=Infinity;
    npcs.forEach(n=>{const d=distance(n);if(d<88&&d<bd){best=n;bd=d}});
    [clue,jobSpot].forEach(o=>{const d=distance(o);if(d<92&&d<bd){best=o;bd=d}});
    buildings.forEach(b=>{const d=Math.hypot(state.x-(b.x+b.w/2),state.y-(b.y+b.h+35));if(d<105&&d<bd){best=b;bd=d}});
    return best;
  }
  function interact(){
    if(!state.started)return;if(state.dialogue){closeDialogue();return}
    const n=getNearby();if(!n)return;
    if(n===clue){if(state.quest<2){state.quest=2;state.money+=2500;addItem('Pista histórica');openDialogue('ARCHIVO DE MEMORIA',['Encontraste una pista histórica.','En la versión educativa, los datos reales se incorporarán únicamente con fuente verificable.','Recompensa: $2.500.']);}else openDialogue('ARCHIVO DE MEMORIA',['Esta pista ya fue descubierta.']);return}
    if(n===jobSpot){if(state.energy<20){openDialogue('CHANGA RURAL',['Estás demasiado cansado. Descansá y volvé después.']);return}state.energy=Math.max(0,state.energy-18);state.money+=850;addItem('Cajón de cosecha');openDialogue('CHANGA RURAL',['Ayudaste con una tarea de carga y cosecha.','Cobraste $850 y aprendiste algo del trabajo de la chacra.']);return}
    if(n.type==='shop'){buyShop();return}
    if(n.type==='radio'){openDialogue('RADIO OASIS',['La radio acompaña la vida cotidiana del pueblo.','Podés volver durante el día para encontrar nuevas conversaciones.']);return}
    if(n.type==='school'){openDialogue('ESCUELA',['Este edificio será una puerta para historias, fotos y memoria local.']);return}
    if(n.type==='rural'){openDialogue('GALPÓN RURAL',['Acá se guardan herramientas y aparecen trabajos de temporada.']);return}
    if(n.type==='home'){state.energy=Math.min(100,state.energy+25);state.minutes+=30;openDialogue('CASA',['Descansaste un rato. Recuperaste energía.']);return}
    if(state.quest===0)state.quest=1;openDialogue(n.name,n.lines);
  }
  function addItem(item){if(!state.inventory.includes(item))state.inventory.push(item)}
  function buyShop(){
    const products=(data.commerces&&data.commerces[0]&&data.commerces[0].products)||[['pan',120],['yerba',900],['azucar',700]];
    const p=products[state.inventory.filter(x=>x.startsWith('Compra:')).length%products.length];
    if(state.money<p[1]){openDialogue('ALMACÉN EL ENCUENTRO',['No te alcanza para comprar '+p[0]+'.']);return}
    state.money-=p[1];if(p[0]==='pan')state.energy=Math.min(100,state.energy+12);addItem('Compra: '+p[0]);openDialogue('ALMACÉN EL ENCUENTRO',['Compraste '+p[0]+' por $'+p[1]+'.','La compra quedó registrada en tu inventario.']);
  }
  function openDialogue(s,lines){state.dialogue=true;const b=document.getElementById('dialogue');b.classList.remove('hidden');b.dataset.lines=JSON.stringify(lines);b.dataset.index='0';document.getElementById('speaker').textContent=s;document.getElementById('dialogueText').textContent=lines[0]}
  function closeDialogue(){const b=document.getElementById('dialogue');if(!state.dialogue)return;let a=[];try{a=JSON.parse(b.dataset.lines||'[]')}catch(_){}const i=Number(b.dataset.index||0)+1;if(i<a.length){b.dataset.index=i;document.getElementById('dialogueText').textContent=a[i];return}state.dialogue=false;b.classList.add('hidden')}
  function save(){localStorage.setItem('villa_pelon_save',JSON.stringify({...state,dialogue:false,saved:false}));state.saved=true;ui();setTimeout(()=>{state.saved=false;ui()},1600)}
  function load(){try{const s=JSON.parse(localStorage.getItem('villa_pelon_save'));if(s)Object.assign(state,s)}catch(_){}state.dialogue=false;if(!['up','down','left','right'].includes(state.facing))state.facing='down'}
  V.saveGame=save; V.interact=interact; V.openDialogue=openDialogue; V.addItem=addItem; V.getNearby=getNearby; V.characterFacing=()=>state.facing;
  function ui(){const h=Math.floor(state.minutes/60)%24,m=Math.floor(state.minutes%60);document.getElementById('clock').textContent=String(h).padStart(2,'0')+':'+String(m).padStart(2,'0');document.getElementById('day').textContent=state.day;document.getElementById('money').textContent=Math.round(state.money);document.getElementById('energy').textContent=Math.round(state.energy);const life=V.life;document.getElementById('weather').textContent=life?(life.weather[0].toUpperCase()+life.weather.slice(1)):'Despejado';document.getElementById('questText').textContent=state.saved?'Partida guardada ✓':state.quest===0?'Conocé a un vecino.':state.quest===1?'Buscá la primera pista histórica.':'Primer descubrimiento completado.'}

  function rect(x,y,w,h,c){ctx.fillStyle=c;ctx.fillRect(x,y,w,h)}
  function shadow(x,y,w=24){ctx.fillStyle='rgba(35,28,20,.20)';ctx.beginPath();ctx.ellipse(x,y,w,7,0,0,Math.PI*2);ctx.fill()}
  function px(x,y,w,h,c){ctx.fillStyle=c;ctx.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h))}
  function drawCharacter(x,y,o={}){
    const dir=o.direction||'down',moving=!!o.moving,frame=moving?Math.floor((o.walk||0)*1.7)%4:0,swing=frame===1?2:frame===3?-2:0,bob=moving&&(dir==='down'||dir==='up')?Math.abs(Math.sin((o.walk||0)*1.7))*1.5:0;
    const skin=o.skin||C.skin,shirt=o.shirt||C.shirt,pants=o.pants||C.pants,shirt2=o.shirt2||C.shirt2,hair=o.hair||C.hair;
    ctx.fillStyle='rgba(25,35,25,.28)';ctx.beginPath();ctx.ellipse(x,y+31,18,5,0,0,Math.PI*2);ctx.fill();
    if(dir==='left'||dir==='right'){px(x-9,y+8+swing,8,18,pants);px(x+1,y+8-swing,8,18,pants);px(x-10,y+25+swing,10,5,C.boot);px(x+1,y+25-swing,10,5,C.boot)}else{px(x-10,y+8+swing,8,18,pants);px(x+2,y+8-swing,8,18,pants);px(x-11,y+25+swing,10,5,C.boot);px(x+1,y+25-swing,10,5,C.boot)}
    px(x-15,y-8-bob,30,19,C.outline);px(x-11,y-6-bob,22,16,shirt);px(x-17,y-5-bob,5,15,shirt2);px(x+12,y-5-bob,5,15,shirt2);px(x-5,y-13-bob,10,6,skin);
    px(x-12,y-29-bob,24,20,C.outline);px(x-9,y-27-bob,18,17,skin);px(x-10,y-28-bob,20,5,hair);px(x-8,y-25-bob,16,4,hair);
    if(dir==='left'){px(x-11,y-23-bob,5,8,hair);px(x-7,y-18-bob,3,3,C.eye);px(x-10,y-14-bob,3,2,C.skin2)}else if(dir==='right'){px(x+6,y-23-bob,5,8,hair);px(x+4,y-18-bob,3,3,C.eye);px(x+7,y-14-bob,3,2,C.skin2)}else if(dir==='up'){px(x-9,y-22-bob,18,10,hair);px(x-11,y-20-bob,3,8,hair);px(x+8,y-20-bob,3,8,hair)}else{px(x-11,y-23-bob,3,7,hair);px(x-6,y-18-bob,3,3,C.eye);px(x+3,y-18-bob,3,3,C.eye);px(x+1,y-13-bob,3,2,C.skin2);px(x-3,y-10-bob,7,2,'#7e4b42')}
    px(x-2,y-4-bob,4,10,shirt2);if(o.accent)px(x+6,y-1-bob,4,5,o.accent);
    if(o.name){ctx.font='bold 11px monospace';ctx.textAlign='center';const label=o.name.toUpperCase(),width=Math.max(64,ctx.measureText(label).width+14);ctx.fillStyle='rgba(20,27,21,.92)';ctx.fillRect(x-width/2,y-48,width,16);ctx.fillStyle='#f5edcf';ctx.fillText(label,x,y-36)}
  }
  function draw(){
    ctx.clearRect(0,0,vw,vh);ctx.save();ctx.translate(vw/2,vh/2);ctx.scale(ZOOM,ZOOM);ctx.translate(-state.x,-state.y);
    rect(0,0,world.w,world.h,'#a69a73');drawTerrain();drawRoads();drawPlaza();drawCanals();drawFields();drawFences();drawStreetFurniture();buildings.forEach(drawBuilding);
    if(V.life&&V.life.drawWorld)V.life.drawWorld(ctx);
    npcs.forEach(drawNPC);drawClue();drawJob();drawPlayer();drawLights();
    ctx.restore();if(V.life&&V.life.drawOverlay)V.life.drawOverlay(ctx,vw,vh);
  }
  function drawTerrain(){rect(0,0,world.w,world.h,'#a99b72');for(let i=0;i<260;i++){const x=(i*173+41)%world.w,y=(i*113+87)%world.h,s=8+(i%6)*5;ctx.fillStyle=i%3?'rgba(93,80,54,.09)':'rgba(220,202,155,.12)';ctx.fillRect(x,y,s,s/2)}ctx.fillStyle='#7c8067';ctx.beginPath();ctx.moveTo(0,180);ctx.lineTo(350,80);ctx.lineTo(650,165);ctx.lineTo(980,55);ctx.lineTo(1250,150);ctx.lineTo(1580,70);ctx.lineTo(1930,175);ctx.lineTo(2300,90);ctx.lineTo(2650,155);ctx.lineTo(3200,60);ctx.lineTo(3200,0);ctx.lineTo(0,0);ctx.closePath();ctx.fill();ctx.fillStyle='rgba(238,220,171,.16)';ctx.fillRect(0,180,world.w,30)}
  function drawRoads(){rect(0,600,world.w,190,'#c8b27f');rect(1070,0,190,world.h,'#c8b27f');rect(0,666,world.w,56,'#ddd0a4');rect(1137,0,56,world.h,'#ddd0a4');ctx.strokeStyle='#8f7959';ctx.lineWidth=3;ctx.setLineDash([22,18]);ctx.beginPath();ctx.moveTo(0,694);ctx.lineTo(world.w,694);ctx.moveTo(1165,0);ctx.lineTo(1165,world.h);ctx.stroke();ctx.setLineDash([]);rect(300,880,760,42,'#c3aa78');rect(1380,880,850,42,'#c3aa78');rect(2320,545,45,510,'#c3aa78')}
  function drawPlaza(){rect(900,220,520,350,'#71875c');rect(935,255,450,280,'#a7b688');ctx.strokeStyle='#60734f';ctx.lineWidth=5;ctx.strokeRect(935,255,450,280);rect(1148,265,34,260,'#d8c491');rect(945,380,430,32,'#d8c491');[[1010,320],[1330,320],[1010,480],[1330,480]].forEach(p=>tree(p[0],p[1],1.05));rect(1110,340,100,20,'#77674e');rect(1118,350,84,8,'#5f5444')}
  function drawCanals(){ctx.fillStyle='#6e8d91';ctx.fillRect(70,820,2850,22);ctx.fillStyle='#9aa8a0';ctx.fillRect(70,820,2850,4);ctx.fillStyle='#6f7c5a';for(let x=90;x<2900;x+=75)ctx.fillRect(x,814,5,34)}
  function drawFields(){rect(2380,1100,650,520,'#7e9159');for(let x=2405;x<3010;x+=42){ctx.strokeStyle='#b2a45e';ctx.lineWidth=3;for(let y=1130;y<1590;y+=55){ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+8,y+34);ctx.stroke()}}rect(1820,1420,430,390,'#8a985e');for(let x=1850;x<2220;x+=55)for(let y=1450;y<1780;y+=65)tree(x,y,.62)}
  function drawFences(){ctx.strokeStyle='#6e563d';ctx.lineWidth=5;for(let x=1780;x<2330;x+=38){ctx.beginPath();ctx.moveTo(x,720);ctx.lineTo(x,1360);ctx.stroke()}ctx.beginPath();ctx.moveTo(1780,720);ctx.lineTo(2330,720);ctx.moveTo(1780,1360);ctx.lineTo(2330,1360);ctx.stroke();ctx.lineWidth=3;for(let x=2600;x<3030;x+=40){ctx.beginPath();ctx.moveTo(x,1080);ctx.lineTo(x,1630);ctx.stroke()}}
  function drawStreetFurniture(){for(let x=150;x<3100;x+=260){pole(x,570);pole(x,820)}[[870,650],[1430,650],[2050,650],[2700,650],[1550,950],[2350,950]].forEach(p=>{rect(p[0]-3,p[1]-3,6,6,'#493c31');ctx.strokeStyle='#5c4c3a';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.lineTo(p[0],p[1]-38);ctx.stroke()})}
  function pole(x,y){ctx.fillStyle='#5d4c3c';ctx.fillRect(x-3,y-48,6,48);ctx.fillRect(x-18,y-49,36,4);ctx.fillStyle='#e1cf9a';ctx.fillRect(x-5,y-55,10,7)}
  function tree(x,y,s){const sway=Math.sin(performance.now()/900+x*.01)*1.5*s;shadow(x,y+31*s,20*s);ctx.fillStyle='#6b5039';ctx.fillRect(x-5*s,y+8*s,10*s,27*s);ctx.fillStyle='#4f7049';ctx.beginPath();ctx.arc(x+sway,y,24*s,0,Math.PI*2);ctx.fill();ctx.fillStyle='#678858';ctx.beginPath();ctx.arc(x-13*s+sway,y-9*s,14*s,0,Math.PI*2);ctx.arc(x+13*s+sway,y-6*s,15*s,0,Math.PI*2);ctx.fill()}
  function drawBuilding(b){shadow(b.x+b.w/2,b.y+b.h+15,b.w*.42);rect(b.x-10,b.y-8,b.w+20,b.h+18,'#674a37');let wall=b.type==='school'?'#d9c59d':b.type==='shop'?'#d0ae76':b.type==='radio'?'#b9856e':b.type==='rural'?'#a77e58':'#c5a783';rect(b.x,b.y,b.w,b.h,wall);ctx.fillStyle=b.type==='rural'?'#5e4c3b':'#78503b';ctx.beginPath();ctx.moveTo(b.x-18,b.y);ctx.lineTo(b.x+b.w/2,b.y-58);ctx.lineTo(b.x+b.w+18,b.y);ctx.closePath();ctx.fill();rect(b.x+b.w*.43,b.y+b.h*.55,b.w*.14,b.h*.45,'#624331');rect(b.x+28,b.y+34,48,34,'#7899a4');rect(b.x+b.w-76,b.y+34,48,34,'#7899a4');ctx.fillStyle='#3d3028';ctx.font='bold 20px monospace';ctx.textAlign='center';ctx.fillText(b.label,b.x+b.w/2,b.y-70);if(b.type==='shop'){rect(b.x+80,b.y+92,b.w-160,30,'#b94f3e');ctx.fillStyle='#fff4dc';ctx.font='bold 14px monospace';ctx.fillText('PAN · YERBA · COMESTIBLES',b.x+b.w/2,b.y+113)}if(b.type==='radio'){ctx.strokeStyle='#45392e';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(b.x+b.w/2,b.y-58);ctx.lineTo(b.x+b.w/2,b.y-105);ctx.stroke();ctx.beginPath();ctx.arc(b.x+b.w/2,b.y-105,16,0,Math.PI*2);ctx.stroke()}}
  function drawNPC(n){drawCharacter(n.x,n.y,{name:n.name,direction:n.direction||'down',moving:!!n.moving,walk:performance.now()/240+n.x/90,shirt:n.color,pants:n.pants||'#4b5360',skin:n.skin||'#d9a27c',accent:n.accent||'#d6b44f'})}
  function drawPlayer(){drawCharacter(state.x,state.y,{direction:state.facing,moving:state.walk>0,walk:state.walk,shirt:C.shirt,pants:C.pants,accent:'#d6b44f'});if(near&&!state.dialogue){ctx.fillStyle='rgba(23,32,25,.93)';ctx.fillRect(state.x-74,state.y-66,148,29);ctx.fillStyle='#fff';ctx.font='bold 12px monospace';ctx.textAlign='center';ctx.fillText('E · INTERACTUAR',state.x,state.y-46)}}
  function drawClue(){ctx.fillStyle='#d9b44e';ctx.beginPath();ctx.arc(clue.x,clue.y,18,0,Math.PI*2);ctx.fill();ctx.fillStyle='#fff';ctx.font='bold 20px monospace';ctx.textAlign='center';ctx.fillText('?',clue.x,clue.y+7);ctx.fillStyle='#403629';ctx.font='12px monospace';ctx.fillText('PISTA',clue.x,clue.y+42)}
  function drawJob(){ctx.fillStyle='#7a5b39';ctx.fillRect(jobSpot.x-22,jobSpot.y-14,44,28);ctx.fillStyle='#d6b06d';ctx.fillRect(jobSpot.x-15,jobSpot.y-10,30,18);ctx.fillStyle='#443629';ctx.font='11px monospace';ctx.textAlign='center';ctx.fillText('CHANGA',jobSpot.x,jobSpot.y-25)}
  function drawLights(){if(!V.life||!V.life.isNight)return;[[1570,330],[350,330],[1010,1120],[2150,370],[2600,850]].forEach(p=>{const x=p[0]+150,y=p[1]+20;ctx.fillStyle='rgba(255,214,128,.18)';ctx.beginPath();ctx.arc(x,y,70,0,Math.PI*2);ctx.fill();ctx.fillStyle='#f6d57d';ctx.fillRect(x-5,y-5,10,10)})}
  function loop(now){const dt=Math.min((now-last)/1000,.05);last=now;update(dt);draw();requestAnimationFrame(loop)}
  requestAnimationFrame(loop);
})();
