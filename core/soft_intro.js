/* VILLA PELÓN V158 — PRÓLOGO INTERACTIVO
   El jugador no solo lee: toca, descubre y decide qué mirar primero.
   No modifica geometría ni campaña.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={}),UI=V.ui=V.ui||{};UI.intro=UI.intro||{active:false};
const P={es:[
['UN PUEBLO PARA MIRAR DE CERCA','Antes de empezar, elegí qué querés mirar. La plaza, el campo, el río o el camino hacia Picada 21. Cada lugar te cuenta algo distinto.'],
['LA PLAZA','Es el corazón del núcleo urbano. Acercate, escuchá y prestá atención: una historia local también puede estar en una conversación cotidiana.'],
['EL CAMPO','Al salir del centro, el paisaje cambia. Aparecen chacras, producción, animales, herramientas y personas que trabajan con el territorio.'],
['EL RÍO','Está lejos del pueblo. El agua forma parte del territorio y los puentes marcan los cruces. El paisaje también enseña.'],
['PICADA 21','Más allá del río aparece un territorio más abierto. No es un atajo: es un lugar para recorrer sin apuro y descubrir nuevas preguntas.'],
['AHORA TE TOCA A VOS','Villa Pelón no se conoce mirando desde afuera. Caminá, hablá, observá y relacioná lo que encontrás. La historia empieza cuando te movés.']],
en:[
['A VILLAGE TO LOOK AT CLOSELY','Before starting, choose what you want to notice: the plaza, countryside, river or road to Picada 21. Each place tells something different.'],
['THE PLAZA','It is the heart of the urban core. Listen and pay attention: local history can live inside an ordinary conversation.'],
['THE COUNTRYSIDE','Leaving the center changes the landscape. Farms, production, animals, tools and people working with the land appear.'],
['THE RIVER','It is far from the town. Water is part of the territory, and bridges mark the crossings. Landscape can teach too.'],
['PICADA 21','Beyond the river the territory opens up. It is not a shortcut: it is a place to walk slowly and discover new questions.'],
['NOW IT IS YOUR TURN','Villa Pelón is not learned by watching from outside. Walk, talk, observe and connect what you find. The story begins when you move.']]};
function boot(){const presentation=document.getElementById('start'),story=document.getElementById('storyIntro');if(!presentation||!story||story.dataset.v158)return;story.dataset.v158='1';
const title=story.querySelector('[data-intro-title]'),text=story.querySelector('[data-intro-text]'),nextBtn=story.querySelector('[data-intro-next]'),step=story.querySelector('#storyStep'),dots=[...story.querySelectorAll('.story-dot')];
let scene=story.querySelector('.story-scene');let tools=story.querySelector('.story-tools');
if(!tools){tools=document.createElement('div');tools.className='story-tools';tools.innerHTML='<button type="button" data-intro-back>ATRÁS</button><button type="button" data-intro-skip>SALTAR</button>';story.querySelector('.story-copy')?.appendChild(tools)}
const back=tools.querySelector('[data-intro-back]'),skip=tools.querySelector('[data-intro-skip]');
let lang='es',i=0,lock=false;
function paint(){const a=P[lang][i];if(title)title.textContent=a[0];if(text)text.textContent=a[1];if(step)step.textContent=String(i+1).padStart(2,'0')+' / 06';if(nextBtn)nextBtn.textContent=i===5?(lang==='en'?'START EXPLORING':'EMPEZAR A EXPLORAR'):(lang==='en'?'CONTINUE':'CONTINUAR');if(back)back.textContent=lang==='en'?'BACK':'ATRÁS';if(skip)skip.textContent=lang==='en'?'SKIP':'SALTAR';dots.forEach((d,n)=>d.classList.toggle('active',n===i));story.dataset.page=String(i+1);story.dataset.scene=['town','plaza','rural','river','picada','player'][i]||'town';scene?.classList.remove('scene-town-focus','scene-rural-focus','scene-river-focus','scene-picada-focus');scene?.classList.add(i===1?'scene-town-focus':i===2?'scene-rural-focus':i===3?'scene-river-focus':i===4?'scene-picada-focus':'');}
function open(){lang=document.documentElement.lang==='en'?'en':'es';i=0;UI.intro.active=true;presentation.classList.add('hidden');story.classList.remove('hidden');story.setAttribute('aria-hidden','false');if(V.gameState){V.gameState.intro=true;V.gameState.introSeen=false}paint()}
function finish(){UI.intro.active=false;story.classList.add('hidden');story.setAttribute('aria-hidden','true');if(V.gameState){V.gameState.intro=false;V.gameState.introSeen=true}window.dispatchEvent(new CustomEvent('villa-pelon-intro-finished'))}
function advance(){if(lock||!UI.intro.active)return;lock=true;if(i<5){i++;paint()}else finish();setTimeout(()=>lock=false,140)}function previous(){if(lock||!UI.intro.active)return;lock=true;if(i>0){i--;paint()}setTimeout(()=>lock=false,140)}
function handle(e){if(!UI.intro.active)return;const t=e.target.closest?.('[data-intro-next],[data-intro-back],[data-intro-skip],[data-intro-hotspot]');if(!t||!story.contains(t))return;e.preventDefault();e.stopPropagation();if(t===nextBtn)advance();else if(t===back)previous();else if(t===skip)finish();else{const n=Number(t.dataset.introHotspot);if(Number.isFinite(n)){i=Math.max(0,Math.min(5,n));paint()}}}
story.addEventListener('click',handle,true);story.addEventListener('pointerup',handle,true);
if(scene){const hot=document.createElement('div');hot.className='intro-hotspots';hot.innerHTML='<button data-intro-hotspot="1" class="hotspot plaza" aria-label="Plaza">PLAZA</button><button data-intro-hotspot="2" class="hotspot rural" aria-label="Campo">CAMPO</button><button data-intro-hotspot="3" class="hotspot river" aria-label="Río">RÍO</button><button data-intro-hotspot="4" class="hotspot picada" aria-label="Picada 21">PICADA 21</button>';scene.appendChild(hot)}
document.addEventListener('keydown',e=>{if(!UI.intro.active)return;if(e.key==='Enter'||e.key===' '||e.key==='ArrowRight'){e.preventDefault();e.stopPropagation();advance()}else if(e.key==='ArrowLeft'){e.preventDefault();e.stopPropagation();previous()}else if(e.key==='Escape'){e.preventDefault();e.stopPropagation();finish()}},true);
document.getElementById('presentationStart')?.addEventListener('click',open,true);window.addEventListener('villa-pelon-open-intro',open);presentation.classList.remove('hidden');
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,120));else setTimeout(boot,120);
})();