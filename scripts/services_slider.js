// Набор слайдов с SVG и текстом
const slides = [
  {
    icon: `
      <svg viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke="black" stroke-width="2" fill="lightblue" />
      </svg>
    `,
    text: "Это голубой круг — простая иконка."
  },
  {
    icon: `
      <svg viewBox="0 0 24 24">
        <rect x="4" y="4" width="16" height="16" stroke="black" stroke-width="2" fill="orange" />
      </svg>
    `,
    text: "Это оранжевый квадрат."
  },
  {
    icon: `
      <svg viewBox="0 0 24 24">
        <polygon points="12,2 22,22 2,22" stroke="black" stroke-width="2" fill="green" />
      </svg>
    `,
    text: "Это зелёный треугольник."
  }
];

let currentIndex = 0;

// DOM элементы
const iconContainer = document.getElementById('iconContainer');
const descriptionContainer = document.getElementById('descriptionContainer');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

// Функция обновления слайда
function updateSlide() {
  iconContainer.innerHTML = slides[currentIndex].icon;
  descriptionContainer.textContent = slides[currentIndex].text;
}

// Слушатели на кнопки
prevBtn.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + slides.length) % slides.length;
  updateSlide();
});

nextBtn.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % slides.length;
  updateSlide();
});

// Инициализация
updateSlide();
