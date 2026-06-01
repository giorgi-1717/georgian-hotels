const user = JSON.parse(localStorage.getItem("currentUser"));

if (!user) {
    window.location.href = "auth.html";
}

document.getElementById("userInfo").innerHTML = `
    <strong>სახელი:</strong> ${user.name}<br>
    <strong>ელ-ფოსტა:</strong> ${user.email}<br>
    <strong>ტელეფონი:</strong> ${user.phone}
`;

function loadBookings() {
    const bookingsKey = `bookings_${user.email}`;
    const bookings = JSON.parse(localStorage.getItem(bookingsKey)) || [];
    const container = document.getElementById("bookings-list");

    if (bookings.length === 0) {
        container.innerHTML = "<p>დაჯავშნები არ არის</p>";
        return;
    }

    container.innerHTML = "";
    bookings.forEach(b => {
        const div = document.createElement("div");
        div.classList.add("booking-item");
        div.innerHTML = `
            <h3>${b.hotelName}</h3>
            <p>დაჯავშნის თარიღი: ${b.date}</p>
        `;
        container.appendChild(div);
    });
}

loadBookings();

function loadFavorites() {
    const favs = JSON.parse(localStorage.getItem("favorites")) || [];
    const container = document.getElementById("favorites-list");

    if (favs.length === 0) {
        container.innerHTML = "<p>ფავორიტები არ არის</p>";
        return;
    }

    container.innerHTML = "";
    favs.forEach(id => {
        const hotel = hotels.find(h => h.id === id);
        if (hotel) {
            const div = document.createElement("div");
            div.classList.add("favorite-item");
            div.innerHTML = `
                <h3>${hotel.name}</h3>
                <p>${hotel.city} - $${hotel.price}</p>
                <button onclick="removeFavorite(${id})">წაშლა</button>
            `;
            container.appendChild(div);
        }
    });
}

loadFavorites();

function removeFavorite(id) {
    let favs = JSON.parse(localStorage.getItem("favorites")) || [];
    favs = favs.filter(favId => favId !== id);
    localStorage.setItem("favorites", JSON.stringify(favs));
    loadFavorites(); // Перезагрузить список
}

function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "auth.html";
}