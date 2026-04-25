// ===== STOCK =====

let stockData = [];

document.addEventListener('DOMContentLoaded', cargarStock);

function cargarStock() {
  const loading = document.getElementById('loadingStock');
  const tbody   = document.getElementById('tablaStockBody');

  loading.style.display = 'block';
  tbody.innerHTML = '';

  google.script.run
    .withSuccessHandler(stock => {
      loading.style.display = 'none';
      stockData = stock;
      renderStock(stock);
    })
    .withFailureHandler(err => {
      loading.style.display = 'none';
      tbody.innerHTML = `
        <tr><td colspan="7">
          <div class="empty-state">
            <div class="empty-state-icon">❌</div>
            <h3>Error al cargar stock</h3>
            <p>${err.message}</p>
          </div>
        </td></tr>`;
    })
    .obtenerStock();
}

function renderStock(stock) {
  const tbody = document.getElementById('tablaStockBody');

  if (!stock.length) {
    tbody.innerHTML = `
      <tr><td colspan="7">
        <div class="empty-state">
          <div class="empty-state-icon">📦</div>
          <h3>No hay productos registrados</h3>
          <p>Agrega productos en la sección Productos</p>
        </div>
      </td></tr>`;
    return;
  }

  tbody.innerHTML = stock.map(p => {
    const { badge, texto } = getEstado(p);
    return `
      <tr>
        <td><strong>${p.codigo}</strong></td>
        <td>${p.nombre}</td>
        <td>${p.unidad}</td>
        <td>${p.grupo}</td>
        <td>${p.stockMin}</td>
        <td><strong>${p.cantidad}</strong></td>
        <td><span class="badge ${badge}">${texto}</span></td>
      </tr>`;
  }).join('');
}

function getEstado(p) {
  if (p.cantidad <= 0)
    return { badge: 'badge-danger',  texto: 'Sin Stock' };
  if (p.cantidad <= p.stockMin && p.stockMin > 0)
    return { badge: 'badge-warning', texto: 'Stock Bajo' };
  return   { badge: 'badge-success', texto: 'Normal' };
}

function buscarEnStock() {
  const texto  = document.getElementById('buscarStock').value.toLowerCase().trim();
  const grupo  = document.getElementById('filtroGrupo').value;
  const estado = document.getElementById('filtroEstado').value;

  const filtrado = stockData.filter(p => {
    const matchTexto = !texto ||
      p.codigo.toLowerCase().includes(texto) ||
      p.nombre.toLowerCase().includes(texto) ||
      p.grupo.toLowerCase().includes(texto);

    const matchGrupo = !grupo || p.grupo === grupo;

    const { texto: estadoTexto } = getEstado(p);
    const matchEstado = !estado ||
      (estado === 'sin'   && estadoTexto === 'Sin Stock')  ||
      (estado === 'bajo'  && estadoTexto === 'Stock Bajo') ||
      (estado === 'normal'&& estadoTexto === 'Normal');

    return matchTexto && matchGrupo && matchEstado;
  });

  renderStock(filtrado);
}