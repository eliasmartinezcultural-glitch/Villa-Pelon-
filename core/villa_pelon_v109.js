/* VILLA PELÓN V109 — REPARACIÓN PROFUNDA + MAPA TERRITORIAL + DATOS EDUCATIVOS
   Capa de corrección posterior a V107/V108.
   No reemplaza el motor: corrige geometría, interfaz y contrato educativo.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={}),G=V.worldGeometry||(V.worldGeometry={}),S=V.gameState||(V.gameState={});
V.version='109.0';

/* ---------- CONTRATO DE ESCALA ---------- */
V.scaleRules={version:'109.0',player:{height:34,width:18},building:{minW:180,minH:130,maxW:620,maxH:360},ratio:{minPlayerToBuildingHeight:3.8,maxPlayerToBuildingHeight:10.8},rule:'los edificios deben dominar visualmente al personaje sin convertirse en gigantes; las casas son menores que los edificios públicos/productivos'};
const typeScale={home:[250,175],shop:[330,210],school:[360,220],municipality:[300,210],library:[300,210],hospital:[360,230],fire_station:[340,220],community:[340,220],chapel:[340,220],radio:[400,230],culture:[330,210],service:[340,220],rural:[420,260],winery:[500,280]};
(G.buildings||[]).forEach(b=>{const t=typeScale[b.type]||[300,200];b.scaleClass=b.type;b.nominalSize={w:t[0],h:t[1]};b.visualRatio={heightToPlayer:(t[1]/V.scaleRules.player.height).toFixed(1)};b.static=true});

/* ---------- PLAZA: espacio real del juego, no sólo un punto ---------- */
G.plaza={id:'plaza_central',x:900,y:250,w:620,h:410,label:'PLAZA CENTRAL',kind:'public_space',landmark:true,interactive:true};
G.landmarks=G.landmarks||[];
const lm=[
 {id:'plaza_central',x:900,y:250,w:620,h:410,label:'Plaza Central',kind:'plaza',educational:'Centro de encuentro del pueblo; espacio para observar cómo una comunidad organiza su vida pública.'},
 {id:'escuela_273',x:300,y:300,w:360,h:220,label:'Escuela 273',kind:'school',educational:'En la referencia histórica real, la Escuela Nº 273 comenzó a funcionar en 1975 y es presentada como la primera escuela de la localidad.'},
 {id:'municipalidad',x:1980,y:300,w:300,h:210,label:'Municipalidad',kind:'municipality',educational:'Punto para aprender sobre la organización institucional de la localidad.'},
 {id:'biblioteca',x:2380,y:300,w:300,h:210,label:'Biblioteca Popular',kind:'library',educational:'Lugar ideal para enseñar que la memoria local necesita documentos, fotografías, relatos y fuentes.'},
 {id:'hospital',x:2780,y:300,w:300,h:210,label:'Hospital / Centro de Salud',kind:'hospital',educational:'En la cronología local, el hospital fue inaugurado en 1987.'},
 {id:'bodega_norte',x:5600,y:420,w:520,h:290,label:'Bodega del Valle',kind:'winery',educational:'Representa el polo vitivinícola desarrollado sobre el oasis de riego.'},
 {id:'sector_productivo',x:4900,y:1080,w:3300,h:1260,label:'Sector productivo',kind:'productive',educational:'Chacras, riego, galpones, herramientas y producción: el paisaje transformado por el agua.'},
 {id:'picada21',x:4580,y:2045,w:3320,h:150,label:'Picada 21',kind:'rural_route',educational:'Corredor rural del juego para enseñar orientación, distancia y vida fuera del núcleo urbano.'}
];
G.landmarks=lm;

/* ---------- RED DE CALLES Y RUTAS: geometría explícita ---------- */
const extraRoads=[
 {x:850,y:560,w:760,h:100,id:'plaza_south',name:'Calle de la Plaza',kind:'street'},
 {x:850,y:250,w:100,h:520,id:'plaza_west',name:'Acceso oeste de plaza',kind:'street'},
 {x:1510,y:250,w:100,h:520,id:'plaza_east',name:'Acceso este de plaza',kind:'street'},
 {x:1070,y:0,w:190,h:250,id:'avenue_to_plaza',name:'Avenida hacia plaza',kind:'street'},
 {x:1510,y:600,w:660,h:100,id:'civic_east',name:'Eje cívico',kind:'street'},
 {x:2280,y:600,w:1180,h:100,id:'civic_east_2',name:'Eje cívico este',kind:'street'},
 {x:3760,y:600,w:940,h:100,id:'civic_rural',name:'Eje hacia sector rural',kind:'street'},
 {x:4580,y:600,w:120,h:1520,id:'rural_spine',name:'Columna rural',kind:'route'},
 {x:4900,y:700,w:1100,h:100,id:'rural_north',name:'Camino rural norte',kind:'rural_road'},
 {x:6000,y:700,w:1200,h:100,id:'rural_north_2',name:'Camino rural bodegas',kind:'rural_road'},
 {x:4900,y:950,w:2300,h:90,id:'irrigation_service',name:'Camino de servicio',kind:'rural_road'},
 {x:4900,y:1600,w:2300,h:90,id:'productive_cross',name:'Camino de chacras',kind:'rural_road'},
 {x:4900,y:2100,w:300,y:90,id:'picada_gate',name:'Acceso Picada 21',kind:'rural_road'}
];
/* corregir typo/normalizar */ extraRoads.forEach(r=>{if(r.y===undefined&&r.y!==0)r.y=2100;if(r.h===undefined)r.h=90});
const oldRoads=Array.isArray(G.roads)?G.roads:[];
const ids=new Set(oldRoads.map(r=>r.id));
extraRoads.forEach(r=>{if(!ids.has(r.id))oldRoads.push(r)});
G.roads=oldRoads;
G.routeNetwork={version:'109.0',nodes:[
 {id:'plaza',x:1210,y:580},{id:'north_bridge',x:1030,y:855},{id:'central_bridge',x:3630,y:855},{id:'rural_bridge',x:6030,y:855},{id:'rural_gate',x:4640,y:700},{id:'productive',x:6000,y:1600},{id:'picada21_gate',x:4900,y:2120},{id:'picada21_end',x:7750,y:2120}
],edges:[
 ['plaza','north_bridge'],['plaza','central_bridge'],['central_bridge','rural_gate'],['rural_gate','rural_bridge'],['rural_gate','productive'],['productive','picada21_gate'],['picada21_gate','picada21_end']
],rule:'red continua: cada zona jugable tiene entrada y salida; río sólo por puentes'};
V.routeGraph=V.routeNetwork;

/* ---------- DATOS EDUCATIVOS: base real de referencia, no afirmar que Villa Pelón sea la localidad real ---------- */
V.educationalData={version:'109.0',reference:'San Patricio del Chañar, Neuquén',status:'reference_real',chapters:[
 {id:'origins',title:'Antes del pueblo',facts:[
  'El nombre histórico del paraje aparece vinculado a Tratayén y al nombre Chañar.',
  'La historia local incluye fortines, pasos y circulación anterior a la urbanización moderna.',
  'La familia Gasparri es una referencia central en la historia productiva y fundacional moderna.'
 ],source:'Fuentes históricas provinciales y cronologías locales; verificar cada dato antes de publicarlo como documental.'},
 {id:'water',title:'El agua transforma el territorio',facts:[
  'En 1971 se registra una primera bocatoma en Picada 13.',
  'En 1972 finaliza una segunda bocatoma destinada a ampliar el abastecimiento de riego.',
  'El oasis productivo se entiende a partir de la infraestructura de riego y drenaje.'
 ],source:'Cronología de San Patricio del Chañar, Más Neuquén; fuentes provinciales.'},
 {id:'foundation',title:'Nacimiento institucional',facts:[
  'San Patricio del Chañar fue creado el 21 de mayo de 1973 por Decreto Provincial 1339.',
  'En 1974 se creó el Consorcio de Riego y Drenaje.',
  'También en 1974 comenzaron a funcionar instituciones administrativas locales.'
 ],source:'Neuquén Informa y cronología histórica local.'},
 {id:'school',title:'La escuela y la comunidad',facts:[
  'La Escuela Nº 273 comenzó a funcionar el 1 de marzo de 1975.',
  'Desde 1995 lleva el nombre Carlos Julio Sang según la cronología consultada.',
  'La educación permite convertir memoria local en conocimiento compartido.'
 ],source:'Cronología de San Patricio del Chañar, Más Neuquén.'},
 {id:'rural_work',title:'Trabajo rural',facts:[
  'La producción frutícola es parte fundamental de la identidad territorial.',
  'La Fiesta Provincial del Pelón tuvo su primera edición en 1985.',
  'Desde 1999 se incorporó la Fiesta del Trabajador Rural a esa celebración, según la cronología consultada.'
 ],source:'Cronología de San Patricio del Chañar, Más Neuquén.'},
 {id:'institutions',title:'Instituciones que construyen pueblo',facts:[
  'En 1983 se creó la Cámara de Productores Agropecuarios.',
  'En 1983 se inauguró la parroquia María Auxiliadora.',
  'En 1984 comenzó a funcionar el CEPEM 31.',
  'En 1987 comenzó a funcionar la Escuela Nº 191 y se inauguró el hospital local.'
 ],source:'Cronología de San Patricio del Chañar, Más Neuquén.'},
 {id:'wine',title:'Del oasis al vino',facts:[
  'La actividad vitivinícola se incorporó con fuerza a la transformación productiva de la localidad.',
  'La primera bodega mencionada en la cronología consultada fue inaugurada en 2003.',
  'Las bodegas deben enseñarse como parte de una cadena productiva, no sólo como decoración turística.'
 ],source:'Cronología de San Patricio del Chañar, Más Neuquén.'},
 {id:'memory',title:'Investigar antes de afirmar',facts:[
  'Una misión puede enseñar a distinguir entre testimonio, documento, fotografía, mapa y fuente periodística.',
  'Los datos del juego deben indicar cuando son una reconstrucción educativa o una referencia histórica.',
  'El jugador aprende historia haciendo: buscar, comparar, ubicar, preguntar y registrar.'
 ],source:'Regla educativa del proyecto Villa Pelón.'}
]};

V.missionCatalog109=[
 ['01','Llegar a la plaza','Encontrá la Plaza Central y aprendé a orientarte con puntos de referencia.','reach:plaza',500],
 ['02','La primera escuela','Visitá la escuela y descubrí por qué 1975 es una fecha importante.','inspect:escuela_273',750],
 ['03','El agua mueve la historia','Encontrá el punto de riego y reconstruí la secuencia 1971–1972.','inspect:water',900],
 ['04','Nace una localidad','Recorré el edificio municipal y ordená la fecha de 1973.','inspect:municipality',1000],
 ['05','La red de instituciones','Visitá biblioteca, salud y comunidad y registrá sus funciones.','collect:institutions',1200],
 ['06','El trabajo rural','Llegá al sector productivo y distinguí chacra, galpón, acequia y camino.','reach:productive',1400],
 ['07','La fiesta del pelón','Encontrá el área de cosecha y aprendé por qué el pelón forma parte de la identidad local.','collect:pelon',1500],
 ['08','El vino y el oasis','Visitá la bodega y seguí la cadena agua → cultivo → cosecha → elaboración.','inspect:bodega_norte',1700],
 ['09','Camino a Picada 21','Seguí la ruta rural sin cruzar el río fuera de un puente.','reach:picada21',1800],
 ['10','Pueblo conectado','Usá el mapa para explicar cómo se conectan plaza, núcleo urbano, sector productivo y zona rural.','map:network',2000],
 ['11','Memoria con fuentes','Encontrá una pista y clasificá si es testimonio, documento o reconstrucción.','collect:historic_clue',2200],
 ['12','Tu cuaderno de Villa Pelón','Completá ocho datos de referencia sobre San Patricio del Chañar y separá hechos reales de elementos ficticios del juego.','complete:reference',3000]
].map(x=>({id:x[0],title:x[1],description:x[2],objective:x[3],reward:x[4],educational:true}));

/* ---------- UI: botones verdaderamente funcionales ---------- */
const css=`#vp109MenuBtn,#vp109MapBtn{position:fixed;z-index:12000;pointer-events:auto;top:62px;border:2px solid #d0b36c;background:#283128;color:#f1dfb0;padding:10px 14px;font:700 12px monospace;border-radius:8px;box-shadow:0 5px 16px #0008;cursor:pointer}#vp109MenuBtn{left:12px}#vp109MapBtn{right:12px}#vp109Overlay{position:fixed;inset:0;z-index:13000;background:#101610e8;display:flex;align-items:center;justify-content:center;padding:18px;box-sizing:border-box}#vp109Overlay[hidden]{display:none}#vp109Panel{width:min(980px,96vw);max-height:92vh;overflow:auto;background:#263028;border:3px solid #d0b36c;border-radius:14px;padding:18px;color:#f1dfb0;font:14px monospace;box-shadow:0 18px 60px #000b}#vp109Panel h2{margin:0 0 6px;font-size:22px}#vp109Panel .sub{opacity:.75;margin-bottom:14px}#vp109Actions{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:9px}#vp109Actions button,#vp109Close,#vp109Back{border:1px solid #8e7b50;background:#3a483b;color:#f5e3b5;padding:11px;border-radius:8px;font:700 12px monospace;cursor:pointer}#vp109Actions button:hover,#vp109Close:hover,#vp109Back:hover{background:#53634f}#vp109Content{margin-top:15px}#vp109Content svg{width:100%;height:auto;background:#687b58;border:2px solid #6d7658}#vp109Content article{border:1px solid #596550;padding:10px;margin:7px 0;border-radius:8px;background:#303b31}#vp109Content .facts{padding-left:18px;line-height:1.5}#vp109Legend{display:flex;gap:12px;flex-wrap:wrap;margin-top:8px;font-size:11px}.vp109-hide-ui{display:none!important}`;
if(!document.getElementById('vp109Style')){const st=document.createElement('style');st.id='vp109Style';st.textContent=css;document.head.appendChild(st)}
function el(tag,attrs={},html=''){const e=document.createElement(tag);Object.entries(attrs).forEach(([k,v])=>e.setAttribute(k,v));e.innerHTML=html;return e}
function openOverlay(title,html=''){const ov=document.getElementById('vp109Overlay');if(!ov)return;document.getElementById('vp109Title').textContent=title;document.getElementById('vp109Content').innerHTML=html;document.getElementById('vp109Actions').hidden=true;document.getElementById('vp109Back').hidden=false;ov.hidden=false}
function menu(){const ov=document.getElementById('vp109Overlay');if(!ov)return;document.getElementById('vp109Title').textContent='VILLA PELÓN · HISTORIA VIVA';document.getElementById('vp109Content').innerHTML='<div class="sub">V109 · mundo educativo inspirado en San Patricio del Chañar</div>';document.getElementById('vp109Actions').hidden=false;document.getElementById('vp109Back').hidden=true;ov.hidden=false}
function map(){const bs=G.buildings||[],rs=G.roads||[],br=G.bridges||[],p=G.plaza;let roads=rs.map(r=>`<rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" fill="#c1aa78" opacity=".92"/>`).join('');let buildings=bs.map(b=>`<rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" fill="#7b5544" stroke="#322a24" stroke-width="8"/><text x="${b.x+b.w/2}" y="${b.y+b.h/2}" text-anchor="middle" font-size="28" fill="#f4dfad">${(b.label||'').slice(0,12)}</text>`).join('');let bridge=br.map(b=>`<rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" fill="#9b6c45" stroke="#33291f" stroke-width="8"/>`).join('');const html=`<svg viewBox="0 0 8200 4200" role="img" aria-label="Mapa funcional de Villa Pelón"><rect width="8200" height="4200" fill="#687b58"/><rect y="820" width="8200" height="22" fill="#668d91"/><rect x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}" fill="#8e9b67" stroke="#e2ca83" stroke-width="12"/><text x="${p.x+p.w/2}" y="${p.y+p.h/2}" text-anchor="middle" font-size="44" fill="#f7e4ae">PLAZA</text>${roads}${bridge}${buildings}<circle cx="${+S.x||1180}" cy="${+S.y||650}" r="42" fill="#f0df8c" stroke="#302b21" stroke-width="10"/><text x="${(+S.x||1180)+55}" y="${(+S.y||650)-45}" font-size="30" fill="#fff0c2">JUGADOR</text></svg><div id="vp109Legend"><span>■ edificios</span><span>■ plaza</span><span>━ calles/rutas</span><span>═ puentes</span><span>≈ río</span><span>● jugador</span></div><p><b>Red territorial:</b> plaza → núcleo urbano → puentes → sector rural → Picada 21. El mapa usa la misma geometría del mundo.</p>`;openOverlay('MAPA TERRITORIAL',html)}
function data(){openOverlay('DATOS PARA APRENDER',V.educationalData.chapters.map(c=>`<article><b>${c.title}</b><ul class="facts">${c.facts.map(f=>`<li>${f}</li>`).join('')}</ul><small>${c.source}</small></article>`).join(''))}
function missions(){const cat=V.missionCatalog109||[];openOverlay('CAMPAÑA EDUCATIVA',cat.map(m=>`<article><b>${m.id}. ${m.title}</b><p>${m.description}</p><small>Objetivo: ${m.objective} · Recompensa: $${m.reward}</small></article>`).join(''))}
function laws(){openOverlay('REGLAS DE CONSTRUCCIÓN',`<article><b>ESCALA</b><p>Personaje ≈ 34 px de alto. Casas ≈ 175 px. Edificios públicos ≈ 210–230 px. Galpones y bodegas ≈ 260–290 px. Son grandes respecto del personaje, pero no gigantes.</p></article><article><b>GEOMETRÍA</b><p>Edificios fijos en coordenadas de mundo. La cámara se mueve; las construcciones no. Las calles y rutas forman una red explícita.</p></article><article><b>RÍO</b><p>El cruce permitido es por puentes. No se permite atravesar el agua como si fuera suelo.</p></article><article><b>VISUAL</b><p>Pixel art funcional: cada elemento debe orientar, explicar, ambientar o participar de una misión.</p></article>`)}
function settings(){openOverlay('CONFIGURACIÓN',`<article><button id="vp109Reset" type="button">REINICIAR PARTIDA REALMENTE</button><p>El reinicio borra el guardado local y recarga el juego.</p></article><article><b>PIXEL ART</b><p>Suavizado desactivado. Bordes duros. Escala territorial conservada.</p></article>`);document.getElementById('vp109Reset').onclick=restart}
function restart(){try{localStorage.removeItem('villa_pelon_save');sessionStorage.clear()}catch(_){} location.reload()}
function buildUI(){document.getElementById('vp109MenuBtn')?.remove();document.getElementById('vp109MapBtn')?.remove();document.getElementById('vp109Overlay')?.remove();const mb=el('button',{id:'vp109MenuBtn',type:'button'},'☰ MENÚ'),mp=el('button',{id:'vp109MapBtn',type:'button'},'🗺 MAPA');document.body.append(mb,mp);const ov=el('div',{id:'vp109Overlay',hidden:''});ov.innerHTML=`<section id="vp109Panel"><h2 id="vp109Title">VILLA PELÓN</h2><div id="vp109Actions"><button data-act="map">🗺 MAPA</button><button data-act="missions">◆ MISIONES</button><button data-act="data">📚 DATOS</button><button data-act="laws">▦ LEYES</button><button data-act="settings">⚙ CONFIGURACIÓN</button><button data-act="restart">↻ REINICIAR</button><button data-act="close">✕ CERRAR</button></div><div id="vp109Content"></div><button id="vp109Back" hidden>← VOLVER AL MENÚ</button><button id="vp109Close">CERRAR</button></section>`;document.body.appendChild(ov);mb.onclick=menu;mp.onclick=map;ov.querySelector('#vp109Close').onclick=()=>ov.hidden=true;ov.querySelector('#vp109Back').onclick=menu;ov.querySelector('#vp109Actions').onclick=e=>{const a=e.target?.dataset?.act;if(!a)return;if(a==='map')map();if(a==='missions')missions();if(a==='data')data();if(a==='laws')laws();if(a==='settings')settings();if(a==='restart'&&confirm('¿Reiniciar toda la partida?'))restart();if(a==='close')ov.hidden=true};window.addEventListener('keydown',e=>{if(e.key==='Escape')ov.hidden=true});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',buildUI,{once:true});else buildUI();
window.addEventListener('villa-pelon-engine-ready',()=>{buildUI()},{once:true});
})();
