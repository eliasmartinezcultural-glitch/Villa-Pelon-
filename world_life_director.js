/* Villa Pelón V36 — Director de vida comunitaria
   Capa de integración: reutiliza el motor existente, no crea RAF ni duplica movimiento.
   Convierte hora/clima/zonas/NPCs en actividad contextual y eventos legibles. */
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const KEY='villa_pelon_world_director_v36';
const D=V.worldLifeDirector={version:'V36',events:[],lastSlot:'',lastWeather:'',community:72};
const $=id=>document.getElementById(id);
const text=id=>($(id)?.textContent||'').trim();
const hour=()=>Number((text('clock')||'08:00').slice(0,2))||0;
const minute=()=>Number((text('clock')||'08:00').slice(3,5))||0;
const day=()=>Number(text('day'))||1;
const weather=()=>text('weather').toLowerCase();
function load(){try{const s=JSON.parse(localStorage.getItem(KEY)||'null');if(s)Object.assign(D,s)}catch(_){}D.events=Array.isArray(D.events)?D.events:[]}
function save(){try{localStorage.setItem(KEY,JSON.stringify({version:D.version,events:D.events.slice(-100),community:D.community,lastSlot:D.lastSlot,lastWeather:D.lastWeather}))}catch(_){} }
function log(type,label){D.events.push({day:day(),time:text('clock'),type,label});D.events=D.events.slice(-100);save()}
load();
const schedules=[
 {from:6,to:8,name:'AMANECER',desc:'Primeros recorridos, casas que despiertan y tareas tempranas.'},
 {from:8,to:11,name:'MAÑANA',desc:'Almacén, escuela, plaza y calles toman movimiento.'},
 {from:11,to:13,name:'MEDIODÍA',desc:'La plaza concentra encuentros y el pueblo se cruza.'},
 {from:13,to:15,name:'PAUSA',desc:'Almuerzo, descanso y menor circulación.'},
 {from:15,to:18,name:'TARDE RURAL',desc:'Chacras, galpón y caminos de producción ganan actividad.'},
 {from:18,to:21,name:'ATERRIZAR',desc:'Radio, plaza y regreso a casa conectan la jornada.'},
 {from:21,to:24,name:'NOCHE',desc:'Menos tránsito. Más vida doméstica y luces encendidas.'},
 {from:0,to:6,name:'MADRUGADA',desc:'El pueblo descansa; sólo quedan movimientos puntuales.'}
];
function schedule(){const h=hour();return schedules.find(s=>h>=s.from&&h<s.to)||schedules[0]}
function weatherModifier(){if(weather().includes('lluv'))return 'La lluvia reduce las tareas exteriores y vuelve más importantes los espacios cubiertos.';if(weather().includes('viento'))return 'El viento cambia el ritmo de calles, árboles y tareas rurales.';if(weather().includes('nubl'))return 'El cielo cubierto suaviza la actividad y anticipa cambios de jornada.';return 'El tiempo acompaña una jornada normal.'}
function current(){const s=schedule();return s.name+' · '+s.desc+' '+weatherModifier()}
function toast(msg){let e=$('v36Toast');if(!e){e=document.createElement('div');e.id='v36Toast';e.className='v36-toast';document.body.appendChild(e)}e.textContent=msg;e.classList.add('show');clearTimeout(e._t);e._t=setTimeout(()=>e.classList.remove('show'),4200)}
function slot(){return day()+'|'+schedule().name}
function pulse(){
 const s=schedule(),w=weather(),key=slot();
 D.community=(s.name==='PAUSA'||s.name==='NOCHE'||s.name==='MADRUGADA')?55:84;
 if(w.includes('lluv'))D.community-=15; if(w.includes('viento'))D.community-=7;
 if(key!==D.lastSlot||w!==D.lastWeather){D.lastSlot=key;D.lastWeather=w;log('world',s.name+': '+s.desc);toast('Villa Pelón · '+s.name+' — '+s.desc)}
 const p=$('v36Phase'),a=$('v36Activity'),c=$('v36Community');if(p)p.textContent=s.name+' · '+text('clock');if(a)a.textContent=w?weatherModifier():'Jornada normal.';if(c)c.textContent='Actividad comunitaria: '+D.community+'%';
}
// Agenda semántica: describe qué lugares deberían estar vivos sin mover NPCs artificialmente.
const agenda=[
 {from:6,to:10,places:['VIVIENDAS','ALMACÉN','ESCUELA'],label:'Inicio de jornada'},
 {from:10,to:13,places:['PLAZA','ALMACÉN','ESCUELA'],label:'Movimiento central'},
 {from:13,to:15,places:['VIVIENDAS','ALMACÉN'],label:'Almuerzo y pausa'},
 {from:15,to:18,places:['GALPÓN','BODEGA','CHACRAS'],label:'Trabajo rural'},
 {from:18,to:21,places:['RADIO','PLAZA','VIVIENDAS'],label:'Encuentro y regreso'},
 {from:21,to:24,places:['VIVIENDAS','RADIO'],label:'Vida nocturna tranquila'},
 {from:0,to:6,places:['VIVIENDAS'],label:'Descanso'}
];
function currentAgenda(){const h=hour();return agenda.find(a=>h>=a.from&&h<a.to)||agenda[0]}
function buildContext(){
 let e=$('v36Agenda');if(!e){e=document.createElement('div');e.id='v36Agenda';e.className='v36-agenda';document.body.appendChild(e)}
 const a=currentAgenda();e.innerHTML='<b>AGENDA DEL PUEBLO</b><span>'+a.label+'</span><small>'+a.places.join(' · ')+'</small>';
}
// Acción contextual: usa la interacción E existente, nunca implementa otra lógica de interacción.
function triggerExistingInteraction(){window.dispatchEvent(new KeyboardEvent('keydown',{key:'e',bubbles:true}))}
function buildAction(){
 let e=$('v36Action');if(!e){e=document.createElement('button');e.id='v36Action';e.className='v36-action';e.type='button';e.textContent='E · INTERACTUAR';e.addEventListener('click',triggerExistingInteraction);document.body.appendChild(e)}
}
function nearbyHint(){
 const h=$('v36Hint');if(!h)return;
 // El motor ya decide el objeto cercano; el director sólo orienta según el horario.
 const a=currentAgenda();h.textContent=a.label+' · '+a.places[0];
}
const css=document.createElement('style');css.textContent='.v36-agenda{position:fixed;right:12px;top:76px;z-index:22;display:flex;flex-direction:column;gap:3px;max-width:210px;padding:9px 11px;border-radius:9px;background:rgba(24,28,23,.86);border:1px solid rgba(221,197,139,.3);color:#eee1c2;font:10px monospace;pointer-events:none}.v36-agenda b{color:#e7c982;font-size:11px}.v36-agenda small{opacity:.65;line-height:1.35}.v36-action{position:fixed;right:12px;bottom:78px;z-index:25;border:1px solid rgba(231,201,130,.5);border-radius:9px;background:rgba(43,39,30,.92);color:#f4e5c4;padding:9px 12px;font:11px monospace;box-shadow:0 4px 16px #0005}.v36-action:active{transform:translateY(1px)}.v36-toast{position:fixed;top:145px;left:50%;z-index:40;transform:translate(-50%,-8px);max-width:78vw;padding:10px 14px;border-radius:9px;background:rgba(35,31,25,.96);border:1px solid rgba(224,195,125,.65);color:#f4e6c7;font:11px monospace;text-align:center;opacity:0;transition:.25s;pointer-events:none}.v36-toast.show{opacity:1;transform:translate(-50%,0)}';document.head.appendChild(css);
const info=document.createElement('div');info.id='v36Hint';info.style.cssText='position:fixed;left:12px;top:76px;z-index:21;color:#eadfbe;font:10px monospace;opacity:.7;pointer-events:none';document.body.appendChild(info);
buildContext();buildAction();pulse();nearbyHint();setInterval(()=>{pulse();buildContext();nearbyHint()},1200);
V.worldLifeDirector.currentSchedule=schedule;V.worldLifeDirector.currentAgenda=currentAgenda;V.worldLifeDirector.trigger=triggerExistingInteraction;
})();