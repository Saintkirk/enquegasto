import dotenv from 'dotenv';
dotenv.config();

export const env = {
  PORT: parseInt(process.env.PORT || '3001', 10),
  NODE_ENV: process.env.NODE_ENV || 'production',
  DATABASE_URL: process.env.DATABASE_URL || '',
  JWT_SECRET: process.env.JWT_SECRET || 'dev_jwt_secret_change_me_in_production_32chars',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret_change_me_in_production_32',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '15m',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || 'MOCK_ID',
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || 'MOCK_SECRET',
  GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3001/api/auth/google/callback',
  APPLE_CLIENT_ID: process.env.APPLE_CLIENT_ID || '',
  APPLE_TEAM_ID: process.env.APPLE_TEAM_ID || '',
  APPLE_KEY_ID: process.env.APPLE_KEY_ID || '',
  APPLE_PRIVATE_KEY_PATH: process.env.APPLE_PRIVATE_KEY_PATH || '',
  APPLE_CALLBACK_URL: process.env.APPLE_CALLBACK_URL || '',

  SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '587', 10),
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  EMAIL_FROM: process.env.EMAIL_FROM || 'no-reply@enquegasto.cl' // <- AGREGA ESTA LÍNEA FINAL
};
