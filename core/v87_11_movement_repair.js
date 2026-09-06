/* V87.11 — reparación de movilidad, arranque, NPC y entrada táctil. */
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={}),S=V.gameState;if(!S)return;
const input={up:0,down:0,left:0,right:0};
function mapKey(k){k=String(k).toLowerCase();return ({w:'up',arrowup:'up',s:'down',arrowdown:'down',a:'left',arrowleft:'left',d:'right',arrowright:'right'})[k]}
addEventListener('keydown',e=>{const k=mapKey(e.key);if(k){input[k]=1;e.preventDefault()}},{passive:false});
addEventListener('keyup',e=>{const k=mapKey(e.key);if(k){input[k]=0;e.preventDefault()}},{passive:false});
document.querySelectorAll('[data-key]').forEach(b=>{const k=b.dataset.key;b.addEventListener('pointerdown',e=>{e.preventDefault();b.setPointerCapture?.(e.pointerId);input[k]=1},{passive:false});['pointerup','pointercancel','lostpointercapture'].forEach(t=>b.addEventListener(t,e=>{e.preventDefault();input[k]=0},{passive:false}))});
function repairStart(){S.started=true;document.getElementById('start')?.classList.add('hidden');document.getElementById('game')?.classList.remove('hidden');try{const a=JSON.parse(localStorage.getItem('villa_pelon_save')||'null');if(a&&typeof a==='object'){Object.assign(S,a);S.started=true;S.dialogue=false;S.transport=null}}catch(_){}V.engine?.setState?.('running');V.engine?.update?.(0)}
V.gameStart=repairStart;
document.getElementById('startBtn')?.addEventListener('click',()=>setTimeout(repairStart,10));
const oldUpdate=V.engine?.update;
if(typeof oldUpdate==='function'&&!V.__movementRepair){V.__movementRepair=true;V.engine.update=(dt)=>{oldUpdate(dt);const s=V.gameState;if(!s?.started||s.dialogue||s.transport)return;const np=V.npcs||[];np.forEach((n,i)=>{if(n.homeX==null){n.homeX=n.x;n.homeY=n.y;n.phase=n.phase||i*.63}const t=performance.now()/1000+n.phase;n.x=n.homeX+Math.sin(t*.17+i)*28;n.y=n.homeY+Math.cos(t*.13+i)*15});};}
V.movementRepair={version:'V87.11.1',keyboard:true,touch:true,npcMotion:true,startRepair:true,parallelRaf:false};
console.info('[Villa Pelón] V87.11.1 reparación de movilidad activa');
})();