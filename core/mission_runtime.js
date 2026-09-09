/* VILLA PELÓN — MISSION RUNTIME V88 */
(()=>{'use strict';
 const V=window.VillaPelon||(window.VillaPelon={}),S=V.gameState||{};V.gameState=S;const M=V.missions;if(!M)return;M.ensure(S);
 const zones={rural:{x:4900,y:0,w:3300,h:4200},winery:{x:5500,y:300,w:1900,h:1800},plaza:{x:0,y:400,w:1050,h:450},picada21:{x:6750,y:2800,w:1450,h:1100}};
 const done=new Set();const d=(a,b)=>Math.hypot((a.x||0)-(b.x||0),(a.y||0)-(b.y||0));
 const npc=name=>(V.npcs||[]).find(n=>(n.n||n.name||'').toLowerCase()===name.toLowerCase());
 const point=id=>(V.worldGeometry?.points||[]).find(p=>p.id===id);
 function complete(o){const key=o.type+':'+o.target;if(done.has(M.current(S).id+':'+o.id))return;done.add(M.current(S).id+':'+o.id);if(o.type==='collect'&&o.target==='historic_clue'){S.inventory=S.inventory||[];if(!S.inventory.includes('Pista histórica'))S.inventory.push('Pista histórica')}const before=M.current(S);const r=M.completeStep(S,key);S.missionPulse=r.complete?'MISIÓN COMPLETADA: '+before.title:'OBJETIVO COMPLETADO: '+o.label;window.dispatchEvent(new CustomEvent('villa-pelon-mission',{detail:{result:r,mission:M.status(S)}}));setTimeout(()=>S.missionPulse='',2600)}
 function reachMatch(o){if(o.type==='reach'){const z=zones[o.target];return !!z&&S.x>=z.x&&S.x<=z.x+z.w&&S.y>=z.y&&S.y<=z.y+z.h}return false}
 function tick(){if(!V.gameState)return;M.ensure(S);const o=M.objective(S);if(!o)return;if(reachMatch(o))complete(o)}
 V.missionRuntime={version:'88.1',tick,regions:zones,complete};setInterval(tick,180);
 const oldInteract=V.interact;V.interact=function(){const o=M.objective(S),target=o&&o.type==='talk'?npc(o.target):o&&o.type==='collect'?V.worldGeometry?.clue:o&&o.type==='inspect'?point(o.target):null;if(target&&d(S,target)<145){complete(o)}return oldInteract?.()};
 const old=V.saveGame;V.saveGame=()=>{old?.();try{localStorage.setItem('villa_pelon_missions',JSON.stringify({missionId:S.missionId,missionStep:S.missionStep,missionFlags:S.missionFlags,missionHistory:S.missionHistory}))}catch(_){} };
 try{const raw=JSON.parse(localStorage.getItem('villa_pelon_missions')||'{}');if(raw&&typeof raw==='object')Object.assign(S,raw)}catch(_){}
})();
