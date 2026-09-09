import { Request, Response } from 'express';
import {
  createSubscription,
  listSubscriptions,
  getSubscription,
  updateSubscription,
  deleteSubscription,
  getDashboardMetrics,
  updateLiquidSalary,
} from '../services/subscription.service';

export async function create(req: Request, res: Response): Promise<void> {
  try {
    if (!req.userId) { res.status(401).json({ error: 'No autorizado' }); return; }
    const sub = await createSubscription(req.userId, req.body);
    res.status(201).json({ message: 'Suscripción agregada', subscription: sub });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno', message: error instanceof Error ? error.message : 'Error' });
  }
}

export async function list(req: Request, res: Response): Promise<void> {
  try {
    if (!req.userId) { res.status(401).json({ error: 'No autorizado' }); return; }
    const subscriptions = await listSubscriptions(req.userId);
    res.json({ subscriptions });
  } catch (error) {
    res.status(500).json({ error: 'Error interno', message: 'No pudimos cargar suscripciones' });
  }
}

export async function getOne(req: Request, res: Response): Promise<void> {
  try {
    if (!req.userId) { res.status(401).json({ error: 'No autorizado' }); return; }
    const sub = await getSubscription(req.userId, req.params.id as string);
    if (!sub) { res.status(404).json({ error: 'No encontrada' }); return; }
    res.json({ subscription: sub });
  } catch {
    res.status(500).json({ error: 'Error interno' });
  }
}

export async function update(req: Request, res: Response): Promise<void> {
  try {
    if (!req.userId) { res.status(401).json({ error: 'No autorizado' }); return; }
    const sub = await updateSubscription(req.userId, req.params.id as string, req.body);
    res.json({ message: 'Actualizada', subscription: sub });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Error';
    res.status(msg.includes('no encontrada') ? 404 : 500).json({ error: msg });
  }
}

export async function remove(req: Request, res: Response): Promise<void> {
  try {
    if (!req.userId) { res.status(401).json({ error: 'No autorizado' }); return; }
    await deleteSubscription(req.userId, req.params.id as string);
    res.json({ message: 'Suscripción desactivada' });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Error';
    res.status(msg.includes('no encontrada') ? 404 : 500).json({ error: msg });
  }
}

export async function dashboard(req: Request, res: Response): Promise<void> {
  try {
    if (!req.userId) { res.status(401).json({ error: 'No autorizado' }); return; }
    const metrics = await getDashboardMetrics(req.userId);
    res.json({ metrics });
  } catch {
    res.status(500).json({ error: 'Error interno', message: 'No pudimos cargar métricas' });
  }
}

export async function setSalary(req: Request, res: Response): Promise<void> {
  try {
    if (!req.userId) { res.status(401).json({ error: 'No autorizado' }); return; }
    const { liquidSalary } = req.body as { liquidSalary: number };
    await updateLiquidSalary(req.userId, Number(liquidSalary));
    res.json({ message: 'Sueldo actualizado' });
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Error' });
  }
}
