import App from '@/App';
import log from 'loglevel';
import { createRoot } from 'react-dom/client';
import 'virtual:svg-icons-register';

const setLogLevel = () => {
  if (import.meta.env.VITE_PUBLIC_LOG_LEVEL) {
    log.setLevel(import.meta.env.VITE_PUBLIC_LOG_LEVEL);
    return;
  }

  log.setLevel(import.meta.env.MODE === 'development' ? 'debug' : 'warn');
};

setLogLevel();

const root = createRoot(document.getElementById('root'));

root.render(<App />);
