const STORAGE_KEY = "intercambioApp";

function getDefaultData() {
  return {
    organizer: {
      name: "",
      participates: true
    },
    event: {
      type: "",
      customName: "",
      date: "",
      budget: ""
    },
    participants: [],
    exclusions: [],
    results: []
  };
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function getData() {
  const savedData = localStorage.getItem(STORAGE_KEY);

  if (!savedData) {
    const defaultData = getDefaultData();
    saveData(defaultData);
    return defaultData;
  }

  try {
    return JSON.parse(savedData);
  } catch (error) {
    const defaultData = getDefaultData();
    saveData(defaultData);
    return defaultData;
  }
}

function resetData() {
  const defaultData = getDefaultData();
  saveData(defaultData);
  return defaultData;
}

function saveEventData(eventData) {
  const data = getData();

  data.organizer = eventData.organizer;
  data.event = eventData.event;

  saveData(data);
}

function addParticipant(name) {
  const data = getData();
  const cleanName = name.trim();

  if (!cleanName) return false;

  const alreadyExists = data.participants.some(
    participant => participant.name.toLowerCase() === cleanName.toLowerCase()
  );

  if (alreadyExists) return false;

  const newParticipant = {
    id: Date.now(),
    name: cleanName
  };

  data.participants.push(newParticipant);
  saveData(data);
  return true;
}

function removeParticipant(id) {
  const data = getData();

  data.participants = data.participants.filter(
    participant => participant.id !== id
  );

  data.exclusions = data.exclusions.filter(
    exclusion =>
      exclusion.fromId !== id &&
      exclusion.toId !== id
  );

  data.results = [];
  saveData(data);
}

function addExclusion(fromId, toId) {
  const data = getData();

  if (!fromId || !toId) return false;
  if (fromId === toId) return false;

  const alreadyExists = data.exclusions.some(
    exclusion =>
      exclusion.fromId === fromId &&
      exclusion.toId === toId
  );

  if (alreadyExists) return false;

  const fromParticipant = data.participants.find(p => p.id === fromId);
  const toParticipant = data.participants.find(p => p.id === toId);

  if (!fromParticipant || !toParticipant) return false;

  data.exclusions.push({
    fromId,
    toId,
    fromName: fromParticipant.name,
    toName: toParticipant.name
  });

  saveData(data);
  return true;
}

function removeExclusion(index) {
  const data = getData();

  if (index < 0 || index >= data.exclusions.length) return;

  data.exclusions.splice(index, 1);
  data.results = [];
  saveData(data);
}

function saveResults(results) {
  const data = getData();
  data.results = results;
  saveData(data);
}

function getParticipants() {
  return getData().participants;
}

function getExclusions() {
  return getData().exclusions;
}

function getResults() {
  return getData().results;
}