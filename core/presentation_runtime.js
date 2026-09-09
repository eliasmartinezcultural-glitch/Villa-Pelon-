/* VILLA PELÓN — PRESENTATION RUNTIME V87
   Feedback visual mínimo para misiones y estado del mundo.
*/
(()=>{'use strict';
 const V=window.VillaPelon||(window.VillaPelon={});
 function toast(){const s=document.getElementById('missionToast');if(!s)return;s.textContent=V.gameState?.missionPulse||'';s.classList.toggle('show',!!V.gameState?.missionPulse)}
 setInterval(toast,120);
 window.addEventListener('villa-pelon-mission',e=>{const s=document.getElementById('missionToast');if(!s)return;s.textContent=e.detail.result?.complete?'✓ '+e.detail.result.mission:'✓ Objetivo completado';s.classList.add('show');setTimeout(()=>s.classList.remove('show'),2400)});
})();
