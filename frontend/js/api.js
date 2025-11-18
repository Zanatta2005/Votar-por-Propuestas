/**
 * Funciones para hacer peticiones a la API REST
 */

// Registrar usuario
async function register(username, email, password) {
  const response = await fetch(ENDPOINTS.register, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password })
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw { status: response.status, message: data.message };
  }
  
  return data;
}

// Iniciar sesión
async function login(email, password) {
  const response = await fetch(ENDPOINTS.login, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw { status: response.status, message: data.message };
  }
  
  return data;
}

// Obtener todas las propuestas
async function getProposals(page = 1, search = '', category = '', sort = '-createdAt') {
  let url = `${ENDPOINTS.proposals}?page=${page}&limit=${PAGINATION.itemsPerPage}`;
  
  if (search) url += `&search=${encodeURIComponent(search)}`;
  if (category) url += `&category=${encodeURIComponent(category)}`;
  if (sort) url += `&sort=${sort}`;
  
  const response = await fetch(url);
  const data = await response.json();
  
  if (!response.ok) {
    throw { status: response.status, message: data.message };
  }
  
  return data;
}

// Obtener una propuesta por ID
async function getProposalById(id) {
  const response = await fetch(ENDPOINTS.proposalById(id));
  const data = await response.json();
  
  if (!response.ok) {
    throw { status: response.status, message: data.message };
  }
  
  return data;
}

// Crear propuesta
async function createProposal(proposalData) {
  const response = await fetch(ENDPOINTS.proposals, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(proposalData)
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    if (handleAuthError({ status: response.status })) return;
    throw { status: response.status, message: data.message };
  }
  
  return data;
}

// Actualizar propuesta
async function updateProposal(id, proposalData) {
  const response = await fetch(ENDPOINTS.proposalById(id), {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(proposalData)
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    if (handleAuthError({ status: response.status })) return;
    throw { status: response.status, message: data.message };
  }
  
  return data;
}

// Eliminar propuesta
async function deleteProposal(id) {
  const response = await fetch(ENDPOINTS.proposalById(id), {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    if (handleAuthError({ status: response.status })) return;
    throw { status: response.status, message: data.message };
  }
  
  return data;
}

// Votar por una propuesta
async function voteProposal(id) {
  const response = await fetch(ENDPOINTS.vote(id), {
    method: 'POST',
    headers: getAuthHeaders()
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    if (handleAuthError({ status: response.status })) return;
    throw { status: response.status, message: data.message };
  }
  
  return data;
}

// Quitar voto de una propuesta
async function unvoteProposal(id) {
  const response = await fetch(ENDPOINTS.vote(id), {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    if (handleAuthError({ status: response.status })) return;
    throw { status: response.status, message: data.message };
  }
  
  return data;
}

// Verificar si el usuario votó
async function checkUserVote(id) {
  const response = await fetch(ENDPOINTS.checkVote(id), {
    headers: getAuthHeaders()
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    if (handleAuthError({ status: response.status })) return;
    throw { status: response.status, message: data.message };
  }
  
  return data;
}

// Obtener perfil del usuario
async function getMyProfile() {
  const response = await fetch(ENDPOINTS.profile, {
    headers: getAuthHeaders()
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    if (handleAuthError({ status: response.status })) return;
    throw { status: response.status, message: data.message };
  }
  
  return data;
}

// Actualizar perfil
async function updateProfile(userData) {
  const response = await fetch(ENDPOINTS.profile, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(userData)
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    if (handleAuthError({ status: response.status })) return;
    throw { status: response.status, message: data.message };
  }
  
  return data;
}

// Eliminar cuenta
async function deleteAccount() {
  const response = await fetch(ENDPOINTS.profile, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    if (handleAuthError({ status: response.status })) return;
    throw { status: response.status, message: data.message };
  }
  
  return data;
}

// Obtener mis propuestas
async function getMyProposals() {
  const response = await fetch(ENDPOINTS.myProposals, {
    headers: getAuthHeaders()
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    if (handleAuthError({ status: response.status })) return;
    throw { status: response.status, message: data.message };
  }
  
  return data;
}