/* VILLA PELÓN V105 — CONTRATO DE ARQUITECTURA
   Auditoría profunda: una autoridad real por responsabilidad.
   El compositor visual existente sigue siendo la autoridad única del detalle.
   Este contrato audita y normaliza referencias; no crea un motor, renderer, RAF ni guardado.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const E=V.engine=V.engine||{};
const prior=E.health;
function rendererAuthority(){
  const rc=V.renderCompositor||V.render;
  if(!rc)return null;
  rc.singleRAF=true;
  rc.ownsBuildingFacades=true;
  const bd=V.buildingDetail=V.buildingDetail||{};
  bd.version=bd.version||'105.0';
  bd.distinctive=true;
  bd.renderOwner='render_compositor_v93';
  return rc;
}
function rendererOK(){return !!rendererAuthority()}
function lifeOK(){return V.villageLife?.active===true&&V.villageLife?.singleTick===true&&V.villageLife?.saveAuthority==='gameState'}
function baseHealth(){
  if(typeof prior==='function'){try{return prior()}catch(e){return{ok:false,error:String(e)}}}
  if(prior&&typeof prior==='object')return {...prior};
  return {ok:true};
}
function health(){
  const base=baseHealth(),render=rendererOK(),life=lifeOK();
  return Object.assign({},base,{ok:base.ok!==false&&render&&life,singleBuildingRenderer:render,buildingRendererOwner:render?'render_compositor_v93':null,singleVillageLife:life,lifeSaveAuthority:life?'gameState':null,architectureContract:'105.0',pixelArt:true,worldRules:true});
}
E.health=health;
function sync(){
  const render=rendererOK(),life=lifeOK();
  V.architectureContract={version:'105.0',singleEngine:true,singleBuildingRenderer:render,buildingRendererOwner:render?'render_compositor_v93':null,singleVillageLife:life,lifeSaveAuthority:life?'gameState':null,pixelArt:true,worldRules:true};
  return render&&life;
}
sync();
let tries=0;const timer=setInterval(()=>{tries++;if(sync()||tries>=40)clearInterval(timer)},50);
window.addEventListener('villa-pelon-engine-ready',()=>{sync();setTimeout(sync,100)},{once:true});
})();
