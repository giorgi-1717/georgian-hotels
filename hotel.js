const HOTEL_API = "/api";

const hero = document.getElementById("hotel-hero");
const container = document.getElementById("hotel-page");

const params = new URLSearchParams(window.location.search);
const hotelId = params.get("id");

let hotel = null;
let currentImage = 0;
let images = [];

function getHotelImage(name) {
    const n = name.toLowerCase();
    if (n.includes("metexi") || n.includes("grand sheraton")) return "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800";
    if (n.includes("sheraton batumi")) return "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800";
    if (n.includes("gudauri")) return "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800";
    if (n.includes("city center")) return "https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?w=800";
    if (n.includes("tbilisi marriott") && !n.includes("courtyard")) return "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800";
    if (n.includes("biltmore")) return "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800";
    if (n.includes("radisson")) return "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800";
    if (n.includes("rooms hotel kazbegi")) return "https://images.unsplash.com/photo-1586611292717-f828b167408c?w=800";
    if (n.includes("stamba hotel batumi")) return "https://images.unsplash.com/photo-1561501900-3701fa6a0864?w=800";
    if (n.includes("stamba")) return "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800";
    if (n.includes("rooms hotel tbilisi")) return "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800";
    if (n.includes("lopota")) return "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800";
    if (n.includes("telegraph")) return "https://images.unsplash.com/photo-1455587734955-081b22074882?w=800";
    if (n.includes("paragraph")) return "https://images.unsplash.com/photo-1506059612708-99d6c258160e?w=800";
    if (n.includes("steel tower")) return "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800";
    if (n.includes("crowne plaza")) return "https://images.unsplash.com/photo-1551016168-1eed2a0fa23e?w=800";
    if (n.includes("kolkhi")) return "https://images.unsplash.com/photo-1568084680786-a84f91d1153c?w=800";
    if (n.includes("rooms hotel batumi")) return "https://images.unsplash.com/photo-1549294413-26f195200c16?w=800";
    if (n.includes("bioli")) return "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800";
    if (n.includes("chateau mere")) return "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800";
    if (n.includes("sante palace")) return "https://images.unsplash.com/photo-1600011689032-8b628b8a8747?w=800";
    if (n.includes("lahili")) return "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800";
    if (n.includes("gistola")) return "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=800";
    if (n.includes("hilltop")) return "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800";
    if (n.includes("paradiso")) return "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800";
    if (n.includes("kakhshiani")) return "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800";
    if (n.includes("british house")) return "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800";
    if (n.includes("horizon kazbegi")) return "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800";
    if (n.includes("mit hotel")) return "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800";
    if (n.includes("s&l boutique")) return "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800";
    if (n.includes("brosse")) return "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800";
    if (n.includes("meridien")) return "https://images.unsplash.com/photo-1549638441-b787d2e11f14?w=800";
    if (n.includes("courtyard")) return "https://images.unsplash.com/photo-1559508551-44bff1de756b?w=800";
    return "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800";
}

async function loadHotel() {
    try {
        const res = await fetch(`${HOTEL_API}/hotels`);
        const allHotels = await res.json();
        const h = allHotels.find(h => h.HotelID === hotelId);

        if (!h) {
            container.innerHTML = "<p>სასტუმრო ვერ მოიძებნა</p>";
            return;
        }

        const mainImage = getHotelImage(h.Name);

        hotel = {
            id: h.HotelID,
            name: h.Name,
            city: h.Location.split(",")[0].trim(),
            location: h.Location,
            stars: Math.round(h.StarRating),
            rating: h.StarRating,
            email: h.Email,
            price: getPriceByStars(h.StarRating),
            image: mainImage
        };

        images = [
            mainImage,
            "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800",
            "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800"
        ];

        const roomsRes = await fetch(`${HOTEL_API}/hotels/${hotelId}/rooms`);
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
    const checkin = localStorage.getItem("checkin") || "";
    const checkout = localStorage.getItem("checkout") || "";

    const roomsHTML = rooms.length > 0 ? `
        <div class="rooms-section">
            <h2>ნომრები</h2>
            ${rooms.map(r => `
                <div class="room-card">
                    <h3>${r.RoomType}</h3>
                    <p>💰 $${r.Price} / ღამე</p>
                    <p>✅ ხელმისაწვდომია</p>
                    <p>🛎️ ${r.Features || 'სტანდარტული მომსახურება'}</p>
                    <button class="book-btn" onclick="bookRoom('${r.RoomID}', '${r.RoomType}', ${r.Price})">დაჯავშნა - $${r.Price}</button>
                </div>
            `).join("")}
        </div>
    ` : `<button class="book-btn" onclick="bookHotel()">დაჯავშნა - $${hotel.price}</button>`;

    container.innerHTML = `
        <div class="hotel-detail">
            <div class="carousel">
                <button onclick="prevImage()">←</button>
                <img src="${images[currentImage]}" id="carousel-img" onclick="openModal('${images[currentImage]}')" alt="${hotel.name}">
                <button onclick="nextImage()">→</button>
            </div>
            <div class="hotel-info-big">
                <h1>${hotel.name}</h1>
                <p>📍 ${hotel.location}</p>
                <p>${'⭐'.repeat(hotel.stars)} (${hotel.rating})</p>
                <p>✉️ ${hotel.email}</p>
                <p>პრემიუმ კლასის სასტუმრო საუკეთესო პირობებით.</p>
                <div class="date-display">
                    <p>📅 შესვლა: <strong>${checkin || 'არ არის არჩეული'}</strong></p>
                    <p>📅 გასვლა: <strong>${checkout || 'არ არის არჩეული'}</strong></p>
                </div>
                ${roomsHTML}
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

    let checkin = localStorage.getItem("checkin");
    let checkout = localStorage.getItem("checkout");

    console.log("checkin:", checkin);
    console.log("checkout:", checkout);
    console.log("userID:", currentUser.userID);
    console.log("roomID:", roomId);

    if (!checkin || checkin === "null" || checkin === "") {
        checkin = prompt("შეიყვანეთ შესვლის თარიღი (YYYY-MM-DD):");
    }
    if (!checkout || checkout === "null" || checkout === "") {
        checkout = prompt("შეიყვანეთ გასვლის თარიღი (YYYY-MM-DD):");
    }

    if (!checkin || !checkout) {
        alert("გთხოვთ შეიყვანოთ თარიღები");
        return;
    }

    const nights = Math.ceil((new Date(checkout) - new Date(checkin)) / (1000 * 60 * 60 * 24));
    if (nights <= 0) {
        alert("არასწორი თარიღები");
        return;
    }

    const total = nights * price;

    try {
        const res = await fetch(`${HOTEL_API}/bookings`, {
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

function bookHotel() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
        alert("გთხოვთ გაიაროთ ავტორიზაცია");
        window.location.href = "auth.html";
        return;
    }
    alert("დაჯავშნა წარმატებულია! ✅");
}

function openModal(src) {
    const modal = document.getElementById("image-modal");
    document.getElementById("modal-img").src = src;
    modal.style.display = "block";
}

function closeModal() {
    document.getElementById("image-modal").style.display = "none";
}

window.onclick = function (event) {
    const modal = document.getElementById("image-modal");
    if (event.target === modal) modal.style.display = "none";
};

function getCommentsKey() {
    return `comments_${hotelId}`;
}

function loadComments() {
    const comments = JSON.parse(localStorage.getItem(getCommentsKey())) || [];
    const list = document.getElementById("comments-list");
    list.innerHTML = "";
    comments.forEach(c => {
        const div = document.createElement("div");
        div.classList.add("comment");
        div.innerHTML = `<strong>${c.name}</strong><p>${c.text}</p>`;
        list.appendChild(div);
    });
}

function addComment() {
    const name = document.getElementById("username").value;
    const text = document.getElementById("commentText").value;
    if (!name || !text) { alert("შეავსეთ ყველა ველი"); return; }

    let comments = JSON.parse(localStorage.getItem(getCommentsKey())) || [];
    comments.push({ name, text });
    localStorage.setItem(getCommentsKey(), JSON.stringify(comments));

    document.getElementById("username").value = "";
    document.getElementById("commentText").value = "";
    loadComments();
}

loadHotel();