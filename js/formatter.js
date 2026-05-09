import ciudades from './airports.js';

export function formatearCiudad(codigo) {
  const datos = ciudades[codigo];
  return datos ? `${datos.ciudad} (${codigo})` : codigo;
}

export function formatearFecha(dia, mes, anioCorto) {
  return `${dia} ${mes} ${2000 + anioCorto}`;
}

export function formatearFechaCompleta(dia, mes, anio) {
  const meses = {
    JAN: 0,
    FEB: 1,
    MAR: 2,
    APR: 3,
    MAY: 4,
    JUN: 5,
    JUL: 6,
    AUG: 7,
    SEP: 8,
    OCT: 9,
    NOV: 10,
    DEC: 11,
  };
  const fecha = new Date(anio, meses[mes], parseInt(dia));
  return fecha.toLocaleDateString('es-CO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function calcularDuracionVuelo(salida, llegada) {
  const [h1, m1] = salida.split(':').map(Number);
  const [h2, m2] = llegada.split(':').map(Number);

  let minDiff = h2 * 60 + m2 - (h1 * 60 + m1);
  if (minDiff < 0) minDiff += 24 * 60;

  const h = Math.floor(minDiff / 60);
  const m = minDiff % 60;

  if (h > 0 && m > 0) return `${h}h ${m}min`;
  if (h > 0) return `${h}h`;
  return `${m}min`;
}

export function calcularDuracionTotal(segmentos) {
  const primeraSalida = segmentos[0].salida;
  const ultimaLlegada = segmentos[segmentos.length - 1].llegada;
  return calcularDuracionVuelo(primeraSalida, ultimaLlegada);
}

export function generarMensaje(segmentos, tipo, equipaje, totalNumerico) {
  const formatoCOP = new Intl.NumberFormat('es-CO');
  const total = formatoCOP.format(totalNumerico);
  let msg = '';

  if (tipo === 'unico' && segmentos.length === 1) {
    const seg = segmentos[0];
    msg = `✈️ *COTIZACIÓN DE VUELO*\n\n`;
    msg += `📍 *Ruta:* ${seg.origenCiudad} → ${seg.destinoCiudad}\n`;
    msg += `📅 *Fecha:* ${formatearFechaCompleta(seg.dia, seg.mes, seg.anio)}\n\n`;
    msg += `🕐 *Horario*\n`;
    msg += `• Sale: ${seg.salida} (${seg.origen})\n`;
    msg += `• Llega: ${seg.llegada} (${seg.destino})\n`;
    msg += `• Duración: ${calcularDuracionVuelo(seg.salida, seg.llegada)} — vuelo directo\n\n`;
    msg += `🧳 *Equipaje incluido*\n`;
    if (equipaje.menorPeso) {
      msg += `• Bodega: hasta ${equipaje.menorPeso} kg\n`;
    }
    msg += `• Artículo personal: hasta 5 kg\n\n`;
    msg += `💰 *Total por persona*\n`;
    msg += `*$${total} COP*\n`;
    msg += `_(incluye tasas e impuestos)_\n\n`;
    msg += `⚠️ _Tarifa sujeta a cambios y disponibilidad al momento de emitir._\n\n`;
    msg += `¿Confirmas la reserva?`;
  } else if (tipo === 'conexion') {
    const primer = segmentos[0];
    const ultimo = segmentos[segmentos.length - 1];

    msg = `✈️ *COTIZACIÓN DE VUELO*\n\n`;
    msg += `📍 *Ruta:* ${primer.origenCiudad} → ${ultimo.destinoCiudad}\n`;
    msg += `📅 *Fecha:* ${formatearFechaCompleta(primer.dia, primer.mes, primer.anio)}\n\n`;
    msg += `🕐 *Horario*\n`;
    segmentos.forEach((seg, i) => {
      msg += `• Tramo ${i + 1}: ${seg.salida} → ${seg.llegada} (${calcularDuracionVuelo(seg.salida, seg.llegada)})\n`;
    });
    msg += `• Duración total: ${calcularDuracionTotal(segmentos)} — vuelo con conexión\n\n`;
    msg += `🧳 *Equipaje incluido*\n`;
    if (equipaje.menorPeso) {
      msg += `• Bodega: hasta ${equipaje.menorPeso} kg\n`;
    }
    msg += `• Artículo personal: hasta 5 kg\n\n`;
    msg += `💰 *Total por persona*\n`;
    msg += `*$${total} COP*\n`;
    msg += `_(incluye tasas e impuestos)_\n\n`;
    msg += `⚠️ _Tarifa sujeta a cambios y disponibilidad al momento de emitir._\n\n`;
    msg += `¿Confirmas la reserva?`;
  } else if (tipo === 'tramos') {
    msg = `✈️ *COTIZACIÓN DE VUELO*\n\n`;
    segmentos.forEach((seg, i) => {
      msg += `📍 *Tramo ${i + 1}:* ${seg.origenCiudad} → ${seg.destinoCiudad}\n`;
      msg += `📅 *Fecha:* ${formatearFechaCompleta(seg.dia, seg.mes, seg.anio)}\n`;
      msg += `🕐 ${seg.salida} - ${seg.llegada} (${calcularDuracionVuelo(seg.salida, seg.llegada)})\n\n`;
    });
    msg += `🧳 *Equipaje incluido*\n`;
    if (equipaje.menorPeso) {
      msg += `• Bodega: hasta ${equipaje.menorPeso} kg\n`;
    }
    msg += `• Artículo personal: hasta 5 kg\n\n`;
    msg += `💰 *Total por persona*\n`;
    msg += `*$${total} COP*\n`;
    msg += `_(incluye tasas e impuestos)_\n\n`;
    msg += `⚠️ _Tarifa sujeta a cambios y disponibilidad al momento de emitir._\n\n`;
    msg += `¿Confirmas la reserva?`;
  }

  return msg;
}
