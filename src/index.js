import axios from "axios";
import Notiflix from "notiflix";

const apiKey = "39935227-75739c8736a388a48177e3f8a";

axios.defaults.baseURL = "https://pixabay.com/api/";
axios.defaults.params = {
    key: apiKey,
    image_type: "photo",
    orientation: "horizontal",
    safesearch: true,
    per_page: 40,
};

const searchForm = document.getElementById("search-form");
const gallery = document.querySelector(".gallery");
const loadMoreBtn = document.querySelector(".load-more");
const messageDiv = document.querySelector(".message");

let currentPage = 1;
let currentQuery = "";

searchForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    gallery.innerHTML = "";
    currentPage = 1;
    currentQuery = e.target.elements.searchQuery.value.trim();
    await fetchImages();
});

loadMoreBtn.addEventListener("click", async () => {
    await fetchImages();
});

async function fetchImages() {
    if (!currentQuery) {
        return;
    }

    try {
        const response = await axios.get(`/?q=${currentQuery}&page=${currentPage}`);
        const images = response.data.hits;

        if (images.length === 0) {
            Notiflix.Notify.failure("Вибачте, немає зображень, які відповідають вашому пошуковому запиту. Будь ласка спробуйте ще раз.");
            return;
        }

        appendImages(images);
        currentPage += 1;
        scrollToNextPage();

        if (images.length < 40) {
            loadMoreBtn.style.display = "none";
        } else {
            loadMoreBtn.style.display = "block";
        }
    } catch (error) {
        console.error("Error fetching images:", error);
        Notiflix.Notify.failure("Ой! Щось пішло не так. Будь-ласка спробуйте пізніше.");
    }
}

function appendImages(images) {
    const galleryHTML = images
        .map((image) => {
            return `
        <div class="photo-card">
          <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
          <div class="info">
            <p class="info-item"><b>Likes:</b> ${image.likes}</p>
            <p class="info-item"><b>Views:</b> ${image.views}</p>
            <p class="info-item"><b>Comments:</b> ${image.comments}</p>
            <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>
          </div>
        </div>
      `;
        })
        .join("");

    gallery.insertAdjacentHTML("beforeend", galleryHTML);
}

function scrollToNextPage() {
    const cardHeight = gallery.firstElementChild.getBoundingClientRect().height;
    const scrollAmount = cardHeight * 2;

    window.scrollBy({
        top: scrollAmount,
        behavior: "smooth",
    });
}

window.addEventListener("beforeunload", (event) => {
    event.preventDefault();
    event.returnValue = "";
});

if (gallery.children.length < 1) {
    loadMoreBtn.style.display = "none";
}
