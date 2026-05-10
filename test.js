import { extraerSegmentos, detectarTipo, extraerEquipaje, extraerTotal, extraerPasajeros } from './js/parser.js';
import { generarMensaje } from './js/formatter.js';

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
                   K9 L9 P8 M4 N4 QC TC VC D2 X1 
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

function generarCotizacion(texto) {
  const segmentos = extraerSegmentos(texto);
  const tipo = detectarTipo(segmentos);
  const equipaje = extraerEquipaje(texto);
  const total = extraerTotal(texto);
  const pasajeros = extraerPasajeros(texto);

  return {
    segmentos,
    tipo,
    equipaje,
    total,
    pasajeros,
    mensaje: generarMensaje(segmentos, tipo, equipaje, total, pasajeros),
  };
}

function formatearCOP(num) {
  return new Intl.NumberFormat('es-CO').format(num);
}

function ejecutarPrueba(numero, nombre, input) {
  console.log('');
  console.log('='.repeat(60));
  console.log(`PRUEBA ${numero}: ${nombre}`);
  console.log('='.repeat(60));
  const resultado = generarCotizacion(input);
  console.log('Segmentos encontrados:', resultado.segmentos.length);
  console.log('Tipo:', resultado.tipo);
  console.log('Pasajeros:', resultado.pasajeros);
  if (resultado.segmentos.length > 0) {
    resultado.segmentos.forEach((s, i) => {
      console.log(
        `  Tramo ${i + 1}: ${s.origen} → ${s.destino} ${s.salida}-${s.llegada} (${s.fecha})`,
      );
    });
  }
  console.log('Equipaje menor peso:', resultado.equipaje.menorPeso, 'kg');
  console.log('Total:', formatearCOP(resultado.total));
  console.log('');
  console.log('MENSAJE:');
  console.log(resultado.mensaje);

  // Validaciones básicas
  const checks = [];
  checks.push(resultado.segmentos.length > 0 ? '✓ Segmentos detectados' : '✗ Sin segmentos');
  checks.push(resultado.total > 0 ? '✓ Total extraído' : '✗ Total no extraído');
  checks.push(resultado.pasajeros > 0 ? '✓ Pasajeros extraídos' : '✗ Pasajeros no extraídos');
  checks.push(resultado.mensaje.includes('COTIZACIÓN') ? '✓ Mensaje generado' : '✗ Mensaje vacío');
  console.log('');
  checks.forEach((c) => console.log(`  ${c}`));
}

const input5 = `** KIU AVAILABILITY ** TO EOH/MEDELLIN, CO             WED 13MAY26
   1   9R    8840  Y5 B2 K1 M1 QC TC VC  LPZ   EOH     08:45   10:05   N   0 DH6 3    01:20
                   D1 X1 O1 
 1* MORE CARRIER DISPLAY
03Y1
    1   9R8840Y 13MAY WE LPZEOH SS3  0845 1005
WS
FARE NOT GUARANTEED UNTIL TICKETED

     PASSENGER           TYPE       FARE (IN COP)          TAX        FEE       PER PSGR
  1. NO NAME ( 3)         ADT             1260000       272400          0        1532400
                   TOTALS   3             1260000       272400          0        1532400

BAGGAGE ALLOWANCE
ADT
 9R    LPZMDE        2P  UP TO 10.00K


FARED: LPZ009RJV 1449/10MAY26 # WS`;

ejecutarPrueba(1, 'ONE WAY (EOH → LPZ)', input1);
ejecutarPrueba(2, 'ROUND TRIP (EOH → LPZ + LPZ → EOH)', input2);
ejecutarPrueba(3, 'MÚLTIPLES TRAYECTOS (3 TRAMOS)', input3);
ejecutarPrueba(4, 'VUELO EN CONEXIÓN (LPZ → EOH → BOG)', input4);
ejecutarPrueba(5, '3 PASAJEROS', input5);

console.log('');
console.log('✓ TODAS LAS PRUEBAS COMPLETADAS');
