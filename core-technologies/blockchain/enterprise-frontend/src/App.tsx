import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Blockchain from './pages/Blockchain'
import Assets from './pages/Assets'
import SmartContracts from './pages/SmartContracts'
import IoTDevices from './pages/IoTDevices'
import Governance from './pages/Governance'
import Analytics from './pages/Analytics'
import Settings from './pages/Settings'
import Login from './pages/Login'
import { AuthProvider } from './contexts/AuthContext'
import { BlockchainProvider } from './contexts/BlockchainContext'

function App() {
  return (
    <AuthProvider>
      <BlockchainProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="blockchain" element={<Blockchain />} />
            <Route path="assets" element={<Assets />} />
            <Route path="contracts" element={<SmartContracts />} />
            <Route path="iot" element={<IoTDevices />} />
            <Route path="governance" element={<Governance />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </BlockchainProvider>
    </AuthProvider>
  )
}

export default App