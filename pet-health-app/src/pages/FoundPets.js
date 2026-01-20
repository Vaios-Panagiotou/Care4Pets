import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Grid,
  Typography,
  TextField,
  Button,
  Alert,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Collapse,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  Grow,
  InputAdornment,
  IconButton,
  ToggleButtonGroup,
  ToggleButton,
  Chip,
  Zoom,
} from '@mui/material';
import { keyframes } from '@mui/material/styles';
import PetsIcon from '@mui/icons-material/Pets';
import UploadIcon from '@mui/icons-material/Upload';
import ScheduleIcon from '@mui/icons-material/Schedule';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import InfoIcon from '@mui/icons-material/Info';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import DashboardSidebar from '../components/DashboardSidebar';
import { useAuth } from '../context/AuthContext';
import { foundPetsAPI } from '../services/api';



const FOUND_PETS = [
  {
    id: 'fp-1',
    type: 'Σκύλος',
    description: 'Μικρόσωμος καφέ σκύλος με λουράκι. Ήρεμος και φιλικός.',
    location: 'Κυψέλη, Αθήνα',
    foundAt: '2026-01-12T18:20',
    hasOwner: true,
    images: ['https://images.unsplash.com/photo-1505628346881-b72b27e84530?auto=format&fit=crop&w=800&q=80'],
    createdAt: '2026-01-12T18:40:00.000Z',
    isMock: true,
  },
  {
    id: 'fp-2',
    type: 'Γάτα',
    description: 'Ασπρόμαυρη γάτα, φοβισμένη, χωρίς κολάρο.',
    location: 'Περιστέρι',
    foundAt: '2026-01-10T09:10',
    hasOwner: false,
    images: ['https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80'],
    createdAt: '2026-01-10T09:20:00.000Z',
    isMock: true,
  },
];

const formatDate = (value) => {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString('el-GR', { day: '2-digit', month: 'short', year: 'numeric' });
};

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
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
  const d = 0.02;
  const left = (lng - d).toFixed(6);
  const right = (lng + d).toFixed(6);
  const top = (lat + d).toFixed(6);
  const bottom = (lat - d).toFixed(6);
  return `https://www.openstreetmap.org/export/embed.html?bbox=${left}%2C${bottom}%2C${right}%2C${top}&layer=mapnik&marker=${lat}%2C${lng}`;
}

function SimpleMapEmbed({ value, onChange, onLocationChange }) {
  const [query, setQuery] = useState('');
  const lat = value?.lat ?? 37.9838;
  const lng = value?.lng ?? 23.7275;
  const src = buildOsmEmbedSrc(lat, lng);

  const searchPlace = async () => {
    if (!query.trim()) return;
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&accept-language=el&q=${encodeURIComponent(query)}`);
      const results = await res.json();
      if (results && results[0]) {
        const { lat, lon, display_name } = results[0];
        const coords = { lat: parseFloat(lat), lng: parseFloat(lon) };
        onChange?.(coords);
        onLocationChange?.(display_name || query);
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
      <Box sx={{ height: 300, borderRadius: 20, overflow: 'hidden' }}>
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
        <Typography variant="caption" color="text.secondary">
          Συντεταγμένες: {value.lat.toFixed(5)}, {value.lng.toFixed(5)}
        </Typography>
      )}
    </Box>
  );
}

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
      if (progress < 1) animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, shouldStart]);

  return count;
};

const StatsBar = ({ total, withOwner }) => {
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
        borderRadius: 20,
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
          animation: `${shimmer} 3s infinite`,
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

export default function FoundPets() {
  const navigate = useNavigate();
  const location = useLocation();
  const [view, setView] = useState('search');
  const [howItWorksDialogOpen, setHowItWorksDialogOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const adType = 'found';
  const [form, setForm] = useState({
    type: '',
    description: '',
    foundLocation: '',
    foundAt: '',
    hasOwner: false,
    foundCoords: null,
  });
  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [hasOwnerOnly, setHasOwnerOnly] = useState(false);

  const [userFoundPets, setUserFoundPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const descriptionLimit = 60;
  const { user } = useAuth();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('view') === 'form') {
      setView('form');
    } else {
      setView('search');
    }
  }, [location.search]);

  useEffect(() => {
    const loadFoundPets = async () => {
      try {
        const data = await foundPetsAPI.getAll();
        setUserFoundPets(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
        setUserFoundPets([]);
      }
    };
    loadFoundPets();
  }, []);

  const allFoundPets = useMemo(() => [...FOUND_PETS, ...userFoundPets], [userFoundPets]);
  const stats = useMemo(() => {
    const total = allFoundPets.length;
    const withOwner = allFoundPets.filter((pet) => !!pet.hasOwner).length;
    return { total, withOwner };
  }, [allFoundPets]);

  const filteredPets = useMemo(() => {
    let filtered = [...allFoundPets];

    if (searchQuery) {
      filtered = filtered.filter((pet) =>
        `${pet.type} ${pet.description} ${pet.location}`.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedType) {
      filtered = filtered.filter((pet) => pet.type === selectedType);
    }

    if (selectedLocation) {
      filtered = filtered.filter((pet) => String(pet.location || '').toLowerCase().includes(selectedLocation.toLowerCase()));
    }

    if (hasOwnerOnly) {
      filtered = filtered.filter((pet) => !!pet.hasOwner);
    }

    switch (sortBy) {
      case 'date':
      default:
        filtered.sort((a, b) => new Date(b.foundAt || b.createdAt) - new Date(a.foundAt || a.createdAt));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.foundAt || a.createdAt) - new Date(b.foundAt || b.createdAt));
        break;
    }

    return filtered;
  }, [allFoundPets, searchQuery, selectedType, selectedLocation, sortBy, hasOwnerOnly]);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    const readers = files.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });
    try {
      const dataUrls = await Promise.all(readers);
      setImages((prev) => [...prev, ...dataUrls]);
    } catch (err) {
      console.error(err);
    }
  };

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
      handleImageUpload({ target: { files: e.dataTransfer.files } });
    }
  };

  const validate = () => {
    if (!form.type) return 'Επιλέξτε είδος.';
    if (!form.description) return 'Συμπληρώστε μια σύντομη περιγραφή.';
    if (!form.foundLocation) return 'Συμπληρώστε την τοποθεσία.';
    if (!form.foundAt) return 'Συμπληρώστε ημερομηνία.';
    if (!images.length) return 'Ανεβάστε τουλάχιστον μία φωτογραφία.';
    return '';
  };

  const handleSubmit = async () => {
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const payload = {
        type: form.type,
        description: form.description,
        location: form.foundLocation,
        foundAt: form.foundAt,
        hasOwner: !!form.hasOwner,
        images,
        coords: form.foundCoords || null,
        createdAt: new Date().toISOString(),
      };
      const created = await foundPetsAPI.create(payload);
      setUserFoundPets((prev) => [created, ...prev]);
      setSuccess(true);
      setForm({ type: '', description: '', foundLocation: '', foundAt: '', hasOwner: false });
      setImages([]);
      setTimeout(() => navigate('/found-pets'), 1200);
    } catch (err) {
      console.error(err);
      setError('Παρουσιάστηκε σφάλμα κατά την υποβολή.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fbfbfb', pb: 8 }}>
      <Navbar />
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
        overflow: 'hidden',
      }}>
        <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(21,101,192,0.85) 0%, rgba(38,50,56,0.9) 100%)', borderRadius: '0 0 60px 60px' }} />
        <Box sx={{ position: 'relative', zIndex: 2, textAlign: 'center', px: 2 }}>
          <PetsIcon sx={{ fontSize: 64, color: '#FFA726', mb: 1 }} />
          <Typography variant="h3" sx={{ color: 'white', fontWeight: 900, mb: 1, textShadow: '0 4px 12px rgba(0,0,0,0.3)', fontSize: { xs: '2rem', md: '3rem' } }}>
            Ευρεθέντα Κατοικίδια
          </Typography>
          <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)', mb: 4, fontWeight: 400 }}>
            Δήλωση από τρίτο για ζώο που εντοπίστηκε
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', mt: 3 }}>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              startIcon={<NotificationsActiveIcon />}
              onClick={() => navigate('/found-pets?view=form')}
              sx={{ borderRadius: '50px', px: 4, py: 1.5 }}
            >
              Δήλωση Εύρεσης
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<InfoIcon />}
              onClick={() => setHowItWorksDialogOpen(true)}
              sx={{ borderRadius: '50px', px: 4, py: 1.5, color: 'white', borderColor: 'white', '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' } }}
            >
              Πώς Λειτουργεί
            </Button>
          </Box>
        </Box>
      </Box>

      {view === 'search' ? (
        <Box sx={{ display: 'flex', gap: 3, px: 2, mb: 4, alignItems: 'flex-start' }}>
        {user && (
        <Box sx={{ width: { xs: '100%', md: 280 }, flexShrink: 0 }}>
          <DashboardSidebar />
        </Box>
        )}
          <Box sx={{ flexGrow: 1 }}>
            <Container maxWidth="xl" sx={{ px: 2 }}>
              <StatsBar total={stats.total} withOwner={stats.withOwner} />
          <Paper sx={{ p: 3, mb: 3, borderRadius: 20, boxShadow: 3, border: '1px solid', borderColor: 'primary.light', bgcolor: 'rgba(25,118,210,0.06)' }}>
            <Box sx={{ display: 'flex', alignItems: { xs: 'flex-start', md: 'center' }, justifyContent: 'space-between', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
              <Box>
                <Typography variant="h6" fontWeight={800} sx={{ mt: 0.5 }}>
                  Ευρεθέντα — Βοηθήστε να βρουν τον δρόμο σπίτι
                </Typography>
              </Box>
              <ToggleButtonGroup
                value={adType}
                exclusive
                
                sx={{
                  borderRadius: '999px',
                  overflow: 'hidden',
                  bgcolor: 'grey.100',
                  p: 0.5,
                  '& .MuiToggleButton-root': {
                    border: 0,
                    textTransform: 'none',
                    fontWeight: 700,
                    px: 3,
                    py: 1.2,
                    borderRadius: '999px',
                    color: 'text.secondary',
                  },
                  '& .MuiToggleButton-root.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: 'white',
                    boxShadow: '0 6px 14px rgba(25,118,210,0.35)',
                  },
                  '& .MuiToggleButton-root.Mui-selected:hover': {
                    bgcolor: 'primary.dark',
                  },
                }}
                onChange={(_, next) => { if (next === 'lost') navigate('/lost-pets'); }}
              >
                <ToggleButton value="lost">Απολεσθέντα</ToggleButton>
                <ToggleButton value="found">Ευρεθέντα</ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Paper>
          <Paper id="found-search-bar" sx={{ p: 3, mb: 4, borderRadius: 20, boxShadow: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder="Αναζήτηση είδους, περιγραφής, περιοχής..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '20px' } }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>,
                    endAdornment: searchQuery && (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={() => setSearchQuery('')}>
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                  <Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    displayEmpty
                    sx={{ '& .MuiOutlinedInput-notchedOutline': { borderRadius: '20px' } }}
                  >
                    <MenuItem value="date">Πιο Πρόσφατα</MenuItem>
                    <MenuItem value="oldest">Παλαιότερα</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <Button
                  fullWidth
                  variant={hasOwnerOnly ? 'contained' : 'outlined'}
                  startIcon={<CheckCircleIcon />}
                  onClick={() => setHasOwnerOnly(!hasOwnerOnly)}
                  sx={{ borderRadius: '20px' }}
                >
                  Έχει ιδιοκτήτη
                </Button>
              </Grid>
              <Grid item xs={12} md={2}>
                <Button
                  fullWidth
                  variant={filtersOpen ? 'contained' : 'outlined'}
                  startIcon={<TuneIcon />}
                  onClick={() => setFiltersOpen(!filtersOpen)}
                  sx={{ borderRadius: '20px' }}
                >
                  Φίλτρα
                </Button>
              </Grid>
            </Grid>
            <Collapse in={filtersOpen}>
              <Divider sx={{ my: 3 }} />
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Είδος Ζώου</InputLabel>
                    <Select label="Είδος Ζώου" value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                      <MenuItem value="">Όλα</MenuItem>
                      <MenuItem value="Σκύλος">Σκύλος</MenuItem>
                      <MenuItem value="Γάτα">Γάτα</MenuItem>
                      <MenuItem value="Άλλο">Άλλο</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label="Περιοχή"
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    InputProps={{ startAdornment: <InputAdornment position="start"><LocationOnIcon color="action" /></InputAdornment> }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => navigate('/found-pets?view=form')}
                    sx={{ borderRadius: '20px' }}
                  >
                    Δήλωση Εύρεσης
                  </Button>
                </Grid>
              </Grid>
            </Collapse>
          </Paper>

          <Typography variant="h5" fontWeight="bold" gutterBottom>
            {filteredPets.length} Ευρεθέντα Κατοικίδια
          </Typography>

          <Grid container spacing={3}>
            {filteredPets.length === 0 ? (
              <Grid item xs={12}>
                <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 4 }}>
                  <SearchIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">Δεν βρέθηκαν αποτελέσματα</Typography>
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
                          '& .pet-image': { transform: 'scale(1.1)' },
                          '& .pet-overlay': { opacity: 1 }
                        },
                        '&:active': { transform: 'translateY(-8px) scale(0.98)' }
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
                        <Box
                          component="img"
                          src={(pet.images && pet.images[0]) || pet.img || 'https://via.placeholder.com/600x400?text=Pet'}
                          alt={pet.name || pet.type || 'found-pet'}
                          className="pet-image"
                          sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            display: 'block',
                            transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
                          }}
                        />

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
                            zIndex: 1,
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <VisibilityIcon sx={{ fontSize: 16, color: 'white' }} />
                            <Typography variant="caption" sx={{ color: 'white', fontWeight: 600 }}>
                              {(pet.views ?? 0)} προβολές
                            </Typography>
                          </Box>
                        </Box>

                        {pet.hasOwner && (
                          <Chip
                            icon={<CheckCircleIcon />}
                            label="Έχει σημάδια ιδιοκτήτη"
                            size="small"
                            color="success"
                            sx={{
                              position: 'absolute',
                              top: 8,
                              left: 8,
                              zIndex: 2,
                              boxShadow: '0 2px 8px rgba(56, 142, 60, 0.4)',
                              '& .MuiChip-icon': { color: '#fff', ml: 0.5 }
                            }}
                          />
                        )}
                      </Box>

                      <Box sx={{ p: 2, bgcolor: 'white', borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}>
                        <Typography
                          variant="h6"
                          fontWeight="800"
                          sx={{ mb: 0.5, fontSize: '1rem', color: '#1a1a1a', letterSpacing: '-0.3px' }}
                        >
                          {pet.type || 'Άγνωστο ζώο'}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, transition: 'all 0.2s', '&:hover': { transform: 'translateX(2px)' } }}>
                          <PetsIcon sx={{ fontSize: 14, color: 'primary.main', transition: 'transform 0.2s' }} />
                          <Typography
                            variant="body2"
                            sx={{ color: 'text.secondary', fontWeight: 500, fontSize: '0.8rem' }}
                          >
                            {pet.description || 'Χωρίς περιγραφή'}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <LocationOnIcon sx={{ fontSize: 14, color: 'secondary.main' }} />
                          <Typography
                            variant="body2"
                            sx={{ color: 'text.secondary', fontSize: '0.8rem' }}
                          >
                            {pet.location || 'Άγνωστη περιοχή'}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <ScheduleIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                          <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                            {formatDate(pet.foundAt || pet.createdAt) || '—'}
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
        </Box>
      ) : (
        <Container maxWidth="lg" sx={{ px: 2, pb: 6 }}>
          <Paper sx={{ p: 3, borderRadius: 4, boxShadow: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/found-pets')}
                sx={{ borderRadius: '12px' }}
              >
                Πίσω στα ευρεθέντα
              </Button>
            </Box>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>Δήλωση Εύρεσης Κατοικιδίου</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Η δήλωση αφορά άγνωστο ζώο που βρέθηκε. Δεν δημιουργείται προφίλ κατοικιδίου.
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>Η δήλωση εύρεσης καταχωρίστηκε!</Alert>}

            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControl fullWidth sx={{ minWidth: 130 }}>
                      <InputLabel id="type-label">Είδος Ζώου</InputLabel>
                      <Select
                        labelId="type-label"
                        label="Είδος Ζώου"
                        value={form.type}
                        onChange={(e) => setForm({ ...form, type: e.target.value })}
                      >
                        <MenuItem value="" disabled>Επιλέξτε είδος</MenuItem>
                        <MenuItem value="Σκύλος">Σκύλος</MenuItem>
                        <MenuItem value="Γάτα">Γάτα</MenuItem>
                        <MenuItem value="Άλλο">Άλλο</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Ημερομηνία & Ώρα"
                      type="datetime-local"
                      InputLabelProps={{ shrink: true }}
                      value={form.foundAt}
                      onChange={(e) => setForm({ ...form, foundAt: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      minRows={4}
                      label="Περιγραφή"
                      placeholder="Χαρακτηριστικά, σημάδια, συμπεριφορά"
                      value={form.description}
                      inputProps={{ maxLength: descriptionLimit }}
                      helperText={`Χαρακτήρες: ${Math.max(0, descriptionLimit - (form.description?.length || 0))}/${descriptionLimit}`}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={form.hasOwner}
                          onChange={(e) => setForm({ ...form, hasOwner: e.target.checked })}
                        />
                      }
                      label="Το ζώο φαίνεται να έχει ιδιοκτήτη (κολάρο κ.λπ.)"
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} md={4}>
                <SimpleMapEmbed
                  value={form.foundCoords}
                  onChange={(coords) => setForm((prev) => ({ ...prev, foundCoords: coords }))}
                  onLocationChange={(text) => setForm((prev) => ({ ...prev, foundLocation: text }))}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper
                  component="label"
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    border: '2px dashed',
                    borderColor: isDragging ? 'primary.main' : 'grey.300',
                    bgcolor: isDragging ? 'action.hover' : '#fafafa',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 1.5,
                    '&:hover': { borderColor: 'primary.main', bgcolor: 'grey.50' },
                  }}
                >
                  <input hidden multiple type="file" accept="image/*" onChange={handleImageUpload} />
                  <Box sx={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    bgcolor: 'primary.50',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <UploadIcon sx={{ fontSize: 34, color: 'primary.main' }} />
                  </Box>
                  <Typography variant="subtitle1" fontWeight={700}>Σύρετε φωτογραφίες εδώ</Typography>
                  <Typography variant="body2" color="text.secondary">ή κάντε κλικ για επιλογή αρχείων</Typography>
                  <Chip label="JPG, PNG • Έως 5MB" size="small" variant="outlined" />
                </Paper>
                <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
                  {images.map((src, idx) => (
                    <Box key={idx} sx={{ width: 96, height: 96, borderRadius: 2, overflow: 'hidden', border: '1px solid #eee' }}>
                      <img alt={`found-${idx}`} src={src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </Box>
                  ))}
                </Box>
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
              <Button variant="contained" disabled={submitting} onClick={handleSubmit} sx={{ borderRadius: '999px' }}>Υποβολή Δήλωσης</Button>
              <Button variant="text" onClick={() => navigate('/found-pets')} sx={{ borderRadius: '999px' }}>Ακύρωση</Button>
            </Box>

            {submitting && <Typography variant="caption" sx={{ mt: 2, display: 'block' }}>Υποβολή…</Typography>}
          </Paper>
        </Container>
      )}

      <Dialog
        open={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        {selectedPet && (
          <>
            <Box sx={{ position: 'relative', height: 320, bgcolor: '#eee' }}>
              <Box
                component="img"
                src={(selectedPet.images && selectedPet.images[0]) || selectedPet.img || 'https://via.placeholder.com/800x500?text=Pet'}
                alt={selectedPet.name || selectedPet.type || 'found-pet'}
                sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
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
              {selectedPet.hasOwner && (
                <Chip
                  icon={<CheckCircleIcon />}
                  label="Έχει σημάδια ιδιοκτήτη"
                  color="success"
                  sx={{ position: 'absolute', top: 16, left: 16, fontWeight: 700 }}
                />
              )}
            </Box>

            <DialogContent sx={{ p: 3 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                {selectedPet.type || 'Ευρεθέν ζώο'}
              </Typography>
              <Typography variant="body1" color="text.primary" sx={{ mb: 2 }}>
                {selectedPet.description || 'Χωρίς περιγραφή.'}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOnIcon color="action" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">Τοποθεσία</Typography>
                      <Typography variant="body2" fontWeight={600}>{selectedPet.location || 'Άγνωστη περιοχή'}</Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ScheduleIcon color="action" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">Ημερομηνία</Typography>
                      <Typography variant="body2" fontWeight={600}>{formatDate(selectedPet.foundAt || selectedPet.createdAt) || '—'}</Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
          </>
        )}
      </Dialog>

      <Dialog open={howItWorksDialogOpen} onClose={() => setHowItWorksDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogContent>
          <Typography variant="h6" fontWeight={800} sx={{ mb: 1 }}>Πώς Λειτουργεί η Δήλωση Εύρεσης</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Με 3 απλά βήματα καταχωρείτε μια δήλωση για ζώο που εντοπίστηκε. Η δήλωση εμφανίζεται άμεσα στη λίστα αναζήτησης.
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, borderLeft: '4px solid #FFA726', display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <Box sx={{ bgcolor: '#FFF3E0', color: '#FB8C00', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <NotificationsActiveIcon fontSize="small" />
                </Box>
                <Box>
                  <Typography variant="subtitle1" fontWeight={700}>1) Δήλωση</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Συμπληρώστε είδος, περιγραφή και τοποθεσία όπου βρέθηκε το ζώο.
                  </Typography>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, borderLeft: '4px solid #1976d2', display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <Box sx={{ bgcolor: '#E3F2FD', color: '#1976d2', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <UploadIcon fontSize="small" />
                </Box>
                <Box>
                  <Typography variant="subtitle1" fontWeight={700}>2) Φωτογραφίες</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Ανεβάστε καθαρές εικόνες για γρήγορη αναγνώριση.
                  </Typography>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, borderLeft: '4px solid #2E7D32', display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <Box sx={{ bgcolor: '#E8F5E9', color: '#2E7D32', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <VisibilityIcon fontSize="small" />
                </Box>
                <Box>
                  <Typography variant="subtitle1" fontWeight={700}>3) Εμφάνιση</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Η δήλωση εμφανίζεται στη λίστα και βοηθάει τον ιδιοκτήτη να την εντοπίσει.
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button variant="text" onClick={() => setHowItWorksDialogOpen(false)}>Κλείσιμο</Button>
          <Button variant="contained" onClick={() => { setHowItWorksDialogOpen(false); setView('form'); }}>
            Ξεκινήστε
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
