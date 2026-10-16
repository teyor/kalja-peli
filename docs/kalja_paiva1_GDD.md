# KALJA! – Päivä 1: Perjantai-ilta
## Pelisuunnitteludokumentti (GDD) v0.5 (peliversio v4)

**Tekijä:** Teijo Rutanen | **Päivämäärä:** 11.10.2026 | **Versio:** v0.5 (16.10.2026, vastaa peliversiota v4) | **Laajuus:** Päivä 1 + lyhyt Päivä 2 -teaser

> **v0.5-muutokset:** naisen ääni­reaktiot (formanttisynteesi), oma 💋-kytkin ja voimakkuus CONFIGissa.

> **v0.4-muutokset:** 3-2-1-laskenta ennen tehtäviä, tanssi osu!-tyyliin, skoolaus liukuvilla laseilla, tikanheitto ilman aikarajaa (7+ kelpaa), naisen eteneminen pikkuhousujen kosteuden mukaan (laatu 0–1 per tehtävä), nopeampi ja vahvempi humala, hitaampi palautuminen, tehtäviä useammin.

> **v0.3-muutokset:** äänet (WebAudio), haptiikka, toimiva ravistus Androidilla, näkyvämmät humalaefektit, aloitus 0,8 ‰:sta, vahvempi kalja, naisen minitehtävät (korvaavat 5 tarjottua juomaa), uusi pisteytys (humala-integraali + tasokerroin). Testiversio: https://teyor.github.io/kalja-peli/ – kaikki arvot `game.js`:n `CONFIG`-objektissa.

> Kaikki tämän dokumentin numeroarvot ovat **säädettäviä lähtöarvoja** (tunable starting values). Ne on laskettu niin, että paletti toimii paperilla, mutta oikea tuntuma haetaan pelitestaamalla.

---

## 1. Konsepti

**Lyhyesti:** Mobiilin arcade-peli, jossa juot yhden illan aikana baarissa mahdollisimman monta kaljaa. Kuulostaa helpolta, mutta kroppa ei ole samaa mieltä: promillet, rakko, jano ja vatsa pitää pitää kurissa. Kun olet sopivasti humalassa (**Kultainen alue**), olet hauska – ja baarin nainen kiinnostuu.

**Pelaajafantasia:** "Mä oon illan tähti." Hyvä rytmi, oikeat valinnat ja hyvä tuuri = paljon kaljaa, nauravia ihmisiä ja kotiinlähtö kaksin.

**Suunnittelun kolme periaatetta:**

1. **Looginen** – jokainen mittari käyttäytyy niin kuin oikeassa elämässä (suurin piirtein). Kalja pissattaa, sipsit janottaa, liikaa = oksennus.
2. **Melko helppo** – Päivä 1 on anteeksiantava: leveä kultainen alue, hitaat mittarit, vihjeet ajoissa.
3. **Viihdyttävä** – hauskat puhekuplat, ilmeet, humalaefektit ja "SKOOL!"-hetket.

**Perustiedot:**

| Ominaisuus | Arvo |
|---|---|
| Alusta | Mobiili (iOS/Android), pystyasento |
| Genre | Yhden napautuksen arcade / resurssienhallinta |
| Kierroksen pituus | n. 3 min reaaliaikaa |
| Pelin kello | 20:00 → 02:00 (valomerkki) |
| Aikasuhde | 1 s reaaliaikaa = 2 pelin minuuttia (180 s = 6 h) |
| Käyttö | Henkilökohtainen projekti (Teijo + kaverit), ei julkaista |
| Laite | Testataan Androidilla (Chrome), GitHub Pages (https) |
| Juomat | Geneerisiä, ei brändejä: Kalja, Whisky, Shotti, Drinkki (+ Vesi) |

---

## 2. Ydinsilmukka (Core loop)

**Sekuntitason silmukka (5–10 s):**

1. Katso mittarit (promillet, rakko, jano).
2. Valitse: **kalja / whisky / shotti / drinkki / vesi / snack / vessa**.
3. Napauttele juoma alas → kombo kasvaa.
4. Kuuntele kaverin vinkki → korjaa suuntaa.

**Minuuttitason silmukka (30–60 s):**

1. Nosta promillet kultaiselle alueelle.
2. Pidä rytmi tasaisena (kombo), käy vessassa ennen kuin on pakko.
3. Hoida janoa snackeilla (kulho tiskillä, ostot, naisen tarjoamat).
4. Pysy alueella → nainen saapuu → onnistu hänen minitehtävissään → kastele pikkuhousut läpimäriksi → lähtekää yhdessä.

**Kierrostason silmukka:** Ilta päättyy valomerkkiin tai siihen, että nainen lähtee kanssasi → pisteet ja tähdet → "Vielä yksi ilta!"

---

## 3. Ohjaus ja käyttöliittymä

### 3.1 Ohjaus (one-tap)

Kaikki toiminnot ovat yksittäisiä napautuksia. Ei pyyhkäisyjä eikä pitkiä painalluksia (paitsi valinnainen ravistus).

| Toiminto | Ele | Huomio |
|---|---|---|
| Tilaa juoma | Napauta juomanappia (Kalja / Whisky / Shotti / Drinkki / Vesi) | Juoma ilmestyy tiskille, 0,5 s |
| Juo | Napauta lasia | Kalja = 5 hörppyä, whisky = 4 (hitaat), shotti = 1, drinkki = 3, vesi = 3 |
| Syö snack | Napauta kulhoa / snack-nappia | Syöminen vie aikaa (ks. taulukko) |
| Vessaan | Napauta vessa-ikonia | 5 s poissa tiskiltä |
| Naisen minitehtävä | 3-2-1-laskennan jälkeen napautus (ajoitus / tähtäys / ympyrät / valinta) | Ks. luku 7 |
| SKOOL! | Ravista puhelinta tai napauta SKOOL!-nappia 2,5 s sisällä kaljan viimeisestä hörpystä | Bonus, ks. kombot |
| Äänet päälle/pois | 🔊/🔇 yläpalkissa | Valinta muistetaan |
| Laitetesti | 📳 testi -nappi | Näyttää tärinätuen, liikeanturin tapahtumat ja suurimman kiihtyvyyden |

### 3.2 Näkymän asettelu (pystyasento)

```
+-------------------------------------+
| 21:34   PISTEET 2 340   KOMBO x2    |  <- yläpalkki
| [PROMILLET ====|##GOLD##|=====  ]   |  <- iso vaakamittari
| RAKKO [####  ]  JANO [######  ]     |
| VATSA [##    ]  ♥ NAINEN [###   ]   |
|-------------------------------------|
|   (kaveri/sisäinen ääni: puhekupla) |
|                                     |
|   HAHMO (ilme vaihtuu)   NAINEN     |
|   ------- BAARITISKI -------        |
|   [LASI]        [KULHO]   🚻         |
|-------------------------------------|
| [KALJA][WHISKY][SHOTTI][DRINKKI]    |  <- juomanapit peukaloalueella
| [VESI]   [🥜] [🥔]                  |  <- vesi + snackit
+-------------------------------------+
```

- **Promillemittari** on suurin: kultainen alue kirkkaana keskellä, vaara-alueet punaisella oikealla.
- Mittari **vilkkuu** varoitustasolla, hahmon **ilme** muuttuu (ks. luku 9).
- Napit ovat alaosassa peukalon ulottuvilla. Humalaefektit eivät koskaan siirrä nappeja, vain "heiluttavat" kuvaa ja osumakohtaa.

---

## 4. Mittarit

### 4.1 Promillet (‰)

Asteikko 0,0–3,0 ‰. Keskellä **Kultainen alue**.

| Parametri | Lähtöarvo (säädettävä) | Selitys |
|---|---|---|
| Aloitusarvo | 0,8 ‰ (kultaisen alueen alaraja) | "Etkot hoidettu, nyt mennään!" – juotavaa tarvitaan heti |
| Kultainen alue (Päivä 1) | 0,8–1,6 ‰ | Leveä ja armollinen |
| Varoitusraja | 1,8 ‰ | Huone alkaa pyöriä, mittari vilkkuu keltaisena |
| Oksennusraja (perus) | 2,0 ‰ | Laskee vatsan täyttyessä (ks. 4.4) |
| Sammumisen varoitus | 2,5 ‰ | Silmät painuu, mittari vilkkuu punaisena |
| Sammuminen | 2,8 ‰ | **Peli päättyy heti** |
| Palautuminen | 0,010 + 0,005 × promillet ‰/s (v0.4, ennen 0,0125) | Laskee hitaasti – humala pysyy |
| Imeytyminen | Juoman vaikutus tulee viiveellä (ks. juomataulukko) | Estää "piikin" yhdestä napista |

**Miksi tämä kaava? (v0.4, simuloitu pelin omalla koodilla)** Juomat imeytyvät nopeasti (kalja 4 s) ja palautuminen on hidasta.

| Tahti (alkaen 0,8 ‰) | 10 s | 20 s | 30 s | 45 s | 60 s | 90 s | Huom. |
|---|---|---|---|---|---|---|---|
| Kalja / 10 s | 1,01 | 1,22 | **1,41** | 1,67 | 1,81 | 1,91 | Jatkuva 10 s tahti vie lopulta yli → hidasta ~13–15 s:iin |
| Kalja / 12 s | 1,01 | 1,22 | 1,31 | 1,53 | 1,62 | 1,88 | |
| Kalja / 15 s | 1,01 | 1,02 | 1,07 | 1,19 | 1,30 | 1,41 | Pysyy alueella koko illan |
| Kalja / 5 s | 1,17 | 1,71 | – | – | – | – | **Yli 2,0 ‰ ja oksennus jo n. 26 s:ssa** |
| Shotti / 5 s | 1,40 | 1,84 | – | – | – | – | **Oksennus n. 22 s:ssa** |
| Whisky / 10 s | 1,11 | 1,40 | 1,67 | 1,90 | – | – | Oksennus n. 47 s:ssa |

(Simulaatiossa jano laski välillä alle 15:n, jolloin juoman vaikutus puolittuu, ja botti söi kulhosta snackit.) Rytmi on edelleen pelin ydin: nopea tahti = vaara, liian hidas = tylsä.

**Humalaefektit (v0.3, koko pelinäkymä `#app`, skaalautuvat jatkuvasti):**

- Huojunta: kierto ±4° per ‰ yli 0,6 ‰ + sivuttaisliike ±14 px per ‰ (1,2 ‰ ≈ ±2,4°, 2,2 ‰ ≈ ±6,4°).
- Tuplanäkö: haamukuva (drop-shadow) yli 1,3 ‰, siirtymä 14 px per ‰.
- Sumeus: blur yli 1,9 ‰, 2 px per ‰.
- Yli 2,2 ‰: 15 % lasin napautuksista menee ohi.

Alkuperäinen taulukko (suuntaa-antava):

| Promillet | Efekti |
|---|---|
| < 0,8 | Ei efektejä, hahmo näyttää tylsistyneeltä |
| 0,8–1,6 | Lämmin väri, pieni hymy, musiikki kuulostaa paremmalta |
| 1,6–1,9 | Kevyt ruudun huojunta (±2°) |
| 1,9–2,2 | Tuplanäkö (haamukuva 8 px sivussa) |
| 2,2–2,8 | Napautukset osuvat hieman ohi (±15 px satunnaisesti, lasin osuma-alue +20 %, jottei tule epäreilua), huojunta ±5° |

### 4.2 Rakko (%)

| Parametri | Lähtöarvo | Selitys |
|---|---|---|
| Aloitus | 10 % | |
| Passiivinen täyttyminen | +0,2 %/s | |
| Varoitus | 75 % | "Jalat ristissä", mittari vilkkuu, hahmo kiemurtelee |
| Kriittinen | 90 % | Nopea vilkkuminen + värinä |
| Housut märkänä | 100 % | **Peli päättyy heti** |
| Vessakäynti | 5 s reaaliaikaa (10 pelin min) | Rakko → 0 %, promillet −0,10 ‰, vatsa −10, **kombo nollautuu** |

Johdonmukainen linja: **varoitus 75 %:ssa, housut 100 %:ssa.** Ei pakotettua vessakäyntiä – pelaaja päättää itse, ja seuraukset ovat selkeät.

### 4.3 Jano (0–100)

Jano kertoo, kuinka hyvin juoma "maistuu". Korkea jano = juoma uppoaa. Juominen kuluttaa janoa.

| Parametri | Lähtöarvo | Selitys |
|---|---|---|
| Aloitus | 60 | |
| Passiivinen palautuminen | +0,3/s | Jano palaa hitaasti itsestään |
| "Tökkii"-raja | < 15 | Hörpyt kestävät 2× pidempään, juoman vaikutus ×0,5 |
| Kuiva | 0 | Kuten tökkii + hahmo yskii, kombo-ikkuna lyhenee 2 s |

### 4.4 Vatsa (0–100)

Vatsa on yhdistetty oksennuslogiikkaan: täysi vatsa laskee oksennusrajaa.

| Parametri | Lähtöarvo | Selitys |
|---|---|---|
| Aloitus | 0 | Ei ruokaa illan aikana (vain snackit) |
| Tyhjeneminen | −0,8/s (v0.3, ennen −0,4) | Pelkällä kaljatahdilla vatsa ei enää täyty itsestään |
| Oksennusrajan lasku | Kun vatsa > 60: raja = 2,0 − (vatsa − 60) × 0,01 ‰ | Vatsa 100 → raja 1,6 ‰ |
| Vatsa täynnä | 100 | Oksennus heti promilleista riippumatta |

**Oksennus (ei lopeta peliä):** 4 s animaatio, juotujen juomien laskurista −2, kombo → 0, promillet −0,40 ‰, vatsa → 0, pisteet −200. Jos nainen on paikalla, hän lähtee (ks. luku 7).

**Päivä 1: yksi oksennus sallitaan** (rangaistus kuten yllä). **Toinen oksennus = ilta ohi**, peli päättyy heti. Myöhemmillä päivillä jo ensimmäinen oksennus lopettaa pelin ("vain amatöörit oksentaa", ks. luku 13).

### 4.5 Naisen kiinnostus (0–100)

Näkyy pikkuhousut-ikonina (kuivat → kosteat → märät) vasta, kun nainen on paikalla. Logiikka luvussa 7.

---

## 5. Juomat

| Juoma | Hörppyjä | Promillet | Imeytyminen | Rakko | Jano | Vatsa | Pisteet |
|---|---|---|---|---|---|---|---|
| **Kalja** | 5 × 0,5 s | +0,36 ‰ (v0.4) | 4 s ajan | +12 % | −10 | +6 | 100 |
| **Whisky** | 4 × 0,8 s (hidas siemailu) | +0,45 ‰ | 6 s ajan | +4 % | −15 (kuivattaa kurkkua) | +3 | 150 |
| **Shotti** | 1 × 0,5 s | +0,42 ‰ nopeasti, josta 0,12 ‰ "haihtuu" lisäpalautumisena 15 s:n aikana (netto +0,30) | 1,5 s | +3 % | −4 | +2 | 60 |
| **Drinkki** | 3 × 0,6 s | +0,30 ‰ | 4 s ajan | +8 % | −3 (makea, ei janota) | +6 | 120 |
| **Vesi** | 3 × 0,5 s | −0,10 ‰ | 5 s ajan | +10 % | +20 | +5 | 0 (ei katkaise komboa, ei kasvata sitä) |

**Roolit lyhyesti:**

- **Kalja** = tasainen pohjapöhinä, mutta pissattaa nopeasti. Pisteiden pääasiallinen lähde.
- **Whisky** = vahva ja hidas. Iso promillenosto, pissattaa vähän, mutta kuivattaa kurkun → jano loppuu nopeasti. Hitaan siemailun takia kombo-ikkunan kanssa saa olla tarkkana. Paljon pisteitä per lasi.
- **Shotti** = nopea nosto kultaiselle alueelle tai pelastus, kun olet pudonnut alle. Vaikutus myös katoaa nopeasti. Pissattaa vähän – hyvä valinta, kun rakko on jo täynnä.
- **Drinkki** = keskivahva ja makea. Kuluttaa janoa tuskin lainkaan, pissattaa keskiverrosti. **Nainen tykkää:** drinkin tilaaminen naisen ollessa paikalla antaa kiinnostusta +5.
- **Vesi** = jarru. Laskee promilleja ja palauttaa janoa, mutta täyttää rakkoa.

Tilaus kestää 0,5 s. Tiskillä voi olla kerrallaan yksi juoma.

---

## 6. Snackit

Ei muuta ruokaa kuin snackit.

| Snack | Syöntiaika | Janovaikutus | Vatsa | Promillet (suola) | Erityistä |
|---|---|---|---|---|---|
| **Pähkinät** 🥜 | 1,5 s | +2/s 15 s ajan (yht. +30) | +8 | −0,02 ‰ | Pitkäkestoinen, tasainen |
| **Sipsit** 🥔 | 2,0 s | +40 heti | +15 | −0,03 ‰ | Lyhyt piikki: seuraavat 10 s juominen kuluttaa janoa ×1,5 ("suola polttaa"). Naisen edessä: kiinnostus −3 / annos |

**Mistä snackit saa:**

| Lähde | Toiminta | Lähtöarvo |
|---|---|---|
| Kulho tiskillä | Ilmainen, täyttyy ajoittain | 3 annosta (satunnainen pähkinä/sipsi), täyttyy 30 s välein (22:00 jälkeen 40 s) |
| Baarimikolta ostaminen | Maksetaan pisteillä | Pähkinät 150 p, sipsit 200 p |
| Nainen tarjoaa | Tasolta 3 alkaen | 25 s välein ilmainen pähkinäannos tai drinkki |

**Ylensyönti:** 3 snackia 20 s sisällä → vatsa +10 lisää ja kaveri huomauttaa (ks. vihjeet).

---

## 7. Nainen (v0.4: kosteuspohjainen eteneminen)

Flirttaileva baarin vakiokävijä. Humalassa pitää pysyä kuten ennenkin: hän kiinnostuu vain, kun olet **hauska eli kultaisella alueella**. Eteneminen ei enää perustu täydellisten tehtävien laskuriin, vaan **pikkuhousujen kosteuteen (0–100 %)**: jokainen tehtävä antaa laatuarvosanan 0–1, ja kosteutta tulee laadun mukaan. Osittainenkin onnistuminen auttaa – kaikkien ei tarvitse olla täydellisiä.

### 7.1 Saapuminen ja kosteus

| Parametri | Arvo |
|---|---|
| Saapuu | 12 s (kumulatiivisesti) kultaisella alueella ja kello ≥ 21:00 |
| Esittäytyy | Kertoo nimensä heti ("Moi! Mä oon Riikka.") – muista se! |
| Kosteus alussa | 10 % (palatessa vähintään 80 % nykyisen tason rajasta) |
| Kosteus alueella / alueen ulkopuolella | +0,15 %/s / −1 %/s |
| Tehtävän onnistuminen | + laatu × 25 % |
| Epäonnistuminen | −6 % (kuivattaa hieman) |
| Kosteus 0 % | Hän lähtee, palaa 25 s:n jäähyn jälkeen. **Saavutettu taso säilyy.** |
| Vessa | −5 %, ajastimet pysähtyvät |
| Oksennus | Hän lähtee heti |

**Pikkuhousut-ikoni** (sarjakuvamainen, ei graafinen): *kuivat* (< 34 %, vaaleanpunainen) → *kosteat* (34–66 %, tummempi + pisara) → *märät* (67–99 %, tumma + pisaroita) → *läpimärät* (100 %). Tumma läikkä kasvaa kosteuden mukana, ja prosentti näkyy ikonin alla.

### 7.2 Minitehtävät

Ensimmäinen tehtävä 4 s saapumisen jälkeen, sitten **6–10 s välein** – vain kultaisella alueella, ja vain kun et ole kesken hörpyn. Ennen jokaista tehtävää tulee **iso 3-2-1-laskenta** piippauksineen (ja "GO!"-ääni). Pelimaailma (kello ja mittarit) pysähtyy tehtävän ajaksi. Tehtävä arvotaan viidestä. Vaikeus **d = 0…1** kasvaa promillejen mukaan kultaisen alueen alarajalta (0,8) ylärajalle (1,6).

| Tehtävä | Toiminta | Laatu 0–1 | Helppo (d=0) → vaikea (d=1) |
|---|---|---|---|
| **Vitsin ajoitus** 😂 | Osoitin liikkuu edestakaisin, napauta "hauska"-alueella | Alueen keskellä 1,0, reunalla 0,35, ohi = epäonnistui | Alue 28 % → 14 %, nopeus 55 → 115 %/s, täriseminen 0 → 8 %, aikaraja 6 s |
| **Skoolaus** 🥂 | Kaksi tuoppia liukuu ruudun reunoilta toisiaan kohti, napauta kun ne kohtaavat | Täsmälleen kohdatessa 1,0, toleranssin reunalla 0,25. Liian aikaisin/myöhään = **juoma läikkyy** (epäonnistui). Tarkempi ajoitus = kovempi ja kirkkaampi kilinä + vahvempi tärinä | Liukuaika 1,6 → 1,0 s, toleranssi ±0,20 → ±0,11 s |
| **Tikanheitto** 🎯 | Tähtäin heiluu 10-rengastaulun päällä, heitä kun se on keskellä. **Ei aikarajaa.** | 7 = 0,4 · 8 = 0,6 · 9 = 0,8 · 10 (**napakymppi**) = 1,0. Alle 7 = epäonnistui | Heilunta 35 → 85 px, nopeus 1,0 → 2,0. Taulun säde 100 px, rengas 10 px |
| **Tanssi** 💃 | osu!-tyyliin ympyröitä ilmestyy satunnaisiin kohtiin, napauta jokainen ennen kuin se kutistuu pois | Per ympyrä 50 % tarkkuus (osuma keskelle) + 50 % nopeus (aikaisin). Keskiarvo kaikista (ohi = 0). Alle 0,3 = epäonnistui | 6 ympyrää, väli 750 → 520 ms, elinaika 1,5 → 0,95 s, säde 38 → 30 px, heilunta 0 → 14 px |
| **Nimen muistaminen** 🧠 | Valitse hänen nimensä kolmesta | Oikein heti 1,0, aikarajan lopussa 0,5. Väärin/aika loppui = epäonnistui | d ≥ 0,5: vaihtoehdot lähes samannäköisiä (Riikka/Riitta/Riina), sumeus 0 → 3 px, aikaraja 6 s |

Palaute tulee hänen puhekuplassaan: "TÄYDELLISTÄ! 😍 +25 💦", "Ihan ok 🙂 +12 💦", "NAPAKYMPPI! 🎯" tai hauska piikki ("Liian aikaisin! Kalja läikkyi pöydälle. −6 💦").

### 7.3 Tasot (kosteusrajat)

Taso laukeaa, kun kosteus ylittää rajan, ja **saavutettu taso säilyy**, vaikka kosteus laskisi.

| Taso | Kosteus ≥ | Nimi | Ele / kommentti | Palkinto | Pistekerroin |
|---|---|---|---|---|---|
| 0 | 0 % | Ei kiinnostunut | – | – | ×1,0 |
| 1 | 15 % | Kiinnostunut | 🙂 "Hän hymyilee." | – | ×1,0 |
| 2 | 35 % | Numero saatu | 📱 "Hän kirjoittaa numeronsa sun käteen!" | +300 p | ×1,2 |
| 3 | 55 % | Läheisyyttä | 🤗 "Hän nojaa lähemmäs ja koskettaa käsivartta." | Tarjoaa 25 s välein snackin tai drinkin | ×1,5 |
| 4 | 78 % | Pusu saatu | 💋 "MUAH! Koko baari viheltää." | +1 000 p | ×2,0 |
| 5 | 100 % (läpimärät) | Pano onnistui | 🚕❤️ "Lähdetäänkö meille?" | +3 000 p + aikabonus, **ilta päättyy** | ×3,0 |

Kaikki eleet ovat sarjakuvamaisia emojeja, ei mitään eksplisiittistä. Hyvällä illalla (keskilaatu ~0,8) pano onnistuu noin 6 tehtävällä, keskinkertaisella (~0,5) noin 8–9 tehtävällä.

## 8. Kombot ja SKOOL!

| Parametri | Lähtöarvo |
|---|---|
| Kombo-ikkuna | Seuraava juoma (kalja/whisky/shotti/drinkki) aloitettava 10 s sisällä edellisen loppumisesta (Päivä 1) |
| Kertoimet | 1–2 juomaa ×1 · 3–4 ×1,5 · 5–7 ×2 · 8+ ×3 |
| Kombo katkeaa | Ikkuna umpeutuu, vessakäynti, oksennus |
| Vesi | Ei katkaise eikä kasvata komboa |
| Kultainen alue -lisä | Kombokerroin +0,5, jos juoma juodaan alueella |

**SKOOL!:** Ravista puhelinta (tai napauta SKOOL!-nappia) 2,5 s sisällä kaljan viimeisestä hörpystä → +50 p ja seuraavan juoman hörpyt 30 % nopeampia.

**Ravistuksen tunnistus (v0.3):** `devicemotion` → ensisijaisesti `acceleration` (ilman painovoimaa), muuten `accelerationIncludingGravity`, josta painovoima poistetaan alipäästösuodattimella. Raja 13 m/s², 600 ms jäähy. Vaatii https:n (GitHub Pages OK). v1:n vika: raja 22 m/s² painovoiman kanssa ja vain 1 s ikkuna → käytännössä ei koskaan lauennut. Laitetesti-nappi (📳) näyttää, tuleeko anturidataa.

---

## 9. Vihjeet ja varoitukset

Vihjeet tulevat **kaverin / sisäisen äänen** puhekuplina (kaveri "Make"). Samaan aikaan liittyvä mittari vilkkuu ja hahmon ilme muuttuu. Kupla näkyy 2,5 s. Saman vihjeen jäähy 15 s, kahden eri vihjeen väli vähintään 4 s. Prioriteetti: hengenvaara (sammuminen/housut) > oksennus > muut.

| # | Laukaisin | Teksti | Mittari / ilme |
|---|---|---|---|
| 0 | Pelin alku | "Etkot hoidettu, nyt mennään! Pidä promillet kultaisella alueella." | – |
| 1 | Promillet < 0,5 ja kulunut > 10 s | "Oot ihan kuiva, kukaan ei naura sun jutuille. Tilaa jotain!" | Promillet vilkkuu sinisenä / tylsistynyt |
| 2 | Ensimmäinen kerta kultaisella alueella | "Nyt sä oot tähti! Jatka samaa tahtia." | Kultainen hehku / leveä virne |
| 3 | Promillet ≥ 1,8 | "Huone pyörii... ehkä vähän vettä?" | Keltainen vilkku / vihreä naama |
| 4 | Promillet ≥ 2,5 | "Silmät painuu. Viimeinen shotti voi olla viimeinen ikinä." | Punainen vilkku / puoliummessa |
| 5 | Rakko ≥ 75 % | "Jalat ristissä, nyt vessaan tai housut kastuu!" | Rakko vilkkuu / kiemurtelu |
| 6 | Rakko ≥ 90 % | "EI. ENÄÄ. YHTÄÄN. Vessa. NYT." | Nopea vilkku + värinä / tuskainen |
| 7 | Jano < 15 | "Kalja ei maistu, kurkku kuin hiekkapaperia. Sipsiä!" | Jano vilkkuu / yskii |
| 9 | Kello 01:50 | "Kymmenen minuuttia valomerkkiin!" | Kello vilkkuu |
| 10 | Kombo 5 | "Rytmi on hallussa! Baarimikko nyökkää hyväksyvästi." | Kombo-teksti kultaa |
| 11 | Kombo katkesi (≥ 3) | "Äh, rytmi meni. Uusi tuoppi alle!" | – / harmistunut |
| 12 | Vatsa ≥ 80 | "Vatsa on kuin vesisänky. Varo nyt." | Vatsa vilkkuu / pullistunut |
| 13 | 3 snackia 20 s sisällä | "Tulitko syömään vai juomaan?" | Vatsa vilkkuu |
| 14 | Sipsejä naisen edessä | "Vähän vähemmän rouskutusta, hän katsoo..." | Sydän himmenee |
| 15 | Kulho täyttyi | "Kulho täynnä! Ilmaista suolaista!" | Kulho kimaltaa |
| 16 | Nainen saapuu | "Katso, kuka tuli! Älä mokaa." | Sydänmittari ilmestyy |
| 18 | Kiinnostus < 20 | "Hän vilkuilee ovelle. Sano jotain hauskaa!" | Sydän vilkkuu |
| 19 | Promillet putoaa alueelta alas naisen ollessa paikalla | "Sä alat olla tylsä. Shotti piristäis!" | Promillet vilkkuu |
| 21 | Oksennuksen jälkeen | "No... ainakin nyt on tilaa uudelle." | Kalpea |
| 22 | 1. oksennuksen jälkeen (heti #21:n perään) | "Se oli sun ainoo jokeri. Seuraava oksennus ja ilta on ohi." | Vatsamittari punaisella reunuksella loppuillan |
| 23 | Ei juomaa 8 s (alueella) | "Tuoppi on tyhjä, kombo karkaa!" | Kombo-ajastin vilkkuu |
| 24 | Kello 00:00 | "Keskiyö! Nyt alkaa ilta kunnolla." | – |
| 25 | SKOOL! onnistui | "SKOOOL! Koko baari hurraa!" | Konfettia |
| 26 | Whiskyn jälkeen jano < 30 | "Whisky poltti kurkun. Vettä tai pähkinää, äkkiä!" | Jano vilkkuu / yskii |
| 27 | Nainen paikalla, pelaaja tilaa drinkin | "Drinkki! Hän tykkää miehestä, jolla on makua." | Sydän pomppaa |
| 28 | Promillet ≥ 1,9 ja vatsa ≥ 60, oksennus jo käytetty | "Muista: vain amatöörit oksentaa. Älä oo amatööri." | Vatsa vilkkuu / vihreä naama |
| 29 | Kaksi whiskyä 20 s sisällä | "Hidasta, cowboy. Whisky ei oo kaljaa." | Promillet vilkkuu |
| 30 | Alle alueen ennen naista | "Etkojen teho hiipuu. Tilaa kalja, nopeesti!" | – |
| 31 | Ensimmäistä kertaa yli 1,35 ‰ | "Yläkulmilla! Mitä lähempänä rajaa, sitä enemmän pisteitä." | – |
| 32 | Nainen paikalla, yli alueen | "Sä sammalat. Hän ei ymmärrä sanaakaan. Vettä!" | – |
| 33 | Tehtävän tulos | Hänen puhekuplansa (vaaleanpunainen): tasokommentti tai hauska piikki | Pikkuhousut-ikoni |

Päivä 1: vihjeet 1, 3, 5 ja 7 tulevat **ennen** varsinaista vaaraa (jo 10 % ennen rajaa ensimmäisellä kerralla), jotta uusi pelaaja oppii mittarit.

---

## 10. Lopetusehdot

| Ehto | Tyyppi | Pisteet |
|---|---|---|
| **Valomerkki 02:00** | Normaali loppu | Täydet pisteet + tähdet |
| **Taso 5: Pano onnistui (pikkuhousut läpimärät)** | Paras loppu | Täydet pisteet × 3,0 + bonukset + jäljellä olevan ajan bonus |
| **Sammuminen (≥ 2,8 ‰)** | Välitön loppu | Pisteet −30 %, enintään 1 tähti |
| **Housut märkänä (rakko 100 %)** | Välitön loppu | Pisteet −30 %, enintään 1 tähti |
| **Toinen oksennus (Päivä 1)** | Välitön loppu | Pisteet −30 %, enintään 1 tähti |

Jokaiselle loppumiselle oma hauska loppukuva (esim. hahmo nukkuu tiskillä naama pähkinäkulhossa, märkä läikkä housuissa ja koko baari osoittaa sormella).

---

## 11. Pisteytys (v0.3)

**Kaava:**

```
Pohja = Σ (juoman perusarvo × kombokerroin)
      + Humalapisteet: Σ 40 × (min(‰, 1,6) / 1,6)² per sekunti   (integraali koko illan yli)
      + SKOOL-bonukset (50 p / kpl)
      + Naisbonukset (taso 2: +300, taso 4: +1 000, taso 5: +3 000)
      + Aikabonus 5 p × jäljellä olevat pelin minuutit (vain taso 5 -loppu)
      − 200 p / oksennus − snack-ostot (150 / 200 p)
Pisteet = Pohja × tasokerroin (0–1: ×1,0 · 2: ×1,2 · 3: ×1,5 · 4: ×2,0 · 5: ×3,0)
        × 0,7 jos peli päättyi sammumiseen, housuihin tai toiseen oksennukseen
```

Humalapisteet palkitsevat siitä, että promillet pysyvät **lähellä kultaisen alueen yläreunaa** koko illan: koko ilta 1,6 ‰:ssa = 7 200 p, 1,2 ‰:ssa ≈ 4 050 p. Yli 1,6 ‰ ei anna lisää, vain riskiä.

**Tähdet (Päivä 1):**

| Tähdet | Raja | Mitä yleensä vaatii |
|---|---|---|
| ★ | 5 000 p | Selvisit valomerkkiin |
| ★★ | 12 000 p | Hieno kännäilta ilman naista tai numero saatu |
| ★★★ | 25 000 p | Kova humala koko illan + taso 4–5 |

**Testiajot (botti, v3):** satunnaisesti napauttava botti (tehtävälaatu ~0,2) → taso 1–2, 8 000–10 000 p (★). Taitava botti (laatu ~0,8) → pano 113–156 s:ssa, 30 000–36 000 p (★★★).

**Loppuruutu:** saavutettu taso nimellä ("Numero saatu", "Pano onnistui"), tehtävät onnistui/yritetty, erittely (juomapisteet, humalapisteet + keskipromillet, SKOOL, naisbonukset, aikabonus, oksennukset, snackit, pohja, kerroin), juomat, pisin kombo, aika alueella, vessakäynnit.

## 11b. Äänet ja haptiikka (v0.3)

Kaikki äänet syntetisoidaan WebAudiolla (ei äänitiedostoja). Ääni avataan ensimmäisellä napautuksella (Aloita ilta). Mykistys 🔊/🔇.

| Tapahtuma | Ääni | Tärinä (ms) |
|---|---|---|
| Tilaus | Pullon poksahdus (kalja/drinkki), kilahdus (muut) | 30 |
| Hörppy | Kulaus | 10 |
| Shotti juotu | Lasin pamaus tiskiin | – |
| Kalja juotu | Röyhtäys (30 %) | – |
| Vessa | Vessan veto | – |
| Oksennus | Oksennus | 200-80-300 |
| Varoitukset (vaara) | – | 60-60-60 |
| Nainen saapuu / tehtävä | Kikatus | – |
| 3-2-1-laskenta | Piippaus 3×, korkea "GO!" | 10 / numero |
| Skoolaus onnistui | Kilinä, voimakkuus ja kirkkaus laadun mukaan | 10 tai 40-40-40-40-120 (laatu > 0,8) |
| Tanssi: ympyrä ilmestyy / osuma | Pieni piippaus / nouseva sävel | 10 / osuma |
| Kombo ≥ 3 | Arpeggio | – |
| SKOOL! | Sointu + hurraus | 50-30-50 |
| Tehtävä onnistui / epäonnistui | Nouseva / laskeva sävel (+ pusu tasolla 4) | 40-40-40-40-120 / 300 |
| Valomerkki | Kello ×3 | 100-100-100-100-300 |
| Taustalla | Hiljainen baarin humina + puheensorina | – |

## 11c. Naisen ääni (v0.5)

Naisen reaktiot syntetisoidaan **formanttisynteesillä** WebAudiolla (ei äänitiedostoja): pehmeä glottaalinen aalto + vibrato + hengityskohina kolmen formanttisuotimen läpi (naisen vokaalit a/o/u/i/e/ä + nasaali "m"). Sävy on kevyt ja flirttaileva, ei eksplisiittinen.

| Tapahtuma | Ääni |
|---|---|
| Hän saapuu / palaa | "Hei~" + pieni kikatus |
| Tehtävä alkaa | Hiljainen kikatus |
| Tehtävä onnistui, laatu < 0,7 | Kikatus (pituus ja voimakkuus laadun mukaan) |
| Tehtävä onnistui, laatu ≥ 0,7 | "Oooh" (korkeus laadun mukaan) |
| Täydellinen (napakymppi, skoolaus ≥ 0,9, laatu ≥ 0,95) | Kiljahdus + kikatus |
| Kosteus ≥ 34 % onnistumisen jälkeen | Huokaus "aah", voimistuu ja nousee kosteuden myötä |
| Epäonnistui / läikkyi | "Hmph" |
| Taso 1 (kiinnostunut) | "Mmm" |
| Taso 2 (numero) | "Oooh" + kikatus |
| Taso 3 (läheisyyttä) | "Mmm" + huokaus |
| Taso 4 (pusu) | Pusu "mwah" |
| Taso 5 (pano) | "Ooh!" + kiljahdus + kikatus + huokaus |
| Liian selvä / liian kännissä hänen seurassaan | Tylsistynyt huokaus |
| Kosteus 0 → hän lähtee | "Hmph" |
| Tilaat drinkin hänen seurassaan | "Mmm" |
| Oksennat hänen seurassaan | "Yyh!" (inho) |

**Säädöt:** `CONFIG.voice = { volume: 0.8, cooldownSec: 1.2, kindCooldown: {sigh:8, aah:4, yuck:3, hello:5, giggle:1.5} }`. Ääni ei soi, jos edellinen on alle 1,2 s vanha ja yhtä tai vähemmän tärkeä, eikä sama ääni toistu omaa jäähyään useammin. Yläpalkin 💋/🚫 kytkee pelkän naisen äänen pois (muistetaan), 🔊/🔇 mykistää kaiken. Aloitusruudun "Kuuntele hänen äänensä" -napilla voi kuunnella kaikki äänet vuorotellen.

## 12. Vaikeus Päivän 1 sisällä

Päivä 1 on armollinen: leveä alue, hitaat mittarit, vihjeet ajoissa. Illan sisällä tahti kiristyy kolmessa vaiheessa.

| Vaihe | Kello (reaaliaika) | Muutokset |
|---|---|---|
| **Lämmittely** | 20:00–22:00 (0–60 s) | Kaikki lähtöarvot. Vihjeet tulevat aikaisin. Kulho 30 s välein. Ei naista ennen 21:00 |
| **Ruuhka** | 22:00–00:00 (60–120 s) | Kulho 40 s välein. Rakko passiivisesti +0,25 %/s. Nainen todennäköisesti paikalla |
| **Loppukiri** | 00:00–02:00 (120–180 s) | Kombo-ikkuna 8 s. 01:00 tapahtuma "Viimeinen kierros": shotit tuplapisteillä 20 s ajan. 01:50 varoitus valomerkistä |

Naisen tehtävät vaikeutuvat promillejen mukana (luku 7.2), eivät kellon mukaan.

**Päivä 1 -turvaverkot:**

- Ensimmäisellä kerralla rakko 100 %:ssa: armonaika 2 s, jossa vessaan ehtii vielä (vain kerran per kierros).
- Ensimmäinen ylitys 2,5 ‰:n yli: hahmo "säpsähtää hereille" ja promillet −0,1 ‰ (vain kerran).
- Tutoriaalikuplat kolmen ensimmäisen pelikerran aikana (ei vielä toteutettu; aloitusruudulla ohjeet).

---

## 13. Teaser: Päivä 2 – Lauantai, krapula

> "Eilen oli hauskaa. Tänään... ei niin."

- **Kovempi alku:** promillet alkavat 0,0 ‰:sta, mutta **krapulamittari** on täynnä. Krapula pienentää kultaista aluetta ja tekee hahmosta ärtyisän (nainen ei kiinnostu).
- **Tasoittavat:** ensimmäiset 2–3 juomaa poistavat krapulaa – mutta liian nopeasti juotuna oksennusraja on alempana.
- **Toleranssi kasvanut:** kalja nostaa promilleja vähemmän (esim. ×0,85) → enemmän juomia samaan humalaan → rakko on kovemmilla.
- **Vain amatöörit oksentaa:** Päivästä 2 alkaen jo ensimmäinen oksennus lopettaa illan. Kaveri muistuttaa heti alussa: "Eilen sulla oli yks jokeri. Tänään ei oo. Vain amatöörit oksentaa."
- **Kapeampi alue** (esim. 1,0–1,5 ‰), nopeammat mittarit, vihjeet myöhemmin.
- Mahdollisia uusia asioita: lonkero, kebab-luukku valomerkin jälkeen, eilisen naisen paluu ("Muistatko mut?").

---

## 14. Avoimet kysymykset

1. **Valuutta:** Riittävätkö pisteet snack-ostoihin, vai tarvitaanko erillinen raha (€), jolla myös juomat maksetaan?
2. **Juomat ilmaisia?** Arcade-tyylissä nyt kyllä. Pitäisikö juomilla olla hinta (esim. whisky kallein), jotta valinnoissa olisi lisää painoa?
3. **Hahmon valinta:** Voiko pelaaja valita hahmon/sukupuolen ja kiinnostuksen kohteen?
4. **SKOOL-ravistus:** Häiritseekö ravistus pelaamista? Vaihtoehtona tuplanapautus. Toimiiko SKOOL myös whiskyllä/drinkillä vai vain kaljalla?
5. **Ääni:** Oma soundtrack, joka "humaltuu" (tempo/sävelkorkeus heiluu) promillejen mukaan?
6. **Tasapaino:** Onko 5 s vessakäynti + kombon nollaus liian rankka, kun kaljatahdilla rakko täyttyy n. minuutissa? Vaihtoehto: kombo puolittuu.
7. **Whiskyn tasapaino:** Onko 150 p per whisky liian houkutteleva, kun se pissattaa vähän? Testattava, ettei "pelkkä whisky" ole ylivoimainen strategia.

**Päätetty (suljetut kysymykset):**

- **Naisen voittoehto (v0.4):** pikkuhousut läpimärät (kosteus 100 %), kertyy tehtävien laadusta (korvaa v0.3:n 5 onnistumista ja v0.2:n 5 tarjottua juomaa).
- **Oksennus Päivä 1:** yksi sallitaan, toinen lopettaa pelin. Myöhemmät päivät: jokainen oksennus lopettaa.
- **Käyttö:** henkilökohtainen projekti, ei julkaisua → kauppapaikkojen säännöt, ikärajat, ansaintamalli ja alkoholin mainontalaki eivät koske tätä.
- **Brändit:** ei brändejä, juomat geneerisiä (Kalja, Whisky, Shotti, Drinkki).

---

*Loppu. Kippis! 🍺*
