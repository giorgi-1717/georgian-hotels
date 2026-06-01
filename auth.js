const API = "/api";

async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function register() {
    const name     = document.getElementById("reg-name").value.trim();
    const email    = document.getElementById("reg-email").value.trim();
    const phone    = document.getElementById("reg-phone").value.trim();
    const password = document.getElementById("reg-password").value;
    const confirm  = document.getElementById("reg-confirm-password").value;

    if (!name || !email || !phone || !password || !confirm) {
        alert("შეავსე ყველა ველი"); return;
    }
    if (!validateEmail(email)) {
        alert("არასწორი ელ-ფოსტა"); return;
    }
    if (password.length < 6) {
        alert("პაროლი უნდა იყოს მინიმუმ 6 სიმბოლო"); return;
    }
    if (password !== confirm) {
        alert("პაროლები არ ემთხვევა"); return;
    }

    const hashedPassword = await hashPassword(password);

    try {
        const res = await fetch(`${API}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, phone, password: hashedPassword })
        });

        const result = await res.json();

        if (result.success) {
            alert("რეგისტრაცია წარმატებულია! ✅");
            window.location.href = "auth.html";
        } else {
            alert("შეცდომა: " + (result.error || "სცადეთ თავიდან"));
        }
    } catch (err) {
        alert("სერვერთან კავშირის შეცდომა");
    }
}

async function login() {
    const email    = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;

    if (!email || !password) {
        alert("შეავსე ყველა ველი"); return;
    }

    const hashedPassword = await hashPassword(password);

    try {
        const res = await fetch(`${API}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password: hashedPassword })
        });

        const user = await res.json();

        if (!user || user.error) {
            alert("არასწორი მონაცემები"); return;
        }

        localStorage.setItem("currentUser", JSON.stringify({
            userID:   user.UserID,
            name:     user.Username,
            email:    user.Email
        }));

        window.location.href = "profile.html";

    } catch (err) {
        alert("სერვერთან კავშირის შეცდომა");
    }
}
