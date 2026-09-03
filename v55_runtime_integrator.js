/* VILLA PELÓN V56 — entrada narrativa única y arranque del motor existente. */
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={}),state=V.gameState,life=V.life;
if(!state)return;
V.runtime=V.runtime||{};
V.runtime.version='V56';V.runtime.platforms=['pc','mobile'];V.runtime.worldBounds={w:3200,h:2000};
V.runtime.rules={singlePlayerState:true,singleLifeUpdate:true,roadsAreNavigation:true,housesStayOffRoads:true,noActorInsideBuilding:true,introNarrativeOnly:true,singleVisualAuthority:'game.js'};
if(life){life.places=life.places||{};Object.assign(life.places,{casa:life.places.casa||[785,500],plaza:life.places.plaza||[1160,400],radio:life.places.radio||[1200,1190],chacra:life.places.chacra||[2140,1000],almacen:life.places.almacen||[1750,610]})}
const start=document.getElementById('start'),game=document.getElementById('game'),copy=document.getElementById('introText');
if(start&&game&&!V.runtime.__intro){
 V.runtime.__intro=true;
 const card=start.querySelector('.title-card');
 const story=[
  'En un pequeño pueblo, cada calle guarda una historia. Cada casa conserva una memoria. Cada persona forma parte de una vida que continúa día tras día.',
  'Las mañanas comienzan despacio. Se abren las puertas, el trabajo empieza y las voces se encuentran en las calles, en la plaza, en la escuela y en las chacras.',
  'El pueblo no es solamente un lugar. Es la suma de sus recuerdos, sus vínculos y las pequeñas decisiones de quienes lo habitan.',
  'Y ahora, una nueva historia está a punto de comenzar.'
 ];
 let i=0;
 const show=()=>{if(copy)copy.textContent=story[i]};
 show();if(card)card.classList.add('cinematic');
 const next=()=>{i++;if(i<story.length){show();setTimeout(next,3300);return}start.classList.add('hidden');game.classList.remove('hidden');if(typeof V.loadGame==='function')V.loadGame();state.started=true;if(typeof V.showVersion==='function')V.showVersion()};
 setTimeout(next,3800);
}
V.runtime.ready=true;
window.dispatchEvent(new CustomEvent('villa-pelon-runtime-ready',{detail:{version:'V56',platforms:['pc','mobile']}}));
})();
