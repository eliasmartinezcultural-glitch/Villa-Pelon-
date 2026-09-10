/* VILLA PELÓN — PRESENTATION RUNTIME 93.2
   Sólo actualiza el panel de misión cuando cambia el estado.
   El motor conserva la actualización de HUD durante el juego.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
function render(){
  const s=V.gameState,m=V.missions?.status?.(s);
  if(!s||!m)return;
  const q=document.getElementById('questText'),p=document.getElementById('questProgress');
  if(q)q.textContent=m.objective||m.title;
  if(p)p.textContent=m.total?'Paso '+Math.min(m.step+1,m.total)+' de '+m.total+' · Recompensa $'+m.reward:'Exploración libre · Ruta principal completada';
}
window.addEventListener('villa-pelon-mission',render);
window.addEventListener('villa-pelon-engine-ready',()=>setTimeout(render,0),{once:true});
})();
