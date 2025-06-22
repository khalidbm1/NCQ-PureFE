import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Switch,
  TextField,
  Button,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Alert,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Tooltip,
} from '@mui/material';
import {
  Add,
  Delete,
  Save,
  Cancel,
  AccessTime,
  DateRange,
  Warning,
  ContentCopy,
  Coffee,
} from '@mui/icons-material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Doctor, WorkingHours, TimeSlot, LeavePeriod } from '../../store/slices/doctorSlice';
import { format, parse, addMinutes, isAfter, isBefore } from 'date-fns';

interface DoctorScheduleBuilderProps {
  doctor: Doctor;
  onSave: (schedule: Partial<Doctor>) => void;
  onCancel: () => void;
}

interface DayScheduleState {
  is_working: boolean;
  start_time: Date | null;
  end_time: Date | null;
  break_start: Date | null;
  break_end: Date | null;
}

const DoctorScheduleBuilder: React.FC<DoctorScheduleBuilderProps> = ({
  doctor,
  onSave,
  onCancel,
}) => {
  const [workingHours, setWorkingHours] = useState<Record<string, DayScheduleState>>(() => {
    const initialHours: Record<string, DayScheduleState> = {};
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    
    days.forEach(day => {
      const schedule = doctor.working_hours[day as keyof WorkingHours];
      initialHours[day] = {
        is_working: schedule.is_working,
        start_time: schedule.start_time ? parse(schedule.start_time, 'HH:mm', new Date()) : null,
        end_time: schedule.end_time ? parse(schedule.end_time, 'HH:mm', new Date()) : null,
        break_start: schedule.break_start ? parse(schedule.break_start, 'HH:mm', new Date()) : null,
        break_end: schedule.break_end ? parse(schedule.break_end, 'HH:mm', new Date()) : null,
      };
    });
    
    return initialHours;
  });

  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(doctor.time_slots || []);
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);
  const [slotDialogOpen, setSlotDialogOpen] = useState(false);
  const [newSlot, setNewSlot] = useState({
    start_time: null as Date | null,
    end_time: null as Date | null,
    max_patients: 1,
    slot_duration: 30,
  });
  const [newLeave, setNewLeave] = useState({
    start_date: null as Date | null,
    end_date: null as Date | null,
    reason: '',
    type: 'vacation' as LeavePeriod['type'],
  });

  const handleDayToggle = (day: string) => {
    setWorkingHours({
      ...workingHours,
      [day]: {
        ...workingHours[day],
        is_working: !workingHours[day].is_working,
      },
    });
  };

  const handleTimeChange = (day: string, field: keyof DayScheduleState, value: Date | null) => {
    setWorkingHours({
      ...workingHours,
      [day]: {
        ...workingHours[day],
        [field]: value,
      },
    });
  };

  const copyScheduleToAllDays = (sourceDay: string) => {
    const sourceDaySchedule = workingHours[sourceDay];
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    
    const updatedHours = { ...workingHours };
    days.forEach(day => {
      if (day !== sourceDay) {
        updatedHours[day] = { ...sourceDaySchedule };
      }
    });
    
    setWorkingHours(updatedHours);
  };

  const addTimeSlot = () => {
    if (newSlot.start_time && newSlot.end_time) {
      const slot: TimeSlot = {
        id: `slot-${Date.now()}`,
        start_time: format(newSlot.start_time, 'HH:mm'),
        end_time: format(newSlot.end_time, 'HH:mm'),
        max_patients: newSlot.max_patients,
        slot_duration: newSlot.slot_duration,
      };
      
      setTimeSlots([...timeSlots, slot]);
      setSlotDialogOpen(false);
      setNewSlot({
        start_time: null,
        end_time: null,
        max_patients: 1,
        slot_duration: 30,
      });
    }
  };

  const removeTimeSlot = (slotId: string) => {
    setTimeSlots(timeSlots.filter(slot => slot.id !== slotId));
  };

  const generateTimeSlots = () => {
    const generatedSlots: TimeSlot[] = [];
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    
    // Find the most common working hours
    const workingDay = days.find(day => workingHours[day].is_working);
    if (!workingDay) return;
    
    const schedule = workingHours[workingDay];
    if (!schedule.start_time || !schedule.end_time) return;
    
    let currentTime = new Date(schedule.start_time);
    const endTime = new Date(schedule.end_time);
    const slotDuration = 30; // 30 minutes default
    
    while (isBefore(currentTime, endTime)) {
      const slotEnd = addMinutes(currentTime, slotDuration);
      
      // Skip break time if exists
      if (schedule.break_start && schedule.break_end) {
        const breakStart = new Date(schedule.break_start);
        const breakEnd = new Date(schedule.break_end);
        
        if (
          (isAfter(currentTime, breakStart) && isBefore(currentTime, breakEnd)) ||
          (isAfter(slotEnd, breakStart) && isBefore(slotEnd, breakEnd))
        ) {
          currentTime = breakEnd;
          continue;
        }
      }
      
      if (isBefore(slotEnd, endTime) || format(slotEnd, 'HH:mm') === format(endTime, 'HH:mm')) {
        generatedSlots.push({
          id: `slot-${Date.now()}-${generatedSlots.length}`,
          start_time: format(currentTime, 'HH:mm'),
          end_time: format(slotEnd, 'HH:mm'),
          max_patients: 2,
          slot_duration: slotDuration,
        });
      }
      
      currentTime = slotEnd;
    }
    
    setTimeSlots(generatedSlots);
  };

  const handleSave = () => {
    const formattedWorkingHours: WorkingHours = {} as WorkingHours;
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    
    days.forEach(day => {
      const schedule = workingHours[day];
      formattedWorkingHours[day as keyof WorkingHours] = {
        is_working: schedule.is_working,
        start_time: schedule.start_time ? format(schedule.start_time, 'HH:mm') : '',
        end_time: schedule.end_time ? format(schedule.end_time, 'HH:mm') : '',
        break_start: schedule.break_start ? format(schedule.break_start, 'HH:mm') : undefined,
        break_end: schedule.break_end ? format(schedule.break_end, 'HH:mm') : undefined,
      };
    });
    
    onSave({
      working_hours: formattedWorkingHours,
      time_slots: timeSlots,
    });
  };

  const getDayLabel = (day: string) => {
    return day.charAt(0).toUpperCase() + day.slice(1);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Weekly Schedule
            </Typography>
            <Alert severity="info" sx={{ mb: 2 }}>
              Configure working hours for each day of the week. You can set break times and copy schedules across days.
            </Alert>
            
            <Grid container spacing={2}>
              {Object.entries(workingHours).map(([day, schedule]) => (
                <Grid item xs={12} key={day}>
                  <Paper sx={{ p: 2 }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={2}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={schedule.is_working}
                              onChange={() => handleDayToggle(day)}
                              color="primary"
                            />
                          }
                          label={getDayLabel(day)}
                        />
                      </Grid>
                      
                      {schedule.is_working && (
                        <>
                          <Grid item xs={6} sm={2}>
                            <TimePicker
                              label="Start Time"
                              value={schedule.start_time}
                              onChange={(value) => handleTimeChange(day, 'start_time', value)}
                              slotProps={{
                                textField: {
                                  size: 'small',
                                  fullWidth: true,
                                },
                              }}
                            />
                          </Grid>
                          
                          <Grid item xs={6} sm={2}>
                            <TimePicker
                              label="End Time"
                              value={schedule.end_time}
                              onChange={(value) => handleTimeChange(day, 'end_time', value)}
                              slotProps={{
                                textField: {
                                  size: 'small',
                                  fullWidth: true,
                                },
                              }}
                            />
                          </Grid>
                          
                          <Grid item xs={6} sm={2}>
                            <TimePicker
                              label="Break Start"
                              value={schedule.break_start}
                              onChange={(value) => handleTimeChange(day, 'break_start', value)}
                              slotProps={{
                                textField: {
                                  size: 'small',
                                  fullWidth: true,
                                },
                              }}
                            />
                          </Grid>
                          
                          <Grid item xs={6} sm={2}>
                            <TimePicker
                              label="Break End"
                              value={schedule.break_end}
                              onChange={(value) => handleTimeChange(day, 'break_end', value)}
                              slotProps={{
                                textField: {
                                  size: 'small',
                                  fullWidth: true,
                                },
                              }}
                            />
                          </Grid>
                          
                          <Grid item xs={12} sm={2}>
                            <Tooltip title="Copy this schedule to all days">
                              <IconButton
                                onClick={() => copyScheduleToAllDays(day)}
                                size="small"
                                color="primary"
                              >
                                <ContentCopy />
                              </IconButton>
                            </Tooltip>
                          </Grid>
                        </>
                      )}
                    </Grid>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Appointment Slots
              </Typography>
              <Box>
                <Button
                  variant="outlined"
                  startIcon={<AccessTime />}
                  onClick={generateTimeSlots}
                  size="small"
                  sx={{ mr: 1 }}
                >
                  Auto Generate
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setSlotDialogOpen(true)}
                  size="small"
                >
                  Add Slot
                </Button>
              </Box>
            </Box>
            
            {timeSlots.length > 0 ? (
              <Grid container spacing={1}>
                {timeSlots.map((slot) => (
                  <Grid item key={slot.id}>
                    <Chip
                      label={`${slot.start_time} - ${slot.end_time} (${slot.max_patients} patients)`}
                      onDelete={() => removeTimeSlot(slot.id)}
                      color="primary"
                      variant="outlined"
                    />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Alert severity="warning">
                No time slots configured. Add slots manually or use auto-generate based on working hours.
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Leave Management
              </Typography>
              <Button
                variant="outlined"
                startIcon={<DateRange />}
                onClick={() => setLeaveDialogOpen(true)}
                size="small"
              >
                Request Leave
              </Button>
            </Box>
            
            {doctor.leave_periods && doctor.leave_periods.length > 0 ? (
              <List>
                {doctor.leave_periods.map((leave, index) => (
                  <React.Fragment key={leave.id}>
                    {index > 0 && <Divider />}
                    <ListItem>
                      <ListItemText
                        primary={`${format(new Date(leave.start_date), 'MMM dd, yyyy')} - ${format(new Date(leave.end_date), 'MMM dd, yyyy')}`}
                        secondary={`${leave.type} - ${leave.reason}`}
                      />
                      <ListItemSecondaryAction>
                        <Chip
                          label={leave.status}
                          size="small"
                          color={
                            leave.status === 'approved' ? 'success' :
                            leave.status === 'rejected' ? 'error' : 'default'
                          }
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No leave requests
              </Typography>
            )}
          </CardContent>
        </Card>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Cancel />}
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={handleSave}
          >
            Save Schedule
          </Button>
        </Box>

        {/* Add Time Slot Dialog */}
        <Dialog open={slotDialogOpen} onClose={() => setSlotDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Add Time Slot</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={6}>
                <TimePicker
                  label="Start Time"
                  value={newSlot.start_time}
                  onChange={(value) => setNewSlot({ ...newSlot, start_time: value })}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TimePicker
                  label="End Time"
                  value={newSlot.end_time}
                  onChange={(value) => setNewSlot({ ...newSlot, end_time: value })}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Max Patients"
                  value={newSlot.max_patients}
                  onChange={(e) => setNewSlot({ ...newSlot, max_patients: parseInt(e.target.value) })}
                  inputProps={{ min: 1, max: 10 }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Duration (minutes)"
                  value={newSlot.slot_duration}
                  onChange={(e) => setNewSlot({ ...newSlot, slot_duration: parseInt(e.target.value) })}
                  inputProps={{ min: 15, max: 120, step: 15 }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSlotDialogOpen(false)}>Cancel</Button>
            <Button onClick={addTimeSlot} variant="contained">Add</Button>
          </DialogActions>
        </Dialog>

        {/* Request Leave Dialog */}
        <Dialog open={leaveDialogOpen} onClose={() => setLeaveDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Request Leave</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={6}>
                <DatePicker
                  label="Start Date"
                  value={newLeave.start_date}
                  onChange={(value) => setNewLeave({ ...newLeave, start_date: value })}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <DatePicker
                  label="End Date"
                  value={newLeave.end_date}
                  onChange={(value) => setNewLeave({ ...newLeave, end_date: value })}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Leave Type</InputLabel>
                  <Select
                    value={newLeave.type}
                    onChange={(e) => setNewLeave({ ...newLeave, type: e.target.value as LeavePeriod['type'] })}
                    label="Leave Type"
                  >
                    <MenuItem value="vacation">Vacation</MenuItem>
                    <MenuItem value="sick">Sick Leave</MenuItem>
                    <MenuItem value="emergency">Emergency</MenuItem>
                    <MenuItem value="conference">Conference</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Reason"
                  value={newLeave.reason}
                  onChange={(e) => setNewLeave({ ...newLeave, reason: e.target.value })}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setLeaveDialogOpen(false)}>Cancel</Button>
            <Button variant="contained">Submit Request</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default DoctorScheduleBuilder;