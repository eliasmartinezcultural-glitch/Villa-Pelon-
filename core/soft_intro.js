/* VILLA PELÓN V100.2 — INTRO INTERACTIVA
   La introducción pertenece al flujo de juego y sólo aparece en una partida nueva.
   No usa almacenamiento paralelo: introSeen forma parte de gameState y del guardado normal.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
function start(){
  const s=document.getElementById('storyIntro');
  if(!s||V.gameState?.introSeen)return;
  const pages=[
   ['DONDE EMPIEZA EL CAMINO','Un pueblo entre chacras, río, calles y cordillera. Villa Pelón se recorre caminando, mirando y escuchando.'],
   ['EL VALLE TRABAJA','Acequias, viñedos, galpones, tractores y caminos rurales forman parte de la vida cotidiana. El paisaje también cuenta.'],
   ['UN PUEBLO TIENE MEMORIA','Escuela, hospital, biblioteca, bomberos, radio, comercios y vecinos construyen una historia que podés descubrir conversando.'],
   ['AHORA TE TOCA RECORRERLO','Entrá al mundo, conocé a su gente, seguí las pistas y llegá por el camino rural hasta Picada 21.']
  ];
  let i=0;
  const title=s.querySelector('[data-intro-title]'),text=s.querySelector('[data-intro-text]'),btn=s.querySelector('[data-intro-next]'),scene=s.querySelector('.story-scene'),dots=[...s.querySelectorAll('.story-dot')];
  function paint(){
    if(!title||!text||!btn)return;
    title.textContent=pages[i][0];text.textContent=pages[i][1];btn.textContent=i===pages.length-1?'ENTRAR AL MUNDO':'CONTINUAR';
    s.dataset.page=i;if(scene)scene.className='story-scene scene-'+(i+1);dots.forEach((d,n)=>d.classList.toggle('active',n===i));
  }
  function close(){s.classList.add('hidden');if(V.gameState){V.gameState.intro=false;V.gameState.introSeen=true;V.gameState.dialogue=false}}
  function next(){if(i<pages.length-1){i++;paint()}else close()}
  btn.addEventListener('click',next);
  addEventListener('keydown',e=>{if(s.classList.contains('hidden'))return;if(e.key==='Enter'||e.key===' '){e.preventDefault();next()}});
  if(V.gameState){V.gameState.intro=true;V.gameState.dialogue=true}
  s.classList.remove('hidden');paint();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(start,300));else setTimeout(start,300);
})();
