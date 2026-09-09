/* VILLA PELÓN — MISSION RUNTIME V87
   Conecta el catálogo de misiones con el motor sin duplicar movimiento/render.
*/
(()=>{'use strict';
 const V=window.VillaPelon||(window.VillaPelon={}), S=V.gameState||{};
 const M=V.missions; if(!M)return;
 M.ensure(S);
 const names={marta:'Marta',nico:'Nico',lucia:'Lucía',elena:'Elena',tomas:'Tomás'};
 const zones={rural:{x:4900,y:0,w:3300,h:4200},winery:{x:5500,y:300,w:1900,h:1800},plaza:{x:0,y:400,w:1050,h:450}};
 const doneKey=new Set();
 function dist(a,b){return Math.hypot((a.x||0)-(b.x||0),(a.y||0)-(b.y||0))}
 function npcByName(name){return (V.npcs||[]).find(n=>(n.name||n.n||'').toLowerCase()===name.toLowerCase())}
 function step(){
   if(!V.gameState)return;
   M.ensure(S); const m=M.current(S), target=m.steps[S.missionStep]; if(!target)return;
   let hit=null;
   if(target.startsWith('habla:')){const n=npcByName(target.slice(6));if(n&&dist(S,n)<115)hit=target}
   else if(target==='collect:historic_clue'){const c=V.worldGeometry?.clue;if(c&&dist(S,c)<125)hit=target}
   else if(target.startsWith('reach:')){const z=zones[target.slice(6)];if(z&&S.x>=z.x&&S.x<=z.x+z.w&&S.y>=z.y&&S.y<=z.y+z.h)hit=target}
   else if(target==='explora:plaza'){const z=zones.plaza;if(S.x>=z.x&&S.x<=z.x+z.w&&S.y>=z.y&&S.y<=z.y+z.h)hit=target}
   if(hit&&!doneKey.has(m.id+':'+S.missionStep)){
     doneKey.add(m.id+':'+S.missionStep); const result=M.completeStep(S,hit); S.missionPulse=result.complete?'MISIÓN COMPLETADA: '+m.title:'OBJETIVO COMPLETADO';
     window.dispatchEvent(new CustomEvent('villa-pelon-mission',{detail:{result,mission:M.status(S)}}));
     setTimeout(()=>{S.missionPulse=''},2600);
   }
 }
 V.missionRuntime={version:'87.0',tick:step};
 setInterval(step,180);
 const oldSave=V.saveGame; V.saveGame=function(){if(oldSave)oldSave();try{localStorage.setItem('villa_pelon_missions',JSON.stringify({missionId:S.missionId,missionStep:S.missionStep,missionFlags:S.missionFlags}))}catch(_){} };
 try{const raw=JSON.parse(localStorage.getItem('villa_pelon_missions')||'{}');Object.assign(S,raw)}catch(_){}
})();
