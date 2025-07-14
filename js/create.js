// Handles new course creation functionality.
import { post } from "./api.js"; // Asegúrate que tienes esta función

const url = "http://localhost:3000/eventss";

document
  .getElementById("newEventForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = new FormData(this);
    const user = Object.fromEntries(formData.entries());

    try {
      await post(url, user);
      alert("Event create correct");
      this.reset(); 
    } catch (error) {
      console.error("Error with the creation of the event:", error);
    }
  });
