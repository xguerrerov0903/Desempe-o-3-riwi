// Handles new course creation functionality.
import { post } from "./api.js";

const url = "http://localhost:3000/eventss";

// Event listener for the new event form submission
document
  .getElementById("newEventForm")
  .addEventListener("submit", async function (event) {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Create a FormData object from the form
    const formData = new FormData(this);
    const user = Object.fromEntries(formData.entries());

    // Post the new event data to the server
    try {
      await post(url, user);
      alert("Event create correct");
      this.reset();
    } catch (error) {
      console.error("Error with the creation of the event:", error);
    }
  });
