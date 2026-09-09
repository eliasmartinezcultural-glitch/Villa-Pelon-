/* VILLA PELÓN — MISSION RUNTIME V88 */
(()=>{'use strict';
 const V=window.VillaPelon||(window.VillaPelon={}),S=V.gameState||{};V.gameState=S;const M=V.missions;if(!M)return;M.ensure(S);
 const zones={rural:{x:4900,y:0,w:3300,h:4200},winery:{x:5500,y:300,w:1900,h:1800},plaza:{x:0,y:400,w:1050,h:450},picada21:{x:6750,y:2800,w:1450,h:1100}};
 const done=new Set();const d=(a,b)=>Math.hypot((a.x||0)-(b.x||0),(a.y||0)-(b.y||0));
 const npc=name=>(V.npcs||[]).find(n=>(n.n||n.name||'').toLowerCase()===name.toLowerCase());
 const point=id=>(V.worldGeometry?.points||[]).find(p=>p.id===id);
 function match(o){if(!o)return false;if(o.type==='talk'){const n=npc(o.target);return !!n&&d(S,n)<125}if(o.type==='reach'){const z=zones[o.target];return !!z&&S.x>=z.x&&S.x<=z.x+z.w&&S.y>=z.y&&S.y<=z.y+z.h}if(o.type==='collect'){const c=V.worldGeometry?.clue;return o.target==='historic_clue'&&c&&d(S,c)<130&&!S.inventory?.includes('Pista histórica')}if(o.type==='inspect'){const p=point(o.target);return !!p&&d(S,p)<145}return false}
 function tick(){if(!V.gameState)return;M.ensure(S);const m=M.current(S),o=M.objective(S);if(!o||done.has(m.id+':'+o.id))return;if(match(o)){done.add(m.id+':'+o.id);if(o.type==='collect'&&o.target==='historic_clue'){S.inventory=S.inventory||[];if(!S.inventory.includes('Pista histórica'))S.inventory.push('Pista histórica');}const r=M.completeStep(S,o.type+':'+o.target);S.missionPulse=r.complete?'MISIÓN COMPLETADA: '+m.title:'OBJETIVO COMPLETADO: '+o.label;window.dispatchEvent(new CustomEvent('villa-pelon-mission',{detail:{result:r,mission:M.status(S)}}));setTimeout(()=>S.missionPulse='',2600)}}
 V.missionRuntime={version:'88.0',tick,regions:zones};setInterval(tick,180);
 const old=V.saveGame;V.saveGame=()=>{old?.();try{localStorage.setItem('villa_pelon_missions',JSON.stringify({missionId:S.missionId,missionStep:S.missionStep,missionFlags:S.missionFlags,missionHistory:S.missionHistory}))}catch(_){}};
 try{const raw=JSON.parse(localStorage.getItem('villa_pelon_missions')||'{}');if(raw&&typeof raw==='object')Object.assign(S,raw)}catch(_){}
})();
