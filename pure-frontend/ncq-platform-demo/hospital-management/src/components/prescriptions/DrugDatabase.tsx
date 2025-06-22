import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Collapse,
  Avatar,
} from '@mui/material';
import {
  Search,
  Info,
  Warning,
  LocalPharmacy,
  ExpandMore,
  ExpandLess,
  Category,
  Science,
  AttachMoney,
  Factory,
} from '@mui/icons-material';
import { Drug } from '../../store/slices/prescriptionSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const DrugDatabase: React.FC = () => {
  const { drugs } = useSelector((state: RootState) => state.prescriptions);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [formFilter, setFormFilter] = useState('all');
  const [selectedDrug, setSelectedDrug] = useState<Drug | null>(null);
  const [expandedDrug, setExpandedDrug] = useState<string | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const categories = Array.from(new Set(drugs.map(d => d.category))).sort();
  const forms = Array.from(new Set(drugs.map(d => d.form))).sort();

  const filteredDrugs = drugs.filter(drug => {
    const matchesSearch = 
      drug.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      drug.generic_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      drug.manufacturer.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || drug.category === categoryFilter;
    const matchesForm = formFilter === 'all' || drug.form === formFilter;
    
    return matchesSearch && matchesCategory && matchesForm;
  });

  const handleDrugClick = (drug: Drug) => {
    setSelectedDrug(drug);
    setDetailsOpen(true);
  };

  const getFormIcon = (form: string) => {
    switch (form) {
      case 'tablet':
      case 'capsule':
        return '💊';
      case 'syrup':
        return '🥤';
      case 'injection':
        return '💉';
      case 'cream':
        return '🧴';
      case 'drops':
        return '💧';
      case 'inhaler':
        return '🫁';
      case 'patch':
        return '🩹';
      default:
        return '💊';
    }
  };

  return (
    <Box>
      {/* Search and Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search drugs by name, generic name, or manufacturer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                label="Category"
              >
                <MenuItem value="all">All Categories</MenuItem>
                {categories.map(category => (
                  <MenuItem key={category} value={category}>{category}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Form</InputLabel>
              <Select
                value={formFilter}
                onChange={(e) => setFormFilter(e.target.value)}
                label="Form"
              >
                <MenuItem value="all">All Forms</MenuItem>
                {forms.map(form => (
                  <MenuItem key={form} value={form}>
                    {getFormIcon(form)} {form.charAt(0).toUpperCase() + form.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Found {filteredDrugs.length} drugs
          </Typography>
        </Box>
      </Paper>

      {/* Drug List */}
      <Grid container spacing={2}>
        {filteredDrugs.map((drug) => (
          <Grid item xs={12} md={6} lg={4} key={drug.id}>
            <Card 
              sx={{ 
                height: '100%',
                cursor: 'pointer',
                '&:hover': { boxShadow: 3 }
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.light', mr: 2 }}>
                    {getFormIcon(drug.form)}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {drug.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {drug.generic_name} • {drug.strength}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 1 }}>
                      <Chip
                        icon={<Category />}
                        label={drug.category}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                      <Chip
                        label={drug.form}
                        size="small"
                        variant="outlined"
                      />
                      {drug.controlled_substance && (
                        <Chip
                          icon={<Warning />}
                          label="Controlled"
                          size="small"
                          color="error"
                        />
                      )}
                    </Box>
                  </Box>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedDrug(expandedDrug === drug.id ? null : drug.id);
                    }}
                  >
                    {expandedDrug === drug.id ? <ExpandLess /> : <ExpandMore />}
                  </IconButton>
                </Box>

                <Collapse in={expandedDrug === drug.id}>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ mt: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Factory sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">
                        {drug.manufacturer}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <AttachMoney sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">
                        ${drug.price}
                      </Typography>
                    </Box>
                    {drug.common_dosages.length > 0 && (
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          Common Dosages:
                        </Typography>
                        <Typography variant="body2">
                          {drug.common_dosages.join(' • ')}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Collapse>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Button
                    size="small"
                    startIcon={<Info />}
                    onClick={() => handleDrugClick(drug)}
                  >
                    View Details
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredDrugs.length === 0 && (
        <Paper sx={{ p: 8, textAlign: 'center' }}>
          <LocalPharmacy sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No drugs found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search or filters
          </Typography>
        </Paper>
      )}

      {/* Drug Details Dialog */}
      <Dialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedDrug && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  {getFormIcon(selectedDrug.form)}
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    {selectedDrug.name} ({selectedDrug.strength})
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedDrug.generic_name}
                  </Typography>
                </Box>
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Basic Information
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText
                        primary="Category"
                        secondary={selectedDrug.category}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Form"
                        secondary={selectedDrug.form}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Manufacturer"
                        secondary={selectedDrug.manufacturer}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Price"
                        secondary={`$${selectedDrug.price}`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Prescription Required"
                        secondary={selectedDrug.requires_prescription ? 'Yes' : 'No'}
                      />
                    </ListItem>
                    {selectedDrug.controlled_substance && (
                      <ListItem>
                        <Alert severity="warning" sx={{ width: '100%' }}>
                          Controlled Substance
                        </Alert>
                      </ListItem>
                    )}
                  </List>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Common Dosages
                  </Typography>
                  <List dense>
                    {selectedDrug.common_dosages.map((dosage, index) => (
                      <ListItem key={index}>
                        <ListItemText primary={dosage} />
                      </ListItem>
                    ))}
                  </List>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Side Effects
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {selectedDrug.side_effects.map((effect, index) => (
                      <Chip key={index} label={effect} size="small" />
                    ))}
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Contraindications
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {selectedDrug.contraindications.map((contraindication, index) => (
                      <Chip
                        key={index}
                        label={contraindication}
                        size="small"
                        color="error"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Drug Interactions
                  </Typography>
                  {selectedDrug.interactions.length > 0 ? (
                    <Alert severity="info" icon={<Warning />}>
                      <Typography variant="body2">
                        This drug may interact with: {selectedDrug.interactions.join(', ')}
                      </Typography>
                    </Alert>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No known major interactions
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDetailsOpen(false)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default DrugDatabase;