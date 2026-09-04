# EnQuéGasto 🇨🇱

**Para que no te preguntes en qué gasté mi plata a fin de mes**

App chilena de gestión de suscripciones.

## Stack

- **Backend:** Node.js + Express + TypeScript + Prisma + PostgreSQL
- **Frontend:** React + Vite + Tailwind + Recharts (PWA)
- **Auth:** JWT + bcrypt + Google/Apple Social Login

## Desarrollo local

```bash
# Backend
cd backend
cp .env.example .env
npm install
npx prisma migrate dev
npm run db:seed
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3001

## Deploy

Ver [DEPLOY.md](./DEPLOY.md) (Vercel + Render).
