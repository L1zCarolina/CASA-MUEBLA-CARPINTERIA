document.addEventListener('DOMContentLoaded', function () {
  // ========== ScrollReveal - Historia ==========
  window.sr = ScrollReveal();

  sr.reveal('.history__name', {
    duration: 2000,
    viewFactor: 0.1,
    origin: 'bottom',
    distance: '100px',
    delay: 300,
    easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
  });

  sr.reveal('.history__title', {
    duration: 2000,
    viewFactor: 0.1,
    origin: 'bottom',
    distance: '100px',
    delay: 400,
    easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
  });

  sr.reveal('.history__paragraph', {
    duration: 2000,
    viewFactor: 0.1,
    origin: 'bottom',
    distance: '100px',
    delay: 500,
    easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
  });

  sr.reveal('.button__history', {
    duration: 2000,
    viewFactor: 0.1,
    origin: 'bottom',
    distance: '100px',
    delay: 600,
    easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
  });

  sr.reveal('.img-1', {
    duration: 2000,
    viewFactor: 0.1,
    origin: 'bottom',
    distance: '100px',
    delay: 1300,
    easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
  });

  sr.reveal('.img-2', {
    duration: 2000,
    viewFactor: 0.1,
    origin: 'bottom',
    distance: '100px',
    delay: 1500,
    easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
  });

  // ========== ScrollReveal - Valores ==========
  sr.reveal('.card__valor', {
    duration: 1500,
    origin: 'bottom',
    distance: '50px',
    easing: 'ease-in-out',
    interval: 200,
    reset: true
  });

  // ========== Animación de expansión por click en móviles ==========
  const cards = document.querySelectorAll('.card__valor');

      cards.forEach((card) => {
        card.addEventListener('click', () => {
          // Evitar duplicar en escritorio si hay hover (lo controla el hover)
          if (window.matchMedia('(hover: hover)').matches) return; //window.matchMedia('(hover: hover)') detecta si el dispositivo tiene hover (escritorio) o no tiene (móvil/pantalla táctil).
    
          // Quita la clase activas de las demás
          cards.forEach((c) => c.classList.remove('activa'));
    
          // Activar la clickeada
          card.classList.add('activa');
    
          // Cierra la tarjeta después de 5 segundos
          setTimeout(() => {
            card.classList.remove('activa');
          }, 5000);
        });
      });

  // ========== Leer más historia ==========
  const buttonLeerMas = document.querySelector('.button__history');
  const extraText = document.querySelector('.extra-text');

  buttonLeerMas.addEventListener('click', function (e) {
    e.preventDefault();

    if (extraText.style.display === 'none') {
      extraText.style.display = 'inline';
      buttonLeerMas.textContent = 'Leer menos...';
    } else {
      extraText.style.display = 'none';
      buttonLeerMas.textContent = 'Leer más...';
    }
  });
});