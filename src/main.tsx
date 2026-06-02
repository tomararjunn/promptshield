import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Landing from './pages/Landing';
// import './index.css';  ← COMMENTED OUT

// Global styles for the premium glass theme
const globalStyles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    overflow-x: hidden;
    min-height: 100vh;
    background: #0c0c0f;
  }

  html {
    scroll-behavior: smooth;
  }

  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: rgba(124, 92, 252, 0.08);
    border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #7c5cfc, #a78bfa);
    border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, #9b7cfc, #c49bfa);
  }

  @media (max-width: 768px) {
    button {
      -webkit-tap-highlight-color: transparent;
    }

    input, textarea, select, button {
      font-size: 16px !important;
    }
  }

  button:focus-visible,
  textarea:focus-visible {
    outline: 2px solid #7c5cfc;
    outline-offset: 2px;
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
  }

  ::selection {
    background: rgba(124, 92, 252, 0.3);
    color: inherit;
  }

  .glass-panel {
    animation: floatIn 0.4s ease-out;
  }

  @keyframes floatIn {
    from {
      opacity: 0;
      transform: translateY(15px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = globalStyles;
document.head.appendChild(styleSheet);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/app" element={<App />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);