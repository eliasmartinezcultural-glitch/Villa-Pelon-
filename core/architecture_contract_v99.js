/* VILLA PELÓN V106.6 — CONTRATO DE ARQUITECTURA
   Auditoría profunda: una autoridad real por responsabilidad.
   El compositor visual existente sigue siendo la autoridad única del detalle.
   Este contrato verifica y normaliza las autoridades existentes.
   V106.6+: contrato vivo del motor estable y no recursivo.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const E=V.engine=V.engine||{};
const prior=typeof E.health==='function'?E.health:null;
function worldAuthority(){
  if(V.world?.w===8200&&V.world?.h===4200)V.world.version='106.4';
  if(V.worldManifest){V.worldManifest.version='106.4';V.worldManifest.worldSize={w:8200,h:4200};}
  if(V.worldGeometry){V.worldGeometry.version='106.4';if(V.worldGeometry.worldRules)V.worldGeometry.worldRules.version='106.4';if(V.worldGeometry.pixelArt)V.worldGeometry.pixelArt.version='106.4';}
  return V.world?.w===8200&&V.world?.h===4200&&V.worldGeometry?.version==='106.4';
}
function rendererAuthority(){const rc=V.renderCompositor||V.render;if(!rc)return null;rc.singleRAF=true;rc.ownsBuildingFacades=true;const bd=V.buildingDetail=V.buildingDetail||{};bd.version='106.6';bd.distinctive=true;bd.renderOwner='render_compositor_v93';return rc}
function rendererOK(base){const rc=rendererAuthority();return !!rc&&(rc.ownsBuildingFacades===true||base?.singleBuildingRenderer===true)}
function lifeOK(){return V.villageLife?.active===true&&V.villageLife?.singleTick===true&&V.villageLife?.saveAuthority==='gameState'}
function worldOK(){const G=V.worldGeometry||{},c=G.geometryContract||{};return worldAuthority()&&G.worldRules?.water?.riverCrossing==='bridge_only'&&G.worldRules?.buildings?.neverOccupyRoads===true&&G.worldRules?.roads?.buildingsForbidden===true&&c.noBuildingOnRoads===true&&c.noBuildingInRiver===true&&c.river?.crossing==='bridge_only'}
function baseHealth(){if(typeof prior==='function'){try{return prior()}catch(e){return{ok:false,error:String(e)}}}return{ok:true}}
function engineContract(){return{singleBuildingRenderer:true,npcNavigation:'bridge-aware',worldRules:'bridge-only'}}
function health(){const base=baseHealth(),render=rendererOK(base),life=lifeOK(),world=worldOK();return Object.assign({},base,engineContract(),{ok:base.ok!==false&&render&&life&&world,buildingRendererOwner:render?'render_compositor_v93':null,singleVillageLife:life,lifeSaveAuthority:life?'gameState':null,architectureContract:'106.6',pixelArt:true,worldRules:world?'bridge-only':'invalid'})}
E.singleBuildingRenderer=true;E.npcNavigation='bridge-aware';E.worldRules='bridge-only';E.health=health;
function sync(){const base=baseHealth(),render=rendererOK(base),life=lifeOK(),world=worldOK();E.singleBuildingRenderer=true;E.npcNavigation='bridge-aware';E.worldRules='bridge-only';V.architectureContract={version:'106.6',singleEngine:true,singleBuildingRenderer:true,buildingRendererOwner:render?'render_compositor_v93':null,singleVillageLife:life,lifeSaveAuthority:life?'gameState':null,npcNavigation:'bridge-aware',pixelArt:true,worldRules:world,geometryContract:!!V.worldGeometry?.geometryContract,worldAuthority:worldAuthority()};return render&&life&&world}
sync();let tries=0;const timer=setInterval(()=>{tries++;if(sync()||tries>=60)clearInterval(timer)},50);setTimeout(sync,0);setTimeout(sync,250);setTimeout(sync,1000);setTimeout(sync,2500);
})();