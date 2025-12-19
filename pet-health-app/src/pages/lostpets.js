import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { 
  Box, Container, Grid, Typography, Button, Paper, Avatar, Chip, IconButton, 
  TextField, FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel,
  Slider, Dialog, DialogContent, Stepper, Step, StepLabel, Tooltip, Badge, Collapse,
  Alert, LinearProgress, Fade, Zoom, Grow, Snackbar, Divider, InputAdornment
} from '@mui/material';
import { createTheme, ThemeProvider, keyframes } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PetsIcon from '@mui/icons-material/Pets';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import InfoIcon from '@mui/icons-material/Info';
import VisibilityIcon from '@mui/icons-material/Visibility';
import TuneIcon from '@mui/icons-material/Tune';
import CloseIcon from '@mui/icons-material/Close';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

// Import PageHeader
import PageHeader from './PageHeader';
import DashboardSidebar from '../components/DashboardSidebar';

// Keyframe Animations
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const scaleIn = keyframes`
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
`;

const shimmer = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const slideIn = keyframes`
  from { transform: translateX(-100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const heartbeat = keyframes`
  0%, 100% { transform: scale(1); }
  10%, 30% { transform: scale(0.9); }
  20%, 40% { transform: scale(1.1); }
`;

const theme = createTheme({
  palette: {
    primary: { main: '#00695c', light: '#439889', dark: '#004d40' },
    secondary: { main: '#FFA726', light: '#FFB74D', dark: '#F57C00' },
    error: { main: '#D32F2F' },
    success: { main: '#388E3C' },
    warning: { main: '#F57C00' },
    info: { main: '#0288D1' },
    background: { default: '#f8f9fa', paper: '#ffffff' }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    button: { textTransform: 'none', fontWeight: 600 },
    h3: { fontWeight: 800, letterSpacing: '-0.5px' },
    h4: { fontWeight: 700, letterSpacing: '-0.3px' },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 }
  },
  shape: { borderRadius: 16 },
  shadows: [
    'none',
    '0px 2px 4px rgba(0,0,0,0.05)',
    '0px 4px 8px rgba(0,0,0,0.08)',
    '0px 8px 16px rgba(0,0,0,0.1)',
    '0px 12px 24px rgba(0,0,0,0.12)',
    '0px 16px 32px rgba(0,0,0,0.14)',
    '0px 20px 40px rgba(0,0,0,0.16)',
    '0px 24px 48px rgba(0,0,0,0.18)',
    '0px 28px 56px rgba(0,0,0,0.2)',
  ]
});

// --- MOCK DATA (Χαμένα Ζώα) ---
const LOST_PETS = [
  { id: 1, name: 'Μίκυ', type: 'Σκύλος', breed: 'Labrador', gender: 'Αρσενικό', age: '2 ετών', color: 'Μπεζ', date: '20 Οκτ 2025', location: 'Κυψέλη, Αθήνα', img: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=400&q=80', reward: '50€', views: 245, urgent: true, description: 'Φιλικός σκύλος με καφέ κολάρο. Πολύ ευαίσθητος στους ξένους.' },
  { id: 2, name: 'Λούνα', type: 'Γάτα', breed: 'Άγνωστη', gender: 'Θηλυκό', age: '1 έτους', color: 'Μαύρο/Άσπρο', date: '18 Οκτ 2025', location: 'Περιστέρι', img: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80', reward: null, views: 178, urgent: false, description: 'Γάτα με διακριτική μαύρη κηλίδα στη μύτη.' },
  { id: 3, name: 'Ρόκυ', type: 'Σκύλος', breed: 'Terrier', gender: 'Αρσενικό', age: '4 ετών', color: 'Καφέ', date: '15 Οκτ 2025', location: 'Χαλάνδρι', img: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=400&q=80', reward: '100€', views: 392, urgent: true, description: 'Φοράει κίτρινο κολάρο με tag. Πολύ φιλικός.' },
  { id: 4, name: 'Μάγια', type: 'Γάτα', breed: 'Siamese', gender: 'Θηλυκό', age: '3 ετών', color: 'Μπεζ', date: '12 Οκτ 2025', location: 'Νέα Σμύρνη', img: 'https://images.unsplash.com/photo-1513245543132-31f507417b26?auto=format&fit=crop&w=400&q=80', reward: null, views: 156, urgent: false, description: 'Γάτα με μπλε μάτια και ιδιαίτερη φωνή.' },
];

const STEPS = [
  { label: 'Στοιχεία Ζώου', icon: <PetsIcon />, description: 'Βασικές πληροφορίες' },
  { label: 'Φωτογραφίες', icon: <PhotoCameraIcon />, description: 'Προσθέστε εικόνες' },
  { label: 'Λεπτομέρειες', icon: <InfoIcon />, description: 'Περιγραφή & τοποθεσία' },
  { label: 'Επικοινωνία', icon: <NotificationsActiveIcon />, description: 'Στοιχεία επικοινωνίας' }
];

// Stable top-level components (avoid remount on each parent render)
function LostPetsSearchView({
  filteredPets,
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  urgentOnly,
  setUrgentOnly,
  filtersOpen,
  setFiltersOpen,
  selectedType,
  setSelectedType,
  selectedLocation,
  setSelectedLocation,
  radius,
  setRadius,
  setSelectedPet,
  setDetailsDialogOpen,
  setView,
  stopKeyPropagation,
}) {
  return (
    <Box
      onKeyDown={stopKeyPropagation}
      onKeyDownCapture={stopKeyPropagation}
      onKeyUp={stopKeyPropagation}
      onKeyUpCapture={stopKeyPropagation}
      onKeyPress={stopKeyPropagation}
      onKeyPressCapture={stopKeyPropagation}
    >
      {/* ANIMATED HERO SECTION */}
      <Fade in timeout={800}>
        <Box sx={{ 
          height: { xs: '400px', md: '450px' }, 
          position: 'relative', 
          mb: 6, 
          borderRadius: '0 0 60px 60px',
          backgroundImage: 'url(https://images.unsplash.com/photo-1450778869180-41d0601e046e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80)',
          backgroundSize: 'cover', 
          backgroundPosition: 'center',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          <Box sx={{ 
            position: 'absolute', 
            inset: 0, 
            background: 'linear-gradient(135deg, rgba(0,105,92,0.85) 0%, rgba(38,50,56,0.9) 100%)',
            borderRadius: '0 0 60px 60px'
          }} />
          <Box sx={{ position: 'relative', zIndex: 2, textAlign: 'center', px: 2 }}>
            <PetsIcon sx={{ fontSize: 80, color: '#FFA726', mb: 2 }} />
            <Typography variant="h3" sx={{ 
              color: 'white', 
              fontWeight: 900, 
              mb: 2,
              textShadow: '0 4px 12px rgba(0,0,0,0.3)',
              fontSize: { xs: '2rem', md: '3rem' }
            }}>
              Αναζήτηση Χαμένου Κατοικιδίου
            </Typography>
            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)', mb: 4, fontWeight: 400 }}>
              Βοηθήστε να βρουν τον δρόμο τους σπίτι
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button 
                variant="contained" 
                color="secondary" 
                size="large" 
                startIcon={<NotificationsActiveIcon />}
                onClick={() => setView('form')}
                sx={{ 
                  fontWeight: 700, 
                  px: 5, 
                  py: 1.8, 
                  borderRadius: '50px',
                  fontSize: '1.1rem',
                  boxShadow: '0 8px 24px rgba(255,167,38,0.4)',
                  transition: 'all 0.3s ease',
                  '&:hover': { 
                    transform: 'translateY(-3px)', 
                    boxShadow: '0 12px 32px rgba(255,167,38,0.5)' 
                  }
                }}
              >
                Δήλωση Απώλειας
              </Button>
            </Box>
          </Box>
        </Box>
      </Fade>
      <Container maxWidth="xl">
        <Zoom in timeout={1000}>
          <Paper sx={{ 
            p: 3, 
            mb: 4, 
            borderRadius: 4,
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)'
          }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                    <PetsIcon fontSize="large" />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" fontWeight="bold" color="primary">{filteredPets.length}</Typography>
                    <Typography variant="body2" color="text.secondary">Ενεργές Αγγελίες</Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Zoom>
        <Paper sx={{ p: 3, mb: 4, borderRadius: 4, boxShadow: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={5}>
              <TextField 
                fullWidth 
                placeholder="Αναζήτηση ονόματος, ράτσας, περιοχής..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>,
                  endAdornment: searchQuery && (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setSearchQuery('')}>
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <Select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  displayEmpty
                >
                  <MenuItem value="date">Πιο Πρόσφατα</MenuItem>
                  <MenuItem value="views">Περισσότερες Προβολές</MenuItem>
                  <MenuItem value="reward">Μεγαλύτερη Αμοιβή</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button 
                fullWidth
                variant={urgentOnly ? "contained" : "outlined"}
                color="error"
                startIcon={<WarningIcon />}
                onClick={() => setUrgentOnly(!urgentOnly)}
              >
                Επείγον
              </Button>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button 
                fullWidth
                variant={filtersOpen ? "contained" : "outlined"}
                startIcon={<TuneIcon />}
                onClick={() => setFiltersOpen(!filtersOpen)}
              >
                Φίλτρα
              </Button>
            </Grid>
          </Grid>
          <Collapse in={filtersOpen}>
            <Divider sx={{ my: 3 }} />
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Είδος Ζώου</InputLabel>
                  <Select 
                    label="Είδος Ζώου"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                  >
                    <MenuItem value="">Όλα</MenuItem>
                    <MenuItem value="Σκύλος">Σκύλος</MenuItem>
                    <MenuItem value="Γάτα">Γάτα</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField 
                  fullWidth 
                  label="Περιοχή" 
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton size="small">
                          <MyLocationIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography gutterBottom variant="body2" fontWeight={600}>
                  Ακτίνα: {radius} km
                </Typography>
                <Slider 
                  value={radius} 
                  onChange={(e, val) => setRadius(val)}
                  valueLabelDisplay="auto" 
                  step={5} 
                  min={0} 
                  max={50}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControlLabel 
                  control={
                    <Checkbox 
                      checked={urgentOnly}
                      onChange={(e) => setUrgentOnly(e.target.checked)}
                      color="secondary"
                    />
                  } 
                  label="Μόνο Επείγοντα" 
                />
              </Grid>
            </Grid>
          </Collapse>
        </Paper>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            {filteredPets.length} {filteredPets.length === 1 ? 'Αγγελία' : 'Αγγελίες'} Βρέθηκαν
          </Typography>
        </Box>
        <Grid container spacing={3}>
          {filteredPets.length === 0 ? (
            <Grid item xs={12}>
              <Paper sx={{ p: 8, textAlign: 'center', borderRadius: 4 }}>
                <SearchIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
                <Typography variant="h5" color="text.secondary" gutterBottom>
                  Δεν βρέθηκαν αποτελέσματα
                </Typography>
              </Paper>
            </Grid>
          ) : (
            filteredPets.map((pet, index) => (
              <Grid item xs={12} sm={6} md={4} key={pet.id}>
                <Grow in timeout={300 + index * 100}>
                  <Paper 
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedPet(pet);
                      setDetailsDialogOpen(true);
                    }}
                    sx={{ borderRadius: 4, overflow: 'hidden', cursor: 'pointer', position: 'relative' }}
                  >
                    <Box sx={{ height: 240, position: 'relative', overflow: 'hidden', bgcolor: '#f0f0f0' }}>
                      <img src={pet.img} alt={pet.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </Box>
                    <Box sx={{ p: 2 }}>
                      <Typography variant="h6" fontWeight="bold">{pet.name}</Typography>
                      <Typography variant="body2" color="text.secondary">{pet.location}</Typography>
                    </Box>
                  </Paper>
                </Grow>
              </Grid>
            ))
          )}
        </Grid>
      </Container>
    </Box>
  );
}

function LostPetsFormView({
  activeStep,
  setActiveStep,
  setView,
  formData,
  setFormData,
  formErrors,
  uploadedImages,
  handleImageUpload,
  removeImage,
  handleNext,
}) {
  const progress = ((activeStep + 1) / STEPS.length) * 100;
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box>
        <Button startIcon={<ArrowBackIcon />} onClick={() => setView('search')} sx={{ mb: 3, fontWeight: 600 }}>
          Πίσω στην αναζήτηση
        </Button>
        <Paper sx={{ p: 2, mb: 3, borderRadius: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" fontWeight={600}>Πρόοδος Δήλωσης</Typography>
            <Typography variant="body2" color="primary" fontWeight={700}>{Math.round(progress)}%</Typography>
          </Box>
          <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4 }} />
        </Paper>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, borderRadius: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Typography variant="h5" fontWeight="bold">Δήλωση Απώλειας</Typography>
              </Box>
              <Stepper activeStep={activeStep} sx={{ mb: 5 }}>
                {STEPS.map((step, index) => (
                  <Step key={step.label}>
                    <StepLabel icon={<Avatar sx={{ width: 40, height: 40 }}>{activeStep > index ? <CheckCircleIcon /> : index + 1}</Avatar>}>
                      <Typography variant="caption" sx={{ display: { xs: 'none', sm: 'block' } }}>{step.label}</Typography>
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
              <Box sx={{ minHeight: '400px' }}>
                {activeStep === 0 && (
                  <Box>
                    <Alert severity="info" icon={<InfoIcon />} sx={{ mb: 3 }}>
                      Συμπληρώστε όσο το δυνατόν περισσότερες πληροφορίες για να βοηθήσετε στην αναζήτηση
                    </Alert>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <TextField fullWidth required label="Όνομα Ζώου" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} error={!!formErrors.name} helperText={formErrors.name} InputProps={{ startAdornment: <InputAdornment position="start"><PetsIcon /></InputAdornment> }} />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth required error={!!formErrors.type}>
                          <InputLabel>Είδος</InputLabel>
                          <Select label="Είδος" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                            <MenuItem value="">-- Επιλέξτε --</MenuItem>
                            <MenuItem value="Σκύλος">🐕 Σκύλος</MenuItem>
                            <MenuItem value="Γάτα">🐱 Γάτα</MenuItem>
                            <MenuItem value="Άλλο">🐾 Άλλο</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12}>
                        <TextField fullWidth label="Αριθμός Microchip (προαιρετικό)" value={formData.microchip || ''} onChange={(e) => setFormData({ ...formData, microchip: e.target.value })} helperText="Αν διαθέτει microchip, συμπληρώστε τον αριθμό" />
                      </Grid>
                    </Grid>
                  </Box>
                )}
                {activeStep === 1 && (
                  <Box>
                    <Alert severity="warning" icon={<PhotoCameraIcon />} sx={{ mb: 3 }} {...(formErrors.images && { severity: 'error' })}>
                      {formErrors.images || 'Προσθέστε τουλάχιστον μία καθαρή φωτογραφία του κατοικιδίου σας'}
                    </Alert>
                    <Paper sx={{ p: 4, textAlign: 'center', border: '3px dashed', borderColor: formErrors.images ? 'error.main' : 'primary.light', borderRadius: 4 }} component="label">
                      <input type="file" hidden accept="image/*" multiple onChange={handleImageUpload} />
                      <CloudUploadIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
                      <Typography variant="h6" fontWeight="bold" gutterBottom>Σύρετε φωτογραφίες εδώ</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>ή κλικ για επιλογή αρχείων</Typography>
                      <Chip label="JPG, PNG, έως 5MB" size="small" />
                    </Paper>
                    {uploadedImages.length > 0 && (
                      <Box sx={{ mt: 3 }}>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Φωτογραφίες ({uploadedImages.length})</Typography>
                        <Grid container spacing={2}>
                          {uploadedImages.map((img) => (
                            <Grid item xs={6} sm={4} key={img.id}>
                              <Paper sx={{ position: 'relative', borderRadius: 2, overflow: 'hidden' }}>
                                <img src={img.url} alt="Upload preview" style={{ width: '100%', height: 150, objectFit: 'cover' }} />
                                <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <IconButton onClick={() => removeImage(img.id)} sx={{ bgcolor: 'white' }}>
                                    <DeleteIcon />
                                  </IconButton>
                                </Box>
                              </Paper>
                            </Grid>
                          ))}
                        </Grid>
                      </Box>
                    )}
                  </Box>
                )}
                {activeStep === 2 && (
                  <Box>
                    <Alert severity="info" icon={<LocationOnIcon />} sx={{ mb: 3 }}>
                      Όσο πιο συγκεκριμένη είναι η τοποθεσία, τόσο μεγαλύτερες οι πιθανότητες επιτυχίας
                    </Alert>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={8}>
                        <TextField fullWidth required label="Περιοχή Απώλειας" value={formData.location || ''} onChange={(e) => setFormData({ ...formData, location: e.target.value })} error={!!formErrors.location} helperText={formErrors.location || 'π.χ. Κυψέλη, Αθήνα'} InputProps={{ startAdornment: <InputAdornment position="start"><LocationOnIcon /></InputAdornment> }} />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField fullWidth required type="date" label="Ημερομηνία Απώλειας" value={formData.date || ''} onChange={(e) => setFormData({ ...formData, date: e.target.value })} error={!!formErrors.date} helperText={formErrors.date} InputLabelProps={{ shrink: true }} InputProps={{ startAdornment: <InputAdornment position="start"><CalendarMonthIcon /></InputAdornment> }} />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField fullWidth multiline rows={5} label="Περιγραφή & Ιδιαίτερα Χαρακτηριστικά" value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Περιγράψτε τυχόν διακριτικά γνωρίσματα, συμπεριφορά, κολάρο, ταυτότητα κλπ." helperText={`${(formData.description || '').length}/500 χαρακτήρες`} inputProps={{ maxLength: 500 }} />
                      </Grid>
                    </Grid>
                  </Box>
                )}
                {activeStep === 3 && (
                  <Box>
                    <Alert severity="warning" icon={<InfoIcon />} sx={{ mb: 3 }}>
                      Τα στοιχεία επικοινωνίας θα είναι ορατά σε όλους τους χρήστες
                    </Alert>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <TextField fullWidth required label="Όνομα" value={formData.contactName || ''} onChange={(e) => setFormData({ ...formData, contactName: e.target.value })} />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField fullWidth required label="Τηλέφωνο" value={formData.phone || ''} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} error={!!formErrors.phone} helperText={formErrors.phone} placeholder="69XXXXXXXX" />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField fullWidth type="email" label="Email (προαιρετικό)" value={formData.email || ''} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 6 }}>
                <Button disabled={activeStep === 0} onClick={() => setActiveStep(prev => prev - 1)} startIcon={<ArrowBackIcon />} size="large" sx={{ px: 4, borderRadius: 3 }}>Προηγούμενο</Button>
                <Button variant="contained" size="large" color={activeStep === STEPS.length - 1 ? 'success' : 'primary'} onClick={handleNext} endIcon={activeStep === STEPS.length - 1 ? <CheckCircleIcon /> : <ArrowForwardIcon />} sx={{ px: 5, borderRadius: 3, fontWeight: 700 }}> {activeStep === STEPS.length - 1 ? 'Οριστική Υποβολή' : 'Επόμενο'} </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default function LostPets() {
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);
  const [view, setView] = useState('search'); // 'search' ή 'form'
  // Prevent key events inside this page from bubbling to app-level shortcuts
  const stopKeyPropagation = useCallback((e) => {
    // Only guard when typing inside inputs/textareas during the declaration form
    const target = e.target;
    const isEditable = (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable));
    if (view === 'form' && isEditable) {
      e.stopPropagation();
      if (e.nativeEvent && typeof e.nativeEvent.stopImmediatePropagation === 'function') {
        e.nativeEvent.stopImmediatePropagation();
      }
    }
  }, [view]);
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [radius, setRadius] = useState(10);
  const [rewardOnly, setRewardOnly] = useState(false);
  const [urgentOnly, setUrgentOnly] = useState(false);
  const [sortBy, setSortBy] = useState('date'); // 'date', 'views', 'reward'
  const [filtersOpen, setFiltersOpen] = useState(false);
  
  // Form State
  const [activeStep, setActiveStep] = useState(0);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '', type: '', breed: '', color: '', microchip: '', 
    location: '', date: '', description: '', contactName: '', 
    phone: '', email: '', hasReward: false, rewardAmount: ''
  });
  const [uploadedImages, setUploadedImages] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  // UI State
  const [selectedPet, setSelectedPet] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  
  // Filtered & Sorted Results
  const filteredPets = useMemo(() => {
    let results = [...LOST_PETS];
    
    // Search filter
    if (searchQuery) {
      results = results.filter(pet => 
        pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pet.breed.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pet.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Type filter
    if (selectedType) {
      results = results.filter(pet => pet.type === selectedType);
    }
    
    // Reward filter
    if (rewardOnly) {
      results = results.filter(pet => pet.reward);
    }
    
    // Urgent filter
    if (urgentOnly) {
      results = results.filter(pet => pet.urgent);
    }
    
    // Sort
    results.sort((a, b) => {
      if (sortBy === 'views') return b.views - a.views;
      if (sortBy === 'reward') {
        const aReward = a.reward ? parseInt(a.reward.replace('€', '')) : 0;
        const bReward = b.reward ? parseInt(b.reward.replace('€', '')) : 0;
        return bReward - aReward;
      }
      return new Date(b.date) - new Date(a.date); // Default: date
    });
    
    return results;
  }, [searchQuery, selectedType, rewardOnly, urgentOnly, sortBy]);
  
  // Restore scroll position when returning to search view
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || view !== 'search') return;
    
    const position = sessionStorage.getItem('lostPetsScroll');
    if (position) {
      requestAnimationFrame(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop = parseInt(position, 10);
        }
      });
    }
    
    // Throttled scroll position saver
    let scrollTimeout;
    const handleScroll = () => {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        sessionStorage.setItem('lostPetsScroll', container.scrollTop.toString());
      }, 150);
    };
    
    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      container.removeEventListener('scroll', handleScroll);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, [view]);
  
  // Form validation
  const validateStep = (step) => {
    const errors = {};
    if (step === 0) {
      if (!formData.name || !formData.name.trim()) errors.name = 'Το όνομα είναι υποχρεωτικό';
      if (!formData.type || !formData.type.trim()) errors.type = 'Επιλέξτε είδος';
    }
    if (step === 1 && uploadedImages.length === 0) {
      errors.images = 'Προσθέστε τουλάχιστον μία φωτογραφία';
    }
    if (step === 2) {
      if (!formData.location || !formData.location.trim()) errors.location = 'Η περιοχή είναι υποχρεωτική';
      if (!formData.date) errors.date = 'Η ημερομηνία είναι υποχρεωτική';
    }
    if (step === 3) {
      if (!formData.phone || !formData.phone.trim()) errors.phone = 'Το τηλέφωνο είναι υποχρεωτικό';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleNext = useCallback(() => {
    if (validateStep(activeStep)) {
      if (activeStep === STEPS.length - 1) {
        setOpenSuccess(true);
        // Reset form
        setTimeout(() => {
          setView('search');
          setActiveStep(0);
          setFormData({});
          setUploadedImages([]);
        }, 2000);
      } else {
        setActiveStep(prev => prev + 1);
      }
    } else {
      setSnackbar({ open: true, message: 'Παρακαλώ συμπληρώστε όλα τα υποχρεωτικά πεδία', severity: 'error' });
    }
  }, [activeStep, uploadedImages, formData]);
  
  const handleImageUpload = useCallback((event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map(file => ({
      id: Date.now() + Math.random(),
      url: URL.createObjectURL(file),
      file
    }));
    setUploadedImages(prev => [...prev, ...newImages]);
    setSnackbar({ open: true, message: `${files.length} φωτογραφία/ες προστέθηκαν`, severity: 'success' });
  }, []);
  
  const removeImage = useCallback((id) => {
    setUploadedImages(prev => prev.filter(img => img.id !== id));
  }, []);

  // --- SUB-COMPONENTS ---

  // 1. ENHANCED SEARCH VIEW (helper function, not component)
  const renderSearchView = () => (
    <Box
      onKeyDown={stopKeyPropagation}
      onKeyDownCapture={stopKeyPropagation}
      onKeyUp={stopKeyPropagation}
      onKeyUpCapture={stopKeyPropagation}
      onKeyPress={stopKeyPropagation}
      onKeyPressCapture={stopKeyPropagation}
    >
        {/* ANIMATED HERO SECTION */}
        <Fade in timeout={800}>
          <Box sx={{ 
              height: { xs: '400px', md: '450px' }, 
              position: 'relative', 
              mb: 6, 
              borderRadius: '0 0 60px 60px',
              backgroundImage: 'url(https://images.unsplash.com/photo-1450778869180-41d0601e046e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80)',
              backgroundSize: 'cover', 
              backgroundPosition: 'center',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              flexDirection: 'column',
              overflow: 'hidden'
          }}>
              <Box sx={{ 
                position: 'absolute', 
                inset: 0, 
                background: 'linear-gradient(135deg, rgba(0,105,92,0.85) 0%, rgba(38,50,56,0.9) 100%)',
                borderRadius: '0 0 60px 60px'
              }} />
              
              {/* Floating particles effect - static to prevent re-renders */}
              <Box sx={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
                <PetsIcon sx={{ position: 'absolute', left: '10%', top: '20%', opacity: 0.08, fontSize: 60, color: 'white' }} />
                <PetsIcon sx={{ position: 'absolute', left: '80%', top: '30%', opacity: 0.08, fontSize: 50, color: 'white' }} />
                <PetsIcon sx={{ position: 'absolute', left: '20%', top: '70%', opacity: 0.08, fontSize: 55, color: 'white' }} />
                <PetsIcon sx={{ position: 'absolute', left: '70%', top: '80%', opacity: 0.08, fontSize: 45, color: 'white' }} />
              </Box>
              
              <Box sx={{ position: 'relative', zIndex: 2, textAlign: 'center', px: 2 }}>
                <PetsIcon sx={{ fontSize: 80, color: '#FFA726', mb: 2 }} />
                <Typography variant="h3" sx={{ 
                  color: 'white', 
                  fontWeight: 900, 
                  mb: 2,
                  textShadow: '0 4px 12px rgba(0,0,0,0.3)',
                  fontSize: { xs: '2rem', md: '3rem' }
                }}>
                    Αναζήτηση Χαμένου Κατοικιδίου
                </Typography>
                <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)', mb: 4, fontWeight: 400 }}>
                    Βοηθήστε να βρουν τον δρόμο τους σπίτι
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Button 
                      variant="contained" 
                      color="secondary" 
                      size="large" 
                      startIcon={<NotificationsActiveIcon />}
                      onClick={() => setView('form')}
                      sx={{ 
                        fontWeight: 700, 
                        px: 5, 
                        py: 1.8, 
                        borderRadius: '50px',
                        fontSize: '1.1rem',
                        boxShadow: '0 8px 24px rgba(255,167,38,0.4)',
                        transition: 'all 0.3s ease',
                        '&:hover': { 
                          transform: 'translateY(-3px)', 
                          boxShadow: '0 12px 32px rgba(255,167,38,0.5)' 
                        }
                      }}
                  >
                      Δήλωση Απώλειας
                  </Button>
                  
                  <Button 
                      variant="outlined" 
                      size="large" 
                      startIcon={<InfoIcon />}
                      sx={{ 
                        fontWeight: 600, 
                        px: 4, 
                        py: 1.8, 
                        borderRadius: '50px',
                        borderColor: 'white',
                        color: 'white',
                        borderWidth: 2,
                        '&:hover': { 
                          borderWidth: 2,
                          bgcolor: 'rgba(255,255,255,0.1)',
                          borderColor: 'white' 
                        }
                      }}
                  >
                      Πώς Λειτουργεί
                  </Button>
                </Box>
              </Box>
          </Box>
        </Fade>

        <Container maxWidth="xl">
            {/* QUICK STATS BAR */}
            <Zoom in timeout={1000}>
              <Paper sx={{ 
                p: 3, 
                mb: 4, 
                borderRadius: 4,
                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.08)'
              }}>
                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={12} md={4}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                        <PetsIcon fontSize="large" />
                      </Avatar>
                      <Box>
                        <Typography variant="h4" fontWeight="bold" color="primary">{filteredPets.length}</Typography>
                        <Typography variant="body2" color="text.secondary">Ενεργές Αγγελίες</Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: 'success.main', width: 56, height: 56 }}>
                        <CheckCircleIcon fontSize="large" />
                      </Avatar>
                      <Box>
                        <Typography variant="h4" fontWeight="bold" color="success.main">47</Typography>
                        <Typography variant="body2" color="text.secondary">Επιτυχείς Επανενώσεις</Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: 'secondary.main', width: 56, height: 56 }}>
                        <VisibilityIcon fontSize="large" />
                      </Avatar>
                      <Box>
                        <Typography variant="h4" fontWeight="bold" color="secondary">2.5K</Typography>
                        <Typography variant="body2" color="text.secondary">Προβολές Σήμερα</Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Zoom>

            {/* SEARCH BAR & FILTERS */}
            <Paper sx={{ p: 3, mb: 4, borderRadius: 4, boxShadow: 3 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={5}>
                  <TextField 
                    fullWidth 
                    placeholder="Αναζήτηση ονόματος, ράτσας, περιοχής..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>,
                      endAdornment: searchQuery && (
                        <InputAdornment position="end">
                          <IconButton size="small" onClick={() => setSearchQuery('')}>
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                    sx={{ 
                      '& .MuiOutlinedInput-root': { 
                        borderRadius: 3,
                        bgcolor: 'background.paper'
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <Select 
                      value={sortBy} 
                      onChange={(e) => setSortBy(e.target.value)}
                      displayEmpty
                      sx={{ borderRadius: 3 }}
                    >
                      <MenuItem value="date">Πιο Πρόσφατα</MenuItem>
                      <MenuItem value="views">Περισσότερες Προβολές</MenuItem>
                      <MenuItem value="reward">Μεγαλύτερη Αμοιβή</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Button 
                    fullWidth
                    variant={urgentOnly ? "contained" : "outlined"}
                    color="error"
                    startIcon={<WarningIcon />}
                    onClick={() => setUrgentOnly(!urgentOnly)}
                    sx={{ borderRadius: 3, py: 1.8 }}
                  >
                    Επείγον
                  </Button>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Button 
                    fullWidth
                    variant={filtersOpen ? "contained" : "outlined"}
                    startIcon={<TuneIcon />}
                    onClick={() => setFiltersOpen(!filtersOpen)}
                    sx={{ borderRadius: 3, py: 1.8 }}
                  >
                    Φίλτρα
                  </Button>
                </Grid>
              </Grid>
              
              {/* EXPANDED FILTERS */}
              <Collapse in={filtersOpen}>
                <Divider sx={{ my: 3 }} />
                <Grid container spacing={3}>
                  <Grid item xs={12} md={3}>
                    <FormControl fullWidth>
                      <InputLabel>Είδος Ζώου</InputLabel>
                      <Select 
                        label="Είδος Ζώου"
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                      >
                        <MenuItem value="">Όλα</MenuItem>
                        <MenuItem value="Σκύλος">Σκύλος</MenuItem>
                        <MenuItem value="Γάτα">Γάτα</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField 
                      fullWidth 
                      label="Περιοχή" 
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton size="small">
                              <MyLocationIcon fontSize="small" />
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography gutterBottom variant="body2" fontWeight={600}>
                      Ακτίνα: {radius} km
                    </Typography>
                    <Slider 
                      value={radius} 
                      onChange={(e, val) => setRadius(val)}
                      valueLabelDisplay="auto" 
                      step={5} 
                      min={0} 
                      max={50}
                      marks={[
                        { value: 0, label: '0' },
                        { value: 25, label: '25' },
                        { value: 50, label: '50' }
                      ]}
                    />
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <FormControlLabel 
                      control={
                        <Checkbox 
                          checked={rewardOnly}
                          onChange={(e) => setRewardOnly(e.target.checked)}
                          color="secondary"
                        />
                      } 
                      label="Με Αμοιβή" 
                    />
                  </Grid>
                </Grid>
              </Collapse>
            </Paper>

            {/* RESULTS GRID */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                {filteredPets.length} {filteredPets.length === 1 ? 'Αγγελία' : 'Αγγελίες'} Βρέθηκαν
              </Typography>
              {searchQuery && (
                <Chip 
                  label={`Αναζήτηση: "${searchQuery}"`} 
                  onDelete={() => setSearchQuery('')}
                  color="primary"
                  variant="outlined"
                  sx={{ mr: 1 }}
                />
              )}
              {urgentOnly && (
                <Chip 
                  label="Μόνο Επείγοντα"
                  onDelete={() => setUrgentOnly(false)}
                  color="error"
                  variant="outlined"
                />
              )}
            </Box>

            <Grid container spacing={3}>
                {filteredPets.length === 0 ? (
                  <Grid item xs={12}>
                    <Paper sx={{ p: 8, textAlign: 'center', borderRadius: 4 }}>
                      <SearchIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
                      <Typography variant="h5" color="text.secondary" gutterBottom>
                        Δεν βρέθηκαν αποτελέσματα
                      </Typography>
                      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                        Δοκιμάστε να αλλάξετε τα φίλτρα αναζήτησής σας
                      </Typography>
                      <Button 
                        variant="outlined" 
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedType('');
                          setRewardOnly(false);
                          setUrgentOnly(false);
                        }}
                      >
                        Καθαρισμός Φίλτρων
                      </Button>
                    </Paper>
                  </Grid>
                ) : (
                  filteredPets.map((pet, index) => (
                    <Grid item xs={12} sm={6} md={4} key={pet.id}>
                      <Grow in timeout={300 + index * 100}>
                        <Paper 
                          onClick={(e) => {
                            e.preventDefault();
                            setSelectedPet(pet);
                            setDetailsDialogOpen(true);
                          }}
                          sx={{ 
                            borderRadius: 4, 
                            overflow: 'hidden', 
                            cursor: 'pointer',
                            position: 'relative',
                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                            boxShadow: 2,
                            '&:hover': {
                              transform: 'translateY(-12px) scale(1.02)',
                              boxShadow: 8,
                              '& .hover-bar': {
                                transform: 'scaleX(1)'
                              },
                              '& .pet-image': {
                                transform: 'scale(1.1)'
                              },
                              '& .hover-overlay': {
                                opacity: 1,
                                transform: 'translateY(0)'
                              }
                            },
                            '&::before': {
                              content: '""',
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              right: 0,
                              height: '4px',
                              background: pet.urgent 
                                ? 'linear-gradient(90deg, #D32F2F, #F57C00)'
                                : 'linear-gradient(90deg, #00695c, #439889)',
                              transform: 'scaleX(0)',
                              transition: 'transform 0.3s ease',
                              transformOrigin: 'left',
                              zIndex: 1
                            }
                          }}
                          className="pet-card"
                        >
                            <Box sx={{ 
                              height: 240, 
                              position: 'relative', 
                              overflow: 'hidden',
                              bgcolor: '#f0f0f0'
                            }}>
                                <img 
                                  src={pet.img} 
                                  alt={pet.name} 
                                  className="pet-image"
                                  style={{ 
                                    width: '100%', 
                                    height: '100%', 
                                    objectFit: 'cover',
                                    transition: 'transform 0.5s ease',
                                    transform: 'scale(1)'
                                  }} 
                                />
                                
                                {/* Badges */}
                                <Box sx={{ position: 'absolute', top: 12, left: 12, right: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    {pet.urgent && (
                                      <Chip 
                                        icon={<WarningIcon />}
                                        label="ΕΠΕΙΓΟΝ" 
                                        color="error" 
                                        size="small" 
                                        sx={{ fontWeight: 'bold' }}
                                      />
                                    )}
                                    {pet.reward && (
                                      <Chip 
                                        label={`Αμοιβή: ${pet.reward}`} 
                                        color="secondary" 
                                        size="small" 
                                        sx={{ fontWeight: 'bold', backdropFilter: 'blur(8px)' }} 
                                      />
                                    )}
                                  </Box>
                                  
                                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                                    <IconButton 
                                      size="small" 
                                      sx={{ 
                                        bgcolor: 'rgba(255,255,255,0.9)', 
                                        '&:hover': { bgcolor: 'white', color: 'error.main' },
                                        transition: 'all 0.3s'
                                      }}
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setSnackbar({ open: true, message: 'Προστέθηκε στα αγαπημένα!', severity: 'success' });
                                      }}
                                    >
                                      <FavoriteIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton 
                                      size="small" 
                                      sx={{ 
                                        bgcolor: 'rgba(255,255,255,0.9)', 
                                        '&:hover': { bgcolor: 'white' },
                                        transition: 'all 0.3s'
                                      }}
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setSnackbar({ open: true, message: 'Αντιγράφηκε στο clipboard!', severity: 'info' });
                                      }}
                                    >
                                      <ShareIcon fontSize="small" />
                                    </IconButton>
                                  </Box>
                                </Box>
                                
                                {/* Hover overlay */}
                                <Box 
                                  className="hover-overlay"
                                  sx={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)',
                                    p: 2,
                                    opacity: 0,
                                    transform: 'translateY(10px)',
                                    transition: 'all 0.3s ease'
                                  }}>
                                  <Typography variant="body2" sx={{ color: 'white', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <VisibilityIcon fontSize="small" /> {pet.views} προβολές
                                  </Typography>
                                </Box>
                            </Box>
                            
                            <Box sx={{ p: 2.5 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                  <Typography variant="h6" fontWeight="bold" sx={{ color: 'primary.main' }}>
                                    {pet.name}
                                  </Typography>
                                  <Chip 
                                    label={pet.type} 
                                    size="small" 
                                    variant="outlined"
                                    icon={<PetsIcon />}
                                  />
                                </Box>
                                
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                                  {pet.breed} • {pet.gender} • {pet.age}
                                </Typography>
                                
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5, color: 'text.secondary' }}>
                                  <LocationOnIcon fontSize="small" color="action" /> 
                                  <Typography variant="caption">{pet.location}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                                  <CalendarMonthIcon fontSize="small" color="action" /> 
                                  <Typography variant="caption">Χάθηκε: {pet.date}</Typography>
                                </Box>

                                <Divider sx={{ my: 2 }} />

                                <Button 
                                  variant="contained" 
                                  fullWidth 
                                  sx={{ 
                                    borderRadius: 3,
                                    fontWeight: 600,
                                    py: 1.2,
                                    background: 'linear-gradient(135deg, #00695c 0%, #004d40 100%)',
                                    boxShadow: 1,
                                    '&:hover': {
                                      background: 'linear-gradient(135deg, #004d40 0%, #00695c 100%)',
                                      boxShadow: 4
                                    }
                                  }}
                                  endIcon={<ArrowForwardIcon />}
                                >
                                    Περισσότερα
                                </Button>
                            </Box>
                        </Paper>
                      </Grow>
                    </Grid>
                ))
              )}
            </Grid>
        </Container>
    </Box>
  );

  // 2. ENHANCED FORM VIEW (Declaration - helper function, not component)
  const renderFormView = () => {
    const progress = ((activeStep + 1) / STEPS.length) * 100;
    
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
          <Fade in timeout={500}>
            <Box>
              <Button 
                startIcon={<ArrowBackIcon />} 
                onClick={() => setView('search')} 
                sx={{ 
                  mb: 3,
                  fontWeight: 600,
                  '&:hover': { transform: 'translateX(-4px)', transition: 'transform 0.2s' }
                }}
              >
                Πίσω στην αναζήτηση
              </Button>
              
              {/* Progress Bar */}
              <Paper sx={{ p: 2, mb: 3, borderRadius: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" fontWeight={600}>
                    Πρόοδος Δήλωσης
                  </Typography>
                  <Typography variant="body2" color="primary" fontWeight={700}>
                    {Math.round(progress)}%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={progress} 
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    bgcolor: 'grey.200',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 4,
                      background: 'linear-gradient(90deg, #00695c, #439889)'
                    }
                  }} 
                />
              </Paper>
              
              <Grid container spacing={3}>
                {/* Left: Form Content */}
                <Grid item xs={12} md={12}>
                  <Paper sx={{ p: 4, borderRadius: 4, boxShadow: 4 }}>
                      <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Avatar sx={{ 
                          width: 80, 
                          height: 80, 
                          mx: 'auto', 
                          mb: 2,
                          bgcolor: 'secondary.main',
                          animation: `${scaleIn} 0.5s ease-out`
                        }}>
                          {STEPS[activeStep].icon}
                        </Avatar>
                        <Typography variant="h4" fontWeight="bold" gutterBottom>
                          {STEPS[activeStep].label}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          {STEPS[activeStep].description}
                        </Typography>
                      </Box>

                      <Stepper activeStep={activeStep} sx={{ mb: 5 }}>
                          {STEPS.map((step, index) => (
                              <Step key={step.label}>
                                <StepLabel 
                                  icon={
                                    <Avatar sx={{ 
                                      width: 40, 
                                      height: 40,
                                      bgcolor: activeStep >= index ? 'primary.main' : 'grey.300',
                                      transition: 'all 0.3s ease'
                                    }}>
                                      {activeStep > index ? <CheckCircleIcon /> : index + 1}
                                    </Avatar>
                                  }
                                >
                                  <Typography variant="caption" sx={{ display: { xs: 'none', sm: 'block' } }}>
                                    {step.label}
                                  </Typography>
                                </StepLabel>
                              </Step>
                          ))}
                      </Stepper>

                      {/* Step Content */}
                      <Box sx={{ minHeight: '400px' }}>
                          {activeStep === 0 && (
                            <Fade in timeout={500}>
                              <Box>
                                <Alert severity="info" icon={<InfoIcon />} sx={{ mb: 3 }}>
                                  Συμπληρώστε όσο το δυνατόν περισσότερες πληροφορίες για να βοηθήσετε στην αναζήτηση
                                </Alert>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                      <TextField 
                                        fullWidth 
                                        required
                                        label="Όνομα Ζώου" 
                                        value={formData.name || ''}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        error={!!formErrors.name}
                                        helperText={formErrors.name}
                                        InputProps={{
                                          startAdornment: <InputAdornment position="start"><PetsIcon /></InputAdornment>
                                        }}
                                      />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <FormControl fullWidth required error={!!formErrors.type}>
                                          <InputLabel>Είδος</InputLabel>
                                          <Select 
                                            label="Είδος" 
                                            value={formData.type}
                                            onChange={(e) => setFormData({...formData, type: e.target.value})}
                                          >
                                              <MenuItem value="">-- Επιλέξτε --</MenuItem>
                                              <MenuItem value="Σκύλος">🐕 Σκύλος</MenuItem>
                                              <MenuItem value="Γάτα">🐱 Γάτα</MenuItem>
                                              <MenuItem value="Άλλο">🐾 Άλλο</MenuItem>
                                          </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                      <TextField 
                                        fullWidth 
                                        label="Ράτσα" 
                                        value={formData.breed || ''}
                                        onChange={(e) => setFormData({...formData, breed: e.target.value})}
                                        placeholder="π.χ. Labrador, Siamese"
                                      />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                      <TextField 
                                        fullWidth 
                                        label="Χρώμα" 
                                        value={formData.color || ''}
                                        onChange={(e) => setFormData({...formData, color: e.target.value})}
                                        placeholder="π.χ. Μαύρο, Καφέ"
                                      />
                                    </Grid>
                                    <Grid item xs={12}>
                                      <TextField 
                                        fullWidth 
                                        label="Αριθμός Microchip (προαιρετικό)" 
                                        value={formData.microchip || ''}
                                        onChange={(e) => setFormData({...formData, microchip: e.target.value})}
                                        helperText="Αν διαθέτει microchip, συμπληρώστε τον αριθμό"
                                      />
                                    </Grid>
                                </Grid>
                              </Box>
                            </Fade>
                          )}

                          {activeStep === 1 && (
                            <Fade in timeout={500}>
                              <Box>
                                <Alert severity="warning" icon={<PhotoCameraIcon />} sx={{ mb: 3 }} {...(formErrors.images && { severity: "error" })}>
                                  {formErrors.images || 'Προσθέστε τουλάχιστον μία καθαρή φωτογραφία του κατοικιδίου σας'}
                                </Alert>
                                
                                {/* Upload Area */}
                                <Paper 
                                  elevation={0}
                                  sx={{ 
                                    p: 6, 
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    minHeight: 300,
                                    border: '2px dashed',
                                    borderColor: formErrors.images ? 'error.main' : 'primary.light',
                                    borderRadius: 4,
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                      borderColor: 'primary.main',
                                      bgcolor: 'action.hover'
                                    }
                                  }}
                                  component="label"
                                >
                                    <input 
                                      type="file" 
                                      hidden 
                                      accept="image/*"
                                      multiple
                                      onChange={handleImageUpload}
                                    />
                                    <CloudUploadIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
                                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                                      Σύρετε φωτογραφίες εδώ
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                      ή κλικ για επιλογή αρχείων
                                    </Typography>
                                    <Chip label="JPG, PNG, έως 5MB" size="small" />
                                </Paper>
                                
                                {/* Uploaded Images Preview */}
                                {uploadedImages.length > 0 && (
                                  <Box sx={{ mt: 3 }}>
                                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                      Φωτογραφίες ({uploadedImages.length})
                                    </Typography>
                                    <Grid container spacing={2}>
                                      {uploadedImages.map((img) => (
                                        <Grid item xs={6} sm={4} key={img.id}>
                                          <Zoom in>
                                            <Paper sx={{ 
                                              position: 'relative', 
                                              borderRadius: 2, 
                                              overflow: 'hidden',
                                              '&:hover .delete-overlay': { opacity: 1 }
                                            }}>
                                              <img 
                                                src={img.url} 
                                                alt="Upload preview" 
                                                style={{ 
                                                  width: '100%', 
                                                  height: 150, 
                                                  objectFit: 'cover' 
                                                }} 
                                              />
                                              <Box 
                                                className="delete-overlay"
                                                sx={{
                                                  position: 'absolute',
                                                  inset: 0,
                                                  bgcolor: 'rgba(0,0,0,0.6)',
                                                  display: 'flex',
                                                  alignItems: 'center',
                                                  justifyContent: 'center',
                                                  opacity: 0,
                                                  transition: 'opacity 0.3s'
                                                }}
                                              >
                                                <IconButton 
                                                  onClick={() => removeImage(img.id)}
                                                  sx={{ 
                                                    bgcolor: 'white',
                                                    '&:hover': { bgcolor: 'error.main', color: 'white' }
                                                  }}
                                                >
                                                  <DeleteIcon />
                                                </IconButton>
                                              </Box>
                                            </Paper>
                                          </Zoom>
                                        </Grid>
                                      ))}
                                    </Grid>
                                  </Box>
                                )}
                              </Box>
                            </Fade>
                          )}

                          {activeStep === 2 && (
                            <Fade in timeout={500}>
                              <Box>
                                <Alert severity="info" icon={<LocationOnIcon />} sx={{ mb: 3 }}>
                                  Όσο πιο συγκεκριμένη είναι η τοποθεσία, τόσο μεγαλύτερες οι πιθανότητες επιτυχίας
                                </Alert>
                                <Grid container spacing={3}>
                                  <Grid item xs={12} sm={8}>
                                    <TextField 
                                      fullWidth 
                                      required
                                      label="Περιοχή Απώλειας" 
                                      value={formData.location || ''}
                                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                                      error={!!formErrors.location}
                                      helperText={formErrors.location || 'π.χ. Κυψέλη, Αθήνα'}
                                      InputProps={{
                                        startAdornment: <InputAdornment position="start"><LocationOnIcon /></InputAdornment>,
                                        endAdornment: (
                                          <InputAdornment position="end">
                                            <Tooltip title="Χρήση τρέχουσας τοποθεσίας">
                                              <IconButton size="small">
                                                <MyLocationIcon />
                                              </IconButton>
                                            </Tooltip>
                                          </InputAdornment>
                                        )
                                      }}
                                    />
                                  </Grid>
                                  <Grid item xs={12} sm={4}>
                                    <TextField 
                                      fullWidth 
                                      required
                                      type="date" 
                                      label="Ημερομηνία Απώλειας" 
                                      value={formData.date || ''}
                                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                                      error={!!formErrors.date}
                                      helperText={formErrors.date}
                                      InputLabelProps={{ shrink: true }}
                                      InputProps={{
                                        startAdornment: <InputAdornment position="start"><CalendarMonthIcon /></InputAdornment>
                                      }}
                                    />
                                  </Grid>
                                  <Grid item xs={12}>
                                    <TextField 
                                      fullWidth 
                                      multiline 
                                      rows={5} 
                                      label="Περιγραφή & Ιδιαίτερα Χαρακτηριστικά" 
                                      value={formData.description || ''}
                                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                                      placeholder="Περιγράψτε τυχόν διακριτικά γνωρίσματα, συμπεριφορά, κολάρο, ταυτότητα κλπ."
                                      helperText={`${(formData.description || '').length}/500 χαρακτήρες`}
                                      inputProps={{ maxLength: 500 }}
                                    />
                                  </Grid>
                                </Grid>
                              </Box>
                            </Fade>
                          )}

                          {activeStep === 3 && (
                            <Fade in timeout={500}>
                              <Box>
                                <Alert severity="warning" icon={<InfoIcon />} sx={{ mb: 3 }}>
                                  Τα στοιχεία επικοινωνίας θα είναι ορατά σε όλους τους χρήστες
                                </Alert>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                      <TextField 
                                        fullWidth 
                                        required
                                        label="Όνομα" 
                                        value={formData.contactName || ''}
                                        onChange={(e) => setFormData({...formData, contactName: e.target.value})}
                                      />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                      <TextField 
                                        fullWidth 
                                        required
                                        label="Τηλέφωνο" 
                                        value={formData.phone || ''}
                                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                        error={!!formErrors.phone}
                                        helperText={formErrors.phone}
                                        placeholder="69XXXXXXXX"
                                      />
                                    </Grid>
                                    <Grid item xs={12}>
                                      <TextField 
                                        fullWidth 
                                        type="email"
                                        label="Email (προαιρετικό)" 
                                        value={formData.email || ''}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                      />
                                    </Grid>
                                    <Grid item xs={12}>
                                      <Divider sx={{ my: 2 }} />
                                      <FormControlLabel 
                                        control={
                                          <Checkbox 
                                            checked={formData.hasReward || false}
                                            onChange={(e) => setFormData({...formData, hasReward: e.target.checked})}
                                            color="secondary"
                                          />
                                        } 
                                        label={
                                          <Typography variant="body1" fontWeight={600}>
                                            Προσφέρω αμοιβή εύρεσης
                                          </Typography>
                                        }
                                      />
                                      <Collapse in={formData.hasReward}>
                                        <TextField 
                                          fullWidth 
                                          label="Ποσό Αμοιβής (€)" 
                                          value={formData.rewardAmount || ''}
                                          onChange={(e) => setFormData({...formData, rewardAmount: e.target.value})}
                                          type="number"
                                          sx={{ mt: 2 }}
                                          InputProps={{
                                            endAdornment: <InputAdornment position="end">€</InputAdornment>
                                          }}
                                        />
                                      </Collapse>
                                    </Grid>
                                </Grid>
                                
                                {/* Summary Preview */}
                                <Paper sx={{ p: 3, mt: 4, bgcolor: 'success.50', border: '1px solid', borderColor: 'success.main' }}>
                                  <Typography variant="h6" fontWeight="bold" gutterBottom color="success.main">
                                    📋 Σύνοψη Δήλωσης
                                  </Typography>
                                  <Grid container spacing={1}>
                                    <Grid item xs={6}>
                                      <Typography variant="body2" color="text.secondary">Όνομα:</Typography>
                                      <Typography variant="body1" fontWeight={600}>{formData.name || '-'}</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                      <Typography variant="body2" color="text.secondary">Είδος:</Typography>
                                      <Typography variant="body1" fontWeight={600}>{formData.type || '-'}</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                      <Typography variant="body2" color="text.secondary">Περιοχή:</Typography>
                                      <Typography variant="body1" fontWeight={600}>{formData.location || '-'}</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                      <Typography variant="body2" color="text.secondary">Ημερομηνία:</Typography>
                                      <Typography variant="body1" fontWeight={600}>{formData.date || '-'}</Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                      <Typography variant="body2" color="text.secondary">Φωτογραφίες:</Typography>
                                      <Typography variant="body1" fontWeight={600}>{uploadedImages.length} εικόνα/ες</Typography>
                                    </Grid>
                                  </Grid>
                                </Paper>
                              </Box>
                            </Fade>
                          )}
                      </Box>

                      {/* Navigation Buttons */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 6 }}>
                          <Button 
                            disabled={activeStep === 0} 
                            onClick={() => setActiveStep(prev => prev - 1)}
                            startIcon={<ArrowBackIcon />}
                            size="large"
                            sx={{ px: 4, borderRadius: 3 }}
                          >
                            Προηγούμενο
                          </Button>
                          <Button 
                              variant="contained" 
                              size="large"
                              color={activeStep === STEPS.length - 1 ? "success" : "primary"}
                              onClick={handleNext}
                              endIcon={activeStep === STEPS.length - 1 ? <CheckCircleIcon /> : <ArrowForwardIcon />}
                              sx={{ 
                                px: 5, 
                                borderRadius: 3,
                                fontWeight: 700,
                                boxShadow: 4,
                                '&:hover': { transform: 'translateY(-2px)', boxShadow: 6 }
                              }}
                          >
                              {activeStep === STEPS.length - 1 ? 'Οριστική Υποβολή' : 'Επόμενο'}
                          </Button>
                      </Box>
                  </Paper>
                </Grid>
                
                {/* Right: Tips & Help */}
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 3, borderRadius: 4, bgcolor: 'info.50', border: '1px solid', borderColor: 'info.main', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <InfoIcon color="info" />
                      <Typography variant="h6" fontWeight="bold">Συμβουλές</Typography>
                    </Box>
                    <Typography variant="body2" paragraph>
                      ✓ Χρησιμοποιήστε πρόσφατες & καθαρές φωτογραφίες
                    </Typography>
                    <Typography variant="body2" paragraph>
                      ✓ Αναφέρετε διακριτικά γνωρίσματα (κολάρο, σημάδια)
                    </Typography>
                    <Typography variant="body2" paragraph>
                      ✓ Ενημερώστε άμεσα την τοπική αστυνομία
                    </Typography>
                    <Typography variant="body2">
                      ✓ Μοιραστείτε σε κοινωνικά δίκτυα
                    </Typography>
                  </Paper>
                  
                  <Paper sx={{ p: 3, borderRadius: 4, bgcolor: 'warning.50', border: '1px solid', borderColor: 'warning.main' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <NotificationsActiveIcon color="warning" />
                      <Typography variant="h6" fontWeight="bold">Άμεσες Ενέργειες</Typography>
                    </Box>
                    <Typography variant="body2" paragraph>
                      • Ελέγξτε καταφύγια ζώων
                    </Typography>
                    <Typography variant="body2" paragraph>
                      • Ενημερώστε κτηνιατρεία περιοχής
                    </Typography>
                    <Typography variant="body2">
                      • Τοιχοκολλήστε αφίσες στη γειτονιά
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          </Fade>
      </Container>
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: '100vh', bgcolor: '#fbfbfb', pb: 8, display: 'flex', flexDirection: 'column' }}>
        
        <Container maxWidth="xl" sx={{ pt: 2 }}>
            <PageHeader />
        </Container>

        <Box sx={{ display: 'flex', flex: 1, maxWidth: '100vw', overflow: 'hidden', p: 2, gap: 2 }}>
          <DashboardSidebar />
          
          <Box 
            ref={scrollContainerRef}
            sx={{ 
              flex: 1, 
              overflowY: 'auto',
              overflowX: 'hidden',
              WebkitOverflowScrolling: 'touch',
              willChange: 'transform'
            }}
            onKeyDown={stopKeyPropagation}
            onKeyDownCapture={stopKeyPropagation}
            onKeyUp={stopKeyPropagation}
            onKeyUpCapture={stopKeyPropagation}
            onKeyPress={stopKeyPropagation}
            onKeyPressCapture={stopKeyPropagation}
          >
            {/* View Switcher - call as functions to prevent unmount/remount */}
            {view === 'search' ? renderSearchView() : renderFormView()}

            {/* Success Dialog */}
            <Dialog 
              open={openSuccess} 
              onClose={() => { setOpenSuccess(false); setView('search'); setActiveStep(0); }}
              PaperProps={{ 
                sx: { 
                  borderRadius: 6, 
                  p: 5, 
                  textAlign: 'center',
                  maxWidth: 500,
                  animation: `${scaleIn} 0.5s ease-out`
                } 
              }}
            >
                <DialogContent>
                    <Box sx={{ 
                      width: 100, 
                      height: 100, 
                      borderRadius: '50%', 
                      bgcolor: 'success.light',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 3,
                      animation: `${scaleIn} 0.6s ease-out`
                    }}>
                      <CheckCircleIcon sx={{ fontSize: 60, color: 'success.main' }} />
                    </Box>
                    <Typography variant="h4" fontWeight="bold" gutterBottom color="success.main">
                      Επιτυχία!
                    </Typography>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      Η δήλωση απώλειας καταχωρήθηκε
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                      Η αγγελία σας είναι πλέον ενεργή και ορατή στην κοινότητα. Θα λάβετε ειδοποιήσεις για τυχόν ενημερώσεις.
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Button 
                        variant="outlined" 
                        fullWidth 
                        onClick={() => { setOpenSuccess(false); setView('search'); setActiveStep(0); }}
                        sx={{ borderRadius: 3, py: 1.5 }}
                      >
                        Επιστροφή
                      </Button>
                      <Button 
                        variant="contained" 
                        fullWidth
                        color="success"
                        onClick={() => { setOpenSuccess(false); setView('search'); setActiveStep(0); }}
                        sx={{ borderRadius: 3, py: 1.5 }}
                      >
                        Προβολή Αγγελίας
                      </Button>
                    </Box>
                </DialogContent>
            </Dialog>
            
            {/* Pet Details Dialog */}
            <Dialog 
              open={detailsDialogOpen} 
              onClose={() => setDetailsDialogOpen(false)}
              maxWidth="md"
              fullWidth
              PaperProps={{ 
                sx: { 
                  borderRadius: 4,
                  animation: `${scaleIn} 0.4s ease-out`
                } 
              }}
            >
              {selectedPet && (
                <Box>
                  {/* Header Image */}
                  <Box sx={{ 
                    height: 300, 
                    position: 'relative',
                    backgroundImage: `url(${selectedPet.img})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}>
                    <Box sx={{ 
                      position: 'absolute', 
                      inset: 0, 
                      background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.8) 100%)' 
                    }} />
                    
                    <IconButton 
                      onClick={() => setDetailsDialogOpen(false)}
                      sx={{ 
                        position: 'absolute', 
                        top: 16, 
                        right: 16,
                        bgcolor: 'rgba(255,255,255,0.9)',
                        '&:hover': { bgcolor: 'white' }
                      }}
                    >
                      <CloseIcon />
                    </IconButton>
                    
                    <Box sx={{ position: 'absolute', bottom: 20, left: 20, right: 20 }}>
                      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                        {selectedPet.urgent && (
                          <Chip 
                            icon={<WarningIcon />}
                            label="ΕΠΕΙΓΟΝ" 
                            color="error" 
                            sx={{ fontWeight: 'bold' }}
                          />
                        )}
                        {selectedPet.reward && (
                          <Chip 
                            label={`Αμοιβή: ${selectedPet.reward}`} 
                            color="secondary" 
                            sx={{ fontWeight: 'bold' }} 
                          />
                        )}
                      </Box>
                      <Typography variant="h3" fontWeight="bold" sx={{ color: 'white', textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
                        {selectedPet.name}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <DialogContent sx={{ p: 4 }}>
                    <Grid container spacing={4}>
                      <Grid item xs={12} md={7}>
                        <Typography variant="h5" fontWeight="bold" gutterBottom>
                          Πληροφορίες
                        </Typography>
                        
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                          <Chip label={`${selectedPet.type}`} icon={<PetsIcon />} />
                          <Chip label={selectedPet.breed} variant="outlined" />
                          <Chip label={selectedPet.gender} variant="outlined" />
                          <Chip label={selectedPet.age} variant="outlined" />
                          <Chip label={selectedPet.color} color="primary" variant="outlined" />
                        </Box>
                        
                        <Typography variant="body1" paragraph>
                          {selectedPet.description}
                        </Typography>
                        
                        <Divider sx={{ my: 3 }} />
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          <LocationOnIcon color="error" />
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Τελευταία Θέση
                            </Typography>
                            <Typography variant="body1" fontWeight={600}>
                              {selectedPet.location}
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          <CalendarMonthIcon color="action" />
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Ημερομηνία Απώλειας
                            </Typography>
                            <Typography variant="body1" fontWeight={600}>
                              {selectedPet.date}
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <VisibilityIcon color="action" />
                          <Typography variant="body2" color="text.secondary">
                            {selectedPet.views} προβολές
                          </Typography>
                        </Box>
                      </Grid>
                      
                      <Grid item xs={12} md={5}>
                        <Paper sx={{ p: 3, borderRadius: 3, bgcolor: 'primary.50', border: '2px solid', borderColor: 'primary.main' }}>
                          <Typography variant="h6" fontWeight="bold" gutterBottom>
                            Επικοινωνία
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            Αν έχετε πληροφορίες, επικοινωνήστε άμεσα
                          </Typography>
                          
                          <Button 
                            variant="contained" 
                            fullWidth 
                            size="large"
                            startIcon={<PetsIcon />}
                            sx={{ 
                              mb: 2,
                              borderRadius: 3,
                              py: 1.5,
                              fontWeight: 700,
                              background: 'linear-gradient(135deg, #00695c 0%, #004d40 100%)'
                            }}
                          >
                            Κάλεσε Τώρα
                          </Button>
                          
                          <Button 
                            variant="outlined" 
                            fullWidth 
                            size="large"
                            startIcon={<ShareIcon />}
                            sx={{ mb: 2, borderRadius: 3, py: 1.5 }}
                          >
                            Κοινοποίηση
                          </Button>
                          
                          <Button 
                            variant="outlined" 
                            fullWidth 
                            startIcon={<FavoriteIcon />}
                            sx={{ borderRadius: 3 }}
                          >
                            Αποθήκευση
                          </Button>
                          
                          <Alert severity="info" sx={{ mt: 3 }}>
                            Ο αριθμός εμφανίζεται μετά το κλικ
                          </Alert>
                        </Paper>
                      </Grid>
                    </Grid>
                  </DialogContent>
                </Box>
              )}
            </Dialog>
            
            {/* Snackbar Notifications */}
            <Snackbar 
              open={snackbar.open} 
              autoHideDuration={4000} 
              onClose={() => setSnackbar({...snackbar, open: false})}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
              <Alert 
                onClose={() => setSnackbar({...snackbar, open: false})} 
                severity={snackbar.severity}
                sx={{ 
                  borderRadius: 3,
                  boxShadow: 4,
                  minWidth: 300
                }}
              >
                {snackbar.message}
              </Alert>
            </Snackbar>
          </Box>
        </Box>

      </Box>
    </ThemeProvider>
  );
}