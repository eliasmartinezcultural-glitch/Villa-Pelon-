/* VILLA PELÓN V80 — MUNDO VIVO DETERMINISTA
   La vida cotidiana acompaña la exploración, pero jamás secuestra el control.
   Los diálogos se disparan por interacción explícita; los descubrimientos de zona
   se registran silenciosamente para no bloquear el movimiento. */
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={}),s=V.gameState;if(!s)return;
if(!s.v75)s.v75={events:[],discoveries:[],lastEventDay:0};
const events=[
 {id:'mate',title:'Ronda de mate',lines:['Hay gente reunida conversando.','El pueblo también se conoce en los momentos tranquilos.']},
 {id:'cosecha',title:'Movimiento en la chacra',lines:['Hoy hay más movimiento en los frutales.','La actividad rural cambia el ritmo del pueblo.']},
 {id:'radio',title:'Voces al aire',lines:['Desde la radio llega una voz conocida.','Las conversaciones también forman parte de la vida cotidiana.']},
 {id:'lluvia',title:'Cambio de tiempo',lines:['El cielo cambió y la calle se siente distinta.','En un pueblo, el clima también organiza el día.']},
 {id:'encuentro',title:'Encuentro casual',lines:['Dos vecinos se detuvieron a conversar.','No todo descubrimiento aparece marcado en el mapa.']}
];
function addDiscovery(id){if(!s.v75.discoveries.includes(id))s.v75.discoveries.push(id)}
const zones=[
 ['urbano',200,300,3300,1600],['chacras',3600,550,3000,1500],['sur_rural',3600,2050,3000,1900],['barda',7000,0,1200,4200]
];
function zoneAt(){return zones.find(z=>s.x>=z[1]&&s.x<=z[1]+z[3]&&s.y>=z[2]&&s.y<=z[2]+z[4])}
let lastZone='';
function updateZone(){
 if(!s.started||s.dialogue)return;
 const z=zoneAt();if(!z||z[0]===lastZone)return;
 lastZone=z[0];addDiscovery('zona:'+z[0]);
 if(!s.v75.events.some(e=>e.type==='zone'&&e.id===z[0]))s.v75.events.push({type:'zone',id:z[0],day:s.day||1});
}
setInterval(updateZone,500);
V.v75WorldLife={events,zoneNames:zones.map(z=>z[0]),discoveries:s.v75.discoveries,deterministic:true};
V.audit=V.audit||{};V.audit.v75={livingWorld:true,ambientEvents:true,explorationDiscoveries:true,randomDialogueRemoved:true};
})();
