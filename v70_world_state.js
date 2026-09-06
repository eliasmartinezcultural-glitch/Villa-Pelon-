/* Villa Pelón V70 — estado de mundo único, sincronizado con el motor real. */
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const S=V.worldState70={version:'V70.1',zone:'transition',previousZone:null,time:8,minutes:480,day:1,weather:'despejado',near:null,events:[],flags:{}};
function read(){
 const g=V.gameState||{};
 if(Number.isFinite(g.minutes)){S.minutes=g.minutes;S.time=g.minutes/60}else if(Number.isFinite(g.time)){S.time=g.time;S.minutes=g.time*60}else if(Number.isFinite(g.hour)){S.time=g.hour;S.minutes=g.hour*60}
 S.day=Number.isFinite(g.day)?g.day:1;
 S.weather=typeof V.life?.weather==='string'?V.life.weather:(typeof g.weather==='string'?g.weather:'despejado');
 if(Number.isFinite(g.x)&&Number.isFinite(g.y))S.zone=V.territory?.zoneAt?V.territory.zoneAt(g.x,g.y):(V.interactionZone?V.interactionZone(g.x,g.y):S.zone);
}
function emit(type,data){const e={type,time:S.time,minutes:S.minutes,day:S.day,zone:S.zone,data:data||{},at:Date.now()};S.events.push(e);if(S.events.length>40)S.events.shift();window.dispatchEvent(new CustomEvent('villa-pelon-world-event',{detail:e}))}
function tick(){const old=S.zone;read();if(old!==S.zone){S.previousZone=old;emit('zone-change',{from:old,to:S.zone})}if(V.interactions69)S.near=V.interactions69.near||null}
V.worldEvent=emit;V.worldState=S;setInterval(tick,500);tick();
})();
