import express from 'express';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import { env } from './config/env';
import { connectDatabase, disconnectDatabase } from './config/database';
import { configurePassport } from './config/passport';
import {
  helmetMiddleware,
  corsMiddleware,
  globalLimiter,
  sanitizeInput,
  blockBadMethods,
  securityHeaders,
} from './middleware/security.middleware';
import authRoutes from './routes/auth.routes';
import platformsRoutes from './routes/platforms.routes';
import subscriptionsRoutes from './routes/subscriptions.routes';
import alertsRoutes from './routes/alerts.routes';

const app = express();

app.use(securityHeaders);
app.use(helmetMiddleware);
app.use(corsMiddleware);
app.use(blockBadMethods);
app.use(globalLimiter);

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
app.use(sanitizeInput);

app.use(passport.initialize());
configurePassport();

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    app: 'EnQuéGasto',
    message: 'Para que no te preguntes en qué gasté mi plata a fin de mes 🇨🇱',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api', (_req, res) => {
  res.json({
    name: 'EnQuéGasto API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      platforms: '/api/platforms',
      subscriptions: '/api/subscriptions',
      alerts: '/api/alerts',
    },
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/platforms', platformsRoutes);
app.use('/api/subscriptions', subscriptionsRoutes);
app.use('/api/alerts', alertsRoutes);

app.use((_req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    message: 'Esta ruta no existe en EnQuéGasto API',
  });
});

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Error no controlado:', err.message);
  if (err.message === 'No permitido por CORS') {
    res.status(403).json({ error: 'Forbidden', message: 'Origen no permitido' });
    return;
  }
  res.status(500).json({
    error: 'Error interno del servidor',
    message: env.NODE_ENV === 'development' ? err.message : 'Algo salió mal. Intenta de nuevo más tarde.',
  });
});

async function startServer() {
  try {
    if (env.DATABASE_URL && env.DATABASE_URL.includes('postgresql')) {
      await connectDatabase();
    } else {
      console.warn('⚠️  DATABASE_URL no configurada o inválida.');
    }

    // 0.0.0.0 = accesible desde el celular en la misma WiFi
    app.listen(env.PORT, '0.0.0.0', () => {
      console.log('');
      console.log('🚀 EnQuéGasto Backend');
      console.log(`   Ambiente: ${env.NODE_ENV}`);
      console.log(`   Puerto:   ${env.PORT} (0.0.0.0 — LAN/móvil)`);
      console.log('');
    });
  } catch (error) {
    console.error('No se pudo iniciar el servidor:', error);
    process.exit(1);
  }
}

process.on('SIGINT', async () => {
  await disconnectDatabase();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await disconnectDatabase();
  process.exit(0);
});

startServer();
