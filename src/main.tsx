import React from 'react'
import ReactDOM from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    <Toaster
      containerClassName="toaster font-serif"
      toastOptions={{
        className: 'text-gray-700 bg-yellow-50',
      }}
    />
  </React.StrictMode>,
)
