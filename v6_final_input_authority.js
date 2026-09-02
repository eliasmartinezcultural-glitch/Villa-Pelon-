/* Villa Pelón V6.40.2 — AUTORIDAD FINAL DE ENTRADA
   Reconciliación tardía: todos los sistemas defer ya existen antes de cerrar
   la cadena de entrada. No crea loop ni movimiento paralelo.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const A=V.finalInputAuthority=V.finalInputAuthority||{version:'6.40.2',ready:false};

function reconcile(){
  // V4 conserva sus menús/botones, pero no puede volver a instalar su teclado global.
  if(V.v4Playability)V.v4Playability.keys=true;

  // Comercio: entrar a un almacén/panadería abre la tienda real, no un interior genérico.
  const B=V.buildingSystem;
  if(B&&typeof B.enter==='function'&&!B.__commercialAuthority){
    const originalEnter=B.enter;
    B.enter=function(b){
      const type=String(b?.type||'').toLowerCase();
      const label=String(b?.label||b?.name||'').toLowerCase();
      if((type==='shop'||type==='bakery'||/almac[eé]n|comercio|panader/.test(label))&&V.shopFlow?.open){
        return V.shopFlow.open(b)!==false;
      }
      return originalEnter.call(this,b);
    };
    B.__commercialAuthority=true;
  }

  // Este listener se registra DESPUÉS de todos los módulos defer. Así bloquea
  // únicamente los listeners legacy que queden aguas abajo, sin bloquear tienda
  // ni edificios antes de que procesen la acción.
  window.addEventListener('keydown',e=>{
    if(!V.state?.started)return;
    const k=String(e.key||'').toLowerCase();
    if(k!=='e'&&k!==' '&&k!=='escape')return;
    if(k==='escape'&&V.buildingSystem?.inside){
      e.preventDefault();e.stopImmediatePropagation();V.buildingSystem.exit?.();return;
    }
    e.stopImmediatePropagation();
  },true);

  A.ready=true;
  A.contract={movement:'v6_game_core',interaction:'v6_game_core',menus:'v4_ui_facade',commerce:'v6_shop_flow',buildings:'v6_building_system'};
  A.reconciledAt=Date.now();
}

// Todos los <script defer> se ejecutan antes de DOMContentLoaded; el callback
// garantiza que buildingSystem/shopFlow y los listeners legacy ya fueron creados.
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',reconcile,{once:true});
else setTimeout(reconcile,0);
})();
