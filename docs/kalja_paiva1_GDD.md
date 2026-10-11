# KALJA! – Päivä 1: Perjantai-ilta
## Pelisuunnitteludokumentti (GDD) v0.2

**Tekijä:** Teijo Rutanen | **Päivämäärä:** 11.10.2026 | **Versio:** v0.2 | **Laajuus:** Päivä 1 + lyhyt Päivä 2 -teaser

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
4. Pysy alueella → nainen saapuu → hyväksy tarjouksia → lähtekää yhdessä.

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
| Hyväksy / kieltäydy naisen tarjouksesta | Napauta ✔ tai ✖ puhekuplassa | 5 s aikaa, muuten = kieltäytyminen |
| SKOOL! (valinnainen) | Ravista puhelinta 1 s sisällä kaljan viimeisestä hörpystä | Bonus, ks. kombot |

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
| Aloitusarvo | 0,3 ‰ | "Otettiin pari kotona" |
| Kultainen alue (Päivä 1) | 0,8–1,6 ‰ | Leveä ja armollinen |
| Varoitusraja | 1,8 ‰ | Huone alkaa pyöriä, mittari vilkkuu keltaisena |
| Oksennusraja (perus) | 2,0 ‰ | Laskee vatsan täyttyessä (ks. 4.4) |
| Sammumisen varoitus | 2,5 ‰ | Silmät painuu, mittari vilkkuu punaisena |
| Sammuminen | 2,8 ‰ | **Peli päättyy heti** |
| Palautuminen | 0,010 + 0,0125 × promillet ‰/s | Mitä kovempi humala, sitä nopeammin laskee |
| Imeytyminen | Juoman vaikutus tulee viiveellä (ks. juomataulukko) | Estää "piikin" yhdestä napista |

**Miksi tämä kaava?** Tasaisella tahdilla (1 kalja / 8 s) promillet asettuvat noin **1,2 ‰:iin** eli suoraan kultaisen alueen keskelle. Nopeampi tahti nostaa yli, hitaampi tiputtaa alle. Rytmi on siis koko pelin ydin.

**Humalaefektit:**

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
| Tyhjeneminen | −0,4/s | |
| Oksennusrajan lasku | Kun vatsa > 60: raja = 2,0 − (vatsa − 60) × 0,01 ‰ | Vatsa 100 → raja 1,6 ‰ |
| Vatsa täynnä | 100 | Oksennus heti promilleista riippumatta |

**Oksennus (ei lopeta peliä):** 4 s animaatio, juotujen juomien laskurista −2, kombo → 0, promillet −0,40 ‰, vatsa → 0, pisteet −200. Jos nainen on paikalla, hän lähtee (ks. luku 7).

**Päivä 1: yksi oksennus sallitaan** (rangaistus kuten yllä). **Toinen oksennus = ilta ohi**, peli päättyy heti. Myöhemmillä päivillä jo ensimmäinen oksennus lopettaa pelin ("vain amatöörit oksentaa", ks. luku 13).

### 4.5 Naisen kiinnostus (0–100)

Näkyy sydänmittarina vasta, kun nainen on paikalla. Logiikka luvussa 7.

---

## 5. Juomat

| Juoma | Hörppyjä | Promillet | Imeytyminen | Rakko | Jano | Vatsa | Pisteet |
|---|---|---|---|---|---|---|---|
| **Kalja** | 5 × 0,5 s | +0,20 ‰ | 10 s ajan tasaisesti | +12 % | −10 | +8 | 100 |
| **Whisky** | 4 × 0,8 s (hidas siemailu) | +0,35 ‰ | 15 s ajan tasaisesti | +4 % | −15 (kuivattaa kurkkua) | +3 | 150 |
| **Shotti** | 1 × 0,5 s | +0,30 ‰ nopeasti, josta 0,15 ‰ "haihtuu" lisäpalautumisena 15 s:n aikana (netto +0,15) | 2 s | +3 % | −4 | +2 | 60 |
| **Drinkki** | 3 × 0,6 s | +0,22 ‰ | 8 s ajan | +8 % | −3 (makea, ei janota) | +6 | 120 |
| **Vesi** | 3 × 0,5 s | −0,10 ‰ | 10 s ajan | +10 % | +20 | +5 | 0 (ei katkaise komboa, ei kasvata sitä) |

**Roolit lyhyesti:**

- **Kalja** = tasainen pohjapöhinä, mutta pissattaa nopeasti. Pisteiden pääasiallinen lähde.
- **Whisky** = vahva ja hidas. Iso promillenosto, pissattaa vähän, mutta kuivattaa kurkun → jano loppuu nopeasti. Hitaan siemailun takia kombo-ikkunan kanssa saa olla tarkkana. Paljon pisteitä per lasi.
- **Shotti** = nopea nosto kultaiselle alueelle tai pelastus, kun olet pudonnut alle. Vaikutus myös katoaa nopeasti. Pissattaa vähän – hyvä valinta, kun rakko on jo täynnä.
- **Drinkki** = keskivahva ja makea. Kuluttaa janoa tuskin lainkaan, pissattaa keskiverrosti. **Nainen tykkää:** drinkin juominen naisen ollessa paikalla antaa kiinnostusta +5.
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
| Nainen tarjoaa | Kun olet hauska (kultaisella alueella ja kiinnostus ≥ 50) | 1 ilmainen pähkinäannos / 30 s, hyväksyminen +5 kiinnostus |

**Ylensyönti:** 3 snackia 20 s sisällä → vatsa +10 lisää ja kaveri huomauttaa (ks. vihjeet).

---

## 7. Nainen

Flirttaileva baarin vakiokävijä. Hän ei ole palkinto vaan pelin "pomomoodi": koko mittaristo pitää pitää kurissa samaan aikaan, kun hän tarjoaa lisää juotavaa.

### 7.1 Tilakone

| Tila | Sisään kun | Mitä tapahtuu | Ulos kun |
|---|---|---|---|
| **POISSA** | Pelin alku / jäähy ohi | Laskuri kerää aikaa kultaisella alueella | 20 s (kumulatiivisesti) alueella ja kello ≥ 21:00 → SAAPUU |
| **SAAPUU** | Ehto täyttyi | 2 s animaatio, kaveri: "Katso, kuka tuli!" Kiinnostus = 30 | Automaattisesti → JUTTELU |
| **JUTTELU** | Saapuminen / tarjous käsitelty | Kiinnostus +1/s alueella, −2/s alueen ulkopuolella. Voi tarjota snackin | 12 s kulunut → TARJOUS. Kiinnostus 0 → LÄHTEE YKSIN |
| **TARJOUS** | 12 s juttelua | Puhekupla "Otetaanko yhdet?" + ✔/✖, 5 s aikaa | ✔ → HYVÄKSYTTY. ✖ / aikakatkaisu → KIELTÄYTY |
| **HYVÄKSYTTY** | ✔ | Juoma tiskille, juodaan normaalisti. Kiinnostus +15, tarjouslaskuri +1 | Laskuri = 5 → LÄHTEE KANSSASI. Muuten → JUTTELU |
| **KIELTÄYTY** | ✖ | Kiinnostus −10, promillet −0,10 ‰ ("tylsistyit") | Kiinnostus ≤ 0 → LÄHTEE YKSIN, muuten → JUTTELU |
| **LÄHTEE YKSIN** | Kiinnostus 0 tai oksennus (ks. alla) | Hän lähtee, kiinnostus ja tarjouslaskuri nollautuvat | 30 s jäähy → POISSA |
| **LÄHTEE KANSSASI** | 5 tarjousta juotu ilman oksennusta/sammumista/housuja | **Iso bonus, kierros päättyy** | – |

**Erikoistapaukset:**

- **Oksennus** naisen ollessa paikalla → LÄHTEE YKSIN (tarjouslaskuri nollautuu).
- **Vessakäynti** naisen ollessa paikalla: sallittu, mutta kiinnostus −5 ("Älä oo kauaa!"). Tarjous ei vanhene vessassa ollessa, ajastin pysähtyy.
- **Housut märkänä / sammuminen** → peli päättyy joka tapauksessa.

### 7.2 Naisen tarjoamat juomat

| Tarjous # | Juoma | Huomio |
|---|---|---|
| 1 | Kalja | Helppo aloitus |
| 2 | Drinkki | Hänen lempijuomansa: hyväksyminen +5 lisäkiinnostusta (yht. +20) |
| 3 | Shotti | |
| 4 | Whisky | Raskas, vie janoa – snack ennen tätä auttaa |
| 5 | Tuplashotti (+0,40 ‰, rakko +5 %, jano −6) | Finaali – tähän pitää jättää promilleille tilaa |

Naisen tarjoamat juomat lasketaan normaalisti juotuihin ja kasvattavat komboa.

---

## 8. Kombot ja SKOOL!

| Parametri | Lähtöarvo |
|---|---|
| Kombo-ikkuna | Seuraava juoma (kalja/whisky/shotti/drinkki) aloitettava 10 s sisällä edellisen loppumisesta (Päivä 1) |
| Kertoimet | 1–2 juomaa ×1 · 3–4 ×1,5 · 5–7 ×2 · 8+ ×3 |
| Kombo katkeaa | Ikkuna umpeutuu, vessakäynti, oksennus |
| Vesi | Ei katkaise eikä kasvata komboa |
| Kultainen alue -lisä | Kombokerroin +0,5, jos juoma juodaan alueella |

**SKOOL! (valinnainen):** Ravista puhelinta 1 s sisällä kaljan viimeisestä hörpystä → +50 p ja seuraavan juoman hörpyt 30 % nopeampia. Asetuksista voi kytkeä pois (silloin bonusta ei saa, mutta mitään ei menetä muuten).

---

## 9. Vihjeet ja varoitukset

Vihjeet tulevat **kaverin / sisäisen äänen** puhekuplina (kaveri "Make"). Samaan aikaan liittyvä mittari vilkkuu ja hahmon ilme muuttuu. Kupla näkyy 2,5 s. Saman vihjeen jäähy 15 s, kahden eri vihjeen väli vähintään 4 s. Prioriteetti: hengenvaara (sammuminen/housut) > oksennus > muut.

| # | Laukaisin | Teksti | Mittari / ilme |
|---|---|---|---|
| 1 | Promillet < 0,5 ja kulunut > 10 s | "Oot ihan kuiva, kukaan ei naura sun jutuille. Tilaa jotain!" | Promillet vilkkuu sinisenä / tylsistynyt |
| 2 | Ensimmäinen kerta kultaisella alueella | "Nyt sä oot tähti! Jatka samaa tahtia." | Kultainen hehku / leveä virne |
| 3 | Promillet ≥ 1,8 | "Huone pyörii... ehkä vähän vettä?" | Keltainen vilkku / vihreä naama |
| 4 | Promillet ≥ 2,5 | "Silmät painuu. Viimeinen shotti voi olla viimeinen ikinä." | Punainen vilkku / puoliummessa |
| 5 | Rakko ≥ 75 % | "Jalat ristissä, nyt vessaan tai housut kastuu!" | Rakko vilkkuu / kiemurtelu |
| 6 | Rakko ≥ 90 % | "EI. ENÄÄ. YHTÄÄN. Vessa. NYT." | Nopea vilkku + värinä / tuskainen |
| 7 | Jano < 15 | "Kalja ei maistu, kurkku kuin hiekkapaperia. Sipsiä!" | Jano vilkkuu / yskii |
| 8 | Naisen kiinnostus +15 (hyväksytty tarjous) | "Hän nauroi sun vitsille!" | Sydän pomppaa / ylpeä |
| 9 | Kello 01:50 | "Kymmenen minuuttia valomerkkiin!" | Kello vilkkuu |
| 10 | Kombo 5 | "Rytmi on hallussa! Baarimikko nyökkää hyväksyvästi." | Kombo-teksti kultaa |
| 11 | Kombo katkesi (≥ 3) | "Äh, rytmi meni. Uusi tuoppi alle!" | – / harmistunut |
| 12 | Vatsa ≥ 80 | "Vatsa on kuin vesisänky. Varo nyt." | Vatsa vilkkuu / pullistunut |
| 13 | 3 snackia 20 s sisällä | "Tulitko syömään vai juomaan?" | Vatsa vilkkuu |
| 14 | Sipsejä naisen edessä | "Vähän vähemmän rouskutusta, hän katsoo..." | Sydän himmenee |
| 15 | Kulho täyttyi | "Kulho täynnä! Ilmaista suolaista!" | Kulho kimaltaa |
| 16 | Nainen saapuu | "Katso, kuka tuli! Älä mokaa." | Sydänmittari ilmestyy |
| 17 | Tarjous auki 3 s | "No otatko vai et? Hän odottaa!" | Kupla sykkii |
| 18 | Kiinnostus < 20 | "Hän vilkuilee ovelle. Sano jotain hauskaa!" | Sydän vilkkuu |
| 19 | Promillet putoaa alueelta alas naisen ollessa paikalla | "Sä alat olla tylsä. Shotti piristäis!" | Promillet vilkkuu |
| 20 | Tarjous 4/5 hyväksytty | "Vielä yks ja te lähdette yhdessä!" | Sydän hehkuu |
| 21 | Oksennuksen jälkeen | "No... ainakin nyt on tilaa uudelle." | Kalpea |
| 22 | 1. oksennuksen jälkeen (heti #21:n perään) | "Se oli sun ainoo jokeri. Seuraava oksennus ja ilta on ohi." | Vatsamittari punaisella reunuksella loppuillan |
| 23 | Ei juomaa 8 s (alueella) | "Tuoppi on tyhjä, kombo karkaa!" | Kombo-ajastin vilkkuu |
| 24 | Kello 00:00 | "Keskiyö! Nyt alkaa ilta kunnolla." | – |
| 25 | SKOOL! onnistui | "SKOOOL! Koko baari hurraa!" | Konfettia |
| 26 | Whiskyn jälkeen jano < 30 | "Whisky poltti kurkun. Vettä tai pähkinää, äkkiä!" | Jano vilkkuu / yskii |
| 27 | Nainen paikalla, pelaaja tilaa drinkin | "Drinkki! Hän tykkää miehestä, jolla on makua." | Sydän pomppaa |
| 28 | Promillet ≥ 1,9 ja vatsa ≥ 60, oksennus jo käytetty | "Muista: vain amatöörit oksentaa. Älä oo amatööri." | Vatsa vilkkuu / vihreä naama |
| 29 | Kaksi whiskyä 20 s sisällä | "Hidasta, cowboy. Whisky ei oo kaljaa." | Promillet vilkkuu |

Päivä 1: vihjeet 1, 3, 5 ja 7 tulevat **ennen** varsinaista vaaraa (jo 10 % ennen rajaa ensimmäisellä kerralla), jotta uusi pelaaja oppii mittarit.

---

## 10. Lopetusehdot

| Ehto | Tyyppi | Pisteet |
|---|---|---|
| **Valomerkki 02:00** | Normaali loppu | Täydet pisteet + tähdet |
| **Nainen lähtee kanssasi** | Paras loppu | Täydet pisteet + naisbonus + jäljellä olevan ajan bonus |
| **Sammuminen (≥ 2,8 ‰)** | Välitön loppu | Pisteet −30 %, enintään 1 tähti |
| **Housut märkänä (rakko 100 %)** | Välitön loppu | Pisteet −30 %, enintään 1 tähti |
| **Toinen oksennus (Päivä 1)** | Välitön loppu | Pisteet −30 %, enintään 1 tähti |

Jokaiselle loppumiselle oma hauska loppukuva (esim. hahmo nukkuu tiskillä naama pähkinäkulhossa, märkä läikkä housuissa ja koko baari osoittaa sormella).

---

## 11. Pisteytys

**Kaava:**

```
Pisteet = Σ (juoman perusarvo × kombokerroin)
        + 10 × sekunnit kultaisella alueella
        + SKOOL-bonukset (50 p / kpl)
        + Naisbonus 1 500 p (jos lähtee kanssasi)
        + Aikabonus 5 p × jäljellä olevat pelin minuutit (vain naisloppu)
        − 200 p / oksennus
        − snack-ostot (150 / 200 p)
Lopuksi: × 0,7 jos peli päättyi sammumiseen, housuihin tai toiseen oksennukseen
```

**Tähdet (Päivä 1):**

| Tähdet | Raja | Mitä yleensä vaatii |
|---|---|---|
| ★ | 1 500 p | Selvisit valomerkkiin asti |
| ★★ | 3 500 p | Hyvä rytmi ja paljon aikaa alueella |
| ★★★ | 6 000 p | Käytännössä vaatii naisen lähtemään kanssasi |

**Tarkistuslasku:** n. 18 juomaa (pääosin kaljaa, välissä whiskyä/drinkkejä) × keskiarvo ~105 p × keskikerroin ~2 ≈ 3 800 + 120 s alueella × 10 = 1 200 → n. 5 000 p ilman naista. Nainen tuo +1 500 p ja aikabonuksen → 3 tähteä mahdollista.

**Loppuruudun tilastot:** juodut kaljat/whiskyt/shotit/drinkit/vedet, pisin kombo, aika alueella, vessakäynnit, oksennukset, naisen tulos.

---

## 12. Vaikeus Päivän 1 sisällä

Päivä 1 on armollinen: leveä alue, hitaat mittarit, vihjeet ajoissa. Illan sisällä tahti kiristyy kolmessa vaiheessa.

| Vaihe | Kello (reaaliaika) | Muutokset |
|---|---|---|
| **Lämmittely** | 20:00–22:00 (0–60 s) | Kaikki lähtöarvot. Vihjeet tulevat aikaisin. Kulho 30 s välein. Ei naista ennen 21:00 |
| **Ruuhka** | 22:00–00:00 (60–120 s) | Kulho 40 s välein. Rakko passiivisesti +0,25 %/s. Nainen todennäköisesti paikalla |
| **Loppukiri** | 00:00–02:00 (120–180 s) | Kombo-ikkuna 8 s. 01:00 tapahtuma "Viimeinen kierros": shotit tuplapisteillä 20 s ajan. 01:50 varoitus valomerkistä |

**Päivä 1 -turvaverkot:**

- Ensimmäisellä kerralla rakko 100 %:ssa: armonaika 2 s, jossa vessaan ehtii vielä (vain kerran per kierros).
- Ensimmäinen ylitys 2,5 ‰:n yli: hahmo "säpsähtää hereille" ja promillet −0,1 ‰ (vain kerran).
- Tutoriaalikuplat kolmen ensimmäisen pelikerran aikana.

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

- **Naisen tarjoukset N = 5** – vahvistettu.
- **Oksennus Päivä 1:** yksi sallitaan, toinen lopettaa pelin. Myöhemmät päivät: jokainen oksennus lopettaa.
- **Käyttö:** henkilökohtainen projekti, ei julkaisua → kauppapaikkojen säännöt, ikärajat, ansaintamalli ja alkoholin mainontalaki eivät koske tätä.
- **Brändit:** ei brändejä, juomat geneerisiä (Kalja, Whisky, Shotti, Drinkki).

---

*Loppu. Kippis! 🍺*
