/* Villa Pelón V4 — INTEGRIDAD Y COMPATIBILIDAD FINAL
   Este adaptador convierte los restos históricos V2/V3 en estado V4 sin
   romper partidas existentes. V4 es la única identidad pública del juego.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const I=V.v4Integrity=V.v4Integrity||{version:4,checks:0,repairs:0,ready:false};
function repair(){
 I.checks++;
 if(V.state){if(V.state.version!==4){V.state.version=4;I.repairs++}}
 if(V.v4World){V.v4World.version=4}
 if(V.v4Characters){V.v4Characters.version=4}
 if(V.v4WorldRule)V.v4WorldRule.version=4;
 const e=V.engine;if(!e||e.__v4Integrity)return false;
 e.__v4Integrity=true;
 const oldSave=e.save,oldLoad=e.load;
 e.save=()=>{try{if(V.state)V.state.version=4;localStorage.setItem('villa_pelon_v4_save',JSON.stringify({...V.state,version:4,dialogue:false}));localStorage.setItem('villa_pelon_v4_world',JSON.stringify({citizens:V.v4World?.citizens||V.v3Citizens||[],traffic:V.v4World?.traffic||V.v3Traffic||[],animals:V.v4World?.animals||V.v3Animals||[]}));if(V.story?.save)V.story.save();if(V.state)V.state.saved=true;return true}catch(_){return oldSave?.()}};
 e.load=()=>{let loaded=false;try{const raw=localStorage.getItem('villa_pelon_v4_save')||localStorage.getItem('villa_pelon_v3_save')||localStorage.getItem('villa_pelon_v2_save');if(raw&&V.state){Object.assign(V.state,JSON.parse(raw));V.state.version=4;V.state.dialogue=false;loaded=true}}catch(_){}try{const raw=localStorage.getItem('villa_pelon_v4_world')||localStorage.getItem('villa_pelon_v3_world');const w=raw&&JSON.parse(raw);if(w){if(V.v3Citizens&&w.citizens)Object.assign(V.v3Citizens,w.citizens);if(V.v3Traffic&&w.traffic)Object.assign(V.v3Traffic,w.traffic);if(V.v3Animals&&w.animals)Object.assign(V.v3Animals,w.animals)}}catch(_){}try{if(V.story?.load)V.story.load()}catch(_){}return loaded||oldLoad?.()};
 I.ready=true;return true;
}
V.v4Integrity.repair=repair;V.v4Integrity.status=()=>({version:4,ready:I.ready,checks:I.checks,repairs:I.repairs,engine:!!V.engine,characters:!!V.v4Characters,world:!!V.v4World});
const tick=()=>repair()||requestAnimationFrame(tick);tick();
})();