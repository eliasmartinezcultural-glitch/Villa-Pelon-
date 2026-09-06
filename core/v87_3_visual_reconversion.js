/* VILLA PELÓN V87.3 — RECONVERSIÓN VISUAL
   Capa visual profesional: pixel art fino, paleta pastel, ambiente legible,
   personajes, objetos ambientales e información temporal.
   No amplía el mundo. No crea otro game loop.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const W=V.worldAuthority?.geometry||V.worldGeometry||V.world;if(!W)return;
const PAL={
 sky:'#dcecf0',grass:'#9fbd86',grass2:'#b8ce9a',grass3:'#789f72',soil:'#c7a77e',soil2:'#b58f68',
 water:'#8fc7cf',water2:'#b5dfe0',road:'#8b8f89',road2:'#aeb2aa',roadEdge:'#6f756f',
 wall:'#ead7b5',wall2:'#f3e5c9',roof:'#a98272',roof2:'#c39a86',wood:'#9d795d',
 barda:'#b79a7d',barda2:'#d1b493',foliage:'#769b70',foliage2:'#a6bf7c',
 skin:'#e5b08e',hair:'#665047',shirt:'#86a99a',shirt2:'#6f9184',pants:'#7890a5',
 boot:'#63584f',outline:'#3e4741',glass:'#b6d8dc',sun:'#f2d99b',white:'#fff9ec',accent:'#d5a875'
};
V.visualTheme={version:'V87.3.0',pixelSize:1,antiAlias:false,palette:PAL,style:'pixel-art-pastel',rules:[
 'pixel mínimo de 1 unidad','sin degradados fotográficos','contraste suave','sombras cortas','detalle fino legible','paleta pastel territorial'
]};

// Intro: cuatro tarjetas simples, interactivas y progresivas.
const INTRO=[
 {eyebrow:'01 · EL LUGAR',title:'Antes de ser un pueblo, fue territorio.',text:'Primero estuvo el río, el monte, las bardas y la tierra. Acá empieza el viaje.'},
 {eyebrow:'02 · EL AGUA',title:'El agua cambió la vida.',text:'Canales, chacras y caminos hicieron posible que las familias se quedaran y trabajaran.'},
 {eyebrow:'03 · LA GENTE',title:'Un pueblo también se construye caminando.',text:'Vas a conocer vecinos, trabajar, comprar, viajar y descubrir historias mientras vivís el territorio.'},
 {eyebrow:'04 · TU HISTORIA',title:'Ahora te toca recorrerlo.',text:'Algunas historias serán ficción. Los datos documentales estarán señalados y tendrán fuente.'}
];
V.introCards=INTRO;
function buildIntro(){
 const card=document.getElementById('introCard');if(!card||document.getElementById('introCards'))return;
 const wrap=document.createElement('div');wrap.id='introCards';wrap.className='intro-cards';
 INTRO.forEach((it,i)=>{const b=document.createElement('button');b.type='button';b.className='intro-card';b.dataset.i=i;b.innerHTML='<small>'+it.eyebrow+'</small><strong>'+it.title+'</strong><span>'+it.text+'</span><em>'+(i<3?'TOCÁ PARA CONTINUAR':'ENTRAR AL TERRITORIO')+'</em>';b.onclick=()=>{wrap.dataset.active=String(i);if(i===3){document.getElementById('startBtn')?.click()}};wrap.appendChild(b)});
 card.appendChild(wrap);wrap.dataset.active='0';
 const style=document.createElement('style');style.textContent=`
 .intro-cards{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin:16px auto;max-width:980px}.intro-card{appearance:none;border:1px solid rgba(255,249,236,.25);border-radius:16px;padding:15px;text-align:left;background:rgba(255,249,236,.08);color:${PAL.white};cursor:pointer;min-height:150px;transition:transform .18s ease,background .18s ease}.intro-card:hover,.intro-card:focus{transform:translateY(-3px);background:rgba(255,249,236,.14)}.intro-card small,.intro-card strong,.intro-card span,.intro-card em{display:block}.intro-card small{opacity:.72;letter-spacing:.12em}.intro-card strong{margin:9px 0;font-size:1rem}.intro-card span{font-size:.82rem;line-height:1.4;opacity:.9}.intro-card em{margin-top:12px;font-size:.68rem;letter-spacing:.08em;opacity:.7}.intro-cards[data-active="0"] .intro-card:not([data-i="0"]),.intro-cards[data-active="1"] .intro-card:not([data-i="1"]),.intro-cards[data-active="2"] .intro-card:not([data-i="2"]),.intro-cards[data-active="3"] .intro-card:not([data-i="3"]){opacity:.42}.intro-cards[data-active="1"] .intro-card[data-i="1"],.intro-cards[data-active="2"] .intro-card[data-i="2"],.intro-cards[data-active="3"] .intro-card[data-i="3"]{transform:translateY(-3px);background:rgba(255,249,236,.15)}
 @media(max-width:720px){.intro-cards{grid-template-columns:1fr 1fr;max-height:250px;overflow:auto}.intro-card{min-height:125px;padding:12px}.intro-card strong{font-size:.88rem}.intro-card span{font-size:.74rem}}
 #world{image-rendering:pixelated;image-rendering:crisp-edges}.hud{background:rgba(246,239,221,.92)!important;color:${PAL.outline}!important;border-color:rgba(62,71,65,.16)!important;box-shadow:0 3px 18px rgba(62,71,65,.12)}
 .quest{background:rgba(246,239,221,.94)!important;color:${PAL.outline}!important;border-color:rgba(62,71,65,.14)!important}.touch button,.save{background:rgba(246,239,221,.94)!important;color:${PAL.outline}!important;border-color:rgba(62,71,65,.15)!important}
 `;document.head.appendChild(style);
}
buildIntro();

// HUD temporal claro: día, hora y periodo del día.
function period(min){const h=Math.floor((min%1440)/60);if(h<6)return'NOCHE';if(h<10)return'MAÑANA TEMPRANO';if(h<13)return'MAÑANA';if(h<18)return'TARDE';if(h<21)return'ATARDECER';return'NOCHE'}
function temporalHUD(){
 const s=V.gameState;if(!s)return;let el=document.getElementById('territoryTime');if(!el){el=document.createElement('div');el.id='territoryTime';el.className='territory-time';document.getElementById('game')?.appendChild(el);const st=document.createElement('style');st.textContent=`.territory-time{position:fixed;right:12px;top:62px;z-index:8;padding:9px 13px;border-radius:14px;background:rgba(246,239,221,.94);border:1px solid rgba(62,71,65,.15);box-shadow:0 4px 16px rgba(62,71,65,.1);color:${PAL.outline};font-family:system-ui,sans-serif;line-height:1.1;text-align:right}.territory-time b{display:block;font-size:1.05rem}.territory-time span{font-size:.68rem;opacity:.7;letter-spacing:.08em}@media(max-width:600px){.territory-time{top:54px;right:8px;padding:7px 9px}.territory-time b{font-size:.9rem}}`;document.head.appendChild(st)}
 const hh=String(Math.floor((s.minutes%1440)/60)).padStart(2,'0'),mm=String(Math.floor(s.minutes%60)).padStart(2,'0');el.innerHTML='<b>'+hh+':'+mm+'</b><span>DÍA '+s.day+' · '+period(s.minutes)+'</span>';
}
const oldUI=V.gameState&&V.gameState.ui;
if(V.gameState){const s=V.gameState;const timer=setInterval(()=>{if(s.started)temporalHUD()},500);V.visualTheme._timer=timer}

// Personajes: identidad visual por rol, pequeños detalles y dirección.
V.characterPalette={player:{skin:PAL.skin,shirt:'#86a99a',pants:'#7890a5'},farmer:{skin:PAL.skin,shirt:'#a4b887',pants:'#7d8e91'},teacher:{skin:'#dca889',shirt:'#c5a7b8',pants:'#78869a'},shopkeeper:{skin:'#e2ad89',shirt:'#d1ad78',pants:'#7d8b79'},driver:{skin:'#dba986',shirt:'#8199a6',pants:'#68747e'},child:{skin:'#e7b391',shirt:'#b3c99d',pants:'#8ba2b7'}};
V.characterDetails={head:20,body:30,outline:1,eye:2,highlight:1,shoe:5,shadowOpacity:.16};

// Ambiente: elementos pequeños reutilizables sin llenar de objetos el viewport.
V.environmentPalette={fence:PAL.wood,post:PAL.wood,sign:PAL.wall2,flower:'#d7b6bf',yellowFlower:'#e0c784',treeDark:PAL.grass3,treeLight:PAL.foliage2,rock:PAL.barda2,metal:PAL.roadEdge};

// Vehículos: escala y acabado pastel consistente.
if(Array.isArray(V.vehicles))V.vehicles.forEach(v=>{v.palette=v.palette||PAL;v.pixelSize=1;});

// Capa de detalles: sólo elementos del viewport, sin segundo loop.
let fx=null,fctx=null;
function init(){const base=document.getElementById('world');if(!base||fx)return;fx=document.createElement('canvas');fx.id='v873Details';fx.style.cssText='position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:3;image-rendering:pixelated';base.parentElement.style.position=base.parentElement.style.position||'relative';base.parentElement.appendChild(fx);fctx=fx.getContext('2d');fctx.imageSmoothingEnabled=false;resize()}
function resize(){if(!fx)return;const d=Math.min(devicePixelRatio||1,2);fx.width=Math.floor(innerWidth*d);fx.height=Math.floor(innerHeight*d);fctx.setTransform(d,0,0,d,0,0);fctx.imageSmoothingEnabled=false}
addEventListener('resize',resize,{passive:true});
function draw(){if(!fx||!V.gameState?.started)return;fctx.clearRect(0,0,innerWidth,innerHeight);const s=V.gameState,z=.78,cx=Math.max(0,Math.min(W.w-innerWidth/z,s.x-innerWidth/(2*z))),cy=Math.max(55,Math.min(W.h-innerHeight/z,s.y-innerHeight/(2*z)));const S=(x,y,c,w=1,h=1)=>{fctx.fillStyle=c;fctx.fillRect(Math.round(x),Math.round(y),w,h)};const p=(x,y)=>({x:(x-cx)*z,y:(y-cy)*z});
 // pequeñas flores/piedras distribuidas determinísticamente: no se mueven ni parpadean.
 for(let i=0;i<85;i++){const wx=(i*397)%Math.max(1,W.w-30)+15,wy=(i*233)%Math.max(1,W.h-30)+15,q=p(wx,wy);if(q.x<-5||q.x>innerWidth+5||q.y<-5||q.y>innerHeight+5)continue;const rural=wy>2850;if(rural)S(q.x,q.y,(i%3===0)?PAL.yellowFlower:PAL.foliage2,2,2);else if(i%5===0)S(q.x,q.y,PAL.barda2,3,2)}
 // reflejos discretos sobre el río.
 const river=W.river;if(river){const q=p(river.x,river.y);const rw=river.w*z,rh=river.h*z;if(q.x<innerWidth&&q.x+rw>0&&q.y<innerHeight&&q.y+rh>0)for(let i=0;i<34;i++){const xx=((i*211)%Math.max(1,Math.floor(rw-24)))+q.x;const yy=q.y+((i*37)%Math.max(1,Math.floor(rh-3)));S(xx,yy,PAL.water2,Math.min(18,Math.max(5,rw*.004)),1)}}
 // postes/cercos ambientales muy sutiles en el campo.
 for(let i=0;i<20;i++){const wx=4200+i*170,wy=3470+(i%2)*110,q=p(wx,wy);if(q.x>-10&&q.x<innerWidth+10&&q.y>-10&&q.y<innerHeight+10){S(q.x,q.y,PAL.wood,2,12);if(i<19)S(q.x+2,q.y+3,PAL.wood,16,2)}}
}
init();
// Se engancha al loop existente sin crear otro requestAnimationFrame.
const old=window.__villaPelonState;let lastDraw=0;function hook(){if(!V.gameState?.started)return;const now=performance.now();if(now-lastDraw>32){draw();lastDraw=now}requestAnimationFrame(hook)}requestAnimationFrame(hook);
window.dispatchEvent(new CustomEvent('villa-pelon-visual-reconversion-ready',{detail:V.visualTheme}));
})();