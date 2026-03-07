document.addEventListener("DOMContentLoaded", () => {
  initializeApp();
});

function initializeApp() {
  const currentPage = window.location.pathname;

  if (currentPage.includes("evento.html")) {
    initializeEventPage();
  }

  if (currentPage.includes("datos.html")) {
    initializeDataPage();
  }

  if (currentPage.includes("sorteo.html")) {
    initializeDrawPage();
  }
}

/* =========================
   EVENTO.HTML
========================= */

function initializeEventPage() {
  const eventType = document.getElementById("eventType");
  const budget = document.getElementById("budget");
  const customEventWrapper = document.getElementById("customEventWrapper");
  const customBudgetWrapper = document.getElementById("customBudgetWrapper");

  const addParticipantBtn = document.getElementById("addParticipantBtn");
  const participantName = document.getElementById("participantName");

  const addExclusionBtn = document.getElementById("addExclusionBtn");

  const saveEventBtn = document.getElementById("saveEventBtn");

  if (eventType) {
    eventType.addEventListener("change", () => {
      customEventWrapper.classList.toggle("d-none", eventType.value !== "Otro");
    });
  }

  if (budget) {
    budget.addEventListener("change", () => {
      customBudgetWrapper.classList.toggle("d-none", budget.value !== "other");
    });
  }

  if (addParticipantBtn) {
    addParticipantBtn.addEventListener("click", handleAddParticipant);
  }

  if (participantName) {
    participantName.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        handleAddParticipant();
      }
    });
  }

  if (addExclusionBtn) {
    addExclusionBtn.addEventListener("click", handleAddExclusion);
  }

  if (saveEventBtn) {
    saveEventBtn.addEventListener("click", handleSaveEvent);
  }

  loadEventFormData();
  renderParticipants();
  renderExclusionSelects();
  renderExclusions();
  renderDragParticipants();
}

/* Guardar datos principales del evento */
function handleAddParticipant() {
  const input = document.getElementById("participantName");
  const name = input.value.trim();

  if (typeof validateParticipantName === "function") {
    const isValid = validateParticipantName(name);
    if (!isValid) return;
  }

  const added = addParticipant(name);

  if (!added) {
    showSimpleAlert("No se pudo agregar el participante.");
    return;
  }

  input.value = "";
  renderParticipants();
  renderExclusionSelects();
  renderExclusions();
  renderDragParticipants();
}

function loadEventFormData() {
  const data = getData();

  const organizerName = document.getElementById("organizerName");
  const organizerParticipates = document.getElementById("organizerParticipates");
  const eventType = document.getElementById("eventType");
  const customEventName = document.getElementById("customEventName");
  const eventDate = document.getElementById("eventDate");
  const budget = document.getElementById("budget");
  const customBudget = document.getElementById("customBudget");
  const customEventWrapper = document.getElementById("customEventWrapper");
  const customBudgetWrapper = document.getElementById("customBudgetWrapper");

  if (!organizerName) return;

  organizerName.value = data.organizer.name || "";
  organizerParticipates.checked = data.organizer.participates ?? true;
  eventType.value = data.event.type || "";
  customEventName.value = data.event.customName || "";
  eventDate.value = data.event.date || "";

  const predefinedBudgets = ["100", "200", "300", "500"];

  if (predefinedBudgets.includes(String(data.event.budget))) {
    budget.value = String(data.event.budget);
    customBudget.value = "";
  } else if (data.event.budget) {
    budget.value = "other";
    customBudget.value = data.event.budget;
    customBudgetWrapper.classList.remove("d-none");
  }

  if (data.event.type === "Otro") {
    customEventWrapper.classList.remove("d-none");
  }
}

/* Participantes */
function handleAddParticipant() {
  const input = document.getElementById("participantName");
  const name = input.value.trim();

  if (!name) {
    showSimpleAlert("Escribe el nombre del participante.");
    return;
  }

  const added = addParticipant(name);

  if (!added) {
    showSimpleAlert("Ese participante ya existe o el nombre no es válido.");
    return;
  }

  input.value = "";
  renderParticipants();
  renderExclusionSelects();
  renderExclusions();
  renderDragParticipants();
}

function renderParticipants() {
  const participantsList = document.getElementById("participantsList");
  if (!participantsList) return;

  const participants = getParticipants();

  if (participants.length === 0) {
    participantsList.innerHTML = `<p class="text-soft mb-0">Aún no hay participantes agregados.</p>`;
    return;
  }

  participantsList.innerHTML = participants
    .map(
      participant => `
        <div class="d-flex justify-content-between align-items-center section-card py-3 px-3">
          <span>${participant.name}</span>
          <button
            type="button"
            class="btn btn-sm btn-soft"
            onclick="handleRemoveParticipant(${participant.id})"
          >
            Eliminar
          </button>
        </div>
      `
    )
    .join("");
}

function handleRemoveParticipant(id) {
  removeParticipant(id);
  renderParticipants();
  renderExclusionSelects();
  renderExclusions();
  renderDragParticipants();
}

/* Exclusiones */
function renderExclusionSelects() {
  const exclusionFrom = document.getElementById("exclusionFrom");
  const exclusionTo = document.getElementById("exclusionTo");

  if (!exclusionFrom || !exclusionTo) return;

  const participants = getParticipants();

  const options = participants
    .map(
      participant => `<option value="${participant.id}">${participant.name}</option>`
    )
    .join("");

  exclusionFrom.innerHTML = `<option value="">Selecciona un participante</option>${options}`;
  exclusionTo.innerHTML = `<option value="">Selecciona un participante</option>${options}`;
}

function handleAddExclusion() {
  const exclusionFrom = document.getElementById("exclusionFrom");
  const exclusionTo = document.getElementById("exclusionTo");

  const fromId = Number(exclusionFrom.value);
  const toId = Number(exclusionTo.value);

  if (typeof validateExclusion === "function") {
    const isValid = validateExclusion(fromId, toId);
    if (!isValid) return;
  }

  const added = addExclusion(fromId, toId);

  if (!added) {
    showSimpleAlert("No se pudo agregar la exclusión.");
    return;
  }

  exclusionFrom.value = "";
  exclusionTo.value = "";

  renderExclusions();
}

function renderExclusions() {
  const exclusionsList = document.getElementById("exclusionsList");
  if (!exclusionsList) return;

  const exclusions = getExclusions();

  if (exclusions.length === 0) {
    exclusionsList.innerHTML = `<p class="text-soft mb-0">Aún no hay exclusiones registradas.</p>`;
    return;
  }

  exclusionsList.innerHTML = exclusions
    .map(
      (exclusion, index) => `
        <div class="d-flex justify-content-between align-items-center section-card py-3 px-3">
          <span>${exclusion.fromName} no puede regalar a ${exclusion.toName}</span>
          <button
            type="button"
            class="btn btn-sm btn-soft"
            onclick="handleRemoveExclusion(${index})"
          >
            Eliminar
          </button>
        </div>
      `
    )
    .join("");
}

function handleRemoveExclusion(index) {
  removeExclusion(index);
  renderExclusions();
}

/* Drag area visual */
function renderDragParticipants() {
  const dragParticipantsArea = document.getElementById("dragParticipantsArea");
  if (!dragParticipantsArea) return;

  const participants = getParticipants();

  if (participants.length === 0) {
    dragParticipantsArea.innerHTML = `<p class="text-soft mb-0">Zona de participantes arrastrables</p>`;
    return;
  }

  dragParticipantsArea.innerHTML = participants
    .map(
      participant => `
        <div class="drag-card" draggable="true" data-id="${participant.id}">
          ${participant.name}
        </div>
      `
    )
    .join("");
}

/* =========================
   DATOS.HTML
========================= */

function initializeDataPage() {
  loadEventDataView();
}

function loadEventDataView() {
  const data = getData();

  const dataOrganizer = document.getElementById("dataOrganizer");
  const dataOrganizerParticipation = document.getElementById("dataOrganizerParticipation");
  const dataEventName = document.getElementById("dataEventName");
  const dataEventDate = document.getElementById("dataEventDate");
  const dataBudget = document.getElementById("dataBudget");
  const dataParticipantsList = document.getElementById("dataParticipantsList");
  const dataExclusionsList = document.getElementById("dataExclusionsList");

  if (!dataOrganizer) return;

  dataOrganizer.textContent = data.organizer.name || "Sin datos";
  dataOrganizerParticipation.textContent = data.organizer.participates ? "Sí participa" : "No participa";

  const eventDisplayName =
    data.event.type === "Otro"
      ? data.event.customName || "Celebración personalizada"
      : data.event.type || "Sin datos";

  dataEventName.textContent = eventDisplayName;
  dataEventDate.textContent = data.event.date || "Sin datos";
  dataBudget.textContent = data.event.budget ? `$${data.event.budget}` : "Sin datos";

  if (data.participants.length === 0) {
    dataParticipantsList.innerHTML = `<p class="text-soft mb-0">No hay participantes guardados.</p>`;
  } else {
    dataParticipantsList.innerHTML = data.participants
      .map(
        participant => `
          <div class="custom-badge mb-2 me-2">${participant.name}</div>
        `
      )
      .join("");
  }

  if (data.exclusions.length === 0) {
    dataExclusionsList.innerHTML = `<p class="text-soft mb-0">No hay exclusiones guardadas.</p>`;
  } else {
    dataExclusionsList.innerHTML = data.exclusions
      .map(
        exclusion => `
          <div class="section-card py-3 px-3 mb-2">
            ${exclusion.fromName} no puede regalar a ${exclusion.toName}
          </div>
        `
      )
      .join("");
  }
}

/* =========================
   SORTEO.HTML
========================= */

function initializeDrawPage() {
  renderDrawParticipants();

  const drawBtn = document.getElementById("drawBtn");
  const saveResultsBtn = document.getElementById("saveResultsBtn");

  if (drawBtn) {
    drawBtn.addEventListener("click", () => {
      if (typeof generateDraw === "function") {
        generateDraw();
      } else {
        showSimpleAlert("Aún falta programar la lógica del sorteo en sorteo.js");
      }
    });
  }

  if (saveResultsBtn) {
    saveResultsBtn.addEventListener("click", () => {
      showSimpleAlert("Cuando esté lista la lógica del sorteo, aquí podrás guardar resultados.");
    });
  }
}

function renderDrawParticipants() {
  const drawParticipants = document.getElementById("drawParticipants");
  if (!drawParticipants) return;

  const participants = getParticipants();

  if (participants.length === 0) {
    drawParticipants.innerHTML = `<span class="text-soft">No hay participantes cargados.</span>`;
    return;
  }

  drawParticipants.innerHTML = participants
    .map(
      participant => `<span class="custom-badge">${participant.name}</span>`
    )
    .join("");
}

/* =========================
   UTILIDAD SIMPLE
========================= */

function showSimpleAlert(message) {
  alert(message);
}