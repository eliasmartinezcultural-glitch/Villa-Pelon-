/* Villa Pelón V5 — PUENTE NPC / DIÁLOGO / MUNDO VIVO
   Conecta la conversación con memoria y relaciones y mantiene la vida ambiental
   activa mientras el globo está abierto. No crea requestAnimationFrame.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const B=V.npcBridgeV5={version:1,enabled:true,dialogueMemory:true,lifeDuringDialogue:true};
const S=()=>V.state||{};
let lastSpeaker='';let lastTick=performance.now();
function current(){const el=document.getElementById('speaker');if(!el)return null;const name=el.textContent.trim();return (V.npcs||[]).find(n=>String(n.name).trim()===name)||null}
function persist(){const s=S();try{localStorage.setItem('villa_pelon_v5_npc_memory',JSON.stringify({npcMemory:s.npcMemory||{},relationships:s.relationships||{},day:s.day||1}))}catch(_){} }
function restore(){const s=S();try{const d=JSON.parse(localStorage.getItem('villa_pelon_v5_npc_memory')||'null');if(d){s.npcMemory=d.npcMemory||{};s.relationships=Object.assign({},s.relationships||{},d.relationships||{})}}catch(_){} }
function syncDialogue(){const n=current();if(!n)return;if(n.id!==lastSpeaker){lastSpeaker=n.id;if(V.npcLifeV5?.onTalk){const lines=V.npcLifeV5.onTalk(n);const b=document.getElementById('dialogue');if(lines&&b){b.dataset.lines=JSON.stringify(lines);b.dataset.index='0';const t=document.getElementById('dialogueText');if(t)t.textContent=lines[0]||''}}persist()}}
function livingWorld(dt){const s=S();if(!s.started||!s.dialogue)return;if(V.life?.update){try{V.life.update(dt,s.minutes)}catch(_){} }if(V.npcLifeV5?.update)try{V.npcLifeV5.update(dt)}catch(_){} }
function tick(){const now=performance.now(),dt=Math.min(.12,Math.max(.016,(now-lastTick)/1000));lastTick=now;syncDialogue();livingWorld(dt)}
restore();setInterval(tick,80);B.ready=true;V.v4?.register?.('npcBridgeV5',B);
})();