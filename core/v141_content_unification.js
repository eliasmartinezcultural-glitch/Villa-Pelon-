/* VILLA PELÓN V141 — UNIFICACIÓN DE CONTENIDO
   Autoridad única para la capa no estructural.
   No crea motor, RAF, renderer ni modifica geometría.
*/
(()=>{'use strict';
 const V=window.VillaPelon||(window.VillaPelon={});
 const S=V.gameState||(V.gameState={});
 const M=V.missions;
 const C=V.contentV141=V.contentV141||{};
 C.version='141.0';
 C.rules={
  structural:false,
  geometry:'SEALED_V138',
  fictionLabel:'Las escenas y personajes inventados se presentan como ficción.',
  historyRule:'Los datos históricos deben conservar su fuente o quedar marcados como memoria/testimonio.',
  interactionOrder:['misión activa','NPC','objeto','lugar'],
  dialogueOrder:['estado de misión','primera conversación','conversación repetida','contexto horario']
 };
 C.actionTypes={
  talk:'Conversar',observe:'Observar',read:'Leer',listen:'Escuchar',photograph:'Fotografiar',
  collect:'Recoger',deliver:'Entregar',work:'Ayudar',compare:'Contrastar',rest:'Descansar',
  investigate:'Investigar',discover:'Descubrir'
 };
 C.npcProfiles={
  marta:{role:'vecina',tone:'cálida y práctica',first:['Marta','Acá casi todo tiene una historia, aunque a veces nadie la haya escrito.'],repeat:['Marta','Si querés entender un lugar, primero preguntá y después mirá si la respuesta aparece también en alguna fuente.']},
  celso:{role:'vecino mayor',tone:'reflexivo',first:['Celso','No confundas lo que alguien recuerda con una fecha comprobada. Las dos cosas pueden ser valiosas, pero cumplen funciones distintas.'],repeat:['Celso','Una buena pregunta vale más que una respuesta apurada. ¿Qué fuente te falta para estar seguro?']},
  nico:{role:'joven del pueblo',tone:'curioso',first:['Nico','Yo conozco atajos, pero si venís a investigar, mejor mirá el camino completo. A veces el detalle está donde nadie se detiene.'],repeat:['Nico','Lo escuché decir, sí. Pero eso no significa que sea verdad. ¿Lo verificaste?']},
  lucia:{role:'emprendedora',tone:'directa',first:['Lucía','El pueblo también se entiende por cómo trabaja la gente. Un comercio, un taller o una chacra cuentan otra parte de la historia.'],repeat:['Lucía','Si ayudás a alguien, no siempre esperes una recompensa. A veces lo que cambia es lo que aprendés.']},
  julia:{role:'docente',tone:'pedagógica',first:['Julia','Una escuela guarda más que clases: nombres, fotografías, actos, cuadernos y recuerdos.'],repeat:['Julia','Cuando una memoria no coincide con otra fuente, no hay que descartarla automáticamente. Hay que investigar.']},
  mateo:{role:'trabajador rural',tone:'concreto',first:['Mateo','El agua parece invisible hasta que falta. Ahí entendés cuánto organiza el territorio.'],repeat:['Mateo','Mirá la tierra, la acequia y el trabajo juntos. Separados cuentan menos.']},
  tomas:{role:'productor',tone:'observador',first:['Tomás','La producción no es solamente lo que sale de una planta. También son las manos, los tiempos y las decisiones.'],repeat:['Tomás','Preguntá por el proceso completo. El paisaje productivo tiene muchas capas.']},
  rosa:{role:'trabajadora rural',tone:'franca',first:['Rosa','Hay trabajos que casi nadie fotografía. Eso no significa que no sean parte de la historia.'],repeat:['Rosa','Si querés conocer el campo, vení a mirar cómo empieza y cómo termina una jornada.']},
  raul:{role:'radio local',tone:'conversador',first:['Raúl','La radio sirve para escuchar voces. Después hay que guardar bien quién dijo qué y cuándo.'],repeat:['Raúl','Una entrevista es una fuente. No es automáticamente una verdad absoluta.']},
  amalia:{role:'archivista',tone:'metódica',first:['Amalia','Archivo no significa solamente papeles viejos. Una foto, un mapa o una noticia también pueden ser fuentes.'],repeat:['Amalia','Tu ficha debería responder tres cosas: qué sabés, de dónde lo sabés y qué todavía falta comprobar.']}
 };
 C.contextLines={
  morning:['Buen día. El pueblo recién empieza a moverse.','Todavía hay tiempo para recorrer antes de que cambien las tareas.'],
  midday:['A esta hora el movimiento se concentra en las tareas del día.','El calor y el trabajo cambian el ritmo del pueblo.'],
  evening:['La tarde baja y algunas tareas empiezan a cerrarse.','Es un buen momento para volver sobre lo que viste.'],
  night:['El pueblo se queda más quieto.','Algunas historias se entienden mejor cuando termina el movimiento del día.']
 };
 function hour(){return ((+S.minutes||480)/60)%24}
 function period(){const h=hour();return h<11?'morning':h<16?'midday':h<20?'evening':'night'}
 function missionDone(id){return !!S.missionFlags?.[id]}
 function missionContext(id){
  const current=M?.current?.(S); if(!current)return null;
  if(current.id==='water_01'||current.id==='v140_daily_water')return id==='mateo'?'Estás siguiendo una historia sobre agua y trabajo.':'';
  if(current.id==='school_01'||current.id==='v140_school_photo')return id==='julia'?'La conversación está relacionada con memoria escolar y fuentes.':'';
  if(current.id==='picada21_memory'||current.id==='v140_picada_listen')return id==='nico'||id==='celso'?'La investigación te lleva a separar memoria de evidencia.':'';
  return null;
 }
 function linesFor(n){
  const p=C.npcProfiles[n.id];if(!p)return n.lines||['Este vecino tiene algo para contarte.'];
  const ctx=missionContext(n.id);
  const out=[];
  if(ctx)out.push(ctx);
  if(!missionDone('welcome')&&n.id==='marta')out.push('Primero conocé el pueblo. Después vas a empezar a descubrir sus historias.');
  out.push(...(S.flags?.['spoke_'+n.id]?[p.repeat[1]]:[p.first[1]]));
  if(period()==='night')out.push(C.contextLines.night[1]);
  else if(period()==='morning')out.push(C.contextLines.morning[1]);
  return out;
 }
 function enrichNPCs(){
  if(!Array.isArray(V.npcs))return 0;
  let count=0;
  V.npcs.forEach(n=>{
   if(!n||!n.id||!C.npcProfiles[n.id])return;
   n.role=C.npcProfiles[n.id].role;n.tone=C.npcProfiles[n.id].tone;n.contentAuthority='V141';
   try{Object.defineProperty(n,'lines',{configurable:true,get:()=>linesFor(n)})}catch(_){n.lines=linesFor(n)}
   n.n=String(n.n||n.id).replace(/^./,x=>x.toUpperCase());count++;
  });
  return count;
 }
 function normalizeMissions(){
  if(!Array.isArray(M?.list))return 0;
  let changed=0;
  const replacements={lost_tool:'rural_tools',photo_memory:'territory_map',lost_tool_owner:'worker_marker'};
  M.list.forEach(m=>m.objectives?.forEach(o=>{if(replacements[o.target]){o.target=replacements[o.target];changed++}}));
  return changed;
 }
 C.state=()=>({version:C.version,period:period(),hour:hour(),npcCount:Array.isArray(V.npcs)?V.npcs.length:0,missions:Array.isArray(M?.list)?M.list.length:0,geometryLocked:true});
 C.normalizeMissions=normalizeMissions;
 C.enrichNPCs=enrichNPCs;
 normalizeMissions();
 const npcs=enrichNPCs();
 window.addEventListener('villa-pelon-mission',()=>{S.flags=S.flags||{};S.flags.lastMissionUpdate=Date.now()},{passive:true});
 window.addEventListener('villa-pelon-intro-finished',()=>{S.flags=S.flags||{};S.flags.introCompleted=true},{passive:true});
 window.dispatchEvent(new CustomEvent('villa-pelon-content-unified',{detail:{version:C.version,npcs,missions:Array.isArray(M?.list)?M.list.length:0,geometryLocked:true}}));
})();
