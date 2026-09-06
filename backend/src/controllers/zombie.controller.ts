import { Request, Response } from 'express';
import {
  getZombieAlerts,
  setZombieStatus,
  registerUsage,
  buildZombieAlertMessage,
  detectAndMarkZombies,
} from '../services/zombie.service';
import { prisma } from '../config/database';

export async function getZombies(req: Request, res: Response): Promise<void> {
  try {
    if (!req.userId) { res.status(401).json({ error: 'No autorizado' }); return; }
    const summary = await getZombieAlerts(req.userId);
    res.json({
      ...summary,
      zombies: summary.zombies || [],
      totalZombieFormatted: summary.totalMonthlyWasteFormatted,
      zombieMonthlyFormatted: summary.totalMonthlyWasteFormatted,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno' });
  }
}

export async function detectZombies(req: Request, res: Response): Promise<void> {
  try {
    if (!req.userId) { res.status(401).json({ error: 'No autorizado' }); return; }
    const marked = await detectAndMarkZombies(req.userId);
    res.json({ message: `Se marcaron ${marked} suscripciones como zombie`, marked });
  } catch {
    res.status(500).json({ error: 'Error interno' });
  }
}

export async function toggleZombie(req: Request, res: Response): Promise<void> {
  try {
    if (!req.userId) { res.status(401).json({ error: 'No autorizado' }); return; }
    const { isZombie } = req.body as { isZombie: boolean };
    const sub = await setZombieStatus(req.userId, req.params.id, Boolean(isZombie));
    res.json({ subscription: sub });
  } catch (error) {
    res.status(404).json({ error: error instanceof Error ? error.message : 'Error' });
  }
}

export async function logUsage(req: Request, res: Response): Promise<void> {
  try {
    if (!req.userId) { res.status(401).json({ error: 'No autorizado' }); return; }
    const sub = await registerUsage(req.userId, req.params.id);
    res.json({ message: 'Uso registrado', subscription: sub });
  } catch (error) {
    res.status(404).json({ error: error instanceof Error ? error.message : 'Error' });
  }
}

export async function getAlertMessage(req: Request, res: Response): Promise<void> {
  try {
    if (!req.userId) { res.status(401).json({ error: 'No autorizado' }); return; }
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    const summary = await getZombieAlerts(req.userId);
    res.json({ message: buildZombieAlertMessage(summary, user?.name) });
  } catch {
    res.status(500).json({ error: 'Error interno' });
  }
}
