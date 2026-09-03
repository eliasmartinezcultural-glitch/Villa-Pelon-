/* Villa Pelón V34 — RPG World Director
   Integra progreso, relaciones, economía, actividades, eventos y persistencia
   sobre el motor V31/V32 sin crear otro loop ni tocar el movimiento del jugador. */
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const KEY='villa_pelon_rpg_world_v34';
const OLD='villa_pelon_rpg_world_v33';
const R=V.rpgWorld={version:'V34',events:[],relationships:{},completed:{},daily:{},active:null,notice:'',noticeTimer:0};
const defaults={day:1,active:'vecino',completed:{},relationships:{},daily:{},events:[],inventory:{}};
function merge(a,b){return Object.assign({},a||{},b||{})}
function load(){try{const old=JSON.parse(localStorage.getItem(OLD)||'null');const now=JSON.parse(localStorage.getItem(KEY)||'null');const s=merge(defaults,merge(old,now));Object.assign(R,s);R.completed=merge({},s.completed);R.relationships=merge({},s.relationships);R.daily=merge({},s.daily);R.events=Array.isArray(s.events)?s.events:[]}catch(e){Object.assign(R,defaults)}}
function persist(){try{localStorage.setItem(KEY,JSON.stringify({version:R.version,active:R.active,completed:R.completed,relationships:R.relationships,daily:R.daily,events:R.events.slice(-40),inventory:R.inventory}))}catch(e){}}
function toast(text){R.notice=text;R.noticeTimer=4;if(toastBox){toastBox.textContent=text;toastBox.style.opacity='1';clearTimeout(toastBox._t);toastBox._t=setTimeout(()=>toastBox.style.opacity='0',4000)}}
function day(){const el=document.getElementById('day');return Math.max(1,Number(el&&el.textContent)||1)}
function clock(){const el=document.getElementById('clock');return el?el.textContent:'08:00'}
function money(){const el=document.getElementById('money');return Number((el&&el.textContent||'0').replace(/\D/g,''))||0}
load();
R.missions=R.missions||[
{id:'vecino',title:'Una mañana en Villa Pelón',text:'Conocé a un vecino.',reward:300,kind:'dialogue'},
{id:'almacen',title:'Compra cotidiana',text:'Hacé una compra en el almacén.',reward:250,kind:'shop'},
{id:'chacra',title:'Ritmo rural',text:'Realizá una tarea rural.',reward:600,kind:'job'},
{id:'radio',title:'La voz del pueblo',text:'Acercate a la radio y escuchá su actividad.',reward:450,kind:'radio'},
{id:'plaza',title:'Punto de encuentro',text:'Visitá la plaza y observá la vida comunitaria.',reward:350,kind:'plaza'},
{id:'descanso',title:'Un día de pueblo',text:'Volvé a casa y descansá.',reward:200,kind:'home'}
];
R.active=R.active||'vecino';
function current(){return R.missions.find(m=>m.id===R.active)||R.missions[R.missions.length-1]}
function relationship(name,delta=1){if(!name)return 0;R.relationships[name]=(R.relationships[name]||0)+delta;persist();return R.relationships[name]}
function complete(id,reason){if(R.completed[id])return false;const m=R.missions.find(x=>x.id===id);if(!m)return false;R.completed[id]=day();const idx=R.missions.indexOf(m);R.active=(R.missions[idx+1]||m).id;R.events.push({day:day(),time:clock(),type:'mission',id,title:m.title,reason:reason||'actividad'});toast('✓ '+m.title+'  ·  +$'+m.reward);persist();renderMission();return true}
R.complete=complete;
function record(type,label){R.events.push({day:day(),time:clock(),type,label});R.events=R.events.slice(-40);persist()}
function detectActivity(speaker,text){
 const t=(speaker+' '+text).toLowerCase();
 let kind=null;
 if(/almacén|compraste|compra/.test(t))kind='shop';
 else if(/changa rural|cosecha|carga|galpón/.test(t))kind='job';
 else if(/radio oasis|la radio/.test(t))kind='radio';
 else if(/casa|descansaste/.test(t))kind='home';
 else if(/plaza/.test(t))kind='plaza';
 else if(['marta','raúl','lucía','pedro','nico'].some(n=>speaker.toLowerCase().includes(n)))kind='dialogue';
 if(kind){record(kind,speaker||'actividad');const m=current();if(m.kind===kind)complete(m.id,kind);}
 if(speaker&&['Marta','Raúl','Lucía','Pedro','Nico','Rosa','Tomás','Elena'].some(n=>speaker.includes(n))){relationship(speaker.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ ]/g,''),1)}
}
// Observa únicamente la UI de diálogo existente: no intercepta input ni crea un segundo game loop.
const dialogue=document.getElementById('dialogue');
if(dialogue){const obs=new MutationObserver(()=>{if(!dialogue.classList.contains('hidden')){const sp=(document.getElementById('speaker')||{}).textContent||'';const tx=(document.getElementById('dialogueText')||{}).textContent||'';const sig=sp+'|'+tx;if(sig!==R._dialogueSig){R._dialogueSig=sig;detectActivity(sp,tx)}}});obs.observe(dialogue,{attributes:true,subtree:true,childList:true,characterData:true})}
// El almacén, la radio y el trabajo también dejan huella cuando el juego cambia su dinero.
let lastMoney=money();setInterval(()=>{const now=money();if(now!==lastMoney){if(now<lastMoney)record('economy','Compra / gasto');else record('economy','Ingreso / trabajo');lastMoney=now}const d=day();if(R.daily.day!==d){R.daily={day:d,activities:0};toast('Nuevo día en Villa Pelón · nuevas rutinas y oportunidades');persist()}R.noticeTimer=Math.max(0,(R.noticeTimer||0)-1);renderMission()},1000);
function renderMission(){const el=document.getElementById('rpgMission');if(!el)return;const m=current();const rel=Object.keys(R.relationships).length;el.innerHTML='<b>'+m.title+'</b><br>'+m.text+'<br><small>Vínculos: '+rel+' · Día '+day()+' · '+clock()+'</small>'}
// Calendario de pequeñas escenas cotidianas. Son mensajes de mundo, no misiones falsas.
const scenes=[
 ['07:00','La mañana empieza: se abren casas y comienzan los primeros recorridos.'],
 ['09:00','El almacén recibe movimiento y la zona central empieza a activarse.'],
 ['11:00','La plaza concentra vecinos, charlas y pequeños encuentros.'],
 ['13:00','El pueblo baja un cambio: almuerzo y pausa en la jornada.'],
 ['16:00','La tarde rural sigue activa: trabajo, herramientas y tránsito.'],
 ['18:00','La radio prepara el cierre de la jornada y vuelve a conectar al pueblo.'],
 ['21:00','La noche llega a Villa Pelón: menos tránsito, más vida doméstica.']
];
let sceneSlot='';setInterval(()=>{const c=clock(),slot=scenes.filter(x=>c>=x[0]).slice(-1)[0];if(slot&&slot[0]!==sceneSlot){sceneSlot=slot[0];toast('• '+slot[1]);record('world',slot[1])}},5000);
// Director visual: agrega señales discretas de actividad sin alterar el render base.
const originalDraw=V.life&&V.life.drawWorld;
if(originalDraw&&!V.life.__v34Draw){V.life.__v34Draw=true;V.life.drawWorld=(c)=>{originalDraw.call(V.life,c);const phase=V.life.phase||0;const pulse=3+Math.sin(phase*3)*2;
 const signs=[[1750,594,'ALMACÉN'],[1180,1110,'RADIO'],[2150,565,'GALPÓN']];signs.forEach((s,i)=>{c.fillStyle='rgba(45,38,28,.72)';c.fillRect(s[0]-28,s[1]-25,56,14);c.fillStyle='rgba(240,211,139,.88)';c.font='8px monospace';c.textAlign='center';c.fillText(s[2],s[0],s[1]-15);if(i<2){c.fillStyle='rgba(241,201,92,.75)';c.beginPath();c.arc(s[0]+24,s[1]-18,pulse,0,Math.PI*2);c.fill()}});
}}
const style=document.createElement('style');style.textContent='.rpg-live{position:fixed;left:12px;bottom:12px;z-index:20;background:rgba(27,31,25,.91);color:#f3e5c4;border:1px solid rgba(220,196,139,.4);padding:10px 13px;border-radius:10px;font:12px monospace;max-width:320px;box-shadow:0 5px 22px #0006;pointer-events:none}.rpg-live b{display:block;color:#e7c982;margin-bottom:3px}.rpg-live small{opacity:.7}.rpg-toast{position:fixed;top:72px;left:50%;transform:translateX(-50%);z-index:30;background:#302b22ef;color:#f7e8c4;padding:10px 16px;border-radius:9px;font:12px monospace;pointer-events:none;opacity:0;transition:opacity .25s}';document.head.appendChild(style);
const box=document.createElement('div');box.className='rpg-live';box.innerHTML='<span id="rpgMission">Cargando actividad…</span>';document.body.appendChild(box);
const toastBox=document.createElement('div');toastBox.className='rpg-toast';document.body.appendChild(toastBox);
renderMission();persist();
})();