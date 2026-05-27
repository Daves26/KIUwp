import {
  extraerSegmentos,
  detectarTipo,
  extraerEquipaje,
  extraerTotal,
  extraerPasajeros,
} from './parser.js';
import { generarMensaje } from './formatter.js';
import {
  cargarConfiguracion,
  guardarConfiguracion,
  obtenerTA,
  abrirConfiguracion,
  cerrarConfiguracion,
} from './config.js';

function generarCotizacion() {
  const texto = document.getElementById('inputKIU').value;
  const resultado = document.getElementById('resultado');

  if (!texto.trim()) {
    resultado.innerText = 'Por favor pega el texto de KIU primero';
    resultado.className = 'sh-result error';
    return;
  }

  const config = cargarConfiguracion();
  const segmentos = extraerSegmentos(texto);

  if (segmentos.length === 0) {
    resultado.innerText =
      'No se pudieron detectar vuelos en el texto. Verifica que copiaste desde KIU.';
    resultado.className = 'sh-result error';
    return;
  }

  const tipo = detectarTipo(segmentos);
  const equipaje = extraerEquipaje(texto);
  const totalNeto = extraerTotal(texto);
  const pasajeros = extraerPasajeros(texto);

  if (totalNeto === 0) {
    resultado.innerText =
      'No se pudo extraer el total. Verifica que el texto incluya la línea de TOTALS.';
    resultado.className = 'sh-result error';
    return;
  }

  const ta = obtenerTA(tipo, config);
  const totalConTA = totalNeto + ta * pasajeros;
  const mensaje = generarMensaje(segmentos, tipo, equipaje, totalConTA, pasajeros);

  resultado.innerText = mensaje;
  resultado.className = 'sh-result success';
}

function copiarTexto() {
  const texto = document.getElementById('resultado').innerText;
  if (!texto || texto.startsWith('No') || texto.startsWith('Por')) return;

  navigator.clipboard.writeText(texto).then(() => {
    const btn = document.querySelector('.btn-copy');
    const orig = btn.innerText;
    btn.innerText = '¡Copiado!';
    btn.disabled = true;
    setTimeout(() => {
      btn.innerText = orig;
      btn.disabled = false;
    }, 1800);
  });
}

function limpiarTexto() {
  document.getElementById('inputKIU').value = '';
  const resultado = document.getElementById('resultado');
  resultado.innerText = 'Aquí aparecerá la cotización generada...';
  resultado.className = 'sh-result placeholder';
  document.getElementById('inputKIU').focus();
}

function toggleAyudaTeclado() {
  const help = document.getElementById('keyboardHelp');
  const isActive = help.classList.contains('active');
  if (isActive) {
    help.classList.remove('active');
  } else {
    help.classList.add('active');
    document.getElementById('btnCerrarAyuda').focus();
  }
}

function toggleDarkMode() {
  const html = document.documentElement;
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('kiuwpTheme', next);
}

function cargarTema() {
  const saved = localStorage.getItem('kiuwpTheme');
  if (saved) {
    document.documentElement.setAttribute('data-theme', saved);
    return;
  }
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
}

function registrarSW() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {
      // SW registration failed — app works fine without it
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btnConfig').addEventListener('click', abrirConfiguracion);
  document.getElementById('btnCerrarConfig').addEventListener('click', cerrarConfiguracion);
  document.getElementById('btnGuardarConfig').addEventListener('click', () => {
    guardarConfiguracion();
    const texto = document.getElementById('inputKIU').value.trim();
    if (texto) {
      generarCotizacion();
    }
  });
  document.getElementById('configModal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('configModal')) {
      cerrarConfiguracion();
    }
  });

  document.getElementById('btnGenerar').addEventListener('click', generarCotizacion);
  document.getElementById('btnCopiar').addEventListener('click', copiarTexto);
  document.getElementById('btnAyuda').addEventListener('click', toggleAyudaTeclado);
  document.getElementById('btnCerrarAyuda').addEventListener('click', toggleAyudaTeclado);
  document.getElementById('keyboardHelp').addEventListener('click', (e) => {
    if (e.target === document.getElementById('keyboardHelp')) {
      toggleAyudaTeclado();
    }
  });

  document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('configModal');
    const helpModal = document.getElementById('keyboardHelp');
    const textarea = document.getElementById('inputKIU');
    const target = e.target;
    const mod = e.ctrlKey || e.metaKey;

    if (e.key === 'Escape') {
      if (modal.classList.contains('active')) {
        cerrarConfiguracion();
        return;
      }
      if (helpModal.classList.contains('active')) {
        toggleAyudaTeclado();
        return;
      }
      if (target === textarea) {
        textarea.blur();
      }
      return;
    }

    if (modal.classList.contains('active') || helpModal.classList.contains('active')) {
      return;
    }

    if (mod && e.key === 'Enter') {
      e.preventDefault();
      generarCotizacion();
      return;
    }

    if (mod && e.shiftKey && (e.key === 'X' || e.key === 'x')) {
      e.preventDefault();
      limpiarTexto();
      return;
    }

    if (e.key === '?' && !mod && !e.altKey) {
      if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        toggleAyudaTeclado();
        return;
      }
    }

    if (e.key === '/' && !mod && !e.altKey) {
      if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        textarea.focus();
        return;
      }
    }
  });

  document.getElementById('btnDarkMode').addEventListener('click', toggleDarkMode);

  cargarTema();
  registrarSW();
});

window.generarCotizacion = generarCotizacion;
window.copiarTexto = copiarTexto;
window.limpiarTexto = limpiarTexto;
window.toggleAyudaTeclado = toggleAyudaTeclado;
