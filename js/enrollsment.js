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

loadMyEvents(); // 👈 ejecuta la función

function printMyEvents(events, enrolls) {
  let myeventsContainer = document.getElementById("myEventsTableBody");
  myeventsContainer.innerHTML = "";
  const currentUser = JSON.parse(localStorage.getItem("user"));

  // Filtrar las inscripciones del usuario actual
  const myEnrollments = enrolls.filter((enroll) => enroll.userId == currentUser.id);

  // Recorremos las inscripciones, no los cursos directamente
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
          <td><button type="button" value="delete">Eliminar</button></td>
        </tr>`;
    }
  });
}


// Hear the event submit (button) of the form
function setupUserTableListener() {
  const tbody = document.getElementById("myEventsTableBody");

  // Evita múltiples escuchas: clona el nodo y lo reemplaza (elimina listeners)
  const newTbody = tbody.cloneNode(true);
  tbody.parentNode.replaceChild(newTbody, tbody);

  newTbody.addEventListener("click", async function (event) {
    event.preventDefault();
    if (event.target.tagName !== "BUTTON") return;
    const tr = event.target.closest("tr");
    const id = tr.id;
    const action = event.target.value;
    if (action === "delete") {
      await deletes(urlEnroll, id); // ❗ Cuidado: debes borrar en `enrollments`, no en `events`
      const updatedevents = await get(url);
      const updatedEnrolls = await get(urlEnroll);
      printMyEvents(updatedevents, updatedEnrolls);
    } 
  });
}


