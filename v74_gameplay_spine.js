/* VILLA PELÓN V74 — COLUMNA VERTEBRAL DE JUEGO
   Objetivo: convertir la exploración en juego real sin perder el norte histórico.
   Regla: las misiones avanzan por ACCIÓN/INTERACCIÓN, no por caminar cerca de una coordenada.
   La historia se presenta como investigación: no se inventan hechos históricos. */
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={}),s=V.gameState;if(!s)return;

/* Congelamos los disparadores automáticos V72/V73 y dejamos un único progreso V74. */
const legacyQuest=Number.isFinite(s.historyQuest)?s.historyQuest:0;
if(!Number.isFinite(s.v74Quest))s.v74Quest=Math.max(0,Math.min(21,legacyQuest));
s.historyQuest=21;
s.v74Seen=Array.isArray(s.v74Seen)?s.v74Seen:[];

const missions=[
 {id:0,title:'Llegar y observar',text:'Explorá el núcleo del pueblo y hablá con una persona.',kind:'talk',names:['Marta','Lucía','Nico','Raúl','Pedro']},
 {id:1,title:'El nombre del lugar',text:'Encontrá el cartel de entrada y activá la pista histórica.',kind:'landmark',x:1120,y:560,r:150},
 {id:2,title:'La tierra y el agua',text:'Llegá a las chacras y observá el vínculo entre producción y territorio.',kind:'landmark',x:3800,y:820,r:150},
 {id:3,title:'Frutales',text:'Interactuá con un sector de frutales para registrar la producción.',kind:'orchard',x:4050,y:820,r:150},
 {id:4,title:'El trabajo rural',text:'Realizá una changa en el galpón y obtené tu primer registro de trabajo.',kind:'item',item:'Cajón de cosecha'},
 {id:5,title:'La Fiesta del Pelón',text:'Investigá el mural y guardá la pista cultural.',kind:'landmark',x:2200,y:700,r:150},
 {id:6,title:'La memoria escolar',text:'Entrá en la escuela y conversá con Lucía.',kind:'building',type:'school'},
 {id:7,title:'La radio',text:'Visitá la radio y escuchá una conversación.',kind:'building',type:'radio'},
 {id:8,title:'El almacén',text:'Comprá un producto cotidiano y conservá el comprobante en tu inventario.',kind:'itemPrefix',prefix:'Compra:'},
 {id:9,title:'Oficios',text:'Interactuá con un trabajador y registrá su oficio.',kind:'npcRole',roles:['trabajo']},
 {id:10,title:'La producción',text:'Entrá en el galpón de cosecha y registrá el espacio productivo.',kind:'landmark',x:3950,y:1500,r:155},
 {id:11,title:'El vino',text:'Visitá una bodega y abrí su ficha de investigación.',kind:'buildingType',type:'winery'},
 {id:12,title:'Las instituciones',text:'Interactuá con una institución del pueblo.',kind:'buildingType',type:'school'},
 {id:13,title:'La ciudad que crece',text:'Cruzá del núcleo urbano hacia el borde rural y hablá con alguien allí.',kind:'boundary'},
 {id:14,title:'El río',text:'Encontrá un puente y cruzalo: el cruce debe ser territorialmente significativo.',kind:'bridge'},
 {id:15,title:'La barda',text:'Explorá el sector de bardas y activá su registro de paisaje.',kind:'landmark',x:7700,y:1300,r:180},
 {id:16,title:'Fiestas y comunidad',text:'Volvé a un punto de encuentro y conversá para reconstruir memoria comunitaria.',kind:'talk',names:['Marta','Lucía','Nico']},
 {id:17,title:'Archivo y fuentes',text:'Abrí el Archivo de Memoria y aprendé a distinguir fuente, testimonio y recuerdo.',kind:'landmark',x:2040,y:430,r:150},
 {id:18,title:'Construir una línea de tiempo',text:'Reuní tres registros históricos y ordenalos antes de continuar.',kind:'records',count:3},
 {id:19,title:'Contárselo a otro',text:'Reuní cinco registros y prepará un relato sin inventar datos.',kind:'records',count:5},
 {id:20,title:'Historia abierta',text:'Llegá al mirador rural: la investigación queda abierta a nuevas fuentes.',kind:'landmark',x:6500,y:3800,r:190}
];
V.v74Missions=missions;

function current(){return missions[s.v74Quest]||null}
function invHas(v){return Array.isArray(s.inventory)&&s.inventory.includes(v)}
function invPrefix(v){return Array.isArray(s.inventory)&&s.inventory.some(x=>String(x).startsWith(v))}
function near(x,y,r){return Math.hypot(s.x-x,s.y-y)<=r}
function nearby(){return typeof V.getNearby==='function'?V.getNearby():null}
function records(){return (s.inventory||[]).filter(x=>String(x).startsWith('Historia · V74')).length}
function bridgeNear(){const bs=V.worldGeometry?.bridges||[];return bs.some(b=>near(b.x+b.w/2,b.y+b.h/2,190))}

function eligible(m,n){
 if(!m)return false;
 switch(m.kind){
  case 'talk':return !!n&&n.name&&m.names.includes(n.name);
  case 'landmark':return near(m.x,m.y,m.r);
  case 'orchard':return near(m.x,m.y,m.r);
  case 'item':return invHas(m.item);
  case 'building':return !!n&&n.type===m.type;
  case 'itemPrefix':return invPrefix(m.prefix);
  case 'npcRole':return !!n&&m.roles.includes(n.role);
  case 'buildingType':return !!n&&n.type===m.type;
  case 'boundary':return s.x>3450&&s.x<3800&&s.y>450&&s.y<1800&&!!n;
  case 'bridge':return bridgeNear();
  case 'records':return records()>=m.count;
  default:return false;
 }
}

function complete(m){
 if(!m||s.v74Seen.includes(m.id))return;
 s.v74Seen.push(m.id);s.v74Quest=Math.min(21,m.id+1);
 const next=current();
 const lines=[
  'Registro incorporado al recorrido.',
  m.text,
  next?'Siguiente: '+next.title:'Completaste la primera campaña de Villa Pelón.'
 ];
 V.addItem?.('Historia · V74 · '+String(m.id+1).padStart(2,'0')+' · '+m.title);
 V.openDialogue?.(m.title,lines);
}

/* Interacción como centro del juego. Se conserva toda la interacción existente. */
const originalInteract=V.interact;
if(typeof originalInteract==='function'&&!V.__v74Interact){
 V.interact=function(){
  const m=current(),n=nearby();
  originalInteract();
  /* Evaluamos después: así una compra, changa o diálogo puede convertirse en evidencia. */
  if(!s.dialogue&&eligible(m,n))complete(m);
  else if(!s.dialogue&&m?.kind==='item'&&invHas(m.item))complete(m);
  else if(!s.dialogue&&m?.kind==='itemPrefix'&&invPrefix(m.prefix))complete(m);
  else if(!s.dialogue&&m?.kind==='records'&&records()>=m.count)complete(m);
 };
 V.__v74Interact=true;
}

/* Marcadores de objetivo: visuales mínimos, pixel-art, sin llenar la pantalla. */
const oldDraw=V.life&&V.life.drawWorld;
if(oldDraw&&!V.life.__v74){
 V.life.drawWorld=function(c){
  oldDraw(c);const m=current();if(!m||m.kind==='item'||m.kind==='itemPrefix'||m.kind==='records')return;
  let x=m.x,y=m.y;
  if(m.kind==='talk'||m.kind==='building'||m.kind==='buildingType'||m.kind==='npcRole'){
   const n=(V.npcs||[]).find(p=>m.names?.includes(p.name)||m.roles?.includes(p.role)||p.role===m.type);if(n){x=n.x;y=n.y}else return;
  }
  if(m.kind==='bridge'){const b=(V.worldGeometry?.bridges||[])[0];if(!b)return;x=b.x+b.w/2;y=b.y+b.h/2}
  if(m.kind==='boundary'){x=3600;y=950}
  c.fillStyle='rgba(216,189,120,.95)';c.fillRect(Math.round(x-5),Math.round(y-34),10,4);c.fillRect(Math.round(x-2),Math.round(y-30),4,10);
  c.fillStyle='rgba(35,31,25,.9)';c.fillRect(Math.round(x-2),Math.round(y-22),4,4);
 };
 V.life.__v74=true;
}

setInterval(()=>{
 const q=document.getElementById('questText');if(!q||!s.started)return;
 const m=current();q.textContent=m?`${String(m.id+1).padStart(2,'0')}/21 · ${m.title} · INTERACTUÁ`:'21/21 · PRIMERA CAMPAÑA COMPLETADA ✓';
},250);

/* Ficha de investigación accesible desde el archivo: diferencia lo que el juego sabe de lo que todavía debe documentar. */
V.v74Evidence={
 rules:[
  'HECHO DOCUMENTADO: solo se incorpora cuando exista una fuente verificable.',
  'TESTIMONIO: se conserva como voz y se identifica como memoria oral.',
  'AMBIENTACIÓN: sirve para jugar, pero no se presenta como hecho histórico.'
 ],
 pendingResearch:['toponimia','origen del asentamiento','transformaciones territoriales','producción y trabajo','instituciones','fiestas y memoria','crecimiento urbano','río y paisaje']
};

V.audit=V.audit||{};V.audit.v74={manualMissionLoop:true,interactionWrapped:!!V.__v74Interact,missions:missions.length===21,evidenceRules:true};
})();
