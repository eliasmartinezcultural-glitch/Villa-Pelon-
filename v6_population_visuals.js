/* Villa Pelón V6.19 — POBLACIÓN VISIBLE + ACTIVIDAD LEGIBLE
   Capa visual de la población autónoma. No mueve NPCs ni crea un loop.
   Hace visible el estado que ya calcula V6.18: destino, trabajo, interior,
   conversación, cansancio y actividad. Respeta V4 Characters como renderer único.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const P=V.populationVisuals=V.populationVisuals||{version:1,ready:false};
const life=V.life, chars=V.v4Characters;
if(!life||!chars)return;
const originalAmbient=chars.drawAmbient;
function hideInside(){const changed=[];for(const p of [...(life.ambient||[]),...(life.workers||[])]){if(p?.lifeInside){changed.push(p);p._v619Hidden=true}}return changed}
function restoreHidden(list){for(const p of list)p._v619Hidden=false}
function labelFor(p){if(p.lifeInside)return null;const a=p.lifeActivity||p.lifeAt;if(a==='trabajo rural'||p.lifeTarget==='chacra')return 'TRABAJO';if(p.lifeTarget==='escuela')return 'ESTUDIO';if(p.lifeTarget==='almacen')return 'COMPRAS';if(p.lifeTarget==='plaza')return p.talking?'CONVERSA':'PASEO';if(p.lifeTarget==='radio')return 'RADIO';if(p.lifeMood==='tiene hambre')return 'HAMBRE';if(p.lifeMood==='cansado')return 'DESCANSO';return null}
function drawTag(c,x,y,text){if(!text)return;c.save();c.font='bold 8px monospace';const w=c.measureText(text).width+10;c.fillStyle='rgba(31,24,20,.86)';c.fillRect(x-w/2,y-73,w,15);c.strokeStyle='rgba(221,190,116,.55)';c.strokeRect(x-w/2,y-73,w,15);c.fillStyle='rgba(246,225,171,.96)';c.textAlign='center';c.textBaseline='middle';c.fillText(text,x,y-65);c.restore()}
function drawPeopleActivity(c){const people=[...(life.ambient||[]),...(life.workers||[])];for(const p of people){if(p._v65Hidden||p._v619Hidden||p.x==null)continue;drawTag(c,p.x,p.y,labelFor(p));if(p.talking){c.save();c.fillStyle='rgba(244,224,169,.88)';c.font='bold 11px monospace';c.textAlign='center';c.fillText('•••',p.x,p.y-78);c.restore()}}}
function patch(){if(P.patched)return;if(typeof originalAmbient==='function'){chars.drawAmbient=function(c){const hidden=hideInside();try{originalAmbient.call(this,c)}finally{restoreHidden(hidden)}}}
if(life.drawWorld&&!P.worldPatched){const old=life.drawWorld;life.drawWorld=function(c){old.call(this,c);drawPeopleActivity(c)};P.worldPatched=true}
P.patched=typeof chars.drawAmbient==='function'&&P.worldPatched;P.ready=P.patched}
patch();setTimeout(patch,300);setTimeout(patch,1000);
V.populationVisuals.check=()=>({ok:P.ready,version:P.version,hiddenInside:[...(life.ambient||[]),...(life.workers||[])].filter(p=>p.lifeInside).length,visibleLabels:[...(life.ambient||[]),...(life.workers||[])].filter(p=>labelFor(p)).length});
})();
