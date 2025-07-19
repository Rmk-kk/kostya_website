// Function to get the selected language from the dropdown
function getSelectedLanguage() {
  // Find the selected option by checking the toggle button's label or localStorage
  const languageToggle = document.getElementById('languageToggle');
  const label = languageToggle.querySelector('.label').textContent;
  let selectedLang;

  // Map label to language code
  if (label === 'Suomi') {
    selectedLang = 'fi';
  } else if (label === 'Русский') {
    selectedLang = 'ru';
  } else {
    selectedLang = 'en'; // Default to English
  }

  // Fallback to localStorage if no label is found (initial load)
  return selectedLang || localStorage.getItem('selectedLanguage') || 'en';
}

// Function to get the JSON file based on the selected language
function getJsonFileForLanguage() {
  const selectedLanguage = getSelectedLanguage();
  console.log('Selected language:', selectedLanguage);

  // Select file based on language
  if (selectedLanguage === 'fi') {
    return '../data/services_all_classes_fi.json';
  } else if (selectedLanguage === 'ru') {
    return '../data/services_all_classes_ru.json';
  } else {
    return '../data/services_all_classes_en.json'; // Default to English
  }
}

// Function to load JSON data
async function loadCarWashServices() {
  try {
    const jsonFile = getJsonFileForLanguage();
    const response = await fetch(jsonFile);
    if (!response.ok) {
      throw new Error(`Failed to load JSON from ${jsonFile}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error loading car wash services:", error);
    return []; // Return empty array to prevent breaking the table
  }
}

// Function to render the car wash services table
export async function renderCarWashTable(carClass) {
  // Load services
  const services = await loadCarWashServices();

  // Find the container for rendering
  const container = document.getElementById('car-wash-table-container');
  if (!container) {
    console.error("Container with ID 'car-wash-table-container' not found");
    return;
  }
  container.innerHTML = ''; // Clear container before rendering

  // Create table
  const table = document.createElement('table');
  table.style.width = '100%';
  table.style.borderCollapse = 'collapse';

  // Create table header
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');

  const thDescription = document.createElement('th');
  const selectedLanguage = getSelectedLanguage();
  thDescription.textContent =
    selectedLanguage === 'fi' ? 'Palvelun kuvaus' :
    selectedLanguage === 'ru' ? 'Описание услуги' :
    'Service Description';
  thDescription.style.textAlign = 'left';
  thDescription.style.padding = '12px';
  thDescription.style.borderBottom = '2px solid #444';

  const thPrice = document.createElement('th');
  thPrice.textContent =
    selectedLanguage === 'fi' ? 'Hinta (€)' :
    selectedLanguage === 'ru' ? 'Цена (€)' :
    'Price (€)';
  thPrice.style.width = '120px';
  thPrice.style.textAlign = 'right';
  thPrice.style.padding = '12px';
  thPrice.style.borderBottom = '2px solid #444';

  headerRow.appendChild(thDescription);
  headerRow.appendChild(thPrice);
  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Create table body
  const tbody = document.createElement('tbody');

  services.forEach(service => {
    const tr = document.createElement('tr');
    tr.style.borderBottom = '1px solid #ddd';

    // Column for name and description
    const tdDesc = document.createElement('td');
    tdDesc.style.padding = '10px 12px';

    // Service name - bold and larger
    const serviceName = document.createElement('div');
    serviceName.textContent = service.name;
    serviceName.style.fontWeight = '700';
    serviceName.style.fontSize = '1.1em';
    serviceName.style.marginBottom = '6px';

    tdDesc.appendChild(serviceName);

    // Description - list
    if (service.description && service.description.length > 0) {
      const ul = document.createElement('ul');
      ul.style.margin = '0';
      ul.style.paddingLeft = '20px';
      ul.style.fontSize = '0.9em';
      ul.style.color = '#555';

      service.description.forEach(desc => {
        const li = document.createElement('li');
        li.textContent = desc;
        ul.appendChild(li);
      });

      tdDesc.appendChild(ul);
    }

    // Column for price
    const tdPrice = document.createElement('td');
    tdPrice.style.padding = '10px 12px';
    tdPrice.style.textAlign = 'right';
    tdPrice.style.fontWeight = '600';
    tdPrice.style.fontSize = '1.05em';

    // Select price for the car class
    const priceKey = `class_price_${carClass}`;
    const price = service[priceKey];

    tdPrice.textContent = price ? `${price} €` : '-';

    tr.appendChild(tdDesc);
    tr.appendChild(tdPrice);

    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  container.appendChild(table);
}

// Navigation labels for each language
const navLabels = {
  fi: {
    services: 'Palvelut',
    about: 'Meistä',
    faq: 'FAQ',
    contacts: 'Yhteystiedot',
    prices: 'Hinnat'
  },
  en: {
    services: 'Services',
    about: 'About Us',
    faq: 'FAQ',
    contacts: 'Contacts',
    prices: 'Prices'
  },
  ru: {
    services: 'Услуги',
    about: 'О Нас',
    faq: 'FAQ',
    contacts: 'Контакты',
    prices: 'Цены'
  }
};

// Function to initialize the language selector and navigation
function initializeLanguageSelector(carClass) {
  const languageToggle = document.getElementById('languageToggle');
  const languageOptions = document.getElementById('languageOptions');
  const options = languageOptions.querySelectorAll('li');
  const navLinks = document.querySelectorAll('.nav-menu a');
  const linkOrder = ['services', 'about', 'faq', 'contacts', 'prices'];

  // Update dropdown button based on selected language
  function updateToggleButton(lang) {
    const selectedOption = languageOptions.querySelector(`li[data-lang="${lang}"]`);
    if (selectedOption) {
      const flag = selectedOption.querySelector('.flag').textContent;
      const label = selectedOption.querySelector('.label').textContent;
      languageToggle.querySelector('.flag').textContent = flag;
      languageToggle.querySelector('.label').textContent = label;
    }
  }

  // Update navigation links based on selected language
  function updateNavigationLinks(lang) {
    const langPath = lang === 'fi' ? '/fi' : lang === 'ru' ? '/ru' : '/en';
    const labels = navLabels[lang] || navLabels.en;
    const currentPage = window.location.pathname.split('/').pop();

    navLinks.forEach((link, index) => {
      const key = linkOrder[index];
      if (key) { // Ensure key exists (skips commented-out gallery link)
        link.textContent = labels[key];
        const originalHref = link.getAttribute('href');
        const newHref = originalHref.replace(/\/(ru|en|fi)\//, `${langPath}/`);
        link.setAttribute('href', newHref);

        if (currentPage === 'prices.html' && newHref.includes('prices.html')) {
          link.classList.add('disabled');
          link.removeAttribute('href');
        } else {
          link.classList.remove('disabled');
        }
      }
    });
  }

  // Load saved language or default to 'en'
  const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';
  updateToggleButton(savedLanguage);
  updateNavigationLinks(savedLanguage);
  renderCarWashTable(carClass); // Initial table render

  // Toggle dropdown visibility
  languageToggle.addEventListener('click', () => {
    languageOptions.classList.toggle('active');
  });

  // Handle language selection
  options.forEach(option => {
    option.addEventListener('click', () => {
      const selectedLang = option.getAttribute('data-lang');
      localStorage.setItem('selectedLanguage', selectedLang); // Save to localStorage
      updateToggleButton(selectedLang); // Update dropdown button
      updateNavigationLinks(selectedLang); // Update navigation links
      languageOptions.classList.remove('active'); // Hide dropdown
      renderCarWashTable(carClass); // Re-render table
    });
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (event) => {
    if (!languageToggle.contains(event.target) && !languageOptions.contains(event.target)) {
      languageOptions.classList.remove('active');
    }
  });
}

// Run when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  const carClass = 1; // Replace with logic to determine carClass (e.g., from user input)
  initializeLanguageSelector(carClass);
});