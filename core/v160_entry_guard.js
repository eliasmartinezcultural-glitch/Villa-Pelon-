/* VILLA PELÓN V160 — ENTRY GUARD
   Guardia de presentación. No crea motor, renderer, geometría ni loop.
   Contrato: PORTADA -> PRÓLOGO -> MUNDO, siempre por acción explícita del jugador.
*/
(function(){
  'use strict';
  const ENTRY_VERSION='160.2';
  const startId='start', storyId='storyIntro', buttonId='presentationStart';
  let mode='presentation';
  let observer=null;
  let stopped=false;
  let syncing=false;

  function nodes(){return {start:document.getElementById(startId),story:document.getElementById(storyId),button:document.getElementById(buttonId)};}
  function setMode(next){mode=next;document.documentElement.dataset.vpEntry=next;}

  function forcePresentation(){
    if(stopped||mode!=='presentation'||syncing)return;
    const {start,story}=nodes(); if(!start||!story)return;
    syncing=true;
    start.classList.remove('hidden');
    start.classList.add('vp-entry-presentation','vp-entry-visible');
    start.setAttribute('aria-hidden','false');
    story.classList.remove('vp-entry-active');
    story.classList.add('hidden');
    story.setAttribute('aria-hidden','true');
    syncing=false;
  }

  function beginPrologue(){
    if(stopped)return;
    setMode('prologue');
    const {start,story}=nodes();
    if(start){start.classList.remove('vp-entry-presentation','vp-entry-visible');start.classList.add('hidden');start.setAttribute('aria-hidden','true');}
    if(story){story.classList.remove('hidden');story.classList.add('vp-entry-active');story.setAttribute('aria-hidden','false');}
    // Soft intro remains the sole owner of scene progression/release.
    setTimeout(function(){if(!stopped&&window.V?.ui?.entry){window.V.ui.entry.phase='prologue';}},0);
  }

  function finish(){
    stopped=true; mode='world'; setMode('world');
    if(observer)observer.disconnect();
  }

  function install(){
    const {start,story,button}=nodes();
    if(!start||!story)return false;
    setMode('presentation');
    forcePresentation();

    observer=new MutationObserver(function(){
      if(stopped||syncing)return;
      if(mode==='presentation') forcePresentation();
      else if(mode==='prologue'){
        // During the prologue, only the story may remain active. Never resurrect the cover.
        if(story.classList.contains('hidden')){
          // soft_intro owns finishing; do not fight it when it explicitly releases the world.
          if(window.V?.ui?.entry?.phase==='released') finish();
        }
      }
    });
    observer.observe(start,{attributes:true,attributeFilter:['class','style','aria-hidden']});
    observer.observe(story,{attributes:true,attributeFilter:['class','style','aria-hidden']});

    if(button)button.addEventListener('click',function(){
      beginPrologue();
    },false);

    window.addEventListener('villa-pelon-intro-started',beginPrologue,{once:false});
    window.addEventListener('villa-pelon-world-entry-released',finish,{once:true});
    window.addEventListener('villa-pelon-intro-finished',function(){setMode('prologue');},{once:false});
    return true;
  }

  function boot(){
    // soft_intro is deferred and owns the canonical entry logic; this guard only seals visibility.
    if(install()){
      setTimeout(function(){if(!stopped&&mode==='presentation')forcePresentation();},80);
      setTimeout(function(){if(!stopped&&mode==='presentation')forcePresentation();},400);
    }
    window.V=window.V||{};
    V.runtimeAudit=V.runtimeAudit||{};
    V.runtimeAudit.entryGuard160=true;
    V.runtimeAudit.entryGuardVersion=ENTRY_VERSION;
    window.dispatchEvent(new CustomEvent('villa-pelon-entry-guard-ready',{detail:{version:ENTRY_VERSION}}));
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
