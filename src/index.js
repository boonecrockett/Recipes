import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';  // This line should be present
import App from './App';
//import reportWebVitals from './reportWebVitals';
console.log('React is loading...'); // Add this line

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
console.log('React has rendered'); // Add this line
