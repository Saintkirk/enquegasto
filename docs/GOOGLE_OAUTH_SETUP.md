# Google OAuth — EnQuéGasto

## 1. Google Cloud Console

1. https://console.cloud.google.com/apis/credentials
2. Crear **OAuth client ID** → tipo **Aplicación web**
3. **Orígenes autorizados de JavaScript:**
   - `https://TU-FRONTEND.vercel.app`
   - `https://enquegasto-api.onrender.com`
   - `http://localhost:5173` (dev)
4. **URI de redirección autorizados:** (debe coincidir **carácter por carácter**)
   ```
   https://enquegasto-api.onrender.com/api/auth/google/callback
   http://localhost:3001/api/auth/google/callback
   ```

## 2. Variables en Render (backend)

```env
GOOGLE_CLIENT_ID=xxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxx
GOOGLE_CALLBACK_URL=https://enquegasto-api.onrender.com/api/auth/google/callback
FRONTEND_URL=https://TU-FRONTEND.vercel.app
```

`FRONTEND_URL` **sin barra final**. Si queda en `http://localhost:5173`, el login con Google “funciona” en Google pero te manda a localhost y falla en el celular/producción.

## 3. Variables en Vercel (frontend)

```env
VITE_API_URL=https://enquegasto-api.onrender.com
```

Sin `/api` al final. Luego **Redeploy**.

## 4. Flujo esperado

1. Click “Continuar con Google” → `https://enquegasto-api.onrender.com/api/auth/google`
2. Google login
3. Callback → API genera JWT
4. Redirect → `https://TU-FRONTEND.vercel.app/auth/callback?accessToken=...`
5. Frontend guarda token y llama `/api/auth/me` → Dashboard

## Errores comunes

| Mensaje / síntoma | Causa |
|-------------------|--------|
| `redirect_uri_mismatch` | URI en Google Console ≠ `GOOGLE_CALLBACK_URL` |
| `invalid_client` | CLIENT_ID / SECRET mal copiados |
| Vuelve a login sin entrar | `FRONTEND_URL` mal o `VITE_API_URL` vacío |
| CORS en consola | `FRONTEND_URL` distinto al dominio real de Vercel |
