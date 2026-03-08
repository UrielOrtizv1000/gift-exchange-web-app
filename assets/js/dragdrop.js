document.addEventListener("DOMContentLoaded", () => {
  if (!window.location.pathname.includes("evento.html")) return;
  initializeDragAndDrop();
});

function initializeDragAndDrop() {
  const dragArea = document.getElementById("dragParticipantsArea");
  const dropArea = document.getElementById("dropExclusionArea");

  if (!dragArea || !dropArea) return;

  attachDragEvents();
  setupDropZone(dropArea);
}

function attachDragEvents() {
  const dragCards = document.querySelectorAll(".drag-card");

  dragCards.forEach((card) => {
    card.removeEventListener("dragstart", handleDragStart);
    card.removeEventListener("dragend", handleDragEnd);

    card.addEventListener("dragstart", handleDragStart);
    card.addEventListener("dragend", handleDragEnd);
  });
}

function handleDragStart(event) {
  const card = event.currentTarget;
  const participantId = card.dataset.id;

  if (!participantId) return;

  event.dataTransfer.setData("text/plain", participantId);
  event.dataTransfer.effectAllowed = "move";

  card.classList.add("dragging");
}

function handleDragEnd(event) {
  event.currentTarget.classList.remove("dragging");
}

function setupDropZone(dropZone) {
  dropZone.removeEventListener("dragover", handleDragOver);
  dropZone.removeEventListener("dragenter", handleDragEnter);
  dropZone.removeEventListener("dragleave", handleDragLeave);
  dropZone.removeEventListener("drop", handleDrop);

  dropZone.addEventListener("dragover", handleDragOver);
  dropZone.addEventListener("dragenter", handleDragEnter);
  dropZone.addEventListener("dragleave", handleDragLeave);
  dropZone.addEventListener("drop", handleDrop);
}

function handleDragOver(event) {
  event.preventDefault();
  event.dataTransfer.dropEffect = "move";
}

function handleDragEnter(event) {
  event.preventDefault();
  event.currentTarget.classList.add("drop-zone-active");
}

function handleDragLeave(event) {
  event.currentTarget.classList.remove("drop-zone-active");
}

function handleDrop(event) {
  event.preventDefault();

  const dropZone = event.currentTarget;
  dropZone.classList.remove("drop-zone-active");

  const draggedParticipantId = Number(event.dataTransfer.getData("text/plain"));
  if (!draggedParticipantId) return;

  openExclusionSelector(draggedParticipantId);
}

function openExclusionSelector(fromId) {
  const data = getData();
  const fromParticipant = data.participants.find((p) => p.id === fromId);

  if (!fromParticipant) {
    alert("No se encontró el participante arrastrado.");
    return;
  }

  const availableTargets = data.participants.filter((p) => p.id !== fromId);

  if (availableTargets.length === 0) {
    alert("No hay participantes disponibles para crear una exclusión.");
    return;
  }

  const existingBlockedIds = data.exclusions
    .filter((exclusion) => exclusion.fromId === fromId)
    .map((exclusion) => exclusion.toId);

  const filteredTargets = availableTargets.filter(
    (participant) => !existingBlockedIds.includes(participant.id)
  );

  if (filteredTargets.length === 0) {
    alert("Ese participante ya tiene exclusiones con todos los demás.");
    return;
  }

  const optionsText = filteredTargets
    .map((participant, index) => `${index + 1}. ${participant.name}`)
    .join("\n");

  const selectedOption = prompt(
    `Selecciona a quién NO puede regalar ${fromParticipant.name}.\n\n${optionsText}\n\nEscribe el número de la opción:`
  );

  if (selectedOption === null) return;

  const selectedIndex = Number(selectedOption) - 1;

  if (
    Number.isNaN(selectedIndex) ||
    selectedIndex < 0 ||
    selectedIndex >= filteredTargets.length
  ) {
    alert("Selección no válida.");
    return;
  }

  const selectedParticipant = filteredTargets[selectedIndex];
  const added = addExclusion(fromId, selectedParticipant.id);

  if (!added) {
    alert("No se pudo agregar la exclusión.");
    return;
  }

  if (typeof renderExclusions === "function") {
    renderExclusions();
  }

  if (typeof renderExclusionSelects === "function") {
    renderExclusionSelects();
  }

  if (typeof renderDragParticipants === "function") {
    renderDragParticipants();
  }

  attachDragEvents();
  renderDropZoneFeedback(fromParticipant.name, selectedParticipant.name);
}

function renderDropZoneFeedback(fromName, toName) {
  const dropArea = document.getElementById("dropExclusionArea");
  if (!dropArea) return;

  const currentFeedback = document.getElementById("dropFeedbackMessage");
  if (currentFeedback) {
    currentFeedback.remove();
  }

  const message = document.createElement("div");
  message.id = "dropFeedbackMessage";
  message.className = "section-card py-3 px-3 mt-3";
  message.innerHTML = `
    <strong>${fromName}</strong> no puede regalar a <strong>${toName}</strong>.
  `;

  dropArea.appendChild(message);
}