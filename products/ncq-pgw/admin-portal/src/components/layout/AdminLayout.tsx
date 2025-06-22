'use client'

import { ReactNode, useState } from 'react'
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import {
  Menu as MenuIcon,
  Dashboard,
  CreditCard,
  People,
  Assessment,
  Settings,
  Security,
  Receipt,
  Webhook,
  ExpandLess,
  ExpandMore,
  Notifications,
  AccountCircle,
  Logout,
  DarkMode,
  LightMode,
  Store,
  Code,
  Support,
  Gavel,
} from '@mui/icons-material'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/store'
import { toggleSidebar, setTheme } from '@/store/slices/uiSlice'

const drawerWidth = 280

interface AdminLayoutProps {
  children: ReactNode
}

interface NavItem {
  title: string
  path?: string
  icon: ReactNode
  children?: NavItem[]
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    path: '/',
    icon: <Dashboard />,
  },
  {
    title: 'Transactions',
    icon: <CreditCard />,
    children: [
      { title: 'All Transactions', path: '/transactions', icon: <Receipt /> },
      { title: 'Refunds', path: '/transactions/refunds', icon: <Receipt /> },
      { title: 'Disputes', path: '/transactions/disputes', icon: <Gavel /> },
    ],
  },
  {
    title: 'Merchants',
    icon: <Store />,
    children: [
      { title: 'All Merchants', path: '/merchants', icon: <People /> },
      { title: 'Applications', path: '/merchants/applications', icon: <Receipt /> },
      { title: 'Risk Management', path: '/merchants/risk', icon: <Security /> },
    ],
  },
  {
    title: 'Analytics',
    path: '/analytics',
    icon: <Assessment />,
  },
  {
    title: 'Developer',
    icon: <Code />,
    children: [
      { title: 'API Keys', path: '/developer/api-keys', icon: <Security /> },
      { title: 'Webhooks', path: '/developer/webhooks', icon: <Webhook /> },
      { title: 'API Logs', path: '/developer/logs', icon: <Receipt /> },
    ],
  },
  {
    title: 'Compliance',
    icon: <Security />,
    children: [
      { title: 'PCI DSS', path: '/compliance/pci-dss', icon: <Security /> },
      { title: 'SAMA', path: '/compliance/sama', icon: <Gavel /> },
      { title: 'Audit Logs', path: '/compliance/audit', icon: <Receipt /> },
    ],
  },
  {
    title: 'Support',
    path: '/support',
    icon: <Support />,
  },
  {
    title: 'Settings',
    path: '/settings',
    icon: <Settings />,
  },
]

export function AdminLayout({ children }: AdminLayoutProps) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const router = useRouter()
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const dispatch = useDispatch()
  const { sidebarOpen, theme: appTheme } = useSelector((state: RootState) => state.ui)
  const { unreadCount } = useSelector((state: RootState) => state.notification)
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null)
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleProfileMenuClose = () => {
    setAnchorEl(null)
  }

  const handleNotificationMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget)
  }

  const handleNotificationMenuClose = () => {
    setNotificationAnchorEl(null)
  }

  const handleLogout = async () => {
    await logout()
    handleProfileMenuClose()
  }

  const handleThemeToggle = () => {
    dispatch(setTheme(appTheme === 'light' ? 'dark' : 'light'))
  }

  const handleNavItemClick = (item: NavItem) => {
    if (item.path) {
      router.push(item.path)
      if (isMobile) {
        dispatch(toggleSidebar())
      }
    } else if (item.children) {
      setExpandedItems((prev) =>
        prev.includes(item.title)
          ? prev.filter((title) => title !== item.title)
          : [...prev, item.title]
      )
    }
  }

  const isItemActive = (item: NavItem): boolean => {
    if (item.path) {
      return pathname === item.path
    }
    if (item.children) {
      return item.children.some((child) => child.path === pathname)
    }
    return false
  }

  const renderNavItem = (item: NavItem, depth = 0) => (
    <div key={item.title}>
      <ListItem disablePadding sx={{ mb: 0.5 }}>
        <ListItemButton
          onClick={() => handleNavItemClick(item)}
          selected={isItemActive(item)}
          sx={{
            borderRadius: 1,
            mx: 1,
            pl: 2 + depth * 2,
            '&.Mui-selected': {
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
              },
            },
          }}
        >
          <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
            {item.icon}
          </ListItemIcon>
          <ListItemText primary={item.title} />
          {item.children &&
            (expandedItems.includes(item.title) ? <ExpandLess /> : <ExpandMore />)}
        </ListItemButton>
      </ListItem>
      {item.children && (
        <Collapse in={expandedItems.includes(item.title)} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {item.children.map((child) => renderNavItem(child, depth + 1))}
          </List>
        </Collapse>
      )}
    </div>
  )

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar sx={{ px: 2 }}>
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 600 }}>
          NCQ Payment Gateway
        </Typography>
      </Toolbar>
      <Divider />
      <List sx={{ flexGrow: 1, py: 2 }}>
        {navItems.map((item) => renderNavItem(item))}
      </List>
      <Divider />
      <Box sx={{ p: 2 }}>
        <Typography variant="caption" color="text.secondary">
          Version 2.0.0 • © 2025 NCQ
        </Typography>
      </Box>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${sidebarOpen ? drawerWidth : 0}px)` },
          ml: { md: `${sidebarOpen ? drawerWidth : 0}px` },
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => dispatch(toggleSidebar())}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton color="inherit" onClick={handleThemeToggle}>
            {appTheme === 'light' ? <DarkMode /> : <LightMode />}
          </IconButton>
          <IconButton color="inherit" onClick={handleNotificationMenuOpen}>
            <Badge badgeContent={unreadCount} color="error">
              <Notifications />
            </Badge>
          </IconButton>
          <IconButton onClick={handleProfileMenuOpen} sx={{ ml: 2 }}>
            <Avatar
              alt={user?.name}
              src={user?.avatar}
              sx={{ width: 32, height: 32 }}
            >
              {user?.name?.charAt(0)}
            </Avatar>
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { md: sidebarOpen ? drawerWidth : 0 }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant={isMobile ? 'temporary' : 'persistent'}
          open={sidebarOpen}
          onClose={() => dispatch(toggleSidebar())}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
          sx={{
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${sidebarOpen ? drawerWidth : 0}px)` },
          mt: 8,
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          ml: { md: sidebarOpen ? 0 : `-${drawerWidth}px` },
        }}
      >
        {children}
      </Box>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => router.push('/profile')}>
          <ListItemIcon>
            <AccountCircle fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={() => router.push('/settings')}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  )
}