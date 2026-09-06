/* V87.10 — inicia la campaña con el DNI y respeta partidas guardadas. */
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
function boot(){const s=V.gameState;if(!s||!V.startCampaignMission)return;if(!s.campaign?.active&&!(s.campaign?.completed||[]).includes('m01'))V.startCampaignMission('m01')}
document.getElementById('startBtn')?.addEventListener('click',()=>setTimeout(boot,180));setTimeout(()=>{if(document.getElementById('game')&&!document.getElementById('game').classList.contains('hidden'))boot()},700);
})();