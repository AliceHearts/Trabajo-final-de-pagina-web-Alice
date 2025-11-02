// Carrusel, validación del formulario y mapa dinámico
document.addEventListener('DOMContentLoaded', () => {
  //Carrusel 
  const carouselEl = document.getElementById('contactCarousel');
  if (carouselEl && window.bootstrap) {
    const caro = new bootstrap.Carousel(carouselEl, { interval: 5000, ride: 'carousel', pause: false });
    document.querySelector('.flechaAtras')?.addEventListener('click', () => caro.prev());
    document.querySelector('.flechaAdelante')?.addEventListener('click', () => caro.next());
  }

  //Validación con JS 
  const form = document.getElementById('formularioEstelar');
  const cajaErrores = document.getElementById('cajaErrores');

  const el = (id) => document.getElementById(id);

  const reglas = {
    nombre: (v) => /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ ]{3,40}$/.test(v.trim()),
    apellidos: (v) => /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ ]{4,60}$/.test(v.trim()),
    telefono: (v) => /^[0-9]{9}$/.test(v.trim()),
    email: (v) => /^[^@\s]{2,}@[A-Za-z0-9.-]{2,}\.[A-Za-z]{2,}$/.test(v.trim()),
  };

  const campos = {
    nombre: el('nombreInput'),
    apellidos: el('apellidosInput'),
    telefono: el('telefonoInput'),
    email: el('emailInput'),
    comentarios: el('comentariosInput'),
  };

  const validarCampo = (key) => {
    const ok = reglas[key] ? reglas[key](campos[key].value) : true;
    campos[key].classList.toggle('is-valid', ok);
    campos[key].classList.toggle('is-invalid', !ok);
    return ok;
  };

  Object.keys(campos).forEach((k) => {
    campos[k].addEventListener('input', () => validarCampo(k));
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const resultados = Object.keys(reglas).map((k) => [k, validarCampo(k)]);
    const errores = resultados.filter(([, ok]) => !ok).map(([k]) => k);

    if (errores.length) {
      cajaErrores.classList.remove('d-none');
      cajaErrores.innerHTML = [
        `<strong>Revisa los campos:</strong>`,
        (errores.includes('nombre') ? '• Nombre: solo letras y espacios (3-40).<br>' : ''),
        (errores.includes('apellidos') ? '• Apellidos: solo letras y espacios (4-60).<br>' : ''),
        (errores.includes('telefono') ? '• Teléfono: exactamente 9 dígitos.<br>' : ''),
        (errores.includes('email') ? '• Email: formato xxxxxx@xxxxx.xxx<br>' : '')
      ].join('');
      return;
    }

    cajaErrores.classList.add('d-none');
    alert('Formulario enviado correctamente (demo).'); // aquí harías el envío real
    form.reset();
    Object.values(campos).forEach((c) => {
      c.classList.remove('is-valid','is-invalid');
    });
  });

  form.addEventListener('reset', () => {
    cajaErrores.classList.add('d-none');
    Object.values(campos).forEach((c) => c.classList.remove('is-valid','is-invalid'));
  });

  // 3) Mapa dinámico con Leaflet (OpenStreetMap)
  // Fallback: MasterD Zaragoza (aprox.)
  const FALLBACK = { lat: 41.653, lng: -0.889, label: 'MasterD Zaragoza' };

  const mapa = L.map('mapaGalactico');
  const capa = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
  });
  capa.addTo(mapa);

  function setView(lat, lng, label) {
    mapa.setView([lat, lng], 13);
    L.marker([lat, lng]).addTo(mapa).bindPopup(label || 'Tu ubicación').openPopup();
  }

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setView(latitude, longitude, 'Estás aquí');
      },
      () => setView(FALLBACK.lat, FALLBACK.lng, FALLBACK.label),
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  } else {
    setView(FALLBACK.lat, FALLBACK.lng, FALLBACK.label);
  }
});