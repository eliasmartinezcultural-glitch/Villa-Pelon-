/* Villa Pelón V4 — DETALLES DE CALLE */
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const D=V.streetDetails=V.streetDetails||{version:4};
D.render=(c)=>{
 // Alcantarillas, tapas, rampas, postes y pequeños detalles urbanos.
 c.fillStyle='#716451';
 for(const p of [[1060,815],[1510,815],[1110,1080],[1480,1080],[1000,650],[1580,650]]){c.beginPath();c.ellipse(p[0],p[1],11,5,0,0,Math.PI*2);c.fill()}
 c.fillStyle='#c4b28d';for(const p of [[1010,750],[1580,750],[1010,880],[1580,880]])c.fillRect(p[0],p[1],18,7);
 c.strokeStyle='#5b5144';c.lineWidth=3;for(const p of [[980,660],[1620,660],[980,970],[1620,970]]){c.beginPath();c.moveTo(p[0],p[1]);c.lineTo(p[0],p[1]+65);c.stroke();c.fillStyle='#403a33';c.fillRect(p[0]-5,p[1]-4,10,6)}
};
V.v4?.register?.('streetDetails',D);
})();
