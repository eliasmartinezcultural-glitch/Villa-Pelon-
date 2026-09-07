/* VILLA PELÓN V78 — INTERACCIÓN CONTEXTUAL
   Ladrillo: una sola puerta de entrada a las acciones del jugador.
   No dispara actividades al azar: primero identifica qué hay delante del jugador.
   Evita que las capas V74/V76/V77 compitan entre sí. */
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={}),s=V.gameState;if(!s)return;
const original=V.interact;if(typeof original!=='function'||V.__v78Interact)return;
const label=document.createElement('div');label.id='v78Prompt';label.setAttribute('aria-live','polite');label.style.cssText='position:fixed;left:50%;bottom:calc(92px + env(safe-area-inset-bottom));transform:translateX(-50%);z-index:80;padding:7px 12px;border:1px solid rgba(216,189,120,.65);background:rgba(20,25,21,.9);color:#f4ead2;font:700 12px/1.2 system-ui,sans-serif;letter-spacing:.5px;border-radius:7px;pointer-events:none;display:none;max-width:88vw;text-align:center';document.body.appendChild(label);
function virtualActivity(){
 if(!V.v77Activities||typeof V.performActivity!=='function')return null;
 const points=[
  {id:'mate',x:900,y:650,r:70,text:'TOMAR MATE'},
  {id:'paseo',x:5000,y:2500,r:110,text:'PASEAR POR EL BORDE RURAL'},
  {id:'mirador',x:6500,y:3800,r:130,text:'VISITAR EL MIRADOR'}
 ];
 for(const p of points)if(Math.hypot(s.x-p.x,s.y-p.y)<=p.r)return {kind:'activity',id:p.id,text:p.text};
 return null;
}
function target(){
 const n=typeof V.getNearby==='function'?V.getNearby():null;
 if(n){
  if(n.name)return {kind:'persona',obj:n,text:'HABLAR · '+n.name};
  if(n===V.worldGeometry?.clue)return {kind:'archive',obj:n,text:'ABRIR · ARCHIVO DE MEMORIA'};
  if(n===V.worldGeometry?.jobSpot)return {kind:'job',obj:n,text:'REALIZAR · CHANGA RURAL'};
  if(n.type==='shop')return {kind:'shop',obj:n,text:'ENTRAR · ALMACÉN'};
  if(n.type==='school')return {kind:'school',obj:n,text:'ENTRAR · ESCUELA'};
  if(n.type==='radio')return {kind:'radio',obj:n,text:'ENTRAR · RADIO'};
  if(n.type==='home')return {kind:'home',obj:n,text:'ENTRAR · CASA'};
  if(n.type==='rural')return {kind:'rural',obj:n,text:'ENTRAR · GALPÓN'};
  return {kind:'objeto',obj:n,text:'INTERACTUAR'};
 }
 return virtualActivity();
}
function render(){if(!s.started||s.dialogue){label.style.display='none';return}const t=target();if(!t){label.style.display='none';return}label.textContent=t.text+' · E';label.style.display='block'}
V.getContextAction=target;
V.interact=function(){
 if(!s.started)return;if(s.dialogue){original();return}
 const t=target();
 if(t&&t.kind==='activity'){V.performActivity(t.id);return}
 original();
};
V.__v78Interact=true;
setInterval(render,120);
V.audit=V.audit||{};V.audit.v78={contextualInteraction:true,singleEntryPoint:true,deterministic:true,actionPrompt:true};
})();
