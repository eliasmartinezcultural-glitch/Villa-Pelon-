/* Villa Pelón V4 — ADAPTADOR NARRATIVO
   Conserva las historias existentes, pero toda persistencia y estado quedan
   identificados como V4. El contenido histórico/ficcional no se duplica.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const KEY='villa_pelon_v4_story';
function migrate(){try{if(!localStorage.getItem(KEY)){const old=localStorage.getItem('villa_pelon_v2_story');if(old)localStorage.setItem(KEY,old)}}catch(_){}if(V.story){V.story.version=4;V.story.saveV4=()=>{try{localStorage.setItem(KEY,JSON.stringify({version:4,main:V.story.main,side:V.story.side,flags:V.story.flags,rel:V.story.rel}))}catch(_){}}}}
const wait=()=>{migrate();if(!V.story)requestAnimationFrame(wait)};wait();
V.v4Story={version:4,key:KEY,migrate};
})();