/* Villa Pelón V6.33 — PROPS CONTEXTUALES + MICROAMBIENTACIÓN TERRITORIAL
   Detalle visual derivado de calles, edificios, parcelas y accesos reales del mundo.
   No crea loop, física ni autoridad paralela.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={}),P=V.contextualProps=V.contextualProps||{};
Object.assign(P,{version:1,ready:false,patched:false,features:['contextual-props','deterministic-detail','building-frontage','rural-work-props','residential-microdetail']});
const hash=s=>{let h=2166136261;for(let i=0;i<String(s).length;i++){h^=String(s).charCodeAt(i);h=Math.imul(h,16777619)}return(h>>>0)/4294967295};
const n=(v,d)=>Number.isFinite(Number(v))?Number(v):d;
function rect(c,x,y,w,h,fill,stroke){c.save();c.fillStyle=fill;c.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));if(stroke){c.strokeStyle=stroke;c.strokeRect(Math.round(x)+.5,Math.round(y)+.5,Math.round(w)-1,Math.round(h)-1)}c.restore()}
function planter(c,x,y,s){rect(c,x,y,16*s,8*s,'rgba(111,76,53,.92)','rgba(48,39,31,.7)');rect(c,x+3*s,y-7*s,10*s,8*s,'rgba(78,105,62,.9)');rect(c,x+7*s,y-11*s,4*s,5*s,'rgba(98,126,70,.85)')}
function bin(c,x,y){rect(c,x,y,10,13,'rgba(66,70,63,.9)','rgba(31,28,24,.7)');rect(c,x-1,y-2,12,3,'rgba(46,49,45,.95)')}
function crate(c,x,y,s=1){rect(c,x,y,18*s,13*s,'rgba(151,106,58,.95)','rgba(67,48,32,.9)');c.save();c.strokeStyle='rgba(225,182,107,.45)';c.lineWidth=2;c.beginPath();c.moveTo(x+3*s,y+3*s);c.lineTo(x+15*s,y+10*s);c.moveTo(x+15*s,y+3*s);c.lineTo(x+3*s,y+10*s);c.stroke();c.restore()}
function bench(c,x,y){rect(c,x,y,34,5,'rgba(117,81,55,.95)');rect(c,x+3,y+5,4,10,'rgba(75,58,44,.9)');rect(c,x+27,y+5,4,10,'rgba(75,58,44,.9)')}
function tree(c,x,y,s=1){c.save();c.fillStyle='rgba(78,57,40,.95)';c.fillRect(Math.round(x-3*s),Math.round(y),Math.max(4,Math.round(6*s)),Math.round(20*s));c.fillStyle='rgba(66,93,58,.92)';c.beginPath();c.arc(Math.round(x),Math.round(y-5*s),Math.round(12*s),0,Math.PI*2);c.arc(Math.round(x-8*s),Math.round(y+1*s),Math.round(8*s),0,Math.PI*2);c.arc(Math.round(x+8*s),Math.round(y+1*s),Math.round(8*s),0,Math.PI*2);c.fill();c.restore()}
function tool(c,x,y,s=1){c.save();c.strokeStyle='rgba(78,55,38,.95)';c.lineWidth=Math.max(2,2*s);c.beginPath();c.moveTo(x,y+15*s);c.lineTo(x+8*s,y);c.stroke();c.fillStyle='rgba(110,109,94,.9)';c.fillRect(x+5*s,y-2*s,10*s,4*s);c.restore()}
function roadProps(c,r,index){if(!r||r.orientation==='vertical'&&r.w>260)return;const urban=r.kind==='urban'||r.kind==='urban-edge', productive=r.kind==='productive'||r.kind==='rural'||r.kind==='service';const seed=hash(r.id);if(r.orientation==='horizontal'){const count=Math.max(2,Math.floor(r.w/520));for(let i=0;i<count;i++){const x=r.x+(i+.28+hash(r.id+i)*.38)*(r.w/count),side=r.y-(V.streetSystem.sidewalkWidth||28)-18-(hash('s'+r.id+i)*18);if(urban&&hash('p'+r.id+i)>.28)planter(c,x,side,1);if(urban&&hash('b'+r.id+i)>.58)bench(c,x+25,side+2);if(productive&&hash('t'+r.id+i)>.38)tool(c,x,side+4,.9);}}
else{const count=Math.max(2,Math.floor(r.h/520));for(let i=0;i<count;i++){const y=r.y+(i+.28+hash(r.id+i)*.38)*(r.h/count),side=r.x-(V.streetSystem.sidewalkWidth||28)-18-(hash('s'+r.id+i)*18);if(urban&&hash('p'+r.id+i)>.3)planter(c,side,y,1);if(productive&&hash('t'+r.id+i)>.35)tool(c,side,y,.9)}}return seed}
function buildingProps(c,b,i){if(!b||!Number.isFinite(Number(b.x)))return;const seed=hash(b.id||i),door=b.door||{x:b.x+b.w/2,y:b.y+b.h+24},style=String(b.visual?.style||b.type||'home').toLowerCase();const frontY=door.y+4;const side=seed>.5?1:-1;
 if(style.includes('home')||style.includes('vivienda')){if(seed>.18)planter(c,door.x+side*28,frontY,seed>.72?1.2:.9);if(seed>.43)tree(c,b.x+b.w*.18+seed*b.w*.5,b.y+b.h+30,seed>.75?1.05:.8);if(seed>.63)bin(c,b.x+b.w*.78,frontY+3)}
 else if(style.includes('shop')||style.includes('comercio')||style.includes('bakery')){crate(c,door.x+side*28,frontY,seed>.65?1.1:.85);if(style.includes('bakery'))crate(c,door.x-side*25,frontY+1,.8);else bin(c,door.x-side*34,frontY+2)}
 else if(style.includes('rural')){crate(c,door.x+side*28,frontY,1.1);crate(c,door.x+side*5,frontY+2,.8);tool(c,door.x-side*28,frontY+2,1)}
 else if(style.includes('sports')||style.includes('public')){bench(c,door.x-17,frontY+3);if(seed>.45)bin(c,door.x+side*36,frontY+2)}
 else if(style.includes('radio')){bin(c,door.x+side*30,frontY+2)}
}
function parcelProps(c,p,i){if(!p)return;const seed=hash(p.id||'parcel'+i);const x=p.x+p.w*(.16+seed*.62),y=p.y+p.h*.82;crate(c,x,y,.85);if(seed>.32)tool(c,x+27,y+1,.8);if(seed>.62)tree(c,p.x+p.w*.88,p.y+p.h*.72,.9)}
function draw(c){const S=V.streetSystem,B=V.buildingSystem,A=V.agriculturalCycle;if(!S||!B)return;for(let i=0;i<(S.roads||[]).length;i++)roadProps(c,S.roads[i],i);for(let i=0;i<(B.buildings||[]).length;i++)buildingProps(c,B.buildings[i],i);for(let i=0;i<(A?.parcels||[]).length;i++)parcelProps(c,A.parcels[i],i)}
function patch(){if(P.patched)return;if(!V.life?.drawWorld)return;const old=V.life.drawWorld;V.life.drawWorld=function(c){old.call(this,c);draw(c)};P.patched=true;P.ready=true;P.check=()=>({ok:P.ready,version:P.version,roads:V.streetSystem?.roads?.length||0,buildings:V.buildingSystem?.buildings?.length||0,parcels:V.agriculturalCycle?.parcels?.length||0});}
patch();setTimeout(patch,300);setTimeout(patch,1000);
})();
