// Displays and manages the list of events.
import { get, get_id, deletes, update, post } from "./api.js";

const url = "http://localhost:3000/eventss";

export async function loadEvents() {
  const eventss = await get(url);
  printEvents(eventss);
  setupUserTableListener();
}

loadEvents();

function printEvents(eventss) {
  let eventsContainer = document.getElementById("eventsTableBody");
  eventsContainer.innerHTML = "";
  const currentUser = JSON.parse(localStorage.getItem("user"));
  eventss.forEach((event) => {
    eventsContainer.innerHTML += `
        <tr id="${event.id}">
            <td>${event.name}</td>
            <td>${event.description}</td>
            <td>${event.capacity}</td>
            <td>${event.date}</td>
            <td>${
              currentUser && currentUser.admin
                ? `<button type="button" value="edit">Edit</button>
                    <button type="button" value="delete">Delet</button>`
                : `<button type="button" value="enroll">Enroll</button>`
            }
            </td>
        </tr>`;
  });
}

// Hear the event submit (button) of the form
function setupUserTableListener() {
  const tbody = document.getElementById("eventsTableBody");

  // Evita múltiples escuchas: clona el nodo y lo reemplaza (elimina listeners)
  const newTbody = tbody.cloneNode(true);
  tbody.parentNode.replaceChild(newTbody, tbody);

  const currentUser = JSON.parse(localStorage.getItem("user"));

  if (currentUser && currentUser.admin) {
    newTbody.addEventListener("click", async function (event) {
      event.preventDefault();
      if (event.target.tagName !== "BUTTON") return;
      const tr = event.target.closest("tr");
      const id = tr.id;
      const action = event.target.value;
      if (action === "delete") {
        // 1. Elimina inscripciones del curso
        const enrollments = await get("http://localhost:3000/enrollments");
        const relatedEnrollments = enrollments.filter(
          (enroll) => enroll.eventId == id
        );
        for (const enroll of relatedEnrollments) {
          await deletes("http://localhost:3000/enrollments", enroll.id);
        }
        // 2. Delet curse
        await deletes(url, id);
        const updateEvent = await get(url);
        printEvents(updateEvent);
      } else if (action === "edit") {
        editEvent(id);
      } else if (action === "save-event") {
        const inputs = tr.querySelectorAll("input");
        const existingevent = await get_id(url, id);
        const updatedevent = {
          ...existingevent,
          name: inputs[0].value,
          description: inputs[1].value,
          capacity: inputs[2].value,
          date: inputs[3].value,
        };
        await update(url, id, updatedevent);
        const updateEvent = await get(url);
        printEvents(updateEvent);
      } else {
        const updateEvent = await get(url);
        printEvents(updateEvent);
      }
    });
  } else {
    newTbody.addEventListener("click", async function (event) {
      event.preventDefault();
      if (event.target.tagName !== "BUTTON") return;
      const tr = event.target.closest("tr");
      const id = tr.id;
      const action = event.target.value;
      if (action === "enroll") {
        console.log("hi")
        await addEvent(id, currentUser);
      }
    });
  }
}

async function editEvent(id) {
  const eventContainer = document.getElementById(id);
  const event = await get_id(url, id);

  eventContainer.innerHTML = `
    <td>${id}</td>
    <td><input type="text" value="${event.name}" required /></td>
    <td><input type="text" value="${event.description}" required /></td>
    <td><input type="number" value="${event.capacity}" required /></td>
    <td><input type="date" value="${event.date}" required /></td>
    <td>
      <button type="button" value="save-event">Save</button>
      <button type="button" value="cancel">Cancel</button>
    </td>`;
}

async function addEvent(id, currentUser) {
  const currentUserId = currentUser.id;

  const enrolls = await get("http://localhost:3000/enrollments");
  const found = enrolls.find(
    (enrolls) => enrolls.eventId === id && enrolls.userId === currentUserId
  );

  if (found) {
    alert("You are already enroll in this event");
    return;
  } else {
    try {
      const enroll = {
        userId: currentUserId,
        eventId: id,
      };
      await post("http://localhost:3000/enrollments", enroll);
      alert("Event add");
    } catch (error) {
      console.error("Error with the enroll of the event:", error);
    }
  }
}
