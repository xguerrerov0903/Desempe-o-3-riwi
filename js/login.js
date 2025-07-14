// Handles login form functionality and validation.
import { get } from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
  const loginDiv = document.querySelector(".login");
  const containerDiv = document.querySelector(".container");
  const storedUser = JSON.parse(localStorage.getItem("user"));

  if (storedUser) {
    showUserName(storedUser);
    controlPermissions(storedUser);
  } 
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    // Aqui invoque la funcion handleLogin cuando el evento submit es escuchado ademas de ser enviado con el
    loginForm.addEventListener("submit", handleLogin);
  }

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", handleLogout);
  }
});

// El evento enviado es el submit del form
async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    const users = await get(
      `http://localhost:3000/users?email=${email}&pasword=${password}`
    );
    if (users.length > 0) {
      const user = users[0];
      localStorage.setItem("user", JSON.stringify(user));
      document.querySelector(".login").style.display = "none";
      document.querySelector(".container").style.display = "flex";
      showUserName(user);
      controlPermissions(user);
      location.reload();
    } else {
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
    eventDisplay.style.display = "none";
    logOutDisplay.style.display = "none";
  }
}

function handleLogout() {
  localStorage.removeItem("user");
  location.reload();
}
