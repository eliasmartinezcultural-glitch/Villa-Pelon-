/* Villa Pelón V38 — capa de jugabilidad conectada al motor.
   No crea RAF ni otro sistema de movimiento: usa V.gameState y las APIs del motor. */
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const S=()=>V.gameState||window.__villaPelonState||null;
const G=V.worldGeometry||{};
const UI={panel:null,context:null};
function ensure(){
 if(document.getElementById('v38Panel'))return;
 const style=document.createElement('style');style.textContent=`
 #v38Panel{position:fixed;right:14px;bottom:14px;z-index:25;width:min(310px,calc(100vw - 28px));padding:13px 15px;border:1px solid rgba(226,202,146,.42);border-radius:12px;background:rgba(28,31,26,.92);color:#f5ead0;font:12px/1.45 system-ui;box-shadow:0 10px 35px rgba(0,0,0,.32);backdrop-filter:blur(7px);pointer-events:none}
 #v38Panel .v38title{font-weight:900;letter-spacing:1px;color:#e7c982;margin-bottom:7px}#v38Panel .v38row{display:flex;justify-content:space-between;border-top:1px solid rgba(255,255,255,.08);padding:5px 0}#v38Panel small{opacity:.65}
 #v38Context{position:fixed;left:50%;bottom:104px;transform:translateX(-50%);z-index:24;padding:9px 14px;border-radius:9px;background:rgba(27,31,25,.9);border:1px solid rgba(226,202,146,.35);color:#fff3d0;font:12px monospace;opacity:0;transition:opacity .15s;pointer-events:none}
 `;document.head.appendChild(style);
 UI.panel=document.createElement('div');UI.panel.id='v38Panel';document.body.appendChild(UI.panel);
 UI.context=document.createElement('div');UI.context.id='v38Context';document.body.appendChild(UI.context);
}
function itemGroups(inv){const a=Array.isArray(inv)?inv:[];return {total:a.length,food:a.filter(x=>/pan|yerba|azucar|tortas|facturas|comestibles/i.test(x)).length,tools:a.filter(x=>/pala|azada|tijera|llave|cajón/i.test(x)).length,history:a.filter(x=>/pista|histó/i.test(x)).length};}
function render(){const s=S();if(!s||!UI.panel)return;const g=itemGroups(s.inventory);const h=Math.floor(s.minutes/60)%24,m=Math.floor(s.minutes%60);UI.panel.innerHTML=`<div class="v38title">VILLA PELÓN · ESTADO</div><div class="v38row"><span>Hora</span><b>${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}</b></div><div class="v38row"><span>Dinero</span><b>$${Math.round(s.money).toLocaleString('es-AR')}</b></div><div class="v38row"><span>Energía</span><b>${Math.round(s.energy)}%</b></div><div class="v38row"><span>Mochila</span><b>${g.total} objetos</b></div><small>Alimentos ${g.food} · Herramientas ${g.tools} · Memoria ${g.history}</small>`;}
function context(){const s=S();if(!s||!V.getNearby||s.dialogue){if(UI.context)UI.context.style.opacity='0';return}const n=V.getNearby();if(!n){UI.context.style.opacity='0';return}let label='E · INTERACTUAR';if(n.name)label='E · HABLAR CON '+n.name.toUpperCase();else if(n.type==='shop')label='E · COMPRAR';else if(n.type==='home')label='E · DESCANSAR';else if(n.type==='rural')label='E · TRABAJAR / EXPLORAR';else if(n.type==='radio')label='E · ESCUCHAR LA RADIO';else if(n.type==='school')label='E · EXPLORAR LA ESCUELA';else if(n.kind==='plaza')label='E · VISITAR LA PLAZA';else if(n===G.clue)label='E · INVESTIGAR PISTA';else if(n===G.jobSpot)label='E · TOMAR CHANGA';UI.context.textContent=label;UI.context.style.opacity='1';}
function start(){ensure();setInterval(()=>{render();context()},350);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
