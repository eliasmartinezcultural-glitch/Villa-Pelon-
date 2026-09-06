/* Villa Pelón — TERRITORY ENVIRONMENT v1.0
   Capa visual dinámica: iluminación, ventanas, faroles, actividad, vegetación,
   decoración y pequeños estados del territorio según hora, estación y clima.
   Diseñada para Canvas 2D, sin assets externos y con presupuesto móvil.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const E=V.territoryEnvironment={version:'1.0.0',phase:0};
const TAU=Math.PI*2;
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
function clock(){return V.territoryClock||{hour:8,season:'verano',phase:'morning',isNight:false}};
function seasonState(){
 const s=clock().season;
 return ({verano:{leaf:1,flower:.15,dry:.72,fallen:0},otoño:{leaf:.72,flower:0,dry:.55,fallen:.7},invierno:{leaf:.28,flower:0,dry:.45,fallen:.25},primavera:{leaf:.9,flower:.85,dry:.3,fallen:.05}})[s]||{leaf:1,flower:0,dry:.5,fallen:0};
}
function activity(){const h=clock().hour||8;if(h<6.5)return 'sleep';if(h<9)return 'start';if(h<12)return 'active';if(h<14)return 'pause';if(h<18)return 'active';if(h<21)return 'social';return 'quiet'}
function drawTree(c,x,y,scale=1){
 const s=seasonState(), pulse=E.phase*.35+x*.001;
 c.save();c.translate(x,y);c.scale(scale,scale);
 c.fillStyle='#584331';c.fillRect(-4,4,8,34);
 if(s.leaf>.2){c.fillStyle='rgba(48,82,53,.95)';c.beginPath();c.arc(-10,-2,17,0,TAU);c.arc(10,-4,18,0,TAU);c.arc(0,-18,21,0,TAU);c.fill();}
 if(s.fallen>.45){c.fillStyle='rgba(177,119,61,.8)';for(let i=0;i<4;i++){const a=pulse+i*1.7;c.fillRect(Math.round(Math.cos(a)*22),Math.round(27+Math.sin(a)*5),3,2)}}
 if(s.flower>.5){c.fillStyle='rgba(214,170,105,.85)';for(let i=0;i<4;i++){const a=i*1.57+pulse;c.fillRect(Math.round(Math.cos(a)*16),Math.round(-8+Math.sin(a)*12),3,3)}}
 c.restore();
}
function drawHouseState(c,b){
 const cl=clock(),a=activity(),night=cl.isNight||a==='sleep';
 const lit=night||a==='quiet'||(a==='social'&&b.type==='shop');
 c.save();
 if(lit){c.fillStyle='rgba(244,196,104,.72)';const wx=b.x+b.w*.28,wy=b.y+b.h*.43;c.fillRect(wx,wy,22,18);c.fillRect(b.x+b.w*.64,wy,22,18)}
 if((a==='active'||a==='start')&&['shop','radio','school'].includes(b.type)){c.fillStyle='rgba(231,226,184,.42)';c.fillRect(b.x+b.w*.44,b.y+b.h*.18,18,10)}
 if(b.type==='radio'&&a==='active'){c.fillStyle='rgba(82,103,116,.7)';c.fillRect(b.x+b.w*.78,b.y-8,5,8);c.fillRect(b.x+b.w*.81,b.y-12,2,12)}
 if(b.type==='school'&&a==='start'){c.fillStyle='rgba(38,45,38,.75)';c.fillRect(b.x+b.w*.72,b.y+b.h-18,25,7)}
 if(b.type==='shop'&&!V.life?.open?.shops){c.fillStyle='rgba(25,28,25,.65)';c.fillRect(b.x+b.w*.1,b.y+b.h*.79,b.w*.8,8)}
 c.restore();
}
function drawRoadActivity(c){
 const a=activity(),cl=clock();if(a==='sleep'||cl.isNight)return;
 c.save();c.globalAlpha=a==='pause'?.42:1;
 const bicycle=(x,y)=>{c.strokeStyle='rgba(40,50,45,.65)';c.lineWidth=2;c.beginPath();c.arc(x,y,6,0,TAU);c.arc(x+14,y,6,0,TAU);c.moveTo(x,y);c.lineTo(x+7,y-6);c.lineTo(x+14,y);c.moveTo(x+7,y-6);c.lineTo(x+11,y-10);c.stroke()};
 if(a==='start'||a==='active'){bicycle(650+(Math.sin(E.phase*.7)*70),700);bicycle(1500+(Math.sin(E.phase*.5)*100),590)}
 if(a==='social'){c.fillStyle='rgba(55,70,52,.55)';c.fillRect(1118,402,5,5);c.fillRect(1180,435,5,5);c.fillRect(1225,390,5,5)}
 c.restore();
}
function drawSeasonGround(c){
 const s=seasonState();c.save();
 if(s.dry>.6){c.fillStyle='rgba(164,139,87,.10)';for(let i=0;i<32;i++){const x=(i*317)%3000+80,y=(i*173)%1500+350;c.fillRect(x,y,6,2)}}
 if(s.fallen>.5){c.fillStyle='rgba(173,120,62,.42)';for(let i=0;i<55;i++){const x=(i*193)%2950+90,y=(i*127)%1500+360;c.fillRect(x,y,3+(i%2),2)}}
 if(s.flower>.5){c.fillStyle='rgba(213,174,98,.58)';for(let i=0;i<22;i++){const x=(i*271)%2600+180,y=(i*149)%1250+400;c.fillRect(x,y,3,3)}}
 c.restore();
}
function drawStreetLights(c){
 const cl=clock(),night=cl.isNight||cl.phase==='dusk'||cl.phase==='evening';if(!night)return;
 const points=[[450,650],[760,650],[1080,650],[1350,650],[1750,650],[2050,700],[2350,700],[2650,700],[1100,950],[1500,950]];
 c.save();points.forEach(([x,y])=>{c.strokeStyle='rgba(35,36,30,.8)';c.lineWidth=3;c.beginPath();c.moveTo(x,y);c.lineTo(x,y-42);c.stroke();c.fillStyle='rgba(248,205,116,.78)';c.beginPath();c.arc(x,y-45,5,0,TAU);c.fill();});c.restore();
}
function drawSeasonDetails(c){
 const cl=clock(),s=seasonState();
 if(s.leaf<.5&&cl.isNight){c.fillStyle='rgba(214,223,222,.25)';for(let i=0;i<18;i++){const x=(i*211+E.phase*8)%2900+100,y=(i*113)%1200+360;c.fillRect(x,y,2,2)}}
 if(cl.season==='verano'&&activity()==='active'){c.fillStyle='rgba(230,211,154,.12)';for(let i=0;i<18;i++){const x=(i*157+E.phase*3)%3000,y=400+(i*83)%1200;c.fillRect(x,y,9,2)}}
}
function drawLightingOverlay(c,vw,vh){
 const cl=clock(),h=cl.hour||8,sr=cl.sunrise??6,ss=cl.sunset??20;
 let alpha=0;
 if(h<sr-.75||h>ss+.75)alpha=.52;
 else if(h<sr)alpha=.52-(h-(sr-.75))/.75*.24;
 else if(h<sr+.75)alpha=.28-(h-sr)/.75*.20;
 else if(h>ss-.8)alpha=.08+(h-(ss-.8))/.8*.25;
 if(cl.phase==='dusk')alpha=Math.max(alpha,.25);if(cl.phase==='evening')alpha=Math.max(alpha,.40);
 if(alpha>.01){c.fillStyle=cl.isNight?'rgba(15,25,48,'+clamp(alpha,.06,.58)+')':'rgba(190,125,65,'+clamp(alpha,.04,.30)+')';c.fillRect(0,0,vw,vh)}
 if(cl.phase==='dawn'||cl.phase==='dusk'){const warm=cl.phase==='dawn'?'rgba(244,174,102,.10)':'rgba(221,126,65,.14)';c.fillStyle=warm;c.fillRect(0,0,vw,vh)}
 if(cl.isNight){c.fillStyle='rgba(242,231,190,.7)';c.beginPath();c.arc(vw*.83,Math.max(48,vh*.13),16,0,TAU);c.fill();c.fillStyle='rgba(255,255,235,.48)';for(let i=0;i<18;i++){const x=(i*97)%vw,y=(i*53)%Math.max(100,vh*.45);c.fillRect(x,y,2,2)}}
}
E.update=dt=>{E.phase+=Math.min(dt||0,.1)};
E.drawWorld=(c,geometry)=>{
 drawSeasonGround(c);const bs=(geometry?.buildings||V.worldGeometry?.buildings||[]);bs.forEach(b=>drawHouseState(c,b));
 [[250,540,1.05],[1180,540,1],[1320,520,.9],[1510,420,1.1],[1850,380,1],[2230,500,1.15],[2860,560,.9],[380,1260,1],[820,1320,1],[1230,1360,.9],[2750,1420,1.15]].forEach(p=>drawTree(c,p[0],p[1],p[2]));
 drawRoadActivity(c);drawStreetLights(c);drawSeasonDetails(c);
};
E.drawOverlay=drawLightingOverlay;
if(V.life){const oldW=V.life.drawWorld,oldO=V.life.drawOverlay;V.life.drawWorld=(c)=>{E.update(1/60);E.drawWorld(c,V.worldGeometry);if(oldW)oldW(c)};V.life.drawOverlay=(c,w,h)=>{if(oldO)oldO(c,w,h);E.drawOverlay(c,w,h)}}
V.territoryEnvironment=E;
window.dispatchEvent(new CustomEvent('villa-pelon-environment-ready',{detail:{version:E.version}}));
})();
