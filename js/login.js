// Handles login form functionality and validation.
import { get } from "./api.js";

export function initLogin() {
  const loginDiv = document.querySelector(".login");
  const containerDiv = document.querySelector(".container");
  const storedUser = JSON.parse(localStorage.getItem("user"));

  if (storedUser) {
    showUserName(storedUser);
    controlPermissions(storedUser);
  }

  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", handleLogout);
  }
}

// El evento enviado es el submit del form
async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    const users = await get("http://localhost:3000/users");
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      showUserName(user);
      controlPermissions(user);
      location.reload();

    } else {
      document.getElementById("loginError").textContent = "Credenciales incorrectas";
      document.getElementById("loginError").style.display = "block";
    }
  } catch (err) {
    console.error(err);
    document.getElementById("loginError").textContent = "Error en el servidor";
    document.getElementById("loginError").style.display = "block";
  }
}
function showUserName(user) {
  const userInfo = document.querySelector(".userName");
  if (userInfo) userInfo.textContent = user.name;
}

function controlPermissions(user) {
  const eventCreate = document.querySelector('a[href="/events/create"]');
  const loginDisplay = document.querySelector('a[href="/login"]');
  const registreDisplay = document.querySelector('a[href="/registre"]');
  const enrollDisplay = document.querySelector('a[href="/enrollsment"]');
  const eventDisplay = document.querySelector('a[href="/events"]');
  const logOutDisplay = document.getElementById("logoutBtn");
  if(user && loginDisplay && registreDisplay){
    loginDisplay.style.display = "none";
    registreDisplay.style.display = "none";
  } else if (!user.admin && eventCreate) {
    eventCreate.style.display = "none";
  } else if (user.admin && enrollDisplay) {
    enrollDisplay.style.display = "none";
  } else if (!user){
    enrollDisplay.style.display = "none";
    eventDisplay.style.display = "none";
    logOutDisplay.style.display = "none";
  }
}


