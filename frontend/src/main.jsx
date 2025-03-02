import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { AuthProvider } from './context/AuthContext'

// Clear local storage when the page is refreshed
if (window.performance && window.performance.getEntriesByType) {
  const navigationEntries = window.performance.getEntriesByType('navigation');
  if (navigationEntries.length > 0 && navigationEntries[0].type === 'reload') {
    localStorage.clear();
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
