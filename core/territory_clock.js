/* Villa Pelón — TERRITORY CLOCK v1.0
   Fuente única de fecha, estación, fase solar y horarios del territorio.
   Calendario ficticio jugable: Día 1 = 1 de enero. 365 días por año.
   Las estaciones siguen el hemisferio sur.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const clock=V.territoryClock={version:'1.0.0',year:1,day:1,minute:480,dayOfYear:1,season:'verano',seasonIndex:0,seasonDay:1,phase:'morning',sunrise:5.9,sunset:20.7,dayLength:14.8};
const seasons=[
 {id:'verano',label:'VERANO',index:0,start:1,end:79,baseTemp:25,sunrise:5.8,sunset:20.8},
 {id:'otoño',label:'OTOÑO',index:1,start:80,end:171,baseTemp:17,sunrise:7.0,sunset:19.2},
 {id:'invierno',label:'INVIERNO',index:2,start:172,end:263,baseTemp:9,sunrise:8.1,sunset:18.0},
 {id:'primavera',label:'PRIMAVERA',index:3,start:264,end:354,baseTemp:17,sunrise:7.1,sunset:19.3},
 {id:'verano',label:'VERANO',index:0,start:355,end:365,baseTemp:25,sunrise:5.8,sunset:20.8}
];
function seasonFor(d){return seasons.find(s=>d>=s.start&&d<=s.end)||seasons[0]}
function phaseFor(h,s){
 const dawn=s.sunrise, dusk=s.sunset;
 if(h<dawn-.75)return 'night';
 if(h<dawn+.75)return 'dawn';
 if(h<12)return 'morning';
 if(h<16)return 'noon';
 if(h<dusk-.8)return 'afternoon';
 if(h<dusk+.7)return 'dusk';
 if(h<21)return 'evening';
 return 'night';
}
function update(source){
 const d=Math.max(1,Math.floor(Number(source?.day||clock.day||1)));
 const m=Math.max(0,Number(source?.minutes??clock.minute??480));
 clock.day=d;clock.minute=m%1440;clock.dayOfYear=((d-1)%365)+1;clock.year=Math.floor((d-1)/365)+1;
 const s=seasonFor(clock.dayOfYear);clock.season=s.id;clock.seasonIndex=s.index;clock.seasonDay=clock.dayOfYear-s.start+1;clock.sunrise=s.sunrise;clock.sunset=s.sunset;clock.dayLength=s.sunset-s.sunrise;clock.hour=clock.minute/60;clock.phase=phaseFor(clock.hour,s);clock.isNight=clock.phase==='night';
 return clock;
}
clock.update=update;
clock.getSeason=()=>seasonFor(clock.dayOfYear);
clock.hour=8;clock.update({day:1,minutes:480});
clock.isOpen=(open,close)=>{const h=clock.hour;return h>=open&&h<close&&!clock.isNight};
clock.periodLabel=()=>({night:'MADRUGADA / NOCHE',dawn:'AMANECER',morning:'MAÑANA',noon:'MEDIODÍA',afternoon:'TARDE',dusk:'ATARDECER',evening:'NOCHE'}[clock.phase]||clock.phase);
clock.schedule={
 school:[8,16],shops:[9,20],radio:[10,18],chacras:[6.5,18.5],plaza:[11,22],bodega:[7,19],services:[8,17],quiet:21
};
V.territoryClock=clock;
window.dispatchEvent(new CustomEvent('villa-pelon-clock-ready',{detail:{version:clock.version}}));
})();
