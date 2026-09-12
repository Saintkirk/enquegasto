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
    <div className="relative min-h-[100dvh] bg-[#f7f6f4]">
      <div className="eqg-grain pointer-events-none fixed inset-0 z-0" aria-hidden />

      <header className="sticky top-0 z-40 px-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-4 sm:pt-4">
        <div className="eqg-shell mx-auto max-w-6xl">
          <div className="eqg-shell-inner flex h-14 items-center justify-between px-3 sm:px-4">
            <Link
              to="/dashboard"
              className="flex items-center gap-2.5 font-display text-lg font-semibold tracking-tight text-slate-900"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-rose-700 text-sm font-semibold text-white shadow-[0_6px_16px_-4px_rgba(225,29,72,0.5)]">
                $
              </span>
              <span className="hidden sm:inline">
                EnQué<span className="text-rose-600">Gasto</span>
              </span>
            </Link>

            <nav className="flex items-center gap-0.5 rounded-2xl bg-slate-100/70 p-1">
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
                className="eqg-transition rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 active:scale-95"
                title="Cerrar sesion"
                aria-label="Cerrar sesion"
              >
                <LogOut size={17} strokeWidth={1.75} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-4 py-5 pb-24 sm:py-8 sm:pb-8">
        <div className="eqg-enter">
          <Outlet />
        </div>
      </main>

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
        isActive
          ? 'flex items-center gap-1.5 rounded-xl bg-white px-2.5 py-1.5 text-xs font-semibold text-rose-700 shadow-sm sm:px-3 sm:text-sm'
          : 'flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-500 transition-colors hover:text-slate-800 sm:px-3 sm:text-sm'
      }
    >
      {icon}
      <span className="hidden sm:inline">{children}</span>
    </NavLink>
  );
}
