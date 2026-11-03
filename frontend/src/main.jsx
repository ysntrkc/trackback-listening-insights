import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import App from './App'
import './index.css'
import { AuthProvider } from './context/AuthContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        {/* Never send the /auth URL: it carries the login token */}
        <Analytics beforeSend={(event) => (event.url.includes('/auth') ? null : event)} />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
