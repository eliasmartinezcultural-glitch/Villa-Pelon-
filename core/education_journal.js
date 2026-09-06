/* Villa Pelón CORE EDUCATION JOURNAL v1.0
   Capa educativa conectada a la mochila: registra descubrimientos sin inventar historia.
   Regla: ningún hecho histórico se presenta como verdadero sin fuente verificable.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const state=()=>V.gameState||{};
const catalog={
  'Pista histórica':{kind:'PISTA',title:'Pista histórica',status:'FUENTE REQUERIDA',text:'Esta pista abre una investigación. Todavía no afirma un hecho histórico: debe contrastarse con documentación antes de convertirse en contenido educativo.'},
  'Cajón de cosecha':{kind:'OBJETO',title:'Cajón de cosecha',status:'OBJETO DE CONTEXTO',text:'Un objeto cotidiano puede servir para investigar prácticas de trabajo, producción y vida rural. Su significado histórico deberá documentarse.'}
};
function itemInfo(item){return catalog[item]||{kind:'OBJETO',title:String(item),status:'POR INVESTIGAR',text:'Este elemento forma parte del recorrido del jugador. Antes de atribuirle un significado histórico, debe investigarse y documentarse.'}}
function discoveries(){const s=state(),items=Array.isArray(s.inventory)?s.inventory:[];return items.map(itemInfo)}
function panel(){
  const items=discoveries();
  const old=document.querySelector('.vp-pro-panel');if(old)old.remove();
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const rows=items.length?items.map((d,i)=>`<article class="vp-discovery"><div class="vp-discovery-top"><span>${i+1}</span><b>${esc(d.title)}</b><em>${esc(d.kind)}</em></div><small>${esc(d.status)}</small><p>${esc(d.text)}</p></article>`).join(''):`<div class="vp-empty">Todavía no encontraste descubrimientos.</div>`;
  const p=document.createElement('div');p.className='vp-pro-panel vp-journal-panel';p.innerHTML=`<div class="vp-pro-head"><b>CUADERNO DE DESCUBRIMIENTOS</b><button data-edu-close aria-label="Cerrar">×</button></div><div class="vp-pro-body"><div class="vp-journal-intro">La mochila guarda lo que encontrás. Este cuaderno explica qué falta investigar para transformar una pista en conocimiento histórico.</div>${rows}<div class="vp-source-rule"><b>REGLA HISTÓRICA</b><br>Hecho real = fuente verificable. Ficción = identificada como ficción.</div></div>`;
  document.getElementById('game')?.appendChild(p);p.querySelector('[data-edu-close]').onclick=()=>p.remove();
}
function refresh(){const badge=document.getElementById('discoveryCount');if(badge)badge.textContent=(Array.isArray(state().inventory)?state().inventory.length:0)}
V.educationJournal={version:'1.0.0',catalog,discoveries,panel,refresh,historicalSourceRequired:true,fictionMustBeMarked:true};
window.addEventListener('villa-pelon-player-state',refresh);window.addEventListener('villa-pelon-inventory-changed',refresh);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',refresh,{once:true});else refresh();
})();
