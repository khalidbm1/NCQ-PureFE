import React, { useState, useEffect } from 'react';
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
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Tooltip,
  Typography,
  Grid,
} from '@mui/material';
import {
  Search,
  FilterList,
  Visibility,
  Edit,
  Print,
  Lock,
  Clear,
  Download,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import {
  MedicalRecord,
  setFilters,
  clearFilters,
  setSelectedRecord,
} from '../../store/slices/medicalRecordSlice';
import MedicalRecordView from './MedicalRecordView';
import MedicalRecordForm from './MedicalRecordForm';

interface MedicalRecordListProps {
  patientId?: string;
  patientName?: string;
  onRecordSelect?: (record: MedicalRecord) => void;
}

const MedicalRecordList: React.FC<MedicalRecordListProps> = ({
  patientId,
  patientName,
  onRecordSelect,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { records, filters, loading } = useSelector((state: RootState) => state.medicalRecords);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecordLocal] = useState<MedicalRecord | null>(null);

  // Filter records based on patient and search criteria
  const filteredRecords = records.filter(record => {
    if (patientId && record.patient_id !== patientId) return false;
    
    if (filters.type !== 'all' && record.type !== filters.type) return false;
    
    if (filters.department !== 'all' && record.department !== filters.department) return false;
    
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      return (
        record.chief_complaint.toLowerCase().includes(searchLower) ||
        record.diagnosis.some(d => 
          d.description.toLowerCase().includes(searchLower) ||
          d.code.toLowerCase().includes(searchLower)
        ) ||
        record.doctor_name.toLowerCase().includes(searchLower)
      );
    }
    
    if (filters.dateRange.start && filters.dateRange.end) {
      const recordDate = new Date(record.date);
      const startDate = new Date(filters.dateRange.start);
      const endDate = new Date(filters.dateRange.end);
      return recordDate >= startDate && recordDate <= endDate;
    }
    
    return true;
  });

  const recordTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'consultation', label: 'Consultation' },
    { value: 'admission', label: 'Admission' },
    { value: 'procedure', label: 'Procedure' },
    { value: 'surgery', label: 'Surgery' },
    { value: 'emergency', label: 'Emergency' },
    { value: 'followup', label: 'Follow-up' },
    { value: 'diagnostic', label: 'Diagnostic' },
  ];

  const departments = [
    { value: 'all', label: 'All Departments' },
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

  const getRecordTypeColor = (type: string) => {
    const colors: Record<string, any> = {
      consultation: 'primary',
      admission: 'secondary',
      procedure: 'info',
      surgery: 'error',
      emergency: 'warning',
      followup: 'default',
      diagnostic: 'success',
    };
    return colors[type] || 'default';
  };

  const handleViewRecord = (record: MedicalRecord) => {
    setSelectedRecordLocal(record);
    dispatch(setSelectedRecord(record));
    setViewDialogOpen(true);
  };

  const handleEditRecord = (record: MedicalRecord) => {
    setSelectedRecordLocal(record);
    setEditDialogOpen(true);
  };

  const handlePrintRecord = (record: MedicalRecord) => {
    // Create a printable version of the record
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Medical Record - ${record.record_id}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h1, h2, h3 { color: #333; }
              .header { border-bottom: 2px solid #333; margin-bottom: 20px; }
              .section { margin-bottom: 20px; }
              .label { font-weight: bold; color: #666; }
              table { width: 100%; border-collapse: collapse; margin-top: 10px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f5f5f5; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Medical Record #${record.record_id}</h1>
              <p>Patient: ${record.patient_name} | Date: ${format(new Date(record.date), 'PPP')}</p>
            </div>
            <div class="section">
              <h2>Chief Complaint</h2>
              <p>${record.chief_complaint}</p>
            </div>
            <div class="section">
              <h2>Diagnosis</h2>
              <ul>
                ${record.diagnosis.map(d => `<li>${d.code} - ${d.description} (${d.type})</li>`).join('')}
              </ul>
            </div>
            ${record.treatment_plan ? `
              <div class="section">
                <h2>Treatment Plan</h2>
                <p>${record.treatment_plan}</p>
              </div>
            ` : ''}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleExportRecords = () => {
    // Export filtered records as CSV
    const csvContent = [
      ['Record ID', 'Date', 'Type', 'Department', 'Patient', 'Doctor', 'Chief Complaint', 'Primary Diagnosis'],
      ...filteredRecords.map(record => [
        record.record_id,
        format(new Date(record.date), 'yyyy-MM-dd'),
        record.type,
        record.department,
        record.patient_name,
        record.doctor_name,
        record.chief_complaint,
        record.diagnosis.find(d => d.type === 'primary')?.description || '',
      ]),
    ]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `medical_records_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box>
      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              placeholder="Search records..."
              value={filters.searchTerm}
              onChange={(e) => dispatch(setFilters({ searchTerm: e.target.value }))}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={filters.type}
                onChange={(e) => dispatch(setFilters({ type: e.target.value }))}
                label="Type"
              >
                {recordTypes.map(type => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Department</InputLabel>
              <Select
                value={filters.department}
                onChange={(e) => dispatch(setFilters({ department: e.target.value }))}
                label="Department"
              >
                {departments.map(dept => (
                  <MenuItem key={typeof dept === 'string' ? dept : dept.value} value={typeof dept === 'string' ? dept : dept.value}>
                    {typeof dept === 'string' ? dept : dept.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              variant="outlined"
              startIcon={<Clear />}
              onClick={() => dispatch(clearFilters())}
              fullWidth
            >
              Clear Filters
            </Button>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<Download />}
                onClick={handleExportRecords}
                fullWidth
              >
                Export
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Records Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Record ID</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Department</TableCell>
              {!patientId && <TableCell>Patient</TableCell>}
              <TableCell>Doctor</TableCell>
              <TableCell>Chief Complaint</TableCell>
              <TableCell>Diagnosis</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRecords
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((record) => (
                <TableRow key={record.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {record.record_id}
                      {record.is_confidential && (
                        <Tooltip title="Confidential Record">
                          <Lock fontSize="small" color="error" />
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>{format(new Date(record.date), 'PP')}</TableCell>
                  <TableCell>
                    <Chip
                      label={record.type.charAt(0).toUpperCase() + record.type.slice(1)}
                      color={getRecordTypeColor(record.type)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{record.department}</TableCell>
                  {!patientId && <TableCell>{record.patient_name}</TableCell>}
                  <TableCell>{record.doctor_name}</TableCell>
                  <TableCell sx={{ maxWidth: 200 }}>
                    <Typography variant="body2" noWrap title={record.chief_complaint}>
                      {record.chief_complaint}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {record.diagnosis
                      .filter(d => d.type === 'primary')
                      .map(d => (
                        <Chip
                          key={d.code}
                          label={`${d.code}: ${d.description}`}
                          size="small"
                          sx={{ mb: 0.5 }}
                        />
                      ))}
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                      <Tooltip title="View">
                        <IconButton
                          size="small"
                          onClick={() => handleViewRecord(record)}
                        >
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          onClick={() => handleEditRecord(record)}
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Print">
                        <IconButton
                          size="small"
                          onClick={() => handlePrintRecord(record)}
                        >
                          <Print />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            {filteredRecords.length === 0 && (
              <TableRow>
                <TableCell colSpan={patientId ? 8 : 9} align="center">
                  <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                    No medical records found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredRecords.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

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
              <Clear />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedRecord && (
            <MedicalRecordView
              record={selectedRecord}
              onEdit={() => {
                setViewDialogOpen(false);
                handleEditRecord(selectedRecord);
              }}
              onPrint={() => handlePrintRecord(selectedRecord)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Edit Medical Record</Typography>
            <IconButton onClick={() => setEditDialogOpen(false)}>
              <Clear />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedRecord && (
            <MedicalRecordForm
              patientId={selectedRecord.patient_id}
              patientName={selectedRecord.patient_name}
              recordToEdit={selectedRecord}
              onSuccess={() => {
                setEditDialogOpen(false);
                setSelectedRecordLocal(null);
              }}
              onCancel={() => setEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default MedicalRecordList;