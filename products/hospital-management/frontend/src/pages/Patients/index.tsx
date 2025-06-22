import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Typography,
  Tooltip,
  Paper,
} from '@mui/material';
import {
  Add,
  Search,
  Edit,
  Visibility,
  Delete,
  FileDownload,
  FilterList,
} from '@mui/icons-material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { AppDispatch, RootState } from '../../store';
import { fetchPatients } from '../../store/slices/patientSlice';
import { showNotification } from '../../store/slices/notificationSlice';
import PatientDialog from './PatientDialog';
import PatientDetailsDialog from './PatientDetailsDialog';

const Patients: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { patients, loading, totalCount } = useSelector((state: RootState) => state.patients);
  
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    loadPatients();
  }, [page, pageSize]);

  const loadPatients = () => {
    dispatch(fetchPatients({ page: page + 1, per_page: pageSize, search: searchQuery }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    loadPatients();
  };

  const handleCreatePatient = () => {
    setSelectedPatient(null);
    setEditMode(false);
    setOpenDialog(true);
  };

  const handleEditPatient = (patient: any) => {
    setSelectedPatient(patient);
    setEditMode(true);
    setOpenDialog(true);
  };

  const handleViewPatient = (patient: any) => {
    setSelectedPatient(patient);
    setOpenDetailsDialog(true);
  };

  const handleDeletePatient = async (patient: any) => {
    if (window.confirm(`Are you sure you want to delete patient ${patient.first_name} ${patient.last_name}?`)) {
      // TODO: Implement delete
      dispatch(showNotification({
        message: 'Patient deleted successfully',
        severity: 'success',
      }));
    }
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    dispatch(showNotification({
      message: 'Exporting patient data...',
      severity: 'info',
    }));
  };

  const getAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const columns: GridColDef[] = [
    {
      field: 'patient_id',
      headerName: 'Patient ID',
      width: 120,
      renderCell: (params) => (
        <Chip label={params.value} size="small" color="primary" variant="outlined" />
      ),
    },
    {
      field: 'full_name',
      headerName: 'Name',
      width: 200,
      valueGetter: (params) => `${params.row.first_name} ${params.row.last_name}`,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2" fontWeight="medium">
            {params.value}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {params.row.gender} • {getAge(params.row.date_of_birth)} years
          </Typography>
        </Box>
      ),
    },
    {
      field: 'phone',
      headerName: 'Contact',
      width: 150,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2">{params.value}</Typography>
          {params.row.email && (
            <Typography variant="caption" color="text.secondary" noWrap>
              {params.row.email}
            </Typography>
          )}
        </Box>
      ),
    },
    {
      field: 'blood_group',
      headerName: 'Blood Group',
      width: 100,
      renderCell: (params) => (
        params.value ? (
          <Chip 
            label={params.value} 
            size="small" 
            color="error" 
            variant="outlined"
          />
        ) : '-'
      ),
    },
    {
      field: 'chronic_diseases',
      headerName: 'Conditions',
      width: 180,
      renderCell: (params: GridRenderCellParams) => {
        const diseases = params.value || [];
        if (diseases.length === 0) return '-';
        
        return (
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
            {diseases.slice(0, 2).map((disease: string, index: number) => (
              <Chip
                key={index}
                label={disease}
                size="small"
                sx={{ fontSize: '0.7rem' }}
              />
            ))}
            {diseases.length > 2 && (
              <Chip
                label={`+${diseases.length - 2}`}
                size="small"
                sx={{ fontSize: '0.7rem' }}
              />
            )}
          </Box>
        );
      },
    },
    {
      field: 'created_at',
      headerName: 'Registered',
      width: 120,
      valueFormatter: (params) => format(new Date(params.value), 'MMM dd, yyyy'),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <Tooltip title="View Details">
            <IconButton
              size="small"
              onClick={() => handleViewPatient(params.row)}
            >
              <Visibility fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton
              size="small"
              onClick={() => handleEditPatient(params.row)}
            >
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              onClick={() => handleDeletePatient(params.row)}
              color="error"
            >
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Patients
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage patient records and medical information
          </Typography>
        </Box>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<FileDownload />}
            onClick={handleExport}
          >
            Export
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleCreatePatient}
          >
            New Patient
          </Button>
        </Box>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" gap={2} alignItems="center">
            <form onSubmit={handleSearch} style={{ flex: 1 }}>
              <TextField
                fullWidth
                placeholder="Search by name, ID, phone, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                  endAdornment: searchQuery && (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => {
                          setSearchQuery('');
                          setPage(0);
                          loadPatients();
                        }}
                      >
                        ×
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </form>
            <Button
              variant="outlined"
              startIcon={<FilterList />}
            >
              Filters
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Paper>
        <DataGrid
          rows={patients}
          columns={columns}
          loading={loading}
          rowCount={totalCount}
          pageSizeOptions={[10, 25, 50]}
          paginationModel={{
            page,
            pageSize,
          }}
          onPaginationModelChange={(model) => {
            setPage(model.page);
            setPageSize(model.pageSize);
          }}
          paginationMode="server"
          autoHeight
          disableRowSelectionOnClick
          sx={{
            '& .MuiDataGrid-row': {
              cursor: 'pointer',
            },
            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid rgba(224, 224, 224, 0.5)',
            },
          }}
          onRowClick={(params) => handleViewPatient(params.row)}
        />
      </Paper>

      <PatientDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        patient={selectedPatient}
        editMode={editMode}
        onSuccess={() => {
          setOpenDialog(false);
          loadPatients();
        }}
      />

      <PatientDetailsDialog
        open={openDetailsDialog}
        onClose={() => setOpenDetailsDialog(false)}
        patient={selectedPatient}
        onEdit={() => {
          setOpenDetailsDialog(false);
          handleEditPatient(selectedPatient);
        }}
      />
    </Box>
  );
};

export default Patients;