/* VILLA PELÓN V62 — mundo y contenido.
   Regla: los hechos históricos se incorporan con fuente; la ambientación no inventa historia presentada como real. */
window.VillaPelon=window.VillaPelon||{};
window.VillaPelon.villageData={
 version:'V62',
 setting:{name:'Villa Pelón',region:'valle rural patagónico',tone:'pueblo pequeño, cotidiano, silencioso y vivo',objective:'reconstruir la historia mediante misiones, testimonios, documentos y lugares'},
 intro:{title:'VILLA PELÓN · DONDE COMIENZA UNA HISTORIA',text:'Villa Pelón es un pequeño pueblo rural donde la historia no aparece escrita de golpe: está repartida entre sus calles, sus casas, los oficios, los recuerdos de sus vecinos y los lugares que todavía guardan huellas del pasado. Llegás como un visitante y, poco a poco, empezás a conocer a la gente y a entender cómo se construyó la comunidad.',objective:'Tu objetivo no es derrotar a un enemigo. Es descubrir. Cada misión te acerca a una persona, un lugar, un objeto, una fotografía, un documento o un recuerdo. Al completar misiones vas armando el relato de Villa Pelón.',rule:'Cuando una misión represente historia real, el juego mostrará su fuente o la marcará como pendiente de documentación. La ficción de ambientación nunca se presentará como un hecho histórico.'},
 districts:[
  {id:'centro',name:'Centro',description:'Calles tranquilas, plaza, almacén y movimiento cotidiano.'},
  {id:'residencial',name:'Barrio de casas',description:'Casas, patios, vecinos y pequeñas historias de todos los días.'},
  {id:'rural',name:'Zona rural',description:'Chacras, galpones, herramientas, animales y trabajo.'},
  {id:'ribera',name:'Ribera',description:'Un borde abierto para caminar, observar y encontrar pistas.'},
  {id:'servicios',name:'Servicios y comunidad',description:'Escuela, radio y espacios donde se organiza la vida del pueblo.'}
 ],
 landmarks:[
  {id:'plaza',name:'Plaza',district:'centro',activity:'encuentro'},
  {id:'almacen',name:'Almacén El Encuentro',district:'centro',activity:'comercio'},
  {id:'panaderia',name:'Panadería',district:'centro',activity:'comercio'},
  {id:'ferreteria',name:'Ferretería Rural',district:'centro',activity:'herramientas'},
  {id:'escuela',name:'Escuela',district:'servicios',activity:'educacion'},
  {id:'radio',name:'Radio Oasis',district:'servicios',activity:'comunicacion'},
  {id:'galpon',name:'Galpón',district:'rural',activity:'trabajo'},
  {id:'chacras',name:'Chacras',district:'rural',activity:'trabajo'},
  {id:'ribera',name:'Ribera',district:'ribera',activity:'exploracion'}
 ],
 commerces:[
  {id:'almacen',name:'Almacén El Encuentro',category:'comercio',products:[['pan',120],['yerba',900],['azucar',700],['comestibles',600]]},
  {id:'ferreteria',name:'Ferretería Rural',category:'herramientas',products:[['pala',4500],['azada',3800],['tijera de podar',5200],['llave inglesa',6500]]},
  {id:'panaderia',name:'Panadería',category:'alimentos',products:[['pan',120],['tortas fritas',350],['facturas',500]]}
 ],
 ruralActivities:['cosecha','riego','poda','reparación de herramientas','cuidado de animales','carga de cajones'],
 dailyLife:['tomar mate','comprar pan','ir al almacén','caminar por la plaza','escuchar la radio','visitar vecinos','hacer compras','descansar','volver a casa'],
 vehicles:['auto','camioneta','tractor','camión','bicicleta'],
 animals:['vaca','caballo','gallina','perro'],
 tools:['pala','azada','tijera de podar','cajón de cosecha','llave inglesa'],
 educationalRule:'Los hechos históricos reales deben tener fuente verificable. Las historias ficticias deben identificarse como ficción.'
};
