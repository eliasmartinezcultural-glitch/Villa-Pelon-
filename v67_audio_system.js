/* V67 — sistema de audio procedural sin assets externos.
   Música ambiente + paisaje sonoro rural. Preparado para sustituir/añadir archivos reales.
*/
(()=>{'use strict';const V=window.VillaPelon||(window.VillaPelon={});
const A={ctx:null,master:null,started:false,amb:null,music:null};
function start(){if(A.started)return;if(!window.AudioContext&&!window.webkitAudioContext)return;const C=window.AudioContext||window.webkitAudioContext;A.ctx=new C();A.master=A.ctx.createGain();A.master.gain.value=.16;A.master.connect(A.ctx.destination);A.started=true;ambient();music();}
function ambient(){const c=A.ctx,g=c.createGain(),o=c.createOscillator();o.type='sine';o.frequency.value=82;g.gain.value=.012;o.connect(g);g.connect(A.master);o.start();A.amb={o,g}}
function music(){const c=A.ctx,g=c.createGain();g.gain.value=.018;g.connect(A.master);A.music=g;const notes=[196,220,246.94,293.66];notes.forEach((f,i)=>{const o=c.createOscillator();o.type='triangle';o.frequency.value=f;o.connect(g);o.start(c.currentTime+i*.45);o.stop(c.currentTime+8)});setInterval(()=>{if(!A.started)return;const now=c.currentTime;const f=notes[Math.floor(Math.random()*notes.length)];const o=c.createOscillator();o.type='triangle';o.frequency.value=f;const q=c.createGain();q.gain.setValueAtTime(.0001,now);q.gain.exponentialRampToValueAtTime(.025,now+.12);q.gain.exponentialRampToValueAtTime(.0001,now+3);o.connect(q);q.connect(A.master);o.start(now);o.stop(now+3.1)},2600)}
function wind(){if(!A.started)return;const c=A.ctx,b=c.createBuffer(1,c.sampleRate*1,c.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*.18;const s=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain();f.type='lowpass';f.frequency.value=700;g.gain.value=.018;s.buffer=b;s.loop=true;s.connect(f);f.connect(g);g.connect(A.master);s.start();setTimeout(()=>{try{s.stop()}catch(e){}},3500)}
function river(){if(!A.started)return;const c=A.ctx,o=c.createOscillator(),g=c.createGain();o.type='sine';o.frequency.value=180;g.gain.value=.008;o.connect(g);g.connect(A.master);o.start();setTimeout(()=>{try{o.stop()}catch(e){}},1800)}
V.audio={start,wind,river};
['pointerdown','keydown','touchstart'].forEach(e=>window.addEventListener(e,start,{once:true,passive:true}));
setInterval(()=>{const z=V.territory?.zones;if(!z)return;if(V.audio) {if(V.life?.weather==='viento')wind();if(V.life?.weather==='lluvia')river()}},9000);
})();
