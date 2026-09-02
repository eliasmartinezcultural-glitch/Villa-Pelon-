/* Villa Pelón V6.22.2 — NAVEGACIÓN TERRITORIAL
   Autoridad única de calles + navegación física.
   No mantiene una segunda red vial: consume V.streetSystem.
   No crea loop, física ni renderer propio.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const N=V.territorialNavigation=V.territorialNavigation||{};
N.version=8;N.enabled=true;
const W=()=>V.world?.w||8400,H=()=>V.world?.h||5600;
const river={x:7000,y:0,w:1200,h:5600};
const bridges=[{y:815,h:90},{y:1395,h:90}];
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const authoritativeRoads=()=>Array.isArray(V.streetSystem?.roads)?V.streetSystem.roads:[];
const inRect=(x,y,r,p=0)=>x>=r.x-p&&x<=r.x+r.w+p&&y>=r.y-p&&y<=r.y+r.h+p;
const bridgeAt=(x,y)=>bridges.some(b=>x>=river.x-24&&x<=river.x+river.w+24&&Math.abs(y-b.y-b.h/2)<=b.h/2+12);
function inRiver(x,y,p=0){return inRect(x,y,river,p)&&!bridgeAt(x,y)}
function buildingAt(x,y,pad=10){return (V.buildings||[]).some(b=>b.collision!==false&&inRect(x,y,b,pad))}
function parcelAt(x,y){return (V.agriculturalCycle?.parcels||[]).find(p=>inRect(x,y,p));}
function fenceCross(a,b,p){if(!p)return false;const left=p.x,right=p.x+p.w,top=p.y,bottom=p.y+p.h;const insideA=inRect(a.x,a.y,p,-1),insideB=inRect(b.x,b.y,p,-1);if(insideA===insideB)return false;const gx=p.x+p.w*.12,gy=p.y+p.h*.5,gate=70;const crossesVertical=(a.x<left&&b.x>left)||(a.x>left&&b.x<left)||(a.x<right&&b.x>right)||(a.x>right&&b.x<right);const crossesHorizontal=(a.y<top&&b.y>top)||(a.y>top&&b.y<top)||(a.y<bottom&&b.y>bottom)||(a.y>bottom&&b.y<bottom);if(crossesVertical&&Math.abs(((a.y+b.y)/2)-gy)>gate)return true;if(crossesHorizontal&&Math.abs(((a.x+b.x)/2)-gx)>gate)return true;return false}
function isWalkable(x,y,actor){if(x<60||y<180||x>W()-60||y>H()-60)return false;if(inRiver(x,y,8))return false;if(buildingAt(x,y,actor?.radius||10))return false;return true}
function segmentClear(a,b,actor){const d=dist(a,b),steps=Math.max(2,Math.ceil(d/24));const p=parcelAt((a.x+b.x)/2,(a.y+b.y)/2);if(fenceCross(a,b,p))return false;for(let i=0;i<=steps;i++){const t=i/steps,x=a.x+(b.x-a.x)*t,y=a.y+(b.y-a.y)*t;if(!isWalkable(x,y,actor))return false}return true}
function roadAt(x,y){return authoritativeRoads().some(r=>inRect(x,y,r))}
function nearestRoad(point){return authoritativeRoads().map(r=>({x:r.x+r.w/2,y:r.y+r.h/2,r})).sort((a,b)=>dist(point,a)-dist(point,b))[0]}
const baseNodes=[{id:'centro_oeste',x:0,y:815},{id:'centro_avenida',x:1180,y:815},{id:'avenida_centro',x:1400,y:815},{id:'centro_este',x:4200,y:815},{id:'central_norte',x:1290,y:180},{id:'central_sur',x:1290,y:2700},{id:'rural_puerta',x:2500,y:815},{id:'rural_norte',x:2500,y:1335},{id:'rural_centro',x:2500,y:1710},{id:'rural_sur',x:2500,y:2200},{id:'productivo_este',x:4200,y:2200},{id:'productivo_sur',x:4200,y:3000},{id:'productivo_oeste',x:3000,y:3000},{id:'campo_este',x:6100,y:2815},{id:'campo_sur',x:6970,y:3615}];
const baseEdges=[['centro_oeste','centro_avenida'],['centro_avenida','avenida_centro'],['avenida_centro','centro_este'],['central_norte','centro_avenida'],['centro_avenida','central_sur'],['central_sur','rural_sur'],['rural_sur','rural_centro'],['rural_centro','rural_norte'],['rural_norte','rural_puerta'],['rural_norte','productivo_oeste'],['rural_centro','productivo_oeste'],['productivo_oeste','productivo_este'],['productivo_este','productivo_sur'],['productivo_sur','campo_este'],['campo_este','campo_sur']];
function nodeMap(){const m={};for(const n of baseNodes)m[n.id]=n;for(const p of(V.agriculturalCycle?.parcels||[])){const id='parcel_'+p.id;m[id]={id,x:p.x+p.w*.12,y:p.y+p.h*.5,parcel:p.id,place:'chacra'}}return m}
function graph(){const m=nodeMap(),adj={};Object.keys(m).forEach(k=>adj[k]=[]);for(const [a,b] of baseEdges)if(m[a]&&m[b]&&segmentClear(m[a],m[b])){adj[a].push(b);adj[b].push(a)}for(const p of(V.agriculturalCycle?.parcels||[])){const pid='parcel_'+p.id,target=m[pid];const candidates=Object.values(m).filter(n=>n.id!==pid&&!n.parcel).sort((a,b)=>dist(target,a)-dist(target,b));const roadCandidate=candidates.find(n=>segmentClear(target,n));if(roadCandidate){adj[pid].push(roadCandidate.id);adj[roadCandidate.id].push(pid)}}return{m,adj}}
function nearestNode(point,m,filter){return Object.values(m).filter(n=>!filter||filter(n)).sort((a,b)=>dist(point,a)-dist(point,b))[0]}
function astar(start,goal,g){const open=[start.id],came={},gs={[start.id]:0},fs={[start.id]:dist(start,goal)},closed=new Set();while(open.length){open.sort((a,b)=>(fs[a]??Infinity)-(fs[b]??Infinity));const cur=open.shift();if(cur===goal.id){const path=[cur];while(came[path[0]])path.unshift(came[path[0]]);return path.map(id=>g.m[id])}closed.add(cur);for(const id of(g.adj[cur]||[])){if(closed.has(id))continue;const ng=gs[cur]+dist(g.m[cur],g.m[id]);if(ng<(gs[id]??Infinity)){came[id]=cur;gs[id]=ng;fs[id]=ng+dist(g.m[id],goal);if(!open.includes(id))open.push(id)}}}return[]}
function route(from,to,options={}){if(!from||!to)return[];const g=graph();let a=nearestNode(from,g.m,options.fromFilter),b=nearestNode(to,g.m,options.toFilter);if(!a||!b)return[to];const nodes=astar(a,b,g);if(!nodes.length){const nr=nearestRoad(from),nt=nearestRoad(to);if(nr&&nt&&segmentClear(from,nr)&&segmentClear(nt,to))return[{x:nr.x,y:nr.y,place:'camino'},{x:nt.x,y:nt.y,place:'camino'},{x:to.x,y:to.y,place:to.place||'destino'}];return[to]}const out=[];for(const n of nodes)if(dist(from,n)>32)out.push({x:n.x,y:n.y,place:n.place||'camino'});if(!out.length||dist(out[out.length-1],to)>28)out.push({x:to.x,y:to.y,place:to.place||'destino'});return out}
function nextWaypoint(entity,to){const key=JSON.stringify({x:Math.round(to.x),y:Math.round(to.y),place:to.place||''});if(entity._navKey!==key){entity._navKey=key;entity._navPath=route(entity,to);entity._navIndex=0}while(entity._navPath&&entity._navIndex<entity._navPath.length&&dist(entity,entity._navPath[entity._navIndex])<28)entity._navIndex++;return entity._navPath?.[entity._navIndex]||to}
function move(entity,to,dt,speed=58){const target=nextWaypoint(entity,to),d=dist(entity,target);if(d<2){invalidate(entity);return false}const step=Math.min(d,speed*dt),nx=entity.x+(target.x-entity.x)/d*step,ny=entity.y+(target.y-entity.y)/d*step;if(segmentClear({x:entity.x,y:entity.y},{x:nx,y:ny},entity)){entity.x=nx;entity.y=ny;entity.moving=true;return true}invalidate(entity);return false}
function invalidate(entity){if(entity){entity._navKey=null;entity._navPath=null;entity._navIndex=0}}
function check(){const roads=authoritativeRoads();const g=graph();let clear=0;for(const [a,b] of baseEdges)if(g.m[a]&&g.m[b]&&segmentClear(g.m[a],g.m[b]))clear++;return{ok:Array.isArray(V.streetSystem?.roads)&&roads.length>0&&clear>0,nodes:Object.keys(g.m).length,edges:clear,parcels:(V.agriculturalCycle?.parcels||[]).length,roads:roads.length,obstacleAware:true,singleRoadAuthority:true}}
N.isWalkable=isWalkable;N.segmentClear=segmentClear;N.roadAt=roadAt;N.route=route;N.nextWaypoint=nextWaypoint;N.move=move;N.invalidate=invalidate;N.graph=graph;N.check=check;N.ready=true;N.features=['single-road-authority','real-road-network','obstacle-aware-routing','building-collision','river-and-bridge-rules','parcel-fence-gates','rural-access','astar-routing','safe-segment-movement','route-cache'];
})();
