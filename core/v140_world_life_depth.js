/* VILLA PELÓN V140 — MUNDO VIVO PROFUNDO
   Capa exclusivamente no estructural: acciones, diálogos, microhistorias y misiones.
   NO modifica geometría, zonas, caminos, río, puentes ni edificios.
*/
(()=>{'use strict';
 const V=window.VillaPelon||(window.VillaPelon={});
 const M=V.missions;
 const C=V.contentV140=V.contentV140||{};
 C.version='140.0';
 C.actions=[
  {id:'talk',label:'Conversar',meaning:'Hablar con una persona y escuchar su mirada.'},
  {id:'observe',label:'Observar',meaning:'Mirar un lugar antes de actuar.'},
  {id:'read',label:'Leer',meaning:'Consultar carteles, fichas, placas o documentos.'},
  {id:'listen',label:'Escuchar',meaning:'Prestar atención a un relato, radio o paisaje sonoro.'},
  {id:'photograph',label:'Fotografiar',meaning:'Registrar un detalle para compararlo después.'},
  {id:'collect',label:'Recoger',meaning:'Tomar un objeto útil para una historia.'},
  {id:'deliver',label:'Entregar',meaning:'Llevar algo a la persona correcta.'},
  {id:'work',label:'Ayudar',meaning:'Resolver una tarea cotidiana del pueblo.'},
  {id:'compare',label:'Contrastar',meaning:'Comparar dos testimonios o una memoria con una fuente.'},
  {id:'rest',label:'Descansar',meaning:'Cambiar el ritmo del día y observar cómo se transforma el pueblo.'},
  {id:'investigate',label:'Investigar',meaning:'Convertir una pregunta en una pequeña investigación.'},
  {id:'discover',label:'Descubrir',meaning:'Encontrar una pista que antes no estaba en tu recorrido.'}
 ];
 C.npcs={
  marta:{role:'vecina',tone:'cálida y práctica',knows:['vida cotidiana','familias','cambios del pueblo']},
  celso:{role:'vecino mayor',tone:'reflexivo',knows:['topónimos','memoria oral','cronologías']},
  nico:{role:'joven del pueblo',tone:'curioso',knows:['lugares cotidianos','rumores que deben verificarse','caminos']},
  lucia:{role:'emprendedora',tone:'directa',knows:['comercio','trabajo','redes comunitarias']},
  julia:{role:'docente',tone:'pedagógica',knows:['escuela','memoria','fuentes']},
  mateo:{role:'trabajador rural',tone:'concreto',knows:['riego','chacra','temporadas']},
  tomas:{role:'productor',tone:'observador',knows:['producción','fruta','trabajo']},
  rosa:{role:'trabajadora rural',tone:'franca',knows:['trabajo','fiestas','familias rurales']},
  raul:{role:'radio local',tone:'conversador',knows:['relatos','entrevistas','voces del pueblo']},
  amalia:{role:'archivista',tone:'metódica',knows:['documentos','fotos','prensa','contraste']}
 };
 C.dialogues={
  marta:{first:['Marta','Acá casi todo tiene una historia, aunque a veces nadie la haya escrito.'],repeat:['Marta','Si querés entender un lugar, primero preguntá y después mirá si la respuesta aparece también en alguna fuente.']},
  celso:{first:['Celso','No confundas lo que alguien recuerda con una fecha comprobada. Las dos cosas pueden ser valiosas, pero cumplen funciones distintas.'],repeat:['Celso','Una buena pregunta vale más que una respuesta apurada. ¿Qué fuente te falta para estar seguro?']},
  nico:{first:['Nico','Yo conozco atajos, pero si venís a investigar, mejor mirá el camino completo. A veces el detalle está donde nadie se detiene.'],repeat:['Nico','Lo escuché decir, sí. Pero eso no significa que sea verdad. ¿Lo verificaste?']},
  lucia:{first:['Lucía','El pueblo también se entiende por cómo trabaja la gente. Un comercio, un taller o una chacra cuentan otra parte de la historia.'],repeat:['Lucía','Si ayudás a alguien, no siempre esperes una recompensa. A veces lo que cambia es lo que aprendés.']},
  julia:{first:['Julia','Una escuela guarda más que clases: nombres, fotografías, actos, cuadernos y recuerdos.'],repeat:['Julia','Cuando una memoria no coincide con otra fuente, no hay que descartarla automáticamente. Hay que investigar.']},
  mateo:{first:['Mateo','El agua parece invisible hasta que falta. Ahí entendés cuánto organiza el territorio.'],repeat:['Mateo','Mirá la tierra, la acequia y el trabajo juntos. Separados cuentan menos.']},
  tomas:{first:['Tomás','La producción no es solamente lo que sale de una planta. También son las manos, los tiempos y las decisiones.'],repeat:['Tomás','Preguntá por el proceso completo. El paisaje productivo tiene muchas capas.']},
  rosa:{first:['Rosa','Hay trabajos que casi nadie fotografía. Eso no significa que no sean parte de la historia.'],repeat:['Rosa','Si querés conocer el campo, vení a mirar cómo empieza y cómo termina una jornada.']},
  raul:{first:['Raúl','La radio sirve para escuchar voces. Después hay que guardar bien quién dijo qué y cuándo.'],repeat:['Raúl','Una entrevista es una fuente. No es automáticamente una verdad absoluta.']},
  amalia:{first:['Amalia','Archivo no significa solamente papeles viejos. Una foto, un mapa o una noticia también pueden ser fuentes.'],repeat:['Amalia','Tu ficha debería responder tres cosas: qué sabés, de dónde lo sabés y qué todavía falta comprobar.']}
 };
 C.microMissions=[
  {id:'daily_water',title:'El turno del agua',chapter:'VIDA COTIDIANA',description:'Ayudá a Mateo con una pequeña tarea y descubrí cómo el riego organiza el día.',objectives:[{id:'mw1',type:'talk',target:'mateo',label:'Preguntale a Mateo qué tarea necesita'},{id:'mw2',type:'inspect',target:'irrigation_marker',label:'Observá el punto de riego'},{id:'mw3',type:'talk',target:'mateo',label:'Contale qué observaste'}],reward:1800},
  {id:'lost_tool',title:'La herramienta perdida',chapter:'VIDA COTIDIANA',description:'Una herramienta aparece lejos de donde debería estar. Resolverlo requiere preguntar antes de entregar.',objectives:[{id:'lt1',type:'inspect',target:'lost_tool',label:'Examiná la herramienta'},{id:'lt2',type:'talk',target:'rosa',label:'Preguntale a Rosa de quién puede ser'},{id:'lt3',type:'deliver',target:'lost_tool_owner',label:'Devolvé la herramienta'}],reward:2200},
  {id:'photo_question',title:'Una foto, dos recuerdos',chapter:'INVESTIGACIÓN',description:'Una fotografía despierta dos recuerdos distintos. Tu tarea es registrar ambos sin decidir demasiado rápido.',objectives:[{id:'pq1',type:'inspect',target:'photo_memory',label:'Observá la fotografía'},{id:'pq2',type:'talk',target:'celso',label:'Escuchá el primer recuerdo'},{id:'pq3',type:'talk',target:'marta',label:'Escuchá el segundo recuerdo'}],reward:2600},
  {id:'radio_voice',title:'Una voz al aire',chapter:'COMUNIDAD',description:'Prepará una pequeña historia para radio separando relato, opinión y dato comprobable.',objectives:[{id:'rv1',type:'talk',target:'raul',label:'Consultá a Raúl'},{id:'rv2',type:'inspect',target:'archive',label:'Buscá una fuente de apoyo'},{id:'rv3',type:'talk',target:'raul',label:'Presentá tu historia'}],reward:3000},
  {id:'school_photo',title:'La foto de la escuela',chapter:'MEMORIA',description:'Una imagen escolar permite reconstruir una escena sin inventar lo que no sabemos.',objectives:[{id:'sp1',type:'inspect',target:'school_archive',label:'Observá la fotografía escolar'},{id:'sp2',type:'talk',target:'julia',label:'Preguntá qué se puede afirmar'},{id:'sp3',type:'inspect',target:'school_archive_2',label:'Registrá qué falta comprobar'}],reward:3200},
  {id:'rural_day',title:'Una jornada rural',chapter:'TRABAJO',description:'Acompañá una tarea del campo y aprendé a mirar el trabajo como parte del territorio.',objectives:[{id:'rd1',type:'talk',target:'rosa',label:'Preguntá cómo empieza la jornada'},{id:'rd2',type:'talk',target:'mateo',label:'Compará otra tarea rural'},{id:'rd3',type:'inspect',target:'worker_marker',label:'Registrá lo observado'}],reward:3500},
  {id:'bridge_story',title:'El camino que cruza',chapter:'TERRITORIO',description:'Llegá a un puente y reconstruí por qué los caminos necesitan adaptarse al paisaje.',objectives:[{id:'bs1',type:'reach',target:'bridge',label:'Llegá al puente'},{id:'bs2',type:'inspect',target:'territory_map',label:'Compará puente y caminos en el mapa'},{id:'bs3',type:'talk',target:'nico',label:'Preguntale a Nico por el recorrido'}],reward:2800},
  {id:'picada_listen',title:'La historia de Picada 21',chapter:'PICADA 21',description:'Llegá a Picada 21, escuchá y anotá una memoria sin convertirla automáticamente en dato histórico.',objectives:[{id:'pl1',type:'reach',target:'picada21',label:'Llegá a Picada 21'},{id:'pl2',type:'inspect',target:'picada21_memory',label:'Escuchá y registrá el testimonio'},{id:'pl3',type:'inspect',target:'archive_final',label:'Marcá qué parte necesita fuente'}],reward:5000}
 ];
 C.attach=()=>{
  if(!M||!Array.isArray(M.list))return false;
  if(M.list.some(x=>x.id==='v140_daily_water'))return true;
  const last=M.list.find(x=>x.id==='free_explore');
  const deep=C.microMissions.map((x,n)=>({id:'v140_'+x.id,chapter:x.chapter,title:x.title,description:x.description,objectives:x.objectives,reward:x.reward,next:n<C.microMissions.length-1?'v140_'+C.microMissions[n+1].id:'free_explore'}));
  if(last)last.next=deep[0].id;
  M.list.push(...deep);return true;
 };
 C.getDialogue=(id,repeat=false)=>{const d=C.dialogues[id];if(!d)return null;const a=repeat?d.repeat:d.first;return{speaker:a[0],text:a[1]}};
 C.randomDaily=day=>C.microMissions[(Math.max(1,+day||1)-1)%C.microMissions.length];
 C.attach();
 window.dispatchEvent(new CustomEvent('villa-pelon-depth-ready',{detail:{version:C.version,actions:C.actions.length,npcs:Object.keys(C.npcs).length,microMissions:C.microMissions.length}}));
})();
