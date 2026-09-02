/* Villa Pelón V6.40.1 — AUTORIDAD FINAL DE ENTRADA
   Capa de reconciliación: evita que los módulos históricos V4/V5 vuelvan a capturar
   la entrada después del núcleo V6. No crea loop ni movimiento paralelo.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const A=V.finalInputAuthority=V.finalInputAuthority||{version:'6.40.1',ready:false};

// V4 conserva sus menús/botones, pero no puede volver a instalar su listener global.
if(V.v4Playability)V.v4Playability.keys=true;

// El comercio pertenece al flujo de interacción del motor: al entrar a un local
// comercial se abre la interfaz de tienda, no un interior genérico superpuesto.
const B=V.buildingSystem;
if(B&&typeof B.enter==='function'&&!B.__commercialAuthority){
  const originalEnter=B.enter;
  B.enter=function(b){
    const type=String(b?.type||'').toLowerCase();
    const label=String(b?.label||b?.name||'').toLowerCase();
    if((type==='shop'||type==='bakery'||/almac[eé]n|comercio|panader/.test(label))&&V.shopFlow?.open){
      if(!V.shopFlow.open(b))return false;
      return true;
    }
    return originalEnter.call(this,b);
  };
  B.__commercialAuthority=true;
}

// Los listeners antiguos registrados sobre document quedan aguas abajo de este
// último listener de window. El núcleo ya procesó la acción; aquí impedimos dobles
// interacciones, dobles aperturas y bloqueos de movimiento.
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
})();
