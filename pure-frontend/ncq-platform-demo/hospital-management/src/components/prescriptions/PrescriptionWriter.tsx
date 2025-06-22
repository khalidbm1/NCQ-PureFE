import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Autocomplete,
  Button,
  IconButton,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Alert,
  FormControlLabel,
  Switch,
  Card,
  CardContent,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material';
import {
  Add,
  Delete,
  Save,
  Print,
  Email,
  History,
  Favorite,
  FavoriteBorder,
  Warning,
  Info,
  LocalPharmacy,
  Edit,
  ContentCopy,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import {
  Drug,
  PrescriptionItem,
  Prescription,
  PrescriptionTemplate,
  searchDrugsLocal,
  clearSearchResults,
  createPrescription,
  toggleTemplateFavorite,
} from '../../store/slices/prescriptionSlice';
import { showNotification } from '../../store/slices/notificationSlice';
import { format, addDays } from 'date-fns';
import DentalChart from './DentalChart';
import DermatologyBodyMap from './DermatologyBodyMap';

interface PrescriptionWriterProps {
  patientId?: string;
  patientName?: string;
  patientAge?: number;
  patientGender?: string;
  appointmentId?: string;
  onSave?: (prescription: Prescription) => void;
  onCancel?: () => void;
}

const PrescriptionWriter: React.FC<PrescriptionWriterProps> = ({
  patientId,
  patientName,
  patientAge,
  patientGender,
  appointmentId,
  onSave,
  onCancel,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { drugs, searchResults, templates } = useSelector((state: RootState) => state.prescriptions);
  const { user } = useSelector((state: RootState) => state.auth);
  const { doctors } = useSelector((state: RootState) => state.doctors);
  const { patients } = useSelector((state: RootState) => state.patients);

  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [diagnosis, setDiagnosis] = useState('');
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [prescriptionItems, setPrescriptionItems] = useState<PrescriptionItem[]>([]);
  const [notes, setNotes] = useState('');
  const [followUpDate, setFollowUpDate] = useState<Date | null>(null);
  const [validityDays, setValidityDays] = useState(30);
  const [templateMenuAnchor, setTemplateMenuAnchor] = useState<null | HTMLElement>(null);
  const [editingItem, setEditingItem] = useState<PrescriptionItem | null>(null);
  const [selectedTeeth, setSelectedTeeth] = useState<number[]>([]);
  const [injectionSites, setInjectionSites] = useState<any[]>([]);

  // New prescription item form
  const [drugSearch, setDrugSearch] = useState('');
  const [selectedDrug, setSelectedDrug] = useState<Drug | null>(null);
  const [itemForm, setItemForm] = useState({
    dosage: '',
    frequency: '',
    duration: '',
    quantity: 1,
    instructions: '',
    substitution_allowed: true,
  });

  useEffect(() => {
    if (patientId) {
      const patient = patients.find(p => p.id === patientId);
      if (patient) {
        setSelectedPatient({
          ...patient,
          age: patientAge || calculateAge(patient.date_of_birth),
          gender: patientGender || patient.gender,
        });
      }
    }
  }, [patientId, patients, patientAge, patientGender]);

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleDrugSearch = (value: string) => {
    setDrugSearch(value);
    if (value.length > 2) {
      dispatch(searchDrugsLocal(value));
    } else {
      dispatch(clearSearchResults());
    }
  };

  const handleDrugSelect = (drug: Drug | null) => {
    setSelectedDrug(drug);
    if (drug && drug.common_dosages.length > 0) {
      setItemForm({
        ...itemForm,
        dosage: drug.common_dosages[0],
      });
    }
  };

  const addPrescriptionItem = () => {
    if (selectedDrug && itemForm.dosage && itemForm.frequency && itemForm.duration) {
      const newItem: PrescriptionItem = {
        id: `item-${Date.now()}`,
        drug_id: selectedDrug.id,
        drug_name: selectedDrug.name,
        generic_name: selectedDrug.generic_name,
        form: selectedDrug.form,
        strength: selectedDrug.strength,
        dosage: itemForm.dosage,
        frequency: itemForm.frequency,
        duration: itemForm.duration,
        quantity: itemForm.quantity,
        instructions: itemForm.instructions,
        substitution_allowed: itemForm.substitution_allowed,
      };

      if (editingItem) {
        setPrescriptionItems(prescriptionItems.map(item => 
          item.id === editingItem.id ? newItem : item
        ));
        setEditingItem(null);
      } else {
        setPrescriptionItems([...prescriptionItems, newItem]);
      }

      // Reset form
      setDrugSearch('');
      setSelectedDrug(null);
      setItemForm({
        dosage: '',
        frequency: '',
        duration: '',
        quantity: 1,
        instructions: '',
        substitution_allowed: true,
      });
      dispatch(clearSearchResults());
    }
  };

  const editItem = (item: PrescriptionItem) => {
    const drug = drugs.find(d => d.id === item.drug_id);
    if (drug) {
      setSelectedDrug(drug);
      setDrugSearch(drug.name);
      setItemForm({
        dosage: item.dosage,
        frequency: item.frequency,
        duration: item.duration,
        quantity: item.quantity,
        instructions: item.instructions,
        substitution_allowed: item.substitution_allowed,
      });
      setEditingItem(item);
    }
  };

  const removeItem = (itemId: string) => {
    setPrescriptionItems(prescriptionItems.filter(item => item.id !== itemId));
  };

  const loadTemplate = (template: PrescriptionTemplate) => {
    setDiagnosis(template.diagnosis);
    setNotes(template.notes);
    
    const newItems = template.items.map(item => ({
      ...item,
      id: `item-${Date.now()}-${Math.random()}`,
    }));
    
    setPrescriptionItems([...prescriptionItems, ...newItems]);
    setTemplateMenuAnchor(null);
    
    dispatch(showNotification({
      message: `Template "${template.name}" loaded`,
      severity: 'success',
    }));
  };

  const saveAsTemplate = () => {
    const templateName = prompt('Enter template name:');
    if (templateName && prescriptionItems.length > 0) {
      const template: Partial<PrescriptionTemplate> = {
        name: templateName,
        doctor_id: user?.id || '',
        diagnosis,
        items: prescriptionItems.map(({ id, ...item }) => item),
        notes,
        is_favorite: false,
      };
      
      // In real app, this would save to backend
      dispatch(showNotification({
        message: 'Template saved successfully',
        severity: 'success',
      }));
    }
  };

  const handleSavePrescription = async () => {
    if (!selectedPatient || !diagnosis || prescriptionItems.length === 0) {
      dispatch(showNotification({
        message: 'Please fill all required fields',
        severity: 'error',
      }));
      return;
    }

    const currentDoctor = doctors.find(d => d.email === user?.email);
    if (!currentDoctor) {
      dispatch(showNotification({
        message: 'Doctor information not found',
        severity: 'error',
      }));
      return;
    }

    const prescriptionData: Partial<Prescription> = {
      prescription_number: `RX${Date.now()}`,
      patient_id: selectedPatient.id,
      patient_name: selectedPatient.name,
      patient_age: selectedPatient.age,
      patient_gender: selectedPatient.gender,
      doctor_id: currentDoctor.id,
      doctor_name: `${currentDoctor.title} ${currentDoctor.first_name} ${currentDoctor.last_name}`,
      doctor_license: currentDoctor.license_number,
      appointment_id: appointmentId,
      date_prescribed: format(new Date(), 'yyyy-MM-dd'),
      valid_until: format(addDays(new Date(), validityDays), 'yyyy-MM-dd'),
      diagnosis,
      chief_complaint: chiefComplaint,
      items: prescriptionItems,
      notes,
      follow_up_date: followUpDate ? format(followUpDate, 'yyyy-MM-dd') : undefined,
      status: 'active',
      // Add specialized data based on department
      ...(isDentistry && selectedTeeth.length > 0 && {
        dental_data: {
          selected_teeth: selectedTeeth,
          teeth_names: selectedTeeth.map(tooth => `#${tooth}`).join(', ')
        }
      }),
      ...(isDermatology && injectionSites.length > 0 && {
        dermatology_data: {
          injection_sites: injectionSites,
          total_units: injectionSites.reduce((sum, site) => sum + (site.units || 0), 0)
        }
      }),
    };

    try {
      const result = await dispatch(createPrescription(prescriptionData)).unwrap();
      dispatch(showNotification({
        message: 'Prescription created successfully',
        severity: 'success',
      }));
      
      if (onSave) {
        onSave(result);
      }
    } catch (error) {
      dispatch(showNotification({
        message: 'Failed to create prescription',
        severity: 'error',
      }));
    }
  };

  const frequencyOptions = [
    'Once daily',
    'Twice daily',
    'Three times daily',
    'Four times daily',
    'Every 4 hours',
    'Every 6 hours',
    'Every 8 hours',
    'Every 12 hours',
    'As needed',
    'Before meals',
    'After meals',
    'At bedtime',
  ];

  const durationOptions = [
    '3 days',
    '5 days',
    '7 days',
    '10 days',
    '14 days',
    '21 days',
    '30 days',
    '2 months',
    '3 months',
    'As directed',
  ];

  const favoriteTemplates = templates.filter(t => t.is_favorite && t.doctor_id === user?.id);
  
  // Get current doctor's department
  const currentDoctor = doctors.find(d => d.email === user?.email);
  // For demo purposes, let's show both visualizations
  const isDentistry = true; // currentDoctor?.department === 'Dentistry';
  const isDermatology = true; // currentDoctor?.department === 'Dermatology';

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        {/* Patient Information */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Patient Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Autocomplete
                value={selectedPatient}
                onChange={(_, newValue) => setSelectedPatient(newValue)}
                options={patients}
                getOptionLabel={(option) => option.name || ''}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Patient"
                    required
                    disabled={!!patientId}
                  />
                )}
                renderOption={(props, option) => (
                  <Box component="li" {...props}>
                    <Box>
                      <Typography variant="body1">{option.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {option.phone} • Age: {calculateAge(option.date_of_birth)} • {option.gender}
                      </Typography>
                    </Box>
                  </Box>
                )}
              />
            </Grid>
            
            {selectedPatient && (
              <>
                <Grid item xs={12} md={2}>
                  <TextField
                    fullWidth
                    label="Age"
                    value={selectedPatient.age}
                    disabled
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <TextField
                    fullWidth
                    label="Gender"
                    value={selectedPatient.gender}
                    disabled
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Phone"
                    value={selectedPatient.phone}
                    disabled
                  />
                </Grid>
              </>
            )}
          </Grid>
        </Paper>

        {/* Diagnosis and Complaint */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Diagnosis
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Chief Complaint"
                value={chiefComplaint}
                onChange={(e) => setChiefComplaint(e.target.value)}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Diagnosis"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                required
                multiline
                rows={2}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Dental Chart - Show only for Dentistry department */}
        {isDentistry && (
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Dental Chart
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Select teeth for treatment or documentation
            </Typography>
            <DentalChart
              mode="select"
              selectedTeeth={selectedTeeth}
              onToothSelect={setSelectedTeeth}
            />
          </Paper>
        )}

        {/* Dermatology Body Map - Show only for Dermatology department */}
        {isDermatology && (
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Treatment Sites
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Mark injection sites or treatment areas
            </Typography>
            <DermatologyBodyMap
              onSiteSelect={setInjectionSites}
              initialSites={injectionSites}
            />
          </Paper>
        )}

        {/* Prescription Items */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Medications
            </Typography>
            <Box>
              <Button
                size="small"
                startIcon={<History />}
                onClick={(e) => setTemplateMenuAnchor(e.currentTarget)}
                sx={{ mr: 1 }}
              >
                Templates
              </Button>
              {prescriptionItems.length > 0 && (
                <Button
                  size="small"
                  startIcon={<Save />}
                  onClick={saveAsTemplate}
                >
                  Save as Template
                </Button>
              )}
            </Box>
          </Box>

          {/* Quick Template Access */}
          {favoriteTemplates.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Quick Templates
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {favoriteTemplates.map(template => (
                  <Chip
                    key={template.id}
                    label={template.name}
                    onClick={() => loadTemplate(template)}
                    icon={<Favorite />}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* Add Medication Form */}
          <Card variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Autocomplete
                    value={selectedDrug}
                    onChange={(_, newValue) => handleDrugSelect(newValue)}
                    options={searchResults.length > 0 ? searchResults : drugs}
                    getOptionLabel={(option) => option.name}
                    inputValue={drugSearch}
                    onInputChange={(_, newValue) => handleDrugSearch(newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Search Medication"
                        placeholder="Type to search..."
                        InputProps={{
                          ...params.InputProps,
                          startAdornment: <LocalPharmacy sx={{ mr: 1, color: 'text.secondary' }} />,
                        }}
                      />
                    )}
                    renderOption={(props, option) => (
                      <Box component="li" {...props}>
                        <Box>
                          <Typography variant="body1">
                            {option.name} ({option.strength})
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {option.generic_name} • {option.form} • {option.category}
                          </Typography>
                        </Box>
                      </Box>
                    )}
                  />
                </Grid>
                
                {selectedDrug && (
                  <>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Dosage"
                        value={itemForm.dosage}
                        onChange={(e) => setItemForm({ ...itemForm, dosage: e.target.value })}
                        placeholder="e.g., 500mg"
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                      <Autocomplete
                        value={itemForm.frequency}
                        onChange={(_, newValue) => setItemForm({ ...itemForm, frequency: newValue || '' })}
                        options={frequencyOptions}
                        freeSolo
                        renderInput={(params) => (
                          <TextField {...params} label="Frequency" />
                        )}
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={3}>
                      <Autocomplete
                        value={itemForm.duration}
                        onChange={(_, newValue) => setItemForm({ ...itemForm, duration: newValue || '' })}
                        options={durationOptions}
                        freeSolo
                        renderInput={(params) => (
                          <TextField {...params} label="Duration" />
                        )}
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={2}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Quantity"
                        value={itemForm.quantity}
                        onChange={(e) => setItemForm({ ...itemForm, quantity: parseInt(e.target.value) || 1 })}
                        inputProps={{ min: 1 }}
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={5}>
                      <TextField
                        fullWidth
                        label="Instructions"
                        value={itemForm.instructions}
                        onChange={(e) => setItemForm({ ...itemForm, instructions: e.target.value })}
                        placeholder="e.g., Take with food"
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={2} sx={{ display: 'flex', alignItems: 'center' }}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={itemForm.substitution_allowed}
                            onChange={(e) => setItemForm({ ...itemForm, substitution_allowed: e.target.checked })}
                          />
                        }
                        label="Allow Substitution"
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          variant="contained"
                          startIcon={editingItem ? <Edit /> : <Add />}
                          onClick={addPrescriptionItem}
                          disabled={!itemForm.dosage || !itemForm.frequency || !itemForm.duration}
                        >
                          {editingItem ? 'Update' : 'Add'} Medication
                        </Button>
                        {editingItem && (
                          <Button
                            variant="outlined"
                            onClick={() => {
                              setEditingItem(null);
                              setDrugSearch('');
                              setSelectedDrug(null);
                              setItemForm({
                                dosage: '',
                                frequency: '',
                                duration: '',
                                quantity: 1,
                                instructions: '',
                                substitution_allowed: true,
                              });
                            }}
                          >
                            Cancel
                          </Button>
                        )}
                      </Box>
                    </Grid>
                    
                    {/* Drug Information */}
                    {selectedDrug.controlled_substance && (
                      <Grid item xs={12}>
                        <Alert severity="warning" icon={<Warning />}>
                          This is a controlled substance. Special prescription requirements may apply.
                        </Alert>
                      </Grid>
                    )}
                    
                    {selectedDrug.interactions.length > 0 && (
                      <Grid item xs={12}>
                        <Alert severity="info" icon={<Info />}>
                          <Typography variant="body2" gutterBottom>
                            <strong>Drug Interactions:</strong>
                          </Typography>
                          <Typography variant="body2">
                            {selectedDrug.interactions.join(', ')}
                          </Typography>
                        </Alert>
                      </Grid>
                    )}
                  </>
                )}
              </Grid>
            </CardContent>
          </Card>

          {/* Prescription Items List */}
          {prescriptionItems.length > 0 ? (
            <List>
              {prescriptionItems.map((item, index) => (
                <React.Fragment key={item.id}>
                  {index > 0 && <Divider />}
                  <ListItem>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle1">
                            {index + 1}. {item.drug_name} ({item.strength})
                          </Typography>
                          {!item.substitution_allowed && (
                            <Chip label="No Substitution" size="small" color="warning" />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2">
                            {item.dosage} • {item.frequency} • {item.duration} • Qty: {item.quantity}
                          </Typography>
                          {item.instructions && (
                            <Typography variant="body2" color="text.secondary">
                              Instructions: {item.instructions}
                            </Typography>
                          )}
                          <Typography variant="caption" color="text.secondary">
                            Generic: {item.generic_name} • Form: {item.form}
                          </Typography>
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Tooltip title="Edit">
                        <IconButton edge="end" onClick={() => editItem(item)} sx={{ mr: 1 }}>
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton edge="end" onClick={() => removeItem(item.id)}>
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </ListItemSecondaryAction>
                  </ListItem>
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Alert severity="info">
              No medications added yet. Search and add medications above.
            </Alert>
          )}
        </Paper>

        {/* Additional Information */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Additional Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Notes/Instructions"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Additional instructions or notes..."
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <DatePicker
                label="Follow-up Date"
                value={followUpDate}
                onChange={(newValue) => setFollowUpDate(newValue)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                type="number"
                label="Valid for (days)"
                value={validityDays}
                onChange={(e) => setValidityDays(parseInt(e.target.value) || 30)}
                inputProps={{ min: 1, max: 365 }}
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
              handleSavePrescription();
              // Print functionality would go here
            }}
          >
            Save & Print
          </Button>
          <Button
            variant="outlined"
            startIcon={<Email />}
            onClick={() => {
              handleSavePrescription();
              // Email functionality would go here
            }}
          >
            Save & Email
          </Button>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={handleSavePrescription}
            disabled={!selectedPatient || !diagnosis || prescriptionItems.length === 0}
          >
            Save Prescription
          </Button>
        </Box>

        {/* Template Menu */}
        <Menu
          anchorEl={templateMenuAnchor}
          open={Boolean(templateMenuAnchor)}
          onClose={() => setTemplateMenuAnchor(null)}
        >
          {templates.filter(t => t.doctor_id === user?.id).map(template => (
            <MenuItem key={template.id} onClick={() => loadTemplate(template)}>
              <ListItemText
                primary={template.name}
                secondary={`${template.items.length} items`}
              />
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(toggleTemplateFavorite(template.id));
                }}
              >
                {template.is_favorite ? <Favorite color="primary" /> : <FavoriteBorder />}
              </IconButton>
            </MenuItem>
          ))}
          {templates.filter(t => t.doctor_id === user?.id).length === 0 && (
            <MenuItem disabled>
              <Typography variant="body2" color="text.secondary">
                No templates saved
              </Typography>
            </MenuItem>
          )}
        </Menu>
      </Box>
    </LocalizationProvider>
  );
};

export default PrescriptionWriter;