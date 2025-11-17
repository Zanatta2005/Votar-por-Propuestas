/**
 * Funciones auxiliares para el front-end
 */

// ========== NOTIFICACIONES ==========

// Mostrar notificación (toast)
function showNotification(message, type = 'info') {
  // Crear elemento de notificación
  const notification = document.createElement('div');
  notification.className = `alert alert-${type} alert-dismissible fade show notification-toast`;
  notification.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
  
  notification.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;
  
  document.body.appendChild(notification);
  
  // Auto-remover después de 5 segundos
  setTimeout(() => {
    notification.remove();
  }, 5000);
}

// Mostrar loading
function showLoading(element) {
  element.innerHTML = `
    <div class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
      <p class="mt-2">Cargando...</p>
    </div>
  `;
}

// Mostrar mensaje de vacío
function showEmptyMessage(element, message = 'No hay resultados') {
  element.innerHTML = `
    <div class="text-center py-5">
      <i class="bi bi-inbox" style="font-size: 3rem; color: #ccc;"></i>
      <p class="mt-3 text-muted">${message}</p>
    </div>
  `;
}

// ========== FORMATEO DE DATOS ==========

// Formatear fecha
function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return date.toLocaleDateString('es-ES', options);
}

// Formatear fecha relativa (hace X tiempo)
function timeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  
  const intervals = {
    año: 31536000,
    mes: 2592000,
    semana: 604800,
    día: 86400,
    hora: 3600,
    minuto: 60,
    segundo: 1
  };
  
  for (const [name, secondsInInterval] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInInterval);
    if (interval >= 1) {
      return `Hace ${interval} ${name}${interval > 1 ? 's' : ''}`;
    }
  }
  
  return 'Justo ahora';
}

// Truncar texto
function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

// ========== VALIDACIONES ==========

// Validar email
function isValidEmail(email) {
  const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return regex.test(email);
}

// Validar longitud de texto
function isValidLength(text, min, max) {
  const length = text.trim().length;
  return length >= min && length <= max;
}

// ========== UI HELPERS ==========

// Crear card de propuesta
function createProposalCard(proposal, showActions = false) {
  const card = document.createElement('div');
  card.className = 'col-md-6 col-lg-4 mb-4';
  
  const actionsHTML = showActions && isAuthenticated() ? `
    <div class="card-footer bg-transparent border-top-0">
      <div class="d-flex justify-content-between">
        <button class="btn btn-sm btn-outline-primary edit-btn" data-id="${proposal._id}">
          <i class="bi bi-pencil"></i> Editar
        </button>
        <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${proposal._id}">
          <i class="bi bi-trash"></i> Eliminar
        </button>
      </div>
    </div>
  ` : '';
  
  card.innerHTML = `
    <div class="card h-100 shadow-sm proposal-card" style="cursor: pointer;">
      <img src="${proposal.image || 'https://via.placeholder.com/400x200'}" 
           class="card-img-top" 
           alt="${proposal.title}"
           style="height: 200px; object-fit: cover;">
      <div class="card-body">
        <span class="badge bg-primary mb-2">${proposal.category}</span>
        <h5 class="card-title">${truncateText(proposal.title, 60)}</h5>
        <p class="card-text text-muted">${truncateText(proposal.description, 100)}</p>
        <div class="d-flex justify-content-between align-items-center">
          <small class="text-muted">
            <i class="bi bi-person"></i> ${proposal.authorUsername}
          </small>
          <span class="badge bg-success">
            <i class="bi bi-hand-thumbs-up"></i> ${proposal.voteCount}
          </span>
        </div>
        <small class="text-muted d-block mt-2">${timeAgo(proposal.createdAt)}</small>
      </div>
      ${actionsHTML}
    </div>
  `;
  
  // Click en la card para ver detalle (excepto en botones)
  const cardElement = card.querySelector('.proposal-card');
  cardElement.addEventListener('click', (e) => {
    if (!e.target.closest('button')) {
      window.location.href = `/frontend/pages/proposal-detail.html?id=${proposal._id}`;
    }
  });
  
  return card;
}

// Crear paginación
function createPagination(currentPage, totalPages, onPageChange) {
  const pagination = document.createElement('nav');
  pagination.innerHTML = `
    <ul class="pagination justify-content-center">
      <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
        <a class="page-link" href="#" data-page="${currentPage - 1}">Anterior</a>
      </li>
      ${Array.from({ length: totalPages }, (_, i) => i + 1)
        .map(page => `
          <li class="page-item ${page === currentPage ? 'active' : ''}">
            <a class="page-link" href="#" data-page="${page}">${page}</a>
          </li>
        `).join('')}
      <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
        <a class="page-link" href="#" data-page="${currentPage + 1}">Siguiente</a>
      </li>
    </ul>
  `;
  
  // Event listeners para la paginación
  pagination.querySelectorAll('.page-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const page = parseInt(e.target.dataset.page);
      if (page > 0 && page <= totalPages) {
        onPageChange(page);
      }
    });
  });
  
  return pagination;
}

// Obtener parámetro de la URL
function getUrlParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

// Deshabilitar botón con loading
function setButtonLoading(button, loading = true) {
  if (loading) {
    button.disabled = true;
    button.dataset.originalText = button.innerHTML;
    button.innerHTML = `
      <span class="spinner-border spinner-border-sm me-2"></span>
      Cargando...
    `;
  } else {
    button.disabled = false;
    button.innerHTML = button.dataset.originalText;
  }
}