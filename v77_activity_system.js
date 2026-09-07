/* VILLA PELÓN V77 — ACTIVIDADES COTIDIANAS
   Ladrillo: dar razones para jugar fuera de la misión principal.
   V78: las actividades dejan de aparecer por azar; se ejecutan desde una acción contextual. */
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
function doActivity(a){
 if(!a)return false;
 const e=Number(s.energy)||0;
 if(e<a.cost){V.openDialogue?.('Estás cansado',['Necesitás descansar antes de seguir.']);return true}
 if(s.v77.done[a.id]===(s.day||1)){V.openDialogue?.(a.name,['Ya hiciste esta actividad hoy.']);return true}
 s.energy=Math.max(0,e-a.cost);s.v77.done[a.id]=s.day||1;
 V.addItem?.('Actividad · '+a.name+' · Día '+(s.day||1));
 V.openDialogue?.(a.name,['Actividad realizada.','+'+a.reward+'.','La energía baja: descansar también forma parte de la vida del pueblo.']);
 return true;
}
V.v77Activities=acts;
V.performActivity=id=>doActivity(acts.find(a=>a.id===id));
/* Compatibilidad: V77 ya no intercepta V.interact. V78 es el único dispatcher contextual. */
V.audit=V.audit||{};V.audit.v77={activities:true,energyEconomy:true,dailyLimits:true,randomInterceptionRemoved:true};
})();
