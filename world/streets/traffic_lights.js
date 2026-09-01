/* Villa Pelón V4 — SEMÁFOROS */
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const T=V.trafficLights=V.trafficLights||{version:4,phase:0,cycle:18};
T.update=(dt)=>{T.phase=(T.phase+dt)%T.cycle};
T.state=()=>T.phase<8?'green':T.phase<10?'yellow':'red';
T.render=(c,x,y,vertical=false)=>{c.save();c.translate(x,y);if(vertical)c.rotate(Math.PI/2);c.fillStyle='#3e3932';c.fillRect(-3,0,6,62);c.fillStyle='#242321';c.roundRect(-10,-12,20,50,5);c.fill();const s=T.state(),lights=[['red',8],['yellow',22],['green',36]];for(const [n,yy] of lights){c.fillStyle=n===s?(n==='red'?'#d65b4e':n==='yellow'?'#d4b44d':'#69a65c'):'#403d37';c.beginPath();c.arc(0,yy,5,0,Math.PI*2);c.fill()}c.restore()};
V.v4?.register?.('trafficLights',T);
})();
