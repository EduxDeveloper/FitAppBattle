# FitBattle AI — MongoDB Database Schema

> Esquema completo de la base de datos para el backend MERN de FitBattle AI.  
> Cada colección incluye sus campos, tipos y relaciones con otras colecciones.

---

## Colecciones

1. [users](#1-users)
2. [food_items](#2-food_items)
3. [meal_logs](#3-meal_logs)
4. [weight_logs](#4-weight_logs)
5. [challenges](#5-challenges)
6. [challenge_participants](#6-challenge_participants)
7. [messages](#7-messages)
8. [notifications](#8-notifications)

---

## 1. `users`

Almacena toda la información del usuario: credenciales, métricas corporales, metas y macros calculados.

```js
{
  _id: ObjectId,

  // --- Credenciales ---
  name: String,               // "Alex Hunter"
  username: String,           // "alexhunter" (único)
  email: String,              // "alex@example.com" (único)
  password: String,           // Hash bcrypt
  avatar: String,             // URL de la foto de perfil
  isVerified: Boolean,        // false hasta verificar email
  verifyCode: String,         // Código de 6 dígitos
  verifyCodeExpires: Date,
  resetPasswordToken: String,
  resetPasswordExpires: Date,

  // --- Perfil personal ---
  age: Number,                // 28
  gender: String,             // "male" | "female" | "other"
  weightKg: Number,           // 78.5
  heightCm: Number,           // 182
  activityLevel: String,      // "sedentary" | "light" | "moderate" | "very" | "extreme"

  // --- Métricas calculadas (auto) ---
  bmi: Number,                // 23.7
  bmr: Number,                // 1850
  tdee: Number,               // 2550

  // --- Objetivos ---
  goal: String,               // "cutting" | "bulking" | "maintenance"
  targetWeightKg: Number,     // 75
  dailyCaloriesTarget: Number, // 2100

  // --- Macros objetivo (g/día) ---
  macros: {
    proteinG: Number,         // 160
    carbsG: Number,           // 200
    fatsG: Number             // 70
  },

  // --- Gamificación ---
  points: Number,             // 1850 (ranking general)
  currentStreak: Number,      // 12
  bestStreak: Number,         // 24

  // --- Configuración ---
  language: String,           // "en" | "es"
  notificationsEnabled: Boolean,
  darkMode: Boolean,

  // --- Timestamps ---
  createdAt: Date,
  updatedAt: Date
}
```

**Índices:**
```js
{ email: 1 }    // unique
{ username: 1 } // unique
```

---

## 2. `food_items`

Catálogo global de alimentos con sus macros. Puede ser creado manualmente o por el escáner de IA.

```js
{
  _id: ObjectId,

  name: String,               // "Grilled Chicken Salad"
  brand: String,              // "Generic" | "Mercadona" (opcional)
  servingSizeG: Number,       // 100

  // --- Macros por porción ---
  calories: Number,           // 345
  proteinG: Number,           // 35
  carbsG: Number,             // 12
  fatsG: Number,              // 18

  // --- Fuente del alimento ---
  source: String,             // "ai_scan" | "manual" | "database"
  aiConfidence: Number,       // 94 (%) — solo si source = "ai_scan"

  // --- Imagen de referencia ---
  imageUrl: String,

  // --- Timestamps ---
  createdAt: Date,
  updatedAt: Date
}
```

---

## 3. `meal_logs`

Registro diario de comidas por usuario. Cada documento es UNA entrada de comida en UN día.

```js
{
  _id: ObjectId,

  userId: ObjectId,           // ref → users._id
  foodItemId: ObjectId,       // ref → food_items._id

  // --- Detalle de la ingesta ---
  date: Date,                 // 2026-05-09 (día exacto)
  mealType: String,           // "breakfast" | "lunch" | "dinner" | "snack"
  servingSizeG: Number,       // 250 (puede diferir de la porción base)

  // --- Macros calculados para esta toma ---
  calories: Number,
  proteinG: Number,
  carbsG: Number,
  fatsG: Number,

  // --- Notas del usuario ---
  notes: String,

  // --- Timestamps ---
  createdAt: Date,
  updatedAt: Date
}
```

**Índices:**
```js
{ userId: 1, date: 1 }
{ userId: 1, mealType: 1 }
```

---

## 4. `weight_logs`

Historial de pesadas del usuario para gráficos de progreso.

```js
{
  _id: ObjectId,

  userId: ObjectId,           // ref → users._id
  date: Date,                 // 2026-05-09
  weightKg: Number,           // 78.5
  notes: String,              // "Morning, fasted" (opcional)

  // --- Timestamps ---
  createdAt: Date
}
```

**Índices:**
```js
{ userId: 1, date: -1 }
```

---

## 5. `challenges`

Retos creados entre grupos de amigos con objetivo, duración y tipo de meta.

```js
{
  _id: ObjectId,

  creatorId: ObjectId,        // ref → users._id

  // --- Info del reto ---
  title: String,              // "Summer Shred ☀️"
  description: String,        // "Lose 2kg in 30 days"
  emoji: String,              // "☀️"

  // --- Configuración ---
  goalType: String,           // "weight_loss" | "protein_streak" | "calorie_deficit" | "workout_count"
  targetValue: Number,        // 2 (kg a perder, días seguidos, etc.)
  maxParticipants: Number,    // 10

  // --- Fechas ---
  startDate: Date,
  endDate: Date,

  // --- Estado ---
  status: String,             // "active" | "completed" | "cancelled"

  // --- Chat del grupo ---
  chatEnabled: Boolean,       // true

  // --- Timestamps ---
  createdAt: Date,
  updatedAt: Date
}
```

**Índices:**
```js
{ creatorId: 1 }
{ status: 1, endDate: 1 }
```

---

## 6. `challenge_participants`

Relación entre usuarios y retos. Almacena el progreso individual dentro del reto.

```js
{
  _id: ObjectId,

  challengeId: ObjectId,      // ref → challenges._id
  userId: ObjectId,           // ref → users._id

  // --- Estado de participación ---
  joinedAt: Date,
  status: String,             // "active" | "completed" | "left"

  // --- Progreso (varía según goalType) ---
  currentValue: Number,       // -0.8 (kg perdidos), 10 (días de streak), etc.
  rank: Number,               // 2 (posición en el leaderboard)

  // --- Medallas y logros ---
  badges: [
    {
      name: String,           // "Iron Will"
      emoji: String,          // "🏅"
      awardedAt: Date
    }
  ],

  // --- Timestamps ---
  updatedAt: Date
}
```

**Índices:**
```js
{ challengeId: 1, userId: 1 } // unique
{ challengeId: 1, rank: 1 }
```

---

## 7. `messages`

Mensajes del chat de grupo asociados a un reto.

```js
{
  _id: ObjectId,

  challengeId: ObjectId,      // ref → challenges._id
  senderId: ObjectId,         // ref → users._id

  // --- Contenido ---
  text: String,               // "Hit a new PR on bench! 💪"
  type: String,               // "text" | "image" | "achievement"

  // --- Archivo adjunto (opcional) ---
  attachmentUrl: String,
  attachmentType: String,     // "image" | "video"

  // --- Estado ---
  readBy: [ObjectId],         // Array de users._id que han leído el mensaje

  // --- Timestamps ---
  createdAt: Date
}
```

**Índices:**
```js
{ challengeId: 1, createdAt: 1 }
{ senderId: 1 }
```

---

## 8. `notifications`

Notificaciones del sistema para cada usuario.

```js
{
  _id: ObjectId,

  userId: ObjectId,           // ref → users._id (destinatario)

  // --- Contenido ---
  title: String,              // "Challenge Update"
  message: String,            // "Marcus overtook you in Summer Shred!"
  type: String,               // "challenge_update" | "meal_reminder" |
                              // "streak_alert" | "new_message" |
                              // "friend_achievement" | "weigh_in_reminder"

  // --- Enlace asociado (para navegación) ---
  relatedEntity: String,      // "challenge" | "meal_log" | "message"
  relatedId: ObjectId,        // ID del documento relacionado

  // --- Estado ---
  isRead: Boolean,            // false

  // --- Timestamps ---
  createdAt: Date
}
```

**Índices:**
```js
{ userId: 1, isRead: 1 }
{ userId: 1, createdAt: -1 }
```

---

## Relaciones entre colecciones

```
users ──────────────────────────────────────────────────────────────────┐
  │                                                                      │
  ├──< meal_logs >── food_items                                          │
  ├──< weight_logs                                                       │
  ├──< challenge_participants >── challenges <── messages >── users      │
  └──< notifications                                                     │
```

---

## Variables de entorno requeridas (`.env`)

```env
# MongoDB
MONGODB_URI=mongodb+srv://<usuario>:<contraseña>@cluster.mongodb.net/fitbattle

# JWT
JWT_SECRET=tu_secreto_muy_seguro
JWT_EXPIRES_IN=7d

# Email (para verificación y reset)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu@gmail.com
EMAIL_PASS=tu_app_password

# App
PORT=5000
CLIENT_URL=http://localhost:5173
```

---

## Comandos de inicialización (Mongoose)

```bash
# Instalar dependencias del backend
npm install express mongoose bcryptjs jsonwebtoken nodemailer dotenv cors

# Arrancar el servidor
npm run dev
```

---

*Generado para FitBattle AI — Mayo 2026*
