/* VILLA PELÓN V76 — CAPA SOCIAL ESTABLE
   Las relaciones reaccionan a la interacción del jugador; no interrumpen el control al azar. */
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={}),s=V.gameState;if(!s)return;
if(!s.v76)s.v76={trust:{},favors:{},met:{},lastTalk:{}};
const names=['Marta','Lucía','Nico','Raúl','Pedro'];
const seed={Marta:{role:'vecina',hint:'conoce historias del barrio'},Lucía:{role:'docente',hint:'guarda recuerdos escolares'},Nico:{role:'radio',hint:'conoce los ritmos de la comunicación'},Raúl:{role:'trabajo',hint:'conoce caminos y oficios'},Pedro:{role:'vecino',hint:'suele escuchar historias de otros vecinos'}};
function npcNear(){let best=null,d=Infinity;for(const n of V.npcs||[]){const q=Math.hypot(s.x-n.x,s.y-n.y);if(q<d){d=q;best=n}}return d<155?best:null}
function ensure(n){const id=n.name;s.v76.trust[id]=Number(s.v76.trust[id])||0;s.v76.favors[id]=Number(s.v76.favors[id])||0;s.v76.met[id]=true}
function react(n){if(!n||!names.includes(n.name))return;ensure(n);s.v76.trust[n.name]=Math.min(5,s.v76.trust[n.name]+1);const t=s.v76.trust[n.name];const lines=t===1?['Ahora ya nos conocemos.','Si querés reconstruir la historia, empezá por preguntar y observar.']:t<3?['Ya te ubico del pueblo.','Podés seguir esta pista, pero todavía necesita una fuente para convertirse en historia documentada.']:['Hay confianza.','Quizás pueda orientarte hacia otra persona o lugar para seguir investigando.'];V.openDialogue?.(n.name,lines);if(t>=2&&!s.v76.favors[n.name]){s.v76.favors[n.name]=1;V.addItem?.('Pista social · '+n.name);V.openDialogue?.('Pista social',[''+n.name+' te dio una pista para seguir investigando.','Es una guía de juego, no un hecho histórico documentado.'])}}
const old=V.interact;if(typeof old==='function'&&!V.__v76Interact){V.interact=function(){if(!s.started)return;if(s.dialogue){old();return}const n=npcNear();old();if(n&&names.includes(n.name)&&!s.dialogue)react(n)};V.__v76Interact=true}
V.v76Social={characters:seed,getTrust:name=>s.v76.trust[name]||0};V.audit=V.audit||{};V.audit.v76={socialLayer:true,relationships:true,favorHints:true,randomInterruptionsRemoved:true};
})();
