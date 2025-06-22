import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Menu,
  Search,
  Bell,
  User,
  Settings,
  LogOut,
  Moon,
  Sun,
  Zap,
  CreditCard,
  FileText,
  HelpCircle
} from 'lucide-react'
import { useAuthStore } from '../../stores/auth'
import { Button } from '../ui/button'
import { cn, getInitials, generateAvatarGradient } from '../../lib/utils'
import { LanguageSwitcher } from './LanguageSwitcher'

interface HeaderProps {
  onMenuClick?: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const [searchValue, setSearchValue] = useState('')
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('theme') === 'dark' || 
    (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
  )
  
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light')
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/auth/login')
  }

  const notifications = [
    { id: 1, title: 'File uploaded successfully', time: '2 min ago', unread: true },
    { id: 2, title: 'Payment processed', time: '5 min ago', unread: true },
    { id: 3, title: 'Storage limit warning', time: '1 hour ago', unread: false },
  ]

  const unreadCount = notifications.filter(n => n.unread).length

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          {onMenuClick && (
            <button
              onClick={onMenuClick}
              className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="hidden sm:block text-xl font-bold">NCQ Platform</span>
          </Link>

          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search files, docs..."
              className="w-64 pl-10 pr-3 py-2 border border-input rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-2">
          {/* Search button for mobile */}
          <button className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent md:hidden">
            <Search className="w-5 h-5" />
          </button>

          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent"
          >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Language switcher */}
          <LanguageSwitcher />

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent relative"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs bg-primary text-primary-foreground rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-popover rounded-lg shadow-lg border z-50">
                <div className="p-4 border-b">
                  <h3 className="font-semibold">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        "p-4 border-b last:border-b-0 hover:bg-accent cursor-pointer",
                        notification.unread && "bg-muted/50"
                      )}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium">{notification.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                        </div>
                        {notification.unread && (
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t">
                  <Button variant="ghost" className="w-full text-sm">
                    View all notifications
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 p-2 text-foreground hover:bg-accent rounded-lg"
            >
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium bg-gradient-to-r",
                generateAvatarGradient(user?.name || 'User')
              )}>
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                ) : (
                  getInitials(user?.name || 'User')
                )}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-sm font-medium">{user?.name}</div>
                <div className="text-xs text-muted-foreground">{user?.subscription?.plan || 'Free'}</div>
              </div>
            </button>

            {/* User dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-popover rounded-lg shadow-lg border z-50">
                <div className="p-2">
                  <div className="px-3 py-2 text-sm">
                    <div className="font-medium">{user?.name}</div>
                    <div className="text-muted-foreground">{user?.email}</div>
                  </div>
                  <hr className="my-2" />
                  
                  <Link
                    to="/profile"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center w-full px-3 py-2 text-sm hover:bg-accent rounded-md"
                  >
                    <User className="w-4 h-4 mr-3" />
                    Profile
                  </Link>
                  
                  <Link
                    to="/subscription"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center w-full px-3 py-2 text-sm hover:bg-accent rounded-md"
                  >
                    <CreditCard className="w-4 h-4 mr-3" />
                    Billing & Plans
                  </Link>
                  
                  <Link
                    to="/api-keys"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center w-full px-3 py-2 text-sm hover:bg-accent rounded-md"
                  >
                    <FileText className="w-4 h-4 mr-3" />
                    API Keys
                  </Link>
                  
                  <Link
                    to="/settings"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center w-full px-3 py-2 text-sm hover:bg-accent rounded-md"
                  >
                    <Settings className="w-4 h-4 mr-3" />
                    Settings
                  </Link>
                  
                  <Link
                    to="/help"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center w-full px-3 py-2 text-sm hover:bg-accent rounded-md"
                  >
                    <HelpCircle className="w-4 h-4 mr-3" />
                    Help & Support
                  </Link>
                  
                  <hr className="my-2" />
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-md"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Click outside handlers */}
        {(showUserMenu || showNotifications) && (
          <div
            className="fixed inset-0 z-30"
            onClick={() => {
              setShowUserMenu(false)
              setShowNotifications(false)
            }}
          />
        )}
      </div>
    </header>
  )
}