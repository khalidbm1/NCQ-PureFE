import React from 'react'
import ReactDOM from 'react-dom/client'

function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#0284c7' }}>🚀 NCQ Platform Demo</h1>
      <p>The demo is loading successfully!</p>
      <div style={{ 
        padding: '20px', 
        backgroundColor: '#f3f4f6', 
        borderRadius: '8px',
        marginTop: '20px'
      }}>
        <p>✅ React is working</p>
        <p>✅ TypeScript is working</p>
        <p>✅ Vite is serving the files</p>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />)