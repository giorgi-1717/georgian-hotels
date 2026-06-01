const API = "http://localhost:3000/api";
const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser) {
    window.location.href = "auth.html";
}

document.getElementById("userInfo").innerHTML = `
    <strong>სახელი:</strong> ${currentUser.name}<br>
    <strong>ელ-ფოსტა:</strong> ${currentUser.email}
`;

async function loadBookings() {
    const container = document.getElementById("bookings-list");
    container.innerHTML = "<p>იტვირთება...</p>";

    try {
        const res = await fetch(`${API}/bookings/${currentUser.userID}`);
        const bookings = await res.json();

        if (!bookings.length) {
            container.innerHTML = "<p>დაჯავშნები არ არის</p>";
            return;
        }

        container.innerHTML = "";
        bookings.forEach(b => {
            const div = document.createElement("div");
            div.classList.add("booking-item");
            div.innerHTML = `
                <h3>${b.HotelName}</h3>
                <p>🛏️ ${b.RoomType}</p>
                <p>📅 ${b.CheckInDate.split("T")[0]} → ${b.CheckOutDate.split("T")[0]}</p>
                <p>💰 სულ: $${b.TotalPrice}</p>
            `;
            container.appendChild(div);
        });

    } catch (err) {
        container.innerHTML = "<p>შეცდომა დაჯავშნების ჩატვირთვისას</p>";
    }
}

async function loadFavorites() {
    const container = document.getElementById("favorites-list");
    const favs = JSON.parse(localStorage.getItem("favorites")) || [];

    if (!favs.length) {
        container.innerHTML = "<p>ფავორიტები არ არის</p>";
        return;
    }

    try {
        const res = await fetch(`${API}/hotels`);
        const allHotels = await res.json();

        container.innerHTML = "";
        favs.forEach(id => {
            const h = allHotels.find(h => h.HotelID === id);
            if (h) {
                const div = document.createElement("div");
                div.classList.add("favorite-item");
                div.innerHTML = `
                    <h3>${h.Name}</h3>
                    <p>📍 ${h.Location} — ⭐ ${h.StarRating}</p>
                    <button onclick="removeFavorite('${h.HotelID}')">წაშლა</button>
                `;
                container.appendChild(div);
            }
        });

    } catch (err) {
        container.innerHTML = "<p>შეცდომა ფავორიტების ჩატვირთვისას</p>";
    }
}

function removeFavorite(id) {
    let favs = JSON.parse(localStorage.getItem("favorites")) || [];
    favs = favs.filter(f => f !== id);
    localStorage.setItem("favorites", JSON.stringify(favs));
    loadFavorites();
}

function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "auth.html";
}

loadBookings();
loadFavorites();
