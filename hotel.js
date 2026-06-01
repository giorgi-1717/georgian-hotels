const hero = document.getElementById("hotel-hero");
const container = document.getElementById("hotel-page");

const params = new URLSearchParams(window.location.search);
const hotelId = Number(params.get("id"));

const hotel = hotels.find(h => h.id === hotelId);

let currentImage = 0;

const images = [
    hotel.image,
    "assets/hotel1.jpg",
    "assets/hotel2.jpg"
];

// HERO
hero.style.background = `url(${hotel.image}) center/cover`;
hero.innerHTML = `
    <div class="hero-overlay">
        <h1>${hotel.name}</h1>
        <p>${hotel.city}</p>
    </div>
`;

function renderHotel() {
    container.innerHTML = `
        <div class="hotel-detail">

            <div class="carousel">
                <button onclick="prevImage()">←</button>
                <img src="${images[currentImage]}" id="carousel-img" onclick="openModal('${images[currentImage]}')">
                <button onclick="nextImage()">→</button>
            </div>

            <div class="hotel-info-big">
                <h1>${hotel.name}</h1>
                <p>${hotel.city}</p>
                <p>⭐ ${hotel.rating}</p>
                <p class="price">$${hotel.price}</p>

                <p>
                პრემიუმ კლასის სასტუმრო საუკეთესო პირობებით.
                იდეალურია დასვენებისთვის.
                </p>

                <button class="book-btn" onclick="bookHotel()">დაჯავშნა</button>
            </div>

        </div>
    `;
}

function nextImage() {
    currentImage = (currentImage + 1) % images.length;
    document.getElementById("carousel-img").src = images[currentImage];
}

function prevImage() {
    currentImage = (currentImage - 1 + images.length) % images.length;
    document.getElementById("carousel-img").src = images[currentImage];
}

renderHotel();

// Load map
const mapIframe = document.getElementById("hotel-map");
const lat = Number(hotel.lat) || 41.7151;
const lng = Number(hotel.lng) || 44.8271;
const bbox = `${lng - 0.02},${lat - 0.01},${lng + 0.02},${lat + 0.01}`;
mapIframe.src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;

function bookHotel() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
        alert("გთხოვთ გაიაროთ ავტორიზაცია");
        window.location.href = "auth.html";
        return;
    }

    const bookingsKey = `bookings_${currentUser.email}`;
    let bookings = JSON.parse(localStorage.getItem(bookingsKey)) || [];

    // Check if already booked
    if (bookings.find(b => b.hotelId === hotelId)) {
        alert("ეს სასტუმრო უკვე დაჯავშნილია");
        return;
    }

    bookings.push({
        hotelId: hotelId,
        hotelName: hotel.name,
        date: new Date().toISOString().split('T')[0] // Today's date
    });

    localStorage.setItem(bookingsKey, JSON.stringify(bookings));
    alert("დაჯავშნა წარმატებულია!");
}

function openModal(src) {
    const modal = document.getElementById("image-modal");
    const modalImg = document.getElementById("modal-img");
    modal.style.display = "block";
    modalImg.src = src;
}

function closeModal() {
    document.getElementById("image-modal").style.display = "none";
}

// Close modal on click outside
window.onclick = function(event) {
    const modal = document.getElementById("image-modal");
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function getCommentsKey() {
    return `comments_${hotelId}`;
}

function loadComments() {
    const comments = JSON.parse(localStorage.getItem(getCommentsKey())) || [];
    const container = document.getElementById("comments-list");

    container.innerHTML = "";

    comments.forEach(c => {
        const div = document.createElement("div");
        div.classList.add("comment");

        div.innerHTML = `
            <strong>${c.name}</strong>
            <p>${c.text}</p>
        `;

        container.appendChild(div);
    });
}

function addComment() {
    const name = document.getElementById("username").value;
    const text = document.getElementById("commentText").value;

    if (!name || !text) {
        alert("შეავსეთ ყველა ველი");
        return;
    }

    let comments = JSON.parse(localStorage.getItem(getCommentsKey())) || [];

    comments.push({ name, text });

    localStorage.setItem(getCommentsKey(), JSON.stringify(comments));

    document.getElementById("username").value = "";
    document.getElementById("commentText").value = "";

    loadComments();
}

// загрузка при старте
setTimeout(loadComments, 100);