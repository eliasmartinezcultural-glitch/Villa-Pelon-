/* Villa Pelón V68 — rutinas contextuales de ciudadanos.
   Este módulo pertenece a LIFE: no crea loops ni mueve al jugador.
   Convierte horario + rol + clima en actividad legible y destino.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const life=V.life;if(!life)return;
const ROUTINES={
  comercio:[
    {from:0,to:8,activity:'hogar',destination:'casa'},
    {from:8,to:9,activity:'camino al almacén',destination:'almacen'},
    {from:9,to:13,activity:'atendiendo el almacén',destination:'almacen'},
    {from:13,to:15,activity:'almuerzo',destination:'casa'},
    {from:15,to:20,activity:'atendiendo el almacén',destination:'almacen'},
    {from:20,to:24,activity:'hogar',destination:'casa'}
  ],
  chacra:[
    {from:0,to:6,activity:'hogar',destination:'casa'},
    {from:6,to:7,activity:'preparando la jornada',destination:'casa'},
    {from:7,to:12,activity:'trabajando en la chacra',destination:'chacra'},
    {from:12,to:14,activity:'almuerzo',destination:'chacra'},
    {from:14,to:18,activity:'trabajando en la chacra',destination:'chacra'},
    {from:18,to:20,activity:'regresando',destination:'casa'},
    {from:20,to:24,activity:'hogar',destination:'casa'}
  ],
  rural:[
    {from:0,to:7,activity:'hogar',destination:'casa'},
    {from:7,to:12,activity:'tareas rurales',destination:'chacra'},
    {from:12,to:14,activity:'almuerzo',destination:'chacra'},
    {from:14,to:18,activity:'tareas rurales',destination:'chacra'},
    {from:18,to:21,activity:'regresando',destination:'casa'},
    {from:21,to:24,activity:'hogar',destination:'casa'}
  ],
  escuela:[
    {from:0,to:7,activity:'hogar',destination:'casa'},
    {from:7,to:8,activity:'camino a la escuela',destination:'escuela'},
    {from:8,to:13,activity:'en la escuela',destination:'escuela'},
    {from:13,to:16,activity:'regreso y almuerzo',destination:'casa'},
    {from:16,to:19,activity:'plaza y barrio',destination:'plaza'},
    {from:19,to:24,activity:'hogar',destination:'casa'}
  ],
  radio:[
    {from:0,to:8,activity:'hogar',destination:'casa'},
    {from:8,to:10,activity:'camino a la radio',destination:'radio'},
    {from:10,to:13,activity:'en la radio',destination:'radio'},
    {from:13,to:15,activity:'almuerzo',destination:'casa'},
    {from:15,to:18,activity:'en la radio',destination:'radio'},
    {from:18,to:21,activity:'plaza y barrio',destination:'plaza'},
    {from:21,to:24,activity:'hogar',destination:'casa'}
  ],
  plaza:[
    {from:0,to:10,activity:'hogar',destination:'casa'},
    {from:10,to:13,activity:'recorriendo el barrio',destination:'plaza'},
    {from:13,to:15,activity:'almuerzo',destination:'casa'},
    {from:15,to:19,activity:'en la plaza',destination:'plaza'},
    {from:19,to:21,activity:'regresando',destination:'casa'},
    {from:21,to:24,activity:'hogar',destination:'casa'}
  ],
  servicios:[
    {from:0,to:8,activity:'hogar',destination:'casa'},
    {from:8,to:12,activity:'haciendo mantenimiento',destination:'galpon'},
    {from:12,to:14,activity:'almuerzo',destination:'casa'},
    {from:14,to:17,activity:'haciendo mantenimiento',destination:'galpon'},
    {from:17,to:20,activity:'recorriendo el pueblo',destination:'plaza'},
    {from:20,to:24,activity:'hogar',destination:'casa'}
  ]
};
const PLACE={casa:[760,450],plaza:[1160,390],escuela:[530,565],almacen:[1750,610],radio:[1200,1190],chacra:[2160,1000],galpon:[2300,470]};
function hourSlot(role,h){const list=ROUTINES[role]||ROUTINES.plaza;return list.find(s=>h>=s.from&&h<s.to)||list[list.length-1]}
function apply(p,h){
  const slot=hourSlot(p.role,h);
  let destination=slot.destination;
  let activity=slot.activity;
  if(life.weather==='lluvia' && (destination==='plaza'||destination==='chacra')){
    destination='galpon';
    activity='resguardándose y reorganizando la jornada';
  }
  const target=PLACE[destination]||p.work||p.home||PLACE.plaza;
  p.routineActivity=activity;
  p.destination=destination;
  p.target=[target[0],target[1]];
  p.sheltered=life.weather==='lluvia' && ['escuela','galpon','radio','almacen','casa'].includes(destination);
  return p;
}
const originalUpdate=life.update;
life.update=function(dt,minutes){
  const result=originalUpdate.call(life,dt,minutes);
  const h=((minutes||480)/60)%24;
  if(Array.isArray(life.ambient)) life.ambient.forEach(p=>apply(p,h));
  life.routineClock=h;
  return result;
};
life.routinesV68=ROUTINES;
life.getRoutine=(name,h)=>{const p=Array.isArray(life.ambient)?life.ambient.find(x=>x.name===name):null;return p?apply(p,h):null};
life.__v68Routines=true;
})();
