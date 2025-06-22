import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  IconButton,
  Collapse,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from '@mui/lab';
import {
  LocalHospital,
  EventNote,
  Healing,
  Warning as Emergency,
  Assignment,
  Science,
  ExpandMore,
  ExpandLess,
  Visibility,
  FilterList,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { MedicalRecord } from '../../store/slices/medicalRecordSlice';

interface MedicalRecordTimelineProps {
  patientId: string;
  onRecordClick?: (record: MedicalRecord) => void;
}

const MedicalRecordTimeline: React.FC<MedicalRecordTimelineProps> = ({
  patientId,
  onRecordClick,
}) => {
  const { records } = useSelector((state: RootState) => state.medicalRecords);
  const [expandedRecords, setExpandedRecords] = useState<Set<string>>(new Set());
  const [filterType, setFilterType] = useState<string>('all');
  const [filterYear, setFilterYear] = useState<string>('all');

  // Filter records for this patient
  const patientRecords = records
    .filter(record => record.patient_id === patientId)
    .filter(record => filterType === 'all' || record.type === filterType)
    .filter(record => {
      if (filterYear === 'all') return true;
      const recordYear = new Date(record.date).getFullYear().toString();
      return recordYear === filterYear;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Get unique years from records
  const years = Array.from(
    new Set(
      records
        .filter(r => r.patient_id === patientId)
        .map(r => new Date(r.date).getFullYear())
    )
  ).sort((a, b) => b - a);

  const getRecordIcon = (type: string) => {
    const icons: Record<string, JSX.Element> = {
      consultation: <EventNote />,
      admission: <LocalHospital />,
      procedure: <Healing />,
      surgery: <Healing />,
      emergency: <Emergency />,
      followup: <Assignment />,
      diagnostic: <Science />,
    };
    return icons[type] || <Assignment />;
  };

  const getRecordColor = (type: string) => {
    const colors: Record<string, any> = {
      consultation: 'primary',
      admission: 'secondary',
      procedure: 'info',
      surgery: 'error',
      emergency: 'warning',
      followup: 'default',
      diagnostic: 'success',
    };
    return colors[type] || 'default';
  };

  const toggleExpanded = (recordId: string) => {
    setExpandedRecords(prev => {
      const newSet = new Set(prev);
      if (newSet.has(recordId)) {
        newSet.delete(recordId);
      } else {
        newSet.add(recordId);
      }
      return newSet;
    });
  };

  const recordTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'consultation', label: 'Consultations' },
    { value: 'admission', label: 'Admissions' },
    { value: 'procedure', label: 'Procedures' },
    { value: 'surgery', label: 'Surgeries' },
    { value: 'emergency', label: 'Emergency Visits' },
    { value: 'followup', label: 'Follow-ups' },
    { value: 'diagnostic', label: 'Diagnostics' },
  ];

  return (
    <Box>
      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FilterList />
              Medical History Timeline
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Filter by Type</InputLabel>
              <Select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                label="Filter by Type"
              >
                {recordTypes.map(type => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Filter by Year</InputLabel>
              <Select
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                label="Filter by Year"
              >
                <MenuItem value="all">All Years</MenuItem>
                {years.map(year => (
                  <MenuItem key={year} value={year.toString()}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Timeline */}
      {patientRecords.length > 0 ? (
        <Timeline position="alternate">
          {patientRecords.map((record, index) => (
            <TimelineItem key={record.id}>
              <TimelineOppositeContent
                sx={{ m: 'auto 0' }}
                align={index % 2 === 0 ? 'right' : 'left'}
                variant="body2"
                color="text.secondary"
              >
                {format(new Date(record.date), 'PPP')}
                <br />
                {format(new Date(record.date), 'p')}
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineConnector sx={{ bgcolor: 'grey.300' }} />
                <TimelineDot color={getRecordColor(record.type)}>
                  {getRecordIcon(record.type)}
                </TimelineDot>
                <TimelineConnector sx={{ bgcolor: 'grey.300' }} />
              </TimelineSeparator>
              <TimelineContent sx={{ py: '12px', px: 2 }}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" component="span">
                          {record.type.charAt(0).toUpperCase() + record.type.slice(1)}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mt: 1, mb: 2 }}>
                          <Chip
                            label={record.department}
                            size="small"
                            variant="outlined"
                          />
                          {record.is_confidential && (
                            <Chip
                              label="Confidential"
                              size="small"
                              color="error"
                            />
                          )}
                        </Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          <strong>Doctor:</strong> {record.doctor_name}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          <strong>Chief Complaint:</strong> {record.chief_complaint}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() => toggleExpanded(record.id)}
                        >
                          {expandedRecords.has(record.id) ? <ExpandLess /> : <ExpandMore />}
                        </IconButton>
                        {onRecordClick && (
                          <IconButton
                            size="small"
                            onClick={() => onRecordClick(record)}
                          >
                            <Visibility />
                          </IconButton>
                        )}
                      </Box>
                    </Box>
                    
                    <Collapse in={expandedRecords.has(record.id)}>
                      <Box sx={{ mt: 2 }}>
                        {/* Diagnosis */}
                        <Typography variant="subtitle2" gutterBottom>
                          Diagnosis:
                        </Typography>
                        <List dense>
                          {record.diagnosis.map((diag, idx) => (
                            <ListItem key={idx}>
                              <ListItemText
                                primary={`${diag.code} - ${diag.description}`}
                                secondary={diag.type}
                              />
                            </ListItem>
                          ))}
                        </List>

                        {/* Treatment Plan */}
                        {record.treatment_plan && (
                          <>
                            <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                              Treatment Plan:
                            </Typography>
                            <Typography variant="body2" paragraph>
                              {record.treatment_plan}
                            </Typography>
                          </>
                        )}

                        {/* Medications */}
                        {record.medications_prescribed && record.medications_prescribed.length > 0 && (
                          <>
                            <Typography variant="subtitle2" gutterBottom>
                              Medications Prescribed:
                            </Typography>
                            <List dense>
                              {record.medications_prescribed.map((med, idx) => (
                                <ListItem key={idx}>
                                  <ListItemText primary={med} />
                                </ListItem>
                              ))}
                            </List>
                          </>
                        )}

                        {/* Procedures */}
                        {record.procedures_performed && record.procedures_performed.length > 0 && (
                          <>
                            <Typography variant="subtitle2" gutterBottom>
                              Procedures Performed:
                            </Typography>
                            <List dense>
                              {record.procedures_performed.map((proc, idx) => (
                                <ListItem key={idx}>
                                  <ListItemText primary={proc} />
                                </ListItem>
                              ))}
                            </List>
                          </>
                        )}

                        {/* Follow-up Instructions */}
                        {record.follow_up_instructions && (
                          <>
                            <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                              Follow-up Instructions:
                            </Typography>
                            <Typography variant="body2">
                              {record.follow_up_instructions}
                            </Typography>
                          </>
                        )}

                        {onRecordClick && (
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => onRecordClick(record)}
                            sx={{ mt: 2 }}
                            startIcon={<Visibility />}
                          >
                            View Full Record
                          </Button>
                        )}
                      </Box>
                    </Collapse>
                  </CardContent>
                </Card>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No Medical Records Found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {filterType !== 'all' || filterYear !== 'all'
              ? 'Try adjusting your filters to see more records.'
              : 'This patient has no medical records yet.'}
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default MedicalRecordTimeline;