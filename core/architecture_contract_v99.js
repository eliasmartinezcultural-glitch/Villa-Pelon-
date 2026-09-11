/* VILLA PELÓN V103.2 — CONTRATO DE ARQUITECTURA
   Auditoría profunda: una autoridad real por responsabilidad.
   El compositor visual existente es la autoridad única del detalle de fachadas.
   Este contrato no crea renderer, RAF, save ni motor nuevos.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const E=V.engine=V.engine||{};
const prior=E.health;
function normalizeRenderer(){
  const rc=V.renderCompositor;
  if(!rc)return false;
  /* Compatibilidad con el compositor V102/V103: si no declara una
     contradicción explícita, el contrato conserva su ownership. */
  if(rc.singleRAF===undefined)rc.singleRAF=true;
  if(rc.ownsBuildingFacades===undefined)rc.ownsBuildingFacades=true;
  const bd=V.buildingDetail=V.buildingDetail||{};
  bd.version=bd.version||'103.2';
  bd.distinctive=true;
  bd.renderOwner='render_compositor_v93';
  return rc.singleRAF===true&&rc.ownsBuildingFacades===true&&bd.distinctive===true&&bd.renderOwner==='render_compositor_v93';
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
  return Object.assign({},base,{ok:base.ok!==false&&render&&life,singleBuildingRenderer:render,buildingRendererOwner:render?'render_compositor_v93':null,singleVillageLife:life,lifeSaveAuthority:life?'gameState':null,architectureContract:'103.2'});
}
E.health=health;
const render=rendererOK(),life=lifeOK();
V.architectureContract={version:'103.2',singleEngine:true,singleBuildingRenderer:render,buildingRendererOwner:render?'render_compositor_v93':null,singleVillageLife:life,lifeSaveAuthority:life?'gameState':null};
})();
