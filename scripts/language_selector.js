
document.addEventListener('DOMContentLoaded', function() {
  const toggleButton = document.getElementById('languageToggle');
  const optionsList = document.getElementById('languageOptions');
  const options = optionsList.querySelectorAll('li');

  // определяем текущий язык по адресу
  let currentLang = 'en';
  const path = window.location.pathname;
  if (path.startsWith('/fi')) {
    currentLang = 'fi';
  } else if (path.startsWith('/ru')) {
    currentLang = 'ru';
  }

  // устанавливаем кнопку в актуальное состояние
  function updateToggleButton(lang) {
    let flag = '🇬🇧';
    let label = 'English';

    if (lang === 'fi') {
      flag = '🇫🇮';
      label = 'Suomi';
    } else if (lang === 'ru') {
      flag = '🇷🇺';
      label = 'Русский';
    }

    toggleButton.querySelector('.flag').textContent = flag;
    toggleButton.querySelector('.label').textContent = label;
  }

  updateToggleButton(currentLang);

  // открыть/закрыть выпадашку
  toggleButton.addEventListener('click', function() {
    optionsList.classList.toggle('show');
  });

  // клик вне селектора = закрыть
  document.addEventListener('click', function(e) {
    if (!toggleButton.contains(e.target) && !optionsList.contains(e.target)) {
      optionsList.classList.remove('show');
    }
  });

  // обработка выбора опции
  options.forEach(function(option) {
    option.addEventListener('click', function() {
      const selectedLang = this.getAttribute('data-lang');

      // обновляем кнопку
      updateToggleButton(selectedLang);

      // закрываем список
      optionsList.classList.remove('show');

      // редирект
      if (selectedLang === 'en') {
        window.location.href = 'https://rmk-kk.github.io/kostya_website/';
      } else {
        window.location.href = 'https://rmk-kk.github.io/kostya_website/' + selectedLang + '/';
      }
    });
  });
});

