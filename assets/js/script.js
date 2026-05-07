let url_api = "https://rickandmortyapi.com/api/character";


let originalCharacters = [];


let list = document.getElementById("character");
let btnNext = document.getElementById("btnNext");
let btnPrev = document.getElementById("btnPrev");
let pageText = document.getElementById("page-info");
let filterButtons = document.querySelectorAll(".filter-btn");

let activeFilter = "all";


// ======================================================
// REQUEST DATA
// ======================================================

async function requestData(url) {
    try {
        const response = await axios.get(url);

        let apiData = response.data;
        originalCharacters = apiData.results;

        let next = apiData.info.next;
        let prev = apiData.info.prev;

        setButtons(apiData.info);
        renderHtml(apiData);

    } catch (error) {
        console.error("Request error:", error);
    }
}

requestData(url_api);

// ======================================================
// BUTTONS (NEXT / PREV)
// ======================================================

function setButtons(info) {

    btnPrev.disabled = (info.prev === null);
    btnNext.disabled = (info.next === null);

    btnNext.onclick = function () {
        if (info.next) {
            requestData(info.next);
            let loading = document.querySelector(".loading");
            loading.classList.toggle("show");

            setTimeout(() => {
                loading.classList.remove("show");
            }, 1000);
        }
    };

    btnPrev.onclick = function () {
        if (info.prev) {
            requestData(info.prev);
            let loading = document.querySelector(".loading");
            loading.classList.toggle("show");

            setTimeout(() => {
                loading.classList.remove("show");
            }, 1000);
        }
    };

    let match = info.next ? info.next.match(/page=(\d+)/) : null;
    let currentPage = match ? parseInt(match[1]) - 1 : info.pages;

    pageText.textContent = "Page " + currentPage + " of " + info.pages;
}


// ======================================================
// RENDER
// ======================================================

function renderHtml(data) {

    list.innerHTML = "";

    let characters = data.results;

    if (activeFilter !== "all") {
        characters = filterByGender(activeFilter);
    }

    for (let i = 0; i < characters.length; i++) {

        let character = characters[i];

        let html = `
        <li>
            <img src="${character.image}">
            <h3>${character.name}</h3>
            <p>${character.gender}</p>
        </li>
        `;

        list.innerHTML += html;
    }
}

// ======================================================
// FILTERS (NO FOREACH)
// ======================================================
console.log(filterButtons)
for (let i = 0; i < filterButtons.length; i++) {

    filterButtons[i].onclick = function () {

        let gender = this.dataset.gender;
        activeFilter = gender;

        for (let j = 0; j < filterButtons.length; j++) {
            filterButtons[j].classList.remove("active");
        }

        this.classList.add("active");

        let filtered = filterByGender(gender);
        renderList(filtered);
    };

}


// ======================================================
// FILTER FUNCTION
// ======================================================

function filterByGender(gender) {

    if (gender === "all") return originalCharacters;

    let result = [];

    for (let i = 0; i < originalCharacters.length; i++) {

        let character = originalCharacters[i];
        if (character.gender.toLowerCase() === gender.toLowerCase()) {
            result.push(character);
        }
    }
    return result;
}


// ======================================================
// RENDER FILTERED LIST
// ======================================================

function renderList(filteredList) {

    list.innerHTML = "";

    for (let i = 0; i < filteredList.length; i++) {

        let character = filteredList[i];

        let html = `
        <li>
            <img src="${character.image}">
            <h3>${character.name}</h3>
            <p>${character.gender}</p>
        </li>
        `;

        list.innerHTML += html;
    }
}

