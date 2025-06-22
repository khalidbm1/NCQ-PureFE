import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  Divider,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Print,
  Download,
  Share,
  Edit,
  Lock,
  AttachFile,
  LocalHospital,
  Thermostat,
  Favorite,
  Air,
  MonitorHeart,
  Height,
  Scale,
  Warning,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { MedicalRecord, VitalSigns } from '../../store/slices/medicalRecordSlice';

interface MedicalRecordViewProps {
  record: MedicalRecord;
  onEdit?: () => void;
  onPrint?: () => void;
  onDownload?: () => void;
  onShare?: () => void;
}

const MedicalRecordView: React.FC<MedicalRecordViewProps> = ({
  record,
  onEdit,
  onPrint,
  onDownload,
  onShare,
}) => {
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  const getRecordTypeColor = (type: string) => {
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

  const renderVitalSign = (
    icon: JSX.Element,
    label: string,
    value: string | number | undefined,
    unit?: string,
    normalRange?: string,
    isAbnormal?: boolean
  ) => {
    if (!value) return null;
    
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <IconButton size="small" color={isAbnormal ? 'error' : 'default'}>
          {icon}
        </IconButton>
        <Box sx={{ ml: 1, flex: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
          <Typography variant="body1" fontWeight={isAbnormal ? 'bold' : 'normal'}>
            {value}{unit && ` ${unit}`}
            {normalRange && (
              <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                (Normal: {normalRange})
              </Typography>
            )}
          </Typography>
        </Box>
        {isAbnormal && <Warning color="error" fontSize="small" />}
      </Box>
    );
  };

  const renderVitalSigns = (vitals: VitalSigns) => {
    return (
      <>
        {renderVitalSign(
          <Thermostat />,
          'Temperature',
          vitals.temperature,
          vitals.temperature_unit === 'F' ? '°F' : '°C',
          vitals.temperature_unit === 'F' ? '97-99°F' : '36-37.5°C',
          vitals.temperature !== undefined && vitals.temperature !== null && (
            (vitals.temperature_unit === 'F' && (vitals.temperature < 97 || vitals.temperature > 99)) ||
            (vitals.temperature_unit === 'C' && (vitals.temperature < 36 || vitals.temperature > 37.5))
          )
        )}
        {renderVitalSign(
          <Favorite />,
          'Blood Pressure',
          vitals.blood_pressure_systolic && vitals.blood_pressure_diastolic
            ? `${vitals.blood_pressure_systolic}/${vitals.blood_pressure_diastolic}`
            : undefined,
          'mmHg',
          '120/80 mmHg',
          (vitals.blood_pressure_systolic !== undefined && vitals.blood_pressure_systolic !== null && vitals.blood_pressure_systolic > 140) ||
          (vitals.blood_pressure_diastolic !== undefined && vitals.blood_pressure_diastolic !== null && vitals.blood_pressure_diastolic > 90)
        )}
        {renderVitalSign(
          <MonitorHeart />,
          'Heart Rate',
          vitals.heart_rate,
          'bpm',
          '60-100 bpm',
          vitals.heart_rate && (vitals.heart_rate < 60 || vitals.heart_rate > 100)
        )}
        {renderVitalSign(
          <Air />,
          'Respiratory Rate',
          vitals.respiratory_rate,
          '/min',
          '12-20/min',
          vitals.respiratory_rate && (vitals.respiratory_rate < 12 || vitals.respiratory_rate > 20)
        )}
        {renderVitalSign(
          <MonitorHeart />,
          'O2 Saturation',
          vitals.oxygen_saturation,
          '%',
          '>95%',
          vitals.oxygen_saturation && vitals.oxygen_saturation < 95
        )}
        {renderVitalSign(
          <Scale />,
          'Weight',
          vitals.weight,
          vitals.weight_unit
        )}
        {renderVitalSign(
          <Height />,
          'Height',
          vitals.height,
          vitals.height_unit
        )}
        {vitals.bmi && renderVitalSign(
          <Scale />,
          'BMI',
          vitals.bmi,
          '',
          '18.5-24.9',
          vitals.bmi < 18.5 || vitals.bmi > 24.9
        )}
        {vitals.pain_scale !== undefined && renderVitalSign(
          <Warning />,
          'Pain Scale',
          vitals.pain_scale,
          '/10',
          '0-3',
          vitals.pain_scale > 3
        )}
      </>
    );
  };

  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  return (
    <Box>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h5" gutterBottom>
              Medical Record #{record.record_id}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Chip
                label={record.type.charAt(0).toUpperCase() + record.type.slice(1)}
                color={getRecordTypeColor(record.type)}
                size="small"
              />
              <Chip
                label={record.department}
                variant="outlined"
                size="small"
              />
              {record.is_confidential && (
                <Chip
                  icon={<Lock />}
                  label="Confidential"
                  color="error"
                  size="small"
                />
              )}
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {onEdit && (
              <Button
                variant="outlined"
                startIcon={<Edit />}
                onClick={onEdit}
              >
                Edit
              </Button>
            )}
            <IconButton onClick={handlePrint} title="Print">
              <Print />
            </IconButton>
            {onDownload && (
              <IconButton onClick={onDownload} title="Download">
                <Download />
              </IconButton>
            )}
            {onShare && (
              <IconButton onClick={() => setShareDialogOpen(true)} title="Share">
                <Share />
              </IconButton>
            )}
          </Box>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">Patient</Typography>
            <Typography variant="body1">{record.patient_name}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">Doctor</Typography>
            <Typography variant="body1">{record.doctor_name}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">Date</Typography>
            <Typography variant="body1">
              {format(new Date(record.date), 'PPpp')}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">Last Updated</Typography>
            <Typography variant="body1">
              {format(new Date(record.updated_at), 'PPp')}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Chief Complaint */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Chief Complaint</Typography>
        <Typography variant="body1">{record.chief_complaint}</Typography>
      </Paper>

      {/* History of Present Illness */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>History of Present Illness</Typography>
        <Typography variant="body1" paragraph>{record.history_of_present_illness}</Typography>
      </Paper>

      {/* Vital Signs */}
      {record.vital_signs && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>Vital Signs</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {renderVitalSigns(record.vital_signs)}
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Clinical History */}
      {(record.past_medical_history || record.family_history || record.social_history) && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>Clinical History</Typography>
          {record.past_medical_history && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" color="primary" gutterBottom>
                Past Medical History
              </Typography>
              <Typography variant="body1">{record.past_medical_history}</Typography>
            </Box>
          )}
          {record.family_history && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" color="primary" gutterBottom>
                Family History
              </Typography>
              <Typography variant="body1">{record.family_history}</Typography>
            </Box>
          )}
          {record.social_history && (
            <Box>
              <Typography variant="subtitle1" color="primary" gutterBottom>
                Social History
              </Typography>
              <Typography variant="body1">{record.social_history}</Typography>
            </Box>
          )}
        </Paper>
      )}

      {/* Review of Systems */}
      {record.review_of_systems && Object.keys(record.review_of_systems).length > 0 && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>Review of Systems</Typography>
          <Grid container spacing={2}>
            {Object.entries(record.review_of_systems).map(([system, findings]) => 
              findings && (
                <Grid item xs={12} md={6} key={system}>
                  <Typography variant="subtitle1" color="primary" gutterBottom>
                    {system.charAt(0).toUpperCase() + system.slice(1).replace('_', ' ')}
                  </Typography>
                  <Typography variant="body2">{findings}</Typography>
                </Grid>
              )
            )}
          </Grid>
        </Paper>
      )}

      {/* Physical Examination */}
      {record.physical_examination && Object.keys(record.physical_examination).length > 0 && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>Physical Examination</Typography>
          <Grid container spacing={2}>
            {Object.entries(record.physical_examination).map(([exam, findings]) => 
              findings && (
                <Grid item xs={12} md={6} key={exam}>
                  <Typography variant="subtitle1" color="primary" gutterBottom>
                    {exam.charAt(0).toUpperCase() + exam.slice(1).replace(/_/g, ' ')}
                  </Typography>
                  <Typography variant="body2">{findings}</Typography>
                </Grid>
              )
            )}
          </Grid>
        </Paper>
      )}

      {/* Diagnosis */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Diagnosis</Typography>
        <List>
          {record.diagnosis.map((diag, index) => (
            <ListItem key={index}>
              <ListItemIcon>
                <LocalHospital color={diag.type === 'primary' ? 'primary' : 'default'} />
              </ListItemIcon>
              <ListItemText
                primary={`${diag.code} - ${diag.description}`}
                secondary={diag.type.charAt(0).toUpperCase() + diag.type.slice(1)}
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Treatment Plan */}
      {record.treatment_plan && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>Treatment Plan</Typography>
          <Typography variant="body1" paragraph>{record.treatment_plan}</Typography>
          
          {record.medications_prescribed && record.medications_prescribed.length > 0 && (
            <>
              <Typography variant="subtitle1" color="primary" gutterBottom>
                Medications Prescribed
              </Typography>
              <List dense>
                {record.medications_prescribed.map((med, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={med} />
                  </ListItem>
                ))}
              </List>
            </>
          )}
        </Paper>
      )}

      {/* Clinical Notes */}
      {record.clinical_notes && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>Clinical Notes</Typography>
          <Typography variant="body1">{record.clinical_notes}</Typography>
        </Paper>
      )}

      {/* Follow-up Instructions */}
      {record.follow_up_instructions && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>Follow-up Instructions</Typography>
          <Typography variant="body1">{record.follow_up_instructions}</Typography>
        </Paper>
      )}

      {/* Attachments */}
      {record.attachments && record.attachments.length > 0 && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>Attachments</Typography>
          <List>
            {record.attachments.map((attachment) => (
              <ListItem key={attachment.id}>
                <ListItemIcon>
                  <AttachFile />
                </ListItemIcon>
                <ListItemText
                  primary={attachment.name}
                  secondary={`${(attachment.size / 1024).toFixed(2)} KB - Uploaded by ${attachment.uploaded_by} on ${format(new Date(attachment.uploaded_at), 'PP')}`}
                />
                <Button size="small" variant="outlined" href={attachment.url} target="_blank">
                  View
                </Button>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      {/* Procedures Performed */}
      {record.procedures_performed && record.procedures_performed.length > 0 && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>Procedures Performed</Typography>
          <List dense>
            {record.procedures_performed.map((procedure, index) => (
              <ListItem key={index}>
                <ListItemText primary={procedure} />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      {/* Confidentiality Notice */}
      {record.is_confidential && (
        <Alert severity="warning" icon={<Lock />}>
          This is a confidential medical record. Access is restricted to authorized personnel only.
        </Alert>
      )}

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onClose={() => setShareDialogOpen(false)}>
        <DialogTitle>Share Medical Record</DialogTitle>
        <DialogContent>
          <Typography>
            Share functionality would be implemented here with appropriate security measures.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShareDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setShareDialogOpen(false)}>
            Share
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MedicalRecordView;