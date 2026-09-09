import dotenv from 'dotenv';
dotenv.config();

function clean(value: string | undefined): string {
  return (value || '').trim();
}

const googleClientId = clean(process.env.GOOGLE_CLIENT_ID);
const googleClientSecret = clean(process.env.GOOGLE_CLIENT_SECRET);

/** True solo si hay credenciales reales (no vacías ni MOCK_*) */
export function isGoogleConfigured(): boolean {
  if (!googleClientId || !googleClientSecret) return false;
  if (googleClientId.startsWith('MOCK_') || googleClientSecret.startsWith('MOCK_')) return false;
  return true;
}

export const env = {
  PORT: parseInt(process.env.PORT || '3001', 10),
  NODE_ENV: process.env.NODE_ENV || 'production',
  DATABASE_URL: clean(process.env.DATABASE_URL),
  JWT_SECRET:
    clean(process.env.JWT_SECRET) || 'dev_jwt_secret_change_me_in_production_32chars',
  JWT_REFRESH_SECRET:
    clean(process.env.JWT_REFRESH_SECRET) || 'dev_refresh_secret_change_me_in_production_32',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '15m',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',

  // URL del frontend (Vercel). Sin barra final.
  FRONTEND_URL: clean(process.env.FRONTEND_URL).replace(/\/$/, '') || 'http://localhost:5173',

  // Orígenes extra permitidos (separados por coma), ej. previews de Vercel
  CORS_ORIGINS: clean(process.env.CORS_ORIGINS),

  GOOGLE_CLIENT_ID: googleClientId,
  GOOGLE_CLIENT_SECRET: googleClientSecret,
  GOOGLE_CALLBACK_URL:
    clean(process.env.GOOGLE_CALLBACK_URL) ||
    'https://enquegasto-api.onrender.com/api/auth/google/callback',

  APPLE_CLIENT_ID: clean(process.env.APPLE_CLIENT_ID),
  APPLE_TEAM_ID: clean(process.env.APPLE_TEAM_ID),
  APPLE_KEY_ID: clean(process.env.APPLE_KEY_ID),
  APPLE_PRIVATE_KEY_PATH: clean(process.env.APPLE_PRIVATE_KEY_PATH),
  APPLE_CALLBACK_URL: clean(process.env.APPLE_CALLBACK_URL),

  SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '587', 10),
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  EMAIL_FROM: process.env.EMAIL_FROM || 'no-reply@enquegasto.cl',
};
