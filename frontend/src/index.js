import React from 'react';
import ReactDOM from 'react-dom/client'; // Use ReactDOM from 'react-dom/client' for React 18
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap styles

// Find the root element in the HTML file
const rootElement = document.getElementById('root');

// Create a root and render the app
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
