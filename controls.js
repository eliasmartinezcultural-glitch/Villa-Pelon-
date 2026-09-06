/* VILLA PELÓN V60 — capa de entrada móvil estable.
   No mueve al personaje directamente: reutiliza la API de teclado de game.js.
   Así existe una sola autoridad de movimiento y un solo game loop. */
(() => {
  'use strict';
  const keys = {up:'ArrowUp',down:'ArrowDown',left:'ArrowLeft',right:'ArrowRight'};
  const active = new Map();

  function dispatch(type,key) {
    window.dispatchEvent(new KeyboardEvent(type,{key,code:key,bubbles:true,cancelable:true}));
  }

  function press(button) {
    const key=keys[button.dataset.key];
    if(!key || active.has(button)) return;
    active.set(button,key);
    button.classList.add('pressed');
    button.setPointerCapture?.(event.pointerId);
    dispatch('keydown',key);
  }

  function release(button) {
    const key=active.get(button);
    if(!key) return;
    active.delete(button);
    button.classList.remove('pressed');
    dispatch('keyup',key);
  }

  document.querySelectorAll('[data-key]').forEach(button => {
    button.addEventListener('pointerdown',e => {
      e.preventDefault();
      const key=keys[button.dataset.key];
      if(!key || active.has(button)) return;
      active.set(button,key);
      button.classList.add('pressed');
      button.setPointerCapture?.(e.pointerId);
      dispatch('keydown',key);
    },{passive:false});
    ['pointerup','pointercancel','lostpointercapture'].forEach(type => {
      button.addEventListener(type,e => {e.preventDefault?.();release(button)}, {passive:false});
    });
    button.addEventListener('contextmenu',e=>e.preventDefault());
  });

  window.addEventListener('blur',()=>{
    [...active.keys()].forEach(release);
  });

  document.addEventListener('visibilitychange',()=>{
    if(document.hidden)[...active.keys()].forEach(release);
  });

  window.VillaPelon=window.VillaPelon||{};
  window.VillaPelon.controls={version:'60.0.0',mode:'keyboard-bridge',singleInputAuthority:true};
})();
