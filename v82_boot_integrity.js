/* VILLA PELÓN V82 — BOOT ÚNICO + DIAGNÓSTICO
   Reemplaza las capas V78/V81 de arranque por una sola autoridad.
   Objetivos: entrada confiable, recuperación de partida, diagnóstico visible
   y cero conflictos de onclick sobre ENTRAR AL MUNDO.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const bootError=(message,error)=>{
  let box=document.getElementById('v82Error');
  if(!box){box=document.createElement('div');box.id='v82Error';box.style.cssText='position:fixed;inset:12px;z-index:9999;background:#160f0d;color:#f4ead2;border:2px solid #b95e4e;padding:18px;font:14px/1.5 system-ui,sans-serif;overflow:auto;white-space:pre-wrap';document.body.appendChild(box)}
  box.textContent='VILLA PELÓN · DIAGNÓSTICO V82\n\n'+message+(error?'\n\n'+(error.stack||error.message||error):'');
};
window.addEventListener('error',e=>{if(!V.gameState)bootError('El motor no llegó a inicializarse. Revisá la consola del navegador.',e.error||e.message)},true);
window.addEventListener('unhandledrejection',e=>{if(!V.gameState)bootError('Fallo durante la inicialización.',e.reason)},true);
function boot(){
 const start=document.getElementById('start'),game=document.getElementById('game'),btn=document.getElementById('startBtn'),card=document.querySelector('.title-card'),s=V.gameState;
 if(!start||!game||!btn||!card||!s){bootError('Faltan elementos esenciales del motor: '+JSON.stringify({start:!!start,game:!!game,button:!!btn,card:!!card,state:!!s}));return false}
 if(!card.dataset.v82Intro){
  card.innerHTML='<div class="eyebrow">OCARINA PRODUCCIONES · VILLA PELÓN</div><h1>VILLA PELÓN</h1><div class="v82-context"><section><b>EL TERRITORIO</b><p>Un pueblo atravesado por río, chacras, bardas y un núcleo urbano de casas, comercios e instituciones.</p></section><section><b>LA VIDA COTIDIANA</b><p>Recorré el pueblo, conocé vecinos, visitá la escuela, la radio y el almacén, y participá de actividades rurales.</p></section><section><b>LA HISTORIA</b><p>Las fuentes verificables, los testimonios y la ambientación se mantienen diferenciados para no presentar ficción como historia.</p></section></div><p class="v82-credit">Un proyecto de Ocarina Producciones.</p><button id="startBtn" type="button">ENTRAR AL MUNDO</button>';
  card.dataset.v82Intro='1';
 }
 const enter=()=>{
  try{
   let saved=null;try{saved=JSON.parse(localStorage.getItem('villa_pelon_save')||'null')}catch(_){}
   if(saved&&typeof saved==='object'){
    const safe=['x','y','speed','money','energy','minutes','day','quest','inventory','walk','facing','v74Quest','v74Seen','historyQuest','historySeen'];
    safe.forEach(k=>{if(Object.prototype.hasOwnProperty.call(saved,k))s[k]=saved[k]});
   }
   s.started=true;s.dialogue=false;s.saved=false;
   start.classList.add('hidden');game.classList.remove('hidden');
   const q=document.getElementById('questText');if(q)q.textContent='01/21 · Llegar y observar · INTERACTUÁ';
   V.__booted=true;V.audit=V.audit||{};V.audit.v82={boot:'single',buttonBound:true,saveRecovery:true,gameState:true};
   window.dispatchEvent(new CustomEvent('villa-pelon-started'));
  }catch(error){bootError('No se pudo iniciar la partida.',error)}
 };
 const current=document.getElementById('startBtn');
 if(!current.__v82Bound){current.addEventListener('click',enter,{capture:true,once:false});current.__v82Bound=true}
 V.bootGame=enter;
 return true;
}
const css=document.createElement('style');css.textContent='.v82-context{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin:18px 0;text-align:left}.v82-context section{padding:12px;border:1px solid rgba(216,189,120,.35);background:rgba(20,25,21,.5);border-radius:8px}.v82-context b{font-size:12px;letter-spacing:.08em;color:#d8bd78}.v82-context p{margin:6px 0 0;line-height:1.45;font-size:13px}.v82-credit{opacity:.8;font-size:12px;margin:12px 0 16px}@media(max-width:700px){.v82-context{grid-template-columns:1fr}.v82-context section{padding:10px}.title-card{max-height:90vh;overflow:auto}}';document.head.appendChild(css);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
