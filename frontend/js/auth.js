/**
 * Manejo de autenticación (JWT)
 */

// Guardar token en localStorage
function saveToken(token) {
  localStorage.setItem('token', token);
}

// Obtener token de localStorage
function getToken() {
  return localStorage.getItem('token');
}

// Eliminar token de localStorage
function removeToken() {
  localStorage.removeItem('token');
}

// Guardar datos del usuario
function saveUser(user) {
  localStorage.setItem('user', JSON.stringify(user));
}

// Obtener datos del usuario
function getUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

// Eliminar datos del usuario
function removeUser() {
  localStorage.removeItem('user');
}

// Verificar si el usuario está autenticado
function isAuthenticated() {
  return getToken() !== null;
}

// Cerrar sesión
function logout() {
  removeToken();
  removeUser();
  window.location.href = '/frontend/pages/login.html';
}

// Redirigir a login si no está autenticado
function requireAuth() {
  if (!isAuthenticated()) {
    window.location.href = '/frontend/pages/login.html';
  }
}

// Redirigir a home si ya está autenticado
function redirectIfAuthenticated() {
  if (isAuthenticated()) {
    window.location.href = '/frontend/pages/index.html';
  }
}

// Obtener headers con autenticación
function getAuthHeaders() {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
}

// Actualizar navbar según estado de autenticación
function updateNavbar() {
  const user = getUser();
  const authButtons = document.getElementById('auth-buttons');
  const userMenu = document.getElementById('user-menu');
  
  if (!authButtons || !userMenu) return;
  
  if (user) {
    // Usuario autenticado
    authButtons.style.display = 'none';
    userMenu.style.display = 'block';
    
    const usernameElement = document.getElementById('username-display');
    if (usernameElement) {
      usernameElement.textContent = user.username;
    }
  } else {
    // Usuario no autenticado
    authButtons.style.display = 'block';
    userMenu.style.display = 'none';
  }
}

// Manejar errores de autenticación (401)
function handleAuthError(error) {
  if (error.status === 401) {
    // Token inválido o expirado
    removeToken();
    removeUser();
    showNotification('Sesión expirada. Por favor inicia sesión nuevamente.', 'warning');
    setTimeout(() => {
      window.location.href = '/frontend/pages/login.html';
    }, 2000);
    return true;
  }
  return false;
}

// Inicializar autenticación en cada página
document.addEventListener('DOMContentLoaded', () => {
  updateNavbar();
  
  // Agregar event listener al botón de logout
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      logout();
    });
  }
});