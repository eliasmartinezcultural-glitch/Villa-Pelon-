/* VILLA PELÓN V80 — SYSTEM STABILIZATION
   Ladrillo estructural: una autoridad final para interacción, límites y diagnóstico.
   No crea un segundo motor ni reemplaza el mapa: coordina las capas existentes. */
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={}),s=V.gameState;
if(!s)return;
V.__v80Stable=true;
V.__interactionAuthority='v80';

/* Estado seguro y normalizado antes de jugar. */
const finite=(v,d)=>Number.isFinite(Number(v))?Number(v):d;
s.x=finite(s.x,960);s.y=finite(s.y,650);s.energy=Math.max(0,Math.min(100,finite(s.energy,100)));s.money=Math.max(0,finite(s.money,10000));s.minutes=Math.max(0,finite(s.minutes,480));s.day=Math.max(1,Math.floor(finite(s.day,1)));s.inventory=Array.isArray(s.inventory)?s.inventory:[];
const W=V.world||{};W.w=Math.max(8200,finite(W.w,8200));W.h=Math.max(4200,finite(W.h,4200));V.world=W;
const G=V.worldGeometry||(V.worldGeometry={});G.buildings=Array.isArray(G.buildings)?G.buildings:[];G.bridges=Array.isArray(G.bridges)?G.bridges:[];

/* Un único registro de contexto. Los sistemas pueden aportar información sin interceptar E. */
const registry={};
V.registerInteraction=(id,fn)=>{if(typeof id==='string'&&typeof fn==='function')registry[id]=fn};
V.getInteractionRegistry=()=>Object.keys(registry);

let lastAction=0;
const previous=V.interact;
V.interact=function(){
 const now=performance.now();
 if(now-lastAction<180)return false;
 lastAction=now;
 if(!s.started)return false;
 if(s.dialogue){if(typeof previous==='function')previous();return true}
 const context=typeof V.getContextAction==='function'?V.getContextAction():null;
 if(context&&context.kind==='activity'&&typeof V.performActivity==='function'){V.performActivity(context.id);return true}
 if(context&&context.kind&&registry[context.kind])return !!registry[context.kind](context);
 if(typeof previous==='function'){previous();return true}
 return false;
};

/* El prompt es informativo; nunca convierte el entorno en una interacción automática. */
const old=document.getElementById('v79Prompt');if(old)old.remove();
const label=document.createElement('div');label.id='v80Prompt';label.setAttribute('aria-live','polite');label.style.cssText='position:fixed;left:50%;bottom:calc(92px + env(safe-area-inset-bottom));transform:translateX(-50%);z-index:80;padding:7px 12px;border:1px solid rgba(216,189,120,.65);background:rgba(20,25,21,.92);color:#f4ead2;font:700 12px/1.2 system-ui,sans-serif;border-radius:7px;pointer-events:none;display:none;max-width:88vw;text-align:center';document.body.appendChild(label);
let lastText='';
function prompt(){if(!s.started||s.dialogue){label.style.display='none';return}const t=typeof V.getContextAction==='function'?V.getContextAction():null;const text=t&&t.text?t.text+' · E':'';if(text!==lastText){lastText=text;label.textContent=text}label.style.display=text?'block':'none'}
setInterval(prompt,160);

/* Auditoría visible para futuras reparaciones y para evitar capas silenciosamente rotas. */
V.audit=V.audit||{};V.audit.v80={
 version:'V80',stableAuthority:true,singleInteractionAuthority:true,interactionDebounceMs:180,
 world:{w:W.w,h:W.h},stateSanitized:true,randomAmbientDialogue:false,
 dynamicIntegrity:true,legacyClampSourceRetired:true,registry:true,
 bridges:Array.isArray(G.bridges)?G.bridges.length:0,
 save:typeof V.saveGame==='function',mobileControls:!!document.querySelector('.touch'),
 started:!!s.started
};
V.runtime&&(V.runtime.audit=V.audit.v80);
})();
