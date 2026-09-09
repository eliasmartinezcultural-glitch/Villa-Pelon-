/* VILLA PELÓN — MISSION SYSTEM V87
   Sistema de misiones extensible. Datos separados del motor visual.
*/
(()=>{'use strict';
 const V=window.VillaPelon||(window.VillaPelon={});
 const M=V.missions=V.missions||{};
 M.version='87.0';
 M.list=[
  {id:'welcome',title:'Conocé Villa Pelón',steps:['habla:marta','explora:plaza'],reward:500,next:'memory_01'},
  {id:'memory_01',title:'Una pista del pueblo',steps:['collect:historic_clue'],reward:2500,next:'community_01'},
  {id:'community_01',title:'Las voces del pueblo',steps:['habla:nico','habla:lucia'],reward:1800,next:'rural_01'},
  {id:'rural_01',title:'Del pueblo a la chacra',steps:['reach:rural','habla:elena'],reward:2200,next:'winery_01'},
  {id:'winery_01',title:'El valle productivo',steps:['reach:winery','habla:tomas'],reward:3000,next:null}
 ];
 M.ensure=function(s){s.missionId=s.missionId||'welcome';s.missionStep=Number.isFinite(+s.missionStep)?+s.missionStep:0;s.missionFlags=s.missionFlags||{};};
 M.current=function(s){M.ensure(s);return M.list.find(x=>x.id===s.missionId)||M.list[0]};
 M.completeStep=function(s,key){M.ensure(s);const m=M.current(s),target=m.steps[s.missionStep];if(target!==key)return false;s.missionStep++;if(s.missionStep>=m.steps.length){s.money=(+s.money||0)+m.reward;s.missionFlags[m.id]=true;s.missionId=m.next||m.id;s.missionStep=0;return {complete:true,reward:m.reward,mission:m.title,next:m.next}}return {complete:false};};
 M.status=function(s){const m=M.current(s);return {id:m.id,title:m.title,step:s.missionStep,total:m.steps.length,reward:m.reward,done:!!s.missionFlags[m.id]}};
})();
