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
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import InfoIcon from '@mui/icons-material/Info';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
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

  const [form, setForm] = useState({
    type: '',
    description: '',
    foundLocation: '',
    foundAt: '',
    hasOwner: false,
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
              onClick={() => document.getElementById('found-search-bar')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              sx={{ borderRadius: '50px', px: 4, py: 1.5, color: 'white', borderColor: 'white', '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' } }}
            >
              Πώς Λειτουργεί
            </Button>
          </Box>
        </Box>
      </Box>

      {view === 'search' ? (
        <Container maxWidth="xl" sx={{ px: 2 }}>
          <StatsBar total={stats.total} withOwner={stats.withOwner} />
          <Paper id="found-search-bar" sx={{ p: 3, mb: 4, borderRadius: 4, boxShadow: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={2}>
                <ToggleButtonGroup
                  value="found"
                  exclusive
                  fullWidth
                  sx={{ borderRadius: '999px', overflow: 'hidden' }}
                  onChange={(_, next) => { if (next === 'lost') navigate('/lost-pets'); }}
                >
                  <ToggleButton value="lost" sx={{ borderRadius: '999px' }}>Απολεσθέντα</ToggleButton>
                  <ToggleButton value="found" sx={{ borderRadius: '999px' }}>Ευρεθέντα</ToggleButton>
                </ToggleButtonGroup>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="Αναζήτηση είδους, περιγραφής, περιοχής..."
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
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                  <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} displayEmpty>
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
                  sx={{ borderRadius: '999px' }}
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
                  sx={{ borderRadius: '999px' }}
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
                    sx={{ borderRadius: '999px' }}
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
              filteredPets.map((pet) => (
                <Grid key={pet.id} item xs={12} sm={6} md={4}>
                  <Paper sx={{ borderRadius: 4, overflow: 'hidden', boxShadow: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ height: 200, bgcolor: '#eee' }}>
                      <Box
                        component="img"
                        src={(pet.images && pet.images[0]) || 'https://via.placeholder.com/600x400?text=Pet'}
                        alt="found-pet"
                        sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </Box>
                    <Box sx={{ p: 2, flexGrow: 1 }}>
                      <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                        {pet.type || 'Άγνωστο ζώο'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {pet.description}
                      </Typography>
                      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <LocationOnIcon fontSize="small" color="action" />
                        {pet.location || 'Άγνωστη περιοχή'}
                      </Typography>
                      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ScheduleIcon fontSize="small" color="action" />
                        {formatDate(pet.foundAt || pet.createdAt)}
                      </Typography>
                    </Box>
                    {pet.hasOwner && (
                      <Box sx={{ px: 2, pb: 2 }}>
                        <Chip color="success" size="small" label="Φαίνεται να έχει ιδιοκτήτη" />
                      </Box>
                    )}
                  </Paper>
                </Grid>
              ))
            )}
          </Grid>
        </Container>
      ) : (
        <Container maxWidth="lg" sx={{ px: 2, pb: 6 }}>
          <Paper sx={{ p: 3, borderRadius: 4 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>Δήλωση Εύρεσης Κατοικιδίου</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Η δήλωση αφορά άγνωστο ζώο που βρέθηκε. Δεν δημιουργείται προφίλ κατοικιδίου.
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>Η δήλωση εύρεσης καταχωρίστηκε!</Alert>}

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel id="type-label">Είδος Ζώου</InputLabel>
                  <Select labelId="type-label" label="Είδος Ζώου" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                    <MenuItem value="Σκύλος">Σκύλος</MenuItem>
                    <MenuItem value="Γάτα">Γάτα</MenuItem>
                    <MenuItem value="Άλλο">Άλλο</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
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
                  label="Τοποθεσία"
                  placeholder="Π.χ. Παγκράτι, Αθήνα"
                  value={form.foundLocation}
                  onChange={(e) => setForm({ ...form, foundLocation: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  minRows={3}
                  label="Περιγραφή"
                  placeholder="Χαρακτηριστικά, σημάδια, συμπεριφορά"
                  value={form.description}
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
              <Grid item xs={12}>
                <Button variant="outlined" component="label" startIcon={<UploadIcon />}>Ανέβασμα Φωτογραφίας
                  <input hidden multiple type="file" accept="image/*" onChange={handleImageUpload} />
                </Button>
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
    </Box>
  );
}
