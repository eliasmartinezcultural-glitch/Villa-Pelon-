/* VILLA PELÓN V100.3 — CONTRATO DE ARQUITECTURA
   Auditoría: las autoridades se validan por referencia real, no por supuestos del DOM.
   No crea motor, renderer, RAF ni almacenamiento paralelo.
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
  return Object.assign({},base,{ok:base.ok!==false&&render,singleBuildingRenderer:render,buildingRendererOwner:render?'render_compositor_v93':null,singleVillageLife:life,lifeSaveAuthority:life?'gameState':null,architectureContract:'100.3'});
}
E.health=health;
V.architectureContract={version:'100.3',singleEngine:true,singleBuildingRenderer:rendererOK(),buildingRendererOwner:rendererOK()?'render_compositor_v93':null,singleVillageLife:lifeOK(),lifeSaveAuthority:lifeOK()?'gameState':null};
})();
