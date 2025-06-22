import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

interface MicroFrontendApp {
  name: string
  url: string
  scope: string
  module: string
  loaded: boolean
  error?: Error
}

interface MicroFrontendContextType {
  apps: Map<string, MicroFrontendApp>
  registerApp: (app: Omit<MicroFrontendApp, 'loaded' | 'error'>) => void
  unregisterApp: (name: string) => void
  loadApp: (name: string) => Promise<any>
  isAppLoaded: (name: string) => boolean
  getAppError: (name: string) => Error | undefined
}

const MicroFrontendContext = createContext<MicroFrontendContextType | undefined>(undefined)

// Global container cache for loaded micro-frontends
const containerCache = new Map<string, any>()

// Load remote module dynamically
async function loadRemoteModule(url: string, scope: string, module: string) {
  // Check if already loaded
  if (containerCache.has(scope)) {
    const container = containerCache.get(scope)
    const factory = await container.get(module)
    return factory()
  }

  // Load the remote entry
  await new Promise<void>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = url
    script.type = 'text/javascript'
    script.async = true
    
    script.onload = () => {
      // @ts-ignore
      const container = window[scope]
      if (!container) {
        reject(new Error(`Container ${scope} not found`))
        return
      }
      containerCache.set(scope, container)
      resolve()
    }
    
    script.onerror = () => {
      reject(new Error(`Failed to load remote entry: ${url}`))
    }
    
    // Check if script already exists
    const existingScript = document.querySelector(`script[src="${url}"]`)
    if (existingScript) {
      if (containerCache.has(scope)) {
        resolve()
      } else {
        existingScript.addEventListener('load', () => resolve())
        existingScript.addEventListener('error', () => reject(new Error(`Failed to load remote entry: ${url}`)))
      }
    } else {
      document.head.appendChild(script)
    }
  })

  // Get the module from the container
  // @ts-ignore
  const container = window[scope]
  const factory = await container.get(module)
  return factory()
}

export function MicroFrontendProvider({ children }: { children: React.ReactNode }) {
  const [apps, setApps] = useState<Map<string, MicroFrontendApp>>(new Map())

  const registerApp = useCallback((app: Omit<MicroFrontendApp, 'loaded' | 'error'>) => {
    setApps(prev => {
      const next = new Map(prev)
      next.set(app.name, { ...app, loaded: false })
      return next
    })
  }, [])

  const unregisterApp = useCallback((name: string) => {
    setApps(prev => {
      const next = new Map(prev)
      next.delete(name)
      return next
    })
  }, [])

  const loadApp = useCallback(async (name: string) => {
    const app = apps.get(name)
    if (!app) {
      throw new Error(`Micro-frontend app "${name}" not registered`)
    }

    if (app.loaded && !app.error) {
      // Already loaded successfully
      return loadRemoteModule(app.url, app.scope, app.module)
    }

    try {
      const module = await loadRemoteModule(app.url, app.scope, app.module)
      
      // Update app status
      setApps(prev => {
        const next = new Map(prev)
        const updatedApp = next.get(name)
        if (updatedApp) {
          next.set(name, { ...updatedApp, loaded: true, error: undefined })
        }
        return next
      })
      
      return module
    } catch (error) {
      // Update app error status
      setApps(prev => {
        const next = new Map(prev)
        const updatedApp = next.get(name)
        if (updatedApp) {
          next.set(name, { ...updatedApp, loaded: false, error: error as Error })
        }
        return next
      })
      
      throw error
    }
  }, [apps])

  const isAppLoaded = useCallback((name: string) => {
    const app = apps.get(name)
    return app?.loaded === true && !app.error
  }, [apps])

  const getAppError = useCallback((name: string) => {
    return apps.get(name)?.error
  }, [apps])

  // Register default micro-frontends based on environment
  useEffect(() => {
    if (process.env.REACT_APP_ENABLE_MFE !== 'true') return

    const defaultApps = [
      {
        name: 'auth',
        url: `${process.env.REACT_APP_MFE_AUTH_URL}/remoteEntry.js`,
        scope: 'auth',
        module: './AuthApp',
      },
      {
        name: 'payment',
        url: `${process.env.REACT_APP_MFE_PAYMENT_URL}/remoteEntry.js`,
        scope: 'payment',
        module: './PaymentApp',
      },
      {
        name: 'analytics',
        url: `${process.env.REACT_APP_MFE_ANALYTICS_URL}/remoteEntry.js`,
        scope: 'analytics',
        module: './AnalyticsApp',
      },
    ]

    defaultApps.forEach(app => {
      if (app.url && app.url !== 'undefined/remoteEntry.js') {
        registerApp(app)
      }
    })
  }, [registerApp])

  const value: MicroFrontendContextType = {
    apps,
    registerApp,
    unregisterApp,
    loadApp,
    isAppLoaded,
    getAppError,
  }

  return (
    <MicroFrontendContext.Provider value={value}>
      {children}
    </MicroFrontendContext.Provider>
  )
}

export function useMicroFrontend() {
  const context = useContext(MicroFrontendContext)
  if (context === undefined) {
    throw new Error('useMicroFrontend must be used within a MicroFrontendProvider')
  }
  return context
}

// HOC for lazy loading micro-frontends
export function withMicroFrontend<P extends object>(
  appName: string,
  fallback?: React.ComponentType<any>
) {
  return function MicroFrontendComponent(props: P) {
    const { loadApp, isAppLoaded, getAppError } = useMicroFrontend()
    const [Component, setComponent] = useState<React.ComponentType<P> | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
      let mounted = true

      const loadComponent = async () => {
        try {
          setLoading(true)
          const module = await loadApp(appName)
          
          if (mounted) {
            setComponent(() => module.default || module)
            setError(null)
          }
        } catch (err) {
          if (mounted) {
            setError(err as Error)
            console.error(`Failed to load micro-frontend "${appName}":`, err)
          }
        } finally {
          if (mounted) {
            setLoading(false)
          }
        }
      }

      loadComponent()

      return () => {
        mounted = false
      }
    }, [appName, loadApp])

    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ncq-primary-600"></div>
        </div>
      )
    }

    if (error || !Component) {
      if (fallback) {
        const FallbackComponent = fallback
        return <FallbackComponent {...props} error={error} />
      }

      return (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <div className="text-red-600 mb-2">Failed to load micro-frontend</div>
          <div className="text-sm text-gray-600">{error?.message || 'Unknown error'}</div>
        </div>
      )
    }

    return <Component {...props} />
  }
}