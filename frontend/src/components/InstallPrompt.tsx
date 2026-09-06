import { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';

export default function InstallPrompt() {
  const [deferred, setDeferred] = useState<{
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: string }>;
  } | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferred(e as unknown as {
        prompt: () => Promise<void>;
        userChoice: Promise<{ outcome: string }>;
      });
      if (!window.matchMedia('(display-mode: standalone)').matches) {
        setVisible(true);
      }
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    const { outcome } = await deferred.userChoice;
    if (outcome === 'accepted') setVisible(false);
    setDeferred(null);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 sm:left-auto sm:right-4 sm:max-w-[340px]">
      <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/90 p-1 shadow-[0_20px_50px_-16px_rgba(15,23,42,0.55)] backdrop-blur-xl">
        <div className="relative overflow-hidden rounded-[calc(1.5rem-0.25rem)] bg-gradient-to-br from-slate-900 to-slate-950 px-4 py-4">
          <div
            className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-40"
            style={{ background: 'radial-gradient(circle, rgba(225,29,72,0.45), transparent 70%)' }}
          />
          <div className="relative flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-rose-700 text-lg font-semibold text-white shadow-[0_8px_20px_-6px_rgba(225,29,72,0.6)]">$</div>
            <div className="min-w-0 flex-1">
              <p className="font-display text-sm font-semibold tracking-tight text-white">Instala EnQuéGasto</p>
              <p className="mt-0.5 text-xs leading-relaxed text-slate-400">En tu pantalla de inicio, como una app nativa</p>
              <button
                onClick={install}
                className="group mt-3 inline-flex items-center gap-2 rounded-full bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-[0_10px_24px_-8px_rgba(225,29,72,0.55)] transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-rose-500 active:scale-[0.98]"
              >
                <Download size={14} strokeWidth={2} />
                Instalar
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/15 transition-transform group-hover:translate-x-0.5">→</span>
              </button>
            </div>
            <button onClick={() => setVisible(false)} className="rounded-xl p-1.5 text-slate-500 transition-colors hover:bg-white/5 hover:text-slate-300" aria-label="Cerrar">
              <X size={16} strokeWidth={1.75} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
