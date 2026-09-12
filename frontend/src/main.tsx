import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

/** Elimina footer de marca si un build viejo aún lo monta */
function purgeBrandFooter() {
  try {
    document.querySelectorAll('footer').forEach((el) => {
      el.remove();
    });
    document.querySelectorAll('body *').forEach((el) => {
      if (!(el instanceof HTMLElement)) return;
      if (el.children.length > 3) return;
      const t = (el.textContent || '').trim();
      if (/^EnQuéGasto\s*[·•|]\s*Chile/.test(t) && t.length < 40) {
        el.remove();
      }
    });
  } catch {
    /* ignore */
  }
}

purgeBrandFooter();
setInterval(purgeBrandFooter, 1000);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
