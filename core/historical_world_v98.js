/* VILLA PELÓN — HISTORICAL WORLD V98
   Capa de patrimonio jugable: objetos visibles, pistas, fuentes y microescenas.
   No crea motor ni RAF. El compositor único consume estos datos.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const H=V.historicalWorld=V.historicalWorld||{};
H.version='98.0';
H.points=[
 {id:'name_marker',x:1500,y:470,kind:'plaque',title:'PLACA DE IDENTIDAD',short:'¿POR QUÉ CHAñAR?',tone:'identity'},
 {id:'school_archive',x:430,y:520,kind:'notice',title:'ARCHIVO ESCOLAR',short:'ESCUELA 273 · 1975',tone:'education'},
 {id:'founding_marker',x:2050,y:470,kind:'monument',title:'HITO DE MEMORIA',short:'21 MAY 1973',tone:'history'},
 {id:'irrigation_marker',x:5000,y:910,kind:'canal',title:'ACEQUIA',short:'EL AGUA TRANSFORMA',tone:'water'},
 {id:'irrigation_timeline',x:5100,y:1030,kind:'sign',title:'CRONOLOGÍA DEL RIEGO',short:'1971 → 1972',tone:'water'},
 {id:'pelon_marker',x:5900,y:1460,kind:'crate',title:'MEMORIA PRODUCTIVA',short:'PELÓN · 1985',tone:'production'},
 {id:'worker_marker',x:1500,y:1080,kind:'tools',title:'HERRAMIENTAS',short:'TRABAJO RURAL',tone:'work'},
 {id:'territory_map',x:2450,y:1460,kind:'map',title:'MAPA DEL TERRITORIO',short:'AGUA · CAMINOS · PRODUCCIÓN',tone:'map'},
 {id:'source_lab',x:2450,y:1400,kind:'table',title:'MESA DE FUENTES',short:'ORAL · PRENSA · OFICIAL',tone:'sources'},
 {id:'research_question',x:2500,y:1510,kind:'notebook',title:'CUADERNO',short:'AFIRMACIÓN → FUENTE',tone:'research'},
 {id:'archive_final',x:2080,y:520,kind:'archive',title:'ARCHIVO DE MEMORIA',short:'CONTRASTAR',tone:'sources'},
 {id:'photo_spot',x:6500,y:2080,kind:'photo',title:'MIRADOR DE MEMORIA',short:'GUARDÁ UNA IMAGEN',tone:'memory'},
 {id:'water_observation',x:5450,y:900,kind:'waterpost',title:'PUNTO DE OBSERVACIÓN',short:'SEGUÍ EL AGUA',tone:'water'},
 {id:'rural_tools',x:6250,y:1900,kind:'tools',title:'PUESTO DE TRABAJO',short:'OBJETOS DEL CAMPO',tone:'work'},
 {id:'picada_sign',x:7500,y:2200,kind:'sign',title:'PICADA 21',short:'CAMINO · MEMORIA · PAISAJE',tone:'memory'}
];
H.byId=Object.fromEntries(H.points.map(p=>[p.id,p]));
H.draw=function(ctx,screen,visible,textFn){
 const t=performance.now()/700;
 H.points.forEach(p=>{
  const q=screen(p.x,p.y); if(q.x<-80||q.x>innerWidth+80||q.y<-80||q.y>innerHeight+80)return;
  const pulse=1+Math.sin(t+p.x*.01)*.08;
  ctx.save();ctx.translate(Math.round(q.x),Math.round(q.y));
  ctx.fillStyle='rgba(20,20,15,.22)';ctx.fillRect(-13,13,26,4);
  if(p.kind==='plaque'||p.kind==='monument'){ctx.fillStyle='#665542';ctx.fillRect(-17,-13,34,28);ctx.fillStyle='#cdb783';ctx.fillRect(-13,-9,26,20);ctx.fillStyle='#7b6247';ctx.fillRect(-3,-7,6,16)}
  else if(p.kind==='notice'||p.kind==='archive'){ctx.fillStyle='#72533d';ctx.fillRect(-16,-18,32,31);ctx.fillStyle='#eadbb4';ctx.fillRect(-12,-14,24,22);ctx.fillStyle='#8b7350';for(let i=0;i<3;i++)ctx.fillRect(-8,-10+i*6,16,2)}
  else if(p.kind==='canal'||p.kind==='waterpost'){ctx.fillStyle='#5c776f';ctx.fillRect(-23,-4,46,10);ctx.fillStyle='#88aaa1';ctx.fillRect(-20,-1,40,3);ctx.fillStyle='#8b744e';ctx.fillRect(-3,-18,6,14)}
  else if(p.kind==='sign'){ctx.fillStyle='#6c5038';ctx.fillRect(-3,-22,6,30);ctx.fillStyle='#bca16e';ctx.fillRect(-27,-25,54,16);ctx.fillStyle='#42372b';ctx.fillRect(-21,-20,42,5)}
  else if(p.kind==='crate'){ctx.fillStyle='#805b3d';ctx.fillRect(-18,-12,36,24);ctx.strokeStyle='#d0a16a';ctx.lineWidth=3;ctx.strokeRect(-15,-9,30,18);ctx.beginPath();ctx.moveTo(-15,-9);ctx.lineTo(15,9);ctx.moveTo(15,-9);ctx.lineTo(-15,9);ctx.stroke()}
  else if(p.kind==='tools'){ctx.fillStyle='#6d513d';ctx.fillRect(-18,7,36,4);ctx.strokeStyle='#9b7653';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-11,6);ctx.lineTo(-17,-16);ctx.moveTo(0,6);ctx.lineTo(5,-18);ctx.moveTo(10,6);ctx.lineTo(18,-12);ctx.stroke()}
  else if(p.kind==='map'){ctx.fillStyle='#674d3c';ctx.fillRect(-22,-5,44,13);ctx.fillStyle='#d9c99e';ctx.fillRect(-18,-12,36,17);ctx.strokeStyle='#708b77';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-12,-8);ctx.lineTo(-3,0);ctx.lineTo(8,-7);ctx.lineTo(15,2);ctx.stroke()}
  else if(p.kind==='table'){ctx.fillStyle='#674d3c';ctx.fillRect(-22,4,44,5);ctx.fillRect(-17,8,5,8);ctx.fillRect(12,8,5,8);ctx.fillStyle='#e5d3a6';ctx.fillRect(-16,-8,13,9);ctx.fillRect(3,-7,13,8)}
  else if(p.kind==='notebook'){ctx.fillStyle='#d9caa4';ctx.fillRect(-15,-14,30,25);ctx.fillStyle='#6e5c4a';ctx.fillRect(-11,-8,22,2);ctx.fillRect(-11,-2,16,2);ctx.fillRect(-11,4,20,2)}
  else if(p.kind==='photo'){ctx.fillStyle='#5d4638';ctx.fillRect(-18,-13,36,26);ctx.fillStyle='#d8c89f';ctx.fillRect(-13,-9,26,18);ctx.fillStyle='#8a9b83';ctx.fillRect(-10,0,20,6);ctx.fillStyle='#b88e68';ctx.fillRect(-4,-6,8,8)}
  ctx.restore();
  if(p.short){ctx.save();ctx.globalAlpha=.88;ctx.font='700 7px monospace';ctx.textAlign='center';ctx.lineWidth=3;ctx.strokeStyle='rgba(20,22,18,.85)';ctx.fillStyle='#eadbb4';ctx.strokeText(p.short,q.x,q.y+30*pulse);ctx.fillText(p.short,q.x,q.y+30*pulse);ctx.restore()}
 });
};
V.integrityHistorical={version:'98.0',count:H.points.length,ids:H.points.map(p=>p.id)};
})();
