const hotelsContainer = document.getElementById("hotels");
const sortSelect = document.getElementById("sort");

let currentPage = 1;
const itemsPerPage = 12;
let currentList = [];

// Called by data.js once hotels are loaded from the database
function onHotelsLoaded() {
    currentList = [...hotels];
    renderHotels(currentList);
}

function paginate(list) {
    const start = (currentPage - 1) * itemsPerPage;
    return list.slice(start, start + itemsPerPage);
}

function renderHotels(list) {
    hotelsContainer.innerHTML = "";

    if (list.length === 0) {
        hotelsContainer.innerHTML = "<p style='text-align:center;padding:40px;'>სასტუმრო ვერ მოიძებნა</p>";
        renderPagination(list);
        return;
    }

    const paginated = paginate(list);

    paginated.forEach(hotel => {
        const card = document.createElement("div");
        card.classList.add("hotel-card");

        card.innerHTML = `
            <img src="${hotel.image}" onclick="window.location.href='hotel.html?id=${hotel.id}'" alt="${hotel.name}">
            <div class="hotel-info">
                <h3 onclick="window.location.href='hotel.html?id=${hotel.id}'">${hotel.name}</h3>
                <p>${hotel.city}</p>
                <p>${'⭐'.repeat(hotel.stars)} (${hotel.rating})</p>
                <p class="price">$${hotel.price}</p>
                <p>${hotel.amenities.join(', ')}</p>
                <button onclick="addToFavorites('${hotel.id}')">❤️</button>
            </div>
        `;

        card.onclick = (e) => {
            if (e.target.tagName !== "BUTTON") {
                window.location.href = `hotel.html?id=${hotel.id}`;
            }
        };

        hotelsContainer.appendChild(card);
    });

    renderPagination(list);
}

function renderPagination(list) {
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";

    const pageCount = Math.ceil(list.length / itemsPerPage);

    for (let i = 1; i <= pageCount; i++) {
        const btn = document.createElement("button");
        btn.innerText = i;
        if (i === currentPage) btn.classList.add("active");
        btn.onclick = () => {
            currentPage = i;
            renderHotels(currentList);
        };
        pagination.appendChild(btn);
    }
}

function searchHotels() {
    const city = document.getElementById("city").value.toLowerCase();
    const checkin = document.getElementById("checkin").value;
    const checkout = document.getElementById("checkout").value;

    currentList = hotels.filter(hotel =>
        hotel.city.toLowerCase().includes(city) &&
        (checkin === "" || hotel.availableDates.includes(checkin)) &&
        (checkout === "" || hotel.availableDates.includes(checkout))
    );

    currentPage = 1;
    renderHotels(currentList);
}

function applyFilters() {
    let filtered = [...hotels];

    const minPrice = parseInt(document.getElementById("minPrice").value);
    const maxPrice = parseInt(document.getElementById("maxPrice").value);
    filtered = filtered.filter(h => h.price >= minPrice && h.price <= maxPrice);

    const minStars = [];
    if (document.getElementById("stars-4").checked) minStars.push(4);
    if (document.getElementById("stars-5").checked) minStars.push(5);
    if (minStars.length > 0) {
        filtered = filtered.filter(h => minStars.includes(h.stars));
    }

    const requiredAmenities = [];
    if (document.getElementById("wifi").checked) requiredAmenities.push("WiFi");
    if (document.getElementById("pool").checked) requiredAmenities.push("Pool");
    if (document.getElementById("parking").checked) requiredAmenities.push("Parking");
    if (document.getElementById("spa").checked) requiredAmenities.push("Spa");
    if (requiredAmenities.length > 0) {
        filtered = filtered.filter(h =>
            requiredAmenities.every(a => h.amenities.includes(a))
        );
    }

    const sortValue = document.getElementById("sort").value;
    if (sortValue === "price-low") filtered.sort((a, b) => a.price - b.price);
    else if (sortValue === "price-high") filtered.sort((a, b) => b.price - a.price);
    else if (sortValue === "rating") filtered.sort((a, b) => b.rating - a.rating);

    currentList = filtered;
    currentPage = 1;
    renderHotels(currentList);
}

document.getElementById("minPrice").addEventListener("input", function () {
    document.getElementById("minPriceValue").textContent = this.value;
    applyFilters();
});
document.getElementById("maxPrice").addEventListener("input", function () {
    document.getElementById("maxPriceValue").textContent = this.value;
    applyFilters();
});

sortSelect.addEventListener("change", applyFilters);

function addToFavorites(id) {
    let favs = JSON.parse(localStorage.getItem("favorites")) || [];
    if (!favs.includes(id)) {
        favs.push(id);
        localStorage.setItem("favorites", JSON.stringify(favs));
        alert("დამატებულია ფავორიტებში ✅");
    } else {
        alert("უკვე დამატებულია ფავორიტებში");
    }
}
