// KALJA! – Päivä 1 (testiversio). Kaikki säädettävät arvot CONFIGissa (GDD v0.2).
const CONFIG = {
  roundSeconds: 180, gameMinPerSec: 2, startHour: 20,
  promille: { start: 0.3, goldMin: 0.8, goldMax: 1.6, warn: 1.8, vomitBase: 2.0, passWarn: 2.5, passOut: 2.8, max: 3.0,
              recBase: 0.010, recPerPromille: 0.0125 },
  bladder: { start: 10, passive: 0.2, passiveRush: 0.25, warn: 75, crit: 90, toiletSec: 5, toiletPromille: -0.10, toiletStomach: -10 },
  thirst: { start: 60, regen: 0.3, lowLimit: 15, dryComboPenalty: 2 },
  stomach: { start: 0, drain: 0.4, vomitStart: 60, vomitPerPoint: 0.01 },
  vomit: { animSec: 4, drinksLost: 2, promille: -0.40, points: -200, allowed: 1 },
  orderSec: 0.5,
  drinks: {
    kalja:   { name:'Kalja',   icon:'🍺', sips:5, sipSec:0.5, prom:0.20, absorb:10, bladder:12, thirst:-10, stomach:8, points:100 },
    whisky:  { name:'Whisky',  icon:'🥃', sips:4, sipSec:0.8, prom:0.35, absorb:15, bladder:4,  thirst:-15, stomach:3, points:150 },
    shotti:  { name:'Shotti',  icon:'🧪', sips:1, sipSec:0.5, prom:0.30, absorb:2, fade:0.15, fadeSec:15, bladder:3, thirst:-4, stomach:2, points:60 },
    drinkki: { name:'Drinkki', icon:'🍹', sips:3, sipSec:0.6, prom:0.22, absorb:8,  bladder:8,  thirst:-3,  stomach:6, points:120, womanBonus:5 },
    vesi:    { name:'Vesi',    icon:'💧', sips:3, sipSec:0.5, prom:-0.10, absorb:10, bladder:10, thirst:20, stomach:5, points:0, water:true },
    tuplashotti: { name:'Tuplashotti', icon:'🧪🧪', sips:1, sipSec:0.6, prom:0.40, absorb:2, bladder:5, thirst:-6, stomach:3, points:120 },
  },
  snacks: {
    pahkinat: { name:'Pähkinät', icon:'🥜', eatSec:1.5, thirstPerSec:2, thirstSec:15, thirstNow:0, stomach:8, prom:-0.02, cost:150 },
    sipsit:   { name:'Sipsit',   icon:'🥔', eatSec:2.0, thirstNow:40, stomach:15, prom:-0.03, cost:200, saltSec:10, saltMult:1.5, womanPenalty:3 },
  },
  bowl: { portions: 3, refillSec: 30, refillSecLate: 40 },
  overeat: { count: 3, windowSec: 20, extraStomach: 10 },
  woman: { arriveZoneSec: 20, arriveHour: 21, startInterest: 30, chatSec: 12, offerSec: 5, upInZone: 1, downOutZone: 2,
           acceptBonus: 15, refusePenalty: 10, refusePromille: -0.10, toiletPenalty: 5, cooldownSec: 30, offersNeeded: 5,
           snackOfferEvery: 30, snackOfferMinInterest: 50, snackAcceptBonus: 5,
           offerDrinks: ['kalja','drinkki','shotti','whisky','tuplashotti'], favoriteBonus: 5 },
  combo: { windowSec: 10, windowLate: 8, zoneBonus: 0.5, tiers: [[8,3],[5,2],[3,1.5],[0,1]] },
  skool: { windowSec: 1, points: 50, speedup: 0.3 },
  score: { zonePerSec: 10, womanBonus: 1500, timeBonusPerGameMin: 5, failMult: 0.7, stars: [1500, 3500, 6000] },
  phases: { rushAt: 60, lateAt: 120, lastRoundAt: 150, lastRoundSec: 20, lastRoundShotMult: 2, warnAt: 175 },
  hints: { showSec: 2.5, sameCooldown: 15, minGap: 4 },
  safety: { bladderGraceSec: 2, wakeUpPromille: -0.1 },
};

const $ = id => document.getElementById(id);
let S, last, raf;

function newState(){
  const C = CONFIG;
  return { t:0, over:false, p:C.promille.start, bladder:C.bladder.start, thirst:C.thirst.start, stomach:C.stomach.start,
    absorb:[], score:0, combo:0, comboEnd:null, maxCombo:0, glass:null, busy:0, busyLabel:'', away:0, awayKind:'',
    ordering:0, pendingDrink:null, bowl:C.bowl.portions, bowlTimer:0, bowlItems:[], snackRegen:[], saltUntil:-1,
    snackTimes:[], vomits:0, toilets:0, zoneTime:0, everZone:false, stats:{kalja:0,whisky:0,shotti:0,drinkki:0,vesi:0,tuplashotti:0},
    drinksCount:0, skoolUntil:-1, skoolFast:false, graceUsed:false, graceUntil:-1, wakeUsed:false,
    w:{ state:'POISSA', zoneAcc:0, interest:0, timer:0, offers:0, snackTimer:0, offerKind:null, hintShown3:false, result:'ei tavattu' },
    hintLast:{}, hintAt:-99, hintUntil:0, whiskyTimes:[], wasInZone:false, idleZone:0, firstWarn:{} };
}

// ---------- helpers ----------
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function gameClock(t){ const m=CONFIG.startHour*60+Math.floor(t*CONFIG.gameMinPerSec); const h=Math.floor(m/60)%24, mm=m%60; return String(h).padStart(2,'0')+':'+String(mm).padStart(2,'0'); }
function inZone(){ return S.p>=CONFIG.promille.goldMin && S.p<=CONFIG.promille.goldMax; }
function vomitLimit(){ const st=CONFIG.stomach; return S.stomach>st.vomitStart ? CONFIG.promille.vomitBase-(S.stomach-st.vomitStart)*st.vomitPerPoint : CONFIG.promille.vomitBase; }
function comboWindow(){ let w = S.t>=CONFIG.phases.lateAt?CONFIG.combo.windowLate:CONFIG.combo.windowSec; if(S.thirst<=0) w-=CONFIG.thirst.dryComboPenalty; return w; }
function comboMult(n){ for(const [min,m] of CONFIG.combo.tiers) if(n>=min) return m; return 1; }
function womanPresent(){ return ['JUTTELU','TARJOUS','SAAPUU'].includes(S.w.state); }
function absorb(amount, secs){ if(secs<=0){ S.p+=amount; return; } S.absorb.push({rate:amount/secs, left:secs}); }

// ---------- hints ----------
function hint(id, text, prio=1){
  const H=CONFIG.hints;
  if(S.hintLast[id]!==undefined && S.t-S.hintLast[id]<H.sameCooldown) return;
  const showing = S.t < S.hintUntil;
  if(showing && prio<=S.hintPrio) return;
  if(!showing && S.t-S.hintAt<H.minGap && prio<3) return;
  S.hintLast[id]=S.t; S.hintAt=S.t; S.hintUntil=S.t+H.showSec; S.hintPrio=prio;
  const b=$('bubble'); b.textContent=text; b.classList.add('show');
}

// ---------- actions ----------
function canAct(){ return !S.over && S.away<=0 && S.busy<=0; }
function order(kind, fromWoman){
  if(S.over || S.away>0) return;
  if(!fromWoman && (S.glass || S.ordering>0)) return;
  if(kind==='drinkki' && womanPresent() && !fromWoman){ S.w.interest+=CONFIG.drinks.drinkki.womanBonus; hint(27,'Drinkki! Hän tykkää miehestä, jolla on makua.'); }
  if(fromWoman){ S.glass={kind, sipsLeft:CONFIG.drinks[kind].sips, fromWoman:true}; return; }
  S.ordering=CONFIG.orderSec; S.pendingDrink=kind;
}
function sip(){
  if(!S.glass || !canAct()) return;
  const d=CONFIG.drinks[S.glass.kind];
  let dur=d.sipSec*(S.thirst<CONFIG.thirst.lowLimit?2:1)*(S.skoolFast?1-CONFIG.skool.speedup:1);
  S.busy=dur; S.busyLabel='sip';
}
function finishSip(){
  const g=S.glass; if(!g) return;
  g.sipsLeft--; if(g.sipsLeft>0) return;
  S.glass=null; S.skoolFast=false;
  const C=CONFIG, d=C.drinks[g.kind];
  const eff = S.thirst<C.thirst.lowLimit?0.5:1;
  absorb(d.prom*eff, d.absorb);
  if(d.fade) S.absorb.push({rate:-d.fade/d.fadeSec, left:d.fadeSec, delay:d.absorb});
  S.bladder+=d.bladder;
  S.thirst+= d.thirst<0 && S.t<S.saltUntil ? d.thirst*C.snacks.sipsit.saltMult : d.thirst;
  S.stomach+=d.stomach;
  S.stats[g.kind]++;
  if(d.water) return;
  // combo
  if(S.comboEnd!==null && S.t-S.comboEnd<=comboWindow()+ (d.sips*d.sipSec*2)) S.combo++; else S.combo=1;
  S.comboEnd=S.t; S.maxCombo=Math.max(S.maxCombo,S.combo);
  let mult=comboMult(S.combo)+(inZone()?C.combo.zoneBonus:0);
  let pts=d.points; const P=C.phases;
  if((g.kind==='shotti'||g.kind==='tuplashotti') && S.t>=P.lastRoundAt && S.t<P.lastRoundAt+P.lastRoundSec) pts*=P.lastRoundShotMult;
  S.score+=Math.round(pts*mult); S.drinksCount++;
  if(S.combo===5) hint(10,'Rytmi on hallussa! Baarimikko nyökkää hyväksyvästi.');
  if(g.kind==='whisky'){ S.whiskyTimes=S.whiskyTimes.filter(x=>S.t-x<20); S.whiskyTimes.push(S.t); if(S.whiskyTimes.length>=2) hint(29,'Hidasta, cowboy. Whisky ei oo kaljaa.'); S.checkWhiskyThirst=S.t+0.1; }
  if(g.kind==='kalja'){ S.skoolUntil=S.t+C.skool.windowSec; $('skool').style.display='block'; }
  if(g.fromWoman){ S.w.offers++; S.w.interest+=C.woman.acceptBonus; if(g.kind==='drinkki') S.w.interest+=C.woman.favoriteBonus;
    hint(8,'Hän nauroi sun vitsille!');
    if(S.w.offers===4) hint(20,'Vielä yks ja te lähdette yhdessä!',2);
    if(S.w.offers>=C.woman.offersNeeded){ end('nainen'); return; }
  }
}
function doSkool(){
  if(S.over||S.t>S.skoolUntil) return;
  S.skoolUntil=-1; $('skool').style.display='none';
  S.score+=CONFIG.skool.points; S.skoolFast=true; S.skools=(S.skools||0)+1;
  hint(25,'SKOOOL! Koko baari hurraa!',2);
}
function eat(kind, free){
  if(!canAct()) return;
  const C=CONFIG, s=C.snacks[kind];
  if(!free){ if(S.score<s.cost){ hint('poor','Ei oo pisteitä snackeihin. Juo ensin!'); return;} S.score-=s.cost; S.snackSpent=(S.snackSpent||0)+s.cost; }
  S.busy=s.eatSec; S.busyLabel='eat';
  S.stomach+=s.stomach; S.p+=s.prom; S.thirst+=s.thirstNow;
  if(s.thirstPerSec) S.snackRegen.push({rate:s.thirstPerSec,left:s.thirstSec});
  if(kind==='sipsit'){ S.saltUntil=S.t+s.saltSec; if(womanPresent()){ S.w.interest-=s.womanPenalty; hint(14,'Vähän vähemmän rouskutusta, hän katsoo...'); } }
  S.snackTimes=S.snackTimes.filter(x=>S.t-x<C.overeat.windowSec); S.snackTimes.push(S.t);
  if(S.snackTimes.length>=C.overeat.count){ S.stomach+=C.overeat.extraStomach; S.snackTimes=[]; hint(13,'Tulitko syömään vai juomaan?'); }
}
function eatBowl(){ if(S.bowl<=0||!canAct()) return; const k=S.bowlItems.pop(); S.bowl--; eat(k,true); }
function fillBowl(){ S.bowl=CONFIG.bowl.portions; S.bowlItems=Array.from({length:S.bowl},()=>Math.random()<.5?'pahkinat':'sipsit'); }
function toilet(){
  if(!canAct()) return;
  const B=CONFIG.bladder; S.away=B.toiletSec; S.awayKind='wc'; S.toilets++;
  if(S.combo>=3) hint(11,'Äh, rytmi meni. Uusi tuoppi alle!');
  S.combo=0; S.comboEnd=null;
  if(womanPresent()){ S.w.interest-=CONFIG.woman.toiletPenalty; hint('wcw','Älä oo kauaa!'); }
}
function vomit(){
  const V=CONFIG.vomit; S.vomits++;
  if(S.vomits>V.allowed){ end('oksennus'); return; }
  S.away=V.animSec; S.awayKind='vomit';
  S.drinksCount=Math.max(0,S.drinksCount-V.drinksLost); S.combo=0; S.comboEnd=null; S.p+=V.promille; S.stomach=0; S.score+=V.points; S.glass=null; S.absorb=S.absorb.filter(a=>a.rate<0);
  if(womanPresent()) womanLeave();
  hint(21,'No... ainakin nyt on tilaa uudelle.',3);
  S.pendingHint22=S.t+CONFIG.hints.showSec+0.1;
  $('sbar').classList.add('redborder');
}
function womanLeave(){ S.w.state='LAHTEE'; S.w.timer=CONFIG.woman.cooldownSec; S.w.interest=0; S.w.offers=0; S.w.zoneAcc=0; S.w.result='lähti yksin'; $('offer').style.display='none'; }
function answerOffer(yes){
  if(S.w.state!=='TARJOUS') return;
  $('offer').style.display='none';
  const W=CONFIG.woman;
  if(yes){ if(S.glass) S.glass=null; S.ordering=0; order(W.offerDrinks[S.w.offers],true); S.w.state='JUTTELU'; S.w.timer=W.chatSec; }
  else { S.w.interest-=W.refusePenalty; S.p+=W.refusePromille; S.w.state='JUTTELU'; S.w.timer=W.chatSec; if(S.w.interest<=0) womanLeave(); }
}

// ---------- update ----------
function update(dt){
  const C=CONFIG; S.t+=dt; const P=C.promille;
  // timers
  if(S.ordering>0){ S.ordering-=dt; if(S.ordering<=0){ S.glass={kind:S.pendingDrink,sipsLeft:C.drinks[S.pendingDrink].sips}; } }
  if(S.busy>0){ S.busy-=dt; if(S.busy<=0 && S.busyLabel==='sip') finishSip(); if(S.over) return; }
  if(S.away>0){ S.away-=dt; if(S.away<=0 && S.awayKind==='wc'){ S.bladder=0; S.p+=C.bladder.toiletPromille; S.stomach+=C.bladder.toiletStomach; } }
  if(S.t>S.skoolUntil) $('skool').style.display='none';
  // promille
  for(const a of S.absorb){ if(a.delay>0){a.delay-=dt;continue;} const s=Math.min(dt,a.left); S.p+=a.rate*s; a.left-=s; }
  S.absorb=S.absorb.filter(a=>a.left>0);
  S.p-=(P.recBase+P.recPerPromille*S.p)*dt; S.p=clamp(S.p,0,P.max);
  // bladder/thirst/stomach
  S.bladder+=(S.t>=C.phases.rushAt?C.bladder.passiveRush:C.bladder.passive)*dt;
  S.thirst+=C.thirst.regen*dt; for(const r of S.snackRegen){ const s=Math.min(dt,r.left); S.thirst+=r.rate*s; r.left-=s; } S.snackRegen=S.snackRegen.filter(r=>r.left>0);
  S.thirst=clamp(S.thirst,0,100); S.stomach=clamp(S.stomach-C.stomach.drain*dt,0,100);
  // bowl
  if(S.bowl<=0){ S.bowlTimer+=dt; const need=S.t>=C.phases.rushAt?C.bowl.refillSecLate:C.bowl.refillSec; if(S.bowlTimer>=need){ S.bowlTimer=0; fillBowl(); hint(15,'Kulho täynnä! Ilmaista suolaista!'); } }
  // zone
  const z=inZone();
  if(z){ S.zoneTime+=dt; S.score+=C.score.zonePerSec*dt; if(!S.everZone){S.everZone=true; hint(2,'Nyt sä oot tähti! Jatka samaa tahtia.');} }
  if(S.wasInZone && !z && S.p<P.goldMin && womanPresent()) hint(19,'Sä alat olla tylsä. Shotti piristäis!');
  S.wasInZone=z;
  // combo expire
  if(S.comboEnd!==null && !S.glass && S.busy<=0 && S.t-S.comboEnd>comboWindow()){ if(S.combo>=3) hint(11,'Äh, rytmi meni. Uusi tuoppi alle!'); S.combo=0; S.comboEnd=null; }
  if(z && !S.glass && S.ordering<=0 && S.comboEnd!==null && S.t-S.comboEnd>8) hint(23,'Tuoppi on tyhjä, kombo karkaa!');
  // safety & fails
  if(S.p>=P.passWarn && !S.wakeUsed){ S.wakeUsed=true; S.p+=C.safety.wakeUpPromille; hint('wake','*Säpsähdät hereille* Huh! Nyt vettä!',3); }
  if(S.p>=P.passOut){ end('sammui'); return; }
  if(S.stomach>=100 || S.p>=vomitLimit()){ if(S.away<=0 || S.awayKind!=='vomit') { vomit(); if(S.over) return; } }
  if(S.bladder>=100){
    if(S.awayKind==='wc' && S.away>0){ S.bladder=99.9; }
    else if(!S.graceUsed){ S.graceUsed=true; S.graceUntil=S.t+C.safety.bladderGraceSec; S.bladder=99.9; hint('grace','VIIMEINEN MAHDOLLISUUS! VESSAAN!',3); }
    else if(S.t>S.graceUntil){ end('housut'); return; }
    else S.bladder=99.9;
  }
  // woman
  updateWoman(dt, z);
  // hints (day 1: early warnings 10% before limits)
  const early = k => S.firstWarn[k] ? 1 : 0.9;
  if(S.p>=P.passWarn*early('pw')){ S.firstWarn.pw=1; hint(4,'Silmät painuu. Viimeinen shotti voi olla viimeinen ikinä.',3); }
  if(S.bladder>=C.bladder.crit) hint(6,'EI. ENÄÄ. YHTÄÄN. Vessa. NYT.',3);
  else if(S.bladder>=C.bladder.warn*early('bl')){ S.firstWarn.bl=1; hint(5,'Jalat ristissä, nyt vessaan tai housut kastuu!',3); }
  if(S.p>=P.warn*early('w')){ S.firstWarn.w=1; hint(3,'Huone pyörii... ehkä vähän vettä?',2); }
  if(S.vomits>=1 && S.p>=1.9 && S.stomach>=60) hint(28,'Muista: vain amatöörit oksentaa. Älä oo amatööri.',2);
  if(S.stomach>=80) hint(12,'Vatsa on kuin vesisänky. Varo nyt.',2);
  if(S.pendingHint22 && S.t>=S.pendingHint22){ S.pendingHint22=0; hint(22,'Se oli sun ainoo jokeri. Seuraava oksennus ja ilta on ohi.',3); }
  if(S.checkWhiskyThirst && S.t>=S.checkWhiskyThirst){ S.checkWhiskyThirst=0; if(S.thirst<30) hint(26,'Whisky poltti kurkun. Vettä tai pähkinää, äkkiä!',2); }
  if(S.thirst<C.thirst.lowLimit/early('th')){ S.firstWarn.th=1; hint(7,'Kalja ei maistu, kurkku kuin hiekkapaperia. Sipsiä!'); }
  if(S.p<0.5 && S.t>10) hint(1,'Oot ihan kuiva, kukaan ei naura sun jutuille. Tilaa jotain!');
  if(S.t>=120 && !S.h24){ S.h24=1; hint(24,'Keskiyö! Nyt alkaa ilta kunnolla.',2); }
  if(S.t>=C.phases.lastRoundAt && !S.hLR){ S.hLR=1; hint('lr','VIIMEINEN KIERROS! Shotit tuplapisteillä!',2); }
  if(S.t>=C.phases.warnAt && !S.h9){ S.h9=1; hint(9,'Kymmenen minuuttia valomerkkiin!',2); }
  if(S.t>=C.roundSeconds){ end('valomerkki'); return; }
  if(S.t>=S.hintUntil) $('bubble').classList.remove('show');
}
function updateWoman(dt, z){
  const W=CONFIG.woman, w=S.w;
  if(w.state==='POISSA'){ if(z) w.zoneAcc+=dt; const hour=CONFIG.startHour+S.t*CONFIG.gameMinPerSec/60;
    if(w.zoneAcc>=W.arriveZoneSec && hour>=W.arriveHour){ w.state='SAAPUU'; w.timer=2; w.interest=W.startInterest; w.result='jutteli'; hint(16,'Katso, kuka tuli! Älä mokaa.',2);} return; }
  if(w.state==='LAHTEE'){ w.timer-=dt; if(w.timer<=0){ w.state='POISSA'; } return; }
  if(w.state==='SAAPUU'){ w.timer-=dt; if(w.timer<=0){ w.state='JUTTELU'; w.timer=W.chatSec; w.snackTimer=W.snackOfferEvery; } return; }
  if(S.away>0 && S.awayKind==='wc') return; // ajastimet pysähtyy vessassa
  if(w.state==='JUTTELU'){
    w.interest+=(z?W.upInZone:-W.downOutZone)*dt;
    w.timer-=dt; w.snackTimer-=dt;
    if(w.snackTimer<=0 && z && w.interest>=W.snackOfferMinInterest && canAct()){ w.snackTimer=W.snackOfferEvery; eat('pahkinat',true); w.interest+=W.snackAcceptBonus; hint('ws','Hän ojentaa pähkinöitä omasta kulhostaan 😏'); }
    if(w.interest<20) hint(18,'Hän vilkuilee ovelle. Sano jotain hauskaa!');
    if(w.interest<=0){ womanLeave(); hint('left','Ja sinne meni... Ehkä hän palaa.'); return; }
    if(w.timer<=0){ w.state='TARJOUS'; w.timer=W.offerSec; w.offerKind=W.offerDrinks[w.offers];
      $('offertxt').textContent='Otetaanko yhdet? '+CONFIG.drinks[w.offerKind].icon+' '+CONFIG.drinks[w.offerKind].name+' ('+(w.offers+1)+'/'+W.offersNeeded+')';
      $('offer').style.display='block'; }
  } else if(w.state==='TARJOUS'){
    w.timer-=dt; if(W.offerSec-w.timer>=3) hint(17,'No otatko vai et? Hän odottaa!');
    if(w.timer<=0) answerOffer(false);
  }
  w.interest=clamp(w.interest,0,100);
}

// ---------- end ----------
function end(reason){
  if(S.over) return; S.over=true; const C=CONFIG.score;
  let score=S.score, timeBonus=0, wb=0;
  if(reason==='nainen'){ wb=C.womanBonus; timeBonus=Math.round(C.timeBonusPerGameMin*Math.max(0,CONFIG.roundSeconds-S.t)*CONFIG.gameMinPerSec); score+=wb+timeBonus; S.w.result='lähti kanssasi! ❤️'; }
  const fail=['sammui','housut','oksennus'].includes(reason); if(fail) score*=C.failMult;
  score=Math.max(0,Math.round(score));
  let stars=C.stars.filter(s=>score>=s).length; if(fail) stars=Math.min(stars,1);
  const titles={valomerkki:['💡 VALOMERKKI','Baarimikko sytyttää valot. Kotiin päin!'],nainen:['❤️ YÖSEURAA','Te lähditte yhdessä. Illan tähti!'],
    sammui:['😴 SAMMUIT','Heräät tiskiltä naama pähkinäkulhossa.'],housut:['💦 HOUSUT MÄRKÄNÄ','Koko baari osoittaa sormella.'],oksennus:['🤮 TOINEN OKSENNUS','Portsari saattaa ulos. Ilta ohi.']};
  const st=S.stats, row=(a,b)=>`<tr><td>${a}</td><td><b>${b}</b></td></tr>`;
  $('panel').innerHTML=`<h1>${titles[reason][0]}</h1><p>${titles[reason][1]}</p><div class="stars">${'★'.repeat(stars)}${'☆'.repeat(3-stars)}</div><h2>${score} p</h2><table>
  ${row('Kello',gameClock(S.t))}${row('🍺 Kaljat',st.kalja)}${row('🥃 Whiskyt',st.whisky)}${row('🧪 Shotit',st.shotti+st.tuplashotti)}${row('🍹 Drinkit',st.drinkki)}${row('💧 Vedet',st.vesi)}
  ${row('Pisin kombo',S.maxCombo)}${row('Aika kultaisella alueella',Math.round(S.zoneTime)+' s')}${row('Vessakäynnit',S.toilets)}${row('Oksennukset',S.vomits)}${row('SKOOL!',S.skools||0)}
  ${row('Nainen',S.w.result)}${wb?row('Naisbonus',wb)+row('Aikabonus',timeBonus):''}${fail?row('Rangaistus','×0,7'):''}</table><button id="again">Vielä yksi ilta! 🍺</button>`;
  $('overlay').style.display='flex'; $('again').onclick=start;
}

// ---------- render ----------
function render(){
  const P=CONFIG.promille, pct=v=>(v/P.max*100)+'%';
  $('clock').textContent=gameClock(S.t); $('score').textContent=Math.round(S.score)+' p';
  const m=S.combo?comboMult(S.combo)+(inZone()?CONFIG.combo.zoneBonus:0):1;
  $('combo').textContent=`KOMBO ${S.combo} ×${m}`; $('combo').className=S.combo>=5?'gold':'';
  $('pval').textContent=S.p.toFixed(2)+'‰'; $('pfill').style.width=pct(S.p);
  $('gold').style.left=pct(P.goldMin); $('gold').style.width=(((P.goldMax-P.goldMin)/P.max)*100)+'%';
  $('mwarn').style.left=pct(vomitLimit()); $('mpass').style.left=pct(P.passOut);
  $('pbar').className='bar'+(S.p>=P.warn?' blink':'');
  $('pfill').style.background=S.p>=P.passWarn?'#f33':S.p>=P.warn?'#ff0':inZone()?'#fff':'#6cf';
  $('bfill').style.width=S.bladder+'%'; $('bbar').className='bar'+(S.bladder>=90?' blinkfast':S.bladder>=75?' blink':'');
  $('tfill').style.width=S.thirst+'%'; $('tbar').className='bar'+(S.thirst<CONFIG.thirst.lowLimit?' blink':'');
  $('sfill').style.width=S.stomach+'%'; $('sbar').classList.toggle('blink',S.stomach>=80);
  const wp=womanPresent(); $('hmeter').style.visibility=wp?'visible':'hidden';
  $('hfill').style.width=S.w.interest+'%'; $('offers').textContent=wp?`${S.w.offers}/${CONFIG.woman.offersNeeded}`:'';
  $('woman').textContent=wp?(S.w.interest>=60?'😍':S.w.interest<20?'🙄':'💃'):'';
  // face
  let f='😐'; if(S.p>=P.passWarn) f='😵'; else if(S.bladder>=75) f='😖'; else if(S.p>=P.warn) f='🤢'; else if(S.thirst<15) f='😫'; else if(inZone()) f=S.combo>=5?'😎':'😄'; else if(S.p<P.goldMin) f='😑';
  $('player').textContent=f;
  const g=$('glass');
  if(S.glass){ const d=CONFIG.drinks[S.glass.kind]; g.className='has'; g.innerHTML=d.icon+`<small>${'●'.repeat(S.glass.sipsLeft)} napauta</small>`; }
  else if(S.ordering>0){ g.className=''; g.textContent='⏳'; } else { g.className=''; g.textContent=''; }
  $('bowl').className=S.bowl>0?'':'empty'; $('bowlc').textContent=S.bowl;
  const aw=$('away'); if(S.away>0){ aw.style.display='flex'; aw.textContent=(S.awayKind==='wc'?'🚻 Vessassa... ':'🤮 Bläääh... ')+Math.ceil(S.away)+' s'; } else aw.style.display='none';
  document.querySelectorAll('#buttons button').forEach(b=>b.disabled=S.away>0||(b.dataset.d&&(!!S.glass||S.ordering>0)));
  // drunk effects
  const sc=$('scene'); let rot=0; if(S.p>=1.6){ const amp=S.p>=2.2?5:2; rot=Math.sin(S.t*1.7)*amp; }
  sc.style.transform=`rotate(${rot}deg)`; $('chars').classList.toggle('ghost',S.p>=1.9);
}

function loop(ts){ const dt=Math.min(0.1,(ts-(last||ts))/1000); last=ts; if(!S.over){ update(dt); if(!S.over) render(); } raf=requestAnimationFrame(loop); }

// ---------- input ----------
function tap(el, fn){ el.addEventListener('pointerdown', e=>{ e.preventDefault();
  if(S && S.p>=2.2 && el.id==='glass'){ /* ±15 px ohi, lasin osuma-alue +20% => käytännössä osuu yleensä */ if(Math.random()<0.15) return; }
  fn(e); }); }
document.querySelectorAll('#buttons button').forEach(b=>tap(b,()=>{ if(b.dataset.d) order(b.dataset.d); else eat(b.dataset.s,false); }));
tap($('glass'),sip); tap($('bowl'),eatBowl); tap($('wc'),toilet); tap($('skool'),doSkool);
tap($('yes'),()=>answerOffer(true)); tap($('no'),()=>answerOffer(false));
let lastShake=0;
window.addEventListener('devicemotion',e=>{ const a=e.accelerationIncludingGravity; if(!a||!S) return; const mag=Math.hypot(a.x||0,a.y||0,a.z||0); if(mag>22 && performance.now()-lastShake>500){ lastShake=performance.now(); doSkool(); } });

function start(){
  if(typeof DeviceMotionEvent!=='undefined' && DeviceMotionEvent.requestPermission) DeviceMotionEvent.requestPermission().catch(()=>{});
  S=newState(); fillBowl(); last=null; $('overlay').style.display='none'; $('sbar').classList.remove('redborder'); $('offer').style.display='none';
  hint('start','Perjantai! Pidä promillet kultaisella alueella. Yks oksennus sallitaan.',3);
}
function intro(){
  S=newState(); fillBowl(); render(); S.over=true;
  $('panel').innerHTML=`<h1>🍺 KALJA!</h1><h3>Päivä 1 – Perjantai-ilta</h3><p style="text-align:left;font-size:14px">
  • Tilaa juoma alhaalta, napauta lasia = hörppy.<br>• Pidä <b style="color:#ffb300">promillet kultaisella alueella</b> (0,8–1,6‰): olet hauska ja saat pisteitä.<br>
  • Kalja kusettaa, whisky kuivattaa, shotti nousee ja laskee nopeasti, drinkistä nainen tykkää.<br>• 🚻 ennen kuin housut kastuu. Snackit (🥣 kulho ilmainen) pitävät janon yllä.<br>
  • Juo naisen 5 tarjousta → lähdette yhdessä!<br>• Kaljan jälkeen SKOOL! (nappi tai ravista).<br>• Yksi oksennus sallitaan. Valomerkki klo 02.</p><button id="go">ALOITA ILTA</button>`;
  $('go').onclick=start; requestAnimationFrame(loop);
}
intro();
