const API = localStorage.getItem('s_key') || '3fd2be6f0c70a2a598f084ddfb75487c';
const BASE = 'https://api.themoviedb.org/3', IMG = 'https://image.tmdb.org/t/p/w500';
let page = 1, moviesPage = 1, tvPage = 1;
let currentId = null, currentType = 'movie', currentServerIdx = 0, detailsData = null;

window.onload = async () => {
    for (let y = 2026; y >= 1960; y--) document.getElementById('year-select').innerHTML += `<option value="${y}">${y}</option>`;
    let gRes = await fetch(`${BASE}/genre/movie/list?api_key=${API}`).then(r => r.json());
    if(gRes.genres) gRes.genres.forEach(g => document.getElementById('genre-select').innerHTML += `<option value="${g.id}">${g.name}</option>`);
    loadCatalog(true);
    loadTabContent('movie', 'grid-movies', 'movie', true);
    loadTabContent('tv', 'grid-tv', 'tv', true);
};

async function loadCatalog(reset = false) {
    if (reset) page = 1;
    let type = document.getElementById('filter-type').value;
    let genre = document.getElementById('genre-select').value;
    let year = document.getElementById('year-select').value;
    let url = `${BASE}/trending/${type === 'all' ? 'all' : type}/day?api_key=${API}&page=${page}`;
    if(genre || year) {
        let t = type === 'all' ? 'movie' : type;
        url = `${BASE}/discover/${t}?api_key=${API}&page=${page}`;
        if(genre) url += `&with_genres=${genre}`;
        if(year) url += t === 'movie' ? `&primary_release_year=${year}` : `&first_air_date_year=${year}`;
    }
    let data = await fetch(url).then(r => r.json());
    if(reset) document.getElementById('grid-home').innerHTML = '';
    if(data.results?.[0] && reset) setHero(data.results[0]);
    renderGrid(data.results, 'grid-home', false);
}

async function loadTabContent(type, gridId, mediaType, reset = false) {
    if (type === 'movie') { if (reset) moviesPage = 1; }
    else { if (reset) tvPage = 1; }

    let curPage = (type === 'movie') ? moviesPage : tvPage;
    let data = await fetch(`${BASE}/${type}/popular?api_key=${API}&page=${curPage}`).then(r => r.json());
    renderGrid(data.results.map(i => ({...i, media_type: mediaType})), gridId, !reset);
}

function loadMoreMovies() { moviesPage++; loadTabContent('movie', 'grid-movies', 'movie', false); }
function loadMoreTv() { tvPage++; loadTabContent('tv', 'grid-tv', 'tv', false); }

function renderGrid(items, gridId, append = false) {
    let g = document.getElementById(gridId);
    if(!items || items.length === 0) { if(!append) g.innerHTML = '<p class="text-xs text-gray-500 col-span-full">No items found.</p>'; return; }
    if(!append) g.innerHTML = '';
    items.forEach(i => {
        let title = i.title || i.name || '';
        let poster = i.poster_path ? IMG + i.poster_path : 'https://placehold.co/300x450';
        let type = i.media_type || (i.title ? 'movie' : 'tv');
        g.innerHTML += `<div onclick="openDetails(${i.id}, '${type}')" class="glass rounded-xl overflow-hidden card cursor-pointer">
            <div class="aspect-[2/3] bg-black"><img src="${poster}" class="w-full h-full object-cover" loading="lazy"></div>
            <div class="p-2"><h4 class="text-xs font-bold truncate text-white">${title}</h4><div class="text-[10px] text-gray-400">${(i.release_date||i.first_air_date||'').substring(0,4)}</div></div>
        </div>`;
    });
}

function setHero(i) {
    let type = i.media_type || (i.title ? 'movie' : 'tv');
    document.getElementById('hero').style.backgroundImage = `url('https://image.tmdb.org/t/p/original${i.backdrop_path}')`;
    document.getElementById('hero-title').innerText = i.title || i.name;
    document.getElementById('hero-desc').innerText = i.overview;
    document.getElementById('hero-btn').onclick = () => openDetails(i.id, type);
}

async function openDetails(id, type) {
    currentId = id; currentType = type;
    detailsData = await fetch(`${BASE}/${type}/${id}?api_key=${API}`).then(r => r.json());
    document.getElementById('modal-title').innerText = detailsData.title || detailsData.name;
    document.getElementById('modal-desc').innerText = detailsData.overview;
    document.getElementById('modal-bg').style.backgroundImage = `url('https://image.tmdb.org/t/p/original${detailsData.backdrop_path}')`;
    
    checkFavoriteState();

    let colSec = document.getElementById('collection-section');
    if(type === 'movie' && detailsData.belongs_to_collection) {
        colSec.classList.remove('hidden');
        loadCollection(detailsData.belongs_to_collection.id);
    } else {
        colSec.classList.add('hidden');
    }

    let tvSec = document.getElementById('tv-controls');
    if(type === 'tv' && detailsData.seasons) {
        tvSec.classList.remove('hidden');
        let sSel = document.getElementById('season-sel'); sSel.innerHTML = '';
        detailsData.seasons.forEach(s => { if(s.season_number>0) sSel.innerHTML += `<option value="${s.season_number}">${s.name}</option>`; });
        loadEpisodes(1);
    } else { tvSec.classList.add('hidden'); updatePlayer(); }
    
    openModal('details-modal');
    saveHistory(detailsData, type);
}

async function loadCollection(colId) {
    let res = await fetch(`${BASE}/collection/${colId}?api_key=${API}`).then(r => r.json());
    let grid = document.getElementById('collection-grid');
    grid.innerHTML = '';
    res.parts?.forEach(m => {
        let poster = m.poster_path ? IMG + m.poster_path : 'https://placehold.co/200x300';
        grid.innerHTML += `<div onclick="openDetails(${m.id}, 'movie')" class="cursor-pointer glass rounded-lg overflow-hidden"><img src="${poster}" class="w-full aspect-[2/3] object-cover"><div class="p-1 text-[10px] truncate text-white">${m.title}</div></div>`;
    });
}

async function loadEpisodes(season) {
    let data = await fetch(`${BASE}/tv/${currentId}/season/${season}?api_key=${API}`).then(r => r.json());
    let eSel = document.getElementById('episode-sel'); eSel.innerHTML = '';
    data.episodes?.forEach(e => eSel.innerHTML += `<option value="${e.episode_number}">Ep ${e.episode_number}: ${e.name}</option>`);
    updatePlayer();
}

function changeSeason() { loadEpisodes(document.getElementById('season-sel').value); }

function updatePlayer() {
    let s = document.getElementById('season-sel').value || 1, e = document.getElementById('episode-sel').value || 1;
    const servers = [
        currentType === 'tv' ? `https://vidsrc.me/embed/tv?tmdb=${currentId}&season=${s}&episode=${e}` : `https://vidsrc.me/embed/movie?tmdb=${currentId}`,
        currentType === 'tv' ? `https://vidlink.pro/tv/${currentId}/${s}/${e}` : `https://vidlink.pro/movie/${currentId}`,
        currentType === 'tv' ? `https://vidsrc.to/embed/tv/${currentId}/${s}/${e}` : `https://vidsrc.to/embed/movie/${currentId}`,
        currentType === 'tv' ? `https://multiembed.mov/?video_id=${currentId}&tmdb=1&s=${s}&e=${e}` : `https://multiembed.mov/?video_id=${currentId}&tmdb=1`,
        currentType === 'tv' ? `https://2embed.cc/embedtv/${currentId}&s=${s}&e=${e}` : `https://2embed.cc/embed/${currentId}`,
        currentType === 'tv' ? `https://atlantic.st/tv/${currentId}/${s}/${e}` : `https://atlantic.st/movie/${currentId}`,
        currentType === 'tv' ? `https://vidsrc.win/embed/tv/${currentId}/${s}/${e}` : `https://vidsrc.win/embed/movie/${currentId}`
    ];
    document.getElementById('iframe-player').src = servers[currentServerIdx];
}

function setServer(idx) {
    currentServerIdx = idx;
    document.querySelectorAll('.srv-btn').forEach((b, i) => {
        b.className = i === idx ? 'px-2.5 py-1.5 bg-red-600 rounded-lg text-[10px] font-bold srv-btn whitespace-nowrap' : 'px-2.5 py-1.5 bg-white/10 rounded-lg text-[10px] font-bold srv-btn whitespace-nowrap';
    });
    updatePlayer();
}

function switchTab(id) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.getElementById(`tab-${id}`).classList.add('active');
    ['home','movies','tv','favorites','history'].forEach(t => {
        let b = document.getElementById(`nav-${t}`), mb = document.getElementById(`m-${t}`);
        if(b) { b.className = t === id ? 'px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-white/10' : 'px-3 py-1.5 rounded-lg text-xs font-bold text-gray-400'; }
        if(mb) { mb.className = t === id ? 'flex flex-col items-center text-[10px] text-red-500 font-bold' : 'flex flex-col items-center text-[10px] text-gray-400'; }
    });
    if(id === 'favorites') renderList('stream_favs', 'grid-favorites');
    if(id === 'history') renderList('stream_hist', 'grid-history');
}

async function doSearch(q) {
    if(!q) return document.getElementById('search-results').innerHTML = '';
    let res = await fetch(`${BASE}/search/multi?api_key=${API}&query=${encodeURIComponent(q)}`).then(r => r.json());
    let c = document.getElementById('search-results'); c.innerHTML = '';
    res.results?.forEach(i => {
        if(i.poster_path) c.innerHTML += `<div onclick="closeModal('search-modal');openDetails(${i.id},'${i.media_type}')" class="glass p-2 rounded-xl flex items-center space-x-3 cursor-pointer"><img src="${IMG+i.poster_path}" class="w-10 h-14 object-cover rounded"><div><h4 class="text-xs font-bold text-white">${i.title||i.name}</h4><span class="text-[10px] text-gray-400">${(i.release_date||i.first_air_date||'').substring(0,4)}</span></div></div>`;
    });
}

function toggleFavorite() {
    let favs = JSON.parse(localStorage.getItem('stream_favs')||'[]');
    let idx = favs.findIndex(x => x.id === currentId);
    if(idx > -1) {
        favs.splice(idx, 1);
    } else {
        favs.unshift({id: currentId, title: detailsData.title||detailsData.name, poster_path: detailsData.poster_path, release_date: detailsData.release_date||detailsData.first_air_date, media_type: currentType});
    }
    localStorage.setItem('stream_favs', JSON.stringify(favs));
    checkFavoriteState();
}

function checkFavoriteState() {
    let favs = JSON.parse(localStorage.getItem('stream_favs')||'[]');
    let isFav = favs.some(x => x.id === currentId);
    let icon = document.getElementById('fav-icon');
    icon.className = isFav ? "fa-solid fa-heart text-red-500" : "fa-regular fa-heart text-red-500";
}

function saveHistory(i, type) {
    let h = JSON.parse(localStorage.getItem('stream_hist')||'[]');
    h = h.filter(x => x.id !== i.id);
    h.unshift({id: i.id, title: i.title||i.name, poster_path: i.poster_path, release_date: i.release_date||i.first_air_date, media_type: type});
    localStorage.setItem('stream_hist', JSON.stringify(h.slice(0,20)));
}

function renderList(key, gridId) {
    let data = JSON.parse(localStorage.getItem(key)||'[]');
    renderGrid(data, gridId, false);
}

function clearHistory() { localStorage.removeItem('stream_hist'); renderList('stream_hist', 'grid-history'); }
function openModal(id) { document.getElementById(id).classList.replace('hidden', 'block'); }
function closeModal(id) { document.getElementById(id).classList.replace('block', 'hidden'); if(id==='details-modal') document.getElementById('iframe-player').src=''; }
function loadMore() { page++; loadCatalog(false); }
function saveApi() { localStorage.setItem('s_key', document.getElementById('api-input').value); location.reload(); }
