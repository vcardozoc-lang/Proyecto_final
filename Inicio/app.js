// ===== DASHBOARD =====

function cargarResumen() {
  const productos   = JSON.parse(localStorage.getItem('productos')   || '[]');
  const movimientos = JSON.parse(localStorage.getItem('movimientos') || '[]');

  const resumen = {
    totalProductos:   productos.length,
    totalMovimientos: movimientos.length,
    stockBajo:        productos.filter(p => p.cantidad > 0 && p.cantidad <= p.stockMin && p.stockMin > 0).length,
    sinStock:         productos.filter(p => p.cantidad <= 0).length,
    alertas:          productos.filter(p => p.cantidad <= 0 || (p.cantidad <= p.stockMin && p.stockMin > 0))
  };

  actualizarStats(resumen);
}

function actualizarStats(resumen) {
  document.getElementById('statTotalProductos').textContent   = resumen.totalProductos;
  document.getElementById('statTotalMovimientos').textContent = resumen.totalMovimientos;
  document.getElementById('statStockBajo').textContent        = resumen.stockBajo;
  document.getElementById('statSinStock').textContent         = resumen.sinStock;

  if (resumen.alertas && resumen.alertas.length > 0) {
    mostrarAlertas(resumen.alertas);
  }
}

function mostrarAlertas(alertas) {
  const card  = document.getElementById('cardAlertas');
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
  const productos = JSON.parse(localStorage.getItem('productos') || '[]');

  if (!productos.length) {
    mostrarAlerta('alertDash', 'No hay productos para exportar.', 'error');
    return;
  }

  const encabezado = ['Código', 'Nombre', 'Unidad', 'Grupo', 'Stock Mín.', 'Stock Actual', 'Precio Venta'];
  const filas = productos.map(p => [
    p.codigo, p.nombre, p.unidad, p.grupo, p.stockMin, p.cantidad, p.precioVenta
  ]);

  const csv = [encabezado, ...filas]
    .map(fila => fila.join(','))
    .join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href     = url;
  link.download = 'inventario.csv';
  link.click();
  URL.revokeObjectURL(url);

  mostrarAlerta('alertDash', 'Exportación completada.', 'success');
}

// Inicializar
cargarResumen();