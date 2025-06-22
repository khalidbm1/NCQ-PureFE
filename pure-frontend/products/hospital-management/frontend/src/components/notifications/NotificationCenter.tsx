import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Grid,
  Card,
  CardContent,
  IconButton,
  Divider,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Switch,
  Tab,
  Tabs,
  Badge,
} from '@mui/material';
import {
  Notifications,
  Send,
  Email,
  Sms,
  Smartphone,
  WhatsApp,
  Settings,
  History,
  Analytics,
  Test,
  Close,
  Check,
  Warning,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { showNotification } from '../../store/slices/notificationSlice';
import { api } from '../../services/api';

interface NotificationCenterProps {
  open: boolean;
  onClose: () => void;
}

interface NotificationTemplate {
  name: string;
  description: string;
  variables: string[];
}

interface NotificationSettings {
  email_service: {
    enabled: boolean;
    smtp_server: string;
    from_email: string;
  };
  sms_service: {
    enabled: boolean;
    provider: string;
  };
  whatsapp_service: {
    enabled: boolean;
    provider: string;
  };
  push_service: {
    enabled: boolean;
    provider: string;
  };
}

interface NotificationStats {
  total_sent_today: number;
  total_sent_this_week: number;
  total_sent_this_month: number;
  by_type: {
    email: number;
    sms: number;
    push: number;
  };
  by_category: {
    appointment_reminders: number;
    test_results: number;
    prescription_notifications: number;
    general_notifications: number;
  };
  success_rate: number;
  failed_notifications: number;
  pending_notifications: number;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ open, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [currentTab, setCurrentTab] = useState(0);
  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  const [testDialogOpen, setTestDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Notification form state
  const [notificationForm, setNotificationForm] = useState({
    type: 'email',
    recipient: '',
    subject: '',
    message: '',
    template_name: '',
    priority: 'medium'
  });
  
  // Test form state
  const [testForm, setTestForm] = useState({
    test_email: '',
    test_phone: ''
  });
  
  // Data state
  const [templates, setTemplates] = useState<{
    email_templates: Record<string, NotificationTemplate>;
    sms_templates: Record<string, NotificationTemplate>;
  } | null>(null);
  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const [stats, setStats] = useState<NotificationStats | null>(null);

  useEffect(() => {
    if (open) {
      loadData();
    }
  }, [open]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [templatesResponse, settingsResponse, statsResponse] = await Promise.all([
        api.get('/notifications/templates'),
        api.get('/notifications/settings'),
        api.get('/notifications/stats')
      ]);
      
      setTemplates(templatesResponse.data.templates);
      setSettings(settingsResponse.data.settings);
      setStats(statsResponse.data.stats);
    } catch (error) {
      console.error('Error loading notification data:', error);
      dispatch(showNotification({
        message: 'Failed to load notification data',
        severity: 'error'
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleSendNotification = async () => {
    try {
      setLoading(true);
      const response = await api.post('/notifications/send', notificationForm);
      
      if (response.data.success) {
        dispatch(showNotification({
          message: 'Notification sent successfully',
          severity: 'success'
        }));
        setSendDialogOpen(false);
        setNotificationForm({
          type: 'email',
          recipient: '',
          subject: '',
          message: '',
          template_name: '',
          priority: 'medium'
        });
      } else {
        throw new Error(response.data.error || 'Failed to send notification');
      }
    } catch (error: any) {
      dispatch(showNotification({
        message: error.response?.data?.message || 'Failed to send notification',
        severity: 'error'
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleTestServices = async () => {
    try {
      setLoading(true);
      const response = await api.post('/notifications/test', testForm);
      
      if (response.data.success) {
        dispatch(showNotification({
          message: 'Test notifications sent successfully',
          severity: 'success'
        }));
        setTestDialogOpen(false);
      } else {
        throw new Error('Failed to send test notifications');
      }
    } catch (error: any) {
      dispatch(showNotification({
        message: error.response?.data?.message || 'Failed to send test notifications',
        severity: 'error'
      }));
    } finally {
      setLoading(false);
    }
  };

  const getServiceStatusIcon = (enabled: boolean) => {
    return enabled ? (
      <Check color="success" />
    ) : (
      <ErrorIcon color="error" />
    );
  };

  const renderOverviewTab = () => (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={3}>
        {/* Quick Stats */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Notification Statistics
              </Typography>
              {stats && (
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Today:</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {stats.total_sent_today}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">This Week:</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {stats.total_sent_this_week}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">This Month:</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {stats.total_sent_this_month}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Success Rate:</Typography>
                    <Typography variant="body2" fontWeight="bold" color="success.main">
                      {stats.success_rate}%
                    </Typography>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Service Status */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Service Status
              </Typography>
              {settings && (
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <Email />
                    </ListItemIcon>
                    <ListItemText primary="Email Service" secondary={settings.email_service.smtp_server} />
                    <ListItemSecondaryAction>
                      {getServiceStatusIcon(settings.email_service.enabled)}
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Sms />
                    </ListItemIcon>
                    <ListItemText primary="SMS Service" secondary={settings.sms_service.provider} />
                    <ListItemSecondaryAction>
                      {getServiceStatusIcon(settings.sms_service.enabled)}
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <WhatsApp />
                    </ListItemIcon>
                    <ListItemText primary="WhatsApp Service" secondary={settings.whatsapp_service.provider} />
                    <ListItemSecondaryAction>
                      {getServiceStatusIcon(settings.whatsapp_service.enabled)}
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Smartphone />
                    </ListItemIcon>
                    <ListItemText primary="Push Notifications" secondary={settings.push_service.provider} />
                    <ListItemSecondaryAction>
                      {getServiceStatusIcon(settings.push_service.enabled)}
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  startIcon={<Send />}
                  onClick={() => setSendDialogOpen(true)}
                >
                  Send Notification
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Test />}
                  onClick={() => setTestDialogOpen(true)}
                >
                  Test Services
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Analytics />}
                  onClick={() => setCurrentTab(2)}
                >
                  View Analytics
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const renderTemplatesTab = () => (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Notification Templates
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" gutterBottom>
            Email Templates
          </Typography>
          {templates?.email_templates && Object.entries(templates.email_templates).map(([key, template]) => (
            <Card key={key} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6">{template.name}</Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {template.description}
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <Typography variant="caption" display="block">Variables:</Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 0.5 }}>
                    {template.variables.map((variable) => (
                      <Chip key={variable} label={variable} size="small" variant="outlined" />
                    ))}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" gutterBottom>
            SMS Templates
          </Typography>
          {templates?.sms_templates && Object.entries(templates.sms_templates).map(([key, template]) => (
            <Card key={key} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6">{template.name}</Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {template.description}
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <Typography variant="caption" display="block">Variables:</Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 0.5 }}>
                    {template.variables.map((variable) => (
                      <Chip key={variable} label={variable} size="small" variant="outlined" />
                    ))}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Grid>
      </Grid>
    </Box>
  );

  const renderAnalyticsTab = () => (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Notification Analytics
      </Typography>
      
      {stats && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  By Type
                </Typography>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Email:</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {stats.by_type.email}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">SMS:</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {stats.by_type.sms}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Push:</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {stats.by_type.push}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  By Category
                </Typography>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Appointment Reminders:</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {stats.by_category.appointment_reminders}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Test Results:</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {stats.by_category.test_results}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Prescriptions:</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {stats.by_category.prescription_notifications}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">General:</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {stats.by_category.general_notifications}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  System Health
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="success.main">
                        {stats.success_rate}%
                      </Typography>
                      <Typography variant="body2">Success Rate</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="error.main">
                        {stats.failed_notifications}
                      </Typography>
                      <Typography variant="body2">Failed</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="warning.main">
                        {stats.pending_notifications}
                      </Typography>
                      <Typography variant="body2">Pending</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Notifications />
              <Typography variant="h6">Notification Center</Typography>
            </Box>
            <IconButton onClick={onClose} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={currentTab} onChange={(_, newValue) => setCurrentTab(newValue)}>
              <Tab label="Overview" />
              <Tab label="Templates" />
              <Tab label="Analytics" />
            </Tabs>
          </Box>

          {currentTab === 0 && renderOverviewTab()}
          {currentTab === 1 && renderTemplatesTab()}
          {currentTab === 2 && renderAnalyticsTab()}
        </DialogContent>
      </Dialog>

      {/* Send Notification Dialog */}
      <Dialog open={sendDialogOpen} onClose={() => setSendDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Send Notification</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={notificationForm.type}
                  onChange={(e) => setNotificationForm({ ...notificationForm, type: e.target.value })}
                >
                  <MenuItem value="email">Email</MenuItem>
                  <MenuItem value="sms">SMS</MenuItem>
                  <MenuItem value="whatsapp">WhatsApp</MenuItem>
                  <MenuItem value="push">Push Notification</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Recipient"
                value={notificationForm.recipient}
                onChange={(e) => setNotificationForm({ ...notificationForm, recipient: e.target.value })}
                placeholder={notificationForm.type === 'email' ? 'email@example.com' : '+1234567890'}
              />
            </Grid>
            {(notificationForm.type === 'email' || notificationForm.type === 'push') && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Subject"
                  value={notificationForm.subject}
                  onChange={(e) => setNotificationForm({ ...notificationForm, subject: e.target.value })}
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Message"
                value={notificationForm.message}
                onChange={(e) => setNotificationForm({ ...notificationForm, message: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={notificationForm.priority}
                  onChange={(e) => setNotificationForm({ ...notificationForm, priority: e.target.value })}
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSendDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSendNotification} disabled={loading}>
            Send
          </Button>
        </DialogActions>
      </Dialog>

      {/* Test Services Dialog */}
      <Dialog open={testDialogOpen} onClose={() => setTestDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Test Notification Services</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Test Email"
                type="email"
                value={testForm.test_email}
                onChange={(e) => setTestForm({ ...testForm, test_email: e.target.value })}
                placeholder="test@example.com"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Test Phone"
                value={testForm.test_phone}
                onChange={(e) => setTestForm({ ...testForm, test_phone: e.target.value })}
                placeholder="+1234567890"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTestDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleTestServices} disabled={loading}>
            Send Test
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default NotificationCenter;