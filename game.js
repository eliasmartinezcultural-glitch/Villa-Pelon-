(() => {
  'use strict';
  const canvas = document.getElementById('world');
  const ctx = canvas.getContext('2d');
  const DPR = () => Math.min(window.devicePixelRatio || 1, 2);

  const state = {
    started:false, x:960, y:650, speed:210, money:10000, energy:100,
    minutes:480, day:1, quest:0, dialogue:false, saved:false,
    inventory:[]
  };
  const input={up:false,down:false,left:false,right:false};
  const world={w:2400,h:1500};
  let vw=innerWidth,vh=innerHeight,camX=0,camY=0,near=null,last=performance.now();

  const npcs=[
    {x:650,y:570,name:'Marta',role:'Vecina',color:'#b95e4e',lines:['Buen día. Soy Marta. En un pueblo chico siempre hay alguien para ayudar.','Si querés conocer Villa Pelón, caminá, preguntá y prestá atención a los detalles.']},
    {x:1720,y:590,name:'Raúl',role:'Trabajador rural',color:'#557ca8',lines:['Trabajo en una chacra. Acá las temporadas marcan el ritmo de muchas familias.','Cuando quieras, puedo ofrecerte una changa rural.']},
    {x:530,y:1010,name:'Lucía',role:'Docente',color:'#a55e8f',lines:['La escuela guarda recuerdos que pueden ayudarnos a reconstruir la historia local.','Una fotografía también puede ser una pista.']},
    {x:1810,y:1010,name:'Pedro',role:'Comerciante',color:'#bd8249',lines:['El almacén es un buen lugar para enterarse de lo que pasa en el pueblo.','Acá todos se conocen, aunque no siempre piensan igual.']},
    {x:1190,y:390,name:'Nico',role:'Joven del pueblo',color:'#5d8d59',lines:['La plaza es el corazón del pueblo. Desde acá podés empezar a recorrerlo.']}
  ];
  const buildings=[
    {x:350,y:330,w:360,h:210,label:'ESCUELA',type:'school'},
    {x:1570,y:330,w:360,h:210,label:'ALMACÉN',type:'shop'},
    {x:1010,y:1120,w:380,h:210,label:'RADIO',type:'radio'},
    {x:760,y:370,w:210,h:155,label:'VIVIENDA',type:'home'},
    {x:1450,y:720,w:250,h:170,label:'VIVIENDA',type:'home'}
  ];
  const clue={x:2040,y:430};

  function resize(){
    vw=innerWidth; vh=innerHeight;
    const d=DPR(); canvas.width=Math.floor(vw*d);canvas.height=Math.floor(vh*d);
    canvas.style.width=vw+'px';canvas.style.height=vh+'px';ctx.setTransform(d,0,0,d,0,0);
  }
  addEventListener('resize',resize,{passive:true}); resize();

  function bindInput(){
    addEventListener('keydown',e=>{
      const k=e.key.toLowerCase();
      if(['arrowup','w'].includes(k))input.up=true;
      if(['arrowdown','s'].includes(k))input.down=true;
      if(['arrowleft','a'].includes(k))input.left=true;
      if(['arrowright','d'].includes(k))input.right=true;
      if(k==='e'||k===' '){e.preventDefault();interact();}
    });
    addEventListener('keyup',e=>{
      const k=e.key.toLowerCase();
      if(['arrowup','w'].includes(k))input.up=false;
      if(['arrowdown','s'].includes(k))input.down=false;
      if(['arrowleft','a'].includes(k))input.left=false;
      if(['arrowright','d'].includes(k))input.right=false;
    });
    document.querySelectorAll('[data-key]').forEach(btn=>{
      const k=btn.dataset.key;
      const on=e=>{e.preventDefault();input[k]=true;};
      const off=()=>input[k]=false;
      btn.addEventListener('pointerdown',on);['pointerup','pointercancel','pointerleave'].forEach(ev=>btn.addEventListener(ev,off));
    });
    document.getElementById('interact').addEventListener('pointerdown',e=>{e.preventDefault();interact();});
  }
  bindInput();

  document.getElementById('startBtn').addEventListener('click',()=>{
    state.started=true;document.getElementById('start').classList.add('hidden');document.getElementById('game').classList.remove('hidden');load();last=performance.now();
  });
  document.getElementById('save').addEventListener('click',save);
  document.getElementById('dialogueNext').addEventListener('click',closeDialogue);

  function blocked(x,y){
    if(x<35||y<105||x>world.w-35||y>world.h-35)return true;
    return buildings.some(b=>x>b.x-18&&x<b.x+b.w+18&&y>b.y-18&&y<b.y+b.h+18);
  }
  function update(dt){
    if(!state.started||state.dialogue)return;
    let dx=(input.right?1:0)-(input.left?1:0),dy=(input.down?1:0)-(input.up?1:0);
    if(dx||dy){const len=Math.hypot(dx,dy);dx/=len;dy/=len;const nx=state.x+dx*state.speed*dt,ny=state.y+dy*state.speed*dt;if(!blocked(nx,state.y))state.x=nx;if(!blocked(state.x,ny))state.y=ny;state.energy=Math.max(0,state.energy-dt*0.8);state.minutes+=dt*4;}
    if(state.minutes>=1440){state.minutes-=1440;state.day++;state.energy=100;}
    near=getNearby();
    camX=Math.max(0,Math.min(world.w-vw,state.x-vw*.5));camY=Math.max(55,Math.min(world.h-vh,state.y-vh*.5));
    ui();
  }
  function getNearby(){
    for(const n of npcs)if(Math.hypot(state.x-n.x,state.y-n.y)<75)return n;
    if(Math.hypot(state.x-clue.x,state.y-clue.y)<80)return clue;
    return null;
  }
  function interact(){
    if(!state.started)return;
    if(state.dialogue){closeDialogue();return;}
    const n=getNearby();if(!n)return;
    if(n===clue){
      if(state.quest<2){state.quest=2;state.money+=2500;if(!state.inventory.includes('Pista histórica'))state.inventory.push('Pista histórica');openDialogue('ARCHIVO DE MEMORIA',['Encontraste una pista histórica.','Esta versión separa ficción y documentación: el contenido histórico real se incorporará con fuente verificable.','Recompensa: $2.500']);}
      else openDialogue('ARCHIVO DE MEMORIA',['Esta pista ya fue descubierta.']);
      return;
    }
    if(state.quest===0)state.quest=1;
    openDialogue(n.name,n.lines);
  }
  function openDialogue(speaker,lines){
    state.dialogue=true;const box=document.getElementById('dialogue');box.classList.remove('hidden');box.dataset.lines=JSON.stringify(lines);box.dataset.index='0';document.getElementById('speaker').textContent=speaker;document.getElementById('dialogueText').textContent=lines[0];
  }
  function closeDialogue(){
    const box=document.getElementById('dialogue');if(!state.dialogue)return;let lines=[];try{lines=JSON.parse(box.dataset.lines||'[]');}catch(_){}let i=Number(box.dataset.index||0)+1;
    if(i<lines.length){box.dataset.index=String(i);document.getElementById('dialogueText').textContent=lines[i];return;}
    state.dialogue=false;box.classList.add('hidden');
  }
  function save(){
    localStorage.setItem('villa_pelon_save',JSON.stringify({...state,dialogue:false,saved:false}));state.saved=true;ui();setTimeout(()=>{state.saved=false;ui();},1600);
  }
  function load(){try{const s=JSON.parse(localStorage.getItem('villa_pelon_save'));if(s)Object.assign(state,s);}catch(_){}state.dialogue=false;}
  function ui(){
    const h=Math.floor(state.minutes/60)%24,m=Math.floor(state.minutes%60);
    document.getElementById('clock').textContent=String(h).padStart(2,'0')+':'+String(m).padStart(2,'0');
    document.getElementById('money').textContent=Math.round(state.money);document.getElementById('energy').textContent=Math.round(state.energy);
    document.getElementById('questText').textContent=state.saved?'Partida guardada ✓':state.quest===0?'Conocé a un vecino.':state.quest===1?'Buscá la primera pista histórica.':'Primer descubrimiento completado.';
  }

  function draw(){
    ctx.clearRect(0,0,vw,vh);ctx.save();ctx.translate(-camX,-camY);
    // ground
    ctx.fillStyle='#a69a70';ctx.fillRect(0,0,world.w,world.h);
    // subtle soil patches
    ctx.fillStyle='rgba(116,92,59,.12)';for(let i=0;i<80;i++){const x=(i*317)%world.w,y=(i*197)%world.h;ctx.fillRect(x,y,70+(i%4)*18,28+(i%3)*12);}
    // streets
    ctx.fillStyle='#c6ad7c';ctx.fillRect(0,610,world.w,180);ctx.fillRect(1070,80,180,1420);
    ctx.fillStyle='#d8c493';ctx.fillRect(0,675,world.w,50);ctx.fillRect(1135,80,50,1420);
    // road edges
    ctx.strokeStyle='#9b855f';ctx.lineWidth=3;ctx.setLineDash([18,16]);ctx.beginPath();ctx.moveTo(0,700);ctx.lineTo(world.w,700);ctx.moveTo(1160,80);ctx.lineTo(1160,world.h);ctx.stroke();ctx.setLineDash([]);
    // plaza
    ctx.fillStyle='#819768';ctx.fillRect(900,220,520,350);ctx.fillStyle='#a6b98b';ctx.fillRect(935,255,450,280);ctx.strokeStyle='#667c53';ctx.lineWidth=4;ctx.strokeRect(935,255,450,280);
    // paths in plaza
    ctx.strokeStyle='#d8c493';ctx.lineWidth=28;ctx.beginPath();ctx.moveTo(1160,255);ctx.lineTo(1160,535);ctx.moveTo(935,395);ctx.lineTo(1385,395);ctx.stroke();
    // trees
    for(let i=0;i<48;i++){const x=(i*173+90)%world.w,y=(i*113+145)%world.h;if(x>880&&x<1430&&y>200&&y<590)continue;tree(x,y,(i%3)+.8)}
    // rural plot
    ctx.fillStyle='#788f55';ctx.fillRect(1860,720,450,610);ctx.strokeStyle='#667748';ctx.lineWidth=6;ctx.strokeRect(1860,720,450,610);for(let y=760;y<1300;y+=55){ctx.strokeStyle='#a4a35d';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(1880,y);ctx.lineTo(2290,y);ctx.stroke();}
    // irrigation canal
    ctx.fillStyle='#718b78';ctx.fillRect(1840,690,480,20);ctx.fillStyle='#8aa18c';ctx.fillRect(1840,693,480,9);
    buildings.forEach(drawBuilding);
    npcs.forEach(drawNPC);drawClue();drawPlayer();
    ctx.restore();
  }
  function tree(x,y,s){ctx.fillStyle='#6b4f38';ctx.fillRect(x-5*s,y+10*s,10*s,22*s);ctx.fillStyle='#547548';ctx.beginPath();ctx.arc(x,y,22*s,0,Math.PI*2);ctx.fill();ctx.fillStyle='#668957';ctx.beginPath();ctx.arc(x-12*s,y-8*s,13*s,0,Math.PI*2);ctx.arc(x+12*s,y-6*s,14*s,0,Math.PI*2);ctx.fill();}
  function drawBuilding(b){
    ctx.fillStyle='#6b4c39';ctx.fillRect(b.x-8,b.y-12,b.w+16,b.h+18);ctx.fillStyle=b.type==='school'?'#d9c49a':b.type==='shop'?'#d0ae76':b.type==='radio'?'#b8836e':'#c5a783';ctx.fillRect(b.x,b.y,b.w,b.h);
    ctx.fillStyle='#7b503b';ctx.beginPath();ctx.moveTo(b.x-15,b.y);ctx.lineTo(b.x+b.w/2,b.y-62);ctx.lineTo(b.x+b.w+15,b.y);ctx.closePath();ctx.fill();
    ctx.fillStyle='#5e3f31';ctx.fillRect(b.x+b.w*.43,b.y+b.h*.55,b.w*.14,b.h*.45);ctx.fillStyle='#7899a4';ctx.fillRect(b.x+28,b.y+35,48,34);ctx.fillRect(b.x+b.w-76,b.y+35,48,34);
    ctx.fillStyle='#3d3028';ctx.font='bold 20px system-ui';ctx.textAlign='center';ctx.fillText(b.label,b.x+b.w/2,b.y-75);
  }
  function drawNPC(n){
    ctx.fillStyle='#3e3028';ctx.beginPath();ctx.ellipse(n.x,n.y+18,18,7,0,0,Math.PI*2);ctx.fill();ctx.fillStyle=n.color;ctx.fillRect(n.x-12,n.y-2,24,27);ctx.fillStyle='#e1b08a';ctx.beginPath();ctx.arc(n.x,n.y-12,12,0,Math.PI*2);ctx.fill();ctx.fillStyle='#3b302a';ctx.fillRect(n.x-11,n.y-24,22,7);ctx.fillStyle='#263025';ctx.font='13px system-ui';ctx.textAlign='center';ctx.fillText(n.name,n.x,n.y-34);
  }
  function drawPlayer(){
    ctx.fillStyle='#3e3028';ctx.beginPath();ctx.ellipse(state.x,state.y+19,20,8,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#315a9b';ctx.fillRect(state.x-13,state.y-2,26,29);ctx.fillStyle='#d9a47e';ctx.beginPath();ctx.arc(state.x,state.y-13,13,0,Math.PI*2);ctx.fill();ctx.fillStyle='#3a302b';ctx.fillRect(state.x-12,state.y-26,24,7);
    if(near&&!state.dialogue){ctx.fillStyle='#172019e8';ctx.roundRect(state.x-68,state.y-62,136,28,8);ctx.fill();ctx.fillStyle='#fff';ctx.font='bold 12px system-ui';ctx.textAlign='center';ctx.fillText('E · INTERACTUAR',state.x,state.y-43);}
  }
  function drawClue(){ctx.fillStyle='#d9b44e';ctx.beginPath();ctx.arc(clue.x,clue.y,17,0,Math.PI*2);ctx.fill();ctx.fillStyle='#fff';ctx.font='bold 18px system-ui';ctx.textAlign='center';ctx.fillText('?',clue.x,clue.y+6);ctx.fillStyle='#403629';ctx.font='12px system-ui';ctx.fillText('PISTA',clue.x,clue.y+38);}
  function loop(now){const dt=Math.min((now-last)/1000,.05);last=now;update(dt);draw();requestAnimationFrame(loop)}
  requestAnimationFrame(loop);
})();
