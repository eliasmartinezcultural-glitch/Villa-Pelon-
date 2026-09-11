/* VILLA PELÓN V103 — CONTRATO DE ARQUITECTURA
   Auditoría: las autoridades se validan por referencia real.
   El contrato conserva una única API callable para engine.health aunque una capa anterior haya dejado metadata como objeto.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const E=V.engine=V.engine||{};
const prior=E.health;
function rendererOK(){return V.renderCompositor?.singleRAF===true&&V.buildingDetail?.renderOwner==='render_compositor_v93'}
function lifeOK(){return V.villageLife?.active===true&&V.villageLife?.singleTick===true&&V.villageLife?.saveAuthority==='gameState'}
function baseHealth(){
  if(typeof prior==='function'){try{return prior()}catch(e){return{ok:false,error:String(e)}}}
  if(prior&&typeof prior==='object')return {...prior};
  return {ok:true};
}
function health(){
  const base=baseHealth(),render=rendererOK(),life=lifeOK();
  return Object.assign({},base,{ok:base.ok!==false&&render&&life,singleBuildingRenderer:render,buildingRendererOwner:render?'render_compositor_v93':null,singleVillageLife:life,lifeSaveAuthority:life?'gameState':null,architectureContract:'103.0'});
}
E.health=health;
V.architectureContract={version:'103.0',singleEngine:true,singleBuildingRenderer:rendererOK(),buildingRendererOwner:rendererOK()?'render_compositor_v93':null,singleVillageLife:lifeOK(),lifeSaveAuthority:lifeOK()?'gameState':null};
})();
