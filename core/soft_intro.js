/* VILLA PELÓN V139 — INTRO INTERACTIVA DE CONTEXTO
   Contexto narrativo antes de explorar. No modifica geometría ni crea mundo.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
function start(){
 const presentation=document.getElementById('start'),story=document.getElementById('storyIntro');
 if(!presentation||!story||story.dataset.v139)return;story.dataset.v139='1';
 const pages={es:[
 ['UN PUEBLO PARA MIRAR DE CERCA','Villa Pelón es un lugar pequeño, de esos donde una calle, una conversación o una tarea sencilla pueden guardar una historia.'],
 ['LA VIDA COTIDIANA TAMBIÉN CUENTA','La historia aparece en la escuela, los vecinos, los comercios, los caminos, el trabajo y los recuerdos que pasan de una persona a otra.'],
 ['EL PUEBLO TIENE UN CORAZÓN','El núcleo urbano concentra la vida cotidiana. Desde allí el territorio se abre hacia chacras, producción y caminos rurales.'],
 ['EL CAMPO EMPIEZA A ABRIRSE','Al salir del centro cambia el paisaje: aparecen producción, animales, caminos, trabajadores y lugares que forman parte de la vida local.'],
 ['EL RÍO Y LOS PUENTES','El río está lejos del núcleo urbano. No atraviesa las calles ni pasa bajo construcciones. Para cruzarlo existen puentes concretos.'],
 ['MÁS ALLÁ: PICADA 21','Todavía más lejos está Picada 21. No es un atajo: es territorio para recorrer, observar, conversar y descubrir memorias.']],en:[
 ['A VILLAGE TO LOOK AT CLOSELY','Villa Pelón is a small place where a street, a conversation or an ordinary task can hold a story.'],
 ['EVERYDAY LIFE MATTERS','History lives in schools, neighbors, shops, roads, work and memories passed from one person to another.'],
 ['THE VILLAGE HAS A HEART','The urban core holds everyday life. From there the territory opens into farms, production and rural roads.'],
 ['THE COUNTRYSIDE OPENS UP','Leaving the center changes the landscape: production, animals, roads, workers and local places appear.'],
 ['THE RIVER AND THE BRIDGES','The river is far from the urban core. It does not run under buildings. Specific bridges are the only crossings.'],
 ['BEYOND THE ROAD: PICADA 21','Farther away lies Picada 21. It is not a shortcut: it is territory to explore, observe, talk and remember.']]};
 let lang=document.documentElement.lang==='en'?'en':'es',i=0;
 const title=story.querySelector('[data-intro-title]'),text=story.querySelector('[data-intro-text]'),btn=story.querySelector('[data-intro-next]'),step=story.querySelector('#storyStep'),dots=[...story.querySelectorAll('.story-dot')];
 let tools=story.querySelector('.story-tools');if(!tools){tools=document.createElement('div');tools.className='story-tools';tools.innerHTML='<button type="button" data-intro-back>ATRÁS</button><button type="button" data-intro-skip>SALTAR CONTEXTO</button>';story.querySelector('.story-copy')?.appendChild(tools)}
 const back=tools.querySelector('[data-intro-back]'),skip=tools.querySelector('[data-intro-skip]');
 function paint(){const p=pages[lang][i];title.textContent=p[0];text.textContent=p[1];btn.textContent=i===pages[lang].length-1?(lang==='en'?'START EXPLORING':'EMPEZAR A EXPLORAR'):(lang==='en'?'CONTINUE':'CONTINUAR');step.textContent=String(i+1).padStart(2,'0')+' / 06';story.dataset.page=i;dots.forEach((d,n)=>d.classList.toggle('active',n===i));back.textContent=lang==='en'?'BACK':'ATRÁS';skip.textContent=lang==='en'?'SKIP CONTEXT':'SALTAR CONTEXTO'}
 function open(){presentation.classList.add('hidden');story.classList.remove('hidden');if(V.gameState){V.gameState.intro=true;V.gameState.dialogue=true}paint()}
 function finish(){story.classList.add('hidden');if(V.gameState){V.gameState.intro=false;V.gameState.introSeen=true;V.gameState.dialogue=false}}
 function next(){i<5?(i++,paint()):finish()}function prev(){if(i>0){i--;paint()}}
 document.getElementById('presentationStart')?.addEventListener('click',open);btn?.addEventListener('click',next);back?.addEventListener('click',prev);skip?.addEventListener('click',finish);
 addEventListener('keydown',e=>{if(story.classList.contains('hidden'))return;if(e.key==='Enter'||e.key===' '||e.key==='ArrowRight'){e.preventDefault();next()}else if(e.key==='ArrowLeft'){e.preventDefault();prev()}else if(e.key==='Escape'){e.preventDefault();finish()}});
 presentation.classList.remove('hidden');
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(start,250));else setTimeout(start,250);
})();
