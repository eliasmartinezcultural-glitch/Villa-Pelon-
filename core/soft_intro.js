/* VILLA PELÓN V140 — PRÓLOGO ROBUSTO
   El prólogo es independiente del sistema de diálogo y de la jugabilidad.
   No modifica geometría, mapa ni estado estructural del mundo.
*/
(()=>{'use strict';
 const V=window.VillaPelon||(window.VillaPelon={});
 const UI=V.ui=V.ui||{}; UI.intro=UI.intro||{active:false};
 const P={es:[
  ['UN PUEBLO PARA MIRAR DE CERCA','Villa Pelón es un lugar pequeño, de esos donde una calle, una conversación o una tarea sencilla pueden guardar una historia.'],
  ['LA VIDA COTIDIANA TAMBIÉN CUENTA','La historia aparece en la escuela, los vecinos, los comercios, los caminos, el trabajo y los recuerdos que pasan de una persona a otra.'],
  ['EL PUEBLO TIENE UN CORAZÓN','El núcleo urbano concentra la vida cotidiana. Desde allí el territorio se abre hacia chacras, producción y caminos rurales.'],
  ['EL CAMPO EMPIEZA A ABRIRSE','Al salir del centro cambia el paisaje: aparecen producción, animales, caminos, trabajadores y lugares que forman parte de la vida local.'],
  ['EL RÍO Y LOS PUENTES','El río está lejos del núcleo urbano. No atraviesa las calles ni pasa bajo construcciones. Para cruzarlo existen puentes concretos.'],
  ['MÁS ALLÁ: PICADA 21','Todavía más lejos está Picada 21. No es un atajo: es territorio para recorrer, observar, conversar y descubrir memorias.']],
  en:[
  ['A VILLAGE TO LOOK AT CLOSELY','Villa Pelón is a small place where a street, a conversation or an ordinary task can hold a story.'],
  ['EVERYDAY LIFE MATTERS','History lives in schools, neighbors, shops, roads, work and memories passed from one person to another.'],
  ['THE VILLAGE HAS A HEART','The urban core holds everyday life. From there the territory opens into farms, production and rural roads.'],
  ['THE COUNTRYSIDE OPENS UP','Leaving the center changes the landscape: production, animals, roads, workers and local places appear.'],
  ['THE RIVER AND THE BRIDGES','The river is far from the urban core. It does not run under buildings. Specific bridges are the only crossings.'],
  ['BEYOND THE ROAD: PICADA 21','Farther away lies Picada 21. It is not a shortcut: it is territory to explore, observe, talk and remember.']]};
 function boot(){
  const presentation=document.getElementById('start'),story=document.getElementById('storyIntro');
  if(!presentation||!story||story.dataset.v140)return;
  story.dataset.v140='1';
  const title=story.querySelector('[data-intro-title]'),text=story.querySelector('[data-intro-text]'),nextBtn=story.querySelector('[data-intro-next]'),step=story.querySelector('#storyStep'),dots=[...story.querySelectorAll('.story-dot')];
  let tools=story.querySelector('.story-tools');
  if(!tools){tools=document.createElement('div');tools.className='story-tools';tools.innerHTML='<button type="button" data-intro-back>ATRÁS</button><button type="button" data-intro-skip>SALTAR CONTEXTO</button>';story.querySelector('.story-copy')?.appendChild(tools)}
  const back=tools.querySelector('[data-intro-back]'),skip=tools.querySelector('[data-intro-skip]');
  let lang=document.documentElement.lang==='en'?'en':'es',i=0,lock=false;
  const setLang=()=>{lang=document.documentElement.lang==='en'?'en':'es'};
  function paint(){const a=P[lang][i];if(title)title.textContent=a[0];if(text)text.textContent=a[1];if(step)step.textContent=String(i+1).padStart(2,'0')+' / 06';if(nextBtn)nextBtn.textContent=i===5?(lang==='en'?'START EXPLORING':'EMPEZAR A EXPLORAR'):(lang==='en'?'CONTINUE':'CONTINUAR');if(back)back.textContent=lang==='en'?'BACK':'ATRÁS';if(skip)skip.textContent=lang==='en'?'SKIP CONTEXT':'SALTAR CONTEXTO';dots.forEach((d,n)=>d.classList.toggle('active',n===i));story.dataset.page=String(i)}
  function open(){setLang();i=0;UI.intro.active=true;presentation.classList.add('hidden');story.classList.remove('hidden');story.setAttribute('aria-hidden','false');if(V.gameState){V.gameState.intro=true;V.gameState.introSeen=false}paint()}
  function finish(){UI.intro.active=false;story.classList.add('hidden');story.setAttribute('aria-hidden','true');if(V.gameState){V.gameState.intro=false;V.gameState.introSeen=true}window.dispatchEvent(new CustomEvent('villa-pelon-intro-finished'))}
  function advance(){if(lock||!UI.intro.active)return;lock=true;if(i<5){i++;paint()}else finish();setTimeout(()=>lock=false,120)}
  function previous(){if(lock||!UI.intro.active)return;lock=true;if(i>0){i--;paint()}setTimeout(()=>lock=false,120)}
  function handle(e){if(!UI.intro.active)return;const t=e.target.closest?.('[data-intro-next],[data-intro-back],[data-intro-skip]');if(!t||!story.contains(t))return;e.preventDefault();e.stopPropagation();if(t===nextBtn)advance();else if(t===back)previous();else finish()}
  story.addEventListener('click',handle,true);story.addEventListener('pointerup',handle,true);
  document.addEventListener('keydown',e=>{if(!UI.intro.active)return;if(e.key==='Enter'||e.key===' '||e.key==='ArrowRight'){e.preventDefault();e.stopPropagation();advance()}else if(e.key==='ArrowLeft'){e.preventDefault();e.stopPropagation();previous()}else if(e.key==='Escape'){e.preventDefault();e.stopPropagation();finish()}},true);
  document.getElementById('presentationStart')?.addEventListener('click',open,true);
  window.addEventListener('villa-pelon-open-intro',open);
  presentation.classList.remove('hidden');
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,150));else setTimeout(boot,150);
})();
