function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || [];
}

function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}

async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePassword(password) {
    return password.length >= 6; // Minimum 6 characters
}

async function register() {
    const name = document.getElementById("reg-name").value.trim();
    const email = document.getElementById("reg-email").value.trim();
    const phone = document.getElementById("reg-phone").value.trim();
    const password = document.getElementById("reg-password").value;
    const confirmPassword = document.getElementById("reg-confirm-password").value;

    if (!name || !email || !phone || !password || !confirmPassword) {
        alert("შეავსე ყველა ველი");
        return;
    }

    if (!validateEmail(email)) {
        alert("არასწორი ელ-ფოსტა");
        return;
    }

    if (!validatePassword(password)) {
        alert("პაროლი უნდა იყოს მინიმუმ 6 სიმბოლო");
        return;
    }

    if (password !== confirmPassword) {
        alert("პაროლები არ ემთხვევა");
        return;
    }

    let users = getUsers();

    if (users.find(u => u.email === email)) {
        alert("მომხმარებელი უკვე არსებობს");
        return;
    }

    const hashedPassword = await hashPassword(password);
    users.push({ name, email, phone, password: hashedPassword });
    saveUsers(users);

    alert("რეგისტრაცია წარმატებულია");
}

async function login() {
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;

    if (!email || !password) {
        alert("შეავსე ყველა ველი");
        return;
    }

    let users = getUsers();

    const hashedPassword = await hashPassword(password);
    const user = users.find(u => u.email === email && u.password === hashedPassword);

    if (!user) {
        alert("არასწორი მონაცემები");
        return;
    }

    localStorage.setItem("currentUser", JSON.stringify({ name: user.name, email: user.email, phone: user.phone }));

    window.location.href = "profile.html";
}