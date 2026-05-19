import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration'; // أضفنا هذا السطر
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// التغيير هنا: بدال unregister خليناها register
// هذا السطر هو اللي يخلي المتصفح يثبت الكود كـ App على الجوال
serviceWorkerRegistration.register(); 

reportWebVitals();