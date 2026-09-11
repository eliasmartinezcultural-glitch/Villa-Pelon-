/* V109 PATCH — final geometry normalization */
(()=>{'use strict';const V=window.VillaPelon||{},G=V.worldGeometry||{};
const r=(G.roads||[]).find(x=>x.id==='picada_gate');if(r){r.x=4900;r.y=2100;r.w=300;r.h=90}
G.plaza=G.plaza||{id:'plaza_central',x:900,y:250,w:620,h:410,label:'PLAZA CENTRAL'};
G.interactiveLandmarks=(G.landmarks||[]).map(x=>({...x,interactionRadius:120}));
V.educationalProgress=V.educationalProgress||{chaptersCompleted:[],factsLearned:[],sourcesChecked:[],fictionWarnings:[]};
V.educationalRule='Villa Pelón es una reconstrucción RPG educativa inspirada en San Patricio del Chañar; los elementos históricos deben distinguirse de la ficción del juego.';
})();
