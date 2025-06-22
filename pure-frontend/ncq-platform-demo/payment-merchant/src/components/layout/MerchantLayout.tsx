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
  Chip,
} from '@mui/material'
import {
  Menu as MenuIcon,
  Dashboard,
  CreditCard,
  Link as LinkIcon,
  Code,
  AccountBalance,
  Assessment,
  Settings,
  Support,
  ExpandLess,
  ExpandMore,
  Notifications,
  AccountCircle,
  Logout,
  DarkMode,
  LightMode,
  Receipt,
  Webhook,
  Key,
  QuestionAnswer,
} from '@mui/icons-material'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/store'
import { toggleSidebar, setTheme } from '@/store/slices/uiSlice'

const drawerWidth = 280

interface MerchantLayoutProps {
  children: ReactNode
}

interface NavItem {
  title: string
  path?: string
  icon: ReactNode
  badge?: string | number
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
      { title: 'Disputes', path: '/transactions/disputes', icon: <Receipt /> },
    ],
  },
  {
    title: 'Payment Links',
    path: '/payment-links',
    icon: <LinkIcon />,
  },
  {
    title: 'Settlements',
    path: '/settlements',
    icon: <AccountBalance />,
  },
  {
    title: 'Analytics',
    path: '/analytics',
    icon: <Assessment />,
  },
  {
    title: 'Developers',
    icon: <Code />,
    children: [
      { title: 'API Documentation', path: '/developers', icon: <Code /> },
      { title: 'API Keys', path: '/developers/api-keys', icon: <Key /> },
      { title: 'Webhooks', path: '/developers/webhooks', icon: <Webhook /> },
      { title: 'Testing', path: '/developers/testing', icon: <Code /> },
    ],
  },
  {
    title: 'Support',
    path: '/support',
    icon: <Support />,
    badge: 'New',
  },
  {
    title: 'Settings',
    path: '/settings',
    icon: <Settings />,
  },
]

export function MerchantLayout({ children }: MerchantLayoutProps) {
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
          }}
        >
          <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
            {item.icon}
          </ListItemIcon>
          <ListItemText primary={item.title} />
          {item.badge && (
            <Chip label={item.badge} size="small" color="primary" />
          )}
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
        <Box>
          <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 600 }}>
            NCQ Merchant
          </Typography>
          <Typography variant="caption" color="text.secondary">
            ID: {user?.merchantId || 'NCQ12345678'}
          </Typography>
        </Box>
      </Toolbar>
      <Divider />
      <List sx={{ flexGrow: 1, py: 2 }}>
        {navItems.map((item) => renderNavItem(item))}
      </List>
      <Divider />
      <Box sx={{ p: 2 }}>
        <Box
          sx={{
            p: 2,
            bgcolor: 'action.hover',
            borderRadius: 1,
            mb: 2,
          }}
        >
          <Typography variant="body2" fontWeight="medium">
            Need Help?
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Our support team is here 24/7
          </Typography>
          <Box display="flex" gap={1} mt={1}>
            <IconButton size="small" color="primary">
              <QuestionAnswer fontSize="small" />
            </IconButton>
            <IconButton size="small" color="primary">
              <Support fontSize="small" />
            </IconButton>
          </Box>
        </Box>
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
          backgroundColor: 'background.paper',
          color: 'text.primary',
          boxShadow: 1,
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
          <Chip
            label={user?.testMode ? 'Test Mode' : 'Live Mode'}
            color={user?.testMode ? 'warning' : 'success'}
            size="small"
            sx={{ mr: 2 }}
          />
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
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle2">{user?.name}</Typography>
          <Typography variant="caption" color="text.secondary">
            {user?.email}
          </Typography>
        </Box>
        <Divider />
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