import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export function validate(
  schema: ZodSchema,
  source: 'body' | 'query' | 'params' = 'body'
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const data = req[source];
      const parsed = schema.safeParse(data);

      if (!parsed.success) {
        const errors = formatZodErrors(parsed.error);
        res.status(400).json({
          error: 'Datos inválidos',
          message: 'Revisa los campos e intenta de nuevo',
          details: errors,
        });
        return;
      }

      req[source] = parsed.data;
      next();
    } catch (error) {
      console.error('Error en middleware de validación:', error);
      res.status(500).json({
        error: 'Error interno',
        message: 'No pudimos validar los datos. Intenta de nuevo.',
      });
    }
  };
}

function formatZodErrors(error: ZodError): Record<string, string[]> {
  const fieldErrors: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const path = issue.path.join('.') || 'general';
    if (!fieldErrors[path]) fieldErrors[path] = [];
    fieldErrors[path].push(issue.message);
  }
  return fieldErrors;
}

export function sanitizeBody(req: Request, _res: Response, next: NextFunction): void {
  if (req.body && typeof req.body === 'object') {
    for (const key of Object.keys(req.body)) {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key].replace(/</g, '&lt;').replace(/>/g, '&gt;').trim();
      }
    }
  }
  next();
}
