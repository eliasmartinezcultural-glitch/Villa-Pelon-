/* Villa Pelón V4 — compatibilidad narrativa.
   La jugabilidad, misiones y diálogos viven únicamente en v4_playability.js.
   Este archivo evita que el antiguo runtime V2 vuelva a tomar el control. */
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
V.story=V.story||{};
V.story.version=4;
V.story.main=0;
V.story.missions=[];
V.story.side={};
V.story.flags=V.story.flags||{};
V.story.rel=V.story.rel||{};
V.story.active=false;
V.storyJob=V.storyJob||{x:2530,y:820};
V.historySpots=V.historySpots||[
 {x:2220,y:500,id:'origen'},
 {x:2700,y:1320,id:'riego'},
 {x:3320,y:1130,id:'vinos'}
];
V.story.refresh=()=>V.v4Playability?.refreshMission?.();
V.story.interact=()=>V.v4Playability?.interact?.()||false;
V.story.saveV4=()=>V.v4Playability?.save?.();
})();