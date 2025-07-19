 document.addEventListener('DOMContentLoaded', () => {
      const gallery = document.querySelector('.scroll_gallery .gallery_container');
      const galleryWidth = gallery.scrollWidth - window.innerWidth; // Ширина галереи для прокрутки
      const scrollSpeed = 0.2; // Скорость прокрутки (меньше = медленнее)

      window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const galleryTop = document.querySelector('.scroll_gallery').offsetTop;
        const windowHeight = window.innerHeight;

        // Проверяем, находится ли галерея в зоне видимости
        if (scrollTop + windowHeight > galleryTop && scrollTop < galleryTop + gallery.offsetHeight) {
          const scrollProgress = (scrollTop + windowHeight - galleryTop) / (gallery.offsetHeight + windowHeight);
          const translateX = -galleryWidth * scrollProgress * scrollSpeed;
          gallery.style.transform = `translateX(${translateX}px)`;
        }
      });
    });