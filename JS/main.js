document.addEventListener('DOMContentLoaded', () => {
  // año en footer
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // navbar: abrir/cerrar el menú 
  const toggler = document.querySelector('.botonHamburguesa');
  const menu = document.getElementById('menuPrincipal');
  if (toggler && menu) {
    toggler.addEventListener('click', () => menu.classList.toggle('show'));
  }

  // carrusel:
  const carouselEl = document.getElementById('heroCarousel');
  if (carouselEl && window.bootstrap) {
    const caro = new bootstrap.Carousel(carouselEl, {
      interval: 5000,
      ride: 'carousel',
      pause: false
    });
    // botones prev/next
    const prev = document.querySelector('.flechaAtras');
    const next = document.querySelector('.flechaAdelante');
    prev && prev.addEventListener('click', () => caro.prev());
    next && next.addEventListener('click', () => caro.next());
  }
});