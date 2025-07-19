import { renderCarWashTable } from 'https://rmk-kk.github.io/kostya_website/scripts/render_pricetable.js';

let allManufacturers = [];
let selectedManufacturerId = '';
let selectedManufacturerName = '';
const manufacturerInput = document.getElementById('manufacturer');
const suggestionsList = document.getElementById('manufacturer-suggestions');
const modelSelect = document.getElementById('model');
//const detailsContent = document.getElementById('details-content');

const SIZE_CLASSES = [
  { id: 1, name: 'micro',   maxLength: 3600 },
  { id: 2, name: 'compact', maxLength: 4300 },
  { id: 3, name: 'medium',  maxLength: 4700 },
  { id: 4, name: 'family',  maxLength: 5100 },
  { id: 5, name: 'large',   maxLength: 5500 },
  { id: 6, name: 'x-large', maxLength: Infinity }
];


function getSizeClassByLength(lengthMm) {
  for (const category of SIZE_CLASSES) {
    if (lengthMm <= category.maxLength) {
      return category;
    }
  }
  return { id: 0, name: 'unknown' };
}


document.addEventListener('DOMContentLoaded', () => {
  fetchAllManufacturers();
  manufacturerInput.addEventListener('input', filterManufacturers);
  modelSelect.addEventListener('change', fetchModelDetails);
});

// 1️⃣ Fetch all manufacturers sold in Europe
function fetchAllManufacturers() {
  const url = 'https://www.carqueryapi.com/api/0.3/?callback=handleMakes&cmd=getMakes&sold_in_us=0';
  jsonpRequest(url);
}

// 2️⃣ Generic JSONP loader
function jsonpRequest(url) {
  const script = document.createElement('script');
  script.src = url;
  document.body.appendChild(script);
}

// 3️⃣ Handle manufacturers
window.handleMakes = (data) => {
  allManufacturers = data.Makes || [];
  allManufacturers.sort((a, b) => a.make_display.localeCompare(b.make_display));
  console.log(`Loaded ${allManufacturers.length} manufacturers`);
};

// 4️⃣ Filter manufacturer suggestions as user types
function filterManufacturers() {
  const query = manufacturerInput.value.trim().toLowerCase();
  suggestionsList.innerHTML = '';

  if (!query) return;

  const matches = allManufacturers.filter(make =>
    make.make_display.toLowerCase().includes(query)
  );

  if (matches.length === 0) {
    const li = document.createElement('li');
    li.textContent = 'No matches found';
    suggestionsList.appendChild(li);
    return;
  }

  matches.forEach(make => {
    const li = document.createElement('li');
    li.textContent = make.make_display;
    li.dataset.makeId = make.make_id;
    li.addEventListener('click', () => selectManufacturer(make));
    suggestionsList.appendChild(li);
  });
}

// 5️⃣ User picked a manufacturer
function selectManufacturer(make) {
  manufacturerInput.value = make.make_display;
  selectedManufacturerId = make.make_id;
  selectedManufacturerName = make.make_display;
  suggestionsList.innerHTML = '';

  modelSelect.disabled = false;
  modelSelect.innerHTML = '<option value="">Loading models...</option>';

  fetchModels();
}

// 6️⃣ Fetch models for selected manufacturer
function fetchModels() {
  if (!selectedManufacturerId) {
    modelSelect.disabled = true;
    return;
  }

  const url = `https://www.carqueryapi.com/api/0.3/?callback=handleModels&cmd=getModels&make=${selectedManufacturerId}`;
  jsonpRequest(url);
}

// 7️⃣ Handle models response
window.handleModels = (data) => {
  const models = data.Models || [];
  modelSelect.innerHTML = '<option value="">Select a model</option>';

  if (models.length === 0) {
    modelSelect.disabled = true;
    return;
  }

  models.forEach(model => {
    const option = document.createElement('option');
    option.value = model.model_name;
    option.textContent = model.model_name;
    modelSelect.appendChild(option);
  });

  modelSelect.disabled = false;
}

// 8️⃣ User picked a model – fetch its class
function fetchModelDetails() {
  const selectedModel = modelSelect.value;
  if (!selectedManufacturerId || !selectedModel) {
    //detailsContent.textContent = 'Select a manufacturer and model to see details.';
    return;
  }

  const url = `https://www.carqueryapi.com/api/0.3/?callback=handleTrims&cmd=getTrims&make=${selectedManufacturerId}&model=${selectedModel}`;
  jsonpRequest(url);
}

window.handleTrims = (data) => {
  const trims = data.Trims || [];
  if (trims.length === 0) {
    //detailsContent.textContent = 'No trim details found.';
    return;
  }

  // Берём последний трим (самый последний элемент массива)
  const trim = trims[trims.length - 1];

  // Проверим, есть ли длина и попробуем её распарсить
  const lengthMm = parseInt(trim.model_length_mm, 10);

  // if (isNaN(lengthMm)) {
  //   detailsContent.textContent = 'Length data not available for this model.';
  //   return;
  // }

  // Определяем класс размера по длине
  const sizeClass = getSizeClassByLength(lengthMm);

  // // Выводим результат
  // detailsContent.innerHTML = `
  //   <strong>Selected Model:</strong> ${trim.model_make_id.toUpperCase()} ${trim.model_name}<br>
  //   <strong>Length (mm):</strong> ${lengthMm}<br>
  //   <strong>Size Class:</strong> ${sizeClass.id} - ${sizeClass.name}
  // `;

  renderCarWashTable(sizeClass.id);

};

