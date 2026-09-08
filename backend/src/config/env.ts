import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

// 1. Definimos un esquema estricto con Zod para validar qué variables requiere la app
const envSchema = z.object({
  PORT: z.coerce.number().default(3001),
  NODE_ENV: z.string().default('production'),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  FRONTEND_URL: z.string().default('http://localhost:5173'),
  
  // Agregamos las propiedades sociales como opcionales para evitar errores si no se usan todavía
  GOOGLE_CLIENT_ID: z.string().optional().default(''),
  GOOGLE_CLIENT_SECRET: z.string().optional().default(''),
  GOOGLE_CALLBACK_URL: z.string().optional().default(''),
  APPLE_CLIENT_ID: z.string().optional().default(''),
  APPLE_TEAM_ID: z.string().optional().default(''),
  APPLE_KEY_ID: z.string().optional().default(''),
  APPLE_PRIVATE_KEY_PATH: z.string().optional().default(''),
  APPLE_CALLBACK_URL: z.string().optional().default('')
});

// 2. Valores de respaldo (fallbacks) en caso de que falten en el entorno real
const processEnvWithFallbacks = {
  PORT: process.env.PORT || '3001',
  NODE_ENV: process.env.NODE_ENV || 'production',
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://mock:mock@localhost:5432/mock',
  JWT_SECRET: process.env.JWT_SECRET || 'dev_jwt_secret_change_me_in_production_32chars',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret_change_me_in_production_32',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '15m',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || 'TU_CLIENT_ID_MOCK',
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || 'TU_SECRET_MOCK',
  GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3001/api/auth/google/callback',
  APPLE_CLIENT_ID: process.env.APPLE_CLIENT_ID,
  APPLE_TEAM_ID: process.env.APPLE_TEAM_ID,
  APPLE_KEY_ID: process.env.APPLE_KEY_ID,
  APPLE_PRIVATE_KEY_PATH: process.env.APPLE_PRIVATE_KEY_PATH,
  APPLE_CALLBACK_URL: process.env.APPLE_CALLBACK_URL
};

// 3. Validamos e instalamos el tipado correcto de forma dinámica
const parsed = envSchema.safeParse(processEnvWithFallbacks);

if (!parsed.success) {
  console.error('❌ Error de validación en las variables de entorno:', parsed.error.format());
  process.exit(1);
}

// Exportamos el objeto tipado que solucionará los errores de Passport
export const env = parsed.data;
