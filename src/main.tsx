import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// SIMPLEMENTE HEMOS QUITADO LAS ETIQUETAS <React.StrictMode> QUE ENVOLVÍAN A <App />
createRoot(document.getElementById('root')!).render(
  <App />
);