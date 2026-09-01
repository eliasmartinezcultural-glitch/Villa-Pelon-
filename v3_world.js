/* Villa Pelón V3 — MUNDO SIMULADO
   Rutas, tránsito, ciudadanos, animales y horarios.
   Este módulo no crea otro game loop: se conecta al motor central. */
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const routes={
 avenida:[{x:80,y:815},{x:1100,y:815},{x:1900,y:815},{x:2850,y:815},{x:4100,y:815}],
 norteSur:[{x:1290,y:80},{x:1290,y:520},{x:1290,y:815},{x:1290,y:1450},{x:1290,y:2600}],
 rural:[{x:1290,y:1450},{x:1700,y:1500},{x:2250,y:1550},{x:3000,y:1500},{x:3850,y:1900}],
 escuela:[{x:760,y:815},{x:700,y:650},{x:575,y:485}],
 plaza:[{x:1000,y:815},{x:1120,y:760},{x:1250,y:815},{x:1000,y:900}],
 chacra:[{x:2250,y:815},{x:2550,y:1050},{x:2750,y:1300},{x:2450,y:1450}]
};
const places={home:{x:820,y:540},school:{x:575,y:485},shop:{x:1955,y:545},radio:{x:1265,y:1500},rural:{x:2555,y:1045},plaza:{x:1120,y:760},vineyard:{x:3380,y:855},nature:{x:3750,y:2050}};
function citizen(id,name,role,home,work,route,color){return{id,name,role,home,work,route,color,x:home.x,y:home.y,index:0,target:null,speed:26,activity:'casa',moving:false,v3:true,lines:[`${name} está haciendo su vida cotidiana.`,`Hoy anda con cosas del pueblo.`]}}
const citizens=[
 citizen('elvira','Doña Elvira','vecina',places.home,places.plaza,'plaza','#9b6651'),
 citizen('sergio','Sergio','repartidor',{x:900,y:570},places.shop,'avenida','#4c7190'),
 citizen('mabel','Mabel','productora',{x:1550,y:1000},places.rural,'rural','#7c6849'),
 citizen('cacho','Cacho','camionero',{x:1650,y:980},places.vineyard,'rural','#6b594d'),
 citizen('ariel','Ariel','jornalero',{x:2200,y:1500},places.rural,'chacra','#58744e'),
 citizen('norma','Norma','vecina',{x:3500,y:1800},places.nature,'rural','#876b78')
];
const traffic=[
{id:'t1',type:'auto',route:'avenida',x:100,y:815,speed:72,index:1,color:'#536b72'},
{id:'t2',type:'camioneta',route:'avenida',x:1900,y:815,speed:58,index:2,color:'#7b624c'},
{id:'t3',type:'colectivo',route:'avenida',x:2850,y:815,speed:48,index:3,color:'#69715d'},
{id:'t4',type:'tractor',route:'rural',x:1700,y:1500,speed:31,index:1,color:'#61733b'},
{id:'t5',type:'camion',route:'rural',x:3000,y:1500,speed:42,index:3,color:'#77706a'},
{id:'t6',type:'auto',route:'norteSur',x:1290,y:300,speed:55,index:1,color:'#536b72'},
{id:'t7',type:'bicicleta',route:'plaza',x:1000,y:815,speed:34,index:1,color:'#435866'}
];
const animals=[
{type:'vaca',x:1510,y:840,zone:{x1:1350,y1:790,x2:2250,y2:1420},vx:8,vy:3},
{type:'vaca',x:1650,y:900,zone:{x1:1350,y1:790,x2:2250,y2:1420},vx:-6,vy:4},
{type:'caballo',x:2050,y:1080,zone:{x1:1800,y1:950,x2:2350,y2:1450},vx:7,vy:-3},
{type:'caballo',x:2150,y:1150,zone:{x1:1800,y1:950,x2:2350,y2:1450},vx:-5,vy:4},
{type:'gallina',x:940,y:560,zone:{x1:850,y1:490,x2:1450,y2:660},vx:14,vy:5},
{type:'gallina',x:1030,y:575,zone:{x1:850,y1:490,x2:1450,y2:660},vx:-10,vy:4},
{type:'gallina',x:1360,y:550,zone:{x1:850,y1:490,x2:1450,y2:660},vx:8,vy:-6}
];
V.v3Routes=routes;V.v3Places=places;V.v3Citizens=citizens;V.v3Traffic=traffic;V.v3Animals=animals;
V.npcs=V.npcs||[];
for(const n of citizens)if(!V.npcs.some(x=>x.id===n.id))V.npcs.push(n);
function schedule(n,h){if(n.role==='vecina')return h>=9&&h<13?'plaza':h>=17&&h<20?'plaza':'casa';if(n.role==='repartidor')return h>=8&&h<18?'reparto':'casa';if(n.role==='productora'||n.role==='jornalero')return h>=7&&h<18?'chacra':'casa';if(n.role==='camionero')return h>=6&&h<19?'ruta':'casa';return'casa'}
function destination(n,a){return a==='plaza'?places.plaza:a==='reparto'?places.shop:a==='chacra'?places.rural:a==='ruta'?places.vineyard:n.home}
function routeTarget(r,x,y){let best=r[0],bd=Infinity;for(const p of r){const d=Math.hypot(p.x-x,p.y-y);if(d<bd){bd=d;best=p}}return best}
function moveRoute(o,dt){const r=routes[o.route]||routes.avenida;if(!o.target||Math.hypot(o.target.x-o.x,o.target.y-o.y)<28){o.index=(o.index+1)%r.length;o.target=r[o.index]}const dx=o.target.x-o.x,dy=o.target.y-o.y,d=Math.hypot(dx,dy)||1,step=Math.min(d,(o.speed||30)*dt);o.x+=dx/d*step;o.y+=dy/d*step;o.dir=Math.abs(dx)>Math.abs(dy)?(dx>0?'E':'O'):(dy>0?'S':'N');o.moving=true}
const L=V.life;
if(L){const oldUpdate=L.update,oldDraw=L.drawWorld;L.v3=true;L.v3Routes=routes;L.v3Citizens=citizens;L.v3Traffic=traffic;L.v3Animals=animals;
L.update=(dt,minutes)=>{if(typeof oldUpdate==='function')oldUpdate(dt,minutes);const h=(minutes||480)/60;for(const n of citizens){const a=schedule(n,h);if(a!==n.activity){n.activity=a;n.target=null;n.index=0}const t=destination(n,a),d=Math.hypot(t.x-n.x,t.y-n.y);if(d>38){if(a==='casa')n.target=t;else if(!n.target||Math.hypot(n.target.x-n.x,n.target.y-n.y)<30)n.target=routeTarget(routes[n.route]||routes.avenida,n.x,n.y);const q=n.target,dx=q.x-n.x,dy=q.y-n.y,dd=Math.hypot(dx,dy)||1,step=Math.min(dd,n.speed*dt);n.x+=dx/dd*step;n.y+=dy/dd*step;n.moving=true;if(Math.hypot(t.x-n.x,t.y-n.y)<95)n.target=t}else n.moving=false}for(const v of traffic)moveRoute(v,dt);for(const a of animals){a.x+=a.vx*dt;a.y+=a.vy*dt;if(a.x<a.zone.x1||a.x>a.zone.x2)a.vx*=-1;if(a.y<a.zone.y1||a.y>a.zone.y2)a.vy*=-1}L.eventText=eventFor(h)};
L.drawWorld=(ctx)=>{if(typeof oldDraw==='function')oldDraw(ctx);for(const v of traffic)vehicle(ctx,v);for(const a of animals)animal(ctx,a)};
}
function eventFor(h){if(h>=7&&h<9)return'El pueblo se pone en marcha';if(h>=9&&h<13)return'Hay movimiento en comercios y plaza';if(h>=13&&h<17)return'La actividad rural está en marcha';if(h>=17&&h<21)return'La gente vuelve a sus casas';return'El pueblo está tranquilo'}
function shadow(c,x,y,w){c.fillStyle='rgba(25,20,15,.22)';c.beginPath();c.ellipse(x,y+12,w,5,0,0,Math.PI*2);c.fill()}
function vehicle(c,v){c.save();c.translate(v.x,v.y);c.rotate(v.dir==='N'?-Math.PI/2:v.dir==='S'?Math.PI/2:0);shadow(c,0,13,v.type==='camion'?28:21);c.fillStyle=v.color;c.fillRect(-24,-10,48,20);c.fillStyle='#242321';c.fillRect(-17,9,9,7);c.fillRect(8,9,9,7);if(v.type==='camion'||v.type==='colectivo')c.fillRect(7,-15,25,25);if(v.type==='tractor'){c.fillStyle='#35441e';c.fillRect(-37,-8,12,16)}c.restore()}
function animal(c,a){shadow(c,a.x,a.y,a.type==='caballo'?22:16);c.save();c.translate(a.x,a.y);c.fillStyle=a.type==='caballo'?'#79533a':a.type==='vaca'?'#e1d7bd':'#bd7650';c.beginPath();c.ellipse(0,0,a.type==='gallina'?9:20,a.type==='gallina'?6:10,0,0,Math.PI*2);c.fill();if(a.type!=='gallina')c.fillRect(12,-7,8,10);else{c.fillStyle='#93482f';c.fillRect(7,-3,5,4)}c.restore()}
V.v3World={routes,places,citizens,traffic,animals,schedule,eventFor};
})();