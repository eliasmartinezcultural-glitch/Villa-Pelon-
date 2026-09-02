/* Villa Pelón V6.12 — NAVEGACIÓN TERRITORIAL
   Grafo pequeño y reutilizable: calles principales + accesos productivos + parcelas.
   No crea RAF ni mueve entidades por su cuenta; sólo resuelve rutas para los sistemas de vida.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const N=V.territorialNavigation=V.territorialNavigation||{version:1,enabled:true,ready:false};
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const baseNodes=[
 {id:'centro_oeste',x:0,y:815},{id:'centro_avenida',x:1180,y:815},{id:'avenida_centro',x:1400,y:815},{id:'centro_este',x:4200,y:815},
 {id:'central_norte',x:1290,y:180},{id:'central_sur',x:1290,y:2700},
 {id:'rural_puerta',x:2500,y:815},{id:'rural_norte',x:2500,y:1335},{id:'rural_centro',x:2500,y:1710},{id:'rural_sur',x:2500,y:2200},
 {id:'chacra_norte',x:2652,y:1460},{id:'chacra_central',x:3180,y:1460},{id:'chacra_sur',x:2652,y:1820},{id:'chacra_este',x:3247,y:1820},
 {id:'productivo_este',x:4200,y:2200},{id:'productivo_sur',x:4200,y:3000},{id:'productivo_oeste',x:3000,y:3000}
];
const baseEdges=[
 ['centro_oeste','centro_avenida'],['centro_avenida','avenida_centro'],['avenida_centro','centro_este'],
 ['central_norte','centro_avenida'],['centro_avenida','central_sur'],
 ['central_sur','rural_sur'],['rural_sur','rural_centro'],['rural_centro','rural_norte'],['rural_norte','rural_puerta'],
 ['rural_norte','chacra_norte'],['rural_centro','chacra_sur'],['rural_centro','chacra_central'],['chacra_central','chacra_este'],
 ['chacra_central','productivo_este'],['productivo_este','productivo_sur'],['productivo_sur','productivo_oeste'],['productivo_oeste','rural_sur']
];
function nodeMap(){const m={};for(const n of baseNodes)m[n.id]=n;for(const p of(V.agriculturalCycle?.parcels||[])){const id='parcel_'+p.id;if(!m[id])m[id]={id,x:p.x+p.w*.12,y:p.y+p.h*.5,parcel:p.id};}return m}
function graph(){const m=nodeMap(),adj={};Object.keys(m).forEach(k=>adj[k]=[]);for(const [a,b] of baseEdges){if(m[a]&&m[b]){adj[a].push(b);adj[b].push(a)}}for(const p of(V.agriculturalCycle?.parcels||[])){const pid='parcel_'+p.id;const nearest=Object.values(m).filter(n=>n.id!==pid&&!n.parcel).sort((a,b)=>dist(m[pid],a)-dist(m[pid],b))[0];if(nearest){adj[pid].push(nearest.id);adj[nearest.id].push(pid)}}return{m,adj}}
function nearestNode(point,m,filter){return Object.values(m).filter(n=>!filter||filter(n)).sort((a,b)=>dist(point,a)-dist(point,b))[0]}
function astar(start,goal,g){const open=[start.id],came={},gs={[start.id]:0},fs={[start.id]:dist(start,goal)};const closed=new Set();while(open.length){open.sort((a,b)=>(fs[a]??Infinity)-(fs[b]??Infinity));const cur=open.shift();if(cur===goal.id){const path=[cur];while(came[path[0]])path.unshift(came[path[0]]);return path.map(id=>g.m[id])}closed.add(cur);for(const id of(g.adj[cur]||[])){if(closed.has(id))continue;const ng=gs[cur]+dist(g.m[cur],g.m[id]);if(ng<(gs[id]??Infinity)){came[id]=cur;gs[id]=ng;fs[id]=ng+dist(g.m[id],goal);if(!open.includes(id))open.push(id)}}}return[]}
function route(from,to,options={}){if(!from||!to)return[];const g=graph();const a=nearestNode(from,g.m,options.fromFilter),b=nearestNode(to,g.m,options.toFilter);if(!a||!b)return[to];let nodes=astar(a,b,g);if(!nodes.length)return[to];const out=[];for(const n of nodes){if(dist(from,n)>32)out.push({x:n.x,y:n.y,place:n.parcel?'chacra':'camino'})}out.push({x:to.x,y:to.y,place:to.place||'destino'});return out}
function roadAwareRoute(from,to){return route(from,to)}
function nextWaypoint(entity,to){const key=JSON.stringify({x:Math.round(to.x),y:Math.round(to.y),place:to.place||''});if(entity._navKey!==key){entity._navKey=key;entity._navPath=roadAwareRoute(entity,to);entity._navIndex=0}while(entity._navPath&&entity._navIndex<entity._navPath.length&&dist(entity,entity._navPath[entity._navIndex])<28)entity._navIndex++;return entity._navPath?.[entity._navIndex]||to}
function invalidate(entity){if(entity){entity._navKey=null;entity._navPath=null;entity._navIndex=0}}
function check(){const g=graph();let broken=0;for(const e of baseEdges)if(!g.m[e[0]]||!g.m[e[1]])broken++;return{ok:broken===0,nodes:Object.keys(g.m).length,edges:baseEdges.length,broken,parcels:(V.agriculturalCycle?.parcels||[]).length}}
N.graph=graph;N.route=route;N.nextWaypoint=nextWaypoint;N.invalidate=invalidate;N.check=check;N.ready=true;N.features=['street-graph','rural-access-graph','parcel-access','astar-routing','waypoint-following','reusable-navigation-api'];
})();
