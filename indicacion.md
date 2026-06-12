# Guía de Despliegue - FitBattle AI

Para que tu aplicación esté disponible en internet para uso personal y con amigos, necesitas desplegar el Frontend y el Backend por separado. Usaremos **Vercel** para el Frontend y **Render** para el Backend.

## 1. Configurar MongoDB Atlas (Base de Datos en la Nube)

Como actualmente usas MongoDB local (`localhost:27017`), necesitas una base de datos en línea.

1. Ve a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) y crea una cuenta gratuita.
2. Crea un nuevo cluster gratuito (M0).
3. En la sección "Database Access", crea un usuario para la base de datos y guarda la contraseña.
4. En "Network Access", añade la IP `0.0.0.0/0` para permitir conexiones desde cualquier lugar (necesario para Render).
5. Ve a "Database", haz clic en "Connect" -> "Drivers" y copia la cadena de conexión (Connection String).
   - Debería verse similar a: `mongodb+srv://<usuario>:<password>@cluster0.../fitAppDB`

## 2. Despliegue del Backend en Render

Render es un servicio gratuito para alojar APIs de Node.js.

1. Sube tu carpeta `Backend` a un repositorio de GitHub.
2. Ve a [Render](https://render.com/) y crea una cuenta.
3. Haz clic en "New +" y selecciona "Web Service".
4. Conecta tu cuenta de GitHub y selecciona el repositorio del Backend.
5. Configura el Web Service:
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start` (o `node index.js`)
6. En la sección **Environment Variables**, añade las siguientes variables:
   - `PORT`: (Render lo asignará automáticamente, pero puedes poner `4000`)
   - `NODE_ENV`: `production`
   - `DB_URI`: Pega la URL que copiaste de MongoDB Atlas (asegúrate de poner la contraseña real).
   - `JWT_Secret_key`: Tu secreto JWT
   - `USER_EMAIL`: Tu correo para enviar emails
   - `USER_PASSWORD`: Tu contraseña de aplicación
   - `GEMINI_API_KEY`: Tu clave de Gemini
   - `CLOUDINARY_CLOUD_NAME`: Tu Cloudinary cloud name
   - `CLOUDINARY_API_KEY`: Tu Cloudinary API key
   - `CLOUDINARY_API_SECRET`: Tu Cloudinary API secret
   - `FRONTEND_URL`: Aquí pondrás la URL de Vercel cuando la tengas (temporalmente puedes poner un placeholder o dejarla en blanco y actualizarla después).
7. Haz clic en "Create Web Service". Copia la URL que te da Render (ej: `https://fitbattle-backend.onrender.com`).

## 3. Despliegue del Frontend en Vercel

1. Sube tu carpeta `frontend` a un repositorio de GitHub (puede ser el mismo, pero debes decirle a Vercel que la carpeta raíz es `frontend`).
2. Ve a [Vercel](https://vercel.com/) y crea una cuenta.
3. Haz clic en "Add New..." -> "Project".
4. Importa tu repositorio.
5. Si tu frontend está en una subcarpeta, edita el "Root Directory" y selecciona la carpeta `frontend`.
6. En la sección **Environment Variables**, añade:
   - `VITE_API_URL`: Pega la URL de tu backend en Render (ej: `https://fitbattle-backend.onrender.com`) - **¡Sin barra diagonal al final!**
7. Haz clic en "Deploy".
8. Copia la URL final de Vercel (ej: `https://fitbattle-frontend.vercel.app`).

## 4. Conexión Final (Importante)

Ahora que tienes la URL del Frontend en Vercel, debes decirle al Backend que acepte peticiones desde esa URL (CORS).

1. Vuelve a **Render** -> Tu Web Service -> Environment Variables.
2. Añade/Actualiza la variable `FRONTEND_URL` con la URL exacta de Vercel (ej: `https://fitbattle-frontend.vercel.app`).
3. Guarda los cambios. Render reiniciará automáticamente el backend.

¡Listo! Tu aplicación debería estar funcionando en línea.

### Notas importantes para producción
- El archivo `vercel.json` ya fue incluido en el código para que las rutas funcionen correctamente al recargar la página.
- El código ya fue modificado para gestionar correctamente las "cookies" (necesario para el login) cuando el frontend y backend están en dominios diferentes (`sameSite: "none", secure: true`).
