/* Villa Pelón V4 — REGISTRO UNIFICADO + ORDEN TERRITORIAL
   El mundo se organiza por capas: calzada, vereda, lote, producción y naturaleza.
   La calzada queda libre de construcciones y decoración.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const world=V.world||(V.world={w:4200,h:2700});
const road={horizontal:{y1:700,y2:930},vertical:{x1:1180,x2:1400}};
const onRoad=(x,y)=>((y>road.horizontal.y1&&y<road.horizontal.y2)||(x>road.vertical.x1&&x<road.vertical.x2));
V.v4World=V.v4World||{version:4,world,places:[],citizens:[],traffic:[],animals:[],rules:{}};
V.v4World.rules={
  road:'SOLO_CIRCULACION',
  buildings:'FUERA_DE_CALZADA',
  vegetation:'FUERA_DE_CALZADA',
  pedestrians:'PERMITIDOS',
  vehicles:'PERMITIDOS',
  machinery:'PERMITIDA_EN_ZONAS_CORRESPONDIENTES'
};
function sync(){
 V.v4World.places=V.buildings||[];V.v4World.citizens=V.v3Citizens||V.npcs||[];V.v4World.traffic=V.v3Traffic||[];V.v4World.animals=V.v3Animals||[];V.v4World.player=V.state?{x:V.state.x,y:V.state.y}:null;V.v4World.time=V.state?{day:V.state.day,minutes:V.state.minutes}:null;
 V.v4World.audit={buildings:V.v4World.places.filter(b=>b&&onRoad(b.x,b.y)).length,trees:0,traffic:V.v4World.traffic.length};
}
V.v4World.onRoad=onRoad;V.v4World.sync=sync;sync();setInterval(sync,500);
})();