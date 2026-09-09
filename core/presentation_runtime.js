/* VILLA PELÓN — PRESENTATION RUNTIME V88 */
(()=>{'use strict';const V=window.VillaPelon||(window.VillaPelon={});
 function render(){const s=V.gameState,m=V.missions?.status?.(s);if(!s||!m)return;const q=document.getElementById('questText'),p=document.getElementById('questProgress');if(q)q.textContent=m.objective||m.title;if(p)p.textContent='Paso '+Math.min(m.step+1,m.total)+' de '+m.total+' · Recompensa $'+m.reward;const toast=document.getElementById('missionToast');if(toast){toast.textContent=s.missionPulse||'';toast.classList.toggle('show',!!s.missionPulse)}}
 setInterval(render,250);window.addEventListener('villa-pelon-mission',render);
 window.addEventListener('villa-pelon-mission',e=>{const s=document.getElementById('missionToast');if(!s)return;s.textContent=e.detail.result?.complete?'✓ '+e.detail.result.mission:'✓ Objetivo completado';s.classList.add('show');setTimeout(()=>s.classList.remove('show'),2400)});
})();
