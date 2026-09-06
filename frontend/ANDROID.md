# Generar APK de EnQuéGasto (Windows)

## Requisitos

1. **Node.js 20+**
2. **Android Studio** (SDK + JDK incluidos)
3. Variable de entorno `ANDROID_HOME` (Android Studio la configura al instalar)

## Opción A — Más rápida: PWA en el celular (mismo WiFi)

1. En el PC, backend + frontend corriendo.
2. Averigua tu IP local:
   ```bash
   ipconfig
   # Busca IPv4, ej. 192.168.1.15
   ```
3. En el celular (misma WiFi), abre Chrome:
   ```
   http://192.168.1.15:5173
   ```
4. Menú → **Agregar a pantalla de inicio**.

Para que el API responda desde el celular, el frontend debe llamar a `http://TU_IP:3001` (no localhost).

## Opción B — APK nativa (Capacitor + Gradle)

### 1. Pull y dependencias

```bash
cd ~/Desktop/enquegasto/enquegasto
git pull origin main

cd frontend
npm install
```

### 2. Apuntar al backend en tu red local

Crea `frontend/.env.production`:

```env
VITE_API_URL=http://192.168.1.15:3001
```

(Reemplaza por tu IP de `ipconfig`.)

En `capacitor.config.ts` puedes habilitar cleartext en debug (HTTP):

```ts
server: {
  androidScheme: 'https',
  cleartext: true,
},
android: {
  allowMixedContent: true,
},
```

### 3. Build + sync + APK

```bash
# En Git Bash (frontend/)
npm run build
npx cap add android   # solo la primera vez
npx cap sync android

cd android
# En Windows usa gradlew.bat:
./gradlew.bat assembleDebug
```

APK generado:

```
frontend/android/app/build/outputs/apk/debug/app-debug.apk
```

Copia el APK al teléfono e instálalo (permite “orígenes desconocidos”).

### 4. Abrir en Android Studio

```bash
npx cap open android
```

Build → Build APK(s).

## Backend accesible desde el celular

El backend debe escuchar en `0.0.0.0` (todas las interfaces), no solo localhost.

En `backend/src/index.ts` el `app.listen` debería ser:

```ts
app.listen(env.PORT, '0.0.0.0', () => { ... })
```

Firewall de Windows: permite Node en la red privada.

## Checklist funcional antes del APK

- [ ] `git pull`
- [ ] Backend: `npm install && npx prisma generate && npx prisma db push && npx tsx watch src/index.ts`
- [ ] Frontend PC: `npm run dev` → registro con email funciona
- [ ] Misma WiFi + IP correcta
- [ ] Luego `npm run build` + `cap sync` + `gradlew.bat assembleDebug`

## Nota Impeccable / diseño

La UI ya sigue principios de diseño limpio (acento rose, tipografía Outfit, motion GPU-only). Para probar en teléfono prioriza **funcionalidad + red local**; el polish visual ya está en Login/Dashboard.
