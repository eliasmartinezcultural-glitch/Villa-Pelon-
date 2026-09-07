/* VILLA PELÓN V78 — ARRANQUE + INTRO
   Corrige el arranque después de cargar una partida y convierte la intro en contexto real.
   No hay frases decorativas ni botón de saltar. */
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={}),s=V.gameState;
const start=document.getElementById('start'),game=document.getElementById('game'),btn=document.getElementById('startBtn'),card=document.querySelector('.title-card');
if(!s||!start||!game||!btn||!card)return;
card.innerHTML=`
 <div class="eyebrow">OCARINA PRODUCCIONES · VILLA PELÓN</div>
 <h1>VILLA PELÓN</h1>
 <div class="v78-context">
  <section><b>EL TERRITORIO</b><p>Un pueblo atravesado por el río, las chacras, las bardas y un núcleo urbano de casas, comercios e instituciones.</p></section>
  <section><b>LA VIDA COTIDIANA</b><p>La jornada transcurre entre vecinos, escuela, radio, almacén, trabajo rural, producción y recorridos por el territorio.</p></section>
  <section><b>LA HISTORIA</b><p>El recorrido reúne lugares, objetos, fotografías, testimonios y documentos. Los hechos históricos se incorporan solo cuando pueden sostenerse con una fuente verificable.</p></section>
 </div>
 <p class="v78-credit">Un proyecto de Ocarina Producciones.</p>
 <button id="startBtn" type="button">ENTRAR AL MUNDO</button>`;
const newBtn=document.getElementById('startBtn');
newBtn.onclick=()=>{
 try{if(typeof V.loadGame==='function')V.loadGame()}catch(_){}
 s.started=true;s.dialogue=false;
 start.classList.add('hidden');game.classList.remove('hidden');
 try{if(typeof V.saveGame==='function'){} }catch(_){}
 document.getElementById('questText').textContent='01/21 · Llegar y observar · INTERACTUÁ';
};
const style=document.createElement('style');style.textContent=`
.v78-context{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin:18px 0;text-align:left}
.v78-context section{padding:12px;border:1px solid rgba(216,189,120,.35);background:rgba(20,25,21,.5);border-radius:8px}
.v78-context b{font-size:12px;letter-spacing:.08em;color:#d8bd78}.v78-context p{margin:6px 0 0;line-height:1.45;font-size:13px}.v78-credit{opacity:.8;font-size:12px;margin:12px 0 16px}
@media(max-width:700px){.v78-context{grid-template-columns:1fr}.v78-context section{padding:10px}.title-card{max-height:90vh;overflow:auto}}
`;document.head.appendChild(style);
V.audit=V.audit||{};V.audit.v78=Object.assign(V.audit.v78||{},{bootRepair:true,contextIntro:true,noSkipIntro:true});
})();
