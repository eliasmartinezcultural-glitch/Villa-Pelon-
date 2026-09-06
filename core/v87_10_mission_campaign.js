/* Villa Pelón V87.10 — campaña educativa de 10 misiones.
   No aumenta brutalmente la dificultad: aumenta el conocimiento. */
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const S=()=>V.gameState;
const missions=[
{id:'m01',title:'El DNI perdido',topic:'territorio y conectividad',brief:'Llevá un documento a una familia de Picada 21.',learn:['Picada 21 forma parte del territorio.','Los caminos y el transporte conectan comunidades.'],reward:1200},
{id:'m02',title:'Seguí el agua',topic:'río, canales y riego',brief:'Recorré el borde del canal y registrá dónde circula el agua.',learn:['El río funciona como barrera natural.','Los canales permiten llevar agua hacia zonas productivas.'],reward:300},
{id:'m03',title:'Una chacra tiene ritmo',topic:'producción frutícola',brief:'Visitá una chacra y conversá con un productor.',learn:['Las chacras tienen ciclos de trabajo.','La producción modifica el paisaje y la vida cotidiana.'],reward:350},
{id:'m04',title:'Donde termina el pueblo',topic:'ruralidad y periferia',brief:'Llegá al borde urbano y observá cómo cambia el paisaje.',learn:['El pueblo no termina donde termina el centro.','Periferia, campo y chacras forman un mismo territorio.'],reward:400},
{id:'m05',title:'Las bardas',topic:'relieve y paisaje',brief:'Llegá a un mirador y observá el territorio desde arriba.',learn:['Las bardas son parte del paisaje local.','El relieve condiciona caminos, vistas y formas de habitar.'],reward:450},
{id:'m06',title:'La memoria de la escuela',topic:'memoria comunitaria',brief:'Hablá con una docente y registrá una historia.',learn:['La escuela también guarda memoria local.','Una historia oral debe distinguirse de un dato documental.'],reward:500},
{id:'m07',title:'La voz del pueblo',topic:'radio y comunicación',brief:'Llevá una voz de la chacra hasta la radio.',learn:['La radio comunica entre sectores del territorio.','La comunicación local también construye memoria.'],reward:550},
{id:'m08',title:'Trabajo de cosecha',topic:'trabajo y economía cotidiana',brief:'Ayudá con una tarea sencilla de cosecha.',learn:['La producción genera trabajo.','La economía conecta campo, comercios, transporte y familias.'],reward:600},
{id:'m09',title:'Armar el mapa mental',topic:'orientación territorial',brief:'Visitá río, centro, chacras, bardas y periferia.',learn:['Villa Pelón puede entenderse como lugares conectados.','Orientarse ayuda a comprender cómo funciona un territorio.'],reward:700},
{id:'m10',title:'Antes de ser un pueblo',topic:'síntesis histórica',brief:'Reuní tus registros y conversá con tres vecinos.',learn:['El territorio existía antes de la configuración del pueblo.','La historia se construye cruzando paisaje, memoria, documentos y voces.','Ahora podés explicar Villa Pelón como territorio, no solamente como mapa.'],reward:1000}
];
V.campaign={version:'V87.10.0',missions};
function state(){const s=S();if(!s)return null;s.campaign=s.campaign||{active:null,completed:[],records:[]};return s}
function current(){const s=state();return s?.campaign.active?missions.find(m=>m.id===s.campaign.active):null}
function done(id){const s=state();return !!s&&s.campaign.completed.includes(id)}
function say(t,lines){if(V.openDialogue)V.openDialogue(t,lines);else{const b=document.getElementById('dialogue');if(!b)return;b.classList.remove('hidden');document.getElementById('speaker').textContent=t;document.getElementById('dialogueText').textContent=lines.join(' ')}}
function save(){V.saveGame?.();try{const s=state();localStorage.setItem('villa_pelon_save',JSON.stringify(s))}catch(_){} }
function start(id){const s=state(),m=missions.find(x=>x.id===id);if(!s||!m||done(id))return false;if(s.campaign.active&&s.campaign.active!==id){say('CAMPAÑA',['Primero terminá la misión activa.']);return false}s.campaign.active=id;say('MISIÓN '+id.slice(1),[m.title,m.brief,'Tema: '+m.topic+'.',m.learn[0],m.learn[1]||'']);save();ui();return true}
function finish(id,record){const s=state(),m=missions.find(x=>x.id===id);if(!s||!m||s.campaign.active!==id)return false;s.campaign.completed.push(id);s.campaign.active=null;s.money+=m.reward;if(record)s.campaign.records.push(record);say('MISIÓN COMPLETADA',[m.title,'Aprendiste: '+m.topic+'.',m.learn.join(' '),'Recompensa: $'+m.reward.toLocaleString('es-AR')+'.']);save();ui();return true}
function ui(){const m=current(),el=document.getElementById('questText');if(!el)return;el.textContent=m?(m.id.toUpperCase()+' · '+m.title+' — '+m.brief):(missions.find(x=>!done(x.id))?.title||'Campaña completada · exploración libre.')}
V.startCampaignMission=start;V.finishCampaignMission=finish;V.getCampaignCurrent=current;V.getCampaignLessons=()=>missions;
ui();console.info('[Villa Pelón] V87.10 campaña educativa activa');
})();