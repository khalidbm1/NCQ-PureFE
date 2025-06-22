import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  Button,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from '@mui/material';
import {
  Clear,
  Save,
  Undo,
  Info,
} from '@mui/icons-material';

interface ToothData {
  number: number;
  status: 'healthy' | 'cavity' | 'filled' | 'crown' | 'missing' | 'implant' | 'selected';
  notes?: string;
}

interface DentalChartProps {
  onToothSelect?: (teeth: number[]) => void;
  onSave?: (toothData: ToothData[]) => void;
  selectedTeeth?: number[];
  mode?: 'select' | 'chart';
}

const DentalChart: React.FC<DentalChartProps> = ({
  onToothSelect,
  onSave,
  selectedTeeth = [],
  mode = 'select',
}) => {
  const [teethData, setTeethData] = useState<Map<number, ToothData>>(new Map());
  const [hoveredTooth, setHoveredTooth] = useState<number | null>(null);
  const [selectedToothForEdit, setSelectedToothForEdit] = useState<number | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [toothStatus, setToothStatus] = useState<ToothData['status']>('healthy');
  const [toothNotes, setToothNotes] = useState('');

  // Adult teeth numbering (Universal Numbering System)
  const upperTeeth = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
  const lowerTeeth = [32, 31, 30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17];

  const toothNames: { [key: number]: string } = {
    // Upper right
    1: 'Upper Right Third Molar (Wisdom)',
    2: 'Upper Right Second Molar',
    3: 'Upper Right First Molar',
    4: 'Upper Right Second Premolar',
    5: 'Upper Right First Premolar',
    6: 'Upper Right Canine',
    7: 'Upper Right Lateral Incisor',
    8: 'Upper Right Central Incisor',
    // Upper left
    9: 'Upper Left Central Incisor',
    10: 'Upper Left Lateral Incisor',
    11: 'Upper Left Canine',
    12: 'Upper Left First Premolar',
    13: 'Upper Left Second Premolar',
    14: 'Upper Left First Molar',
    15: 'Upper Left Second Molar',
    16: 'Upper Left Third Molar (Wisdom)',
    // Lower left
    17: 'Lower Left Third Molar (Wisdom)',
    18: 'Lower Left Second Molar',
    19: 'Lower Left First Molar',
    20: 'Lower Left Second Premolar',
    21: 'Lower Left First Premolar',
    22: 'Lower Left Canine',
    23: 'Lower Left Lateral Incisor',
    24: 'Lower Left Central Incisor',
    // Lower right
    25: 'Lower Right Central Incisor',
    26: 'Lower Right Lateral Incisor',
    27: 'Lower Right Canine',
    28: 'Lower Right First Premolar',
    29: 'Lower Right Second Premolar',
    30: 'Lower Right First Molar',
    31: 'Lower Right Second Molar',
    32: 'Lower Right Third Molar (Wisdom)',
  };

  const getToothColor = (toothNumber: number) => {
    const data = teethData.get(toothNumber);
    if (mode === 'select' && selectedTeeth.includes(toothNumber)) {
      return '#2196f3';
    }
    if (!data || data.status === 'healthy') return '#90EE90';
    switch (data.status) {
      case 'cavity': return '#FF6B6B';
      case 'filled': return '#FFD93D';
      case 'crown': return '#6BCF7F';
      case 'missing': return '#E0E0E0';
      case 'implant': return '#64B5F6';
      case 'selected': return '#2196f3';
      default: return '#90EE90';
    }
  };

  const handleToothClick = (toothNumber: number) => {
    if (mode === 'select') {
      const newSelected = selectedTeeth.includes(toothNumber)
        ? selectedTeeth.filter(t => t !== toothNumber)
        : [...selectedTeeth, toothNumber];
      
      if (onToothSelect) {
        onToothSelect(newSelected);
      }
    } else {
      setSelectedToothForEdit(toothNumber);
      const existingData = teethData.get(toothNumber);
      if (existingData) {
        setToothStatus(existingData.status);
        setToothNotes(existingData.notes || '');
      } else {
        setToothStatus('healthy');
        setToothNotes('');
      }
      setEditDialogOpen(true);
    }
  };

  const handleSaveToothData = () => {
    if (selectedToothForEdit !== null) {
      const newData = new Map(teethData);
      newData.set(selectedToothForEdit, {
        number: selectedToothForEdit,
        status: toothStatus,
        notes: toothNotes,
      });
      setTeethData(newData);
    }
    setEditDialogOpen(false);
  };

  const handleClearAll = () => {
    if (mode === 'select' && onToothSelect) {
      onToothSelect([]);
    } else {
      setTeethData(new Map());
    }
  };

  const handleSaveChart = () => {
    if (onSave) {
      const dataArray = Array.from(teethData.values());
      onSave(dataArray);
    }
  };

  const renderTooth = (toothNumber: number, isUpper: boolean) => {
    const isSelected = mode === 'select' ? selectedTeeth.includes(toothNumber) : false;
    const toothData = teethData.get(toothNumber);
    
    return (
      <Tooltip
        key={toothNumber}
        title={
          <Box>
            <Typography variant="body2">{toothNames[toothNumber]}</Typography>
            <Typography variant="caption">Tooth #{toothNumber}</Typography>
            {toothData && (
              <>
                <Typography variant="caption" display="block">
                  Status: {toothData.status}
                </Typography>
                {toothData.notes && (
                  <Typography variant="caption" display="block">
                    Notes: {toothData.notes}
                  </Typography>
                )}
              </>
            )}
          </Box>
        }
      >
        <Box
          onClick={() => handleToothClick(toothNumber)}
          onMouseEnter={() => setHoveredTooth(toothNumber)}
          onMouseLeave={() => setHoveredTooth(null)}
          sx={{
            width: 40,
            height: 40,
            bgcolor: getToothColor(toothNumber),
            border: 2,
            borderColor: hoveredTooth === toothNumber || isSelected ? 'primary.main' : 'divider',
            borderRadius: isUpper ? '50% 50% 40% 40%' : '40% 40% 50% 50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s',
            transform: hoveredTooth === toothNumber ? 'scale(1.1)' : 'scale(1)',
            boxShadow: isSelected ? 3 : 0,
            '&:hover': {
              boxShadow: 3,
            },
          }}
        >
          <Typography variant="caption" fontWeight="bold">
            {toothNumber}
          </Typography>
        </Box>
      </Tooltip>
    );
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">
          {mode === 'select' ? 'Select Teeth' : 'Dental Chart'}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            size="small"
            startIcon={<Clear />}
            onClick={handleClearAll}
          >
            Clear All
          </Button>
          {mode === 'chart' && (
            <Button
              size="small"
              variant="contained"
              startIcon={<Save />}
              onClick={handleSaveChart}
            >
              Save Chart
            </Button>
          )}
        </Box>
      </Box>

      {/* Dental Chart */}
      <Box sx={{ maxWidth: 700, mx: 'auto' }}>
        {/* Upper Jaw */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" align="center" gutterBottom>
            Upper Jaw (Maxilla)
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
            {upperTeeth.map(tooth => renderTooth(tooth, true))}
          </Box>
        </Box>

        {/* Divider representing mouth opening */}
        <Box sx={{ 
          height: 60, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          position: 'relative',
        }}>
          <Box sx={{ 
            position: 'absolute',
            width: '80%',
            height: 2,
            bgcolor: 'divider',
          }} />
          <Box sx={{
            position: 'absolute',
            left: '10%',
            right: '10%',
            display: 'flex',
            justifyContent: 'space-between',
          }}>
            <Typography variant="caption" color="text.secondary">RIGHT</Typography>
            <Typography variant="caption" color="text.secondary">LEFT</Typography>
          </Box>
        </Box>

        {/* Lower Jaw */}
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
            {lowerTeeth.map(tooth => renderTooth(tooth, false))}
          </Box>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
            Lower Jaw (Mandible)
          </Typography>
        </Box>
      </Box>

      {/* Legend */}
      <Box sx={{ mt: 4, display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
        <Chip
          icon={<Box sx={{ width: 12, height: 12, bgcolor: '#90EE90', borderRadius: '50%' }} />}
          label="Healthy"
          size="small"
        />
        <Chip
          icon={<Box sx={{ width: 12, height: 12, bgcolor: '#FF6B6B', borderRadius: '50%' }} />}
          label="Cavity"
          size="small"
        />
        <Chip
          icon={<Box sx={{ width: 12, height: 12, bgcolor: '#FFD93D', borderRadius: '50%' }} />}
          label="Filled"
          size="small"
        />
        <Chip
          icon={<Box sx={{ width: 12, height: 12, bgcolor: '#6BCF7F', borderRadius: '50%' }} />}
          label="Crown"
          size="small"
        />
        <Chip
          icon={<Box sx={{ width: 12, height: 12, bgcolor: '#E0E0E0', borderRadius: '50%' }} />}
          label="Missing"
          size="small"
        />
        <Chip
          icon={<Box sx={{ width: 12, height: 12, bgcolor: '#64B5F6', borderRadius: '50%' }} />}
          label="Implant"
          size="small"
        />
        {mode === 'select' && (
          <Chip
            icon={<Box sx={{ width: 12, height: 12, bgcolor: '#2196f3', borderRadius: '50%' }} />}
            label="Selected"
            size="small"
          />
        )}
      </Box>

      {/* Selected Teeth Display */}
      {mode === 'select' && selectedTeeth.length > 0 && (
        <Box sx={{ mt: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
          <Typography variant="body2" gutterBottom>
            Selected Teeth: {selectedTeeth.sort((a, b) => a - b).join(', ')}
          </Typography>
          <Box sx={{ mt: 1 }}>
            {selectedTeeth.map(tooth => (
              <Chip
                key={tooth}
                label={`#${tooth} - ${toothNames[tooth]}`}
                size="small"
                onDelete={() => handleToothClick(tooth)}
                sx={{ m: 0.5 }}
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Edit Tooth Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>
          Edit Tooth #{selectedToothForEdit}
          {selectedToothForEdit && (
            <Typography variant="body2" color="text.secondary">
              {toothNames[selectedToothForEdit]}
            </Typography>
          )}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              select
              fullWidth
              label="Status"
              value={toothStatus}
              onChange={(e) => setToothStatus(e.target.value as ToothData['status'])}
              sx={{ mb: 2 }}
            >
              <MenuItem value="healthy">Healthy</MenuItem>
              <MenuItem value="cavity">Cavity</MenuItem>
              <MenuItem value="filled">Filled</MenuItem>
              <MenuItem value="crown">Crown</MenuItem>
              <MenuItem value="missing">Missing</MenuItem>
              <MenuItem value="implant">Implant</MenuItem>
            </TextField>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Notes"
              value={toothNotes}
              onChange={(e) => setToothNotes(e.target.value)}
              placeholder="Additional notes about this tooth..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveToothData} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default DentalChart;