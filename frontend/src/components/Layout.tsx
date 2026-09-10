import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import InstallPrompt from './InstallPrompt';
import { LogOut, LayoutDashboard, CreditCard, Ghost } from 'lucide-react';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="relative min-h-[100dvh] bg-[#faf9f8]">
      <div className="eqg-grain pointer-events-none fixed inset-0 z-0 opacity-[0.025]" />
      <header className="sticky top-0 z-40 px-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-4 sm:pt-4">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between rounded-2xl border border-white/60 bg-white/80 px-3 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.12)] backdrop-blur-xl sm:px-4">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight text-slate-900"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-rose-700 text-sm font-semibold text-white shadow-[0_4px_12px_-2px_rgba(225,29,72,0.45)]">
              $
            </span>
            <span className="hidden sm:inline">
              EnQué<span className="text-rose-600">Gasto</span>
            </span>
          </Link>
          <nav className="flex items-center gap-0.5">
            <TopNav to="/dashboard" icon={<LayoutDashboard size={16} strokeWidth={1.75} />}>
              Resumen
            </TopNav>
            <TopNav to="/subscriptions" icon={<CreditCard size={16} strokeWidth={1.75} />}>
              Suscripciones
            </TopNav>
            <TopNav to="/zombies" icon={<Ghost size={16} strokeWidth={1.75} />}>
              Zombies
            </TopNav>
          </nav>
          <div className="flex items-center gap-2">
            <span className="hidden max-w-[120px] truncate text-xs font-medium text-slate-500 md:inline">
              {user?.name || user?.email}
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl p-2 text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-800 active:scale-95"
              title="Cerrar sesión"
              aria-label="Cerrar sesión"
            >
              <LogOut size={17} strokeWidth={1.75} />
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-4 py-5 sm:py-8">
        <Outlet />
      </main>

      <footer className="relative z-10 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-4 text-center text-[11px] text-slate-400">
        EnQuéGasto · Chile 🇨🇱
      </footer>
      <InstallPrompt />
    </div>
  );
}

function TopNav({
  to,
  icon,
  children,
}: {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-semibold transition-all sm:px-3 sm:text-sm ${
          isActive
            ? 'bg-rose-50 text-rose-700 shadow-sm'
            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
        }`
      }
    >
      {icon}
      <span className="hidden sm:inline">{children}</span>
    </NavLink>
  );
}
