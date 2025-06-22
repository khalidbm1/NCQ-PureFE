import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Divider,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
} from '@mui/material'
import {
  Person,
  Security,
  Notifications,
  Receipt,
  Download,
} from '@mui/icons-material'
import { AppDispatch, RootState } from '../store'
import { updateProfile, changePassword } from '../store/slices/authSlice'
import { User } from '../types'

interface NotificationSettings {
  emailInvoices: boolean
  emailPaymentReminders: boolean
  emailUsageAlerts: boolean
  emailSecurityAlerts: boolean
  smsPaymentReminders: boolean
  smsUsageAlerts: boolean
}

interface BillingPreferences {
  autoPayEnabled: boolean
  invoiceDelivery: 'email' | 'postal'
  billingCurrency: 'USD' | 'EUR' | 'GBP'
  taxId: string
  billingAddress: {
    street: string
    city: string
    state: string
    postalCode: string
    country: string
  }
}

const Settings: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { user, loading, error } = useSelector((state: RootState) => state.auth)

  const [activeTab, setActiveTab] = useState('profile')
  const [profileData, setProfileData] = useState<Partial<User>>({})
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailInvoices: true,
    emailPaymentReminders: true,
    emailUsageAlerts: true,
    emailSecurityAlerts: true,
    smsPaymentReminders: false,
    smsUsageAlerts: false,
  })
  const [billingPreferences, setBillingPreferences] = useState<BillingPreferences>({
    autoPayEnabled: true,
    invoiceDelivery: 'email',
    billingCurrency: 'USD',
    taxId: '',
    billingAddress: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'US',
    },
  })
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [saving, setSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        company: user.company || '',
      })
    }
  }, [user])

  const handleProfileSave = async () => {
    setSaving(true)
    try {
      await dispatch(updateProfile(profileData)).unwrap()
      setSuccessMessage('Profile updated successfully')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error) {
      // Error handled by Redux slice
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return
    }

    setSaving(true)
    try {
      await dispatch(changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      })).unwrap()
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setShowPasswordDialog(false)
      setSuccessMessage('Password changed successfully')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error) {
      // Error handled by Redux slice
    } finally {
      setSaving(false)
    }
  }

  const handleNotificationSave = async () => {
    setSaving(true)
    try {
      // In a real app, this would call an API to save notification preferences
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSuccessMessage('Notification preferences updated')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error) {
      console.error('Failed to save notification settings:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleBillingPreferencesSave = async () => {
    setSaving(true)
    try {
      // In a real app, this would call an API to save billing preferences
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSuccessMessage('Billing preferences updated')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error) {
      console.error('Failed to save billing preferences:', error)
    } finally {
      setSaving(false)
    }
  }

  const exportAccountData = async () => {
    try {
      // In a real app, this would call an API to export account data
      await new Promise(resolve => setTimeout(resolve, 1000))
      // Simulate download
      const data = {
        profile: user,
        billingHistory: [],
        usageData: [],
        paymentMethods: [],
      }
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `ncq-account-data-${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to export account data:', error)
    }
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <Person /> },
    { id: 'security', label: 'Security', icon: <Security /> },
    { id: 'notifications', label: 'Notifications', icon: <Notifications /> },
    { id: 'billing', label: 'Billing', icon: <Receipt /> },
  ]

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      {successMessage && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {successMessage}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Sidebar */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ p: 0 }}>
              <List>
                {tabs.map((tab) => (
                  <ListItem
                    key={tab.id}
                    button
                    selected={activeTab === tab.id}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center">
                          {tab.icon}
                          <Typography sx={{ ml: 1 }}>{tab.label}</Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Main Content */}
        <Grid item xs={12} md={9}>
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Profile Information
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      value={profileData.name || ''}
                      onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      value={profileData.email || ''}
                      onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone"
                      value={profileData.phone || ''}
                      onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Company"
                      value={profileData.company || ''}
                      onChange={(e) => setProfileData(prev => ({ ...prev, company: e.target.value }))}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box display="flex" gap={2}>
                      <Button
                        variant="contained"
                        onClick={handleProfileSave}
                        disabled={saving}
                      >
                        {saving ? <CircularProgress size={20} /> : 'Save Changes'}
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={exportAccountData}
                        startIcon={<Download />}
                      >
                        Export Account Data
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Security Settings
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Box>
                        <Typography variant="subtitle1">Password</Typography>
                        <Typography variant="body2" color="textSecondary">
                          Last changed: {user?.passwordChangedAt ? new Date(user.passwordChangedAt).toLocaleDateString() : 'Never'}
                        </Typography>
                      </Box>
                      <Button
                        variant="outlined"
                        onClick={() => setShowPasswordDialog(true)}
                      >
                        Change Password
                      </Button>
                    </Box>
                    <Divider />
                  </Grid>
                  <Grid item xs={12}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="subtitle1">Two-Factor Authentication</Typography>
                        <Typography variant="body2" color="textSecondary">
                          Add an extra layer of security to your account
                        </Typography>
                      </Box>
                      <Chip label="Not Configured" color="warning" />
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="subtitle1">Login Sessions</Typography>
                        <Typography variant="body2" color="textSecondary">
                          Manage your active login sessions
                        </Typography>
                      </Box>
                      <Button variant="outlined">View Sessions</Button>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Notification Preferences
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom>
                      Email Notifications
                    </Typography>
                    {Object.entries(notificationSettings)
                      .filter(([key]) => key.startsWith('email'))
                      .map(([key, value]) => (
                        <FormControlLabel
                          key={key}
                          control={
                            <Switch
                              checked={value}
                              onChange={(e) => setNotificationSettings(prev => ({
                                ...prev,
                                [key]: e.target.checked,
                              }))}
                            />
                          }
                          label={key.replace('email', '').replace(/([A-Z])/g, ' $1').trim()}
                          sx={{ display: 'block', mb: 1 }}
                        />
                      ))}
                  </Grid>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom>
                      SMS Notifications
                    </Typography>
                    {Object.entries(notificationSettings)
                      .filter(([key]) => key.startsWith('sms'))
                      .map(([key, value]) => (
                        <FormControlLabel
                          key={key}
                          control={
                            <Switch
                              checked={value}
                              onChange={(e) => setNotificationSettings(prev => ({
                                ...prev,
                                [key]: e.target.checked,
                              }))}
                            />
                          }
                          label={key.replace('sms', '').replace(/([A-Z])/g, ' $1').trim()}
                          sx={{ display: 'block', mb: 1 }}
                        />
                      ))}
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      onClick={handleNotificationSave}
                      disabled={saving}
                    >
                      {saving ? <CircularProgress size={20} /> : 'Save Preferences'}
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}

          {/* Billing Tab */}
          {activeTab === 'billing' && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Billing Preferences
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={billingPreferences.autoPayEnabled}
                          onChange={(e) => setBillingPreferences(prev => ({
                            ...prev,
                            autoPayEnabled: e.target.checked,
                          }))}
                        />
                      }
                      label="Enable Auto-Pay"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      fullWidth
                      label="Currency"
                      value={billingPreferences.billingCurrency}
                      onChange={(e) => setBillingPreferences(prev => ({
                        ...prev,
                        billingCurrency: e.target.value as any,
                      }))}
                      SelectProps={{ native: true }}
                    >
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Tax ID"
                      value={billingPreferences.taxId}
                      onChange={(e) => setBillingPreferences(prev => ({
                        ...prev,
                        taxId: e.target.value,
                      }))}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom>
                      Billing Address
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Street Address"
                      value={billingPreferences.billingAddress.street}
                      onChange={(e) => setBillingPreferences(prev => ({
                        ...prev,
                        billingAddress: { ...prev.billingAddress, street: e.target.value },
                      }))}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="City"
                      value={billingPreferences.billingAddress.city}
                      onChange={(e) => setBillingPreferences(prev => ({
                        ...prev,
                        billingAddress: { ...prev.billingAddress, city: e.target.value },
                      }))}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="State/Province"
                      value={billingPreferences.billingAddress.state}
                      onChange={(e) => setBillingPreferences(prev => ({
                        ...prev,
                        billingAddress: { ...prev.billingAddress, state: e.target.value },
                      }))}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Postal Code"
                      value={billingPreferences.billingAddress.postalCode}
                      onChange={(e) => setBillingPreferences(prev => ({
                        ...prev,
                        billingAddress: { ...prev.billingAddress, postalCode: e.target.value },
                      }))}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Country"
                      value={billingPreferences.billingAddress.country}
                      onChange={(e) => setBillingPreferences(prev => ({
                        ...prev,
                        billingAddress: { ...prev.billingAddress, country: e.target.value },
                      }))}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      onClick={handleBillingPreferencesSave}
                      disabled={saving}
                    >
                      {saving ? <CircularProgress size={20} /> : 'Save Preferences'}
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>

      {/* Change Password Dialog */}
      <Dialog open={showPasswordDialog} onClose={() => setShowPasswordDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="password"
                label="Current Password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="password"
                label="New Password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="password"
                label="Confirm New Password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                error={passwordData.newPassword !== passwordData.confirmPassword && passwordData.confirmPassword !== ''}
                helperText={
                  passwordData.newPassword !== passwordData.confirmPassword && passwordData.confirmPassword !== ''
                    ? 'Passwords do not match'
                    : ''
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPasswordDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handlePasswordChange}
            disabled={
              !passwordData.currentPassword ||
              !passwordData.newPassword ||
              passwordData.newPassword !== passwordData.confirmPassword ||
              saving
            }
          >
            {saving ? <CircularProgress size={20} /> : 'Change Password'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Settings