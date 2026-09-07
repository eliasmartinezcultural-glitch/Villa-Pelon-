/* VILLA PELÓN V72 — expansión integral: 8200x4200, río/puentes, ruralidad, bodegas,
   21 misiones educativas, intro interactiva y ajustes de presentación. */
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const state=V.gameState;
const W=V.world||{w:3200,h:2000};
W.w=8200; W.h=4200; V.world=W;
const G=V.worldGeometry||(V.worldGeometry={buildings:[]});
G.buildings=Array.isArray(G.buildings)?G.buildings:[];

/* ---------- MAPA 8200 ---------- */
const roads=[
 {x:70,y:585,w:3520,h:54},{x:70,y:955,w:3500,h:54},{x:1050,y:150,w:54,h:2100},
 {x:2000,y:150,w:54,h:2350},{x:650,y:1390,w:2950,h:54},{x:3550,y:620,w:900,h:46},
 {x:4200,y:1050,w:1900,h:50},{x:4300,y:1800,w:2050,h:50},{x:4700,y:2700,w:1800,h:50},
 {x:3650,y:3300,w:3000,h:50},{x:4300,y:600,w:50,h:3200},{x:6100,y:600,w:50,h:3300}
];
const river={x:7000,w:360,y:80,h:4040};
const bridges=[{x:6870,y:760,w:620,h:105},{x:6870,y:1860,w:620,h:105},{x:6870,y:3020,w:620,h:105},{x:6870,y:3740,w:620,h:105}];
const orchards=[];
for(let i=0;i<70;i++)orchards.push({x:3650+(i%14)*170,y:700+Math.floor(i/14)*420,type:i%3===0?'manzana':i%3===1?'pera':'pelon'});
const ruralBuildings=[
 [3900,760,320,180,'GALPÓN RURAL','rural'],[4500,760,360,200,'CHACRA','rural'],[5200,760,340,190,'VIVIENDA RURAL','home'],
 [5750,1250,390,210,'BODEGA DEL OASIS','winery'],[3950,1500,330,190,'GALPÓN DE COSECHA','rural'],[4850,1500,330,190,'CHACRA','rural'],
 [5550,2150,420,220,'BODEGA DEL RÍO','winery'],[4000,2250,330,190,'VIVIENDA RURAL','home'],[4750,2850,380,210,'BODEGA DE LA COLINA','winery'],
 [5550,3300,340,190,'GALPÓN','rural'],[6250,3350,360,200,'PUESTO RURAL','rural'],[7420,620,360,200,'PUESTO DEL ESTE','rural'],
 [7480,2050,340,190,'PUESTO DE BARDA','rural'],[7480,3250,360,190,'REFUGIO','rural']
];
ruralBuildings.forEach(([x,y,w,h,label,type])=>{if(!G.buildings.some(b=>b.x===x&&b.y===y))G.buildings.push({x,y,w,h,label,type})});

const overlaps=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
/* Regla territorial: ningún edificio nuevo puede ocupar calzada ni río. */
G.buildings=G.buildings.filter(b=>!roads.some(r=>overlaps(b,r)) && !(b.x+b.w>river.x-20&&b.x<river.x+river.w+20));
G.roads=roads; G.river=river; G.bridges=bridges; G.orchards=orchards;

function drawMap(c){
 c.fillStyle='#b9a27c';c.fillRect(0,0,W.w,W.h);
 /* urbano */ c.fillStyle='#8e8875';c.fillRect(0,0,3600,1900);
 /* rural */ c.fillStyle='#a7a06c';c.fillRect(3500,0,3500,W.h);
 c.fillStyle='#c0a875';c.fillRect(3600,1900,3400,2300);
 /* bardas */ c.fillStyle='#8c735a';c.fillRect(7600,0,600,4200);
 /* río */ c.fillStyle='#416f78';c.fillRect(river.x,river.y,river.w,river.h);
 for(let y=river.y+25;y<river.y+river.h;y+=55){c.fillStyle='rgba(205,230,220,.22)';c.fillRect(river.x+25+(y%90),y,170,3);c.fillRect(river.x+210-(y%70),y+17,110,2)}
 roads.forEach(r=>{c.fillStyle='#66594d';c.fillRect(r.x,r.y,r.w,r.h);c.fillStyle='#b49a70';if(r.w>100){for(let x=r.x+20;x<r.x+r.w;x+=55)c.fillRect(x,r.y+r.h/2-2,26,4)}});
 bridges.forEach(b=>{c.fillStyle='#8d6b4b';c.fillRect(b.x,b.y,b.w,b.h);c.fillStyle='#c6a477';for(let x=b.x+10;x<b.x+b.w;x+=42)c.fillRect(x,b.y+8,22,b.h-16)});
 /* árboles de chacra */ orchards.forEach(o=>{c.fillStyle='#624735';c.fillRect(o.x-3,o.y+8,6,18);c.fillStyle=o.type==='pelon'?'#6e8f47':o.type==='pera'?'#587b48':'#477347';c.fillRect(o.x-12,o.y-4,24,16);c.fillRect(o.x-7,o.y-12,14,10)});
 /* cercos rurales */ for(let x=3650;x<6900;x+=190){c.fillStyle='#795d42';for(let y=520;y<3600;y+=190)c.fillRect(x,y,3,18)}
 /* barda */ for(let i=0;i<22;i++){c.fillStyle=i%2?'#75604e':'#806a55';c.fillRect(7700+i%4*35,100+i*175,90,28)}
}
const oldLifeDraw=V.life&&V.life.drawWorld;
if(V.life&&oldLifeDraw&&!V.life.__v72){V.life.drawWorld=(c)=>{drawMap(c);oldLifeDraw(c)};V.life.__v72=true}

/* ---------- REGLA RÍO: solo puentes ---------- */
function onBridge(x,y){return bridges.some(b=>x>b.x-22&&x<b.x+b.w+22&&y>b.y-22&&y<b.y+b.h+22)}
function enforceRiver(){if(!state)return;const inRiver=state.x>river.x-18&&state.x<river.x+river.w+18&&state.y>river.y&&state.y<river.y+river.h;if(inRiver&&!onBridge(state.x,state.y)){state.x=river.x-35;}}
setInterval(enforceRiver,80);

/* ---------- 21 MISIONES: aprendizaje progresivo ---------- */
const missions=[
 ['01 · Llegar y observar','Recorré la plaza y ubicá escuela, almacén y radio.','El pueblo se entiende primero caminándolo.'],
 ['02 · El nombre del lugar','Encontrá el cartel de entrada y abrí el archivo de memoria.','Aprendé a distinguir nombre del lugar, topónimo y relato popular.'],
 ['03 · La tierra y el agua','Llegá al sector de chacras sin cruzar el río por fuera de un puente.','El oasis de riego es una clave para comprender la producción local.'],
 ['04 · Frutales','Visitá tres hileras de frutales.','Reconocé manzana, pera y pelón como parte del paisaje productivo.'],
 ['05 · El trabajo rural','Hacé una changa en un galpón.','Conocé la relación entre temporada, cosecha y vida cotidiana.'],
 ['06 · La Fiesta del Pelón','Encontrá el mural de la fiesta.','La Fiesta Provincial del Pelón forma parte de la identidad pública del territorio.'],
 ['07 · La memoria escolar','Visitá la escuela y hablá con Lucía.','Las escuelas pueden conservar fotografías, actos y memorias de generaciones.'],
 ['08 · La radio','Visitá la radio y escuchá una conversación.','La radio funciona como archivo vivo de voces, noticias y costumbres.'],
 ['09 · El almacén','Comprá un producto cotidiano.','Los comercios de cercanía también construyen memoria social.'],
 ['10 · Oficios','Encontrá dos trabajadores en actividad.','Aprendé a registrar un oficio: quién lo hace, dónde, cuándo y por qué.'],
 ['11 · La producción','Llegá al galpón de cosecha.','La fruticultura es una de las bases económicas documentadas del área.'],
 ['12 · El vino','Visitá una bodega.','La vitivinicultura es otro rasgo económico destacado del territorio.'],
 ['13 · Las instituciones','Ubicá escuela, salud, seguridad y gobierno.','Un pueblo también se explica por las instituciones que sostienen la vida cotidiana.'],
 ['14 · La ciudad que crece','Caminá desde el núcleo urbano hacia el borde rural.','Compará trama urbana, chacras y espacios productivos.'],
 ['15 · El río','Llegá a la ribera y encontrá un puente.','El río no es un obstáculo arbitrario: organiza el territorio y los cruces.'],
 ['16 · La barda','Cruzá por puente y explorá el sector de bardas.','El paisaje cambia: registrá suelo, vegetación y horizonte.'],
 ['17 · Fiestas y comunidad','Encontrá el punto de reunión comunitaria.','Las fiestas populares conectan producción, trabajo, cultura y encuentro.'],
 ['18 · Archivo y fuentes','Encontrá el Archivo de Memoria.','Una historia responsable distingue recuerdo, testimonio y fuente documental.'],
 ['19 · Construir una línea de tiempo','Visitá tres lugares ya conocidos en orden.','Ordená pasado, transformación productiva, crecimiento urbano y presente.'],
 ['20 · Contárselo a otro','Reuní cinco pistas de tu inventario.','Convertí tus hallazgos en un relato breve, sin inventar datos.'],
 ['21 · Historia abierta','Llegá al mirador del extremo rural.','La historia de un pueblo no termina: queda abierta a nuevas fuentes, voces y preguntas.']
];
V.historyMissions=missions;
state.historyQuest=Number.isFinite(state.historyQuest)?state.historyQuest:0;
state.historySeen=Array.isArray(state.historySeen)?state.historySeen:[];

const hotspots=[
 [1160,390],[1120,580],[3800,820],[4050,820],[4500,850],[5750,1250],[530,565],[1200,1190],[1750,610],[2050,1130],[3950,1500],[5750,1300],[450,900],[3500,950],[6870,810],[7700,1300],[2200,700],[2040,430],[2500,1200],[6100,3400],[6500,3800]
];
function nearestMissionPoint(){const i=state.historyQuest; if(i>=21)return null;const p=hotspots[i];return {x:p[0],y:p[1]}}
function advanceMission(){
 const i=state.historyQuest;if(i>=21)return;
 const p=hotspots[i];if(Math.hypot(state.x-p[0],state.y-p[1])>115)return;
 if(state.historySeen.includes(i))return;
 state.historySeen.push(i);const m=missions[i];state.historyQuest=Math.min(21,i+1);V.openDialogue?.(m[0],[m[1],m[2],state.historyQuest<21?'Siguiente: '+missions[state.historyQuest][0]:'Completaste las 21 misiones.']);
 if(V.addItem)V.addItem('Historia · '+m[0]);
}
setInterval(()=>{if(state?.started&&!state.dialogue)advanceMission()},220);

/* ---------- DIÁLOGOS CASUALES ---------- */
const casual=[
 ['Marta',['¿Viste cómo cambió el tiempo?','Acá uno aprende a mirar el cielo antes de salir.']],
 ['Raúl',['Hoy la chacra está tranquila. Mañana puede ser otra historia.','¿Probaste caminar hasta los frutales?']],
 ['Lucía',['La escuela tiene historias que no siempre aparecen en los libros.','Preguntá, escuchá y anotá.']],
 ['Pedro',['El trabajo rural tiene sus tiempos.','Cuando hay cosecha, el pueblo se mueve distinto.']],
 ['Nico',['En la radio siempre aparece una voz nueva.','A veces una charla termina siendo memoria.']]
];
function casualLoop(){if(!state?.started||state.dialogue)return;const np=V.npcs||[];const n=np[Math.floor(Math.random()*np.length)],d=casual.find(x=>x[0]===n?.name);if(d&&Math.hypot(state.x-n.x,state.y-n.y)<150)V.openDialogue?.(d[0],d[1])}
setInterval(casualLoop,24000);

/* ---------- INTRO 4 PANTALLAS ---------- */
function buildIntro(){
 const card=document.querySelector('.title-card');if(!card||card.dataset.v72)return;card.dataset.v72='1';
 card.innerHTML=`<div class="v72-progress"><span class="active"></span><span></span><span></span><span></span></div><div class="eyebrow">OCARINA PRODUCCIONES · VILLA PELÓN</div><h1 id="v72IntroTitle"></h1><p id="v72IntroText"></p><div id="v72IntroHint" class="intro-note"></div><div class="v72-actions"><button id="v72Prev" type="button">ATRÁS</button><button id="v72Next" type="button">CONTINUAR</button></div>`;
 const pages=[
  ['UN PUEBLO SE APRENDE CAMINANDO','Villa Pelón es un mundo abierto de pequeña escala. Caminá, observá y hablá con la gente.','No corras detrás de una pantalla: recorré el territorio.'],
  ['LA HISTORIA ESTÁ REPARTIDA','Las 21 misiones te van a llevar por calles, escuela, chacras, bodegas, río y bardas.','Cada capítulo busca enseñar una idea histórica, territorial o social.'],
  ['NO TODO LO QUE SE CUENTA ES UNA FUENTE','El juego separará ambientación, memoria oral y datos documentados.','Cuando una afirmación histórica sea real, deberá poder rastrearse a una fuente.'],
  ['TU OBJETIVO','Completá las 21 misiones, conocé a los habitantes y reconstruí el territorio sin instalar nada.','Creado por Ocarina Producciones · pensado para celular, tablet y PC.']
 ];let i=0;const title=card.querySelector('#v72IntroTitle'),text=card.querySelector('#v72IntroText'),hint=card.querySelector('#v72IntroHint'),dots=[...card.querySelectorAll('.v72-progress span')],prev=card.querySelector('#v72Prev'),next=card.querySelector('#v72Next');
 function render(){title.textContent=pages[i][0];text.textContent=pages[i][1];hint.textContent=pages[i][2];dots.forEach((d,k)=>d.classList.toggle('active',k===i));prev.style.visibility=i?'visible':'hidden';next.textContent=i===3?'ENTRAR AL PUEBLO':'CONTINUAR'}render();prev.onclick=()=>{i=Math.max(0,i-1);render()};next.onclick=()=>{if(i<3){i++;render()}else document.getElementById('startBtn')?.click()};
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',buildIntro);else buildIntro();

/* ---------- MENÚ: GRÁFICOS ---------- */
function graphicsMenu(){
 const menu=document.getElementById('vpMenu');if(!menu||menu.querySelector('[data-a="graphics"]'))return;
 const b=document.createElement('button');b.dataset.a='graphics';b.dataset.t='graphics';b.textContent='GRÁFICOS: ALTO';const ref=menu.querySelector('[data-a="fullscreen"]');menu.querySelector('.vp-panel')?.insertBefore(b,ref||null);
 let q=localStorage.getItem('villa_pelon_graphics')||'high';
 const labels={low:'BAJO',medium:'MEDIO',high:'ALTO'};b.textContent='GRÁFICOS: '+labels[q].toUpperCase();
 b.onclick=()=>{q=q==='high'?'medium':q==='medium'?'low':'high';localStorage.setItem('villa_pelon_graphics',q);b.textContent='GRÁFICOS: '+labels[q];document.body.dataset.graphics=q};
}
setInterval(graphicsMenu,300);

V.v72={version:'72.0.0',world:'8200x4200',river:'bridge-only',missions:21,rural:true,wineries:3};
})();
