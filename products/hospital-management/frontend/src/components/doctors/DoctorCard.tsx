import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Avatar,
  Typography,
  Chip,
  Box,
  IconButton,
  Button,
  Rating,
  Tooltip,
  LinearProgress,
} from '@mui/material';
import {
  Phone,
  Email,
  LocationOn,
  Schedule,
  Edit,
  Visibility,
  CheckCircle,
  Cancel,
  Warning,
  People,
  AttachMoney,
} from '@mui/icons-material';
import { Doctor } from '../../store/slices/doctorSlice';

interface DoctorCardProps {
  doctor: Doctor;
  onView: () => void;
  onEdit: () => void;
  onSchedule: () => void;
  viewMode?: 'grid' | 'list';
}

const DoctorCard: React.FC<DoctorCardProps> = ({
  doctor,
  onView,
  onEdit,
  onSchedule,
  viewMode = 'grid',
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'default';
      case 'on_leave': return 'warning';
      case 'suspended': return 'error';
      default: return 'default';
    }
  };

  const getAvailabilityIcon = () => {
    if (doctor.status === 'active' && doctor.is_available) {
      return <CheckCircle sx={{ fontSize: 16 }} />;
    } else if (doctor.status === 'on_leave') {
      return <Warning sx={{ fontSize: 16 }} />;
    } else {
      return <Cancel sx={{ fontSize: 16 }} />;
    }
  };

  const completionRate = doctor.total_appointments > 0
    ? Math.round((doctor.completed_appointments / doctor.total_appointments) * 100)
    : 0;

  if (viewMode === 'list') {
    return (
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Avatar
              src={doctor.profile_image}
              sx={{ width: 80, height: 80 }}
            >
              {doctor.first_name[0]}{doctor.last_name[0]}
            </Avatar>
            
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <Typography variant="h6">
                  {doctor.title} {doctor.first_name} {doctor.last_name}
                </Typography>
                <Chip
                  label={doctor.status}
                  color={getStatusColor(doctor.status) as any}
                  size="small"
                  icon={getAvailabilityIcon()}
                />
                <Rating value={doctor.rating} readOnly size="small" />
                <Typography variant="body2" color="text.secondary">
                  ({doctor.total_reviews})
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 4, mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Department:</strong> {doctor.department}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Specialization:</strong> {doctor.specialization.join(', ')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>ID:</strong> {doctor.doctor_id}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Phone sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="body2">{doctor.phone}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Email sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="body2">{doctor.email}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="body2">{doctor.city}, {doctor.state}</Typography>
                </Box>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 200 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="primary">
                  {doctor.total_patients}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Patients
                </Typography>
              </Box>
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2">Completion Rate</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {completionRate}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={completionRate}
                  color={completionRate > 80 ? 'success' : completionRate > 60 ? 'warning' : 'error'}
                />
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button
                size="small"
                variant="contained"
                startIcon={<Visibility />}
                onClick={onView}
              >
                View
              </Button>
              <Button
                size="small"
                variant="outlined"
                startIcon={<Edit />}
                onClick={onEdit}
              >
                Edit
              </Button>
              <Button
                size="small"
                variant="outlined"
                startIcon={<Schedule />}
                onClick={onSchedule}
              >
                Schedule
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  }

  // Grid view
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flex: 1 }}>
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Avatar
            src={doctor.profile_image}
            sx={{ width: 100, height: 100, mx: 'auto', mb: 2 }}
          >
            {doctor.first_name[0]}{doctor.last_name[0]}
          </Avatar>
          <Typography variant="h6" gutterBottom>
            {doctor.title} {doctor.first_name} {doctor.last_name}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {doctor.doctor_id}
          </Typography>
          <Chip
            label={doctor.status}
            color={getStatusColor(doctor.status) as any}
            size="small"
            icon={getAvailabilityIcon()}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            <strong>{doctor.department}</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {doctor.specialization.join(', ')}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
          <Rating value={doctor.rating} readOnly size="small" />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            ({doctor.total_reviews})
          </Typography>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mb: 2 }}>
          <Box sx={{ textAlign: 'center' }}>
            <People color="primary" />
            <Typography variant="h6">{doctor.total_patients}</Typography>
            <Typography variant="caption" color="text.secondary">
              Patients
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <AttachMoney color="success" />
            <Typography variant="h6">${doctor.consultation_fee}</Typography>
            <Typography variant="caption" color="text.secondary">
              Per Visit
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mb: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="caption">Completion Rate</Typography>
            <Typography variant="caption" fontWeight="bold">
              {completionRate}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={completionRate}
            color={completionRate > 80 ? 'success' : completionRate > 60 ? 'warning' : 'error'}
          />
        </Box>

        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
            <Phone sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="caption">{doctor.phone}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
            <Email sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="caption" noWrap>
              {doctor.email}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="caption">
              {doctor.city}, {doctor.state}
            </Typography>
          </Box>
        </Box>
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-around', borderTop: 1, borderColor: 'divider' }}>
        <Tooltip title="View Profile">
          <IconButton color="primary" onClick={onView}>
            <Visibility />
          </IconButton>
        </Tooltip>
        <Tooltip title="Edit">
          <IconButton color="default" onClick={onEdit}>
            <Edit />
          </IconButton>
        </Tooltip>
        <Tooltip title="Manage Schedule">
          <IconButton color="default" onClick={onSchedule}>
            <Schedule />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
};

export default DoctorCard;