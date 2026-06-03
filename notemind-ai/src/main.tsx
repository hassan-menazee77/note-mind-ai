import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Safely silence benign background WebSocket/HMR disconnect errors native to sandbox preview iframes
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const errorStr = event.reason?.message || event.reason?.toString() || '';
    if (errorStr.toLowerCase().includes('websocket') || errorStr.toLowerCase().includes('connection closed')) {
      event.preventDefault();
      event.stopPropagation();
      console.info('NoteMind SafeGuard: Intercepted and bypassed benign environment-level WebSocket HMR warning.');
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
