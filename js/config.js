const STORAGE_KEY = 'kiuwpConfig';

const DEFAULTS = {
  taOneWay: 30700,
  taRoundTrip: 49750,
};

export function cargarConfiguracion() {
  try {
    const guardados = localStorage.getItem(STORAGE_KEY);
    if (guardados) {
      return { ...DEFAULTS, ...JSON.parse(guardados) };
    }
  } catch {
    // fall through to defaults
  }
  return { ...DEFAULTS };
}

export function guardarConfiguracion() {
  const taOneWay = parseInt(document.getElementById('taOneWay').value) || 0;
  const taRoundTrip = parseInt(document.getElementById('taRoundTrip').value) || 0;
  const config = { taOneWay, taRoundTrip };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  document.getElementById('configModal').classList.remove('active');
  return config;
}

export function obtenerTA(tipo, config) {
  return tipo === 'unico' ? config.taOneWay : config.taRoundTrip;
}

export function abrirConfiguracion() {
  const config = cargarConfiguracion();
  document.getElementById('taOneWay').value = config.taOneWay;
  document.getElementById('taRoundTrip').value = config.taRoundTrip;
  document.getElementById('configModal').classList.add('active');
  setTimeout(() => document.getElementById('taOneWay').focus(), 100);
}

export function cerrarConfiguracion() {
  document.getElementById('configModal').classList.remove('active');
}
