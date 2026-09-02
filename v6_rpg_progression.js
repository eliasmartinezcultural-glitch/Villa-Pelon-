/* Villa Pelón V6.36 — RPG PROGRESSION AUTHORITY
   Integra la jugabilidad existente en un único flujo de progreso.
   No crea RAF ni intervalos. Observa el update del motor y centraliza:
   misión activa -> experiencia -> descubrimiento -> recompensa -> desbloqueo -> persistencia.
   Los hechos históricos proceden de V.history; no se inventan datos documentales.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const P=V.rpgProgression=V.rpgProgression||{version:1,authority:true,ready:false};
const KEY='villa_pelon_rpg_progression';
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const state=()=>V.state||(V.state={});
const missions=[
 {id:'arrival_neighbor',title:'Conocé a alguien',objective:'Hablá con un vecino del pueblo.',reward:150,next:'first_errand'},
 {id:'first_errand',title:'El primer mandado',objective:'Comprá pan en el almacén.',reward:250,next:'bread_delivery'},
 {id:'bread_delivery',title:'Lleváselo a Raúl',objective:'Entregale el pan a Raúl.',reward:300,next:'plaza_life'},
 {id:'plaza_life',title:'La vida de la plaza',objective:'Visitá la plaza y conversá con un vecino.',reward:180,next:'rural_job'},
 {id:'rural_job',title:'Una changa rural',objective:'Realizá una tarea en la zona rural.',reward:650,next:'water_memory'},
 {id:'water_memory',title:'Una memoria del lugar',objective:'Descubrí una memoria histórica.',reward:350,next:'radio_voice'},
 {id:'radio_voice',title:'La voz del pueblo',objective:'Visitá la radio y hablá con Nico.',reward:450,next:'free_world'},
 {id:'free_world',title:'Ahora elegís vos',objective:'El pueblo queda abierto: explorá, trabajá, comprá, conversá y descubrí.',reward:1000,next:null}
];
const byId=id=>missions.find(m=>m.id===id)||missions[0];
function ensure(){const s=state();s.flags=s.flags||{};s.relationships=s.relationships||{};s.history=Array.isArray(s.history)?s.history:[];s.inventory=Array.isArray(s.inventory)?s.inventory:[];s.money=Number.isFinite(s.money)?s.money:10000;s.rpg= s.rpg&&typeof s.rpg==='object'?s.rpg:{};s.rpg.quest=typeof s.rpg.quest==='string'?s.rpg.quest:(Number.isFinite(s.mission)?missions[clamp(s.mission,0,missions.length-1)].id:'arrival_neighbor');s.rpg.completed=Array.isArray(s.rpg.completed)?s.rpg.completed:[];s.rpg.discoveries=Array.isArray(s.rpg.discoveries)?s.rpg.discoveries:[];s.rpg.unlocked=Array.isArray(s.rpg.unlocked)?s.rpg.unlocked:[];return s}
function current(){return byId(ensure().rpg.quest)}
function completed(id){return ensure().rpg.completed.includes(id)}
function toast(text){const d=document.createElement('div');d.textContent=text;d.style.cssText='position:fixed;z-index:3000;left:50%;bottom:22px;transform:translateX(-50%);padding:11px 15px;background:rgba(28,24,18,.96);border:1px solid #c7a45d;border-radius:8px;color:#f0dfb0;font:700 12px system-ui;box-shadow:0 12px 35px #000';document.body.appendChild(d);setTimeout(()=>d.remove(),2600)}
function persist(){const s=ensure();try{localStorage.setItem(KEY,JSON.stringify({rpg:s.rpg,history:s.history,money:s.money,inventory:s.inventory,relationships:s.relationships,flags:s.flags,version:1}))}catch(_){};if(typeof V.engine?.save==='function'){try{V.engine.save()}catch(_){}}else if(typeof V.v4Playability?.save==='function'){try{V.v4Playability.save()}catch(_){} } }
function syncLegacy(){const s=ensure(),i=missions.findIndex(m=>m.id===s.rpg.quest);if(i>=0)s.mission=i;if(V.v4Playability?.refreshMission)try{V.v4Playability.refreshMission()}catch(_){} }
function save(){persist();syncLegacy()}
function load(){const s=ensure();try{const d=JSON.parse(localStorage.getItem(KEY)||'null');if(d&&typeof d==='object'){if(d.rpg&&typeof d.rpg==='object')s.rpg=d.rpg;if(Array.isArray(d.history))s.history=d.history;if(Number.isFinite(d.money))s.money=d.money;if(Array.isArray(d.inventory))s.inventory=d.inventory;if(d.relationships&&typeof d.relationships==='object')s.relationships=d.relationships;if(d.flags&&typeof d.flags==='object')s.flags=d.flags}}catch(_){}ensure();syncLegacy();return s}
function complete(id,reason){const s=ensure(),m=byId(id);if(current().id!==id||completed(id))return false;s.rpg.completed.push(id);s.rpg.unlocked=s.rpg.unlocked||[];if(m.next&&!s.rpg.unlocked.includes(m.next))s.rpg.unlocked.push(m.next);s.money+=m.reward;if(m.next)s.rpg.quest=m.next;persist();syncLegacy();toast('MISIÓN COMPLETADA · '+m.title+' · +$'+m.reward);P.lastCompletion={id,reason||'objective',at:Date.now()};return true}
function near(x,y,d=145){const s=ensure();return Math.hypot(s.x-x,s.y-y)<=d}
function hasItem(name){return ensure().inventory.some(x=>String(x).toLowerCase().includes(String(name).toLowerCase()))}
function historyAdded(){const s=ensure();return s.history.length>0||s.rpg.discoveries.length>0}
function discover(id){const s=ensure();if(s.rpg.discoveries.includes(id))return false;const h=(V.history||[]).find(x=>x.id===id);if(!h)return false;s.rpg.discoveries.push(id);if(!s.history.includes(id))s.history.push(id);persist();toast('DESCUBRIMIENTO · '+h.title);return true}
function objective(s){const q=current().id;
 if(q==='arrival_neighbor') return Object.keys(s.relationships||{}).length>0 || !!s.flags.dialogue_started || !!s.flags.spoke_to_npc;
 if(q==='first_errand') return hasItem('pan');
 if(q==='bread_delivery') return !!s.flags.bread_delivered || (near(2030,930,115)&&hasItem('pan')&&!!s.flags.raul_interaction);
 if(q==='plaza_life') return !!s.flags.plaza_visit || (near(900,820,260)&&!!s.flags.plaza_interaction);
 if(q==='rural_job') return !!s.flags.harvest_completed || !!s.flags.rural_task_completed || Number(s.rpg.ruralTasks||0)>0;
 if(q==='water_memory') return s.rpg.discoveries.includes('riego') || s.history.includes('riego');
 if(q==='radio_voice') return !!s.flags.radio_visit || (near(1330,1540,125)&&!!s.flags.nico_interaction);
 return false;
}
function observeInteractions(){const e=V.engine;if(!e||typeof e.interact!=='function'||e.__rpgProgressionHook)return false;const original=e.interact;e.interact=function(){const s=ensure(),n=typeof e.nearest==='function'?e.nearest():null;const id=n?.id||null;const type=n?.type||null;const before=s.history.length;const r=original.apply(this,arguments);if(id&&V.npcs?.some(x=>x.id===id)){s.relationships[id]=Number(s.relationships[id]||0)+1;s.flags.dialogue_started=true;s.flags.spoke_to_npc=true;if(id==='raul'&&hasItem('pan'))s.flags.bread_delivered=true;if(id==='nico')s.flags.nico_interaction=true;}
 if(type==='job')s.flags.rural_task_completed=true;
 if(type==='history'||(id&&V.history?.some?.(h=>h.id===id))){discover(id)}
 if(n?.type==='shop'&&hasItem('pan'))s.flags.shop_interaction=true;
 if(Math.hypot(s.x-900,s.y-820)<260)s.flags.plaza_interaction=true;
 if(Math.hypot(s.x-1330,s.y-1540)<125)s.flags.radio_visit=true;
 const q=current().id;if(objective(s))complete(q,'interaction');
 if(s.history.length!==before)persist();return r};e.__rpgProgressionHook=true;return true}
function observeState(){const s=ensure();if(objective(s))complete(current().id,'state');if(current().id==='water_memory'&&near(2700,1320,170)){if(discover('riego'))complete('water_memory','historical_discovery')}if(current().id==='radio_voice'&&near(1330,1540,125)&&s.flags.nico_interaction)complete('radio_voice','radio');if(current().id==='first_errand'&&hasItem('pan'))complete('first_errand','inventory');if(current().id==='bread_delivery'&&s.flags.bread_delivered)complete('bread_delivery','delivery');}
function ui(){const s=ensure(),m=current();const q=document.getElementById('questTitle'),t=document.getElementById('questText');if(q)q.textContent=m.id==='free_world'?'MUNDO ABIERTO':'MISIÓN · '+m.title;if(t)t.textContent=m.objective;let p=document.getElementById('rpgProgress');if(!p){p=document.createElement('div');p.id='rpgProgress';p.style.cssText='position:absolute;left:15px;top:132px;z-index:85;padding:6px 9px;background:rgba(28,24,18,.72);border:1px solid rgba(199,164,93,.45);border-radius:6px;color:#dfd1b6;font:600 10px system-ui;pointer-events:none';document.getElementById('game')?.appendChild(p)}p.textContent='HISTORIA · '+(s.rpg.completed.length>=missions.length-1?'MUNDO ABIERTO':(missions.findIndex(x=>x.id===m.id)+1)+' / '+missions.length)}
function hook(){if(P.hooked)return true;load();if(!observeInteractions()){setTimeout(hook,120);return false}const e=V.engine;if(typeof e.update==='function'&&!e.__rpgProgressionUpdate){const original=e.update;e.update=function(dt){const r=original.apply(this,arguments);if(V.state?.started){observeState();ui()}return r};e.__rpgProgressionUpdate=true}P.hooked=true;P.ready=true;return true}
hook();
V.rpgProgression.api={missions,current,complete,discover,save,load};
})();
