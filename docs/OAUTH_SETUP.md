# Configurar OAuth (Google + Apple) — EnQuéGasto

Social login **solo Google y Apple** (sin Facebook).

---

## 1. Google (recomendado para desarrollo)

### Paso a paso

1. Entra a [Google Cloud Console](https://console.cloud.google.com/apis/credentials).
2. Crea un proyecto (o elige uno existente), por ejemplo `EnQueGasto`.
3. **APIs y servicios → Pantalla de consentimiento de OAuth**
   - Tipo: **Externo**
   - Nombre de la app: `EnQuéGasto`
   - Correo de soporte: el tuyo
   - Scopes: `email`, `profile`, `openid`
   - Usuarios de prueba: agrega tu Gmail
4. **Credenciales → Crear credenciales → ID de cliente de OAuth**
   - Tipo: **Aplicación web**
   - Nombre: `EnQuéGasto Local`
   - **Orígenes de JavaScript autorizados:**
     - `http://localhost:5173`
     - `http://localhost:3001`
   - **URI de redirección autorizados:**
     - `http://localhost:3001/api/auth/google/callback`
5. Copia **Client ID** y **Client Secret**.

### En `backend/.env`

```env
GOOGLE_CLIENT_ID=123456789-xxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxx
GOOGLE_CALLBACK_URL=http://localhost:3001/api/auth/google/callback
FRONTEND_URL=http://localhost:5173
```

### Verificar

```bash
cd backend
npm run dev
```

En la consola deberías ver:

```
✅ Passport Google Strategy configurada
```

Abre `http://localhost:5173/login` → **Continuar con Google**.

---

## 2. Apple Sign In (opcional en local)

Apple exige **cuenta de desarrollador de pago**. En local suele bastar Google.

| Variable | Dónde sacarla |
|----------|----------------|
| `APPLE_CLIENT_ID` | Services ID (ej. `cl.enquegasto.web`) |
| `APPLE_TEAM_ID` | Membership → Team ID |
| `APPLE_KEY_ID` | Keys → Key ID |
| `APPLE_PRIVATE_KEY_PATH` | Ruta al archivo `.p8` |

Return URL: `http://localhost:3001/api/auth/apple/callback`

```env
APPLE_CLIENT_ID=cl.enquegasto.web
APPLE_TEAM_ID=ABCDE12345
APPLE_KEY_ID=XYZ123ABCD
APPLE_PRIVATE_KEY_PATH=./keys/AuthKey_XYZ123ABCD.p8
APPLE_CALLBACK_URL=http://localhost:3001/api/auth/apple/callback
```

---

## 3. Errores frecuentes

| Síntoma | Causa |
|---------|--------|
| Warning `Google OAuth no configurado` | `.env` vacío o servidor no reiniciado |
| `redirect_uri_mismatch` | URI en Console ≠ `GOOGLE_CALLBACK_URL` |
| Error en pantalla Google | Consent screen sin usuarios de prueba |
| CORS al volver | `FRONTEND_URL` distinto al origen real |

**Nunca** subas `.env` ni el `.p8` a GitHub.
