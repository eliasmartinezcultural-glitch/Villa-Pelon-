/* Villa Pelón V5 — DIÁLOGO E INTERACCIÓN
   Burbuja contextual sobre el personaje, estilo simulador de pueblo.
   No crea motor ni RAF. Usa el render existente sólo para posicionamiento lógico.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const D=V.v5Dialogue={version:1,enabled:true,style:'white-character-bubble',active:false};
const game=()=>document.getElementById('game');
const dialogue=()=>document.getElementById('dialogue');
const player=()=>V.state||{};
const esc=s=>String(s??'').replace(/[&<>\"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[m]));
function settings(){try{return JSON.parse(localStorage.getItem('villa_pelon_v4_settings')||'{}')}catch(_){return{}}}
function findSpeaker(){const b=dialogue();const name=document.getElementById('speaker')?.textContent?.trim();if(!name)return null;return (V.npcs||[]).find(n=>String(n.name).trim()===name)||null}
function screenPoint(n){const c=V.camera||{x:player().x,y:player().y,zoom:.82};const z=Number(c.zoom)||.82;return {x:innerWidth*.5+(n.x-c.x)*z,y:innerHeight*.5+(n.y-c.y)*z-52*z}}
function style(){if(document.getElementById('v5DialogueCSS'))return;const s=document.createElement('style');s.id='v5DialogueCSS';s.textContent=`
#dialogue.v5-bubble{position:fixed;left:0;top:0;width:min(290px,calc(100vw - 24px));min-height:0;padding:0;z-index:1800;transform:translate(-50%,-100%);background:#fff;color:#191919;border:3px solid #1c1c1c;border-radius:7px;box-shadow:5px 5px 0 rgba(0,0,0,.28);font-family:monospace;pointer-events:auto;transition:left .06s linear,top .06s linear;overflow:visible}
#dialogue.v5-bubble::after{content:"";position:absolute;left:50%;bottom:-13px;width:20px;height:14px;background:#fff;border-right:3px solid #1c1c1c;border-bottom:3px solid #1c1c1c;transform:translateX(-50%) rotate(45deg);z-index:-1}
#dialogue.v5-bubble::before{content:"";position:absolute;left:50%;bottom:-7px;width:8px;height:8px;background:#fff;transform:translateX(-50%) rotate(45deg);z-index:2}
#dialogue.v5-bubble #speaker{display:block;padding:7px 10px 2px;color:#222;font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:.5px}
#dialogue.v5-bubble #dialogueText{padding:2px 11px 8px;font-family:system-ui,sans-serif;font-size:14px;line-height:1.32;font-weight:500;min-height:0}
#dialogue.v5-bubble #dialogueNext{display:block;margin:0 8px 8px auto;padding:4px 8px;border:2px solid #222;background:#f1f1f1;color:#111;border-radius:3px;font:900 10px monospace;cursor:pointer}
#dialogue.v5-bubble #sourceLink{display:block;margin:0 10px 8px;color:#4b5f45;font:700 9px monospace;text-decoration:underline}
#dialogue.v5-bubble.v5-thinking{opacity:.96}
#v5-interact-prompt{position:fixed;z-index:1700;transform:translate(-50%,-100%);display:none;pointer-events:none;background:#fff;color:#171717;border:2px solid #171717;border-radius:4px;padding:3px 7px;box-shadow:3px 3px 0 rgba(0,0,0,.2);font:900 10px monospace;white-space:nowrap}
#v5-interact-prompt::after{content:"";position:absolute;left:50%;bottom:-7px;width:8px;height:8px;background:#fff;border-right:2px solid #171717;border-bottom:2px solid #171717;transform:translateX(-50%) rotate(45deg)}
@media(max-width:600px){#dialogue.v5-bubble{width:min(250px,calc(100vw - 20px))}#dialogue.v5-bubble #dialogueText{font-size:13px}#dialogue.v5-bubble #dialogueNext{font-size:9px}}
`;
document.head.appendChild(s)}
function prompt(){let p=document.getElementById('v5-interact-prompt');if(!p){p=document.createElement('div');p.id='v5-interact-prompt';(game()||document.body).appendChild(p)}return p}
function nearestNpc(){const s=player();let best=null,bd=150;for(const n of (V.npcs||[])){const d=Math.hypot(s.x-n.x,s.y-n.y);if(d<bd){bd=d;best=n}}return best}
function positionBubble(){const b=dialogue();if(!b||b.classList.contains('hidden')){D.active=false;return}const n=findSpeaker()||nearestNpc();if(!n)return;const p=screenPoint(n);const margin=8;const bw=Math.min(290,innerWidth-24);const x=Math.max(margin+bw/2,Math.min(innerWidth-margin-bw/2,p.x));const y=Math.max(90,Math.min(innerHeight-16,p.y));b.style.left=x+'px';b.style.top=y+'px';D.active=true;D.speaker=n.id}
function positionPrompt(){const p=prompt();if(player().dialogue){p.style.display='none';return}const n=nearestNpc();if(!n){p.style.display='none';return}const c=V.camera||{x:player().x,y:player().y,zoom:.82};const z=Number(c.zoom)||.82;const x=innerWidth*.5+(n.x-c.x)*z;const y=innerHeight*.5+(n.y-c.y)*z-35*z;p.style.left=Math.max(65,Math.min(innerWidth-65,x))+'px';p.style.top=Math.max(42,Math.min(innerHeight-18,y))+'px';p.textContent='E  HABLAR · '+n.name;p.style.display='block'}
function refresh(){positionBubble();positionPrompt();const b=dialogue();if(b&&!b.classList.contains('hidden'))b.classList.add('v5-bubble');const w=document.getElementById('weather');if(w&&V.life){const names={despejado:'Despejado',nublado:'Nublado',viento:'Viento',lluvia:'Lluvia'};w.textContent=names[V.life.weather]||V.life.weather||'Despejado'}}
function init(){style();prompt();refresh();setInterval(refresh,80);addEventListener('resize',refresh);document.addEventListener('visibilitychange',refresh);D.ready=true}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
