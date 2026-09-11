/* VILLA PELÓN V114 — LIMPIEZA DE SUPERPOSICIONES
   Objetivo: eliminar interferencias entre ambientación, caminos, edificios y capas de detalle.
   Principio: si un elemento decorativo compite con una estructura jugable, gana la estructura.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const S=V.gameState||(V.gameState={});
const G=V.worldGeometry||(V.worldGeometry={});

const canvas=document.getElementById('worldAmbient');
if(canvas){
  /* V113 colocaba árboles, cercos y carteles en una capa por encima del terreno.
     Sin una máscara geométrica completa podían invadir calles, edificios o puentes.
     Se conserva el canvas en DOM para compatibilidad, pero se apaga su render decorativo. */
  canvas.style.display='none';
  canvas.dataset.v114='disabled-overlap-prone-decoration';
}

/* Una sola capa de orientación, sin dibujar encima del mundo. */
function installLayerPolicy(){
  const world=document.getElementById('world');
  const detail=document.getElementById('worldDetail');
  if(world){world.style.position='absolute';world.style.zIndex='1';}
  if(detail){detail.style.position='absolute';detail.style.zIndex='3';detail.style.pointerEvents='none';}
  const ambient=document.getElementById('worldAmbient');
  if(ambient){ambient.style.zIndex='2';ambient.style.pointerEvents='none';}
}
installLayerPolicy();

/* Geometría de exclusión: cualquier futura decoración debe respetar estas zonas. */
function normalizeRect(r){
  if(!r)return null;
  const x=Number(r.x),y=Number(r.y),w=Number(r.w),h=Number(r.h);
  if(![x,y,w,h].every(Number.isFinite))return null;
  return {x,y,w,h};
}
function intersects(a,b,pad=0){
  return a.x < b.x+b.w+pad && a.x+a.w > b.x-pad && a.y < b.y+b.h+pad && a.y+a.h > b.y-pad;
}
const blocked=()=>[
  ...(Array.isArray(G.buildings)?G.buildings:[]),
  ...(Array.isArray(G.roads)?G.roads:[]),
  ...(Array.isArray(G.bridges)?G.bridges:[]),
  G.river
].map(normalizeRect).filter(Boolean);

V.v114={
  version:'114.0',
  overlapPolicy:'structure-first',
  ambientDecorations:false,
  blockedGeometry:blocked,
  rules:[
    'edificios no reciben decoración superpuesta',
    'calles permanecen visualmente libres',
    'puentes permanecen completamente legibles',
    'río conserva su lectura continua',
    'la orientación no tapa elementos jugables',
    'menos decoración, mayor claridad'
  ]
};

/* Detector de diagnóstico: no modifica posiciones del jugador; sólo registra conflictos. */
function audit(){
  const conflicts=[];
  const bs=blocked();
  (G.decorations||[]).forEach((d,i)=>{
    const r=normalizeRect(d);
    if(r&&bs.some(b=>intersects(r,b,4)))conflicts.push({index:i,reason:'decoration-overlap'});
  });
  V.v114.overlapAudit={ok:conflicts.length===0,conflicts,count:conflicts.length};
}
audit();

/* Si alguna capa futura vuelve a activar el canvas, la política lo vuelve a apagar. */
const observer=new MutationObserver(()=>{
  const c=document.getElementById('worldAmbient');
  if(c&&c.style.display!=='none')c.style.display='none';
  installLayerPolicy();
});
observer.observe(document.body,{subtree:true,attributes:true,attributeFilter:['style','class']});

window.dispatchEvent(new CustomEvent('villa-pelon-v114-ready',{detail:{overlapPolicy:'structure-first',audit:V.v114.overlapAudit}}));
})();