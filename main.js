
const animeSearch = document.getElementById('anime-search');
const mangaSearch = document.getElementById('manga-search');
const characterSearch = document.getElementById('character-search');

const animeResults = document.getElementById('anime-results');
const mangaResults = document.getElementById('manga-results');
const characterResults = document.getElementById('character-results');

const loadingIndicator = document.querySelector('.loading-indicator');
const clearButtons = document.querySelectorAll('.clear-btn');
const backToTopBtn = document.getElementById('back-to-top-btn');

animeSearch.addEventListener('keyup', searchAnime);
mangaSearch.addEventListener('keyup', searchManga);
characterSearch.addEventListener('keyup', searchCharacters);

clearButtons.forEach(button => {
    button.addEventListener('click', () => {
        const targetInput = document.getElementById(button.dataset.target);
        targetInput.value = '';
        const targetResults = document.getElementById(`${button.dataset.target}-results`.replace('-search', ''));
        targetResults.innerHTML = '';
        if (button.dataset.target === 'anime-search') {
            getTopAnime();
        }
    });
});

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopBtn.style.display = 'block';
    } else {
        backToTopBtn.style.display = 'none';
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

const JIKAN_API_URL = 'https://api.jikan.moe/v4';

async function getTopAnime() {
    showLoadingIndicator();
    try {
        const response = await fetch(`${JIKAN_API_URL}/top/anime`);
        const data = await response.json();
        displayAnime(data.data, 'Top Anime Recommendations');
    } catch (error) {
        console.error('Error fetching top anime:', error);
    } finally {
        hideLoadingIndicator();
    }
}

async function searchAnime() {
    const query = animeSearch.value;
    if (query.length < 3) {
        animeResults.innerHTML = '';
        getTopAnime();
        return;
    }

    showLoadingIndicator();
    try {
        const response = await fetch(`${JIKAN_API_URL}/anime?q=${query}`);
        const data = await response.json();
        displayAnime(data.data, 'Anime Search Results');
    } catch (error) {
        console.error('Error fetching anime:', error);
    } finally {
        hideLoadingIndicator();
    }
}

async function searchManga() {
    const query = mangaSearch.value;
    if (query.length < 3) {
        mangaResults.innerHTML = '';
        return;
    }

    showLoadingIndicator();
    try {
        const response = await fetch(`${JIKAN_API_URL}/manga?q=${query}`);
        const data = await response.json();
        displayManga(data.data);
    } catch (error) {
        console.error('Error fetching manga:', error);
    } finally {
        hideLoadingIndicator();
    }
}

async function searchCharacters() {
    const query = characterSearch.value;
    if (query.length < 3) {
        characterResults.innerHTML = '';
        return;
    }

    showLoadingIndicator();
    try {
        const response = await fetch(`${JIKAN_API_URL}/characters?q=${query}`);
        const data = await response.json();
        displayCharacters(data.data);
    } catch (error) {
        console.error('Error fetching characters:', error);
    } finally {
        hideLoadingIndicator();
    }
}

function displayAnime(animeList, title) {
    animeResults.innerHTML = `<h2>${title}</h2>`;
    if (animeList.length === 0) {
        animeResults.innerHTML += '<p>No results found.</p>';
        return;
    }
    const grid = document.createElement('div');
    grid.classList.add('results-grid');
    animeList.forEach(anime => {
        const animeCard = document.createElement('result-card');
        animeCard.setAttribute('title', anime.title);
        animeCard.setAttribute('image-url', anime.images.jpg.large_image_url ?? 'https://via.placeholder.com/280x400');
        animeCard.setAttribute('synopsis', anime.synopsis ?? 'No synopsis available.');
        animeCard.setAttribute('score', anime.score);
        grid.appendChild(animeCard);
    });
    animeResults.appendChild(grid);
}

function displayManga(mangaList) {
    mangaResults.innerHTML = '<h2>Manga</h2>';
    if (mangaList.length === 0) {
        mangaResults.innerHTML += '<p>No results found.</p>';
        return;
    }
    const grid = document.createElement('div');
    grid.classList.add('results-grid');
    mangaList.forEach(manga => {
        const mangaCard = document.createElement('result-card');
        mangaCard.setAttribute('title', manga.title);
        mangaCard.setAttribute('image-url', manga.images.jpg.large_image_url ?? 'https://via.placeholder.com/280x400');
        mangaCard.setAttribute('synopsis', manga.synopsis ?? 'No synopsis available.');
        mangaCard.setAttribute('score', manga.score);
        grid.appendChild(mangaCard);
    });
    mangaResults.appendChild(grid);
}

function displayCharacters(characterList) {
    characterResults.innerHTML = '<h2>Characters</h2>';
    if (characterList.length === 0) {
        characterResults.innerHTML += '<p>No results found.</p>';
        return;
    }
    const grid = document.createElement('div');
    grid.classList.add('results-grid');
    characterList.forEach(character => {
        const characterCard = document.createElement('result-card');
        characterCard.setAttribute('title', character.name);
        characterCard.setAttribute('image-url', character.images.jpg.image_url ?? 'https://via.placeholder.com/280x400');
        characterCard.setAttribute('synopsis', character.about ?? 'No information available.');
        grid.appendChild(characterCard);
    });
    characterResults.appendChild(grid);
}

function showLoadingIndicator() {
    loadingIndicator.style.display = 'block';
}

function hideLoadingIndicator() {
    loadingIndicator.style.display = 'none';
}

window.addEventListener('DOMContentLoaded', getTopAnime);
