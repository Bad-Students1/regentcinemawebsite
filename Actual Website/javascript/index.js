/* works out the real weekday name for "today" (offset 0) or "tomorrow" (offset 1) */
const DAY_NAMES = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const DAY_NAMES_MON_FIRST = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
function dayNameForOffset(offset){
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return DAY_NAMES[d.getDay()];
}
const RESOLVED_DAY = { today: dayNameForOffset(0), tomorrow: dayNameForOffset(1) };

const RATING_COLOR = { G:"var(--rate-g)", PG:"var(--rate-pg)", M:"var(--rate-m)", R13:"var(--rate-r13)", R16:"var(--rate-r)", R18:"var(--rate-r18)" };

const clockIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>';
const filmIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="3" y="5" width="18" height="14" rx="1"/><path d="M3 9h18M3 15h18M8 5v4M8 15v4M16 5v4M16 15v4"/></svg>';

function renderMovies(dayName){
  const grid = document.getElementById('movieGrid');
  grid.innerHTML = "";
  const list = SCHEDULE[dayName] || [];

  if(list.length === 0){
    grid.innerHTML = `<p style="color:var(--cream-dim); grid-column:1/-1;">Nothing listed for ${dayName} yet — check back soon, or call the Movieline on 03 308 1230.</p>`;
    return;
  }

  list.forEach(m => {
    const card = document.createElement('div');
    card.className = 'movie-card';
    card.innerHTML = `
      <div class="poster">
        ${m.poster
          ? `<img src="${m.poster}" alt="${m.title} poster" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover;">`
          : `<div class="pg" style="background:linear-gradient(150deg, ${RATING_COLOR[m.rating]}33, transparent 70%);"></div>${filmIcon}`}
        <span class="rate-pill" style="background:${RATING_COLOR[m.rating]};">${m.rating}</span>
      </div>
      <div class="card-body">
        <h3>${m.title}</h3>
        <p class="warn">${m.warn}</p>
        <div class="times-row">
          ${m.times.map(t => `<span class="time-chip">${clockIcon}${t}</span>`).join('')}
        </div>
      </div>`;
    grid.appendChild(card);
  });
}

function renderWeekTabs(){
  const wrap = document.getElementById('weekTabs');
  wrap.innerHTML = DAY_NAMES_MON_FIRST.map(d => {
    const isToday = d === RESOLVED_DAY.today;
    return `<button class="tab${isToday ? ' active' : ''}" data-day="${d}" role="tab" aria-selected="${isToday}">${d.slice(0,3)}${isToday ? ' · Today' : ''}</button>`;
  }).join('');
  wrap.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      wrap.querySelectorAll('.tab').forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected','false'); });
      tab.classList.add('active'); tab.setAttribute('aria-selected','true');
      renderMovies(tab.dataset.day);
    });
  });
  renderMovies(RESOLVED_DAY.today);
}

function renderKidPicks(){
  const wrap = document.getElementById('kidPicks');
  const all = [...(SCHEDULE[RESOLVED_DAY.today]||[]), ...(SCHEDULE[RESOLVED_DAY.tomorrow]||[])];
  const seen = new Set();
  const picks = all.filter(m => (m.rating === 'G' || m.rating === 'PG') && !seen.has(m.title) && seen.add(m.title));
  wrap.innerHTML = picks.length
    ? picks.map(m => `
      <div class="kid-pick">
        <span class="rate-pill" style="background:${RATING_COLOR[m.rating]};">${m.rating}</span>
        <h4>${m.title}</h4>
        <span>${m.times.join(', ')}</span>
      </div>`).join('')
    : `<p style="color:rgba(243,234,216,.75);">No G or PG sessions in the next two days — check the full timetable for upcoming family screenings.</p>`;
}

function renderTicker(){
  const t = document.getElementById('heroTicker');
  const todays = SCHEDULE[RESOLVED_DAY.today] || [];
  if(todays.length === 0){ document.querySelector('.ticker-wrap').style.display = 'none'; return; }
  const items = todays.map(m => `<span>NOW SHOWING <b>${m.title}</b> — ${m.times.join(', ')}</span>`).join('');
  t.innerHTML = items + items; // duplicate for seamless loop
}

function buildBulbs(el, count){
  let html = "";
  for(let i=0;i<count;i++){ html += `<span class="bulb" style="animation-delay:${(i*0.09).toFixed(2)}s"></span>`; }
  el.innerHTML = html;
}

/* header scroll state */
const header = document.getElementById('site-header');

if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

/* mobile nav */
const menuToggle = document.getElementById('menuToggle');
const mobileNav = document.getElementById('mobileNav');
const closeMenu = document.getElementById('closeMenu');

if (menuToggle && mobileNav && closeMenu) {

  menuToggle.addEventListener('click', () => {
    mobileNav.classList.add('open');
    menuToggle.setAttribute('aria-expanded', 'true');
  });

  closeMenu.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });

  mobileNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mobileNav.classList.remove('open');
    });
  });

}

/* scroll reveal */
document.addEventListener('DOMContentLoaded', () => {

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

  /* contact form */
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const f = e.target;

      const subject = encodeURIComponent(
        f.subject?.value || 'Website enquiry'
      );

      const body = encodeURIComponent(
        `Name: ${f.name?.value || ''}\nEmail: ${f.email?.value || ''}\n\n${f.message?.value || ''}`
      );

      window.location.href =
        `mailto:bookings@regentcinema.co.nz?subject=${subject}&body=${body}`;
    });
  }

  /* footer year */
  const year = document.getElementById('year');
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  /* date label */
  const dateLabel = document.getElementById('dateLabel');
  if (dateLabel) {
    dateLabel.textContent =
      `Showtimes for ${new Date().toLocaleDateString('en-NZ', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
      })}`;
  }

  /* init */
  renderWeekTabs();
  renderKidPicks();
  renderTicker();

  const bulbsTop = document.getElementById('bulbsTop');
  const bulbsBottom = document.getElementById('bulbsBottom');

  if (bulbsTop) buildBulbs(bulbsTop, 60);
  if (bulbsBottom) buildBulbs(bulbsBottom, 60);

});