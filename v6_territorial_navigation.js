/* Villa Pelón V6.30 — NAVEGACIÓN TERRITORIAL RESILIENTE
   Autoridad única de calles + grafo derivado de geometría real.
   NPC: casa/lugar -> calle -> intersecciones -> destino.
   Incluye recuperación de atascos, reintento de rutas, llegada segura
   y separación física ligera entre peatones. No crea loop ni renderer.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const N=V.territorialNavigation=V.territorialNavigation||{};
N.version=10;N.enabled=true;N.ready=false;
const W=()=>V.world?.w||8400,H=()=>V.world?.h||5600;
const river={x:7000,y:0,w:1200,h:5600};
const bridges=[{y:815,h:90},{y:1395,h:90}];
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const roads=()=>Array.isArray(V.streetSystem?.roads)?V.streetSystem.roads:[];
const inRect=(x,y,r,p=0)=>x>=r.x-p&&x<=r.x+r.w+p&&y>=r.y-p&&y<=r.y+r.h+p;
const bridgeAt=(x,y)=>bridges.some(b=>x>=river.x-30&&x<=river.x+river.w+30&&Math.abs(y-(b.y+b.h/2))<=b.h/2+16);
const inRiver=(x,y,p=0)=>inRect(x,y,river,p)&&!bridgeAt(x,y);
function buildingAt(x,y,pad=10){return (V.buildingSystem?.buildings||V.buildings||[]).some(b=>b.collision!==false&&inRect(x,y,b,pad))}
function parcelAt(x,y){return (V.agriculturalCycle?.parcels||[]).find(p=>inRect(x,y,p))}
function fenceCross(a,b,p){if(!p)return false;const insideA=inRect(a.x,a.y,p,-1),insideB=inRect(b.x,b.y,p,-1);if(insideA===insideB)return false;const gx=p.x+p.w*.12,gy=p.y+p.h*.5,gate=78;const vertical=((a.x<p.x&&b.x>p.x)||(a.x>p.x&&b.x<p.x)||(a.x<p.x+p.w&&b.x>p.x+p.w)||(a.x>p.x+p.w&&b.x<p.x+p.w));const horizontal=((a.y<p.y&&b.y>p.y)||(a.y>p.y&&b.y<p.y)||(a.y<p.y+p.h&&b.y>p.y+p.h)||(a.y>p.y+p.h&&b.y<p.y+p.h));if(vertical&&Math.abs((a.y+b.y)/2-gy)>gate)return true;if(horizontal&&Math.abs((a.x+b.x)/2-gx)>gate)return true;return false}
function isWalkable(x,y,actor){if(x<60||y<180||x>W()-60||y>H()-60)return false;if(inRiver(x,y,8))return false;if(buildingAt(x,y,actor?.radius||10))return false;return true}
function clear(a,b,actor,allowRoad=false){const d=dist(a,b),steps=Math.max(2,Math.ceil(d/22));const mid={x:(a.x+b.x)/2,y:(a.y+b.y)/2};if(!allowRoad&&fenceCross(a,b,parcelAt(mid.x,mid.y)))return false;for(let i=0;i<=steps;i++){const t=i/steps,x=a.x+(b.x-a.x)*t,y=a.y+(b.y-a.y)*t;if(!isWalkable(x,y,actor))return false}return true}
function addNode(map,n){const key=n.id||`n_${Math.round(n.x)}_${Math.round(n.y)}`;if(!map[key])map[key]={...n,id:key};return map[key]}
function buildGraph(){const map={},adj={};
 for(const r of roads()){addNode(map,{id:`end_${r.id}_a`,x:r.orientation==='horizontal'?r.x:r.x+r.w*.5,y:r.orientation==='horizontal'?r.y+r.h*.5:r.y,road:r.id});addNode(map,{id:`end_${r.id}_b`,x:r.orientation==='horizontal'?r.x+r.w:r.x+r.w*.5,y:r.orientation==='horizontal'?r.y+r.h*.5:r.y+r.h,road:r.id})}
 for(const p of V.streetSystem?.intersections||[])if(Number.isFinite(p.x)&&Number.isFinite(p.y))addNode(map,{id:`int_${p.a}_${p.b}`,x:p.x,y:p.y,intersection:true,roads:[p.a,p.b]});
 for(const p of V.agriculturalCycle?.parcels||[]){const ap=(p.accessPoints||[])[0]||{x:p.x+p.w*.12,y:p.y+p.h*.5};addNode(map,{id:`parcel_${p.id}`,x:ap.x,y:ap.y,parcel:p.id,place:'chacra'})}
 for(const p of V.urbanFabric?.publicNodes||[])if(Number.isFinite(p.x)&&Number.isFinite(p.y))addNode(map,{id:`public_${Math.round(p.x)}_${Math.round(p.y)}`,x:p.x,y:p.y,place:'plaza',public:true});
 Object.keys(map).forEach(k=>adj[k]=[]);
 const byRoad={};for(const n of Object.values(map))for(const rid of (n.roads||[n.road]).filter(Boolean))(byRoad[rid]||(byRoad[rid]=[])).push(n);
 for(const rid of Object.keys(byRoad)){const r=V.streetSystem?.roadById?.[rid];const list=byRoad[rid].sort((a,b)=>r?.orientation==='horizontal'?a.x-b.x:a.y-b.y);for(let i=0;i<list.length-1;i++){const a=list[i],b=list[i+1];if(clear(a,b,null,true)){adj[a.id].push(b.id);adj[b.id].push(a.id)}}}
 const roadNodes=Object.values(map).filter(n=>n.road||n.intersection);for(const n of Object.values(map).filter(x=>x.parcel||x.public)){const candidates=roadNodes.filter(r=>dist(n,r)<1800).sort((a,b)=>dist(n,a)-dist(n,b));const target=candidates.find(r=>clear(n,r,null,false));if(target){adj[n.id].push(target.id);adj[target.id].push(n.id)}}
 return{map,adj}}
function nearestNode(point,g,predicate){return Object.values(g.map).filter(n=>!predicate||predicate(n)).sort((a,b)=>dist(point,a)-dist(point,b))[0]||null}
function astar(start,goal,g){const open=[start.id],came={},gs={[start.id]:0},fs={[start.id]:dist(start,goal)},closed=new Set();while(open.length){open.sort((a,b)=>(fs[a]??Infinity)-(fs[b]??Infinity));const cur=open.shift();if(cur===goal.id){const path=[cur];while(came[path[0]])path.unshift(came[path[0]]);return path.map(id=>g.map[id])}closed.add(cur);for(const id of g.adj[cur]||[]){if(closed.has(id))continue;const ng=gs[cur]+dist(g.map[cur],g.map[id]);if(ng<(gs[id]??Infinity)){came[id]=cur;gs[id]=ng;fs[id]=ng+dist(g.map[id],goal);if(!open.includes(id))open.push(id)}}}return[]}
function connector(point,g,prefer){const list=Object.values(g.map).filter(n=>n.road||n.intersection||n.public||n.parcel).sort((a,b)=>dist(point,a)-dist(point,b));return list.find(n=>(!prefer||prefer(n))&&clear(point,n,null,false))||null}
function route(from,to){if(!from||!to)return[];const g=buildGraph();const start=connector(from,g,n=>n.road||n.intersection)||nearestNode(from,g.map);const goal=connector(to,g,n=>n.public||n.parcel||n.road||n.intersection)||nearestNode(to,g.map);if(!start||!goal)return[to];const nodes=astar(start,goal,g);const out=[];if(dist(from,start)>30)out.push({x:start.x,y:start.y,place:'camino'});for(const n of nodes)if(!out.length||dist(out[out.length-1],n)>30)out.push({x:n.x,y:n.y,place:n.place||'camino'});if(!out.length||dist(out[out.length-1],to)>28)out.push({x:to.x,y:to.y,place:to.place||'destino',building:to.building});return out.length?out:[to]}
function routeKey(to){return JSON.stringify({x:Math.round(to.x/4)*4,y:Math.round(to.y/4)*4,place:to.place||'',building:to.building||''})}
function rebuild(entity,to,reason){entity._navKey=routeKey(to);entity._navPath=route(entity,to);entity._navIndex=0;entity._navFailures=(entity._navFailures||0)+(reason?1:0);entity._navLastBuild=performance.now();return entity._navPath}
function nextWaypoint(entity,to){const key=routeKey(to);if(entity._navKey!==key||!Array.isArray(entity._navPath)||!entity._navPath.length)rebuild(entity,to,false);while(entity._navPath&&entity._navIndex<entity._navPath.length&&dist(entity,entity._navPath[entity._navIndex])<24)entity._navIndex++;return entity._navPath?.[entity._navIndex]||to}
function nearbyPeople(entity){return (V.population?.movers?.()||V.npcs||[]).filter(p=>p&&p!==entity&&p.lifeMoving&&!p._v65Hidden&&dist(entity,p)<42)}
function separation(entity,nx,ny){let sx=0,sy=0;for(const p of nearbyPeople(entity)){const dx=nx-p.x,dy=ny-p.y,d=Math.hypot(dx,dy)||1;const push=Math.max(0,1-d/42);sx+=dx/d*push;sy+=dy/d*push}const d=Math.hypot(sx,sy);return d?{x:nx+sx/d*7,y:ny+sy/d*7}:{x:nx,y:ny}}
function move(entity,to,dt,speed=58){if(!entity||!to)return false;const now=performance.now();let target=nextWaypoint(entity,to),d=dist(entity,target);if(d<2){entity.moving=false;entity.lifeMoving=false;return false}
 const step=Math.min(d,Math.max(0,Number(speed)||58)*Math.max(0,Number(dt)||0));let nx=entity.x+(target.x-entity.x)/d*step,ny=entity.y+(target.y-entity.y)/d*step;const separated=separation(entity,nx,ny);nx=separated.x;ny=separated.y;const roadMove=!!V.streetSystem?.onRoad?.(entity.x,entity.y);
 if(clear({x:entity.x,y:entity.y},{x:nx,y:ny},entity,roadMove)){entity.x=nx;entity.y=ny;entity.moving=true;entity.lifeMoving=true;entity._navBlockedSince=0;entity._navFailures=0;return true}
 if(!entity._navBlockedSince)entity._navBlockedSince=now;const blockedFor=now-entity._navBlockedSince;
 if(blockedFor>180){rebuild(entity,to,true);entity._navBlockedSince=now;target=nextWaypoint(entity,to);d=dist(entity,target);if(d>2){const s=Math.min(d,Math.max(0,Number(speed)||58)*Math.max(0,Number(dt)||0));const rx=entity.x+(target.x-entity.x)/d*s,ry=entity.y+(target.y-entity.y)/d*s;if(clear(entity,{x:rx,y:ry},entity,false)){entity.x=rx;entity.y=ry;entity.moving=true;entity.lifeMoving=true;return true}}}
 entity.moving=false;entity.lifeMoving=false;return false}
function invalidate(entity){if(!entity)return;entity._navKey=null;entity._navPath=null;entity._navIndex=0;entity._navBlockedSince=0}
function check(){const rs=roads(),g=buildGraph(),nodes=Object.values(g.map),connected=nodes.filter(n=>(g.adj[n.id]||[]).length>0).length;return{ok:!!V.streetSystem?.singleAuthority&&rs.length>0&&nodes.length>0&&connected>0,version:N.version,roads:rs.length,nodes:nodes.length,connectedNodes:connected,connectivityRatio:nodes.length?Number((connected/nodes.length).toFixed(2)):0,intersections:V.streetSystem?.intersections?.length||0,parcels:V.agriculturalCycle?.parcels?.length||0,derivedGraph:true,singleRoadAuthority:true,obstacleAware:true,resilientMovement:true}}
N.isWalkable=isWalkable;N.segmentClear=(a,b,actor)=>clear(a,b,actor,false);N.roadAt=(x,y)=>V.streetSystem?.roadAt?.(x,y)||null;N.nearestRoad=(x,y)=>V.streetSystem?.nearestRoad?.(x,y)||null;N.route=route;N.nextWaypoint=nextWaypoint;N.move=move;N.invalidate=invalidate;N.graph=buildGraph;N.check=check;N.clear=invalidate;N.ready=true;
N.features=['single-road-authority','derived-road-graph','real-road-network','intersection-routing','obstacle-aware-routing','building-collision','river-and-bridge-rules','parcel-access-gates','rural-access','astar-routing','safe-segment-movement','public-destinations','route-rebuild-on-target-change','stuck-recovery','route-retry','pedestrian-separation'];
})();
