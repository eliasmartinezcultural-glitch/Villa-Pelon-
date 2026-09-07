/* VILLA PELÓN V76 — CAPA SOCIAL
   Ladrillo: transformar NPCs en relaciones jugables.
   Se apoya sobre las rutinas existentes; no las reemplaza. */
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={}),s=V.gameState;if(!s)return;
if(!s.v76)s.v76={trust:{},favors:{},met:{},lastTalk:{}};
const names=['Marta','Lucía','Nico','Raúl','Pedro'];
const seed={Marta:{role:'vecina',hint:'conoce historias del barrio'},Lucía:{role:'docente',hint:'guarda recuerdos escolares'},Nico:{role:'trabajo',hint:'conoce los ritmos de la producción'},Raúl:{role:'trabajo',hint:'conoce caminos y oficios'},Pedro:{role:'vecino',hint:'suele escuchar historias de otros vecinos'}};
function npcNear(){let best=null,d=99999;for(const n of (V.npcs||[])){const q=Math.hypot(s.x-n.x,s.y-n.y);if(q<d){d=q;best=n}}return d<155?best:null}
function ensure(n){const id=n.name;if(!s.v76.trust[id])s.v76.trust[id]=0;if(!s.v76.favors[id])s.v76.favors[id]=0;s.v76.met[id]=true}
function addTrust(n,amount=1){ensure(n);s.v76.trust[n.name]=Math.min(5,s.v76.trust[n.name]+amount)}
function socialTalk(){if(!s.started||s.dialogue)return;const n=npcNear();if(!n||!names.includes(n.name))return;const now=Date.now(),last=s.v76.lastTalk[n.name]||0;if(now-last<12000)return;s.v76.lastTalk[n.name]=now;ensure(n);if(Math.random()>.07)return;
 const t=s.v76.trust[n.name];const d=seed[n.name]||{role:'vecino',hint:'conoce detalles cotidianos'};
 const lines=t===0?['Todavía no nos conocemos mucho.','Volvé a hablar conmigo otro día.']:t<3?['Ya te ubico del pueblo.','Si prestás atención, vas a empezar a encontrar historias que otros no cuentan de entrada.']:['Ya hay confianza.','Quizás pueda indicarte a quién buscar para reconstruir un recuerdo.'];
 addTrust(n);V.openDialogue?.(n.name,lines);
}
setInterval(socialTalk,1000);

/* Favor simple: al conversar varias veces aparece una pista social, no un hecho histórico inventado. */
const oldInteract=V.interact;
if(typeof oldInteract==='function'&&!V.__v76Interact){V.interact=function(){const n=npcNear();oldInteract();if(n&&names.includes(n.name)){ensure(n);if((s.v76.trust[n.name]||0)>=2&&!s.v76.favors[n.name]){s.v76.favors[n.name]=1;V.addItem?.('Pista social · '+n.name);V.openDialogue?.('Una pista',[''+n.name+' te dio una pista para seguir investigando.','La pista es una guía de juego; todavía necesita una fuente para convertirse en historia documentada.'])}}};V.__v76Interact=true}
V.v76Social={characters:seed,getTrust:name=>s.v76.trust[name]||0};
V.audit=V.audit||{};V.audit.v76={socialLayer:true,relationships:true,favorHints:true};
})();
