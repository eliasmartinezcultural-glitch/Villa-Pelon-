/* VILLA PELÓN V99 — VIDA DEL PUEBLO
   Capa de gameplay sobre los sistemas existentes.
   No crea un segundo motor: observa gameState/NPC y produce situaciones
   contextuales, diarias y persistentes.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const S=V.gameState;
if(!S)return;
const LIFE=V.villageLife=V.villageLife||{};
LIFE.version='99.0';
LIFE.events=LIFE.events||{};
LIFE.history=Array.isArray(LIFE.history)?LIFE.history:[];
const dayKey=()=>String(Number(S.day)||1);
const once=(id)=>{const k=dayKey()+':'+id;if(LIFE.events[k])return false;LIFE.events[k]=true;return true};
const near=(x,y,r)=>Math.hypot((Number(S.x)||0)-x,(Number(S.y)||0)-y)<r;
const toast=(t)=>{const e=document.getElementById('missionToast');if(e){e.textContent=t;e.classList.add('show');clearTimeout(LIFE.toastTimer);LIFE.toastTimer=setTimeout(()=>e.classList.remove('show'),2200)}};
function showDialogue(speaker,lines){const d=document.getElementById('dialogue');if(!d)return;S.dialogue=true;d.classList.remove('hidden');d.dataset.lines=JSON.stringify(lines);d.dataset.i='0';const sp=document.getElementById('speaker'),tx=document.getElementById('dialogueText');if(sp)sp.textContent=speaker;if(tx)tx.textContent=lines[0]||''}
function remember(id,label){LIFE.history.push({day:Number(S.day)||1,id,label,time:Number(S.minutes)||0});if(LIFE.history.length>80)LIFE.history.shift();}
function event(id,label,lines){if(!once(id))return;remember(id,label);toast('VIDA DEL PUEBLO · '+label);setTimeout(()=>showDialogue(label,lines),350)}
function hour(){return ((Number(S.minutes)||0)/60)%24}
function tick(){
  const h=hour();
  if(h>=7.5&&h<8.5&&near(1160,390,220))event('morning_plaza','La plaza despierta',['PLAZA','Arranca otro día en Villa Pelón. Algunas personas van al trabajo, otras abren sus comercios.','Si volvés a distintos horarios, el pueblo debería sentirse diferente.']);
  if(h>=9&&h<11&&near(530,560,170))event('school_start','Entrada a la escuela',['ESCUELA','Las mañanas escolares cambian el ritmo de esta zona.','Más adelante este lugar podrá guardar fotografías, documentos y pequeñas historias.']);
  if(h>=10&&h<12&&near(1300,1230,190))event('radio_broadcast','Radio del pueblo',['RADIO','Hoy hablamos de lo que ocurre en el pueblo: trabajo, clima, caminos y memoria.','La radio puede convertirse en una fuente de rumores, pistas y noticias locales.']);
  if(h>=12&&h<15&&near(5200,980,260))event('irrigation_midday','Movimiento de riego',['RIEGO','El agua organiza buena parte del territorio productivo.','Observá acequias, chacras y caminos: el paisaje también cuenta cómo vive el pueblo.']);
  if(h>=15&&h<18&&near(5850,560,260))event('winery_afternoon','Actividad productiva',['BODEGAS','La producción no es decoración: genera recorridos, trabajos y conversaciones.','Esta zona tendrá progresivamente más actividades propias.']);
  if(h>=17&&h<19&&near(7550,2350,260))event('picada_bus','Llega el colectivo a Picada 21',['PARADA RURAL','El camino hasta Picada 21 conecta pequeñas historias con el núcleo del pueblo.','Próxima evolución: horarios reales, pasajeros y consecuencias de perder el colectivo.']);
  if(h>=20&&h<21&&near(1160,390,260))event('evening_plaza','La plaza cambia de ritmo',['PLAZA','El pueblo no desaparece cuando baja el sol: cambia de ritmo.','Los horarios serán parte importante de la exploración.']);
}
const oldSave=window.localStorage;
function persist(){try{oldSave.setItem('villa_pelon_life',JSON.stringify({version:LIFE.version,events:LIFE.events,history:LIFE.history}))}catch(_) {}}
try{const raw=oldSave.getItem('villa_pelon_life');if(raw){const x=JSON.parse(raw);if(x&&typeof x==='object'){LIFE.events=x.events||{};LIFE.history=Array.isArray(x.history)?x.history:[]}}}catch(_){}
setInterval(()=>{try{tick();persist()}catch(e){console.error('[VillaPelon][v99][life]',e)}},1000);
V.engine=V.engine||{};
V.engine.health=V.engine.health||function(){return{ok:true}};
V.engine.health.villageLife='99.0';
})();
