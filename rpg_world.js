/* Villa Pelón V38 — RPG conectado al estado real del motor. */
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const KEY='villa_pelon_rpg_world_v38';
const OLD=['villa_pelon_rpg_world_v37','villa_pelon_rpg_world_v34','villa_pelon_rpg_world_v33'];
const R=V.rpgWorld={version:'V38',events:[],relationships:{},completed:{},rewarded:{},daily:{},active:null,notice:'',noticeTimer:0};
const missions=[
{id:'vecino',title:'Una mañana en Villa Pelón',text:'Conocé a un vecino.',reward:300,kind:'dialogue'},
{id:'almacen',title:'Compra cotidiana',text:'Hacé una compra en el almacén.',reward:250,kind:'shop'},
{id:'chacra',title:'Ritmo rural',text:'Realizá una tarea rural.',reward:600,kind:'job'},
{id:'radio',title:'La voz del pueblo',text:'Acercate a la radio y escuchá su actividad.',reward:450,kind:'radio'},
{id:'plaza',title:'Punto de encuentro',text:'Visitá la plaza y observá la vida comunitaria.',reward:350,kind:'plaza'},
{id:'descanso',title:'Un día de pueblo',text:'Volvé a casa y descansá.',reward:200,kind:'home'}
];
R.missions=missions;
function state(){return V.gameState||window.__villaPelonState||null}
function day(){const s=state();return s?Math.max(1,Number(s.day)||1):1}
function clock(){const s=state();if(!s)return '08:00';const h=Math.floor(s.minutes/60)%24,m=Math.floor(s.minutes%60);return String(h).padStart(2,'0')+':'+String(m).padStart(2,'0')}
function persist(){try{localStorage.setItem(KEY,JSON.stringify({version:R.version,active:R.active,completed:R.completed,rewarded:R.rewarded,relationships:R.relationships,daily:R.daily,events:R.events.slice(-80)}))}catch(_){} }
function load(){try{let s=JSON.parse(localStorage.getItem(KEY)||'null');if(!s)for(const k of OLD){s=JSON.parse(localStorage.getItem(k)||'null');if(s)break}if(s)Object.assign(R,s)}catch(_){}R.completed=R.completed||{};R.rewarded=R.rewarded||{};R.relationships=R.relationships||{};R.events=Array.isArray(R.events)?R.events:[];R.active=R.active||'vecino';}
load();
function toast(t){R.notice=t;R.noticeTimer=4;let b=document.getElementById('v38Toast');if(!b){b=document.createElement('div');b.id='v38Toast';b.style.cssText='position:fixed;top:72px;left:50%;transform:translateX(-50%);z-index:40;background:rgba(38,34,27,.96);color:#f8e8bd;border:1px solid rgba(226,202,146,.4);padding:10px 16px;border-radius:9px;font:12px monospace;pointer-events:none;box-shadow:0 7px 25px #0007';document.body.appendChild(b)}b.textContent=t;b.style.opacity='1';clearTimeout(b._t);b._t=setTimeout(()=>b.style.opacity='0',3600)}
function current(){return missions.find(m=>m.id===R.active)||missions[missions.length-1]}
function relationship(name,delta=1){if(!name)return;R.relationships[name]=(R.relationships[name]||0)+delta;persist()}
function complete(id,reason){if(R.completed[id])return false;const m=missions.find(x=>x.id===id);if(!m)return false;const s=state();R.completed[id]=day();R.active=(missions[missions.indexOf(m)+1]||m).id;R.events.push({day:day(),time:clock(),type:'mission',id,title:m.title,reason:reason||'actividad'});if(s&&!R.rewarded[id]){s.money=Number(s.money)||0;s.money+=m.reward;R.rewarded[id]=day();if(V.saveGame)V.saveGame()}toast('✓ '+m.title+'  ·  +$'+m.reward);persist();render();return true}
R.complete=complete;
function record(type,label){R.events.push({day:day(),time:clock(),type,label});R.events=R.events.slice(-80);persist()}
function detect(speaker,text){const t=((speaker||'')+' '+(text||'')).toLowerCase();let kind=null;if(/almacén|compraste|compra/.test(t))kind='shop';else if(/changa rural|cosecha|carga|galpón/.test(t))kind='job';else if(/radio oasis|la radio/.test(t))kind='radio';else if(/casa|descansaste/.test(t))kind='home';else if(/plaza/.test(t))kind='plaza';else if(['marta','raúl','lucía','pedro','nico','rosa','tomás','elena'].some(n=>(speaker||'').toLowerCase().includes(n)))kind='dialogue';if(kind){record(kind,speaker||'actividad');if(current().kind===kind)complete(current().id,kind)}const names=['Marta','Raúl','Lucía','Pedro','Nico','Rosa','Tomás','Elena'];const who=names.find(n=>(speaker||'').toLowerCase().includes(n.toLowerCase()));if(who)relationship(who,1)}
const d=document.getElementById('dialogue');if(d){new MutationObserver(()=>{if(!d.classList.contains('hidden')){const sp=(document.getElementById('speaker')||{}).textContent||'',tx=(document.getElementById('dialogueText')||{}).textContent||'',sig=sp+'|'+tx;if(sig!==R._sig){R._sig=sig;detect(sp,tx)}}}).observe(d,{attributes:true,subtree:true,childList:true,characterData:true})}
function render(){let e=document.getElementById('rpgMission');if(!e){e=document.createElement('div');e.id='rpgMission';e.style.cssText='position:fixed;left:12px;bottom:92px;z-index:21;width:min(320px,calc(100vw - 24px));padding:10px 13px;border-left:3px solid #d2ae5c;border-radius:9px;background:rgba(30,32,27,.9);color:#f5e8cb;font:12px/1.4 system-ui;pointer-events:none';document.body.appendChild(e)}const m=current(),rel=Object.keys(R.relationships).length;e.innerHTML='<b style="color:#e5c576">'+m.title+'</b><br>'+m.text+'<br><small>Vínculos: '+rel+' · Día '+day()+' · '+clock()+'</small>'}
let lastDay=day();setInterval(()=>{const d=day();if(d!==lastDay){lastDay=d;R.daily={day:d,activities:0};toast('Nuevo día · Villa Pelón cambia de ritmo');persist()}render()},1000);
render();persist();
})();
