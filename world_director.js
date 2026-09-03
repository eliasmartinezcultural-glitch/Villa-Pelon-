/* Villa Pelón V34 — Director de mundo
   Señalética, puntos de interés, ambiente y lectura territorial.
   No crea RAF ni controla al jugador. Se engancha al render de vida existente. */
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const D=V.worldDirector={version:'V34',pois:[],signals:[],phase:0};
D.pois=[
 {x:1165,y:400,label:'PLAZA CENTRAL',sub:'encuentros · descanso',kind:'public'},
 {x:1750,y:610,label:'ALMACÉN',sub:'compras · vecinos',kind:'commerce'},
 {x:1200,y:1190,label:'RADIO',sub:'noticias · voces',kind:'culture'},
 {x:2200,y:700,label:'GALPÓN',sub:'trabajo · herramientas',kind:'rural'},
 {x:2600,y:945,label:'BODEGA',sub:'producción · rural',kind:'rural'},
 {x:530,y:430,label:'ESCUELA',sub:'aprendizaje · memoria',kind:'education'},
 {x:2460,y:1350,label:'CHACRAS',sub:'cultivo · animales',kind:'rural'}
];
const original=V.life&&V.life.drawWorld;
if(original&&!V.life.__v34Director){V.life.__v34Director=true;V.life.drawWorld=(c)=>{original.call(V.life,c);D.phase=V.life.phase||0;
  D.pois.forEach((p,i)=>{const glow=3+Math.sin(D.phase*2+i)*1.5;c.fillStyle='rgba(54,47,34,.78)';c.fillRect(p.x-38,p.y-38,76,15);c.fillStyle='rgba(245,224,170,.9)';c.font='7px monospace';c.textAlign='center';c.fillText(p.label,p.x,p.y-27);c.fillStyle='rgba(219,190,117,.8)';c.beginPath();c.arc(p.x+31,p.y-31,glow,0,Math.PI*2);c.fill();});
  // Postes y carteles: dan escala y lectura de pueblo sin bloquear caminos.
  [[840,690,'CENTRO'],[1540,690,'RURAL'],[1240,900,'RADIO'],[2300,900,'CHACRAS']].forEach(s=>{c.fillStyle='#6d573d';c.fillRect(s[0]-2,s[1]-30,4,30);c.fillStyle='#d8c08b';c.fillRect(s[0]-27,s[1]-38,54,14);c.fillStyle='#4e4639';c.font='7px monospace';c.textAlign='center';c.fillText(s[2],s[0],s[1]-28)});
}};
// Exponer una API pequeña para futuras capas: ninguna función mueve al jugador.
D.findPOI=(x,y,r=100)=>D.pois.find(p=>Math.hypot(p.x-x,p.y-y)<=r)||null;
D.describeTime=()=>{const e=document.getElementById('clock');const h=Number((e&&e.textContent||'08').split(':')[0]);if(h<7)return 'madrugada';if(h<12)return 'mañana';if(h<16)return 'mediodía';if(h<20)return 'tarde';return 'noche'};
})();
