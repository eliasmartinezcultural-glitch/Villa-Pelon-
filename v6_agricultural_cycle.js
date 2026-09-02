/* Villa Pelón V6.11 — CICLO AGRÍCOLA
   Las parcelas tienen estado persistente y reaccionan al tiempo y al trabajo de la población.
   No crea RAF, física, movimiento ni economía paralela.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const A=V.agriculturalCycle=V.agriculturalCycle||{version:2,enabled:true,patched:false,lastMinutes:null};
const SAVE='villa_pelon_agriculture';
const state=()=>V.state||(V.state={});
const parcels=A.parcels||[
 {id:'chacra_norte',x:2590,y:1335,w:520,h:250,label:'CHACRA · ALAMEDA NORTE',crop:'frutales',growth:.68,moisture:.72,watered:false,worker:'Raúl'},
 {id:'chacra_central',x:3120,y:1335,w:500,h:250,label:'CHACRA · PARCELA CENTRAL',crop:'frutales',growth:.44,moisture:.58,watered:false,worker:'Pedro'},
 {id:'chacra_sur',x:2590,y:1710,w:520,h:220,label:'CHACRA · BORDE SUR',crop:'frutales',growth:.32,moisture:.46,watered:false,worker:'Trabajador rural'},
 {id:'chacra_este',x:3180,y:1710,w:560,h:220,label:'CHACRA · LÍNEA ESTE',crop:'cultivo',growth:.55,moisture:.61,watered:false,worker:'Trabajador rural'}
];
A.parcels=parcels;
function save(){try{localStorage.setItem(SAVE,JSON.stringify(parcels.map(p=>({id:p.id,growth:p.growth,moisture:p.moisture,watered:p.watered,last:p.last||0}))));if(typeof V.v4Playability?.save==='function')V.v4Playability.save()}catch(_){} }
function load(){try{const d=JSON.parse(localStorage.getItem(SAVE)||'[]');if(Array.isArray(d))for(const saved of d){const p=parcels.find(x=>x.id===saved.id);if(p){if(Number.isFinite(saved.growth))p.growth=saved.growth;if(Number.isFinite(saved.moisture))p.moisture=saved.moisture;p.watered=!!saved.watered;p.last=saved.last||0}}}catch(_){} }
function nearestPoint(p,s){const x=Math.max(p.x,Math.min(p.x+p.w,s.x)),y=Math.max(p.y,Math.min(p.y+p.h,s.y));return{x,y,d:Math.hypot(s.x-x,s.y-y)}}
function target(){const s=state();let best=null,bd=140;for(const p of parcels){const q=nearestPoint(p,s);if(q.d<bd){bd=q.d;best=p}}return best}
function toast(text){if(typeof V.v4Playability?.toast==='function')V.v4Playability.toast(text);else{const d=document.createElement('div');d.className='v4p-toast';d.textContent=text;document.body.appendChild(d);setTimeout(()=>d.remove(),2600)}}
function panel(p){const pct=Math.round(p.growth*100),water=Math.round(p.moisture*100),workers=Number(p.workerActivity||0);const d=document.createElement('div');d.id='v4pPanel';d.className='v4p-panel';d.innerHTML='<div class="v4p-head"><strong>'+p.label+'</strong><button class="v4p-close">CERRAR</button></div><div class="v4p-body"><div class="v4p-card"><h3>'+p.crop.toUpperCase()+'</h3><p><b>Estado del cultivo:</b> '+pct+'%</p><div class="v6ag-bar"><i style="width:'+pct+'%"></i></div><p><b>Humedad:</b> '+water+'%</p><p><b>Trabajadores presentes:</b> '+workers+'</p><p><b>Responsable habitual:</b> '+p.worker+'</p><p>La parcela cambia con el tiempo. El riego y el trabajo de campo sostienen el crecimiento.</p><button class="v4p-action" id="agWater">REGAR ACEQUIA</button></div></div>';
 document.body.appendChild(d);d.querySelector('.v4p-close').onclick=()=>{d.remove();if(V.v4Playability)V.v4Playability.open=null};if(V.v4Playability)V.v4Playability.open=d;d.querySelector('#agWater').onclick=()=>waterParcel(p,d);return d}
function waterParcel(p,d){const s=state();if(!s.started)return;if(Number(s.energy)<8){toast('Necesitás más energía para mantener el riego.');return}s.energy-=8;s.minutes=(Number(s.minutes)||0)+10;p.moisture=Math.min(1,p.moisture+.32);p.watered=true;p.last=Number(s.minutes)||0;save();refresh();toast('RIEGO REALIZADO · '+p.label);if(d)d.remove();if(V.v4Playability)V.v4Playability.open=null}
function refresh(){const money=document.getElementById('money'),energy=document.getElementById('energy');if(money)money.textContent=Math.round(Number(state().money)||0);if(energy)energy.textContent=Math.round(Number(state().energy)||0)}
function update(){if(!state().started)return;const now=Number(state().minutes)||0;if(A.lastMinutes==null){A.lastMinutes=now;return}let dm=now-A.lastMinutes;if(dm<0||dm>120)dm=0;A.lastMinutes=now;if(!dm)return;for(const p of parcels){const activity=Math.min(2,Number(p.workerActivity||0));p.moisture=Math.max(0,p.moisture-dm*.0035);if(p.moisture>.22){const moistureFactor=.45+.55*p.moisture;p.growth=Math.min(1,p.growth+(dm/60)*.028*moistureFactor*(1+activity*.35))}p.watered=false}if(Math.floor(now/60)!==Math.floor((now-dm)/60))save()}
function draw(c){for(const p of parcels){const rows=6,cols=15,rowH=p.h/rows,colW=p.w/cols,vigor=.55+.45*p.growth;for(let r=0;r<rows;r++)for(let k=0;k<cols;k++){const x=p.x+k*colW+5+(r%2)*2,y=p.y+r*rowH+10,stem=3+Math.round(4*vigor);c.fillStyle='rgba(79,98,62,.82)';c.fillRect(Math.round(x),Math.round(y),Math.max(2,Math.round(colW*.42)),2);c.fillRect(Math.round(x+2),Math.round(y-stem),2,stem)}c.strokeStyle='rgba(92,74,51,.34)';c.lineWidth=2;c.strokeRect(p.x,p.y,p.w,p.h)}}
function patch(){if(A.patched)return;const life=V.life;if(!life)return;const oldUpdate=life.update;life.update=function(dt,minutes){if(typeof oldUpdate==='function')oldUpdate.call(life,dt,minutes);update()};const oldDraw=life.drawWorld;if(typeof oldDraw==='function')life.drawWorld=function(c){oldDraw.call(life,c);draw(c)};A.patched=true;A.hooks=['V.life.update','V.life.drawWorld'];A.features=['crop-state','irrigation','moisture','growth','parcel-boundaries','worker-activity','time-simulation','save-state']}
function keyboard(){if(A.keyboard)return;window.addEventListener('keydown',e=>{if(!state().started||state().dialogue||document.getElementById('v4pPanel'))return;const k=String(e.key||'').toLowerCase();if(k!=='e'&&k!==' ')return;const p=target();if(!p)return;e.preventDefault();e.stopImmediatePropagation();panel(p)},true);A.keyboard=true}
const style=document.createElement('style');style.id='v6AgricultureCSS';style.textContent='.v6ag-bar{height:9px;background:#18140f;border-radius:8px;overflow:hidden;margin:8px 0 14px}.v6ag-bar i{display:block;height:100%;background:#71845a}';if(!document.getElementById(style.id))document.head.appendChild(style);
load();patch();keyboard();setTimeout(patch,300);setTimeout(patch,900);
})();
