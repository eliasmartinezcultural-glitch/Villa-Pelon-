/* Villa Pelón V66 — orden territorial del mapa.
   Regla estructural: PUEBLO / RURAL / RÍO son sectores distintos.
   La decoración se genera por zona; ningún árbol se coloca dentro de edificios.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const W=3200,H=2000;

const ZONES={
  pueblo:{x:120,y:180,w:1680,h:650},
  rural:{x:1800,y:830,w:1080,h:1000},
  river:{x:2880,y:120,w:320,h:1710}
};
V.territory={version:'V66',zones:ZONES};

// Limpia la expansión anterior: sus árboles/cultivos/canales estaban distribuidos
// de forma global y podían invadir sectores que no correspondían.
const old=V.worldElements&&V.worldElements.props;
if(old){
  old.trees=[]; old.poplars=[]; old.fences=[]; old.cropRows=[];
  old.canal=[]; old.dirtRoads=[]; old.machines=[];
}

// Autoridad única para edificios: pueblo arriba/centro, instalaciones productivas en rural.
if(V.worldGeometry&&Array.isArray(V.worldGeometry.buildings)){
  const b=V.worldGeometry.buildings;
  b.splice(0,b.length,
    {x:430,y:330,w:300,h:185,label:'ESCUELA',type:'school'},
    {x:800,y:330,w:210,h:155,label:'VIVIENDA',type:'home'},
    {x:1060,y:330,w:310,h:180,label:'RADIO OASIS',type:'radio'},
    {x:1480,y:330,w:340,h:190,label:'ALMACÉN',type:'shop'},
    {x:780,y:500,w:230,h:155,label:'VIVIENDA',type:'home'},
    {x:1430,y:510,w:250,h:170,label:'VIVIENDA',type:'home'},
    {x:1980,y:930,w:330,h:190,label:'GALPÓN RURAL',type:'rural'},
    {x:2380,y:1130,w:330,h:200,label:'BODEGA',type:'rural'}
  );
}

// Puntos de misión también quedan dentro del sector correspondiente.
if(V.worldGeometry){
  if(V.worldGeometry.clue){V.worldGeometry.clue.x=1660;V.worldGeometry.clue.y=560}
  if(V.worldGeometry.jobSpot){V.worldGeometry.jobSpot.x=2200;V.worldGeometry.jobSpot.y=820}
}

// Reubica personajes autónomos: vecinos en pueblo, trabajadores/animales en rural.
const npcPositions={Marta:[1580,560],Raúl:[2180,1050],Lucía:[650,560],Pedro:[2500,1450],Nico:[1180,570]};
if(Array.isArray(V.npcs))V.npcs.forEach(n=>{const p=npcPositions[n.name];if(p){n.x=p[0];n.y=p[1];if(n.home){n.home={x:p[0],y:p[1]}}}});
if(V.life){
  const homes={Marta:[1580,560],Raúl:[1430,510],Lucía:[900,560],Pedro:[1430,510],Nico:[1430,510],Rosa:[800,560],Tomás:[1430,510],Elena:[1430,510]};
  const works={Marta:[1650,560],Raúl:[2180,1050],Lucía:[580,560],Pedro:[2500,1450],Nico:[1210,420],Rosa:[1200,470],Tomás:[1600,560],Elena:[1650,560]};
  if(Array.isArray(V.life.ambient))V.life.ambient.forEach(o=>{
    const h=homes[o.name],w=works[o.name];
    if(h){o.home=h.slice();o.x=h[0];o.y=h[1]}
    if(w){o.work=w.slice();o.target=w.slice()}
  });
  // Reubica fauna y maquinaria visualmente dentro de la zona rural.
  if(Array.isArray(V.life.animals))V.life.animals.forEach((o,i)=>{o.x=2050+(i%4)*180;o.y=1250+Math.floor(i/4)*110;o.vx=(i%2? -1:1)*5;o.vy=(i%3?1:-1)*3});
  if(Array.isArray(V.life.workers))V.life.workers.forEach((o,i)=>{o.x=2050+(i%4)*180;o.y=900+Math.floor(i/4)*120;o.vx=i%2? -7:7;o.vy=0});
}

function px(c,x,y,w,h,col){c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h))}
function line(c,x1,y1,x2,y2,col,w=2){c.strokeStyle=col;c.lineWidth=w;c.beginPath();c.moveTo(x1,y1);c.lineTo(x2,y2);c.stroke()}
function label(c,text,x,y,w){px(c,x-w/2,y-15,w,24,'rgba(24,31,25,.82)');c.fillStyle='#efe5c8';c.font='bold 12px monospace';c.textAlign='center';c.fillText(text,x,y+2)}
function tree(c,x,y,s=1){
  px(c,x-4*s,y+8*s,8*s,22*s,'#60452e');
  px(c,x-16*s,y-10*s,32*s,22*s,'#3e6946');
  px(c,x-10*s,y-18*s,20*s,12*s,'#527b50');
}
function ruralTree(c,x,y,s=.8){tree(c,x,y,s)}
function field(c,x,y,w,h,type){
  const base=type==='vid'?'#718452':'#7d8d5b';
  px(c,x,y,w,h,base);
  for(let yy=y+18;yy<y+h;yy+=28)line(c,x+8,yy,x+w-8,yy,type==='vid'?'#506a45':'#687846',2);
  for(let xx=x+20;xx<x+w;xx+=42)px(c,xx,y+5,4,h-10,type==='vid'?'#4d6945':'#617342');
}
function fence(c,x,y,w,h){
  c.strokeStyle='#6e563d';c.lineWidth=4;
  for(let xx=x;xx<=x+w;xx+=34){line(c,xx,y,xx,y+h,'#6e563d',3)}
  line(c,x,y,x+w,y,'#806447',3);line(c,x,y+h,x+w,y+h,'#806447',3);
}
function river(c){
  // Río en borde este: sector continuo y sin construcciones.
  px(c,2880,120,320,1710,'#6d9897');
  px(c,2890,120,18,1710,'#9db29b');
  px(c,3170,120,14,1710,'#4f7777');
  for(let y=150;y<1800;y+=54){
    const off=Math.sin((y+performance.now()/80)*.025)*18;
    line(c,2940+off,y,3110+off,y+8,'rgba(224,238,222,.38)',2);
  }
  // Dos puentes mantienen conexión pueblo-rural / rural-río.
  [680,1480].forEach(y=>{px(c,2825,y,70,72,'#775c43');for(let x=2832;x<2890;x+=16)px(c,x,y+8,8,56,'#9a7955')});
}
function rural(){
  // Campos concentrados: nunca dentro del pueblo.
  field(c,1830,1180,520,260,'frutal');
  field(c,2380,1390,470,310,'vid');
  field(c,1840,1510,420,270,'huerta');
  fence(c,1800,1130,560,350);fence(c,2360,1340,500,390);
  // Arboledas y cortinas rompeviento exclusivamente rurales.
  [1880,1940,2000,2060,2120,2180].forEach((x,i)=>ruralTree(c,x,900+(i%2)*22,.72));
  [2520,2580,2640,2700,2760].forEach((x,i)=>ruralTree(c,x,1760-(i%2)*25,.78));
}
function townBoundaries(c){
  // Línea visual de transición; no crea una pared.
  c.setLineDash([12,10]);line(c,1800,180,1800,1820,'rgba(74,77,55,.45)',2);c.setLineDash([]);
  label(c,'PUEBLO',950,245,90);label(c,'RURAL / CHACRAS',2320,875,170);label(c,'RÍO',3040,170,60);
}

function install(){
  if(!V.life||V.life.__v66Territory)return;
  const original=V.life.drawWorld;
  V.life.drawWorld=function(c){
    // Fondo sectorial adicional sólo en zonas que no tapan edificios del pueblo.
    rural();river(c);townBoundaries(c);
    // La función anterior ya no dibuja props porque fueron vaciados arriba;
    // conserva personas, fauna, trabajadores y vehículos.
    if(original)original(c);
  };
  V.life.__v66Territory=true;
}
if(V.life)install();else window.addEventListener('villa-pelon-runtime-ready',install,{once:true});
})();
