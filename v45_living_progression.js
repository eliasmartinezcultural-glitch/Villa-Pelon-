/* Villa Pelón V45 — horarios vivos, descubrimientos históricos y consecuencias. */
(()=>{
'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const S=V.gameState||window.__villaPelonState;if(!S)return;
const KEY='villa_pelon_v45';
const R=V.v45={version:'V45',discoveries:[],flags:{},schedule:{},events:[],lastMinute:-1};
const schedule={
 Marta:[['06:00','12:00','almacen'],['12:00','16:00','casa'],['16:00','20:00','almacen'],['20:00','23:00','casa']],
 Raúl:[['06:00','11:00','chacra'],['11:00','14:00','galpon'],['14:00','17:00','casa'],['17:00','21:00','chacra']],
 Lucía:[['07:00','12:00','escuela'],['12:00','16:00','plaza'],['16:00','20:00','plaza'],['20:00','23:00','casa']],
 Pedro:[['06:00','13:00','chacra'],['13:00','17:00','casa'],['17:00','21:00','galpon']],
 Nico:[['07:00','12:00','radio'],['12:00','15:00','plaza'],['15:00','20:00','radio'],['20:00','23:00','radio']],
 Rosa:[['08:00','13:00','escuela'],['13:00','18:00','plaza'],['18:00','21:00','casa']],
 Tomás:[['06:00','12:00','chacra'],['12:00','16:00','casa'],['16:00','21:00','plaza']],
 Elena:[['08:00','14:00','almacen'],['14:00','18:00','plaza'],['18:00','22:00','casa']]
};
const discoveries=[
 {id:'territorio',title:'El territorio antes del pueblo',text:'Una pista invita a observar el paisaje y preguntarse cómo cambió con el tiempo.',kind:'clue'},
 {id:'trabajo',title:'Las manos del trabajo',text:'La vida rural deja huellas en herramientas, horarios y caminos.',kind:'rural'},
 {id:'memoria',title:'Una memoria compartida',text:'Una fotografía abre una nueva pregunta sobre las personas que habitaron este lugar.',kind:'photo'}
];
function load(){try{const x=JSON.parse(localStorage.getItem(KEY)||'null');if(x){R.discoveries=Array.isArray(x.discoveries)?x.discoveries:[];R.flags=x.flags||{};R.events=Array.isArray(x.events)?x.events:[]}}catch(_){}
}
function save(){localStorage.setItem(KEY,JSON.stringify({version:'V45',discoveries:R.discoveries.slice(-30),flags:R.flags,events:R.events.slice(-80)}))}
function mins(){return Number(S.minutes)||0}
function hhmm(){let m=((mins()%1440)+1440)%1440;return String(Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0')}
function between(now,a,b){const p=x=>{const z=x.split(':');return +z[0]*60 + +z[1]};return now>=p(a)&&now<p(b)}
function currentPlace(name){const now=mins()%1440;const rows=schedule[name]||[];return (rows.find(x=>between(now,x[0],x[1]))||[])[2]||'casa'}
function syncSchedules(){Object.keys(schedule).forEach(n=>R.schedule[n]=currentPlace(n));
 const list=V.npcs||V.life&&V.life.people||[];if(Array.isArray(list))list.forEach(n=>{const p=R.schedule[n.name];if(p){n.schedulePlace=p;n.scheduleActive=true;n.direction=n.direction||'down'}})
}
function toast(t){let e=document.getElementById('v45Toast');if(!e){e=document.createElement('div');e.id='v45Toast';document.body.appendChild(e)}e.textContent=t;e.classList.add('show');clearTimeout(e._t);e._t=setTimeout(()=>e.classList.remove('show'),2800)}
function discover(id){if(R.discoveries.includes(id))return;const d=discoveries.find(x=>x.id===id);if(!d)return;R.discoveries.push(id);R.flags[id]=true;R.events.push({day:S.day,minutes:mins(),type:'discovery',id});save();if(V.saveGame)V.saveGame();toast('DESCUBRIMIENTO · '+d.title);render()}
function hook(){const old=V.addItem;V.addItem=function(item){if(old)old.apply(this,arguments);const t=String(item).toLowerCase();if(t.includes('pista histórica'))discover('territorio');if(t.includes('cosecha'))discover('trabajo');if(t.includes('fotografía'))discover('memoria')};
 const oldInteract=V.interact;V.interact=function(){const r=oldInteract?oldInteract.apply(this,arguments):undefined;const n=V.getNearby?V.getNearby():null;const name=n&&n.name?String(n.name).toLowerCase():'';if(name==='lucía')discover('memoria');if(name==='raúl')discover('trabajo');return r}}
function render(){let e=document.getElementById('v45Panel');if(!e){e=document.createElement('div');e.id='v45Panel';document.getElementById('game').appendChild(e)}const active=discoveries.filter(d=>R.discoveries.includes(d.id));e.innerHTML='<b>VIDA Y MEMORIA</b><span>Horario · '+hhmm()+'</span><span>Descubrimientos · '+active.length+'/'+discoveries.length+'</span>'+(active.length?'<small>'+active[active.length-1].title+'</small>':'<small>Explorá el pueblo para descubrir nuevas pistas.</small>')}
function tick(){syncSchedules();if(R.lastMinute!==mins()){R.lastMinute=mins();render()} }
load();hook();syncSchedules();render();setInterval(tick,900);
V.worldSchedule={get:(name)=>R.schedule[name]||currentPlace(name),all:()=>({...R.schedule})};
V.historicalDiscoveries={list:()=>discoveries.slice(),unlocked:()=>R.discoveries.slice(),discover};
})();