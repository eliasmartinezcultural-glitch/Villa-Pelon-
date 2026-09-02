/* Villa Pelón V6.4 — NAVEGACIÓN LOCAL
   Sistema único de navegación para ciudadanos ambientales y NPC de vida profunda.
   Usa waypoints, aceleración suave, separación y evita edificios/río.
   No crea RAF ni timers propios.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const N=V.v6Navigation=V.v6Navigation||{version:1,enabled:true,ready:false};
const W=()=>V.world||{w:8400,h:5600};
const R=()=>V.v6Map?.river||{x:7000,y:0,w:1200,h:5600};
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const blocked=(x,y)=>{const r=R();if(x>r.x-20&&x<r.x+r.w+20){const ok=[790,1330].some(by=>Math.abs(y-(by+75))<95);if(!ok)return true}return (V.buildings||[]).some(b=>b.collision!==false&&x>b.x-20&&x<b.x+b.w+20&&y>b.y-20&&y<b.y+b.h+20)};
const nodes=[
 {x:420,y:815},{x:850,y:815},{x:1290,y:815},{x:1700,y:815},{x:2200,y:815},{x:2800,y:815},{x:3500,y:815},{x:4300,y:815},{x:5200,y:815},{x:6200,y:815},
 {x:1290,y:350},{x:1290,y:650},{x:1290,y:1050},{x:1290,y:1450},{x:1290,y:1900},{x:1290,y:2400},{x:1290,y:2900},
 {x:1800,y:1400},{x:2400,y:1400},{x:3000,y:1400},{x:3600,y:1400},{x:4300,y:1400},{x:5200,y:1400},{x:6200,y:1400},
 {x:3500,y:3000},{x:4300,y:3200},{x:5200,y:3500},{x:6100,y:3900},{x:6700,y:4300}
];
function nearestNode(x,y){let best=nodes[0],bd=Infinity;for(const n of nodes){if(blocked(n.x,n.y))continue;const d=Math.hypot(x-n.x,y-n.y);if(d<bd){bd=d;best=n}}return best}
function route(start,end){const s=nearestNode(start.x,start.y),e=nearestNode(end.x,end.y);if(!s||!e)return [end];let open=[s],came=new Map(),g=new Map([[s,0]]),f=new Map([[s,Math.hypot(s.x-e.x,s.y-e.y)]]);const key=n=>n.x+':'+n.y;let guard=0;while(open.length&&guard++<300){open.sort((a,b)=>(f.get(a)||Infinity)-(f.get(b)||Infinity));const cur=open.shift();if(cur===e){const out=[end];let q=cur;while(q&&q!==s){out.push(q);q=came.get(key(q))}out.push(s);return out.reverse()}for(const nb of nodes){if(nb===cur||blocked(nb.x,nb.y))continue;const dx=nb.x-cur.x,dy=nb.y-cur.y,d=Math.hypot(dx,dy);if(d>1150)continue;const ng=(g.get(cur)||0)+d;if(ng<(g.get(nb)||Infinity)){came.set(key(nb),cur);g.set(nb,ng);f.set(nb,ng+Math.hypot(nb.x-e.x,nb.y-e.y));if(!open.includes(nb))open.push(nb)}}}return [end]}
function setup(p,target){p.v6nav=p.v6nav||{route:[],index:0,repath:0,goal:null};const n=p.v6nav;if(!n.goal||Math.hypot((n.goal.x||0)-target.x,(n.goal.y||0)-target.y)>120){n.goal={x:target.x,y:target.y};n.route=route(p,target);n.index=0}}
function move(p,target,dt){setup(p,target);const n=p.v6nav;let q=n.route[n.index]||target;if(Math.hypot(q.x-p.x,q.y-p.y)<45){n.index++;q=n.route[n.index]||target}const d=Math.hypot(q.x-p.x,q.y-p.y)||1;const speed=p.age<18?20:28;p._navVX+=(q.x-p.x)/d*speed*dt;p._navVY+=(q.y-p.y)/d*speed*dt;p._navVX*=.92;p._navVY*=.92;const nx=p.x+p._navVX,ny=p.y+p._navVY;if(!blocked(nx,ny)){p.x=nx;p.y=ny;p.moving=true}else{n.route=route(p,target);n.index=0;p._navVX=0;p._navVY=0}}
function patch(){if(N.patched||!V.engine?.update)return;const old=V.engine.update;V.engine.update=function(dt){const r=old.apply(this,arguments);if(!V.state?.started)return r;const ps=V.worldLifeV56?.people||[];for(const p of ps){const t=V.worldLifeDeep?.target?.(p);if(!t)continue;p._navVX=Number.isFinite(p._navVX)?p._navVX:0;p._navVY=Number.isFinite(p._navVY)?p._navVY:0;move(p,t,Math.min(.05,dt||.016));}return r};N.patched=true;N.ready=true;N.features=['waypoints','a-star-lite','obstacle-avoidance','river-aware','smooth-velocity','repath'];N.route=route}
patch();setTimeout(patch,250);setTimeout(patch,800);
})();
