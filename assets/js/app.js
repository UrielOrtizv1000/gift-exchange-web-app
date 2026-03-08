document.addEventListener("DOMContentLoaded", () => {
  initializeApp();
});

function initializeApp() {
  const currentPage = window.location.pathname;

  if (currentPage.includes("evento.html")) {
    initializeEventPage();
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
  const organizerNameInput = document.getElementById("organizerName");
  const organizerParticipatesInput = document.getElementById("organizerParticipates");

  if (eventType) {
    eventType.addEventListener("change", () => {
      if (customEventWrapper) {
        customEventWrapper.classList.toggle("d-none", eventType.value !== "Otro");
      }
    });
  }

  if (budget) {
    budget.addEventListener("change", () => {
      if (customBudgetWrapper) {
        customBudgetWrapper.classList.toggle("d-none", budget.value !== "other");
      }
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

  if (organizerNameInput) {
    organizerNameInput.addEventListener("input", handleOrganizerChange);
  }

  if (organizerParticipatesInput) {
    organizerParticipatesInput.addEventListener("change", handleOrganizerChange);
  }

  loadEventFormData();
  syncOrganizerAndRefreshUI();
}

/* =========================
   ORGANIZADOR
========================= */

function handleOrganizerChange() {
  const organizerName = document.getElementById("organizerName")?.value.trim() || "";
  const organizerParticipates = document.getElementById("organizerParticipates")?.checked || false;

  const currentData = getData();

  saveEventData({
    organizer: {
      name: organizerName,
      participates: organizerParticipates
    },
    event: currentData.event
  });

  syncOrganizerAndRefreshUI();
}

function syncOrganizerAndRefreshUI() {
  if (typeof syncOrganizerWithParticipants === "function") {
    syncOrganizerWithParticipants();
  }

  renderParticipants();
  renderExclusionSelects();
  renderExclusions();
  renderDragParticipants();

  if (typeof initializeDragAndDrop === "function") {
    initializeDragAndDrop();
  }
}

/* =========================
   GUARDAR EVENTO
========================= */

function handleSaveEvent() {
  const organizerName = document.getElementById("organizerName")?.value.trim() || "";
  const organizerParticipates = document.getElementById("organizerParticipates")?.checked || false;
  const eventType = document.getElementById("eventType")?.value || "";
  const customEventName = document.getElementById("customEventName")?.value.trim() || "";
  const eventDate = document.getElementById("eventDate")?.value || "";
  const budget = document.getElementById("budget")?.value || "";
  const customBudget = document.getElementById("customBudget")?.value.trim() || "";

  const finalBudget = budget === "other" ? customBudget : budget;

  const eventData = {
    organizer: {
      name: organizerName,
      participates: organizerParticipates
    },
    event: {
      type: eventType,
      customName: customEventName,
      date: eventDate,
      budget: finalBudget
    }
  };

  saveEventData(eventData);

  if (typeof syncOrganizerWithParticipants === "function") {
    syncOrganizerWithParticipants();
  }

  if (typeof validateEventForm === "function") {
    const isValid = validateEventForm();
    if (!isValid) return;
  }

  renderParticipants();
  renderExclusionSelects();
  renderExclusions();
  renderDragParticipants();

  if (typeof initializeDragAndDrop === "function") {
    initializeDragAndDrop();
  }

  showSimpleAlert("La información del evento se guardó correctamente.");
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

  organizerName.value = data.organizer?.name || "";
  organizerParticipates.checked = data.organizer?.participates ?? true;
  eventType.value = data.event?.type || "";
  customEventName.value = data.event?.customName || "";
  eventDate.value = data.event?.date || "";

  const predefinedBudgets = ["100", "200", "300", "500"];

  if (predefinedBudgets.includes(String(data.event?.budget))) {
    budget.value = String(data.event.budget);
    customBudget.value = "";
    if (customBudgetWrapper) {
      customBudgetWrapper.classList.add("d-none");
    }
  } else if (data.event?.budget) {
    budget.value = "other";
    customBudget.value = data.event.budget;
    if (customBudgetWrapper) {
      customBudgetWrapper.classList.remove("d-none");
    }
  } else {
    budget.value = "";
    customBudget.value = "";
    if (customBudgetWrapper) {
      customBudgetWrapper.classList.add("d-none");
    }
  }

  if (data.event?.type === "Otro") {
    if (customEventWrapper) {
      customEventWrapper.classList.remove("d-none");
    }
  } else {
    if (customEventWrapper) {
      customEventWrapper.classList.add("d-none");
    }
  }
}

/* =========================
   PARTICIPANTES
========================= */

function handleAddParticipant() {
  const input = document.getElementById("participantName");
  if (!input) return;

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

  if (typeof initializeDragAndDrop === "function") {
    initializeDragAndDrop();
  }
}

function renderParticipants() {
  const participantsList = document.getElementById("participantsList");
  if (!participantsList) return;

  const participants = getParticipants();

  if (!participants || participants.length === 0) {
    participantsList.innerHTML = `<p class="text-soft mb-0">Aún no hay participantes agregados.</p>`;
    return;
  }

  participantsList.innerHTML = participants
    .map((participant) => {
      return `
        <div class="d-flex justify-content-between align-items-center section-card py-3 px-3">
          <span>
            ${participant.name}
            ${participant.isOrganizer ? '<small class="ms-2 text-soft">(Organizador)</small>' : ""}
          </span>
          ${
            participant.isOrganizer
              ? ""
              : `
                <button
                  type="button"
                  class="btn btn-sm btn-soft"
                  onclick="handleRemoveParticipant(${participant.id})"
                >
                  Eliminar
                </button>
              `
          }
        </div>
      `;
    })
    .join("");
}

function handleRemoveParticipant(id) {
  removeParticipant(id);
  renderParticipants();
  renderExclusionSelects();
  renderExclusions();
  renderDragParticipants();

  if (typeof initializeDragAndDrop === "function") {
    initializeDragAndDrop();
  }
}

/* =========================
   EXCLUSIONES
========================= */

function renderExclusionSelects() {
  const exclusionFrom = document.getElementById("exclusionFrom");
  const exclusionTo = document.getElementById("exclusionTo");

  if (!exclusionFrom || !exclusionTo) return;

  const participants = getParticipants();

  const options = participants
    .map((participant) => `<option value="${participant.id}">${participant.name}</option>`)
    .join("");

  exclusionFrom.innerHTML = `<option value="">Selecciona un participante</option>${options}`;
  exclusionTo.innerHTML = `<option value="">Selecciona un participante</option>${options}`;
}

function handleAddExclusion() {
  const exclusionFrom = document.getElementById("exclusionFrom");
  const exclusionTo = document.getElementById("exclusionTo");

  if (!exclusionFrom || !exclusionTo) return;

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

  if (!exclusions || exclusions.length === 0) {
    exclusionsList.innerHTML = `<p class="text-soft mb-0">Aún no hay exclusiones registradas.</p>`;
    return;
  }

  exclusionsList.innerHTML = exclusions
    .map((exclusion, index) => {
      return `
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
      `;
    })
    .join("");
}

function handleRemoveExclusion(index) {
  removeExclusion(index);
  renderExclusions();
}

/* =========================
   DRAG AREA VISUAL
========================= */

function renderDragParticipants() {
  const dragParticipantsArea = document.getElementById("dragParticipantsArea");
  if (!dragParticipantsArea) return;

  const participants = getParticipants();

  if (!participants || participants.length === 0) {
    dragParticipantsArea.innerHTML = `<p class="text-soft mb-0">Zona de participantes arrastrables</p>`;
    return;
  }

  dragParticipantsArea.innerHTML = participants
    .map((participant) => {
      return `
        <div class="drag-card" draggable="true" data-id="${participant.id}">
          ${participant.name}
        </div>
      `;
    })
    .join("");
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
      if (typeof validateBeforeDraw === "function") {
        const isValid = validateBeforeDraw();
        if (!isValid) return;
      }

      if (typeof generateDraw === "function") {
        generateDraw();
        renderDrawParticipants();
      } else {
        showSimpleAlert("Aún falta programar la lógica del sorteo en sorteo.js");
      }
    });
  }

  if (saveResultsBtn) {
    saveResultsBtn.addEventListener("click", () => {
      const results = getResults();

      if (!results || results.length === 0) {
        showSimpleAlert("Primero debes realizar el sorteo.");
        return;
      }

      showSimpleAlert("Los resultados ya están guardados en localStorage.");
    });
  }
}

function renderDrawParticipants() {
  const drawParticipants = document.getElementById("drawParticipants");
  if (!drawParticipants) return;

  const participants = getParticipants();

  if (!participants || participants.length === 0) {
    drawParticipants.innerHTML = `<span class="text-soft">No hay participantes cargados.</span>`;
    return;
  }

  drawParticipants.innerHTML = participants
    .map((participant) => `<span class="custom-badge">${participant.name}</span>`)
    .join("");
}

function showSimpleAlert(message) {
  alert(message);
}