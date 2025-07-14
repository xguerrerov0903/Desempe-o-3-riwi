// Handles new user registration functionality.
import { post } from "./api.js"; 

const url = "http://localhost:3000/users";

document
  .getElementById("newUserForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = new FormData(this);
    const user = Object.fromEntries(formData.entries());
    user.admin = false; 

    try {
      await post(url, user);
      alert("User created successfully");
      this.reset(); 
    } catch (error) {
      console.error("Error create user:", error);
    }
  });

