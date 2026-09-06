/* V87.10 runtime — activa las 10 misiones con objetivos simples y educativos. */
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});const S=()=>V.gameState;const G=()=>V.worldAuthority?.geometry||V.worldGeometry||{};
const target={m02:[2600,2100],m03:[2850,900],m04:[6200,2600],m05:[4700,700],m06:[530,1010],m07:[1190,390],m08:[2200,700]};
function state(){const s=S();if(!s)return null;s.campaign=s.campaign||{active:null,completed:[],records:[]};return s}
function current(){return V.getCampaignCurrent?.()}
function near(x,y,d=150){const s=S();return !!s&&Math.hypot(s.x-x,s.y-y)<=d}
function finish(id,record){return V.finishCampaignMission?.(id,record)}
function check(){const s=state(),m=current();if(!s||!m)return;if(m.id==='m01'&&V.territoryMissions?.q05?.status==='completed'){finish('m01','transporte y conectividad');return}if(m.id==='m02'&&near(...target.m02,180)){finish('m02','recorrido del agua');return}if(m.id==='m03'&&near(...target.m03,190)){finish('m03','chacra y producción');return}if(m.id==='m04'&&near(...target.m04,220)){finish('m04','periferia y ruralidad');return}if(m.id==='m05'&&near(...target.m05,220)){finish('m05','mirador y relieve');return}if(m.id==='m06'&&near(...target.m06,140)){finish('m06','memoria escolar');return}if(m.id==='m07'&&near(...target.m07,150)){finish('m07','radio y comunicación');return}if(m.id==='m08'&&near(...target.m08,170)){finish('m08','trabajo de cosecha');return}if(m.id==='m09'){const p=[[900,700],[2850,900],[4700,700],[6200,2600]];const seen=s.campaign.records||[];const count=p.filter(([x,y])=>Math.hypot(s.x-x,s.y-y)<250).length;s.campaign.m09Visited=Math.max(s.campaign.m09Visited||0,count);if(s.campaign.m09Visited>=4)finish('m09','recorrido integral del territorio');}if(m.id==='m10'){const names=['Marta','Lucía','Don Félix'];const talked=s.campaign.records||[];if(names.every(n=>talked.some(r=>String(r).includes(n))))finish('m10','síntesis de memoria local')}}
const oldFinish=V.finishCampaignMission;V.finishCampaignMission=(id,r)=>{const ok=oldFinish?.(id,r);return ok};
setInterval(check,650);
V.campaignRuntime={version:'V87.10.0',simpleObjectives:true,educational:true};
})();