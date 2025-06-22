import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Tab,
  Tabs,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Autocomplete,
  TextField,
  Chip,
} from '@mui/material';
import {
  Add,
  List as ListIcon,
  Timeline,
  Close,
  LocalHospital,
  Assignment,
  EventNote,
  TrendingUp,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import {
  fetchMedicalRecords,
  fetchPatientSummary,
  setSelectedRecord,
} from '../store/slices/medicalRecordSlice';
import MedicalRecordForm from '../components/medical-records/MedicalRecordForm';
import MedicalRecordList from '../components/medical-records/MedicalRecordList';
import MedicalRecordTimeline from '../components/medical-records/MedicalRecordTimeline';
import MedicalRecordView from '../components/medical-records/MedicalRecordView';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`medical-records-tabpanel-${index}`}
      aria-labelledby={`medical-records-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

const MedicalRecords: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { records, loading, patientSummary } = useSelector(
    (state: RootState) => state.medicalRecords
  );
  const { patients } = useSelector((state: RootState) => state.patients);
  
  const [tabValue, setTabValue] = useState(0);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [selectedRecord, setSelectedRecordLocal] = useState<any>(null);

  useEffect(() => {
    // Fetch all medical records on component mount
    if (records.length === 0) {
      // In a real app, this would fetch all records
      // For now, we're using mock data from the slice
    }
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handlePatientSelect = (patient: any) => {
    setSelectedPatient(patient);
    if (patient) {
      dispatch(fetchPatientSummary(patient.id));
    }
  };

  const handleCreateNew = () => {
    if (selectedPatient) {
      setCreateDialogOpen(true);
    }
  };

  const handleRecordSelect = (record: any) => {
    setSelectedRecordLocal(record);
    dispatch(setSelectedRecord(record));
    setViewDialogOpen(true);
  };

  const getStatistics = () => {
    const stats = {
      total: records.length,
      thisMonth: records.filter(r => {
        const recordDate = new Date(r.date);
        const now = new Date();
        return recordDate.getMonth() === now.getMonth() && 
               recordDate.getFullYear() === now.getFullYear();
      }).length,
      byType: records.reduce((acc, record) => {
        acc[record.type] = (acc[record.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      confidential: records.filter(r => r.is_confidential).length,
    };
    return stats;
  };

  const stats = getStatistics();

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Medical Records
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage and view patient medical records, history, and clinical documentation
        </Typography>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="overline">
                    Total Records
                  </Typography>
                  <Typography variant="h4">{stats.total}</Typography>
                </Box>
                <Assignment fontSize="large" color="primary" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="overline">
                    This Month
                  </Typography>
                  <Typography variant="h4">{stats.thisMonth}</Typography>
                </Box>
                <TrendingUp fontSize="large" color="success" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="overline">
                    Consultations
                  </Typography>
                  <Typography variant="h4">{stats.byType.consultation || 0}</Typography>
                </Box>
                <EventNote fontSize="large" color="info" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="overline">
                    Procedures
                  </Typography>
                  <Typography variant="h4">{stats.byType.procedure || 0}</Typography>
                </Box>
                <LocalHospital fontSize="large" color="secondary" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Patient Selection and Actions */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <Autocomplete
              options={patients}
              getOptionLabel={(option) => `${option.first_name} ${option.last_name} - ${option.medical_record_number}`}
              value={selectedPatient}
              onChange={(_, newValue) => handlePatientSelect(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Patient"
                  placeholder="Search by name or MRN..."
                />
              )}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  <Box>
                    <Typography variant="body1">
                      {option.first_name} {option.last_name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      MRN: {option.medical_record_number} | DOB: {new Date(option.date_of_birth).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleCreateNew}
                disabled={!selectedPatient}
              >
                New Record
              </Button>
            </Box>
          </Grid>
        </Grid>

        {/* Patient Summary */}
        {selectedPatient && patientSummary && (
          <Box sx={{ mt: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom>
              Patient Summary
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <Typography variant="caption" color="text.secondary">Blood Type</Typography>
                <Typography variant="body2">{patientSummary.blood_type || 'Not recorded'}</Typography>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="caption" color="text.secondary">Allergies</Typography>
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 0.5 }}>
                  {patientSummary.allergies?.length > 0 ? (
                    patientSummary.allergies.map((allergy, idx) => (
                      <Chip key={idx} label={allergy} size="small" color="error" />
                    ))
                  ) : (
                    <Typography variant="body2">None</Typography>
                  )}
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="caption" color="text.secondary">Chronic Conditions</Typography>
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 0.5 }}>
                  {patientSummary.chronic_conditions?.length > 0 ? (
                    patientSummary.chronic_conditions.map((condition, idx) => (
                      <Chip key={idx} label={condition} size="small" color="warning" />
                    ))
                  ) : (
                    <Typography variant="body2">None</Typography>
                  )}
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="caption" color="text.secondary">Total Visits</Typography>
                <Typography variant="body2">{patientSummary.total_visits || 0}</Typography>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>

      {/* Tabs for different views */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab icon={<ListIcon />} label="List View" />
          <Tab icon={<Timeline />} label="Timeline View" disabled={!selectedPatient} />
        </Tabs>
      </Paper>

      {/* Tab Panels */}
      <TabPanel value={tabValue} index={0}>
        <MedicalRecordList
          patientId={selectedPatient?.id}
          patientName={selectedPatient ? `${selectedPatient.first_name} ${selectedPatient.last_name}` : undefined}
          onRecordSelect={handleRecordSelect}
        />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {selectedPatient && (
          <MedicalRecordTimeline
            patientId={selectedPatient.id}
            onRecordClick={handleRecordSelect}
          />
        )}
      </TabPanel>

      {/* Create Dialog */}
      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">New Medical Record</Typography>
            <IconButton onClick={() => setCreateDialogOpen(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedPatient && (
            <MedicalRecordForm
              patientId={selectedPatient.id}
              patientName={`${selectedPatient.first_name} ${selectedPatient.last_name}`}
              onSuccess={() => {
                setCreateDialogOpen(false);
                // Refresh records
              }}
              onCancel={() => setCreateDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Medical Record Details</Typography>
            <IconButton onClick={() => setViewDialogOpen(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedRecord && (
            <MedicalRecordView
              record={selectedRecord}
              onEdit={() => {
                setViewDialogOpen(false);
                setCreateDialogOpen(true);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default MedicalRecords;