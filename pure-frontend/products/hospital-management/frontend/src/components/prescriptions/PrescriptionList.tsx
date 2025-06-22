import React, { useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Typography,
  Button,
  Tooltip,
} from '@mui/material';
import {
  Search,
  MoreVert,
  Visibility,
  Edit,
  Print,
  Email,
  ContentCopy,
  Download,
  FilterList,
} from '@mui/icons-material';
import { Prescription } from '../../store/slices/prescriptionSlice';
import { format } from 'date-fns';

interface PrescriptionListProps {
  prescriptions: Prescription[];
  onView: (prescription: Prescription) => void;
  onEdit?: (prescription: Prescription) => void;
  onCopy?: (prescription: Prescription) => void;
  showPagination?: boolean;
}

const PrescriptionList: React.FC<PrescriptionListProps> = ({
  prescriptions,
  onView,
  onEdit,
  onCopy,
  showPagination = true,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredPrescriptions = prescriptions.filter(prescription =>
    prescription.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prescription.prescription_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prescription.doctor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prescription.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedPrescriptions = showPagination
    ? filteredPrescriptions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : filteredPrescriptions;

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, prescription: Prescription) => {
    setAnchorEl(event.currentTarget);
    setSelectedPrescription(prescription);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPrescription(null);
  };

  const handlePrint = () => {
    if (selectedPrescription) {
      onView(selectedPrescription);
    }
    handleMenuClose();
  };

  const handleEmail = () => {
    // Email functionality
    console.log('Email prescription', selectedPrescription);
    handleMenuClose();
  };

  const handleCopy = () => {
    if (selectedPrescription && onCopy) {
      onCopy(selectedPrescription);
    }
    handleMenuClose();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'completed': return 'default';
      case 'cancelled': return 'error';
      case 'expired': return 'warning';
      default: return 'default';
    }
  };

  const exportToCSV = () => {
    const headers = [
      'Prescription #',
      'Date',
      'Patient',
      'Doctor',
      'Diagnosis',
      'Medications',
      'Status',
    ];
    
    const data = filteredPrescriptions.map(rx => [
      rx.prescription_number,
      format(new Date(rx.date_prescribed), 'yyyy-MM-dd'),
      rx.patient_name,
      rx.doctor_name,
      rx.diagnosis,
      rx.items.map(item => `${item.drug_name} ${item.strength}`).join('; '),
      rx.status,
    ]);
    
    const csvContent = [
      headers.join(','),
      ...data.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `prescriptions_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
  };

  return (
    <Box>
      {/* Search and Actions */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <TextField
            placeholder="Search prescriptions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ flex: 1 }}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
          <Tooltip title="Filter">
            <IconButton>
              <FilterList />
            </IconButton>
          </Tooltip>
          <Button
            variant="outlined"
            size="small"
            startIcon={<Download />}
            onClick={exportToCSV}
          >
            Export
          </Button>
        </Box>
      </Paper>

      {/* Prescriptions Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Prescription #</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Patient</TableCell>
              <TableCell>Doctor</TableCell>
              <TableCell>Diagnosis</TableCell>
              <TableCell>Medications</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedPrescriptions.map((prescription) => (
              <TableRow
                key={prescription.id}
                hover
                sx={{ cursor: 'pointer' }}
                onClick={() => onView(prescription)}
              >
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {prescription.prescription_number}
                  </Typography>
                </TableCell>
                <TableCell>
                  {format(new Date(prescription.date_prescribed), 'MMM dd, yyyy')}
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2">{prescription.patient_name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {prescription.patient_age}y / {prescription.patient_gender}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>{prescription.doctor_name}</TableCell>
                <TableCell>
                  <Tooltip title={prescription.diagnosis}>
                    <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                      {prescription.diagnosis}
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {prescription.items.slice(0, 2).map((item, index) => (
                      <Chip
                        key={index}
                        label={`${item.drug_name} ${item.strength}`}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                    {prescription.items.length > 2 && (
                      <Chip
                        label={`+${prescription.items.length - 2} more`}
                        size="small"
                        color="primary"
                      />
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={prescription.status}
                    size="small"
                    color={getStatusColor(prescription.status) as any}
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMenuClick(e, prescription);
                    }}
                  >
                    <MoreVert />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            
            {paginatedPrescriptions.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No prescriptions found
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {searchTerm ? 'Try adjusting your search terms' : 'No prescriptions to display'}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        
        {showPagination && filteredPrescriptions.length > 0 && (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={filteredPrescriptions.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
      </TableContainer>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          if (selectedPrescription) onView(selectedPrescription);
          handleMenuClose();
        }}>
          <Visibility sx={{ mr: 1 }} fontSize="small" />
          View
        </MenuItem>
        {onEdit && (
          <MenuItem onClick={() => {
            if (selectedPrescription && onEdit) onEdit(selectedPrescription);
            handleMenuClose();
          }}>
            <Edit sx={{ mr: 1 }} fontSize="small" />
            Edit
          </MenuItem>
        )}
        <MenuItem onClick={handlePrint}>
          <Print sx={{ mr: 1 }} fontSize="small" />
          Print
        </MenuItem>
        <MenuItem onClick={handleEmail}>
          <Email sx={{ mr: 1 }} fontSize="small" />
          Email
        </MenuItem>
        {onCopy && (
          <MenuItem onClick={handleCopy}>
            <ContentCopy sx={{ mr: 1 }} fontSize="small" />
            Copy as Template
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
};

export default PrescriptionList;