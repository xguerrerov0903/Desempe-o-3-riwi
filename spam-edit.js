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

      // Muestra solo la vista principal, oculta login
      document.querySelector(".login").style.display = "none";
      document.querySelector(".container").style.display = "flex";
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

// ... resto del código sigue igual (handleLogin, showUserName, etc.)


if (pathname === "/login") {
  if (user) {
    alert("You already log in");
    return navigate("/events");
  }
  import("./js/login.js").then(module => module.initLogin());
}


import { post } from "./api.js";

export function initRegister() {
  const form = document.getElementById("registerForm");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();
      const confirmPassword = document.getElementById("confirmPassword").value.trim();
      const errorDiv = document.getElementById("registerError");

      // Validación: contraseñas deben coincidir
      if (password !== confirmPassword) {
        errorDiv.textContent = "Las contraseñas no coinciden.";
        errorDiv.style.display = "block";
        return;
      }

      // Validación extra opcional
      if (password.length < 6) {
        errorDiv.textContent = "La contraseña debe tener al menos 6 caracteres.";
        errorDiv.style.display = "block";
        return;
      }

      // Crear usuario
      const newUser = {
        name,
        email,
        password,
        admin: false, // o true si vas a permitirlo desde el form
      };

      try {
        await post("http://localhost:3000/users", newUser);
        alert("Registro exitoso. Inicia sesión.");
        window.history.pushState({}, "", "/login");
        import("./login.js").then((m) => m.initLogin());
      } catch (err) {
        console.error(err);
        errorDiv.textContent = "Error al registrar el usuario.";
        errorDiv.style.display = "block";
      }
    });
  }
}

if (pathname === "/register") {
  if (user) {
    alert("You already register");
    return navigate("/events");
  }
  import("./js/register.js").then((module) => module.initRegister());
}

export function initRegister() {
  // Aquí seleccionas el form y asocias eventos
  const form = document.getElementById("registerForm");
  form.addEventListener("submit", handleRegister);
}

import("./js/register.js").then(module => module.initRegister());