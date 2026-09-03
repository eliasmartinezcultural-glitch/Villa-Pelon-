/* VILLA PELÓN V55 — runtime limpio: una autoridad de estado, mundo y entrada. */
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={}),state=V.gameState,life=V.life;
if(!state)return;
V.runtime=V.runtime||{};
V.runtime.version='V55';V.runtime.platforms=['pc','mobile'];V.runtime.worldBounds={w:3200,h:2000};
V.runtime.rules={singlePlayerState:true,singleLifeUpdate:true,roadsAreNavigation:true,housesStayOffRoads:true,noActorInsideBuilding:true};
if(life){life.places=life.places||{};Object.assign(life.places,{casa:life.places.casa||[785,500],plaza:life.places.plaza||[1160,400],radio:life.places.radio||[1200,1190],chacra:life.places.chacra||[2140,1000],almacen:life.places.almacen||[1750,610]})}
/* Entrada cinematográfica: el botón no arranca dos motores ni duplica handlers. */
const start=document.getElementById('start'),game=document.getElementById('game'),btn=document.getElementById('startBtn');
if(start&&game&&btn&&!V.runtime.__intro){V.runtime.__intro=true;const card=start.querySelector('.title-card');const eyebrow=card&&card.querySelector('.eyebrow'),title=card&&card.querySelector('h1'),copy=card&&card.querySelector('p'),small=card&&card.querySelector('small');btn.onclick=()=>{if(btn.dataset.busy==='1')return;btn.dataset.busy='1';btn.disabled=true;if(card)card.classList.add('cinematic');if(eyebrow)eyebrow.textContent='UN PUEBLO. MIL HISTORIAS.';if(title)title.textContent='VILLA PELÓN';if(copy)copy.textContent='Amanece. Las calles despiertan y el pueblo empieza a moverse.';if(small)small.textContent='CAMINÁ · CONOCÉ · TRABAJÁ · INVESTIGÁ';setTimeout(()=>{if(copy)copy.textContent='Una casa abre sus ventanas. El almacén prepara el día. En las chacras ya hay trabajo.'},1200);setTimeout(()=>{if(copy)copy.textContent='Tu historia empieza ahora. El pueblo seguirá vivo aunque no estés mirando.'},2500);setTimeout(()=>{state.started=true;start.classList.add('hidden');game.classList.remove('hidden');if(typeof V.loadGame==='function')V.loadGame();else{try{const s=JSON.parse(localStorage.getItem('villa_pelon_save'));if(s)Object.assign(state,s)}catch(_){}state.dialogue=false}if(typeof V.saveGame==='function'){}},3900)}}
/* Si otro sistema expone un inicio antiguo, queda reemplazado por esta entrada única. */
V.runtime.ready=true;
window.dispatchEvent(new CustomEvent('villa-pelon-runtime-ready',{detail:{version:'V55',platforms:['pc','mobile']}}));
})();
