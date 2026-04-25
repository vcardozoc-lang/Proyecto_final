// ===== UTILIDADES COMPARTIDAS =====

function mostrarAlerta(elementId, mensaje, tipo) {
  const el = document.getElementById(elementId);
  if (!el) return;

  el.textContent = mensaje;
  el.className = `alert alert-${tipo} show`;

  setTimeout(() => {
    el.classList.remove('show');
  }, 4000);
}

function setLoading(btn, loading, textoOriginal) {
  btn.disabled = loading;
  btn.textContent = loading ? 'Guardando...' : textoOriginal;
}

// Marcar enlace activo en sidebar
document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (path.endsWith(href) || path.includes(href.replace('index.html', ''))) {
      link.classList.add('active');
    }
  });
});