/* VILLA PELÓN V151 — ATLAS VIVO DE HISTORIA + ESTÉTICA + APRENDIZAJE
   Capa de contenido. No modifica geometría, edificios, rutas, río ni puentes.
   Convierte cada misión completada en una pieza de conocimiento y hace visible
   la progresión narrativa sin crear un segundo motor.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const S=V.gameState||(V.gameState={});
const M=V.missions||(V.missions={});
const A=V.storyAtlas=V.storyAtlas||{};
A.version='151.0';A.geometry='SEALED_V138';A.purpose='aprender Villa Pelón jugando';
A.acts=[
 {id:'llegada',title:'I · MIRAR',subtitle:'Primero aprendés a orientarte.',color:'#d7bd83'},
 {id:'huellas',title:'II · ESCUCHAR',subtitle:'Después descubrís que cada lugar tiene una voz.',color:'#aebd86'},
 {id:'camino',title:'III · RECORRER',subtitle:'El territorio empieza a contar su propia historia.',color:'#7fa6ad'},
 {id:'memoria',title:'IV · COMPRENDER',subtitle:'Finalmente unís las piezas y aprendés a investigar.',color:'#c78d68'}
];
A.lessons={
 welcome:{act:'llegada',title:'El pueblo como escenario',text:'Villa Pelón no se presenta como un decorado: la idea es observar caminos, lugares, personas y pequeños trabajos para empezar a leer el territorio.',kind:'concepto'},
 memory_01:{act:'llegada',title:'Memoria y evidencia',text:'Una historia puede comenzar con un recuerdo. Pero cuando queremos afirmar un hecho, conviene preguntar de dónde sale el dato y cómo podemos contrastarlo.',kind:'método'},
 name_01:{act:'huellas',title:'Los nombres también cuentan',text:'Un nombre puede guardar capas de geografía, familias, migraciones y memoria. La misión no busca que memorices una respuesta: busca que aprendas a hacer preguntas.',kind:'identidad'},
 community_01:{act:'huellas',title:'Un pueblo tiene muchas voces',text:'Dos personas pueden recordar un mismo lugar de manera diferente. Esa diferencia no es un error: es una pista para investigar.',kind:'memoria oral'},
 school_01:{act:'huellas',title:'La escuela como memoria',text:'Una escuela puede conservar fotografías, nombres, actos, cuadernos y recuerdos. El jugador aprende a distinguir entre testimonio y documento.',kind:'patrimonio'},
 water_01:{act:'camino',title:'Agua, tierra y producción',text:'Para entender un paisaje productivo hay que mirar el agua, los caminos, las parcelas y las personas que trabajan. El territorio funciona como una red.',kind:'territorio'},
 production_01:{act:'camino',title:'Producir también es construir identidad',text:'Fruta, chacras, bodegas y oficios no son solamente economía: también forman parte de la imagen que una comunidad construye sobre sí misma.',kind:'producción'},
 pelon_01:{act:'camino',title:'El pelón como memoria productiva',text:'La celebración del pelón permite conectar producción, trabajo rural y cultura. El juego separa el dato histórico de las escenas ficticias de sus personajes.',kind:'cultura'},
 oral_01:{act:'huellas',title:'Escuchar antes de concluir',text:'Una entrevista o una charla puede descubrir una pista valiosa. Pero escuchar no significa convertir automáticamente una versión en verdad histórica.',kind:'método'},
 archive_01:{act:'memoria',title:'Aprender a leer fuentes',text:'Una fuente institucional, una cronología periodística, una fotografía y un testimonio oral sirven para preguntas distintas. Investigar es saber qué puede responder cada una.',kind:'investigación'},
 dni_01:{act:'camino',title:'Las pequeñas acciones también cuentan',text:'Devolver un objeto perdido no cambia la historia de un pueblo, pero muestra algo esencial: un territorio también está hecho de vínculos cotidianos.',kind:'convivencia'},
 picada21_memory:{act:'camino',title:'Caminar para comprender',text:'Llegar hasta un lugar alejado cambia la escala del mapa. El jugador empieza a entender que pueblo, campo, agua y caminos forman un mismo territorio.',kind:'territorio'},
 founding_01:{act:'memoria',title:'Una fecha necesita contexto',text:'Una fecha de creación, una puesta en funcionamiento institucional y el crecimiento posterior pueden ser acontecimientos diferentes. La cronología debe explicarlos, no mezclarlos.',kind:'historia'},
 irrigation_02:{act:'memoria',title:'El agua transforma paisajes',text:'La secuencia de las bocatomas permite formular una pregunta histórica: ¿qué cambió en el territorio después? La respuesta requiere conectar varias evidencias.',kind:'territorio'},
 school_02:{act:'memoria',title:'Guardar no es lo mismo que recordar',text:'Un archivo escolar puede ayudar a comprobar un recuerdo. La investigación mejora cuando el testimonio y el documento se ponen en diálogo.',kind:'patrimonio'},
 worker_01:{act:'memoria',title:'El trabajo deja huellas',text:'La historia local también se construye con trabajadores, productores y oficios. Mirar esas tareas permite comprender cómo se sostiene una comunidad.',kind:'trabajo'},
 map_01:{act:'memoria',title:'Un mapa es una pregunta',text:'Un mapa permite relacionar agua, caminos, viviendas, producción y lugares de memoria. También hay que preguntar quién lo hizo y cuándo.',kind:'cartografía'},
 bridges_01:{act:'camino',title:'El río organiza el viaje',text:'El agua no está puesta para decorar: los puentes explican cómo una ruta continúa y cómo se relacionan sectores diferentes del territorio.',kind:'geografía'},
 research_01:{act:'memoria',title:'Tres fuentes, una investigación',text:'Cuando una pregunta cruza memoria oral, cronología y documentación institucional, el jugador deja de repetir datos y empieza a investigar.',kind:'investigación'},
 history_01:{act:'memoria',title:'Tu primera investigación',text:'La regla final del primer ciclo es sencilla: AFIRMACIÓN → FUENTE → CONTRASTE → CONCLUSIÓN. Lo que todavía no sabés también forma parte de una buena investigación.' ,kind:'método'},
 free_explore:{act:'memoria',title:'Ahora empieza el verdadero juego',text:'Completaste el primer atlas. Ya no mirás Villa Pelón igual: reconocés zonas, recorridos, personajes, fuentes y preguntas. Las próximas historias pueden profundizar cada una de esas capas.',kind:'cierre'}
};
A.visual={
 markers:[
  {x:1120,y:690,label:'PLAZA',act:'llegada'},
  {x:830,y:1010,label:'RADIO',act:'huellas'},
  {x:430,y:520,label:'ESCUELA',act:'huellas'},
  {x:5000,y:910,label:'RIEGO',act:'camino'},
  {x:5900,y:1460,label:'PRODUCCIÓN',act:'camino'},
  {x:7350,y:2150,label:'PICADA 21',act:'camino'},
  {x:2450,y:1460,label:'MAPA',act:'memoria'}
 ],
 draw(ctx){
  const cam=.82, w=innerWidth,h=innerHeight,s=V.gameState||{};
  const sx=(x)=>(x-(+s.x||0))*cam+w/2, sy=(y)=>(y-(+s.y||0))*cam+h/2;
  const buildings=V.worldGeometry?.buildings||[];
  const blocked=(x,y)=>buildings.some(b=>x>b.x-45&&x<b.x+b.w+45&&y>b.y-45&&y<b.y+b.h+45);
  ctx.save();
  this.markers.forEach((m,i)=>{
   if(blocked(m.x,m.y))return;
   const x=sx(m.x),y=sy(m.y);if(x<-100||x>w+100||y<-60||y>h+60)return;
   const unlocked=A.progress>=i?1:.35;
   ctx.globalAlpha=.32*unlocked;ctx.fillStyle='#d9bf83';ctx.fillRect(Math.round(x-3),Math.round(y-3),7,7);
   ctx.globalAlpha=.8*unlocked;ctx.fillStyle='#efe0b0';ctx.font='700 7px monospace';ctx.textAlign='center';ctx.fillText(m.label,x,y-8);
  });
  ctx.restore();
 }
};
function save(){try{localStorage.setItem('villa-pelon-story-atlas',JSON.stringify({progress:A.progress||0,seen:A.seen||{},facts:A.facts||[]}))}catch(e){}}
function load(){try{const d=JSON.parse(localStorage.getItem('villa-pelon-story-atlas')||'{}');A.progress=Number(d.progress)||0;A.seen=d.seen||{};A.facts=Array.isArray(d.facts)?d.facts:[]}catch(e){A.progress=0;A.seen={};A.facts=[]}}
load();
function currentLesson(){const id=S.missionId||'welcome';return A.lessons[id]||A.lessons.free_explore}
function notify(id){const l=A.lessons[id];if(!l)return;A.seen[id]=true;A.progress=Math.min(Object.keys(A.lessons).length,A.progress+1);A.facts.push({id,title:l.title,act:l.act,day:S.day||1});save();
 const toast=document.getElementById('missionToast');if(toast){toast.textContent='CONOCIMIENTO DESBLOQUEADO · '+l.title;toast.classList.add('show');clearTimeout(A.toast);A.toast=setTimeout(()=>toast.classList.remove('show'),3000)}
 window.dispatchEvent(new CustomEvent('villa-pelon-knowledge-unlocked',{detail:{id,lesson:l,progress:A.progress,total:Object.keys(A.lessons).length}}));
}
const originalComplete=M.completeStep;
if(typeof originalComplete==='function'&&!M.__v151Wrapped){M.__v151Wrapped=true;M.completeStep=function(state,key){const before=state.missionId;const result=originalComplete.call(M,state,key);if(result?.complete){notify(before);state.storyAtlasProgress=A.progress;state.storyAct=A.lessons[before]?.act||'memoria'}return result}}
const originalStatus=M.status;
if(typeof originalStatus==='function'&&!M.__v151Status){M.__v151Status=true;M.status=function(state){const out=originalStatus.call(M,state);const l=A.lessons[out.id];if(l){out.lesson=l.title;out.act=l.act;out.knowledge=A.progress}return out}}
function inject(){if(document.getElementById('storyAtlasPanel'))return;const p=document.createElement('aside');p.id='storyAtlasPanel';p.innerHTML='<div class="atlas-head"><b>CUADERNO DE VILLA PELÓN</b><button id="atlasClose" type="button">×</button></div><div class="atlas-act" id="atlasAct"></div><h3 id="atlasTitle">La historia se descubre jugando</h3><p id="atlasText">Completá misiones para desbloquear conocimientos sobre el pueblo, el territorio y sus memorias.</p><div class="atlas-progress"><span id="atlasBar"></span></div><small id="atlasCount"></small>';document.body.appendChild(p);const close=p.querySelector('#atlasClose');close?.addEventListener('click',()=>p.classList.remove('show'));window.addEventListener('villa-pelon-knowledge-unlocked',e=>{const l=e.detail.lesson;document.getElementById('atlasAct').textContent=(A.acts.find(x=>x.id===l.act)?.title)||'ATLAS';document.getElementById('atlasTitle').textContent=l.title;document.getElementById('atlasText').textContent=l.text;document.getElementById('atlasBar').style.width=Math.round((e.detail.progress/e.detail.total)*100)+'%';document.getElementById('atlasCount').textContent='Conocimiento desbloqueado: '+e.detail.progress+' / '+e.detail.total;p.classList.add('show');setTimeout(()=>p.classList.remove('show'),6500)});}
inject();
if(V.visualAuthority){const old=V.visualAuthority.drawContent;V.visualAuthority.drawContent=function(ctx,meta){if(typeof old==='function')old.call(this,ctx,meta);A.visual.draw(ctx)}}
A.lesson=currentLesson;A.getProgress=()=>({progress:A.progress,total:Object.keys(A.lessons).length,seen:Object.keys(A.seen).filter(k=>A.seen[k]),act:A.lessons[S.missionId]?.act||'memoria'});
V.runtimeAudit=Object.assign(V.runtimeAudit||{},{storyAtlas:true,storyAtlasVersion:'151.0',knowledgeProgress:A.progress,geometryLocked:true});
M.content=M.content||{};M.content.atlas='V151';M.content.learning='progressive';
window.addEventListener('villa-pelon-mission',()=>{S.storyAtlasProgress=A.progress});
window.dispatchEvent(new CustomEvent('villa-pelon-story-atlas-ready',{detail:{version:'151.0',geometryLocked:true,lessons:Object.keys(A.lessons).length}}));
})();
