/* Villa Pelón — HUD territorial + integración del entorno dinámico. */
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
function paint(){const c=V.territoryClock;if(!c)return;const season=document.getElementById('season'),year=document.getElementById('year'),day=document.getElementById('day'),clock=document.getElementById('clock');if(season)season.textContent=(c.getSeason?c.getSeason().label:c.season||'VERANO');if(year)year.textContent=c.year||1;if(day)day.textContent=c.dayOfYear||c.day||1;if(clock){const h=Math.floor(c.minute/60),m=Math.floor(c.minute%60);clock.textContent=String(h).padStart(2,'0')+':'+String(m).padStart(2,'0')}document.body.dataset.season=c.season||'verano';document.body.dataset.phase=c.phase||'morning'}
function loadEnvironment(){if(V.territoryEnvironment||document.querySelector('script[data-vp-environment]'))return;const s=document.createElement('script');s.src='./core/territory_environment.js?v=90';s.defer=true;s.dataset.vpEnvironment='1';document.head.appendChild(s)}
function addCredit(){const n=document.querySelector('.intro-note');if(n&&!n.querySelector('.ocarina-credit')){const span=document.createElement('span');span.className='ocarina-credit';span.innerHTML='Creado por <strong>Ocarina Producciones</strong>.';n.appendChild(document.createElement('br'));n.appendChild(span)}}
paint();setInterval(paint,500);window.addEventListener('villa-pelon-clock-ready',paint);window.addEventListener('load',()=>{loadEnvironment();addCredit()});setTimeout(()=>{loadEnvironment();addCredit()},0);
})();
