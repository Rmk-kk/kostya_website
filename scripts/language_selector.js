document.addEventListener('DOMContentLoaded', function() {
  const toggleButton = document.getElementById('languageToggle');
  const optionsList = document.getElementById('languageOptions');
  const options = optionsList.querySelectorAll('li');

  // Language configuration
  const languages = {
    en: { flag: '🇬🇧', label: 'English' },
    fi: { flag: '🇫🇮', label: 'Suomi' },
    ru: { flag: '🇷🇺', label: 'Русский' }
  };

  // Determine current language based on pathname
  let currentLang = 'en';
  const path = window.location.pathname;
  if (path.startsWith('/kostya_website/fi/')) {
    currentLang = 'fi';
  } else if (path.startsWith('/kostya_website/ru/')) {
    currentLang = 'ru';
  }

  // Update toggle button display
  function updateToggleButton(lang) {
    const { flag, label } = languages[lang];
    toggleButton.querySelector('.flag').textContent = flag;
    toggleButton.querySelector('.label').textContent = label;
  }

  // Set initial toggle button state
  updateToggleButton(currentLang);

  // Toggle dropdown visibility
  toggleButton.addEventListener('click', function() {
    optionsList.classList.toggle('show');
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', function(e) {
    if (!toggleButton.contains(e.target) && !optionsList.contains(e.target)) {
      optionsList.classList.remove('show');
    }
  });

  // Handle language selection
  options.forEach(function(option) {
    option.addEventListener('click', function() {
      const selectedLang = this.getAttribute('data-lang');

      // Update button
      updateToggleButton(selectedLang);

      // Close dropdown
      optionsList.classList.remove('show');

      // Redirect to selected language page
      const basePath = '/kostya_website/';
      const redirectPath = selectedLang === 'en' ? basePath : `${basePath}${selectedLang}/`;
      window.location.replace(redirectPath);
    });
  });
});