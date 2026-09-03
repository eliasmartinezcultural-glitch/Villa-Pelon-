/* Villa Pelón V44 — progresión territorial, misiones encadenadas y eventos diarios. */
(()=>{
'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const S=V.gameState;if(!S)return;
const KEY='villa_pelon_v44';
const R=V.worldProgression={version:'V44',missionIndex:0,missions:[],completed:[],events:[],flags:{},lastDay:0};
const missionBook=[
{id:'saludo',title:'Una cara conocida',text:'Hablá con un vecino y empezá a conocer Villa Pelón.',kind:'npc',target:null,reward:150},
{id:'almacen',title:'Una compra para la casa',text:'Entrá al almacén y comprá algo para tu día.',kind:'shop',target:null,reward:180},
{id:'mate',title:'Tiempo de mate',text:'Usá yerba para compartir un momento cotidiano.',kind:'item',target:'yerba',reward:220},
{id:'archivo',title:'La fotografía perdida',text:'Visitá la escuela y encontrá una fotografía.',kind:'school',target:null,reward:300},
{id:'chacra',title:'Ritmo de chacra',text:'Completá una tarea rural con una herramienta.',kind:'rural',target:null,reward:450},
{id:'radio',title:'La voz del pueblo',text:'Visitá la radio y conocé su rutina.',kind:'radio',target:null,reward:350},
{id:'descanso',title:'Cerrar el día',text:'Volvé a casa y descansá.',kind:'home',target:null,reward:250}
];
function load(){try{const x=JSON.parse(localStorage.getItem(KEY)||'null');if(x){R.missionIndex=Number(x.missionIndex)||0;R.completed=Array.isArray(x.completed)?x.completed:[];R.events=Array.isArray(x.events)?x.events:[];R.flags=x.flags||{};R.lastDay=Number(x.lastDay)||S.day}}catch(_){}}
function save(){localStorage.setItem(KEY,JSON.stringify({version:'V44',missionIndex:R.missionIndex,completed:R.completed.slice(-50),events:R.events.slice(-80),flags:R.flags,lastDay:R.lastDay}))}
function current(){return missionBook[Math.min(R.missionIndex,missionBook.length-1)]}
function toast(t){let e=document.getElementById('v44Toast');if(!e){e=document.createElement('div');e.id='v44Toast';document.body.appendChild(e)}e.textContent=t;e.classList.add('show');clearTimeout(e._t);e._t=setTimeout(()=>e.classList.remove('show'),2600)}
function complete(id,why){if(R.completed.includes(id))return;const m=missionBook.find(x=>x.id===id);if(!m)return;R.completed.push(id);R.missionIndex=Math.min(R.missionIndex+1,missionBook.length-1);S.money=(S.money||0)+m.reward;R.events.push({day:S.day,minutes:S.minutes,type:'mission',id,why,reward:m.reward});save();if(V.saveGame)V.saveGame();toast('MISIÓN COMPLETADA · +$'+m.reward);render()}
function eventForDay(){const weather=V.life&&V.life.weather||'despejado';const options={despejado:{title:'Mañana tranquila',text:'El movimiento del pueblo se mantiene activo.'},nublado:{title:'Cielo cubierto',text:'Algunas actividades rurales empiezan más despacio.'},viento:{title:'Día de viento',text:'La gente busca refugio y la radio gana protagonismo.'},lluvia:{title:'Día de lluvia',text:'El trabajo exterior se reduce y los espacios comunitarios cobran vida.'}};const e=options[weather]||options.despejado;if(R.lastDay!==S.day){R.lastDay=S.day;R.events.push({day:S.day,minutes:S.minutes,type:'daily',weather,title:e.title});R.flags.daily=e.title;save();toast('EVENTO DEL DÍA · '+e.title)}}
function match(kind,target){const m=current();if(!m||m.kind!==kind)return;if(target&&m.target&&m.target!==target)return;complete(m.id,kind)}
function installHooks(){
 const oldOpen=V.openDialogue;V.openDialogue=function(s,lines){if(oldOpen)oldOpen.apply(this,arguments);const text=String(s+' '+(lines||[]).join(' ')).toLowerCase();if(text.includes('almacén'))match('shop');else if(text.includes('archivo escolar')||text.includes('escuela'))match('school');else if(text.includes('radio oasis'))match('radio');else if(text.includes('changa rural')||text.includes('galpón'))match('rural');else if(text.includes('casa'))match('home');else if(text.includes('marta')||text.includes('raúl')||text.includes('lucía')||text.includes('pedro')||text.includes('nico'))match('npc')};
 const oldAdd=V.addItem;V.addItem=function(item){if(oldAdd)oldAdd.apply(this,arguments);const label=String(item).toLowerCase();if(label.includes('yerba'))match('item','yerba');if(label.includes('fotografía'))match('school')};
}
function ensureUI(){if(document.getElementById('v44Mission'))return;const p=document.createElement('div');p.id='v44Mission';p.innerHTML='<b id="v44Title">MISIÓN ACTIVA</b><span id="v44Text"></span><small id="v44Event"></small>';document.getElementById('game').appendChild(p);render();}
function render(){const m=current();const t=document.getElementById('v44Title'),x=document.getElementById('v44Text'),e=document.getElementById('v44Event');if(!t)return;t.textContent='MISIÓN · '+(m?m.title:'MUNDO ABIERTO');x.textContent=m?m.text:'Seguí explorando Villa Pelón.';e.textContent=R.flags.daily?'EVENTO · '+R.flags.daily:''}
function dayTick(){eventForDay();render();}
load();installHooks();ensureUI();setInterval(dayTick,1200);
V.worldProgression={...R,current,complete,events:R.events,history:R.events,missionBook};
})();