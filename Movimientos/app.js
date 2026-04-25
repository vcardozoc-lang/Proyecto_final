// ===== MOVIMIENTOS =====

let autocompleteTimeout;

// --- Inicializar fecha de hoy ---
document.addEventListener('DOMContentLoaded', () => {
  resetFecha();

  const input = document.getElementById('codigoMov');
  input.addEventListener('input', buscarProductoAutocompletado);

  document.addEventListener('click', e => {
    if (e.target !== input) {
      document.getElementById('autocompleteResults').style.display = 'none';
    }
  });
});

function resetFecha() {
  const fechaMov = document.getElementById('fechaMov');
  if (fechaMov) fechaMov.valueAsDate = new Date();
}

// --- Autocomplete ---
function buscarProductoAutocompletado() {
  const texto = this.value.trim();
  const results = document.getElementById('autocompleteResults');

  if (texto.length < 1) { results.style.display = 'none'; return; }

  clearTimeout(autocompleteTimeout);
  autocompleteTimeout = setTimeout(() => {
    google.script.run
      .withSuccessHandler(productos => {
        if (!productos.length) { results.style.display = 'none'; return; }

        results.innerHTML = productos.map(p => `
          <div class="autocomplete-item"
               onclick="seleccionarProducto('${p.codigo}', '${p.nombre}')">
            <strong>${p.codigo}</strong>
            <small>${p.nombre} · ${p.unidad} · ${p.grupo}</small>
          </div>
        `).join('');

        results.style.display = 'block';
      })
      .withFailureHandler(() => { results.style.display = 'none'; })
      .buscarProductoPorCodigo(texto);
  }, 300);
}

function seleccionarProducto(codigo) {
  document.getElementById('codigoMov').value = codigo;
  document.getElementById('autocompleteResults').style.display = 'none';
}

// --- Registrar movimiento ---
function registrarMovimiento(event) {
  event.preventDefault();

  const movimiento = {
    codigo:        document.getElementById('codigoMov').value.trim(),
    fecha:         document.getElementById('fechaMov').value,
    tipo:          document.getElementById('tipoMov').value,
    cantidad:      parseFloat(document.getElementById('cantidadMov').value),
    observaciones: document.getElementById('observaciones').value.trim()
  };

  const btn = document.getElementById('btnMovimiento');
  setLoading(btn, true, 'Registrar Movimiento');

  google.script.run
    .withSuccessHandler(resultado => {
      setLoading(btn, false, 'Registrar Movimiento');

      if (resultado.includes('correctamente')) {
        mostrarAlerta('alertMovimientos', resultado, 'success');
        document.getElementById('formMovimiento').reset();
        resetFecha();
      } else {
        mostrarAlerta('alertMovimientos', resultado, 'error');
      }
    })
    .withFailureHandler(err => {
      setLoading(btn, false, 'Registrar Movimiento');
      mostrarAlerta('alertMovimientos', 'Error: ' + err.message, 'error');
    })
    .registrarMovimiento(movimiento);
}