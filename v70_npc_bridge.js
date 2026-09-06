/* Villa Pelón V70 — puente de identidad entre NPCs del juego y motor de vida.
   Evita que el NPC visible y el NPC interactuable sean dos entidades distintas.
*/
(()=>{'use strict';const V=window.VillaPelon||(window.VillaPelon={});
function sync(){if(!Array.isArray(V.npcs)||!V.life||!Array.isArray(V.life.ambient))return;const byName=new Map(V.life.ambient.map(n=>[String(n.name).toLowerCase(),n]));V.npcs.forEach(n=>{const a=byName.get(String(n.name).toLowerCase());if(!a)return;n.x=a.x;n.y=a.y;n.moving=!!a.moving;n.direction=a.direction||'down';n.walk=a.walk||0;n.activity=a.destination||null;n.sheltered=!!a.sheltered})}
V.npcBridge70={version:'V70',sync};let last=0;function loop(t){if(t-last>180){last=t;sync()}requestAnimationFrame(loop)}requestAnimationFrame(loop);
})();