import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './i18n/config';
import './autoIndexProperties';

// Strip Facebook's legacy #_=_ fragment
if (window.location.hash === '#_=_') {
  window.history.replaceState(null, '', window.location.pathname + window.location.search);
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
