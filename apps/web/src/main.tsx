import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Remove the loading screen once React is ready
const removeLoadingScreen = () => {
  const loadingContainer = document.querySelector('.loading-container');
  if (loadingContainer) {
    loadingContainer.style.opacity = '0';
    loadingContainer.style.transition = 'opacity 0.3s ease-out';
    setTimeout(() => {
      loadingContainer.remove();
    }, 300);
  }
};

// Error boundary for development
const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
  console.error('React Error Boundary:', error, errorInfo);
};

// Create root and render app
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Remove loading screen after a brief delay to ensure smooth transition
setTimeout(removeLoadingScreen, 200);

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  // Prevent the default browser behavior
  event.preventDefault();
});
