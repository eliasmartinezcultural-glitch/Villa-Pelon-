/* VILLA PELÓN V77 — ACTIVIDADES COTIDIANAS
   Ladrillo: dar razones para jugar fuera de la misión principal.
   Actividades abstractas y ligeras; la historia documental seguirá en el archivo. */
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={}),s=V.gameState;if(!s)return;
if(!s.v77)s.v77={done:{},lastDay:0};
const acts=[
 {id:'mate',name:'Tomar mate',cost:3,reward:'Ritmo tranquilo',zone:'urbano'},
 {id:'cosecha',name:'Ayudar en la cosecha',cost:12,reward:'Experiencia rural',zone:'chacras'},
 {id:'radio',name:'Escuchar la radio',cost:2,reward:'Información local',zone:'urbano'},
 {id:'paseo',name:'Pasear por el borde rural',cost:4,reward:'Descubrimiento',zone:'sur_rural'},
 {id:'mirador',name:'Visitar el mirador',cost:5,reward:'Panorama del territorio',zone:'barda'}
];
function zone(){const x=s.x,y=s.y;if(x<3500&&y<1900)return'urbano';if(x>=3500&&y<2050)return'chacras';if(x>=3500&&y>=2050)return'sur_rural';if(x>=7000)return'barda';return''}
function nearAct(a){const z=zone();return z===a.zone}
function doActivity(a){const e=Number(s.energy)||0;if(e<a.cost){V.openDialogue?.('Estás cansado',['Necesitás descansar antes de seguir.']);return}if(s.v77.done[a.id]===(s.day||1)){V.openDialogue?.(a.name,['Ya hiciste esta actividad hoy.']);return}s.energy=Math.max(0,e-a.cost);s.v77.done[a.id]=s.day||1;V.addItem?.('Actividad · '+a.name+' · Día '+(s.day||1));V.openDialogue?.(a.name,['Actividad realizada.','+'+a.reward+'.','La energía baja: descansar también forma parte de la vida del pueblo.'])}
V.v77Activities=acts;
const old=V.interact;
if(typeof old==='function'&&!V.__v77Interact){V.interact=function(){const a=acts.find(x=>nearAct(x));if(a&&Math.random()<.28){doActivity(a);return}old()};V.__v77Interact=true}
V.audit=V.audit||{};V.audit.v77={activities:true,energyEconomy:true,dailyLimits:true};
})();
