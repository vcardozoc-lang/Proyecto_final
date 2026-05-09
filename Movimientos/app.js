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

// --- Autocomplete desde localStorage ---
function buscarProductoAutocompletado() {
  const texto  = this.value.trim().toLowerCase();
  const results = document.getElementById('autocompleteResults');

  if (texto.length < 1) { results.style.display = 'none'; return; }

  clearTimeout(autocompleteTimeout);
  autocompleteTimeout = setTimeout(() => {
    const productos = JSON.parse(localStorage.getItem('productos') || '[]');

    const coincidencias = productos.filter(p =>
      p.codigo.toLowerCase().includes(texto) ||
      p.nombre.toLowerCase().includes(texto)
    );

    if (!coincidencias.length) { results.style.display = 'none'; return; }

    results.innerHTML = coincidencias.map(p => `
      <div class="autocomplete-item"
           onclick="seleccionarProducto('${p.codigo}', '${p.nombre}')">
        <strong>${p.codigo}</strong>
        <small>${p.nombre} · ${p.unidad} · ${p.grupo}</small>
      </div>
    `).join('');

    results.style.display = 'block';
  }, 300);
}

function seleccionarProducto(codigo) {
  document.getElementById('codigoMov').value = codigo;
  document.getElementById('autocompleteResults').style.display = 'none';
}

// --- Registrar movimiento y actualizar stock en localStorage ---
function registrarMovimiento(event) {
  event.preventDefault();

  const movimiento = {
    codigo:        document.getElementById('codigoMov').value.trim(),
    fecha:         document.getElementById('fechaMov').value,
    tipo:          document.getElementById('tipoMov').value,   // 'entrada' | 'salida'
    cantidad:      parseFloat(document.getElementById('cantidadMov').value),
    observaciones: document.getElementById('observaciones').value.trim()
  };

  const btn = document.getElementById('btnMovimiento');
  setLoading(btn, true, 'Registrar Movimiento');

  // 1. Leer productos del localStorage
  let productos = JSON.parse(localStorage.getItem('productos') || '[]');
  const idx = productos.findIndex(p => p.codigo === movimiento.codigo);

  if (idx === -1) {
    setLoading(btn, false, 'Registrar Movimiento');
    mostrarAlerta('alertMovimientos', `No se encontró el producto con código "${movimiento.codigo}".`, 'error');
    return;
  }

  if (isNaN(movimiento.cantidad) || movimiento.cantidad <= 0) {
    setLoading(btn, false, 'Registrar Movimiento');
    mostrarAlerta('alertMovimientos', 'La cantidad debe ser un número mayor a 0.', 'error');
    return;
  }

  // 2. Normalizar cantidad actual (por si el producto fue creado sin ese campo)
  console.log("Producto buscado", productos[idx])
  productos[idx].cantidad = parseFloat(movimiento.cantidad) || 0;

  // 3. Aplicar el movimiento sobre la cantidad
  if (movimiento.tipo === 'entrada') {
    productos[idx].cantidad += movimiento.cantidad;
  } else if (movimiento.tipo === 'salida') {
    if (movimiento.cantidad > productos[idx].cantidad) {
      setLoading(btn, false, 'Registrar Movimiento');
      mostrarAlerta('alertMovimientos', `Stock insuficiente. Disponible: ${productos[idx].cantidad}.`, 'error');
      return;
    }
    productos[idx].cantidad -= movimiento.cantidad;
  }

  console.log("Producto Actualizar", productos)

  // 3. Guardar productos actualizados
  localStorage.setItem('productos', JSON.stringify(productos));

  // 4. Guardar el movimiento en el historial
  const movimientos = JSON.parse(localStorage.getItem('movimientos') || '[]');
  movimientos.push(movimiento);
  localStorage.setItem('movimientos', JSON.stringify(movimientos));

  setLoading(btn, false, 'Registrar Movimiento');
  mostrarAlerta('alertMovimientos', `Movimiento registrado correctamente. Stock actual: ${productos[idx].cantidad}.`, 'success');
  document.getElementById('formMovimiento').reset();
  resetFecha();
}