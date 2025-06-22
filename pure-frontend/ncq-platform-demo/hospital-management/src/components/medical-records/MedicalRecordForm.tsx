import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  IconButton,
  Alert,
  Autocomplete,
  FormControlLabel,
  Switch,
  Divider,
} from '@mui/material';
import {
  ExpandMore,
  Save,
  Cancel,
  Add,
  Delete,
  AttachFile,
  Description as Template,
  Lock,
  LockOpen,
} from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import {
  MedicalRecord,
  VitalSigns,
  Diagnosis,
  createMedicalRecord,
  MedicalRecordTemplate,
} from '../../store/slices/medicalRecordSlice';
import { showNotification } from '../../store/slices/notificationSlice';

interface MedicalRecordFormProps {
  patientId: string;
  patientName: string;
  recordToEdit?: MedicalRecord;
  onSuccess?: (record: MedicalRecord) => void;
  onCancel?: () => void;
}

const MedicalRecordForm: React.FC<MedicalRecordFormProps> = ({
  patientId,
  patientName,
  recordToEdit,
  onSuccess,
  onCancel,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { templates } = useSelector((state: RootState) => state.medicalRecords);
  const { doctors } = useSelector((state: RootState) => state.doctors);
  const { user } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState<Partial<MedicalRecord>>({
    patient_id: patientId,
    patient_name: patientName,
    type: 'consultation',
    date: new Date().toISOString(),
    department: '',
    chief_complaint: '',
    history_of_present_illness: '',
    past_medical_history: '',
    family_history: '',
    social_history: '',
    review_of_systems: {},
    physical_examination: {},
    vital_signs: {},
    diagnosis: [],
    treatment_plan: '',
    medications_prescribed: [],
    clinical_notes: '',
    follow_up_instructions: '',
    is_confidential: false,
  });

  const [vitalSigns, setVitalSigns] = useState<VitalSigns>({
    temperature: undefined,
    temperature_unit: 'F',
    blood_pressure_systolic: undefined,
    blood_pressure_diastolic: undefined,
    heart_rate: undefined,
    respiratory_rate: undefined,
    oxygen_saturation: undefined,
    weight: undefined,
    weight_unit: 'kg',
    height: undefined,
    height_unit: 'cm',
    pain_scale: undefined,
  });

  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [newDiagnosis, setNewDiagnosis] = useState<Diagnosis>({
    code: '',
    description: '',
    type: 'primary',
  });

  const [selectedTemplate, setSelectedTemplate] = useState<MedicalRecordTemplate | null>(null);
  const [expandedSections, setExpandedSections] = useState<string[]>(['basic', 'vitals']);

  useEffect(() => {
    if (recordToEdit) {
      setFormData(recordToEdit);
      setVitalSigns(recordToEdit.vital_signs || {});
      setDiagnoses(recordToEdit.diagnosis || []);
    }
  }, [recordToEdit]);

  const recordTypes = [
    { value: 'consultation', label: 'Consultation' },
    { value: 'admission', label: 'Admission' },
    { value: 'procedure', label: 'Procedure' },
    { value: 'surgery', label: 'Surgery' },
    { value: 'emergency', label: 'Emergency' },
    { value: 'followup', label: 'Follow-up' },
    { value: 'diagnostic', label: 'Diagnostic' },
  ];

  const departments = [
    'General Medicine',
    'Cardiology',
    'Neurology',
    'Orthopedics',
    'Pediatrics',
    'Gynecology',
    'Surgery',
    'Emergency',
    'Psychiatry',
    'Dermatology',
    'Ophthalmology',
    'ENT',
  ];

  const handleTemplateSelect = (template: MedicalRecordTemplate) => {
    setSelectedTemplate(template);
    setFormData({
      ...formData,
      ...template.content,
      patient_id: patientId,
      patient_name: patientName,
    });
    
    if (template.content.vital_signs) {
      setVitalSigns(template.content.vital_signs);
    }
    
    dispatch(showNotification({
      message: `Template "${template.name}" loaded`,
      severity: 'success',
    }));
  };

  const handleAddDiagnosis = () => {
    if (newDiagnosis.code && newDiagnosis.description) {
      setDiagnoses([...diagnoses, newDiagnosis]);
      setNewDiagnosis({ code: '', description: '', type: 'primary' });
    }
  };

  const handleRemoveDiagnosis = (index: number) => {
    setDiagnoses(diagnoses.filter((_, i) => i !== index));
  };

  const handleSectionToggle = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const calculateBMI = () => {
    if (vitalSigns.weight && vitalSigns.height) {
      let weightInKg = vitalSigns.weight;
      let heightInM = vitalSigns.height;
      
      // Convert to metric if needed
      if (vitalSigns.weight_unit === 'lbs') {
        weightInKg = vitalSigns.weight * 0.453592;
      }
      if (vitalSigns.height_unit === 'ft') {
        heightInM = vitalSigns.height * 30.48;
      }
      
      // Convert cm to meters
      heightInM = heightInM / 100;
      
      const bmi = weightInKg / (heightInM * heightInM);
      setVitalSigns({ ...vitalSigns, bmi: Math.round(bmi * 10) / 10 });
    }
  };

  const handleSubmit = async () => {
    const currentDoctor = doctors.find(d => d.email === user?.email);
    
    const recordData: Partial<MedicalRecord> = {
      ...formData,
      doctor_id: currentDoctor?.id || user?.id || '',
      doctor_name: currentDoctor ? `${currentDoctor.title} ${currentDoctor.first_name} ${currentDoctor.last_name}` : user?.full_name || '',
      vital_signs: vitalSigns,
      diagnosis: diagnoses,
      record_id: recordToEdit?.record_id || `MR${Date.now()}`,
    };

    try {
      const result = await dispatch(createMedicalRecord(recordData)).unwrap();
      dispatch(showNotification({
        message: 'Medical record saved successfully',
        severity: 'success',
      }));
      
      if (onSuccess) {
        onSuccess(result);
      }
    } catch (error) {
      dispatch(showNotification({
        message: 'Failed to save medical record',
        severity: 'error',
      }));
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        {/* Template Selection */}
        {templates.length > 0 && !recordToEdit && (
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Quick Templates
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {templates.map(template => (
                <Chip
                  key={template.id}
                  label={template.name}
                  icon={<Template />}
                  onClick={() => handleTemplateSelect(template)}
                  color={selectedTemplate?.id === template.id ? 'primary' : 'default'}
                  variant={selectedTemplate?.id === template.id ? 'filled' : 'outlined'}
                />
              ))}
            </Box>
          </Paper>
        )}

        {/* Basic Information */}
        <Accordion 
          expanded={expandedSections.includes('basic')}
          onChange={() => handleSectionToggle('basic')}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="h6">Basic Information</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Record Type</InputLabel>
                  <Select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    label="Record Type"
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
                <DateTimePicker
                  label="Date & Time"
                  value={new Date(formData.date || '')}
                  onChange={(newValue) => setFormData({ ...formData, date: newValue?.toISOString() || '' })}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Department</InputLabel>
                  <Select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    label="Department"
                  >
                    {departments.map(dept => (
                      <MenuItem key={dept} value={dept}>
                        {dept}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Chief Complaint"
                  value={formData.chief_complaint}
                  onChange={(e) => setFormData({ ...formData, chief_complaint: e.target.value })}
                  multiline
                  rows={2}
                  required
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Vital Signs */}
        <Accordion 
          expanded={expandedSections.includes('vitals')}
          onChange={() => handleSectionToggle('vitals')}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="h6">Vital Signs</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Temperature"
                  type="number"
                  value={vitalSigns.temperature || ''}
                  onChange={(e) => setVitalSigns({ ...vitalSigns, temperature: parseFloat(e.target.value) })}
                  InputProps={{
                    endAdornment: (
                      <Select
                        value={vitalSigns.temperature_unit}
                        onChange={(e) => setVitalSigns({ ...vitalSigns, temperature_unit: e.target.value as 'C' | 'F' })}
                        variant="standard"
                      >
                        <MenuItem value="F">°F</MenuItem>
                        <MenuItem value="C">°C</MenuItem>
                      </Select>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Blood Pressure"
                  placeholder="120/80"
                  value={vitalSigns.blood_pressure_systolic && vitalSigns.blood_pressure_diastolic 
                    ? `${vitalSigns.blood_pressure_systolic}/${vitalSigns.blood_pressure_diastolic}`
                    : ''}
                  onChange={(e) => {
                    const [sys, dia] = e.target.value.split('/');
                    setVitalSigns({
                      ...vitalSigns,
                      blood_pressure_systolic: parseInt(sys) || undefined,
                      blood_pressure_diastolic: parseInt(dia) || undefined,
                    });
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Heart Rate"
                  type="number"
                  value={vitalSigns.heart_rate || ''}
                  onChange={(e) => setVitalSigns({ ...vitalSigns, heart_rate: parseInt(e.target.value) })}
                  InputProps={{ endAdornment: 'bpm' }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Respiratory Rate"
                  type="number"
                  value={vitalSigns.respiratory_rate || ''}
                  onChange={(e) => setVitalSigns({ ...vitalSigns, respiratory_rate: parseInt(e.target.value) })}
                  InputProps={{ endAdornment: '/min' }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="O2 Saturation"
                  type="number"
                  value={vitalSigns.oxygen_saturation || ''}
                  onChange={(e) => setVitalSigns({ ...vitalSigns, oxygen_saturation: parseInt(e.target.value) })}
                  InputProps={{ endAdornment: '%' }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Weight"
                  type="number"
                  value={vitalSigns.weight || ''}
                  onChange={(e) => setVitalSigns({ ...vitalSigns, weight: parseFloat(e.target.value) })}
                  onBlur={calculateBMI}
                  InputProps={{
                    endAdornment: (
                      <Select
                        value={vitalSigns.weight_unit}
                        onChange={(e) => setVitalSigns({ ...vitalSigns, weight_unit: e.target.value as 'kg' | 'lbs' })}
                        variant="standard"
                      >
                        <MenuItem value="kg">kg</MenuItem>
                        <MenuItem value="lbs">lbs</MenuItem>
                      </Select>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Height"
                  type="number"
                  value={vitalSigns.height || ''}
                  onChange={(e) => setVitalSigns({ ...vitalSigns, height: parseFloat(e.target.value) })}
                  onBlur={calculateBMI}
                  InputProps={{
                    endAdornment: (
                      <Select
                        value={vitalSigns.height_unit}
                        onChange={(e) => setVitalSigns({ ...vitalSigns, height_unit: e.target.value as 'cm' | 'ft' })}
                        variant="standard"
                      >
                        <MenuItem value="cm">cm</MenuItem>
                        <MenuItem value="ft">ft</MenuItem>
                      </Select>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="BMI"
                  value={vitalSigns.bmi || ''}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Pain Scale (0-10)"
                  type="number"
                  value={vitalSigns.pain_scale || ''}
                  onChange={(e) => setVitalSigns({ ...vitalSigns, pain_scale: parseInt(e.target.value) })}
                  inputProps={{ min: 0, max: 10 }}
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Clinical History */}
        <Accordion 
          expanded={expandedSections.includes('history')}
          onChange={() => handleSectionToggle('history')}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="h6">Clinical History</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="History of Present Illness"
                  value={formData.history_of_present_illness}
                  onChange={(e) => setFormData({ ...formData, history_of_present_illness: e.target.value })}
                  multiline
                  rows={4}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Past Medical History"
                  value={formData.past_medical_history}
                  onChange={(e) => setFormData({ ...formData, past_medical_history: e.target.value })}
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Family History"
                  value={formData.family_history}
                  onChange={(e) => setFormData({ ...formData, family_history: e.target.value })}
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Social History"
                  value={formData.social_history}
                  onChange={(e) => setFormData({ ...formData, social_history: e.target.value })}
                  multiline
                  rows={2}
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Review of Systems */}
        <Accordion 
          expanded={expandedSections.includes('ros')}
          onChange={() => handleSectionToggle('ros')}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="h6">Review of Systems</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              {[
                'constitutional',
                'cardiovascular',
                'respiratory',
                'gastrointestinal',
                'genitourinary',
                'musculoskeletal',
                'neurological',
                'psychiatric',
              ].map((system) => (
                <Grid item xs={12} md={6} key={system}>
                  <TextField
                    fullWidth
                    label={system.charAt(0).toUpperCase() + system.slice(1)}
                    value={formData.review_of_systems?.[system as keyof typeof formData.review_of_systems] || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      review_of_systems: {
                        ...formData.review_of_systems,
                        [system]: e.target.value,
                      },
                    })}
                    multiline
                    rows={2}
                  />
                </Grid>
              ))}
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Physical Examination */}
        <Accordion 
          expanded={expandedSections.includes('exam')}
          onChange={() => handleSectionToggle('exam')}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="h6">Physical Examination</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              {[
                { key: 'general_appearance', label: 'General Appearance' },
                { key: 'head_eyes_ears_nose_throat', label: 'HEENT' },
                { key: 'cardiovascular', label: 'Cardiovascular' },
                { key: 'respiratory', label: 'Respiratory' },
                { key: 'abdomen', label: 'Abdomen' },
                { key: 'extremities', label: 'Extremities' },
                { key: 'neurological', label: 'Neurological' },
                { key: 'skin', label: 'Skin' },
              ].map((exam) => (
                <Grid item xs={12} md={6} key={exam.key}>
                  <TextField
                    fullWidth
                    label={exam.label}
                    value={formData.physical_examination?.[exam.key as keyof typeof formData.physical_examination] || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      physical_examination: {
                        ...formData.physical_examination,
                        [exam.key]: e.target.value,
                      },
                    })}
                    multiline
                    rows={2}
                  />
                </Grid>
              ))}
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Diagnosis */}
        <Accordion 
          expanded={expandedSections.includes('diagnosis')}
          onChange={() => handleSectionToggle('diagnosis')}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="h6">Diagnosis</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                {diagnoses.map((diag, index) => (
                  <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                    <Chip
                      label={`${diag.code} - ${diag.description}`}
                      color={diag.type === 'primary' ? 'primary' : 'default'}
                      onDelete={() => handleRemoveDiagnosis(index)}
                    />
                    <Typography variant="caption" sx={{ alignSelf: 'center' }}>
                      ({diag.type})
                    </Typography>
                  </Box>
                ))}
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="ICD Code"
                  value={newDiagnosis.code}
                  onChange={(e) => setNewDiagnosis({ ...newDiagnosis, code: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Description"
                  value={newDiagnosis.description}
                  onChange={(e) => setNewDiagnosis({ ...newDiagnosis, description: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={newDiagnosis.type}
                    onChange={(e) => setNewDiagnosis({ ...newDiagnosis, type: e.target.value as any })}
                    label="Type"
                  >
                    <MenuItem value="primary">Primary</MenuItem>
                    <MenuItem value="secondary">Secondary</MenuItem>
                    <MenuItem value="differential">Differential</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={1}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleAddDiagnosis}
                  startIcon={<Add />}
                  sx={{ height: '56px' }}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Treatment Plan */}
        <Accordion 
          expanded={expandedSections.includes('treatment')}
          onChange={() => handleSectionToggle('treatment')}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="h6">Treatment Plan</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Treatment Plan"
                  value={formData.treatment_plan}
                  onChange={(e) => setFormData({ ...formData, treatment_plan: e.target.value })}
                  multiline
                  rows={4}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Clinical Notes"
                  value={formData.clinical_notes}
                  onChange={(e) => setFormData({ ...formData, clinical_notes: e.target.value })}
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Follow-up Instructions"
                  value={formData.follow_up_instructions}
                  onChange={(e) => setFormData({ ...formData, follow_up_instructions: e.target.value })}
                  multiline
                  rows={2}
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Privacy Settings */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <FormControlLabel
            control={
              <Switch
                checked={formData.is_confidential}
                onChange={(e) => setFormData({ ...formData, is_confidential: e.target.checked })}
              />
            }
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {formData.is_confidential ? <Lock /> : <LockOpen />}
                <Typography>
                  {formData.is_confidential ? 'Confidential Record' : 'Standard Record'}
                </Typography>
              </Box>
            }
          />
          {formData.is_confidential && (
            <Alert severity="warning" sx={{ mt: 1 }}>
              This record will be marked as confidential and will have restricted access.
            </Alert>
          )}
        </Paper>

        {/* Actions */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          {onCancel && (
            <Button variant="outlined" onClick={onCancel} startIcon={<Cancel />}>
              Cancel
            </Button>
          )}
          <Button
            variant="contained"
            onClick={handleSubmit}
            startIcon={<Save />}
            disabled={!formData.chief_complaint || !formData.history_of_present_illness || diagnoses.length === 0}
          >
            Save Medical Record
          </Button>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default MedicalRecordForm;