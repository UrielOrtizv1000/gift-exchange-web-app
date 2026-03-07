document.addEventListener("DOMContentLoaded", () => {
  if (!window.location.pathname.includes("datos.html")) return;
  renderDataPage();
});

function renderDataPage() {
  const data = getData();

  renderGeneralData(data);
  renderParticipantsData(data.participants || []);
  renderExclusionsData(data.exclusions || []);
}

function renderGeneralData(data) {
  const organizerElement = document.getElementById("dataOrganizer");
  const organizerParticipationElement = document.getElementById("dataOrganizerParticipation");
  const eventNameElement = document.getElementById("dataEventName");
  const eventDateElement = document.getElementById("dataEventDate");
  const budgetElement = document.getElementById("dataBudget");

  if (!organizerElement) return;

  organizerElement.textContent = data.organizer?.name || "Sin datos";

  organizerParticipationElement.textContent = data.organizer?.participates
    ? "Sí participa"
    : "No participa";

  let eventName = "Sin datos";

  if (data.event?.type === "Otro") {
    eventName = data.event?.customName || "Celebración personalizada";
  } else if (data.event?.type) {
    eventName = data.event.type;
  }

  eventNameElement.textContent = eventName;
  eventDateElement.textContent = data.event?.date || "Sin datos";
  budgetElement.textContent = data.event?.budget ? `$${data.event.budget}` : "Sin datos";
}

function renderParticipantsData(participants) {
  const container = document.getElementById("dataParticipantsList");
  if (!container) return;

  if (!participants.length) {
    container.innerHTML = `<p class="text-soft mb-0">No hay participantes guardados.</p>`;
    return;
  }

  container.innerHTML = participants
    .map(
      (participant) => `
        <div class="custom-badge mb-2 me-2">${participant.name}</div>
      `
    )
    .join("");
}

function renderExclusionsData(exclusions) {
  const container = document.getElementById("dataExclusionsList");
  if (!container) return;

  if (!exclusions.length) {
    container.innerHTML = `<p class="text-soft mb-0">No hay exclusiones guardadas.</p>`;
    return;
  }

  container.innerHTML = exclusions
    .map(
      (exclusion) => `
        <div class="section-card py-3 px-3 mb-2">
          ${exclusion.fromName} no puede regalar a ${exclusion.toName}
        </div>
      `
    )
    .join("");
}