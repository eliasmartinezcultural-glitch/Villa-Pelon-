/* Villa Pelón V35 — capa integral de mundo vivo.
   No crea un segundo RAF ni reemplaza el motor. Lee la UI pública del motor,
   coordina sistemas sociales/económicos/ambientales y añade contenido contextual. */
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const KEY='villa_pelon_living_v35';
const S=V.livingWorld={version:'V35',events:[],last:{},weatherMood:'',community:0};
function read(id, fallback=''){const e=document.getElementById(id);return e?e.textContent:fallback}
function clock(){return read('clock','08:00')}
function day(){return Number(read('day','1'))||1}
function money(){return Number(read('money','0').replace(/\D/g,''))||0}
function weather(){return read('weather','Despejado').toLowerCase()}
function log(type,label){S.events.push({day:day(),time:clock(),type,label});S.events=S.events.slice(-80);try{localStorage.setItem(KEY,JSON.stringify(S))}catch(_){} }
function load(){try{const x=JSON.parse(localStorage.getItem(KEY)||'null');if(x)Object.assign(S,x)}catch(_){} }
load();
// Ritmo comunitario: deriva de la hora real del mundo y no inventa una segunda autoridad temporal.
function phase(){const h=Number(clock().slice(0,2))||0;if(h<7)return 'madrugada';if(h<10)return 'mañana';if(h<13)return 'media mañana';if(h<15)return 'mediodía';if(h<18)return 'tarde';if(h<21)return 'atardecer';return 'noche'}
function activity(){const p=phase();const w=weather();
 if(w.includes('lluv'))return 'La lluvia cambia el ritmo: vecinos buscan reparo y el trabajo exterior se reduce.';
 if(w.includes('viento'))return 'El viento recorre el pueblo: se mueven árboles, carteles y tareas rurales.';
 return ({madrugada:'El pueblo duerme y las primeras luces aparecen en algunas casas.',mañana:'Empiezan los recorridos: almacén, escuela, plaza y trabajos tempranos.', 'media mañana':'La zona central gana movimiento y aparecen cruces entre vecinos.','mediodía':'La actividad baja por el almuerzo y el descanso.','tarde':'Se concentra el trabajo rural y el tránsito entre pueblo y chacras.','atardecer':'La radio y los espacios comunitarios toman protagonismo.','noche':'La vida se vuelve doméstica: casas iluminadas y menos tránsito.'})[p]||''}
let lastPhase='';setInterval(()=>{const p=phase(),w=weather();if(p!==lastPhase||w!==S.weatherMood){lastPhase=p;S.weatherMood=w;S.community=Math.max(0,Math.min(100,(p==='mediodía'||p==='noche')?55:82));log('rhythm',activity());toast(activity())}},3000);
function toast(t){let b=document.getElementById('v35Toast');if(!b){b=document.createElement('div');b.id='v35Toast';b.className='v35-toast';document.body.appendChild(b)}b.textContent=t;b.classList.add('show');clearTimeout(b._timer);b._timer=setTimeout(()=>b.classList.remove('show'),3600)}
// Registro de cambios de economía: complementa V34 sin modificar el dinero del motor.
let lastMoney=money();setInterval(()=>{const m=money();if(m!==lastMoney){log('economy',m<lastMoney?'Se realizó una compra o gasto.':'Se recibió un ingreso.');lastMoney=m}},1200);
// Contexto territorial visible: señales y agenda según zona/actividad.
const zones=[
 {x:1140,y:300,w:340,h:270,name:'CENTRO',hint:'Encuentros, plaza y servicios'},
 {x:1500,y:300,w:500,h:300,name:'COMERCIO',hint:'Almacén y movimiento vecinal'},
 {x:2050,y:300,w:500,h:600,name:'RURAL',hint:'Herramientas, galpón y salida a chacras'},
 {x:2300,y:1050,w:720,h:620,name:'CHACRAS',hint:'Producción y paisaje rural'},
 {x:980,y:1080,w:450,h:300,name:'RADIO',hint:'Voces, noticias y memoria'}
];
S.zones=zones;
// Director de interfaz: panel contextual, inventario resumido y actividad comunitaria.
const css=document.createElement('style');css.textContent='.v35-context{position:fixed;right:12px;bottom:12px;z-index:20;background:rgba(27,31,25,.9);color:#f2e6c8;border:1px solid rgba(220,196,139,.35);border-radius:10px;padding:9px 12px;font:11px monospace;max-width:230px;pointer-events:none;box-shadow:0 4px 18px #0005}.v35-context b{color:#e7c982}.v35-toast{position:fixed;top:112px;left:50%;transform:translate(-50%,-8px);z-index:31;opacity:0;transition:.25s;background:rgba(37,32,25,.94);color:#f3e5c4;border:1px solid #c9ad70;padding:9px 14px;border-radius:9px;font:11px monospace;max-width:78vw;text-align:center;pointer-events:none}.v35-toast.show{opacity:1;transform:translate(-50%,0)}';document.head.appendChild(css);
const box=document.createElement('div');box.className='v35-context';box.innerHTML='<b>VIDA DEL PUEBLO</b><br><span id="v35Phase">—</span><br><span id="v35Activity">—</span><br><small id="v35Community">Comunidad: —</small>';document.body.appendChild(box);
function updateUI(){const p=document.getElementById('v35Phase'),a=document.getElementById('v35Activity'),c=document.getElementById('v35Community');if(p)p.textContent=phase()+' · '+clock();if(a)a.textContent=activity();if(c)c.textContent='Comunidad: '+S.community+'% · Día '+day()}
setInterval(updateUI,1000);updateUI();
// Añade un registro de interacción a V34 cuando el diálogo cambia, sin secuestrar el motor.
const dlg=document.getElementById('dialogue');if(dlg){let sig='';new MutationObserver(()=>{if(dlg.classList.contains('hidden'))return;const s=read('speaker'),t=read('dialogueText');const n=s+'|'+t;if(n!==sig){sig=n;log('social',s||'Conversación')}}).observe(dlg,{attributes:true,subtree:true,childList:true,characterData:true})}
// Exposición segura para futuras capas: solo lectura, sin crear un estado paralelo del jugador.
V.worldSystems={phase,activity,weather,money,day,clock,log};
})();