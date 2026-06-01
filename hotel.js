<<<<<<< HEAD
=======
const API = "/api";

>>>>>>> ef391044fe8bc4a8768d62d7274e1448a07d73f2
const hero = document.getElementById("hotel-hero");
const container = document.getElementById("hotel-page");

const params = new URLSearchParams(window.location.search);
<<<<<<< HEAD
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
=======
const hotelId = params.get("id");

let hotel = null;
let currentImage = 0;
let images = [];

async function loadHotel() {
    try {
        // Load hotel details
        const res = await fetch(`${API}/hotels`);
        const allHotels = await res.json();
        const h = allHotels.find(h => h.HotelID === hotelId);

        if (!h) {
            container.innerHTML = "<p>სასტუმრო ვერ მოიძებნა</p>";
            return;
        }

        hotel = {
            id: h.HotelID,
            name: h.Name,
            city: h.Location.split(",")[0].trim(),
            location: h.Location,
            stars: Math.round(h.StarRating),
            rating: h.StarRating,
            email: h.Email,
            price: getPriceByStars(h.StarRating),
            image: `https://loremflickr.com/800/600/hotel,luxury,architecture?lock=${h.HotelID}`
        };

        images = [
            hotel.image,
            `https://loremflickr.com/800/600/hotel,interior,lobby?lock=${hotel.id}2`,
            `https://loremflickr.com/800/600/hotel,room,bedroom?lock=${hotel.id}3`
        ];

        // Load rooms for this hotel
        const roomsRes = await fetch(`${API}/hotels/${hotelId}/rooms`);
        const rooms = await roomsRes.json();

        renderHero();
        renderHotel(rooms);
        loadMap();
        loadComments();

    } catch (err) {
        console.error("Error loading hotel:", err);
        container.innerHTML = "<p>შეცდომა მონაცემების ჩატვირთვისას</p>";
    }
}

function getPriceByStars(stars) {
    if (stars === 5) return Math.floor(Math.random() * 400) + 600;
    if (stars >= 4.5) return Math.floor(Math.random() * 200) + 350;
    if (stars >= 4) return Math.floor(Math.random() * 150) + 200;
    return Math.floor(Math.random() * 100) + 100;
}

function renderHero() {
    hero.style.background = `url(${hotel.image}) center/cover`;
    hero.innerHTML = `
        <div class="hero-overlay">
            <h1>${hotel.name}</h1>
            <p>${hotel.city}</p>
        </div>
    `;
}

function renderHotel(rooms) {
    const roomsHTML = rooms.length > 0 ? `
        <div class="rooms-section">
            <h2>ნომრები</h2>
            ${rooms.map(r => `
                <div class="room-card">
                    <h3>${r.RoomType}</h3>
                    <p>💰 $${r.Price} / ღამე</p>
                    <p>✅ ${r.Availability ? 'ხელმისაწვდომია' : 'დაჯავშნილია'}</p>
                    <p>🛎️ ${r.Features || 'სტანდარტული მომსახურება'}</p>
                    ${r.Availability ? `<button class="book-btn" onclick="bookRoom('${r.RoomID}', '${r.RoomType}', ${r.Price})">დაჯავშნა - $${r.Price}</button>` : `<button class="book-btn disabled" disabled>დაჯავშნილია</button>`}
                </div>
            `).join("")}
        </div>
    ` : `<button class="book-btn" onclick="bookHotel()">დაჯავშნა - $${hotel.price}</button>`;

    container.innerHTML = `
        <div class="hotel-detail">
            <div class="carousel">
                <button onclick="prevImage()">←</button>
                <img src="${images[currentImage]}" id="carousel-img" onclick="openModal('${images[currentImage]}')" alt="${hotel.name}">
>>>>>>> ef391044fe8bc4a8768d62d7274e1448a07d73f2
                <button onclick="nextImage()">→</button>
            </div>

            <div class="hotel-info-big">
                <h1>${hotel.name}</h1>
<<<<<<< HEAD
                <p>${hotel.city}</p>
                <p>⭐ ${hotel.rating}</p>
                <p class="price">$${hotel.price}</p>

                <p>
                პრემიუმ კლასის სასტუმრო საუკეთესო პირობებით.
                იდეალურია დასვენებისთვის.
                </p>

                <button class="book-btn" onclick="bookHotel()">დაჯავშნა</button>
            </div>

=======
                <p>📍 ${hotel.location}</p>
                <p>${'⭐'.repeat(hotel.stars)} (${hotel.rating})</p>
                <p>✉️ ${hotel.email}</p>
                <p>პრემიუმ კლასის სასტუმრო საუკეთესო პირობებით. იდეალურია დასვენებისთვის.</p>
                ${roomsHTML}
            </div>
>>>>>>> ef391044fe8bc4a8768d62d7274e1448a07d73f2
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

<<<<<<< HEAD
renderHotel();

// Load map
const mapIframe = document.getElementById("hotel-map");
const lat = Number(hotel.lat) || 41.7151;
const lng = Number(hotel.lng) || 44.8271;
const bbox = `${lng - 0.02},${lat - 0.01},${lng + 0.02},${lat + 0.01}`;
mapIframe.src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;
=======
function loadMap() {
    const mapIframe = document.getElementById("hotel-map");
    const cityCoords = getCityCoords(hotel.location);
    const lat = cityCoords.lat;
    const lng = cityCoords.lng;
    const bbox = `${lng - 0.02},${lat - 0.01},${lng + 0.02},${lat + 0.01}`;
    mapIframe.src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;
}

function getCityCoords(location) {
    if (location.includes("Tbilisi"))       return { lat: 41.6938, lng: 44.8015 };
    if (location.includes("Batumi"))        return { lat: 41.6168, lng: 41.6367 };
    if (location.includes("Kutaisi"))       return { lat: 42.2679, lng: 42.7081 };
    if (location.includes("Gudauri"))       return { lat: 42.4800, lng: 44.4800 };
    if (location.includes("Stepantsminda")) return { lat: 42.6570, lng: 44.6570 };
    if (location.includes("Mestia"))        return { lat: 43.0530, lng: 42.7280 };
    if (location.includes("Borjomi"))       return { lat: 41.8369, lng: 43.4000 };
    if (location.includes("Telavi"))        return { lat: 41.9200, lng: 45.4700 };
    if (location.includes("Sighnaghi"))     return { lat: 41.6160, lng: 45.9220 };
    if (location.includes("Napareuli"))     return { lat: 41.8900, lng: 45.5200 };
    if (location.includes("Shekvetili"))    return { lat: 41.7760, lng: 41.6900 };
    return { lat: 41.6938, lng: 44.8015 };
}

async function bookRoom(roomId, roomType, price) {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
        alert("გთხოვთ გაიაროთ ავტორიზაცია");
        window.location.href = "auth.html";
        return;
    }

    const checkin = prompt("შეიყვანეთ შესვლის თარიღი (YYYY-MM-DD):");
    const checkout = prompt("შეიყვანეთ გასვლის თარიღი (YYYY-MM-DD):");

    if (!checkin || !checkout) return;

    const nights = Math.ceil((new Date(checkout) - new Date(checkin)) / (1000 * 60 * 60 * 24));
    if (nights <= 0) {
        alert("არასწორი თარიღები");
        return;
    }

    const total = nights * price;

    try {
        const res = await fetch(`${API}/bookings`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userID: currentUser.userID,
                roomID: roomId,
                checkIn: checkin,
                checkOut: checkout,
                total: total
            })
        });

        const result = await res.json();
        if (result.success) {
            alert(`დაჯავშნა წარმატებულია! სულ: $${total} (${nights} ღამე)`);
        } else {
            alert("შეცდომა: " + (result.error || "სცადეთ თავიდან"));
        }
    } catch (err) {
        alert("სერვერთან კავშირის შეცდომა");
    }
}
>>>>>>> ef391044fe8bc4a8768d62d7274e1448a07d73f2

function bookHotel() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
        alert("გთხოვთ გაიაროთ ავტორიზაცია");
        window.location.href = "auth.html";
        return;
    }
<<<<<<< HEAD

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
=======
    alert("დაჯავშნა წარმატებულია! ✅");
>>>>>>> ef391044fe8bc4a8768d62d7274e1448a07d73f2
}

function openModal(src) {
    const modal = document.getElementById("image-modal");
<<<<<<< HEAD
    const modalImg = document.getElementById("modal-img");
    modal.style.display = "block";
    modalImg.src = src;
=======
    document.getElementById("modal-img").src = src;
    modal.style.display = "block";
>>>>>>> ef391044fe8bc4a8768d62d7274e1448a07d73f2
}

function closeModal() {
    document.getElementById("image-modal").style.display = "none";
}

<<<<<<< HEAD
// Close modal on click outside
window.onclick = function(event) {
    const modal = document.getElementById("image-modal");
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
=======
window.onclick = function (event) {
    const modal = document.getElementById("image-modal");
    if (event.target === modal) modal.style.display = "none";
};
>>>>>>> ef391044fe8bc4a8768d62d7274e1448a07d73f2

function getCommentsKey() {
    return `comments_${hotelId}`;
}

function loadComments() {
    const comments = JSON.parse(localStorage.getItem(getCommentsKey())) || [];
<<<<<<< HEAD
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
=======
    const list = document.getElementById("comments-list");
    list.innerHTML = "";
    comments.forEach(c => {
        const div = document.createElement("div");
        div.classList.add("comment");
        div.innerHTML = `<strong>${c.name}</strong><p>${c.text}</p>`;
        list.appendChild(div);
>>>>>>> ef391044fe8bc4a8768d62d7274e1448a07d73f2
    });
}

function addComment() {
    const name = document.getElementById("username").value;
    const text = document.getElementById("commentText").value;
<<<<<<< HEAD

    if (!name || !text) {
        alert("შეავსეთ ყველა ველი");
        return;
    }

    let comments = JSON.parse(localStorage.getItem(getCommentsKey())) || [];

    comments.push({ name, text });

=======
    if (!name || !text) { alert("შეავსეთ ყველა ველი"); return; }

    let comments = JSON.parse(localStorage.getItem(getCommentsKey())) || [];
    comments.push({ name, text });
>>>>>>> ef391044fe8bc4a8768d62d7274e1448a07d73f2
    localStorage.setItem(getCommentsKey(), JSON.stringify(comments));

    document.getElementById("username").value = "";
    document.getElementById("commentText").value = "";
<<<<<<< HEAD

    loadComments();
}

// загрузка при старте
setTimeout(loadComments, 100);
=======
    loadComments();
}

loadHotel();
>>>>>>> ef391044fe8bc4a8768d62d7274e1448a07d73f2
