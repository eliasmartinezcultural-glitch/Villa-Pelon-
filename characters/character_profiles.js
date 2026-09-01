/* Villa Pelón V4 — PERFIL HUMANO
   Sistema determinista de identidad visual. Ninguna persona nace como clon.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const P=V.characterProfiles=V.characterProfiles||{};
const palettes=[
 {skin:'#d9a17b',hair:'#3b2b24',shirt:'#315d9d',pants:'#343d49',shoes:'#292723'},
 {skin:'#c98e68',hair:'#5b3927',shirt:'#8a5b38',pants:'#51453b',shoes:'#2d2925'},
 {skin:'#e0b18b',hair:'#252321',shirt:'#9b4f43',pants:'#3f4541',shoes:'#302a27'},
 {skin:'#b97855',hair:'#3a261e',shirt:'#6d7650',pants:'#41372f',shoes:'#292621'},
 {skin:'#d3a07d',hair:'#72513b',shirt:'#b17b3e',pants:'#4a4742',shoes:'#302b28'},
 {skin:'#e5b995',hair:'#191817',shirt:'#5c6e82',pants:'#4b3e38',shoes:'#292522'},
 {skin:'#c48963',hair:'#6a4632',shirt:'#735c8f',pants:'#41484a',shoes:'#302925'},
 {skin:'#e4b58f',hair:'#302820',shirt:'#527b6c',pants:'#51453c',shoes:'#292725'}
];
const hairs=['short','long','crop','cap','curly','ponytail','wavy','bun'];
const clothes=['shirt','jacket','dress','work','school','hoodie','sweater'];
const roles={
 rural:{clothing:'work',tool:true,hat:true},jornal:{clothing:'work',tool:true,hat:true},productor:{clothing:'work',tool:true,hat:true},
 comercio:{clothing:'shirt',bag:false},panadero:{clothing:'apron',tool:false},escuela:{clothing:'school',bag:true},estudiante:{clothing:'school',bag:true},
 radio:{clothing:'shirt',bag:true},plaza:{clothing:'hoodie'},niño:{clothing:'school'},niña:{clothing:'school'},anciano:{clothing:'sweater'},anciana:{clothing:'sweater'},
 chofer:{clothing:'jacket'},repartidor:{clothing:'work',tool:true},vecino:{clothing:'shirt'}
};
function seedOf(n,i=0){const raw=String(n?.id||n?.name||n?.kind||'person');let s=0;for(let k=0;k<raw.length;k++)s=(s*31+raw.charCodeAt(k))%1000003;return Math.abs(s+i*97)%1000003}
function make(input={},i=0){const n=input||{},seed=seedOf(n,i),p=palettes[seed%palettes.length],role=String(n.role||n.kind||'vecino').toLowerCase();const age=Number.isFinite(n.age)?n.age:18+(seed%55);let gender=n.gender||((seed%2)?'female':'male');if(/niñ|estudiante/.test(role)&&seed%3===0)gender='female';const r=roles[role]||{};return Object.assign({
 id:n.id||`person_${seed}`,name:n.name||'Vecino',age,gender,role,
 height:.84+(seed%9)*.055,build:.38+(seed%8)*.055,
 skin:p.skin,hair:p.hair,shirt:p.shirt,pants:p.pants,shoes:p.shoes,
 hairStyle:hairs[seed%hairs.length],clothing:r.clothing||clothes[seed%clothes.length],
 faceShape:['oval','round','long'][seed%3],eyeStyle:['normal','small','wide'][seed%3],
 expression:['neutral','happy','serious','tired'][seed%4],facialHair:(gender==='male'&&age>20&&seed%5===0),
 hat:!!r.hat,bag:!!r.bag,tool:!!r.tool,appearanceSeed:seed,
 walkingPhase:(seed%360)/57,profileVersion:4
 },n,{height:n.height??(.84+(seed%9)*.055),build:n.build??(.38+(seed%8)*.055),age:n.age??age,skin:n.skin||p.skin,hair:n.hair||p.hair,shirt:n.shirt||n.color||p.shirt,pants:n.pants||p.pants,shoes:n.shoes||p.shoes,hairStyle:n.hairStyle||hairs[seed%hairs.length],clothing:n.clothing||r.clothing||clothes[seed%clothes.length],appearanceSeed:seed});}
P.make=make;P.seedOf=seedOf;P.palettes=palettes;P.version=4;
})();