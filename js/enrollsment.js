// Displays the current user's events.
import { get, get_id, deletes, update, post } from "./api.js";

const url = "http://localhost:3000/eventss";
const urlEnroll = "http://localhost:3000/enrollments";

export async function loadMyEvents() {
  const events = await get(url);
  const enrolls = await get(urlEnroll);
  printMyEvents(events, enrolls);
  setupUserTableListener();
}

loadMyEvents(); // Call the function to load events on page load

// Function to print the user's events
function printMyEvents(events, enrolls) {
  let myeventsContainer = document.getElementById("myEventsTableBody");
  myeventsContainer.innerHTML = "";
  const currentUser = JSON.parse(localStorage.getItem("user"));

  // Filter enrollments for the current user
  const myEnrollments = enrolls.filter(
    (enroll) => enroll.userId == currentUser.id
  );

  // Iterate through the enrollments and find the corresponding events
  myEnrollments.forEach((enroll) => {
    const event = events.find((c) => c.id == enroll.eventId);
    if (event) {
      myeventsContainer.innerHTML += `
        <tr id="${enroll.id}"> <!-- Usamos el ID de la inscripción -->
          <td>${event.id}</td>
          <td>${event.name}</td>
          <td>${event.description}</td>
          <td>${event.capacity}</td>
          <td>${event.date}</td>
          <td><button type="button" value="delete">Delet</button></td>
        </tr>`;
    }
  });
}

// Hear the event submit (button) of the form
function setupUserTableListener() {
  const tbody = document.getElementById("myEventsTableBody");

  // Avoid multiple listeners: clone the node and replace it (removes listeners)
  const newTbody = tbody.cloneNode(true);
  tbody.parentNode.replaceChild(newTbody, tbody);

  newTbody.addEventListener("click", async function (event) {
    event.preventDefault();
    if (event.target.tagName !== "BUTTON") return;
    const tr = event.target.closest("tr");
    const enrollId = tr.id;
    const action = event.target.value;
    // Check if the action is delete
    if (action === "delete") {

      // Get the enrollment by ID
      const enroll = await get_id(urlEnroll, enrollId);
      const eventId = enroll.eventId;
      // 1. Delete the enrollment
      await deletes(urlEnroll, enrollId);
      // 2. Update the event capacity
      const eventObj = await get_id(url, eventId);
      const updatedEvent = {
        ...eventObj,
        capacity: Number(eventObj.capacity) + 1,
      };
      await update(url, eventId, updatedEvent);
      alert("Enrollment deleted successfully");

      const updatedEvents = await get(url);
      const updatedEnrolls = await get(urlEnroll);
      printMyEvents(updatedEvents, updatedEnrolls);
    }
  });
}
