import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  alpha,
  Chip,
} from '@mui/material';
import {
  Dashboard,
  People,
  EventNote,
  LocalHospital,
  LocalPharmacy,
  Science,
  Receipt,
  Business,
  Assessment,
  Settings,
  CreditCard,
  FolderShared,
  PersonAdd,
  MedicalServices,
  Biotech,
  HealthAndSafety,
  Inventory,
  Groups,
} from '@mui/icons-material';
import { RootState } from '../../store';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

interface MenuItem {
  text: string;
  icon: JSX.Element;
  path: string;
  roles?: string[];
}

const menuItems: MenuItem[] = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/' },
  { text: 'Patients', icon: <People />, path: '/patients' },
  { text: 'Appointments', icon: <EventNote />, path: '/appointments' },
  { text: 'Doctors', icon: <LocalHospital />, path: '/doctors' },
  { text: 'Staff Management', icon: <Groups />, path: '/staff' },
  { text: 'Medical Records', icon: <FolderShared />, path: '/medical-records' },
  { text: 'Prescriptions', icon: <LocalPharmacy />, path: '/prescriptions' },
  { text: 'Lab Tests', icon: <Biotech />, path: '/lab-tests' },
  { text: 'Billing', icon: <Receipt />, path: '/billing' },
  { text: 'Insurance', icon: <HealthAndSafety />, path: '/insurance' },
  { text: 'Inventory', icon: <Inventory />, path: '/inventory' },
  { text: 'Reports', icon: <Assessment />, path: '/reports' },
];

const bottomMenuItems: MenuItem[] = [
  { text: 'Subscription', icon: <CreditCard />, path: '/subscription', roles: ['hospital_admin'] },
  { text: 'Settings', icon: <Settings />, path: '/settings' },
];

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user } = useSelector((state: RootState) => state.auth);

  const handleNavigate = (path: string) => {
    navigate(path);
    if (isMobile) {
      onClose();
    }
  };

  const isMenuItemVisible = (item: MenuItem) => {
    if (!item.roles || item.roles.length === 0) {
      return true;
    }
    return user && item.roles.includes(user.role);
  };

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              bgcolor: 'primary.main',
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 2,
            }}
          >
            <LocalHospital sx={{ color: 'white', fontSize: 20 }} />
          </Box>
          <Box>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ lineHeight: 1.2 }}>
              NCQ Hospital
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Management System
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider />

      <List sx={{ flexGrow: 1, px: 2 }}>
        {menuItems.map(
          (item) =>
            isMenuItemVisible(item) && (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  selected={location.pathname === item.path}
                  onClick={() => handleNavigate(item.path)}
                  sx={{
                    borderRadius: 2,
                    px: 2,
                    py: 1.25,
                    transition: 'all 0.2s',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.08),
                    },
                    '&.Mui-selected': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.12),
                      color: 'primary.main',
                      '& .MuiListItemIcon-root': {
                        color: 'primary.main',
                      },
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.16),
                      },
                    },
                  }}
                >
                  <ListItemIcon 
                    sx={{ 
                      minWidth: 40,
                      color: location.pathname === item.path ? 'primary.main' : 'text.secondary',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text}
                    primaryTypographyProps={{
                      fontSize: '0.875rem',
                      fontWeight: location.pathname === item.path ? 600 : 400,
                    }}
                  />
                  {location.pathname === item.path && (
                    <Box
                      sx={{
                        width: 4,
                        height: 24,
                        bgcolor: 'primary.main',
                        borderRadius: 1,
                        position: 'absolute',
                        right: 0,
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            )
        )}
      </List>

      <Divider />

      <Box sx={{ p: 2 }}>
        <Box
          sx={{
            bgcolor: alpha(theme.palette.primary.main, 0.08),
            borderRadius: 2,
            p: 2,
            mb: 2,
          }}
        >
          <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
            Hospital ID
          </Typography>
          <Typography variant="body2" fontWeight="600" color="primary.main">
            NCQ-HSP-{user?.tenant_id?.slice(-4) || '0001'}
          </Typography>
        </Box>
        <List sx={{ mx: -2 }}>
          {bottomMenuItems.map(
            (item) =>
              isMenuItemVisible(item) && (
                <ListItem key={item.text} disablePadding>
                  <ListItemButton
                    selected={location.pathname === item.path}
                    onClick={() => handleNavigate(item.path)}
                    sx={{
                      borderRadius: 2,
                      mx: 2,
                      mb: 0.5,
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.08),
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40, color: 'text.secondary' }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={item.text}
                      primaryTypographyProps={{
                        fontSize: '0.875rem',
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              )
          )}
        </List>
      </Box>
    </Box>
  );

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'persistent'}
      open={open}
      onClose={onClose}
      sx={{
        width: 280,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 280,
          boxSizing: 'border-box',
          borderRight: `1px solid ${theme.palette.divider}`,
          backgroundImage: 'none',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;