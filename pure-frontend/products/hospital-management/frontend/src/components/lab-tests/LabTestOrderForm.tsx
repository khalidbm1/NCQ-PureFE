import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Autocomplete,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Card,
  CardContent,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Alert,
  FormControlLabel,
  Checkbox,
  Divider,
} from '@mui/material';
import {
  Add,
  Delete,
  Search,
  Save,
  Print,
  Science,
  AccessTime,
  LocalOffer,
  Info,
} from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { LabTest, LabTestTemplate, createLabTest } from '../../store/slices/labTestSlice';
import { showNotification } from '../../store/slices/notificationSlice';

interface LabTestOrderFormProps {
  patientId?: string;
  patientName?: string;
  appointmentId?: string;
  onSuccess?: (labTest: LabTest) => void;
  onCancel?: () => void;
}

const LabTestOrderForm: React.FC<LabTestOrderFormProps> = ({
  patientId,
  patientName,
  appointmentId,
  onSuccess,
  onCancel,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { templates } = useSelector((state: RootState) => state.labTests);
  const { patients } = useSelector((state: RootState) => state.patients);
  const { doctors } = useSelector((state: RootState) => state.doctors);
  const { user } = useSelector((state: RootState) => state.auth);

  const [selectedPatient, setSelectedPatient] = useState<any>(
    patientId ? patients.find(p => p.id === patientId) : null
  );
  const [selectedTests, setSelectedTests] = useState<LabTestTemplate[]>([]);
  const [priority, setPriority] = useState<'routine' | 'urgent' | 'stat'>('routine');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Filter templates based on search and category
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tests.some(test => test.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || template.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', 'hematology', 'biochemistry', 'microbiology', 'immunology', 'pathology', 'radiology'];

  const handleAddTest = (template: LabTestTemplate) => {
    if (!selectedTests.find(t => t.id === template.id)) {
      setSelectedTests([...selectedTests, template]);
    }
  };

  const handleRemoveTest = (templateId: string) => {
    setSelectedTests(selectedTests.filter(t => t.id !== templateId));
  };

  const getTotalPrice = () => {
    return selectedTests.reduce((sum, test) => sum + test.price, 0);
  };

  const getEstimatedTime = () => {
    if (selectedTests.length === 0) return 'N/A';
    
    // Get the maximum turnaround time
    const times = selectedTests.map(test => {
      const match = test.turnaround_time.match(/(\d+)/);
      return match ? parseInt(match[1]) : 0;
    });
    
    const maxTime = Math.max(...times);
    return `${maxTime} hours`;
  };

  const handleSubmit = async () => {
    if (!selectedPatient || selectedTests.length === 0) {
      dispatch(showNotification({
        message: 'Please select a patient and at least one test',
        severity: 'error',
      }));
      return;
    }

    const currentDoctor = doctors.find(d => d.email === user?.email);
    
    // Create lab test orders for each selected test
    const promises = selectedTests.map(template => {
      const labTestData: Partial<LabTest> = {
        patient_id: selectedPatient.id,
        patient_name: `${selectedPatient.first_name} ${selectedPatient.last_name}`,
        doctor_id: currentDoctor?.id || user?.id || '',
        doctor_name: currentDoctor ? `${currentDoctor.title} ${currentDoctor.first_name} ${currentDoctor.last_name}` : user?.full_name || '',
        appointment_id: appointmentId,
        test_name: template.name,
        test_category: template.category as LabTest['test_category'],
        test_type: template.tests[0]?.code || template.name,
        priority,
        status: 'ordered',
        sample_type: template.sample_required,
        notes: `${clinicalNotes}\n${specialInstructions}`.trim(),
        ordered_date: new Date().toISOString(),
        due_date: dueDate?.toISOString(),
        price: template.price,
        is_paid: false,
      };

      return dispatch(createLabTest(labTestData)).unwrap();
    });

    try {
      const results = await Promise.all(promises);
      dispatch(showNotification({
        message: `${results.length} lab test(s) ordered successfully`,
        severity: 'success',
      }));
      
      if (onSuccess && results.length > 0) {
        onSuccess(results[0]);
      }
    } catch (error) {
      dispatch(showNotification({
        message: 'Failed to create lab test order',
        severity: 'error',
      }));
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        {/* Patient Selection */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Patient Information
          </Typography>
          <Autocomplete
            value={selectedPatient}
            onChange={(_, newValue) => setSelectedPatient(newValue)}
            options={patients}
            getOptionLabel={(option) => option.name || ''}
            disabled={!!patientId}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Patient"
                required
                fullWidth
              />
            )}
            renderOption={(props, option) => (
              <Box component="li" {...props}>
                <Box>
                  <Typography variant="body1">{option.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    ID: {option.patient_id} • {option.gender} • Age: {option.age || 'N/A'}
                  </Typography>
                </Box>
              </Box>
            )}
          />
        </Paper>

        {/* Test Selection */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Select Lab Tests
          </Typography>
          
          {/* Search and Filter */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search tests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  label="Category"
                >
                  {categories.map(cat => (
                    <MenuItem key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* Test Templates */}
          <Grid container spacing={2}>
            {filteredTemplates.map(template => (
              <Grid item xs={12} md={6} key={template.id}>
                <Card 
                  variant="outlined"
                  sx={{ 
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': { boxShadow: 2 },
                    opacity: selectedTests.find(t => t.id === template.id) ? 0.6 : 1,
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" fontWeight="medium">
                          {template.name}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mt: 1, mb: 1 }}>
                          <Chip
                            label={template.category}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                          {template.is_package && (
                            <Chip
                              label="Package"
                              size="small"
                              color="secondary"
                              variant="outlined"
                            />
                          )}
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            <AccessTime sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} />
                            {template.turnaround_time}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            <LocalOffer sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} />
                            ${template.price}
                          </Typography>
                        </Box>
                        {template.preparation_instructions && (
                          <Alert severity="info" sx={{ mt: 1, py: 0 }}>
                            <Typography variant="caption">
                              {template.preparation_instructions}
                            </Typography>
                          </Alert>
                        )}
                      </Box>
                      <IconButton
                        onClick={() => handleAddTest(template)}
                        disabled={!!selectedTests.find(t => t.id === template.id)}
                        color="primary"
                      >
                        <Add />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Selected Tests */}
        {selectedTests.length > 0 && (
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Selected Tests ({selectedTests.length})
            </Typography>
            <List>
              {selectedTests.map((test, index) => (
                <React.Fragment key={test.id}>
                  {index > 0 && <Divider />}
                  <ListItem>
                    <ListItemText
                      primary={test.name}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {test.category} • {test.turnaround_time} • ${test.price}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Sample: {test.sample_required}
                          </Typography>
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" onClick={() => handleRemoveTest(test.id)}>
                        <Delete />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                </React.Fragment>
              ))}
            </List>
            
            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Total Tests: {selectedTests.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Estimated Time: {getEstimatedTime()}
                  </Typography>
                </Grid>
                <Grid item xs={6} sx={{ textAlign: 'right' }}>
                  <Typography variant="body2" color="text.secondary">
                    Total Cost:
                  </Typography>
                  <Typography variant="h6" color="primary">
                    ${getTotalPrice()}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        )}

        {/* Order Details */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Order Details
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  label="Priority"
                >
                  <MenuItem value="routine">Routine</MenuItem>
                  <MenuItem value="urgent">Urgent</MenuItem>
                  <MenuItem value="stat">STAT</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <DateTimePicker
                label="Due Date/Time"
                value={dueDate}
                onChange={(newValue) => setDueDate(newValue)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Clinical Notes"
                value={clinicalNotes}
                onChange={(e) => setClinicalNotes(e.target.value)}
                placeholder="Reason for test, clinical findings, provisional diagnosis..."
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Special Instructions"
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="Any special handling or processing instructions..."
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Actions */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          {onCancel && (
            <Button variant="outlined" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button
            variant="outlined"
            startIcon={<Print />}
            onClick={() => {
              handleSubmit();
              // Print functionality would go here
            }}
            disabled={!selectedPatient || selectedTests.length === 0}
          >
            Order & Print
          </Button>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={handleSubmit}
            disabled={!selectedPatient || selectedTests.length === 0}
          >
            Create Order
          </Button>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default LabTestOrderForm;