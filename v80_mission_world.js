/* Villa Pelón V80 — misiones vivas.
   Convierte acciones reales del jugador en progreso persistente.
   No reemplaza mission_runtime: lo conecta con el mundo.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const M={version:'V80.1',recent:null,initialized:false};
const aliases={
 'escuela':'escuela','school':'escuela','radio':'radio','almacen':'almacen','shop':'almacen','galpon':'galpon','bodega':'bodega','chacra':'las_chacras','plaza':'plaza','rio':'rio','canal_viejo':'canal_viejo','las_chacras':'las_chacras','los_vinedos':'los_vinedos'
};
function rt(){return V.missionRuntime||V.missions}
function init(){const r=rt();if(!r||typeof r.init!=='function')return false;if(!r.initialized){let saved=null;try{saved=JSON.parse(localStorage.getItem('villa_pelon_missions_v80')||'null')}catch(_){}r.init(saved||undefined)}M.initialized=true;return true}
function current(){init();const r=rt();return r?.current?.()||null}
function norm(v){return aliases[String(v||'').toLowerCase()]||String(v||'').toLowerCase()}
function mark(step){init();const r=rt();if(!r?.mark)return false;const ok=r.mark(step);if(ok){M.recent={step,mission:r.current?.()?.id||null,at:Date.now()};persist();render();if(V.worldEvent)V.worldEvent('mission-progress',{step,mission:M.recent.mission})}return ok}
function visit(place){const p=norm(place);const c=current();if(!c)return false;const candidates=[`visitar:${p}`,`visitar:${place}`];return candidates.some(mark)}
function talk(name){const n=String(name||'').toLowerCase();const c=current();if(!c)return false;const step=`hablar:${n}`;return (c.steps||[]).includes(step)?mark(step):mark(step)}
function object(id){const raw=String(id||'').toLowerCase();const map={archivo:'buscar:archivo_escuela',foto:'encontrar:foto_escolar',foto_escolar:'encontrar:foto_escolar',herramientas:'tomar_herramienta',cajones:'entregar:cajon',cosecha:'hacer:cosecha',pan:'observar:pan',acequia:'observar:acequia',compuerta:'observar:compuerta',bodega_la_ribera:'observar:bodega_la_ribera',mapa:'observar:mapa'};const step=map[raw];return step?mark(step):false}
function persist(){const r=rt();if(!r?.snapshot)return;try{localStorage.setItem('villa_pelon_missions_v80',JSON.stringify(r.snapshot()))}catch(_){} }
function rewardOnComplete(){const r=rt();if(!r)return;const id=r.active;const completed=r.completed||[];const key='villa_pelon_rewarded_v80';let done=[];try{done=JSON.parse(localStorage.getItem(key)||'[]')}catch(_){};completed.forEach(mid=>{if(done.includes(mid))return;const m=r.mission?.(mid);if(!m?.reward)return;const g=V.gameState;if(g&&Number.isFinite(m.reward.money))g.money+=m.reward.money;if(m.reward.item&&typeof V.addItem==='function')V.addItem(m.reward.item);done.push(mid);if(V.worldEvent)V.worldEvent('mission-reward',{mission:mid,reward:m.reward})});try{localStorage.setItem(key,JSON.stringify(done))}catch(_){};render()}
function onEvent(e){const d=e.detail||{};switch(e.detail?.type){case'spatial-enter':case'building-enter':visit(d.room||d.building);break;case'spatial-exit':break;case'interior-object':object(d.object);break;case'npc-nearby':break;case'object-inspect':object(d.object);break}rewardOnComplete();persist()}
function wrapDialogue(){if(V.__v80DialogueWrapped||typeof V.openDialogue!=='function')return;V.__v80DialogueWrapped=true;const original=V.openDialogue;V.openDialogue=function(speaker,lines){const result=original.apply(this,arguments);if(String(speaker||'').trim())talk(String(speaker).toLowerCase());rewardOnComplete();persist();return result}}
function render(){const el=document.getElementById('questText'),m=current();if(!el||!m)return;const r=rt(),steps=r?.steps?.[m.id]||[];const total=m.steps?.length||0;el.textContent=`${m.title} · ${steps.length}/${total}`}
function install(){if(V.__v80Installed)return;V.__v80Installed=true;V.missionWorld80=M;init();window.addEventListener('villa-pelon-world-event',onEvent);wrapDialogue();render();setInterval(()=>{wrapDialogue();rewardOnComplete();render()},600)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else install();
})();
