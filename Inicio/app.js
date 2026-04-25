// ===== DASHBOARD =====

function cargarResumen() {
  google.script.run
    .withSuccessHandler(actualizarStats)
    .withFailureHandler(err => console.error('Error resumen:', err))
    .obtenerResumen();
}

function actualizarStats(resumen) {
  document.getElementById('statTotalProductos').textContent  = resumen.totalProductos  || 0;
  document.getElementById('statTotalMovimientos').textContent = resumen.totalMovimientos || 0;
  document.getElementById('statStockBajo').textContent       = resumen.stockBajo        || 0;
  document.getElementById('statSinStock').textContent        = resumen.sinStock         || 0;

  if (resumen.alertas && resumen.alertas.length > 0) {
    mostrarAlertas(resumen.alertas);
  }
}

function mostrarAlertas(alertas) {
  const card = document.getElementById('cardAlertas');
  const lista = document.getElementById('listaAlertas');

  lista.innerHTML = alertas.map(p => `
    <div class="alerta-item ${p.cantidad <= 0 ? 'sin-stock' : 'stock-bajo'}">
      <span><strong>${p.codigo}</strong> – ${p.nombre}</span>
      <span>Stock: <strong>${p.cantidad}</strong> / Mín: ${p.stockMin}</span>
    </div>
  `).join('');

  card.style.display = 'block';
}

function exportarInventario() {
  google.script.run
    .withSuccessHandler(() => mostrarAlerta('alertDash', 'Exportación completada', 'success'))
    .withFailureHandler(err => mostrarAlerta('alertDash', 'Error: ' + err.message, 'error'))
    .exportarInventario();
}

// Inicializar
cargarResumen();