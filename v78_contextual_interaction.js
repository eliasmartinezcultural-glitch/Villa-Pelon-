/* VILLA PELÓN V78 — INTERACCIÓN CONTEXTUAL
   Ladrillo: una sola puerta de entrada a las acciones del jugador.
   No dispara actividades al azar: primero identifica qué hay delante del jugador.
   Evita que las capas V74/V76/V77 compitan entre sí. */
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={}),s=V.gameState;if(!s)return;
const original=V.interact;
if(typeof original!=='function'||V.__v78Interact)return;
const label=document.createElement('div');label.id='v78Prompt';label.setAttribute('aria-live','polite');label.style.cssText='position:fixed;left:50%;bottom:calc(92px + env(safe-area-inset-bottom));transform:translateX(-50%);z-index:80;padding:7px 12px;border:1px solid rgba(216,189,120,.65);background:rgba(20,25,21,.9);color:#f4ead2;font:700 12px/1.2 system-ui,sans-serif;letter-spacing:.5px;border-radius:7px;pointer-events:none;display:none;max-width:88vw;text-align:center';document.body.appendChild(label);
function target(){
 const n=typeof V.getNearby==='function'?V.getNearby():null;
 if(!n)return null;
 if(n.name)return {kind:'persona',obj:n,text:'HABLAR · '+n.name};
 if(n.type==='shop')return {kind:'shop',obj:n,text:'ENTRAR · ALMACÉN'};
 if(n.type==='school')return {kind:'school',obj:n,text:'ENTRAR · ESCUELA'};
 if(n.type==='radio')return {kind:'radio',obj:n,text:'ENTRAR · RADIO'};
 if(n.type==='home')return {kind:'home',obj:n,text:'ENTRAR · CASA'};
 if(n.type==='rural')return {kind:'rural',obj:n,text:'ENTRAR · GALPÓN'};
 if(n===V.worldGeometry?.clue)return {kind:'archive',obj:n,text:'ABRIR · ARCHIVO DE MEMORIA'};
 if(n===V.worldGeometry?.jobSpot)return {kind:'job',obj:n,text:'REALIZAR · CHANGA RURAL'};
 return {kind:'objeto',obj:n,text:'INTERACTUAR'};
}
function render(){if(!s.started||s.dialogue){label.style.display='none';return}const t=target();if(!t){label.style.display='none';return}label.textContent=t.text+' · E';label.style.display='block'}
V.getContextAction=target;
V.interact=function(){
 if(!s.started)return;
 if(s.dialogue){original();return}
 const t=target();
 /* Actividades V77 pasan a ser acciones explícitas y deterministas. */
 if(t&&V.v77Activities){
   const act=V.v77Activities.find(a=>{
     if(a.zone==='urbano')return t.kind==='shop'||t.kind==='radio'||t.kind==='home';
     if(a.zone==='chacras')return t.kind==='job'||t.kind==='rural';
     if(a.zone==='sur_rural')return t.kind==='objeto';
     if(a.zone==='barda')return t.kind==='objeto';
     return false;
   });
   if(act&&typeof V.performActivity==='function'){V.performActivity(act.id);return}
 }
 original();
};
V.__v78Interact=true;
setInterval(render,120);
V.audit=V.audit||{};V.audit.v78={contextualInteraction:true,singleEntryPoint:true,deterministic:true,actionPrompt:true};
})();
