/* V87.11.2 — puente de integración: movilidad, NPC, campaña y herramientas. */
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={}),S=V.gameState;if(!S)return;
function repairStart(){S.started=true;document.getElementById('start')?.classList.add('hidden');document.getElementById('game')?.classList.remove('hidden');try{const a=JSON.parse(localStorage.getItem('villa_pelon_save')||'null');if(a&&typeof a==='object'){Object.assign(S,a);S.started=true;S.dialogue=false;S.transport=null}}catch(_){}V.engine?.setState?.('running');V.engine?.update?.(0);V.missionUI?.refresh?.()}
V.gameStart=repairStart;
document.getElementById('startBtn')?.addEventListener('click',()=>setTimeout(repairStart,10));
const oldUpdate=V.engine?.update;
if(typeof oldUpdate==='function'&&!V.__movementRepair){V.__movementRepair=true;V.engine.update=(dt)=>{oldUpdate(dt);const s=V.gameState;if(!s?.started)return;if(!s.dialogue&&!s.transport){const np=V.npcs||[];np.forEach((n,i)=>{if(n.homeX==null){n.homeX=n.x;n.homeY=n.y;n.phase=n.phase||i*.63}const t=performance.now()/1000+n.phase;n.x=n.homeX+Math.sin(t*.17+i)*28;n.y=n.homeY+Math.cos(t*.13+i)*15})}V.campaignRuntime?.check?.();V.missionUI?.refresh?.()};}
/* Herramientas que ya estaban declaradas en HTML ahora tienen una acción real. */
document.querySelectorAll('[data-main-tool]').forEach(b=>b.addEventListener('click',()=>{const type=b.dataset.mainTool;if(type==='inventory'){const inv=V.gameState?.inventory||[];V.openDialogue?.('MOCHILA',inv.length?['Objetos registrados: '+inv.join(', ')]:['La mochila está vacía. Tus objetos y registros aparecerán acá.'])}else if(type==='map'){V.openDialogue?.('MAPA DEL TERRITORIO',['El mundo está organizado en centro, barrios, chacras, bardas, periferia y campo.','El río atraviesa el territorio y los puentes conectan sus márgenes.','Recorré el territorio para completar las diez misiones.'])}}));
V.movementRepair={version:'V87.11.2',keyboard:true,touch:true,npcMotion:true,startRepair:true,integratedCampaign:true,reactiveMissionUI:true,toolsConnected:true,parallelRaf:false};
console.info('[Villa Pelón] V87.11.2 puente de integración activo');
})();