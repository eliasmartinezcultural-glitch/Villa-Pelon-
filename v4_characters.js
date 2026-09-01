/* Villa Pelón V4 — SISTEMA HUMANO DE PERSONAJES
   Un único renderizador para jugador y NPCs. Cada persona tiene proporciones,
   altura, cuerpo, rostro, cabello y vestimenta propios. Sin clones visuales.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const C=V.v4Characters=V.v4Characters||{};
const defaults={height:1,build:.5,skin:'#d7a07b',hair:'#40312a',shirt:'#68765e',pants:'#4b4b45',shoes:'#292723',hairStyle:'short',gender:'neutral',age:35};
const palette=[['#d9a17b','#3b2b24','#315d9d','#343d49'],['#c98e68','#5b3927','#8a5b38','#51453b'],['#e0b18b','#252321','#9b4f43','#3f4541'],['#b97855','#3a261e','#6d7650','#41372f'],['#d3a07d','#72513b','#b17b3e','#4a4742'],['#e5b995','#191817','#5c6e82','#4b3e38']];
function make(n,i=0){const p=palette[i%palette.length];return Object.assign({},defaults,n,{skin:n.skin||p[0],hair:n.hair||p[1],shirt:n.shirt||n.color||p[2],pants:n.pants||p[3],height:n.height||(.88+(i%5)*.08),build:n.build??(.38+(i%4)*.09),age:n.age||(24+(i*7)%48),hairStyle:n.hairStyle||['short','long','crop','cap','curly'][i%5],variant:i%palette.length})}
function data(){let arr=[];(V.npcs||[]).forEach((n,i)=>arr.push(make(n,i)));if(V.state)arr.push(make({x:V.state.x,y:V.state.y,player:true,name:'TÚ',height:1,shirt:'#315d9d'},99));return arr}
function hair(ctx,style,color,s){ctx.fillStyle=color;ctx.beginPath();if(style==='long'){ctx.arc(0,-22,14*s,Math.PI,Math.PI*2);ctx.lineTo(14*s,3*s);ctx.lineTo(8*s,8*s);ctx.lineTo(-9*s,7*s);ctx.lineTo(-14*s,3*s)}else if(style==='curly'){ctx.arc(-7*s,-22,7*s,0,Math.PI*2);ctx.arc(0,-25,8*s,0,Math.PI*2);ctx.arc(8*s,-22,7*s,0,Math.PI*2);ctx.lineTo(12*s,-13*s);ctx.lineTo(-12*s,-13*s)}else if(style==='cap'){ctx.arc(0,-21,13*s,Math.PI,Math.PI*2);ctx.fillRect(-15*s,-21*s,30*s,4*s);ctx.fill();return}else{ctx.arc(0,-22,14*s,Math.PI,Math.PI*2);ctx.lineTo(13*s,-13*s);ctx.lineTo(-12*s,-12*s)}ctx.closePath();ctx.fill()}
function draw(ctx,n){const s=(n.height||1),b=(n.build||.5),x=n.x,y=n.y;ctx.save();ctx.translate(x,y);ctx.scale(s,s);
 const skin=n.skin,shirt=n.shirt,pants=n.pants,shoes=n.shoes;const bw=10+13*b;
 ctx.fillStyle='rgba(25,19,15,.30)';ctx.beginPath();ctx.ellipse(0,34,bw+5,7,0,0,Math.PI*2);ctx.fill();
 // piernas y zapatos
 ctx.strokeStyle='#2b2723';ctx.lineWidth=5;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(-5*b,-1);ctx.lineTo(-7*b,27);ctx.moveTo(5*b,-1);ctx.lineTo(7*b,27);ctx.stroke();
 ctx.strokeStyle=pants;ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(-5*b,-1);ctx.lineTo(-7*b,22);ctx.moveTo(5*b,-1);ctx.lineTo(7*b,22);ctx.stroke();
 ctx.strokeStyle=shoes;ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(-7*b,26);ctx.lineTo(-12,28);ctx.moveTo(7*b,26);ctx.lineTo(12,28);ctx.stroke();
 // torso
 ctx.fillStyle=shirt;ctx.strokeStyle='#29231f';ctx.lineWidth=2.3;ctx.beginPath();ctx.roundRect(-bw/2,-17,bw,27,5);ctx.fill();ctx.stroke();
 // cuello
 ctx.fillStyle=skin;ctx.fillRect(-4,-20,8,6);
 // brazos y manos
 ctx.strokeStyle=shirt;ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(-bw/2+2,-12);ctx.lineTo(-bw/2-6,7);ctx.moveTo(bw/2-2,-12);ctx.lineTo(bw/2+6,7);ctx.stroke();ctx.fillStyle=skin;ctx.beginPath();ctx.arc(-bw/2-6,9,4,0,Math.PI*2);ctx.arc(bw/2+6,9,4,0,Math.PI*2);ctx.fill();
 // cabeza proporcional a edad
 const head=(n.age||35)<16?11:(n.age||35)>60?14:13;ctx.fillStyle=skin;ctx.strokeStyle='#352720';ctx.lineWidth=1.8;ctx.beginPath();ctx.ellipse(0,-28,head,head*1.08,0,0,Math.PI*2);ctx.fill();ctx.stroke();
 ctx.fillStyle=skin;ctx.beginPath();ctx.arc(-head,-27,3.2,0,Math.PI*2);ctx.arc(head,-27,3.2,0,Math.PI*2);ctx.fill();hair(ctx,n.hairStyle,n.hair,1);
 // ojos
 const eyeY=-29;ctx.strokeStyle='#392b25';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(-7,-31);ctx.lineTo(-3,-32);ctx.moveTo(3,-32);ctx.lineTo(7,-31);ctx.stroke();ctx.fillStyle='#171515';ctx.beginPath();ctx.arc(-5,eyeY,1.8,0,Math.PI*2);ctx.arc(5,eyeY,1.8,0,Math.PI*2);ctx.fill();
 // nariz, boca, cejas
 ctx.strokeStyle='#995f4a';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(0,-29);ctx.lineTo(-1,-23);ctx.lineTo(2,-23);ctx.stroke();ctx.strokeStyle='#733d3b';ctx.beginPath();ctx.arc(0,-20,4,.15,Math.PI-.15);ctx.stroke();
 // detalle de ropa según profesión/edad
 ctx.strokeStyle='rgba(255,255,255,.22)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-bw/4,-13);ctx.lineTo(-bw/4,5);ctx.stroke();
 if((n.role||'').match(/repart|camion|rural|jornal|productor/i)){ctx.fillStyle='#4a3b2c';ctx.fillRect(-3,-9,6,8)}
 if((n.role||'').match(/escuela|estudiante|niñ/i)){ctx.fillStyle='#d8c59a';ctx.fillRect(-bw/2-1,-10,3,9);ctx.fillRect(bw/2-2,-10,3,9)}
 if((n.role||'').match(/radio/i)){ctx.fillStyle='#252321';ctx.fillRect(-4,-10,8,4);ctx.fillStyle='#d7b45b';ctx.fillRect(-2,-9,4,1)}
 ctx.restore()}
function install(){if(!V.engine||C.installed)return false;C.installed=true;const e=V.engine,base=e.render;e.render=()=>{base();const ctx=e.ctx;const list=data();for(const n of list){if(n&&!n.player)draw(ctx,n)}if(V.state)draw(ctx,make({x:V.state.x,y:V.state.y,player:true,name:'TÚ',shirt:'#315d9d'},99))};return true}
C.make=make;C.draw=draw;C.install=install;C.profiles={heights:'0.88–1.20',builds:'individuales',faces:'ojos/nariz/boca/cejas',clothing:'por personaje',animation:'bob y movimiento'};
const wait=()=>install()||requestAnimationFrame(wait);wait();
})();