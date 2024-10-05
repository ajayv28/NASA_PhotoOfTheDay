const apiKey = "mhMKqCOnwoESf76dECb7BdPuUTq39DPXCKYThbki";
const currentImageContainer = document.getElementById('current-image-container');
const currentImage = document.getElementById('current-image');
const currentImageDescription = document.getElementById('current-image-description');
const currentImageTitle = document.getElementById('current-image-title');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const searchHistory = document.getElementById('search-history');

document.addEventListener("DOMContentLoaded", () => {
    getCurrentImageOfTheDay();
    loadSearchHistory();
});

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const date = searchInput.value;
    getImageOfTheDay(date);
});

async function getCurrentImageOfTheDay() {
    const currentDate = new Date().toISOString().split("T")[0];
    try {
        const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${currentDate}`);
        const data = await response.json();
        displayImage(data);
    } catch (error) {
        console.error("Error:", error);
    }
}

async function getImageOfTheDay(date) {
    try {
        const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${date}`);
        const data = await response.json();
        currentImageTitle.textContent = `Picture On ${date}`; 
        displayImage(data);
        saveSearch(date);
        addSearchToHistory(date);
    } catch (error) {
        console.error("Error:", error);
    }
}

function displayImage(data) {
    currentImage.src = data.url;
    currentImageDescription.textContent = data.explanation;
}

function saveSearch(date) {
    let searches = JSON.parse(localStorage.getItem("searches")) || [];
    if (!searches.includes(date)) {
        searches.push(date);
        localStorage.setItem("searches", JSON.stringify(searches));
    }
}

function loadSearchHistory() {
    const searches = JSON.parse(localStorage.getItem("searches")) || [];
    searches.forEach(date => addSearchToHistory(date));
}

function addSearchToHistory(date) {
    const existingItems = Array.from(searchHistory.children).map(item => item.textContent);
    if (!existingItems.includes(date)) {
        const a = document.createElement("a"); 
        a.textContent = date;
        a.href = "#"; 
        a.addEventListener("click", (e) => {
            e.preventDefault(); 
            getImageOfTheDay(date);
        });
        
        const li = document.createElement("li"); 
        li.appendChild(a); 
        searchHistory.appendChild(li); 
    }
}
