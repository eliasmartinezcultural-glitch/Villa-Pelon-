/* Villa Pelón V70 — estado de mundo único y puente de eventos.
   Mantiene zona, hora, actividad e interacción sin reemplazar sistemas existentes.
*/
(()=>{'use strict';const V=window.VillaPelon||(window.VillaPelon={});
const S=V.worldState70={version:'V70',zone:'transition',previousZone:null,time:8,weather:'despejado',near:null,events:[],flags:{}};
function read(){const g=V.gameState||{};S.time=Number.isFinite(g.time)?g.time:(Number.isFinite(g.hour)?g.hour:8);S.weather=(typeof g.weather==='string'?g.weather:'despejado');if(Number.isFinite(g.x)&&Number.isFinite(g.y)&&V.territory)S.zone=V.territory.zoneAt(g.x,g.y)}
function emit(type,data){const e={type,time:S.time,zone:S.zone,data:data||{},at:Date.now()};S.events.push(e);if(S.events.length>40)S.events.shift();window.dispatchEvent(new CustomEvent('villa-pelon-world-event',{detail:e}))}
function tick(){const old=S.zone;read();if(old!==S.zone){S.previousZone=old;emit('zone-change',{from:old,to:S.zone});}if(V.interactions69)S.near=V.interactions69.near||null}
V.worldEvent=emit;V.worldState=S;setInterval(tick,350);tick();
})();