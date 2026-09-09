# Deploy backend en Render — EnQuéGasto

## Configuración del servicio Web

| Campo | Valor |
|-------|--------|
| **Root Directory** | `backend` |
| **Runtime** | Node |
| **Build Command** | `npm install --include=dev && npx prisma generate && npx tsc` |
| **Start Command** | `npx prisma db push --skip-generate && node dist/index.js` |
| **Health Check Path** | `/health` |

> `--include=dev` asegura tipos TypeScript en el build aunque Render use `NODE_ENV=production`.

## Variables de entorno (Environment)

| Variable | Ejemplo / notas |
|----------|-----------------|
| `DATABASE_URL` | Supabase: `postgresql://postgres:...@db.xxx.supabase.co:5432/postgres?sslmode=require` |
| `JWT_SECRET` | Mín. 32 caracteres (Generate en Render) |
| `JWT_REFRESH_SECRET` | Mín. 32 caracteres |
| `FRONTEND_URL` | URL de Vercel, ej. `https://enquegasto.vercel.app` |
| `NODE_ENV` | `production` |
| `PORT` | Render lo inyecta; el código usa `process.env.PORT` |

Opcional OAuth/SMTP: `GOOGLE_*`, `APPLE_*`, `SMTP_*`.

## Errores frecuentes

| Log | Causa | Solución |
|-----|--------|----------|
| `URL must start with postgresql://` | `DATABASE_URL` vacía o mal pegada | Env var en Render, sin espacios |
| `Cannot find module 'typescript'` / `tsc` | deps de dev omitidas | Build con `--include=dev` |
| `PrismaClientInitializationError` | SSL / URL | Añade `?sslmode=require` |
| Deploy OK pero 502 | Crash al arrancar | Revisa logs → suele ser DB |
| CORS | `FRONTEND_URL` distinto al dominio real | Iguala la URL de Vercel |

## Después del deploy

1. Abre `https://TU-SERVICIO.onrender.com/health`
2. Debe responder JSON `{ "status": "ok", ... }`
3. En el frontend / APK: `VITE_API_URL=https://TU-SERVICIO.onrender.com`

## Nota plan free

En plan free el servicio se duerme tras inactividad (~15 min). El primer request puede tardar 30–60 s.
