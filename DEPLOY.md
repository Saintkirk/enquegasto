# Deploy EnQuéGasto

## Backend → Render

1. Blueprint con `backend/render.yaml`
2. Configura `FRONTEND_URL`, JWT, Google OAuth, SMTP
3. Seed: `npm run db:seed`

## Frontend → Vercel

1. Importa `frontend`
2. Framework: Vite, output: `dist`
3. `vercel.json` ya reescribe `/api` al backend
