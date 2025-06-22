import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  TextField,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
  Paper,
  InputAdornment,
  Chip,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
} from '@mui/material';
import {
  Add,
  ViewModule,
  ViewList,
  Search,
  FilterList,
  Download,
  Print,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { Doctor } from '../store/slices/doctorSlice';
import { showNotification } from '../store/slices/notificationSlice';
import {
  DoctorCard,
  DoctorForm,
  DoctorProfile,
  DoctorScheduleBuilder,
} from '../components/doctors';

const Doctors: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { doctors, loading } = useSelector((state: RootState) => state.doctors);
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSpecialization, setFilterSpecialization] = useState<string[]>([]);
  const [openDoctorForm, setOpenDoctorForm] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [viewingDoctor, setViewingDoctor] = useState<Doctor | null>(null);
  const [editingSchedule, setEditingSchedule] = useState<Doctor | null>(null);

  // Get unique departments and specializations
  const departments = Array.from(new Set(doctors.map(d => d.department))).sort();
  const specializations = Array.from(
    new Set(doctors.flatMap(d => d.specialization))
  ).sort();

  // Filter doctors
  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = 
      doctor.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.doctor_id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = filterDepartment === 'all' || doctor.department === filterDepartment;
    const matchesStatus = filterStatus === 'all' || doctor.status === filterStatus;
    const matchesSpecialization = 
      filterSpecialization.length === 0 || 
      filterSpecialization.some(spec => doctor.specialization.includes(spec));
    
    return matchesSearch && matchesDepartment && matchesStatus && matchesSpecialization;
  });

  // Statistics
  const stats = {
    total: doctors.length,
    active: doctors.filter(d => d.status === 'active').length,
    onLeave: doctors.filter(d => d.status === 'on_leave').length,
    available: doctors.filter(d => d.status === 'active' && d.is_available).length,
  };

  const handleViewModeChange = (
    event: React.MouseEvent<HTMLElement>,
    newMode: 'grid' | 'list'
  ) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  const handleAddDoctor = () => {
    setSelectedDoctor(null);
    setOpenDoctorForm(true);
  };

  const handleEditDoctor = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setOpenDoctorForm(true);
  };

  const handleViewDoctor = (doctor: Doctor) => {
    setViewingDoctor(doctor);
  };

  const handleScheduleEdit = (doctor: Doctor) => {
    setEditingSchedule(doctor);
  };

  const handleSaveDoctor = (doctorData: Partial<Doctor>) => {
    if (selectedDoctor) {
      // Update existing doctor
      dispatch(showNotification({
        message: 'Doctor updated successfully',
        severity: 'success',
      }));
    } else {
      // Create new doctor
      dispatch(showNotification({
        message: 'Doctor added successfully',
        severity: 'success',
      }));
    }
    setOpenDoctorForm(false);
  };

  const handleSaveSchedule = (scheduleData: Partial<Doctor>) => {
    dispatch(showNotification({
      message: 'Schedule updated successfully',
      severity: 'success',
    }));
    setEditingSchedule(null);
  };

  const exportDoctors = () => {
    const headers = ['ID', 'Name', 'Department', 'Specialization', 'Email', 'Phone', 'Status'];
    const data = filteredDoctors.map(doctor => [
      doctor.doctor_id,
      `${doctor.title} ${doctor.first_name} ${doctor.last_name}`,
      doctor.department,
      doctor.specialization.join(', '),
      doctor.email,
      doctor.phone,
      doctor.status,
    ]);
    
    const csvContent = [
      headers.join(','),
      ...data.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `doctors_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  if (viewingDoctor) {
    return (
      <Box>
        <Button
          onClick={() => setViewingDoctor(null)}
          sx={{ mb: 2 }}
        >
          ← Back to Doctors
        </Button>
        <DoctorProfile
          doctor={viewingDoctor}
          onEdit={() => handleEditDoctor(viewingDoctor)}
          onScheduleEdit={() => handleScheduleEdit(viewingDoctor)}
        />
      </Box>
    );
  }

  if (editingSchedule) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          Edit Schedule - {editingSchedule.title} {editingSchedule.first_name} {editingSchedule.last_name}
        </Typography>
        <DoctorScheduleBuilder
          doctor={editingSchedule}
          onSave={handleSaveSchedule}
          onCancel={() => setEditingSchedule(null)}
        />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Doctors
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage doctor profiles, schedules, and availability
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddDoctor}
        >
          Add Doctor
        </Button>
      </Box>

      {/* Statistics */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h4">{stats.total}</Typography>
            <Typography variant="body2" color="text.secondary">
              Total Doctors
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h4" color="success.main">
              {stats.active}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Active
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h4" color="warning.main">
              {stats.onLeave}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              On Leave
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h4" color="info.main">
              {stats.available}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Available Now
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              placeholder="Search doctors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={2}>
            <TextField
              select
              fullWidth
              size="small"
              label="Department"
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
            >
              <MenuItem value="all">All Departments</MenuItem>
              {departments.map(dept => (
                <MenuItem key={dept} value={dept}>{dept}</MenuItem>
              ))}
            </TextField>
          </Grid>
          
          <Grid item xs={12} md={2}>
            <TextField
              select
              fullWidth
              size="small"
              label="Status"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
              <MenuItem value="on_leave">On Leave</MenuItem>
              <MenuItem value="suspended">Suspended</MenuItem>
            </TextField>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Specialization</InputLabel>
              <Select
                multiple
                value={filterSpecialization}
                onChange={(e) => setFilterSpecialization(e.target.value as string[])}
                input={<OutlinedInput label="Specialization" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} size="small" />
                    ))}
                  </Box>
                )}
              >
                {specializations.map((spec) => (
                  <MenuItem key={spec} value={spec}>
                    {spec}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={2}>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={handleViewModeChange}
                size="small"
              >
                <ToggleButton value="grid">
                  <ViewModule />
                </ToggleButton>
                <ToggleButton value="list">
                  <ViewList />
                </ToggleButton>
              </ToggleButtonGroup>
              
              <Button
                variant="outlined"
                size="small"
                startIcon={<Download />}
                onClick={exportDoctors}
              >
                Export
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Doctor List/Grid */}
      {viewMode === 'grid' ? (
        <Grid container spacing={3}>
          {filteredDoctors.map((doctor) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={doctor.id}>
              <DoctorCard
                doctor={doctor}
                onView={() => handleViewDoctor(doctor)}
                onEdit={() => handleEditDoctor(doctor)}
                onSchedule={() => handleScheduleEdit(doctor)}
                viewMode="grid"
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box>
          {filteredDoctors.map((doctor) => (
            <DoctorCard
              key={doctor.id}
              doctor={doctor}
              onView={() => handleViewDoctor(doctor)}
              onEdit={() => handleEditDoctor(doctor)}
              onSchedule={() => handleScheduleEdit(doctor)}
              viewMode="list"
            />
          ))}
        </Box>
      )}

      {filteredDoctors.length === 0 && (
        <Paper sx={{ p: 8, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No doctors found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your filters or add a new doctor
          </Typography>
        </Paper>
      )}

      {/* Doctor Form Dialog */}
      <DoctorForm
        open={openDoctorForm}
        onClose={() => setOpenDoctorForm(false)}
        onSave={handleSaveDoctor}
        doctor={selectedDoctor}
      />
    </Box>
  );
};

export default Doctors;