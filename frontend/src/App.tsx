import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import LoadingScreen from './components/LoadingScreen';

/** Rutas publicas — chunk propio (login no arrastra Recharts ni dashboard) */
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const AuthCallback = lazy(() => import('./pages/AuthCallback'));

/** Rutas privadas — cada pagina en su chunk */
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Subscriptions = lazy(() => import('./pages/Subscriptions'));
const Zombies = lazy(() => import('./pages/Zombies'));
const Onboarding = lazy(() => import('./pages/Onboarding'));

function RouteFallback() {
  return <LoadingScreen fullScreen message="Cargando…" />;
}

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen message="Preparando tu sesion…" />;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

/** Tras login: si no hay sueldo líquido, ir a bienvenida/onboarding (informe §6.2) */
function RequireSalary({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen message="Preparando tu sesion…" />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.liquidSalary == null || user.liquidSalary <= 0) {
    return <Navigate to="/onboarding" replace />;
  }
  return <>{children}</>;
}

function OnboardingRoute() {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen message="Preparando tu sesion…" />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.liquidSalary != null && user.liquidSalary > 0) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Onboarding />;
}

function PublicOnly({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen message="Un segundo…" />;
  if (user) {
    if (user.liquidSalary == null || user.liquidSalary <= 0) {
      return <Navigate to="/onboarding" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route
              path="/login"
              element={
                <PublicOnly>
                  <Login />
                </PublicOnly>
              }
            />
            <Route
              path="/register"
              element={
                <PublicOnly>
                  <Register />
                </PublicOnly>
              }
            />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route
              path="/auth/error"
              element={
                <PublicOnly>
                  <Login />
                </PublicOnly>
              }
            />
            <Route path="/onboarding" element={<OnboardingRoute />} />
            <Route
              element={
                <PrivateRoute>
                  <RequireSalary>
                    <Layout />
                  </RequireSalary>
                </PrivateRoute>
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/subscriptions" element={<Subscriptions />} />
              <Route path="/zombies" element={<Zombies />} />
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}
