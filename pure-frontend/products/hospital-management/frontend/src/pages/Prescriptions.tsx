import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  Paper,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  Add,
  Description,
  LocalPharmacy,
  TrendingUp,
  Receipt,
  Warning,
  CheckCircle,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { Prescription, setSelectedPrescription } from '../store/slices/prescriptionSlice';
import {
  PrescriptionWriter,
  PrescriptionView,
  PrescriptionList,
  DrugDatabase,
} from '../components/prescriptions';

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
      id={`prescriptions-tabpanel-${index}`}
      aria-labelledby={`prescriptions-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const Prescriptions: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { prescriptions, selectedPrescription } = useSelector(
    (state: RootState) => state.prescriptions
  );
  
  const [tabValue, setTabValue] = useState(0);
  const [writingPrescription, setWritingPrescription] = useState(false);
  const [viewingPrescription, setViewingPrescription] = useState<Prescription | null>(null);

  // Calculate statistics
  const today = new Date().toISOString().split('T')[0];
  const todayPrescriptions = prescriptions.filter(p => p.date_prescribed === today);
  const activePrescriptions = prescriptions.filter(p => p.status === 'active');
  const controlledSubstances = prescriptions.filter(p => 
    p.items.some(item => {
      // In real app, would check against drug database
      return item.drug_name.toLowerCase().includes('diazepam');
    })
  );

  const stats = {
    total: prescriptions.length,
    today: todayPrescriptions.length,
    active: activePrescriptions.length,
    controlled: controlledSubstances.length,
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleNewPrescription = () => {
    setWritingPrescription(true);
    setViewingPrescription(null);
  };

  const handleViewPrescription = (prescription: Prescription) => {
    setViewingPrescription(prescription);
    setWritingPrescription(false);
  };

  const handleEditPrescription = (prescription: Prescription) => {
    dispatch(setSelectedPrescription(prescription));
    setWritingPrescription(true);
    setViewingPrescription(null);
  };

  const handleCopyPrescription = (prescription: Prescription) => {
    // Copy prescription as template
    dispatch(setSelectedPrescription({
      ...prescription,
      id: '',
      prescription_number: '',
      date_prescribed: today,
      status: 'active',
    }));
    setWritingPrescription(true);
    setViewingPrescription(null);
  };

  const handleSavePrescription = (prescription: Prescription) => {
    setWritingPrescription(false);
    setViewingPrescription(prescription);
  };

  const handleCancelWrite = () => {
    setWritingPrescription(false);
    dispatch(setSelectedPrescription(null));
  };

  if (writingPrescription) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          {selectedPrescription ? 'Edit Prescription' : 'New Prescription'}
        </Typography>
        <PrescriptionWriter
          onSave={handleSavePrescription}
          onCancel={handleCancelWrite}
        />
      </Box>
    );
  }

  if (viewingPrescription) {
    return (
      <Box>
        <Button
          onClick={() => setViewingPrescription(null)}
          sx={{ mb: 2 }}
        >
          ← Back to Prescriptions
        </Button>
        <PrescriptionView
          prescription={viewingPrescription}
          onClose={() => setViewingPrescription(null)}
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
            Prescriptions
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage prescriptions and medication database
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleNewPrescription}
        >
          New Prescription
        </Button>
      </Box>

      {/* Statistics */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Total Prescriptions
                  </Typography>
                  <Typography variant="h4">
                    {stats.total}
                  </Typography>
                </Box>
                <Description color="primary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Today's
                  </Typography>
                  <Typography variant="h4" color="info.main">
                    {stats.today}
                  </Typography>
                </Box>
                <TrendingUp color="info" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Active
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    {stats.active}
                  </Typography>
                </Box>
                <CheckCircle color="success" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Controlled
                  </Typography>
                  <Typography variant="h4" color="warning.main">
                    {stats.controlled}
                  </Typography>
                </Box>
                <Warning color="warning" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Recent Prescriptions" />
          <Tab label="Drug Database" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <PrescriptionList
          prescriptions={prescriptions}
          onView={handleViewPrescription}
          onEdit={handleEditPrescription}
          onCopy={handleCopyPrescription}
        />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <DrugDatabase />
      </TabPanel>
    </Box>
  );
};

export default Prescriptions;