import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { 
  X, ChevronRight, ChevronLeft, Play, Pause, RotateCcw,
  CheckCircle, Circle, Info
} from 'lucide-react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Progress } from './ui/progress'
import { toast } from 'sonner'

interface JourneyStep {
  id: string
  title: string
  description: string
  route: string
  selector?: string
  action?: () => void
  position?: 'top' | 'bottom' | 'left' | 'right'
}

const journeys = {
  fileManagement: {
    id: 'file-management',
    name: 'File Management Workflow',
    description: 'Learn how to upload, organize, share, and analyze your files',
    steps: [
      {
        id: 'dashboard',
        title: 'Welcome to Your Dashboard',
        description: 'This is your central hub. From here you can see your recent files and quick stats.',
        route: '/dashboard',
      },
      {
        id: 'upload',
        title: 'Upload Your First File',
        description: 'Click on Upload Files to add your documents, images, or videos to the platform.',
        route: '/upload',
      },
      {
        id: 'files',
        title: 'Manage Your Files',
        description: 'View all your uploaded files, organize them, and share with others.',
        route: '/files',
      },
      {
        id: 'analytics',
        title: 'Track Your Analytics',
        description: 'See how your files are performing with detailed analytics and insights.',
        route: '/analytics',
      }
    ]
  },
  apiIntegration: {
    id: 'api-integration',
    name: 'API Integration Journey',
    description: 'Set up API access and integrate with your applications',
    steps: [
      {
        id: 'api-keys',
        title: 'Create Your API Key',
        description: 'Generate a secure API key to integrate our services with your applications.',
        route: '/api-keys',
      },
      {
        id: 'test-api',
        title: 'Test Your Integration',
        description: 'Use our interactive API explorer to test endpoints and see responses.',
        route: '/api-keys',
        action: () => toast.info('API Explorer would open here'),
      },
      {
        id: 'monitor',
        title: 'Monitor API Usage',
        description: 'Track your API calls and monitor performance in the analytics dashboard.',
        route: '/analytics',
      }
    ]
  },
  teamCollaboration: {
    id: 'team-collaboration',
    name: 'Team Collaboration',
    description: 'Invite team members and collaborate on files',
    steps: [
      {
        id: 'team',
        title: 'Invite Team Members',
        description: 'Add your colleagues to collaborate on projects together.',
        route: '/team',
      },
      {
        id: 'share-files',
        title: 'Share Files with Team',
        description: 'Select files and share them with specific team members.',
        route: '/files',
      },
      {
        id: 'manage-permissions',
        title: 'Manage Permissions',
        description: 'Control who can view, edit, or download your shared files.',
        route: '/team',
      }
    ]
  }
}

export function UserJourney() {
  const [isActive, setIsActive] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [currentJourney, setCurrentJourney] = useState<keyof typeof journeys | null>(null)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<string[]>([])
  const [showSelector, setShowSelector] = useState(true)
  
  const location = useLocation()
  const navigate = useNavigate()

  const journey = currentJourney ? journeys[currentJourney] : null
  const currentStep = journey ? journey.steps[currentStepIndex] : null
  const progress = journey ? ((currentStepIndex + 1) / journey.steps.length) * 100 : 0

  useEffect(() => {
    // Check if we should show journey on first visit
    const hasSeenJourney = localStorage.getItem('hasSeenJourney')
    if (!hasSeenJourney && location.pathname === '/dashboard') {
      setShowSelector(true)
    }
  }, [])

  useEffect(() => {
    // Auto-advance when user navigates to the correct route
    if (currentStep && location.pathname === currentStep.route && !isPaused) {
      const timer = setTimeout(() => {
        handleNext()
      }, 3000) // Wait 3 seconds before auto-advancing
      return () => clearTimeout(timer)
    }
  }, [location.pathname, currentStep, isPaused])

  const startJourney = (journeyId: keyof typeof journeys) => {
    setCurrentJourney(journeyId)
    setCurrentStepIndex(0)
    setCompletedSteps([])
    setIsActive(true)
    setShowSelector(false)
    setIsPaused(false)
    
    const firstStep = journeys[journeyId].steps[0]
    if (location.pathname !== firstStep.route) {
      navigate(firstStep.route)
    }
    
    localStorage.setItem('hasSeenJourney', 'true')
    toast.success(`Started ${journeys[journeyId].name}`)
  }

  const handleNext = () => {
    if (!journey || !currentStep) return
    
    setCompletedSteps([...completedSteps, currentStep.id])
    
    if (currentStepIndex < journey.steps.length - 1) {
      const nextIndex = currentStepIndex + 1
      setCurrentStepIndex(nextIndex)
      const nextStep = journey.steps[nextIndex]
      
      if (nextStep.action) {
        nextStep.action()
      }
      
      if (location.pathname !== nextStep.route) {
        navigate(nextStep.route)
      }
    } else {
      // Journey completed
      toast.success('🎉 Journey completed!', {
        description: 'You\'ve successfully completed the ' + journey.name
      })
      handleStop()
    }
  }

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1)
      const prevStep = journey!.steps[currentStepIndex - 1]
      if (location.pathname !== prevStep.route) {
        navigate(prevStep.route)
      }
    }
  }

  const handleStop = () => {
    setIsActive(false)
    setCurrentJourney(null)
    setCurrentStepIndex(0)
    setCompletedSteps([])
    setIsPaused(false)
  }

  const handleReset = () => {
    setCurrentStepIndex(0)
    setCompletedSteps([])
    if (journey) {
      const firstStep = journey.steps[0]
      if (location.pathname !== firstStep.route) {
        navigate(firstStep.route)
      }
    }
  }

  // Journey Selector
  if (showSelector && !isActive) {
    return (
      <div className="fixed bottom-20 right-4 z-40 max-w-sm">
        <Card className="p-4 shadow-lg border-primary/20">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Info className="w-4 h-4" />
              Start a Guided Tour
            </h3>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => setShowSelector(false)}
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Choose a workflow to learn how to use the platform
          </p>
          <div className="space-y-2">
            {Object.entries(journeys).map(([key, journey]) => (
              <Button
                key={key}
                variant="outline"
                className="w-full justify-start text-left h-auto p-3"
                onClick={() => startJourney(key as keyof typeof journeys)}
              >
                <div>
                  <div className="font-medium">{journey.name}</div>
                  <div className="text-xs text-muted-foreground">{journey.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </Card>
      </div>
    )
  }

  // Active Journey UI
  if (isActive && journey && currentStep) {
    return (
      <div className="fixed bottom-20 right-4 z-40 max-w-md">
        <Card className="p-4 shadow-lg border-primary/20">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-sm">{journey.name}</h3>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => setIsPaused(!isPaused)}
              >
                {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={handleReset}
              >
                <RotateCcw className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={handleStop}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>

          {/* Progress */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              {journey.steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`flex-1 h-1 rounded-full transition-colors ${
                    index <= currentStepIndex ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Step {currentStepIndex + 1} of {journey.steps.length}
            </p>
          </div>

          {/* Current Step */}
          <div className="mb-4">
            <h4 className="font-medium mb-1">{currentStep.title}</h4>
            <p className="text-sm text-muted-foreground">{currentStep.description}</p>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevious}
              disabled={currentStepIndex === 0}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            <Button
              size="sm"
              onClick={handleNext}
            >
              {currentStepIndex === journey.steps.length - 1 ? 'Finish' : 'Next'}
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  // Floating button to restart journey
  if (!showSelector && !isActive) {
    return (
      <Button
        className="fixed bottom-20 right-4 z-40 rounded-full h-12 w-12 p-0 shadow-lg"
        onClick={() => setShowSelector(true)}
      >
        <Info className="w-5 h-5" />
      </Button>
    )
  }

  return null
}