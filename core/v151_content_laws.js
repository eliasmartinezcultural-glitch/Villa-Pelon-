/* VILLA PELÓN V151 — LEYES DE CONTENIDO Y SELLO NARRATIVO
   Este archivo no modifica geometría ni reemplaza sistemas existentes.
   Define contratos para que futuras intervenciones agreguen contenido sin reconstruir el juego.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const M=V.matrix=V.matrix||{};
const L={version:'151.0',sealed:true,
 laws:{
  geometry:'INMUTABLE_V138',
  runtime:'V150_SINGLE_AUTHORITY',
  visual:'PIXEL_RURAL_PATAGONICO_CANONICAL',
  story:'CONTINUOUS_LEARNING_CANON',
  missions:'PROGRESSIVE_KNOWLEDGE_CANON',
  characters:'PERSISTENT_NPC_CANON',
  evidence:'FACTS_REQUIRE_SOURCE',
  fiction:'FICTION_MUST_BE_IDENTIFIABLE',
  duplication:'NO_PARALLEL_CONTENT_AUTHORITY'
 },
 forbidden:['mover edificios existentes','mover río','mover puentes sellados','crear otra geometría mundial','crear otro sistema de misiones paralelo','crear otro registro de personajes','duplicar atlas/cuaderno','usar ruido visual aleatorio como decoración','presentar ficción como dato histórico','reiniciar la campaña por agregar contenido'],
 contentContract:{mission:['id','chapter','title','description','objectives','reward','next','learns'],objective:['id','type','target','label','knowledge'],knowledge:['id','title','body','source','chapter'],character:['id','name','role','knowledge','relationships','routine','arc'],visual:['zone','motifs','palette','density','priority']},
 progression:{acts:[
  {id:'llegada',title:'La llegada',learns:['orientación','lugares','primeros vínculos']},
  {id:'huellas',title:'Las huellas',learns:['memoria','oficios','identidad','testimonios']},
  {id:'territorio',title:'El territorio',learns:['agua','caminos','ruralidad','producción','río']},
  {id:'memoria',title:'Lo que permanece',learns:['fuentes','historia','patrimonio','investigación']},
  {id:'futuro',title:'Lo que podemos contar',learns:['síntesis','archivo','nuevas preguntas','exploración libre']}
 ],rule:'Cada bloque de misiones debe enseñar algo nuevo y reutilizar al menos un conocimiento anterior.'},
 aesthetic:{zones:{urban:{motifs:['plaza','veredas','carteles','actividad cotidiana'],density:'media'},transition:{motifs:['cercos','árboles','herramientas','caminos'],density:'media-baja'},rural:{motifs:['riego','parcelas','álamos','maquinaria','animales'],density:'baja-media'},river:{motifs:['agua','vegetación ribereña','puentes','espacio abierto'],density:'baja'},picada21:{motifs:['camino','casas pequeñas','parada','horizonte','silencio'],density:'baja'}},rule:'La decoración explica el lugar; no rellena espacio.'},
 characterRule:'Los NPC principales deben recordar conversaciones relevantes, aportar conocimiento distinto y evolucionar por actos. Ningún NPC existe solo para entregar una recompensa.',
 missionRule:'Una misión debe combinar al menos dos de estas funciones cuando sea posible: explorar, conversar, observar, investigar, decidir, entregar, relacionar conocimientos.',
 truthRule:'Todo dato histórico debe llevar fuente en el registro de conocimiento. Las escenas inventadas deben estar marcadas internamente como ficción.',
 seal:{geometryAuthority:'V138',runtimeAuthority:'V150',contentLawAuthority:'V151',nextMutableLayer:'content-and-presentation-only'}
};
V.contentLaws=L;
M.contentLaws={version:'151.0',sealed:true,laws:L.laws,progression:L.progression,aesthetic:L.aesthetic};
V.runtimeAudit=Object.assign(V.runtimeAudit||{},{contentLaws:true,contentLawVersion:'151.0',geometryLocked:true,contentAuthority:'V151',storyAuthority:'V151',missionAuthority:'mission_system+V151'});
document.documentElement.dataset.contentLaws='151';
window.dispatchEvent(new CustomEvent('villa-pelon-content-laws-ready',{detail:{version:'151.0',geometryLocked:true}}));
})();
