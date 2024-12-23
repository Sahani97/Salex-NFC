// Replace with your actual Google Drive Folder ID and API Key
const PARENT_FOLDER_ID = '1wYiQzqtTti-6Aw3X7CVJbJEInIwOzTYs';
const API_KEY = 'AIzaSyA0TVxZI4ySQ-XANSUllwCbwSdxrVBOWe4';

// Elemente aus dem DOM
const albumsGrid = document.getElementById('albums-grid');
const arrowLeft = document.querySelector('.arrow-left');
const arrowRight = document.querySelector('.arrow-right');

// Funktion zum Laden der Alben
async function loadAlbums() {
    try {
        const response = await fetch(
            `https://www.googleapis.com/drive/v3/files?q='${PARENT_FOLDER_ID}'+in+parents+and+mimeType='application/vnd.google-apps.folder'&key=${API_KEY}&fields=files(id,name,webViewLink)`
        );
        const data = await response.json();

        if (data.files) {
            displayAlbums(data.files);
            updateArrowsVisibility(); // Pfeile nach dem Laden aktualisieren
        } else {
            albumsGrid.innerHTML = '<p>No albums found.</p>';
        }
    } catch (error) {
        console.error('Error fetching albums:', error);
        albumsGrid.innerHTML = '<p>Error loading albums. Please try again later.</p>';
    }
}

// Funktion zum Anzeigen der Alben im Grid
function displayAlbums(albums) {
    albumsGrid.innerHTML = ''; // Alte Inhalte löschen

    albums.forEach((album) => {
        const albumElement = document.createElement('div');
        albumElement.classList.add('album');
        albumElement.textContent = album.name;

        // Beim Klicken auf ein Album zur Google Drive URL navigieren
        albumElement.addEventListener('click', () => {
            window.open(album.webViewLink, '_blank');
        });

        albumsGrid.appendChild(albumElement);
    });
}

// Aktualisiere Sichtbarkeit der Pfeile
function updateArrowsVisibility() {
    const canScrollLeft = albumsGrid.scrollLeft > 0;
    const canScrollRight = albumsGrid.scrollLeft < albumsGrid.scrollWidth - albumsGrid.clientWidth;

    arrowLeft.classList.toggle('hidden', !canScrollLeft);
    arrowRight.classList.toggle('hidden', !canScrollRight);
}

// Scrollen mit Pfeilen
arrowLeft.addEventListener('click', () => {
    albumsGrid.scrollBy({ left: -200, behavior: 'smooth' });
});

arrowRight.addEventListener('click', () => {
    albumsGrid.scrollBy({ left: 200, behavior: 'smooth' });
});

// Alben beim Laden prüfen
albumsGrid.addEventListener('scroll', updateArrowsVisibility);
window.addEventListener('resize', updateArrowsVisibility);

// Alben beim Laden der Seite laden
loadAlbums();
