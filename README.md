<div align="center">

# 🃏 Planning Poker

**Estimaciones ágiles en tiempo real, sin fricciones.**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3?style=flat-square&logo=bootstrap&logoColor=white)](https://getbootstrap.com)
[![Supabase](https://img.shields.io/badge/Supabase-Realtime-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)

[**→ Ver demo en vivo**](https://planing-poker.vercel.app) &nbsp;·&nbsp;
[Reportar bug](https://github.com/cozakoo/planning-poker/issues) &nbsp;·&nbsp;
[Sugerir feature](https://github.com/cozakoo/planning-poker/issues)

</div>

---

## ✨ ¿Qué es?

Planning Poker es una herramienta de estimación ágil para equipos de desarrollo. Permite que todos los integrantes voten simultáneamente sus estimaciones en tiempo real, sin influenciarse entre sí hasta que las cartas se revelan.

**Sin registro. Sin configuración. Solo creás una sala y compartís el código.**

---

## 🚀 Features

| Feature | Descripción |
|---------|-------------|
| ⚡ **Tiempo real** | Votos y presencia se sincronizan al instante con Supabase Realtime |
| 🏠 **Múltiples salas** | Cada sala tiene un código único de 6 caracteres |
| 🎴 **Sets de cartas** | Fibonacci · T-Shirt · Potencias de 2 |
| 👁 **Reveal simultáneo** | Las cartas se ocultan hasta que el host decide revelarlas |
| 📊 **Estadísticas** | Promedio, moda y distribución de votos post-reveal |
| 🔄 **Múltiples rondas** | El host crea nuevas rondas sin salir de la sala |
| 🎉 **Detección de consenso** | Celebración automática cuando todos votan igual |
| 📱 **Responsive** | Funciona en desktop, tablet y móvil |
| 🔒 **Sin auth** | Solo username — identidad guardada en localStorage |

---

## 🛠 Stack

```
Frontend          Backend / Infra
─────────────     ───────────────────
React 19          Supabase (PostgreSQL + Realtime)
Vite 6            Vercel (deploy)
Bootstrap 5.3
Bootstrap Icons
Zustand (estado)
React Router 7
```

---

## 🏗 Arquitectura

```
src/
├── pages/
│   ├── Home.jsx          # Crear sala / Unirse
│   └── Room.jsx          # Sala activa
├── components/
│   ├── layout/
│   │   └── Footer.jsx
│   ├── room/
│   │   ├── Card.jsx           # Carta individual
│   │   ├── CardDeck.jsx       # Mazo de cartas
│   │   ├── HostControls.jsx   # Reveal + Nueva ronda (solo host)
│   │   ├── ParticipantList.jsx
│   │   ├── RoomHeader.jsx
│   │   └── VotingResults.jsx  # Stats post-reveal
│   └── ui/
│       ├── Button.jsx
│       └── Input.jsx
├── hooks/
│   ├── useRoom.js          # Carga + suscripción a la sala
│   ├── useParticipants.js  # Lista en tiempo real
│   ├── useRounds.js        # Cambios de ronda en tiempo real
│   └── useVotes.js         # Votos en tiempo real
├── store/
│   └── roomStore.js        # Zustand — estado global
└── lib/
    ├── supabase.js         # Cliente Supabase
    ├── cardSets.js         # Definición de sets de cartas
    ├── roomCode.js         # Generador de códigos
    └── stats.js            # Cálculo de promedio, moda, distribución
```

---

## 🗄 Schema de base de datos

```sql
rooms        → sala con código único, set de cartas, host
participants → usuarios sin auth (id en localStorage)
rounds       → rondas con estado: voting → revealed → closed
votes        → 1 voto por participante por ronda (upsert)
```

Realtime habilitado en: `participants`, `rounds`, `votes`, `rooms`

---

## ⚙️ Correr localmente

```bash
# 1. Clonar
git clone https://github.com/cozakoo/planning-poker.git
cd planning-poker

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# → Completar VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY

# 4. Crear tablas en Supabase
# → Ejecutar el SQL de /docs/schema.sql en el SQL Editor de Supabase

# 5. Levantar dev server
npm run dev
```

---

## 🌐 Deploy en Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/cozakoo/planning-poker)

1. Conectar repo en [vercel.com](https://vercel.com)
2. Agregar env vars: `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`
3. Deploy automático en cada push a `main`

---

## 🔄 Flujo de uso

```
Host                          Participante
────                          ────────────
1. Crear sala                 1. Unirse con código
2. Compartir código  ──────►  2. Ver sala en tiempo real
3. Todos votan       ◄──────► 3. Elegir carta
4. Revelar cartas             4. Ver resultados
5. Nueva ronda       ──────►  5. Nueva ronda
```

---

## 📝 Licencia

MIT — libre para usar, modificar y distribuir.

---

<div align="center">

Hecho con ☕ por **[Martín Arcos](https://arcosvargas.com)**

[![GitHub](https://img.shields.io/badge/GitHub-cozakoo-181717?style=flat-square&logo=github)](https://github.com/cozakoo)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-martin--arcos-0A66C2?style=flat-square&logo=linkedin)](https://linkedin.com/in/martin-arcos)

</div>
