// Script de prueba para verificar el cotizador KIU

const input1 = `** KIU AVAILABILITY ** TO LPZ/SAN GIL, CO              MON 25MAY26
   1   9R    8839  Y9 B8 K6 M5 Q3 T2 VC  EOH   LPZ     07:25   08:55   N   0 DH6 1    01:30
                   D1 X2 O2 
 1* MORE CARRIER DISPLAY
01T1
  1   9R8839T 25MAY MO EOHLPZ SS1  0725 0855
WS
FARE NOT GUARANTEED UNTIL TICKETED

     PASSENGER           TYPE       FARE (IN COP)          TAX        FEE       PER PSGR
  1. NO NAME ( 1)         ADT              270000        82700          0         352700
                   TOTALS   1              270000        82700          0         352700

BAGGAGE ALLOWANCE
ADT
 9R    MDELPZ        2P  UP TO 10.00K


FARED: LPZ009RJV 1256/08MAY26`;

const input2 = `** KIU AVAILABILITY ** TO LPZ/SAN GIL, CO              MON 25MAY26
   1   9R    8839  Y9 B8 K6 M5 Q3 T2 VC  EOH   LPZ     07:25   08:55   N   0 DH6 1    01:30
                   D1 X2 O2 
 1* MORE CARRIER DISPLAY
01T1
  1   9R8839T 25MAY MO EOHLPZ SS1  0725 0855
127MAYLPZEOH
** KIU AVAILABILITY ** TO EOH/MEDELLIN, CO             WED 27MAY26
   1   9R    8840  Y9 B7 K5 M4 Q2 T1 V1  LPZ   EOH     11:20   12:40   N   0 DH6 3    01:20
                   D1 X1 O1 
 1* MORE CARRIER DISPLAY
01V1
  2   9R8840V 27MAY WE LPZEOH SS1  1120 1240
WS
FARE NOT GUARANTEED UNTIL TICKETED

     PASSENGER           TYPE       FARE (IN COP)          TAX        FEE       PER PSGR
  1. NO NAME ( 1)         ADT              480000       133600          0         613600
                   TOTALS   1              480000       133600          0         613600

BAGGAGE ALLOWANCE
ADT
 9R    MDELPZ        2P  UP TO 10.00K
 9R    LPZMDE        2P  UP TO 10.00K


FARED: LPZ009RJV 1310/08MAY26`;

const input3 = `** KIU AVAILABILITY ** TO LPZ/SAN GIL, CO              MON 25MAY26
   1   9R    8839  Y9 B8 K6 M5 Q3 T2 VC  EOH   LPZ     07:25   08:55   N   0 DH6 1    01:30
                   D1 X2 O2 
 1* MORE CARRIER DISPLAY
01T1
  1   9R8839T 25MAY MO EOHLPZ SS1  0725 0855
127MAYLPZEOH
** KIU AVAILABILITY ** TO EOH/MEDELLIN, CO             WED 27MAY26
   1   9R    8840  Y9 B7 K5 M4 Q2 T1 V1  LPZ   EOH     11:20   12:40   N   0 DH6 3    01:20
                   D1 X1 O1 
 1* MORE CARRIER DISPLAY
01V1
  2   9R8840V 27MAY WE LPZEOH SS1  1120 1240
128MAYEOHBOG
** KIU AVAILABILITY ** TO BOG/BOGOTA, CO               THU 28MAY26
   1   9R    8601  Y9 S9 W9 B9 F9 H9 I9  EOH   BOG     05:58   07:10   N   0 AT5 4    01:12
                   K9 L9 P7 M4 N1 QC TC VC D2 X1 
   2   9R    8605  Y9 S9 W9 B9 F9 H9 I9  EOH   BOG     14:06   15:19   N   0 AT7 4    01:13
                   K9 L9 P9 M6 N4 Q2 TC VC D2 X2 
   3   9R    8766  Y9 S9 W9 B9 F9 H9 I9  EOH   BOG     15:53   17:05   N   0 AT5 4    01:12
                   K9 L9 P9 M9 N7 Q4 T2 VC D2 X2 
   4   9R    8619  Y9 S9 W9 B9 F9 H9 I9  EOH   BOG     17:08   18:21   N   0 AT7 4    01:13
                   K9 L9 P9 M9 N7 Q4 T1 VC D2 X2 
 1* MORE CARRIER DISPLAY
01W1
  3   9R8601W 28MAY TH EOHBOG SS1  0558 0710
WS
FARE NOT GUARANTEED UNTIL TICKETED

     PASSENGER           TYPE       FARE (IN COP)          TAX        FEE       PER PSGR
  1. NO NAME ( 1)         ADT              940000       252400          0        1192400
                   TOTALS   1              940000       252400          0        1192400

BAGGAGE ALLOWANCE
ADT
 9R    MDELPZ        2P  UP TO 10.00K
 9R    LPZMDE        2P  UP TO 10.00K
 9R    MDEBOG        2P  UP TO 20.00K


FARED: LPZ009RJV 1313/08MAY26`;

const input4 = `** KIU AVAILABILITY ** TO BOG/BOGOTA, CO               WED 27MAY26
   1   9R    8840  Y9 B6 K4 M3 Q1 TC VC  LPZ   EOH     11:20   12:40   N   0 DH6 3    01:20
                   D1 X1 O1 
       9R    8605  Y9 S9 W9 B9 F9 H9 I9  EOH   BOG     15:43   16:55   N   0 AT5 3    01:12 >5:35
                   K9 L9 P9 M8 N5 Q2 TC VC D2 X2 
   2   9R    8840  Y9 B6 K4 M3 Q1 TC VC  LPZ   EOH     11:20   12:40   N   0 DH6 3    01:20
                   D1 X1 O1 
       9R    8619  Y9 S9 W9 B9 F9 H9 I9  EOH   BOG     17:08   18:20   N   0 AT5 3    01:12 >7:00
                   K9 L9 P9 M8 N4 QC TC VC D2 X1 
 1* MORE CARRIER DISPLAY
01Y1
  1   9R8840Y 27MAY WE LPZEOH SS1  1120 1240
  2   9R8605Y 27MAY WE EOHBOG SS1  1543 1655
WS
FARE NOT GUARANTEED UNTIL TICKETED

     PASSENGER           TYPE       FARE (IN COP)          TAX        FEE       PER PSGR
  1. NO NAME ( 1)         ADT              570000       119300          0         689300
                   TOTALS   1              570000       119300          0         689300

BAGGAGE ALLOWANCE
ADT
 9R    LPZMDE        2P  UP TO 10.00K
 9R    MDEBOG        2P  UP TO 20.00K


FARED: LPZ009RJV 1314/08MAY26`;

// MAPA: códigos IATA a ciudades y aeropuertos
const ciudades = {
  "BOG": { "ciudad": "Bogotá", "aeropuerto": "Terminal Puente Aéreo" },
  "EOH": { "ciudad": "Medellín", "aeropuerto": "Olaya Herrera" },
  "MDE": { "ciudad": "Medellín", "aeropuerto": "José María Córdova" },
  "LPZ": { "ciudad": "San Gil", "aeropuerto": "San Gil" }
};

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

function calcularTiempoConexion(llegada, salida) {
  return calcularDuracionVuelo(llegada, salida);
}

function extraerSegmentos(texto) {
  const segmentos = [];
  
  // Dividir por ** KIU AVAILABILITY ** para procesar cada bloque de disponibilidad
  const patronBloque = /\*\*\s*KIU\s*AVAILABILITY\s*\*\*/i;
  const bloquesKIU = texto.split(patronBloque);
  
  for (let b = 1; b < bloquesKIU.length; b++) {
    const bloque = bloquesKIU[b];
    
    // Para bloques con TOTALS/BAGGAGE, solo procesar si hay información de vuelos
    // (los bloques de totales vienen al final y tienen formato diferente)
    const tieneVuelos = bloque.match(/\d+\s+9R\s+\d+\s+[^\n]+\s+[A-Z]{3}\s+[A-Z]{3}\s+\d{2}:\d{2}\s+\d{2}:\d{2}/);
    const esBloqueSoloTotales = bloque.includes('TOTALS') && bloque.includes('FARE (IN COP)');
    
    if (esBloqueSoloTotales && !tieneVuelos) {
      continue;
    }
    
    // Buscar la fecha en el bloque
    const fechaMatch = bloque.match(/(MON|TUE|WED|THU|FRI|SAT|SUN)\s+(\d{2})([A-Z]{3})(\d{2})/);
    if (!fechaMatch) continue;
    
    const diaStr = fechaMatch[2];
    const mes = fechaMatch[3];
    const anioCorto = parseInt(fechaMatch[4]);
    const anio = 2000 + anioCorto;
    const fecha = formatearFecha(diaStr, mes, anioCorto);
    const dia = parseInt(diaStr);
    
    // Extraer rutas del bloque (formato principal: número, 9R, clase, origen, destino, horas)
    const todasRutas = bloque.match(/(?:^|\n)\s*\d*\s*9R\s+\d+\s+[^\n]+\s+([A-Z]{3})\s+([A-Z]{3})\s+\d{2}:\d{2}\s+\d{2}:\d{2}/gm);
    
    // Formato SS1: XX   9R8839T 25MAY MO EOHLPZ SS1  0725 0855
const rutasSS1 = bloque.match(/(?:^|\n)\s*\d+\s+9R[A-Z0-9]+\s+\d+[A-Z]{3}\s+[A-Z]{2}\s+([A-Z]{3})([A-Z]{3})\s+SS1\s+\d{4}\s+\d{4}/gm);
    
    if (rutasSS1 && rutasSS1.length > 0) {
      for (const ruta of rutasSS1) {
        const match = ruta.match(/\d+\s+9R[A-Z0-9]+\s+\d+[A-Z]{3}\s+[A-Z]{2}\s+([A-Z]{3})([A-Z]{3})\s+SS1\s+(\d{4})\s+(\d{4})/);
        if (match && /^[A-Z]{3}$/.test(match[1]) && /^[A-Z]{3}$/.test(match[2])) {
          const salida = match[3].substring(0,2) + ':' + match[3].substring(2);
          const llegada = match[4].substring(0,2) + ':' + match[4].substring(2);
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
  
  const existe = segmentos.some(s => 
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
  if (segmentos.length === 0) return 'unico';
  if (segmentos.length === 1) return 'unico';

  const primerFecha = `${segmentos[0].anio}-${segmentos[0].mes}-${segmentos[0].dia}`;
  let mismaFecha = true;

  for (let i = 1; i < segmentos.length; i++) {
    const fechaActual = `${segmentos[i].anio}-${segmentos[i].mes}-${segmentos[i].dia}`;
    if (fechaActual !== primerFecha) {
      mismaFecha = false;
      break;
    }
  }

  if (!mismaFecha) return 'tramos';

  for (let i = 0; i < segmentos.length - 1; i++) {
    if (segmentos[i].destino !== segmentos[i + 1].origen) {
      return 'tramos';
    }
  }

  return 'conexion';
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
  const formatoCOP = new Intl.NumberFormat('es-CO');
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
    msg += `¿Me confirmas la reserva? 😊`;
  }

  return msg;
}

function generarCotizacion(texto) {
  const segmentos = extraerSegmentos(texto);
  const tipo = detectarTipo(segmentos);
  const equipaje = extraerEquipaje(texto);
  const total = extraerTotal(texto);
  
  return {
    segmentos,
    tipo,
    equipaje,
    total,
    mensaje: generarMensaje(segmentos, tipo, equipaje, total)
  };
}

// EJECUTAR PRUEBAS
console.log('='.repeat(60));
console.log('PRUEBA 1: ONE WAY (EOH → LPZ)');
console.log('='.repeat(60));
const resultado1 = generarCotizacion(input1);
console.log('Segmentos encontrados:', resultado1.segmentos.length);
console.log('Tipo:', resultado1.tipo);
console.log('Equipaje:', resultado1.equipaje);
console.log('Total:', resultado1.total);
console.log('\nMENSAJE:\n');
console.log(resultado1.mensaje);

console.log('\n' + '='.repeat(60));
console.log('PRUEBA 2: ROUND TRIP (EOH → LPZ + LPZ → EOH)');
console.log('='.repeat(60));
const resultado2 = generarCotizacion(input2);
console.log('Segmentos encontrados:', resultado2.segmentos.length);
console.log('Tipo:', resultado2.tipo);
console.log('Equipaje:', resultado2.equipaje);
console.log('Total:', resultado2.total);
console.log('\nMENSAJE:\n');
console.log(resultado2.mensaje);

console.log('\n' + '='.repeat(60));
console.log('PRUEBA 3: MÚLTIPLES TRAYECTOS (3 TRAMOS)');
console.log('='.repeat(60));
const resultado3 = generarCotizacion(input3);
console.log('Segmentos encontrados:', resultado3.segmentos.length);
console.log('Tipo:', resultado3.tipo);
console.log('Equipaje:', resultado3.equipaje);
console.log('Total:', resultado3.total);
console.log('\nMENSAJE:\n');
console.log(resultado3.mensaje);

console.log('\n' + '='.repeat(60));
console.log('PRUEBA 4: VUELO EN CONEXIÓN (LPZ → EOH → BOG)');
console.log('='.repeat(60));
const resultado4 = generarCotizacion(input4);
console.log('Segmentos encontrados:', resultado4.segmentos.length);
console.log('Tipo:', resultado4.tipo);
console.log('Equipaje:', resultado4.equipaje);
console.log('Total:', resultado4.total);
console.log('\nMENSAJE:\n');
console.log(resultado4.mensaje);

console.log('\n✓ TODAS LAS PRUEBAS COMPLETADAS');