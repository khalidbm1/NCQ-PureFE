import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Grid,
  Divider,
  Chip,
  IconButton,
  Tab,
  Tabs,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Paper,
  Avatar,
  Tooltip,
} from '@mui/material';
import {
  Close,
  Edit,
  Print,
  Phone,
  Email,
  CalendarMonth,
  Bloodtype,
  Work,
  LocalHospital,
  LocalHospital as Emergency,
  Assignment,
  Timeline,
  Medication,
  Science,
  Receipt,
  Download,
} from '@mui/icons-material';
import { format, differenceInYears } from 'date-fns';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`patient-tabpanel-${index}`}
      aria-labelledby={`patient-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

interface PatientDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  patient: any;
  onEdit: () => void;
}

const PatientDetailsDialog: React.FC<PatientDetailsDialogProps> = ({
  open,
  onClose,
  patient,
  onEdit,
}) => {
  const [tabValue, setTabValue] = useState(0);

  if (!patient) return null;

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handlePrint = () => {
    window.print();
  };

  const getAge = () => {
    if (!patient.date_of_birth) return 'N/A';
    return differenceInYears(new Date(), new Date(patient.date_of_birth));
  };

  const formatDate = (date: string) => {
    if (!date) return 'N/A';
    return format(new Date(date), 'MMM dd, yyyy');
  };

  // Mock data for medical history - in real app, this would come from API
  const appointments = [
    { id: 1, date: '2024-01-15', doctor: 'Dr. Smith', reason: 'Regular Checkup', status: 'Completed' },
    { id: 2, date: '2024-02-20', doctor: 'Dr. Johnson', reason: 'Follow-up', status: 'Completed' },
    { id: 3, date: '2024-03-25', doctor: 'Dr. Williams', reason: 'Consultation', status: 'Scheduled' },
  ];

  const prescriptions = [
    { id: 1, date: '2024-01-15', medication: 'Amoxicillin 500mg', dosage: 'Twice daily for 7 days', doctor: 'Dr. Smith' },
    { id: 2, date: '2024-02-20', medication: 'Ibuprofen 400mg', dosage: 'As needed for pain', doctor: 'Dr. Johnson' },
  ];

  const labResults = [
    { id: 1, date: '2024-01-10', test: 'Complete Blood Count', status: 'Normal', file: 'cbc_report.pdf' },
    { id: 2, date: '2024-01-10', test: 'Lipid Profile', status: 'Borderline High', file: 'lipid_report.pdf' },
  ];

  const invoices = [
    { id: 1, date: '2024-01-15', amount: '$150', status: 'Paid', description: 'Consultation + Lab Tests' },
    { id: 2, date: '2024-02-20', amount: '$75', status: 'Pending', description: 'Follow-up Visit' },
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar sx={{ width: 56, height: 56, bgcolor: 'primary.main' }}>
              {patient.first_name?.[0]}{patient.last_name?.[0]}
            </Avatar>
            <Box>
              <Typography variant="h5">
                {patient.first_name} {patient.last_name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Patient ID: {patient.patient_id}
              </Typography>
            </Box>
          </Box>
          <Box>
            <Tooltip title="Print">
              <IconButton onClick={handlePrint}>
                <Print />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit">
              <IconButton onClick={onEdit} color="primary">
                <Edit />
              </IconButton>
            </Tooltip>
            <IconButton onClick={onClose}>
              <Close />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Tabs value={tabValue} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="Overview" />
          <Tab label="Medical History" />
          <Tab label="Prescriptions" />
          <Tab label="Lab Results" />
          <Tab label="Billing" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            {/* Personal Information */}
            <Grid item xs={12}>
              <Paper elevation={0} sx={{ p: 3, bgcolor: 'grey.50' }}>
                <Typography variant="h6" gutterBottom>
                  Personal Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                      <CalendarMonth color="action" />
                      <Box>
                        <Typography variant="caption" color="text.secondary">Date of Birth</Typography>
                        <Typography variant="body2">{formatDate(patient.date_of_birth)} ({getAge()} years)</Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                      <Assignment color="action" />
                      <Box>
                        <Typography variant="caption" color="text.secondary">Gender</Typography>
                        <Typography variant="body2">{patient.gender || 'N/A'}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                      <Bloodtype color="action" />
                      <Box>
                        <Typography variant="caption" color="text.secondary">Blood Group</Typography>
                        <Typography variant="body2">{patient.blood_group || 'N/A'}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                      <Work color="action" />
                      <Box>
                        <Typography variant="caption" color="text.secondary">Occupation</Typography>
                        <Typography variant="body2">{patient.occupation || 'N/A'}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Contact Information */}
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 3, bgcolor: 'grey.50', height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  Contact Information
                </Typography>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <Phone color="action" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">Phone</Typography>
                    <Typography variant="body2">{patient.phone}</Typography>
                  </Box>
                </Box>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <Email color="action" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">Email</Typography>
                    <Typography variant="body2">{patient.email || 'N/A'}</Typography>
                  </Box>
                </Box>
                <Box mb={2}>
                  <Typography variant="caption" color="text.secondary">Address</Typography>
                  <Typography variant="body2">
                    {patient.address}
                    {patient.city && `, ${patient.city}`}
                    {patient.state && `, ${patient.state}`}
                    {patient.postal_code && ` ${patient.postal_code}`}
                  </Typography>
                </Box>
              </Paper>
            </Grid>

            {/* Emergency Contact */}
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 3, bgcolor: 'grey.50', height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  Emergency Contact
                </Typography>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <Emergency color="error" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">Name</Typography>
                    <Typography variant="body2">{patient.emergency_contact_name}</Typography>
                  </Box>
                </Box>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <Phone color="action" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">Phone</Typography>
                    <Typography variant="body2">{patient.emergency_contact_phone}</Typography>
                  </Box>
                </Box>
                {patient.emergency_contact_relationship && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">Relationship</Typography>
                    <Typography variant="body2">{patient.emergency_contact_relationship}</Typography>
                  </Box>
                )}
              </Paper>
            </Grid>

            {/* Medical Information */}
            <Grid item xs={12}>
              <Paper elevation={0} sx={{ p: 3, bgcolor: 'grey.50' }}>
                <Typography variant="h6" gutterBottom>
                  Medical Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Box mb={2}>
                      <Typography variant="subtitle2" gutterBottom>Chronic Diseases</Typography>
                      {patient.chronic_diseases && patient.chronic_diseases.length > 0 ? (
                        <Box display="flex" gap={1} flexWrap="wrap">
                          {patient.chronic_diseases.map((disease: string, index: number) => (
                            <Chip key={index} label={disease} size="small" color="error" variant="outlined" />
                          ))}
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary">None reported</Typography>
                      )}
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box mb={2}>
                      <Typography variant="subtitle2" gutterBottom>Allergies</Typography>
                      {patient.allergies ? (
                        <Typography variant="body2">{patient.allergies}</Typography>
                      ) : (
                        <Typography variant="body2" color="text.secondary">None reported</Typography>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Insurance Information */}
            {(patient.insurance_provider || patient.insurance_policy_number) && (
              <Grid item xs={12}>
                <Paper elevation={0} sx={{ p: 3, bgcolor: 'grey.50' }}>
                  <Typography variant="h6" gutterBottom>
                    Insurance Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Provider</Typography>
                        <Typography variant="body2">{patient.insurance_provider || 'N/A'}</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Policy Number</Typography>
                        <Typography variant="body2">{patient.insurance_policy_number || 'N/A'}</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            )}

            {/* Additional Notes */}
            {patient.notes && (
              <Grid item xs={12}>
                <Paper elevation={0} sx={{ p: 3, bgcolor: 'grey.50' }}>
                  <Typography variant="h6" gutterBottom>
                    Additional Notes
                  </Typography>
                  <Typography variant="body2">{patient.notes}</Typography>
                </Paper>
              </Grid>
            )}
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>
            Appointment History
          </Typography>
          <List>
            {appointments.map((appointment) => (
              <React.Fragment key={appointment.id}>
                <ListItem>
                  <ListItemText
                    primary={appointment.reason}
                    secondary={
                      <>
                        {formatDate(appointment.date)} • {appointment.doctor}
                      </>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Chip
                      label={appointment.status}
                      size="small"
                      color={appointment.status === 'Completed' ? 'success' : 'warning'}
                      variant="outlined"
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>
            Prescription History
          </Typography>
          <List>
            {prescriptions.map((prescription) => (
              <React.Fragment key={prescription.id}>
                <ListItem>
                  <ListItemText
                    primary={prescription.medication}
                    secondary={
                      <>
                        {prescription.dosage} • Prescribed on {formatDate(prescription.date)} by {prescription.doctor}
                      </>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton size="small">
                      <Print />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" gutterBottom>
            Lab Results
          </Typography>
          <List>
            {labResults.map((result) => (
              <React.Fragment key={result.id}>
                <ListItem>
                  <ListItemText
                    primary={result.test}
                    secondary={
                      <>
                        {formatDate(result.date)} • Status: {result.status}
                      </>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Tooltip title="Download Report">
                      <IconButton size="small" color="primary">
                        <Download />
                      </IconButton>
                    </Tooltip>
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </TabPanel>

        <TabPanel value={tabValue} index={4}>
          <Typography variant="h6" gutterBottom>
            Billing History
          </Typography>
          <List>
            {invoices.map((invoice) => (
              <React.Fragment key={invoice.id}>
                <ListItem>
                  <ListItemText
                    primary={invoice.description}
                    secondary={
                      <>
                        {formatDate(invoice.date)} • Amount: {invoice.amount}
                      </>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Chip
                        label={invoice.status}
                        size="small"
                        color={invoice.status === 'Paid' ? 'success' : 'warning'}
                        variant="outlined"
                      />
                      <IconButton size="small">
                        <Receipt />
                      </IconButton>
                    </Box>
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </TabPanel>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button variant="contained" onClick={onEdit} startIcon={<Edit />}>
          Edit Patient
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PatientDetailsDialog;