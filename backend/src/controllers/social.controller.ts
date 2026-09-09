import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { env, isGoogleConfigured } from '../config/env';
import type { SocialAuthResult } from '../config/passport';

/** Cookie usable entre Vercel (frontend) y Render (API) */
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  // none = cross-site (frontend en Vercel, API en Render)
  sameSite: (env.NODE_ENV === 'production' ? 'none' : 'lax') as 'none' | 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/',
};

function frontendRedirect(path: string): string {
  const base = env.FRONTEND_URL.replace(/\/$/, '');
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

function handleSocialSuccess(req: Request, res: Response): void {
  const result = req.user as SocialAuthResult | undefined;

  if (!result?.user || !result?.tokens) {
    console.error('Social success sin result.user/tokens');
    res.redirect(
      frontendRedirect(
        `/login?message=${encodeURIComponent('No se pudo completar el inicio de sesión con Google')}`
      )
    );
    return;
  }

  try {
    res.cookie('refreshToken', result.tokens.refreshToken, COOKIE_OPTIONS);
  } catch (e) {
    console.warn('No se pudo setear cookie refreshToken:', e);
  }

  const params = new URLSearchParams({
    accessToken: result.tokens.accessToken,
    isNewUser: String(result.isNewUser),
  });

  // /auth/callback en el frontend guarda el token y carga /auth/me
  res.redirect(frontendRedirect(`/auth/callback?${params.toString()}`));
}

function handleSocialError(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  console.error('Error en social login:', err.message);
  const raw = err.message || 'Error desconocido';
  let friendly = 'No se pudo iniciar sesión con Google. Intenta de nuevo.';

  if (/correo|email/i.test(raw)) {
    friendly = raw;
  } else if (/invalid_client|Unauthorized/i.test(raw)) {
    friendly =
      'Credenciales de Google inválidas. Revisa GOOGLE_CLIENT_ID y SECRET en Render.';
  } else if (/redirect_uri/i.test(raw)) {
    friendly =
      'redirect_uri no coincide. En Google Cloud agrega exactamente: ' +
      env.GOOGLE_CALLBACK_URL;
  }

  res.redirect(frontendRedirect(`/login?message=${encodeURIComponent(friendly)}`));
}

export function googleAuth(req: Request, res: Response, next: NextFunction): void {
  if (!isGoogleConfigured()) {
    res.redirect(
      frontendRedirect(
        `/login?message=${encodeURIComponent(
          'Google OAuth no está configurado en el servidor (faltan GOOGLE_CLIENT_ID / SECRET)'
        )}`
      )
    );
    return;
  }

  passport.authenticate('google', {
    session: false,
    scope: ['profile', 'email'],
    prompt: 'select_account',
  })(req, res, next);
}

export function googleCallback(req: Request, res: Response, next: NextFunction): void {
  // Google puede devolver ?error=access_denied|redirect_uri_mismatch
  const oauthError = typeof req.query.error === 'string' ? req.query.error : null;
  const oauthDesc =
    typeof req.query.error_description === 'string' ? req.query.error_description : null;

  if (oauthError) {
    console.error('Google OAuth query error:', oauthError, oauthDesc);
    let msg = 'No se pudo autenticar con Google.';
    if (oauthError === 'access_denied') {
      msg = 'Cancelaste el acceso con Google.';
    } else if (oauthError === 'redirect_uri_mismatch' || /redirect_uri/i.test(oauthDesc || '')) {
      msg =
        'redirect_uri_mismatch: en Google Cloud Console el Redirect URI debe ser exactamente ' +
        env.GOOGLE_CALLBACK_URL;
    } else if (oauthDesc) {
      msg = oauthDesc;
    }
    res.redirect(frontendRedirect(`/login?message=${encodeURIComponent(msg)}`));
    return;
  }

  passport.authenticate('google', {
    session: false,
    failureRedirect: frontendRedirect(
      `/login?message=${encodeURIComponent('No se pudo autenticar con Google')}`
    ),
  })(req, res, (err: unknown) => {
    if (err) return handleSocialError(err as Error, req, res, next);
    handleSocialSuccess(req, res);
  });
}

export function appleAuth(req: Request, res: Response, next: NextFunction): void {
  if (!env.APPLE_CLIENT_ID) {
    res.redirect(
      frontendRedirect(
        `/login?message=${encodeURIComponent('Apple Sign In no está configurado en el servidor')}`
      )
    );
    return;
  }
  passport.authenticate('apple', { session: false, scope: ['name', 'email'] })(req, res, next);
}

export function appleCallback(req: Request, res: Response, next: NextFunction): void {
  passport.authenticate('apple', {
    session: false,
    failureRedirect: frontendRedirect(
      `/login?message=${encodeURIComponent('No se pudo autenticar con Apple')}`
    ),
  })(req, res, (err: unknown) => {
    if (err) return handleSocialError(err as Error, req, res, next);
    handleSocialSuccess(req, res);
  });
}
