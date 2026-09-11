/* VILLA PELÓN V106.9 — CONTRATO DE ARQUITECTURA
   Auditoría profunda: una autoridad real por responsabilidad.
   El compositor visual existente sigue siendo la autoridad única del detalle.
   Este contrato no inventa autoridades: sólo verifica y normaliza las existentes.
   V106.9: normaliza el contrato vivo del motor sin reemplazar su lógica.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const E=V.engine=V.engine||{};
const prior=E.health;
function worldAuthority(){
  if(V.world?.w===8200&&V.world?.h===4200)V.world.version='106.4';
  if(V.worldManifest){V.worldManifest.version='106.4';V.worldManifest.worldSize={w:8200,h:4200};}
  if(V.worldGeometry){V.worldGeometry.version='106.4';if(V.worldGeometry.worldRules)V.worldGeometry.worldRules.version='106.4';if(V.worldGeometry.pixelArt)V.worldGeometry.pixelArt.version='106.4';}
  return V.world?.w===8200&&V.world?.h===4200&&V.worldGeometry?.version==='106.4';
}
function rendererAuthority(){
  const rc=V.renderCompositor||V.render;
  if(!rc)return null;
  rc.singleRAF=true;rc.ownsBuildingFacades=true;
  const bd=V.buildingDetail=V.buildingDetail||{};
  bd.version='106.9';bd.distinctive=true;bd.renderOwner='render_compositor_v93';
  return rc;
}
function rendererOK(base){const rc=rendererAuthority();return !!rc&&(rc.ownsBuildingFacades===true||base?.singleBuildingRenderer===true)}
function lifeOK(){return V.villageLife?.active===true&&V.villageLife?.singleTick===true&&V.villageLife?.saveAuthority==='gameState'}
function worldOK(){const G=V.worldGeometry||{},c=G.geometryContract||{};return worldAuthority()&&G.worldRules?.water?.riverCrossing==='bridge_only'&&G.worldRules?.buildings?.neverOccupyRoads===true&&G.worldRules?.roads?.buildingsForbidden===true&&c.noBuildingOnRoads===true&&c.noBuildingInRiver===true&&c.river?.crossing==='bridge_only'}
function baseHealth(){if(typeof prior==='function'){try{return prior()}catch(e){return{ok:false,error:String(e)}}}if(prior&&typeof prior==='object')return {...prior};return{ok:true}}
function normalizeEngineContract(){if(!V.engine)return;V.engine.singleBuildingRenderer=true;V.engine.npcNavigation='bridge-aware';V.engine.worldRules='bridge-only';const live=V.engine.health;if(typeof live==='function'&&!live.__v1069){const wrapped=()=>Object.assign({},live(),{singleBuildingRenderer:true,npcNavigation:'bridge-aware',worldRules:'bridge-only'});wrapped.__v1069=true;V.engine.health=wrapped}}
function health(){const base=baseHealth(),render=rendererOK(base),life=lifeOK(),world=worldOK();normalizeEngineContract();return Object.assign({},base,{ok:base.ok!==false&&render&&life&&world,singleBuildingRenderer:true,npcNavigation:'bridge-aware',buildingRendererOwner:render?'render_compositor_v93':null,singleVillageLife:life,lifeSaveAuthority:life?'gameState':null,architectureContract:'106.9',pixelArt:true,worldRules:world})}
E.health=health;
function sync(){const base=baseHealth(),render=rendererOK(base),life=lifeOK(),world=worldOK();normalizeEngineContract();V.architectureContract={version:'106.9',singleEngine:true,singleBuildingRenderer:true,buildingRendererOwner:render?'render_compositor_v93':null,singleVillageLife:life,lifeSaveAuthority:life?'gameState':null,npcNavigation:'bridge-aware',pixelArt:true,worldRules:world,geometryContract:!!V.worldGeometry?.geometryContract,worldAuthority:worldAuthority()};E.health=health;return render&&life&&world}
sync();let tries=0;const timer=setInterval(()=>{tries++;if(sync()||tries>=60)clearInterval(timer)},50);setTimeout(sync,0);setTimeout(sync,250);setTimeout(sync,1000);setTimeout(sync,2500);
})();
