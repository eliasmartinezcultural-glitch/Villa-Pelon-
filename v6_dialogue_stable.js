/* Villa Pelón V6.1 — GLOBOS DE DIÁLOGO ESTABLES
   Corrige parpadeo, límites de pantalla y solapamiento con HUD.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const D=V.v6Dialogue=V.v6Dialogue||{version:1,enabled:true};
let lastKey='';
function installCSS(){if(document.getElementById('v6DialogueStableCSS'))return;const s=document.createElement('style');s.id='v6DialogueStableCSS';s.textContent=`
#dialogue.v5-bubble,#dialogue.v6-stable{position:fixed!important;z-index:1100!important;box-sizing:border-box;width:min(276px,calc(100vw - 24px));max-height:min(230px,42vh);overflow:hidden!important;border:3px solid #1c1c1c!important;border-radius:0!important;box-shadow:4px 4px 0 rgba(0,0,0,.25)!important;transform:translate(-50%,0)!important;transition:none!important;animation:none!important;opacity:1!important;visibility:visible!important;}
#dialogue.v6-above{transform:translate(-50%,-100%)!important}
#dialogue.v5-bubble #dialogueText,#dialogue.v6-stable #dialogueText{max-height:120px;overflow:hidden;}
#dialogue.v5-bubble::after,#dialogue.v5-bubble::before{display:none!important}
#v5-interact-prompt{transition:none!important;animation:none!important}
@media(max-width:600px){#dialogue.v5-bubble,#dialogue.v6-stable{width:min(248px,calc(100vw - 16px));max-height:200px}#dialogue.v5-bubble #dialogueText,#dialogue.v6-stable #dialogueText{font-size:12px;line-height:1.3;max-height:100px}}
`;(document.head||document.documentElement).appendChild(s)}
function speaker(){const name=document.getElementById('speaker')?.textContent?.trim();return (V.npcs||[]).find(n=>String(n.name||'').trim()===name)||null}
function place(){const b=document.getElementById('dialogue');if(!b||b.classList.contains('hidden')){lastKey='';return}const n=speaker();if(!n)return;const c=V.camera||{x:V.state?.x||0,y:V.state?.y||0,zoom:.82};const z=Number(c.zoom)||.82;const sx=innerWidth*.5+(n.x-c.x)*z;const sy=innerHeight*.5+(n.y-c.y)*z-54*z;const bw=Math.min(276,innerWidth-24),margin=8;let x=Math.max(margin+bw/2,Math.min(innerWidth-margin-bw/2,sx));let y=sy;const topSafe=92,bottomSafe=innerHeight-14;const h=Math.min(230,Math.max(96,b.offsetHeight||140));let above=true;if(y-h<topSafe){above=false;y=sy+48*z}if(!above)y=Math.max(topSafe,Math.min(bottomSafe-h+8,y));else y=Math.max(topSafe+h,Math.min(bottomSafe,y));
 const key=[Math.round(x),Math.round(y),above?'a':'b'].join(':');if(key!==lastKey){b.style.left=x+'px';b.style.top=y+'px';b.classList.toggle('v6-above',above);b.classList.add('v6-stable');lastKey=key}}
function tick(){place();if(document.getElementById('dialogue')&&!document.getElementById('dialogue').classList.contains('hidden'))requestAnimationFrame(tick)}
function init(){installCSS();place();D.ready=true;requestAnimationFrame(tick);addEventListener('resize',place)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
