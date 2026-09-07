# Selyemhaj Fodrászat – demó weboldal

Statikus (HTML/CSS/JS) bemutatkozó weboldal egy fiktív fodrászatnak. Nincs benne
backend vagy adatbázis, GitHub Pages-en közvetlenül publikálható.

## Fájlstruktúra

- `index.html` – **magyar** verzió (Kezdőlap, Rólunk, Szolgáltatások, Galéria, Nyitvatartás, Megközelíthetőség – az időpontfoglalás nem külön szekció, hanem gombok a fejlécben/hero-ban/szolgáltatás-kártyákon, lásd lent)
- `en/index.html` – **angol** verzió
- `de/index.html` – **német** verzió
- `style.css` – közös kinézet mindhárom nyelvi oldalhoz, reszponzív elrendezés
- `script.js` – közös JS mindhárom oldalhoz: mobil menü, aktuális év, demó naptár widget. A naptár hónapnevei és a kattintásra megjelenő üzenet a fájl elején lévő `TRANSLATIONS` objektumból jönnek, az adott HTML `<html lang="hu|en|de">` attribútuma alapján.
- `images/` – ide kerülnek a fő oldal-képek (hero, favicon, rólunk), **csak a gyökérben, egy helyen** (lásd lent, milyen fájlneveket várnak a HTML fájlok). Az `en/` és `de/` oldalak `../images/...` relatív úttal hivatkoznak ugyanide, nem kell duplikálni a képeket.
- `gallery/` – a Galéria szekció képei, szintén csak a gyökérben, egy helyen (lásd lent)
- `robots.txt`, `sitemap.xml` – Google-kereshetőséghez (lásd a "SEO / Google-kereshetőség" szekciót lent)

### Többnyelvűség – fontos tudnivaló

A három nyelv **három külön, teljes HTML fájl** (nem egy közös sablon + fordítás
JS-ből) – ez a statikus, GitHub Pages-es oldalaknál a legegyszerűbb és
SEO-barát megoldás. A hátránya, hogy **ha tartalmat módosítasz** (pl. árat,
nyitvatartást, szöveget), azt **mindhárom fájlban** (`index.html`, `en/index.html`,
`de/index.html`) külön át kell vezetned, különben a nyelvek szét fognak csúszni.
A `style.css` és `script.js` viszont közös, azokat elég egy helyen módosítani.

## Cím módosítása (Google Maps)

A "Megközelíthetőség" szekció egy Google Maps beágyazást és egy "Útvonaltervezés
indítása" gombot tartalmaz, API-kulcs nélkül. A placeholder cím jelenleg
`Kossuth Lajos tér 1-3, 1055 Budapest` (a Magyar Országház) – ha ezt lecseréled
a valódi címre, **mindhárom nyelvi fájlban** (`index.html`, `en/index.html`,
`de/index.html`) három helyen kell frissítened ugyanarra a szövegre:

1. az `<iframe src="https://www.google.com/maps?q=...">` végén,
2. a "Útvonaltervezés indítása" / "Get Directions" / "Route planen" gomb `href="https://www.google.com/maps/dir/?api=1&destination=...">` részében,
3. a lábléc szövegében (és opcionálisan a "Megközelíthetőség" szekció alatti szövegben).

## Elérhetőségek (lábléc: Instagram, Facebook, WhatsApp, telefon)

A lábléc alján egy "Elérhetőségek" sor van Instagram, Facebook, Messenger,
WhatsApp és telefon linkekkel. Ezek jelenleg placeholder adatok – **mindhárom
nyelvi fájl** (`index.html`, `en/index.html`, `de/index.html`) `<footer>`
részében cseréld le őket ugyanarra:

- **Instagram / Facebook**: írd át a `href="https://www.instagram.com/..."` és
  `href="https://www.facebook.com/..."` linkeket a saját profilod URL-jére.
- **WhatsApp**: a `href="https://wa.me/36301234567?text=...">` linkben a
  `36301234567` a te valódi telefonszámod nemzetközi formátumban, `+` és
  szóközök nélkül (pl. `+36 30 123 4567` → `36301234567`). A `?text=...` rész
  egy előre kitöltött üzenetszöveg, opcionális – törölhető is.
- **Telefon**: a `href="tel:+36301234567"` linkben cseréld le a számot a
  sajátodra (itt maradhat a `+` jel és akár szóköz is).

**Fontos:** a WhatsApp linknek csak akkor van értelme, ha a megadott
telefonszámhoz **valóban létezik regisztrált WhatsApp-fiók** (a te vagy a
szalon száma) – a `wa.me` link csak megnyitja a WhatsApp-ot/WhatsApp Web-et
azzal a számmal, magát a fiókot a WhatsApp appban kell létrehoznod (ingyenes).

## Időpontfoglalás (Setmore)

Nincs külön "Időpontfoglalás" szekció az oldalon – a Setmore hivatalos
**"Book Now" widget** gombjai közvetlenül a következő helyeken vannak
elhelyezve (mindhárom nyelvi fájlban):

- a **fejléc navigációjában** ("Időpontfoglalás" / "Booking" / "Terminbuchung" menüpont, `id="Anywhere_button_nav"`),
- a **hero szekció gombjában** ("Időpontot foglalok", `id="Anywhere_button_hero"`),
- és **minden szolgáltatás-kártyán** külön-külön ("Foglalás" gomb, saját szolgáltatás-linkkel – lásd lent).

A widget szkriptje egyszer töltődik be az oldalra (a Szolgáltatások szekció
végén), és minden `anywhere-book-now-button` class-szal ellátott gombot
automatikusan bekapcsol, függetlenül attól, hogy azok a HTML-ben korábban
vagy később szerepelnek, mint maga a script tag:

```html
<script id="anywhere_book_now_script" src="https://assets.setmore.com/integration/book-now/live/v1/anywhere-book-now.js"></script>
<button class="btn btn-primary anywhere-book-now-button" type="button"
        data-booking-url="https://kissacoe.setmore.com/hu/categories/e82cf259-3da5-4e70-a3a9-46f890464c55" data-new-tab="false">
  Időpontot foglalok
</button>
```

- A `data-booking-url` a Setmore foglalási oldalad címe – ezt a Setmore
  fiókodban a **Connect → Website booking → Booking Widget** alatt találod.
- A gomb kattintásra egy felugró ablakban (nem új lapon, mert
  `data-new-tab="false"`) nyitja meg a Setmore foglalási felületét.
- **Ha új gombot adsz hozzá valahova**, elég egy `anywhere-book-now-button`
  class-szal és `data-booking-url` attribútummal ellátott `<button>` – a
  meglévő szkriptet nem kell újra beszúrni, csak ügyelj rá, hogy a gomb az
  oldal HTML-jében **bárhol** lehet (a szkript már mindenhol megtalálja).
- Minden gombnak **egyedi `id`-ja legyen** (pl. `Anywhere_button_noi`) – ne
  másold be kétszer ugyanazt az `id`-t, mert érvénytelen HTML-t eredményez.

### Ha törölsz vagy hozzáadsz egy szekciót: a háttérszín-váltakozásra figyelj

A szekciók háttere felváltva `var(--color-bg)` (krém) és
`var(--color-bg-alt)` (arany-krém) – jelenleg: Rólunk (bg) → Szolgáltatások
(bg-alt) → Galéria (bg) → Nyitvatartás (bg-alt) → Megközelíthetőség (bg). Ha
törölsz vagy beszúrsz egy szekciót, ellenőrizd, hogy utána sem lesz **két
egymás melletti szekciónak ugyanaz a háttere** – ha igen, cseréld ki a
`style.css`-ben az érintett szekció `background` értékét a másikra.

### Nyelvhelyesség: külön szolgáltatás-kategória minden nyelvhez

A Setmore csak a kezelőfelület szövegeit (pl. "Book", "Price") fordítja le
automatikusan – **a szolgáltatások neveit/leírásait nem**, azok mindig azt
mutatják, amit te beírtál. Ezért a Setmore fiókban **3 külön szolgáltatás-
kategória** lett létrehozva (Magyar, English, Deutsch), mindegyikben
ugyanaz az 5 szolgáltatás felvéve a saját nyelvén (időtartam/ár azonos).

A `data-booking-url` ezért mindhárom nyelvi fájlban a saját kategória-linkje,
**a Setmore domain és a kategória-link közé beszúrt kétbetűs nyelvkóddal**
(ez fordítja le a felület szövegeit is):

- `index.html`: `https://kissacoe.setmore.com/hu/categories/e82cf259-3da5-4e70-a3a9-46f890464c55`
- `en/index.html`: `https://kissacoe.setmore.com/en/categories/218d60ea-d850-452d-99a3-15b8fa4974aa`
- `de/index.html`: `https://kissacoe.setmore.com/de/categories/9aa8c433-a351-4e74-a98d-41e7bb8902cd`

**Ha a Setmore-on bármelyik kategóriában módosítasz egy szolgáltatást (név,
ár, időtartam), csak azt az EGY kategóriát kell frissítened** – a másik
kettő (más nyelvű) kategória külön szolgáltatás-bejegyzés, azokat is
manuálisan szinkronban kell tartanod, ha pl. árat emelsz.

**Ha új Setmore fiókra váltanál**: hozz létre 3 kategóriát, vedd fel bennük
a szolgáltatásokat a megfelelő nyelven, majd kategóriánként a "Copy booking
link" gombbal kérd le a linket, és told be a nyelvkódot a domain után, a
`/categories/...` rész elé (böngészőben nyitva ellenőrizd, hogy tényleg
lefordítja-e a felületet – nem minden Setmore fiók/csomag esetén biztos,
hogy ugyanígy viselkedik). Ugyanez érvényes az egyes szolgáltatás-kártyák
"Foglalás" gombjaihoz tartozó `/services/...` linkekre is.

A gombok szövege/stílusa (`class="btn btn-primary"` a nav/hero gombnál,
`class="service-book-btn"` a szolgáltatás-kártyákon) a saját CSS-ünkből jön,
hogy illeszkedjen az oldal színvilágához – ezeket nyugodtan módosíthatod a
`style.css`-ben.

## Szükséges képek

Az `index.html` jelenleg az alábbi fájlneveket várja az `images/` mappában.
Töltsd fel ezekkel a nevekkel a saját fotóidat (vagy módosítsd a HTML-ben a fájlneveket):

- `images/hero.jpg` – nagy header/hero kép a főoldalon
- `images/rolunk.jpg` – kép a Rólunk szekcióhoz (pl. a szalon vagy a csapat)
- `images/favicon.png` – kis ikon a böngésző füléhez (favicon), négyzetes kép ajánlott (pl. 512×512 px)

## Galéria

A `gallery/` mappa (a gyökérben, az `images/` mellett, külön) a Galéria
szekció képeinek van fenntartva. **A fájlnév itt nem számít** – a
`script.js` a GitHub API-n keresztül minden alkalommal lekéri, milyen
képek vannak éppen a `gallery/` mappában, és automatikusan megjeleníti
mindet. Ez azt jelenti:

- **Nincs HTML-szerkesztés** – csak töltsd fel a képet a `gallery/`
  mappába (bármilyen néven, `.jpg`/`.jpeg`/`.png`/`.webp`/`.gif`
  kiterjesztéssel), commitold és pushold, és megjelenik mindhárom nyelvi
  oldalon
- A képek **ábécésorrendbe** kerülnek a fájlnevük alapján – ha fontos a
  sorrend, nevezd el őket pl. `01-...jpg`, `02-...jpg` formában
- Ha nincs egy kép sem a mappában (vagy nem sikerül elérni a GitHub
  API-t), egy "Hamarosan ide kerülnek a galéria képei" üzenet jelenik meg
  helyette

**Technikai háttér, csak ha érdekel:** a `<div class="gallery-grid">`
elem `data-gallery-owner`/`data-gallery-repo`/`data-gallery-path`
attribútumai mondják meg a szkriptnek, melyik GitHub repóban/mappában
keresse a képeket – ezt kellene átírni, ha ezt a sablont egy másik GitHub
felhasználó/repó alá másolod. Mivel ez egy publikus, nem hitelesített API
hívás, csak **publikus repóknál** működik (a GitHub Pages ingyenes
csomagja amúgy is publikus repót igényel), és nagyon ritkán, nagy
látogatottságnál elméletileg elérheti a GitHub percenkénti API-limitjét –
egy kisvállalkozás forgalmánál ez a gyakorlatban nem jelent problémát.

Mint a többi képnél: töltsd fel tömörítve (nagyjából 1500–2000px szélesség
elég, ne legyen több MB-os egy kép sem), különben lassítja az oldalt.

## Helyi megnyitás

Nincs szükség szerverre, elég duplán kattintani az `index.html` fájlon,
vagy VS Code-ban a "Live Server" kiterjesztéssel megnyitni.

## Publikálás GitHub Pages-re

1. Hozz létre egy új repository-t a GitHub-on.
2. Töltsd fel ebbe a mappát (git init, add, commit, push – vagy böngészőből feltöltve).
3. A repo **Settings → Pages** menüjében válaszd ki a `main` branch-et (root mappa) forrásként.
4. Pár percen belül elérhető lesz az oldal a
   `https://<felhasznalonev>.github.io/<repo-nev>/` címen.

Ha később módosítasz valamit és push-olod, a GitHub Pages automatikusan frissíti az élő oldalt.

## SEO / Google-kereshetőség

### 1. Cseréld le a placeholder domaint (kötelező lépés)

A kód tele van `https://www.YOUR-DOMAIN-HERE.com` placeholderrel a következő
fájlokban: `index.html`, `en/index.html`, `de/index.html`, `robots.txt`,
`sitemap.xml`. Amint megvan a saját domained, **mindegyikben cseréld le**
a valódi domainre (a `canonical`, `hreflang`, Open Graph és a strukturált
adat `url` mezőiben, valamint a sitemap/robots fájlokban).

Ezek a tag-ek (a `<head>`-ben mindhárom nyelvi oldalon):
- **`<meta name="description">`** – ez jelenik meg a Google találati listában a cím alatt
- **`hreflang` linkek** – ezek mondják meg a Google-nek, hogy a HU/EN/DE oldalak ugyanannak a tartalomnak a fordításai, és a megfelelő nyelvet mutassa a megfelelő keresőnek
- **Open Graph (`og:*`) tag-ek** – ezek határozzák meg, hogyan néz ki az oldal, ha valaki linkeli Facebookon/Messengeren/WhatsAppon (cím, leírás, kép)
- **Strukturált adat (JSON-LD, `HairSalon` típus)** – ettől jeleníthet meg a Google közvetlenül a találatnál nyitvatartást, címet, telefonszámot

### 2. Google Search Console (ingyenes, ezt neked kell elvégezned)

1. Regisztrálj a [search.google.com/search-console](https://search.google.com/search-console) oldalon
2. Add hozzá a domainedet "Domain" típusú property-ként (ehhez egy DNS TXT rekordot kell felvenned a Cloudflare-es DNS-beállításoknál – ezt megmutatom, amikor odaértek)
3. Beküldheted a sitemapot: **Sitemapok** menüpont → írd be: `sitemap.xml`
4. Pár napon belül a Google elkezdi indexelni az oldaladat

### 3. Google Cégem (Google Business Profile) – ez számít a legtöbbet helyi keresésnél

**Ez különálló a weboldaltól**, mégis ez adja a Google Térkép-találatot és a
"fodrász a közelben" típusú keresések eredményét. Ingyenes, de a klienst
(vagy Téged, az ő nevében) hitelesíteni kell (postai levél/telefon/videó).
Regisztráció: [google.com/business](https://www.google.com/business/)

### 4. Kép-tömörítés és `loading="lazy"` (már megbeszéltük korábban)

Ha bővül az oldal (pl. portfólió galéria), ne felejtsd el tömöríteni a
képeket és `loading="lazy"` attribútumot tenni rájuk – ez is számít a
Google rangsorolásánál (oldalsebesség).
