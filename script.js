// ==========================================================
// Mobil navigáció (hamburger menü)
// ==========================================================
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');

navToggle.addEventListener('click', () => {
  mainNav.classList.toggle('open');
});

// Menü bezárása, ha egy linkre vagy a foglalás gombra kattintunk (mobil nézetben)
mainNav.querySelectorAll('a, .nav-book-btn').forEach(link => {
  link.addEventListener('click', () => mainNav.classList.remove('open'));
});

// ==========================================================
// Setmore "Book Now" widget – helyes szolgáltatásra váltás
// A Setmore saját szkriptje csak az ELSŐ valaha megnyitott gomb URL-jét
// használja: a felugró ablakot (és benne az iframe-et) csak egyszer hozza
// létre, utána minden gombnál csak újra megjeleníti ugyanazt, a régi
// tartalommal – ez a Setmore widget saját korlátja/hibája, nem javítható
// az ő kódjuk módosítása nélkül.
// Megoldás: NEM nyúlunk a Setmore saját overlay/box elemeihez (azok
// eltávolítása elrontaná a widget belső állapotát, és utána meg sem
// nyílna újra) – ehelyett minden kattintáskor egyszerűen frissítjük a már
// létrehozott iframe "src" attribútumát a kattintott gomb saját
// URL-jére. Ez egy teljesen új navigációt indít az iframe-ben, ami
// automatikusan törli a korábban kiválasztott szolgáltatást/időpontot is.
document.querySelectorAll('.anywhere-book-now-button').forEach(btn => {
  btn.addEventListener('click', () => {
    const url = btn.dataset.bookingUrl;
    const iframe = document.querySelector('.anywhere-iframe');
    if (iframe && iframe.getAttribute('src') !== url) {
      const box = iframe.closest('.anywhere-box');
      const loader = box ? box.querySelector('.anywhere-loader') : null;
      if (loader) loader.style.display = 'block';
      iframe.style.display = 'none';
      iframe.src = url;
    }
  });
});

// ==========================================================
// Nyelvválasztó felugró ablak (modal)
// ==========================================================
const langToggle = document.getElementById('langToggle');
const langModal = document.getElementById('langModal');
const langModalClose = document.getElementById('langModalClose');
const langModalBackdrop = document.getElementById('langModalBackdrop');

if (langToggle && langModal && langModalClose && langModalBackdrop) {
  const openLangModal = () => {
    langModal.classList.add('open');
    langToggle.classList.add('open');
    langToggle.setAttribute('aria-expanded', 'true');
  };

  const closeLangModal = () => {
    langModal.classList.remove('open');
    langToggle.classList.remove('open');
    langToggle.setAttribute('aria-expanded', 'false');
  };

  langToggle.addEventListener('click', (event) => {
    event.stopPropagation();
    openLangModal();
  });

  langModalClose.addEventListener('click', closeLangModal);
  langModalBackdrop.addEventListener('click', closeLangModal);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeLangModal();
  });
}

// ==========================================================
// Galéria – automatikus képbetöltés a gallery/ mappából
// A fájlnév szándékosan nem számít: a GitHub API-n keresztül lekérjük a
// gallery/ mappa aktuális, élő tartalmát (mindig a main branch szerint),
// és minden képfájlhoz (jpg/jpeg/png/webp/gif) generálunk egy <img>
// elemet. Így elég csak feltölteni egy képet a mappába és pusholni,
// a HTML-t nem kell szerkeszteni. A repó nevét/mappát a HTML-ben lévő
// data-gallery-* attribútumok mondják meg (lásd index.html), hogy ez a
// kód más kliens-repóban is újrahasználható legyen.
// A képek ábécésorrendbe kerülnek a fájlnév alapján - ha fontos a
// sorrend, nevezd el a fájlokat pl. "01-...jpg", "02-...jpg" formában.
// ==========================================================
const galleryGrid = document.getElementById('galleryGrid');
const galleryEmpty = document.getElementById('galleryEmpty');

// Lightbox: nagyméretű kép megjelenítése kattintásra
const galleryLightbox = document.getElementById('galleryLightbox');
const galleryLightboxImg = document.getElementById('galleryLightboxImg');
const galleryLightboxClose = document.getElementById('galleryLightboxClose');
const galleryLightboxBackdrop = document.getElementById('galleryLightboxBackdrop');

const openLightbox = (src, alt) => {
  if (!galleryLightbox || !galleryLightboxImg) return;
  galleryLightboxImg.src = src;
  galleryLightboxImg.alt = alt;
  galleryLightbox.classList.add('open');
};

const closeLightbox = () => {
  if (galleryLightbox) galleryLightbox.classList.remove('open');
};

if (galleryLightboxClose) galleryLightboxClose.addEventListener('click', closeLightbox);
if (galleryLightboxBackdrop) galleryLightboxBackdrop.addEventListener('click', closeLightbox);
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeLightbox();
});

if (galleryGrid) {
  const { galleryOwner: owner, galleryRepo: repo, galleryPath: path, galleryAlt: altText } = galleryGrid.dataset;
  const IMAGE_EXTENSIONS = /\.(jpe?g|png|webp|gif)$/i;

  fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`)
    .then(res => (res.ok ? res.json() : Promise.reject(new Error('GitHub API error'))))
    .then(files => {
      const images = files
        .filter(file => file.type === 'file' && IMAGE_EXTENSIONS.test(file.name))
        .sort((a, b) => a.name.localeCompare(b.name));

      if (images.length === 0) {
        if (galleryEmpty) galleryEmpty.hidden = false;
        return;
      }

      images.forEach(file => {
        const img = document.createElement('img');
        img.src = file.download_url;
        img.alt = altText || '';
        img.loading = 'lazy';
        img.addEventListener('click', () => openLightbox(file.download_url, altText || ''));
        galleryGrid.appendChild(img);
      });
    })
    .catch(() => {
      if (galleryEmpty) galleryEmpty.hidden = false;
    });
}

// ==========================================================
// Aktuális év a láblécben
// ==========================================================
document.getElementById('year').textContent = new Date().getFullYear();

// ==========================================================
// Demó naptár widget (időpontfoglalás szekció)
// Ez csak vizuális elem, nincs mögötte valódi foglalási logika.
// Csak azokon az oldalakon fut, ahol még nincs élő Cal.com widget
// beágyazva (a hiányzó elemeket lekérdezve null-t kapnánk, ezért
// az egész blokk egy létezés-ellenőrzés mögé van téve).
// A zárva tartó napok a nyitvatartás szekcióval egyeznek
// (hétfő = 1, vasárnap = 0, a JS getDay() alapján).
// ==========================================================
const calendarTitle = document.getElementById('calendarTitle');
const calendarGrid = document.getElementById('calendarGrid');
const bookingMessage = document.getElementById('bookingMessage');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');

if (calendarTitle && calendarGrid && bookingMessage && prevMonthBtn && nextMonthBtn) {
  const CLOSED_WEEKDAYS = [0, 1]; // vasárnap, hétfő

  // Fordítások: a <html lang="hu|en|de"> attribútum alapján választjuk ki,
  // hogy a naptár JS-ből generált szövegei (hónapnevek, kattintásra megjelenő
  // üzenet) melyik nyelven jelenjenek meg. A statikus szövegek (nav, gombok,
  // stb.) magukban a hu/en/de HTML fájlokban vannak lefordítva.
  const TRANSLATIONS = {
    hu: {
      months: ['Január', 'Február', 'Március', 'Április', 'Május', 'Június',
        'Július', 'Augusztus', 'Szeptember', 'Október', 'November', 'December'],
      demoMessage: (day, month) =>
        `Ez egy demó naptár – a(z) ${day}. ${month} napra még nem lehet élesben foglalni. ` +
        `Hívj minket telefonon az időpont egyeztetéséhez!`
    },
    en: {
      months: ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'],
      demoMessage: (day, month) =>
        `This is a demo calendar – ${month} ${day} can't be booked live yet. ` +
        `Please call us to arrange your appointment!`
    },
    de: {
      months: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
        'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
      demoMessage: (day, month) =>
        `Dies ist ein Demo-Kalender – für den ${day}. ${month} kann noch nicht live gebucht werden. ` +
        `Bitte rufen Sie uns an, um einen Termin zu vereinbaren!`
    }
  };

  const currentLang = TRANSLATIONS[document.documentElement.lang] ? document.documentElement.lang : 'hu';
  const t = TRANSLATIONS[currentLang];
  const monthNames = t.months;

  const today = new Date();
  let viewYear = today.getFullYear();
  let viewMonth = today.getMonth();

  const renderCalendar = (year, month) => {
    calendarGrid.innerHTML = '';
    calendarTitle.textContent = `${monthNames[month]} ${year}`;

    const firstDay = new Date(year, month, 1);
    // Hétfő induló héthez igazítjuk az indexet (0 = hétfő ... 6 = vasárnap)
    const startOffset = (firstDay.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < startOffset; i++) {
      const empty = document.createElement('div');
      empty.className = 'calendar-day empty';
      calendarGrid.appendChild(empty);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const cellDate = new Date(year, month, day);
      const cell = document.createElement('div');
      cell.textContent = day;
      cell.className = 'calendar-day';

      const isPast = cellDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const isClosed = CLOSED_WEEKDAYS.includes(cellDate.getDay());
      const isToday = cellDate.toDateString() === today.toDateString();

      if (isToday) cell.classList.add('today');

      if (isPast) {
        cell.classList.add('past');
      } else if (isClosed) {
        cell.classList.add('closed');
      } else {
        cell.classList.add('available');
        cell.addEventListener('click', () => {
          bookingMessage.textContent = t.demoMessage(day, monthNames[month]);
        });
      }

      calendarGrid.appendChild(cell);
    }
  };

  prevMonthBtn.addEventListener('click', () => {
    viewMonth--;
    if (viewMonth < 0) {
      viewMonth = 11;
      viewYear--;
    }
    renderCalendar(viewYear, viewMonth);
  });

  nextMonthBtn.addEventListener('click', () => {
    viewMonth++;
    if (viewMonth > 11) {
      viewMonth = 0;
      viewYear++;
    }
    renderCalendar(viewYear, viewMonth);
  });

  renderCalendar(viewYear, viewMonth);
}

