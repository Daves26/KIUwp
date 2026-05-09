import { formatearCiudad, formatearFecha } from './formatter.js';

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function extraerSegmentos(texto, airlineCode) {
  const segmentos = [];
  const code = escapeRegex(airlineCode || '9R');

  const patronBloque = /\*\s*KIU\s*AVAILABILITY\s*\*/i;
  const bloquesKIU = texto.split(patronBloque);

  for (let b = 1; b < bloquesKIU.length; b++) {
    const bloque = bloquesKIU[b];

    const vueloRegex = new RegExp(
      `\\d+\\s+${code}\\s+\\d+\\s+[^\\n]+\\s+[A-Z]{3}\\s+[A-Z]{3}\\s+\\d{2}:\\d{2}\\s+\\d{2}:\\d{2}`,
    );
    const tieneVuelos = bloque.match(vueloRegex);
    const esBloqueSoloTotales = bloque.includes('TOTALS') && bloque.includes('FARE (IN COP)');

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

    const rutasStdRegex = new RegExp(
      `(?:^|\\n)\\s*\\d*\\s*${code}\\s+\\d+\\s+[^\\n]+\\s+([A-Z]{3})\\s+([A-Z]{3})\\s+\\d{2}:\\d{2}\\s+\\d{2}:\\d{2}`,
      'gm',
    );
    const todasRutas = bloque.match(rutasStdRegex);

    const rutasSS1Regex = new RegExp(
      `(?:^|\\n)\\s*\\d+\\s+${code}[A-Z0-9]+\\s+\\d+[A-Z]{3}\\s+[A-Z]{2}\\s+([A-Z]{3})([A-Z]{3})\\s+SS1\\s+\\d{4}\\s+\\d{4}`,
      'gm',
    );
    const rutasSS1 = bloque.match(rutasSS1Regex);

    if (rutasSS1 && rutasSS1.length > 0) {
      const ss1MatchRegex = new RegExp(
        `\\d+\\s+${code}[A-Z0-9]+\\s+\\d+[A-Z]{3}\\s+[A-Z]{2}\\s+([A-Z]{3})([A-Z]{3})\\s+SS1\\s+(\\d{4})\\s+(\\d{4})`,
      );
      for (const ruta of rutasSS1) {
        const match = ruta.match(ss1MatchRegex);
        if (match && /^[A-Z]{3}$/.test(match[1]) && /^[A-Z]{3}$/.test(match[2])) {
          const salida = match[3].substring(0, 2) + ':' + match[3].substring(2);
          const llegada = match[4].substring(0, 2) + ':' + match[4].substring(2);
          agregarSegmento(segmentos, match[1], match[2], salida, llegada, fecha, dia, mes, anio);
        }
      }
    } else if (todasRutas) {
      const rutaMatchRegex = new RegExp(
        `(?:^|\\n)\\s*\\d+\\s+${code}\\s+\\d+\\s+[^\\n]+\\s+([A-Z]{3})\\s+([A-Z]{3})\\s+(\\d{2}:\\d{2})\\s+(\\d{2}:\\d{2})`,
      );
      for (const ruta of todasRutas) {
        const match = ruta.match(rutaMatchRegex);
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
    llegada,
  };

  const existe = segmentos.some(
    (s) =>
      s.origen === seg.origen &&
      s.destino === seg.destino &&
      s.salida === seg.salida &&
      s.llegada === seg.llegada &&
      s.fecha === seg.fecha,
  );

  if (!existe) {
    segmentos.push(seg);
  }
}

export function detectarTipo(segmentos) {
  if (segmentos.length <= 1) return 'unico';

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

export function extraerEquipaje(texto) {
  const todosEquipajes = texto.match(/(\d+)P\s+UP TO\s+([\d.]+)(KG|K)/gi);

  if (!todosEquipajes || todosEquipajes.length === 0) {
    return { menorPeso: null, todos: [] };
  }

  const pesos = [];
  for (const e of todosEquipajes) {
    const match = e.match(/(\d+)P\s+UP TO\s+([\d.]+)/);
    if (match) {
      pesos.push(parseFloat(match[2]));
    }
  }

  return {
    menorPeso: pesos.length > 0 ? Math.min(...pesos) : null,
    todos: pesos,
  };
}

export function extraerTotal(texto) {
  const totalMatch = texto.match(/TOTALS\s+\d+\s+(\d+)\s+(\d+)\s+\d+\s+(\d+)/);
  if (!totalMatch) return 0;
  return parseInt(totalMatch[3]);
}
