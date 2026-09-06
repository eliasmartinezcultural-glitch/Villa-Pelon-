/* VILLA PELÓN V63 — identidad territorial.
   La ficción utiliza una localidad inventada como representación narrativa de un territorio rural real.
   Regla estricta: el nombre de la localidad real de referencia NO forma parte de la experiencia del juego.
   Los hechos históricos verificables pueden inspirar misiones/evidencias, pero deben conservar su fuente en los metadatos de investigación.
*/
(()=>{
  'use strict';
  const V=window.VillaPelon||(window.VillaPelon={});
  V.regionalIdentity={
    version:'V63',
    canonicalName:'Villa Pelón',
    fictionalized:true,
    realPlaceNameHidden:true,
    territory:{
      biome:'valle irrigado de la estepa patagónica',
      landscape:['chacras','viñedos','frutales','canales de riego','alamedas','caminos rurales','ribera','meseta','galpones','bodegas'],
      climate:['seco','gran amplitud térmica','viento','cielos abiertos','frío invernal','veranos luminosos'],
      water:'El agua organiza la vida del valle: riego, producción, caminos, trabajo y memoria.',
      production:['fruticultura','vitivinicultura','huertas','producción familiar','trabajo de chacra','oficios rurales'],
      mobility:['bicicleta','camioneta','tractor','camión','auto','caminata'],
      atmosphere:'Pueblo pequeño, rural y norpatagónico: silencios, viento, radios, perros, herramientas, acequias, motores lejanos y conversaciones de vereda.'
    },
    fictionalPlaceNames:{
      river:'Río Pelón',
      canal:'Canal Viejo',
      vineyardDistrict:'Los Viñedos',
      orchardDistrict:'Las Chacras',
      ruralRoad:'Camino de los Álamos',
      ruralEdge:'La Meseta',
      winery:'Bodega La Ribera',
      market:'Almacén El Encuentro',
      bakery:'Panadería La Esquina',
      hardware:'Ferretería del Valle',
      school:'Escuela de Villa Pelón',
      radio:'Radio Oasis',
      square:'Plaza del Pueblo'
    },
    worldRules:[
      'Nunca mostrar ni usar como nombre diegético la localidad real que inspira el territorio.',
      'Usar únicamente Villa Pelón y los topónimos ficticios definidos por este módulo.',
      'La geografía, producción, arquitectura y vida cotidiana deben ser coherentes con un valle rural norpatagónico irrigado.',
      'Las misiones históricas deben distinguir entre hecho documentado, testimonio y ficción de ambientación.',
      'No copiar marcas, nombres comerciales o instituciones reales sin una decisión explícita de diseño.',
      'Cada nueva zona debe responder a una función territorial: vivienda, producción, servicios, circulación, memoria o naturaleza.'
    ],
    storyPremise:'Villa Pelón es un pueblo rural construido alrededor del agua, las chacras, los caminos y el trabajo. El jugador descubre su pasado mientras conoce a quienes todavía sostienen su vida cotidiana. La historia no está en un museo único: aparece fragmentada en fotografías, papeles, objetos, lugares y recuerdos.',
    historicalResearchPolicy:{
      sourceBased:true,
      presentation:'Los hechos históricos reales se investigan fuera de la ficción y se convierten en evidencias o misiones dentro de Villa Pelón.',
      playerFacing:'El jugador conoce Villa Pelón; las fuentes pueden identificarse en un archivo histórico del juego sin romper la ficción territorial.'
    }
  };
  V.regionalIdentity.get=(path)=>path.split('.').reduce((o,k)=>o&&o[k],V.regionalIdentity);
})();
