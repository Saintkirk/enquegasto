import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

/** Quita cualquier footer residual (build cache / SW viejo) */
function removeBrandFooter() {
  try {
    document.querySelectorAll('footer').forEach((el) => el.remove());
    document.querySelectorAll('body *').forEach((el) => {
      if (!(el instanceof HTMLElement)) return;
      if (el.children.length > 2) return;
      const t = (el.textContent || '').replace(/\s+/g, ' ').trim();
      if (/EnQuéGasto\s*[·•|]\s*Chile/i.test(t) && t.length < 48) {
        el.remove();
      }
    });
  } catch {
    /* ignore */
  }
}

removeBrandFooter();
const obs = new MutationObserver(() => removeBrandFooter());
if (typeof document !== 'undefined' && document.body) {
  obs.observe(document.body, { childList: true, subtree: true });
}
setInterval(removeBrandFooter, 1500);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
