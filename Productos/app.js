// ===== PRODUCTOS =====

function registrarProducto(event) {
  event.preventDefault();

  const producto = {
    codigo:      document.getElementById('codigo').value.trim(),
    nombre:      document.getElementById('nombre').value.trim(),
    unidad:      document.getElementById('unidad').value,
    grupo:       document.getElementById('grupo').value,
    stockMin:    parseInt(document.getElementById('stockMin').value)    || 0,
    precioVenta: parseFloat(document.getElementById('precioVenta').value) || 0
  };

  const btn = document.getElementById('btnRegistrar');
  setLoading(btn, true, 'Registrar Producto');

  google.script.run
    .withSuccessHandler(resultado => {
      setLoading(btn, false, 'Registrar Producto');

      if (resultado.includes('correctamente')) {
        mostrarAlerta('alertProductos', resultado, 'success');
        document.getElementById('formProducto').reset();
      } else {
        mostrarAlerta('alertProductos', resultado, 'error');
      }
    })
    .withFailureHandler(err => {
      setLoading(btn, false, 'Registrar Producto');
      mostrarAlerta('alertProductos', 'Error: ' + err.message, 'error');
    })
    .registrarProducto(producto);
}