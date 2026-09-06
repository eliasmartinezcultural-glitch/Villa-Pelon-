/* Villa Pelón V71 — intro narrativa mobile-first. Audio generado con Web Audio API, sin archivos externos. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const start = $('start'), card = $('introCard'), title = $('introTitle'), text = $('introText');
  const eyebrow = $('introEyebrow'), progress = $('introProgress'), hint = $('introHint'), skip = $('introSkip'), startBtn = $('startBtn'), badge = $('audioBadge');
  if (!start || !card || !startBtn) return;

  const scenes = [
    {e:'VILLA PELÓN · UNA HISTORIA EN JUEGO', t:'ANTES DE SER UN PUEBLO, FUE TERRITORIO.', p:'Hay lugares que se conocen caminándolos. Otros, escuchando a quienes los habitaron.'},
    {e:'EL VALLE · AGUA Y TIERRA', t:'EL AGUA CAMBIÓ EL PAISAJE.', p:'El río, los canales y el riego hicieron posible transformar grandes extensiones de tierra en un territorio productivo.'},
    {e:'MEMORIA · TRABAJO · COMUNIDAD', t:'LA HISTORIA NO ESTÁ SOLAMENTE EN LOS LIBROS.', p:'Está en una chacra, en una escuela, en una fotografía, en una conversación y en las personas que todavía recuerdan.'},
    {e:'TU TURNO', t:'AHORA TE TOCA RECORRERLO.', p:'Caminá. Preguntá. Observá. Cumplí misiones. Cada descubrimiento será una pieza de la historia.'}
  ];
  let index = 0, started = false, audio = null;

  function initAudio(){
    if (audio) { audio.ctx.resume().catch(()=>{}); return; }
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      const ctx = new Ctx(), master = ctx.createGain(), filter = ctx.createBiquadFilter();
      master.gain.value = 0.055; filter.type = 'lowpass'; filter.frequency.value = 1500;
      filter.Q.value = 0.7; filter.connect(master); master.connect(ctx.destination);
      const notes = [110,146.83,164.81,196,164.81,146.83]; let step = 0;
      const timer = setInterval(() => {
        if (!audio || audio.stopped) { clearInterval(timer); return; }
        const osc = ctx.createOscillator(), g = ctx.createGain();
        osc.type='sine'; osc.frequency.value=notes[step++ % notes.length];
        g.gain.setValueAtTime(0,ctx.currentTime); g.gain.linearRampToValueAtTime(0.18,ctx.currentTime+0.35); g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+2.5);
        osc.connect(g); g.connect(filter); osc.start(); osc.stop(ctx.currentTime+2.6);
      }, 1800);
      audio={ctx,stopped:false,timer}; ctx.resume().catch(()=>{});
      badge.textContent='♫ SONIDO ACTIVADO';
    } catch (_) { badge.textContent='♪ SONIDO NO DISPONIBLE'; }
  }

  function ping(){
    if(!audio) return;
    const ctx=audio.ctx, osc=ctx.createOscillator(), g=ctx.createGain(); osc.type='triangle'; osc.frequency.value=440;
    g.gain.setValueAtTime(.001,ctx.currentTime); g.gain.exponentialRampToValueAtTime(.08,ctx.currentTime+.02); g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+.22);
    osc.connect(g); g.connect(ctx.destination); osc.start(); osc.stop(ctx.currentTime+.24);
  }

  function render(i){
    const s=scenes[i]; index=i; eyebrow.textContent=s.e; title.textContent=s.t; text.textContent=s.p;
    progress.style.width=((i+1)/scenes.length*100)+'%'; hint.textContent=i===scenes.length-1?'TOCÁ PARA ENTRAR AL TERRITORIO':'TOCÁ PARA CONTINUAR';
    card.classList.remove('intro-pulse'); void card.offsetWidth; card.classList.add('intro-pulse'); ping();
  }

  function next(){
    initAudio();
    if(index < scenes.length-1){ render(index+1); return; }
    enterGame();
  }

  function enterGame(){
    if(started) return; started=true; initAudio();
    card.classList.add('intro-exit'); skip.disabled=true; startBtn.disabled=true;
    setTimeout(()=>{ start.classList.add('hidden'); $('game').classList.remove('hidden'); if(window.__villaPelonState) window.__villaPelonState.started=true; if(window.VillaPelon?.gameStart) window.VillaPelon.gameStart(); },420);
  }

  start.addEventListener('pointerup', e=>{ if(e.target.closest('#introSkip,#startBtn')) return; next(); });
  startBtn.addEventListener('click', enterGame);
  skip.addEventListener('click', e=>{e.stopPropagation();enterGame();});
  render(0);
})();
