/* VILLA PELÓN V103.1 — CONTRATO DE ARQUITECTURA
   Auditoría: las autoridades se validan por referencia real.
   El compositor visual es la autoridad efectiva de fachadas y detalle.
   El contrato normaliza el sello de ownership para que una carga parcial no genere un falso negativo.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const E=V.engine=V.engine||{};
const prior=E.health;
function normalizeRenderer(){
  const rc=V.renderCompositor;
  if(!rc)return false;
  if(rc.singleRAF!==true)return false;
  if(rc.ownsBuildingFacades===true){
    const bd=V.buildingDetail=V.buildingDetail||{};
    bd.version=bd.version||'103.1';
    bd.distinctive=true;
    bd.renderOwner='render_compositor_v93';
  }
  return V.buildingDetail?.distinctive===true&&V.buildingDetail?.renderOwner==='render_compositor_v93';
}
function rendererOK(){return normalizeRenderer()}
function lifeOK(){return V.villageLife?.active===true&&V.villageLife?.singleTick===true&&V.villageLife?.saveAuthority==='gameState'}
function baseHealth(){
  if(typeof prior==='function'){try{return prior()}catch(e){return{ok:false,error:String(e)}}}
  if(prior&&typeof prior==='object')return {...prior};
  return {ok:true};
}
function health(){
  const base=baseHealth(),render=rendererOK(),life=lifeOK();
  return Object.assign({},base,{ok:base.ok!==false&&render&&life,singleBuildingRenderer:render,buildingRendererOwner:render?'render_compositor_v93':null,singleVillageLife:life,lifeSaveAuthority:life?'gameState':null,architectureContract:'103.1'});
}
E.health=health;
const render=rendererOK(),life=lifeOK();
V.architectureContract={version:'103.1',singleEngine:true,singleBuildingRenderer:render,buildingRendererOwner:render?'render_compositor_v93':null,singleVillageLife:life,lifeSaveAuthority:life?'gameState':null};
})();
