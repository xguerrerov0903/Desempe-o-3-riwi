// Handles new user registration functionality.
import { post } from "./api.js"; // Asegúrate que tienes esta función

const url = "http://localhost:3000/userss";

export function initRegister() {
  const form = document.getElementById("registerForm");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();
      const confirmPassword = document
        .getElementById("confirmPassword")
        .value.trim();
      const errorDiv = document.getElementById("registerError");

      // Validación: contraseñas deben coincidir
      if (password !== confirmPassword) {
        errorDiv.textContent = "The password has to be the same.";
        errorDiv.style.display = "block";
        return;
      }
      // Crear usuario
      const newUser = {
        name,
        email,
        password,
        admin: false, // Default 
      };

      try {
        await post("url", newUser);
        alert("User create");
      } catch (err) {
        console.error(err);
        errorDiv.textContent = "Error register user.";
        errorDiv.style.display = "block";
      }
    });
  }
}
