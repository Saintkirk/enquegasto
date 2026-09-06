import { Request, Response } from 'express';
import { sendZombieAlertEmail, verifyEmailConnection } from '../services/email.service';

export async function sendZombieAlert(req: Request, res: Response): Promise<void> {
  try {
    if (!req.userId) {
      res.status(401).json({ error: 'No autorizado', message: 'Debes iniciar sesión' });
      return;
    }
    const result = await sendZombieAlertEmail(req.userId);
    if (!result.success) {
      res.status(400).json({ error: 'No se pudo enviar', message: result.reason });
      return;
    }
    if (!result.sent) {
      res.json({ message: result.reason || 'No hay alertas', sent: false });
      return;
    }
    res.json({ message: 'Alerta de gasto zombie enviada a tu correo 📧', sent: true, subject: result.subject });
  } catch (error) {
    res.status(500).json({ error: 'Error interno', message: error instanceof Error ? error.message : 'Error' });
  }
}

export async function emailStatus(_req: Request, res: Response): Promise<void> {
  try {
    const configured = !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
    let connected = false;
    if (configured) connected = await verifyEmailConnection();
    res.json({
      configured,
      connected,
      message: configured
        ? connected ? 'Sistema de emails listo' : 'SMTP configurado pero no conecta'
        : 'SMTP no configurado. Emails se simulan en consola.',
    });
  } catch {
    res.status(500).json({ error: 'Error interno' });
  }
}
