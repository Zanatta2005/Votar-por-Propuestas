# Votar por Propuestas

Plataforma web para publicar, votar y gestionar propuestas de proyectos.

**Proyecto Integrador - Desarrollo de Aplicaciones y Servicios Web**  
ITESO - Otoño 2025

---

## Descripción

Sistema completo de votación de propuestas que permite a los usuarios:
- Registrarse e iniciar sesión
- Crear y publicar propuestas
- Votar por propuestas de otros usuarios
- Buscar y filtrar propuestas por categoría
- Gestionar su perfil y propuestas

---

## Tecnologías Utilizadas

### **Back-end:**
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT (Autenticación)
- bcryptjs (Encriptación)

### **Front-end:**
- HTML5
- CSS3
- JavaScript (Vanilla)
- Bootstrap 5
- Bootstrap Icons

---

## Estructura del Proyecto

```
votar-propuestas/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Proposal.js
│   │   └── Vote.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── proposals.js
│   │   ├── votes.js
│   │   └── users.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
└── frontend/
    ├── pages/
    │   ├── index.html
    │   ├── login.html
    │   ├── register.html
    │   ├── proposal-detail.html
    │   ├── create-proposal.html
    │   ├── my-proposals.html
    │   ├── profile.html
    │   └── error.html
    ├── js/
    │   ├── config.js
    │   ├── auth.js
    │   ├── api.js
    │   └── utils.js
    └── css/
        └── styles.css
```

---

## Instalación y Configuración

### **Requisitos Previos:**
- Node.js (v14 o superior)
- MongoDB Atlas (cuenta gratuita)
- Git

### **Paso 1: Clonar el repositorio**
```bash
git clone [URL_DEL_REPOSITORIO]
cd votar-propuestas
```

### **Paso 2: Configurar el Back-end**
```bash
cd backend
npm install
```

### **Paso 3: Configurar variables de entorno**

Crear archivo `.env` en la carpeta `backend/`:

```env
PORT=3000
NODE_ENV=development

MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/votar-propuestas

JWT_SECRET=tu_clave_secreta_super_segura
JWT_EXPIRE=7d

CLIENT_URL=http://127.0.0.1:5500
```

### **Paso 4: Iniciar el servidor**
```bash
npm start
```

El servidor estará corriendo en: `http://localhost:3000`

### **Paso 5: Abrir el Front-end**

Opción A - **Live Server (Recomendado):**
1. Abrir VS Code
2. Instalar extensión "Live Server"
3. Click derecho en `frontend/pages/index.html`
4. Seleccionar "Open with Live Server"

Opción B - **Directamente en el navegador:**
1. Abrir `frontend/pages/index.html` en el navegador

---

## API REST - Endpoints

### **Autenticación**

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Registrar usuario | No |
| POST | `/api/auth/login` | Iniciar sesión | No |

### **Propuestas**

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/proposals` | Listar propuestas | No |
| GET | `/api/proposals/:id` | Ver detalle | No |
| POST | `/api/proposals` | Crear propuesta | Sí |
| PUT | `/api/proposals/:id` | Actualizar propuesta | Sí |
| DELETE | `/api/proposals/:id` | Eliminar propuesta | Sí |

### **Votos**

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/api/proposals/:id/vote` | Votar | Sí |
| DELETE | `/api/proposals/:id/vote` | Quitar voto | Sí |
| GET | `/api/proposals/:id/votes` | Verificar voto | Sí |

### **Usuarios**

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/users/me` | Ver perfil | Sí |
| PUT | `/api/users/me` | Actualizar perfil | Sí |
| DELETE | `/api/users/me` | Eliminar cuenta | Sí |
| GET | `/api/users/me/proposals` | Mis propuestas | Sí |

---

## Pruebas con Postman

1. Importar colección de Postman (incluida en el repositorio)
2. Configurar variable `baseURL`: `http://localhost:3000/api`
3. Ejecutar endpoints en orden:
   - Register → Login → Create Proposal → Vote

---

## Despliegue (Render)

### **Back-end:**
1. Crear cuenta en [Render](https://render.com)
2. New Web Service
3. Conectar repositorio de GitHub
4. Configurar:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Variables de entorno (`.env`)

### **Front-end:**
1. New Static Site
2. Conectar repositorio
3. Build Command: (vacío)
4. Publish directory: `frontend`

---

## Funcionalidades Implementadas

### **Back-end:**
- API REST completa
- Autenticación JWT
- Encriptación de contraseñas (bcrypt)
- Validaciones de datos
- Manejo de errores centralizado
- Sistema de votación único (1 voto/usuario)
- CRUD completo de propuestas
- Búsqueda y filtros
- Paginación

### **Front-end:**
- Login/Register
- Home con listado de propuestas
- Búsqueda y filtros por categoría
- Detalle de propuesta con votación
- Crear/Editar propuestas
- Gestión de mis propuestas
- Perfil de usuario
- Diseño responsivo (Bootstrap)
- Notificaciones (toasts)
- Validaciones en formularios

---

## Categorías Disponibles

- Tecnología
- Educación
- Salud
- Medio Ambiente
- Transporte
- Gastronomía
- Entretenimiento
- Deportes
- Social
- Otros

---

## Equipo

- **Desarrollador:** Claudio Zanatta Casas - Jorge Arturo Ponce Martin
- **Materia:** Desarrollo de Aplicaciones y Servicios Web
- **Profesor:** Ing. Jorge Barba Ortega
- **Periodo:** Otoño 2025

---

## Licencia

Este proyecto es parte de un proyecto académico del ITESO.

---

## Agradecimientos

- ITESO - Universidad Jesuita de Guadalajara
- Departamento de Electrónica, Sistemas e Informática
- Profesor Ing. Jorge Barba Ortega
