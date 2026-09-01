/* Villa Pelón V4 — REGISTRO UNIFICADO DEL MUNDO */
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const world=V.world||(V.world={w:4200,h:2700});
V.v4World=V.v4World||{version:4,world,places:[],citizens:[],traffic:[],animals:[]};
function sync(){V.v4World.places=V.buildings||[];V.v4World.citizens=V.v3Citizens||V.npcs||[];V.v4World.traffic=V.v3Traffic||[];V.v4World.animals=V.v3Animals||[];V.v4World.player=V.state?{x:V.state.x,y:V.state.y}:null;V.v4World.time=V.state?{day:V.state.day,minutes:V.state.minutes}:null}
V.v4World.sync=sync;sync();setInterval(sync,500);
})();