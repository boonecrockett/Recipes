import React from 'react';
import { createRoot } from 'react-dom/client'; // Import createRoot from react-dom/client
import './styles/index.css';
import App from './components/App';

const rootElement = document.getElementById('root'); // Get the root DOM element
const root = createRoot(rootElement); // Create a root with createRoot

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
