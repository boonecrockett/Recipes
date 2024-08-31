import 'react-app-polyfill/stable';
import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

console.warn('React is initializing...'); // Moved earlier in the process

const root = createRoot(document.getElementById('root'));

console.warn('Root created, about to render...'); // Added for more detailed debugging

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

console.warn('React has rendered'); // Kept as is
