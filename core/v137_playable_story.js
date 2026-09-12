/* VILLA PELÓN V137 — HISTORIA JUGABLE INTEGRADA
   Una sola campaña continua: acción → aprendizaje → consecuencia → siguiente capítulo.
   No crea, mueve ni modifica geometría. Consume las autoridades existentes.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={}),S=V.gameState||(V.gameState={}),M=V.missions||{},W=V.worldStory||(V.worldStory={});
const P=V.playableStory=V.playableStory||{};
P.version='137.0';
P.principle='cada misión cambia lo que el jugador comprende, no el mapa';
P.chapterOrder=['PUEBLO','MEMORIA','IDENTIDAD','COMUNIDAD','EDUCACIÓN','TERRITORIO','PRODUCCIÓN','INVESTIGACIÓN','HISTORIA','TRABAJO','CARTOGRAFÍA','EXPLORACIÓN'];
P.consequences={
 welcome:{flag:'conoce_pueblo',message:'Ya reconocés la plaza y empezás a leer Villa Pelón como un lugar vivido.'},
 memory_01:{flag:'aprende_fuentes',message:'Aprendiste que una memoria también debe conservarse y contrastarse.'},
 name_01:{flag:'comprende_toponimia',message:'El nombre del lugar pasa a formar parte de tu cuaderno.'},
 community_01:{flag:'escucha_comunidad',message:'Ahora tenés más de una voz para comparar.'},
 school_01:{flag:'escuela_memoria',message:'La escuela queda incorporada a tu mapa de memoria comunitaria.'},
 water_01:{flag:'comprende_riego',message:'Entendiste cómo el agua organiza una parte del territorio productivo.'},
 production_01:{flag:'comprende_produccion',message:'Relacionaste producción, trabajo y territorio.'},
 pelon_01:{flag:'memoria_pelon',message:'La Fiesta del Pelón queda registrada como tema de investigación.'},
 oral_01:{flag:'distingue_oral_documental',message:'Aprendiste a distinguir relato oral y documento sin despreciar ninguno.'},
 archive_01:{flag:'metodo_fuentes',message:'Ya podés armar una ficha básica de fuente.'},
 dni_01:{flag:'conoce_picada21',message:'Llegaste a Picada 21 y la incorporaste como parte real del recorrido.'},
 picada21_memory:{flag:'memoria_picada21',message:'Una nueva voz de Picada 21 amplía tu lectura del territorio.'},
 founding_01:{flag:'comprende_cronologia',message:'Ahora sabés que una fecha histórica debe poder verificarse.'},
 irrigation_02:{flag:'riego_cronologia',message:'Relacionaste agua, fechas y transformación territorial.'},
 school_02:{flag:'escuela_fuente',message:'La escuela también funciona como archivo de memoria.'},
 worker_01:{flag:'trabajo_rural',message:'El trabajo rural entra en tu lectura de la identidad local.'},
 map_01:{flag:'lee_territorio',message:'Caminos, agua y lugares de memoria forman una red.'},
 bridges_01:{flag:'comprende_puentes',message:'Entendiste que el río condiciona el recorrido y los puentes lo hacen posible.'},
 research_01:{flag:'contrasta_fuentes',message:'Aprendiste a responder una pregunta usando más de un tipo de fuente.'},
 history_01:{flag:'metodo_investigacion',message:'Completaste tu primer ciclo de investigación sobre Villa Pelón.'},
 free_explore:{flag:'ciclo_inicial_completo',message:'El primer ciclo terminó. La exploración queda abierta para nuevas historias.'}
};
function ensure(){S.storyState=S.storyState&&typeof S.storyState==='object'?S.storyState:{};const s=S.storyState;s.flags=s.flags&&typeof s.flags==='object'?s.flags:{};s.journal=Array.isArray(s.journal)?s.journal:[];s.completed=Array.isArray(s.completed)?s.completed:[];s.chapter=s.chapter||'PUEBLO';s.currentMission=s.currentMission||S.missionId||'welcome';s.learningCount=Object.keys(S.knowledge||s.knowledge||{}).length;return s}
function mission(){return M.current?M.current(S):null}
function chapterIndex(id){const i=P.chapterOrder.indexOf(id);return i<0?0:i}
function setChapter(m){const s=ensure();if(m?.chapter)s.chapter=m.chapter;s.currentMission=m?.id||S.missionId||'welcome';s.learningCount=Object.keys(S.knowledge||{}).length;return s}
function applyConsequence(id,m){const s=ensure(),c=P.consequences[id];if(!c)return;if(!s.flags[c.flag]){s.flags[c.flag]={day:+S.day||1,chapter:m?.chapter||s.chapter,mission:id};s.journal.push({mission:id,chapter:m?.chapter||s.chapter,title:m?.title||id,message:c.message,day:+S.day||1});if(s.journal.length>100)s.journal.shift();window.dispatchEvent(new CustomEvent('villa-pelon-story-consequence',{detail:{mission:id,chapter:m?.chapter,message:c.message,flag:c.flag}}))}}
function sync(){const s=ensure(),m=mission();setChapter(m);s.completed=(S.missionHistory||[]).map(x=>x.id);s.learningCount=Object.keys(S.knowledge||{}).length;return s}
const oldComplete=M.completeStep;
if(typeof oldComplete==='function'&&!M.__v137StoryWrapped){M.completeStep=function(state,key){const before=mission(),r=oldComplete(state,key);if(r&&r.complete){applyConsequence(before?.id,before);sync();render();}else sync();return r};M.__v137StoryWrapped=true}
function tryAction(d){if(!d)return;const m=mission(),o=M.objective?M.objective(S):null;if(!m||!o)return;const action=d.action||d.type||d.verb,target=d.target||d.id||d.targetId;if(!action||!target)return;const normalized=String(action).toLowerCase();const wanted=String(o.type).toLowerCase();if(target===o.target&&(normalized===wanted||normalized==='interact'||normalized==='use')){M.completeStep?.(S,wanted+':'+o.target)}}
function css(){if(document.getElementById('v137StoryStyle'))return;const st=document.createElement('style');st.id='v137StoryStyle';st.textContent='.v137-story{position:fixed;right:12px;top:70px;z-index:50;width:min(340px,calc(100vw - 24px));background:rgba(25,28,27,.94);color:#eadfc9;border:1px solid rgba(198,169,111,.55);box-shadow:0 8px 28px rgba(0,0,0,.35);font:12px/1.35 system-ui,sans-serif;border-radius:8px;overflow:hidden}.v137-story button{background:none;color:inherit;border:0;cursor:pointer}.v137-story-head{display:flex;align-items:center;justify-content:space-between;padding:8px 10px;background:rgba(198,169,111,.12)}.v137-story-title{font-weight:800;letter-spacing:.08em;font-size:11px}.v137-story-body{padding:10px}.v137-story-chapter{font-size:18px;font-weight:800;margin-bottom:3px}.v137-story-mission{font-weight:700;margin-bottom:5px}.v137-story-objective{opacity:.82}.v137-story-meta{display:flex;gap:8px;margin-top:8px;font-size:10px;opacity:.68}.v137-journal{margin-top:9px;padding-top:8px;border-top:1px solid rgba(255,255,255,.12);max-height:120px;overflow:auto}.v137-entry{padding:4px 0}.v137-entry b{display:block;font-size:10px}.v137-entry span{opacity:.75}.v137-toast{position:fixed;left:50%;bottom:88px;transform:translateX(-50%);z-index:80;max-width:min(430px,90vw);padding:9px 13px;background:#242826;color:#f0e6d2;border:1px solid rgba(198,169,111,.65);border-radius:7px;box-shadow:0 6px 20px rgba(0,0,0,.3);font:12px/1.35 system-ui,sans-serif;opacity:0;pointer-events:none;transition:opacity .18s}.v137-toast.show{opacity:1}';document.head.appendChild(st)}
function render(){if(!document.body)return;css();let el=document.getElementById('v137Story');if(!el){el=document.createElement('aside');el.id='v137Story';el.className='v137-story';el.setAttribute('aria-label','Cuaderno de Villa Pelón');document.body.appendChild(el)}const s=sync(),m=mission(),o=M.objective?M.objective(S):null,done=(S.missionHistory||[]).length;const entries=s.journal.slice(-4).reverse().map(e=>'<div class="v137-entry"><b>'+esc(e.chapter)+' · '+esc(e.title)+'</b><span>'+esc(e.message)+'</span></div>').join('');el.innerHTML='<div class="v137-story-head"><span class="v137-story-title">CUADERNO DE VILLA PELÓN</span><button id="v137StoryClose" aria-label="Ocultar">×</button></div><div class="v137-story-body"><div class="v137-story-chapter">'+esc(s.chapter)+'</div><div class="v137-story-mission">'+esc(m?.title||'Exploración libre')+'</div><div class="v137-story-objective">'+esc(o?.label||m?.description||'Recorré el pueblo y descubrí nuevas historias.')+'</div><div class="v137-story-meta"><span>Misiones: '+done+'</span><span>Aprendizajes: '+s.learningCount+'</span></div>'+(entries?'<div class="v137-journal">'+entries+'</div>':'')+'</div>';document.getElementById('v137StoryClose').onclick=()=>{el.style.display='none';const b=document.createElement('button');b.id='v137StoryOpen';b.textContent='📖';b.title='Abrir cuaderno';b.style='position:fixed;right:12px;top:70px;z-index:51;width:38px;height:34px;border-radius:7px;border:1px solid #8d7957;background:#242826;color:#eadfc9';document.body.appendChild(b);b.onclick=()=>{el.style.display='';b.remove()}}}
function esc(x){return String(x??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]))}
function toast(text){let t=document.getElementById('v137Toast');if(!t){t=document.createElement('div');t.id='v137Toast';t.className='v137-toast';document.body.appendChild(t)}t.textContent=text;t.classList.add('show');clearTimeout(P._toast);P._toast=setTimeout(()=>t.classList.remove('show'),3600)}
function audit(){const ids=(M.list||[]).map(x=>x.id),set=new Set(ids),issues=[];if(new Set(ids).size!==ids.length)issues.push('duplicate-mission-id');(M.list||[]).forEach(m=>{if(m.next&&!set.has(m.next))issues.push('invalid-next:'+m.id+'>'+m.next);(m.objectives||[]).forEach(o=>{if(!o.id||!o.type||!o.target)issues.push('invalid-objective:'+m.id)})});Object.keys(P.consequences).forEach(id=>{if(!set.has(id))issues.push('orphan-consequence:'+id)});if(V.worldLock?.version!=='V124'&&!V.geometryFloorLock)issues.push('geometry-lock-missing');if(V.villageLife?.singleTick!==true)issues.push('life-authority');if(V.renderCompositor?.singleRAF!==true)issues.push('visual-loop');return{ok:issues.length===0,issues,missions:ids.length,consequences:Object.keys(P.consequences).length,geometry:V.worldLock?.version||V.geometryFloorLock?.version||'unknown'} }
P.audit=audit();P.current=()=>sync();P.complete=applyConsequence;P.open=()=>{render();document.getElementById('v137StoryOpen')?.click()};
window.addEventListener('villa-pelon-action',e=>{tryAction(e.detail);sync();render()});
window.addEventListener('villa-pelon-mission',()=>{sync();render()});
window.addEventListener('villa-pelon-story-consequence',e=>{if(e.detail?.message)toast(e.detail.message);render()});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',render);else render();
sync();window.dispatchEvent(new CustomEvent('villa-pelon-playable-story-ready',{detail:P.audit}));
})();
