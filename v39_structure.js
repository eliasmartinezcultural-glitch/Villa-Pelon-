/* Villa Pelón V39 — capa estructural: contratos, interacción contextual, persistencia y diagnóstico.
   No crea motor paralelo ni RAF. Se monta sobre las APIs públicas del motor V38. */
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const VERSION='V39';
const runtime=V.runtime={version:VERSION,startedAt:Date.now(),errors:[],events:[],health:'ok'};

function emit(type,payload={}){const e={type,time:Date.now(),...payload};runtime.events.push(e);if(runtime.events.length>80)runtime.events.shift();(runtime.listeners[type]||[]).forEach(fn=>{try{fn(e)}catch(err){runtime.errors.push(String(err))}});return e}
function on(type,fn){(runtime.listeners||(runtime.listeners={}))[type]=(runtime.listeners[type]||[]).concat(fn);return()=>{runtime.listeners[type]=(runtime.listeners[type]||[]).filter(x=>x!==fn)}}
runtime.emit=emit;runtime.on=on;

/* Registro único de puntos interactivos: evita que la UI y el RPG tengan que conocer coordenadas sueltas. */
const plaza={id:'plaza-central',kind:'plaza',name:'Plaza Central',x:1165,y:610,radius:105,label:'VISITAR LA PLAZA'};
const registry={plaza,version:VERSION};
V.interactionRegistry=registry;

const baseNearby=V.getNearby;
const baseInteract=V.interact;
function distTo(o,s){return Math.hypot(s.x-o.x,s.y-o.y)}
function nearby(){
 const s=V.gameState||window.__villaPelonState;if(!s)return baseNearby?baseNearby():null;
 const base=baseNearby?baseNearby():null;
 const d=distTo(plaza,s);
 if(d<=plaza.radius && !base)return plaza;
 return base;
}
V.getNearby=nearby;

/* La plaza pasa a ser una interacción real y dispara la misión RPG existente. */
V.interact=function(){
 const s=V.gameState||window.__villaPelonState;
 if(s&&!s.dialogue&&distTo(plaza,s)<=plaza.radius){
   if(V.openDialogue)V.openDialogue('PLAZA CENTRAL',['La plaza es el punto de encuentro de Villa Pelón.','Observás vecinos, recorridos y pequeñas actividades que cambian durante el día.']);
   emit('interaction',{id:plaza.id,kind:plaza.kind});
   return true;
 }
 return baseInteract?baseInteract():false;
};

/* Persistencia: conserva el guardado V38 pero añade versión y normaliza el estado sin romper partidas. */
const baseSave=V.saveGame;
if(baseSave&&!baseSave.__v39){
 const save=function(){
   const result=baseSave();
   try{
     const raw=localStorage.getItem('villa_pelon_save');
     if(raw){const s=JSON.parse(raw);s.schemaVersion=VERSION;s.inventory=Array.isArray(s.inventory)?s.inventory:[];localStorage.setItem('villa_pelon_save',JSON.stringify(s));}
   }catch(err){runtime.errors.push('save:'+err)}
   emit('save',{schemaVersion:VERSION});
   return result;
 };
 save.__v39=true;V.saveGame=save;
}

/* Contrato mínimo del motor: si falla, queda registrado para no ocultar problemas estructurales. */
const required=['gameState','saveGame','interact','getNearby','worldGeometry'];
const missing=required.filter(k=>!V[k]);
if(missing.length){runtime.health='degraded';runtime.errors.push('APIs faltantes: '+missing.join(', '));}
else emit('runtime-ready',{version:VERSION,apis:required.length});

/* Telemetría ligera, útil para detectar estados imposibles sin tocar el loop principal. */
let lastDay=null,lastMoney=null;
setInterval(()=>{
 const s=V.gameState||window.__villaPelonState;if(!s)return;
 if(!Number.isFinite(s.x)||!Number.isFinite(s.y)||!Number.isFinite(s.energy)||!Number.isFinite(s.money)){
   runtime.health='degraded';runtime.errors.push('estado numérico inválido');
 }
 s.energy=Math.max(0,Math.min(100,Number(s.energy)||0));s.money=Math.max(0,Number(s.money)||0);
 if(lastDay!==null&&s.day!==lastDay)emit('day-change',{day:s.day});
 if(lastMoney!==null&&s.money!==lastMoney)emit('economy-change',{money:s.money});
 lastDay=s.day;lastMoney=s.money;
},1000);

V.runtimeHealth=()=>({version:VERSION,health:runtime.health,errors:runtime.errors.slice(-10),events:runtime.events.length});
})();
