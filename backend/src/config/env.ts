export const env={PORT:3001,NODE_ENV:'development',DATABASE_URL:'postgresql://postgres:gLRuvmuhJQiXm7jI@db.rclgkfeayuoirujkdzax.supabase.co:6543/postgres?sslmode=require&connection_limit=1',JWT_SECRET:'dev_jwt_secret_change_me_in_production_32chars',JWT_REFRESH_SECRET:'dev_refresh_secret_change_me_in_production_32',JWT_EXPIRES_IN:'15m',JWT_REFRESH_EXPIRES_IN:'7d',FRONTEND_URL:'http://localhost:5173'};
import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

// Inyectamos las variables fijas en memoria para que no dependan de un archivo .env corrupto
process.env.PORT = '3001';
process.env.NODE_ENV = 'development';
process.env.DATABASE_URL = "postgresql://postgres.rclgkfeayuoirujkdzax:gLRuvmuhJQiXm7jI@://supabase.com";
process.env.FRONTEND_URL = 'http://localhost:5173';

// 🔐 LLAVES DE SEGURIDAD (Obligatorias para que funcione el registro y login)
process.env.JWT_SECRET = "un_texto_secreto_muy_largo_y_seguro_para_tu_app_123!";
process.env.JWT_REFRESH_SECRET = "otro_texto_secreto_diferente_y_muy_seguro_para_actualizar";

// 🌐 CREDENCIALES DE GOOGLE (Reemplázalas por tus llaves reales de Google Cloud Console cuando las tengas)
process.env.GOOGLE_CLIENT_ID = "TU_CLIENT_://googleusercontent.com";
process.env.GOOGLE_CLIENT_SECRET = "GOCSPX-TU_SECRET";
process.env.GOOGLE_CALLBACK_URL = "http://localhost:3001/api/auth/google/callback";
