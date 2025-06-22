import React, { useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Divider,
  Alert,
} from '@mui/material';
import {
  Print,
  Download,
  Email,
  Share,
  CheckCircle,
  Warning,
  ArrowUpward,
  ArrowDownward,
  Flag,
  LocalHospital,
  Phone,
  LocationOn,
} from '@mui/icons-material';
import { LabTest } from '../../store/slices/labTestSlice';
import { format } from 'date-fns';
import { useReactToPrint } from 'react-to-print';

interface LabTestResultViewProps {
  labTest: LabTest;
  onClose?: () => void;
  showActions?: boolean;
}

const LabTestResultView: React.FC<LabTestResultViewProps> = ({
  labTest,
  onClose,
  showActions = true,
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
  });

  const handleEmail = () => {
    console.log('Email lab results');
  };

  const handleDownload = () => {
    console.log('Download lab results');
  };

  const handleShare = () => {
    console.log('Share lab results');
  };

  const getStatusColor = (status: LabTest['status']) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in_progress': return 'warning';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getResultFlag = (flag?: 'high' | 'low' | 'critical') => {
    if (!flag) return null;
    
    switch (flag) {
      case 'high':
        return <ArrowUpward color="warning" fontSize="small" />;
      case 'low':
        return <ArrowDownward color="info" fontSize="small" />;
      case 'critical':
        return <Flag color="error" fontSize="small" />;
    }
  };

  const hasAbnormalResults = labTest.results?.some(r => r.flag);
  const criticalResults = labTest.results?.filter(r => r.flag === 'critical');

  return (
    <Box>
      {showActions && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">
            Lab Test Report #{labTest.test_id}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="outlined" startIcon={<Print />} onClick={handlePrint}>
              Print
            </Button>
            <Button variant="outlined" startIcon={<Email />} onClick={handleEmail}>
              Email
            </Button>
            <Button variant="outlined" startIcon={<Download />} onClick={handleDownload}>
              Download PDF
            </Button>
            <Button variant="outlined" startIcon={<Share />} onClick={handleShare}>
              Share
            </Button>
          </Box>
        </Box>
      )}

      <Paper sx={{ p: 4 }} ref={printRef}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
            <LocalHospital sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
            <Box>
              <Typography variant="h4" color="primary">
                Hospital Laboratory
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Accredited Medical Laboratory
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <LocationOn sx={{ fontSize: 16 }} />
              <Typography variant="body2">123 Medical Street, City, State 12345</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Phone sx={{ fontSize: 16 }} />
              <Typography variant="body2">(555) 123-4567</Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Report Info */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">Report ID:</Typography>
            <Typography variant="body1" fontWeight="medium">{labTest.test_id}</Typography>
          </Grid>
          <Grid item xs={6} sx={{ textAlign: 'right' }}>
            <Typography variant="body2" color="text.secondary">Report Date:</Typography>
            <Typography variant="body1" fontWeight="medium">
              {labTest.completed_date ? format(new Date(labTest.completed_date), 'dd MMM yyyy') : 'Pending'}
            </Typography>
          </Grid>
        </Grid>

        {/* Patient & Test Info */}
        <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1, mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Patient Information
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {labTest.patient_name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Patient ID: {labTest.patient_id}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Test Information
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {labTest.test_name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Category: {labTest.test_category}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                Referred By: {labTest.doctor_name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Order Date: {format(new Date(labTest.ordered_date), 'dd MMM yyyy HH:mm')}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                Sample Collected: {labTest.sample_collected_at ? format(new Date(labTest.sample_collected_at), 'dd MMM yyyy HH:mm') : 'N/A'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Priority: <Chip label={labTest.priority.toUpperCase()} size="small" color={labTest.priority === 'stat' ? 'error' : labTest.priority === 'urgent' ? 'warning' : 'default'} />
              </Typography>
            </Grid>
          </Grid>
        </Box>

        {/* Critical Results Alert */}
        {criticalResults && criticalResults.length > 0 && (
          <Alert severity="error" sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              CRITICAL RESULTS - Immediate attention required
            </Typography>
            {criticalResults.map(result => (
              <Typography key={result.id} variant="body2">
                {result.parameter}: {result.value} {result.unit} (Normal: {result.normal_range})
              </Typography>
            ))}
          </Alert>
        )}

        {/* Test Results */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Test Results
          </Typography>
          
          {labTest.status === 'completed' && labTest.results ? (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: 'grey.100' }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>Parameter</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Result</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Unit</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Normal Range</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Flag</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {labTest.results.map((result) => (
                    <TableRow 
                      key={result.id}
                      sx={{ 
                        bgcolor: result.flag === 'critical' ? 'error.light' : 
                                 result.flag ? 'warning.light' : 'inherit' 
                      }}
                    >
                      <TableCell>{result.parameter}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" fontWeight={result.flag ? 'bold' : 'normal'}>
                            {result.value}
                          </Typography>
                          {getResultFlag(result.flag)}
                        </Box>
                      </TableCell>
                      <TableCell>{result.unit}</TableCell>
                      <TableCell>{result.normal_range}</TableCell>
                      <TableCell>
                        {result.flag && (
                          <Chip 
                            label={result.flag.toUpperCase()} 
                            size="small" 
                            color={result.flag === 'critical' ? 'error' : result.flag === 'high' ? 'warning' : 'info'}
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Alert severity="info">
              Test results are not yet available. Current status: {labTest.status}
            </Alert>
          )}

          {labTest.notes && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Clinical Notes:
              </Typography>
              <Typography variant="body2">{labTest.notes}</Typography>
            </Box>
          )}
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Footer */}
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Status:
            </Typography>
            <Chip
              label={labTest.status.replace('_', ' ').toUpperCase()}
              color={getStatusColor(labTest.status)}
              icon={labTest.status === 'completed' ? <CheckCircle /> : labTest.status === 'cancelled' ? <Warning /> : undefined}
            />
          </Grid>
          <Grid item xs={6} sx={{ textAlign: 'right' }}>
            {labTest.status === 'completed' && (
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Verified & Released
                </Typography>
                <Box sx={{ 
                  borderBottom: 1, 
                  borderColor: 'divider', 
                  width: 200, 
                  ml: 'auto',
                  mt: 3,
                  mb: 1
                }} />
                <Typography variant="body2">
                  Laboratory Director
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>

        {/* Summary Box */}
        {hasAbnormalResults && (
          <Box sx={{ mt: 3, p: 2, bgcolor: 'warning.light', borderRadius: 1 }}>
            <Typography variant="body2" fontWeight="medium">
              Note: This report contains abnormal results. Please consult with the referring physician.
            </Typography>
          </Box>
        )}

        {/* Disclaimer */}
        <Box sx={{ mt: 4, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
          <Typography variant="caption" display="block">
            This report is confidential and intended solely for the use of the patient and the referring physician.
            Results should be interpreted in conjunction with clinical findings and other diagnostic information.
            For any queries, please contact the laboratory at (555) 123-4567.
          </Typography>
        </Box>
      </Paper>

      {/* Actions for non-print view */}
      {showActions && onClose && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Button variant="outlined" onClick={onClose}>
            Close
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default LabTestResultView;