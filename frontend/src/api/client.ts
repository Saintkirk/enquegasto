import axios from 'axios';

/**
 * Cliente HTTP EnQuéGasto
 * - Dev (Vite): proxy /api → localhost:3001
 * - Producción / APK: VITE_API_URL (ej. https://enquegasto-api.onrender.com)
 */
const rawBase =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') || '';

const baseURL = rawBase ? `${rawBase}/api` : '/api';

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
  timeout: 25000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && original && !(original as { _retry?: boolean })._retry) {
      (original as { _retry?: boolean })._retry = true;
      try {
        const refreshUrl = rawBase ? `${rawBase}/api/auth/refresh` : '/api/auth/refresh';
        const { data } = await axios.post(refreshUrl, {}, { withCredentials: true });
        localStorage.setItem('accessToken', data.accessToken);
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original);
      } catch {
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export function getApiBaseUrl(): string {
  return rawBase || '';
}

export default api;
