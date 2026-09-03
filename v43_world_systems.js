/* Villa Pelón V43 — interiores, inventario, relaciones y consecuencias. Consume el único motor existente. */
(() => {
  'use strict';
  const V=window.VillaPelon||(window.VillaPelon={});
  const S=V.gameState;
  if(!S)return;
  const KEY='villa_pelon_v43';
  const R=V.v43={version:'V43',interior:null,relationships:{},items:{},events:[],history:[],inside:{x:320,y:240},input:{up:false,down:false,left:false,right:false}};

  const catalog={
    pan:{name:'Pan',category:'alimento',price:120,energy:12,icon:'🍞'},
    yerba:{name:'Yerba',category:'alimento',price:900,energy:0,icon:'🧉'},
    azucar:{name:'Azúcar',category:'alimento',price:700,energy:0,icon:'▦'},
    agua:{name:'Agua',category:'bebida',price:80,energy:4,icon:'💧'},
    herramienta:{name:'Herramienta',category:'herramienta',price:1200,energy:0,icon:'🔧'},
    foto:{name:'Fotografía',category:'memoria',price:0,energy:0,icon:'▧'},
    cosecha:{name:'Cajón de cosecha',category:'trabajo',price:0,energy:0,icon:'▣'}
  };
  const interiorData={
    school:{title:'ESCUELA',subtitle:'Aula y memoria comunitaria',color:'#d7c59e',rooms:['Aula','Archivo escolar','Patio'],exit:'Salida al pueblo'},
    shop:{title:'ALMACÉN',subtitle:'Comercio de barrio',color:'#d0ae76',rooms:['Mostrador','Estanterías','Depósito'],exit:'Salida al pueblo'},
    radio:{title:'RADIO OASIS',subtitle:'La voz cotidiana del pueblo',color:'#b9856e',rooms:['Estudio','Cabina','Archivo sonoro'],exit:'Salida al pueblo'},
    home:{title:'CASA',subtitle:'Tu espacio cotidiano',color:'#c5a783',rooms:['Cocina','Habitación','Mesa'],exit:'Salida al pueblo'},
    rural:{title:'GALPÓN',subtitle:'Herramientas y trabajo rural',color:'#a77e58',rooms:['Herramientas','Carga','Depósito'],exit:'Salida al pueblo'}
  };

  function migrate(){
    let raw=null;try{raw=JSON.parse(localStorage.getItem(KEY)||'null')}catch(_){raw=null}
    if(raw&&raw.items)R.items=raw.items;
    if(raw&&raw.relationships)R.relationships=raw.relationships;
    if(!Object.keys(R.items).length){
      (S.inventory||[]).forEach(label=>{const id=Object.keys(catalog).find(k=>label.toLowerCase().includes(catalog[k].name.toLowerCase()))||'foto';R.items[id]=(R.items[id]||0)+1});
    }
    ['Marta','Raúl','Lucía','Pedro','Nico','Rosa','Tomás','Elena'].forEach(n=>{if(!R.relationships[n])R.relationships[n]={level:0,xp:0}});
    persist();
  }
  function persist(){localStorage.setItem(KEY,JSON.stringify({version:'V43',items:R.items,relationships:R.relationships,events:R.events.slice(-40),history:R.history.slice(-40)}))}
  function addItem(id,qty=1){if(!catalog[id])return;R.items[id]=(R.items[id]||0)+qty;syncLegacy();persist();renderInventory()}
  function removeItem(id,qty=1){if((R.items[id]||0)<qty)return false;R.items[id]-=qty;if(R.items[id]<=0)delete R.items[id];syncLegacy();persist();renderInventory();return true}
  function syncLegacy(){S.inventory=[];Object.keys(R.items).forEach(id=>{for(let i=0;i<R.items[id];i++)S.inventory.push(catalog[id].name)});}
  function money(n){S.money=Math.max(0,Math.round((S.money||0)+n));if(V.saveGame)V.saveGame()}
  function relation(name,delta,reason){const r=R.relationships[name]||(R.relationships[name]={level:0,xp:0});r.xp=Math.max(0,(r.xp||0)+delta);while(r.xp>=100){r.xp-=100;r.level=Math.min(5,(r.level||0)+1)}R.history.push({day:S.day,minutes:S.minutes,npc:name,delta,reason});persist();showToast(name+' · vínculo '+r.level+' · '+reason)}
  function showToast(text){let el=document.getElementById('v43Toast');if(!el){el=document.createElement('div');el.id='v43Toast';document.body.appendChild(el)}el.textContent=text;el.classList.add('show');clearTimeout(el._t);el._t=setTimeout(()=>el.classList.remove('show'),2200)}

  function ensureUI(){
    if(document.getElementById('v43Panel'))return;
    const p=document.createElement('aside');p.id='v43Panel';p.innerHTML='<div class="v43-head"><b>MOCHILA</b><button id="v43Close">×</button></div><div id="v43Items"></div><div class="v43-foot"><span>RELACIONES</span><div id="v43Relations"></div></div>';
    document.getElementById('game').appendChild(p);
    const inv=document.createElement('button');inv.id='v43Bag';inv.textContent='MOCHILA';document.getElementById('game').appendChild(inv);
    inv.onclick=()=>p.classList.toggle('open');document.getElementById('v43Close').onclick=()=>p.classList.remove('open');
    renderInventory();renderRelations();
  }
  function renderInventory(){const el=document.getElementById('v43Items');if(!el)return;const ids=Object.keys(R.items).filter(id=>R.items[id]>0);el.innerHTML=ids.length?ids.map(id=>{const c=catalog[id];return '<button class="v43-item" data-item="'+id+'"><span>'+c.icon+' '+c.name+'</span><b>x'+R.items[id]+'</b></button>'}).join(''):'<div class="v43-empty">La mochila está vacía.</div>';el.querySelectorAll('[data-item]').forEach(b=>b.onclick=()=>useItem(b.dataset.item));}
  function renderRelations(){const el=document.getElementById('v43Relations');if(!el)return;const names=Object.keys(R.relationships).filter(n=>R.relationships[n].level>0||R.relationships[n].xp>0);el.innerHTML=names.length?names.map(n=>'<div>'+n+' <b>Nv '+R.relationships[n].level+'</b> · '+R.relationships[n].xp+'/100</div>').join(''):'Todavía no hay vínculos registrados.'}
  function useItem(id){
    const c=catalog[id];if(!c||(R.items[id]||0)<1)return;
    if(id==='pan'||id==='agua'){removeItem(id);S.energy=Math.min(100,S.energy+c.energy);showToast(c.name+' usado · energía +'+c.energy);return}
    if(id==='yerba'){removeItem(id);S.minutes+=15;relation('Nico',8,'compartiste un momento de mate');showToast('Mate preparado · +15 min');return}
    if(id==='herramienta'){showToast('La herramienta queda disponible para tareas rurales.');return}
    if(id==='foto'){relation('Lucía',12,'revisaste una fotografía');showToast('Fotografía revisada · memoria +');return}
    if(id==='cosecha'){showToast('El cajón de cosecha puede entregarse en futuras misiones.');}
  }

  function nearestBuilding(){const n=V.getNearby&&V.getNearby();return n&&n.type?n:null}
  function enter(type){
    if(!interiorData[type])return false;
    R.interior=type;R.inside={x:320,y:390};
    document.getElementById('v43Interior').classList.remove('hidden');
    drawInterior();
    showToast('Entraste a '+interiorData[type].title);
    return true;
  }
  function exit(){R.interior=null;document.getElementById('v43Interior').classList.add('hidden');showToast('Volviste al pueblo')}
  function intercept(){
    const b=nearestBuilding();
    if(R.interior){exit();return true}
    if(!b)return false;
    if(['school','shop','radio','home','rural'].includes(b.type)){enter(b.type);return true}
    return false;
  }

  function handleNPC(){
    const n=V.getNearby&&V.getNearby();if(!n||!n.name)return false;
    relation(n.name,10,'conversación');
    if(n.name==='Marta'&&R.relationships.Marta.level>=2)addItem('agua');
    if(n.name==='Lucía'&&R.relationships.Lucía.level>=2)addItem('foto');
    if(n.name==='Nico'&&R.relationships.Nico.level>=2)addItem('yerba');
    if(V.openDialogue)V.openDialogue(n.name,n.lines||['Hola.']);
    return true;
  }
  function handleShop(){
    const ids=['pan','agua','yerba','azucar','herramienta'];
    const id=ids[(R.events.filter(e=>e.kind==='purchase').length)%ids.length],c=catalog[id];
    if((S.money||0)<c.price){if(V.openDialogue)V.openDialogue('ALMACÉN EL ENCUENTRO',['No alcanza el dinero para '+c.name+'.']);return true}
    money(-c.price);addItem(id);R.events.push({kind:'purchase',id,day:S.day});persist();relation('Marta',5,'compra en el almacén');if(V.openDialogue)V.openDialogue('ALMACÉN EL ENCUENTRO',['Compraste '+c.name+' por $'+c.price+'.','Ahora tenés '+R.items[id]+' unidad(es) en la mochila.']);return true;
  }
  function handleInteriorAction(){
    const d=interiorData[R.interior];
    if(!d)return false;
    const room=Math.floor((R.inside.x-90)/150);
    if(R.interior==='school'){addItem('foto');relation('Lucía',15,'consultaste el archivo escolar');V.openDialogue('ARCHIVO ESCOLAR',['Encontraste una fotografía para investigar más adelante.','Las referencias históricas reales se incorporarán con fuente verificable.']);}
    else if(R.interior==='radio'){relation('Nico',15,'visitaste el estudio');V.openDialogue('RADIO OASIS',['La actividad de la radio cambia según la hora del día.','Podés volver para encontrarte con otra rutina.']);}
    else if(R.interior==='rural'){if((R.items.herramienta||0)<1)addItem('herramienta');relation('Raúl',12,'revisaste herramientas de trabajo');V.openDialogue('GALPÓN',['Encontraste una herramienta útil para próximas tareas rurales.']);}
    else if(R.interior==='home'){S.energy=Math.min(100,S.energy+35);S.minutes+=45;V.saveGame();showToast('Descansaste · energía +35');}
    else if(R.interior==='shop'){handleShop()}
    drawInterior();return true;
  }

  function drawInterior(){
    const c=document.getElementById('v43InteriorCanvas');if(!c)return;const x=c.getContext('2d'),w=c.width=c.clientWidth*devicePixelRatio||800,h=c.height=c.clientHeight*devicePixelRatio||500;x.setTransform(devicePixelRatio||1,0,0,devicePixelRatio||1,0,0);const W=c.clientWidth||800,H=c.clientHeight||500,d=interiorData[R.interior];
    x.fillStyle='#1b241c';x.fillRect(0,0,W,H);x.fillStyle=d.color;x.fillRect(55,55,W-110,H-110);x.fillStyle='#6b4e3a';x.fillRect(55,55,W-110,22);x.fillStyle='#4e392d';x.fillRect(55,H-77,W-110,22);x.fillStyle='#eadfbd';x.font='bold 20px monospace';x.fillText(d.title,75,92);x.font='12px monospace';x.fillText(d.subtitle,75,112);
    const cols=['#8a6b4e','#9b7a58','#6f5a43'];for(let i=0;i<3;i++){const rx=95+i*((W-230)/3);x.fillStyle=cols[i];x.fillRect(rx,170,(W-300)/3,150);x.fillStyle='#e5d2a3';x.fillRect(rx+10,180,(W-320)/3,18);x.fillStyle='#30271f';x.font='11px monospace';x.fillText(d.rooms[i],rx+16,213);for(let k=0;k<3;k++)x.fillRect(rx+18+k*30,235,18,30)}
    x.fillStyle='#3c3026';x.fillRect(W/2-45,H-122,90,45);x.fillStyle='#eadfbd';x.font='11px monospace';x.fillText('PUERTA',W/2-24,H-97);x.fillStyle='#fff';x.font='bold 12px monospace';x.fillText('Flechas/WASD · E acción · ESC salir',W/2-150,35);x.fillStyle='#d8ecae';x.font='bold 13px monospace';x.fillText('E · '+(R.interior==='shop'?'COMPRAR':R.interior==='home'?'DESCANSAR':'EXPLORAR'),W/2-60,H-45);
    x.fillStyle='#24382a';x.fillRect(R.inside.x-10,R.inside.y-10,20,20);x.fillStyle='#b8d477';x.fillRect(R.inside.x-6,R.inside.y-6,12,12);
  }

  function makeOverlay(){
    const o=document.createElement('div');o.id='v43Interior';o.className='hidden';o.innerHTML='<canvas id="v43InteriorCanvas"></canvas>';document.getElementById('game').appendChild(o);
    window.addEventListener('keydown',e=>{
      const k=e.key.toLowerCase();
      if(!R.interior)return;
      if(k==='escape'){e.preventDefault();e.stopImmediatePropagation();exit();return}
      if(k==='e'||k===' '){e.preventDefault();e.stopImmediatePropagation();handleInteriorAction();return}
      if(['arrowup','w'].includes(k))R.input.up=true;if(['arrowdown','s'].includes(k))R.input.down=true;if(['arrowleft','a'].includes(k))R.input.left=true;if(['arrowright','d'].includes(k))R.input.right=true;
      if(['arrowup','arrowdown','arrowleft','arrowright','w','a','s','d'].includes(k)){e.preventDefault();e.stopImmediatePropagation()}
    },true);
    window.addEventListener('keyup',e=>{const k=e.key.toLowerCase();if(['arrowup','w'].includes(k))R.input.up=false;if(['arrowdown','s'].includes(k))R.input.down=false;if(['arrowleft','a'].includes(k))R.input.left=false;if(['arrowright','d'].includes(k))R.input.right=false},true);
    document.getElementById('interact').addEventListener('pointerdown',e=>{if(R.interior){e.preventDefault();e.stopImmediatePropagation();handleInteriorAction()}},true);
    setInterval(()=>{if(!R.interior)return;const sp=4.5;if(R.input.left)R.inside.x-=sp;if(R.input.right)R.inside.x+=sp;if(R.input.up)R.inside.y-=sp;if(R.input.down)R.inside.y+=sp;R.inside.x=Math.max(90,Math.min(710,R.inside.x));R.inside.y=Math.max(145,Math.min(390,R.inside.y));drawInterior()},30);
  }

  /* Captura E antes del motor para que entrar a un edificio sea una acción real y no un diálogo. */
  window.addEventListener('keydown',e=>{
    if(e.key.toLowerCase()!=='e'&&e.key!==' ')return;
    if(R.interior)return;
    if(intercept()){e.preventDefault();e.stopImmediatePropagation();return}
    const n=V.getNearby&&V.getNearby();
    if(n&&n.name){e.preventDefault();e.stopImmediatePropagation();handleNPC()}
  },true);
  window.addEventListener('beforeunload',persist);
  migrate();ensureUI();makeOverlay();
  setInterval(()=>{renderInventory();renderRelations();syncLegacy()},900);
  /* Feed directions from actual autonomous movement without creating another render loop. */
  const lastPos=new Map();
  setInterval(()=>{(V.npcs||[]).forEach(n=>{const p=lastPos.get(n.name);if(p){const dx=n.x-p.x,dy=n.y-p.y;if(Math.abs(dx)+Math.abs(dy)>0.3)n.direction=Math.abs(dx)>Math.abs(dy)?(dx<0?'left':'right'):(dy<0?'up':'down');n.moving=Math.abs(dx)+Math.abs(dy)>0.3}lastPos.set(n.name,{x:n.x,y:n.y})})},180);
})();
