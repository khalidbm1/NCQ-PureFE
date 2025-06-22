import React, { useState, useEffect, useRef } from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Grid,
  Typography,
  Box,
  Alert,
  AlertTitle,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Switch,
  FormControlLabel
} from '@mui/material'
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts'
import {
  Monitor,
  Warning,
  Error,
  CheckCircle,
  Settings,
  Emergency,
  Notifications,
  Build,
  Timeline
} from '@mui/icons-material'
import { useSnackbar } from 'notistack'
import { format } from 'date-fns'

interface VitalSigns {
  heartRate?: number
  bloodPressure?: { systolic: number; diastolic: number }
  temperature?: number
  spO2?: number
  respiratoryRate?: number
}

interface MedicalDevice {
  id: string
  name: string
  type: string
  status: 'online' | 'offline' | 'maintenance' | 'error'
  patientId?: string
  roomId: string
  lastReading?: VitalSigns
  alerts: DeviceAlert[]
  battery?: number
  lastSeen: string
}

interface DeviceAlert {
  id: string
  type: string
  severity: 'info' | 'warning' | 'critical'
  message: string
  timestamp: string
  acknowledged: boolean
}

interface MonitoringProps {
  patientId?: string
  roomId?: string
  wardId?: string
  facilityId: string
}

export default function MedicalDeviceMonitoring({
  patientId,
  roomId,
  wardId,
  facilityId
}: MonitoringProps) {
  const { enqueueSnackbar } = useSnackbar()
  const [devices, setDevices] = useState<MedicalDevice[]>([])
  const [alerts, setAlerts] = useState<DeviceAlert[]>([])
  const [selectedDevice, setSelectedDevice] = useState<MedicalDevice | null>(null)
  const [vitalsHistory, setVitalsHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [emergencyMode, setEmergencyMode] = useState(false)
  const [alertsEnabled, setAlertsEnabled] = useState(true)
  const [selectedTimeRange, setSelectedTimeRange] = useState('1h')
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    loadDevices()
    connectWebSocket()
    
    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [patientId, roomId, wardId])

  const loadDevices = async () => {
    try {
      setLoading(true)
      
      let endpoint = `/api/medical-iot/facilities/${facilityId}/devices`
      if (patientId) {
        endpoint = `/api/medical-iot/patients/${patientId}/devices`
      } else if (roomId) {
        endpoint = `/api/medical-iot/rooms/${roomId}/devices`
      } else if (wardId) {
        endpoint = `/api/medical-iot/wards/${wardId}/equipment`
      }

      const response = await fetch(endpoint)
      const data = await response.json()
      
      setDevices(data.devices || [])
      setAlerts(data.alerts || [])
      
    } catch (error) {
      enqueueSnackbar('Failed to load device data', { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const connectWebSocket = () => {
    const wsUrl = `ws://localhost:8000/api/medical-iot/ws/alerts`
    wsRef.current = new WebSocket(wsUrl)

    wsRef.current.onmessage = (event) => {
      const message = JSON.parse(event.data)
      
      if (message.type === 'medical_alert') {
        handleNewAlert(message.alert)
      } else if (message.type === 'device_update') {
        handleDeviceUpdate(message.device)
      } else if (message.type === 'vitals_update') {
        handleVitalsUpdate(message.vitals)
      }
    }

    wsRef.current.onerror = (error) => {
      console.error('WebSocket error:', error)
      enqueueSnackbar('Connection error - some features may not work', { variant: 'warning' })
    }
  }

  const handleNewAlert = (alert: DeviceAlert) => {
    setAlerts(prev => [alert, ...prev])
    
    if (alertsEnabled) {
      const severity = alert.severity === 'critical' ? 'error' : 
                     alert.severity === 'warning' ? 'warning' : 'info'
      
      enqueueSnackbar(alert.message, { 
        variant: severity,
        persist: alert.severity === 'critical'
      })
      
      // Play alert sound for critical alerts
      if (alert.severity === 'critical') {
        playAlertSound()
      }
    }
  }

  const handleDeviceUpdate = (deviceUpdate: any) => {
    setDevices(prev => 
      prev.map(device => 
        device.id === deviceUpdate.id 
          ? { ...device, ...deviceUpdate }
          : device
      )
    )
  }

  const handleVitalsUpdate = (vitalsData: any) => {
    if (selectedDevice && vitalsData.deviceId === selectedDevice.id) {
      setVitalsHistory(prev => [...prev, vitalsData].slice(-100)) // Keep last 100 readings
    }
  }

  const playAlertSound = () => {
    // Play critical alert sound
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    
    oscillator.start()
    oscillator.stop(audioContext.currentTime + 0.5)
  }

  const acknowledgeAlert = async (alertId: string) => {
    try {
      await fetch(`/api/medical-iot/alerts/${alertId}/acknowledge`, {
        method: 'POST'
      })
      
      setAlerts(prev =>
        prev.map(alert =>
          alert.id === alertId
            ? { ...alert, acknowledged: true }
            : alert
        )
      )
      
      enqueueSnackbar('Alert acknowledged', { variant: 'success' })
    } catch (error) {
      enqueueSnackbar('Failed to acknowledge alert', { variant: 'error' })
    }
  }

  const activateEmergencyProtocol = async (patientId: string, emergencyType: string) => {
    try {
      await fetch('/api/medical-iot/emergency/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_id: patientId,
          emergency_type: emergencyType,
          initiated_by: 'current_user'
        })
      })
      
      setEmergencyMode(true)
      enqueueSnackbar('Emergency protocol activated', { variant: 'warning' })
    } catch (error) {
      enqueueSnackbar('Failed to activate emergency protocol', { variant: 'error' })
    }
  }

  const getDeviceStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle sx={{ color: 'success.main' }} />
      case 'offline':
        return <Error sx={{ color: 'error.main' }} />
      case 'maintenance':
        return <Build sx={{ color: 'warning.main' }} />
      case 'error':
        return <Warning sx={{ color: 'error.main' }} />
      default:
        return <Monitor />
    }
  }

  const getAlertSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'error'
      case 'warning':
        return 'warning'
      case 'info':
        return 'info'
      default:
        return 'default'
    }
  }

  const formatVitalSigns = (vitals: VitalSigns) => {
    const formatted = []
    
    if (vitals.heartRate) {
      formatted.push(`HR: ${vitals.heartRate} bpm`)
    }
    if (vitals.bloodPressure) {
      formatted.push(`BP: ${vitals.bloodPressure.systolic}/${vitals.bloodPressure.diastolic}`)
    }
    if (vitals.temperature) {
      formatted.push(`Temp: ${vitals.temperature}°C`)
    }
    if (vitals.spO2) {
      formatted.push(`SpO2: ${vitals.spO2}%`)
    }
    
    return formatted.join(' | ')
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header Controls */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Medical Device Monitoring
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControlLabel
            control={
              <Switch
                checked={alertsEnabled}
                onChange={(e) => setAlertsEnabled(e.target.checked)}
              />
            }
            label="Alerts"
          />
          
          {patientId && (
            <Button
              variant="contained"
              color="error"
              startIcon={<Emergency />}
              onClick={() => activateEmergencyProtocol(patientId, 'general')}
              disabled={emergencyMode}
            >
              Emergency
            </Button>
          )}
        </Box>
      </Box>

      {/* Emergency Banner */}
      {emergencyMode && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <AlertTitle>Emergency Protocol Active</AlertTitle>
          Enhanced monitoring enabled. Emergency team has been notified.
        </Alert>
      )}

      {/* Active Alerts */}
      {alerts.filter(a => !a.acknowledged).length > 0 && (
        <Card sx={{ mb: 3, bgcolor: 'error.light', color: 'error.contrastText' }}>
          <CardHeader
            title={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Warning />
                <Typography variant="h6">
                  Active Alerts ({alerts.filter(a => !a.acknowledged).length})
                </Typography>
              </Box>
            }
          />
          <CardContent>
            {alerts
              .filter(alert => !alert.acknowledged)
              .slice(0, 5)
              .map(alert => (
                <Box key={alert.id} sx={{ mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="body1">{alert.message}</Typography>
                    <Typography variant="caption">
                      {format(new Date(alert.timestamp), 'HH:mm:ss')}
                    </Typography>
                  </Box>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => acknowledgeAlert(alert.id)}
                  >
                    Acknowledge
                  </Button>
                </Box>
              ))}
          </CardContent>
        </Card>
      )}

      {/* Device Grid */}
      <Grid container spacing={3}>
        {devices.map(device => (
          <Grid item xs={12} sm={6} md={4} key={device.id}>
            <Card 
              sx={{ 
                height: '100%',
                cursor: 'pointer',
                border: device.status === 'error' ? '2px solid red' : 'none'
              }}
              onClick={() => setSelectedDevice(device)}
            >
              <CardHeader
                title={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getDeviceStatusIcon(device.status)}
                    <Typography variant="h6" noWrap>
                      {device.name}
                    </Typography>
                  </Box>
                }
                subheader={
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {device.type} • Room {device.roomId}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Last seen: {format(new Date(device.lastSeen), 'HH:mm')}
                    </Typography>
                  </Box>
                }
                action={
                  <Box>
                    <Chip
                      label={device.status}
                      size="small"
                      color={device.status === 'online' ? 'success' : 
                            device.status === 'offline' ? 'error' : 'warning'}
                    />
                    {device.alerts.length > 0 && (
                      <Chip
                        label={device.alerts.length}
                        size="small"
                        color="error"
                        sx={{ ml: 1 }}
                      />
                    )}
                  </Box>
                }
              />
              
              <CardContent>
                {device.lastReading && (
                  <Box>
                    <Typography variant="body2" gutterBottom>
                      Latest Readings:
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatVitalSigns(device.lastReading)}
                    </Typography>
                  </Box>
                )}
                
                {device.battery && (
                  <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="caption">
                      Battery: {device.battery}%
                    </Typography>
                    <Box
                      sx={{
                        width: 40,
                        height: 8,
                        bgcolor: 'grey.300',
                        borderRadius: 1,
                        overflow: 'hidden'
                      }}
                    >
                      <Box
                        sx={{
                          width: `${device.battery}%`,
                          height: '100%',
                          bgcolor: device.battery > 20 ? 'success.main' : 'error.main'
                        }}
                      />
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Device Detail Dialog */}
      <Dialog
        open={Boolean(selectedDevice)}
        onClose={() => setSelectedDevice(null)}
        maxWidth="lg"
        fullWidth
      >
        {selectedDevice && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {getDeviceStatusIcon(selectedDevice.status)}
                {selectedDevice.name}
                <Chip label={selectedDevice.type} size="small" />
              </Box>
            </DialogTitle>
            
            <DialogContent>
              <Grid container spacing={3}>
                {/* Device Info */}
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardHeader title="Device Information" />
                    <CardContent>
                      <Typography variant="body2" gutterBottom>
                        <strong>Status:</strong> {selectedDevice.status}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        <strong>Room:</strong> {selectedDevice.roomId}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        <strong>Patient:</strong> {selectedDevice.patientId || 'None'}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        <strong>Last Seen:</strong> {format(new Date(selectedDevice.lastSeen), 'PPp')}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Current Readings */}
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardHeader title="Current Readings" />
                    <CardContent>
                      {selectedDevice.lastReading ? (
                        <Box>
                          {selectedDevice.lastReading.heartRate && (
                            <Typography variant="h6" gutterBottom>
                              ♥ {selectedDevice.lastReading.heartRate} bpm
                            </Typography>
                          )}
                          {selectedDevice.lastReading.bloodPressure && (
                            <Typography variant="h6" gutterBottom>
                              🩺 {selectedDevice.lastReading.bloodPressure.systolic}/{selectedDevice.lastReading.bloodPressure.diastolic}
                            </Typography>
                          )}
                          {selectedDevice.lastReading.temperature && (
                            <Typography variant="h6" gutterBottom>
                              🌡 {selectedDevice.lastReading.temperature}°C
                            </Typography>
                          )}
                          {selectedDevice.lastReading.spO2 && (
                            <Typography variant="h6" gutterBottom>
                              🫁 {selectedDevice.lastReading.spO2}%
                            </Typography>
                          )}
                        </Box>
                      ) : (
                        <Typography color="text.secondary">
                          No recent readings available
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>

                {/* Alerts */}
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardHeader title="Recent Alerts" />
                    <CardContent>
                      {selectedDevice.alerts.length > 0 ? (
                        selectedDevice.alerts.slice(0, 5).map(alert => (
                          <Box key={alert.id} sx={{ mb: 1 }}>
                            <Chip
                              label={alert.severity}
                              size="small"
                              color={getAlertSeverityColor(alert.severity) as any}
                            />
                            <Typography variant="body2" sx={{ mt: 0.5 }}>
                              {alert.message}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {format(new Date(alert.timestamp), 'HH:mm')}
                            </Typography>
                          </Box>
                        ))
                      ) : (
                        <Typography color="text.secondary">
                          No recent alerts
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>

                {/* Vitals Chart */}
                {vitalsHistory.length > 0 && (
                  <Grid item xs={12}>
                    <Card>
                      <CardHeader 
                        title="Vital Signs Trend"
                        action={
                          <FormControl size="small">
                            <InputLabel>Time Range</InputLabel>
                            <Select
                              value={selectedTimeRange}
                              onChange={(e) => setSelectedTimeRange(e.target.value)}
                            >
                              <MenuItem value="1h">Last Hour</MenuItem>
                              <MenuItem value="6h">Last 6 Hours</MenuItem>
                              <MenuItem value="24h">Last 24 Hours</MenuItem>
                            </Select>
                          </FormControl>
                        }
                      />
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={vitalsHistory}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                              dataKey="timestamp" 
                              tickFormatter={(value) => format(new Date(value), 'HH:mm')}
                            />
                            <YAxis />
                            <Tooltip 
                              labelFormatter={(value) => format(new Date(value), 'PPp')}
                            />
                            <Legend />
                            <Line 
                              type="monotone" 
                              dataKey="heartRate" 
                              stroke="#8884d8" 
                              name="Heart Rate"
                            />
                            <Line 
                              type="monotone" 
                              dataKey="spO2" 
                              stroke="#82ca9d" 
                              name="SpO2"
                            />
                            <Line 
                              type="monotone" 
                              dataKey="temperature" 
                              stroke="#ffc658" 
                              name="Temperature"
                            />
                            {/* Reference lines for normal ranges */}
                            <ReferenceLine y={60} stroke="red" strokeDasharray="2 2" />
                            <ReferenceLine y={100} stroke="red" strokeDasharray="2 2" />
                          </LineChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            
            <DialogActions>
              <Button onClick={() => setSelectedDevice(null)}>
                Close
              </Button>
              <Button variant="contained" startIcon={<Settings />}>
                Configure
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  )
}