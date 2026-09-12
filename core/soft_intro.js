/* VILLA PELÓN V124 — INTRO INTERACTIVA DE CONTEXTO
   La introducción pertenece al flujo de juego y sólo aparece en una partida nueva.
   No crea geometría ni altera WORLD MAP V1. Su función es enseñar al jugador cómo leer el territorio.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
function start(){
  const s=document.getElementById('storyIntro');
  if(!s||V.gameState?.introSeen)return;
  const pages=[
   ['DONDE EMPIEZA EL CAMINO','Villa Pelón es un pueblo para recorrer con calma. El núcleo urbano es compacto y desde allí el territorio se abre hacia el campo.'],
   ['EL PUEBLO Y EL CAMPO','Calles, escuela, hospital, comercios, vecinos y espacios de encuentro forman el corazón urbano. Más allá aparecen chacras, caminos rurales y lugares de trabajo.'],
   ['EL RÍO ESTÁ LEJOS','El río no atraviesa las calles ni pasa debajo de los edificios. Está más lejos del pueblo y sólo se cruza por los puentes habilitados.'],
   ['MÁS ALLÁ: PICADA 21','Picada 21 está todavía más lejos, al final del recorrido rural. Vas a llegar siguiendo el camino, descubriendo pistas, personas e historias.']
  ];
  let i=0;
  const title=s.querySelector('[data-intro-title]'),text=s.querySelector('[data-intro-text]'),btn=s.querySelector('[data-intro-next]'),scene=s.querySelector('.story-scene'),step=s.querySelector('#storyStep'),dots=[...s.querySelectorAll('.story-dot')];
  function paint(){
    if(!title||!text||!btn)return;
    title.textContent=pages[i][0];text.textContent=pages[i][1];btn.textContent=i===pages.length-1?'ENTRAR AL MUNDO':'CONTINUAR';
    if(step)step.textContent=String(i+1).padStart(2,'0')+' / '+String(pages.length).padStart(2,'0');
    s.dataset.page=i;if(scene)scene.className='story-scene scene-'+(i+1);dots.forEach((d,n)=>d.classList.toggle('active',n===i));
  }
  function close(){s.classList.add('hidden');if(V.gameState){V.gameState.intro=false;V.gameState.introSeen=true;V.gameState.dialogue=false}}
  function next(){if(i<pages.length-1){i++;paint()}else close()}
  btn.addEventListener('click',next);
  addEventListener('keydown',e=>{if(s.classList.contains('hidden'))return;if(e.key==='Enter'||e.key===' '||e.key==='ArrowRight'){e.preventDefault();next()}if(e.key==='ArrowLeft'&&i>0){e.preventDefault();i--;paint()}});
  if(V.gameState){V.gameState.intro=true;V.gameState.dialogue=true}
  s.classList.remove('hidden');paint();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(start,300));else setTimeout(start,300);
})();
