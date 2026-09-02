/* Villa Pelón V6.0 — INTRO FUNCIONAL + DETALLE FINO
   Unifica la entrada narrativa y una capa ligera de detalle pixel-art.
   No crea RAF ni reemplaza el motor principal. */
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const doc=document;
const INTRO_KEY='villa_pelon_v6_intro_seen';
const css=`
#v6Intro{position:fixed;inset:0;z-index:5000;background:#17130f;color:#ead8a6;display:flex;align-items:center;justify-content:center;font-family:monospace;image-rendering:pixelated}
#v6Intro.hidden{display:none}
.v6-intro-frame{width:min(900px,92vw);max-height:88vh;overflow:auto;background:#241b15;border:4px solid #b99655;box-shadow:12px 12px 0 #0c0907;padding:0}
.v6-intro-top{padding:14px 18px;border-bottom:3px solid #6e5635;display:flex;justify-content:space-between;gap:15px;font-size:12px;letter-spacing:1px}
.v6-intro-top b{color:#f0cf7b}
.v6-intro-scene{min-height:330px;padding:34px 8%;display:flex;flex-direction:column;justify-content:center;background:#30251c}
.v6-intro-year{font-size:11px;letter-spacing:2px;color:#c7a35e;margin-bottom:18px}
.v6-intro-title{font-size:clamp(28px,6vw,58px);line-height:.95;margin:0 0 20px;color:#f1dfae;text-shadow:4px 4px 0 #15100c}
.v6-intro-text{font-size:clamp(15px,2vw,20px);line-height:1.65;max-width:760px;min-height:105px;color:#e7dcc6}
.v6-intro-note{margin-top:18px;padding:12px;border-left:5px solid #c7a35e;background:#201813;color:#cdbf9f;font-size:12px;line-height:1.5}
.v6-intro-bottom{padding:15px 18px;border-top:3px solid #6e5635;display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap}
.v6-intro-controls{display:flex;gap:8px;flex-wrap:wrap}
.v6-intro-btn{border:3px solid #b99655;background:#8d6735;color:#fff3d0;padding:11px 15px;font:700 12px monospace;cursor:pointer;box-shadow:4px 4px 0 #0c0907}
.v6-intro-btn:hover{background:#a77d3f}
.v6-intro-btn.alt{background:#30251c;color:#d9caa8}
.v6-intro-skip{border:0;background:transparent;color:#9f947f;font:11px monospace;cursor:pointer;padding:8px}
.v6-detail-tag{position:absolute;z-index:42;pointer-events:none;background:#211a14;border:2px solid #80643b;color:#e7cf91;padding:3px 5px;font:9px monospace;box-shadow:2px 2px 0 #0c0907}
@media(max-width:700px){.v6-intro-frame{width:94vw}.v6-intro-scene{min-height:360px;padding:25px}.v6-intro-bottom{align-items:stretch}.v6-intro-btn{flex:1}.v6-intro-skip{width:100%}}
`;
function addCss(){if(doc.getElementById('v6IntroCSS'))return;const s=doc.createElement('style');s.id='v6IntroCSS';s.textContent=css;doc.head.appendChild(s)}
function hasSave(){try{return !!localStorage.getItem('villa_pelon_v4_save')}catch(_){return false}}
const scenes=[
 {k:'EL COMIENZO',title:'Hay lugares que se conocen caminando.',text:'Llegás a San Patricio del Chañar temprano. Todavía queda frío en el aire. El pueblo despierta de a poco: una persiana que se levanta, una bicicleta que cruza la calle, alguien que prende la radio.',note:'No viniste a completar una lista de datos. Viniste a descubrir por qué este lugar llegó a ser lo que es.'},
 {k:'UNA PISTA',title:'Una fotografía sin fecha.',text:'En una caja que llevás con vos hay una fotografía vieja. No tiene nombre ni fecha. Solo una anotación escrita atrás: “Buscá el lugar donde el agua cambió el paisaje”.',note:'La frase puede llevarte a una historia mucho más grande que la fotografía.'},
 {k:'EL TERRITORIO',title:'Antes de las calles, estaba el territorio.',text:'El Chañar tuvo otras etapas antes de convertirse en la localidad que conocemos. Hay registros de mensuras, caminos, colonias y transformaciones del paisaje. Algunas respuestas están documentadas. Otras todavía son preguntas.',note:'En Villa Pelón, las fuentes históricas aparecen como descubrimientos. La ficción sirve para recorrerlas, no para reemplazarlas.'},
 {k:'EL AGUA',title:'El paisaje empezó a cambiar.',text:'Durante la segunda mitad del siglo XX, el riego fue decisivo para transformar tierras áridas en una zona productiva. Esa transformación no ocurrió de un día para otro: hubo trabajo, infraestructura, decisiones y personas.',note:'Tu primera aventura comienza con algo sencillo: hablar con alguien.'},
 {k:'AHORA',title:'El pueblo está despierto.',text:'Cuando termine esta historia, vas a poder caminar libremente. Las personas tendrán horarios, trabajos, encuentros y recuerdos. Vas a poder entrar en una historia, perderte un rato y encontrar otra.',note:'Tu primera misión será conocer a alguien. No subestimes ese encuentro.'}
];
let index=0,typingTimer=0,originalStart=null,overlay=null;
function renderScene(){if(!overlay)return;const s=scenes[index];overlay.querySelector('.v6-intro-year').textContent=s.k;overlay.querySelector('.v6-intro-title').textContent=s.title;overlay.querySelector('.v6-intro-note').textContent=s.note;const text=overlay.querySelector('.v6-intro-text');text.textContent='';clearInterval(typingTimer);let i=0;typingTimer=setInterval(()=>{text.textContent=s.text.slice(0,++i);if(i>=s.text.length)clearInterval(typingTimer)},12);overlay.querySelector('[data-next]').textContent=index===scenes.length-1?'ENTRAR AL PUEBLO':'CONTINUAR';overlay.querySelector('[data-back]').disabled=index===0;overlay.querySelector('[data-back]').style.opacity=index===0?'.35':'1'}
function closeAndStart(){try{localStorage.setItem(INTRO_KEY,'1')}catch(_){}overlay?.remove();overlay=null;clearInterval(typingTimer);if(typeof originalStart==='function')originalStart();}
function build(){addCss();overlay=doc.createElement('div');overlay.id='v6Intro';overlay.innerHTML=`<div class="v6-intro-frame"><div class="v6-intro-top"><span>VILLA PELÓN · HISTORIA JUGABLE</span><b>16-BIT</b></div><div class="v6-intro-scene"><div class="v6-intro-year"></div><h1 class="v6-intro-title"></h1><div class="v6-intro-text"></div><div class="v6-intro-note"></div></div><div class="v6-intro-bottom"><button class="v6-intro-btn alt" data-back>ATRÁS</button><div class="v6-intro-controls"><button class="v6-intro-btn" data-next>CONTINUAR</button><button class="v6-intro-skip" data-skip>SALTAR INTRO</button></div></div></div>`;doc.body.appendChild(overlay);overlay.querySelector('[data-next]').onclick=()=>{if(index<scenes.length-1){index++;renderScene()}else closeAndStart()};overlay.querySelector('[data-back]').onclick=()=>{if(index>0){index--;renderScene()}};overlay.querySelector('[data-skip]').onclick=closeAndStart;renderScene()}
function installIntro(){const b=doc.getElementById('startBtn');if(!b)return setTimeout(installIntro,100);originalStart=b.onclick;b.onclick=()=>{if(hasSave()){closeAndStart();return}index=0;build()};b.textContent='COMENZAR HISTORIA';const hint=doc.querySelector('.title-card p');if(hint)hint.textContent='Una aventura histórica y cotidiana sobre San Patricio del Chañar. Caminá, conocé personas, descubrí recuerdos y dejá que el pueblo siga viviendo.'}
function px(c){c.imageSmoothingEnabled=false;c.lineJoin='miter';c.lineCap='butt'}
function detailFor(b,c){
 const x=Math.round(b.x),y=Math.round(b.y),w=Math.round(b.w),h=Math.round(b.h),t=b.type||'home';
 c.save();px(c);
 // Base shadow and wall segmentation
 c.fillStyle='#4a3629';c.fillRect(x+10,y+h,w-20,5);
 c.fillStyle='#e0c993';c.fillRect(x+5,y+h-7,w-10,4);
 // corner masonry / repair pixels
 c.fillStyle=t==='rural'?'#806246':'#8a6c50';for(let yy=y+14;yy<y+h-12;yy+=28){c.fillRect(x+3,yy,5,4);if(w>280)c.fillRect(x+w-8,yy+8,5,4)}
 // windows with frame, sill, reflection pixel
 const wx=[x+28,x+w-76];for(const xx of wx){if(xx<x+12||xx+48>x+w-12)continue;c.fillStyle='#503a2c';c.fillRect(xx,y+30,48,48);c.fillStyle='#83a3a5';c.fillRect(xx+5,y+5+30,38,32);c.fillStyle='#d9d0ad';c.fillRect(xx+22,y+30,4,42);c.fillRect(xx,y+46,48,4);c.fillStyle='#ead9a9';c.fillRect(xx+8,y+34,7,5);c.fillStyle='#6d5139';c.fillRect(xx-3,y+78,54,5)}
 // door threshold + handle
 const dx=x+Math.floor(w*.44),dy=y+h-58,dw=Math.max(34,Math.floor(w*.12));c.fillStyle='#493325';c.fillRect(dx,dy,dw,58);c.fillStyle='#806043';c.fillRect(dx+4,dy+4,dw-8,4);c.fillStyle='#c5a45e';c.fillRect(dx+dw-9,dy+30,4,4);c.fillStyle='#6b513a';c.fillRect(dx-8,y+h,dw+16,5);
 // roof edge, gutter and downspout
 c.fillStyle='#382a22';c.fillRect(x-12,y-4,w+24,7);c.fillStyle='#9b7a4e';c.fillRect(x-10,y-8,w+20,3);c.fillStyle='#4f4032';c.fillRect(x+w-16,y-1,5,h+3);c.fillRect(x+w-20,y+h-4,12,4);
 // awning / signage depending on building
 if(t==='shop'||t==='bakery'){c.fillStyle='#b68b4e';c.fillRect(x+12,y+87,w-24,8);c.fillStyle='#f0dca5';c.fillRect(x+Math.floor(w*.27),y+90,Math.floor(w*.46),25);c.fillStyle='#4a3528';c.font='bold 10px monospace';c.textAlign='center';c.fillText(t==='bakery'?'PAN · ALMACÉN':b.label,x+w/2,y+107)}
 if(t==='school'){c.fillStyle='#5e4b38';c.fillRect(x+w-44,y+105,30,45);c.fillStyle='#d6c58e';c.fillRect(x+w-39,y+110,20,35);c.fillStyle='#4e3a2b';c.fillRect(x+w-35,y+120,12,3)}
 if(t==='radio'){c.fillStyle='#514033';c.fillRect(x+18,y+102,34,24);c.fillStyle='#a9a0a0';c.fillRect(x+23,y+107,24,14);c.fillStyle='#c59d52';c.fillRect(x+34,y+94,3,8);c.fillRect(x+28,y+91,15,3)}
 if(t==='rural'){c.fillStyle='#594331';c.fillRect(x+w-62,y+h-45,40,28);c.fillStyle='#9b7c55';c.fillRect(x+w-57,y+h-40,30,18);c.fillStyle='#594331';c.fillRect(x+w-52,y+h-58,5,13);c.fillRect(x+w-34,y+h-58,5,13)}
 // little immediate-terrain props: stones, weeds, mailbox / bin
 c.fillStyle='#6e654f';c.fillRect(x-20,y+h+8,8,5);c.fillRect(x+w+9,y+h+12,7,4);c.fillStyle='#5d704b';c.fillRect(x-6,y+h+8,3,10);c.fillRect(x+w+18,y+h+5,3,12);c.fillStyle='#7d5b3d';c.fillRect(x+18,y+h+7,5,14);
 if(t==='home'){c.fillStyle='#496448';c.fillRect(x+w-34,y+h+8,7,10);c.fillRect(x+w-38,y+h+4,15,5)}
 c.restore();
}
function fineDetails(){const e=V.engine;if(!e||typeof e.render!=='function'||e.__v6FineDetails)return;const old=e.render;e.render=function(){const r=old.apply(this,arguments),c=doc.getElementById('world')?.getContext('2d');if(!c)return r;const cam=V.camera||{x:0,y:0,zoom:1},z=Number(cam.zoom||1);c.save();c.translate(innerWidth/2-cam.x*z,innerHeight/2-cam.y*z);c.scale(z,z);c.imageSmoothingEnabled=false;const pad=220/z;for(const b of (V.buildings||[])){if(b.x+b.w<cam.x-innerWidth/(2*z)-pad||b.x>cam.x+innerWidth/(2*z)+pad||b.y+b.h<cam.y-innerHeight/(2*z)-pad||b.y>cam.y+innerHeight/(2*z)+pad)continue;detailFor(b,c)}c.restore();return r};e.__v6FineDetails=true;V.fineDetails={version:1,enabled:true,renderer:'pixel-blocks',features:['facade','windows','doors','roof','gutters','props','terrain','material-wear']}}
function boot(){installIntro();fineDetails();setTimeout(fineDetails,300);setTimeout(fineDetails,900);V.v6={version:1,intro:true,fineDetails:true}}
boot();
})();
