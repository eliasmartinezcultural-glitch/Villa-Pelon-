/* Villa Pelón V4 — SISTEMA HUMANO COMPLETO
   Render humano único: cabeza, cuello, torso, brazos, manos, cadera, dos piernas,
   pies, rostro, cabello, ropa, accesorios, proporciones y animación.
   Cada habitante conserva una apariencia diferenciada y legible a distancia.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});const C=V.v4Characters=V.v4Characters||{};C.version=4;
const palettes=[
 {skin:'#d9a17b',hair:'#3b2b24',shirt:'#315d9d',pants:'#343d49',shoes:'#292723'},
 {skin:'#c98e68',hair:'#5b3927',shirt:'#8a5b38',pants:'#51453b',shoes:'#2d2925'},
 {skin:'#e0b18b',hair:'#252321',shirt:'#9b4f43',pants:'#3f4541',shoes:'#302a27'},
 {skin:'#b97855',hair:'#3a261e',shirt:'#6d7650',pants:'#41372f',shoes:'#292621'},
 {skin:'#d3a07d',hair:'#72513b',shirt:'#b17b3e',pants:'#4a4742',shoes:'#302b28'},
 {skin:'#e5b995',hair:'#191817',shirt:'#5c6e82',pants:'#4b3e38',shoes:'#292522'}
];
const hairStyles=['short','long','crop','cap','curly','ponytail'];
const clothes=['shirt','jacket','dress','work','school'];
function make(n={},i=0){const p=palettes[Math.abs(i)%palettes.length];const seed=(Math.abs((n.id||n.name||'person').split('').reduce((a,c)=>a+c.charCodeAt(0),0))+i*17)%997;return Object.assign({
 height:.88+(seed%7)*.06,build:.38+(seed%6)*.06,age:18+(seed%55),gender:seed%2?'female':'male',
 skin:p.skin,hair:p.hair,shirt:p.shirt,pants:p.pants,shoes:p.shoes,hairStyle:hairStyles[seed%hairStyles.length],
 clothing:clothes[seed%clothes.length],facialHair:seed%5===0,hat:false,bag:false,tool:false,expression:'neutral',facing:'down',appearanceSeed:seed
 },n,{skin:n.skin||p.skin,hair:n.hair||p.hair,shirt:n.shirt||n.color||p.shirt,pants:n.pants||p.pants,shoes:n.shoes||p.shoes,
 height:n.height||(.88+(seed%7)*.06),build:n.build??(.38+(seed%6)*.06),age:n.age||18+(seed%55),hairStyle:n.hairStyle||hairStyles[seed%hairStyles.length]});}
function collect(){const out=[],seen=new Set();const add=(n,i)=>{if(!n||n.x==null||seen.has(n))return;seen.add(n);out.push(make(n,i))};(V.npcs||[]).forEach((n,i)=>add(n,i));return out}
function limb(ctx,x1,y1,x2,y2,width,color){ctx.strokeStyle='#302722';ctx.lineWidth=width+3;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke()}
function hair(ctx,style,color){ctx.fillStyle=color;ctx.strokeStyle='#30251f';ctx.lineWidth=1.5;ctx.beginPath();if(style==='long'){ctx.arc(0,-29,15,Math.PI,Math.PI*2);ctx.lineTo(15,2);ctx.quadraticCurveTo(9,7,6,1);ctx.lineTo(-7,5);ctx.quadraticCurveTo(-14,7,-15,0)}else if(style==='curly'){ctx.arc(-9,-28,8,0,Math.PI*2);ctx.arc(0,-32,9,0,Math.PI*2);ctx.arc(9,-28,8,0,Math.PI*2);ctx.lineTo(13,-16);ctx.lineTo(-13,-16)}else if(style==='ponytail'){ctx.arc(0,-29,15,Math.PI,Math.PI*2);ctx.lineTo(13,-17);ctx.lineTo(-13,-17);ctx.fill();ctx.beginPath();ctx.arc(15,-23,7,0,Math.PI*2);ctx.fill();ctx.stroke();return}else{ctx.arc(0,-29,15,Math.PI,Math.PI*2);ctx.lineTo(14,-18);ctx.quadraticCurveTo(5,-22,0,-18);ctx.quadraticCurveTo(-6,-22,-14,-18)}ctx.closePath();ctx.fill();ctx.stroke()}
function draw(ctx,n){
 const s=n.height||1,b=Math.max(.34,Math.min(.82,n.build||.5)),x=n.x,y=n.y;ctx.save();ctx.translate(x,y);ctx.scale(s,s);
 const skin=n.skin||'#d7a07b',hairColor=n.hair||'#40312a',shirt=n.player?'#315d9d':n.shirt||'#68765e',pants=n.pants||'#4b4b45',shoes=n.shoes||'#292723';
 const moving=!!n.moving||!!n.player&&(V.engine?.input?.up||V.engine?.input?.down||V.engine?.input?.left||V.engine?.input?.right);const phase=moving?Math.sin(performance.now()/115+(n.appearanceSeed||0)):.0;
 /* sombra */ctx.fillStyle='rgba(25,19,15,.32)';ctx.beginPath();ctx.ellipse(0,39,17+10*b,6,0,0,Math.PI*2);ctx.fill();
 /* piernas: dos piezas claramente separadas, con rodilla, tobillo y zapatos */
 const hipY=8,kneeY=27,footY=43,legGap=4.5+3*b;const lx=-legGap+phase*3,rx=legGap-phase*3;
 limb(ctx,lx,hipY,lx+phase*2,kneeY,7,pants);limb(ctx,lx+phase*2,kneeY,lx-phase*1.5,footY,6,pants);
 limb(ctx,rx,hipY,rx-phase*2,kneeY,7,pants);limb(ctx,rx-phase*2,kneeY,rx+phase*1.5,footY,6,pants);
 /* calcetín/tobillo */ctx.fillStyle=skin;ctx.fillRect(lx-2,footY-2,4,5);ctx.fillRect(rx-2,footY-2,4,5);
 /* zapatos */limb(ctx,lx-1,footY+2,lx-11,footY+3,5,shoes);limb(ctx,rx+1,footY+2,rx+11,footY+3,5,shoes);
 /* cadera/cintura */ctx.fillStyle=pants;ctx.strokeStyle='#2d2723';ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(-9-5*b,1,18+10*b,11,4);ctx.fill();ctx.stroke();
 /* torso con cuello y ropa */const bw=15+16*b;ctx.fillStyle=shirt;ctx.strokeStyle='#2d2723';ctx.lineWidth=2.2;ctx.beginPath();ctx.roundRect(-bw/2,-19,bw,30,6);ctx.fill();ctx.stroke();
 /* cuello */ctx.fillStyle=skin;ctx.fillRect(-4,-22,8,7);ctx.strokeStyle='#352820';ctx.strokeRect(-4,-22,8,7);
 /* ropa diferenciada */const role=(n.role||'').toLowerCase(),style=n.clothing||'shirt';if(style==='jacket'||/camion|rural|jornal|product|repart/.test(role)){ctx.fillStyle='rgba(20,25,27,.25)';ctx.fillRect(-bw/2+3,-16,bw-6,22);ctx.strokeStyle='rgba(30,27,24,.65)';ctx.beginPath();ctx.moveTo(0,-16);ctx.lineTo(0,9);ctx.stroke();}else if(style==='dress'){ctx.fillStyle=shirt;ctx.beginPath();ctx.moveTo(-bw/2,-18);ctx.lineTo(bw/2,-18);ctx.lineTo(bw/2+8,12);ctx.lineTo(-bw/2-8,12);ctx.closePath();ctx.fill();}else if(style==='school'||/escuela|estudiante|niñ/.test(role)){ctx.fillStyle='#e6dfc7';ctx.fillRect(-bw/2+3,-13,bw-6,5);ctx.fillStyle='#315d9d';ctx.fillRect(-3,-13,6,23);}
 /* brazos y manos, siempre visibles */const armY=-12,handY=10;limb(ctx,-bw/2+3,armY,-bw/2-7+phase*3,handY,7,shirt);limb(ctx,bw/2-3,armY,bw/2+7-phase*3,handY,7,shirt);ctx.fillStyle=skin;ctx.strokeStyle='#352820';ctx.lineWidth=1.4;ctx.beginPath();ctx.arc(-bw/2-7+phase*3,handY,4.3,0,Math.PI*2);ctx.arc(bw/2+7-phase*3,handY,4.3,0,Math.PI*2);ctx.fill();ctx.stroke();
 /* bolsillo, cinturón y accesorio */if(style!=='dress'){ctx.strokeStyle='rgba(38,32,27,.55)';ctx.lineWidth=1.5;ctx.strokeRect(bw*.12,-4,6,8);ctx.fillStyle='#5a4634';ctx.fillRect(-bw/2,5,bw,3)}if(n.bag){ctx.fillStyle='#5b4a3c';ctx.fillRect(bw/2-2,-7,8,14)}if(n.tool||/rural|jornal|product/.test(role)){ctx.strokeStyle='#624b35';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(bw/2+7,4);ctx.lineTo(bw/2+12,-12);ctx.stroke();ctx.fillStyle='#7d6847';ctx.fillRect(bw/2+8,-14,9,4)}
 /* cabeza y orejas */const age=n.age||35,head=age<16?11:age>60?14:13;ctx.fillStyle=skin;ctx.strokeStyle='#352720';ctx.lineWidth=1.8;ctx.beginPath();ctx.ellipse(0,-30,head,head*1.08,0,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.beginPath();ctx.arc(-head,-29,3.2,0,Math.PI*2);ctx.arc(head,-29,3.2,0,Math.PI*2);ctx.fill();ctx.stroke();
 /* cabello */hair(ctx,n.hairStyle,hairColor);
 /* gorra opcional */if(n.hat||/camion|rural/.test(role)){ctx.fillStyle=hairColor;ctx.strokeStyle='#2e2723';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(0,-34,14,Math.PI,Math.PI*2);ctx.fill();ctx.stroke();ctx.fillRect(-16,-34,31,4)}
 /* rostro: cejas, ojos, pupilas, nariz, boca */ctx.strokeStyle='#382b25';ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(-8,-34);ctx.lineTo(-3,-35);ctx.moveTo(3,-35);ctx.lineTo(8,-34);ctx.stroke();ctx.fillStyle='#fffaf0';ctx.beginPath();ctx.ellipse(-5,-29,3.2,2.4,0,0,Math.PI*2);ctx.ellipse(5,-29,3.2,2.4,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#171515';ctx.beginPath();ctx.arc(-5,-29,1.25,0,Math.PI*2);ctx.arc(5,-29,1.25,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#925c49';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(0,-28);ctx.lineTo(-1,-22);ctx.lineTo(2,-22);ctx.stroke();ctx.strokeStyle=n.expression==='happy'?'#9b4e4b':'#713e3b';ctx.lineWidth=1.2;ctx.beginPath();n.expression==='sad'?ctx.arc(0,-20,4,Math.PI+.2,Math.PI*2-.2):ctx.arc(0,-21,4,.15,Math.PI-.15);ctx.stroke();
 if(n.facialHair&&age>18){ctx.fillStyle=hairColor;ctx.beginPath();ctx.arc(0,-20,5,0,Math.PI);ctx.fill()}
 /* identificación sutil */if(n.player){ctx.fillStyle='#f2d98d';ctx.font='bold 9px system-ui';ctx.textAlign='center';ctx.fillText('TÚ',0,56)}
 ctx.restore();
}
function install(){if(!V.engine||C.installed)return false;C.installed=true;const e=V.engine;const base=e.render;e.render=()=>{base();const chars=collect();for(const n of chars)draw(e.ctx,n);if(V.state)draw(e.ctx,make({x:V.state.x,y:V.state.y,player:true,id:'player',name:'TÚ',height:1,build:.5,shirt:'#315d9d',hair:'#39302b',skin:'#d9a47e',pants:'#3f4549',shoes:'#292723',hairStyle:'short',age:30,clothing:'jacket'},99))};return true}
C.make=make;C.draw=draw;C.collect=collect;C.install=install;C.profiles={version:4,body:'head-neck-torso-hips-two-legs-feet',arms:'two arms + hands',faces:'eyes-pupils-eyebrows-nose-mouth-ears',hair:'6 styles',clothing:'5 styles + profession',accessories:'bags-tools-hats',proportions:'height-build-age',animation:'walk-leg-and-arm-swing',identity:'stable appearance seed'};
const wait=()=>install()||requestAnimationFrame(wait);wait();
})();