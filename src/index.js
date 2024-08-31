import 'react-app-polyfill/stable';
import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

console.warn('React is initializing...'); 

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const root = createRoot(rootElement);

console.warn('Root created, about to render...'); 

try {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.warn('React has rendered');
} catch (error) {
  console.error('Error during rendering:', error);
}
