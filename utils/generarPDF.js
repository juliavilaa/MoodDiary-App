import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

export const generarYCompartirPDF = async ({ registros, usuario }) => {

  // Calcular estadísticas
  const total = registros.length;
  const conteo = {};
  registros.forEach(r => {
    conteo[r.emocion] = (conteo[r.emocion] || 0) + 1;
  });

  const emociones = Object.entries(conteo)
    .map(([nombre, cant]) => ({
      nombre,
      cant,
      pct: total > 0 ? Math.round((cant / total) * 100) : 0,
    }))
    .sort((a, b) => b.pct - a.pct);

  const emocionDominante = emociones[0]?.nombre || '—';
  const fecha = new Date().toLocaleDateString('es-CO', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  // Filas de la tabla de emociones
  const filasEmociones = emociones.map(e => `
    <tr>
      <td>${e.nombre}</td>
      <td>${e.cant}</td>
      <td>${e.pct}%</td>
      <td>
        <div style="background:#eee; border-radius:10px; overflow:hidden; height:12px;">
          <div style="width:${e.pct}%; background:#9268b8; height:12px; border-radius:10px;"></div>
        </div>
      </td>
    </tr>
  `).join('');

  // Historial reciente
  const filasHistorial = registros.slice(0, 10).map(r => `
    <tr>
      <td>${r.fecha}</td>
      <td>${r.emocion}</td>
      <td>${r.descripcion}</td>
    </tr>
  `).join('');

  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8"/>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          color: #333;
          padding: 40px;
          background: #fff;
        }

        /* Header */
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px solid #9268b8;
          padding-bottom: 16px;
          margin-bottom: 28px;
        }
        .header h1 {
          font-size: 28px;
          color: #9268b8;
          font-weight: 800;
        }
        .header .fecha {
          font-size: 12px;
          color: #888;
        }

        /* Usuario */
        .usuario-card {
          background: #f5e0ff;
          border-radius: 12px;
          padding: 16px 20px;
          margin-bottom: 28px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .usuario-card .nombre {
          font-size: 18px;
          font-weight: 700;
          color: #6B4F9E;
        }
        .usuario-card .email {
          font-size: 12px;
          color: #888;
          margin-top: 2px;
        }
        .usuario-card .badge {
          background: #9268b8;
          color: white;
          border-radius: 20px;
          padding: 4px 14px;
          font-size: 12px;
          font-weight: 600;
        }

        /* Resumen */
        .resumen {
          display: flex;
          gap: 12px;
          margin-bottom: 28px;
        }
        .resumen-card {
          flex: 1;
          background: #f9f4ff;
          border: 1px solid #e0d0f0;
          border-radius: 12px;
          padding: 16px;
          text-align: center;
        }
        .resumen-card .num {
          font-size: 28px;
          font-weight: 800;
          color: #6B4F9E;
        }
        .resumen-card .label {
          font-size: 11px;
          color: #888;
          margin-top: 4px;
        }

        /* Secciones */
        .seccion-titulo {
          font-size: 16px;
          font-weight: 700;
          color: #6B4F9E;
          margin-bottom: 12px;
          padding-left: 8px;
          border-left: 4px solid #9268b8;
        }

        /* Tabla */
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 28px;
          font-size: 13px;
        }
        th {
          background: #9268b8;
          color: white;
          padding: 10px 12px;
          text-align: left;
          font-weight: 600;
        }
        th:first-child { border-radius: 8px 0 0 0; }
        th:last-child  { border-radius: 0 8px 0 0; }
        td {
          padding: 10px 12px;
          border-bottom: 1px solid #f0e8f8;
          vertical-align: middle;
        }
        tr:nth-child(even) td { background: #faf6ff; }

        /* Footer */
        .footer {
          margin-top: 40px;
          padding-top: 16px;
          border-top: 1px solid #e0d0f0;
          text-align: center;
          font-size: 11px;
          color: #aaa;
        }
      </style>
    </head>
    <body>

      <!-- Header -->
      <div class="header">
        <div>
          <h1>🌸 MoodDiary</h1>
          <div class="fecha">Informe generado el ${fecha}</div>
        </div>
        <div style="font-size:12px; color:#888; text-align:right;">
          Informe de<br/>Análisis Emocional
        </div>
      </div>

      <!-- Usuario -->
      <div class="usuario-card">
        <div>
          <div class="nombre">${usuario?.nombre || 'Usuario'}</div>
          <div class="email">${usuario?.email || ''}</div>
        </div>
        <div class="badge">Bienestar Mental</div>
      </div>

      <!-- Resumen -->
      <div class="resumen">
        <div class="resumen-card">
          <div class="num">${total}</div>
          <div class="label">Total registros</div>
        </div>
        <div class="resumen-card">
          <div class="num">${emociones.length}</div>
          <div class="label">Tipos de emoción</div>
        </div>
        <div class="resumen-card">
          <div class="num">${emocionDominante}</div>
          <div class="label">Emoción dominante</div>
        </div>
      </div>

      <!-- Distribución -->
      <div class="seccion-titulo">Distribución de Emociones</div>
      <table>
        <thead>
          <tr>
            <th>Emoción</th>
            <th>Registros</th>
            <th>Porcentaje</th>
            <th>Progreso</th>
          </tr>
        </thead>
        <tbody>
          ${filasEmociones}
        </tbody>
      </table>

      <!-- Historial -->
      <div class="seccion-titulo">Historial Reciente (últimos 10)</div>
      <table>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Emoción</th>
            <th>Descripción</th>
          </tr>
        </thead>
        <tbody>
          ${filasHistorial}
        </tbody>
      </table>

      <!-- Footer -->
      <div class="footer">
        MoodDiary — Informe de Bienestar Emocional · ${fecha}
      </div>

    </body>
    </html>
  `;

  try {
    const { uri } = await Print.printToFileAsync({ html });
    await Sharing.shareAsync(uri, {
      mimeType: 'application/pdf',
      dialogTitle: 'Compartir informe PDF',
      UTI: 'com.adobe.pdf',
    });
  } catch (error) {
    console.error('Error generando PDF:', error);
    throw error;
  }
};