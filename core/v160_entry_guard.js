/* VILLA PELÓN V160.3 — ENTRY GUARD
   Guardia de presentación. No crea motor, renderer, geometría ni loop.
   Contrato: PORTADA -> PRÓLOGO -> MUNDO, siempre por acción explícita del jugador.
*/
(function(){
  'use strict';
  const ENTRY_VERSION='160.3';
  const startId='start', storyId='storyIntro', buttonId='presentationStart';
  let mode='presentation';
  let observer=null;
  let stopped=false;
  let syncing=false;
  let activated=false;

  function nodes(){return {start:document.getElementById(startId),story:document.getElementById(storyId),button:document.getElementById(buttonId)};}
  function setMode(next){mode=next;document.documentElement.dataset.vpEntry=next;}

  function forcePresentation(){
    if(stopped||mode!=='presentation'||syncing)return;
    const {start,story}=nodes(); if(!start||!story)return;
    syncing=true;
    document.getElementById('bootScreen')?.classList.add('hidden');
    start.classList.remove('hidden');
    start.classList.add('vp-entry-presentation','vp-entry-visible');
    start.setAttribute('aria-hidden','false');
    story.classList.remove('vp-entry-active');
    story.classList.add('hidden');
    story.setAttribute('aria-hidden','true');
    syncing=false;
  }

  function beginPrologue(){
    if(stopped||activated)return;
    activated=true;
    setMode('prologue');
    const {start,story}=nodes();
    if(start){start.classList.remove('vp-entry-presentation','vp-entry-visible');start.classList.add('hidden');start.setAttribute('aria-hidden','true');}
    if(story){story.classList.remove('hidden');story.classList.add('vp-entry-active');story.setAttribute('aria-hidden','false');}
    window.dispatchEvent(new CustomEvent('villa-pelon-open-intro',{detail:{source:'entry-guard',version:ENTRY_VERSION}}));
    setTimeout(function(){if(!stopped&&window.V?.ui?.entry){window.V.ui.entry.phase='intro';}},0);
  }

  function activate(e){
    if(stopped||activated)return;
    if(e){e.preventDefault();e.stopPropagation();}
    beginPrologue();
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
      else if(mode==='prologue' && story.classList.contains('hidden') && window.V?.ui?.entry?.phase==='released') finish();
    });
    observer.observe(start,{attributes:true,attributeFilter:['class','style','aria-hidden']});
    observer.observe(story,{attributes:true,attributeFilter:['class','style','aria-hidden']});

    if(button){
      button.addEventListener('pointerdown',activate,true);
      button.addEventListener('click',activate,true);
      button.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){activate(e)}},true);
    }

    window.addEventListener('villa-pelon-intro-started',function(){activated=true;setMode('prologue')});
    window.addEventListener('villa-pelon-world-entry-released',finish,{once:true});
    return true;
  }

  function boot(){
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
