/* VILLA PELÓN V113 — CAPA DE DESARROLLO PROFESIONAL
   Objetivo: convertir la expansión territorial en un mundo legible, consistente y mantenible.
   No reemplaza el motor: añade una capa de presentación, seguridad de navegación y QA visual.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const S=V.gameState||(V.gameState={});
const G=V.worldGeometry||(V.worldGeometry={});
const WORLD=V.world||{w:8200,h:4200};

/* ---------- CANVAS AMBIENTAL: una capa entre terreno y fachadas ---------- */
let canvas=document.getElementById('worldAmbient');
if(!canvas){
  canvas=document.createElement('canvas');
  canvas.id='worldAmbient';
  canvas.setAttribute('aria-hidden','true');
  const world=document.getElementById('world');
  world?.parentNode?.insertBefore(canvas,document.getElementById('worldDetail')||null);
}
const ctx=canvas.getContext('2d');
let vw=innerWidth,vh=innerHeight;
const Z=.82;
function resize(){vw=innerWidth;vh=innerHeight;const d=Math.min(devicePixelRatio||1,2);canvas.width=Math.max(1,Math.floor(vw*d));canvas.height=Math.max(1,Math.floor(vh*d));canvas.style.cssText=`position:absolute;inset:0;width:${vw}px;height:${vh}px;pointer-events:none;z-index:2`;ctx.imageSmoothingEnabled=false}
addEventListener('resize',resize,{passive:true});resize();
function screen(x,y){return{x:(x-(Number(S.x)||0))*Z+vw/2,y:(y-(Number(S.y)||0))*Z+vh/2}}
function visible(x,y,w,h){const q=screen(x,y);return !(q.x+w*Z<0||q.x>vw||q.y+h*Z<0||q.y>vh)}
function rect(x,y,w,h,c){ctx.fillStyle=c;ctx.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h))}
function tree(x,y,s=1){if(!visible(x-30,y-40,60,70))return;const q=screen(x,y);const r=10*s*Z;ctx.fillStyle='rgba(44,55,35,.28)';ctx.beginPath();ctx.ellipse(q.x,q.y+18*Z,15*s*Z,4*s*Z,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#536744';ctx.fillRect(q.x-3*Z,q.y-2*Z,6*s*Z,22*s*Z);ctx.fillStyle='#687d4d';ctx.beginPath();ctx.arc(q.x,q.y-10*Z,r,0,Math.PI*2);ctx.fill();ctx.fillStyle='#7e8d58';ctx.beginPath();ctx.arc(q.x-7*Z,q.y-14*Z,r*.65,0,Math.PI*2);ctx.fill()}
function fence(x,y,len,vertical=false){const step=22;ctx.strokeStyle='rgba(92,72,48,.72)';ctx.lineWidth=2;for(let i=0;i<=len;i+=step){const a=vertical?[x+i*0,y+i]:[x+i,y];const q=screen(a[0],a[1]);ctx.beginPath();ctx.moveTo(q.x,q.y);ctx.lineTo(q.x+(vertical?0:0),q.y+(vertical?14*Z:14*Z));ctx.stroke()}const a=screen(x,y+7);ctx.beginPath();if(vertical){ctx.moveTo(a.x,a.y);ctx.lineTo(a.x,a.y+len*Z)}else{ctx.moveTo(a.x,a.y);ctx.lineTo(a.x+len*Z,a.y)}ctx.stroke()}
function sign(text,x,y){if(!visible(x-50,y-25,100,50))return;const q=screen(x,y);ctx.fillStyle='rgba(43,49,39,.9)';ctx.fillRect(q.x-38*Z,q.y-8*Z,76*Z,16*Z);ctx.fillStyle='#d0b36c';ctx.font='700 6px monospace';ctx.textAlign='center';ctx.fillText(text,q.x,q.y+2*Z)}
function draw(){const d=Math.min(devicePixelRatio||1,2);ctx.setTransform(d,0,0,d,0,0);ctx.clearRect(0,0,vw,vh);if(!S.started){requestAnimationFrame(draw);return}
  /* La ambientación se concentra en orientación y lectura territorial, no en decoración gratuita. */
  const trees=[
    [180,250],[780,230],[1660,210],[3150,230],[3970,330],[4450,470],
    [4860,790],[5300,520],[5750,860],[6500,520],[7040,760],[7600,480],
    [5200,1160],[5600,1160],[6600,1160],[7100,1160],[5200,1780],[5700,1780],[6500,1780],[7100,1780],
    [4700,2380],[5200,2480],[5900,2440],[6700,2480],[7450,2400]
  ];trees.forEach((p,i)=>tree(p[0],p[1],i%3===0?1.2:1));
  /* Límites de chacra: ayudan a entender dónde termina el espacio urbano y empieza el productivo. */
  [[4900,700,1100],[6100,700,1050],[4900,1600,1000],[6100,1600,1000]].forEach(f=>{if(visible(f[0],f[1],f[2],18))fence(f[0],f[1],f[2])});
  sign('CENTRO',1210,585);sign('SECTOR PRODUCTIVO',6050,1060);sign('PICADA 21',6200,2100);sign('BODEGAS',5960,380);
  requestAnimationFrame(draw)
}
requestAnimationFrame(draw);

/* ---------- MAPA DE REGIONES Y ORIENTACIÓN ---------- */
function region(x,y){
  if(y>2900)return{n:'Zona de río y Picada 21',c:'rural'};
  if(x>=4500&&y>=650)return{n:'Sector productivo',c:'productive'};
  if(x>=4500&&y<650)return{n:'Corredor de bodegas',c:'wine'};
  if(x<4200)return{n:'Núcleo de Villa Pelón',c:'town'};
  return{n:'Transición rural',c:'transition'};
}
function ensurePanel(){
 const hud=document.querySelector('.hud');if(!hud||document.getElementById('vp113Region'))return;
 const r=document.createElement('div');r.id='vp113Region';r.innerHTML='<b>VILLA PELÓN</b><span id="vp113RegionName">Núcleo</span><span id="vp113Coord">0000 · 0000</span>';
 hud.insertAdjacentElement('afterend',r);
 const st=document.createElement('style');st.textContent=`#vp113Region{position:fixed;left:50%;top:76px;transform:translateX(-50%);z-index:9000;display:flex;gap:12px;align-items:center;padding:7px 12px;border:1px solid #8f8058;background:rgba(32,39,31,.92);color:#ead8a7;border-radius:7px;font:700 10px monospace;pointer-events:none;box-shadow:0 4px 14px #0006}#vp113Region span{opacity:.82;font-weight:400}#vp113RegionName{color:#d6bd79}@media(max-width:700px){#vp113Region{top:68px;font-size:9px;gap:7px;padding:5px 8px}#vp113Region b{display:none}}`;document.head.appendChild(st);
}
ensurePanel();
function updateRegion(){const r=region(Number(S.x)||0,Number(S.y)||0);const a=document.getElementById('vp113RegionName'),b=document.getElementById('vp113Coord');if(a)a.textContent=r.n;if(b)b.textContent=`${Math.round(S.x||0)} · ${Math.round(S.y||0)}`}
setInterval(updateRegion,350);updateRegion();

/* ---------- SEGURIDAD DE NAVEGACIÓN / QA EN TIEMPO REAL ---------- */
let lastSafe={x:Number(S.x)||1340,y:Number(S.y)||770};
function rectHit(x,y,b,pad=10){return x>b.x-pad&&x<b.x+b.w+pad&&y>b.y-pad&&y<b.y+b.h+pad}
function invalidPosition(x,y){
 if(x<30||y<80||x>WORLD.w-30||y>WORLD.h-30)return true;
 const river=G.river||{x:5000,y:3070,w:3200,h:90};
 const inRiver=x>=river.x&&x<=river.x+river.w&&y>=river.y&&y<=river.y+river.h;
 const bridge=(G.bridges||[]).some(b=>rectHit(x,y,b,12));
 if(inRiver&&!bridge)return true;
 return (G.buildings||[]).some(b=>rectHit(x,y,b,8));
}
setInterval(()=>{
 const x=Number(S.x)||0,y=Number(S.y)||0;
 if(invalidPosition(x,y)){S.x=lastSafe.x;S.y=lastSafe.y}
 else lastSafe={x,y};
},120);

/* ---------- GUARDADO AUTOMÁTICO: evita perder horas de progreso ---------- */
setInterval(()=>{if(!S.started||typeof localStorage==='undefined')return;try{localStorage.setItem('villa_pelon_save',JSON.stringify({...S,dialogue:false,savedAt:Date.now(),autosave:true}));}catch(_){}},30000);

/* ---------- PROGRESIÓN PROFESIONAL ---------- */
function updateProgress(){
 const missions=V.missions;
 if(!missions?.status)return;
 const st=missions.status(S);if(!st)return;
 let p=document.getElementById('vp113Progress');if(!p){p=document.createElement('div');p.id='vp113Progress';document.body.appendChild(p);const css=document.createElement('style');css.textContent='#vp113Progress{position:fixed;left:12px;bottom:18px;z-index:9000;padding:6px 9px;background:rgba(31,37,31,.88);border:1px solid #756846;border-radius:6px;color:#d9c58e;font:700 10px monospace;pointer-events:none}';document.head.appendChild(css)}
 p.textContent=st.total?`PROGRESO ${Math.min(st.step,st.total)}/${st.total}`:'EXPLORACIÓN';
}
setInterval(updateProgress,700);

V.professionalLayer={version:'113.0',ambientCanvas:true,regionalOrientation:true,navigationGuard:true,autosave:true,progressHUD:true,principles:['territorial readability','functional decoration','single source of truth','player safety','maintainable layers']};
})();
