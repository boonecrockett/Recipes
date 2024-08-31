import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

console.warn('React is loading...'); // Changed to warn

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

console.warn('React has rendered'); // Changed to warn
