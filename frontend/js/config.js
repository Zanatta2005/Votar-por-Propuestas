/**
 * Configuración global del front-end
 */

// URL de la API
// En desarrollo: localhost:3000
// En producción: tu-app.onrender.com
const API_URL = 'https://votar-propuestas-backend.onrender.com/api';

// Endpoints
const ENDPOINTS = {
  // Auth
  register: `${API_URL}/auth/register`,
  login: `${API_URL}/auth/login`,
  
  // Proposals
  proposals: `${API_URL}/proposals`,
  proposalById: (id) => `${API_URL}/proposals/${id}`,
  
  // Votes
  vote: (id) => `${API_URL}/proposals/${id}/vote`,
  checkVote: (id) => `${API_URL}/proposals/${id}/votes`,
  
  // Users
  profile: `${API_URL}/users/me`,
  myProposals: `${API_URL}/users/me/proposals`,
  myVotes: `${API_URL}/users/me/votes`
};

// Categorías disponibles (deben coincidir con el back-end)
const CATEGORIES = [
  'Tecnología',
  'Educación',
  'Salud',
  'Medio Ambiente',
  'Transporte',
  'Gastronomía',
  'Entretenimiento',
  'Deportes',
  'Social',
  'Otros'
];

// Opciones de ordenamiento
const SORT_OPTIONS = {
  recent: '-createdAt',
  oldest: 'createdAt',
  votes: '-voteCount'
};

// Configuración de paginación
const PAGINATION = {
  itemsPerPage: 12
};