/* Villa Pelón V85 — integridad de misiones.
   Convierte el arco narrativo en un circuito realmente jugable:
   lugares, conversaciones, trabajos, objetos y evidencias alimentan una sola misión activa.
   No inventa hechos históricos: sólo conecta acciones ya existentes del juego.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const M=V.missionRuntime||V.missions;
const S=V.gameState;
const alias={
  chacras:'las_chacras',
  chacra:'las_chacras',
  canal:'canal_viejo',
  plaza:'plaza',
  radio:'radio',
  escuela:'escuela',
  galpon:'galpon',
  bodega:'bodega',
  los_vinedos:'los_vinedos',
  vinedos:'los_vinedos'
};
const hotspots={
  canal_viejo:{x:2790,y:680,r:105,label:'Canal Viejo'},
  compuerta:{x:2790,y:1480,r:105,label:'Compuerta'},
  las_chacras:{x:2080,y:1380,r:250,label:'Las Chacras'},
  los_vinedos:{x:2590,y:1530,r:250,label:'Los Viñedos'},
  plaza:{x:1160,y:430,r:120,label:'Plaza del Pueblo'}
};
function norm(v){return String(v||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')}
function rt(){return V.missionRuntime||V.missions}
function active(){const r=rt();return r?.current?.()||null}
function mark(step){const r=rt();if(!r?.mark)return false;return !!r.mark(step,(r.active||undefined))}
function stepForVisit(id){const a=alias[norm(id)]||norm(id);return mark('visitar:'+a)||mark('visitar:'+norm(id))}
function inspect(id){const n=norm(id);const map={
  acequia:'observar:acequia',
  compuerta:'observar:compuerta',
  foto:'encontrar:foto_escolar',
  foto_escolar:'encontrar:foto_escolar',
  herramientas:'tomar_herramienta',
  cajones:'entregar:cajon',
  cosecha:'hacer:cosecha',
  archivo:'buscar:archivo_escuela',
  pan:'observar:pan',
  bodega_la_ribera:'observar:bodega_la_ribera'
};return map[n]?mark(map[n]):false}
function distance(x,y,p){return Math.hypot(x-p.x,y-p.y)}
function pollHotspots(){if(!S||!S.started)return;const r=rt(),m=active();if(!r||!m)return;const x=Number(S.x),y=Number(S.y);if(!Number.isFinite(x)||!Number.isFinite(y))return;
  const steps=new Set(r.steps?.[m.id]||[]);
  Object.entries(hotspots).forEach(([id,p])=>{if(distance(x,y,p)<=p.r){
    if(id==='canal_viejo'&&m.steps?.includes('visitar:canal_viejo'))stepForVisit(id);
    if(id==='compuerta'&&m.steps?.includes('observar:compuerta'))mark('observar:compuerta');
    if(id==='las_chacras'&&m.steps?.includes('visitar:las_chacras'))stepForVisit(id);
    if(id==='los_vinedos'&&m.steps?.includes('visitar:los_vinedos'))stepForVisit(id);
    if(id==='plaza'&&m.steps?.includes('visitar:plaza'))stepForVisit(id);
  }});
  const evidenceCount=Array.isArray(r.evidence)?r.evidence.length:0;
  if(m.steps?.includes('coleccionar:6_evidencias')&&evidenceCount>=6)mark('coleccionar:6_evidencias');
}
function onEvent(e){const d=e.detail||{};const type=d.type||'';const b=norm(d.building||d.room);const o=norm(d.object);
  if(type==='spatial-enter'||type==='building-enter'){
    if(b)stepForVisit(b);
    if(b==='radio')mark('escuchar:radio');
    if(b==='chacra')stepForVisit('las_chacras');
  }
  if(type==='interior-object'||type==='object-inspect'){
    if(o)inspect(o);
    if(o==='cajones')mark('entregar:cajon');
    if(o==='cosecha')mark('hacer:cosecha');
  }
  if(type==='mission-progress'&&d.step==='tomar_herramienta'){
    // El siguiente paso de esta misión se completa al salir al trabajo rural.
  }
  if(type==='mission-reward'){
    const g=V.gameState;if(g&&Number.isFinite(g.quest))g.quest=Math.max(g.quest,1);
  }
  render();
}
function wrapDialogue(){if(V.__v85Dialogue)return;if(typeof V.openDialogue!=='function')return;V.__v85Dialogue=true;const old=V.openDialogue;V.openDialogue=function(speaker,lines){const out=old.apply(this,arguments);const n=norm(speaker);if(['marta','raul','lucia','pedro','nico'].includes(n))mark('hablar:'+n);if(n==='radio oasis'||n==='radio')mark('escuchar:radio');render();return out}}
function wrapJob(){if(V.__v85Job)return;const spot=V.worldGeometry?.jobSpot;if(!spot)return;V.__v85Job=true;window.addEventListener('keydown',e=>{if(e.repeat||!S?.started||S.dialogue)return;if(!['e',' '].includes(e.key.toLowerCase()))return;if(Math.hypot(S.x-spot.x,S.y-spot.y)<110){setTimeout(()=>{mark('hacer:trabajo_rural');mark('entregar:cajon');render()},40)}},{capture:true})}
function render(){const el=document.getElementById('questText'),m=active(),r=rt();if(!el||!m||!r)return;const done=(r.steps?.[m.id]||[]).length,total=(m.steps||[]).length;el.textContent=`${m.title} · ${done}/${total}`;el.title=m.goal||''}
function install(){if(V.__v85Installed)return;V.__v85Installed=true;window.addEventListener('villa-pelon-world-event',onEvent);wrapDialogue();wrapJob();render();setInterval(()=>{wrapDialogue();wrapJob();pollHotspots();render()},450);V.missionIntegrity85={version:'85.0.0',pollHotspots,render,active}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();
