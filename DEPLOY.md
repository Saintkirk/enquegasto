# Deploy + CI/CD — EnQuéGasto

## Resumen

| Servicio | Rol | Auto-deploy |
|----------|-----|-------------|
| **GitHub Actions** | CI (build/typecheck) en cada push/PR | Sí |
| **Render** | Backend + PostgreSQL | Hook o integración Git |
| **Vercel** | Frontend (PWA) | Integración Git o CLI |

## GitHub Actions

Workflows en `.github/workflows/`:

| Archivo | Qué hace |
|---------|----------|
| `ci.yml` | Build backend + frontend en push/PR a `main` |
| `deploy.yml` | Dispara deploy a Render + Vercel en push a `main` |

### Secrets (Settings → Actions → Secrets)

| Secret | Descripción |
|--------|-------------|
| `RENDER_DEPLOY_HOOK_URL` | Deploy Hook de Render |
| `VERCEL_TOKEN` | Token de Vercel |
| `VERCEL_ORG_ID` | ID de org en Vercel |
| `VERCEL_PROJECT_ID` | ID del proyecto frontend |

Si conectas el repo en Vercel y Render, el auto-deploy funciona sin estos secrets.

## Backend → Render

1. New → Blueprint → repo `Saintkirk/enquegasto`
2. Usa `backend/render.yaml`
3. Configura `FRONTEND_URL`, JWT, Google, SMTP
4. Post-deploy: `npx prisma migrate deploy && npm run db:seed`

## Frontend → Vercel

1. Import project → root directory **`frontend`**
2. Framework Vite, output `dist`
3. `vercel.json` ya reescribe `/api` al backend

## Flujo

```
Push a main → CI (Actions) → Render (API) + Vercel (PWA)
```
