// Handles login form functionality and validation.
import { get } from "./api.js";

// Initializes the login functionality by setting up event listeners
export function initLogin() {
  // Check if the user is already logged in
  const loginDiv = document.querySelector(".login");
  const containerDiv = document.querySelector(".container");
  const storedUser = JSON.parse(localStorage.getItem("user"));

  // If user is logged in (in the localStorage is the info), redirect to events page
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", handleLogout);
  }
}

// Handles user logout functionality
async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    // Fetch users from the API to validate login credentials
    const users = await get("http://localhost:3000/users");
    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    // If user is found, store user info in localStorage and redirect to events page
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      window.location.href = "/events";

      // If no user is found, display an error message
    } else {
      document.getElementById("loginError").textContent =
        "Wrong email or password";
      document.getElementById("loginError").style.display = "block";
    }
  } catch (err) {
    console.error(err);
    document.getElementById("loginError").textContent = "Error en el servidor";
    document.getElementById("loginError").style.display = "block";
  }
}
// Handles user logout functionality
export function showUserName(user) {
  if (!user) return;
  const userInfo = document.querySelector(".userName");
  if (userInfo) userInfo.textContent = user.name;
}

// Handles user permissions based on their role
export function controlPermissions(user) {
  const eventCreate = document.querySelector('a[href="/events/create"]');
  const loginDisplay = document.querySelector('a[href="/login"]');
  const registreDisplay = document.querySelector('a[href="/register"]');
  const enrollDisplay = document.querySelector('a[href="/enrollsment"]');
  const eventDisplay = document.querySelector('a[href="/events"]');
  const logOutDisplay = document.getElementById("logoutButton");

  if (user) {
    if (loginDisplay) loginDisplay.style.display = "none";
    if (registreDisplay) registreDisplay.style.display = "none";
    if (!user.admin && eventCreate) eventCreate.style.display = "none";
    if (user.admin && enrollDisplay) enrollDisplay.style.display = "none";
  } else {
    if (enrollDisplay) enrollDisplay.style.display = "none";
    if (eventDisplay) eventDisplay.style.display = "none";
    if (logOutDisplay) logOutDisplay.style.display = "none";
  }
}
