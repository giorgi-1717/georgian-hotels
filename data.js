const API = "http://localhost:3000/api";

// Holds all hotels loaded from the database
let hotels = [];

async function loadHotelsFromDB() {
    try {
        const res = await fetch(`${API}/hotels`);
        const data = await res.json();

        hotels = data.map(h => ({
            id: h.HotelID,
            name: h.Name,
            city: h.Location.split(",")[0].trim(),
            location: h.Location,
            stars: Math.round(h.StarRating),
            rating: h.StarRating,
            email: h.Email,
            price: getPriceByStars(h.StarRating),
            amenities: getAmenitiesByStars(h.StarRating),
            image: getHotelImage(h.Name, h.HotelID),
            lat: getLatByCity(h.Location),
            lng: getLngByCity(h.Location),
            availableDates: getAvailableDates("2026-06-01", "2026-12-31")
        }));

        // Trigger page render after hotels are loaded
        if (typeof onHotelsLoaded === "function") {
            onHotelsLoaded();
        }

    } catch (err) {
        console.error("Failed to load hotels from database:", err);
    }
}
function getHotelImage(name, id) {
    const n = name.toLowerCase();

    if (n.includes("metexi") || n.includes("grand sheraton"))
        return "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800";
    if (n.includes("sheraton batumi"))
        return "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800";
    if (n.includes("gudauri"))
    return "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800";
    if (n.includes("city center"))
        return "https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?w=800";
    if (n.includes("tbilisi marriott") && !n.includes("courtyard"))
        return "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800";
    if (n.includes("biltmore"))
        return "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800";
    if (n.includes("radisson"))
        return "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800";
    if (n.includes("rooms hotel kazbegi"))
        return "https://images.unsplash.com/photo-1586611292717-f828b167408c?w=800";
    if (n.includes("stamba"))
        return "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800";
    if (n.includes("rooms hotel tbilisi"))
        return "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800";
    if (n.includes("lopota"))
        return "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800";
    if (n.includes("telegraph"))
        return "https://images.unsplash.com/photo-1455587734955-081b22074882?w=800";
    if (n.includes("paragraph"))
        return "https://images.unsplash.com/photo-1506059612708-99d6c258160e?w=800";
    if (n.includes("steel tower"))
        return "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800";
    if (n.includes("crowne plaza"))
        return "https://images.unsplash.com/photo-1551016168-1eed2a0fa23e?w=800";
    if (n.includes("kolkhi"))
        return "https://images.unsplash.com/photo-1568084680786-a84f91d1153c?w=800";
    if (n.includes("rooms hotel batumi"))
        return "https://images.unsplash.com/photo-1549294413-26f195200c16?w=800";
    if (n.includes("bioli"))
        return "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800";
    if (n.includes("chateau mere"))
        return "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800";
    if (n.includes("sante palace"))
        return "https://images.unsplash.com/photo-1600011689032-8b628b8a8747?w=800";
    if (n.includes("lahili"))
        return "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800";
    if (n.includes("gistola"))
        return "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=800";
    if (n.includes("hilltop"))
        return "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800";
    if (n.includes("paradiso"))
        return "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800";
    if (n.includes("kakhshiani"))
        return "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800";
    if (n.includes("british house"))
        return "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800";
    if (n.includes("horizon kazbegi"))
        return "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800";
    if (n.includes("paradiso"))
        return "https://images.unsplash.com/photo-1596436889106-be35e843f974?w=800";
    if (n.includes("mit hotel"))
        return "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800";
    if (n.includes("s&l boutique"))
        return "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800";
    if (n.includes("brosse"))
        return "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800";
    if (n.includes("kakhshiani"))
        return "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800";
    if (n.includes("meridien"))
        return "https://images.unsplash.com/photo-1549638441-b787d2e11f14?w=800";
    if (n.includes("courtyard"))
        return "https://images.unsplash.com/photo-1559508551-44bff1de756b?w=800";
    if (n.includes("stamba hotel batumi"))
        return "https://images.unsplash.com/photo-1561501900-3701fa6a0864?w=800";

    // Fallback — should never reach here
    return "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800";
}
// Assign realistic prices based on star rating
function getPriceByStars(stars) {
    if (stars === 5) return Math.floor(Math.random() * 400) + 600;
    if (stars >= 4.5) return Math.floor(Math.random() * 200) + 350;
    if (stars >= 4) return Math.floor(Math.random() * 150) + 200;
    return Math.floor(Math.random() * 100) + 100;
}

// Assign amenities based on star rating
function getAmenitiesByStars(stars) {
    const all = ["WiFi", "Pool", "Parking", "Spa", "Restaurant", "Gym"];
    if (stars === 5) return all;
    if (stars >= 4.5) return all.slice(0, 5);
    if (stars >= 4) return all.slice(0, 4);
    return all.slice(0, 2);
}

// Approximate coordinates by city
function getLatByCity(location) {
    if (location.includes("Tbilisi"))       return (41.6938 + Math.random() * 0.05).toFixed(4);
    if (location.includes("Batumi"))        return (41.6168 + Math.random() * 0.05).toFixed(4);
    if (location.includes("Kutaisi"))       return (42.2679 + Math.random() * 0.05).toFixed(4);
    if (location.includes("Gudauri"))       return (42.4800 + Math.random() * 0.02).toFixed(4);
    if (location.includes("Stepantsminda")) return (42.6570 + Math.random() * 0.02).toFixed(4);
    if (location.includes("Mestia"))        return (43.0530 + Math.random() * 0.02).toFixed(4);
    if (location.includes("Borjomi"))       return (41.8369 + Math.random() * 0.02).toFixed(4);
    if (location.includes("Telavi"))        return (41.9200 + Math.random() * 0.02).toFixed(4);
    if (location.includes("Sighnaghi"))     return (41.6160 + Math.random() * 0.02).toFixed(4);
    if (location.includes("Kakheti"))       return (41.6480 + Math.random() * 0.05).toFixed(4);
    if (location.includes("Napareuli"))     return (41.8900 + Math.random() * 0.02).toFixed(4);
    if (location.includes("Shekvetili"))    return (41.7760 + Math.random() * 0.02).toFixed(4);
    return (41.7000 + Math.random() * 0.1).toFixed(4);
}

function getLngByCity(location) {
    if (location.includes("Tbilisi"))       return (44.8015 + Math.random() * 0.05).toFixed(4);
    if (location.includes("Batumi"))        return (41.6367 + Math.random() * 0.05).toFixed(4);
    if (location.includes("Kutaisi"))       return (42.7081 + Math.random() * 0.05).toFixed(4);
    if (location.includes("Gudauri"))       return (44.4800 + Math.random() * 0.02).toFixed(4);
    if (location.includes("Stepantsminda")) return (44.6570 + Math.random() * 0.02).toFixed(4);
    if (location.includes("Mestia"))        return (42.7280 + Math.random() * 0.02).toFixed(4);
    if (location.includes("Borjomi"))       return (43.4000 + Math.random() * 0.02).toFixed(4);
    if (location.includes("Telavi"))        return (45.4700 + Math.random() * 0.02).toFixed(4);
    if (location.includes("Sighnaghi"))     return (45.9220 + Math.random() * 0.02).toFixed(4);
    if (location.includes("Kakheti"))       return (45.3600 + Math.random() * 0.05).toFixed(4);
    if (location.includes("Napareuli"))     return (45.5200 + Math.random() * 0.02).toFixed(4);
    if (location.includes("Shekvetili"))    return (41.6900 + Math.random() * 0.02).toFixed(4);
    return (44.8000 + Math.random() * 0.1).toFixed(4);
}

function getAvailableDates(start, end) {
    const dates = [];
    const current = new Date(start);
    const endDate = new Date(end);
    while (current <= endDate) {
        dates.push(current.toISOString().split("T")[0]);
        current.setDate(current.getDate() + 1);
    }
    return dates;
}

// Start loading immediately
loadHotelsFromDB();
