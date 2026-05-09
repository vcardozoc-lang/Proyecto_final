// ===== PRODUCTOS =====

function registrarProducto(event) {
  event.preventDefault();

  const producto = {
    codigo:      document.getElementById('codigo').value.trim(),
    nombre:      document.getElementById('nombre').value.trim(),
    unidad:      document.getElementById('unidad').value,
    grupo:       document.getElementById('grupo').value,
    stockMin:    parseInt(document.getElementById('stockMin').value)    || 0,
    precioVenta: parseFloat(document.getElementById('precioVenta').value) || 0,
    cantidad:    0  // stock inicial en 0
  };

  const btn = document.getElementById('btnRegistrar');
  setLoading(btn, true, 'Registrar Producto');

  // Leer productos existentes del localStorage (o array vacío si no hay)
  const productos = JSON.parse(localStorage.getItem('productos') || '[]');

  // Verificar que el código no esté duplicado
  const existe = productos.some(p => p.codigo === producto.codigo);
  if (existe) {
    alert(`Ya existe un producto con el código "${producto.codigo}".`);
    setLoading(btn, false, 'Registrar Producto');
    return;
  }

  // Agregar el nuevo producto y guardar
  productos.push(producto);
  localStorage.setItem('productos', JSON.stringify(productos));

  window.location.href = "../Stock/index.html";
}