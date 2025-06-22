import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Divider,
  InputAdornment,
} from '@mui/material';
import {
  Save,
  Print,
  Upload,
  CheckCircle,
  Warning,
  ArrowUpward,
  ArrowDownward,
  Flag,
  Edit,
  CloudUpload,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { 
  LabTest, 
  LabTestResult, 
  uploadLabResults,
  updateLabTestStatus,
} from '../../store/slices/labTestSlice';
import { showNotification } from '../../store/slices/notificationSlice';
import { format } from 'date-fns';

interface LabTestResultsEntryProps {
  labTest: LabTest;
  onComplete?: () => void;
  onCancel?: () => void;
}

const LabTestResultsEntry: React.FC<LabTestResultsEntryProps> = ({
  labTest,
  onComplete,
  onCancel,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { templates } = useSelector((state: RootState) => state.labTests);
  
  const [results, setResults] = useState<LabTestResult[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [reportFile, setReportFile] = useState<File | null>(null);
  const [verifiedBy, setVerifiedBy] = useState('');
  const [comments, setComments] = useState('');

  // Find the template for this test to get parameters
  const template = templates.find(t => t.name === labTest.test_name);

  useEffect(() => {
    if (labTest.results) {
      setResults(labTest.results);
    } else if (template) {
      // Initialize results based on template parameters
      const initialResults: LabTestResult[] = [];
      template.tests.forEach(test => {
        test.parameters.forEach(param => {
          initialResults.push({
            id: `${test.code}-${param.name}-${Date.now()}`,
            parameter: param.name,
            value: '',
            unit: param.unit,
            normal_range: param.normal_range,
            flag: undefined,
            notes: '',
          });
        });
      });
      setResults(initialResults);
    }
  }, [labTest, template]);

  const handleResultChange = (index: number, field: keyof LabTestResult, value: any) => {
    const newResults = [...results];
    newResults[index] = { ...newResults[index], [field]: value };
    
    // Auto-calculate flag based on value and normal range
    if (field === 'value' && value) {
      const result = newResults[index];
      const numValue = parseFloat(value);
      
      if (!isNaN(numValue) && result.normal_range) {
        // Parse normal range (e.g., "4.5-11" or "<200" or ">40")
        const rangeMatch = result.normal_range.match(/^(\d*\.?\d*)-(\d*\.?\d*)$/);
        const lessMatch = result.normal_range.match(/^<(\d*\.?\d*)$/);
        const greaterMatch = result.normal_range.match(/^>(\d*\.?\d*)$/);
        
        if (rangeMatch) {
          const [, min, max] = rangeMatch;
          if (numValue < parseFloat(min)) {
            newResults[index].flag = 'low';
          } else if (numValue > parseFloat(max)) {
            newResults[index].flag = 'high';
          } else {
            newResults[index].flag = undefined;
          }
        } else if (lessMatch) {
          const [, max] = lessMatch;
          newResults[index].flag = numValue >= parseFloat(max) ? 'high' : undefined;
        } else if (greaterMatch) {
          const [, min] = greaterMatch;
          newResults[index].flag = numValue <= parseFloat(min) ? 'low' : undefined;
        }
      }
    }
    
    setResults(newResults);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setReportFile(file);
    }
  };

  const handleSaveResults = async () => {
    // Validate all results have values
    const hasEmptyValues = results.some(r => !r.value);
    if (hasEmptyValues) {
      dispatch(showNotification({
        message: 'Please enter values for all parameters',
        severity: 'error',
      }));
      return;
    }

    if (!verifiedBy) {
      dispatch(showNotification({
        message: 'Please enter verified by name',
        severity: 'error',
      }));
      return;
    }

    try {
      // Upload results
      await dispatch(uploadLabResults({
        id: labTest.id,
        results,
      })).unwrap();

      // Update status to completed
      dispatch(updateLabTestStatus({
        id: labTest.id,
        status: 'completed',
      }));

      // If there's a report file, upload it (in real app)
      if (reportFile) {
        // TODO: Implement file upload
        console.log('Uploading report file:', reportFile.name);
      }

      dispatch(showNotification({
        message: 'Lab results saved successfully',
        severity: 'success',
      }));

      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      dispatch(showNotification({
        message: 'Failed to save lab results',
        severity: 'error',
      }));
    }
  };

  const getResultFlag = (flag?: 'high' | 'low' | 'critical') => {
    if (!flag) return null;
    
    switch (flag) {
      case 'high':
        return (
          <Chip
            icon={<ArrowUpward />}
            label="High"
            color="warning"
            size="small"
          />
        );
      case 'low':
        return (
          <Chip
            icon={<ArrowDownward />}
            label="Low"
            color="info"
            size="small"
          />
        );
      case 'critical':
        return (
          <Chip
            icon={<Flag />}
            label="Critical"
            color="error"
            size="small"
          />
        );
    }
  };

  const hasAbnormalResults = results.some(r => r.flag);

  return (
    <Box>
      {/* Test Information */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Test Information
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary">Test Name</Typography>
            <Typography variant="body1" fontWeight="medium">{labTest.test_name}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary">Patient</Typography>
            <Typography variant="body1" fontWeight="medium">{labTest.patient_name}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary">Ordered By</Typography>
            <Typography variant="body1">{labTest.doctor_name}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary">Order Date</Typography>
            <Typography variant="body1">
              {format(new Date(labTest.ordered_date), 'dd MMM yyyy HH:mm')}
            </Typography>
          </Grid>
          {labTest.sample_collected_at && (
            <>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary">Sample Collected</Typography>
                <Typography variant="body1">
                  {format(new Date(labTest.sample_collected_at), 'dd MMM yyyy HH:mm')}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary">Collected By</Typography>
                <Typography variant="body1">{labTest.sample_collected_by}</Typography>
              </Grid>
            </>
          )}
        </Grid>
      </Paper>

      {/* Results Entry */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Test Results
        </Typography>
        
        {hasAbnormalResults && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            <Typography variant="body2">
              Abnormal results detected. Please review carefully.
            </Typography>
          </Alert>
        )}

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Parameter</TableCell>
                <TableCell>Value</TableCell>
                <TableCell>Unit</TableCell>
                <TableCell>Normal Range</TableCell>
                <TableCell>Flag</TableCell>
                <TableCell>Notes</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {results.map((result, index) => (
                <TableRow 
                  key={result.id}
                  sx={{ 
                    bgcolor: result.flag === 'critical' ? 'error.light' : 
                             result.flag ? 'warning.light' : 'inherit' 
                  }}
                >
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {result.parameter}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      value={result.value}
                      onChange={(e) => handleResultChange(index, 'value', e.target.value)}
                      fullWidth
                      error={!result.value}
                      InputProps={{
                        endAdornment: result.flag && (
                          <InputAdornment position="end">
                            {result.flag === 'high' && <ArrowUpward color="warning" fontSize="small" />}
                            {result.flag === 'low' && <ArrowDownward color="info" fontSize="small" />}
                          </InputAdornment>
                        ),
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{result.unit}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{result.normal_range}</Typography>
                  </TableCell>
                  <TableCell>
                    <Select
                      size="small"
                      value={result.flag || ''}
                      onChange={(e) => handleResultChange(index, 'flag', e.target.value || undefined)}
                      displayEmpty
                      fullWidth
                    >
                      <MenuItem value="">Normal</MenuItem>
                      <MenuItem value="high">High</MenuItem>
                      <MenuItem value="low">Low</MenuItem>
                      <MenuItem value="critical">Critical</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      value={result.notes || ''}
                      onChange={(e) => handleResultChange(index, 'notes', e.target.value)}
                      placeholder="Notes..."
                      fullWidth
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Verification and Report */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Verification & Report
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Verified By"
              value={verifiedBy}
              onChange={(e) => setVerifiedBy(e.target.value)}
              placeholder="Lab technician name"
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUpload />}
              fullWidth
              sx={{ height: '56px' }}
            >
              Upload Report PDF
              <input
                type="file"
                hidden
                accept=".pdf"
                onChange={handleFileUpload}
              />
            </Button>
            {reportFile && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Selected: {reportFile.name}
              </Typography>
            )}
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Additional Comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Any additional comments or observations..."
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
            handleSaveResults();
            // Print functionality would go here
          }}
        >
          Save & Print
        </Button>
        <Button
          variant="contained"
          startIcon={<CheckCircle />}
          onClick={handleSaveResults}
          disabled={results.some(r => !r.value) || !verifiedBy}
        >
          Complete Test
        </Button>
      </Box>
    </Box>
  );
};

export default LabTestResultsEntry;