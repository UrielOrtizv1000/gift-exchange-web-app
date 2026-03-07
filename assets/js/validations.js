function validateEventForm() {
  const organizerName = document.getElementById("organizerName")?.value.trim() || "";
  const eventType = document.getElementById("eventType")?.value || "";
  const customEventName = document.getElementById("customEventName")?.value.trim() || "";
  const eventDate = document.getElementById("eventDate")?.value || "";
  const budget = document.getElementById("budget")?.value || "";
  const customBudget = document.getElementById("customBudget")?.value.trim() || "";

  const data = getData();
  const participants = data.participants || [];

  if (!organizerName) {
    showSimpleAlert("Debes escribir el nombre del organizador.");
    return false;
  }

  if (!eventType) {
    showSimpleAlert("Debes seleccionar el tipo de evento.");
    return false;
  }

  if (eventType === "Otro" && !customEventName) {
    showSimpleAlert("Debes escribir el nombre de la celebración personalizada.");
    return false;
  }

  if (!eventDate) {
    showSimpleAlert("Debes seleccionar la fecha del evento.");
    return false;
  }

  if (!budget) {
    showSimpleAlert("Debes seleccionar un presupuesto.");
    return false;
  }

  if (budget === "other") {
    if (!customBudget) {
      showSimpleAlert("Debes escribir la cantidad personalizada del presupuesto.");
      return false;
    }

    if (Number(customBudget) <= 0) {
      showSimpleAlert("El presupuesto debe ser mayor que cero.");
      return false;
    }
  }

  if (participants.length < 2) {
    showSimpleAlert("Debes agregar al menos 2 participantes para continuar.");
    return false;
  }

  return true;
}

function validateParticipantName(name) {
  const cleanName = name.trim();

  if (!cleanName) {
    showSimpleAlert("El nombre del participante no puede estar vacío.");
    return false;
  }

  if (cleanName.length < 2) {
    showSimpleAlert("El nombre del participante es demasiado corto.");
    return false;
  }

  const data = getData();
  const alreadyExists = data.participants.some(
    (participant) => participant.name.toLowerCase() === cleanName.toLowerCase()
  );

  if (alreadyExists) {
    showSimpleAlert("Ese participante ya fue agregado.");
    return false;
  }

  return true;
}

function validateExclusion(fromId, toId) {
  if (!fromId || !toId) {
    showSimpleAlert("Debes seleccionar ambos participantes.");
    return false;
  }

  if (Number(fromId) === Number(toId)) {
    showSimpleAlert("Un participante no puede excluirse a sí mismo.");
    return false;
  }

  const data = getData();

  const fromParticipant = data.participants.find((p) => p.id === Number(fromId));
  const toParticipant = data.participants.find((p) => p.id === Number(toId));

  if (!fromParticipant || !toParticipant) {
    showSimpleAlert("Los participantes seleccionados no son válidos.");
    return false;
  }

  const alreadyExists = data.exclusions.some(
    (exclusion) =>
      exclusion.fromId === Number(fromId) && exclusion.toId === Number(toId)
  );

  if (alreadyExists) {
    showSimpleAlert("Esa exclusión ya existe.");
    return false;
  }

  return true;
}

function validateBeforeDraw() {
  const data = getData();
  const participants = data.participants || [];

  if (participants.length < 2) {
    showSimpleAlert("Se necesitan al menos 2 participantes para hacer el sorteo.");
    return false;
  }

  return true;
}