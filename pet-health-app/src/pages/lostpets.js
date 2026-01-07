import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Box, Container, Grid, Typography, Button, Paper, Avatar, Chip, IconButton, 
  TextField, FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel,
  Slider, Dialog, DialogContent, Stepper, Step, StepLabel, Collapse,
  Alert, LinearProgress, Fade, Grow, Divider, InputAdornment, Zoom
} from '@mui/material';
import { createTheme, ThemeProvider, keyframes } from '@mui/material/styles';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { lostPetsAPI } from '../services/api';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PetsIcon from '@mui/icons-material/Pets';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import ShareIcon from '@mui/icons-material/Share';
import InfoIcon from '@mui/icons-material/Info';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import VisibilityIcon from '@mui/icons-material/Visibility';
import TuneIcon from '@mui/icons-material/Tune';
import CloseIcon from '@mui/icons-material/Close';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

// Import PageHeader & Sidebar (Αν δεν υπάρχουν αυτά τα αρχεία, θα πρέπει να αφαιρεθούν ή να γίνουν mock)
// import PageHeader from './PageHeader';
// import DashboardSidebar from '../components/DashboardSidebar';

// --- Placeholder Components αν λείπουν τα imports ---
const PageHeader = () => <Box sx={{ py: 2 }}><Typography variant="h4">Lost Pets Dashboard</Typography></Box>;
const DashboardSidebar = () => <Box sx={{ width: 280, display: { xs: 'none', lg: 'block' } }} />;

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

const heartbeat = keyframes`
  0%, 100% { transform: scale(1); }
  10%, 30% { transform: scale(0.9); }
  20%, 40% { transform: scale(1.1); }
`;

function buildOsmEmbedSrc(lat, lng) {
  //created a small bbox around the point for a nice zoom
  const d = 0.02; // ~2km
  const left = (lng - d).toFixed(6);
  const right = (lng + d).toFixed(6);
  const top = (lat + d).toFixed(6);
  const bottom = (lat - d).toFixed(6);
  return `https://www.openstreetmap.org/export/embed.html?bbox=${left}%2C${bottom}%2C${right}%2C${top}&layer=mapnik&marker=${lat}%2C${lng}`;
}

function SimpleMapEmbed({ value, onChange, onLocationChange }) {
  const [query, setQuery] = useState('');
  const lat = value?.lat ?? 37.9838; //athens default
  const lng = value?.lng ?? 23.7275;
  const src = buildOsmEmbedSrc(lat, lng);

  const searchPlace = async () => {
    if (!query.trim()) return;
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&accept-language=el&q=${encodeURIComponent(query)}`);
      const results = await res.json();
      if (results && results[0]) {
        const { lat, lon } = results[0];
        const coords = { lat: parseFloat(lat), lng: parseFloat(lon) };
        onChange?.(coords);
        onLocationChange?.(results[0].display_name || query);
      }
    } catch (e) {
      console.error('Geocoding failed', e);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
        <TextField 
          fullWidth 
          placeholder="Αναζήτηση περιοχής (π.χ. Κυψέλη, Αθήνα)"
          size="small"
          value={query}
          onChange={(e) => { 
            setQuery(e.target.value);
            onLocationChange?.(e.target.value);
          }}
          onKeyDown={(e) => { if (e.key === 'Enter') searchPlace(); }}
        />
        <Button variant="outlined" onClick={searchPlace}>Αναζήτηση</Button>
      </Box>
      <Box sx={{ height: 300, borderRadius: 2, overflow: 'hidden' }}>
        <iframe
          title="map-embed"
          src={src}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </Box>
      {value?.lat && value?.lng && (
        <Typography variant="caption" color="text.secondary">Συντεταγμένες: {value.lat.toFixed(5)}, {value.lng.toFixed(5)}</Typography>
      )}
    </Box>
  );
}

// Counter animation hook
const useCountUp = (end, duration = 2000, shouldStart = true) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (!shouldStart) return;
    
    let startTime;
    let animationFrame;
    
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      setCount(Math.floor(progress * end));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, shouldStart]);
  
  return count;
};

const theme = createTheme({
  palette: {
    primary: { main: '#00695c', light: '#439889', dark: '#004d40' },
    secondary: { main: '#FFA726', light: '#FFB74D', dark: '#F57C00' },
    error: { main: '#D32F2F' },
    success: { main: '#388E3C' },
    background: { default: '#f8f9fa', paper: '#ffffff' }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: { borderRadius: 16 }
});

// Stats Bar Component
const StatsBar = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);
  
  const activeAds = useCountUp(285, 2000, isVisible);
  const reunions = useCountUp(342, 2000, isVisible);
  const views = useCountUp(8700, 2000, isVisible);
  
  return (
    <Zoom in timeout={800}>
      <Paper sx={{ 
        p: 3, 
        mb: 4, 
        borderRadius: 4,
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
          animation: `${shimmer} 3s infinite`
        }
      }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, animation: `${fadeInUp} 0.6s ease-out` }}>
              <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56, animation: `${pulse} 2s infinite` }}>
                <PetsIcon fontSize="large" />
              </Avatar>
              <Box>
                <Typography variant="h4" fontWeight="bold" color="primary">{activeAds}</Typography>
                <Typography variant="body2" color="text.secondary">Ενεργές Αγγελίες</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, animation: `${fadeInUp} 0.6s ease-out 0.2s both` }}>
              <Avatar sx={{ bgcolor: 'success.main', width: 56, height: 56, animation: `${heartbeat} 1.5s infinite` }}>
                <CheckCircleIcon fontSize="large" />
              </Avatar>
              <Box>
                <Typography variant="h4" fontWeight="bold" color="success.main">{reunions}</Typography>
                <Typography variant="body2" color="text.secondary">Επιτυχείς Επανενώσεις</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, animation: `${fadeInUp} 0.6s ease-out 0.4s both` }}>
              <Avatar sx={{ bgcolor: 'secondary.main', width: 56, height: 56, animation: `${float} 3s ease-in-out infinite` }}>
                <VisibilityIcon fontSize="large" />
              </Avatar>
              <Box>
                <Typography variant="h4" fontWeight="bold" color="secondary">
                  {views >= 1000 ? `${(views / 1000).toFixed(1)}K` : views}
                </Typography>
                <Typography variant="body2" color="text.secondary">Προβολές Σήμερα</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Zoom>
  );
};

// --- MOCK DATA ---
const LOST_PETS = [
  { id: 1, name: 'Μίκυ', type: 'Σκύλος', breed: 'Labrador', gender: 'Αρσενικό', age: '2 ετών', color: 'Μπεζ', date: '20 Οκτ 2025', location: 'Κυψέλη, Αθήνα', img: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=400&q=80', reward: '50€', views: 245, urgent: true, description: 'Φιλικός σκύλος με καφέ κολάρο. Πολύ ευαίσθητος στους ξένους.' },
  { id: 2, name: 'Λούνα', type: 'Γάτα', breed: 'Άγνωστη', gender: 'Θηλυκό', age: '1 έτους', color: 'Μαύρο/Άσπρο', date: '18 Οκτ 2025', location: 'Περιστέρι', img: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80', reward: null, views: 178, urgent: false, description: 'Γάτα με διακριτική μαύρη κηλίδα στη μύτη.' },
  { id: 3, name: 'Ρόκυ', type: 'Σκύλος', breed: 'Terrier', gender: 'Αρσενικό', age: '4 ετών', color: 'Καφέ', date: '15 Οκτ 2025', location: 'Χαλάνδρι', img: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=400&q=80', reward: '100€', views: 392, urgent: true, description: 'Φοράει κίτρινο κολάρο με tag. Πολύ φιλικός.' },
  { id: 4, name: 'Μπέλλα', type: 'Σκύλος', breed: 'Golden Retriever', gender: 'Θηλυκό', age: '3 ετών', color: 'Χρυσό', date: '22 Οκτ 2025', location: 'Γλυφάδα', img: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?auto=format&fit=crop&w=400&q=80', reward: '80€', views: 312, urgent: true, description: 'Πολύ φιλική, φοράει ροζ κολάρο με όνομα.' },
  { id: 5, name: 'Τίγρης', type: 'Γάτα', breed: 'Ταμπί', gender: 'Αρσενικό', age: '2 ετών', color: 'Πορτοκαλί', date: '19 Οκτ 2025', location: 'Νέα Σμύρνη', img: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=400&q=80', reward: null, views: 156, urgent: false, description: 'Γάτα με πορτοκαλί ρίγες, πολύ φοβισμένη.' },
  { id: 6, name: 'Μάξ', type: 'Σκύλος', breed: 'Beagle', gender: 'Αρσενικό', age: '5 ετών', color: 'Τρίχρωμο', date: '21 Οκτ 2025', location: 'Μαρούσι', img: 'https://images.unsplash.com/photo-1505628346881-b72b27e84530?auto=format&fit=crop&w=400&q=80', reward: '60€', views: 289, urgent: false, description: 'Φοράει μπλε κολάρο, αποκρίνεται στο όνομά του.' },
  { id: 7, name: 'Μίσυ', type: 'Γάτα', breed: 'Περσική', gender: 'Θηλυκό', age: '4 ετών', color: 'Λευκό', date: '17 Οκτ 2025', location: 'Κολωνάκι', img: 'https://images.unsplash.com/photo-1529778873920-4da4926a72c2?auto=format&fit=crop&w=400&q=80', reward: '150€', views: 445, urgent: true, description: 'Λευκή περσική γάτα με μπλε μάτια.' },
  { id: 8, name: 'Τσάρλι', type: 'Σκύλος', breed: 'Poodle', gender: 'Αρσενικό', age: '1 έτους', color: 'Καφέ', date: '23 Οκτ 2025', location: 'Καλλιθέα', img: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=400&q=80', reward: '40€', views: 198, urgent: false, description: 'Μικρόσωμος σκύλος, πολύ παιχνιδιάρης.' },
  { id: 9, name: 'Σόφι', type: 'Γάτα', breed: 'Σιαμέζα', gender: 'Θηλυκό', age: '3 ετών', color: 'Κρεμ/Καφέ', date: '16 Οκτ 2025', location: 'Παγκράτι', img: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=400&q=80', reward: null, views: 223, urgent: false, description: 'Σιαμέζα με χαρακτηριστικά γαλάζια μάτια.' },
].map(p => ({ ...p, isMock: true }));

const STEPS = [
  { label: 'Στοιχεία Ζώου', icon: <PetsIcon />, description: 'Βασικές πληροφορίες' },
  { label: 'Φωτογραφίες', icon: <PhotoCameraIcon />, description: 'Προσθέστε εικόνες' },
  { label: 'Λεπτομέρειες', icon: <InfoIcon />, description: 'Περιγραφή & τοποθεσία' },
  { label: 'Επικοινωνία', icon: <NotificationsActiveIcon />, description: 'Στοιχεία επικοινωνίας' }
];

function LostPetsSearchView({
  filteredPets, searchQuery, setSearchQuery, sortBy, setSortBy,
  urgentOnly, setUrgentOnly, filtersOpen, setFiltersOpen,
  selectedType, setSelectedType, selectedLocation, setSelectedLocation,
  radius, setRadius, setSelectedPet, setDetailsDialogOpen, setView,
  stopKeyPropagation, setHowItWorksDialogOpen,
  selectedBreed, setSelectedBreed, selectedGender, setSelectedGender,
  selectedColor, setSelectedColor, hasReward, setHasReward,
}) {
  return (
    <Box onKeyDown={stopKeyPropagation} tabIndex={0} sx={{ outline: 'none' }}>
      {/* ANIMATED HERO SECTION */}
      <Fade in timeout={800}>
        <Box sx={{ 
          height: { xs: '300px', md: '400px' }, 
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
            position: 'absolute', inset: 0, 
            background: 'linear-gradient(135deg, rgba(0,105,92,0.85) 0%, rgba(38,50,56,0.9) 100%)',
            borderRadius: '0 0 60px 60px'
          }} />
          <Box sx={{ position: 'relative', zIndex: 2, textAlign: 'center', px: 2 }}>
            <PetsIcon sx={{ fontSize: 80, color: '#FFA726', mb: 2 }} />
            <Typography variant="h3" sx={{ color: 'white', fontWeight: 900, mb: 1, textShadow: '0 4px 12px rgba(0,0,0,0.3)', fontSize: { xs: '2rem', md: '3rem' } }}>
              Αναζήτηση Χαμένου Κατοικιδίου
            </Typography>
            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)', mb: 4, fontWeight: 400 }}>
              Βοηθήστε να βρουν τον δρόμο τους σπίτι
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button variant="contained" color="secondary" size="large" startIcon={<NotificationsActiveIcon />} onClick={() => setView('form')} sx={{ borderRadius: '50px', px: 4, py: 1.5 }}>
                Δήλωση Απώλειας
              </Button>
              <Button variant="outlined" size="large" startIcon={<InfoIcon />} onClick={() => setHowItWorksDialogOpen(true)} sx={{ borderRadius: '50px', px: 4, py: 1.5, color: 'white', borderColor: 'white', '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' } }}>
                Πώς Λειτουργεί
              </Button>
            </Box>
          </Box>
        </Box>
      </Fade>

      <Container maxWidth="xl">
        <StatsBar />
        {/* FILTERS */}
        <Paper sx={{ p: 3, mb: 4, borderRadius: 4, boxShadow: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={5}>
              <TextField 
                fullWidth placeholder="Αναζήτηση ονόματος, ράτσας, περιοχής..." 
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>,
                  endAdornment: searchQuery && (<InputAdornment position="end"><IconButton size="small" onClick={() => setSearchQuery('')}><CloseIcon fontSize="small" /></IconButton></InputAdornment>)
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} displayEmpty>
                  <MenuItem value="date">Πιο Πρόσφατα</MenuItem>
                  <MenuItem value="views">Περισσότερες Προβολές</MenuItem>
                  <MenuItem value="reward">Μεγαλύτερη Αμοιβή</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button fullWidth variant={urgentOnly ? "contained" : "outlined"} color="error" startIcon={<WarningIcon />} onClick={() => setUrgentOnly(!urgentOnly)}>Επείγον</Button>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button fullWidth variant={filtersOpen ? "contained" : "outlined"} startIcon={<TuneIcon />} onClick={() => setFiltersOpen(!filtersOpen)}>Φίλτρα</Button>
            </Grid>
          </Grid>
          <Collapse in={filtersOpen}>
            <Divider sx={{ my: 3 }} />
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Είδος Ζώου</InputLabel>
                  <Select label="Είδος Ζώου" value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                    <MenuItem value="">Όλα</MenuItem>
                    <MenuItem value="Σκύλος">Σκύλος</MenuItem>
                    <MenuItem value="Γάτα">Γάτα</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Ράτσα</InputLabel>
                  <Select label="Ράτσα" value={selectedBreed} onChange={(e) => setSelectedBreed(e.target.value)}>
                    <MenuItem value="">Όλες</MenuItem>
                    <MenuItem value="Labrador">Labrador</MenuItem>
                    <MenuItem value="Golden Retriever">Golden Retriever</MenuItem>
                    <MenuItem value="Terrier">Terrier</MenuItem>
                    <MenuItem value="Beagle">Beagle</MenuItem>
                    <MenuItem value="Poodle">Poodle</MenuItem>
                    <MenuItem value="Περσική">Περσική</MenuItem>
                    <MenuItem value="Σιαμέζα">Σιαμέζα</MenuItem>
                    <MenuItem value="Ταμπί">Ταμπί</MenuItem>
                    <MenuItem value="Άγνωστη">Άγνωστη</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Φύλο</InputLabel>
                  <Select label="Φύλο" value={selectedGender} onChange={(e) => setSelectedGender(e.target.value)}>
                    <MenuItem value="">Όλα</MenuItem>
                    <MenuItem value="Αρσενικό">Αρσενικό</MenuItem>
                    <MenuItem value="Θηλυκό">Θηλυκό</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField 
                  fullWidth 
                  label="Χρώμα" 
                  value={selectedColor} 
                  onChange={(e) => setSelectedColor(e.target.value)}
                  placeholder="π.χ. Μαύρο"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField fullWidth label="Περιοχή" value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)} InputProps={{ endAdornment: (<InputAdornment position="end"><IconButton size="small"><MyLocationIcon fontSize="small" /></IconButton></InputAdornment>) }} />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <FormControlLabel 
                  control={<Checkbox checked={hasReward} onChange={(e) => setHasReward(e.target.checked)} color="secondary" />} 
                  label="Μόνο με αμοιβή"
                  sx={{ mt: 1 }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography gutterBottom variant="body2" fontWeight={600}>Ακτίνα: {radius} km</Typography>
                <Slider value={radius} onChange={(e, val) => setRadius(val)} valueLabelDisplay="auto" step={5} min={0} max={50} />
              </Grid>
            </Grid>
          </Collapse>
        </Paper>

        <Typography variant="h5" fontWeight="bold" gutterBottom>{filteredPets.length} Αγγελίες Βρέθηκαν</Typography>
        
        <Grid container spacing={3}>
          {filteredPets.length === 0 ? (
            <Grid item xs={12}>
              <Paper sx={{ p: 8, textAlign: 'center', borderRadius: 4 }}>
                <SearchIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
                <Typography variant="h5" color="text.secondary">Δεν βρέθηκαν αποτελέσματα</Typography>
              </Paper>
            </Grid>
          ) : (
            filteredPets.map((pet, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={pet.id}>
                <Grow in timeout={300 + index * 50}>
                  <Paper 
                    onClick={() => { setSelectedPet(pet); setDetailsDialogOpen(true); }} 
                    sx={{ 
                      borderRadius: 5, 
                      overflow: 'visible', 
                      cursor: 'pointer', 
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                      border: '1px solid rgba(0,0,0,0.06)',
                      '&:hover': { 
                        transform: 'translateY(-12px)', 
                        boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
                        '& .pet-image': {
                          transform: 'scale(1.1)'
                        },
                        '& .pet-overlay': {
                          opacity: 1
                        }
                      },
                      '&:active': {
                        transform: 'translateY(-8px) scale(0.98)'
                      }
                    }}
                  >
                    <Box
                      sx={{
                        position: 'relative',
                        width: '100%',
                        aspectRatio: '3 / 2',
                        overflow: 'hidden',
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        backgroundColor: '#eee',
                      }}
                    >
                      {/* IMAGE */}
                      <Box
                        component="img"
                        src={pet.img}
                        alt={pet.name}
                        className="pet-image"
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block',
                          transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                      />

                      {/*hover overlay with info*/}
                      <Box
                        className="pet-overlay"
                        sx={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: '50%',
                          background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)',
                          opacity: 0,
                          transition: 'opacity 0.4s ease',
                          display: 'flex',
                          alignItems: 'flex-end',
                          padding: 2,
                          zIndex: 1
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <VisibilityIcon sx={{ fontSize: 16, color: 'white' }} />
                          <Typography variant="caption" sx={{ color: 'white', fontWeight: 600 }}>
                            {pet.views} προβολές
                          </Typography>
                        </Box>
                      </Box>

                      {/*ΕΠΕΙΓΟΝ*/}
                      {pet.urgent && (
                        <Chip
                          label="ΕΠΕΙΓΟΝ"
                          size="small"
                          icon={<WarningIcon sx={{ fontSize: 14, animation: `${pulse} 2s infinite` }} />}
                          sx={{
                            position: 'absolute',
                            top: 8,
                            left: 8,
                            zIndex: 2,
                            bgcolor: 'error.main',
                            color: '#fff',
                            fontWeight: 800,
                            fontSize: '0.7rem',
                            maxWidth: 'calc(100% - 16px)',
                            borderRadius: 2,
                            boxShadow: '0 2px 8px rgba(211, 47, 47, 0.4)',
                            '& .MuiChip-icon': {
                              color: '#fff',
                              ml: 0.5
                            }
                          }}
                        />
                      )}

                      {/*ΑΜΟΙΒΗ*/}
                      {pet.reward && (
                        <Chip
                          label={`💰 ${pet.reward}`}
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            zIndex: 2,
                            background: 'linear-gradient(135deg, #FFA726 0%, #F57C00 100%)',
                            color: '#fff',
                            fontWeight: 800,
                            fontSize: '0.75rem',
                            maxWidth: 'calc(100% - 16px)',
                            borderRadius: 2,
                            boxShadow: '0 2px 8px rgba(255, 167, 38, 0.4)'
                          }}
                        />
                      )}
                    </Box>
                    <Box sx={{ p: 2, bgcolor: 'white', borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}>
                      <Typography 
                        variant="h6" 
                        fontWeight="800" 
                        sx={{ 
                          mb: 0.5,
                          fontSize: '1rem',
                          color: '#1a1a1a',
                          letterSpacing: '-0.3px'
                        }}
                      >
                        {pet.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, transition: 'all 0.2s', '&:hover': { transform: 'translateX(2px)' } }}>
                        <PetsIcon sx={{ fontSize: 14, color: 'primary.main', transition: 'transform 0.2s' }} />
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: 'text.secondary',
                            fontWeight: 500,
                            fontSize: '0.8rem'
                          }}
                        >
                          {pet.breed}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocationOnIcon sx={{ fontSize: 14, color: 'secondary.main' }} />
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: 'text.secondary',
                            fontSize: '0.8rem'
                          }}
                        >
                          {pet.location}
                        </Typography>
                      </Box>
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
  activeStep, setActiveStep, setView, formData, setFormData,
  formErrors, setFormErrors, uploadedImages, setUploadedImages, handleImageUpload, removeImage, handleNext
}) {
  const progress = ((activeStep + 1) / STEPS.length) * 100;
  const [isDragging, setIsDragging] = useState(false);

  // Drag & Drop Handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      //create a simulated event for handleImageUpload
      handleImageUpload({ target: { files: e.dataTransfer.files } });
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => setView('search')} sx={{ mb: 3 }}>Πίσω στην αναζήτηση</Button>
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
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>Δήλωση Απώλειας</Typography>
            <Stepper activeStep={activeStep} sx={{ mb: 5 }}>
              {STEPS.map((step, index) => (
                <Step key={step.label}>
                  <StepLabel icon={<Avatar sx={{ width: 40, height: 40, bgcolor: activeStep >= index ? 'primary.main' : 'grey.300' }}>{activeStep > index ? <CheckCircleIcon /> : index + 1}</Avatar>}>
                    <Typography variant="caption" sx={{ display: { xs: 'none', sm: 'block' } }}>{step.label}</Typography>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>

            <Box sx={{ minHeight: '400px' }}>
                {activeStep === 0 && (
                  <Grid container spacing={3} alignItems="stretch">
                    <Grid item xs={12} md={6} sx={{ display: 'flex' }}>
                      <Paper sx={{ p: 3, borderRadius: 3, flex: 1, minHeight: 360 }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <TextField 
                              fullWidth 
                              required 
                              label="Όνομα Ζώου" 
                              value={formData.name || ''} 
                              onChange={(e) => { 
                                setFormData({ ...formData, name: e.target.value });
                                setFormErrors(prev => ({ ...prev, name: null }));
                              }} 
                              error={!!formErrors.name} 
                              helperText={formErrors.name} 
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <FormControl fullWidth required sx={{ minWidth: 200 }}>
                              <InputLabel id="type-label">Είδος</InputLabel>
                              <Select
                                labelId="type-label"
                                label="Είδος"
                                value={formData.type || ''}
                                onChange={(e) =>
                                  setFormData({ ...formData, type: e.target.value })
                                }
                              >
                                <MenuItem value="Σκύλος">🐕 Σκύλος</MenuItem>
                                <MenuItem value="Γάτα">🐱 Γάτα</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} md={6} sx={{ display: 'flex' }}>
                      <Paper sx={{ p: 3, borderRadius: 3, flex: 1, minHeight: 360 }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <TextField fullWidth label="Μικροτσίπ" value={formData.microchip || ''} onChange={(e) => setFormData({ ...formData, microchip: e.target.value })} />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField fullWidth label="Χρώμα" value={formData.color || ''} onChange={(e) => setFormData({ ...formData, color: e.target.value })} />
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grid>
                  </Grid>
                )}

              {activeStep === 1 && (
                <Grid container spacing={3} alignItems="stretch">
                  <Grid item xs={12} md={6} sx={{ display: 'flex' }}>
                    <Paper sx={{ p: 3, borderRadius: 3, minHeight: 360, flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <Alert severity="warning" icon={<PhotoCameraIcon />} sx={{ mb: 3 }} {...(formErrors.images && { severity: "error" })}>
                        {formErrors.images || 'Προσθέστε τουλάχιστον μία καθαρή φωτογραφία του κατοικιδίου σας'}
                      </Alert>
                      {/*upload area*/}
                      <Box 
                        component="label"
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        sx={{ 
                          p: 6,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          minHeight: 260,
                          border: '2px dashed',
                          borderColor: isDragging ? 'primary.main' : (formErrors.images ? 'error.main' : 'grey.300'),
                          bgcolor: isDragging ? 'action.hover' : '#fafafa',
                          borderRadius: 4, 
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            borderColor: 'primary.main',
                            bgcolor: 'grey.50',
                            transform: 'translateY(-2px)'
                          }
                        }}
                      >
                        <input type="file" hidden accept="image/*" multiple onChange={handleImageUpload} />
                        <Box sx={{ 
                          mb: 3,
                          p: 2,
                          borderRadius: '50%',
                          bgcolor: 'primary.50',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <CloudUploadIcon sx={{ 
                            fontSize: 64, 
                            color: 'primary.main',
                            transform: isDragging ? 'scale(1.1)' : 'scale(1)', 
                            transition: 'transform 0.2s' 
                          }} />
                        </Box>
                        <Typography variant="h6" fontWeight="bold" gutterBottom color="text.primary">
                          Σύρετε φωτογραφίες εδώ
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                          ή κάντε κλικ για επιλογή αρχείων
                        </Typography>
                        <Chip 
                          label="JPG, PNG • Έως 5MB" 
                          size="small" 
                          variant="outlined" 
                          sx={{ color: 'text.secondary', borderColor: 'grey.300' }} 
                        />
                      </Box>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={6} sx={{ display: 'flex' }}>
                    <Paper sx={{ p: 3, borderRadius: 3, minHeight: 360, flex: 1, display: 'flex', flexDirection: 'column' }}>
                      {/*προεπισκόπηση εικόνων*/}
                      {uploadedImages.length > 0 ? (
                        <Fade in>
                          <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                              <Typography variant="h6" fontWeight="bold">
                                Επιλεγμένες ({uploadedImages.length})
                              </Typography>
                              <Button size="small" color="error" onClick={() => setUploadedImages([])}>
                                Καθαρισμός
                              </Button>
                            </Box>
                            
                            <Grid container spacing={2}>
                              {uploadedImages.map((img) => (
                                <Grid item xs={6} sm={4} md={4} key={img.id}>
                                  <Paper sx={{ 
                                    position: 'relative', 
                                    borderRadius: 3, 
                                    overflow: 'hidden',
                                    height: 140,
                                    boxShadow: 2,
                                    transition: 'transform 0.2s',
                                    '&:hover': { transform: 'scale(1.02)' }
                                  }}>
                                    <img 
                                      src={img.url} 
                                      alt="preview" 
                                      style={{ 
                                        width: '100%', 
                                        height: '100%', 
                                        objectFit: 'cover',
                                      }} 
                                    />
                                    <IconButton 
                                      onClick={() => removeImage(img.id)} 
                                      size="small"
                                      sx={{ 
                                        position: 'absolute', 
                                        top: 6, 
                                        right: 6, 
                                        bgcolor: 'rgba(255,255,255,0.9)', 
                                        boxShadow: 1,
                                        '&:hover': { bgcolor: 'error.main', color: 'white' } 
                                      }}
                                    >
                                      <DeleteIcon fontSize="small" />
                                    </IconButton>
                                  </Paper>
                                </Grid>
                              ))}
                            </Grid>
                          </Box>
                        </Fade>
                      ) : (
                        <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'text.secondary' }}>
                          Δεν έχουν επιλεγεί εικόνες ακόμη.
                        </Box>
                      )}
                    </Paper>
                  </Grid>
                </Grid>
              )}

              {/*steps2 & 3simplified for brevity,similar structure ...*/}
              {activeStep === 2 && (
                <Grid container spacing={3} alignItems="stretch">
                  <Grid item xs={12} md={6} sx={{ display: 'flex' }}>
                    <Paper sx={{ p: 3, borderRadius: 3, minHeight: 360, flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <TextField 
                        fullWidth 
                        required 
                        label="Περιοχή" 
                        value={formData.location || ''} 
                        onChange={(e) => { 
                          setFormData({ ...formData, location: e.target.value });
                          setFormErrors(prev => ({ ...prev, location: null }));
                        }}
                        error={!!formErrors.location}
                        helperText={formErrors.location}
                      />
                      <Box sx={{ mt: 2 }}>
                        <SimpleMapEmbed
                          value={formData.coords}
                          onChange={(coords) => setFormData(prev => ({ ...prev, coords }))}
                          onLocationChange={(text) => setFormData(prev => ({ ...prev, location: text }))}
                        />
                      </Box>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={6} sx={{ display: 'flex' }}>
                    <Paper sx={{ p: 3, borderRadius: 3, minHeight: 360, flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <TextField 
                        fullWidth 
                        required 
                        multiline 
                        rows={10} 
                        label="Περιγραφή" 
                        value={formData.description || ''} 
                        onChange={(e) => { 
                          setFormData({ ...formData, description: e.target.value });
                          setFormErrors(prev => ({ ...prev, description: null }));
                        }}
                        error={!!formErrors.description}
                        helperText={formErrors.description}
                      />
                    </Paper>
                  </Grid>
                </Grid>
              )}
              {activeStep === 3 && (
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField 
                      fullWidth 
                      required 
                      label="Τηλέφωνο" 
                      placeholder="6912345678"
                      value={formData.phone || ''} 
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
                      error={formData.phone && !/^[0-9]{10}$/.test((formData.phone || '').replace(/[\s-]/g, ''))}
                      helperText={formData.phone && !/^[0-9]{10}$/.test((formData.phone || '').replace(/[\s-]/g, '')) ? 'Παρακαλώ εισάγετε έγκυρο τηλέφωνο (10 ψηφία)' : ''}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField 
                      fullWidth 
                      label="Εναλλακτικό Τηλέφωνο" 
                      placeholder="2101234567"
                      value={formData.altPhone || ''} 
                      onChange={(e) => setFormData({ ...formData, altPhone: e.target.value })} 
                      error={Boolean(formData.altPhone) && !/^[0-9]{10}$/.test((formData.altPhone || '').replace(/[\s-]/g, ''))}
                      helperText={Boolean(formData.altPhone) && !/^[0-9]{10}$/.test((formData.altPhone || '').replace(/[\s-]/g, '')) ? '10 ψηφία (ελληνικός αριθμός)' : ''}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField 
                      fullWidth 
                      label="Email" 
                      type="email"
                      placeholder="name@example.com"
                      value={formData.email || ''} 
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                      error={Boolean(formData.email) && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)}
                      helperText={Boolean(formData.email) && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) ? 'Παρακαλώ εισάγετε έγκυρο email' : ''}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Προτιμώμενος Τρόπος Επικοινωνίας</InputLabel>
                      <Select
                        label="Προτιμώμενος Τρόπος Επικοινωνίας"
                        value={formData.preferredContact || 'Τηλέφωνο'}
                        onChange={(e) => setFormData({ ...formData, preferredContact: e.target.value })}
                      >
                        <MenuItem value="Τηλέφωνο">Τηλέφωνο</MenuItem>
                        <MenuItem value="SMS">SMS</MenuItem>
                        <MenuItem value="Viber/WhatsApp">Viber/WhatsApp</MenuItem>
                        <MenuItem value="Email">Email</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField 
                      fullWidth 
                      label="Ώρες Επικοινωνίας" 
                      placeholder="π.χ. 09:00 - 21:00 ή Όλη μέρα"
                      value={formData.contactHours || ''} 
                      onChange={(e) => setFormData({ ...formData, contactHours: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField 
                      fullWidth 
                      label="Σύνδεσμος Επικοινωνίας (Facebook/Instagram)"
                      placeholder="https://instagram.com/yourprofile"
                      value={formData.socialLink || ''} 
                      onChange={(e) => setFormData({ ...formData, socialLink: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField 
                      fullWidth 
                      multiline rows={4}
                      label="Σημειώσεις για επικοινωνία (προαιρετικό)"
                      placeholder="π.χ. Αν δεν απαντήσω, στείλτε SMS ή μήνυμα στο Viber."
                      value={formData.contactNotes || ''} 
                      onChange={(e) => setFormData({ ...formData, contactNotes: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel 
                      control={<Checkbox checked={!!formData.showPhone} onChange={(e) => setFormData({ ...formData, showPhone: e.target.checked })} />} 
                      label="Εμφάνιση τηλεφώνου δημόσια στην αγγελία"
                    />
                  </Grid>
                </Grid>
              )}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 6 }}>
              <Button disabled={activeStep === 0} onClick={() => setActiveStep(prev => prev - 1)}>Προηγούμενο</Button>
              <Button variant="contained" onClick={handleNext}>{activeStep === STEPS.length - 1 ? 'Οριστική Υποβολή' : 'Επόμενο'}</Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default function LostPets() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [view, setView] = useState('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [radius, setRadius] = useState(10);
  const [urgentOnly, setUrgentOnly] = useState(false);
  const [sortBy, setSortBy] = useState('date');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedBreed, setSelectedBreed] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [hasReward, setHasReward] = useState(false);
  
  const [activeStep, setActiveStep] = useState(0);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [formData, setFormData] = useState({});
  const [uploadedImages, setUploadedImages] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [selectedPet, setSelectedPet] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [howItWorksDialogOpen, setHowItWorksDialogOpen] = useState(false);

  // Check URL parameter to show form view
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('view') === 'form') {
      setView('form');
    }
  }, [location]);

  //prevent key bubbling
  const stopKeyPropagation = useCallback((e) => {
    e.stopPropagation();
  }, []);

  const [userLostPets, setUserLostPets] = useState([]);

  useEffect(() => {
    const loadUserLostPets = async () => {
      try {
        const data = await lostPetsAPI.getAll();
        setUserLostPets(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
      }
    };
    loadUserLostPets();
  }, []);

  const allLostPets = useMemo(() => [...LOST_PETS, ...userLostPets], [userLostPets]);

  const filteredPets = useMemo(() => {
    let filtered = [...allLostPets];

    // Search query filter
    if (searchQuery) {
      filtered = filtered.filter(pet => 
        pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pet.breed.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pet.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Type filter
    if (selectedType) {
      filtered = filtered.filter(pet => pet.type === selectedType);
    }

    // Breed filter
    if (selectedBreed) {
      filtered = filtered.filter(pet => pet.breed === selectedBreed);
    }

    // Gender filter
    if (selectedGender) {
      filtered = filtered.filter(pet => pet.gender === selectedGender);
    }

    // Color filter
    if (selectedColor) {
      filtered = filtered.filter(pet => pet.color.toLowerCase().includes(selectedColor.toLowerCase()));
    }

    // Location filter
    if (selectedLocation) {
      filtered = filtered.filter(pet => 
        pet.location.toLowerCase().includes(selectedLocation.toLowerCase())
      );
    }

    // Urgent filter
    if (urgentOnly) {
      filtered = filtered.filter(pet => pet.urgent);
    }

    // Reward filter
    if (hasReward) {
      filtered = filtered.filter(pet => pet.reward);
    }

    // Sorting
    switch (sortBy) {
      case 'date':
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case 'views':
        filtered.sort((a, b) => b.views - a.views);
        break;
      case 'reward':
        filtered.sort((a, b) => {
          const rewardA = a.reward ? parseInt(a.reward.replace(/€|\s/g, '')) : 0;
          const rewardB = b.reward ? parseInt(b.reward.replace(/€|\s/g, '')) : 0;
          return rewardB - rewardA;
        });
        break;
      default:
        break;
    }

    return filtered;
  }, [allLostPets, searchQuery, selectedType, selectedBreed, selectedGender, selectedColor, selectedLocation, urgentOnly, hasReward, sortBy]);

  const handleNext = async () => {
    //basic validation logic
    if (activeStep === 0 && !formData.name) { setFormErrors({ name: 'Required' }); return; }
    if (activeStep === 1 && uploadedImages.length === 0) { setFormErrors({ images: 'Required' }); return; }
    if (activeStep === 2) {
      const locValid = Boolean((formData.location || '').trim());
      const descValid = Boolean((formData.description || '').trim());
      if (!locValid || !descValid) {
        setFormErrors(prev => ({
          ...prev,
          location: locValid ? null : 'Required',
          description: descValid ? null : 'Required'
        }));
        return;
      }
    }
    
    // Contact validation: require at least one valid contact method
    if (activeStep === 3) {
      const hasValidPhone = formData.phone && /^[0-9]{10}$/.test(String(formData.phone).replace(/[\s-]/g, ''));
      const emailValid = formData.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(formData.email));
      const prefersEmail = (formData.preferredContact || 'Τηλέφωνο') === 'Email';
      if (prefersEmail && !emailValid) {
        setFormErrors({ email: 'Invalid' });
        alert('Επιλέξατε Email ως τρόπο επικοινωνίας. Παρακαλώ εισάγετε έγκυρο email.');
        return;
      }
      if (!hasValidPhone && !emailValid) {
        alert('Παρακαλώ συμπληρώστε τουλάχιστον ένα έγκυρο μέσο επικοινωνίας (τηλέφωνο ή email).');
        return;
      }
    }

    if (activeStep === STEPS.length - 1) {
      // Persist to server and then show success
      const payload = {
        id: undefined,
        name: formData.name || 'Χωρίς όνομα',
        type: formData.type || 'Σκύλος',
        breed: formData.breed || 'Άγνωστη',
        gender: formData.gender || 'Άγνωστο',
        age: formData.age || '',
        color: formData.color || '',
        date: new Date().toLocaleDateString('el-GR', { day: '2-digit', month: 'short', year: 'numeric' }),
        location: formData.location || '',
        img: (uploadedImages[0] && uploadedImages[0].url) || 'https://via.placeholder.com/400',
        reward: formData.reward || null,
        views: 0,
        urgent: !!formData.urgent,
        description: formData.description || '',
        phone: formData.phone || '',
        altPhone: formData.altPhone || '',
        email: formData.email || '',
        preferredContact: formData.preferredContact || 'Τηλέφωνο',
        contactHours: formData.contactHours || '',
        socialLink: formData.socialLink || '',
        contactNotes: formData.contactNotes || '',
        showPhone: !!formData.showPhone,
        ownerId: user ? user.id : null,
        lat: formData.coords?.lat ?? null,
        lng: formData.coords?.lng ?? null,
      };
      try {
        const created = await lostPetsAPI.create(payload);
        setUserLostPets(prev => [created, ...prev]);
        setOpenSuccess(true);
      } catch (e) {
        console.error(e);
        alert('Αποτυχία καταχώρησης αγγελίας. Βεβαιώσου ότι τρέχει το json-server στο port 3001.');
      }
    } else {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map(file => ({
      id: Date.now() + Math.random(),
      url: URL.createObjectURL(file),
      file
    }));
    setUploadedImages(prev => [...prev, ...newImages]);
    setFormErrors({ ...formErrors, images: null });
  };

  const removeImage = (id) => {
    setUploadedImages(prev => prev.filter(img => img.id !== id));
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: '100vh', bgcolor: '#fbfbfb', pb: 8 }}>
        {/*<PageHeader /> */}
        {/*<DashboardSidebar /> */}
        
        {view === 'search' ? (
          <LostPetsSearchView
            filteredPets={filteredPets}
            searchQuery={searchQuery} setSearchQuery={setSearchQuery}
            sortBy={sortBy} setSortBy={setSortBy}
            urgentOnly={urgentOnly} setUrgentOnly={setUrgentOnly}
            filtersOpen={filtersOpen} setFiltersOpen={setFiltersOpen}
            selectedType={selectedType} setSelectedType={setSelectedType}
            selectedLocation={selectedLocation} setSelectedLocation={setSelectedLocation}
            radius={radius} setRadius={setRadius}
            selectedBreed={selectedBreed} setSelectedBreed={setSelectedBreed}
            selectedGender={selectedGender} setSelectedGender={setSelectedGender}
            selectedColor={selectedColor} setSelectedColor={setSelectedColor}
            hasReward={hasReward} setHasReward={setHasReward}
            setSelectedPet={setSelectedPet}
            setDetailsDialogOpen={setDetailsDialogOpen}
            setView={setView}
            stopKeyPropagation={stopKeyPropagation}
            setHowItWorksDialogOpen={setHowItWorksDialogOpen}
          />
        ) : (
          <LostPetsFormView
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            setView={setView}
            formData={formData}
            setFormData={setFormData}
            formErrors={formErrors}
            setFormErrors={setFormErrors}
            uploadedImages={uploadedImages}
            setUploadedImages={setUploadedImages}
            handleImageUpload={handleImageUpload}
            removeImage={removeImage}
            handleNext={handleNext}
          />
        )}

        {/*pet details dialog*/}
        <Dialog 
          open={detailsDialogOpen} 
          onClose={() => setDetailsDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          {selectedPet && (
            <>
              <Box sx={{ position: 'relative', height: 400, bgcolor: '#eee' }}>
                <Box
                  component="img"
                  src={selectedPet.img}
                  alt={selectedPet.name}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
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
                {selectedPet.urgent && (
                  <Chip
                    icon={<WarningIcon />}
                    label="ΕΠΕΙΓΟΝ"
                    color="error"
                    sx={{
                      position: 'absolute',
                      top: 16,
                      left: 16,
                      fontWeight: 800,
                      fontSize: '0.8rem'
                    }}
                  />
                )}
              </Box>
              <DialogContent sx={{ p: 4 }}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h4" fontWeight="bold" gutterBottom>
                    {selectedPet.name}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                    <Chip label={selectedPet.type} size="small" color="primary" />
                    <Chip label={selectedPet.breed} size="small" variant="outlined" />
                    <Chip label={selectedPet.gender} size="small" variant="outlined" />
                    <Chip label={selectedPet.age} size="small" variant="outlined" />
                  </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <CalendarMonthIcon color="action" />
                      <Box>
                        <Typography variant="caption" color="text.secondary">Ημερομηνία</Typography>
                        <Typography variant="body1" fontWeight={600}>{selectedPet.date}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <LocationOnIcon color="action" />
                      <Box>
                        <Typography variant="caption" color="text.secondary">Τοποθεσία</Typography>
                        <Typography variant="body1" fontWeight={600}>{selectedPet.location}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <PetsIcon color="action" />
                      <Box>
                        <Typography variant="caption" color="text.secondary">Χρώμα</Typography>
                        <Typography variant="body1" fontWeight={600}>{selectedPet.color}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <VisibilityIcon color="action" />
                      <Box>
                        <Typography variant="caption" color="text.secondary">Προβολές</Typography>
                        <Typography variant="body1" fontWeight={600}>{selectedPet.views}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>

                {selectedPet.lat && selectedPet.lng && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                      Σημείο στον Χάρτη
                    </Typography>
                    <Box sx={{ height: 220, borderRadius: 2, overflow: 'hidden', mb: 1 }}>
                      <iframe
                        title="map-embed-preview"
                        src={buildOsmEmbedSrc(selectedPet.lat, selectedPet.lng)}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      Συντεταγμένες: {selectedPet.lat.toFixed(5)}, {selectedPet.lng.toFixed(5)}
                    </Typography>
                  </Box>
                )}

                {selectedPet.reward && (
                  <Alert 
                    icon={false}
                    severity="warning" 
                    sx={{ 
                      mt: 3, 
                      background: 'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)',
                      border: '2px solid #FFA726',
                      fontWeight: 700
                    }}
                  >
                    💰 Αμοιβή: {selectedPet.reward}
                  </Alert>
                )}

                <Divider sx={{ my: 3 }} />

                <Box>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Περιγραφή
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                    {selectedPet.description}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                  <Button 
                    variant="contained" 
                    fullWidth 
                    size="large"
                    startIcon={<ShareIcon />}
                    sx={{ borderRadius: 3 }}
                  >
                    Κοινοποίηση
                  </Button>
                  <Button 
                    variant="outlined" 
                    fullWidth 
                    size="large"
                    startIcon={<InfoIcon />}
                    sx={{ borderRadius: 3 }}
                  >
                    Επικοινωνία
                  </Button>
                </Box>
              </DialogContent>
            </>
          )}
        </Dialog>

        {/*success dialog*/}
        <Dialog open={openSuccess} onClose={() => { setOpenSuccess(false); setView('search'); setActiveStep(0); }}>
          <DialogContent sx={{ textAlign: 'center', p: 5 }}>
            <CheckCircleIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h5" fontWeight="bold">Επιτυχία!</Typography>
            <Typography sx={{ mb: 3 }}>Η αγγελία καταχωρήθηκε.</Typography>
            <Button variant="contained" onClick={() => { setOpenSuccess(false); setView('search'); setActiveStep(0); }}>OK</Button>
          </DialogContent>
        </Dialog>

        {/*how it works dialog*/}
        <Dialog open={howItWorksDialogOpen} onClose={() => setHowItWorksDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogContent sx={{ p: 4 }}>
            {/*Animated header area(lightweight animation instead of video) */}
            <Box sx={{
              mb: 2,
              p: 2,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #004d40 0%, #00695c 100%)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}>
              <Box sx={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                bgcolor: 'rgba(255,255,255,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: `${pulse} 2s infinite`
              }}>
                <PlayCircleOutlineIcon sx={{ fontSize: 32, color: 'white' }} />
              </Box>
              <Box>
                <Typography variant="h6" fontWeight={800}>Πώς Λειτουργεί η Αναζήτηση</Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>Γρήγορος οδηγός 4 βημάτων με ζωντανά παραδείγματα.</Typography>
              </Box>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Με 4 απλά βήματα καταχωρείτε αγγελία για το χαμένο κατοικίδιό σας.
              Η αγγελία δημοσιεύεται άμεσα στην αναζήτηση και μπορείτε να την ενημερώνετε οποιαδήποτε στιγμή.
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, borderLeft: '4px solid #00695c', display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  <Box sx={{ bgcolor: '#E0F2F1', color: '#00695c', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <NotificationsActiveIcon fontSize="small" />
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={700}>1) Δημιουργία Αγγελίας</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Πατήστε «Δήλωση Απώλειας», συμπληρώστε βασικά στοιχεία (όνομα, είδος, χρώμα/ράτσα), ανεβάστε καθαρές φωτογραφίες
                    και επιλέξτε την τελευταία γνωστή τοποθεσία στον χάρτη ή μέσω αναζήτησης διεύθυνσης.
                  </Typography>
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, borderLeft: '4px solid #FFA726', display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  <Box sx={{ bgcolor: '#FFF3E0', color: '#FB8C00', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <CloudUploadIcon fontSize="small" />
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={700}>2) Δημοσίευση & Ορατότητα</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Με την υποβολή, η αγγελία δημοσιεύεται άμεσα και είναι ορατή στη σελίδα αναζήτησης.
                    Μπορείτε να την επεξεργαστείτε ή να την ενημερώνετε όποτε χρειάζεται.
                  </Typography>
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, borderLeft: '4px solid #1976d2', display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  <Box sx={{ bgcolor: '#E3F2FD', color: '#1976d2', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <VisibilityIcon fontSize="small" />
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={700}>3) Ενημερώσεις & Εξελίξεις</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Ενημερώστε την αγγελία με νέες φωτογραφίες, περιγραφή ή σημείο στον χάρτη όταν έχετε νεότερα
                    (π.χ. τελευταία θεάση). Έτσι αυξάνονται οι πιθανότητες εντοπισμού.
                  </Typography>
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, borderLeft: '4px solid #2E7D32', display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  <Box sx={{ bgcolor: '#E8F5E9', color: '#2E7D32', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <InfoIcon fontSize="small" />
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={700}>4) Επικοινωνία & Κλείσιμο</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Όποιος έχει πληροφορίες επικοινωνεί μαζί σας μέσω των στοιχείων που δώσατε. Όταν το κατοικίδιο βρεθεί,
                    μαρκάρετε την αγγελία ως «Βρέθηκε» ή διαγράψτε την για να ενημερωθεί η κοινότητα.
                  </Typography>
                  </Box>
                </Paper>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />
            <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 1 }}>Χρήσιμες Συμβουλές</Typography>
            <Box component="ul" sx={{ pl: 3, m: 0, color: 'text.secondary' }}>
              <li>Ανεβάστε καθαρές φωτογραφίες που δείχνουν διακριτικά σημάδια (κολάρο, σημάδια, τρίχωμα).</li>
              <li>Προσθέστε σαφή περιγραφή και τελευταία θεάση με όσο πιο ακριβή τοποθεσία γίνεται.</li>
              <li>Μην κοινοποιείτε ευαίσθητα προσωπικά δεδομένα. Κανονίστε συναντήσεις σε δημόσιο χώρο.</li>
              <li>Κοινοποιήστε την αγγελία στα κοινωνικά δίκτυα και σε τοπικές ομάδες.</li>
              <li>Αν βρεθεί, ενημερώστε άμεσα την αγγελία για να αποφύγετε περιττές κλήσεις.</li>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 3 }}>
              <Button variant="text" onClick={() => setHowItWorksDialogOpen(false)}>Κλείσιμο</Button>
              <Button variant="contained" onClick={() => { setHowItWorksDialogOpen(false); setView('form'); }}>Ξεκινήστε</Button>
            </Box>
          </DialogContent>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
}