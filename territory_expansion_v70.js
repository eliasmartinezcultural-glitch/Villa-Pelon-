/* Villa Pelón V70 — primera expansión territorial.
   WORLD/COLLISION: amplía el arreglo de edificios existente y añade calles,
   veredas, árboles y nuevos puntos de referencia sin crear otro loop.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const W=V.worldGeometry;
if(!W||!Array.isArray(W.buildings))return;

const expansion=[
 {x:90,y:250,w:230,h:150,label:'VIVIENDA',type:'home'},
 {x:90,y:760,w:250,h:160,label:'VIVIENDA',type:'home'},
 {x:360,y:1180,w:280,h:170,label:'TALLER',type:'rural'},
 {x:1480,y:1420,w:300,h:175,label:'VIVIENDA',type:'home'},
 {x:1980,y:1420,w:300,h:175,label:'GALPÓN',type:'rural'},
 {x:2480,y:190,y:300,w:170,label:'VIVIENDA',type:'home'},
 {x:2780,y:610,w:300,h:175,label:'TALLER',type:'rural'},
 {x:300,y:1500,w:320,h:180,label:'VIVIENDA RURAL',type:'home'},
 {x:2380,y:1510,w:300,h:170,label:'GALPÓN',type:'rural'}
];
// Evita duplicar si el módulo se carga más de una vez.
expansion.forEach(b=>{if(!W.buildings.some(x=>x.x===b.x&&x.y===b.y&&x.w===b.w&&x.h===b.h))W.buildings.push(b)});

const roads=[
 {x:70,y:585,w:3060,h:54},
 {x:70,y:955,w:2480,h:54},{x:2960,y:955,w:170,h:54},
 {x:1080,y:145,w:54,h:1030},
 {x:2010,y:150,w:54,h:1680},
 {x:640,y:1390,w:1660,h:54}
];
const sidewalks=roads.map(r=>({x:r.x-8,y:r.y-8,w:r.w+16,h:8})).concat(roads.map(r=>({x:r.x-8,y:r.y+r.h,w:r.w+16,h:8})));
const trees=[
 [55,220],[335,220],[55,700],[355,700],[700,1200],[690,1350],[1430,1360],[1830,1360],
 [1930,1380],[2320,1380],[2430,1840],[2720,1760],[2920,560],[3110,560],[760,1800],[900,1810],
 [120,1770],[620,1770]
];

function rect(c,x,y,w,h,fill){c.fillStyle=fill;c.fillRect(x,y,w,h)}
function drawRoads(c){
 roads.forEach(r=>{
  rect(c,r.x,r.y,r.w,r.h,'#6a5b4d');
  rect(c,r.x,r.y,r.w,3,'#8a7660');
  rect(c,r.x,r.y+r.h-3,r.w,3,'#4d443b');
  if(r.w>100){for(let x=r.x+18;x<r.x+r.w-12;x+=52)rect(c,x,r.y+r.h/2-2,26,4,'#b49a70')}
 });
 sidewalks.forEach(s=>rect(c,s.x,s.y,s.w,s.h,'#9a8a73'));
}
function drawTrees(c){
 trees.forEach(([x,y])=>{
  rect(c,x-5,y+13,10,15,'#654936');
  rect(c,x-16,y-5,32,20,'#35563d');
  rect(c,x-11,y-13,22,12,'#416847');
  rect(c,x-5,y-18,10,7,'#4d744f');
 });
}
function drawSigns(c){
 const signs=[
  [95,570,'BARRIO NORTE'],[1125,170,'CALLE PRINCIPAL'],[2048,170,'CAMINO RURAL'],[680,1380,'SALIDA A CHACRAS']
 ];
 signs.forEach(([x,y,t])=>{rect(c,x,y,4,28,'#594638');rect(c,x+4,y-3,Math.max(70,t.length*6),18,'#d1b47c');c.fillStyle='#2b3029';c.font='7px monospace';c.fillText(t,x+8,y+9)});
}

const previousDraw=V.life&&V.life.drawWorld;
if(V.life&&typeof previousDraw==='function'&&!V.life.__v70Expansion){
 V.life.drawWorld=c=>{
  drawRoads(c);
  previousDraw(c);
  drawTrees(c);
  drawSigns(c);
 };
 V.life.__v70Expansion=true;
}

V.territoryExpansionV70={version:'70.0.0',buildings:expansion.length,roads:roads.length,authority:'WORLD/COLLISION',loop:'none'};
})();
