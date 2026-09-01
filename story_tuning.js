/* Villa Pelón V2 — equilibrio narrativo
   Las secundarias nunca bloquean una misión principal que usa al mismo vecino. */
(()=>{
  const V=window.VillaPelon;
  if(!V?.story)return;
  const set=(id,unlock)=>{const q=V.story.sides.find(x=>x.id===id);if(q)q.unlock=unlock};
  set('mate',3);
  set('caballo',5);
})();
