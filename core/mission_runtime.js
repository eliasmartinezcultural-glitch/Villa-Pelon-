/* VILLA PELÓN — MISSION RUNTIME V88 */
(()=>{'use strict';
 const V=window.VillaPelon||(window.VillaPelon={}),S=V.gameState||{};V.gameState=S;const M=V.missions;if(!M)return;M.ensure(S);
 const zones={rural:{x:4900,y:0,w:3300,h:4200},winery:{x:5500,y:300,w:1900,h:1800},plaza:{x:0,y:400,w:1050,h:450},picada21:{x:6750,y:2800,w:1450,h:1100}};
 const done=new Set();const d=(a,b)=>Math.hypot((a.x||0)-(b.x||0),(a.y||0)-(b.y||0));const npc=name=>(V.npcs||[]).find(n=>(n.n||n.name||'').toLowerCase()===name.toLowerCase());const point=id=>(V.worldGeometry?.points||[]).find(p=>p.id===id);
 function complete(o){const id=M.current(S).id+':'+o.id;if(done.has(id))return;done.add(id);if(o.type==='collect'&&o.target==='historic_clue'){S.inventory=S.inventory||[];if(!S.inventory.includes('Pista histórica'))S.inventory.push('Pista histórica')}const before=M.current(S),r=M.completeStep(S,o.type+':'+o.target);S.missionPulse=r.complete?'MISIÓN COMPLETADA: '+before.title:'OBJETIVO COMPLETADO: '+o.label;window.dispatchEvent(new CustomEvent('villa-pelon-mission',{detail:{result:r,mission:M.status(S)}}));setTimeout(()=>S.missionPulse='',2600)}
 function interactTarget(){const o=M.objective(S);if(!o)return;const t=o.type==='talk'?npc(o.target):o.type==='collect'?V.worldGeometry?.clue:o.type==='inspect'?point(o.target):null;if(t&&d(S,t)<145)complete(o)}
 function tick(){if(!V.gameState)return;M.ensure(S);const o=M.objective(S);if(!o)return;if(o.type==='reach'){const z=zones[o.target];if(z&&S.x>=z.x&&S.x<=z.x+z.w&&S.y>=z.y&&S.y<=z.y+z.h)complete(o)}}
 V.missionRuntime={version:'88.2',tick,regions:zones,complete:interactTarget};setInterval(tick,180);
 document.addEventListener('keydown',e=>{if(e.key.toLowerCase()==='e'||e.key===' ' )setTimeout(interactTarget,0)});document.getElementById('interact')?.addEventListener('pointerup',()=>setTimeout(interactTarget,0));
 const old=V.saveGame;V.saveGame=()=>{old?.();try{localStorage.setItem('villa_pelon_missions',JSON.stringify({missionId:S.missionId,missionStep:S.missionStep,missionFlags:S.missionFlags,missionHistory:S.missionHistory}))}catch(_){} };
 try{const raw=JSON.parse(localStorage.getItem('villa_pelon_missions')||'{}');if(raw&&typeof raw==='object')Object.assign(S,raw)}catch(_){}
})();
