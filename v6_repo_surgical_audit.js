/* Villa Pelón V6.40 — AUDITORÍA QUIRÚRGICA DE ARRANQUE
   Reconciliación final de autoridades. No crea loop ni reemplaza el motor.
   Detecta y neutraliza puentes que intenten tomar movimiento/interacción.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});const A=V.repoAudit=V.repoAudit||{version:40,checks:{},repairs:[]};
function check(name,ok,detail){A.checks[name]={ok:!!ok,detail:detail||''};if(!ok)A.failures=(A.failures||[]).concat(name)}
function reconcile(){const e=V.engine;check('engine',!!e&&typeof e.update==='function'&&typeof e.render==='function','V6 engine update/render');check('canvas',!!document.getElementById('world'),'canvas #world');check('world',!!V.world&&V.world.w>=8000&&V.world.h>=5000,'8400x5600 world');check('input',!!V.input,'single input state');check('rpg',!!V.rpgProgression?.api,'RPG progression API');check('history',Array.isArray(V.history)&&typeof V.history.inspect==='function','history data + inspect view');check('streets',Array.isArray(V.streetSystem?.roads)&&V.streetSystem.roads.length>=8,'authoritative street graph');check('buildings',Array.isArray(V.buildings)&&V.buildings.length>=9,'building registry');check('population',!!V.population||!!V.life,'living-world population');
 if(e){e.authority='v6_game_core';e.movementAuthority='v6_game_core';e.renderAuthority='v6_game_core';e.inputAuthority='v6_game_core'}
 if(V.v4Playability&&e){V.v4Playability.interact=e.interact;V.v4Playability.save=e.save;V.v4Playability.load=e.load;V.v4Playability.refreshMission=V.v4Playability.refreshMission||(()=>{});A.repairs.push('V4 gameplay facade delegated to V6 engine')}
 const B=V.buildingSystem;if(B&&typeof B.nearest==='function'&&!B.__surgicalNearest){const old=B.nearest;B.nearest=function(max=110){const target=e?.nearest?.();if(target&&!target.w&&target!==V.storyJob){const s=V.state;if(s&&Math.hypot(s.x-target.x,s.y-target.y)<=Math.min(max,155))return null}return old.call(this,max)};B.__surgicalNearest=true;A.repairs.push('building capture no longer blocks NPC interaction')}
 A.ready=true;A.timestamp=Date.now();V.engineAudit=A;return A}
function boot(){try{reconcile()}catch(err){A.ready=false;A.error=String(err?.message||err);console.error('[Villa Pelón] surgical audit failed',err)}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
