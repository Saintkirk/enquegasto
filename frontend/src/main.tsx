import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

function stripGhostFooter() {
  try {
    document.querySelectorAll('footer').forEach((el) => el.remove());
  } catch {
    /* ignore */
  }
}

stripGhostFooter();
setTimeout(stripGhostFooter, 500);
setTimeout(stripGhostFooter, 2000);

const root = document.getElementById('root');
if (!root) {
  throw new Error('No se encontró #root');
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>
);
