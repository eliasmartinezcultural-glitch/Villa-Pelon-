/* Villa Pelón V4 — DIRECCIÓN DE ARTE PIXEL ART
   Capa visual: no crea motor ni reemplaza la jugabilidad.
   Objetivo: lectura top-down 16/32-bit, bordes duros, UI retro, paleta territorial.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
V.pixelArt={version:4,style:'top-down-16bit',tile:16,palette:{earth:'#9b865f',sand:'#c8ad76',grass:'#687a52',water:'#5d8790',wood:'#765239',roof:'#624434',ink:'#30251d',cream:'#ead8a6',gold:'#c9a45c'}};
function install(){
 if(document.getElementById('v4PixelArtCSS'))return;
 const s=document.createElement('style');s.id='v4PixelArtCSS';s.textContent=`
 html,body{background:#211a15!important;color:#eadfc8!important}
 #world{image-rendering:pixelated;image-rendering:crisp-edges;shape-rendering:crispEdges;background:#9b865f}
 #game{background:#211a15!important;overflow:hidden}
 #hud{font-family:monospace!important;letter-spacing:.04em;text-shadow:2px 2px 0 #241b15}
 #hud .stat,#quest,.save{border-radius:0!important;border:2px solid #3a2b20!important;box-shadow:3px 3px 0 #17110d!important;background:rgba(42,32,24,.94)!important}
 #quest{font-family:monospace!important}
 #touch button{border-radius:0!important;image-rendering:pixelated!important;box-shadow:3px 3px 0 #17110d!important}
 .v4p-panel{border-radius:0!important;border:3px solid #b18b4e!important;background:#261d17!important;box-shadow:8px 8px 0 rgba(0,0,0,.65)!important;font-family:monospace!important}
 .v4p-head{border-radius:0!important;background:#34271e!important;border-bottom:3px solid #7b6038!important}
 .v4p-card{border-radius:0!important;border:2px solid #594532!important;background:#30251d!important;box-shadow:3px 3px 0 #17110d}
 .v4p-action,.v4p-close,#v4pTools button{border-radius:0!important;font-family:monospace!important;box-shadow:2px 2px 0 #17110d}
 .v4p-toast,.v4p-live{border-radius:0!important;font-family:monospace!important;box-shadow:4px 4px 0 #17110d!important}
 .v4p-dialog{font-family:monospace!important}
 .pixel-scanlines{position:absolute;inset:0;z-index:70;pointer-events:none;background:repeating-linear-gradient(0deg,rgba(255,255,255,.018) 0,rgba(255,255,255,.018) 1px,transparent 1px,transparent 4px);mix-blend-mode:soft-light}
 #pixelLegend{position:absolute;z-index:71;right:12px;bottom:12px;padding:6px 8px;background:rgba(30,23,18,.78);border:1px solid #6d5838;color:#d6c399;font:10px monospace;pointer-events:none}
 @media(max-width:700px){#pixelLegend{display:none}}
 `;document.head.appendChild(s);
 const game=document.getElementById('game');if(game&&!document.querySelector('.pixel-scanlines')){const o=document.createElement('div');o.className='pixel-scanlines';game.appendChild(o);const l=document.createElement('div');l.id='pixelLegend';l.textContent='VILLA PELÓN · 16-BIT';game.appendChild(l)}
 const canvas=document.getElementById('world');if(canvas){canvas.style.imageRendering='pixelated';const c=canvas.getContext('2d');if(c){c.imageSmoothingEnabled=false;c.lineCap='square';c.lineJoin='miter'}}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();