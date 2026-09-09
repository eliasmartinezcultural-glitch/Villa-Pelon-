(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
function start(){const s=document.getElementById('storyIntro');if(!s)return;const pages=[
 ['UN PUEBLO PARA RECORRER','Calles, vecinos, escuela, plaza y lugares de encuentro. Villa Pelón nace como un pueblo vivo, no como un escenario vacío.'],
 ['DEL PUEBLO AL VALLE','Cruzá el río y dejá atrás el núcleo urbano: chacras, acequias, galpones, bodegas, vehículos rurales y caminos hacia Picada 21.'],
 ['LAS PERSONAS SON EL MUNDO','Hablá con vecinos, observá sus rutinas, descubrí lugares y reuní pistas. Hospital, biblioteca, bomberos, escuela y espacios comunitarios tienen identidad propia.'],
 ['HISTORIA VIVA','Explorá a tu ritmo. Las historias históricas que se incorporen al juego deberán tener fuentes verificables. El territorio se descubre caminándolo.']
];let i=0;const title=s.querySelector('[data-intro-title]'),text=s.querySelector('[data-intro-text]'),btn=s.querySelector('[data-intro-next]'),scene=s.querySelector('.story-scene'),dots=[...s.querySelectorAll('.story-dot')];
function paint(){title.textContent=pages[i][0];text.textContent=pages[i][1];btn.textContent=i===pages.length-1?'ENTRAR AL MUNDO':'CONTINUAR';scene.className='story-scene scene-'+(i+1);dots.forEach((d,n)=>d.classList.toggle('active',n===i));s.dataset.page=i}
function close(){s.classList.add('hidden');if(V.gameState)V.gameState.intro=false}
btn.addEventListener('click',()=>{if(i<pages.length-1){i++;paint()}else close()});s.addEventListener('click',e=>{if(e.target===s)close()});if(V.gameState)V.gameState.intro=true;s.classList.remove('hidden');paint()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(start,350));else setTimeout(start,350);})();
