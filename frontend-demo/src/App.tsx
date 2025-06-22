import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride'

// Pages
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import PaymentGateway from './pages/PaymentGateway'
import HospitalManagement from './pages/HospitalManagement'
import SmartHospitality from './pages/SmartHospitality'
import IoTPlatform from './pages/IoTPlatform'
import LLMPlatform from './pages/LLMPlatform'

// Components
import Layout from './components/Layout'
import StickyNote from './components/StickyNote'

// Store
import { useDemoStore } from './stores/demoStore'

const tourSteps: Step[] = [
  {
    target: '.tour-welcome',
    content: 'Welcome to NCQ Platform Demo! This interactive tour will guide you through our key features and capabilities.',
    placement: 'center',
    disableBeacon: true,
  },
  {
    target: '.tour-navigation',
    content: 'Use the navigation menu to explore different modules of the NCQ Platform. Each module showcases unique capabilities.',
    placement: 'bottom',
  },
  {
    target: '.tour-dashboard',
    content: 'The dashboard provides real-time insights and key metrics across all platform services.',
    placement: 'bottom',
  },
  {
    target: '.tour-payment',
    content: 'Our Payment Gateway supports multiple payment methods including mada, Visa, Mastercard, and digital wallets.',
    placement: 'left',
  },
  {
    target: '.tour-notifications',
    content: 'Stay updated with real-time notifications and alerts from all platform services.',
    placement: 'bottom-start',
  },
  {
    target: '.tour-sticky-note',
    content: 'Demo credentials are available here for quick access. Click to copy!',
    placement: 'left',
  },
]

function App() {
  const [runTour, setRunTour] = useState(false)
  const { setTourCompleted, tourCompleted } = useDemoStore()

  useEffect(() => {
    // Start tour automatically on first visit
    const hasSeenTour = localStorage.getItem('ncq-demo-tour-seen')
    if (!hasSeenTour) {
      setTimeout(() => setRunTour(true), 1000)
    }
  }, [])

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED]

    if (finishedStatuses.includes(status)) {
      setRunTour(false)
      setTourCompleted(true)
      localStorage.setItem('ncq-demo-tour-seen', 'true')
    }
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Joyride
          steps={tourSteps}
          run={runTour}
          continuous
          showProgress
          showSkipButton
          callback={handleJoyrideCallback}
          styles={{
            options: {
              primaryColor: '#0284c7',
              zIndex: 10000,
            },
            tooltip: {
              borderRadius: 8,
              padding: 20,
            },
            tooltipContent: {
              fontSize: 16,
            },
            buttonNext: {
              backgroundColor: '#0284c7',
              borderRadius: 6,
              padding: '10px 20px',
            },
            buttonBack: {
              marginRight: 10,
              borderRadius: 6,
            },
            buttonSkip: {
              color: '#64748b',
            },
          }}
        />

        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
          <Route path="/payment-gateway" element={<Layout><PaymentGateway /></Layout>} />
          <Route path="/hospital" element={<Layout><HospitalManagement /></Layout>} />
          <Route path="/hospitality" element={<Layout><SmartHospitality /></Layout>} />
          <Route path="/iot" element={<Layout><IoTPlatform /></Layout>} />
          <Route path="/ai" element={<Layout><LLMPlatform /></Layout>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <StickyNote />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              style: {
                background: '#10b981',
              },
            },
            error: {
              style: {
                background: '#ef4444',
              },
            },
          }}
        />
      </div>
    </Router>
  )
}

export default App