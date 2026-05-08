function generarCotizacion() {
  const texto = document.getElementById("inputKIU").value;

  const segmentos = extraerSegmentos(texto);
  const tipo = detectarTipo(segmentos);
  const equipaje = extraerEquipaje(texto);
  const total = extraerTotal(texto);

  const mensaje = generarMensaje(segmentos, tipo, equipaje, total);

  const el = document.getElementById("resultado");
  el.innerText = mensaje;
  el.classList.remove("placeholder");
}

function formatearCiudad(codigo) {
  const datos = ciudades[codigo];
  if (datos) {
    return `${datos.ciudad} (${codigo})`;
  }
  return codigo;
}

function formatearFecha(dia, mes, anioCorto) {
  const anio = 2000 + anioCorto;
  return `${dia} ${mes} ${anio}`;
}

function formatearFechaCompleta(dia, mes, anio) {
  const meses = {
    'JAN': 'enero', 'FEB': 'febrero', 'MAR': 'marzo',
    'APR': 'abril', 'MAY': 'mayo', 'JUN': 'junio',
    'JUL': 'julio', 'AUG': 'agosto', 'SEP': 'septiembre',
    'OCT': 'octubre', 'NOV': 'noviembre', 'DEC': 'diciembre'
  };
  const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  
  const mesNum = Object.keys(meses).indexOf(mes);
  const fecha = new Date(anio, mesNum, parseInt(dia));
  const diaSemana = diasSemana[fecha.getDay()];
  
  return `${diaSemana}, ${dia} de ${meses[mes]} de ${anio}`;
}

function calcularDuracionVuelo(salida, llegada) {
  const [h1, m1] = salida.split(':').map(Number);
  const [h2, m2] = llegada.split(':').map(Number);
  
  let minDiff = (h2 * 60 + m2) - (h1 * 60 + m1);
  if (minDiff < 0) minDiff += 24 * 60;
  
  const h = Math.floor(minDiff / 60);
  const m = minDiff % 60;
  
  if (h > 0 && m > 0) return `${h}h ${m}min`;
  if (h > 0) return `${h}h`;
  return `${m}min`;
}

function calcularDuracionTotal(segmentos) {
  const primeraSalida = segmentos[0].salida;
  const ultimaLlegada = segmentos[segmentos.length - 1].llegada;
  return calcularDuracionVuelo(primeraSalida, ultimaLlegada);
}

function extraerSegmentos(texto) {
  const segmentos = [];

  const patronBloque = /\*\*\s*KIU\s*AVAILABILITY\s*\*\*/i;
  const bloquesKIU = texto.split(patronBloque);

  for (let b = 1; b < bloquesKIU.length; b++) {
    const bloque = bloquesKIU[b];

    const tieneVuelos = bloque.match(/\d+\s+9R\s+\d+\s+[^\n]+\s+[A-Z]{3}\s+[A-Z]{3}\s+\d{2}:\d{2}\s+\d{2}:\d{2}/);
    const esBloqueSoloTotales = bloque.includes("TOTALS") && bloque.includes("FARE (IN COP)");

    if (esBloqueSoloTotales && !tieneVuelos) {
      continue;
    }

    const fechaMatch = bloque.match(/(MON|TUE|WED|THU|FRI|SAT|SUN)\s+(\d{2})([A-Z]{3})(\d{2})/);
    if (!fechaMatch) continue;

    const diaStr = fechaMatch[2];
    const mes = fechaMatch[3];
    const anioCorto = parseInt(fechaMatch[4]);
    const anio = 2000 + anioCorto;
    const fecha = formatearFecha(diaStr, mes, anioCorto);
    const dia = parseInt(diaStr);

    const todasRutas = bloque.match(/(?:^|\n)\s*\d*\s*9R\s+\d+\s+[^\n]+\s+([A-Z]{3})\s+([A-Z]{3})\s+\d{2}:\d{2}\s+\d{2}:\d{2}/gm);

    const rutasSS1 = bloque.match(/(?:^|\n)\s*\d+\s+9R[A-Z0-9]+\s+\d+[A-Z]{3}\s+[A-Z]{2}\s+([A-Z]{3})([A-Z]{3})\s+SS1\s+\d{4}\s+\d{4}/gm);

    if (rutasSS1 && rutasSS1.length > 0) {
      for (const ruta of rutasSS1) {
        const match = ruta.match(/\d+\s+9R[A-Z0-9]+\s+\d+[A-Z]{3}\s+[A-Z]{2}\s+([A-Z]{3})([A-Z]{3})\s+SS1\s+(\d{4})\s+(\d{4})/);
        if (match && /^[A-Z]{3}$/.test(match[1]) && /^[A-Z]{3}$/.test(match[2])) {
          const salida = match[3].substring(0, 2) + ":" + match[3].substring(2);
          const llegada = match[4].substring(0, 2) + ":" + match[4].substring(2);
          agregarSegmento(segmentos, match[1], match[2], salida, llegada, fecha, dia, mes, anio);
        }
      }
    } else if (todasRutas) {
      for (const ruta of todasRutas) {
        const match = ruta.match(/(?:^|\n)\s*\d+\s+9R\s+\d+\s+[^\n]+\s+([A-Z]{3})\s+([A-Z]{3})\s+(\d{2}:\d{2})\s+(\d{2}:\d{2})/);
        if (match && /^[A-Z]{3}$/.test(match[1]) && /^[A-Z]{3}$/.test(match[2])) {
          agregarSegmento(segmentos, match[1], match[2], match[3], match[4], fecha, dia, mes, anio);
        }
      }
    }
  }

  return segmentos;
}

function agregarSegmento(segmentos, origen, destino, salida, llegada, fecha, dia, mes, anio) {
  const seg = {
    origen,
    destino,
    origenCiudad: formatearCiudad(origen),
    destinoCiudad: formatearCiudad(destino),
    fecha,
    dia,
    mes,
    anio,
    salida,
    llegada
  };

  const existe = segmentos.some(
    (s) =>
      s.origen === seg.origen &&
      s.destino === seg.destino &&
      s.salida === seg.salida &&
      s.llegada === seg.llegada &&
      s.fecha === seg.fecha
  );

  if (!existe) {
    segmentos.push(seg);
  }
}

function detectarTipo(segmentos) {
  if (segmentos.length === 0) return "unico";
  if (segmentos.length === 1) return "unico";

  const primerFecha = `${segmentos[0].anio}-${segmentos[0].mes}-${segmentos[0].dia}`;
  let mismaFecha = true;

  for (let i = 1; i < segmentos.length; i++) {
    const fechaActual = `${segmentos[i].anio}-${segmentos[i].mes}-${segmentos[i].dia}`;
    if (fechaActual !== primerFecha) {
      mismaFecha = false;
      break;
    }
  }

  if (!mismaFecha) return "tramos";

  for (let i = 0; i < segmentos.length - 1; i++) {
    if (segmentos[i].destino !== segmentos[i + 1].origen) {
      return "tramos";
    }
  }

  return "conexion";
}

function extraerEquipaje(texto) {
  const todosEquipajes = texto.match(/(\d+)P\s+UP TO\s+([\d\.]+)(KG|K)/gi);

  if (!todosEquipajes || todosEquipajes.length === 0) {
    return { menorPeso: null, todos: [] };
  }

  const pesos = [];
  for (const e of todosEquipajes) {
    const match = e.match(/(\d+)P\s+UP TO\s+([\d\.]+)/);
    if (match) {
      pesos.push(parseFloat(match[2]));
    }
  }

  return {
    menorPeso: pesos.length > 0 ? Math.min(...pesos) : null,
    todos: pesos
  };
}

function extraerTotal(texto) {
  const totalMatch = texto.match(/TOTALS\s+\d+\s+(\d+)\s+(\d+)\s+\d+\s+(\d+)/);

  if (!totalMatch) return "";

  const total = parseInt(totalMatch[3]);
  const formatoCOP = new Intl.NumberFormat("es-CO");
  return formatoCOP.format(total);
}

function generarMensaje(segmentos, tipo, equipaje, total) {
  let msg = "";

  if (tipo === "unico" && segmentos.length === 1) {
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
    msg += `¿Me confirmas la reserva? 😊`;

  } else if (tipo === "conexion") {
    const primer = segmentos[0];
    const ultimo = segmentos[segmentos.length - 1];
    const numEscalas = segmentos.length - 1;

    msg = `✈️ *COTIZACIÓN DE VUELO*\n\n`;
    msg += `📍 *Ruta:* ${primer.origenCiudad} → ${ultimo.destinoCiudad}\n`;
    msg += `📅 *Fecha:* ${formatearFechaCompleta(primer.dia, primer.mes, primer.anio)}\n\n`;
    msg += `🕐 *Horario*\n`;
    segmentos.forEach((seg, i) => {
      msg += `• Tramo ${i+1}: ${seg.salida} → ${seg.llegada} (${calcularDuracionVuelo(seg.salida, seg.llegada)})\n`;
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
    msg += `¿Me confirmas la reserva? 😊`;

  } else if (tipo === "tramos") {
    msg = `✈️ *COTIZACIÓN DE VUELO*\n\n`;
    segmentos.forEach((seg, i) => {
      msg += `📍 *Tramo ${i+1}:* ${seg.origenCiudad} → ${seg.destinoCiudad}\n`;
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
    msg += `¿Me confirmas la reserva?`;
  }

  return msg;
}

function copiarTexto() {
  const texto = document.getElementById("resultado").innerText;
  if (texto === "Aquí aparecerá la cotización generada...") return;

  navigator.clipboard.writeText(texto).then(() => {
    const btn = document.querySelector(".btn-copy");
    const orig = btn.innerText;
    btn.innerText = "¡Copiado!";
    setTimeout(() => {
      btn.innerText = orig;
    }, 1800);
  });
}

const ciudades = {
  BOG: { ciudad: "Bogotá", aeropuerto: "Terminal Puente Aéreo" },
  EOH: { ciudad: "Medellín", aeropuerto: "Olaya Herrera" },
  CLO: { ciudad: "Cali", aeropuerto: "Alfonso Bonilla Aragón" },
  BAQ: { ciudad: "Barranquilla", aeropuerto: "Ernesto Cortissoz" },
  CTG: { ciudad: "Cartagena", aeropuerto: "Rafael Núñez" },
  BGA: { ciudad: "Bucaramanga", aeropuerto: "Palonegro" },
  ADZ: { ciudad: "San Andrés", aeropuerto: "Gustavo Rojas Pinilla" },
  VUP: { ciudad: "Valledupar", aeropuerto: "Alfonso López" },
  MTR: { ciudad: "Montería", aeropuerto: "Los Garzones" },
  VVC: { ciudad: "Villavicencio", aeropuerto: "Vanguardia" },
  NVA: { ciudad: "Neiva", aeropuerto: "Benito Salas" },
  CUC: { ciudad: "Cúcuta", aeropuerto: "Camilo Daza" },
  TCO: { ciudad: "Tumaco", aeropuerto: "La Florida" },
  IPI: { ciudad: "Ipiales", aeropuerto: "San Luis" },
  LET: { ciudad: "Leticia", aeropuerto: "Alfredo Vásquez Cobo" },
  PUU: { ciudad: "Puerto Asís", aeropuerto: "Tres de Mayo" },
  RCH: { ciudad: "Riohacha", aeropuerto: "Almirante Padilla" },
  PPN: { ciudad: "Popayán", aeropuerto: "Guillermo León Valencia" },
  UIB: { ciudad: "Quibdó", aeropuerto: "El Caraño" },
  PEI: { ciudad: "Pereira", aeropuerto: "Matecaña" },
  AXM: { ciudad: "Armenia", aeropuerto: "El Edén" },
  LMC: { ciudad: "La Macarena", aeropuerto: "La Macarena" },
  FLA: { ciudad: "Florencia", aeropuerto: "Gustavo Artunduaga" },
  YOP: { ciudad: "Yopal", aeropuerto: "El Alcaraván" },
  MVP: { ciudad: "Mitú", aeropuerto: "Fabio Alberto León Bentley" },
  SJE: { ciudad: "San José del Guaviare", aeropuerto: "Jorge Enrique González" },
  PDA: { ciudad: "Puerto Inírida", aeropuerto: "César Gaviria Trujillo" },
  PCR: { ciudad: "Puerto Carreño", aeropuerto: "Germán Olano" },
  PTX: { ciudad: "Pitalito", aeropuerto: "Contador" },
  GPI: { ciudad: "Guapí", aeropuerto: "Juan Casoman" },
  BSC: { ciudad: "Bahía Solano", aeropuerto: "José Celestino Mutis" },
  NQU: { ciudad: "Nuquí", aeropuerto: "Reyes Murillo" },
  APO: { ciudad: "Apartadó", aeropuerto: "Antonio Roldán Betancourt" },
  AUC: { ciudad: "Arauca", aeropuerto: "Santiago Pérez Quiroz" },
  RVE: { ciudad: "Saravena", aeropuerto: "Los Colonizadores" },
  TME: { ciudad: "Tame", aeropuerto: "Gabriel Vargas Santos" },
  SVI: { ciudad: "San Vicente del Caguán", aeropuerto: "Eduardo Falla Solano" },
  LQM: { ciudad: "Puerto Leguízamo", aeropuerto: "Caucaya" },
  VGZ: { ciudad: "Villagarzón", aeropuerto: "Villagarzón" },
  BUN: { ciudad: "Buenaventura", aeropuerto: "Gerardo Tobar López" },
  TLU: { ciudad: "Tolú", aeropuerto: "Golfo de Morrosquillo" },
  PVA: { ciudad: "Providencia", aeropuerto: "El Embrujo" },
  LCR: { ciudad: "La Chorrera", aeropuerto: "La Chorrera" },
  LPD: { ciudad: "La Pedrera", aeropuerto: "La Pedrera" },
  TCD: { ciudad: "Tarapacá", aeropuerto: "Ipiranga" },
  SMR: { ciudad: "Santa Marta", aeropuerto: "Simón Bolívar" },
  CZU: { ciudad: "Corozal", aeropuerto: "Las Brujas" },
  IBU: { ciudad: "Ibagué", aeropuerto: "Perales" },
  MDE: { ciudad: "Medellín", aeropuerto: "José María Córdova" },
  LPZ: { ciudad: "San Gil", aeropuerto: "San Gil" },
  OCV: { ciudad: "Ocaña", aeropuerto: "Ocaña" },
  RON: { ciudad: "Paipa", aeropuerto: "Paipa" },
  MTB: { ciudad: "Montelibano", aeropuerto: "Montelibano" },
  EBG: { ciudad: "El Bagre", aeropuerto: "El Bagre" },
  CAQ: { ciudad: "Caucasia", aeropuerto: "Caucasia" },
  COG: { ciudad: "Condoto", aeropuerto: "Mandinga" },
  TBD: { ciudad: "Timbiquí", aeropuerto: "Timbiquí" },
  MMP: { ciudad: "Mompox", aeropuerto: "San Bernardo" },
  ACR: { ciudad: "Araracuara", aeropuerto: "Araracuara" },
  HAY: { ciudad: "Aguachica", aeropuerto: "Aguachica" },
  ACD: { ciudad: "Acandí", aeropuerto: "Acandí" },
  TIB: { ciudad: "Tibú", aeropuerto: "Tibú" },
  ECR: { ciudad: "El Charco", aeropuerto: "El Charco" }
};