import nodemailer from 'nodemailer';
import { prisma } from '../config/database';
import { env } from '../config/env';
import { getZombieAlerts, buildZombieAlertMessage } from './zombie.service';

function getTransport() {
  if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS) return null;
  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465,
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
  });
}

export async function verifyEmailConnection(): Promise<boolean> {
  const t = getTransport();
  if (!t) return false;
  try { await t.verify(); return true; } catch { return false; }
}

export async function sendZombieAlertEmail(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user?.email) return { success: false, reason: 'Usuario sin correo' };
  const summary = await getZombieAlerts(userId);
  if (summary.totalZombies === 0) return { success: true, sent: false, reason: 'No hay gastos zombie' };
  const subject = `EnQuéGasto: estás botando ${summary.totalMonthlyWasteFormatted}/mes en zombies`;
  const text = buildZombieAlertMessage(summary, user.name);
  const transport = getTransport();
  if (!transport) {
    console.log('📧 [SIMULADO]', user.email, subject, text);
    return { success: true, sent: true, subject, reason: 'Simulado (SMTP no configurado)' };
  }
  await transport.sendMail({ from: env.EMAIL_FROM, to: user.email, subject, text });
  return { success: true, sent: true, subject };
}
