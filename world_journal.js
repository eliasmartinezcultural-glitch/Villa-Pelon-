/* Villa Pelón V36 — Diario del mundo
   Contenido sistémico: transforma lo que ya ocurre en memoria jugable.
   No mueve al jugador, no crea RAF y no reemplaza interacciones existentes. */
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const J=V.worldJournal={version:'V36',open:false};
const $=id=>document.getElementById(id);
const txt=id=>($(id)?.textContent||'').trim();
const hour=()=>Number(txt('clock').slice(0,2))||0;
const weather=()=>txt('weather').toLowerCase();
const ambient={
 morning:['Se levantan persianas en el centro.','Alguien cruza el pueblo con una bolsa del almacén.','Las primeras tareas empiezan alrededor de las casas.'],
 noon:['La plaza reúne conversaciones breves.','El ritmo baja cerca del mediodía.','El pueblo se cruza camino al almuerzo.'],
 rural:['Se escuchan herramientas desde el sector rural.','Un vehículo sale hacia las chacras.','La tarde concentra trabajo y movimiento de producción.'],
 evening:['La radio vuelve a ocupar un lugar central.','Vecinos regresan hacia sus casas.','La luz cambia y el pueblo empieza a tranquilizarse.'],
 night:['Quedan pocas personas en las calles.','Las casas iluminadas marcan la vida doméstica.','La noche deja el centro más silencioso.']
};
function phase(){const h=hour();if(h<7)return'night';if(h<12)return'morning';if(h<15)return'noon';if(h<18)return'rural';if(h<21)return'evening';return'night'}
function eventText(){const list=ambient[phase()];const index=(Math.floor(Date.now()/30000)+hour())%list.length;let s=list[index];if(weather().includes('lluv'))s+=' La lluvia modifica la rutina exterior.';if(weather().includes('viento'))s+=' El viento hace más visible el movimiento del paisaje.';return s}
function build(){
 if($('v36Journal'))return;
 const shade=document.createElement('div');shade.id='v36Journal';shade.className='v36-journal hidden';shade.innerHTML='<div class="v36-journal-card"><header><b>DIARIO DE VILLA PELÓN</b><button id="v36Close">×</button></header><div class="v36-story" id="v36Story"></div><section><b>ACTIVIDAD RECIENTE</b><div id="v36Events"></div></section><section><b>VÍNCULOS</b><div id="v36Relations"></div></section><small>Las historias ficticias del juego se mantienen separadas de la investigación histórica documentada.</small></div>';
 document.body.appendChild(shade);$('v36Close').onclick=close;shade.addEventListener('click',e=>{if(e.target===shade)close()});
 const button=document.createElement('button');button.id='v36JournalBtn';button.className='v36-journal-btn';button.textContent='J · DIARIO';button.onclick=toggle;document.body.appendChild(button);
}
function render(){
 const story=$('v36Story'),events=$('v36Events'),rels=$('v36Relations');if(!story)return;
 story.textContent=eventText();
 const r=V.rpgWorld||{};const ev=(r.events||[]).slice(-8).reverse();events.innerHTML=ev.length?ev.map(e=>'<div><span>día '+(e.day||1)+' · '+(e.time||'')+'</span> '+(e.label||e.title||e.type||'actividad')+'</div>').join(''):'<div class="muted">Todavía no hay registros.</div>';
 const rs=r.relationships||{};const names=Object.keys(rs);rels.innerHTML=names.length?names.map(n=>{const v=rs[n]||0;const level=v>=8?'cercano':v>=4?'conocido':'primeros encuentros';return '<div><b>'+n+'</b> · '+level+' · '+v+' encuentros</div>'}).join(''):'<div class="muted">Conocé personas para construir vínculos.</div>';
}
function open(){J.open=true;build();$('v36Journal').classList.remove('hidden');render()}
function close(){J.open=false;const e=$('v36Journal');if(e)e.classList.add('hidden')}
function toggle(){J.open?close():open()}
build();
addEventListener('keydown',e=>{if(e.key.toLowerCase()==='j'&&!e.repeat){e.preventDefault();toggle()}if(e.key==='Escape'&&J.open)close()});
setInterval(()=>{if(J.open)render()},2000);
const css=document.createElement('style');css.textContent='.v36-journal.hidden{display:none}.v36-journal{position:fixed;inset:0;z-index:80;background:rgba(15,17,14,.74);display:flex;align-items:center;justify-content:center;padding:18px;font:11px monospace;color:#efe2c3}.v36-journal-card{width:min(620px,94vw);max-height:82vh;overflow:auto;background:#28271f;border:1px solid rgba(226,198,131,.55);border-radius:12px;box-shadow:0 12px 50px #0009;padding:14px}.v36-journal-card header{display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #ffffff18;padding-bottom:9px;margin-bottom:10px}.v36-journal-card header b{color:#e7c982;font-size:13px}.v36-journal-card header button{background:none;border:0;color:#eadfbe;font-size:22px}.v36-story{padding:10px;border-radius:8px;background:#ffffff08;line-height:1.5;margin-bottom:12px}.v36-journal-card section{margin-top:12px}.v36-journal-card section>b{display:block;color:#d6b96f;margin-bottom:5px}.v36-journal-card section div div{padding:5px 0;border-bottom:1px solid #ffffff0b}.v36-journal-card span{opacity:.55}.v36-journal-card small{display:block;opacity:.5;line-height:1.45;margin-top:14px}.v36-journal-btn{position:fixed;right:12px;bottom:44px;z-index:26;border:1px solid rgba(231,201,130,.4);border-radius:8px;background:rgba(43,39,30,.86);color:#f4e5c4;padding:7px 10px;font:10px monospace}.v36-journal-btn:active{transform:translateY(1px)}';document.head.appendChild(css);
})();