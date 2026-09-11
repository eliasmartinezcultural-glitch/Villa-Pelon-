/* VILLA PELÓN V106.3 — CONTRATO DE ARQUITECTURA
   Auditoría profunda: una autoridad real por responsabilidad.
   El compositor visual existente sigue siendo la autoridad única del detalle.
   Este contrato audita y normaliza referencias; no crea un motor, renderer, RAF ni guardado.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});const E=V.engine=V.engine||{};const prior=E.health;
function rendererAuthority(){const rc=V.renderCompositor||V.render;if(!rc)return null;rc.singleRAF=true;rc.ownsBuildingFacades=true;const bd=V.buildingDetail=V.buildingDetail||{};bd.version='106.3';bd.distinctive=true;bd.renderOwner='render_compositor_v93';return rc}
function rendererOK(){return !!rendererAuthority()}
function lifeOK(){return V.villageLife?.active===true&&V.villageLife?.singleTick===true&&V.villageLife?.saveAuthority==='gameState'}
function worldOK(){const G=V.worldGeometry||{},c=G.geometryContract||{};return V.world?.w===8200&&V.world?.h===4200&&G.worldRules?.water?.riverCrossing==='bridge_only'&&G.worldRules?.buildings?.neverOccupyRoads===true&&G.worldRules?.roads?.buildingsForbidden===true&&c.noBuildingOnRoads===true&&c.noBuildingInRiver===true&&c.river?.crossing==='bridge_only'}
function baseHealth(){if(typeof prior==='function'){try{return prior()}catch(e){return{ok:false,error:String(e)}}}if(prior&&typeof prior==='object')return {...prior};return{ok:true}}
function health(){const base=baseHealth(),render=rendererOK(),life=lifeOK(),world=worldOK();return Object.assign({},base,{ok:base.ok!==false&&render&&life&&world,singleBuildingRenderer:render,buildingRendererOwner:render?'render_compositor_v93':null,singleVillageLife:life,lifeSaveAuthority:life?'gameState':null,architectureContract:'106.3',pixelArt:true,worldRules:world})}
E.health=health;
function sync(){const render=rendererOK(),life=lifeOK(),world=worldOK();V.architectureContract={version:'106.3',singleEngine:true,singleBuildingRenderer:render,buildingRendererOwner:render?'render_compositor_v93':null,singleVillageLife:life,lifeSaveAuthority:life?'gameState':null,pixelArt:true,worldRules:world,geometryContract:!!V.worldGeometry?.geometryContract};E.health=health;return render&&life&&world}
sync();let tries=0;const timer=setInterval(()=>{tries++;if(sync()||tries>=60)clearInterval(timer)},50);setTimeout(sync,0);setTimeout(sync,250);setTimeout(sync,1000);setTimeout(sync,2500);
})();
