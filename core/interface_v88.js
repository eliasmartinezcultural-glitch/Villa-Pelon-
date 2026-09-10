(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={}),$=id=>document.getElementById(id),W=V.world||{w:8200,h:4200};
function ensureUI(){
  if($('vpTopActions'))return;
  const wrap=document.createElement('div');wrap.id='vpTopActions';wrap.innerHTML='<button id="vpMenuBtn">☰ MENÚ</button><button id="vpMapBtn">🗺 MAPA</button><button id="vpBagBtn">🎒 MOCHILA</button>';
  document.getElementById('game')?.appendChild(wrap);
  const panel=document.createElement('section');panel.id='vpPanel';panel.className='vp-panel hidden';panel.innerHTML='<div class="vp-panel-head"><b id="vpPanelTitle">MENÚ</b><button id="vpClose">×</button></div><div id="vpPanelBody"></div>';
  document.getElementById('game')?.appendChild(panel);
  const css=document.createElement('style');css.textContent='#game{position:relative}#vpTopActions{position:absolute;top:48px;right:8px;z-index:20;display:flex;gap:5px;flex-wrap:wrap;justify-content:flex-end}#vpTopActions button{font:800 11px monospace;border:2px solid #c8a86a;background:#1d2d22;color:#f4ead2;padding:8px 9px;border-radius:4px}.vp-panel{position:absolute;z-index:30;top:92px;right:8px;width:min(390px,92vw);max-height:72vh;overflow:auto;border:3px solid #c8a86a;background:#18261d;color:#f4ead2;box-shadow:0 12px 35px #0008}.vp-panel.hidden{display:none}.vp-panel-head{display:flex;justify-content:space-between;align-items:center;padding:12px 14px;background:#24382a;font:800 13px monospace}.vp-panel-head button{background:none;border:0;color:#f4ead2;font-size:24px}.vp-panel-body{padding:14px;font:13px/1.45 system-ui,sans-serif}.vp-row{padding:9px 0;border-bottom:1px solid #ffffff18}.vp-k{font:800 11px monospace;opacity:.7}.vp-map{display:block;width:100%;height:auto;aspect-ratio:8200/4200;background:#a99a70;border:2px solid #c8a86a;image-rendering:pixelated}.vp-note{opacity:.78;font-size:12px;margin-top:8px}';document.head.appendChild(css);
}
function panel(title,html){ensureUI();$('vpPanelTitle').textContent=title;$('vpPanelBody').innerHTML=html;$('vpPanel').classList.remove('hidden')}
function drawMap(c){
  const x=c.getContext('2d');x.imageSmoothingEnabled=false;x.fillStyle='#a99a70';x.fillRect(0,0,820,420);
  x.fillStyle='#9ca36a';x.fillRect(490,0,330,420);x.fillStyle='#67898c';x.fillRect(0,82,820,3);
  x.fillStyle='#c6b17e';x.fillRect(0,60,490,19);x.fillRect(0,212,820,13);
  x.fillStyle='#70563e';x.lineWidth=3;
  const route=V.worldGeometry?.routes?.find(r=>r.id==='picada21_route');
  if(route?.points?.length){x.beginPath();route.points.forEach((p,i)=>{const px=p.x/10,py=p.y/10;i?x.lineTo(px,py):x.moveTo(px,py)});x.stroke()}
  x.fillStyle='#3d5d44';x.font='bold 12px monospace';x.fillText('URBANO',30,35);x.fillText('RURAL',535,35);x.fillText('PICADA 21',700,390);
  const s=V.gameState||{x:1180,y:650};x.fillStyle='#fff';x.beginPath();x.arc(s.x/10,s.y/10,6,0,7);x.fill();
  const stop=V.worldGeometry?.points?.find(p=>p.id==='picada21_stop');if(stop){x.fillStyle='#d7b86e';x.fillRect(stop.x/10-5,stop.y/10-5,10,10);x.fillStyle='#f4ead2';x.font='9px monospace';x.fillText('PARADA',stop.x/10-25,stop.y/10-9)}
}
function openMap(){panel('MAPA','<canvas id="vpMapCanvas" class="vp-map" width="820" height="420"></canvas><div class="vp-note">Mundo fijo: 8200 × 4200. La ruta rural conecta el núcleo urbano con Picada 21 y comparte la misma matriz territorial que el motor.</div>');drawMap($('vpMapCanvas'))}
function openBag(){const inv=V.gameState?.inventory||[];panel('MOCHILA',inv.length?inv.map((i,n)=>'<div class="vp-row"><span class="vp-k">OBJETO '+String(n+1).padStart(2,'0')+'</span><br>'+String(i)+'</div>').join(''):'<div class="vp-row">La mochila está vacía.</div>')}
function openMenu(){panel('MENÚ','<div class="vp-row"><b>VILLA PELÓN · HISTORIA VIVA</b><br>Exploración libre · misiones · memoria local</div><div class="vp-row"><span class="vp-k">MUNDO</span><br>8200 × 4200 · urbano + rural + Picada 21</div><div class="vp-row"><span class="vp-k">CONTROLES</span><br>PC: WASD / flechas · E interactuar<br>Móvil: controles táctiles</div><div class="vp-row"><button id="vpSaveNow">GUARDAR PARTIDA</button></div>');$('vpSaveNow')?.addEventListener('click',()=>V.saveGame?.())}
function bind(){ensureUI();$('vpMenuBtn').onclick=openMenu;$('vpMapBtn').onclick=openMap;$('vpBagBtn').onclick=openBag;$('vpClose').onclick=()=>$('vpPanel').classList.add('hidden')}
ensureUI();bind();V.interface={version:'88.2',menu:openMenu,map:openMap,backpack:openBag};
})();
