/* VILLA PELÓN V125 — PRESENTACIÓN + PRÓLOGO DE CONTEXTO
   La pantalla inicial presenta la obra. Luego el prólogo explica el territorio.
   La intro NO es una pantalla de "entrar al mundo": es contexto narrativo previo.
   No crea, mueve ni modifica geometría. WORLD MAP V1 permanece intacto.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
function start(){
  const presentation=document.getElementById('start');
  const story=document.getElementById('storyIntro');
  if(!presentation||!story||V.gameState?.introSeen)return;
  const pages=[
   ['UN PUEBLO PARA MIRAR DE CERCA','Villa Pelón es un lugar pequeño, de esos donde una calle, una conversación o una tarea sencilla pueden guardar una historia. El juego invita a recorrerlo sin apuro y prestar atención a lo que normalmente pasa desapercibido.'],
   ['LA VIDA COTIDIANA TAMBIÉN CUENTA','Acá la historia no aparece solamente en grandes acontecimientos. Está en la escuela, en los vecinos, en los comercios, en los caminos, en el trabajo y en los recuerdos que una persona transmite a otra.'],
   ['EL PUEBLO TIENE UN CORAZÓN','El núcleo urbano concentra la vida cotidiana: calles, espacios de encuentro, instituciones y vecinos. Desde ese corazón el territorio se va abriendo hacia zonas de chacras, producción y caminos rurales.'],
   ['EL CAMPO EMPIEZA A ABRIRSE','Cuando dejás atrás el centro, cambia el paisaje y cambia también la forma de recorrerlo. Hay caminos, producción, animales, personas y lugares que forman parte de la vida de Villa Pelón.'],
   ['EL RÍO Y LOS PUENTES','El río está alejado del núcleo urbano. No atraviesa las calles ni pasa debajo de las construcciones. Para cruzarlo existen puntos concretos: los puentes. El paisaje también tiene una geografía que hay que aprender a leer.'],
   ['MÁS ALLÁ DEL CAMINO: PICADA 21','Todavía más lejos se encuentra Picada 21, vinculada al recorrido rural y a nuevas historias por descubrir. El objetivo no es correr hasta allí: es conocer el territorio, hablar con sus habitantes y reconstruir sus memorias.']
  ];
  let i=0;
  const title=story.querySelector('[data-intro-title]'),text=story.querySelector('[data-intro-text]'),btn=story.querySelector('[data-intro-next]'),scene=story.querySelector('.story-scene'),step=story.querySelector('#storyStep'),dots=[...story.querySelectorAll('.story-dot')];
  function paint(){
    title.textContent=pages[i][0];
    text.textContent=pages[i][1];
    btn.textContent=i===pages.length-1?'FINALIZAR CONTEXTO':'CONTINUAR';
    if(step)step.textContent=String(i+1).padStart(2,'0')+' / '+String(pages.length).padStart(2,'0');
    story.dataset.page=i;
    if(scene)scene.className='story-scene scene-'+(i+1);
    dots.forEach((d,n)=>d.classList.toggle('active',n===i));
  }
  function openContext(){
    presentation.classList.add('hidden');
    story.classList.remove('hidden');
    if(V.gameState){V.gameState.intro=true;V.gameState.dialogue=true}
    paint();
  }
  function finishContext(){
    story.classList.add('hidden');
    if(V.gameState){V.gameState.intro=false;V.gameState.introSeen=true;V.gameState.dialogue=false}
  }
  function next(){if(i<pages.length-1){i++;paint()}else finishContext()}
  const startButton=document.getElementById('presentationStart');
  if(startButton)startButton.addEventListener('click',openContext);
  btn.addEventListener('click',next);
  addEventListener('keydown',e=>{
    if(!story.classList.contains('hidden')){
      if(e.key==='Enter'||e.key===' '||e.key==='ArrowRight'){e.preventDefault();next()}
      if(e.key==='ArrowLeft'&&i>0){e.preventDefault();i--;paint()}
    }
  });
  presentation.classList.remove('hidden');
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(start,300));else setTimeout(start,300);
})();
