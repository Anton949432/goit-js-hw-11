
import axios from "axios";
import Notiflix from "notiflix";

const apiKey = "YOUR_API_KEY_HERE";

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

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    gallery.innerHTML = "";
    currentPage = 1;
    currentQuery = e.target.elements.searchQuery.value.trim();
    fetchImages();
});

loadMoreBtn.addEventListener("click", fetchImages);

function fetchImages() {
    if (!currentQuery) {
        return;
    }

    axios
        .get("/?q=" + currentQuery + "&page=" + currentPage)
        .then((response) => {
            const images = response.data.hits;

            if (images.length === 0) {
                Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
                return;
            }

            appendImages(images);
            currentPage += 1;
            scrollToNextPage();
        })
        .catch((error) => {
            console.error("Error fetching images:", error);
            Notiflix.Notify.failure("Oops! Something went wrong. Please try again later.");
        });
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
