# 📸 MB Fotografía | Portfolio & Panel de Administración

Este proyecto es un sistema integral de portfolio web diseñado exclusivamente para servicios de fotografía de alta gama. Cuenta con una interfaz de usuario (Frontend) elegante y minimalista, y un panel de administración privado (Backend) que le permite al fotógrafo gestionar su contenido de forma autónoma.

## ✨ Características Principales

### 🌐 Interfaz Pública (Frontend)
- **Diseño Premium:** Animaciones cinematográficas, efecto de Splash Screen de entrada y diseño 100% responsivo (Mobile First).
- **Galería Dinámica:** Visualización optimizada de álbumes por categorías (Bodas, Retratos, etc.).
- **Navegación Fluida:** Construida con React Router para transiciones rápidas sin recargar la página.

### 🔒 Panel de Administración (Backend)
- **Gestión Total (CRUD):** Creación, edición y eliminación de álbumes fotográficos.
- **Subida a la Nube:** Integración directa con Cloudinary para alojar las fotos sin perder calidad.
- **Seguridad:** Rutas protegidas con autenticación (JSON Web Tokens) y validación estricta de datos con Zod.
- **Sincronización:** Al borrar un álbum, se eliminan automáticamente las fotos de la base de datos (MongoDB) y de la nube (Cloudinary) para no dejar archivos basura.

---

## 🛠️ Tecnologías Utilizadas

**Frontend:**
- [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/) (Estilos)
- [Axios](https://axios-http.com/) (Peticiones HTTP)
- [React Router DOM](https://reactrouter.com/) (Navegación)

**Backend:**
- [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/) + [Mongoose](https://mongoosejs.com/) (Base de Datos)
- [Cloudinary](https://cloudinary.com/) (Almacenamiento de imágenes)
- [Zod](https://zod.dev/) (Validación de esquemas)
- [JWT (JSON Web Tokens)](https://jwt.io/) (Autenticación)

---

## 🚀 Instalación y Configuración Local

Sigue estos pasos para ejecutar el proyecto en tu entorno local.

Abre una terminal y navega a la carpeta del backend:

### 1. Clonar el repositorio
```bash
git clone [https://https://github.com/leandrocalfin/mb-fotografia.git](https://https://github.com/leandrocalfin/mb-fotografia.git)
cd mb-fotografia

2. Configurar el Backend
Abre una terminal y navega a la carpeta del backend:

Bash
cd backend
npm install
Crea un archivo .env en la raíz de la carpeta backend y añade las siguientes variables de entorno:

Fragmento de código
PORT=3000
MONGO_URI=tu_cadena_de_conexion_de_mongodb
JWT_SECRET=tu_palabra_secreta_para_tokens
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
Inicia el servidor backend:

Bash
npm run dev

3. Configurar el Frontend
Abre una nueva terminal y navega a la carpeta del frontend:

Bash
cd frontend
npm install
Inicia el servidor frontend:

Bash
npm run dev
Desarrollado con pasión para llevar la fotografía al siguiente nivel digital. 🚀