// KALJA! – Päivä 1, versio 2. Kaikki säädettävät arvot ovat CONFIGissa (ks. docs/kalja_paiva1_GDD.md).
const CONFIG = {
  version: 'v2',
  roundSeconds: 180, gameMinPerSec: 2, startHour: 20,
  promille: { start: 0.8, goldMin: 0.8, goldMax: 1.6, warn: 1.8, vomitBase: 2.0, passWarn: 2.5, passOut: 2.8, max: 3.0,
              recBase: 0.010, recPerPromille: 0.0125 },
  bladder: { start: 10, passive: 0.2, passiveRush: 0.25, warn: 75, crit: 90, toiletSec: 5, toiletPromille: -0.10, toiletStomach: -10 },
  thirst: { start: 60, regen: 0.3, lowLimit: 15, dryComboPenalty: 2 },
  stomach: { start: 0, drain: 0.8, vomitStart: 60, vomitPerPoint: 0.01 },
  vomit: { animSec: 4, drinksLost: 2, promille: -0.40, points: -200, allowed: 1 },
  orderSec: 0.5,
  drinks: {
    kalja:   { name:'Kalja',   icon:'🍺', sips:5, sipSec:0.5, prom:0.25, absorb:10, bladder:12, thirst:-10, stomach:6, points:100, burpChance:0.3 },
    whisky:  { name:'Whisky',  icon:'🥃', sips:4, sipSec:0.8, prom:0.35, absorb:15, bladder:4,  thirst:-15, stomach:3, points:150 },
    shotti:  { name:'Shotti',  icon:'🧪', sips:1, sipSec:0.5, prom:0.30, absorb:2, fade:0.15, fadeSec:15, bladder:3, thirst:-4, stomach:2, points:60 },
    drinkki: { name:'Drinkki', icon:'🍹', sips:3, sipSec:0.6, prom:0.22, absorb:8,  bladder:8,  thirst:-3,  stomach:6, points:120, womanInterest:5 },
    vesi:    { name:'Vesi',    icon:'💧', sips:3, sipSec:0.5, prom:-0.10, absorb:10, bladder:10, thirst:20, stomach:5, points:0, water:true },
  },
  snacks: {
    pahkinat: { name:'Pähkinät', icon:'🥜', eatSec:1.5, thirstPerSec:2, thirstSec:15, thirstNow:0, stomach:8, prom:-0.02, cost:150 },
    sipsit:   { name:'Sipsit',   icon:'🥔', eatSec:2.0, thirstNow:40, stomach:15, prom:-0.03, cost:200, saltSec:10, saltMult:1.5, womanPenalty:3 },
  },
  bowl: { portions: 3, refillSec: 30, refillSecLate: 40 },
  overeat: { count: 3, windowSec: 20, extraStomach: 10 },
  woman: {
    arriveZoneSec: 20, arriveHour: 21, startInterest: 30, upInZone: 0.5, downOutZone: 2, cooldownSec: 30,
    firstTaskSec: 5, taskEveryMin: 8, taskEveryMax: 13,          // tehtäviä vain kultaisella alueella
    successInterest: 20, failInterest: -15, maxLevel: 5,
    perkEvery: 25,                                                // taso 3+: tarjoaa snackin tai drinkin
    names: [['Riikka','Riitta','Riina'],['Sanna','Saana','Hanna'],['Minna','Minja','Mimmi'],['Jenni','Jonna','Janni'],['Tiina','Tiia','Tinja']],
    levels: [
      { name:'Ei kiinnostunut', gesture:'' },
      { name:'Ei kiinnostunut (vielä)', gesture:'🙂', text:'Hän hymähtää. Ihan kiva alku.' },
      { name:'Numero saatu', gesture:'📱', text:'Hän kirjoittaa numeronsa sun käteen! Nähdään toistekin.', bonus:300 },
      { name:'Läheisyyttä', gesture:'🤗', text:'Hän nojaa lähemmäs ja koskettaa käsivartta. Uuh.' },
      { name:'Pusu saatu', gesture:'💋', text:'MUAH! Koko baari viheltää.', bonus:1000 },
      { name:'Pano onnistui', gesture:'🚕❤️', text:'"Lähdetäänkö meille?" Taksi odottaa!', bonus:3000 },
    ],
  },
  tasks: {
    // d = humala-aste 0..1 (kultaisen alueen ala- -> yläraja). Kaikki "lerp(helppo, vaikea)".
    vitsi:  { zoneW:[26,12], speed:[55,120], jitter:[0,8], timeout:6 },
    skoolaus:{ ringStart:200, target:70, dur:[1.7,1.1], tol:[18,9], jitter:[0,14] },
    tikka:  { amp:[35,85], speed:[1.2,2.2], hitR:32, timeout:7 },
    tanssi: { beatMs:[620,480], tolMs:[150,90], need:3, visualJitterMs:[0,70] },
    nimi:   { timeout:6, blurPx:[0,3], similarFrom:0.5 },
  },
  combo: { windowSec: 10, windowLate: 8, zoneBonus: 0.5, tiers: [[8,3],[5,2],[3,1.5],[0,1]] },
  skool: { windowSec: 2.5, points: 50, speedup: 0.3 },
  shake: { threshold: 13, cooldownMs: 600 },                       // m/s² ilman painovoimaa
  score: { promPerSec: 40, promExp: 2, levelMult: [1.0, 1.0, 1.2, 1.5, 2.0, 3.0], timeBonusPerGameMin: 5,
           failMult: 0.7, stars: [5000, 12000, 25000] },
  phases: { rushAt: 60, lateAt: 120, lastRoundAt: 150, lastRoundSec: 20, lastRoundShotMult: 2, warnAt: 175 },
  hints: { showSec: 2.5, sameCooldown: 15, minGap: 4 },
  safety: { bladderGraceSec: 2, wakeUpPromille: -0.1 },
  fx: { swayFrom: 0.6, swayDegPerPromille: 4.0, swayPxPerPromille: 14, ghostFrom: 1.3, ghostPxPerPromille: 14,
        blurFrom: 1.9, blurPxPerPromille: 2.0, tapMissFrom: 2.2, tapMissChance: 0.15 },
  audio: { master: 0.6, ambience: 0.05 },
  haptics: { drink:30, sip:10, vomit:[200,80,300], warn:[60,60,60], success:[40,40,40,40,120], fail:[300], shake:[50,30,50], bell:[100,100,100,100,300] },
};

const $ = id => document.getElementById(id);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const lerp=(r,d)=>r[0]+(r[1]-r[0])*d;
const rnd=(a,b)=>a+Math.random()*(b-a);
let S, last;

// ================= AUDIO (WebAudio-synteesi, ei tiedostoja) =================
const AU = { ctx:null, master:null, muted: localStorage.getItem('kalja_mute')==='1', amb:null };
function audioInit(){
  try{
    if(!AU.ctx){ const AC=window.AudioContext||window.webkitAudioContext; if(!AC) return; AU.ctx=new AC(); AU.master=AU.ctx.createGain(); AU.master.connect(AU.ctx.destination); }
    AU.master.gain.value=AU.muted?0:CONFIG.audio.master;
    if(AU.ctx.state==='suspended') AU.ctx.resume();
  }catch(e){}
}
function noiseBuf(sec){ const c=AU.ctx, b=c.createBuffer(1,Math.floor(c.sampleRate*sec),c.sampleRate), d=b.getChannelData(0); for(let i=0;i<d.length;i++) d[i]=Math.random()*2-1; return b; }
function tone(f, dur, {type='sine', vol=0.3, to=null, at=0, attack=0.005}={}){
  if(!AU.ctx) return; const c=AU.ctx, t=c.currentTime+at, o=c.createOscillator(), g=c.createGain();
  o.type=type; o.frequency.setValueAtTime(f,t); if(to) o.frequency.exponentialRampToValueAtTime(to,t+dur);
  g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(vol,t+attack); g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
  o.connect(g); g.connect(AU.master); o.start(t); o.stop(t+dur+0.05); return o;
}
function noise(dur, {vol=0.3, type='lowpass', f=1000, to=null, q=1, at=0}={}){
  if(!AU.ctx) return; const c=AU.ctx, t=c.currentTime+at, s=c.createBufferSource(), fl=c.createBiquadFilter(), g=c.createGain();
  s.buffer=noiseBuf(dur+0.05); fl.type=type; fl.frequency.setValueAtTime(f,t); if(to) fl.frequency.exponentialRampToValueAtTime(to,t+dur); fl.Q.value=q;
  g.gain.setValueAtTime(vol,t); g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
  s.connect(fl); fl.connect(g); g.connect(AU.master); s.start(t); s.stop(t+dur+0.05);
}
const SFX = {
  gulp(){ tone(220,0.12,{to:90,vol:0.35}); noise(0.08,{f:500,vol:0.08}); },
  pop(){ noise(0.05,{type:'highpass',f:2000,vol:0.4}); tone(700,0.08,{to:300,vol:0.25,at:0.01}); noise(0.4,{type:'bandpass',f:4000,vol:0.05,at:0.05}); },
  slam(){ tone(130,0.15,{to:50,vol:0.6}); noise(0.1,{f:900,vol:0.4}); tone(2400,0.12,{vol:0.05,type:'triangle',at:0.01}); },
  burp(){ const o=tone(95,0.45,{type:'sawtooth',to:70,vol:0.25,attack:0.03}); if(o&&AU.ctx){ const l=AU.ctx.createOscillator(), lg=AU.ctx.createGain(); l.frequency.value=28; lg.gain.value=25; l.connect(lg); lg.connect(o.frequency); l.start(); l.stop(AU.ctx.currentTime+0.5);} },
  flush(){ noise(1.4,{type:'bandpass',f:600,to:2500,q:0.7,vol:0.35}); noise(1.0,{f:300,vol:0.2,at:0.5}); },
  vomit(){ tone(220,0.9,{type:'sawtooth',to:55,vol:0.3,attack:0.05}); noise(0.9,{f:700,to:200,vol:0.35}); noise(0.4,{f:300,vol:0.3,at:0.9}); },
  giggle(){ [0,0.11,0.22,0.33,0.46].forEach((a,i)=>tone(950+((i%2)?220:0)-i*30,0.08,{vol:0.15,at:a,to:800})); },
  combo(){ [523,659,784].forEach((f,i)=>tone(f,0.12,{type:'square',vol:0.08,at:i*0.07})); },
  skool(){ [392,494,587,784].forEach(f=>tone(f,0.6,{type:'triangle',vol:0.08})); noise(0.8,{type:'bandpass',f:1500,q:0.5,vol:0.15}); },
  success(){ [523,659,784,1047].forEach((f,i)=>tone(f,0.15,{type:'triangle',vol:0.15,at:i*0.08})); },
  fail(){ tone(330,0.25,{type:'sawtooth',vol:0.12,to:250}); tone(250,0.45,{type:'sawtooth',vol:0.12,to:150,at:0.25}); },
  bell(){ [0,0.6,1.2].forEach(a=>{ tone(880,1.4,{vol:0.25,at:a}); tone(2210,0.8,{vol:0.08,at:a}); }); },
  warn(){ tone(660,0.1,{type:'square',vol:0.07}); tone(660,0.1,{type:'square',vol:0.07,at:0.15}); },
  click(){ tone(1200,0.03,{vol:0.08,type:'square'}); },
  kiss(){ noise(0.08,{type:'highpass',f:3000,vol:0.3}); tone(1500,0.1,{to:2500,vol:0.1}); },
};
function sfx(n){ try{ if(AU.ctx && !AU.muted) SFX[n](); }catch(e){} }
function ambienceStart(){
  if(!AU.ctx || AU.amb) return; const c=AU.ctx, s=c.createBufferSource(), f=c.createBiquadFilter(), g=c.createGain();
  // ruskea kohina = baarin humina
  const b=c.createBuffer(1,c.sampleRate*4,c.sampleRate), d=b.getChannelData(0); let l=0; for(let i=0;i<d.length;i++){ l=(l+0.02*(Math.random()*2-1))/1.02; d[i]=l*3.5; }
  s.buffer=b; s.loop=true; f.type='lowpass'; f.frequency.value=500; g.gain.value=CONFIG.audio.ambience; s.connect(f); f.connect(g); g.connect(AU.master); s.start(); AU.amb={s,g};
  AU.murmur=setInterval(()=>{ if(S&&!S.over&&!AU.muted&&Math.random()<0.5){ tone(rnd(140,260),rnd(0.15,0.4),{vol:0.015,type:'triangle',to:rnd(120,240)}); if(Math.random()<0.15) tone(rnd(2500,3500),0.05,{vol:0.01}); } },400);
}
function setMute(m){ AU.muted=m; localStorage.setItem('kalja_mute',m?'1':'0'); if(AU.master) AU.master.gain.value=m?0:CONFIG.audio.master; $('mute').textContent=m?'🔇':'🔊'; }

// ================= HAPTIIKKA =================
function buzz(k){ try{ const p=CONFIG.haptics[k]; if(p && navigator.vibrate) navigator.vibrate(p); }catch(e){} }

// ================= TILA =================
function newState(){
  const C = CONFIG;
  return { t:0, over:false, p:C.promille.start, bladder:C.bladder.start, thirst:C.thirst.start, stomach:C.stomach.start,
    absorb:[], base:0, drinkPts:0, promPts:0, skoolPts:0, bonusPts:0, penaltyPts:0, snackSpent:0,
    combo:0, comboEnd:null, maxCombo:0, glass:null, busy:0, busyLabel:'', away:0, awayKind:'',
    ordering:0, pendingDrink:null, bowl:C.bowl.portions, bowlTimer:0, bowlItems:[], snackRegen:[], saltUntil:-1,
    snackTimes:[], vomits:0, toilets:0, zoneTime:0, everZone:false, stats:{kalja:0,whisky:0,shotti:0,drinkki:0,vesi:0},
    drinksCount:0, skoolUntil:-1, skoolFast:false, skools:0, graceUsed:false, graceUntil:-1, wakeUsed:false, sumP:0,
    w:{ state:'POISSA', zoneAcc:0, interest:0, timer:0, level:0, met:false, name:null, nameGroup:null, taskTimer:0, perkTimer:0,
        tasksDone:0, tasksWon:0, byType:{} },
    task:null, hintLast:{}, hintAt:-99, hintUntil:0, hintPrio:0, whiskyTimes:[], wasInZone:false, firstWarn:{}, maxRot:0 };
}
function gameClock(t){ const m=CONFIG.startHour*60+Math.floor(t*CONFIG.gameMinPerSec); return String(Math.floor(m/60)%24).padStart(2,'0')+':'+String(m%60).padStart(2,'0'); }
function inZone(){ return S.p>=CONFIG.promille.goldMin && S.p<=CONFIG.promille.goldMax; }
function drunkD(){ const P=CONFIG.promille; return clamp((S.p-P.goldMin)/(P.goldMax-P.goldMin),0,1); }
function vomitLimit(){ const st=CONFIG.stomach; return S.stomach>st.vomitStart ? CONFIG.promille.vomitBase-(S.stomach-st.vomitStart)*st.vomitPerPoint : CONFIG.promille.vomitBase; }
function comboWindow(){ let w = S.t>=CONFIG.phases.lateAt?CONFIG.combo.windowLate:CONFIG.combo.windowSec; if(S.thirst<=0) w-=CONFIG.thirst.dryComboPenalty; return w; }
function comboMult(n){ for(const [min,m] of CONFIG.combo.tiers) if(n>=min) return m; return 1; }
function womanPresent(){ return S.w.state==='PAIKALLA'; }
function levelMult(){ return CONFIG.score.levelMult[S.w.level]; }
function absorb(amount, secs, delay=0){ if(secs<=0){ S.p+=amount; return; } S.absorb.push({rate:amount/secs, left:secs, delay}); }
function recalcBase(){ S.base=S.drinkPts+S.promPts+S.skoolPts+S.bonusPts-S.penaltyPts-S.snackSpent; }

// ================= VIHJEET =================
function hint(id, text, prio=1, who='make'){
  const H=CONFIG.hints;
  if(S.hintLast[id]!==undefined && S.t-S.hintLast[id]<H.sameCooldown) return;
  const showing = S.t < S.hintUntil;
  if(showing && prio<=S.hintPrio) return;
  if(!showing && S.t-S.hintAt<H.minGap && prio<3) return;
  S.hintLast[id]=S.t; S.hintAt=S.t; S.hintUntil=S.t+H.showSec+(prio>=3?0.5:0); S.hintPrio=prio;
  const b=$('bubble'); b.textContent=text; b.className='show'+(who==='woman'?' woman':'');
  if(prio>=3 && who==='make'){ buzz('warn'); }
}
function flash(color){ const f=$('flash'); f.style.background=color; f.style.opacity=0.45; setTimeout(()=>f.style.opacity=0,180); }

// ================= TOIMINNOT =================
function canAct(){ return !S.over && S.away<=0 && S.busy<=0 && !S.task; }
function order(kind, free){
  if(S.over || S.away>0 || S.task) return;
  if(S.glass || S.ordering>0) return;
  if(kind==='drinkki' && womanPresent()){ S.w.interest+=CONFIG.drinks.drinkki.womanInterest; hint(27,'Drinkki! Hän tykkää miehestä, jolla on makua.'); }
  if(kind==='kalja'||kind==='drinkki') sfx('pop'); else if(kind==='vesi') sfx('click'); else tone(1800,0.05,{vol:0.08,type:'triangle'});
  buzz('drink');
  S.ordering=free?0.01:CONFIG.orderSec; S.pendingDrink=kind;
}
function sip(){
  if(!S.glass || !canAct()) return;
  const d=CONFIG.drinks[S.glass.kind];
  S.busy=d.sipSec*(S.thirst<CONFIG.thirst.lowLimit?2:1)*(S.skoolFast?1-CONFIG.skool.speedup:1); S.busyLabel='sip';
  sfx('gulp'); buzz('sip');
}
function finishSip(){
  const g=S.glass; if(!g) return;
  g.sipsLeft--; if(g.sipsLeft>0) return;
  S.glass=null; S.skoolFast=false;
  const C=CONFIG, d=C.drinks[g.kind];
  const eff = S.thirst<C.thirst.lowLimit?0.5:1;
  absorb(d.prom*eff, d.absorb);
  if(d.fade) absorb(-d.fade, d.fadeSec, d.absorb);
  S.bladder+=d.bladder;
  S.thirst+= d.thirst<0 && S.t<S.saltUntil ? d.thirst*C.snacks.sipsit.saltMult : d.thirst;
  S.stomach+=d.stomach; S.stats[g.kind]++;
  if(g.kind==='shotti') sfx('slam');
  if(d.burpChance && Math.random()<d.burpChance) setTimeout(()=>sfx('burp'),350);
  if(d.water) return;
  if(S.comboEnd!==null && S.t-S.comboEnd<=comboWindow()+(d.sips*d.sipSec*2)) S.combo++; else S.combo=1;
  S.comboEnd=S.t; S.maxCombo=Math.max(S.maxCombo,S.combo);
  if(S.combo>=3) sfx('combo');
  let mult=comboMult(S.combo)+(inZone()?C.combo.zoneBonus:0), pts=d.points; const P=C.phases;
  if(g.kind==='shotti' && S.t>=P.lastRoundAt && S.t<P.lastRoundAt+P.lastRoundSec) pts*=P.lastRoundShotMult;
  S.drinkPts+=Math.round(pts*mult); S.drinksCount++;
  if(S.combo===5) hint(10,'Rytmi on hallussa! Baarimikko nyökkää hyväksyvästi.');
  if(g.kind==='whisky'){ S.whiskyTimes=S.whiskyTimes.filter(x=>S.t-x<20); S.whiskyTimes.push(S.t); if(S.whiskyTimes.length>=2) hint(29,'Hidasta, cowboy. Whisky ei oo kaljaa.'); S.checkWhiskyThirst=S.t+0.1; }
  if(g.kind==='kalja'){ S.skoolUntil=S.t+C.skool.windowSec; $('skool').style.display='block'; }
}
function doSkool(){
  if(!S || S.over || S.t>S.skoolUntil) return;
  S.skoolUntil=-1; $('skool').style.display='none';
  S.skoolPts+=CONFIG.skool.points; S.skoolFast=true; S.skools++;
  sfx('skool'); buzz('shake'); flash('#ffd23f');
  hint(25,'SKOOOL! Koko baari hurraa!',2);
}
function eat(kind, free){
  if(!canAct()) return;
  const C=CONFIG, s=C.snacks[kind];
  if(!free){ if(S.base<s.cost){ hint('poor','Ei oo pisteitä snackeihin. Juo ensin!'); return;} S.snackSpent+=s.cost; }
  S.busy=s.eatSec; S.busyLabel='eat';
  S.stomach+=s.stomach; S.p+=s.prom; S.thirst+=s.thirstNow;
  noise(0.3,{type:'bandpass',f:2500,vol:0.12}); noise(0.3,{type:'bandpass',f:2000,vol:0.1,at:0.4});
  if(s.thirstPerSec) S.snackRegen.push({rate:s.thirstPerSec,left:s.thirstSec});
  if(kind==='sipsit'){ S.saltUntil=S.t+s.saltSec; if(womanPresent()){ S.w.interest-=s.womanPenalty; hint(14,'Vähän vähemmän rouskutusta, hän katsoo...'); } }
  S.snackTimes=S.snackTimes.filter(x=>S.t-x<C.overeat.windowSec); S.snackTimes.push(S.t);
  if(S.snackTimes.length>=C.overeat.count){ S.stomach+=C.overeat.extraStomach; S.snackTimes=[]; hint(13,'Tulitko syömään vai juomaan?'); }
}
function eatBowl(){ if(S.bowl<=0||!canAct()) return; const k=S.bowlItems.pop(); S.bowl--; eat(k,true); }
function fillBowl(){ S.bowl=CONFIG.bowl.portions; S.bowlItems=Array.from({length:S.bowl},()=>Math.random()<.5?'pahkinat':'sipsit'); }
function toilet(){
  if(!canAct()) return;
  S.away=CONFIG.bladder.toiletSec; S.awayKind='wc'; S.toilets++;
  if(S.combo>=3) hint(11,'Äh, rytmi meni. Uusi tuoppi alle!');
  S.combo=0; S.comboEnd=null;
  if(womanPresent()){ S.w.interest-=5; hint('wcw','Älä oo kauaa!',1,'woman'); }
  setTimeout(()=>sfx('flush'),3000);
}
function vomit(){
  const V=CONFIG.vomit; S.vomits++;
  sfx('vomit'); buzz('vomit'); flash('#7cb342');
  if(S.vomits>V.allowed){ end('oksennus'); return; }
  S.away=V.animSec; S.awayKind='vomit';
  S.drinksCount=Math.max(0,S.drinksCount-V.drinksLost); S.combo=0; S.comboEnd=null; S.p+=V.promille; S.stomach=0; S.penaltyPts-=V.points; S.glass=null; S.absorb=S.absorb.filter(a=>a.rate<0);
  if(womanPresent()){ womanLeave(); }
  hint(21,'No... ainakin nyt on tilaa uudelle.',3);
  S.pendingHint22=S.t+CONFIG.hints.showSec+0.6;
  $('sbar').classList.add('redborder');
}

// ================= NAINEN =================
function womanLeave(){ const w=S.w; w.state='LAHTEE'; w.timer=CONFIG.woman.cooldownSec; w.interest=0; w.zoneAcc=0; }
function updateWoman(dt, z){
  const W=CONFIG.woman, w=S.w;
  if(w.state==='POISSA'){ if(z) w.zoneAcc+=dt; const hour=CONFIG.startHour+S.t*CONFIG.gameMinPerSec/60;
    if(w.zoneAcc>=W.arriveZoneSec && hour>=W.arriveHour){
      w.state='PAIKALLA'; w.interest=Math.max(W.startInterest, w.level*15); w.taskTimer=W.firstTaskSec; w.perkTimer=W.perkEvery; sfx('giggle');
      if(!w.met){ w.met=true; const gi=Math.floor(Math.random()*W.names.length); w.nameGroup=gi; w.name=W.names[gi][Math.floor(Math.random()*3)];
        S.hintUntil=0; hint('name',`Moi! Mä oon ${w.name}. Sä näytät hauskalta.`,4,'woman'); S.hintUntil=S.t+3.5; }
      else { S.hintUntil=0; hint('back','Ai sä oot vielä täällä? Hyvä! 😏',4,'woman'); }
    } return; }
  if(w.state==='LAHTEE'){ w.timer-=dt; if(w.timer<=0) w.state='POISSA'; return; }
  if(S.away>0 && S.awayKind==='wc') return;
  w.interest+=(z?W.upInZone:-W.downOutZone)*dt;
  if(!z && S.p<CONFIG.promille.goldMin) hint(19,'Sä alat olla tylsä. Kalja piristäis!');
  if(!z && S.p>CONFIG.promille.goldMax) hint('toodrunk','Sä sammalat. Hän ei ymmärrä sanaakaan. Vettä!');
  if(w.interest<20) hint(18,'Hän vilkuilee ovelle. Sano jotain hauskaa!');
  w.interest=clamp(w.interest,0,100);
  if(w.interest<=0){ womanLeave(); hint('left','Ja sinne hän meni... Ehkä hän palaa.',2); sfx('fail'); return; }
  if(w.level>=3){ w.perkTimer-=dt; if(w.perkTimer<=0 && canAct()){ w.perkTimer=W.perkEvery;
    if(!S.glass && S.ordering<=0 && Math.random()<0.5){ order('drinkki',true); hint('perkd','Mä tarjoon tän. Kippis, komistus! 🍹',2,'woman'); }
    else { eat('pahkinat',true); hint('perks','Ota pähkinöitä, sä tarviit voimia 😉',2,'woman'); } } }
  if(z){ w.taskTimer-=dt; if(w.taskTimer<=0 && canAct()) startTask(); }
}
const TASK_TITLES={vitsi:'😂 Vitsin ajoitus',skoolaus:'🥂 Skoolaus',tikka:'🎯 Tikanheitto',tanssi:'💃 Tanssi',nimi:'🧠 Mikä mun nimi oli?'};
function startTask(){
  const types=Object.keys(TASK_TITLES); const type=types[Math.floor(Math.random()*types.length)];
  const d=drunkD(), T=CONFIG.tasks[type]; const k={type, d, el:0, done:false};
  $('task').style.display='flex'; $('ttitle').textContent=TASK_TITLES[type]; const body=$('tbody'); body.innerHTML=''; body.style.filter='';
  sfx('giggle');
  if(type==='vitsi'){ k.zw=lerp(T.zoneW,d); k.zx=rnd(15,85-k.zw); k.pos=0; k.dir=1; k.speed=lerp(T.speed,d);
    body.innerHTML=`<div class="track"><div class="zone" style="left:${k.zx}%;width:${k.zw}%"></div><div class="ptr" id="tptr"></div></div>`;
    $('thint').textContent='Napauta kun osoitin on "hauska"-alueella!'; }
  if(type==='skoolaus'){ k.dur=lerp(T.dur,d); k.tol=lerp(T.tol,d); k.jit=lerp(T.jitter,d);
    body.innerHTML=`<div class="target" style="width:${T.target}px;height:${T.target}px"></div><div class="ring" id="tring"></div><div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);font-size:40px">🥂</div>`;
    $('thint').textContent='Kilistä kun keltainen rengas osuu katkoviivaan!'; }
  if(type==='tikka'){ k.amp=lerp(T.amp,d); k.sp=lerp(T.speed,d); k.ph=rnd(0,6);
    body.innerHTML=`<div class="board"></div><div class="cross" id="tcross">✛</div>`; $('thint').textContent='Käsi heiluu... heitä kun tähtäin on keskellä!'; }
  if(type==='tanssi'){ k.beat=lerp(T.beatMs,d)/1000; k.tol=lerp(T.tolMs,d)/1000; k.vj=lerp(T.visualJitterMs,d)/1000; k.taps=[]; k.good=0; k.countIn=2;
    body.innerHTML=`<div class="beat" id="tbeat">💃</div>`; $('thint').textContent='Kaksi tahtia malliksi, sitten napauta 4 kertaa tahdissa!'; }
  if(type==='nimi'){ const W=CONFIG.woman, grp=W.names[S.w.nameGroup]; let opts;
    if(d>=T.similarFrom) opts=grp.slice(); else { opts=[S.w.name]; while(opts.length<3){ const g=W.names[Math.floor(Math.random()*W.names.length)]; const n=g[Math.floor(Math.random()*3)]; if(!opts.includes(n)&&!grp.includes(n)) opts.push(n);} }
    opts.sort(()=>Math.random()-0.5);
    body.innerHTML='<div class="names">'+opts.map(n=>`<button data-n="${n}">${n}</button>`).join('')+'</div>';
    body.style.filter=`blur(${lerp(T.blurPx,d).toFixed(1)}px)`;
    body.querySelectorAll('button').forEach(b=>b.addEventListener('pointerdown',e=>{ e.preventDefault(); e.stopPropagation(); if(!S.task) return; taskResult(b.dataset.n===S.w.name, b.dataset.n===S.w.name?'':`"${b.dataset.n}?! Mä oon ${S.w.name}!"`); }));
    $('thint').textContent='Hän katsoo odottavasti...'; }
  S.task=k;
}
function updateTask(dt){
  const k=S.task, T=CONFIG.tasks[k.type]; k.el+=dt;
  if(k.type==='vitsi'){ k.pos+=k.dir*k.speed*dt; if(k.pos>100){k.pos=100;k.dir=-1;} if(k.pos<0){k.pos=0;k.dir=1;}
    k.show=clamp(k.pos+Math.sin(k.el*9)*lerp(T.jitter,k.d),0,100); $('tptr').style.left=k.show+'%'; if(k.el>T.timeout) taskResult(false,'Liian hidas. Vitsi lässähti.'); }
  if(k.type==='skoolaus'){ const r=T.ringStart*(1-k.el/k.dur); k.r=r; const j=Math.sin(k.el*13)*k.jit; const e=$('tring'); e.style.width=e.style.height=Math.max(0,r)+'px'; e.style.marginLeft=j+'px';
    if(r<=0) taskResult(false,'Hän joi jo. Sä missasit kilistyksen.'); }
  if(k.type==='tikka'){ k.x=Math.sin(k.el*k.sp*1.3+k.ph)*k.amp+Math.sin(k.el*5.1)*k.amp*0.25; k.y=Math.cos(k.el*k.sp*0.9)*k.amp*0.8+Math.sin(k.el*4.3)*k.amp*0.2;
    const e=$('tcross'), b=$('tbody'); e.style.left=(b.clientWidth/2+k.x)+'px'; e.style.top=(b.clientHeight/2+k.y)+'px'; if(k.el>T.timeout) taskResult(false,'Tikka jäi käteen. Noloa.'); }
  if(k.type==='tanssi'){ const ph=((k.el+k.vj*Math.sin(k.el*3))%k.beat)/k.beat; const e=$('tbeat'); e.style.transform=`scale(${1+0.35*Math.max(0,1-ph*4)})`;
    const bi=Math.floor(k.el/k.beat); if(bi<k.countIn) $('thint').textContent=`Malli: ${bi+1}...`; else $('thint').textContent=`Sun vuoro! ${k.taps.length}/4`;
    if(k.el>(k.countIn+5)*k.beat) finishDance(); }
  if(k.type==='nimi' && k.el>T.timeout) taskResult(false,`Hiljaisuus... "Mä oon ${S.w.name}. Muistitko edes?"`);
}
function taskTap(x,y){
  const k=S.task; if(!k) return; const T=CONFIG.tasks[k.type];
  if(k.type==='vitsi'){ const ok=k.show>=k.zx&&k.show<=k.zx+k.zw; taskResult(ok, ok?'':'Vitsi tuli väärään saumaan. Krik krik.'); }
  if(k.type==='skoolaus'){ const ok=Math.abs(k.r-T.target)<=k.tol; sfx('slam'); taskResult(ok, ok?'':(k.r>T.target?'Liian aikaisin! Läikytit hänen juomansa.':'Liian myöhään, hän joi jo.')); }
  if(k.type==='tikka'){ const ok=Math.hypot(k.x,k.y)<=T.hitR; taskResult(ok, ok?'':'Tikka osui seinään. Baarimikko väistää.'); }
  if(k.type==='tanssi'){ const bi=Math.floor(k.el/k.beat); if(k.el<k.countIn*k.beat-k.tol) return; const near=Math.round(k.el/k.beat)*k.beat; if(Math.abs(k.el-near)<=k.tol) k.good++; k.taps.push(k.el); sfx('click'); buzz('sip'); if(k.taps.length>=4) finishDance(); }
}
function finishDance(){ const k=S.task, ok=k.good>=CONFIG.tasks.tanssi.need; taskResult(ok, ok?'':`Tahdissa ${k.good}/4. Astuit hänen varpaille.`); }
function taskResult(ok, failText){
  const k=S.task; if(!k||k.done) return; k.done=true; const W=CONFIG.woman, w=S.w;
  w.tasksDone++; w.byType[k.type]=(w.byType[k.type]||0)+1;
  $('task').style.display='none'; S.task=null; w.taskTimer=rnd(W.taskEveryMin,W.taskEveryMax); S.hintUntil=0;
  if(ok){ w.tasksWon++; w.level=Math.min(W.maxLevel,w.level+1); w.interest=clamp(w.interest+W.successInterest,0,100);
    sfx('success'); buzz('success'); const L=W.levels[w.level];
    if(L.bonus){ S.bonusPts+=L.bonus; }
    if(w.level===4) sfx('kiss'); else sfx('giggle');
    hint('lvl'+w.level, `${L.text||'Hän nauraa!'}${L.bonus?' +'+L.bonus+' p':''}  (×${CONFIG.score.levelMult[w.level]})`, 4, 'woman');
    if(w.level>=W.maxLevel){ setTimeout(()=>end('nainen'),1200); S.leaving=true; }
  } else { w.interest=clamp(w.interest+W.failInterest,0,100); sfx('fail'); buzz('fail'); hint('tfail'+w.tasksDone, failText||'Hups.', 4, 'woman');
    if(w.interest<=0){ womanLeave(); } }
}

// ================= PÄIVITYS =================
function update(dt){
  if(S.leaving) return;
  if(S.task){ updateTask(dt); if(S.t>=S.hintUntil) $('bubble').classList.remove('show'); return; } // maailma pysähtyy tehtävän ajaksi
  const C=CONFIG, P=C.promille; S.t+=dt;
  if(S.ordering>0){ S.ordering-=dt; if(S.ordering<=0){ S.glass={kind:S.pendingDrink,sipsLeft:C.drinks[S.pendingDrink].sips}; } }
  if(S.busy>0){ S.busy-=dt; if(S.busy<=0 && S.busyLabel==='sip') finishSip(); if(S.over) return; }
  if(S.away>0){ S.away-=dt; if(S.away<=0 && S.awayKind==='wc'){ S.bladder=0; S.p+=C.bladder.toiletPromille; S.stomach+=C.bladder.toiletStomach; } }
  if(S.t>S.skoolUntil) $('skool').style.display='none';
  for(const a of S.absorb){ if(a.delay>0){a.delay-=dt;continue;} const s=Math.min(dt,a.left); S.p+=a.rate*s; a.left-=s; }
  S.absorb=S.absorb.filter(a=>a.left>0);
  S.p-=(P.recBase+P.recPerPromille*S.p)*dt; S.p=clamp(S.p,0,P.max);
  S.sumP+=S.p*dt;
  S.promPts+=C.score.promPerSec*Math.pow(Math.min(S.p,P.goldMax)/P.goldMax, C.score.promExp)*dt;
  S.bladder+=(S.t>=C.phases.rushAt?C.bladder.passiveRush:C.bladder.passive)*dt;
  S.thirst+=C.thirst.regen*dt; for(const r of S.snackRegen){ const s=Math.min(dt,r.left); S.thirst+=r.rate*s; r.left-=s; } S.snackRegen=S.snackRegen.filter(r=>r.left>0);
  S.thirst=clamp(S.thirst,0,100); S.stomach=clamp(S.stomach-C.stomach.drain*dt,0,100);
  if(S.bowl<=0){ S.bowlTimer+=dt; const need=S.t>=C.phases.rushAt?C.bowl.refillSecLate:C.bowl.refillSec; if(S.bowlTimer>=need){ S.bowlTimer=0; fillBowl(); hint(15,'Kulho täynnä! Ilmaista suolaista!'); } }
  const z=inZone();
  if(z){ S.zoneTime+=dt; if(!S.everZone){S.everZone=true;} }
  S.wasInZone=z;
  if(S.comboEnd!==null && !S.glass && S.busy<=0 && S.t-S.comboEnd>comboWindow()){ if(S.combo>=3) hint(11,'Äh, rytmi meni. Uusi tuoppi alle!'); S.combo=0; S.comboEnd=null; }
  if(z && !S.glass && S.ordering<=0 && S.comboEnd!==null && S.t-S.comboEnd>8) hint(23,'Tuoppi on tyhjä, kombo karkaa!');
  if(S.p>=P.passWarn && !S.wakeUsed){ S.wakeUsed=true; S.p+=C.safety.wakeUpPromille; hint('wake','*Säpsähdät hereille* Huh! Nyt vettä!',3); }
  if(S.p>=P.passOut){ end('sammui'); return; }
  if((S.stomach>=100 || S.p>=vomitLimit()) && !(S.away>0 && S.awayKind==='vomit')){ vomit(); if(S.over) return; }
  if(S.bladder>=100){
    if(S.awayKind==='wc' && S.away>0) S.bladder=99.9;
    else if(!S.graceUsed){ S.graceUsed=true; S.graceUntil=S.t+C.safety.bladderGraceSec; S.bladder=99.9; hint('grace','VIIMEINEN MAHDOLLISUUS! VESSAAN!',3); }
    else if(S.t>S.graceUntil){ end('housut'); return; }
    else S.bladder=99.9;
  }
  updateWoman(dt, z); if(S.task||S.over) { recalcBase(); return; }
  const early = k => S.firstWarn[k] ? 1 : 0.9;
  if(S.p>=P.passWarn*early('pw')){ S.firstWarn.pw=1; hint(4,'Silmät painuu. Viimeinen shotti voi olla viimeinen ikinä.',3); }
  if(S.bladder>=C.bladder.crit) hint(6,'EI. ENÄÄ. YHTÄÄN. Vessa. NYT.',3);
  else if(S.bladder>=C.bladder.warn*early('bl')){ S.firstWarn.bl=1; hint(5,'Jalat ristissä, nyt vessaan tai housut kastuu!',3); }
  if(S.p>=P.warn*early('w')){ S.firstWarn.w=1; hint(3,'Huone pyörii... ehkä vähän vettä?',3); }
  if(S.vomits>=1 && S.p>=1.9 && S.stomach>=60) hint(28,'Muista: vain amatöörit oksentaa. Älä oo amatööri.',2);
  if(S.stomach>=80) hint(12,'Vatsa on kuin vesisänky. Varo nyt.',2);
  if(S.pendingHint22 && S.t>=S.pendingHint22){ S.pendingHint22=0; hint(22,'Se oli sun ainoo jokeri. Seuraava oksennus ja ilta on ohi.',3); }
  if(S.checkWhiskyThirst && S.t>=S.checkWhiskyThirst){ S.checkWhiskyThirst=0; if(S.thirst<30) hint(26,'Whisky poltti kurkun. Vettä tai pähkinää, äkkiä!',2); }
  if(S.thirst<C.thirst.lowLimit/early('th')){ S.firstWarn.th=1; hint(7,'Kalja ei maistu, kurkku kuin hiekkapaperia. Sipsiä!'); }
  if(S.t>4 && S.p<P.goldMin && !S.w.met) hint(1,'Etkojen teho hiipuu. Tilaa kalja, nopeesti!');
  if(S.p<0.5 && S.t>10) hint('dry','Oot ihan kuiva, kukaan ei naura sun jutuille. Tilaa jotain!');
  if(z && S.p>1.35 && !S.hHigh){ S.hHigh=1; hint(2,'Yläkulmilla! Mitä lähempänä rajaa, sitä enemmän pisteitä.',2); }
  if(S.t>=120 && !S.h24){ S.h24=1; hint(24,'Keskiyö! Nyt alkaa ilta kunnolla.',2); }
  if(S.t>=C.phases.lastRoundAt && !S.hLR){ S.hLR=1; hint('lr','VIIMEINEN KIERROS! Shotit tuplapisteillä!',2); }
  if(S.t>=C.phases.warnAt && !S.h9){ S.h9=1; hint(9,'Kymmenen minuuttia valomerkkiin!',2); }
  recalcBase();
  if(S.t>=C.roundSeconds){ end('valomerkki'); return; }
  if(S.t>=S.hintUntil) $('bubble').classList.remove('show');
}

// ================= LOPPU =================
function end(reason){
  if(S.over) return; S.over=true; S.leaving=false; const C=CONFIG.score, W=CONFIG.woman;
  $('task').style.display='none'; S.task=null; recalcBase();
  let timeBonus=0; if(reason==='nainen'){ timeBonus=Math.round(C.timeBonusPerGameMin*Math.max(0,CONFIG.roundSeconds-S.t)*CONFIG.gameMinPerSec); }
  const base=S.base+timeBonus, mult=levelMult(), fail=['sammui','housut','oksennus'].includes(reason);
  let score=Math.max(0,Math.round(base*mult*(fail?C.failMult:1)));
  let stars=C.stars.filter(s=>score>=s).length; if(fail) stars=Math.min(stars,1);
  if(reason==='valomerkki') sfx('bell'), buzz('bell'); else if(reason==='nainen') sfx('success'); else sfx('fail');
  const titles={valomerkki:['💡 VALOMERKKI','Baarimikko sytyttää valot. Kotiin päin!'],nainen:['❤️ YÖSEURAA',`Te lähditte ${S.w.name}n kanssa yhdessä. Illan tähti!`],
    sammui:['😴 SAMMUIT','Heräät tiskiltä naama pähkinäkulhossa.'],housut:['💦 HOUSUT MÄRKÄNÄ','Koko baari osoittaa sormella.'],oksennus:['🤮 TOINEN OKSENNUS','Vain amatöörit oksentaa. Portsari saattaa ulos.']};
  const st=S.stats, row=(a,b)=>`<tr><td>${a}</td><td><b>${b}</b></td></tr>`;
  const lvlName=S.w.met?W.levels[S.w.level].name:'Ei tavattu';
  $('panel').innerHTML=`<h1>${titles[reason][0]}</h1><p>${titles[reason][1]}</p><div class="stars">${'★'.repeat(stars)}${'☆'.repeat(3-stars)}</div><h2>${score} p</h2>
  <p>❤️ <b>${lvlName}</b> (taso ${S.w.level}/5, tehtävät ${S.w.tasksWon}/${S.w.tasksDone})</p><table>
  ${row('Juomapisteet',S.drinkPts)}${row('Humalapisteet (keskiarvo '+(S.sumP/Math.max(1,S.t)).toFixed(2)+'‰)',Math.round(S.promPts))}${row('SKOOL! ×'+S.skools,S.skoolPts)}
  ${row('Naisbonukset',S.bonusPts)}${timeBonus?row('Aikabonus',timeBonus):''}${row('Oksennukset ('+S.vomits+')',-S.penaltyPts)}${row('Snack-ostot',-S.snackSpent)}
  ${row('= Pohja',Math.round(base))}${row('× Tasokerroin',mult)}${fail?row('× Rangaistus',C.failMult):''}
  <tr><td colspan=2><hr></td></tr>${row('Kello',gameClock(S.t))}${row('🍺/🥃/🧪/🍹/💧',`${st.kalja}/${st.whisky}/${st.shotti}/${st.drinkki}/${st.vesi}`)}
  ${row('Pisin kombo',S.maxCombo)}${row('Aika kultaisella alueella',Math.round(S.zoneTime)+' s')}${row('Vessakäynnit',S.toilets)}</table><button id="again">Vielä yksi ilta! 🍺</button>`;
  $('overlay').style.display='flex'; $('again').onclick=start;
  S.result={reason,score,stars,base,mult,level:S.w.level};
}

// ================= PIIRTO =================
function pantiesSVG(interest){
  const stage=interest<34?0:interest<67?1:2, cols=['#ffd6e7','#ff8fb8','#d81b60'];
  const drops=[[],[[24,30]],[[16,30],[24,33],[32,30],[24,38]]][stage];
  return `<svg viewBox="0 0 48 40"><path d="M2 4 H46 L44 12 Q34 16 28 30 H20 Q14 16 4 12 Z" fill="${cols[stage]}" stroke="#fff" stroke-width="1.5"/>`+
    `<path d="M2 4 H46" stroke="#fff" stroke-width="3"/>`+(stage>=1?`<ellipse cx="24" cy="24" rx="${3+stage*2}" ry="${2+stage*2}" fill="rgba(0,0,0,.25)"/>`:'')+
    drops.map(([x,y])=>`<path d="M${x} ${y} q-2.5 4 0 5 q2.5 -1 0 -5z" fill="#7fd3ff"/>`).join('')+`</svg><div style="text-align:center">${['kuivat','kosteat','märät'][stage]}</div>`;
}
let lastPanties='';
function render(){
  const P=CONFIG.promille, pct=v=>(v/P.max*100)+'%';
  $('clock').textContent=gameClock(S.t);
  $('score').textContent=Math.round(S.base)+' p'+(levelMult()>1?` ×${levelMult()}`:'');
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
  const wp=womanPresent(), w=S.w;
  $('wpanel').style.display=wp?'flex':'none';
  if(wp){ const ps=Math.round(w.interest/4); if(ps+''!==lastPanties){ lastPanties=ps+''; $('panties').innerHTML=pantiesSVG(w.interest);} $('wlevel').textContent=`${w.name} ❤️ ${w.level}/5`; $('wstate').textContent=CONFIG.woman.levels[w.level].name; }
  $('woman').textContent=wp?(w.level>=4?'😘':w.interest>=60?'😍':w.interest<20?'🙄':'💃'):'';
  $('gesture').textContent=wp?CONFIG.woman.levels[w.level].gesture:'';
  let f='😐'; if(S.p>=P.passWarn) f='😵'; else if(S.bladder>=75) f='😖'; else if(S.p>=P.warn) f='🤢'; else if(S.thirst<15) f='😫'; else if(inZone()) f=S.combo>=5?'😎':'😄'; else if(S.p<P.goldMin) f='😑';
  $('player').textContent=f;
  const g=$('glass');
  if(S.glass){ const d=CONFIG.drinks[S.glass.kind]; g.className='has'; g.innerHTML=d.icon+`<small>${'●'.repeat(S.glass.sipsLeft)} napauta</small>`; }
  else if(S.ordering>0){ g.className=''; g.textContent='⏳'; } else { g.className=''; g.textContent=''; }
  $('bowl').className=S.bowl>0?'':'empty'; $('bowlc').textContent=S.bowl;
  const aw=$('away'); if(S.away>0){ aw.style.display='flex'; aw.textContent=(S.awayKind==='wc'?'🚻 Vessassa... ':'🤮 Bläääh... ')+Math.ceil(S.away)+' s'; } else aw.style.display='none';
  document.querySelectorAll('#buttons button[data-d],#buttons button[data-s]').forEach(b=>b.disabled=S.away>0||!!S.task||(b.dataset.d&&(!!S.glass||S.ordering>0)));
  applyFx();
}
// Humalaefektit koko pelinäkymään (#app): huojunta, haamukuva, sumeus. Skaalautuu promilleilla.
function applyFx(){
  const F=CONFIG.fx, p=S.p, t=performance.now()/1000;
  const sw=Math.max(0,p-F.swayFrom);
  const rot=Math.sin(t*1.3)*F.swayDegPerPromille*sw + Math.sin(t*0.7)*0.4*sw;
  const tx=Math.sin(t*0.9)*F.swayPxPerPromille*sw, ty=Math.cos(t*1.1)*F.swayPxPerPromille*0.5*sw;
  $('app').style.transform=`translate(${tx.toFixed(1)}px,${ty.toFixed(1)}px) rotate(${rot.toFixed(2)}deg)`;
  S.maxRot=Math.max(S.maxRot,Math.abs(rot));
  const gh=Math.max(0,p-F.ghostFrom)*F.ghostPxPerPromille, bl=Math.max(0,p-F.blurFrom)*F.blurPxPerPromille;
  const filt=[]; if(gh>0.5) filt.push(`drop-shadow(${(gh*Math.sin(t*0.8)).toFixed(1)}px 0 0 rgba(255,255,255,.35))`); if(bl>0.05) filt.push(`blur(${bl.toFixed(2)}px)`);
  $('scene').style.filter=filt.join(' ')||'none';
}

function loop(ts){ const dt=Math.min(0.1,(ts-(last||ts))/1000); last=ts; if(S && !S.over){ update(dt); if(!S.over) render(); } requestAnimationFrame(loop); }

// ================= SYÖTE =================
function tap(el, fn){ el.addEventListener('pointerdown', e=>{ e.preventDefault(); audioInit();
  if(S && S.p>=CONFIG.fx.tapMissFrom && el.id==='glass' && Math.random()<CONFIG.fx.tapMissChance) return;
  fn(e); }); }
document.querySelectorAll('#buttons button[data-d],#buttons button[data-s]').forEach(b=>tap(b,()=>{ if(b.dataset.d) order(b.dataset.d); else eat(b.dataset.s,false); }));
tap($('glass'),sip); tap($('bowl'),eatBowl); tap($('wc'),toilet); tap($('skool'),doSkool);
tap($('tbody'),e=>{ const r=$('tbody').getBoundingClientRect(); taskTap(e.clientX-r.left,e.clientY-r.top); });
tap($('mute'),()=>setMute(!AU.muted));
// Ravistus: ensisijaisesti e.acceleration (ilman painovoimaa), muuten accelerationIncludingGravity - alipäästösuodatettu painovoima.
const MOTION={events:0, max:0, grav:null, lastShake:0, src:'-'};
function onMotion(e){
  MOTION.events++; let lin=0; const a=e.acceleration;
  if(a && a.x!=null){ lin=Math.hypot(a.x,a.y||0,a.z||0); MOTION.src='acceleration'; }
  else { const g=e.accelerationIncludingGravity; if(!g||g.x==null) return; MOTION.src='inclGravity';
    if(!MOTION.grav) MOTION.grav={x:g.x,y:g.y,z:g.z}; const k=0.8, G=MOTION.grav; G.x=k*G.x+(1-k)*g.x; G.y=k*G.y+(1-k)*g.y; G.z=k*G.z+(1-k)*g.z;
    lin=Math.hypot(g.x-G.x,g.y-G.y,g.z-G.z); }
  MOTION.max=Math.max(MOTION.max,lin);
  const now=performance.now();
  if(lin>CONFIG.shake.threshold && now-MOTION.lastShake>CONFIG.shake.cooldownMs){ MOTION.lastShake=now; doSkool(); }
}
window.addEventListener('devicemotion', onMotion, {passive:true});
tap($('vtest'),()=>{ buzz('success'); sfx('success');
  const msg=`Tärinä: ${navigator.vibrate?'OK':'ei tuettu'} · Liike: ${MOTION.events} tapahtumaa (${MOTION.src}), max ${MOTION.max.toFixed(1)} m/s² · raja ${CONFIG.shake.threshold} · ${window.isSecureContext?'https OK':'EI https'}`;
  S.hintUntil=0; S.hintLast={}; hint('vtest',msg,5); S.hintUntil=S.t+5; });

function start(){
  audioInit(); ambienceStart();
  if(typeof DeviceMotionEvent!=='undefined' && typeof DeviceMotionEvent.requestPermission==='function') DeviceMotionEvent.requestPermission().catch(()=>{});
  S=newState(); fillBowl(); last=null; lastPanties=''; $('overlay').style.display='none'; $('sbar').classList.remove('redborder'); $('task').style.display='none';
  sfx('pop'); buzz('drink');
  hint('start','Etkot hoidettu, nyt mennään! 🍺 Pidä promillet kultaisella alueella.',3);
}
function intro(){
  S=newState(); fillBowl(); render(); S.over=true; setMute(AU.muted);
  $('panel').innerHTML=`<h1>🍺 KALJA!</h1><h3>Päivä 1 – Perjantai-ilta <small>(${CONFIG.version})</small></h3><p style="text-align:left;font-size:14px">
  • Tilaa juoma alhaalta, napauta lasia = hörppy.<br>• Pidä <b style="color:#ffb300">promillet kultaisella alueella</b> (0,8–1,6‰). Mitä lähempänä yläreunaa, sitä enemmän pisteitä – mutta älä sammu!<br>
  • Kalja pitää tasaisena mutta kusettaa, whisky kuivattaa, shotti nousee ja laskee nopeasti.<br>• 🚻 ennen kuin housut kastuu. Snackit (🥣 ilmainen kulho) pitävät janon yllä.<br>
  • Kun olet hauska (alueella), <b>nainen</b> antaa minitehtäviä. 5 onnistumista = hän lähtee mukaasi. Jokainen taso nostaa pistekerrointa.<br>
  • Kaljan jälkeen SKOOL! (nappi tai ravista puhelinta).<br>• Yksi oksennus sallitaan. Valomerkki klo 02.</p><button id="go">ALOITA ILTA</button>`;
  $('go').addEventListener('click',start); requestAnimationFrame(loop);
}
intro();
