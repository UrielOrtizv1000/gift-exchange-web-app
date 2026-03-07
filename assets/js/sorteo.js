function generateDraw() {
  const data = getData();
  const participants = [...data.participants];
  const exclusions = [...data.exclusions];

  const drawStatus = document.getElementById("drawStatus");
  const drawResults = document.getElementById("drawResults");

  if (!drawStatus || !drawResults) return;

  if (participants.length < 2) {
    drawStatus.textContent = "Se necesitan al menos 2 participantes para realizar el sorteo.";
    drawResults.innerHTML = `
      <p class="text-soft mb-0">
        Agrega más participantes antes de realizar el sorteo.
      </p>
    `;
    return;
  }

  const organizerName = data.organizer.name?.trim();
  const organizerParticipates = data.organizer.participates;

  if (organizerName && organizerParticipates) {
    const organizerExists = participants.some(
      participant => participant.name.toLowerCase() === organizerName.toLowerCase()
    );

    if (!organizerExists) {
      participants.unshift({
        id: Date.now() + Math.floor(Math.random() * 1000),
        name: organizerName
      });
    }
  }

  if (participants.length < 2) {
    drawStatus.textContent = "No hay suficientes participantes válidos para realizar el sorteo.";
    drawResults.innerHTML = `
      <p class="text-soft mb-0">
        Verifica la lista de participantes.
      </p>
    `;
    return;
  }

  const maxAttempts = 5000;
  let results = null;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const receivers = shuffleArray([...participants]);
    const tentativeResults = [];

    let valid = true;

    for (let i = 0; i < participants.length; i++) {
      const giver = participants[i];
      const receiver = receivers[i];

      if (!isValidAssignment(giver, receiver, exclusions)) {
        valid = false;
        break;
      }

      tentativeResults.push({
        giverId: giver.id,
        giverName: giver.name,
        receiverId: receiver.id,
        receiverName: receiver.name
      });
    }

    if (valid) {
      results = tentativeResults;
      break;
    }
  }

  if (!results) {
    drawStatus.textContent = "No fue posible generar un sorteo válido con las exclusiones actuales.";
    drawResults.innerHTML = `
      <div class="section-card py-3 px-3">
        <p class="mb-0 text-soft">
          Revisa las exclusiones. Puede haber demasiadas restricciones y el sistema no logra encontrar una combinación válida.
        </p>
      </div>
    `;
    return;
  }

  saveResults(results);
  renderDrawResults(results);

  drawStatus.textContent = "Sorteo realizado correctamente.";
}

function isValidAssignment(giver, receiver, exclusions) {
  if (!giver || !receiver) return false;

  if (giver.id === receiver.id) {
    return false;
  }

  const blocked = exclusions.some(exclusion => {
    return exclusion.fromId === giver.id && exclusion.toId === receiver.id;
  });

  if (blocked) {
    return false;
  }

  return true;
}

function shuffleArray(array) {
  const newArray = [...array];

  for (let i = newArray.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[randomIndex]] = [newArray[randomIndex], newArray[i]];
  }

  return newArray;
}

function renderDrawResults(results) {
  const drawResults = document.getElementById("drawResults");
  if (!drawResults) return;

  if (!results || results.length === 0) {
    drawResults.innerHTML = `
      <p class="text-soft mb-0">
        No hay resultados disponibles.
      </p>
    `;
    return;
  }

  drawResults.innerHTML = results
    .map(result => {
      return `
        <div class="result-card">
          <div class="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-2">
            <span class="result-name">${result.giverName}</span>
            <span class="result-arrow">le regala a</span>
            <span class="result-receiver">${result.receiverName}</span>
          </div>
        </div>
      `;
    })
    .join("");
}

function loadSavedDrawResults() {
  const results = getResults();
  const drawStatus = document.getElementById("drawStatus");

  if (!results || results.length === 0) return;

  renderDrawResults(results);

  if (drawStatus) {
    drawStatus.textContent = "Se muestran los últimos resultados guardados.";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.includes("sorteo.html")) {
    loadSavedDrawResults();

    const saveResultsBtn = document.getElementById("saveResultsBtn");
    if (saveResultsBtn) {
      saveResultsBtn.addEventListener("click", () => {
        const results = getResults();

        if (!results || results.length === 0) {
          alert("Primero debes realizar el sorteo.");
          return;
        }

        alert("Los resultados ya están guardados en localStorage.");
      });
    }
  }
});