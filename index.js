const API_URL =
  "https://fsa-crud-2aa9294fe819.herokuapp.com/api/2311-FSA-ET-WEB-PT-SF/events";

const reservationList = document.querySelector("#reservations");

const addReservationForm = document.querySelector("#addReservation");
addReservationForm.addEventListener("submit", addReservation);

const state = {
  reservations: [],
};

async function render() {
  await getReservations();
  renderReservations();
}

render();

async function getReservations() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    state.reservations = data.data;
  } catch {
    console.error(error);
  }
}

function renderReservations() {
  if (!state.reservations.length) {
    reservationList.innerHTML = "<li>No Reservations.</li>";
    return;
  }
  const reservationCards = state.reservations.map((reservation) => {
    const li = document.createElement("li");
    li.innerHTML = `
          <h2>${reservation.name}</h2>
          <p>${reservation.description}</p>
          <p>${reservation.date}</p>
          <p>${reservation.location}</p>
        `;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    li.append(deleteButton);

    deleteButton.addEventListener("click", () =>
      deleteReservation(reservation.id)
    );

    return li;
  });

  reservationList.replaceChildren(...reservationCards);
}

// Add Reservation Function

async function addReservation(event) {
  event.preventDefault();

  const name = addReservationForm.name.value;
  const description = addReservationForm.description.value;
  const date = addReservationForm.date.value;
  const location = addReservationForm.location.value;

  await createReservation(name, description, date, location);
}

async function createReservation(name, description, date, location) {
  date = new Date(date);
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description, date, location }),
    });
    const json = await response.json();

    if (json.error) {
      throw new Error(json.message);
    }
    render();
  } catch (error) {
    console.error(error);
  }
}

async function deleteReservation(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });

    if (!response.ok) {
      throw new Error("Reservation could not be made.");
    }
    render();
  } catch (error) {
    console.log(error);
  }
}

// /* <button class="delete-button" data-event-id="${event.id}>Delete</button> */
