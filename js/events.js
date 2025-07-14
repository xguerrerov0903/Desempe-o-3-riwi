// Displays and manages the list of events.
import { get, get_id, deletes, update, post } from "./api.js";

const url = "http://localhost:3000/eventss";

// Function to load and display events
export async function loadEvents() {
  const eventss = await get(url);
  printEvents(eventss);
  setupUserTableListener();
}

loadEvents();

// Function to print the events
function printEvents(eventss) {
  let eventsContainer = document.getElementById("eventsTableBody");
  // Clear the container before printing
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
            // Check if the user is logged in and is an admin if so, show edit and delete buttons, if not, show enroll button 
              currentUser && currentUser.admin
                ? `<button type="button" value="edit">Edit</button>
                    <button type="button" value="delete">Delet</button>`
                    // if the capacity is greater than 0, show enroll button, if not, show sold out message
                : event.capacity >0 ?`<button type="button" value="enroll">Enroll</button>`: `Sould Out` 
            }
            </td>
        </tr>`;
  });
}

// Hear the event submit (button) of the form
function setupUserTableListener() {
  const tbody = document.getElementById("eventsTableBody");

  // Avoid multiple listeners: clone the node and replace it (removes listeners)
  const newTbody = tbody.cloneNode(true);
  tbody.parentNode.replaceChild(newTbody, tbody);

  const currentUser = JSON.parse(localStorage.getItem("user"));

  // Check if the user is logged in and is an admin
  if (currentUser && currentUser.admin) {
    newTbody.addEventListener("click", async function (event) {
      event.preventDefault();
      // Check if the clicked element is a button
      if (event.target.tagName !== "BUTTON") return;
      const tr = event.target.closest("tr");
      const id = tr.id;
      const action = event.target.value;
      // Check if the action is delete
      if (action === "delete") {
        // 1. Delet the enrollments related to the event
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
        // Reprint the events after deletion
        printEvents(updateEvent);
      } else if (action === "edit") {
        // Call the edit function
        editEvent(id);
      } else if (action === "save-event") {
        // Save the edited event
        const inputs = tr.querySelectorAll("input");
        const existingevent = await get_id(url, id);
        const updatedevent = {
          // Use the existing event data and update the fields
          ...existingevent,
          name: inputs[0].value,
          description: inputs[1].value,
          capacity: inputs[2].value,
          date: inputs[3].value,
        };
        // Update the event in the database
        await update(url, id, updatedevent);
        const updateEvent = await get(url);
        // Reprint the events after update
        printEvents(updateEvent);
      } else {
        // This case es cancel so dont edit the event
        const updateEvent = await get(url);
        // Reprint the events without changes
        printEvents(updateEvent);
      }
    });
  // If the user is not an admin, listen for enroll actions
  } else {
    newTbody.addEventListener("click", async function (event) {
      event.preventDefault();
      if (event.target.tagName !== "BUTTON") return;
      const tr = event.target.closest("tr");
      const id = tr.id;
      const action = event.target.value;
      // Check if the action is enroll
      if (action === "enroll") {
        console.log("hi")
        // Call the addEvent function to enroll the user in the event
        await addEvent(id, currentUser);
      }
    });
  }
}

// Function to edit an event
// This function replaces the event row with input fields for editing
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

// Function to add an event to the user's enrollments
// This function checks if the user is already enrolled in the event
// If not, it creates a new enrollment and updates the event's capacity
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
      const existingevent = await get_id(url, id);
      const eventUpdate = {
          ...existingevent,
          capacity: existingevent.capacity -1
      }
      await post("http://localhost:3000/enrollments", enroll);
      await update(url,id,eventUpdate)
      const updateEvent = await get(url);
    printEvents(updateEvent);


      alert("Event add");
    } catch (error) {
      console.error("Error with the enroll of the event:", error);
    }
  }
}
