import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Tooltip,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import {
  Clear,
  Save,
  Delete,
  ZoomIn,
  ZoomOut,
  Visibility,
  VisibilityOff,
  Face,
  Accessibility,
} from '@mui/icons-material';

interface InjectionSite {
  id: string;
  x: number;
  y: number;
  area: string;
  type: 'botox' | 'filler' | 'other';
  units?: number;
  product?: string;
  notes?: string;
}

interface DermatologyBodyMapProps {
  onSiteSelect?: (sites: InjectionSite[]) => void;
  initialSites?: InjectionSite[];
  mode?: 'face' | 'body';
}

const DermatologyBodyMap: React.FC<DermatologyBodyMapProps> = ({
  onSiteSelect,
  initialSites = [],
  mode: initialMode = 'face',
}) => {
  const [sites, setSites] = useState<InjectionSite[]>(initialSites);
  const [mode, setMode] = useState<'face' | 'body'>(initialMode);
  const [hoveredSite, setHoveredSite] = useState<string | null>(null);
  const [selectedSite, setSelectedSite] = useState<InjectionSite | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [zoom, setZoom] = useState(1);

  // Injection site form state
  const [siteForm, setSiteForm] = useState({
    type: 'botox' as InjectionSite['type'],
    units: 0,
    product: '',
    notes: '',
  });

  const faceAreas = {
    forehead: { x: 50, y: 20, label: 'Forehead' },
    glabella: { x: 50, y: 30, label: 'Glabella (Frown Lines)' },
    crowsFeetLeft: { x: 25, y: 40, label: "Left Crow's Feet" },
    crowsFeetRight: { x: 75, y: 40, label: "Right Crow's Feet" },
    nasalBridge: { x: 50, y: 40, label: 'Nasal Bridge' },
    upperLipLeft: { x: 40, y: 60, label: 'Upper Lip Left' },
    upperLipRight: { x: 60, y: 60, label: 'Upper Lip Right' },
    lowerLipLeft: { x: 40, y: 65, label: 'Lower Lip Left' },
    lowerLipRight: { x: 60, y: 65, label: 'Lower Lip Right' },
    nasolabialLeft: { x: 35, y: 55, label: 'Left Nasolabial Fold' },
    nasolabialRight: { x: 65, y: 55, label: 'Right Nasolabial Fold' },
    marionetteLinesLeft: { x: 35, y: 70, label: 'Left Marionette Lines' },
    marionetteLinesRight: { x: 65, y: 70, label: 'Right Marionette Lines' },
    chinLeft: { x: 45, y: 75, label: 'Chin Left' },
    chinRight: { x: 55, y: 75, label: 'Chin Right' },
    jawlineLeft: { x: 25, y: 70, label: 'Left Jawline' },
    jawlineRight: { x: 75, y: 70, label: 'Right Jawline' },
  };

  const bodyAreas = {
    neckFront: { x: 50, y: 85, label: 'Neck Front' },
    shoulderLeft: { x: 30, y: 90, label: 'Left Shoulder' },
    shoulderRight: { x: 70, y: 90, label: 'Right Shoulder' },
    upperArmLeft: { x: 25, y: 100, label: 'Left Upper Arm' },
    upperArmRight: { x: 75, y: 100, label: 'Right Upper Arm' },
    forearmLeft: { x: 20, y: 110, label: 'Left Forearm' },
    forearmRight: { x: 80, y: 110, label: 'Right Forearm' },
    handLeft: { x: 15, y: 120, label: 'Left Hand' },
    handRight: { x: 85, y: 120, label: 'Right Hand' },
  };

  const products = {
    botox: ['Botox', 'Dysport', 'Xeomin', 'Jeuveau'],
    filler: ['Juvederm', 'Restylane', 'Radiesse', 'Sculptra', 'Belotero'],
    other: ['PRP', 'Mesotherapy', 'Custom'],
  };

  const handleMapClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    // Find closest area
    const areas = mode === 'face' ? faceAreas : bodyAreas;
    let closestArea = '';
    let minDistance = Infinity;

    Object.entries(areas).forEach(([key, area]) => {
      const distance = Math.sqrt(Math.pow(x - area.x, 2) + Math.pow(y - area.y, 2));
      if (distance < minDistance && distance < 10) { // 10% tolerance
        minDistance = distance;
        closestArea = area.label;
      }
    });

    if (closestArea) {
      const newSite: Partial<InjectionSite> = {
        id: `site-${Date.now()}`,
        x,
        y,
        area: closestArea,
      };
      setSelectedSite(newSite as InjectionSite);
      setSiteForm({
        type: 'botox',
        units: 0,
        product: '',
        notes: '',
      });
      setDialogOpen(true);
    }
  };

  const handleSaveSite = () => {
    if (selectedSite) {
      const updatedSite: InjectionSite = {
        ...selectedSite,
        ...siteForm,
      };

      const existingIndex = sites.findIndex(s => s.id === selectedSite.id);
      let newSites: InjectionSite[];
      
      if (existingIndex >= 0) {
        newSites = [...sites];
        newSites[existingIndex] = updatedSite;
      } else {
        newSites = [...sites, updatedSite];
      }

      setSites(newSites);
      if (onSiteSelect) {
        onSiteSelect(newSites);
      }
    }
    setDialogOpen(false);
  };

  const handleDeleteSite = (siteId: string) => {
    const newSites = sites.filter(s => s.id !== siteId);
    setSites(newSites);
    if (onSiteSelect) {
      onSiteSelect(newSites);
    }
  };

  const handleEditSite = (site: InjectionSite) => {
    setSelectedSite(site);
    setSiteForm({
      type: site.type,
      units: site.units || 0,
      product: site.product || '',
      notes: site.notes || '',
    });
    setDialogOpen(true);
  };

  const getMarkerColor = (type: InjectionSite['type']) => {
    switch (type) {
      case 'botox': return '#4CAF50';
      case 'filler': return '#2196F3';
      case 'other': return '#FF9800';
      default: return '#9E9E9E';
    }
  };

  const handleClearAll = () => {
    setSites([]);
    if (onSiteSelect) {
      onSiteSelect([]);
    }
  };

  const totalUnits = sites.reduce((sum, site) => sum + (site.units || 0), 0);

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">
          Injection Site Mapping
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <ToggleButtonGroup
            value={mode}
            exclusive
            onChange={(e, newMode) => newMode && setMode(newMode)}
            size="small"
          >
            <ToggleButton value="face">
              <Face />
            </ToggleButton>
            <ToggleButton value="body">
              <Accessibility />
            </ToggleButton>
          </ToggleButtonGroup>
          
          <IconButton onClick={() => setShowLabels(!showLabels)} size="small">
            {showLabels ? <Visibility /> : <VisibilityOff />}
          </IconButton>
          
          <IconButton 
            onClick={() => setZoom(Math.min(zoom + 0.1, 2))} 
            size="small"
            disabled={zoom >= 2}
          >
            <ZoomIn />
          </IconButton>
          
          <IconButton 
            onClick={() => setZoom(Math.max(zoom - 0.1, 0.5))} 
            size="small"
            disabled={zoom <= 0.5}
          >
            <ZoomOut />
          </IconButton>
          
          <Button
            size="small"
            startIcon={<Clear />}
            onClick={handleClearAll}
            disabled={sites.length === 0}
          >
            Clear All
          </Button>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 3 }}>
        {/* Body Map */}
        <Box sx={{ flex: 1 }}>
          <Box
            onClick={handleMapClick}
            sx={{
              position: 'relative',
              width: '100%',
              paddingBottom: mode === 'face' ? '100%' : '150%',
              bgcolor: 'grey.100',
              borderRadius: 2,
              cursor: 'crosshair',
              overflow: 'hidden',
              transform: `scale(${zoom})`,
              transformOrigin: 'top center',
              transition: 'transform 0.2s',
            }}
          >
            {/* Background Image/SVG would go here */}
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: mode === 'face' ? '60%' : '40%',
                height: mode === 'face' ? '80%' : '90%',
                border: 2,
                borderColor: 'divider',
                borderRadius: mode === 'face' ? '50% 50% 45% 45%' : 2,
                bgcolor: 'background.paper',
              }}
            />

            {/* Area Labels */}
            {showLabels && Object.entries(mode === 'face' ? faceAreas : bodyAreas).map(([key, area]) => (
              <Tooltip key={key} title={area.label}>
                <Box
                  sx={{
                    position: 'absolute',
                    left: `${area.x}%`,
                    top: `${area.y}%`,
                    transform: 'translate(-50%, -50%)',
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: 'text.disabled',
                    opacity: 0.3,
                  }}
                />
              </Tooltip>
            ))}

            {/* Injection Sites */}
            {sites.map(site => (
              <Tooltip
                key={site.id}
                title={
                  <Box>
                    <Typography variant="body2">{site.area}</Typography>
                    <Typography variant="caption">
                      {site.type} - {site.units} units
                    </Typography>
                    {site.product && (
                      <Typography variant="caption" display="block">
                        Product: {site.product}
                      </Typography>
                    )}
                  </Box>
                }
              >
                <Box
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditSite(site);
                  }}
                  onMouseEnter={() => setHoveredSite(site.id)}
                  onMouseLeave={() => setHoveredSite(null)}
                  sx={{
                    position: 'absolute',
                    left: `${site.x}%`,
                    top: `${site.y}%`,
                    transform: 'translate(-50%, -50%)',
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    bgcolor: getMarkerColor(site.type),
                    border: 2,
                    borderColor: hoveredSite === site.id ? 'common.white' : 'transparent',
                    boxShadow: hoveredSite === site.id ? 3 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'translate(-50%, -50%) scale(1.2)',
                    },
                  }}
                >
                  <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold' }}>
                    {sites.indexOf(site) + 1}
                  </Typography>
                </Box>
              </Tooltip>
            ))}
          </Box>

          {/* Legend */}
          <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'center' }}>
            <Chip
              icon={<Box sx={{ width: 12, height: 12, bgcolor: getMarkerColor('botox'), borderRadius: '50%' }} />}
              label="Botox"
              size="small"
            />
            <Chip
              icon={<Box sx={{ width: 12, height: 12, bgcolor: getMarkerColor('filler'), borderRadius: '50%' }} />}
              label="Filler"
              size="small"
            />
            <Chip
              icon={<Box sx={{ width: 12, height: 12, bgcolor: getMarkerColor('other'), borderRadius: '50%' }} />}
              label="Other"
              size="small"
            />
          </Box>
        </Box>

        {/* Sites List */}
        <Paper sx={{ width: 300, p: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Injection Sites ({sites.length})
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Total Units: {totalUnits}
          </Typography>
          
          <List dense sx={{ maxHeight: 400, overflow: 'auto' }}>
            {sites.map((site, index) => (
              <ListItem key={site.id}>
                <ListItemText
                  primary={`${index + 1}. ${site.area}`}
                  secondary={
                    <Box>
                      <Typography variant="caption" display="block">
                        {site.type} - {site.units} units
                      </Typography>
                      {site.product && (
                        <Typography variant="caption" display="block">
                          {site.product}
                        </Typography>
                      )}
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    size="small"
                    onClick={() => handleDeleteSite(site.id)}
                  >
                    <Delete />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
            
            {sites.length === 0 && (
              <ListItem>
                <ListItemText
                  primary="No sites marked"
                  secondary="Click on the map to add injection sites"
                />
              </ListItem>
            )}
          </List>
        </Paper>
      </Box>

      {/* Edit Site Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>
          {selectedSite && sites.find(s => s.id === selectedSite.id) ? 'Edit' : 'Add'} Injection Site
          {selectedSite && (
            <Typography variant="body2" color="text.secondary">
              {selectedSite.area}
            </Typography>
          )}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              select
              fullWidth
              label="Type"
              value={siteForm.type}
              onChange={(e) => setSiteForm({ ...siteForm, type: e.target.value as InjectionSite['type'] })}
              sx={{ mb: 2 }}
            >
              <MenuItem value="botox">Botox</MenuItem>
              <MenuItem value="filler">Filler</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </TextField>
            
            <TextField
              select
              fullWidth
              label="Product"
              value={siteForm.product}
              onChange={(e) => setSiteForm({ ...siteForm, product: e.target.value })}
              sx={{ mb: 2 }}
            >
              {products[siteForm.type].map(product => (
                <MenuItem key={product} value={product}>{product}</MenuItem>
              ))}
            </TextField>
            
            <TextField
              fullWidth
              type="number"
              label="Units"
              value={siteForm.units}
              onChange={(e) => setSiteForm({ ...siteForm, units: parseInt(e.target.value) || 0 })}
              inputProps={{ min: 0, step: 0.5 }}
              sx={{ mb: 2 }}
            />
            
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Notes"
              value={siteForm.notes}
              onChange={(e) => setSiteForm({ ...siteForm, notes: e.target.value })}
              placeholder="Additional notes..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveSite} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default DermatologyBodyMap;