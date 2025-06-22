import React, { useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText,
  Button,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  Print,
  Email,
  Download,
  Share,
  LocalHospital,
  Phone,
  LocationOn,
  CalendarMonth,
} from '@mui/icons-material';
import { Prescription } from '../../store/slices/prescriptionSlice';
import { format } from 'date-fns';
import ReactToPrint from 'react-to-print';

interface PrescriptionViewProps {
  prescription: Prescription;
  onClose?: () => void;
  showActions?: boolean;
}

const PrescriptionView: React.FC<PrescriptionViewProps> = ({
  prescription,
  onClose,
  showActions = true,
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handleEmail = () => {
    // Email functionality would go here
    console.log('Email prescription');
  };

  const handleDownload = () => {
    // PDF download functionality would go here
    console.log('Download prescription');
  };

  const handleShare = () => {
    // Share functionality would go here
    console.log('Share prescription');
  };

  return (
    <Box>
      {showActions && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">
            Prescription #{prescription.prescription_number}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <ReactToPrint
              trigger={() => (
                <Button variant="outlined" startIcon={<Print />}>
                  Print
                </Button>
              )}
              content={() => printRef.current}
            />
            <Button variant="outlined" startIcon={<Email />} onClick={handleEmail}>
              Email
            </Button>
            <Button variant="outlined" startIcon={<Download />} onClick={handleDownload}>
              Download PDF
            </Button>
            <IconButton onClick={handleShare}>
              <Share />
            </IconButton>
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
                Hospital Name
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Multi-Specialty Hospital
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

        {/* Prescription Info */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Prescription No:
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {prescription.prescription_number}
            </Typography>
          </Grid>
          <Grid item xs={6} sx={{ textAlign: 'right' }}>
            <Typography variant="body2" color="text.secondary">
              Date:
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {format(new Date(prescription.date_prescribed), 'dd MMM yyyy')}
            </Typography>
          </Grid>
        </Grid>

        {/* Patient Info */}
        <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1, mb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Patient Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2" color="text.secondary">Name:</Typography>
              <Typography variant="body1" fontWeight="medium">
                {prescription.patient_name}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2" color="text.secondary">Age/Gender:</Typography>
              <Typography variant="body1" fontWeight="medium">
                {prescription.patient_age} years / {prescription.patient_gender}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2" color="text.secondary">Patient ID:</Typography>
              <Typography variant="body1" fontWeight="medium">
                {prescription.patient_id}
              </Typography>
            </Grid>
          </Grid>
        </Box>

        {/* Diagnosis */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Diagnosis
          </Typography>
          <Typography variant="body1" paragraph>
            {prescription.diagnosis}
          </Typography>
          {prescription.chief_complaint && (
            <>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Chief Complaint
              </Typography>
              <Typography variant="body1" paragraph>
                {prescription.chief_complaint}
              </Typography>
            </>
          )}
        </Box>

        {/* Medications */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography component="span" sx={{ fontSize: 24, mr: 1 }}>℞</Typography>
            Medications
          </Typography>
          
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>S.No</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Medicine</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Dosage</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Frequency</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Duration</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Qty</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {prescription.items.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {item.drug_name} ({item.strength})
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {item.generic_name} - {item.form}
                        </Typography>
                        {!item.substitution_allowed && (
                          <Typography variant="caption" color="error" display="block">
                            (No Substitution)
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>{item.dosage}</TableCell>
                    <TableCell>{item.frequency}</TableCell>
                    <TableCell>{item.duration}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Instructions for each medication */}
          {prescription.items.some(item => item.instructions) && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Special Instructions:
              </Typography>
              <List dense>
                {prescription.items.filter(item => item.instructions).map((item, index) => (
                  <ListItem key={item.id}>
                    <ListItemText
                      primary={`${item.drug_name}: ${item.instructions}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </Box>

        {/* Additional Notes */}
        {prescription.notes && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Additional Instructions
            </Typography>
            <Typography variant="body1">
              {prescription.notes}
            </Typography>
          </Box>
        )}

        {/* Follow-up */}
        {prescription.follow_up_date && (
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarMonth color="primary" />
              <Typography variant="body1">
                Follow-up Date: <strong>{format(new Date(prescription.follow_up_date), 'dd MMM yyyy')}</strong>
              </Typography>
            </Box>
          </Box>
        )}

        {/* Dental Data */}
        {prescription.dental_data && prescription.dental_data.selected_teeth.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Selected Teeth
            </Typography>
            <Typography variant="body1">
              {prescription.dental_data.teeth_names}
            </Typography>
          </Box>
        )}

        {/* Dermatology Data */}
        {prescription.dermatology_data && prescription.dermatology_data.injection_sites.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Treatment Sites
            </Typography>
            <Typography variant="body1" gutterBottom>
              {prescription.dermatology_data.injection_sites.length} injection sites
              {prescription.dermatology_data.total_units > 0 && 
                ` • Total units: ${prescription.dermatology_data.total_units}`
              }
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {prescription.dermatology_data.injection_sites.map((site, index) => (
                <Chip
                  key={index}
                  label={`${site.area} - ${site.type} (${site.units} units)`}
                  size="small"
                  variant="outlined"
                />
              ))}
            </Box>
          </Box>
        )}

        <Divider sx={{ my: 3 }} />

        {/* Footer */}
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Valid Until:
            </Typography>
            <Typography variant="body1">
              {format(new Date(prescription.valid_until), 'dd MMM yyyy')}
            </Typography>
          </Grid>
          <Grid item xs={6} sx={{ textAlign: 'right' }}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="body2" color="text.secondary">
                Doctor's Signature
              </Typography>
              <Box sx={{ 
                borderBottom: 1, 
                borderColor: 'divider', 
                width: 200, 
                ml: 'auto',
                mt: 3 
              }} />
            </Box>
            <Typography variant="body1" fontWeight="medium">
              {prescription.doctor_name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              License No: {prescription.doctor_license}
            </Typography>
          </Grid>
        </Grid>

        {/* Status Indicators */}
        <Box sx={{ mt: 3, display: 'flex', gap: 1, justifyContent: 'center' }}>
          <Chip
            label={`Status: ${prescription.status}`}
            color={prescription.status === 'active' ? 'success' : 'default'}
            size="small"
          />
          {prescription.is_printed && (
            <Chip label="Printed" size="small" variant="outlined" />
          )}
          {prescription.is_emailed && (
            <Chip label="Emailed" size="small" variant="outlined" />
          )}
        </Box>

        {/* Important Notice */}
        <Box sx={{ mt: 4, p: 2, bgcolor: 'warning.light', borderRadius: 1 }}>
          <Typography variant="caption" display="block" sx={{ textAlign: 'center' }}>
            This is a computer-generated prescription. Medicines should be taken under medical supervision only.
            Keep this prescription out of reach of children. In case of any adverse reaction, contact your doctor immediately.
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

export default PrescriptionView;