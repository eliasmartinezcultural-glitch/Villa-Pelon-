/* V87.10 runtime — objetivos simples, progresivos y educativos. */
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});const S=()=>V.gameState;
const target={m02:[2600,2100],m03:[2850,900],m04:[6200,2600],m05:[4700,700],m06:[530,1010],m07:[1190,390],m08:[2200,700]};
function state(){const s=S();if(!s)return null;s.campaign=s.campaign||{active:null,completed:[],records:[],visited:[]};return s}
function current(){return V.getCampaignCurrent?.()}
function near(x,y,d=150){const s=S();return !!s&&Math.hypot(s.x-x,s.y-y)<=d}
function finish(id,record){return V.finishCampaignMission?.(id,record)}
function check(){const s=state(),m=current();if(!s||!m)return;
 if(m.id==='m01'&&V.territoryMissions?.q05?.status==='completed')return finish('m01','transporte y conectividad');
 if(m.id==='m02'&&near(...target.m02,180))return finish('m02','recorrido del agua');
 if(m.id==='m03'&&near(...target.m03,190))return finish('m03','chacra y producción');
 if(m.id==='m04'&&near(...target.m04,220))return finish('m04','periferia y ruralidad');
 if(m.id==='m05'&&near(...target.m05,220))return finish('m05','mirador y relieve');
 if(m.id==='m06'&&near(...target.m06,150))return finish('m06','memoria escolar');
 if(m.id==='m07'&&near(...target.m07,160))return finish('m07','radio y comunicación');
 if(m.id==='m08'&&near(...target.m08,180))return finish('m08','trabajo de cosecha');
 if(m.id==='m09'){const p=[[900,700],[2850,900],[4700,700],[6200,2600]];s.campaign.visited=s.campaign.visited||[];p.forEach((q,i)=>{if(near(q[0],q[1],260)&&!s.campaign.visited.includes(i))s.campaign.visited.push(i)});if(s.campaign.visited.length>=4)return finish('m09','recorrido integral: centro · chacras · bardas · periferia')}
 if(m.id==='m10'){const npc=V.npcs||[];s.campaign.visitedNpc=s.campaign.visitedNpc||[];npc.forEach((n,i)=>{if(near(n.x,n.y,120)&&!s.campaign.visitedNpc.includes(i))s.campaign.visitedNpc.push(i)});if(s.campaign.visitedNpc.length>=3)return finish('m10','síntesis a partir de tres voces del territorio')}
}
setInterval(check,650);
V.campaignRuntime={version:'V87.10.0',simpleObjectives:true,educational:true};
})();