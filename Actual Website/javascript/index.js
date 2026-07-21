/* =========================================================
   REGENT CINEMA — MAIN WEBSITE JAVASCRIPT
   ========================================================= */


/* =========================================================
   DATE / DAY SETUP
   ========================================================= */

const DAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

const DAY_NAMES_MON_FIRST = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
];


function dayNameForOffset(offset) {
  const d = new Date();

  d.setDate(d.getDate() + offset);

  return DAY_NAMES[d.getDay()];
}


const RESOLVED_DAY = {
  today: dayNameForOffset(0),
  tomorrow: dayNameForOffset(1)
};


/* =========================================================
   RATING COLOURS
   ========================================================= */

const RATING_COLOR = {
  G: "var(--rate-g)",
  PG: "var(--rate-pg)",
  M: "var(--rate-m)",
  R13: "var(--rate-r13)",
  R16: "var(--rate-r)",
  R18: "var(--rate-r18)"
};


/* =========================================================
   ICONS
   ========================================================= */

const clockIcon = `
<svg
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
>
  <circle cx="12" cy="12" r="9"/>
  <path d="M12 7v5l3 3"/>
</svg>
`;


const filmIcon = `
<svg
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="1.4"
>
  <rect x="3" y="5" width="18" height="14" rx="1"/>
  <path d="M3 9h18M3 15h18M8 5v4M8 15v4M16 5v4M16 15v4"/>
</svg>
`;


/* =========================================================
   RENDER MOVIES
   ========================================================= */

function renderMovies(dayName) {

  const grid = document.getElementById('movieGrid');

  if (!grid) return;

  grid.innerHTML = "";

  const list = SCHEDULE[dayName] || [];

  if (list.length === 0) {

    grid.innerHTML = `
      <p style="color:var(--cream-dim); grid-column:1/-1;">
        Nothing listed for ${dayName} yet —
        check back soon, or call the Movieline on 03 308 1230.
      </p>
    `;

    return;
  }


  list.forEach(movie => {

    const card = document.createElement('div');

    card.className = 'movie-card';


    card.innerHTML = `

      <div class="poster">

        ${
          movie.poster

          ? `

            <a
              href="${movie.imdb || '#'}"
              target="_blank"
              rel="noopener noreferrer"
            >

              <img
                src="${movie.poster}"
                alt="${movie.title} poster"
              >

            </a>

          `

          : `

            <div class="poster-placeholder">
              No poster available
            </div>

          `
        }

      </div>


      <div class="card-body">
        <a
          href="${movie.imdb || '#'}"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h3 class="title">
            ${movie.title}
          </h3>
        </a>

        ${
          movie.rating

          ? `

            <span class="rate-pill rate-${movie.rating}">
              ${movie.rating}
            </span>

          `

          : ''

        }


        ${
          movie.warn

          ? `

            <p class="warn">
              ${movie.warn}
            </p>

          `

          : ''

        }


        <div class="times-row">

          ${

            movie.times

              .map(time => `

                <span class="time-chip">
                  ${time}
                </span>

              `)

              .join('')

          }

        </div>

      </div>

    `;


    grid.appendChild(card);

  });

}


/* =========================================================
   RENDER WEEKDAY TABS
   ========================================================= */

function renderWeekTabs() {

  const wrap = document.getElementById('weekTabs');

  if (!wrap) {
    console.error('Could not find #weekTabs in index.html');
    return;
  }


  wrap.innerHTML = DAY_NAMES_MON_FIRST
    .map(day => {

      const isToday =
        day === RESOLVED_DAY.today;


      return `
        <button
          class="tab${isToday ? ' today active' : ''}"
          data-day="${day}"
          role="tab"
          aria-selected="${isToday}"
        >

          ${day.slice(0, 3)}

          ${isToday ? ' · Today' : ''}

        </button>
      `;

    })
    .join('');


  wrap
    .querySelectorAll('.tab')
    .forEach(tab => {

      tab.addEventListener('click', () => {

        wrap
          .querySelectorAll('.tab')
          .forEach(button => {

            button.classList.remove('active');

            button.setAttribute(
              'aria-selected',
              'false'
            );

          });


        tab.classList.add('active');


        tab.setAttribute(
          'aria-selected',
          'true'
        );


        renderMovies(
          tab.dataset.day
        );

      });

    });


  renderMovies(
    RESOLVED_DAY.today
  );

}


/* =========================================================
   KIDS PICKS
   ========================================================= */

function renderKidPicks() {

  const wrap =
    document.getElementById('kidPicks');


  if (!wrap) {
    return;
  }


  const all = [

    ...(SCHEDULE[RESOLVED_DAY.today] || []),

    ...(SCHEDULE[RESOLVED_DAY.tomorrow] || [])

  ];


  const seen = new Set();


  const picks = all.filter(movie => {

    const isKidFriendly =
      movie.rating === 'G' ||
      movie.rating === 'PG';


    const notSeen =
      !seen.has(movie.title);


    if (
      isKidFriendly &&
      notSeen
    ) {

      seen.add(movie.title);

      return true;

    }


    return false;

  });


  wrap.innerHTML = picks.length

    ? picks
        .map(movie => `

          <div class="kid-pick">

            <span
              class="rate-pill"
              style="
                background:
                  ${RATING_COLOR[movie.rating]};
              "
            >
              ${movie.rating}
            </span>


            <h4>
              ${movie.title}
            </h4>


            <span>
              ${(movie.times || []).join(', ')}
            </span>

          </div>

        `)
        .join('')


    : `

      <p
        style="
          color:
            rgba(243,234,216,.75);
        "
      >

        No G or PG sessions in the next two days —
        check the full timetable for upcoming family screenings.

      </p>

    `;

}


/* =========================================================
   TICKER
   ========================================================= */

function renderTicker() {

  const ticker =
    document.getElementById('heroTicker');


  const tickerWrap =
    document.querySelector('.ticker-wrap');


  if (!ticker) {
    return;
  }


  const todaysMovies =
    SCHEDULE[RESOLVED_DAY.today] || [];


  if (todaysMovies.length === 0) {

    if (tickerWrap) {
      tickerWrap.style.display = 'none';
    }

    return;
  }


  const items = todaysMovies

    .map(movie => `

      <span>

        NOW SHOWING

        <b>
          ${movie.title}
        </b>

        —

        ${(movie.times || []).join(', ')}

      </span>

    `)

    .join('');


  ticker.innerHTML =
    items + items;

}


/* =========================================================
   LIGHT BULBS
   ========================================================= */

function buildBulbs(element, count) {

  let html = "";


  for (
    let i = 0;
    i < count;
    i++
  ) {

    html += `

      <span
        class="bulb"
        style="
          animation-delay:
          ${(i * 0.09).toFixed(2)}s
        "
      ></span>

    `;

  }


  element.innerHTML =
    html;

}


/* =========================================================
   HEADER SCROLL STATE
   ========================================================= */

const header =
  document.getElementById('site-header');


if (header) {

  window.addEventListener(

    'scroll',

    () => {

      header.classList.toggle(
        'scrolled',
        window.scrollY > 40
      );

    },

    {
      passive: true
    }

  );

}


/* =========================================================
   MOBILE NAVIGATION
   ========================================================= */

const menuToggle =
  document.getElementById('menuToggle');


const mobileNav =
  document.getElementById('mobileNav');


const closeMenu =
  document.getElementById('closeMenu');


if (
  menuToggle &&
  mobileNav &&
  closeMenu
) {


  menuToggle.addEventListener(
    'click',
    () => {

      mobileNav.classList.add(
        'open'
      );


      menuToggle.setAttribute(
        'aria-expanded',
        'true'
      );

    }
  );


  closeMenu.addEventListener(
    'click',
    () => {

      mobileNav.classList.remove(
        'open'
      );


      menuToggle.setAttribute(
        'aria-expanded',
        'false'
      );

    }
  );


  mobileNav
    .querySelectorAll('a')
    .forEach(link => {

      link.addEventListener(
        'click',
        () => {

          mobileNav.classList.remove(
            'open'
          );

        }
      );

    });

}


/* =========================================================
   PAGE INITIALISATION
   ========================================================= */

document.addEventListener(
  'DOMContentLoaded',
  () => {


    /* Scroll reveal */

    const observer =
      new IntersectionObserver(

        entries => {

          entries.forEach(entry => {

            if (
              entry.isIntersecting
            ) {

              entry.target.classList.add(
                'is-visible'
              );


              observer.unobserve(
                entry.target
              );

            }

          });

        },

        {
          threshold: 0.15
        }

      );


    document
      .querySelectorAll('.reveal')
      .forEach(element => {

        observer.observe(
          element
        );

      });


    /* Footer year */

    const year =
      document.getElementById('year');


    if (year) {

      year.textContent =
        new Date().getFullYear();

    }


    /* Date label */

    const dateLabel =
      document.getElementById('dateLabel');


    if (dateLabel) {

      dateLabel.textContent =

        `Showtimes for ${

          new Date().toLocaleDateString(
            'en-NZ',
            {
              weekday: 'long',
              day: 'numeric',
              month: 'long'
            }
          )

        }`;

    }


    /* Initialise movie schedule */

    renderWeekTabs();


    /* Initialise optional features */

    renderKidPicks();

    renderTicker();


    const bulbsTop =
      document.getElementById('bulbsTop');


    const bulbsBottom =
      document.getElementById('bulbsBottom');


    if (bulbsTop) {

      buildBulbs(
        bulbsTop,
        60
      );

    }


    if (bulbsBottom) {

      buildBulbs(
        bulbsBottom,
        60
      );

    }


    /* Contact form */

    const contactForm =
      document.getElementById('contactForm');


    if (contactForm) {

      contactForm.addEventListener(
        'submit',
        event => {

          event.preventDefault();


          const form =
            event.target;


          const subject =
            encodeURIComponent(

              form.subject?.value ||
              'Website enquiry'

            );


          const body =
            encodeURIComponent(

              `Name: ${
                form.name?.value || ''
              }

Email: ${
                form.email?.value || ''
              }


${
  form.message?.value || ''
}`

            );


          window.location.href =

            `mailto:bookings@regentcinema.co.nz` +

            `?subject=${subject}` +

            `&body=${body}`;

        }
      );

    }


  }

);


/* =========================================================
   BOOKING BUTTON
   ========================================================= */

const bookingBtn =
  document.getElementById(
    'bookingBtn'
  );


if (bookingBtn) {

  bookingBtn.addEventListener(
    'click',
    () => {


      const subject =
        'Booking Inquiry';


      const body =

`Booking Type (e.g. company, single family, school, small group):

Booking Name (e.g. James):

Amount of Tickets (e.g. 2):

Specific Ages for each ticket (e.g. 16, 35, 56):

Movie Name (e.g. Toy Story 5):

Date and Time (e.g. 15/07/2026 5:20PM):`;


      const mailtoLink =

        'mailto:bookings@regentcinema.co.nz' +

        '?subject=' +

        encodeURIComponent(
          subject
        ) +

        '&body=' +

        encodeURIComponent(
          body
        );


      window.location.href =
        mailtoLink;

    }
  );

}