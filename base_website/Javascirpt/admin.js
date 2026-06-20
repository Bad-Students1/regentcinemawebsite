const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const TMDB_IMG = 'https://image.tmdb.org/t/p/w300';
let schedule = {};
DAYS.forEach(d => schedule[d] = []);
let selectedMovie = null;

/* ---------- persistence (draft only — lives in this browser) ---------- */
function loadDraft(){
  try{
    const raw = localStorage.getItem('regent_schedule_draft');
    if(raw) schedule = JSON.parse(raw);
    DAYS.forEach(d => { if(!schedule[d]) schedule[d] = []; });
  }catch(e){ /* ignore corrupt draft */ }
}
function saveDraft(){
  localStorage.setItem('regent_schedule_draft', JSON.stringify(schedule));
}

/* ---------- API key ---------- */
function getKey(){ return localStorage.getItem('tmdb_api_key') || ''; }
function refreshKeyStatus(){
  const k = getKey();
  document.getElementById('keyDot').classList.toggle('ok', !!k);
  document.getElementById('keyStatusText').textContent = k ? 'API key saved' : 'No API key saved yet';
  if(k) document.getElementById('apiKey').placeholder = '•••••••••••••••• (saved)';
}
document.getElementById('saveKeyBtn').addEventListener('click', () => {
  const v = document.getElementById('apiKey').value.trim();
  if(!v){ return; }
  localStorage.setItem('tmdb_api_key', v);
  document.getElementById('apiKey').value = '';
  refreshKeyStatus();
});

/* ---------- rating helpers ---------- */
function mapCertification(cert){
  // NZ/AU/GB use labels that mostly already match our scheme; US needs translating.
  const known = ['G','PG','M','R13','R15','R16','R18'];
  if(known.includes(cert)) return cert === 'R15' ? 'R16' : cert; // nudge R15(AU) toward our nearest bucket
  const usMap = { 'G':'G', 'PG':'PG', 'PG-13':'M', 'R':'R16', 'NC-17':'R18' };
  if(usMap[cert]) return usMap[cert];
  return null;
}

async function fetchCertification(tmdbId, key){
  const res = await fetch(`https://api.themoviedb.org/3/movie/${tmdbId}/release_dates?api_key=${key}`);
  if(!res.ok) return { rating:null, source:null };
  const data = await res.json();
  const priority = ['NZ','AU','GB','US'];
  for(const country of priority){
    const entry = (data.results||[]).find(r => r.iso_3166_1 === country);
    if(entry){
      const withCert = entry.release_dates.find(rd => rd.certification);
      if(withCert && withCert.certification){
        const mapped = mapCertification(withCert.certification);
        if(mapped) return { rating: mapped, source: country, raw: withCert.certification };
      }
    }
  }
  return { rating:null, source:null };
}

/* ---------- search ---------- */
document.getElementById('searchBtn').addEventListener('click', doSearch);
document.getElementById('searchTitle').addEventListener('keydown', e => { if(e.key==='Enter') doSearch(); });

async function doSearch(){
  const key = getKey();
  const msg = document.getElementById('searchMsg');
  const query = document.getElementById('searchTitle').value.trim();
  if(!key){ showMsg(msg,'bad','Save your TMDB API key above first.'); return; }
  if(!query){ return; }
  showMsg(msg,'info','Searching…');
  try{
    const res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${key}&query=${encodeURIComponent(query)}`);
    if(!res.ok) throw new Error('Search request failed (' + res.status + ')');
    const data = await res.json();
    renderResults(data.results || []);
    hideMsg(msg);
  }catch(e){
    showMsg(msg,'bad','Could not reach TMDB — check your internet connection and that your API key is correct. (' + e.message + ')');
  }
}

function renderResults(results){
  const wrap = document.getElementById('searchResults');
  if(results.length === 0){ wrap.innerHTML = '<p style="color:var(--cream-dim); font-size:0.85rem;">No matches found.</p>'; return; }
  wrap.innerHTML = results.slice(0,10).map(r => `
    <div class="result-row" data-id="${r.id}">
      <img src="${r.poster_path ? TMDB_IMG + r.poster_path : ''}" alt="">
      <div class="meta"><b>${r.title}</b><span>${(r.release_date||'').slice(0,4) || 'Year unknown'}</span></div>
    </div>`).join('');
  wrap.querySelectorAll('.result-row').forEach(row => {
    row.addEventListener('click', () => selectMovie(row.dataset.id));
  });
}

/* ---------- ID lookup (TMDB or IMDb) ---------- */
document.getElementById('idLookupBtn').addEventListener('click', async () => {
  const key = getKey();
  const msg = document.getElementById('searchMsg');
  const raw = document.getElementById('idInput').value.trim();
  if(!key){ showMsg(msg,'bad','Save your TMDB API key above first.'); return; }
  if(!raw){ return; }
  showMsg(msg,'info','Looking up…');
  try{
    if(raw.toLowerCase().startsWith('tt')){
      const res = await fetch(`https://api.themoviedb.org/3/find/${raw}?api_key=${key}&external_source=imdb_id`);
      if(!res.ok) throw new Error('Lookup failed (' + res.status + ')');
      const data = await res.json();
      const match = (data.movie_results || [])[0];
      if(!match){ showMsg(msg,'bad','No movie found for that IMDb ID.'); return; }
      hideMsg(msg);
      selectMovie(match.id);
    } else {
      hideMsg(msg);
      selectMovie(raw);
    }
  }catch(e){
    showMsg(msg,'bad','Something went wrong: ' + e.message);
  }
});

/* ---------- select + preview a movie ---------- */
async function selectMovie(tmdbId){
  const key = getKey();
  const msg = document.getElementById('searchMsg');
  showMsg(msg,'info','Fetching details…');
  try{
    const res = await fetch(`https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${key}`);
    if(!res.ok) throw new Error('Could not fetch movie (' + res.status + ')');
    const m = await res.json();
    const cert = await fetchCertification(tmdbId, key);

    selectedMovie = {
      tmdbId: m.id,
      title: m.title,
      poster: m.poster_path ? TMDB_IMG + m.poster_path : ''
    };

    document.getElementById('previewBlock').style.display = 'flex';
    document.getElementById('previewPoster').src = selectedMovie.poster;
    document.getElementById('fTitle').value = m.title;
    document.getElementById('fPoster').value = selectedMovie.poster;
    document.getElementById('fWarn').value = '';
    document.getElementById('fTimes').value = '';

    const ratingSel = document.getElementById('fRating');
    const sourceNote = document.getElementById('ratingSource');
    if(cert.rating){
      ratingSel.value = cert.rating;
      sourceNote.className = 'source-note';
      sourceNote.textContent = `Suggested from ${cert.source} classification ("${cert.raw}") — please confirm this matches the official NZ (OFLC) rating before publishing.`;
    } else {
      ratingSel.value = 'M';
      sourceNote.className = 'source-note warn-tone';
      sourceNote.textContent = `TMDB had no classification on file for this title — defaulted to M. Please set the correct NZ rating yourself.`;
    }

    renderDayChecks();
    hideMsg(msg);
    document.getElementById('previewBlock').scrollIntoView({ behavior:'smooth', block:'center' });
  }catch(e){
    showMsg(msg,'bad','Something went wrong: ' + e.message);
  }
}

function renderDayChecks(){
  const wrap = document.getElementById('dayChecks');
  wrap.innerHTML = DAYS.map(d => `
    <label class="day-check" data-day="${d}">
      <input type="checkbox" value="${d}">
      <span>${d.slice(0,3)}</span>
    </label>`).join('');
  wrap.querySelectorAll('.day-check').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const input = el.querySelector('input');
      input.checked = !input.checked;
      el.classList.toggle('checked', input.checked);
    });
  });
}

/* ---------- add to schedule ---------- */
document.getElementById('addToScheduleBtn').addEventListener('click', () => {
  const msg = document.getElementById('searchMsg');
  const checkedDays = [...document.querySelectorAll('#dayChecks input:checked')].map(c => c.value);
  const timesRaw = document.getElementById('fTimes').value.trim();
  if(checkedDays.length === 0){ showMsg(msg,'bad','Tick at least one day.'); return; }
  if(!timesRaw){ showMsg(msg,'bad','Add at least one showtime.'); return; }

  const entry = {
    title: document.getElementById('fTitle').value.trim(),
    rating: document.getElementById('fRating').value,
    warn: document.getElementById('fWarn').value.trim(),
    poster: document.getElementById('fPoster').value.trim(),
    times: timesRaw.split(',').map(t => t.trim()).filter(Boolean)
  };

  checkedDays.forEach(d => schedule[d].push({...entry}));
  saveDraft();
  renderWeekSchedule();
  showMsg(msg,'good', `Added "${entry.title}" to ${checkedDays.join(', ')}.`);

  // reset the picker for the next movie
  document.getElementById('previewBlock').style.display = 'none';
  document.getElementById('searchTitle').value = '';
  document.getElementById('idInput').value = '';
  document.getElementById('searchResults').innerHTML = '';
  selectedMovie = null;
});

/* ---------- week schedule render + inline edit ---------- */
function renderWeekSchedule(){
  const wrap = document.getElementById('weekSchedule');
  wrap.innerHTML = DAYS.map(day => {
    const items = schedule[day] || [];
    return `
      <div class="week-day">
        <h3>${day} <span class="count">${items.length} session${items.length===1?'':'s'}</span></h3>
        ${items.length === 0
          ? `<div class="empty-day">Nothing added yet.</div>`
          : items.map((m, i) => `
            <div class="movie-row" data-day="${day}" data-idx="${i}">
              <img src="${m.poster||''}" alt="">
              <div class="title">${m.title}</div>
              <select class="rt-edit">
                ${['G','PG','M','R13','R16','R18'].map(r => `<option value="${r}" ${r===m.rating?'selected':''}>${r}</option>`).join('')}
              </select>
              <input type="text" class="tm-edit" value="${m.times.join(', ')}">
              <button class="btn-danger rm-btn">Remove</button>
            </div>`).join('')
        }
      </div>`;
  }).join('');

  wrap.querySelectorAll('.movie-row').forEach(row => {
    const day = row.dataset.day, idx = +row.dataset.idx;
    row.querySelector('.rt-edit').addEventListener('change', (e) => {
      schedule[day][idx].rating = e.target.value; saveDraft();
    });
    row.querySelector('.tm-edit').addEventListener('change', (e) => {
      schedule[day][idx].times = e.target.value.split(',').map(t=>t.trim()).filter(Boolean); saveDraft();
    });
    row.querySelector('.rm-btn').addEventListener('click', () => {
      schedule[day].splice(idx,1); saveDraft(); renderWeekSchedule();
    });
  });
}

document.getElementById('clearAllBtn').addEventListener('click', () => {
  if(!confirm('Clear the entire draft schedule? This cannot be undone.')) return;
  DAYS.forEach(d => schedule[d] = []);
  saveDraft();
  renderWeekSchedule();
});

/* ---------- generate / publish ---------- */
function buildScheduleCode(){
  const lines = ['const SCHEDULE = {'];
  DAYS.forEach((day, di) => {
    lines.push(`  ${day}: [`);
    schedule[day].forEach((m, mi) => {
      const comma = mi < schedule[day].length - 1 ? ',' : '';
      lines.push(`    { title:${JSON.stringify(m.title)}, rating:${JSON.stringify(m.rating)}, warn:${JSON.stringify(m.warn||'')}, times:${JSON.stringify(m.times)}, poster:${JSON.stringify(m.poster||'')} }${comma}`);
    });
    lines.push(`  ]${di < DAYS.length-1 ? ',' : ''}`);
  });
  lines.push('};');
  return lines.join('\n');
}

document.getElementById('generateBtn').addEventListener('click', async () => {
  const msg = document.getElementById('publishMsg');
  const code = buildScheduleCode();
  document.getElementById('codeOutput').value = code;

  try{
    const res = await fetch('index.html');
    if(!res.ok) throw new Error('status ' + res.status);
    const html = await res.text();
    const startMarker = '/* ===SCHEDULE_START=== */';
    const endMarker = '/* ===SCHEDULE_END=== */';
    const startIdx = html.indexOf(startMarker);
    const endIdx = html.indexOf(endMarker);
    if(startIdx === -1 || endIdx === -1) throw new Error('markers not found');

    const before = html.slice(0, startIdx + startMarker.length);
    const after = html.slice(endIdx);
    const newHtml = before + '\n' + code + '\n' + after;

    const blob = new Blob([newHtml], { type:'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'index.html';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showMsg(msg,'good','Done! A new index.html just downloaded — upload it to your website to replace the old one (same filename, same location).');
    document.getElementById('fallbackDetails').style.display = 'none';
  }catch(e){
    showMsg(msg,'info','Could not fetch index.html automatically from here (this usually only works once the site is uploaded to your actual web host, not when opening the file directly). Use the manual copy-paste method below instead.');
    document.getElementById('fallbackDetails').style.display = 'block';
    document.getElementById('fallbackDetails').open = true;
  }
});

document.getElementById('copyCodeBtn').addEventListener('click', () => {
  const ta = document.getElementById('codeOutput');
  ta.select();
  document.execCommand('copy');
  const btn = document.getElementById('copyCodeBtn');
  const old = btn.textContent;
  btn.textContent = 'Copied!';
  setTimeout(()=>btn.textContent = old, 1500);
});

/* ---------- message helpers ---------- */
function showMsg(el, kind, text){ el.className = 'msg show ' + kind; el.textContent = text; }
function hideMsg(el){ el.className = 'msg'; }

/* ---------- init ---------- */
refreshKeyStatus();
loadDraft();
renderWeekSchedule();